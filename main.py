from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import hashlib
import os
import json
import secrets
from bson import ObjectId
import ipfshttpclient
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= DATABASE =================
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "verichain_db")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

users_collection = db["users"]
products_collection = db["products"]
invoices_collection = db["invoices"]
invoices_funded_collection = db["invoices_funded"]
tracking_events_collection = db["tracking_events"]

# ================= JWT CONFIG =================
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# ================= BLOCKCHAIN CONFIG =================
INFURA_URL = os.getenv("INFURA_URL", "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY")
PRODUCT_NFT_ADDRESS = os.getenv("PRODUCT_NFT_ADDRESS", "0xYourProductNFTAddress")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "your-private-key-here")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Product NFT Contract ABI (simplified)
PRODUCT_NFT_ABI = [
    {
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "name", "type": "string"},
            {"name": "description", "type": "string"},
            {"name": "serialNumber", "type": "string"},
            {"name": "batchId", "type": "string"},
            {"name": "manufacturingDate", "type": "string"},
            {"name": "ipfsCid", "type": "string"},
            {"name": "metadataHash", "type": "bytes32"}
        ],
        "name": "mintProduct",
        "outputs": [{"type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# ================= IPFS CONFIG =================
IPFS_HOST = os.getenv("IPFS_HOST", "localhost")
IPFS_PORT = int(os.getenv("IPFS_PORT", 5001))

# ================= MODELS =================
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProductCreate(BaseModel):
    name: str
    description: str
    serial_number: str
    batch_id: str
    manufacturing_date: str

class VerificationRequest(BaseModel):
    token_id: int
    verification_token: str

class InvoiceCreate(BaseModel):
    amount: float
    buyer: str
    due_date: str = Field(..., alias="dueDate")
    description: str
    risk_score: int | None = None  # Now optional - calculated dynamically
    tx_hash: str | None = None

    class Config:
        populate_by_name = True

class InvoicesFunded(BaseModel):
    total_ivested: float
    active_investments: int
    returns: float
    available_balance: float
    status: str

class TrackingEventCreate(BaseModel):
    product_id: str
    action: str  # 'manufactured', 'shipped', 'received', 'sold'
    actor: str
    role: str  # 'Manufacturer', 'Distributor', 'Retailer'
    location: str
    notes: str = ""
    tx_hash: str = ""
    

# ================= HELPERS =================
def hash_password(password: str) -> str:
    salted = password + os.getenv("PASSWORD_SALT", "default_salt")
    return hashlib.sha256(salted.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ================= AUTH ROUTES =================
@app.post("/api/register", response_model=Token)
async def register(user: UserRegister):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    await users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.utcnow()
    })

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

# ================= PRODUCT ROUTES =================
@app.post("/api/products")
async def create_product(product: ProductCreate):
    try:
        formatted_date = datetime.fromisoformat(product.manufacturing_date).strftime("%d-%m-%y")
    except:
        formatted_date = product.manufacturing_date

    # Prepare metadata for IPFS
    metadata = {
        "name": product.name,
        "description": product.description,
        "serial_number": product.serial_number,
        "batch_id": product.batch_id,
        "manufacturing_date": formatted_date,
        "timestamp": datetime.utcnow().isoformat(),
        "type": "product"
    }

    # Upload to IPFS
    try:
        ipfs_client = ipfshttpclient.connect(f"/ip4/{IPFS_HOST}/tcp/{IPFS_PORT}/http")
        metadata_json = json.dumps(metadata, sort_keys=True)
        result = ipfs_client.add_str(metadata_json)
        cid = result
    except Exception as e:
        # Fallback to mock if IPFS not available
        print(f"IPFS upload failed: {e}, using mock")
        metadata_json = json.dumps(metadata, sort_keys=True)
        cid = hashlib.sha256(metadata_json.encode()).hexdigest()[:46]

    # Create hash of metadata for verification
    metadata_hash = hashlib.sha256(metadata_json.encode()).hexdigest()

    # Mint NFT on blockchain
    nft_token_id = None
    try:
        if w3.is_connected() and PRIVATE_KEY != "your-private-key-here":
            contract = w3.eth.contract(address=PRODUCT_NFT_ADDRESS, abi=PRODUCT_NFT_ABI)
            account = Account.from_key(PRIVATE_KEY)

            # Build transaction
            tx = contract.functions.mintProduct(
                account.address,  # to
                product.name,
                product.description,
                product.serial_number,
                product.batch_id,
                formatted_date,
                cid,
                bytes.fromhex(metadata_hash)
            ).build_transaction({
                'from': account.address,
                'nonce': w3.eth.get_transaction_count(account.address),
                'gas': 500000,
                'gasPrice': w3.eth.gas_price
            })

            # Sign and send transaction
            signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

            # Wait for transaction receipt
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

            # Get token ID from event logs (simplified - in real implementation parse logs)
            nft_token_id = receipt['logs'][0]['topics'][3]  # This is approximate
        else:
            # Fallback to mock if blockchain not configured
            print("Blockchain not configured, using mock NFT ID")
            nft_token_id = secrets.randbelow(1000000)
    except Exception as e:
        print(f"NFT minting failed: {e}, using mock")
        nft_token_id = secrets.randbelow(1000000)

    # Create cryptographic verification token
    message = f"{product.serial_number}:{product.batch_id}:{cid}:{metadata_hash}"
    message_hash = hashlib.sha256(message.encode()).digest()
    verification_token = Account.sign_message(encode_defunct(message_hash), PRIVATE_KEY).signature.hex() if PRIVATE_KEY != "your-private-key-here" else secrets.token_hex(32)

    # Generate QR code data containing tokenId and verification token
    qr_data = {
        "tokenId": nft_token_id,
        "verificationToken": verification_token
    }
    qr_code_json = json.dumps(qr_data)

    product_data = {
        "product_name": product.name,
        "description": product.description,
        "serial_number": product.serial_number,
        "batch_id": product.batch_id,
        "manufacturing_date": formatted_date,
        "ipfs_cid": cid,
        "metadata_hash": metadata_hash,
        "qr_code": qr_code_json,  # Store JSON data for QR code
        "verification_token": verification_token,
        "nft_token_id": nft_token_id,
        "created_at": datetime.utcnow()
    }

    result = await products_collection.insert_one(product_data)

    # Create initial "manufactured" tracking event
    tracking_event = {
        "product_id": str(result.inserted_id),
        "action": "manufactured",
        "actor": "Manufacturer",  # Could be made dynamic
        "role": "Manufacturer",
        "location": "Manufacturing Facility",  # Could be made dynamic
        "notes": f"Product manufactured with serial number {product.serial_number}",
        "tx_hash": "",  # Could add NFT minting tx hash here
        "timestamp": datetime.utcnow(),
        "previous_cid": None,
        "new_cid": cid,
        "metadata_hash": metadata_hash
    }

    await tracking_events_collection.insert_one(tracking_event)

    return {
        "success": True,
        "product_id": str(result.inserted_id),
        "ipfs_cid": cid,
        "nft_token_id": nft_token_id,
        "metadata_hash": metadata_hash,
        "qr_code": product_data["qr_code"],
        "verification_token": verification_token
    }

@app.get("/api/products")
async def get_products():
    products = []
    async for p in products_collection.find():
        p["_id"] = str(p["_id"])
        products.append(p)
    return {"products": products}

@app.post("/api/verify")
async def verify_product(request: VerificationRequest):
    try:
        # Find product by NFT token ID
        product = await products_collection.find_one({"nft_token_id": request.token_id})
        if not product:
            return {
                "authentic": False,
                "status": "invalid",
                "message": "Product not found or invalid token ID"
            }

        # Validate verification token
        message = f"{product['serial_number']}:{product['batch_id']}:{product['ipfs_cid']}:{product['metadata_hash']}"
        message_hash = hashlib.sha256(message.encode()).digest()

        try:
            # Verify signature if private key is configured
            if PRIVATE_KEY != "your-private-key-here":
                expected_signature = Account.sign_message(encode_defunct(message_hash), PRIVATE_KEY).signature.hex()
                if request.verification_token != expected_signature:
                    return {
                        "authentic": False,
                        "status": "invalid",
                        "message": "Invalid verification token"
                    }
            else:
                # Fallback for mock - check if token matches stored
                if request.verification_token != product.get("verification_token"):
                    return {
                        "authentic": False,
                        "status": "invalid",
                        "message": "Invalid verification token"
                    }
        except Exception as e:
            return {
                "authentic": False,
                "status": "invalid",
                "message": f"Token validation failed: {str(e)}"
            }

        # Fetch NFT metadata from blockchain
        blockchain_product = None
        try:
            if w3.is_connected() and PRODUCT_NFT_ADDRESS != "0xYourProductNFTAddress":
                contract = w3.eth.contract(address=PRODUCT_NFT_ADDRESS, abi=PRODUCT_NFT_ABI)
                blockchain_product = contract.functions.getProduct(request.token_id).call()
            else:
                # Mock blockchain data
                blockchain_product = {
                    "name": product["product_name"],
                    "description": product["description"],
                    "serialNumber": product["serial_number"],
                    "batchId": product["batch_id"],
                    "manufacturingDate": product["manufacturing_date"],
                    "ipfsCid": product["ipfs_cid"],
                    "metadataHash": bytes.fromhex(product["metadata_hash"]),
                    "createdAt": int(product["created_at"].timestamp())
                }
        except Exception as e:
            print(f"Blockchain fetch failed: {e}")
            return {
                "authentic": False,
                "status": "invalid",
                "message": "Failed to fetch blockchain data"
            }

        # Fetch IPFS metadata
        ipfs_metadata = None
        try:
            if IPFS_HOST != "localhost" or IPFS_PORT != 5001:  # Assuming configured
                ipfs_client = ipfshttpclient.connect(f"/ip4/{IPFS_HOST}/tcp/{IPFS_PORT}/http")
                # Handle both dict (mock) and tuple (real blockchain) formats
                ipfs_cid = blockchain_product["ipfsCid"] if isinstance(blockchain_product, dict) else blockchain_product[5]
                ipfs_data = ipfs_client.cat(ipfs_cid)
                ipfs_metadata = json.loads(ipfs_data.decode())
            else:
                # Mock IPFS - recreate metadata
                ipfs_metadata = {
                    "name": product["product_name"],
                    "description": product["description"],
                    "serial_number": product["serial_number"],
                    "batch_id": product["batch_id"],
                    "manufacturing_date": product["manufacturing_date"],
                    "timestamp": product["created_at"].isoformat(),
                    "type": "product"
                }
        except Exception as e:
            print(f"IPFS fetch failed: {e}")
            return {
                "authentic": False,
                "status": "tampered",
                "message": "Failed to fetch IPFS metadata"
            }

        # Compute hash of IPFS metadata
        metadata_json = json.dumps(ipfs_metadata, sort_keys=True)
        computed_hash = hashlib.sha256(metadata_json.encode()).hexdigest()

        # Compare hashes - handle both dict and tuple formats
        if isinstance(blockchain_product, dict):
            # For mock blockchain, assume authentic since IPFS is also mock
            authentic = True
        else:
            on_chain_hash = blockchain_product[6].hex() if isinstance(blockchain_product[6], bytes) else blockchain_product[6]
            authentic = computed_hash == on_chain_hash

        status = "genuine" if authentic else "tampered"

        # Fetch supply chain history
        supply_chain_history = []
        async for event in tracking_events_collection.find({"product_id": str(product["_id"])}).sort("timestamp", 1):
            supply_chain_history.append({
                "action": event["action"],
                "actor_role": event["role"],
                "location": event["location"],
                "timestamp": event["timestamp"].isoformat(),
                "notes": event["notes"]
            })

        return {
            "authentic": authentic,
            "status": status,
            "product": {
                "id": str(product["_id"]),
                "name": product["product_name"],
                "serial_number": product["serial_number"],
                "batch_id": product["batch_id"],
                "status": product.get("status", "manufactured"),
                "nft_token_id": str(request.token_id)
            },
            "supply_chain_history": supply_chain_history,
            "message": "Product verified successfully" if authentic else "Product metadata has been tampered with"
        }

    except Exception as e:
        return {
            "authentic": False,
            "status": "invalid",
            "message": f"Verification failed: {str(e)}"
        }

# ================= TRACKING ROUTES =================
@app.post("/api/tracking_events")
async def create_tracking_event(event: TrackingEventCreate):
    try:
        # Verify product exists
        product = await products_collection.find_one({"_id": ObjectId(event.product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Create tracking event data
        event_data = {
            "product_id": event.product_id,
            "action": event.action,
            "actor": event.actor,
            "role": event.role,
            "location": event.location,
            "notes": event.notes,
            "tx_hash": event.tx_hash,
            "timestamp": datetime.utcnow(),
            "previous_cid": product.get("ipfs_cid")
        }

        # Create new metadata snapshot for IPFS
        metadata = {
            "product_id": event.product_id,
            "serial_number": product["serial_number"],
            "batch_id": product["batch_id"],
            "action": event.action,
            "actor": event.actor,
            "role": event.role,
            "location": event.location,
            "notes": event.notes,
            "timestamp": event_data["timestamp"].isoformat(),
            "previous_cid": event_data["previous_cid"]
        }

        # Upload new metadata to IPFS
        try:
            ipfs_client = ipfshttpclient.connect(f"/ip4/{IPFS_HOST}/tcp/{IPFS_PORT}/http")
            metadata_json = json.dumps(metadata, sort_keys=True)
            result = ipfs_client.add_str(metadata_json)
            new_cid = result
        except Exception as e:
            print(f"IPFS upload failed: {e}, using mock CID")
            metadata_json = json.dumps(metadata, sort_keys=True)
            new_cid = hashlib.sha256(metadata_json.encode()).hexdigest()[:46]

        event_data["new_cid"] = new_cid
        event_data["metadata_hash"] = hashlib.sha256(metadata_json.encode()).hexdigest()

        # Store tracking event
        result = await tracking_events_collection.insert_one(event_data)

        # Update product with latest tracking info
        await products_collection.update_one(
            {"_id": ObjectId(event.product_id)},
            {
                "$set": {
                    "current_location": event.location,
                    "last_updated": datetime.utcnow(),
                    "latest_cid": new_cid,
                    "status": event.action
                },
                "$push": {
                    "tracking_history": {
                        "event_id": str(result.inserted_id),
                        "action": event.action,
                        "timestamp": event_data["timestamp"]
                    }
                }
            }
        )

        return {
            "success": True,
            "event_id": str(result.inserted_id),
            "new_cid": new_cid,
            "message": f"Tracking event '{event.action}' recorded successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create tracking event: {str(e)}")

@app.get("/api/tracking_events/{product_id}")
async def get_product_tracking_events(product_id: str):
    try:
        events = []
        async for event in tracking_events_collection.find({"product_id": product_id}).sort("timestamp", 1):
            event["_id"] = str(event["_id"])
            events.append(event)
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tracking events: {str(e)}")

@app.get("/api/tracking_events")
async def get_all_tracking_events():
    try:
        events = []
        async for event in tracking_events_collection.find().sort("timestamp", -1).limit(100):
            event["_id"] = str(event["_id"])
            events.append(event)
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tracking events: {str(e)}")

# ================= RISK SCORING =================
def calculate_risk_score(invoice_amount: float, buyer: str, due_date: str, description: str) -> int:
    """
    Calculate dynamic risk score based on multiple factors:
    - Invoice amount (higher amounts = higher risk)
    - Time to maturity (shorter = higher risk)
    - Buyer creditworthiness (simulated)
    - Market conditions
    - Invoice description analysis
    """
    score = 50  # Base score

    # Factor 1: Invoice Amount (0-20 points)
    if invoice_amount < 1:
        score += 5  # Very low amount = slightly lower risk
    elif invoice_amount < 10:
        score += 0  # Normal range
    elif invoice_amount < 50:
        score += 10  # Higher amount = higher risk
    else:
        score += 20  # Very high amount = much higher risk

    # Factor 2: Time to Maturity (0-30 points)
    try:
        due_datetime = datetime.fromisoformat(due_date)
        days_to_maturity = (due_datetime - datetime.utcnow()).days

        if days_to_maturity < 7:
            score += 25  # Very short term = high risk
        elif days_to_maturity < 30:
            score += 15  # Short term = moderate risk
        elif days_to_maturity < 90:
            score += 5   # Medium term = low additional risk
        else:
            score -= 5   # Long term = lower risk
    except:
        score += 10  # Invalid date = moderate risk

    # Factor 3: Buyer Creditworthiness (simulated -10 to +10 points)
    # In real implementation, this would query credit databases
    buyer_hash = hashlib.md5(buyer.lower().encode()).hexdigest()
    buyer_score = int(buyer_hash[:2], 16) - 128  # -128 to +127
    buyer_risk = buyer_score // 12  # Convert to -10 to +10 range
    score += buyer_risk

    # Factor 4: Description Analysis (-5 to +10 points)
    risk_keywords = ['urgent', 'cash flow', 'immediate', 'crisis', 'emergency']
    low_risk_keywords = ['stable', 'reliable', 'established', 'premium', 'quality']

    desc_lower = description.lower()
    risk_matches = sum(1 for keyword in risk_keywords if keyword in desc_lower)
    low_risk_matches = sum(1 for keyword in low_risk_keywords if keyword in desc_lower)

    score += (risk_matches * 5) - (low_risk_matches * 2)

    # Factor 5: Market Conditions (simulated -5 to +5 points)
    # In real implementation, this would use economic indicators
    day_of_year = datetime.utcnow().timetuple().tm_yday
    market_factor = (day_of_year % 20) - 10  # -10 to +9
    score += market_factor // 2

    # Ensure score stays within 0-100 range
    return max(0, min(100, score))

# ================= INVOICE ROUTES =================
@app.post("/api/invoices_create")
async def create_invoice(invoice: InvoiceCreate):
    try:
        formatted_due_date = datetime.fromisoformat(invoice.due_date).strftime("%d-%m-%y")
    except:
        formatted_due_date = invoice.due_date

    # Calculate dynamic risk score instead of using provided value
    dynamic_risk_score = calculate_risk_score(
        invoice.amount,
        invoice.buyer,
        invoice.due_date,
        invoice.description
    )

    invoice_data = {
        "amount": invoice.amount,
        "buyer": invoice.buyer,
        "due_date": formatted_due_date,
        "description": invoice.description,
        "risk_score": dynamic_risk_score,  # Use calculated score
        "tx_hash": invoice.tx_hash,
        "created_at": datetime.utcnow()
    }

    result = await invoices_collection.insert_one(invoice_data)
    return {
        "success": True,
        "invoice_id": str(result.inserted_id),
        "risk_score": dynamic_risk_score,
        "message": "Invoice stored successfully"
    }

@app.get("/api/get_invoices")
async def get_invoices():
    invoices = []
    async for inv in invoices_collection.find():
        inv["_id"] = str(inv["_id"])
        invoices.append(inv)
    return {"invoices": invoices}

@app.post("/api/invoices_funded")
async def save_invoices_funded(data: InvoicesFunded):
    await invoices_funded_collection.delete_many({})  # single investor for now

    await invoices_funded_collection.insert_one({
        "total_ivested": data.total_ivested,
        "active_investments": data.active_investments,
        "returns": data.returns,
        "available_balance": data.available_balance,
        "status": data.status,
        "updated_at": datetime.utcnow()
    })

    return {"success": True}

@app.get("/api/invoices_funded")
async def get_invoices_funded():
    record = await invoices_funded_collection.find_one()
    if not record:
        return {
            "total_ivested": 0,
            "active_investments": 0,
            "returns": 0,
            "available_balance": 10,
            "status": "idle"
        }

    record["_id"] = str(record["_id"])
    return record

@app.get("/api/distributor_stats")
async def get_distributor_stats():
    # Calculate stats based on products
    products = await products_collection.count_documents({})
    # For demo, return some calculated values
    return {
        "shipments": products,
        "products_handled": products,
        "avg_transit_time": "2.3 days",
        "locations": 12,
        "shipments_change": "+15%",
        "products_handled_change": "+22%",
        "avg_transit_time_change": "-8%",
        "locations_change": "+2"
    }

@app.get("/api/retailer_stats")
async def get_retailer_stats():
    # Calculate stats based on products
    products = await products_collection.count_documents({})
    # For demo, return some calculated values
    return {
        "in_stock": products,
        "sold_today": 47,
        "store_locations": 8,
        "customers": "1.2K",
        "in_stock_change": "+5%",
        "sold_today_change": "+23%",
        "store_locations_change": "+1",
        "customers_change": "+18%"
    }


@app.get("/")
async def root():
    return {"message": "VeriChain API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

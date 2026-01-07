#!/usr/bin/env python3
"""
Deployment script for ProductNFT smart contract
Run this script to deploy the contract to Polygon network
"""

import json
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
INFURA_URL = os.getenv("INFURA_URL", "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "your-private-key-here")

# Contract details
CONTRACT_NAME = "ProductNFT"
CONTRACT_PATH = "../contracts/ProductNFT.sol"

def compile_contract():
    """Compile the Solidity contract using solc"""
    try:
        from solcx import compile_source, install_solc
    except ImportError:
        print("Installing solcx...")
        os.system("pip install py-solc-x")
        from solcx import compile_source, install_solc

    # Install solc version if not available
    try:
        install_solc('0.8.19')
    except Exception as e:
        print(f"Warning: Could not install solc 0.8.19: {e}")

    # Read contract source
    with open(CONTRACT_PATH, 'r') as f:
        contract_source = f.read()

    # Compile contract
    compiled_sol = compile_source(
        contract_source,
        output_values=['abi', 'bin'],
        solc_version='0.8.19'
    )

    # Extract contract data
    contract_interface = compiled_sol[f'<stdin>:{CONTRACT_NAME}']

    return {
        'abi': contract_interface['abi'],
        'bytecode': contract_interface['bin']
    }

def deploy_contract():
    """Deploy the contract to Polygon network"""

    if PRIVATE_KEY == "your-private-key-here":
        print("ERROR: Please set your PRIVATE_KEY in the .env file")
        return

    if "YOUR_INFURA_KEY" in INFURA_URL:
        print("ERROR: Please set your INFURA_URL with actual API key in .env file")
        return

    # Initialize Web3
    w3 = Web3(Web3.HTTPProvider(INFURA_URL))

    if not w3.is_connected():
        print("ERROR: Cannot connect to Ethereum network")
        return

    print("SUCCESS: Connected to Ethereum network")

    # Load account
    account = Account.from_key(PRIVATE_KEY)
    print(f"Address: {account.address}")

    # Check balance
    balance = w3.eth.get_balance(account.address)
    balance_eth = w3.from_wei(balance, 'ether')
    print(f"Balance: {balance_eth} ETH")

    if balance < w3.to_wei(0.01, 'ether'):
        print("ERROR: Insufficient balance. Need at least 0.01 ETH")
        return

    # Compile contract
    print("Compiling contract...")
    try:
        contract_data = compile_contract()
        print("SUCCESS: Contract compiled successfully")
    except Exception as e:
        print(f"ERROR: Contract compilation failed: {e}")
        return

    # Create contract instance
    contract = w3.eth.contract(
        abi=contract_data['abi'],
        bytecode=contract_data['bytecode']
    )

    # Build deployment transaction
    print("Building deployment transaction...")
    construct_txn = contract.constructor().build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 3000000,
        'gasPrice': w3.eth.gas_price
    })

    # Sign transaction
    print("Signing transaction...")
    signed_txn = w3.eth.account.sign_transaction(construct_txn, PRIVATE_KEY)

    # Send transaction
    print("Sending transaction...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print(f"Transaction hash: {tx_hash.hex()}")

    # Wait for transaction receipt
    print("Waiting for confirmation...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    if tx_receipt['status'] == 1:
        contract_address = tx_receipt['contractAddress']
        print("SUCCESS: Contract deployed successfully!")
        print(f"Contract address: {contract_address}")
        print(f"View on Etherscan: https://sepolia.etherscan.io/address/{contract_address}")

        # Update .env file
        update_env_file(contract_address)

        return contract_address
    else:
        print("ERROR: Contract deployment failed")
        return None

def update_env_file(contract_address):
    """Update the .env file with the deployed contract address"""
    env_path = '.env'

    # Read current .env
    with open(env_path, 'r') as f:
        lines = f.readlines()

    # Update or add PRODUCT_NFT_ADDRESS
    updated = False
    for i, line in enumerate(lines):
        if line.startswith('PRODUCT_NFT_ADDRESS='):
            lines[i] = f'PRODUCT_NFT_ADDRESS={contract_address}\n'
            updated = True
            break

    if not updated:
        lines.append(f'PRODUCT_NFT_ADDRESS={contract_address}\n')

    # Write back
    with open(env_path, 'w') as f:
        f.writelines(lines)

    print("Updated .env file with contract address")

if __name__ == "__main__":
    print("Deploying ProductNFT Contract to Ethereum Sepolia")
    print("=" * 50)

    contract_address = deploy_contract()

    if contract_address:
        print("\nSUCCESS: Deployment completed successfully!")
        print("Next steps:")
        print("1. Verify contract on Etherscan")
        print("2. Update frontend contracts.ts with the new address")
        print("3. Test the product creation flow")
    else:
        print("\nERROR: Deployment failed. Check the errors above.")
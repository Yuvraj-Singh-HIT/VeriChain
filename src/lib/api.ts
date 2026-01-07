// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  register: `${API_BASE_URL}/api/register`,
  products: `${API_BASE_URL}/api/products`,
  verify: `${API_BASE_URL}/api/verify`,
  trackingEvents: `${API_BASE_URL}/api/tracking_events`,
  invoicesCreate: `${API_BASE_URL}/api/invoices_create`,
  getInvoices: `${API_BASE_URL}/api/get_invoices`,
  invoicesFunded: `${API_BASE_URL}/api/invoices_funded`,
  distributorStats: `${API_BASE_URL}/api/distributor_stats`,
  retailerStats: `${API_BASE_URL}/api/retailer_stats`,
};
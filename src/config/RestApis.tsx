import Ports from "../config/Ports";
import EndPoints from "../config/EndPoints";

const base_url = "http://"; // Base URL for the API
const host_local = "localhost:"; // Localhost for development
const host_live = ""; // Live server host (update with actual live server address)

const profile_development = "/dev"; // Profile for development environment
const profile_test = "/test"; // Profile for testing environment
const profile_production = "/prod"; // Profile for production environment

// Set the host depending on the environment
const host = host_local; // Change to host_live for live server or host_local for local development
const profile = profile_development; // Change to profile_test for testing or profile_production for production
const version = "/v1"; // API version (update as needed)

const apis = {
  // Construct the URL for the authentication service
  auth_service:
    base_url + host + Ports.auth + profile + version + EndPoints.auth, // Example: http://localhost:9090/dev/v1/auth
    stock_service_product_category: base_url + host + Ports.stock + profile + version + EndPoints.product_category,
    stock_service_order: base_url + host + Ports.stock + profile + version + EndPoints.order,
    stock_service_product: base_url + host + Ports.stock + profile + version + EndPoints.product,
    stock_service_stock_movement: base_url + host + Ports.stock + profile + version + EndPoints.stock_movement,
    stock_service_supplier: base_url + host + Ports.stock + profile + version + EndPoints.supplier,
    stock_service_ware_house: base_url + host + Ports.stock + profile + version + EndPoints.ware_house,
    crm_service_customer: base_url + host + Ports.crm + profile + version + EndPoints.customer,
  
};

export default apis;

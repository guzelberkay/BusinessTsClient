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
    //#region Stock
    stock_service_product_category: base_url + host + Ports.stock + profile + version + EndPoints.product_category,
    stock_service_order: base_url + host + Ports.stock + profile + version + EndPoints.order,
    stock_service_product: base_url + host + Ports.stock + profile + version + EndPoints.product,
    stock_service_stock_movement: base_url + host + Ports.stock + profile + version + EndPoints.stock_movement,
    stock_service_supplier: base_url + host + Ports.stock + profile + version + EndPoints.supplier,
    stock_service_ware_house: base_url + host + Ports.stock + profile + version + EndPoints.ware_house,
    stock_service_customer: base_url + host + Ports.stock + profile + version + EndPoints.customerStock,

    //#endregion Stock

    //#region CRM
    crm_service_customer: base_url + host + Ports.crm + profile + version + EndPoints.customer,
    crm_service_marketing_campaign: base_url + host + Ports.crm + profile + version + EndPoints.marketing_campaign,


    //#endregion CRM

    //#region User Management
    user_management_service_user: base_url + host + Ports.user_management + profile + version + EndPoints.user,
    user_management_service_role: base_url + host + Ports.user_management + profile + version + EndPoints.role,
    //#endregion User Management

    //#endregion HRM
    hrm_service_employee: base_url + host + Ports.hrm + profile + version + EndPoints.employee,

    //#region Notification
    notification_service: base_url + host + Ports.notification + profile + version + EndPoints.notifications,
    //#endregion Notification

    //#region Finance
    finance_service_budget: base_url + host + Ports.finance + profile + version + EndPoints.budget,
    finance_service_declaration: base_url + host + Ports.finance + profile + version + EndPoints.declaration,
    finance_service_expense: base_url + host + Ports.finance + profile + version + EndPoints.expense,
    finance_service_financial_report: base_url + host + Ports.finance + profile + version + EndPoints.financial_report,
    finance_service_income: base_url + host + Ports.finance + profile + version + EndPoints.income,
    finance_service_invoice: base_url + host + Ports.finance + profile + version + EndPoints.invoice,
    finance_service_tax: base_url + host + Ports.finance + profile + version + EndPoints.tax,
    //#endregion Finance
};

export default apis;

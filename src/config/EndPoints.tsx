import {subscriptionSlice} from "../store/feature";

// To hold the API endpoints for different services
const endpoints = {
  auth: "/auth", // Example: Endpoint for the authentication service
  //Stock Endpoints
  product_category: "/stock/product-category",
  order: "/stock/order",
  product: "/stock/product",
  stock_movement: "/stock/stock-movement",
  supplier: "/stock/supplier",
  ware_house: "/stock/ware-house",
  customerStock: "/stock/customer",
  //Organization Management Endpoints
  department: "/organization-management/department",
  OMemployee: "/organization-management/employee",
  OMmanager: "/organization-management/manager",
  // CRM Endpoints
  customer: "/crm/customer",
  marketing_campaign: "/crm/marketing-campaign",
  opportunity: "/crm/opportunity",
  sales_activity: "/crm/sales-activity",
  ticket: "/crm/ticket",
  user: "/usermanagement/user",
  role:"/usermanagement/role",
  employee: "/employee",
  notifications: "/notifications",
  // FAM Endpoints
  budget: "/finance/budget",
  declaration: "/finance/declaration",
  expense: "/finance/expense",
  financial_report: "/finance/financial-report",
  income: "/finance/income",
  invoice: "/finance/invoice",
  tax: "/finance/tax",
  // SUB Endpoints
  subscription: "/subscription",
  plan: "/plan",
  // FILE Endpoints
  file: "/file",
  project_management: "/project",
  // CalendarAndPlanning Endpoints
  event: "/event",
};

export default endpoints;
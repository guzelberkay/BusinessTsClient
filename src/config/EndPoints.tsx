import { subscriptionSlice } from "../store/feature";

// To hold the API endpoints for different services
const endpoints = {
  auth: "/auth", // Example: Endpoint for the authentication service
  product_category: "/stock/product-category",
  order: "/stock/order",
  product: "/stock/product",
  stock_movement: "/stock/stock-movement",
  supplier: "/stock/supplier",
  ware_house: "/stock/ware-house",
  customerStock: "/stock/customer",
  // CRM Endpoints
  customer: "/crm/customer",
  marketing_campaign: "/crm/marketing-campaign",
  opportunity: "/crm/opportunity",
  sales_activity:"/crm/sales-activity",
  ticket:"/crm/ticket",
  user: "/user",
  role:"/role",
  employee:"/employee",
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
};

export default endpoints;

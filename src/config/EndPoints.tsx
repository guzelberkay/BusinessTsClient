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
  customer: "/customer",
  user: "/user",
  role:"/role",
  employee:"/employee",
  notifications: "/notifications",

};

export default endpoints;

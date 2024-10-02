import { subscriptionSlice } from "../store/feature";

// To hold the port numbers for different services. Remove when not needed (gateway integration)
const ports = {
  auth: "9090", // Example: Port for the authentication service
  stock: "9099",
  user_management: "9097",
  hrm:"9096",
  crm: "9098",
  notification: "9095",
  subscription: "9091",
  finance: "9089",
  file: "9093",
};

export default ports;

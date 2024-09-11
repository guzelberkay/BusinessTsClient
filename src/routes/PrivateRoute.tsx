import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;
  roles?: string[]; // Optional array of roles
}
/**
 * PrivateRoute component that protects routes based on authentication and user roles.
 *
 * This component checks if a user is authenticated by verifying the presence of a token.
 * It also checks if the user's role is included in the allowed roles. If not authenticated
 * or if the role is not permitted, the user is redirected to the login page.
 *
 * @param {PrivateRouteProps} props - The component props.
 * @returns {React.ReactNode} - Returns the element if authenticated and authorized; otherwise, redirects to the login page.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
    
  /*
  // When backend is ready
  const token =  useAppSelector((state) => state.auth.token);
  const userRole = useAppSelector((state) => state.auth.role);
  */

  // For Testing
  const token =  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiaXNzIjoiQXNsYW4iLCJpYXQiOjE3MjU5NTg2MjMsImV4cCI6MjAyNTk2OTQyM30.X7gQPDMCRXdImsp1t0qdBQFh7t-vcJFW-MnCvVvbvrMjhvdDbI5i5ZIPUD15sxyfqPnXzReQfnDrPAUan1VFIg"
  const userRole = "ADMIN";
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.indexOf(userRole) === -1) {
    return <Navigate to="/login" replace />;
  }

  return element;
}


export default PrivateRoute;
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import PostAuthTemplate from "../components/core/PostAuthTemplate";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { delay } from "../util/delay";
import Loader from "../components/atoms/loader/Loader";
import SideBarNotifications from "../components/molecules/SideBarNotifications";
import PreAuthTemplate from "../components/core/PreAuthTemplate";
import Profile from "../pages/Profile";
import SupplierOrderPage from "../pages/StockService/Supplier/SupplierOrderPage.tsx";
import Subscription from "../pages/SubscriptionService/Subscription.tsx";
import CustomerPageStock from "../pages/StockService/Customer/CustomerPageStock.tsx";

/**
 * By wrapping our component imports with `lazy`, we ensure that these components are only loaded
 * when they are needed (e.g., when the user navigates to a specific route). This reduces the 
 * initial bundle size, leading to faster load times and improved performance for the application.
 */
export const VerifyAccount = lazy(() => import('../pages/VerifyAccount'));
export const ProductPage = lazy(() => import('../pages/StockService/Customer/ProductPage.tsx'));
export const AnalyticsDash = lazy(() => import('../pages/AnalyticsDash'));
export const CustomerPage = lazy(() => import('../pages/CRMService/CustomerPage.tsx'));
export const MarketingCampaignPage = lazy(() => import('../pages/CRMService/MarketingCampaignPage.tsx'));
export const ProductByMinStockLevelPage = lazy(() => import('../pages/StockService/Customer/ProductByMinStockLevelPage.tsx'));
export const HRMPage = lazy(() => import('../pages/HRMPage'));
export const BuyOrderPage = lazy(() => import('../pages/StockService/Customer/BuyOrderPage.tsx'));
export const SellOrderPage = lazy(() => import('../pages/StockService/Customer/SellOrderPage.tsx'));
export const SupplierPage = lazy(() => import('../pages/StockService/Customer/SupplierPage.tsx'));
export const WareHousePage = lazy(() => import('../pages/StockService/Customer/WareHousePage.tsx'));
export const ProductCategoryPage = lazy(() => import('../pages/StockService/Customer/ProductCategoryPage.tsx'));
export const StockMovementPage = lazy(() => import('../pages/StockService/Customer/StockMovementPage.tsx'));
export const DashBoard = lazy(() => import('../pages/DashBoard'));
export const Login = lazy(() => import('../pages/Login'));
export const ErrorPage = lazy(() => import('../pages/page404/ErrorPage'));
export const HomePage = lazy(() => import('../pages/HomePage'));
export const Register = lazy(() => import('../pages/Register'));
export const ResetPassword=lazy(() => import('../pages/ResetPassword'));

// For testing purposes (with delay) 
const TestPage = lazy(() => delay(1000).then(() => import('../pages/TestPage')));

/**
 * Router component that defines the application's route structure.
 *
 * This component uses React Router to manage different routes within the application.
 * It includes lazy loading for pages and wraps routes in a Suspense component for
 * loading states. Protected routes are handled with the PrivateRoute component.
 *
 * @returns {React.ReactNode} - The rendered routes for the application.
 */
export default function Router() {
    const routes = useRoutes([
        // Routes that are not part of the PostAuthTemplate layout
        {
            path: '/',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <HomePage />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '/analyticdash',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <AnalyticsDash />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: 'login',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: 'notifications',
            element: (
                <PostAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <SideBarNotifications/>
                    </Suspense>
                </PostAuthTemplate>
            ),
        },
        {
            path: 'register',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <Register />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '404',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <ErrorPage />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },
        {
            path: '*',
            element: 
                <Suspense fallback={<Loader />}>
                   <Navigate to="/404" replace />
                </Suspense>
            ,
        },
        {
            path: 'dev/v1/auth/verify-account',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <VerifyAccount />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },

        {
            path: 'dev/v1/auth/reset-password',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <ResetPassword />
                    </Suspense>
                </PreAuthTemplate>
            ),
        },

        // Routes that use the PostAuthTemplate layout
        {
            element: (
                <PostAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        <Outlet />
                    </Suspense>
                </PostAuthTemplate>
            ),
            children: [
                {
                    path: 'admin-dashboard',
                    element: <PrivateRoute element={<DashBoard />} roles={['ADMIN','SUPER_ADMIN']} />,
                },
                {
                    path: 'member-dashboard',
                    element: <PrivateRoute element={<DashBoard />} roles={['ADMIN','SUPER_ADMIN','MEMBER']} />,
                },
                {
                    path: 'subscription',
                    element: <PrivateRoute element={<Subscription />} roles={['MEMBER','SUPER_ADMIN']} />,       
                },
                {
                    path: 'products',
                    element: <PrivateRoute element={<ProductPage />} roles={['IMM']} />,
                },
                {
                    path: 'products-by-min-stock-level',
                    element: <PrivateRoute element={<ProductByMinStockLevelPage />} roles={['IMM']} />,
                },
                {
                    path: 'buy-orders',
                    element: <PrivateRoute element={<BuyOrderPage />} roles={['IMM']} />,
                },
                {
                    path: 'sell-orders',
                    element: <PrivateRoute element={<SellOrderPage />} roles={['IMM']} />,
                },
                {
                    path: 'suppliers',
                    element: <PrivateRoute element={<SupplierPage />} roles={['IMM']} />,
                },
                {
                    path: 'ware-houses',
                    element: <PrivateRoute element={<WareHousePage />} roles={['IMM']} />,
                },
                {
                    path: 'product-categories',
                    element: <PrivateRoute element={<ProductCategoryPage />} roles={['IMM']} />,
                },
                {
                    path: 'stock-movements',
                    element: <PrivateRoute element={<StockMovementPage />} roles={['IMM']} />,
                },
                {
                    path: 'stock-customer',
                    element: <PrivateRoute element={<CustomerPageStock />} roles={['IMM']} />,
                },
                {
                    path: 'supplier-orders',
                    element: <PrivateRoute element={<SupplierOrderPage />} roles={['SUPPLIER']} />,
                },
                {
                    path: 'hrm-page',
                    element: <PrivateRoute element={<HRMPage />} roles={['ADMIN','SUPER_ADMIN']} />,
                },
                {
                    path: 'customer',
                    element: <PrivateRoute element={<CustomerPage />} roles={['ADMIN','SUPER_ADMIN','CRMM']} />,
                },
                {
                    path: 'marketing-campaign',
                    element: <PrivateRoute element={<MarketingCampaignPage />} roles={['ADMIN','SUPER_ADMIN','CRMM']} />,
                },
                {
                    path: 'test',
                    element: <PrivateRoute element={<TestPage />} roles={['ADMIN','SUPER_ADMIN']} />,
                },
                {
                    path: 'profile',
                    element: <PrivateRoute element={<Profile />} roles={['ADMIN','MEMBER','SUPER_ADMIN']} />,
                },
                {
                    path: 'supplier-orders',
                    element: <PrivateRoute element={<SupplierOrderPage />} roles={['ADMIN','SUPER_ADMIN','SUPPLIER']} />,
                }
            ]
        }
    ]);

    return routes;
}
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import PostAuthTemplate from "../components/core/PostAuthTemplate";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { delay } from "../util/delay";
import Loader from "../components/atoms/loader/Loader";
import SideBarNotifications from "../components/molecules/SideBarNotifications";
import PreAuthTemplate from "../components/core/PreAuthTemplate";
import Profile from "../pages/Profile";

/**
 * By wrapping our component imports with `lazy`, we ensure that these components are only loaded
 * when they are needed (e.g., when the user navigates to a specific route). This reduces the 
 * initial bundle size, leading to faster load times and improved performance for the application.
 */
export const VerifyAccount = lazy(() => import('../pages/VerifyAccount'));
export const ProductPage = lazy(() => import('../pages/ProductPage'));
export const AnalyticsDash = lazy(() => import('../pages/AnalyticsDash'));
export const CustomerPage = lazy(() => import('../pages/CustomerPage'));
export const ProductByMinStockLevelPage = lazy(() => import('../pages/ProductByMinStockLevelPage'));
export const HRMPage = lazy(() => import('../pages/HRMPage'));
export const BuyOrderPage = lazy(() => import('../pages/BuyOrderPage'));
export const SellOrderPage = lazy(() => import('../pages/SellOrderPage'));
export const SupplierPage = lazy(() => import('../pages/SupplierPage'));
export const WareHousePage = lazy(() => import('../pages/WareHousePage'));
export const ProductCategoryPage = lazy(() => import('../pages/ProductCategoryPage'));
export const StockMovementPage = lazy(() => import('../pages/StockMovementPage'));
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
                    path: 'dashboard',
                    element: <PrivateRoute element={<DashBoard />} roles={['SUPER_ADMIN']} />,
                },
                {
                    path: 'products',
                    element: <PrivateRoute element={<ProductPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'products-by-min-stock-level',
                    element: <PrivateRoute element={<ProductByMinStockLevelPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'buy-orders',
                    element: <PrivateRoute element={<BuyOrderPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'sell-orders',
                    element: <PrivateRoute element={<SellOrderPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'suppliers',
                    element: <PrivateRoute element={<SupplierPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'ware-houses',
                    element: <PrivateRoute element={<WareHousePage />} roles={['ADMIN']} />,
                },
                {
                    path: 'product-categories',
                    element: <PrivateRoute element={<ProductCategoryPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'stock-movements',
                    element: <PrivateRoute element={<StockMovementPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'hrm-page',
                    element: <PrivateRoute element={<HRMPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'customer',
                    element: <PrivateRoute element={<CustomerPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'test',
                    element: <PrivateRoute element={<TestPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'profile',
                    element: <PrivateRoute element={<Profile />} roles={['ADMIN']} />,
                }

            ]
        }
    ]);

    return routes;
}
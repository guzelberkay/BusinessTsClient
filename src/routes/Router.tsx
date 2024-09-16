import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import PostAuthTemplate from "../components/core/PostAuthTemplate";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { delay } from "../util/delay";
import Loader from "../components/atoms/loader/Loader";
import PreAuthTemplate from "../components/core/PreAuthTemplate";
import VerifyAccount from "../pages/VerifyAccount";
import ProductPage from "../pages/ProductPage.tsx";
import ProductByMinStockLevelPage from "../pages/ProductByMinStockLevelPage.tsx";
import BuyOrderPage from "../pages/BuyOrderPage.tsx";
import SellOrderPage from "../pages/SellOrderPage.tsx";
export const ErrorPage = lazy(() => import('../pages/page404/ErrorPage'));
export const HomePage = lazy(() => import('../pages/HomePage'));
export const Register = lazy(() => import('../pages/Register'));
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
            path: 'login',
            element: (
                <PreAuthTemplate>
                    <Suspense fallback={<Loader />}>
                        {/* Lazy load LoginPage component */}
                    </Suspense>
                </PreAuthTemplate>
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
                    path: 'test',
                    element: <PrivateRoute element={<TestPage />} roles={['ADMIN']} />,
                },
                {
                    path: 'product',
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
                // Other protected routes can be added here.

            ]
        }


    ]);

    return routes;
}
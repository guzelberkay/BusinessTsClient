import React from 'react';
import DrawerButton, {DrawerButtonProps} from '../../atoms/DrawerButton';
import {
    Dashboard,
    FormatListNumbered,
    ProductionQuantityLimits,
    Shop,
    Sell,
    SupportAgent,
    Warehouse,
    Category,
    Inventory,
    ShowChart,
    FaceRetouchingNatural,
    People,
    TipsAndUpdates,
    AirplaneTicket,
    Campaign
} from '@mui/icons-material';

import DrawerCollapseButton, {DrawerCollapseButtonProps} from '../../atoms/DrawerCollapseButton';

// Define types for button configurations
export type Button =
    | { type: 'button', component: typeof DrawerButton, props: DrawerButtonProps }
    | { type: 'collapse', component: typeof DrawerCollapseButton, props: DrawerCollapseButtonProps };

// Define role-based button configurations
export const drawerNavigations: Record<string, Button[]> = {
    SUPER_ADMIN: [
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'dashboard', icon: <Dashboard/>} as DrawerButtonProps,
        },
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'stock',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'products', 'buyorders', 'sellorders', 'suppliers', 'warehouses', 'productcategories', 'productsbyminstocklevel', 'stockmovements'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>, <Shop/>, <Sell/>, <SupportAgent/>, <Warehouse/>, <Category/>,
                    <Inventory/>, <ShowChart/>
                ],
                menuNavigations: [
                    'products', 'buy-orders', 'sell-orders', 'suppliers', 'ware-houses', 'product-categories', 'products-by-min-stock-level', 'stock-movements'
                ],
            } as DrawerCollapseButtonProps,
        },
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'supplier',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'buyorders'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>
                ],
                menuNavigations: [
                    'supplier-orders'
                ],
            } as DrawerCollapseButtonProps,
        }
    ],
    ADMIN: [
        // Add ADMIN buttons here
    ],
    CRMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'customermodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'crm-customers', 'crm-marketing-campaign', 'crm-opportunity', 'crm-sales-activity', 'crm-ticket'
                ],
                menuIcons: [
                    <People/>, <Campaign/>, <TipsAndUpdates/>, <Shop/>, <AirplaneTicket/>
                ],
                menuNavigations: [
                    'customer', 'marketing-campaign', 'opportunity', 'sales-activity', 'tickets'
                ],
            } as DrawerCollapseButtonProps,
        },
    ],
    IMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'stockmodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'products', 'buyorders', 'sellorders', 'suppliers', 'warehouses', 'productcategories', 'productsbyminstocklevel', 'stockmovements', 'stock-customer'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>, <Shop/>, <Sell/>, <SupportAgent/>, <Warehouse/>, <Category/>,
                    <Inventory/>, <ShowChart/>, <FaceRetouchingNatural/>
                ],
                menuNavigations: [
                    'products', 'buy-orders', 'sell-orders', 'suppliers', 'ware-houses', 'product-categories', 'products-by-min-stock-level', 'stock-movements', 'stock-customer'
                ],
            } as DrawerCollapseButtonProps,
        }
    ],
    SUPPLIER: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'supplier',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'buyorders'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>
                ],
                menuNavigations: [
                    'supplier-orders'
                ],
            } as DrawerCollapseButtonProps,
        }
    ]
    // Add more roles and buttons as needed
};

import React from 'react';
import DrawerButton, { DrawerButtonProps } from '../../atoms/DrawerButton';
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
    Person,
    Loyalty,
    People,
    TipsAndUpdates,
    AirplaneTicket,
    Campaign,
    AttachMoney,
    AccountBalance,
    Description,
    Receipt,
    Assessment,
    MonetizationOn,
    RequestQuote, KeyboardArrowUp, ArrowUpward, ArrowDownward
} from '@mui/icons-material';

import DrawerCollapseButton, {DrawerCollapseButtonProps} from '../../atoms/DrawerCollapseButton';

// Define types for button configurations
export type Button =
    | { type: 'button', component: typeof DrawerButton, props: DrawerButtonProps }
    | { type: 'collapse', component: typeof DrawerCollapseButton, props: DrawerCollapseButtonProps };

// Define shared-admin button configurations
const sharedAdminButtons: Button[] = [
    {
        type: 'button',
        component: DrawerButton,
        props: { name: 'dashboard', icon: <Dashboard />, navigation: 'admin-dashboard' } as DrawerButtonProps,
    },
    {
        type: 'collapse',
        component: DrawerCollapseButton,
        props: {
            name: 'subscription',
            TopLevelIcon: <Loyalty/>,
            menuItems: [
                'plans'
            ],
            menuIcons: [
                <ProductionQuantityLimits/>
            ],
            menuNavigations: [
                'add-edit-plan',
            ],
        } as DrawerCollapseButtonProps,
    }
];

// Define role-based button configurations
export const drawerNavigations: Record<string, Button[]> = {
    SUPER_ADMIN: [...sharedAdminButtons],
    ADMIN: [...sharedAdminButtons],  
    MEMBER: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'subscription',
                TopLevelIcon: <Loyalty/>,
                menuItems: [
                    'slctSubs','historySubs'
                ],
                menuIcons: [
                    <ProductionQuantityLimits/>, <ProductionQuantityLimits/>
                ],
                menuNavigations: [
                    'subscription', 'subscription-history'
                ],
            } as DrawerCollapseButtonProps,
        },
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'profile', icon: <Person/>, navigation: 'profile-management'} as DrawerButtonProps,
        }
    ],

    BASIC: [
        {
            type: 'button',
            component: DrawerButton,
            props: {name: 'dashboard', icon: <Dashboard/>, navigation: 'member-dashboard'} as DrawerButtonProps,
        }
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
                    <People/>, <Shop/>, <TipsAndUpdates/>, <Shop/>, <AirplaneTicket/>
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
    ],

    FAM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'financemodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'declarations', 'financial-reports'
                ],
                menuIcons: [
                    <AttachMoney/>, <ArrowDownward/>, <ArrowUpward/>, <RequestQuote/>, <AccountBalance/>, <Description/>,
                    <Assessment/>,
                ],
                menuNavigations: [
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'declarations', 'financial-reports'
                ],
            } as DrawerCollapseButtonProps,
        }
    ]
    // Add more roles and buttons as needed
};

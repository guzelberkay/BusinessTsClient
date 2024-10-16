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
    Assignment,
    Receipt,
    Assessment,
    MonetizationOn,
    RequestQuote, KeyboardArrowUp, ArrowUpward, ArrowDownward,
    Settings,
    PersonAdd,
    ManageAccounts,
    GroupAdd,
    Edit, Apartment
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
    },
    {
        type: 'collapse',
        component: DrawerCollapseButton,
        props: {
            name: 'adminMenu',
            TopLevelIcon: <Settings/>,
            menuItems: [
                'ManageUsers','ManageRoles'
            ],
            menuIcons: [
                <ManageAccounts/>,<Edit/>
            ],
            menuNavigations: [
                'ManageUsers','ManageRoles'
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
                name: 'organizationManagementModule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'oms-department', 'oms-employee', 'oms-manager',"oms-treeview"
                ],
                menuIcons: [
                    <Apartment/>, <Person/>, <ManageAccounts/>, <ManageAccounts/>
                ],
                menuNavigations: [
                    'oms-department', 'oms-employee', 'oms-manager',"oms-treeview"
                ],
            } as DrawerCollapseButtonProps,
        },
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
                    <People/>, <Campaign/>, <TipsAndUpdates/>, <Shop/>, <AirplaneTicket/>
                ],
                menuNavigations: [
                    'customer', 'marketing-campaign', 'opportunity', 'sales-activity', 'tickets'
                ],
            } as DrawerCollapseButtonProps,
        },
    ],
    HRMM: [
        {
            type: 'collapse',
            component: DrawerCollapseButton,
            props: {
                name: 'hrmmodule',
                TopLevelIcon: <FormatListNumbered/>,
                menuItems: [
                    'hrm-employees', 'hrm-payrolls', 'hrm-performances', 'hrm-benefits', 'hrm-attendance', 'hrm-graphics'
                ],
                menuIcons: [
                    <People/>, <AttachMoney/>, <ShowChart/>, <RequestQuote/>, <Assignment/>, <Assessment/>
                ],
                menuNavigations: [
                    'employee-page', 'payroll-page', 'performance-page', 'benefit-page', 'attandance-page', 'graphics-page'
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
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'financial-reports'
                ],
                menuIcons: [
                    <AttachMoney/>, <ArrowDownward/>, <ArrowUpward/>, <RequestQuote/>, <AccountBalance/>, <Assessment/>,
                ],
                menuNavigations: [
                    'budgets', 'incomes', 'expenses', 'invoices', 'taxes', 'financial-reports'
                ],
            } as DrawerCollapseButtonProps,
        }
    ]
    // Add more roles and buttons as needed
};

import React from 'react';
import DrawerButton, { DrawerButtonProps } from '../../atoms/DrawerButton';
import { Dashboard, FormatListNumbered, ProductionQuantityLimits, Shop, Sell, SupportAgent, Warehouse, Category, Inventory, ShowChart, Person, Loyalty} from '@mui/icons-material';
import DrawerCollapseButton, { DrawerCollapseButtonProps } from '../../atoms/DrawerCollapseButton';

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
      props: { name: 'dashboard', icon: <Dashboard />, navigation: 'admin-dashboard'} as DrawerButtonProps,
    }
  ],

  ADMIN: [
    {
      type: 'button',
      component: DrawerButton,
      props: { name: 'dashboard', icon: <Dashboard />, navigation: 'admin-dashboard'} as DrawerButtonProps,
    }
  ],

  MEMBER:[
    {
      type: 'button',
      component: DrawerButton,
      props: { name: 'subscription', icon: <Loyalty />} as DrawerButtonProps,
    },
    {
      type: 'button',
      component: DrawerButton,
      props: { name: 'profile', icon: <Person />} as DrawerButtonProps,
    }
  ],

  BASIC:[
    {
      type: 'button',
      component: DrawerButton,
      props: { name: 'dashboard',  icon: <Dashboard />, navigation: 'member-dashboard'} as DrawerButtonProps,
    }
  ],

  IMM: [
    {
      type: 'collapse',
      component: DrawerCollapseButton,
      props: {
        name: 'stock',
        TopLevelIcon: <FormatListNumbered />,
        menuItems: [
          'products', 'buyorders', 'sellorders', 'suppliers', 'warehouses', 'productcategories', 'productsbyminstocklevel', 'stockmovements'
        ],
        menuIcons: [
          <ProductionQuantityLimits />, <Shop />, <Sell />, <SupportAgent />, <Warehouse />, <Category />, <Inventory />, <ShowChart />
        ],
        menuNavigations: [
          'products', 'buy-orders', 'sell-orders', 'suppliers', 'ware-houses', 'product-categories', 'products-by-min-stock-level', 'stock-movements'
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
        TopLevelIcon: <FormatListNumbered />,
        menuItems: [
          'buyorders'
        ],
        menuIcons: [
          <ProductionQuantityLimits />
        ],
        menuNavigations: [
          'supplier-orders'
        ],
      } as DrawerCollapseButtonProps,
    }
  ]
  // Add more roles and buttons as needed
};

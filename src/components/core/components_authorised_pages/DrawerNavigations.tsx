import React from 'react';
import DrawerButton, { DrawerButtonProps } from '../../atoms/DrawerButton';
import { Dashboard, FormatListNumbered, ProductionQuantityLimits, Shop, Sell, SupportAgent, Warehouse, Category, Inventory, ShowChart } from '@mui/icons-material';
import DrawerCollapseButton, { DrawerCollapseButtonProps } from '../../atoms/DrawerCollapseButton';

// Define types for button configurations
export type Button = 
  | { type: 'button', component: typeof DrawerButton, props: DrawerButtonProps }
  | { type: 'collapse', component: typeof DrawerCollapseButton, props: DrawerCollapseButtonProps };

// Define role-based button configurations
export const drawerNavigations: Record<string, Button[]> = {
  CUSTOMER: [
    {
      type: 'collapse',
      component: DrawerCollapseButton,
      props: {
        name: 'customer',
        TopLevelIcon: <FormatListNumbered />,
        menuItems: [
          'customer'
        ],
        menuIcons: [
          <ProductionQuantityLimits />
        ],
        menuNavigations: [
          'customer'
        ],
      } as DrawerCollapseButtonProps,
    }
  ],
  STOCK: [
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
    },
    {
      type: 'collapse',
      component: DrawerCollapseButton,
      props: {
        name: 'customer',
        TopLevelIcon: <FormatListNumbered />,
        menuItems: [
          'customer'
        ],
        menuIcons: [
          <ProductionQuantityLimits />
        ],
        menuNavigations: [
          'customer'
        ],
      } as DrawerCollapseButtonProps,
    }
  ]
  // Add more roles and buttons as needed
};

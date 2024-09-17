import * as React from 'react';
import { List, Divider, SwipeableDrawer, Typography, Box } from '@mui/material';
import {
    Dashboard,
    Notifications,
    FormatListNumbered,
    ConfirmationNumber,
    ProductionQuantityLimits
} from '@mui/icons-material';
import { styled, alpha } from "@mui/material/styles";
import { useAppSelector } from '../../../store';
import DrawerButton from '../../atoms/DrawerButton';
import DrawerCollapseButton from '../../atoms/DrawerCollapseButton';
import CustomerPage from "../../../pages/CustomerPage.tsx";

const drawerWidth = 240;

// Styled component for the drawer header
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

// Interface defining the props for the LeftDrawer component
interface LeftDrawerProps {
    open: boolean; // Indicates whether the drawer is open or closed
    setDrawerState: (state: boolean) => void; // Function to set the drawer state
}

/**
 * LeftDrawer component that renders a swipeable side drawer with navigation options.
 *
 * This component includes buttons for dashboard, notifications, and collapsible menu items.
 * It manages its own state for collapsible sections and displays the current date.
 *
 * @param {Object} param0 - The component props.
 * @param {boolean} param0.open - Indicates if the drawer is open or closed.
 * @param {function} param0.setDrawerState - Function to update the drawer's open state.
 * @returns {React.ReactNode} - The rendered LeftDrawer component.
 */
export default function LeftDrawer({
    open,
    setDrawerState
}: LeftDrawerProps) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    const language = useAppSelector(state => state.pageSettings.language);
    const formattedDate = today.toLocaleDateString(language, options);

    // State for collapsible menu items
    const [openTest1, setOpenTest1] = React.useState(false);
    const [openTest2, setOpenTest2] = React.useState(false);

    // Toggles the state of the first collapsible menu
    const handleTest1Click = () => {
        setOpenTest1(!openTest1);
    };

    // Toggles the state of the second collapsible menu
    const handleTest2Click = () => {
        setOpenTest2(!openTest2);
    };

    return (
        <SwipeableDrawer
            onClose={() => setDrawerState(false)}
            onOpen={() => setDrawerState(true)}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader sx={{ bgcolor: 'primary.main', color: 'white', justifyContent: 'center' }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                        mr: 2,
                        display: { xs: "flex" },
                        fontFamily: "monospace",
                        fontWeight: 200,
                        letterSpacing: ".05rem",
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    {formattedDate}
                </Typography>
            </DrawerHeader>
            <Box sx={{ width: drawerWidth }} role="presentation">
                <List>
                    <DrawerButton name="dashboard" icon={<Dashboard />} />
                    <DrawerCollapseButton
                        name="stock"
                        handleOpen={handleTest1Click}
                        TopLevelIcon={<FormatListNumbered />}
                        open={openTest1}
                        menuItems={['products', 'buyorders', 'sellorders', 'suppliers', 'warehouses', 'productcategories', 'productsbyminstocklevel', 'stockmovements']}
                        menuIcons={[<ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />, <ProductionQuantityLimits />]}
                        menuNavigations={['products', 'buy-orders', 'sell-orders', 'suppliers', 'ware-houses', 'product-categories','products-by-min-stock-level', 'stock-movements']}
                    />
                    <DrawerCollapseButton
                        name="customer"
                        handleOpen={handleTest2Click}
                        TopLevelIcon={<FormatListNumbered />}
                        open={openTest2}
                        menuItems={['customer']}
                        menuIcons={[<ProductionQuantityLimits />]}
                        menuNavigations={['customer']}
                    />
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Divider sx={{ width: drawerWidth - 32 }} />
                </Box>
                <List>
                    <DrawerButton name="notifications" icon={<Notifications />} navigation='notifications'/>
                </List>
            </Box>
        </SwipeableDrawer>
    );
}
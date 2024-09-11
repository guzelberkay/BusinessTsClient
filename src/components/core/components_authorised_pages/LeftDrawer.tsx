import * as React from 'react';
import Box from '@mui/material/Box';
import { List, Divider, Drawer, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dashboard, Notifications, FormatListNumbered, ConfirmationNumber } from '@mui/icons-material';
import { useAppSelector } from '../../../store';
import DrawerButton from '../../atoms/DrawerButton';
import DrawerCollapseButton from '../../atoms/DrawerCollapseButton';

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
    handleDrawerClose: () => void; // Function to close the drawer
}

/**
 * LeftDrawer component that renders a navigation drawer on the left side of the application.
 *
 * This component includes various navigation buttons and collapsible sections.
 * It displays the current date and handles the opening and closing of sections within the drawer.
 *
 * @param {Object} param0 - The component props.
 * @param {boolean} param0.open - Indicates if the drawer is open or closed.
 * @param {function} param0.handleDrawerClose - Function to close the drawer.
 * @returns {React.ReactNode} - The rendered LeftDrawer component.
 */
export default function LeftDrawer({
    open,
    handleDrawerClose,
}: LeftDrawerProps) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    const language = useAppSelector(state => state.pageSettings.language);
    const formattedDate = today.toLocaleDateString(language, options);
    const [openTest1, setOpenTest1] = React.useState(false);
    const [openTest2, setOpenTest2] = React.useState(false);

    // Toggles the state of the first collapsible section
    const handleTest1Click = () => {
        setOpenTest1(!openTest1);
    };

    // Toggles the state of the second collapsible section
    const handleTest2Click = () => {
        setOpenTest2(!openTest2);
    };
    //#region UI
    return (
        <Drawer
            onClose={handleDrawerClose}
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
                    {formattedDate} {/* Display formatted current date */}
                </Typography>
            </DrawerHeader>
            <Box
                sx={{ width: drawerWidth }}
                role="presentation"
            >
                <List>
                    <DrawerButton
                        name="dashboard"
                        icon={<Dashboard />}
                    />
                    <DrawerCollapseButton
                        name="test1"
                        handleOpen={handleTest1Click}
                        TopLevelIcon={<FormatListNumbered />}
                        open={openTest1}
                        menuItems={['Element1', 'Element2', 'Element3']}
                        menuIcons={[<ConfirmationNumber />, <ConfirmationNumber />, <ConfirmationNumber />]}
                    />
                    <DrawerCollapseButton
                        name="test2"
                        handleOpen={handleTest2Click}
                        TopLevelIcon={<FormatListNumbered />}
                        open={openTest2}
                        menuItems={['Element1', 'Element2', 'Element3', 'Element4', 'Element5']}
                        menuIcons={[<ConfirmationNumber />, <ConfirmationNumber />, <ConfirmationNumber />, <ConfirmationNumber />, <ConfirmationNumber />]}
                    />
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Divider sx={{ width: drawerWidth - 32 }} />
                </Box>
                <List>
                    <DrawerButton
                        name="notifications"
                        icon={<Notifications />}
                    />
                </List>
            </Box>
        </Drawer>
    );
    //#endregion UI
}
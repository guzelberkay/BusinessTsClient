import { useState } from "react";
import Header from "./components_authorised_pages/Header";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { useSwipeable } from 'react-swipeable';

const drawerWidth = 240;

// Styled component for the main content area
const EasyStyleMain = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
})<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

// Styled component for the drawer header
const EasyStyleDrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

interface PostAuthTemplateProps {
    children: ReactNode;
}

/**
 * PostAuthTemplate component that provides a layout with a collapsible drawer and header.
 *
 * This component manages the state of the drawer and renders child components within the main content area.
 * It also handles swipe gestures for opening and closing the drawer on mobile devices.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The rendered PostAuthTemplate component.
 */
function PostAuthTemplate({ children }: PostAuthTemplateProps) {
    const [drawerState, setDrawerState] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // Updates the drawer state based on user actions
    const handleDrawerStateChange = (newState: boolean) => {
        setDrawerState(newState);
    };

    // Closes the drawer
    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    // Opens the drawer
    const handleDrawerOpen = () => {
        setDrawerState(true);
    };
    
    // Swipe handlers for mobile interactions
    const handlers = useSwipeable({
        onSwipedRight: handleDrawerOpen,  // Open drawer on swipe right
        onSwipedLeft: handleDrawerClose,   // Close drawer on swipe left
        trackMouse: true, // Optional: enables mouse swipes for testing
    });

    return (
        <>
            <Box sx={{ display: "flex" }} {...handlers}>
                <CssBaseline />
                <Header
                    drawerState={drawerState}
                    setDrawerState={handleDrawerStateChange}
                />
                <EasyStyleMain open={drawerState} sx={{ minHeight: "100vh" }} onClick={() => isSmallScreen && setDrawerState(false)}>
                    <EasyStyleDrawerHeader />
                    {children} {/* Render child components here */}
                </EasyStyleMain>
            </Box>
        </>
    );
}

export default PostAuthTemplate;
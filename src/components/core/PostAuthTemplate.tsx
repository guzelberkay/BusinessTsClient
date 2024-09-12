import { useState } from "react";
import Header from "./components_authorised_pages/Header";
import { CssBaseline, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

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
    children: ReactNode; // Define children as ReactNode
}

/**
 * PageParent component that provides a layout with a collapsible drawer and header.
 * It manages the state of the drawer and renders the child components within the main content area.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The rendered PageParent component.
 */
function PostAuthTemplate({ children }: PostAuthTemplateProps) {
    const [drawerState, setDrawerState] = useState(false);

    // Updates the drawer state based on user actions
    const handleDrawerStateChange = (newState: boolean) => {
        setDrawerState(newState);
    };

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <Header
                    drawerState={drawerState}
                    setDrawerState={handleDrawerStateChange}
                />
                <EasyStyleMain open={drawerState} sx={{ minHeight: "100vh" }}>
                    <EasyStyleDrawerHeader />
                    {children} {/* Render child components here */}
                </EasyStyleMain>
            </Box>
        </>
    );
}

export default PostAuthTemplate;

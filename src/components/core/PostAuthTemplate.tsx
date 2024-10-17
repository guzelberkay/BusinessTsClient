import { useEffect, useState } from "react";
import Header from "./components_authorised_pages/Header";
import { CssBaseline, Box, useMediaQuery, Fab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { useSwipeable } from 'react-swipeable';
import ChatIcon from '@mui/icons-material/Chat'; 
import UserChat from "../../pages/UserChat";

const drawerWidth = 240;

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

function PostAuthTemplate({ children }: PostAuthTemplateProps) {
    const [drawerState, setDrawerState] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleDrawerStateChange = (newState: boolean) => {
        setDrawerState(newState);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handlers = useSwipeable({
        onSwipedRight: handleDrawerOpen,  
        onSwipedLeft: handleDrawerClose,  
        trackMouse: false, 
    });

    const handleChatButtonClick = () => {
        setIsChatVisible((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const chatBox = document.getElementById("chat-box");
        if (chatBox && !chatBox.contains(event.target as Node)) {
            setIsChatVisible(false);
        }
    };

    useEffect(() => {
        if (isChatVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatVisible]);

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
                    {children} 

                    <Fab 
                        color="primary" 
                        aria-label="chat" 
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                        }}
                        onClick={handleChatButtonClick}
                    >
                        <ChatIcon />
                    </Fab>

                    {isChatVisible && (
                        <Box
                            id="chat-box"
                            sx={{
                                position: 'fixed',
                                bottom: 80,
                                right: 16,
                                width: isSmallScreen ? '90%' : 400,
                                height: 500, 
                                boxShadow: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                zIndex: 1300,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <UserChat />  
                        </Box>
                    )}
                </EasyStyleMain>
            </Box>
        </>
    );
}

export default PostAuthTemplate;

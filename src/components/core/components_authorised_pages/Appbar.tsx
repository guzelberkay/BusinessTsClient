import React from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MuiAppBar from "@mui/material/AppBar";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { Avatar, Divider } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { toggleLanguage } from "../../../store/feature/languageSlice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DropdownNotification from "../../atoms/DropdownNotifications"; 

const drawerWidth = 240;

// Styled AppBar component that adjusts based on the drawer state
const EasyStyleAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerState",
})(({ theme, drawerState }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: `${drawerWidth}px`,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerState && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
  ...(!drawerState && {
    marginLeft: 0,
    width: "100%",
  }),
}));

// Styled components for search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const easyStyleMenu = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    minWidth: "150px",
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const demoUser = {
  name: "Demo User",
  role: "Manager",
  avatar: "https://xsgames.co/randomusers/assets/avatars/male/38.jpg",
};

interface AppbarProps {
  drawerState: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

function Appbar({
  drawerState,
  handleDrawerOpen,
  handleDrawerClose,
}: AppbarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handlePageElementChange = (element: string) => {
    navigate(`/${element}`);
    handleMenuClose();
  };

  const handleLanguageChange = () => {
    dispatch(toggleLanguage());
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={easyStyleMenu}
    >
      <MenuItem onClick={() => handlePageElementChange("profile")}>
        {t("navigation.profile")}
      </MenuItem>
      <MenuItem onClick={() => handlePageElementChange("account")}>
        {t("navigation.account")}
      </MenuItem>
      <Divider />
      <MenuItem
        sx={{ color: "primary.main" }}
        onClick={handleLanguageChange}
      >
        {t("localization.locale")}
      </MenuItem>
    </Menu>
  );

  const renderNotificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotificationOpen}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: "visible",
          mt: 1.5,
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      <DropdownNotification />
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={easyStyleMenu}
    >
      <MenuItem
        onClick={() => handlePageElementChange("messages")}
      >
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>{t("navigation.messages")}</p>
      </MenuItem>
      
      <MenuItem
        onClick={() => handlePageElementChange("notifications")}
      >
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
          onClick={handleNotificationMenuOpen}
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <p>{t("navigation.notifications")}</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
        >
          <AccountCircle />
        </IconButton>
        <p>{t("navigation.profile")}</p>
      </MenuItem>
    </Menu>
  );

  // Toggles the drawer open/close state
  const handleDrawerState = () => {
    drawerState ? handleDrawerClose() : handleDrawerOpen();
  };

  return (
    <>
      <EasyStyleAppBar position="fixed" drawerState={drawerState}>
        <Toolbar>
          <IconButton
            onClick={handleDrawerState}
            color="inherit"
            aria-label="open drawer"
            edge="start"
          >
            {drawerState ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              ml: 2,
              mr: 2,
              display: { xs: "none", sm: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BUSINESS
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => handlePageElementChange("messages")}
            >
              <Badge badgeContent={4} color="error">
                <MailIcon fontSize="large" />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon fontSize="large" />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Badge color="secondary">
                <Avatar
                  src={demoUser.avatar}
                  alt={demoUser.name}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </Badge>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </EasyStyleAppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotificationMenu}
    </>
  );
}

export default Appbar;

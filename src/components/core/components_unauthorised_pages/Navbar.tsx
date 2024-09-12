import * as React from "react";
import IconButton from "@mui/material/IconButton";
import {
  Typography,
  Toolbar,
  Box,
  AppBar,
  Button,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import { useTranslation } from "react-i18next";
import Topbar from "./Topbar";

const NavbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 999,
  paddingLeft: "15vw",
  paddingRight: "15vw",
  backgroundColor: "#F5F7F8",
  color: "#45474B",
};

const CollapsibleMenuStyle = {
  position: "sticky",
  top: "64px",
  zIndex: 998,
  backgroundColor: "#F5F7F8",
};

/**
 * Navbar component that renders a responsive navigation bar with collapsible menu functionality.
 * It includes a logo, navigation links, and buttons for login and registration.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 */
function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const pages = [t("home"), t("about"), t("services"), t("contact")];
  const pagesMobile = [
    t("home"),
    t("about"),
    t("services"),
    t("contact"),
    t("login"),
    t("register"),
  ];

  // Toggles the collapsible navigation menu
  const handleOpenNavMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Closes the collapsible navigation menu
  const handleCloseNavMenu = () => {
    setOpen(false);
  };

  // Handles clicks outside the menu to close it
  const handleClickOutside = (event: MouseEvent) => {
    const menu = document.getElementById("collapsible-menu");
    const button = document.getElementById("menu-button");
    const topBar = document.getElementById("top-bar");

    if (
      menu &&
      button &&
      !menu.contains(event.target as Node) &&
      !button.contains(event.target as Node) &&
      !topBar?.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  //#region UI
  return (
    <>
      <Topbar displayForMobile={open} />
      <AppBar sx={NavbarStyle}>
        <Toolbar disableGutters>
          {/* Logo and title */}
          <Typography variant="h6" sx={{ display: { xs: "flex", md: "flex" } }}>
            <Button
              style={{ marginRight: "20px" }}
              onClick={() => navigate("/")}
              color="inherit"
            >
              <img src={logo} alt="logo" style={{ height: "52px" }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  ml: 2,
                  display: { xs: "flex", md: "flex", lg: "flex", xl: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                BUSINESS
              </Typography>
            </Button>
          </Typography>


          {/* Empty Box to push items to the right */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />

          {/* Menu Icon Button for mobile */}
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              position: "relative",
            }}
          >
            <IconButton
              id="menu-button"
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Navigation Menu for larger screens */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(`/${page.toLowerCase()}`);
                }}
                sx={{
                  my: 2,
                  color: "#45474B",
                  display: "block",
                  marginLeft: "20px",
                }}
              >
                {t("navigation." + page)}
              </Button>
            ))}
          </Box>

          {/* Login and Register buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Button
              onClick={() => navigate("/login")}
              sx={{ my: 2, color: "inherit", marginLeft: "10px" }}
            >
              {t("navigation.login")}
            </Button>
            <Button
              onClick={() => navigate("/register")}
              sx={{ my: 2, color: "inherit", marginLeft: "10px" }}
            >
              {t("navigation.register")}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Collapsible Navigation Menu for smaller screens */}
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={CollapsibleMenuStyle}
        id="collapsible-menu"
      >
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            backgroundColor: "#F5F7F8",
            paddingLeft: "15vw",
            paddingRight: "15vw",
            zIndex: 998,
          }}
        >
          {pagesMobile.map((page) => (
            <Button
              key={page}
              onClick={() => {
                handleCloseNavMenu();
                navigate(`/${page.toLowerCase()}`);
              }}
              sx={{
                my: 1,
                color: "#45474B",
                display: "block",
                textAlign: "left",
                width: "100%",
              }}
            >
              {t("navigation." + page)}
            </Button>
          ))}
        </Box>
      </Collapse>
    </>
  );
  //#endregion UI
}

export default Navbar;
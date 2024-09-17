import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface DrawerCollapseButtonProps {
  name: string;
  handleOpen: () => void;
  TopLevelIcon: React.ReactNode;
  open: boolean;
  menuItems: string[];
  menuIcons: React.ReactNode[];
  menuNavigations: string[];
}
/**
 * DrawerCollapseButton component that renders a collapsible navigation button in the drawer.
 *
 * This component allows for the grouping of menu items under a top-level button.
 * When clicked, it expands or collapses to show or hide the nested menu items.
 * Each nested item is a clickable button that navigates to a specified route.
 *
 * @param {Object} param0 - The component props.
 * @param {string} param0.name - The name of the top-level button.
 * @param {function} param0.handleOpen - Function to toggle the open state of the collapse.
 * @param {React.ReactNode} param0.TopLevelIcon - The icon to display for the top-level button.
 * @param {boolean} param0.open - Indicates whether the collapse is open or closed.
 * @param {Array<string>} param0.menuItems - An array of names for the nested menu items.
 * @param {Array<React.ReactNode>} param0.menuIcons - An array of icons corresponding to the nested menu items.
 * @param {Array<string>} param0.menuNavigations - An array of routes corresponding to the nested menu items.
 * @returns {React.ReactNode} - The rendered DrawerCollapseButton component with nested items.
 */
const DrawerCollapseButton: React.FC<DrawerCollapseButtonProps> = ({
  name,
  handleOpen,
  TopLevelIcon,
  open,
  menuItems,
  menuIcons,
  menuNavigations,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>{TopLevelIcon}</ListItemIcon>
        <ListItemText primary={t("navigation."+name)} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menuItems.map((text, index) => (
            <ListItemButton onClick={() => navigate(`/${menuNavigations[index]}`)} sx={{ pl: 4 }}>
              <ListItemIcon>{menuIcons[index]}</ListItemIcon>
              <ListItemText primary={t("navigation."+text)} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default DrawerCollapseButton;

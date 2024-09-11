import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface DrawerButtonProps {
    name: string
    icon: React.ReactNode
}

/**
 * DrawerButton component that renders a navigation button in the drawer.
 *
 * This component uses Material-UI's ListItemButton to create a clickable item 
 * that navigates to a specified route when clicked. It also displays an icon 
 * and the button's name, which is translated using the i18next library.
 *
 * @param {Object} param0 - The component props.
 * @param {string} param0.name - The name of the route to navigate to.
 * @param {React.ReactNode} param0.icon - The icon to display alongside the button text.
 * @returns {React.ReactNode} - The rendered ListItemButton component.
 */
const DrawerButton: React.FC<DrawerButtonProps> = ({ name, icon }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <ListItemButton onClick={() => navigate(`/${name}`)} >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={t("navigation."+name)} />
        </ListItemButton>
    );
}

export default DrawerButton;
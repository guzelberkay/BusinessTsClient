import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface DrawerButtonProps {
    name: string
    icon: React.ReactNode
    navigation?: string
}

/**
 * DrawerButton component that renders a navigation button in the drawer.
 *
 * This component uses Material-UI's ListItemButton to create a clickable item 
 * that navigates to a specified route when clicked. It also displays an icon 
 * and the button's name, which is translated using the i18next library.
 *
 * @param {Object} param0 - The component props.
 * @param {string} param0.name - The name of the button.
 * @param {React.ReactNode} param0.icon - The icon to display alongside the button text.
 * @param {string} [param0.navigation] - The name of the route to navigate to (optional).
 * @returns {React.ReactNode} - The rendered ListItemButton component.
 */
const DrawerButton: React.FC<DrawerButtonProps> = ({ name, icon, navigation }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        // Use navigation prop if provided, otherwise use name
        const route = navigation ? `/${navigation}` : `/${name}`;
        navigate(route);
    };

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={t("navigation." + name)} />
        </ListItemButton>
    );
}

export default DrawerButton;
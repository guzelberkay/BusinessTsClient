import { useState, useEffect } from "react";
import { Button, drawerNavigations } from "./DrawerNavigations";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { fetchUserRoles } from "../../../store/feature/userSlice";

export default function DrawerButtonRenderer() {
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserRoles()).then((data) => {
      setUserRoles(data.payload.data);
    });
  }, [dispatch]);

  // Check if BASIC role exists in userRoles
  const basicRoleButtons = userRoles.includes("BASIC") ? drawerNavigations["BASIC"] || [] : [];
  
  // Get other role buttons excluding BASIC and MEMBER
  const otherRoleButtons = userRoles
    .filter((role: string) => role !== "BASIC" && role !== "MEMBER") // Exclude BASIC and MEMBER roles
    .flatMap((role: string) => drawerNavigations[role] || []);

  // Check if MEMBER role exists in userRoles
  const memberRoleButtons = userRoles.includes("MEMBER") ? drawerNavigations["MEMBER"] || [] : [];

  // Combine all buttons: BASIC first, other roles in between, MEMBER last
  const roleButtons = [...basicRoleButtons, ...otherRoleButtons, ...memberRoleButtons];

  return (
    <div>
      {roleButtons.map((button: Button, index: number) => {
        if (button.type === 'button') {
          const ButtonComponent = button.component;
          return <ButtonComponent key={index} {...button.props} />;
        } else if (button.type === 'collapse') {
          const CollapseButtonComponent = button.component;
          return <CollapseButtonComponent key={index} {...button.props} />;
        }
        return null;
      })}
    </div>
  );
}

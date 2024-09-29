import { Button, drawerNavigations } from "./DrawerNavigations";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";

export default function DrawerButtonRenderer() {
  const dispatch = useDispatch<AppDispatch>();
  const userRoles = useSelector((state: RootState) => state.userSlice.userRoleList);

  // Check if member have modules
  const basicRoleButtons = userRoles.length > 1 ? drawerNavigations["BASIC"] || [] : [];
  
  // Get other role buttons excluding BASIC and MEMBER
  const otherRoleButtons = userRoles
    .filter((role: string) => role !== "BASIC" && role !== "MEMBER")
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

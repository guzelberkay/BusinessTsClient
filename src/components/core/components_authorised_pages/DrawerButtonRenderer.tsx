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
  }, []);

  const roleButtons = userRoles.flatMap((role: string) => drawerNavigations[role] || []);

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

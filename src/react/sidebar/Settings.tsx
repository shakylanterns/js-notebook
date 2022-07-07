import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarIcon from "./SidebarIcon";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <SidebarIcon
      icon={FaCog}
      text="Settings"
      onClick={() => navigate("/settings")}
    />
  );
};

export default Settings;

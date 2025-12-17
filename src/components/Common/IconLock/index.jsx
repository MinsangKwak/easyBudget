import { FaLock, FaEnvelope, FaIdCard } from "react-icons/fa";
import "./index.css";

const IconLock = () => {
  return (
    <div className="icon_lock icon_lock--triple" aria-hidden="true">
      <FaEnvelope className="icon_lock__side left" />
      <FaLock className="icon_lock__icon" />
      <FaIdCard className="icon_lock__side right" />
    </div>
  );
};

export default IconLock;

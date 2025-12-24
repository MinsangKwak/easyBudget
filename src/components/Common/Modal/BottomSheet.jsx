import { FiX } from "react-icons/fi";
import "./modal.css";

const BottomSheet = ({ isOpen, title, onClose, children, footer }) => {
  return (
    <div className={`sheet ${isOpen ? "is_open" : ""}`} aria-hidden={!isOpen}>
      <div className="sheet_dim" onClick={onClose} />

      <div className="sheet_panel" role="dialog" aria-label={title || "모달"}>
        <div className="sheet_head">
          <div className="sheet_title">{title || "내역"}</div>
          <button type="button" className="sheet_close" onClick={onClose} aria-label="닫기">
            <FiX />
          </button>
        </div>

        <div className="sheet_body">{children}</div>

        {footer && <div className="sheet_footer">{footer}</div>}
      </div>
    </div>
  );
};

export default BottomSheet;

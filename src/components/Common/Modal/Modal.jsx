import "./modal.css";

const Modal = ({ isOpen, onClose, title, ariaLabel, children }) => {
  return (
    <div className={`modal ${isOpen ? "is_open" : ""}`} aria-hidden={!isOpen}>
      <div className="modal_dim" onClick={onClose} />
      <div
        className="modal_panel"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || "모달"}
      >
        {title && <div className="modal_title">{title}</div>}
        {children}
      </div>
    </div>
  );
};

export default Modal;

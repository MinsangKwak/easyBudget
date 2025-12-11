// BaseButtonContainer.jsx
const BaseButtonContainer = ({ className = "", children }) => {
  return (
    <div className={`btn_container ${className}`.trim()}>
      {children}
    </div>
  );
};

export default BaseButtonContainer;

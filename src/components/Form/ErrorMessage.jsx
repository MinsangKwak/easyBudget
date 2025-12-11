// ErrorMessage.jsx
const ErrorMessage = ({ className = "", children }) => {
  return (
    <p className={`error_message ${className}`.trim()}>
      {children}
    </p>
  );
};

export default ErrorMessage;

// FormFieldWrapper.jsx
const FormFieldWrapper = ({ className = "", children }) => {
  return (
    <div className={`input_wrapper ${className}`.trim()}>
      {children}
    </div>
  );
};

export default FormFieldWrapper;

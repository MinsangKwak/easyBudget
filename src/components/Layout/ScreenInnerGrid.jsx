// ScreenInnerGrid.jsx
const ScreenInnerGrid = ({
  className = "",
  top,
  bottom,
  topClassName = "top_content",
  bottomClassName = "bottom_content",
}) => {
  return (
    <div className={`grid_layout ${className}`.trim()}>
      <div className={topClassName}>
        {top}
      </div>
      <div className={bottomClassName}>
        {bottom}
      </div>
    </div>
  );
};

export default ScreenInnerGrid;

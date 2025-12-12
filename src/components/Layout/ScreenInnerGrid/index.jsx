import "./index.css";

const ScreenInnerGrid = ({ top, bottom }) => {
  return (
    <div className="screen_inner_grid">
      <div className="grid_top">{top}</div>
      <div className="grid_bottom">{bottom}</div>
    </div>
  );
};

export default ScreenInnerGrid;

import "./index.css";

const BaseList = ({ className = "", items = [], renderItem }) => {
  return (
    <ul className={`list ${className}`.trim()}>
      {items.map((item, index) => (
        <li className="item" key={index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

export default BaseList;

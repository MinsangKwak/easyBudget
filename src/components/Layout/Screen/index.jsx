import "./index.css";

const Screen = ({ className = "", children }) => {
  return (
    <section className={`screen ${className}`.trim()}>
      <article className="screen_body">
        <div className="content">{children}</div>
      </article>
    </section>
  );
};

export default Screen;

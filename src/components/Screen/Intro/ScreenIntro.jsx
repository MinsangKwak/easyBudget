// ScreenIntro.jsx
const ScreenIntro = ({ onClickGoJoin }) => {
  return (
    <section className="screen screen_main">
      <h2>환영합니다.</h2>
      <p>원하시는 방식으로 로그인/회원가입을 진행해주세요.</p>

      <button
        type="button"
        className="btn btn_solid__primary"
        onClick={onClickGoJoin}
      >
        회원가입 / 로그인 하러가기
      </button>
    </section>
  );
};

export default ScreenIntro;

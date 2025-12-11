// ScreenJoinGoogle.jsx
const ScreenJoinGoogle = ({ onSignUpComplete }) => {
  const handleClickGoogle = () => {
    // TODO: 실제 구현 시 Google OAuth 연동
    // window.location.href = "https://accounts.google.com/o/oauth2/v2/auth?..."

    alert("데모 화면입니다. 실제 Google 연동은 나중에 OAuth로 붙여주세요 :)");
  };

  return (
    <section className="screen screen_email_join">
      <div className="content">
        <div className="btn_container">
          <button
            type="button"
            className="btn btn_line__black btn_google_join"
            onClick={handleClickGoogle}
          >
            Google 계정으로 계속하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScreenJoinGoogle;

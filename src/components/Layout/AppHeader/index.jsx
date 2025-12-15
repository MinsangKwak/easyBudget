import "./index.css";
import Button from "../../Form/Button";

const AppHeader = ({ showBackButton, showAuthAction, onAuthClick, onBack }) => {
  return (
    <header className="app_header">
      <div className="app_header__inner">
        <div className="app_header__brand">
          {showBackButton ? (
            <Button type="button" className="btn_back" onClick={onBack}>
              뒤로가기
            </Button>
          ) : (
            <div className="app_header__logo" aria-label="서비스 로고">
              AUTH
            </div>
          )}
        </div>

        {showAuthAction && (
          <Button
            type="button"
            variant="line__black"
            className="btn_auth"
            onClick={onAuthClick}
          >
            로그인 / 회원가입
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

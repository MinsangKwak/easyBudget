import "./index.css";
import Button from "../../Form/Button";
import { IoChevronBack } from "react-icons/io5";

const AppHeader = ({ showBackButton, showAuthAction, onAuthClick, onBack }) => {
  return (
    <header className="app_header">
      <div className="app_header__inner">
        <div className="app_header__brand">
          {showBackButton ? (
            <Button
              type="button"
              className="btn_back"
              aria-label="뒤로가기"
              onClick={onBack}
            >
              <IoChevronBack aria-hidden="true" />
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
            variant=""
            className="btn_auth btn_header"
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

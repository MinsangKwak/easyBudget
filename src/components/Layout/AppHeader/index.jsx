import "./index.css";
import BaseButton from "../../Form/BaseButton";

const AppHeader = ({
  isAuthenticated,
  onLogoClick,
  onLoginClick,
  onProfileClick,
  onLogoutClick,
}) => {
  return (
    <header className="header">
      <div className="header__inner">
        <button
          type="button"
          className="header__logo_button"
          aria-label="서비스 로고"
          onClick={onLogoClick}
        >
          <span className="header__logo">LOGO</span>
        </button>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <BaseButton
                type="button"
                size="sm"
                style="line__black"
                className="btn_inline"
                onClick={onProfileClick}
              >
                마이프로필
              </BaseButton>
              <BaseButton
                type="button"
                size="sm"
                style="outline__grey"
                className="btn_inline"
                onClick={onLogoutClick}
              >
                로그아웃
              </BaseButton>
            </>
          ) : (
            <BaseButton
              type="button"
              size="sm"
              style="solid__primary"
              className="btn_inline"
              onClick={onLoginClick}
            >
              로그인
            </BaseButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

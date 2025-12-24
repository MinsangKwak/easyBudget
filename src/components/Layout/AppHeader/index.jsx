import "./index.css";
import BaseButtonContainer from "../../Form/BaseButtonContainer";
import BaseButton from "../../Form/BaseButton";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";

const AppHeader = ({
  isAuthenticated,
  onLogoClick,
  onToggleMenu,
  onCloseMenu,
  isMenuOpen = false,
  menuItems = [],
  showBackButton = false,
  onBackClick,
  onClickLogin,
  onClickSignUp,
  onClickLogout,
  onClickMyPage,
}) => {
  const handleBackClick = () => {
    if (!showBackButton) return;

    if (onBackClick) {
      onBackClick();
      return;
    }

    onLogoClick?.();
  };

  const handleSelectMenu = (item) => {
    item?.onClick?.();
    onCloseMenu?.();
  };

  const handleLogin = () => {
    onClickLogin?.();
    onCloseMenu?.();
  };

  const handleSignUp = () => {
    onClickSignUp?.();
    onCloseMenu?.();
  };

  return (
    <header className="header">
      <div className={`header__inner ${showBackButton ? "header__inner--back_only" : ""}`}>
        <div className="header__left">
          {showBackButton ? (
            <BaseButton
              type="button"
              style="back"
              aria-label="이전 화면으로 돌아가기"
              onClick={handleBackClick}
            >
              <IoIosArrowRoundBack />
            </BaseButton>
          ) : (
            <div className="header__brand">
              <button
                type="button"
                className="header__logo_button"
                aria-label="서비스 로고"
                onClick={onLogoClick}
              >
                <span className="header__logo">WALLET</span>
              </button>
            </div>
          )}
        </div>

        <div className="header__actions header__actions--right">
          <BaseButton
            type="button"
            style="menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={onToggleMenu}
            className="header__menu_btn"
          >
            ☰
          </BaseButton>
        </div>
      </div>

      <aside className={`header__drawer ${isMenuOpen ? "is_open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="header__drawer_inner">
          <div className="drawer_head">
            <span className="drawer_title">메뉴</span>
          </div>
          <ul className="drawer_list">
            {menuItems.map((item) => (
              <li key={item.key} className="drawer_item">
                <button type="button" onClick={() => handleSelectMenu(item)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="header__auth_actions" aria-label="계정 상태">
          {isAuthenticated ? (
            <>
              <span className="drawer_status">{isAuthenticated ? "연결 완료" : "로그인 필요"}</span>
              <BaseButtonContainer>
                <BaseButton type="button" style="inline__black" size="sm" onClick={onClickMyPage}>
                  마이페이지
                </BaseButton>
                <BaseButton
                  type="button"
                  style="inline__black"
                  size="sm"
                  onClick={onClickLogout}
                  aria-label="로그아웃"
                >
                  <FiLogOut /> 로그아웃
                </BaseButton>
              </BaseButtonContainer>
            </>
          ) : (
            <>
              <BaseButton
                type="button"
                style="ghost inline text"
                size="sm"
                onClick={handleLogin}
                aria-label="로그인"
              >
                <FiLogIn /> 로그인
              </BaseButton>
              <BaseButton
                type="button"
                style="ghost inline text"
                size="sm"
                onClick={handleSignUp}
                aria-label="회원가입"
                className="header__auth_btn"
              >
                <FiUserPlus /> 회원가입
              </BaseButton>
            </>
          )}
        </div>
      </aside>
      {isMenuOpen && (
        <button className="header__scrim" onClick={onCloseMenu} aria-label="메뉴 닫기" />
      )}
    </header>
  );
};

export default AppHeader;

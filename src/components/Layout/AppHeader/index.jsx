import "./index.css";
import BaseButton from "../../Form/BaseButton";
import { IoIosArrowRoundBack } from "react-icons/io";

const AppHeader = ({
    isAuthenticated,
    onLogoClick,
    onToggleMenu,
    onCloseMenu,
    isMenuOpen = false,
    menuItems = [],
    showBackButton = false,
    onBackClick,
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

    return (
        <header className="header">
            <div className={`header__inner ${showBackButton ? "header__inner--back_only" : ""}`}>
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

                <div className="header__actions">
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
                <div className="drawer_head">
                    <span className="drawer_title">메뉴</span>
                    <span className="drawer_status">{isAuthenticated ? "로그인됨" : "로그인 필요"}</span>
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
            </aside>
            {isMenuOpen && <button className="header__scrim" onClick={onCloseMenu} aria-label="메뉴 닫기" />}
        </header>
    );
};

export default AppHeader;

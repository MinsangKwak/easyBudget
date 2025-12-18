import "./index.css";
import BaseButton from "../../Form/BaseButton";
import { IoIosArrowRoundBack } from "react-icons/io";

const AppHeader = ({
    isAuthenticated,
    onLogoClick,
    onLoginClick,
    onProfileClick,
    onLogoutClick,
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
                    <button
                        type="button"
                        className="header__logo_button"
                        aria-label="서비스 로고"
                        onClick={onLogoClick}
                    >
                        <span className="header__logo">WALLET</span>
                    </button>
                )}

                {!showBackButton && (
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
                )}
            </div>
        </header>
    );
};

export default AppHeader;

import "./index.css";
import BaseButton from "../../Form/BaseButton";
import { IoChevronBack } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";


const AppHeader = ({ showBackButton, showAuthAction, onAuthClick, onBack }) => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          {showBackButton ? (
            <BaseButton
              type="button"
              className="btn_back"
              aria-label="뒤로가기"
              onClick={onBack}
            >
              <IoChevronBack aria-hidden="true" />
            </BaseButton>
          ) : (
            <div className="header__logo" aria-label="서비스 로고">
              LOGO
            </div>
          )}
        </div>

        {showAuthAction && (
          <BaseButton
            type="button"
            className="btn_menu"
              aria-label="메뉴"
            onClick={onAuthClick}
          >
            <AiOutlineMenu aria-hidden="true"/>
          </BaseButton>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

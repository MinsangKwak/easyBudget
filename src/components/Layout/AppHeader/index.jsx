import "./index.css";
import Button from "../../Form/Button";
import { IoChevronBack } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";


const AppHeader = ({ showBackButton, showAuthAction, onAuthClick, onBack }) => {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
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
            <div className="header__logo" aria-label="서비스 로고">
              LOGO
            </div>
          )}
        </div>

        {showAuthAction && (
          <Button
            type="button"
            className="btn_menu"
              aria-label="메뉴"
            onClick={onAuthClick}
          >
            <AiOutlineMenu aria-hidden="true"/>
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

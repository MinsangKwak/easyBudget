import "./index.css";
import Button from "../../Form/Button";

const AppHeader = ({ showBackButton, onBack }) => {
  return (
    <header className="app_header">
      <div className="app_header__inner">
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
    </header>
  );
};

export default AppHeader;

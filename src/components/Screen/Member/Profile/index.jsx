import "./index.css";

import Screen from "../../../Layout/Screen";
import Title from "../../../Content/Title";
import Subtitle from "../../../Content/SubTitle";
import Inner from "../../../Content/Inner";
import BaseButton from "../../../Form/BaseButton";
import { useAuth } from "../../../../contexts/AuthContext";

const ProfileField = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="profile_field">
      <div className="profile_field__label">{label}</div>
      <div className="profile_field__value">{value}</div>
    </div>
  );
};

const ProfileScreen = ({ onGoHome, onDeleteAccount }) => {
  const { currentUser } = useAuth();

  return (
    <Screen className="screen_profile">
      <Title>마이프로필</Title>
      <Subtitle>현재 세션 정보를 확인할 수 있어요.</Subtitle>

      <Inner>
        {currentUser ? (
          <div className="profile_card" role="status" aria-live="polite">
            <ProfileField label="이름" value={currentUser.displayName} />
            <ProfileField label="이메일" value={currentUser.email} />
            <ProfileField label="연동 타입" value={currentUser.connectionType} />
            <ProfileField label="은행" value={currentUser.bankName} />
            <ProfileField label="연락처" value={currentUser.phone} />
            <ProfileField label="생년월일" value={currentUser.birth} />
          </div>
        ) : (
          <div className="profile_card profile_card--empty">
            <p>로그인된 계정을 찾지 못했습니다.</p>
          </div>
        )}

        <BaseButton
          type="button"
          size="md"
          style="line__black"
          className="btn_profile_home"
          onClick={onGoHome}
        >
          메인으로 돌아가기
        </BaseButton>
        {currentUser && (
          <BaseButton
            type="button"
            size="md"
            style="outline__grey"
            className="btn_profile_delete"
            onClick={onDeleteAccount}
          >
            회원 탈퇴 (세션 제거)
          </BaseButton>
        )}
      </Inner>
    </Screen>
  );
};

export default ProfileScreen;

import "./index.css";
import { useEffect } from "react";
import Screen from "../../../Layout/Screen";
import Inner from "../../../Content/Inner";
import BaseButton from "../../../Form/BaseButton";
import Title from "../../../Content/Title";

const ScreenJoinGoogle = ({ onSignUpComplete }) => {
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          const url = API_BASE ? `${API_BASE}/api/auth/google` : "/api/auth/google";

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: credential }),
          });

          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            console.error("Google auth failed:", res.status, errText);
            alert("구글 로그인 실패");
            return;
          }

          const data = await res.json();
          localStorage.setItem("accessToken", data.accessToken);

          onSignUpComplete?.();
        } catch (e) {
          console.error(e);
          alert("네트워크 오류");
        }
      },
    });
  }, [API_BASE, GOOGLE_CLIENT_ID, onSignUpComplete]);

  const handleClickGoogle = () => {
    window.google.accounts.id.prompt();
  };

  return (
    <Screen className="screen_google_join">
      <Title>Google 계정으로 가입</Title>
      <Inner>
        <div className="btn_container">
          <BaseButton
            type="button"
            style="line__black"
            size="md"
            className="btn_google_join"
            onClick={handleClickGoogle}
          >
            Google 계정으로 계속하기
          </BaseButton>
        </div>
      </Inner>
    </Screen>
  );
};

export default ScreenJoinGoogle;

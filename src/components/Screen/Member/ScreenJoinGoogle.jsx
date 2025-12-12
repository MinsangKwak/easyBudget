import { useEffect } from "react";

const ScreenJoinGoogle = ({ onSignUpComplete }) => {
  // ✅ Vercel API 베이스 (예: https://auth-xxxx.vercel.app)
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        try {
          const url = API_BASE
            ? `${API_BASE}/api/auth/google`
            : "/api/auth/google";

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

          const data = await res.json(); // { accessToken, user }
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
    <section className="screen screen_email_join">
      <div className="content">
        <div className="btn_container">
          <button
            type="button"
            className="btn btn_line__black btn_google_join"
            onClick={handleClickGoogle}
          >
            Google 계정으로 계속하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default ScreenJoinGoogle;

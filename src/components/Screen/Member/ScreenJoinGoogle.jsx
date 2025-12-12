import { useEffect } from "react";

const ScreenJoinGoogle = ({ onSignUpComplete }) => {
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        // 1) 구글 id_token(credential) -> 백엔드로 전달
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credential }),
        });

        if (!res.ok) {
          alert("구글 로그인 실패");
          return;
        }

        const data = await res.json(); // { accessToken, user }
        // 2) 우리 서비스 토큰 저장(예: localStorage) — 또는 httpOnly 쿠키 권장
        localStorage.setItem("accessToken", data.accessToken);

        onSignUpComplete?.();
      },
    });
  }, []);

  const handleClickGoogle = () => {
    window.google.accounts.id.prompt(); // 팝업
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

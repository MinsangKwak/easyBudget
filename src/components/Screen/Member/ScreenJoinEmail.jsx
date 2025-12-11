// ScreenJoinEmail.jsx
import { useState } from "react";

const ScreenJoinEmail = ({ onSignUpComplete }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // 간단 검증
    if (!email.includes("@")) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 실제 API 요청 대신 즉시 성공 처리
    setError("");

    if (onSignUpComplete) {
      onSignUpComplete();
    }
  };

  return (
    <section className="screen screen_email_join">
      <div className="content">
        <h2 className="content_title">
          <span className="title_inner">이메일로 회원가입</span>
        </h2>

        <div className="content_inner">
          <form className="form_email_join" onSubmit={handleSubmit}>
            <div className="form_field input_wrapper">
              <div className="input_container">
                <label htmlFor="email" className="form_label">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  className="form_field__input"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form_field input_wrapper">
              <div className="input_container">
                <label htmlFor="password" className="form_label">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  className="form_field__input"
                  placeholder="비밀번호 (8자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form_field input_wrapper">
              <div className="input_container">
                <label htmlFor="password_confirm" className="form_label">
                  비밀번호 확인
                </label>
                <input
                  id="password_confirm"
                  type="password"
                  className="form_field__input"
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="error_message" aria-live="polite">
                {error}
              </p>
            )}

            <div className="btn_container">
              <button
                type="submit"
                className="btn btn_solid__primary btn_email_join_submit"
              >
                이메일로 가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ScreenJoinEmail;

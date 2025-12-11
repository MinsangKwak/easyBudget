// ScreenJoin.jsx
const ScreenJoin = ({
  onClickCert,
  onClickEmail,
  onClickGoogle,
}) => {
  return (
    <section className="screen screen_join">
      <h2>어떤 방식으로 진행할까요?</h2>

      <ul className="join_method_list">

        {/* 1) 일반 회원가입 */}
        <li>
          <button
            type="button"
            className="btn btn_solid__primary"
            onClick={onClickEmail}
          >
            일반 회원가입
          </button>
        </li>

        {/* 2) Google 계정 연동 */}
        <li>
          <button
            type="button"
            className="btn btn_line__black"
            onClick={onClickGoogle}
          >
            Google 계정으로 가입하기
          </button>
        </li>

        {/* 3) 금융인증서 회원가입 */}
        <li>
          <button
            type="button"
            className="btn btn_line__primary"
            onClick={onClickCert}
          >
            금융인증서로 가입하기
          </button>
        </li>

      </ul>
    </section>
  );
};

export default ScreenJoin;

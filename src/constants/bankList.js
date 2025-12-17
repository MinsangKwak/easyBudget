// src/constants/bankList.js
import logoHana from "../assets/bank/logo__hana.png";
import logoIbk from "../assets/bank/logo__ibk.png";
import logoKb from "../assets/bank/logo__kb.png";
import logoKakao from "../assets/bank/logo__kakao.png";
import logoNh from "../assets/bank/logo__nh.png";
import logoShinhan from "../assets/bank/logo__shinhan.png";
import logoWoori from "../assets/bank/logo__woori.png";

export const bankList = {
  woori: {
    name: "woori",
    bankType: "woori",
    label: "우리",
    logoSrc: logoWoori,
  },
  kb: {
    name: "kb",
    bankType: "kb",
    label: "국민",
    logoSrc: logoKb,
  },
  shinhan: {
    name: "shinhan",
    bankType: "shinhan",
    label: "신한",
    logoSrc: logoShinhan,
  },
  hana: {
    name: "hana",
    bankType: "hana",
    label: "하나",
    logoSrc: logoHana,
  },
  nh: {
    name: "nh",
    bankType: "nh",
    label: "농협",
    logoSrc: logoNh,
  },
  ibk: {
    name: "ibk",
    bankType: "ibk",
    label: "기업",
    logoSrc: logoIbk,
  },
  kakao: {
    name: "kakao",
    bankType: "kakao",
    label: "카카오",
    logoSrc: logoKakao,
  },
};

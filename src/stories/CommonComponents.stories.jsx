import ScreenLoading from "../components/Screen/Common/Loading";
// import LottieIcon from "../components/Common/LottieIcon";
// import { LOTTIE_SOURCES } from "../constants/lottieSources";

export default {
  title: "Components/Common",
};

export const LoadingIndicator = {
  name: "Loading",
  render: () => <ScreenLoading />,
};

export const LoadingIndicatorWithMessage = {
  name: "Loading (Custom Message)",
  render: () => <ScreenLoading message="로그인 중입니다." />,
};

// export const LottieIconPulse = {
//   name: "LottieIcon",
//   render: () => (
//     <LottieIcon
//       src={LOTTIE_SOURCES.introPulse}
//       ariaLabel="애니메이션 예시"
//       size={120}
//     />
//   ),
// };

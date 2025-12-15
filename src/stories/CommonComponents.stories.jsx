import Loading from "../components/Common/Loading";
import LottieIcon from "../components/Common/LottieIcon";
import { LOTTIE_SOURCES } from "../constants/lottieSources";

export default {
  title: "Components/Common",
};

export const LoadingIndicator = {
  name: "Loading",
  render: () => <Loading />,
};

export const LottieIconPulse = {
  name: "LottieIcon",
  render: () => (
    <LottieIcon
      src={LOTTIE_SOURCES.introPulse}
      ariaLabel="애니메이션 예시"
      size={120}
    />
  ),
};

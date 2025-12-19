import IconLock from "../components/Common/IconLock";
import ScreenLoading from "../components/Screen/Common/Loading";

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

export const SecurityLockIcon = {
    name: "IconLock",
    render: () => (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <IconLock />
        </div>
    ),
};

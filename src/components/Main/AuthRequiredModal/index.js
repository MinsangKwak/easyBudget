import Modal from "../../Common/Modal/Modal";

const AuthRequiredModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="회원가입 후 시도해주세요">
            <p className="modal_desc">
                로그인 또는 회원가입 후 마이데이터를 연동하면 지출/수입 정보를 확인하고 수정할 수
                있어요.
            </p>

            <div className="modal_actions">
                <button type="button" className="modal_btn" onClick={onClose}>
                    닫기
                </button>
                <button type="button" className="modal_btn modal_btn__primary" onClick={onConfirm}>
                    회원가입 하기
                </button>
            </div>
        </Modal>
    );
};

export default AuthRequiredModal;

import BottomSheet from "../../Common/Modal/BottomSheet";
import { formatKoreanWon } from "../utils";

const TransactionSheet = ({ isOpen, title, items, onClose }) => {
    const hasItems = items && items.length > 0;

    return (
        <BottomSheet isOpen={isOpen} title={title} onClose={onClose}>
            {!hasItems && <div className="sheet_empty muted">표시할 내역이 없어요.</div>}

            {hasItems && (
                <ul className="tx_list" aria-label="거래 내역">
                    {items.map((transaction) => (
                        <li key={transaction.id} className="tx_row">
                            <div className="tx_left">
                                <div className="tx_title">{transaction.title}</div>
                                <div className="tx_meta muted">
                                    {transaction.date} · {transaction.sub}
                                </div>
                            </div>
                            <div className="tx_right">
                                <b className="tx_amount">{formatKoreanWon(transaction.amount)}</b>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </BottomSheet>
    );
};

export default TransactionSheet;

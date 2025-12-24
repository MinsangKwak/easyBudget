import { MdOutlineNavigateNext } from "react-icons/md";

const PaymentMethodsSection = ({
  id,
  paymentGroups,
  totalSpend,
  formatMaskedKoreanWon,
  onClickPayment,
}) => {
  return (
    <section id={id} className="card pay" aria-label="지출 수단">
      <div className="card_head">
        <div className="card_title">지출수단</div>
        <div className="card_value">{formatMaskedKoreanWon(totalSpend)}</div>
      </div>

      <div className="pay_groups">
        {paymentGroups.map((group) => {
          const isCardGroup = group.key === "card";
          return (
            <div key={group.key} className="pay_group">
              <div className="pay_group__head">
                <div className="pay_group__title">{group.label}</div>
                <div className="pay_group__total">{formatMaskedKoreanWon(group.total)}</div>
              </div>

              {isCardGroup ? (
                <div className="pay_group__summary muted">
                  카드지출은 합산 금액만 제공해요.
                </div>
              ) : (
                <ul className="list">
                  {group.items.map((item) => (
                    <li key={item.key} className="list_row">
                      <div className="list_left">
                        <span className="avatar" aria-hidden="true">
                          {item.logoText}
                        </span>
                        <span className="list_label">{item.label}</span>
                      </div>

                      <div className="list_right">
                        <b className="list_value">{formatMaskedKoreanWon(item.amount)}</b>
                        <button
                          type="button"
                          className="arrow_btn"
                          aria-label={`${item.label} 내역 보기`}
                          onClick={() => onClickPayment(item.key, item.label)}
                        >
                          <MdOutlineNavigateNext />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};

export default PaymentMethodsSection;

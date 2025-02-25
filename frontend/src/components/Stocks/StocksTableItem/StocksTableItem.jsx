import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";

import AddToListModal from "../../Modals/AddToListModal";
import { useModal } from "../../../context/Modal";

import { formatNumber } from "../../../helpers/helpers";

function StocksTableItem({
  stock,
  navigate,
  setNotifications,
  setNotificationMessage,
}) {
  const { setModalContent, setModalClass } = useModal();

  const { id, name, symbol, current_price, todays_change_percent, market_cap } =
    stock;

  return (
    <tr
      key={id}
      className="stock-row"
      onClick={() => navigate(`/stocks/${symbol}`)}
    >
      <td>{name}</td>
      <td>{symbol}</td>
      <td>${current_price.toFixed(2)}</td>
      <td>
        <span className="stocks-table-arrow-container">
          {todays_change_percent > 0 ? (
            <GoTriangleUp className="triangleIconUp" />
          ) : (
            <GoTriangleDown className="triangleIconDown" />
          )}
          {todays_change_percent?.toFixed(2)}%
        </span>
      </td>
      <td>{formatNumber(market_cap)}</td>
      <td>
        <FaPlus
          className="stocks__btn stocks__btn--add"
          onClick={(e) => {
            e.stopPropagation();
            setModalContent(
              <AddToListModal
                stock={stock}
                create={true}
                setNotifications={setNotifications}
                setNotificationMessage={setNotificationMessage}
              />
            );
            setModalClass({
              modal: "AddToListModal",
              modalBackground: "AddToListModal__background",
              modalContainer: "AddToListModal__container",
            });
          }}
        />
      </td>
    </tr>
  );
}

export default StocksTableItem;

import './StocksTableItem.css';
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { FaPlus } from "react-icons/fa6";
import { MdClose } from "react-icons/md";

import { useDispatch } from "react-redux";

import AddToListModal from "../../Modals/AddToListModal";
import { useModal } from "../../../context/Modal";

import { editListStocks } from "../../../../store/stocks";

import { formatNumber } from "../../../helpers/helpers";

function StocksTableItem({
  stock,
  navigate,
  setNotifications,
  setNotificationMessage,
  listStocks,
  listId,
}) {
  const dispatch = useDispatch();
  const { setModalContent, setModalClass } = useModal();

  const { id, name, symbol, current_price, todays_change_percent, market_cap } =
    stock;

  return (
    <tr
      key={id}
      className="StockTableItem"
      onClick={() => navigate(`/stocks/${symbol}`)}
    >
      <td className="StocksTableItem__name">{name}</td>
      <td className="StocksTableItem__symbol">{symbol}</td>
      <td className="StocksTableItem__price">${current_price.toFixed(2)}</td>
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
        {listStocks ? (
          <MdClose
            className="StockTableItem__button stocks__btn--delete"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              const id = Number(listId);
              await dispatch(editListStocks({ [id]: false }, stock));
            }}
          />
        ) : (
          <FaPlus
            className="StockTableItem__button stocks__btn--add"
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
        )}
      </td>
    </tr>
  );
}

export default StocksTableItem;

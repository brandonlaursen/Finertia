import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent,
  onButtonClick,
  onModalClose,
  className,
  Element,
  modalClass,
}) {
  const { setModalContent, setOnModalClose, setModalClass } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);

    setModalContent(modalComponent);

    setModalClass(modalClass);
    if (typeof onButtonClick === "function") onButtonClick();
  };

  return <Element className={className} onClick={onClick}></Element>;
}

export default OpenModalButton;

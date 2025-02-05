import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent,
  onButtonClick,
  onModalClose,
  Element,
  modalClass,
  className,
}) {
  const { setModalContent, setOnModalClose, setModalClass } = useModal();


  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);

    setModalContent(modalComponent);

    setModalClass(modalClass);
    if (typeof onButtonClick === "function") onButtonClick();
  };



  return <Element onClick={onClick} className={className}></Element>;
}

export default OpenModalButton;

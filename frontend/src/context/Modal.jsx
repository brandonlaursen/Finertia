import "./Modal.css";
import { useRef, useState, useContext, createContext } from "react";
import ReactDOM from "react-dom";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);
  const [modalClass, setModalClass] = useState(null);

  const closeModal = () => {

    setModalContent(null);
    setModalClass(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };


  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
    modalClass,
    setModalClass,
  };


  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal, modalClass } =
    useContext(ModalContext);

  if (!modalRef || !modalRef.current || !modalContent || !modalClass)
    return null;

  return ReactDOM.createPortal(
    <div className={modalClass.modal}>
      <div className={modalClass.modalBackground} onClick={closeModal} />
      <div className={modalClass.modalContainer}>{modalContent}</div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);

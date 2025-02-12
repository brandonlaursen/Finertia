import "./Modal.css";
import ReactDOM from "react-dom";
import { useRef, useState, useContext, createContext, useEffect } from "react";

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

  useEffect(() => {}, [modalContent, modalClass]);

  if (!modalRef || !modalRef.current || !modalContent || !modalClass)
    return null;

  return ReactDOM.createPortal(
    <div>
      <div onClick={closeModal} />
      <div>{modalContent}</div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);

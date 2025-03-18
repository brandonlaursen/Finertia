import "./CreateListModal.css";

import { useState } from "react";

import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";
import ChooseListType from "./ChooseListType/ChooseListType";
import CreateListModalForm from "./CreateListModalForm/CreateListModalForm";

import { useModal } from "../../context/Modal";

function CreateListModal({ setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();

  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="CreateList">
      <ModalOverlay closeModal={closeModal} />

      {!isOpen ? (
        <ChooseListType closeModal={closeModal} setIsOpen={setIsOpen} />
      ) : (
        <CreateListModalForm
          closeModal={closeModal}
          setNotifications={setNotifications}
          setNotificationMessage={setNotificationMessage}
        />
      )}
    </div>
  );
}

export default CreateListModal;

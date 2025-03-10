import "./InfoModal.css";
import { useModal } from "../../context/Modal";
import { FaCircle } from "react-icons/fa";

import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";
import ModalHeader from "../../components/ModalHeader/ModalHeader";

function InfoModal() {
  const { closeModal } = useModal();

  return (
    <div className="InfoModal">
      <ModalOverlay closeModal={closeModal} />

      <main className="InfoModal__main">
        <ModalHeader closeModal={closeModal}>{`Market Closed`}</ModalHeader>

        <div className="InfoModal__contents">
          <section className="InfoModal__section">
            <span className="InfoModal__header">Stock Market</span>
            <span className="InfoModal__text">
              The stock market is where buyers and sellers trade shares of
              publicly listed companies. It&apos;s a marketplace that operates
              under set hours and regulations.
            </span>
          </section>

          <section className="InfoModal__section">
            <span className="InfoModal__header">Regular Trading Hours</span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" /> Monday -
              Friday: <strong>9:30 AM - 4:00 PM EST</strong>
            </span>
          </section>

          <section className="InfoModal__section">
            <span className="InfoModal__header">Extended Trading Hours</span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              Pre-Market: <strong>4:00 AM - 9:30 AM EST</strong>
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              After-Hours: <strong>4:00 PM - 8:00 PM EST</strong>
            </span>
          </section>

          <section className="InfoModal__section">
            <span className="InfoModal__header">Weekends & Holidays</span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              <strong>Closed</strong> on Saturdays & Sundays
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              <strong>Closed</strong> on major holidays
            </span>
          </section>

          <section className="InfoModal__section">
            <span className="InfoModal__header">
              What Happens When the Market is Closed?
            </span>
            <span className="InfoModal__text">
              Due to the limitations of the API being used, I am limited to data
              during regular trading hours. However under normal circumstances:
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              Orders placed will execute at the next market open.
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              Pre-market & after-hours trading may have lower volume
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              Market orders will fill at the next available price.
            </span>
          </section>

          <section className="InfoModal__section">
            <span className="InfoModal__header">Time Zone Conversions</span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              <strong>EST:</strong> 9:30 AM - 4:00 PM
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              <strong>PST:</strong> 6:30 AM - 1:00 PM
            </span>
            <span className="InfoModal__text">
              <FaCircle size={6} color="var(--theme-primary-color)" />
              <strong>GMT:</strong> 2:30 PM - 9:00 PM
            </span>
          </section>
        </div>
      </main>
    </div>
  );
}

export default InfoModal;

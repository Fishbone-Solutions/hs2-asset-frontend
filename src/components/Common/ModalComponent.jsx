import { useEffect } from "react";
import { Modal } from "bootstrap";

const ModalComponent = ({
  modalId,
  title,
  content,
  showModal,
  onCloseCross,
  onClose,
  onSubmit,
  closeButtonText,
  submitButtonText,
  closeButtonColor,
  submitButtonColor,
}) => {
  useEffect(() => {
    const modalElement = document.getElementById(modalId);
    const bsModal = new Modal(modalElement, {
      backdrop: "static", // Prevent closing on backdrop click if desired
      keyboard: false, // Prevent closing with the escape key if desired
    });
    console.log("asfdadf", bsModal, modalId, showModal, bsModal.hide());
    if (showModal) {
      bsModal.show();
    } else {
      bsModal.hide();
    }

    return () => {
      bsModal.dispose();
    };
  }, [showModal, modalId]); // Dependency only on showModal and modalId

  const handleClose = () => {
    const modalElement = document.getElementById(modalId);
    modalElement.classList.remove("show");
    modalElement.style.display = "none"; // Hides the modal
    const backdropElement = document.querySelector(".modal-backdrop");
    if (backdropElement) {
      backdropElement.remove();
    }
    onCloseCross();
  };

  const handleCancel = () => {
    onClose();
  }

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center pr-3 m-1 card-header-custom card-header">
            <h6
              className="modal-title text-white m-0 d-flex align-items-center"
              id={`${modalId}Label`}
            >
              {title}
            </h6>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body pb-0">{content}</div>
          <div className="d-flex justify-content-end gap-1 pr-2">
            <button
              type="button"
              className="btn btn-primary px-2 py-2"
              onClick={handleCancel}
              style={{
                backgroundColor: closeButtonColor,
                borderColor: closeButtonColor,
              }}
            >
              {closeButtonText}
            </button>
            <button
              type="button"
              className="btn btn-success submission px-2 py-2"
              onClick={onSubmit}
              style={{
                backgroundColor: submitButtonColor,
                borderColor: submitButtonColor,
              }}
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;

import React from 'react';

// Creates a pop up (the user can cancel or proceed with their action)
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, successText, cancelText }) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {successText}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmationModal;
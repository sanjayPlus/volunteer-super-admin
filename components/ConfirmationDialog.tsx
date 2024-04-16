import React from 'react';
import "./Modal.css"
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, children }:any) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        {children}
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

import React from "react";

const PopupMsj = ({message, onClose}) => {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <p>{message}</p>
          <button className="button is-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default PopupMsj;
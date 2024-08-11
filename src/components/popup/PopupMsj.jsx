import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const PopupMsj = ({ message, onClose, onConfirm }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Advertencia</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} style={{ color: "purple" }}>
          Aceptar
        </Button>
        <Button onClick={onClose} style={{ color: "red" }}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupMsj;
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import './styles.css';
import { Button } from '../button/Button';
import { Modal } from './Modal';

interface IProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmCallback: VoidFunction;
  message: string;
}

export function ConfirmModal({ setOpen, confirmCallback, message }: IProps): ReactElement {
  function confirm() {
    confirmCallback();
    close();
  }

  function close() {
    setOpen(false);
  }

  return createPortal(
    <Modal>
      <p>{message}</p>
      <div className="confirm-modal-buttons-container">
        <Button onClick={close}>Close</Button>
        <Button onClick={confirm}>Confirm</Button>
      </div>
    </Modal>,
    document.body
  );
}

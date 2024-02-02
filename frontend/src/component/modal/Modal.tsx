import React, { ReactElement } from 'react';
import './styles.css';

interface IProps {
  children: ReactElement | ReactElement[];
}

export function Modal({ children }: IProps): ReactElement {
  return (
    <div className="modal-container">
      <div className="modal">{children}</div>
    </div>
  );
}

import React, { MouseEvent, ReactElement } from 'react';
import './styles.css';

interface IProps {
  children: string;
  onClick: VoidFunction;
  className?: string;
}

export function Button({ children, onClick, className }: IProps): ReactElement {
  function click(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onClick();
  }

  return (
    <button className={`${className ? className + ' ' : ''}button`} onClick={click}>
      {children}
    </button>
  );
}

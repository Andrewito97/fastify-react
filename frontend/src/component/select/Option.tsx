import React, { MouseEventHandler, ReactElement, CSSProperties } from 'react';
import './styles.css';

export interface IProps {
  label: string | React.JSX.Element;
  value: string;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
  default?: boolean;
}

export function Option({ label, value, onClick, style }: IProps): ReactElement {
  return (
    <li style={style} className="option" value={value} onClick={onClick}>
      {label}
    </li>
  );
}

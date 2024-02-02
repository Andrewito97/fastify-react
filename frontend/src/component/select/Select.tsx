import React, {
  ChangeEvent,
  ChangeEventHandler,
  cloneElement,
  ReactElement,
  useState,
} from 'react';
import './styles.css';
import { IProps as IOptionProps } from './Option';

export interface IProps {
  name: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  children: ReactElement<IOptionProps>[];
}

export function Select({ children, name, onChange }: IProps): ReactElement {
  const options = Array.isArray(children) ? children : [children];
  const defaultOption = options.find((option) => option.props.default) || options[0];

  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [mouseOverDropdown, setMouseOverDropdown] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<ReactElement<IOptionProps>>(defaultOption);

  function handleSelect(option: ReactElement<IOptionProps>): void {
    setSelectedOption(option);
    setShowDropdown(false);
    onChange({
      target: { name, value: option.props.value },
    } as ChangeEvent<HTMLSelectElement>);
  }

  function handleClickSelect(): void {
    setShowDropdown(!showDropdown);
  }

  function handleBlurSelect(): void {
    if (!mouseOverDropdown) {
      setShowDropdown(false);
    }
  }

  function handleMouseEnterOptions(): void {
    setMouseOverDropdown(true);
  }

  function handleMouseLeaveOptions(): void {
    setMouseOverDropdown(false);
  }

  return (
    <>
      <div className="selected-option" onClick={handleClickSelect} onBlur={handleBlurSelect}>
        {selectedOption}
      </div>
      <ul
        className="dropdown"
        hidden={!showDropdown}
        onMouseEnter={handleMouseEnterOptions}
        onMouseLeave={handleMouseLeaveOptions}
      >
        {options.map((option, index) => {
          return cloneElement(option, {
            key: index,
            onClick: () => handleSelect(option),
          });
        })}
      </ul>
    </>
  );
}

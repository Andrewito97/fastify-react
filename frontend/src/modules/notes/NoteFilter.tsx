import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import './styles.css';
import { ITag } from '../tags/interface';

interface IProps {
  filterValue: ITag | null;
  setFilterValue: Dispatch<SetStateAction<ITag | null>>;
}

export function NotesFilter({ filterValue, setFilterValue }: IProps): ReactElement {
  function resetFilter(): void {
    setFilterValue(null);
  }

  return (
    <div className="note-filter-container">
      <label>Filter:&nbsp;</label>
      {filterValue ? (
        <div className="note-filter" style={{ backgroundColor: filterValue.color }}>
          {filterValue.name}
        </div>
      ) : (
        'All'
      )}

      <button
        className="note-remove-filter-button"
        onClick={resetFilter}
        style={{ display: filterValue ? 'block' : 'none' }}
      >
        <span className="note-remove-filter-button-icon red">&#10006;</span>
      </button>
    </div>
  );
}

import React, { ReactElement } from 'react';
import './styles.css';
import { NotesList } from '../notes/NotesList';

export function App(): ReactElement {
  return (
    <div className="app-container">
      <NotesList />
    </div>
  );
}

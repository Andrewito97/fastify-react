import React, { ReactElement, useEffect, useState } from 'react';
import './styles.css';
import { INote } from './interface';
import { deleteNote, getNotes, createNote } from './api';
import { Note } from './Note';
import { ITag } from '../tags/interface';
import { NotesFilter } from './NoteFilter';
import { Button } from '../../component/button/Button';

export function NotesList(): ReactElement {
  const [notes, setNotes] = useState<INote[]>([]);

  const [tagFilter, setTagFilter] = useState<ITag | null>(null);

  useEffect(() => {
    (async function () {
      setNotes(await getNotes(tagFilter?.name));
    })();
  }, [tagFilter]);

  function onChangeNote(
    noteId: number,
    noteProperty: keyof Pick<INote, 'title' | 'description' | 'tags'>,
    value: string | ITag[]
  ): void {
    setNotes((prevState) =>
      prevState.map((note) => (note.id === noteId ? { ...note, [noteProperty]: value } : note))
    );
  }

  async function removeNote(noteId: number) {
    deleteNote(noteId);
    setNotes((prevState) => prevState.filter((note) => note.id !== noteId));
  }

  async function addNote() {
    const newNote = await createNote({
      title: 'New note title',
      description: 'New note description',
    });
    setNotes((prevState) => [...prevState, newNote]);
  }

  return (
    <div className="notes-list-container">
      <h1 className="notes-list-header">My notes</h1>
      <div className="note-list-actions-container">
        <NotesFilter filterValue={tagFilter} setFilterValue={setTagFilter} />
        <Button onClick={addNote}>Create note</Button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            setTag={setTagFilter}
            onChangeNote={onChangeNote}
            removeNote={removeNote}
          />
        ))}
      </div>
    </div>
  );
}

import React, { ReactElement, Dispatch, SetStateAction, useState, ChangeEvent } from 'react';
import './styles.css';
import { INote } from './interface';
import { ITag } from '../tags/interface';
import { updateNote } from './api';
import { TagsModal } from '../tags/TagsModal';
import { ConfirmModal } from '../../component/modal/ConfirmModal';

interface IProps {
  note: INote;
  setTag: Dispatch<SetStateAction<ITag | null>>;
  onChangeNote(
    noteId: number,
    noteProperty: keyof Pick<INote, 'title' | 'description'>,
    value: string | ITag[]
  ): void;
  removeNote(noteId: number): void;
}

export function Note({ note, setTag, onChangeNote, removeNote }: IProps): ReactElement {
  const [displayActions, setDisplayActions] = useState<boolean>(false);
  const [openDeletingConfirmModal, setOpenDeletingConfirmModal] = useState<boolean>(false);
  const [openTagsModal, setOpenTagsModal] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<{ title: boolean; description: boolean }>({
    title: false,
    description: false,
  });

  function onClickTitle() {
    setIsEditing({ title: true, description: false });
  }

  function onClickDescription() {
    setIsEditing({ title: false, description: true });
  }

  function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
    setIsChanged(true);
    onChangeNote(note.id, 'title', event.target.value);
  }

  function onChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
    setIsChanged(true);
    onChangeNote(note.id, 'description', event.target.value);
  }

  function onBlur() {
    if (isChanged) {
      setIsChanged(false);
      updateNote(note.id, {
        title: note.title,
        description: note.description,
      });
    }
    setIsEditing({ title: false, description: false });
  }

  function onConfirmRemove() {
    removeNote(note.id);
  }

  return (
    <div
      className="note-container"
      onMouseEnter={() => setDisplayActions(true)}
      onMouseLeave={() => setDisplayActions(false)}
      onBlur={onBlur}
    >
      {isEditing.title ? (
        <input
          autoFocus={true}
          className="note-title-input"
          value={note.title}
          onChange={onChangeTitle}
        />
      ) : (
        <h2 className="note-title" onClick={onClickTitle}>
          {note.title}
        </h2>
      )}

      {isEditing.description ? (
        <textarea
          autoFocus={true}
          className="note-description-input"
          value={note.description}
          onChange={onChangeDescription}
        />
      ) : (
        <p className="note-description" onClick={onClickDescription}>
          {note.description}
        </p>
      )}

      <div className="note-tags-container">
        {note.tags.map((tag) => (
          <span
            key={tag.id}
            className="note-tag"
            onClick={() => setTag(tag)}
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div
        className="note-actions-container"
        style={{ visibility: displayActions ? 'initial' : 'hidden' }}
      >
        <button className="note-action-button" onClick={() => setOpenTagsModal(true)}>
          <span className="note-action-button-icon blue">#</span>
        </button>
        <button className="note-action-button" onClick={() => setOpenDeletingConfirmModal(true)}>
          <span className="note-action-button-icon red">&#10006;</span>
        </button>
      </div>

      {openDeletingConfirmModal && (
        <ConfirmModal
          setOpen={setOpenDeletingConfirmModal}
          confirmCallback={onConfirmRemove}
          message=" Are you sure you want to delete this note?"
        />
      )}

      {openTagsModal && (
        <TagsModal
          setIsOpen={setOpenTagsModal}
          noteId={note.id}
          onChangeNoteTag={onChangeNote}
          assignedTags={note.tags}
        />
      )}
    </div>
  );
}

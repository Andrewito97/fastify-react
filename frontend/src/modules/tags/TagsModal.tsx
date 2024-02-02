import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import './styles.css';
import { ITag, ITagSelected, IUpdateTag } from './interface';
import { createTag, deleteTag, getTags, updateTag } from './api';
import { Button } from '../../component/button/Button';
import { assignTags } from '../notes/api';
import { INote } from '../notes/interface';
import { Modal } from '../../component/modal/Modal';
import { createPortal } from 'react-dom';
import { Tag } from './Tag';

interface IProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  noteId: number;
  assignedTags: ITag[];
  onChangeNoteTag(
    noteId: number,
    property: keyof Pick<INote, 'title' | 'description' | 'tags'>,
    value: string | ITag[]
  ): void;
}

export function TagsModal({
  setIsOpen,
  noteId,
  assignedTags,
  onChangeNoteTag,
}: IProps): ReactElement {
  const [tags, setTags] = useState<ITagSelected[]>([]);

  useEffect(() => {
    (async function () {
      const tags = await getTags();
      setTags(() =>
        tags.map((tag) => ({
          ...tag,
          selected: assignedTags.some((assignedTag) => assignedTag.id === tag.id),
        }))
      );
    })();
  }, []);

  function onChangeTag(
    tagId: number,
    tagProperty: keyof Pick<ITag, 'name' | 'color'>,
    value: string
  ): void {
    setTags((prevState) =>
      prevState.map((tag) => (tag.id === tagId ? { ...tag, [tagProperty]: value } : tag))
    );
  }

  async function addTag() {
    const tag = await createTag({
      name: 'new tag',
      color: 'white',
    });
    setTags((prevTags) => [...prevTags, tag]);
  }

  function close() {
    setIsOpen(false);
  }

  async function save() {
    assignTags(noteId, {
      tagIds: tags.filter((t) => t.selected).map((t) => t.id) as number[],
    });
    close();
  }

  function onTagSelect(tag: ITagSelected) {
    const updatedTags = tags.map((t) => (t.id === tag.id ? { ...t, selected: !t.selected } : t));
    setTags(updatedTags);
    onChangeNoteTag(noteId, 'tags', updatedTags.filter((tag) => tag.selected) as ITag[]);
  }

  function editTag(id: number, tag: IUpdateTag) {
    updateTag(id, tag);
    onChangeNoteTag(
      noteId,
      'tags',
      tags.filter((t) => t.selected).map((t) => (t.id === id ? { ...t, ...tag } : t)) as ITag[]
    );
  }

  function removeTag(tagId: number) {
    const updatedTags = tags.filter((tag) => tag.id !== tagId);
    deleteTag(tagId);
    setTags(updatedTags);
    onChangeNoteTag(noteId, 'tags', updatedTags);
  }

  return createPortal(
    <Modal>
      <div className="tags-list ">
        <label className="tags-list-label">Available Tags:</label>
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            tag={tag}
            onTagSelect={onTagSelect}
            onChangeTag={onChangeTag}
            removeTag={removeTag}
            editTag={editTag}
          />
        ))}
      </div>
      <div className="tags-action-buttons-container">
        <button className="tags-action-button" onClick={close}>
          <span className="tags-action-button-icon red">&#10006;</span>
        </button>
        <div>
          <Button onClick={addTag}>Create</Button>
          <Button className="tags-action-button-right" onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}

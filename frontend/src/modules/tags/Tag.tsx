import React, { ChangeEvent, useState } from 'react';
import { ITag, ITagSelected, IUpdateTag } from './interface';
import { Select } from '../../component/select/Select';
import { Option } from '../../component/select/Option';
import { TAG_COLORS } from './constant';
import { ConfirmModal } from '../../component/modal/ConfirmModal';

interface IProps {
  tag: ITagSelected;
  onTagSelect(tag: ITagSelected): void;
  onChangeTag(tagId: number, tagProperty: keyof Pick<ITag, 'name' | 'color'>, value: string): void;
  editTag(id: number, tag: IUpdateTag): void;
  removeTag(tagId: number): void;
}

export function Tag({ tag, onTagSelect, onChangeTag, editTag, removeTag }: IProps) {
  const [openDeletingConfirmModal, setOpenDeletingConfirmModal] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [shouldDisplayMoreActions, setShouldDisplayMoreActions] = useState<boolean>(false);

  function onChangeName(event: ChangeEvent<HTMLInputElement>) {
    onChangeTag(tag.id, 'name', event.target.value);
  }

  function onChangeColor(event: ChangeEvent<HTMLSelectElement>) {
    onChangeTag(tag.id, 'color', event.target.value);
    editTag(tag.id, {
      name: tag.name,
      color: event.target.value,
    });
  }

  function onClickName() {
    setIsEditingName(true);
  }

  function onBlurName() {
    editTag(tag.id, {
      name: tag.name,
      color: tag.color,
    });
    setIsEditingName(false);
  }

  function onConfirmRemove() {
    removeTag(tag.id);
  }

  const checkboxId = 'tag-id-' + tag.id;

  return (
    <div
      key={tag.id}
      className="tag"
      onMouseEnter={() => setShouldDisplayMoreActions(true)}
      onMouseLeave={() => setShouldDisplayMoreActions(false)}
    >
      {isEditingName ? (
        <input
          className="tag-name-input"
          autoFocus={true}
          value={tag.name}
          onChange={onChangeName}
          onBlur={onBlurName}
          style={{ backgroundColor: tag.color }}
        />
      ) : (
        <label
          htmlFor={checkboxId}
          className="tag-label"
          onClick={onClickName}
          style={{ backgroundColor: tag.color }}
        >
          <div>{tag.name}</div>
        </label>
      )}

      <input
        className="tag-checkbox"
        onChange={() => onTagSelect(tag)}
        checked={tag.selected}
        type="checkbox"
        id={checkboxId}
      />

      <div
        className="tag-color-select-container"
        style={{ visibility: shouldDisplayMoreActions ? 'visible' : 'hidden' }}
      >
        <Select name="tag-color-select" onChange={onChangeColor}>
          {TAG_COLORS.map((color) => (
            <Option
              label=""
              value={color}
              style={{ backgroundColor: color }}
              default={color === tag.color}
              key={color}
            />
          ))}
        </Select>
      </div>

      <button
        className="tags-action-button"
        onClick={() => setOpenDeletingConfirmModal(true)}
        style={{ visibility: shouldDisplayMoreActions ? 'visible' : 'hidden' }}
      >
        <span className="tag-delete-button-icon">&#10006;</span>
      </button>

      {openDeletingConfirmModal && (
        <ConfirmModal
          setOpen={setOpenDeletingConfirmModal}
          confirmCallback={onConfirmRemove}
          message=" Are you sure you want to delete this tag?"
        />
      )}
    </div>
  );
}

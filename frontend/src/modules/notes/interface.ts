import { ITag } from '../tags/interface';

export interface INote {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  tags: ITag[];
}

export interface ICreateNote extends Pick<INote, 'title' | 'description'> {}

export interface IUpdateNote extends ICreateNote {}

export interface IAssignTags {
  tagIds: number[];
}

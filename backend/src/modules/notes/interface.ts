import { IGetTag } from '../tags/interface';

export interface INoteIdParam {
  id: string;
}

export interface IGetNote {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  tags: IGetTag[];
}

export interface ICreateNote {
  title: string;
  description: string;
}

export interface IUpdateNote extends ICreateNote {}

export interface IAssignTags {
  tagIds: number[];
}

export interface ITag {
  id: number;
  name: string;
  color: string;
}

export interface ICreateTag extends Pick<ITag, 'name' | 'color'> {}

export interface IUpdateTag extends ICreateTag {}

export interface ITagSelected extends ITag {
  selected?: boolean;
}

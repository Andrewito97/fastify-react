export interface ITagIdParam {
  id: string;
}

export interface IGetTag {
  id: number;
  name: string;
  color: string;
}

export interface ICreateTag extends Pick<IGetTag, 'name' | 'color'> {}

export interface IUpdateTag extends ICreateTag {}

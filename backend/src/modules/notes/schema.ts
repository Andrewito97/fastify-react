export const NoteSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      minLength: 3,
    },
    description: {
      type: 'string',
      minLength: 3,
    },
  },
  required: ['title', 'description'],
};

export const NoteTagsSchema = {
  type: 'object',
  properties: {
    tagIds: {
      type: 'array',
      items: {
        type: 'number',
      },
    },
  },
  required: ['tagIds'],
};

export const TagSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
  },
  required: ['name'],
};

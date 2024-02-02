import { BACKEND_URL } from '../../constants';
import { ICreateTag, ITag, IUpdateTag } from './interface';

export async function getTags(): Promise<ITag[]> {
  const response = await fetch(`${BACKEND_URL}/tags`);
  return response.json();
}

export async function createTag(data: ICreateTag) {
  const res = await fetch(`${BACKEND_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTag(id: number, data: IUpdateTag): Promise<void> {
  await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function deleteTag(id: number): Promise<void> {
  await fetch(`${BACKEND_URL}/tags/${id}`, {
    method: 'DELETE',
  });
}

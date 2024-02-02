import { BACKEND_URL } from '../../constants';
import { IAssignTags, INote, ICreateNote, IUpdateNote } from './interface';

export async function getNotes(tag?: string): Promise<INote[]> {
  const query = tag ? `?tag=${tag}` : '';
  const response = await fetch(`${BACKEND_URL}/notes${query}`, {
    method: 'GET',
  });
  return response.json();
}

export async function createNote(data: ICreateNote): Promise<INote> {
  const res = await fetch(`${BACKEND_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateNote(id: number, data: IUpdateNote): Promise<void> {
  await fetch(`${BACKEND_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function deleteNote(id: number): Promise<void> {
  await fetch(`${BACKEND_URL}/notes/${id}`, {
    method: 'DELETE',
  });
}

export async function assignTags(noteId: number, tags: IAssignTags): Promise<void> {
  await fetch(`${BACKEND_URL}/notes/${noteId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tags),
  });
}

import { NoteInterface } from '../interfaces/NoteInterface';

class Note implements NoteInterface {
  public id: number;
  public body: string;
  public title: string;
  public archived: boolean;
  public createdAt: number | string;

  constructor({
    id,
    body,
    title,
    archived,
    createdAt,
  }: NoteInterface) {
    this.id = id;
    this.body = body;
    this.title = title;
    this.archived = archived;
    this.createdAt = createdAt;
  }
}

export { Note }
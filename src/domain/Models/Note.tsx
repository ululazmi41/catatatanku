import { NoteInterface } from '../interfaces/NoteInterface';

class Note implements NoteInterface {
  public id: number;
  public body: string;
  public title: string;
  public archived: boolean;
  public deleted: boolean;
  public deleteAt: string | number | null;
  public createdAt: number | string;

  constructor({
    id,
    body,
    title,
    archived,
    deleted,
    deleteAt,
    createdAt,
  }: NoteInterface) {
    this.id = id;
    this.body = body;
    this.title = title;
    this.archived = archived;
    this.createdAt = createdAt;
    this.deleted = deleted;
    this.deleteAt = deleteAt;
  }
}

export { Note }
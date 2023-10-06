interface NoteInterface {
  id: number;
  title: string;
  body: string;
  archived: boolean;
  deleted: boolean;
  deleteAt: number | string | null;
  createdAt: number | string;
}

export type { NoteInterface };
interface NoteInterface {
  id: number;
  title: string;
  body: string;
  createdAt: number | string;
  archived: boolean;
}

export type { NoteInterface };
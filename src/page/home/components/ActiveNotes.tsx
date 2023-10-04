import React from "react";
import { showFormattedDate } from "../../../utils";
import NoteItem from "./NoteItem";
import note2 from "../../../public/note-2.svg";
import Loading from "../../../components/Loading";
import { NoteInterface } from "../../../domain/interfaces/NoteInterface";

function renderLoading(isLoading: boolean, isBlur: boolean) {
  if (isLoading && isBlur) {
    return <Loading />;
  } else if (isLoading) {
    return <Loading isNoBlur={true} />;
  } else {
    //
  }
}

function ActiveNotes({
  notes,
  isLoading,
  isBlur,
  navigateTo,
  onDelete,
  onToggleArchive,
} : {
  notes: NoteInterface[],
  isLoading: boolean,
  isBlur: boolean,
  navigateTo: (page: string) => void,
  onDelete: (id: number) => void,
  onToggleArchive: (id: number) => Promise<void>,
}) {
  if (notes.length > 0) {
    return (
      <div className="notes-list">
        {renderLoading(isLoading, isBlur)}
        {notes.map((note) => (
          <NoteItem
            id={note.id}
            key={note.title}
            title={note.title}
            date={showFormattedDate(note.createdAt)}
            body={note.body}
            archived={note.archived}
            navigateTo={navigateTo}
            onDelete={onDelete}
            onToggleArchive={onToggleArchive}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="notes-list__empty-message">
      {renderLoading(isLoading, isBlur)}
      <img src={note2} alt="tidak ada catatan" />
      <p>Tidak ada catatan</p>
    </div>
  );
}

export default ActiveNotes;

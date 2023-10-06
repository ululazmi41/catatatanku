import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import { showFormattedDate } from "../utils";
import Loading from "../components/Loading";
import { Note } from "../domain/Models/Note";
import { NoteInterface } from "../domain/interfaces/NoteInterface";
import { Showing } from "../domain/enums/ShowingEnum";

const CHARSLENGTH = 50;

enum NoteState {
  New,
  Update,
}

function NotePage({
  getNoteById,
  renderLoading,
  handleSubmit,
  handleUpdate,
  navigateTo,
  setShowing,
  isLoading,
}: {
  getNoteById: (id: number) => Note | null;
  renderLoading: (ms: number) => void;
  handleSubmit: (title: string, body: string) => void;
  handleUpdate: (note: NoteInterface) => void;
  navigateTo: (page: string) => void;
  setShowing: React.Dispatch<React.SetStateAction<Showing>>;
  isLoading: boolean;
}) {
  const defaultNote = new Note({
    id: -1,
    body: "",
    title: "",
    archived: false,
    createdAt: +new Date(),
    deleted: false,
    deleteAt: null,
  });

  const [note, setNote] = useState<NoteInterface>(defaultNote);
  const [state, setState] = useState(NoteState.New);
  const [charsLeft, setCharsLeft] = useState(CHARSLENGTH);

  // Booleans
  const [isContentEdited, setIsContentEdited] = useState(false);

  useEffect(() => {
    const noteIndex = getCurrentNoteIndex();
    const index = parseInt(noteIndex);
    const note = getNoteById(index);

    if (note === null || note === undefined) {
      return;
    }

    setNote(note)
    setState(NoteState.Update);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentNoteIndex = () => {
    const url = window.location.pathname;
    const index = url.split("/")[2];
    return index;
  };

  const handleFormSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await renderLoading(750);
    if (state === NoteState.New) {
      handleSubmit(note!.title, note!.body);
    } else if (state === NoteState.Update) {
      handleUpdate(note!);
    }
    navigateTo("");
    setShowing(Showing.Notes);
  };

  const onTitleChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isContentEdited) {
      setIsContentEdited(true);
    }

    if (event.target.value.length > CHARSLENGTH) {
      setCharsLeft(0);
      return;
    }

    setNote({
      ...note,
      title: event.target.value,
      createdAt: +new Date(),
    });

    const charsLeft = CHARSLENGTH - event.target.value.length;
    setCharsLeft(charsLeft);
  };

  const onBodyChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (!isContentEdited) {
      setIsContentEdited(true);
    }

    setNote({
      ...note,
      body: event.target.value,
      createdAt: +new Date(),
    });

    recalculateTextareaHeight();
  };

  const recalculateTextareaHeight = () => {
    const textarea = document.querySelector("#isi") as HTMLTextAreaElement;
    const noteInput = document.querySelector(".note-input") as HTMLFormElement;
    const wrapper = document.createElement("div") as HTMLDivElement;
    wrapper.style.maxWidth = noteInput!.style.maxWidth;

    const copyTextarea = document.createElement("textarea");
    const defaultHeight = 150; // 150px
    copyTextarea.style.width = textarea.style.width;

    // Salin teks ke textarea rekayasa
    copyTextarea.value = textarea.value;

    wrapper.appendChild(copyTextarea);
    document.querySelector("body")!.appendChild(wrapper);

    // ambil tingginya
    const height = copyTextarea.scrollHeight - defaultHeight + 150;

    // Set ulang tinggi di textarea catatan
    textarea.style.height = `${height}px`;

    wrapper.removeChild(copyTextarea);
    document.querySelector("body")!.removeChild(wrapper);
  };

  const renderCharsLeft = () => {
    const stillEmpty = charsLeft === CHARSLENGTH;
    const twentiesAndBelow = charsLeft <= 20 && charsLeft > 0;
    const moreThanTen = charsLeft > 0;

    if (stillEmpty) {
      return (
        <p className="note-input__title__char-limit tw-text-transparent">
          placeholder
        </p>
      );
    } else if (twentiesAndBelow) {
      return (
        <p className="note-input__title__char-limit tw-text-brown">
          {charsLeft}
        </p>
      );
    } else if (moreThanTen) {
      return (
        <p className="note-input__title__char-limit tw-text-grey">
          {charsLeft}
        </p>
      );
    } else {
      return (
        <p className="note-input__title__char-limit tw-text-red">{charsLeft}</p>
      );
    }
  };

  return (
    <>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      <Header />
      <form className="note-input" onSubmit={handleFormSubmit}>
        {renderCharsLeft()}
        <input
          id="judul"
          type="text"
          name="judul"
          placeholder="Judul"
          value={note.title}
          className={note.archived
            ? "note-input__title tw-cursor-default"
            : "note-input__title"}
          onChange={onTitleChangeHandler}
          readOnly={note.archived}
          required
        />
        <div className="note-input__date-wrapper">
          <p id="tanggal" className="note-input__date">
            {showFormattedDate(note.createdAt)}
          </p>
          {note.archived && <div className="tag">Arsip</div>}
        </div>
        <textarea
          id="isi"
          name="isi"
          value={note.body}
          className={note.archived
            ? "note-input__body tw-cursor-default"
            : "note-input__body"}
          placeholder="Catatan"
          onChange={onBodyChangeHandler}
          readOnly={note.archived}
          required
        />
        {isContentEdited && (
          state === NoteState.New
            ? <button type="submit">Simpan</button>
            : <button type="submit">Perbarui</button>
        )}
      </form>
    </>
  );
}

export default NotePage;

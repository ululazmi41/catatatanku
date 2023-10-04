import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import Header from "../../layout/Header";
import NoteSearch from "./components/NoteSearch";
import ActiveNotes from "./components/ActiveNotes";
import { showFormattedDate } from "../../utils";
import { Showing } from "../../domain/enums/ShowingEnum";
import { NoteInterface } from "../../domain/interfaces/NoteInterface";

function Home({
  showing,
  notes,
  setNotes,
  onDelete,
  addToaster,
  navigateTo,
  setShowing,
  renderLoading,
}: {
  notes: NoteInterface[];
  showing: Showing;
  setNotes: Dispatch<SetStateAction<NoteInterface[]>>;
  setShowing: Dispatch<SetStateAction<Showing>>;
  onDelete: (id: number) => void;
  addToaster: (type: string) => void;
  navigateTo: (page: string) => void;
  renderLoading: (ms: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [isBlur, setIsBlur] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    resetNavigationButton(showing);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetNavigationButton = (showing: Showing) => {
    const notes = document.querySelector("#notes");
    const archives = document.querySelector("#archives");

    if (showing === Showing.Notes) {
      if (notes) {
        notes.className = "notes-app__button notes-app__button__selected";
      } else {
        throw new Error(`Notes element not found: ${notes}`);
      }

      if (archives) {
        archives.className = "notes-app__button notes-app__button__idle";
      } else {
        throw new Error(`Archives element not found: ${archives}`);
      }
    } else if (showing === Showing.Archives) {
      if (notes) {
        notes.className = "notes-app__button notes-app__button__idle";
      } else {
        throw new Error(`Notes element not found: ${notes}`);
      }

      if (archives) {
        archives.className = "notes-app__button notes-app__button__selected";
      } else {
        throw new Error(`Archives element not found: ${archives}`);
      }
    } else if (showing === Showing.Bin) {
      // TODO:
      console.log("Unimplemented Code");
    } else {
      throw new Error(`Unknown showing notes: ${showing}`);
    }
  };

  /**
   * Search
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const lowercasedValue = event.target.value.toLowerCase();
    setSearch(lowercasedValue);
  };

  const handleDelete = async (id: number) => {
    setIsBlur(true);

    await renderLoadingNote(400);
    onDelete(id);
  };

  /**
   * Note Pages
   */
  const renderLoadingNote = (ms: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, _) => {
        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);

          resolve(true);
        }, ms);
    });
  };

  const onToggleArchive = async (id: number) => {
    setIsBlur(true);

    await renderLoadingNote(400);
    const copiedNotes = notes.slice();
    const index = copiedNotes.findIndex((note) => note.id === id);
    copiedNotes[index].archived = !copiedNotes[index].archived;
    if (copiedNotes[index].archived) {
      console.log(`Archiving note with id of ${id}`);

      addToaster("archive");
    } else {
      console.log(`Unarchiving note with id of ${id}`);

      addToaster("restore");
    }

    setNotes(copiedNotes);
  };

  const showNotes = async () => {
    setIsBlur(false) // TODO: Simplify
    resetNavigationButton(Showing.Notes)

    await renderLoadingNote(750)
    setShowing(Showing.Notes)
  };

  const showArchives = async () => {
    setIsBlur(false) // TODO: simplify
    resetNavigationButton(Showing.Archives)
    
    await renderLoadingNote(750)
    setShowing(Showing.Archives)
  };

  /**
   * Handle Notes to Render
   */
  const handleNotes = () => {
    let innerNotes: NoteInterface[] = [];
    let archives: NoteInterface[] = [];

    if (search === "") {
      innerNotes = notes.filter((note) => note.archived === false);
      archives = notes.filter((note) => note.archived === true);
    } else {
      const tempNotes = notes.filter((note) => note.archived === false);
      innerNotes = tempNotes.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase()
          .includes(search);
        const isIncludingBody = note.body.toLowerCase().includes(search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      });

      const tempArchives = notes.filter((note) => note.archived === true);
      archives = tempArchives.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(search);
        const isIncludingDate = showFormattedDate(note.createdAt).toLowerCase()
          .includes(search);
        const isIncludingBody = note.body.toLowerCase().includes(search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      });
    }

    if (showing === Showing.Notes) {
      return innerNotes;
    } else if (showing === Showing.Archives) {
      return archives;
    } else {
      return [];
    }
  };

  const handleNavigateToAdd = async () => {
    await renderLoading(250)
    navigateTo('note')
  };

  return (
    <>
      <Header />
      <main className="note-app__body">
        <button
          className="notes-app__body__button-add"
          onClick={handleNavigateToAdd}
        >
          Tambah
        </button>
        <div className="note-app__body__actions">
          <div className="note-app__body__buttons">
            <button id="notes" onClick={showNotes} className="">
              Catatan
            </button>
            <button id="archives" onClick={showArchives} className="">
              Arsip
            </button>
          </div>
          <NoteSearch onChange={handleSearch} />
        </div>
        <ActiveNotes
          notes={handleNotes()}
          isBlur={isBlur}
          onDelete={handleDelete}
          isLoading={isLoading}
          navigateTo={navigateTo}
          onToggleArchive={onToggleArchive}
        />
      </main>
    </>
  );
}

export default Home;

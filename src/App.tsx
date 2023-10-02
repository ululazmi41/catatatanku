import { ReactElement, useState } from "react";

// Utils
import { getInitialData, showFormattedDate } from "./utils/index.js";

// Pages
import NotePage from "./page/Note.jsx";
import HomePage from "./page/home/Home.jsx";

// Components
import Loading from "./components/Loading.js";
import Toasters from "./components/Toasters.jsx";

// Toasters
import ToasterAdded from "./components/toaster/ToasterAdded.jsx";
import ToasterEdited from "./components/toaster/ToasterEdited.jsx";
import ToasterDeleted from "./components/toaster/ToasterDeleted.jsx";
import ToasterArchived from "./components/toaster/ToasterArchived.jsx";
import ToasterRestored from "./components/toaster/ToasterRestored.jsx";

// Style
import "./App.css";

// Interfaces
import { Note } from "./domain/interfaces/NoteInterface.js";
import { Toaster } from "./domain/interfaces/ToasterInterface.js";

// Enums
import { Page } from "./domain/enums/PageEnum.js";
import { Showing } from "./domain/enums/ShowingEnum.js";

function App() {
  const [page, setPage] = useState<Page>(Page.Home);
  const [notes, setNotes] = useState<Note[]>(getInitialData());
  const [showing, setShowing] = useState<Showing>(Showing.Notes);
  const [toasters, setToasters] = useState<Toaster[]>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: number) => {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);

    addToaster("delete");
    console.log(`Note with id of ${id} deleted`);
  };

  const addToaster = (type: string) => {
    const id = crypto.randomUUID();
    let toaster = null;

    if (type === "add") {
      toaster = <ToasterAdded id={id} />;
    } else if (type === "edit") {
      toaster = <ToasterEdited id={id} />;
    } else if (type === "archive") {
      toaster = <ToasterArchived id={id} />;
    } else if (type === "restore") {
      toaster = <ToasterRestored id={id} />;
    } else if (type === "delete") {
      toaster = <ToasterDeleted id={id} />;
    } else {
      throw new Error(`Error when adding toaster: Unknown type of ${type}`);
    }

    const data: Toaster = {
      id: id,
      element: toaster,
    };

    setToasters([
      ...toasters ?? [],
      data,
    ]);

    setTimeout(() => {
      const copy = toasters?.slice() ?? [];
      const filtered = copy.filter((toaster) => toaster.id !== id);

      setToasters(filtered);
    }, 2000);
  };

  const navigateTo = (page: string) => {
    const processed = page.includes("/") ? page.split("/")[0] : page;
    history.pushState({}, "", `/${page}`);

    if (processed === "") {
      setPage(Page.Home);
    } else if (processed === "notes") {
      setPage(Page.Notes);
    } else {
      throw new Error(`navigateTo: Error -> Unknown page: ${page}`);
    }
  };

  const renderLoading = (ms: number) => {
    return new Promise((resolve, _) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        resolve(true);
      }, ms ? ms : 750);
    });
  };

  const getNoteById = (id: number) => {
    const note = notes.find((note) => note.id === id);
    return note;
  };

  const handleSubmit = (title: string, content: string) => {
    const newNote: Note = {
      id: +new Date(),
      title: title,
      body: content,
      createdAt: showFormattedDate(+new Date()),
      archived: false,
    };

    setNotes([
      ...notes ?? [],
      newNote,
    ]);

    addToaster("add");
    console.log(`New note added witb title: ${title}`);
  };

  const handleUpdate = (note: Note) => {
    const copyNotes = notes.slice();
    const noteIndex = copyNotes.findIndex((innerNote) =>
      innerNote.id === note.id
    );

    copyNotes[noteIndex] = note;
    setNotes(copyNotes);

    addToaster("edit");
    console.log(`note updated witb title: ${note.title}`);
  };

  const renderPage = (): ReactElement => {
    if (page === Page.Home) {
      return (
        <HomePage
          notes={notes}
          showing={showing}
          onDelete={handleDelete}
          addToaster={addToaster}
          navigateTo={navigateTo}
          setShowing={setShowing}
          renderLoading={renderLoading}
        />
      );
    } else if (page === Page.Notes) {
      return (
        <NotePage
          navigateTo={navigateTo}
          setShowing={setShowing}
          getNoteById={getNoteById}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          renderLoading={renderLoading}
        />
      );
    } else {
      return <>404 Page not Found</>;
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Toasters toasters={toasters ?? []} />
      {renderPage()}
    </>
  );
}

export default App;

import React from 'react';
import note from '../public/note.svg';

function Header() {
  return (
    <header className="note-app__header">
      <img className="note-app__header__logo" src={note} alt="gambar logo website" />
      <h1>Catatanku</h1>
    </header>
  )
}

export default Header;
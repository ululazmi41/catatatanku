import React from 'react';

function NoteSearch({ onChange }) {
  return (
    <form className='note-search' onChange={onChange} onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="kueri" id="kueri" placeholder='Cari catatan ...' />
    </form>
  );
}

export default NoteSearch;
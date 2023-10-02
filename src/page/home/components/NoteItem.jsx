import React from 'react';

import iconDelete from '../../../public/delete.svg';
import iconArchive from '../../../public/bookmark.svg';
import iconRestore from '../../../public/back-arrow.svg';

function handleNoteItemOnKeyDown(e, id, navigateTo) {
  const isNoteItemSelected = document.activeElement === document.getElementById(id);
  if (e.code === 'Enter' && isNoteItemSelected) {
    navigateTo(`note/${id}`);
  }
}

function NoteItem({
  id,
  title,
  date,
  body,
  archived,
  onDelete,
  navigateTo,
  onToggleArchive,
}) {
  return (
    <div id={id} className="note-item" tabIndex={0} onKeyDown={(e) => handleNoteItemOnKeyDown(e, id, navigateTo)}>
      <div className="note-item__content">
        <h3 className='note-item__title' onClick={() => navigateTo(`note/${id}`)}>{title}</h3>
        <p className="note-item__date" onClick={() => navigateTo(`note/${id}`)}>{date}</p>
        <p className="note-item__body" onClick={() => navigateTo(`note/${id}`)}>{body}</p>
      </div>
      <div className="note-item__action">
        <button className="note-item__delete-button" onClick={() => onDelete(id)}>
          <img src={iconDelete} width="22px" />
        </button>
        <button className="note-item__archive-button" onClick={() => onToggleArchive(id)}>
          {archived
            ? <img src={iconRestore} width="22px" />
            : <img src={iconArchive} width="22px" />
          }
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
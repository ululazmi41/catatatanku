import React from 'react';
import iconCheck from '../../public/toaster-check.svg';

function ToasterDeleted({ id }) {
  return (
    <div id={id} className='toaster'>
      <div className='toaster__icon toaster__icon-deleted'>
        <img src={iconCheck} />
      </div>
      <div className="toaster__body-wrapper">
        <div className='toaster__body toaster__body-deleted'>Catatan telah dihapus</div>
        <div className='toaster-indicator toaster__indicator-deleted'></div>
      </div>
    </div>
  );
}

export default ToasterDeleted;
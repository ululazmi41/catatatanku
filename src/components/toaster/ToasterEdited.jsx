import React from 'react';
import iconCheck from '../../public/toaster-check.svg';

function ToasterEdited({ id }) {
  return (
    <div id={id} className='toaster'>
      <div className='toaster__icon toaster__icon-edited'>
        <img src={iconCheck} />
      </div>
      <div className="toaster__body-wrapper">
        <div className='toaster__body toaster__body-edited'>Catatan diperbarui</div>
        <div className='toaster-indicator toaster__indicator-edited'></div>
      </div>
    </div>
  );
}

export default ToasterEdited;
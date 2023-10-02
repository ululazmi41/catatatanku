import React from 'react';
import iconCheck from '../../public/toaster-check.svg';

function ToasterAdded({ id }) {
  return (
    <div id={id} className='toaster'>
      <div className='toaster__icon toaster__icon-added'>
        <img src={iconCheck} />
      </div>
      <div className="toaster__body-wrapper">
        <div className='toaster__body toaster__body-added'>Catatan ditambahkan</div>
        <div className='toaster-indicator toaster__indicator-added'></div>
      </div>
    </div>
  );
}

export default ToasterAdded;
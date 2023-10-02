import React from 'react';
import iconCheck from '../../public/toaster-check.svg';

function ToasterRestored({ id }) {
  return (
    <div id={id} className='toaster'>
      <div className='toaster__icon toaster__icon-restored'>
        <img src={iconCheck} />
      </div>
      <div className="toaster__body-wrapper">
        <div className='toaster__body toaster__body-restored'>Catatan dipulihkan</div>
        <div className='toaster-indicator toaster__indicator-restored'></div>
      </div>
    </div>
  );
}

export default ToasterRestored;
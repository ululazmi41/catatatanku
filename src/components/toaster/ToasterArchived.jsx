import React from 'react';
import iconCheck from '../../public/toaster-check.svg';

function ToasterArchived({ id }) {
  return (
    <div id={id} className='toaster'>
      <div className='toaster__icon toaster__icon-archived'>
        <img src={iconCheck} />
      </div>
      <div className="toaster__body-wrapper">
        <div className='toaster__body toaster__body-archived'>Catatan telah diarsip</div>
        <div className='toaster-indicator toaster__indicator-archived'></div>
      </div>
    </div>
  );
}

export default ToasterArchived;
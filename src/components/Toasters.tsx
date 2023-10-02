import React from 'react';
import { Toaster } from '../domain/interfaces/ToasterInterface';

function Toasters({ toasters } : { toasters: Toaster[] }) {
  return (
    <div className='toaster-wrapper'>
      <div className="toasters">
        {toasters.map((toaster) => (
          <React.Fragment key={toaster.id}>
            {toaster.element}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Toasters;

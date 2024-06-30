import React from 'react';

function ProcessingButton({ onProcess }) {
  return (
    <button onClick={onProcess}>Process Document</button>
  );
}

export default ProcessingButton;

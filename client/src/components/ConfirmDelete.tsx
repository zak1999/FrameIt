import React from 'react';
import { ReactNode } from 'react';

type ConfirmDeleteProps = {
  functionIfYes:() => void;
  functionIfNo: (x : boolean) => void;
}

export default function ConfirmDelete({functionIfNo,functionIfYes}: ConfirmDeleteProps) : JSX.Element {
  return (
    <div className="wrapConfirm">
      <button
        className="confirmYes vibrate"
        onClick={() => functionIfYes()}
      >
        YES
      </button>
      <button
        className="confirmNo"
        onClick={() => functionIfNo(false)}
      >
        NO
      </button>
    </div>
  )
}

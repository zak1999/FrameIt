import React from 'react'
import ConfirmDelete from './ConfirmDelete';

type DashButtonsProps = {
  handleRedirect: () => void;
  setAskConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  confirm: () => void;
  askConfirm: boolean;
}

export default function DashButtons({handleRedirect, setAskConfirm, handleDelete, confirm, askConfirm} : DashButtonsProps): JSX.Element {
  return (
    <div className="dashButtons">
      <button id='go-to-ur-party-btn'  className="mainButton" onClick={handleRedirect}>
        GO TO UR PARTY
      </button>
      <button
        className={
          askConfirm ? 'mainButton invisible' : 'mainButton'
        }
        id='delete-btn'
        onClick={confirm}
      >
        DELETE CURRENT PARTY
      </button>
      <div
        className={
          askConfirm ? 'askConfirm' : 'invisible askConfirm'
        }
      >
        ARE YOU SURE?
        <ConfirmDelete functionIfNo={setAskConfirm} functionIfYes={handleDelete}/>
      </div>
    </div>
  )
}

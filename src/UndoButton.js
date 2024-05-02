import React from 'react';
import './styles/switch.css'

function UndoButton({ undoAction, state }) {
    // checked={selectMode} onChange={change}
    return (
        <div>
            <button onClick={undoAction} disabled={state}>DesHacer</button>
        </div>
    );
}

export default UndoButton;
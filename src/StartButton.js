import React from 'react';
import './styles/startButton.css'

function StartButton({ onClick }) {
    return (
        <button className="pushable"  style={{margin:"10px"}} onMouseUp={onClick}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">
                Play
            </span>
        </button>
    );
}

export default StartButton;
import React from 'react';
import './styles/startButton.css'

function StartButton({ onClick }) {
    return (
        <button class="pushable"  style={{margin:"10px"}} onMouseUp={onClick}>
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front">
                Play
            </span>
        </button>
    );
}

export default StartButton;
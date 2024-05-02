import React from 'react';
import './styles/square.css'

function Square({ value, onClick, gameStatus, overMouse, leaveMouse, index }) {
    let select = value === "#";
    let xMark = value === "X";
    
    return (
        <button className={`square`} onMouseDown={onClick} onMouseEnter={overMouse} onMouseUp={leaveMouse} onDrag={(e)=>e.preventDefault}>
            <div
                className={`select ${select ? "selectPopIn" : "selectPopOut"} ${gameStatus && select ? "animationSquare" : ""}`}
                // timing params for brazilian phonk are 500 in square and 2seconds in animation css
                style={{ animationDelay: `${gameStatus && select ? (index * 100) : 0}ms` }}>
            </div>
            <i className={`fa-solid fa-xmark ${xMark ? "popIn" : "popOut"}`}></i>
        </button>
    );
}

export default Square;
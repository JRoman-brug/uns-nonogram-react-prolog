import React from 'react';

function Square({ value, onClick, gameStatus, index }) {

    let select = value === "#";
    let xMark = value === "X";
    return (
        <button className={`square`} onClick={onClick} >
            <div
                className={`select ${select ? "selectPopIn" : "selectPopOut"} ${gameStatus && select ? "animationSquare" : ""}`}
                style={{ animationDelay: `${gameStatus && select ? (index * 10) : 0}ms` }}>

            </div>
            <i className={`fa-solid fa-xmark ${xMark ? "popIn" : "popOut"}`}></i>
        </button>
    );
}

export default Square;
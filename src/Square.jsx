import React from 'react';

function Square({ value, onClick , color}) {
    let select = "";
    let xMark = "";

    if(value === "_") {
        select = ""
        xMark = "popOut";
    }
    else if(value === "#") {
        select = "select"
        xMark = "popOut";
    }
    else if(value === "X") {
        select = "";
        xMark = "popIn";
    }

    return (
        <button className={`square ${select}`} onClick={onClick} style={{background:color}} >
           <i className={`fa-solid fa-xmark ${xMark}`}></i>
        </button>
    );
}

export default Square;
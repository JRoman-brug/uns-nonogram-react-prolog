import React from 'react';

function Square({ value, onClick , color}) {
    let select = "";
    let xMark = "";

    // rework
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
        <button className={`square ${select} `} onClick={onClick} >
           <i className={`fa-solid fa-xmark ${xMark}`}></i>
        </button>
    );
}

export default Square;
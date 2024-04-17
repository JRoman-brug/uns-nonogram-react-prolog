import React from 'react';

function Square({ value, onClick}) {
    let select = "";
    let xMark = "";
    switch(value){
        case "_":{
            select = ""
            xMark = "popOut";
            break;
        }
        case "#":{
            select = "select"
            xMark = "popOut";
            break;
        }
        case "X":{
            select = "";
            xMark = "popIn";
            break;
        }
    }
    return (
        <button className={`square ${select}`}  onClick={onClick} >
           <i className={`fa-solid fa-xmark ${xMark}`}></i>
        </button>
    );
}

export default Square;
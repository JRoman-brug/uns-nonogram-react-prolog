import React from 'react';

function Square({ value, onClick}) {
    let select = "";
    let xMark = "";
    switch(value){
        case "_":{
            select = "selectPopOut"
            xMark = "popOut";
            break;
        }
        case "#":{
            select = "selectPopIn"
            xMark = "popOut";
            break;
        }
        case "X":{
            select = "selectPopOut";
            xMark = "popIn";
            break;
        }
        default:{
            select = "selectPopOut"
            xMark = "popOut";
        }
    }
    return (
        <button className={`square`}  onClick={onClick} >
           <div className={`select ${select}`}></div> 
           <i className={`fa-solid fa-xmark ${xMark}`}></i>
        </button>
    );
}

export default Square;
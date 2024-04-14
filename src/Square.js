import React from 'react';

function Square({ value, onClick }) {
    let select = "";
    let xMark = "";
    if(value === "#") select = "select"
    if(value == "X") xMark = "popIn";
    else xMark = "popOut" 
    function actualizar(){
        console.log(select)
        onClick()
    }

    
    return (
        <button className={`square ${select}`} onClick={actualizar} >
           <i class={`fa-solid fa-xmark ${xMark}`}></i>
        </button>
    );
}

export default Square;
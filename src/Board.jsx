import React, { useRef, useState, useEffect } from 'react';
import Square from './Square';
import Clue from './Clue';

function Board({ grid, rowsClues, colsClues, onClick }) {
    const numOfRows = grid.length;
    const numOfCols = grid[0].length;
    const [color, setColor] = useState(Array(numOfRows).fill(Array(numOfCols).fill("")));

    useEffect(() => {
        const interval = setInterval(() => {
            setColor("asd");
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);


    // function animation() {
    //     const colores = ["red", "orange", "yellow", "green", "blue", "indigo", "lightgray"]
    //     let delay = 0;
    //     let newColor = [];
    //     color.forEach(elem=>{
    //         newColor.push([...elem])
    //     });
    //     for (let i = 0; i < color[0].length; i++) {
    //         for (let j = 0; j < color.length; j++) {
    //             setTimeout(()=>{
    //                 newColor[i][j] = "blue"
    //             },delay);
    //             delay+=1000;
    //         }
    //     }
    //     setColor(newColor);
    // }

    // rework
    function addColores(i, j) {
        let newColor = [];
        color.forEach((e) => {
            newColor.push([...e])
        })
        newColor[i][j] = "blue";
        setColor(newColor);
    }

    // Rework
    function maxNumClue(arregloDeArreglos) {
        let longitudMaxima = 0;

        for (let subarreglo of arregloDeArreglos) {
            if (subarreglo.length > longitudMaxima) {
                longitudMaxima = subarreglo.length;

            }
        }
        return longitudMaxima;
    }
    const maxNumClueRow = maxNumClue(rowsClues);
    const maxNumClueColumn = maxNumClue(colsClues);



    const sizeClueColumn = maxNumClueColumn * 35;
    const sizeClueRow = maxNumClueRow * 30;

    //     60px  40px 40px 40px 40px 40px 40px 40px   (gridTemplateColumns)
    //     ______ ____ ____ ____ ____ ____ ____ ____
    //    |      |    |    |    |    |    |    |    |  60px
    //    |      |    |    |    |    |    |    |    |  (gridTemplateRows)
    //     ------ ---- ---- ---- ---- ---- ---- ---- 
    const sizeButton = 50;

    // size of all buttons + size of gap + size of padding
    const sizeColumsGrid = numOfCols * (sizeButton) + (numOfCols - 1) * 10 + 20;
    const sizeRowsGrid = numOfRows * (sizeButton) + (numOfRows - 1) * 10 + 20;

    const styleContainer = {
        gridTemplateRows: `${sizeClueColumn}px ${sizeRowsGrid}px`,
        gridTemplateColumns: `${sizeClueRow}px ${sizeColumsGrid}px`,
    }
    const styleColumnsClues = {
        gridTemplateRows: `${sizeClueColumn}px`,
        gridTemplateColumns: `repeat(${numOfCols}, ${sizeButton}px)`
    }
    const styleRowsClues = {
        gridTemplateRows: `repeat(${numOfRows}, ${sizeButton}px)`,
        gridTemplateColumns: `${sizeClueRow}px`
    }
    const styleBoard = {
        gridTemplateRows: `repeat(${numOfRows}, ${sizeButton}px)`,
        gridTemplateColumns: `repeat(${numOfCols}, ${sizeButton}px)`,
        width: `${sizeColumsGrid}px`,
        height: `${sizeRowsGrid}px`
    }


    return (
        <div className='container' style={styleContainer}>
            <div></div>
            <div className="colClues" style={styleColumnsClues}>
                {colsClues.map((clue, i) =>
                    <Clue clue={clue} key={i} />
                )}
            </div>

            <div className="rowClues">
                {rowsClues.map((clue, i) =>
                    <Clue clue={clue} key={i} />
                )}
            </div>

            <div className="board" style={styleBoard}>
                {grid.map((row, i) =>
                    row.map((cell, j) =>
                        <Square
                            value={cell}
                            onClick={() => {
                                onClick(i, j)
                            }}
                            key={i + j}
                        />
                    )
                )}
            </div>
        </div>
    );
}
function prueba() {
    console.log();
}
export default Board;
import React, { useRef, useEffect, useState } from 'react';
// import PengineClient from './PengineClient';
import Board from './Board';

// let pengine;

function Game() {
  // let gridCols = 8;
  // let gridRows = 8;
  // let clue = 4;
  // // State
  // const [grid, setGrid] = useState(Array(gridRows).fill(Array(gridCols).fill("_")));
  // const [rowsClues, setRowsClues] = useState(Array(gridRows).fill(Array(clue).fill("1")));
  // const [colsClues, setColsClues] = useState(Array(gridCols).fill(Array(clue).fill("1")));

  const [win, setWin] = useState(false);
  // const [grid, setGrid] = useState(null);
  // const [rowsClues, setRowsClues] = useState(null);
  // const [colsClues, setColsClues] = useState(null);
  // const [waiting, setWaiting] = useState(false);
  const [grid, setGrid] = useState(null);
  const [rowsClues, setRowsClues] = useState(null);
  const [colsClues, setColsClues] = useState(null);
  const [colsCluesState, setColsCluesState] = useState(Array(5).fill(false));
  const [rowsCluesState, setRowsCluesState] = useState(Array(5).fill(false));
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // Creation of the pengine server instance.    
    // This is executed just once, after the first render.    
    // The callback will run when the server is ready, and it stores the pengine instance in the pengine variable. 
    PengineClient.init(handleServerReady);
  }, []);

  function handleServerReady(instance) {
    pengine = instance;
    const queryS = 'init(RowClues, ColumClues, Grid)';
    pengine.query(queryS, (success, response) => {
      if (success) {
        setGrid(response['Grid']);
        setRowsClues(response['RowClues']);
        setColsClues(response['ColumClues']);
      }
    });
  }

  // <---For dev (remove)------------

  function testWin() {
    setWin(true)
  }

  const [selectMode, setSelectMode] = useState(true);
  function changeMode() {
    setSelectMode(selectMode ? false : true);
  }


  function handleClick(i, j) {
    // No action on click if we are waiting.
    if (waiting) {
      return;
    }
    console.log(i+"--"+j);
    // Build Prolog query to make a move and get the new satisfacion status of the relevant clues.    
    const squaresS = JSON.stringify(grid).replaceAll('"_"', '_'); // Remove quotes for variables. squares = [["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]]
    
    let content // Content to put in the clicked square.
    if(selectMode) content = "#";
    else content = "X";
    const rowsCluesS = JSON.stringify(rowsClues);
    const colsCluesS = JSON.stringify(colsClues);
    const queryS = `put("${content}", [${i},${j}], ${rowsCluesS}, ${colsCluesS}, ${squaresS}, ResGrid, RowSat, ColSat)`; // queryS = put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    setWaiting(true);
    pengine.query(queryS, (success, response) => {
      if (success) {
        setGrid(response['ResGrid']);
        let newRowsStates = [...rowsCluesState];
        newRowsStates[i] = response['RowSat']===1;
        setRowsCluesState(newRowsStates);

        let newClueStates = [...colsCluesState];
        newClueStates[j] = response['ColSat']===1;
        setColsCluesState(newClueStates);
      }
      setWaiting(false);
    });
    setGrid(newGrid);
  }
  // const [color, setColor] = useState(Array(gridRows).fill(Array(gridCols).fill(null)));
  // function winAnimation() {
  //   const colores = ["red", "orange", "yellow", "green", "blue", "indigo"];
  //   let delay = 0;

  //   colores.forEach(c => {
  //     for (let i = 0; i < gridCols; i++) {
  //       for (let j = 0; j < gridRows; j++) {

  //         setTimeout(() => {
  //           setColor(colorTestValue => {
  //             let newColorTest = copyColor(colorTestValue);
  //             newColorTest[i][j] = c;
  //             return newColorTest;
  //           });
  //         }, delay);
  //         delay += 100;
  //       }
  //     }
  //   })
  // }
  // function copyColor(value) {
  //   let newColor = [];
  //   value.forEach(elem => {
  //     newColor.push([...elem]);
  //   })
  //   return newColor
  // }
  // ---For dev (remove)------------>

  // function handleClick(i, j) {
  //   // No action on click if we are waiting.
  //   if (waiting) {
  //     return;
  //   }
  //   // Build Prolog query to make a move and get the new satisfacion status of the relevant clues.    
  //   const squaresS = JSON.stringify(grid).replaceAll('"_"', '_'); // Remove quotes for variables. squares = [["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]]
  //   const content = 'X'; // Content to put in the clicked square.
  //   const queryS = `put("${content}", [${i},${j}], [], [],${squaresS}, ResGrid, RowSat, ColSat)`; // queryS = put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
  //   setWaiting(true);
  //   pengine.query(queryS, (success, response) => {
  //     if (success) {
  //       setGrid(response['ResGrid']);
  //     }
  //     setWaiting(false);
  //   });

  //   console.log(grid)
  // }


  if (!grid) {
    return null;
  }
  // const statusText = 'Keep playing!';
  return (
    <div className="game">
      <Board
        grid={grid}
        rowsClues={rowsClues}
        colsClues={colsClues}
        rowsCluesState={rowsCluesState}
        colsCluesState={colsCluesState}
        onClick={(i, j) => handleClick(i, j)}
      />
      <div className="game-info">
        <button onClick={changeMode}>change mode {selectMode ? "#" : "X"}</button>
        {/* <button onClick={winAnimation}>win</button> */}

      </div>
    </div>
  );
}

export default Game;
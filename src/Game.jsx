import React, { useRef, useEffect, useState } from 'react';
// import PengineClient from './PengineClient';
import Board from './Board';
import SquareRainbow from './SquareRainbow';

// let pengine;

function Game() {
  let gridCols = 4;
  let gridRows = 4;
  let clue = 2;
  // State
  const [grid, setGrid] = useState(Array(gridRows).fill(Array(gridCols).fill("_")));
  const [rowsClues, setRowsClues] = useState(Array(gridRows).fill(Array(clue).fill("1")));
  const [colsClues, setColsClues] = useState(Array(gridCols).fill(Array(clue).fill("1")));

  // const [grid, setGrid] = useState(null);
  // const [rowsClues, setRowsClues] = useState(null);
  // const [colsClues, setColsClues] = useState(null);
  // const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // Creation of the pengine server instance.    
    // This is executed just once, after the first render.    
    // The callback will run when the server is ready, and it stores the pengine instance in the pengine variable. 
    // PengineClient.init(handleServerReady);
  }, []);

  // function handleServerReady(instance) {
  //   pengine = instance;
  //   const queryS = 'init(RowClues, ColumClues, Grid)';
  //   pengine.query(queryS, (success, response) => {
  //     if (success) {
  //       setGrid(response['Grid']);
  //       setRowsClues(response['RowClues']);
  //       setColsClues(response['ColumClues']);
  //     }
  //   });
  // }

  // <---For dev (remove)------------
  const [selectMode, setSelectMode] = useState(true);
  function changeMode() {
    setSelectMode(selectMode ? false : true);
  }

  function handleClick(i, j) {
    let newGrid = [];
    grid.forEach(elem => {
      newGrid.push([...elem]);
    });
    if (selectMode) {
      if (newGrid[i][j] === "#") newGrid[i][j] = "_";
      else if (newGrid[i][j] === "X") newGrid[i][j] = "#";
      else newGrid[i][j] = "#";
    } else {
      if (newGrid[i][j] === "X") newGrid[i][j] = "_";
      else if (newGrid[i][j] === "#") newGrid[i][j] = "X";
      else newGrid[i][j] = "X";
    }
    setGrid(newGrid);
  }

  const colorTestRef = useRef('');
  const [colorTest, setColorTest] = useState(["ligthgray", "ligthgray", "ligthgray", "ligthgray", "ligthgray"]);

  useEffect(() => {
    colorTestRef.current = colorTest;
  });

  function animation() {
    const color = ["red", "orange", "yellow", "green", "blue", "indigo", "lightgray"]
    let delay = 0;
    color.forEach(c => {
      for (let i = 0; i < colorTestRef.current.length; i++) {
        setTimeout(() => {
          let newColorTest = [...colorTestRef.current];
          newColorTest[i] = c;
          setColorTest(newColorTest);
          console.log(newColorTest);
        }, delay);
        delay += 200;
      }
    });
  }


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
        onClick={(i, j) => handleClick(i, j)}
      />
      <div className="game-info">
        <button onClick={changeMode}>change mode {selectMode ? "#" : "X"}</button>
        <SquareRainbow color={colorTest[0]} onClick={animation}></SquareRainbow>
        <SquareRainbow color={colorTest[1]} onClick={animation}></SquareRainbow>
        <SquareRainbow color={colorTest[2]} onClick={animation}></SquareRainbow>
        <SquareRainbow color={colorTest[3]} onClick={animation}></SquareRainbow>
        <SquareRainbow color={colorTest[4]} onClick={animation}></SquareRainbow>
      </div>
    </div>
  );
}

export default Game;
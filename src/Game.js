import React, { useEffect, useState } from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import Modal from './Modal';
import Switch from "react-switch";

let pengine;

function Game() {


  // TO DO
  // KEYBINDING
  // SOUNDS EFFECTS
  const [grid, setGrid] = useState(null);
  const [rowsClues, setRowsClues] = useState(null);
  const [colsClues, setColsClues] = useState(null);
  const [colsCluesState, setColsCluesState] = useState();
  const [rowsCluesState, setRowsCluesState] = useState();
  const [waiting, setWaiting] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);

  const [inGame, setIngame] = useState(false);
  const [animationWin, setAnimationWin] = useState(false);

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

        setRowsCluesState(Array(response['RowClues'].length).fill(0))
        setColsCluesState(Array(response['ColumClues'].length).fill(0))
      }
    });
  }

  const [selectMode, setSelectMode] = useState(true);
  function changeMode() {
    setSelectMode(selectMode ? false : true);
  }


  function handleClick(i, j) {
    // No action on click if we are waiting.
    if (waiting || gameStatus) {
      return;
    }
    // Build Prolog query to make a move and get the new satisfacion status of the relevant clues.    
    const squaresS = JSON.stringify(grid).replaceAll('"_"', '_'); // Remove quotes for variables. squares = [["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]]

    let content // Content to put in the clicked square.
    // for select
    if (selectMode) content = "#";
    else content = "X";

    const rowsCluesS = JSON.stringify(rowsClues);
    const colsCluesS = JSON.stringify(colsClues);
    const queryS = `put("${content}", [${i},${j}], ${rowsCluesS}, ${colsCluesS}, ${squaresS}, ResGrid, RowSat, ColSat)`; // queryS = put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    setWaiting(true);
    pengine.query(queryS, (success, response) => {
      if (success) {
        setGrid(response['ResGrid']);
        let newRowsStates = [...rowsCluesState];
        newRowsStates[i] = response['RowSat'];
        setRowsCluesState(newRowsStates);

        let newClueStates = [...colsCluesState];
        newClueStates[j] = response['ColSat'];
        setColsCluesState(newClueStates);

        console.log("RowSat and ColSat: " + response['RowSat'] + " " + response['ColSat']);

        const rowsCluesStateS = JSON.stringify(newRowsStates);
        const colsCluesStateS = JSON.stringify(newClueStates);
        const queryWin = `gameStatus(${rowsCluesStateS}, ${colsCluesStateS}, Res)`;
        pengine.query(queryWin, (success, response) => {
          if (success) setGameStatus(response['Res'] === 1);
          console.log(gameStatus)
        });
      }

      setWaiting(false);
    });
  }

  function joinGame(){
    setIngame(true);
  }

  function activeAnimationWin(){
    setAnimationWin(true);
  }

  if (!grid) {
    return null;
  }
// TO DO rework container_game with a div gigant 
  return (
    <div className='container_game'>
      <div className={`presentation ${!inGame ? "active" : "inactive"}`}>
        <h1>NONOGRAM-2024</h1>
        <h2>by Popp-Brugnoni</h2>
        <button className='button_joinGame' onClick={joinGame}><span>PLAY</span></button>
      </div>
      <div className={`game ${inGame ? "active" : "inactive"}`}>
        <Modal winCondition={gameStatus} activeAnimation = {activeAnimationWin}/>
        <div className='game-container'>
          <Board
            grid={grid}
            rowsClues={rowsClues}
            colsClues={colsClues}
            rowsCluesState={rowsCluesState}
            colsCluesState={colsCluesState}
            gameStatus={animationWin}
            onClick={(i, j) => handleClick(i, j)}
          />
          <div className="game-info">
            <Switch
              uncheckedIcon={
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
              }
              checkedIcon={
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                  <i className="fa-solid fa-square"></i>
                </div>
              }
              checked={selectMode}
              onChange={changeMode}
              className="react-switch"
              height={30}
              width={60}
            />
            {/* <button className='btn-change-mode' onClick={changeMode}>change mode {selectMode ? "#" : "X"}</button> */}
            <p>Game status: {gameStatus ? "Win" : "still play"}</p>

          </div>
        </div>
      </div>

      <img className='activeWindows' src={require(`./resouces/activeWindows.png`)} alt=""/>
    </div>
  );
}

export default Game;
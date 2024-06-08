import React, { useEffect, useState } from 'react';
import PengineClient from './PengineClient';
import Board from './Board';
import Modal from './Modal';
import './styles/game.css'
import StartButton from './StartButton';
import Switch from './Switch';
import UndoButton from './UndoButton';
import HintButton from './HintButton'
import CompleteGridButton from './CompleteGridButton';
import Background from './Background';

let pengine;

function Game() {
  // TO DO
  // KEYBINDING
  // Use a context for gameStatus
  const [grid, setGrid] = useState(null);
  const [auxSolvedGrid, setAuxSolvedGrid] = useState(null);
  const [solvedGrid, setSolvedGrid] = useState(null);

  const [rowsClues, setRowsClues] = useState(null);
  const [colsClues, setColsClues] = useState(null);
  const [colsCluesState, setColsCluesState] = useState(null);
  const [rowsCluesState, setRowsCluesState] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [gameStatus, setGameStatus] = useState(false);

  const [actualScreen, setActualScreen] = useState(0);
  const [animationWin, setAnimationWin] = useState(false);

  const [selectMode, setSelectMode] = useState(true);
  const [hintMode, setHintMode] = useState(false);
  const [showedSolution, setShowedSolution] = useState(false);

  const [stackMoves, setStackMoves] = useState([]);

  useEffect(() => {
    // Creation of the pengine server instance.    
    // This is executed just once, after the first render.    
    // The callback will run when the server is ready, and it stores the pengine instance in the pengine variable. 
    PengineClient.init(handleServerReady);
  }, []);


  useEffect(() => {
    const keyListener = (e) => {
      if (e.key === "C" || e.key === "c") {
        changeMode();
      }
    }
    window.addEventListener('keydown', keyListener);

    return () => { window.addEventListener('keydown', keyListener); }
  }, []);

  useEffect(() => {
    if (actualScreen === 1) checkGameStatus();
    // eslint-disable-next-line
  }, [actualScreen, rowsCluesState, colsCluesState]);

  const handleServerReady = (instance) => {
    pengine = instance;
    const queryS = 'init10x10(RowClues, ColumnClues, Grid), gameInitialState(RowClues, ColumnClues, Grid, RowCluesStates, ColumnCluesStates),solveNonogram(RowClues, ColumnClues, Grid, SolvedGrid)';
    pengine.query(queryS, (success, response) => {
      if (success) {
        setGrid(response['Grid']);
        setAuxSolvedGrid(response['Grid']);
        setSolvedGrid(response['SolvedGrid']);
        setRowsClues(response['RowClues']);
        setColsClues(response['ColumnClues']);
        setRowsCluesState(response['RowCluesStates']);
        setColsCluesState(response['ColumnCluesStates']);

      }
    });
  };
  function changeMode() {
    setSelectMode((value) => {
      return !value;
    });
  }

  function handleClick(i, j) {
    // No action on click if we are waiting.
    if (waiting || gameStatus || showedSolution) {
      return;
    }
    let content // Content to put in the clicked square.
    // for select
    if(hintMode && grid[i][j] == "_") {
      content = solvedGrid[i][j]
      setHintMode(false)
    }
    else if (selectMode) content = "#";
    else content = "X";
    putQuery(content, i, j);

    let preContent = grid[i][j];
    addLastMove(preContent, content, i, j);
  }

  function putQuery(content, i, j) {
    // Build Prolog query to make a move and get the new satisfacion status of the relevant clues.    
    const squaresS = JSON.stringify(grid).replaceAll('"_"', '_'); // Remove quotes for variables. squares = [["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]]

    const rowsCluesS = JSON.stringify(rowsClues);
    const colsCluesS = JSON.stringify(colsClues);
    setWaiting(true);
    const queryS = `put("${content}", [${i},${j}], ${rowsCluesS}, ${colsCluesS}, ${squaresS}, ResGrid, RowSat, ColSat)`; // queryS = put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    pengine.query(queryS, (success, response) => {
      if (success) {
        setGrid(response['ResGrid']);
        setAuxSolvedGrid(response['ResGrid'])

        let newRowsStates = [...rowsCluesState];
        newRowsStates[i] = response['RowSat'];
        setRowsCluesState(newRowsStates);

        let newClueStates = [...colsCluesState];
        newClueStates[j] = response['ColSat'];
        setColsCluesState(newClueStates);
      }

      setWaiting(false);
    });
  }
  function checkGameStatus() {
    const rowsCluesStateS = JSON.stringify(rowsCluesState);
    const colsCluesStateS = JSON.stringify(colsCluesState);
    const queryWin = `gameStatus(${rowsCluesStateS}, ${colsCluesStateS}, Res)`;

    if (pengine) {
      pengine.query(queryWin, (success, response) => {

        if (success) {
          setGameStatus(response['Res'] === 1);
        }
      });
    }

  }

  function showGridSolved(){
    setAuxSolvedGrid(grid)
    setGrid(solvedGrid);
    setShowedSolution(true);
  }
  function hiddeGridSolved(){
    setShowedSolution(false);
    setAuxSolvedGrid(auxSolvedGrid)
    setGrid(auxSolvedGrid);
  }

  function showHint(){
    setHintMode(true)
  }

  function joinGame() {
    setActualScreen(1);
  }
  function activeAnimationWin() {
    setAnimationWin(true);
  }

  function addLastMove(prevContent, content, i, j) {
    let cell = {
      prevContent: prevContent,
      content: content,
      i: i,
      j: j
    }

    let auxMoves = [...stackMoves];
    auxMoves.push(cell);
    setStackMoves(auxMoves);
  }
  function undoMove() {
    // case 1
    // _ # -> #
    // _ X -> X
    // # # -> #
    // X X -> X

    // Case 2
    // X # -> X
    // # X -> #
    if (stackMoves.length > 0) {
      let stackMoveAux = [...stackMoves]
      let lastMove = stackMoveAux.pop();
      let firstContentNull = lastMove.prevContent === "_";
      let sameContent = lastMove.prevContent === lastMove.content;
      let diferentsContent = (lastMove.prevContent !== "_") && lastMove.prevContent !== lastMove.content;

      let content;
      let i = lastMove.i;
      let j = lastMove.j;

      if (firstContentNull || sameContent) content = lastMove.content;
      else if (diferentsContent) content = lastMove.prevContent;
      putQuery(content, i, j);

      setStackMoves(stackMoveAux);
    }
  }

  if (!grid) {
    return null;
  }
  return (
    <Background>
      <div className='container_game'>
        <div className='actualScreen' style={{ top: `${actualScreen * -100}vh` }}>
          <div className={`presentation screen`}>
            <h1>NONOGRAM-2024</h1>
            <h2>by Popp-Brugnoni</h2>
            <StartButton onClick={joinGame} />
            {/* <button className='button_joinGame' onClick={joinGame}><span>PLAY</span></button> */}
          </div>
          <div className={`game screen`}>
            <Modal winCondition={gameStatus} activeAnimation={activeAnimationWin} />
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
                <Switch selectMode={selectMode} change={changeMode} />
                <HintButton onClick = {showHint}/>
                <CompleteGridButton activeAction={showGridSolved} inactiveAction={hiddeGridSolved} />
                <UndoButton undoAction={undoMove} disable={gameStatus} />
              </div>
            </div>
          </div>
        </div>
        <img className='activeWindows' src={require(`./resouces/activeWindows.png`)} alt="" />
      </div>
    </Background>
  );
}

export default Game;
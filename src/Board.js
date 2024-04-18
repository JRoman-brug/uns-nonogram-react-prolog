import Square from './Square';
import Clue from './Clue';

function Board({ grid, rowsClues, colsClues, onClick, rowsCluesState, colsCluesState, gameStatus }) {
    const numOfRows = grid.length;
    const numOfCols = grid[0].length;
    let index = 0;
    // rework
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
                    <Clue clue={clue} state={colsCluesState[i]} key={i} />
                )}
            </div>

            <div className="rowClues" style={styleRowsClues}>
                {rowsClues.map((clue, i) =>
                    <Clue clue={clue} state={rowsCluesState[i]} key={i} />
                )}
            </div>

            <div className="board" style={styleBoard}>
                {grid.map((row, i) =>
                    row.map((cell, j) =>
                        <Square
                            value={cell}
                            win={true}
                            onClick={() => {
                                onClick(i, j);
                            }}
                            index={index++}
                            gameStatus={gameStatus}
                            key={i + j}
                        />
                    )
                )}
            </div>
        </div>
    );
}
export default Board;
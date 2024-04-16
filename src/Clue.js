import React from 'react';

function Clue({ clue, state}) { 

    const clueStyle = {
        color:`${state?"red":"black"}`,
    }
    return (
        <div className={`clue`} style={estilo} >
            {clue.map((num, i) =>
                <div key={i} style={clueStyle}>
                    {num}
                </div>
            )}
        </div>
    );
}



export default Clue;
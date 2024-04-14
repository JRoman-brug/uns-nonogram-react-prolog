import React from 'react';

function Clue({ clue, estilo}) {
    return (
        <div className={`clue`} style={estilo} >
            {clue.map((num, i) =>
                <div key={i}>
                    {num}
                </div>
            )}
        </div>
    );
}



export default Clue;
import React from 'react';

function Clue({ clue, state }) { 

    const clueState = state ?"active":"";
   
    return (
        <div className={`clue ${clueState}`}  >
            {clue.map((num, i) =>
                <div key={i}>
                    {num}
                </div>
            )}
        </div>
    );
}



export default Clue;
import React from 'react';

function Clue({ clue, state }) {

    const clueState = state ? "active" : "";

    return (
        <div className={`clue ${clueState}`}  >
            <div className='inner_clue'>
                <div className='front_clue'>
                    {clue.map((num, i) =>
                        <div key={i}>
                            {num}
                        </div>
                    )}
                </div>
                <div className='back_clue'>
                    <i className="fa-solid fa-check"></i>
                </div>
            </div>

        </div>
    );
}



export default Clue;
import React from 'react';
import './styles/switch.css'

function Switch({ selectMode, change }) {
    // checked={selectMode} onChange={change}
    return (
        <label className={`switch `}>
            <input type="checkbox" checked={selectMode} onChange={change}/>
            <div className="slider">
                <div className="circle">
                    <svg xmlns="http://www.w3.org/2000/svg"  className='checkmark iconSlide' viewBox="0 0 448 512"><path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{height:"20px"}} className=' cross iconSlide' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>

                </div>
            </div>
        </label>
    );
}

export default Switch;
import React from 'react';
import './styles/switch.css'

function Switch({ selectMode, change }) {
    // checked={selectMode} onChange={change}
    return (
        <label class="switch">
            <input type="checkbox" checked={selectMode} onChange={change} />
                <div class="slider">
                    <div class="circle">
                        
                        <i className="fa-solid fa-square checkmark"></i>
                        <i className="fa-solid fa-xmark cross"></i>
                        
                    </div>
                </div>
        </label>
    );
}

export default Switch;
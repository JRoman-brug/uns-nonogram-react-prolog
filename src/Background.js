import React from 'react';
import './styles/background.css'

function Background({ children }) {


    return (
        <div className='Background'>
            <div className='volcanEffect'>
                <div class="circleBg circle-12"></div>
                <div class="circleBg circle-11"></div>
                <div class="circleBg circle-10"></div>
                <div class="circleBg circle-9"></div>
                <div class="circleBg circle-8"></div>
                <div class="circleBg circle-7"></div>
                <div class="circleBg circle-6"></div>
                <div class="circleBg circle-5"></div>
                <div class="circleBg circle-4"></div>
                <div class="circleBg circle-3"></div>
                <div class="circleBg circle-2"></div>
                <div class="circleBg circle-1"></div>
            </div>
            {children}
        </div>
    );
}

export default Background;
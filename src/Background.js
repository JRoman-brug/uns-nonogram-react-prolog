import React from 'react';
import './styles/background.css'

function Background({ children }) {


    return (
        <div className='Background'>
            <div className='volcanEffect'>
                {/* 
                <div className="circleBg circle-15 medium duration2"></div>
            */}
                <div className="circleBg circle-14 small duration1"></div> 
                <div className="circleBg circle-13 large duration3"></div>
                <div className="circleBg circle-12 large duration4"></div>
                <div className="circleBg circle-11 duration1"></div>
                <div className="circleBg circle-10 medium duration3"></div>
                <div className="circleBg circle-9 duration2"></div>
                <div className="circleBg circle-8 large duration1"></div>
                <div className="circleBg circle-7 small duration4"></div>
                <div className="circleBg circle-6 duration4"></div>
                <div className="circleBg circle-5 medium"></div>
                <div className="circleBg circle-4 duration4"></div>
                <div className="circleBg circle-3 small"></div>
                <div className="circleBg circle-2 large duration2"></div>
                <div className="circleBg circle-1 duration1"></div>
            </div>
            {children}
        </div>
    );
}

export default Background;
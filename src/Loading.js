import React from 'react';
import './styles/loading.css'

function Loading({ onClick }) {
    return (
        <div className='loadingBackground'>
            <div className='loading' style={{width: "140px", height: "140px"}}>
                <div className="banter-loader">
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                  <div className="banter-loader__box"></div>
                </div>
                <p style={{ color: "white", fontSize: "2em" }}>Loading...</p>

              </div>
        </div>
    );
}

export default Loading;
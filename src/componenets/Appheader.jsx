import React from 'react'
import './css/appheader.css'


const Appheader = props=>{
    const heading = <h1 id="title" align="center" >Hospital</h1>;
    return (
        <div className="header">
            {heading}
        </div>
    );
}

export {Appheader};
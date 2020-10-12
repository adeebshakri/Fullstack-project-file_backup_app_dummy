import React, { Component } from 'react'
import {  Link } from 'react-router-dom' 

class Navigator extends Component{
    render(){
        return(
            <div>
                <h1 className="rebitHub">Rebit Hub by Adeeb</h1>
                <h3>
                <Link className = "homeLinker" to='/home'>Home&nbsp;&nbsp;</Link>
                <Link className = "homeLinker" to='/'>Login</Link>
                
                </h3>
            </div>
        );
    }
}
export default Navigator; 
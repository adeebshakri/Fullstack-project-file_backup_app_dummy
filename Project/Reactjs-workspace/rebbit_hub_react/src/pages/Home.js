
import React, { Component } from 'react'
import { Link } from 'react-router-dom'



class Home extends Component {
    render(){
        return (
            <center>
                <div>
                <img src = "/image/frog.jpg" alt=""/>
                <h1 className = "pageHeaders">HOME .aka. DASHBOARD</h1><br /><br />
                <Link to='/devices'><button className = "innerButtons" >Devices</button></Link>
                <Link to='/recyclebin'><button className = "innerButtons" >Recycle Bin</button><br /><br /></Link>
                <Link to='/reports'><button className = "innerButtons" >Report</button></Link>
                <Link to='/'><button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            </div>
            </center>
        )
    }
}
export default Home
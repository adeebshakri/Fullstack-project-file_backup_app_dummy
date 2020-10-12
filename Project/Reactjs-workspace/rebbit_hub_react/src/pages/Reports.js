import React, { Component } from 'react'
import { withRouter,Link } from 'react-router-dom'

class Reports extends Component{
    allFilesReport() {
        this.props.history.push({
            pathname: '/allFilesReport'
        })
    }
    userSubscriptionReport() {
        this.props.history.push({
            pathname: '/userSubscriptionReport'
        })
    }
    render(){
        return(
            <div>
                <center>
                <img src = "/image/frog.jpg" alt=""/>
                <h1 className = "pageHeaders">Reports</h1><br /><br />
                <button className = "innerButtons" onClick={() =>this.allFilesReport()}>Report of all files</button><br/><br/>
                <button className = "innerButtons" onClick={() =>this.userSubscriptionReport()}>User Subscription report</button>
                <Link to='/'><button button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            
                </center>
                </div>
        )
    }
}
export default withRouter(Reports)
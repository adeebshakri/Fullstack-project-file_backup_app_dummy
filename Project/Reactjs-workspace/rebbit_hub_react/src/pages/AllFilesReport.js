import React, { Component } from 'react'
import { withRouter,Link } from 'react-router-dom'

class AllFilesReport extends Component{
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
    componentDidMount() {
        console.log(localStorage.getItem('auth'))
        fetch('http://127.0.0.1:8082/api/reportAllFilesDetails', {
            method: "GET",
            headers: new Headers({
                'Authorization': "Bearer "+localStorage.getItem('auth'), 
                'Content-Type': 'application/json'
              }), 
        }).then((result) => {
            result.json().then((data) => {
                console.log("data", data);
                this.setState({ items: data })

            })
        }).catch((err) => console.log(err))
    }
    render(){
        return(
            <div>
                <center>
                <img src = "/image/frog.jpg"  alt=""/>
             <h1 className = "pageHeaders">All Files Report</h1><br /><br />
             </center>
                {
                    this.state.items ?
                        this.state.items.map((item, i) => {
                            return (
                                <div key={i}>
                                    <h3 className="text">
                                        {i+1}. &nbsp;File name:<span className="receivingData">{item.file_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        File path:<span className="receivingData">{item.file_path}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Version size:<span className="receivingData">{item.version_size}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Version creation time:<span className="receivingData">{item.version_time}</span>
                                    </h3>
                                </div>
                            )

                        })
                        : null

                }
                <Link to='/'><button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
                
               
                 </div>
        );
    }
}
export default withRouter(AllFilesReport);
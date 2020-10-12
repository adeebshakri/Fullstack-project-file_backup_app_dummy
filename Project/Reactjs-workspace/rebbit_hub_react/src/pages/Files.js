import React, { Component } from 'react'
import { withRouter,Link } from 'react-router-dom';

class Files extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
    componentDidMount() {
       this.getAllFiles()
    }

    getAllFiles = () => {
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/getAllFiles?device_id='+this.props.location.state, {
            method: "GET",
            headers: {
                'Authorization': token
            }

        }
        ).then((result) => {
            result.json().then((data) => {
                console.log("data", data);
                this.setState({ items: data })                
            })
        }).catch((err) => alert(err))
    }

    deleteFile = (file_id) => {
        console.log(file_id);
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/deleteFile?file_id='+file_id, {
            method: "PATCH",
            headers: {
                'Authorization': token
            }

        }
        ).then(() => {
           this.getAllFiles()  //calling a func inside func
        }).catch((err) => alert(err))
        
    }

    showVersions(file_id) {
        console.log(file_id);
        this.props.history.push({
            pathname: '/versions',
            state: file_id
        })
    }

    render() {
        //console.log(this.props.location.state);
        return (
            <div>
                <center>
                <img src = "/image/frog.jpg" alt=""/>
             <h1 className = "pageHeaders">Files</h1><br /><br />
                
                {
                    
                    this.state.items ?
                        this.state.items.map((item, i) =>{
                            return(
                                <div key={i}>
                                <h3 className="text">
                                    {i+1}.&nbsp;File name:<span className="receivingData">{item[3]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    File path:<span className="receivingData">{item[4]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    File size:<span className="receivingData">{item[5]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Latest file version time:<span className="receivingData">{item[6]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className = "correspondingButton" onClick={() => this.deleteFile(item[2])}>Delete File</button>
                                    <button className = "correspondingButton" onClick={() => this.showVersions(item[2])}>Versions</button>
                                </h3>
                            </div>
                            )
                        })
                        :  null 

                }
                <Link to='/'><button button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            
                </center>
            </div>
        );
    }
}
export default withRouter(Files)
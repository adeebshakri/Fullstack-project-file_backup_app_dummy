import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class RecycleBin extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
    componentDidMount() {
        this.getAllDeletedFiles()
    }
    getAllDeletedFiles = () =>{
        let token = "bearer " + localStorage.getItem('auth')
        console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/getAllDeletedFiles', {
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
    
    restoreFile(file_id) {
        console.log(file_id);
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/restoreFile?file_id='+file_id, {
            method: "PATCH",
            headers: {
                'Authorization': token
            }

        }
        ).then((result) => {
            this.getAllDeletedFiles()
        }).catch((err) => alert(err))
        
    }
    deleteFilePermanently(file_id) {
        console.log(file_id);
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/deleteFilePermanently?file_id='+file_id, {
            method: "DELETE",
            headers: {
                'Authorization': token
            }

        }
        ).then((result) => {
            this.getAllDeletedFiles()
        }).catch((err) => alert(err))
        
    }
   
    render() {
        return (
            <div>
                <center>
                <img src = "/image/frog.jpg" alt=""/>
             <h1 className = "pageHeaders">Recycle Bin</h1><br /><br />
                {
                    this.state.items ?
                        this.state.items.map((item, i) =>
                            <div key={i}>
                                <h3 className="text">
                                    {i+1}. &nbsp;File name:<span className="receivingData">{item[1]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    File path:<span className="receivingData">{item[2]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    File size:<span className="receivingData">{item[3]}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className = "correspondingButton" onClick={() => this.restoreFile(item[0])}>Restore File</button>
                                    <button className = "correspondingButton" onClick={() => this.deleteFilePermanently(item[0])}>Permanent Delete</button>
                                </h3>
                            </div>
                        )
                        : null

                }
                <Link to='/'><button className = "logoutButton" onClick={() => {localStorage.clear(); window.location.reload();}}>Logout</button></Link>
            
                </center>
                </div>
        );
    }
}
export default RecycleBin
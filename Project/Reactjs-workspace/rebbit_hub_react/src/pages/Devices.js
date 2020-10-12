import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

class Devices extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
    componentDidMount() {
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/getAllDevices', {
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
    getAllFilesOfDevice(device_id) {
        console.log(device_id);
        this.props.history.push({
            pathname: '/files',
            state: device_id
        })
    }
    render() {
        console.log(this.props)
        return (
            <div>
                <center>
                    <img src="/image/frog.jpg" alt="" />
                    <h1 className="pageHeaders">Devices</h1><br /><br />
                    {
                        this.state.items ?
                            this.state.items.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <h3 className="text">
                                            {i + 1}. &nbsp;Device:<span className="receivingData">{item.device_name}</span>&nbsp;&nbsp;
                                <button className="correspondingButton" onClick={() => this.getAllFilesOfDevice(item.device_id)}>Show files</button>
                                        </h3>
                                    </div>
                                )

                            })
                            : null

                    }
                </center>
                <Link to='/'><button className="logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            </div>
        );
    }
}
export default withRouter(Devices)
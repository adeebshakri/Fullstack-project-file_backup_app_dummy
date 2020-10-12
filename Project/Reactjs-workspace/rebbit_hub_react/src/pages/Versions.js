import React , { Component }from 'react'
import { withRouter,Link } from 'react-router-dom';

class Versions extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }

    componentDidMount() {
        let token = "bearer " + localStorage.getItem('auth')
        //console.log("TOKEN:" + token)
        fetch('http://localhost:8000/api/dashboard/getVersions?file_id='+this.props.location.state, {
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
    
    render() {
        //console.log(this.props.location.state);
        return (
            <div>
               <center>
                <img src = "/image/frog.jpg" alt=""/>
             <h1 className = "pageHeaders">Versions</h1><br /><br />
             
               {
                    this.state.items ?
                        this.state.items.map((item, i) =>{
                            return(
                                <div key={i}>
                                <h3 className="text">
                                    {i+1}. &nbsp;file_name:<span className="receivingData">{item.file_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    file_path:<span className="receivingData">{item.file_path}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    version_size:<span className="receivingData">{item.version_size}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    version_time:<span className="receivingData">{item.version_time}</span>
                                </h3>
                            </div>
                            )
                        })
                        :  null 

                }
                <Link to='/'><button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            
                </center>
               </div>
        );
    }

}
export default withRouter(Versions)

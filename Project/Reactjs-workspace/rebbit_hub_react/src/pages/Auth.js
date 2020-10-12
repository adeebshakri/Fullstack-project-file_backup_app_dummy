import React, { Component } from 'react';
import { Redirect , withRouter} from 'react-router-dom';
import '../custom.css'

class Auth extends Component {
    constructor() {
        super()
        this.state = {
            isRegister: false,
            username:"",
            password:""
        }
    }
    login() {
        console.log("state", this.state)
        fetch('http://127.0.0.1:8082/api/login1', {
            method: "POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body: JSON.stringify(this.state)
        }).then((response) => {
            response.json().then((result) => {
                console.log("result", result);
                localStorage.setItem('auth', result.access_token) //JSON.stringify(result.access_token)
                localStorage.setItem('status', result.message)
                localStorage.getItem('status') === "Login Successful"? alert("Successfully Logged in!") : alert("Invalid Credentials. Please Login again!")
                this.setState({username:"",password:""})
                window.setTimeout(() => {localStorage.clear(); this.props.history.push("/"); alert("Your session got over!Please login again!")}, 1140000)
            })
        })
    }
    register() {
        console.log("state", this.state)
        fetch('http://127.0.0.1:8082/api/register', {
            method: "POST",
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               },
            body: JSON.stringify(this.state)
        }).then(() => {
            alert("You can login now!")
            this.setState({ isRegister: false })
        })
    } 
    render() {

        var auth = localStorage.getItem('auth')
        return (
            <div>
                {
                    auth ? <Redirect to="/home" /> : null
                }
                {
                    !this.state.isRegister ?
                        <center>
                            <img src = "/image/frog.jpg" alt=""/>
                            <div className='login'>
                            <br/><br/>
                            LOGIN<br/>                            
                            <input className='input' inputtype="text" placeholder="username" onChange={(e) => { this.setState({ username: e.target.value }) }} /><br></br>
                            <input className='input' type="password" placeholder="password" onChange={(e) => { this.setState({ password: e.target.value }) }} /><br></br>
                            <button className = "loginButton" onClick={() => this.login()}>Login</button>
                            <button className = "registerButton" onClick={() => this.setState({ isRegister: true })}>GO TO Register</button>
                        </div>
                        </center>
                        :
                        <center>
                        <img src = "/image/frog.jpg" alt=""/>
                            <div className='register'>
                            <br/><br/>
                            REGISTER<br/>
                            <input className='input' type="text" placeholder="username" onChange={(e) => { this.setState({ username: e.target.value }) }} /><br></br>
                            <input className='input' type="password" placeholder="password" onChange={(e) => { this.setState({ password: e.target.value }) }} /><br></br>
                            <button className = "registerButton" onClick={() => this.register()}>Register</button>
                            <button className = "loginButton" onClick={() => this.setState({ isRegister: false })}>GO TO Login</button>
                        </div>
                        </center>
                }
            </div>

        );
    }
}
export default withRouter(Auth);


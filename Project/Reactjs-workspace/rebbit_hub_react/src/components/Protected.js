import React from 'react'
import {Redirect} from 'react-router-dom'

function Protected(props){
    const Component = props.component
    var auth = localStorage.getItem('auth')
    //console.log(auth)
return <div>{ auth ? <Component/> : <Redirect to="/"></Redirect>}</div>
}
export default Protected;
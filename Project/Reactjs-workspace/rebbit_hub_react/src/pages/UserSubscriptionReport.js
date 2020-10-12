import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'

class UserSubscriptionReport extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
    componentDidMount() {
        console.log(localStorage.getItem('auth'))
        fetch('http://127.0.0.1:8082/api/reportUserSubscriptionDetails', {
            method: "GET",
            headers: new Headers({
                'Authorization': "Bearer " + localStorage.getItem('auth'),
                'Content-Type': 'application/json'
            }),
        }).then((result) => {
            result.json().then((data) => {
                console.log("data", data);
                this.setState({ items: data })

            })
        }).catch((err) => console.log(err))
    }

    showGraph(subscripton_size_capacity, subscripton_size_used) {
        //console.log(file_id);
        this.props.history.push({
            pathname: '/userSubscriptionGraph',
            state: { subscripton_size_capacity: subscripton_size_capacity, subscripton_size_used: subscripton_size_used }
        })
    }
    render() {
        return (
            <div>
                <center>
                    <img src="/image/frog.jpg" alt="" />
                    <h1 className="pageHeaders">User Subscription Details</h1><br /><br />
                </center>
                {
                    this.state.items ?
                        this.state.items.map((item, i) => {
                            return (
                                <div key={i}>


                                    <h3 className="text">
                                        Subscription id:<span className="receivingData">{item.subscription_id}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscription name:<span className="receivingData">{item.subscription_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscripton size capacity:<span className="receivingData">{item.subscripton_size_capacity}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscripton size used:<span className="receivingData">{item.subscripton_size_used}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscripton size left:<span className="receivingData">{item.subscripton_size_left}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscription start date:<span className="receivingData">{item.subscription_start_date}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        Subscription end date:<span className="receivingData">{item.Subscription_end_date}</span>
                                    </h3>
                                    <center>
                                        <button className="innerButtons" onClick={() => this.showGraph(this.state.items[0].subscripton_size_capacity, this.state.items[0].subscripton_size_used)}> Show Graph</button>
                                    </center>
                                </div>
                            )

                        })
                        : null


                }
                <Link to='/'><button className="logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>


            </div>
        );
    }
}
export default withRouter(UserSubscriptionReport);
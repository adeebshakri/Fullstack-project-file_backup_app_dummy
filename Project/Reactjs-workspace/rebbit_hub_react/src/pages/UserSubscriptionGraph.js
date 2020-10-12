import React , { Component }from 'react'
import { withRouter,Link } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';

class UserSubscriptionReport extends Component {
    constructor() {
        super()
        this.state = {
            items: null
        }
    }
     
    render() {
        console.log(this.props.location.state.subscripton_size_capacity);
        console.log(this.props.location.state.subscripton_size_used);
        
        return (
            <div>
               <PieChart
               animate
               animationDuration={500}
               animationEasing="ease-out"
                        data={[
                            { title: 'Subscripton size left', value: (this.props.location.state.subscripton_size_capacity-this.props.location.state.subscripton_size_used), color: '#E38627' },
                            { title: 'Subscripton size used', value: this.props.location.state.subscripton_size_used, color: '#C13C37' },
                        ]}
                        totalValue = {this.props.location.state.subscripton_size_capacity}
                        lengthAngle={360}
                        radius={40}
                        lineWidth={90}
                        viewBoxSize={[220, 280]}
                        label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                        labelStyle={{fontSize: '5px',
                        fontFamily: 'sans-serif'
                              }}/>; 
                <Link to='/'><button className = "logoutButton" onClick={() => localStorage.clear()}>Logout</button></Link>
            
            
               </div>
        );
    }

}
export default withRouter(UserSubscriptionReport)

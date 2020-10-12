import React from 'react';
import Auth from './pages/Auth'
import Home from './pages/Home'
import Protected from './components/Protected'
import Navigator from './components/Navigator'
import Devices from './pages/Devices'
import Files from './pages/Files'
import RecycleBin from './pages/RecycleBin'
import Versions from './pages/Versions'
import Reports from './pages/Reports'
import AllFilesReport from './pages/AllFilesReport'
import UserSubscriptionReport from './pages/UserSubscriptionReport'
import UserSubscriptionGraph from './pages/UserSubscriptionGraph'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
    return (
        
        <div className="App">
            <Router>
                <Navigator/>
                <Switch>
                    <Route path="/home" exact><Protected component={Home} /></Route>
                    <Route path="/devices" exact><Protected component={Devices} /></Route>
                    <Route path="/files" exact><Protected component={Files} /></Route>
                    <Route path="/recyclebin" exact><Protected component={RecycleBin} /></Route>
                    <Route path="/versions" exact><Protected component={Versions} /></Route>
                    <Route path="/reports" exact><Protected component={Reports} /></Route>
                    <Route path="/allFilesReport" exact><Protected component={AllFilesReport} /></Route>
                    <Route path="/userSubscriptionReport" exact><Protected component={UserSubscriptionReport} /></Route>
                    <Route path="/userSubscriptionGraph" exact><Protected component={UserSubscriptionGraph} /></Route>
                    <Route path="/" exact><Auth /></Route>

                </Switch>
            </Router>
            {/* <div><Chart1/></div> */}
        </div>
    )
} 
export default App
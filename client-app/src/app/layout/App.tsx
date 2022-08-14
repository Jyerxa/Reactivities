import React, {Fragment} from 'react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {observer} from 'mobx-react-lite';
import {Route, Routes, useLocation} from 'react-router-dom';
import HomePage from '../../features/home/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import Main from './Main';


function App() {
    const location = useLocation();
    return (
        <Fragment>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path={'/'} element={<Main/>} >
                    <Route path='activities' element={<ActivityDashboard/>}/>
                    <Route path='activities/:id' element={<ActivityDetails/>}/>
                    <Route path={'createActivity'} element={<ActivityForm key={location.key}/>}/>
                    <Route path={'manage/:id'} element={<ActivityForm key={location.key}/>}/>
                </Route>
            </Routes>
        </Fragment>
    )

}

export default observer(App);

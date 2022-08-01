import React, {Fragment, useEffect} from 'react';
import {Container} from 'semantic-ui-react';
import NavBar from './NavBar/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent/LoadingComponent';
import {useStore} from '../stores/store';
import {observer} from 'mobx-react-lite';


function App() {
    const {activityStore} = useStore();

    // Get Activities on load
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <Fragment>
            <NavBar />
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard />
            </Container>
        </Fragment>
    );
}

export default observer(App);

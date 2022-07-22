import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {Container} from 'semantic-ui-react';
import {Activity} from '../models/activity';
import NavBar from './NavBar/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
    const [editMode, setEditMode] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined> (undefined);

    // Get Activities on load
    useEffect(() => {
        axios.get<Activity[]>('http://localhost:5000/api/Activities')
            .then(response => {
                setActivities(response.data);
            })
    }, []);

    const activitySelectedHandler = (id: string): void => {
        setSelectedActivity(activities.find(x => x.id === id));
    }

    const activitySelectionCanceledHandler = () => {
        setSelectedActivity(undefined);
    }

    const openFormHandler = (id?: string) => {
        id ? activitySelectedHandler(id) : activitySelectionCanceledHandler();
        setEditMode(true);
    }

    const closeFormHandler = () => {
        setEditMode(false);
    }

    const createOrEditHandler = (activity: Activity) => {
        activity.id
            ? setActivities([...activities.filter(x => x.id !== activity.id), activity])
            : setActivities([...activities, {...activity, id: uuid()}]);

        setEditMode(false);
        setSelectedActivity(activity);
    }

    const deleteActivityHandler = (id: string) => {
        setActivities(activities.filter(x => x.id !== id));
    }

    return (
        <Fragment>
            <NavBar openForm={openFormHandler}/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard
                    activities={activities}
                    selectedActivity={selectedActivity}
                    selectActivity={activitySelectedHandler}
                    cancelSelectActivity={activitySelectionCanceledHandler}
                    editMode={editMode}
                    openForm={openFormHandler}
                    closeForm={closeFormHandler}
                    createOrEdit={createOrEditHandler}
                    deleteActivity={deleteActivityHandler}
                />
            </Container>
        </Fragment>
    );
}

export default App;

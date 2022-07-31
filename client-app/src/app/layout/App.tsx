import React, {Fragment, useEffect, useState} from 'react';
import {Container} from 'semantic-ui-react';
import {Activity} from '../models/activity';
import NavBar from './NavBar/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent/LoadingComponent';

function App() {
    const [editMode, setEditMode] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined> (undefined);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Get Activities on load
    useEffect(() => {
        agent.Activities.list()
            .then(response => {
                let activities: Activity[] = [];
                response.forEach(a => {
                    a.date = a.date.split('T')[0];
                    activities.push(a);
                });
                setActivities(activities);
                setLoading(false);
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
        setSubmitting(true);
        if(activity.id) {
            agent.Activities.update(activity).then(() => {
                setActivities([...activities.filter(x => x.id !== activity.id), activity]);
                setEditMode(false);
                setSelectedActivity(activity);
                setSubmitting(false);
            })
        } else {
            activity.id = uuid();
            agent.Activities.create(activity).then(() => {
                setActivities([...activities, activity]);
                setEditMode(false);
                setSelectedActivity(activity);
                setSubmitting(false);
            });
        }
    }

    const deleteActivityHandler = (id: string) => {
        setSubmitting(true)
        agent.Activities.delete(id).then(() => {
            setActivities(activities.filter(x => x.id !== id));
            setSubmitting(false);
        });
    }

    if (loading) return <LoadingComponent content='Loading app' />

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
                    submitting={submitting}
                />
            </Container>
        </Fragment>
    );
}

export default App;

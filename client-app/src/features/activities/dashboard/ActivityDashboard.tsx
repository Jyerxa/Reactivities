import {Grid, GridColumn} from 'semantic-ui-react';
import React from 'react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import {useStore} from '../../../app/stores/store';
import {observer} from 'mobx-react-lite';

const ActivityDashboard = () => {
    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <GridColumn width='6'>
                { selectedActivity && !editMode &&
                <ActivityDetails  /> }

                { editMode &&
                <ActivityForm /> }
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDashboard);

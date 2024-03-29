import {Header, Menu} from 'semantic-ui-react';
import {Fragment} from 'react';
import {Calendar} from 'react-calendar';
const ActivityFilters = () => {

    return (
        <Fragment>
            <Menu vertical size='large' style={{width: '100%', marginTop: 25 }} >
                <Header icon='filter' attached color='teal' content='filters' />
                <Menu.Item content='All Activities'/>
                <Menu.Item content="I'm going"/>
                <Menu.Item content="I'm hosting"/>
            </Menu>
            <Header />
            <Calendar />
        </Fragment>
    )
}

export default ActivityFilters

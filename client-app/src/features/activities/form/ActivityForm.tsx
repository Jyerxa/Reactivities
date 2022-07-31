import {Button, Form, Segment} from 'semantic-ui-react';
import {Activity} from '../../../app/models/activity';
import {ChangeEvent, useState} from 'react';

interface Props  {
    activity: Activity | undefined
    closeForm: () => void,
    createOrEdit: (activity:Activity) => void,
    submitting: boolean
}


const ActivityForm = ({activity: selectedActivity, createOrEdit ,closeForm, submitting}: Props) => {
    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        description: '',
        category: '',
        date:'',
        city: '',
        venue:''
    }
    const [activity, setActivity] = useState(initialState);

    const submitHandler = () => {
        createOrEdit(activity);
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity, [name]:value});
    }

    return(
        <Segment clearing>
            <Form onSubmit={submitHandler} autoComplete='off'>
                <Form.Input label='Title' placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea label='Description' placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input label='Category' placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input label='Date' placeholder='Date' type='date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input label='City' placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input label='Venue' placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => closeForm()} floated='right' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default ActivityForm;

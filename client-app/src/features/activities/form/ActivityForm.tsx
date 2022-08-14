import {Button, Form, Segment} from 'semantic-ui-react';
import {ChangeEvent, useEffect, useState} from 'react';
import {useStore} from '../../../app/stores/store';
import {observer} from 'mobx-react-lite';
import {Link, useNavigate, useParams} from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent/LoadingComponent';
import {v4 as uuid} from 'uuid';

const ActivityForm = () => {
    const {activityStore} = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id:string}>();
    const naviagte = useNavigate();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        description: '',
        category: '',
        date:'',
        city: '',
        venue:''
    });

    useEffect(() => {
        if (id) loadActivity(id).then(a => {
            setActivity(a!);
        })
    }, [id, loadActivity, setActivity]);


    const submitHandler = () => {
       if( activity.id.length === 0)  {
           let newActivity = {
               ...activity,
               id: uuid()
           }
           createActivity(newActivity).then(() => naviagte(`/activities/${newActivity.id}`));

       } else {
           updateActivity(activity).then(() => naviagte(`/activities/${activity.id}`) )
       }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setActivity({...activity, [name]:value});
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...'/>

    return(
        <Segment clearing>
            <Form onSubmit={submitHandler} autoComplete='off'>
                <Form.Input label='Title' placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea label='Description' placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input label='Category' placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input label='Date' placeholder='Date' type='date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input label='City' placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input label='Venue' placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' content='Cancel' />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);

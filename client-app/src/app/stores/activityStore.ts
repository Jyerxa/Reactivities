import {makeAutoObservable, runInAction} from 'mobx';
import {Activity} from '../models/activity';
import agent from '../api/agent';
import {v4 as uuid} from 'uuid';

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        try {
            const response = await agent.Activities.list()
            response.forEach(a => {
                a.date = a.date.split('T')[0];
                this.activityRegistry.set(a.id, a);
            });
            this.setInitialLoading(false);
        } catch (e) {
            console.error('Failed to load Activities with: ', e);
            this.setInitialLoading(false);
        }

    }

    setInitialLoading = (state: boolean) => {
        this.loadingInitial = state;
    }

    // Send empty string to deselect activity
    setSelectedActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id? :string) => {
        id ? this.setSelectedActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.setSelectedActivity(activity.id);
                this.editMode = false;
                this.loading = false;
            })
        } catch (e) {
            runInAction(() => {
                console.error('Failed to create activity: ', e);
                this.loading =false;
            });
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (e) {
            runInAction(() => {
                console.error('Failed to update Activity: ', e);
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(()=> {
                this.activityRegistry.delete(id);
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        } catch (e) {
            runInAction(() => {
                console.error('Failed to delete activity: ', e);
                this.loading = false;
            })
        }
    }
}

import {makeAutoObservable, runInAction} from 'mobx';
import {Activity} from '../models/activity';
import agent from '../api/agent';

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

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce( (activities, activity)=> {
                const date = activity.date;
                activities[date] = activities[date]? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key:string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.setInitialLoading(true);
        try {
            const response = await agent.Activities.list()
            response.forEach(a => {
               this.setActivity(a);
            });
            this.setInitialLoading(false);
        } catch (e) {
            console.error('Failed to load Activities with: ', e);
            this.setInitialLoading(false);
        }

    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }

        this.loadingInitial = true;
        try {
            activity = await agent.Activities.details(id);
            this.setActivity(activity);
            runInAction(() => {
                this.selectedActivity = activity;
            });
            this.setInitialLoading(false);
            return activity;
        } catch (e) {
            console.log(e);
            // redirect
            this.setInitialLoading(false);
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setInitialLoading = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
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

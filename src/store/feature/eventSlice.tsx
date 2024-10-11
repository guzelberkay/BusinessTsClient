import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../model/IEvent";
import RestApis from "../../config/RestApis";
import axios from "axios";

interface IEventState {
    token: string;
    eventList: IEvent[];
    isLoading: boolean;
}
const initialEventState: IEventState = {
    token: "",
    eventList: [],
    isLoading: false,
};

interface IFetchSaveEvent {
    token: string;
    title: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date; 
}

export const fetchSaveEvent = createAsyncThunk(
    'event/fetchSaveEvent',
    async (payload: IFetchSaveEvent) => {
        const event = { token: payload.token, title: payload.title, description: payload.description, location: payload.location, startDateTime: payload.startDateTime, endDateTime: payload.endDateTime };
        const result = await axios.post(RestApis.calendar_and_planning_service_event+"/save-event", 
            event,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return result.data;
    }
);

interface IFetchUpdateEvent {
    token: string;
    id: string; 
    title: string;
    description: string;
    location: string;
    startDateTime: Date; 
    endDateTime: Date;   
}


export const fetchUpdateEvent = createAsyncThunk(
    'event/fetchUpdateEvent',
    async (payload: IFetchUpdateEvent) => {
        const event = { token: payload.token, id: payload.id, title: payload.title, description: payload.description, location: payload.location, startDateTime: payload.startDateTime, endDateTime: payload.endDateTime };
        const result = await axios.put(RestApis.calendar_and_planning_service_event+"/update-event",
            event,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return result.data;
    }
);

export const fetchDeleteEvent = createAsyncThunk(
    'event/fetchDeleteEvent',
    async (token: string) => {
        const result = await axios.put(RestApis.calendar_and_planning_service_event+"/delete-event", 
            token,
            {
                headers: {
                    'Content-Type': 'application/json',
                    
                }
            }
        );
        return result.data;
    }
);



const eventSlice = createSlice({
    name: 'user',
    initialState: initialEventState,
    reducers: {

    },
    extraReducers: (build) => {
       
    }
});


export default eventSlice.reducer;
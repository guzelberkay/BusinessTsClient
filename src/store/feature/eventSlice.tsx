import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEvent } from "../../model/IEvent";
import RestApis from "../../config/RestApis";
import axios from "axios";
import { IResponse } from "../../model/IResponse";

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
    startTime: Date;
    endTime: Date; 
}

export const fetchSaveEvent = createAsyncThunk(
    'event/fetchSaveEvent',
    async (payload: IFetchSaveEvent) => {
        const event = { token:localStorage.getItem('token') , title: payload.title, startTime: payload.startTime, endTime: payload.endTime };
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

export interface IFetchUpdateEvent {
    token: string;
    id: string; 
    title: string;
    startTime: Date; 
    endTime: Date;   
}


export const fetchUpdateEvent = createAsyncThunk(
    'event/fetchUpdateEvent',
    async (payload: IFetchUpdateEvent) => {
        const event = { token: localStorage.getItem('token'), id: payload.id, title: payload.title, startTime: payload.startTime, endTime: payload.endTime };
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
    async (payload: { token: string; id: string }) => {  // id parametresi eklendi
        const result = await axios.put(`${RestApis.calendar_and_planning_service_event}/delete-event`,
            payload,{
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        console.log(result.data);
        return result.data;
    }
);



export const fetchEventList = createAsyncThunk(
    'event/fetchEventList',
    async (payload: { token: string }) => {
        const result = await axios.get(`${RestApis.calendar_and_planning_service_event}/find-all-by-user-id`,
            
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    token: payload.token 
                }
            }
        );

        console.log(result.data);
        return result.data;
    }
);

export const fetchGetEventById = createAsyncThunk(
    'event/fetchGetEventById',
    async (payload: { id: string }) => {
        const result = await axios.get(`${RestApis.calendar_and_planning_service_event}/find-by-id`,
            
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: {
                    id: payload.id 
                }
            }
        );

        console.log(result.data);
        return result.data;
    }
);



const eventSlice = createSlice({
    name: 'event',
    initialState: initialEventState,
    reducers: {

    },
    extraReducers: (build) => {
        build.addCase(fetchEventList.fulfilled, (state, action: PayloadAction<IResponse>) => {
            console.log("Fetched Events:", action.payload); 
            if(action.payload.code){
                state.eventList = action.payload.data;
            }
        })
        .addCase(fetchUpdateEvent.pending, (state) => {
            state.isLoading = true;
        })
        // fetchUpdateEvent - Fulfilled
        .addCase(fetchUpdateEvent.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.isLoading = false;
            console.log("Event updated successfully:", action.payload);
            // Event'i başarıyla güncelledikten sonra eventList'i güncelleyebilirsiniz
        })
        // fetchUpdateEvent - Rejected
        .addCase(fetchUpdateEvent.rejected, (state, action) => {
            state.isLoading = false;
            console.error("Failed to update event:", action.error.message);
        })
        // fetchDeleteEvent - Pending
        .addCase(fetchDeleteEvent.pending, (state) => {
            state.isLoading = true;
        })
        // fetchDeleteEvent - Fulfilled
        .addCase(fetchDeleteEvent.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.isLoading = false;
            console.log("Event deleted successfully:", action.payload);
            // Silinen event'i state.eventList'ten çıkarabilirsiniz
        })
        // fetchDeleteEvent - Rejected
        .addCase(fetchDeleteEvent.rejected, (state, action) => {
            state.isLoading = false;
            console.error("Failed to delete event:", action.error.message);
        })
        // fetchSaveEvent - Pending
        .addCase(fetchSaveEvent.pending, (state) => {
            state.isLoading = true;
        })
        // fetchSaveEvent - Fulfilled
        .addCase(fetchSaveEvent.fulfilled, (state, action: PayloadAction<IResponse>) => {
            state.isLoading = false;
            console.log("Event saved successfully:", action.payload);
            // Yeni event'i eventList'e ekleyebilirsiniz
            state.eventList.push(action.payload.data); // Örneğin
        })
        // fetchSaveEvent - Rejected
        .addCase(fetchSaveEvent.rejected, (state, action) => {
            state.isLoading = false;
            console.error("Failed to save event:", action.error.message);
        })
        // fetchGetEventById - Fulfilled
        .addCase(fetchGetEventById.fulfilled, (state, action: PayloadAction<IResponse>) => {
            console.log("Fetched event by ID:", action.payload);
            // Bu ID'ye ait event'in bilgilerini alabilirsiniz
        });
},
});


export default eventSlice.reducer;
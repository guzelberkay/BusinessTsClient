export interface IEvent {
    id: string;                            
    title: string;                   
    startTime: string;       
    endTime: string;         
    allDay?: boolean;
    userId?: number;  
}             
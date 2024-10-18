import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchEventList, fetchSaveEvent, fetchUpdateEvent, IFetchUpdateEvent } from '../store/feature/eventSlice';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core/index.js';
import EventModal from '../components/core/EventModal';
import { IEvent } from '../model/IEvent';
import SelectedDateEventModal from '../components/core/SelectedDateEventModal';
import EventDetailsModal, { EventData } from '../components/core/EventDetailsModal';

function Calendar() {
  const dispatch = useDispatch<AppDispatch>();
  const [eventList, setEventList] = useState<IEvent[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEventModalOpen, setSelectedEventModalOpen] = useState<boolean>(false);
  const [selectedStart, setSelectedStart] = useState<string>('');
  const [selectedEnd, setSelectedEnd] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || "";
    dispatch(fetchEventList({ token }))
      .unwrap()
      .then(data => {
        console.log(data.data);
        setEventList(data.data);
      });
  }, [dispatch]);

  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <>
        <b style={{ color: "#001F3F" }}>{eventContent.timeText}</b>
        &nbsp;
        <b style={{ color: "#3A6D8C" }}> {eventContent.event.title}</b>
      </>
    );
  };

  const handleCreateEventFromModal = async (title: string, start: string, end: string) => {
    const startTime = new Date(start + 'Z'); 
    const endTime = new Date(end + 'Z');

    if (title) {
      await dispatch(fetchSaveEvent({
        token: localStorage.getItem('token') || '',
        title,
        startTime,
        endTime
      })).unwrap(); 
    }
  };

  const handleEventSubmit = async (eventData: { title: string; startTime: string; endTime: string; allDay: boolean }) => {
    const startTime = new Date(eventData.startTime + 'Z'); 
    const endTime = new Date(eventData.endTime + 'Z');

    await dispatch(fetchSaveEvent({
      token: localStorage.getItem('token') || '',
      title: eventData.title,
      startTime,
      endTime
    })).unwrap();

    setModalOpen(false);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const clickedEvent = eventList.find(event => event.id === clickInfo.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setSelectedEventModalOpen(false);
      setModalOpen(false);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedStart(selectInfo.startStr);
    setSelectedEnd(selectInfo.endStr);
    setSelectedEventModalOpen(true);
  };

  const handleUpdateEvent = async (eventData: EventData) => {
   
    if (!eventData.id) {
        console.error("Event ID bulunamadı, güncelleme yapılamadı.");
        return; 
    }

    const updatedEvent: IFetchUpdateEvent = {
        token: localStorage.getItem('token') || '', 
        id: eventData.id, 
        title: eventData.title || '', 
        startTime: new Date(eventData.startTime as string + 'Z'), 
        endTime: new Date(eventData.endTime as string + 'Z'), 
    };

    try {
        const response = await dispatch(fetchUpdateEvent(updatedEvent)).unwrap();
        
        const updatedEventList: IEvent[] = eventList.map(event =>
            event.id === eventData.id 
                ? { 
                    ...event, 
                    title: updatedEvent.title,
                    startTime: updatedEvent.startTime.toISOString(), 
                    endTime: updatedEvent.endTime.toISOString(), 
                } 
                : event
        );
        setEventList(updatedEventList);
        window.location.reload(); 
    } catch (error) {
        console.error("Güncelleme işlemi sırasında bir hata oluştu:", error);
    }
};

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        customButtons={{
          btn: {
            text: "Etkinlik Oluştur",
            click: () => setModalOpen(true)
          }
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "btn dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        editable={true}
        dayMaxEvents={true}
        weekends={true}
        locales={allLocales}
        firstDay={1}
        locale={"tr"}
        events={eventList.map(event => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
        }))}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        buttonText={{
          day: "Gün",
          prev: "Geri",
          nextYear: "Sonraki Yıl",
          prevYear: "Önceki Yıl",
          next: "İleri",
          month: "Ay",
          today: "Bugün",
          week: "Hafta",
        }}
      />
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleEventSubmit}
      />
      <SelectedDateEventModal
        open={selectedEventModalOpen}
        onClose={() => setSelectedEventModalOpen(false)}
        start={selectedStart}
        end={selectedEnd}
        onCreateEvent={handleCreateEventFromModal}
      />
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        eventData={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    </>
  );
}

export default Calendar;
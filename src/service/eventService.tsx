import axios, { AxiosError } from 'axios';
import { EventRequest, EditEventRequest, DeleteEventRequest } from '@/lib/types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/events`;

export const createEvent = async (newEvent: EventRequest): Promise<any> => {
  try {
    const eventSend = {
      description: newEvent.description,
      start_date: new Date(newEvent.start_date).toISOString(),
      end_date: new Date(newEvent.end_date).toISOString(),
      event_type: newEvent.event_type,
      instructor_id: newEvent.instructor_id,
    };

    const response = await axios.post(`${API_URL}`, eventSend);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

export const updateEvent = async (editEvent: EditEventRequest): Promise<any> => {
  try {
    const eventEditSend = {
      description: editEvent.description,
      start_date: new Date(editEvent.start_date).toISOString(),  // Convierte aquí
      end_date: new Date(editEvent.end_date).toISOString(),      // Convierte aquí también
      event_type: editEvent.event_type,
      instructor_id: editEvent.instructor_id,
    };

    const response = await axios.patch(`${API_URL}/${editEvent.id}`, eventEditSend);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
};


export const deleteEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error deleting event:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const getEvents = async (instructorId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/instructor/${instructorId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching events:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

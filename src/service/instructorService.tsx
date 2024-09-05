import axios, { AxiosError } from 'axios';
import { InstructorRequest, UpdateInstructorRequest, DeleteInstructorRequest } from '@/lib/types';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/instructors`;

export const createInstructor = async (newInstructor: InstructorRequest): Promise<any> => {
  try {
    const response = await axios.post(API_URL, newInstructor);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error creating instructor:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const updateInstructor = async (updatedInstructor: UpdateInstructorRequest): Promise<any> => {
  try {
    const response = await axios.patch(`${API_URL}/${updatedInstructor.id}`, updatedInstructor);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error updating instructor:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const deleteInstructor = async (instructorId: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/${instructorId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error deleting instructor:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export const getInstructors = async (): Promise<any> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error fetching instructors:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export interface EventRequest {
    description: string;
    start_date: string;
    end_date: string;
    event_type: string;
    instructor_id: string;
  }
  
  export interface EditEventRequest extends EventRequest {
    id: string;
  }
  
  export interface DeleteEventRequest {
    id: string;
  }
  
  export interface InstructorRequest {
    first_name: string;
    last_name: string;
    birth_date: string;
    organization_id: string;
  }
  
  export interface UpdateInstructorRequest extends InstructorRequest {
    id: string;
  }
  
  export interface DeleteInstructorRequest {
    id: string;
  }
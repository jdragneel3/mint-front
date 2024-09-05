"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { createInstructor, updateInstructor, deleteInstructor, getInstructors } from "@/service/instructorService";
import { createEvent, updateEvent, deleteEvent, getEvents } from "@/service/eventService";

export function MintComponent() {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);

  const [newInstructor, setNewInstructor] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    organization_id: "",
  });

  const [editedInstructor, setEditedInstructor] = useState({
    id: null,
    first_name: "",
    last_name: "",
    birth_date: "",
    organization_id: "",
  });

  const [newEvent, setNewEvent] = useState({
    start_date: "",
    end_date: "",
    event_type: "",
    description: "",
    instructor_id: "",
  });

  const [editedEvent, setEditedEvent] = useState({
    id: null,
    start_date: "",
    end_date: "",
    event_type: "",
    description: "",
    instructor_id: null,
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    if (selectedInstructor) {
      fetchEvents(selectedInstructor.id);
    }
  }, [selectedInstructor]);


  const fetchInstructors = async () => {
    const data = await getInstructors();
    if (data) {
      setInstructors(data);
    }
  };

  const fetchEvents = async (instructorId: string) => {
    const events = await getEvents(instructorId);
    if (events) {
      setEvents(events);
    }
  };

  const handleInstructorCreate = async () => {
    const data = await createInstructor(newInstructor);
    if (data) {
      setInstructors([...instructors, data]);
      setShowInstructorModal(false);
      setNewInstructor({
        first_name: "",
        last_name: "",
        birth_date: "",
        organization_id: "",
      });
    }
  };

  const handleEditInstructor = (instructor: any) => {
    setEditedInstructor({
      id: instructor.id,
      first_name: instructor.first_name,
      last_name: instructor.last_name,
      birth_date: instructor.birth_date,
      organization_id: instructor.organization_id,
    });
    setShowEditInstructorModal(true);
  };

  const handleInstructorUpdate = async () => {
    try {
      const response = await updateInstructor(editedInstructor);
      if (response) {
        setInstructors(instructors.map((inst) => (inst.id === response.id ? response : inst)));
        setShowEditInstructorModal(false);
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
    }
  };

  const handleDeleteInstructor = async (instructorId: string) => {
    try {
      await deleteInstructor(instructorId);
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorId));
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const handleEventCreate = async () => {
    const event = await createEvent({ ...newEvent, instructor_id: selectedInstructor.id });
    if (event) {
      setEvents([...events, event]);
      setShowEventModal(false);
      setNewEvent({
        start_date: "",
        end_date: "",
        event_type: "",
        description: "",
        instructor_id: "",
      });
    }
  };

  const handleEventUpdate = async () => {
    try {
      const eventRes = await updateEvent(editedEvent);
      if (eventRes) {
        setEvents(events.map((event) => (event.id === eventRes.id ? eventRes : event)));
        setShowEditEventModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
  
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleInstructorSelect = (instructor: any) => {
    setSelectedInstructor(instructor);
  };

  const handleEditEvent = (event: any) => {
    const formattedStartDate = new Date(event.start_date).toISOString().split("T")[0];
    const formattedEndDate = new Date(event.end_date).toISOString().split("T")[0];

    setEditedEvent({
      id: event.id,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      event_type: event.event_type,
      description: event.description,
      instructor_id: event.instructor_id,
    });
    setShowEditEventModal(true);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="bg-muted/40 p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold">Instructors</h2>
        <div className="grid gap-4">
          {instructors.map((instructor) => (
            <Card
              key={instructor.id}
              onClick={() => handleInstructorSelect(instructor)}
              className={`cursor-pointer transition-colors hover:bg-muted ${selectedInstructor?.id === instructor.id ? "bg-accent text-accent-foreground" : "bg-background"
                }`}
            >
              <CardContent className="grid gap-1">
                <div className="font-medium">
                  {instructor.first_name} {instructor.last_name}
                </div>
                <div className="text-sm text-muted-foreground">Birth Date: {instructor.birth_date}</div>
                <div className="text-sm text-muted-foreground">Organization ID: {instructor.organization_id}</div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditInstructor(instructor)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteInstructor(instructor.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button onClick={() => setShowInstructorModal(true)}>Add Instructor</Button>
        </div>
      </div>

      <div className="flex-1 bg-background p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold">Events</h2>
        {selectedInstructor ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {selectedInstructor.first_name} {selectedInstructor.last_name}
              </h3>
            </div>
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium py-05">
                        {event.start_date.split("T")[0]}{"  "}until{"  "}{event.end_date.split("T")[0]}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Event Type: {event.event_type}</div>
                    <div className="text-sm text-muted-foreground">Duration: {event.duration_in_days} days</div>
                    <div className="text-sm text-muted-foreground">Description: {event.description}</div>
                    <div className="text-sm text-muted-foreground">
                      Instructor: {selectedInstructor.first_name} {selectedInstructor.last_name}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEventDelete(event.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <Button onClick={() => setShowEventModal(true)}>Add Event</Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Select an instructor to view their events.</p>
          </div>
        )}
      </div>

      <Dialog open={showInstructorModal} onOpenChange={setShowInstructorModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Instructor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={newInstructor.first_name || ""}
                onChange={(e) => setNewInstructor({ ...newInstructor, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={newInstructor.last_name || ""}
                onChange={(e) => setNewInstructor({ ...newInstructor, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="birth_date" className="text-right">
                Birth Date
              </Label>
              <Input
                id="birth_date"
                type="date"
                value={newInstructor.birth_date || ""}
                onChange={(e) => setNewInstructor({ ...newInstructor, birth_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="organization_id" className="text-right">
                Organization ID
              </Label>
              <Input
                id="organization_id"
                value={newInstructor.organization_id || ""}
                onChange={(e) => setNewInstructor({ ...newInstructor, organization_id: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleInstructorCreate}>
              Save
            </Button>
            <Button onClick={() => setShowInstructorModal(false)} variant="ghost">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="start_date" className="text-right">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={newEvent.start_date || ""}
                onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="end_date" className="text-right">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={newEvent.end_date || ""}
                onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="eventType" className="text-right">
                Event Type
              </Label>
              <Select
                value={newEvent.event_type || ""}
                onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFF">OFF</SelectItem>
                  <SelectItem value="SEMINAR">SEMINAR</SelectItem>
                  <SelectItem value="PROJECT">PROJECT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEventCreate}>
              Save
            </Button>
            <Button onClick={() => setShowEventModal(false)} variant="ghost">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditEventModal} onOpenChange={setShowEditEventModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="start_date" className="text-right">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={editedEvent.start_date || ""}
                onChange={(e) => setEditedEvent({ ...editedEvent, start_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="end_date" className="text-right">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={editedEvent.end_date || ""}
                onChange={(e) => setEditedEvent({ ...editedEvent, end_date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="eventType" className="text-right">
                Event Type
              </Label>
              <Select
                value={editedEvent.event_type || ""}
                onValueChange={(value) => setEditedEvent({ ...editedEvent, event_type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFF">OFF</SelectItem>
                  <SelectItem value="SEMINAR">SEMINAR</SelectItem>
                  <SelectItem value="PROJECT">PROJECT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedEvent.description || ""}
                onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEventUpdate}>
              Save
            </Button>
            <Button onClick={() => setShowEditEventModal(false)} variant="ghost">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditInstructorModal} onOpenChange={setShowEditInstructorModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={editedInstructor.first_name || ""}
                onChange={(e) => setEditedInstructor({ ...editedInstructor, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={editedInstructor.last_name || ""}
                onChange={(e) => setEditedInstructor({ ...editedInstructor, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="birthDate" className="text-right">
                Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={editedInstructor.birth_date || ""}
                onChange={(e) => setEditedInstructor({ ...editedInstructor, birth_date: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleInstructorUpdate}>
              Save
            </Button>
            <Button onClick={() => setShowEditInstructorModal(false)} variant="ghost">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

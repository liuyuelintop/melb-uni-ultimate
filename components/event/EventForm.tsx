import React from "react";
import { Event } from "../../types/admin";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export interface EventFormProps {
  form: {
    title: string;
    description: string;
    type: "practice" | "tournament" | "social" | "training";
    startDate: string;
    endDate: string;
    location: string;
    maxParticipants: string;
    registrationDeadline: string;
    isPublic: boolean;
  };
  onChange: (
    field: keyof EventFormProps["form"],
    value: string | boolean
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  form,
  onChange,
  onSubmit,
  submitLabel = "Submit",
  disabled,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="event-title">Event Title</Label>
      <Input
        id="event-title"
        type="text"
        placeholder="Event title"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="event-type">Type</Label>
        <Select
          value={form.type}
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger id="event-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="practice">Practice</SelectItem>
            <SelectItem value="tournament">Tournament</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-location">Location</Label>
        <Input
          id="event-location"
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="event-start">Event Start Time *</Label>
        <Input
          id="event-start"
          type="datetime-local"
          value={form.startDate}
          onChange={(e) => onChange("startDate", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-end">Event End Time</Label>
        <Input
          id="event-end"
          type="datetime-local"
          value={form.endDate}
          onChange={(e) => onChange("endDate", e.target.value)}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="event-max">Max Participants (optional)</Label>
        <Input
          id="event-max"
          type="number"
          placeholder="Max participants"
          value={form.maxParticipants}
          onChange={(e) => onChange("maxParticipants", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="event-deadline">Registration Deadline (optional)</Label>
        <Input
          id="event-deadline"
          type="datetime-local"
          value={form.registrationDeadline}
          onChange={(e) => onChange("registrationDeadline", e.target.value)}
        />
      </div>
    </div>
    <div className="flex items-center gap-3 pt-2">
      <Switch
        id="event-public"
        checked={form.isPublic}
        onCheckedChange={(checked) => onChange("isPublic", checked)}
      />
      <Label htmlFor="event-public" className="text-sm font-normal">
        Public event
      </Label>
    </div>
    <div className="space-y-2">
      <Label htmlFor="event-description">Description</Label>
      <Textarea
        id="event-description"
        placeholder="Event description"
        value={form.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={3}
      />
    </div>
  </div>
);

export default EventForm;

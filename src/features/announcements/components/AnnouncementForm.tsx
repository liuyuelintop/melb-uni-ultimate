import React from "react";
import { Announcement } from "@shared/types/admin";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@shared/components/ui/select";
import { Switch } from "@shared/components/ui/switch";
import { Label } from "@shared/components/ui/label";

export interface AnnouncementFormProps {
  form: {
    title: string;
    content: string;
    priority: "low" | "medium" | "high";
    isPublished: boolean;
  };
  onChange: (
    field: keyof AnnouncementFormProps["form"],
    value: string | boolean
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  form,
  onChange,
}) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="announcement-title">Announcement Title</Label>
      <Input
        id="announcement-title"
        type="text"
        placeholder="Announcement title"
        value={form.title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="announcement-content">Content</Label>
      <Textarea
        id="announcement-content"
        placeholder="Announcement content"
        value={form.content}
        onChange={(e) => onChange("content", e.target.value)}
        rows={4}
        required
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div className="space-y-2">
        <Label htmlFor="announcement-priority">Priority</Label>
        <Select
          value={form.priority}
          onValueChange={(value) => onChange("priority", value)}
        >
          <SelectTrigger id="announcement-priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3 pt-6">
        <Switch
          id="announcement-publish"
          checked={form.isPublished}
          onCheckedChange={(checked) => onChange("isPublished", checked)}
        />
        <Label htmlFor="announcement-publish" className="text-sm font-normal">
          Publish immediately
        </Label>
      </div>
    </div>
  </div>
);

export default AnnouncementForm;

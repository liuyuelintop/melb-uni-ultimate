import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@shared/components/ui/dialog";
import { ScrollArea } from "@shared/components/ui/scroll-area";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@shared/components/ui/select";
import { Textarea } from "@shared/components/ui/textarea";
import { Button } from "@shared/components/ui/Button";
import { Label } from "@shared/components/ui/label";
import {
  User,
  GraduationCap,
  Briefcase,
  Trophy,
  Phone,
  Save,
} from "lucide-react";

export interface AlumniForm {
  name: string;
  email: string;
  studentId?: string;
  graduationYear?: string;
  currentLocation?: string;
  currentJob?: string;
  company?: string;
  achievements: string[];
  contactPreference: "email" | "phone" | "linkedin";
  phoneNumber?: string;
  linkedinUrl?: string;
  affiliation?: string;
  isActive?: boolean;
}

interface AlumniFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: AlumniForm;
  setForm: React.Dispatch<React.SetStateAction<AlumniForm>>;
  handleSubmit: (e: React.FormEvent) => void;
  modalTitle: string;
  submitText: string;
}

const AlumniFormModal: React.FC<AlumniFormModalProps> = ({
  open,
  onOpenChange,
  form,
  setForm,
  handleSubmit,
  modalTitle,
  submitText,
}) => {
  if (!form) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl p-0"
        showCloseButton={true}
      >
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-name">Full Name</Label>
                  <Input
                    id="alumni-name"
                    name="name"
                    value={form.name || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-studentId">Student ID</Label>
                  <Input
                    id="alumni-studentId"
                    name="studentId"
                    value={form.studentId || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        studentId: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="alumni-email">Email Address</Label>
                  <Input
                    id="alumni-email"
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            </div>
            {/* Academic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Academic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-graduationYear">Graduation Year</Label>
                  <Input
                    id="alumni-graduationYear"
                    type="number"
                    name="graduationYear"
                    value={form.graduationYear || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        graduationYear: e.target.value,
                      }))
                    }
                    min={2010}
                    max={2030}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-currentLocation">
                    Current Location
                  </Label>
                  <Input
                    id="alumni-currentLocation"
                    name="currentLocation"
                    value={form.currentLocation || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        currentLocation: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Professional Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Professional Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-currentJob">Current Job</Label>
                  <Input
                    id="alumni-currentJob"
                    name="currentJob"
                    value={form.currentJob || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        currentJob: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-company">Company</Label>
                  <Input
                    id="alumni-company"
                    name="company"
                    value={form.company || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        company: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-phoneNumber">Phone Number</Label>
                  <Input
                    id="alumni-phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-linkedinUrl">LinkedIn Profile</Label>
                  <Input
                    id="alumni-linkedinUrl"
                    type="url"
                    name="linkedinUrl"
                    value={form.linkedinUrl || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        linkedinUrl: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="alumni-affiliation">Affiliation</Label>
                  <Input
                    id="alumni-affiliation"
                    name="affiliation"
                    value={form.affiliation || ""}
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        affiliation: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Achievements Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Achievements
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="alumni-achievements">Achievements</Label>
                  <Textarea
                    id="alumni-achievements"
                    name="achievements"
                    value={
                      Array.isArray(form.achievements)
                        ? form.achievements.join("\n")
                        : form.achievements || ""
                    }
                    onChange={(e) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        achievements: e.target.value.split("\n"),
                      }))
                    }
                    rows={4}
                    className="min-h-[120px]"
                    placeholder="Enter achievements, one per line..."
                  />
                </div>
              </div>
            </div>
            {/* Contact Preferences Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Preferences
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="alumni-contactPreference">
                    Preferred Contact Method
                  </Label>
                  <Select
                    name="contactPreference"
                    value={form.contactPreference || "email"}
                    onValueChange={(value) =>
                      setForm((a: AlumniForm) => ({
                        ...a,
                        contactPreference: value as
                          | "email"
                          | "phone"
                          | "linkedin",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-6 pt-4 border-t border-border/50 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                {submitText}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AlumniFormModal;

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
import { Button } from "@shared/components/ui/Button";
import { Label } from "@shared/components/ui/label";
import { User, Target, Phone, Save } from "lucide-react";
import { Switch } from "@shared/components/ui/switch";

export interface PlayerForm {
  name: string;
  email: string;
  studentId?: string;
  gender: "male" | "female" | "other";
  position: "handler" | "cutter" | "utility";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  jerseyNumber?: string;
  phoneNumber?: string;
  graduationYear?: string;
  affiliation?: string;
  isActive?: boolean;
}

interface PlayerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: PlayerForm;
  setForm: React.Dispatch<React.SetStateAction<PlayerForm>>;
  handleSubmit: (e: React.FormEvent) => void;
  modalTitle: string;
  submitText: string;
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
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
        className="max-w-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl p-0"
        showCloseButton={true}
      >
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="player-name">Full Name</Label>
                  <Input
                    id="player-name"
                    name="name"
                    value={form.name || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-email">Email</Label>
                  <Input
                    id="player-email"
                    type="email"
                    name="email"
                    value={form.email || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-studentId">Student ID</Label>
                  <Input
                    id="player-studentId"
                    name="studentId"
                    value={form.studentId || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        studentId: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Game Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Game Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="player-gender">Gender</Label>
                  <Select
                    name="gender"
                    value={form.gender || "other"}
                    onValueChange={(value) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        gender: value as "male" | "female" | "other",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-position">Position</Label>
                  <Select
                    name="position"
                    value={form.position || "utility"}
                    onValueChange={(value) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        position: value as "handler" | "cutter" | "utility",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="handler">Handler</SelectItem>
                      <SelectItem value="cutter">Cutter</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-experience">Experience</Label>
                  <Select
                    name="experience"
                    value={form.experience || "beginner"}
                    onValueChange={(value) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        experience: value as
                          | "beginner"
                          | "intermediate"
                          | "advanced"
                          | "expert",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-jerseyNumber">Jersey Number</Label>
                  <Input
                    id="player-jerseyNumber"
                    type="number"
                    name="jerseyNumber"
                    value={form.jerseyNumber || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        jerseyNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="player-graduationYear">Graduation Year</Label>
                  <Input
                    id="player-graduationYear"
                    type="number"
                    name="graduationYear"
                    value={form.graduationYear || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        graduationYear: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="player-phoneNumber">Phone Number</Label>
                  <Input
                    id="player-phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="player-affiliation">Affiliation</Label>
                  <Input
                    id="player-affiliation"
                    name="affiliation"
                    value={form.affiliation || ""}
                    onChange={(e) =>
                      setForm((p: PlayerForm) => ({
                        ...p,
                        affiliation: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2 flex items-center gap-3 pt-2">
                  <Label htmlFor="player-isActive">Active Status</Label>
                  <Switch
                    id="player-isActive"
                    checked={form.isActive ?? true}
                    onCheckedChange={(checked) =>
                      setForm((p: PlayerForm) => ({ ...p, isActive: checked }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
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

export default PlayerFormModal;

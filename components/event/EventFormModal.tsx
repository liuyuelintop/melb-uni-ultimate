import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import EventForm, { EventFormProps } from "./EventForm";
import { Button } from "../ui/Button";

interface EventFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: EventFormProps["form"];
  setForm: React.Dispatch<React.SetStateAction<EventFormProps["form"]>>;
  handleSubmit: (e: React.FormEvent) => void;
  modalTitle: string;
  submitText: string;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
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
            <EventForm
              form={form}
              onChange={(field, value) =>
                setForm((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={() => {}}
              submitLabel={undefined}
            />
            <DialogFooter className="p-6 pt-4 border-t border-border/50 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">{submitText}</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormModal;

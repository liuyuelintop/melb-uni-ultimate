import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import VideoForm from "./VideoForm";
import { CreateVideoRequest } from "@shared/types/video";

export interface VideoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: CreateVideoRequest;
  onChange: (
    field: keyof CreateVideoRequest,
    value: string | string[] | boolean
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
  isEdit?: boolean;
  title?: string;
}

const VideoFormModal: React.FC<VideoFormModalProps> = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
  isEdit = false,
  title,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title || (isEdit ? "Edit Video" : "Add New Video")}
          </DialogTitle>
        </DialogHeader>
        <VideoForm
          form={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          submitLabel={submitLabel}
          disabled={disabled}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoFormModal;

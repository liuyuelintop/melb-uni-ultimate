import AlumniFormModal, { AlumniForm } from "./AlumniFormModal";

interface AlumniEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: AlumniForm;
  setEditForm: React.Dispatch<React.SetStateAction<AlumniForm>>;
  handleEditSubmit: (e: React.FormEvent) => void;
}

const AlumniEditModal = (props: AlumniEditModalProps) => (
  <AlumniFormModal
    open={props.open}
    onOpenChange={props.onOpenChange}
    form={props.editForm}
    setForm={props.setEditForm}
    handleSubmit={props.handleEditSubmit}
    modalTitle="Edit Alumni"
    submitText="Save"
  />
);

export default AlumniEditModal;

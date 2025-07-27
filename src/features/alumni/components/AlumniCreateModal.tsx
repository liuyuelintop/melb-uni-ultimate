import AlumniFormModal, { AlumniForm } from "./AlumniFormModal";

interface AlumniCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newAlumni: AlumniForm;
  setNewAlumni: React.Dispatch<React.SetStateAction<AlumniForm>>;
  handleAddSubmit: (e: React.FormEvent) => void;
}

const AlumniCreateModal = (props: AlumniCreateModalProps) => (
  <AlumniFormModal
    open={props.open}
    onOpenChange={props.onOpenChange}
    form={props.newAlumni}
    setForm={props.setNewAlumni}
    handleSubmit={props.handleAddSubmit}
    modalTitle="Add Alumni"
    submitText="Add"
  />
);

export default AlumniCreateModal;

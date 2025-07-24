import PlayerFormModal, { PlayerForm } from "./PlayerFormModal";

interface PlayerEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: PlayerForm;
  setEditForm: React.Dispatch<React.SetStateAction<PlayerForm>>;
  handleEditSubmit: (e: React.FormEvent) => void;
}

const PlayerEditModal = (props: PlayerEditModalProps) => (
  <PlayerFormModal
    open={props.open}
    onOpenChange={props.onOpenChange}
    form={props.editForm}
    setForm={props.setEditForm}
    handleSubmit={props.handleEditSubmit}
    modalTitle="Edit Player"
    submitText="Save"
  />
);

export default PlayerEditModal;

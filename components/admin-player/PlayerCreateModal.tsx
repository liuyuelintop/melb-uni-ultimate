// eslint-disable-next-line @typescript-eslint/no-explicit-any
import PlayerFormModal, { PlayerForm } from "./PlayerFormModal";

interface PlayerCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPlayer: PlayerForm;
  setNewPlayer: React.Dispatch<React.SetStateAction<PlayerForm>>;
  handleAddSubmit: (e: React.FormEvent) => void;
}

const PlayerCreateModal = (props: PlayerCreateModalProps) => (
  <PlayerFormModal
    open={props.open}
    onOpenChange={props.onOpenChange}
    form={props.newPlayer}
    setForm={props.setNewPlayer}
    handleSubmit={props.handleAddSubmit}
    modalTitle="Add Player"
    submitText="Add"
  />
);

export default PlayerCreateModal;

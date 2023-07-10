import Modal from "../Modal";

interface RankModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RankModal({ isOpen, setOpen }: RankModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      contentLabel="Add Server"
      className="bg-bg-800 flex flex-col gap-1 outline-none rounded-md p-2 m-auto items-center justify-center "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      onAfterClose={() => {}}
      onRequestClose={() => setOpen(false)}
    >
      <div className="flex flex-col gap-2">
        <h1>Rank Series</h1>
      </div>
    </Modal>
  );
}

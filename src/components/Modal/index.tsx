import ReactModal from "react-modal";
import "./animation.css";
import { useState, useEffect } from "react";

interface ModalProps extends ReactModal.Props {}

export default function Modal({
  isOpen,
  children,
  className,
  overlayClassName,
  shouldCloseOnEsc,
  shouldCloseOnOverlayClick,
  onRequestClose,
}: ModalProps) {
  const [contentAnimationClass, setContentAnimationClass] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setContentAnimationClass("show"), 0);
    } else {
      setContentAnimationClass("");
    }
  }, [isOpen]);

  return (
    <ReactModal
      closeTimeoutMS={500}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Server"
      className={` rounded-md`}
      overlayClassName={
        overlayClassName ||
        "ReactModal__Overlay ReactModal__Overlay--after-open ReactModal__Overlay--before-close fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      }
      shouldCloseOnEsc={shouldCloseOnEsc ?? true}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick ?? true}
      onAfterClose={() => {}}
    >
      <div
        className={
          className
            ? `${className} modal-content ${contentAnimationClass}`
            : ` flex flex-col gap-3 outline-none rounded-md m-auto items-center justify-center modal-content ${contentAnimationClass}`
        }
      >
        {children}
      </div>
    </ReactModal>
  );
}

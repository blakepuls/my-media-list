import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useDetectedChanges } from "@/hooks/DetectedChanges";
import { toast } from "react-toastify";
import "./animation.css"; // Import the CSS file
import { AiOutlineLoading } from "react-icons/ai";

export default function DetectedChangesContainer() {
  const { saveAll, resetAll, saveFunctions } = useDetectedChanges();
  const [saving, setSaving] = useState(false);

  function save() {
    const savePromise = async () => {
      setSaving(true);
      await saveAll();
      setSaving(false);
    };

    toast
      .promise(savePromise(), {
        pending: "Saving changes...",
        success: "Saved changes!",
        // error: "Error saving changes!", // This makes it so that you can throw your own error and it won't show the toast here.
      })
      .catch((error) => {
        setSaving(false);
      });
  }

  return (
    <CSSTransition
      in={saveFunctions.length !== 0}
      timeout={300}
      classNames="slide-up"
      unmountOnExit
    >
      <div className={`absolute inset-x-0 bottom-0 p-3 overflow-hidden z-10`}>
        <div className="bg-gray-950 flex items-center p-3 shadow-md rounded-md">
          <h1 className="text-xl">Unsaved Changes</h1>
          <div className="flex items-center ml-auto gap-3">
            <h1
              className="text-white hover:text-gray-400 cursor-pointer transition-all select-none"
              onClick={resetAll}
            >
              Reset
            </h1>
            <button
              className="btn-primary ml-auto"
              onClick={save}
              disabled={saving}
            >
              {saving && (
                <AiOutlineLoading className="animate-spin w-4.5 h-4.5" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

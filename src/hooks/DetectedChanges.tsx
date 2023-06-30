import { createContext, useContext, useEffect, useState } from "react";
import { useEffectAfterRender } from "./useEffectAfterRender";

export type SaveFunction = () => Promise<any>;
export type ResetFunction = () => void;
type DetectedChangesValue = {
  resetting: boolean;
  addSave: (saveFn: SaveFunction) => void;
  removeSave: (saveFn: SaveFunction) => void;
  saveAll: () => Promise<void>;
  saveFunctions: SaveFunction[];
  addReset: (resetFn: ResetFunction) => void; // Add addReset to the context value
  removeReset: (resetFn: ResetFunction) => void; // Add removeReset to the context value
  resetAll: () => void; // Add resetAll to the context value
  resetFunctions: ResetFunction[]; // Add resetFunctions to the context value
};

const DetectedChanges = createContext<DetectedChangesValue | undefined>(
  undefined
);

export function useDetectedChanges(effect?: () => void, deps?: any[]) {
  const context = useContext(DetectedChanges);
  if (!context) {
    throw new Error(
      "useDetectedChanges must be used within a DetectedChangesProvider"
    );
  }

  /**
   * Custom hook for listening to changes
   * Prevents misfires when the component is first rendered
   * as well as when the component is unmounted or reset.
   */
  useEffectAfterRender(() => {
    if (context.resetting || !effect) return; // Don't fire if resetting
    effect();
  }, deps ?? []);

  return context;
}

export function DetectedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [saveFunctions, setSaveFunctions] = useState<SaveFunction[]>([]);
  const [resetFunctions, setResetFunctions] = useState<ResetFunction[]>([]);
  const [resetting, setResetting] = useState(false);

  const addSave = (saveFn: SaveFunction) => {
    setSaveFunctions((prev) => {
      const existingFnIndex = prev.findIndex(
        (fn) => fn.toString() === saveFn.toString()
      );
      if (existingFnIndex >= 0) {
        const updatedSaveFunctions = [...prev];
        updatedSaveFunctions[existingFnIndex] = saveFn;
        return updatedSaveFunctions;
      }
      return [...prev, saveFn];
    });
  };

  const removeSave = (saveFn: SaveFunction) => {
    setSaveFunctions((prev) => prev.filter((fn) => fn !== saveFn));
  };

  const saveAll = async () => {
    const results = await Promise.allSettled(
      saveFunctions.map((saveFn) => saveFn())
    );
    const failedResults = results.filter(
      (result) => result.status === "rejected"
    );

    // Remove successful functions
    const successfulFns = saveFunctions.filter(
      (_, index) => results[index].status !== "rejected"
    );
    setSaveFunctions((prev) =>
      prev.filter((fn) => !successfulFns.includes(fn))
    );

    if (failedResults.length > 0) {
      throw new Error("One or more save functions failed.");
    }
  };

  const addReset = (resetFn: ResetFunction) => {
    setResetFunctions((prev) => [...prev, resetFn]);
  };

  const removeReset = (resetFn: ResetFunction) => {
    setResetFunctions((prev) => prev.filter((fn) => fn !== resetFn));
  };

  const resetAll = async () => {
    setResetting(true);
    await Promise.all(resetFunctions.map((resetFn) => resetFn()));
    setSaveFunctions([]);
    setResetFunctions([]);
    setResetting(false);
  };

  return (
    <DetectedChanges.Provider
      value={{
        addSave,
        removeSave,
        saveAll,
        saveFunctions,
        addReset, // Include addReset in the provided value
        removeReset, // Include removeReset in the provided value
        resetAll, // Include resetAll in the provided value
        resetFunctions, // Include resetFunctions in the provided value
        resetting,
      }}
    >
      {children}
    </DetectedChanges.Provider>
  );
}

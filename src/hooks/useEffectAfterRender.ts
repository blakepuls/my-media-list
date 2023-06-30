import { useEffect, useRef } from "react";

export function useEffectAfterRender(fn: () => void, deps: any[]) {
  const didMountRef = useRef(false);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (didMountRef.current) {
      fnRef.current();
    } else {
      didMountRef.current = true;
    }
  }, deps);
}

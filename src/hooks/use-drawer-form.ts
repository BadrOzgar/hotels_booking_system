"use client";

import { useState, useTransition } from "react";

/**
 * Drives a drawer-hosted form against a server action that returns
 * `string | undefined` (error message, or undefined on success). Unlike
 * `useActionState` + `redirect()`, this never navigates — on success it just
 * calls `onSuccess`, letting the caller close the drawer and refresh the
 * underlying list in place.
 */
export function useDrawerForm(
  action: (formData: FormData) => Promise<string | undefined>,
  onSuccess: () => void
) {
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError(undefined);
    startTransition(async () => {
      const result = await action(formData);
      if (result) {
        setError(result);
      } else {
        onSuccess();
      }
    });
  }

  return { error, pending, submit };
}

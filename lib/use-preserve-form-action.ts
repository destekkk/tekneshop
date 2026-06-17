"use client";

import { useActionState, useCallback, useState } from "react";
import { snapshotFormData, type FormFieldValues } from "@/lib/form-preserve";

export type BasicFormState = {
  ok: boolean;
  message: string;
  error: string;
};

type FormAction = (prev: BasicFormState, formData: FormData) => Promise<BasicFormState>;

export function usePreserveFormAction(action: FormAction, initial: BasicFormState) {
  const [state, dispatch, pending] = useActionState(action, initial);
  const [values, setValues] = useState<FormFieldValues>({});

  const snapshotBeforeSubmit = useCallback((formData: FormData) => {
    setValues(snapshotFormData(formData));
  }, []);

  const actionWithSnapshot = useCallback(
    (formData: FormData) => {
      snapshotBeforeSubmit(formData);
      dispatch(formData);
    },
    [dispatch, snapshotBeforeSubmit],
  );

  return {
    state,
    action: actionWithSnapshot,
    dispatch,
    pending,
    values,
    snapshotBeforeSubmit,
  };
}

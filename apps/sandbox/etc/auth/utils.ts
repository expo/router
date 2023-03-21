import * as React from "react";

export type UseStateHook<T> = [
  { value: T | null; isLoading: boolean; error: Error | null },
  (value: T | null) => void
];

export function useSafeState<T>(initialValue?: {
  value: T | null;
  isLoading: boolean;
  error: Error | null;
}) {
  return React.useReducer(
    (
      state: { value: T | null; isLoading: boolean; error: Error | null },
      action: Partial<{
        value: T | null;
        isLoading: boolean;
        error: Error | null;
      }>
    ) => ({
      isLoading: action.isLoading ?? false,
      error: action.error === undefined ? null : action.error,
      value: action.value === undefined ? null : action.value,
    }),
    initialValue ?? { value: null, isLoading: true, error: null }
  );
}

export function useMounted() {
  return React.useRef(true).current;
}

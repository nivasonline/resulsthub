import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch {
          // storage unavailable (private mode, quota, etc.) — fail silently
        }
        return valueToStore;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}

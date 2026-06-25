const isBrowser = (): boolean => typeof window !== "undefined";

export const getStorageItem = <T>(key: string): T | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / privacy errors.
  }
};

export const removeStorageItem = (key: string): void => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore errors.
  }
};

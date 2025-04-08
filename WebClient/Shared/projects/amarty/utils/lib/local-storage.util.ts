export function setLocalStorageItem(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorageItem<T>(key: string): T | undefined {
  const item = localStorage.getItem(key);
  return !!item ? JSON.parse(item) : undefined;
}

export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key);
}

export function clear(): void {
  localStorage.clear();
}

export function clearLocalStorageAndRefresh(force = false): void {
  if (force) {
    clear();
  } else {
    localStorage.removeItem('dictionaries');
    localStorage.removeItem('localizations');
    localStorage.removeItem('settings');
  }
  location.reload();
}

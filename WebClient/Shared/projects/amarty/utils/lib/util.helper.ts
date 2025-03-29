import { DataItem } from '@amarty/models';

export function generateRandomId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getNameFromDataItems(id: string | undefined, dataItems: DataItem[] | undefined): string | undefined {
  if (!id || !dataItems || !dataItems.length) {
    return undefined;
  }
  const index = dataItems.findIndex(item => item.id === id);
  return index > -1 ? dataItems[index].name : undefined;
}

export function getDescriptionFromDataItems(id: string | undefined, dataItems: DataItem[] | undefined): string | undefined {
  if (!id || !dataItems || !dataItems.length) {
    return undefined;
  }
  const index = dataItems.findIndex(item => item.id === id);
  return index > -1 ? dataItems[index].description : undefined;
}

export function getIdFromDataItems(name: string, dataItems: DataItem[]): string | undefined {
  const index = dataItems.findIndex(item => item.name === name);
  return index > -1 ? dataItems[index].id : undefined;
}

export function generateGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const random = Math.random() * 16 | 0;
    const value = char === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
}

export function traceCreation(instance: any, trace: boolean = true) {
  if (!trace) {
    return;
  }
  const className = instance.constructor.name;
  console.trace(`🧩 Creating ${className}`);
}


export interface IDataItem {
  id: string | undefined;
  name: string | undefined;
  description?: string | undefined;
  isImportant?: boolean | undefined;

  children?: IDataItem[] | undefined;
}

export class DataItem implements IDataItem {
  id: string | undefined;
  name: string | undefined;
  description?: string | undefined;
  isImportant?: boolean | undefined;

  children?: DataItem[] | undefined;

  constructor(data?: IDataItem) {
    this.id = data?.id;
    this.name = data?.name;
    this.description = data?.description;
    this.isImportant = data?.isImportant;
    if (data?.children) {
      this.children = data.children.map(child => new DataItem(child));
    }
  }
}

export function createEnumDataItems(enumType: any): DataItem[] {
  const dataItems: DataItem[] = [];
  const enumItems = Object.values(enumType).filter(value => typeof value === 'number');
  enumItems.forEach(entity => {
    dataItems.push(new DataItem({
      id: entity.toString(),
      name: entity.toString(),
      description: entity.toString(),
      isImportant: false,
      children: []
    }));
  });
  return dataItems;
}

export interface IInputError {
  error: string | undefined;
}

export class InputError implements IInputError {
  error: string | undefined;

  constructor(data?: IInputError) {
    this.error = data?.error;
  }
}

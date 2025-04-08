export interface IDataItem {
  id: string | undefined;
  name: string | undefined;
  description?: string | undefined;
  iconId?: number | undefined;
  color?: string | undefined;
  isActive?: boolean | undefined;
  isImportant?: boolean | undefined;
  flagIcon?: string | undefined;

  filteredFields?: string[] | undefined;

  children?: IDataItem[] | undefined;
}

export class DataItem implements IDataItem {
  id: string | undefined;
  name: string | undefined;
  description?: string | undefined;
  iconId?: number | undefined;
  color?: string | undefined;
  isActive?: boolean | undefined;
  isImportant?: boolean | undefined;
  flagIcon?: string | undefined;

  children: DataItem[] | undefined;

  filteredFields?: string[] | undefined;

  constructor(data?: IDataItem) {
    this.id = data?.id;
    this.name = data?.name;
    this.description = data?.description;
    this.iconId = data?.iconId;
    this.color = data?.color;
    this.isActive = data?.isActive ?? true;
    this.isImportant = data?.isImportant ?? false;
    this.filteredFields = data?.filteredFields ?? [];
    this.flagIcon = data?.flagIcon;
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
      children: [],
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

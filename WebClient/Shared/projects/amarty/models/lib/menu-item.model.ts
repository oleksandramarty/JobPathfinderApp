export interface IMenuItem {
  title?: string | undefined;
  key: string | undefined;
  value?: string | undefined;
  icon?: string | undefined;
  url?: string | undefined;
  actionFn?: () => void;
  className?: string | undefined;

}

export class MenuItem implements IMenuItem {
  title?: string | undefined;
  key: string | undefined;
  value?: string | undefined;
  icon?: string | undefined;
  url?: string | undefined;
  className?: string | undefined;
  actionFn?: () => void;

  constructor(data?: IMenuItem) {
    this.title = data?.title;
    this.key = data?.key;
    this.value = data?.value;
    this.icon = data?.icon;
    this.url = data?.url;
    this.className = data?.className;
    this.actionFn = data?.actionFn;
  }
}

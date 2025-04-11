import { BaseUnsubscribeComponent } from '@amarty/common';
import { Directive, Input } from '@angular/core';
import { IHasId, UserProfileItemEnum } from '@amarty/models';
import { SafeHtml } from '@angular/platform-browser';
import {LOCALIZATION_KEYS} from "@amarty/localizations";

@Directive()
export abstract class BaseProfileSectionComponent<
  TSectionItemResponse extends IHasId<TSectionItemId>,
  TSectionItemId
> extends BaseUnsubscribeComponent {
  @Input() existingItems: TSectionItemResponse[] | undefined;

  public itemsToAdd: TSectionItemResponse[] | undefined;
  public itemIdsToRemove: TSectionItemId[] | undefined;

  public isEditMode: boolean = false;

  protected constructor(
  ) {
    super();
  }

  get isEmptySection(): boolean {
    return (!this.itemsToAdd || !!this.itemsToAdd && this.itemsToAdd.length === 0) &&
      (!this.existingItems || !!this.existingItems && this.existingItems.length === 0);
  }

  protected openDialogExecutableAction(isNew: boolean, itemId: TSectionItemId): any {
    const executableAction = (model: TSectionItemResponse): void => {
      if (isNew) {
        model.id = !!model.id ? model.id : itemId;
      }
      const targetList = isNew
        ? (this.itemsToAdd ??= [])
        : (this.existingItems ??= []);

      const index = targetList.findIndex(item => item.id === model.id);

      if (index > -1) {
        targetList[index] = model;
      } else {
        targetList.push(model);
      }
    };

    return executableAction;
  }

  protected findItem(isNew: boolean, itemId?: TSectionItemId | undefined): TSectionItemResponse | undefined {
    if (!itemId) return undefined;

    const itemList = isNew ? this.itemsToAdd : this.existingItems;
    const index = itemList?.findIndex(item => item.id === itemId) ?? -1;

    return index > -1 ? itemList?.[index] : undefined;
  };

  protected removeItem(isNew: boolean, itemId: TSectionItemId): void {
    this.itemIdsToRemove ??=[];

    if (isNew) {
      this.removeFromList(itemId, this.itemsToAdd);
    } else {
      this.removeFromList(itemId, this.existingItems);
      this.itemIdsToRemove.push(itemId);
    }
  }

  protected removeFromList(itemId: TSectionItemId, list?: TSectionItemResponse[]): void {
    const index = list?.findIndex(item => item.id === itemId);
    if (index !== undefined && index > -1) {
      list!.splice(index, 1);
    }
  };

  protected abstract openItemDialog(isNew: boolean, itemId?: TSectionItemId): void;

  protected abstract getExistingIds(): TSectionItemId[];

  protected abstract getItemTitle(item: TSectionItemResponse | undefined): SafeHtml | string | undefined;
}

export function itemTypeTitle(itemType: UserProfileItemEnum | undefined): string {
  switch (itemType) {
  case UserProfileItemEnum.Experience:
    return LOCALIZATION_KEYS.PROFILE.SECTION.WORK_EXPERIENCE;
  case UserProfileItemEnum.Education:
    return LOCALIZATION_KEYS.PROFILE.SECTION.EDUCATION;
  case UserProfileItemEnum.Project:
    return LOCALIZATION_KEYS.PROFILE.SECTION.PROJECTS;
  case UserProfileItemEnum.Achievement:
    return LOCALIZATION_KEYS.PROFILE.SECTION.ACHIEVEMENTS;
  case UserProfileItemEnum.Certification:
    return LOCALIZATION_KEYS.PROFILE.SECTION.CERTIFICATIONS;
  default:
    return '';
  }
}

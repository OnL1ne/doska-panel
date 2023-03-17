import {Injectable} from "@angular/core";
import {faSortUp, faSortDown, faSort} from '@fortawesome/free-solid-svg-icons';
import {SortColumn} from "../models/training.model";

@Injectable()
export class SortTableService {
  private faSortUp = faSortUp;
  private faSortDown = faSortDown;
  private faSort = faSort;
  public sortArrowDefault = faSort;
  public sortedColumns: SortColumn[];

  public arrowsSwitchSort(name:string) {
    let index = this.sortedColumns.findIndex(h => h.name === name);
    let iconName = this.sortedColumns[index].icon.iconName;
    if (iconName) {
      let icon;
      switch (iconName) {
        case "sort":
          icon = this.faSortUp;
          break;
        case "sort-up":
          icon = this.faSortDown;
          break;
        case "sort-down":
          icon = this.faSortUp;
          break;
        default:
          icon = this.faSort;
          break
      }
      for (let k in this.sortedColumns) {
        this.sortedColumns[k].icon = this.faSort;
      }
      this.sortedColumns[index].icon = icon;
    }
  }
}

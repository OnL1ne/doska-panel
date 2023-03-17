import {Injectable} from "@angular/core";

@Injectable()
export class SearchTableService {
  private data = [];
  private dataTemplate = [];
  private searchFields = <any>[];

  public setDataTemplate(data:Array<any>):void {
    this.dataTemplate = data;
    this.setData(data);
  }

  public setData(data:Array<any>):void {
    this.data = data;
  }

  public getData() {
    return this.data;
  }

  public filterData(event) {
    let searchValue = event.target.value;
    let tempData = this.dataTemplate.concat();
    tempData = tempData.filter(h => JSON.stringify(h).indexOf(searchValue) !== -1);

    this.setData(tempData);
  }
}

import {Injectable} from "@angular/core";

@Injectable()
export class SystemMessagesService {
  private serverErrors = [];
  private serverSuccess = [];

  public getServerErrors() {
    return this.serverErrors;
  }

  public getServerSuccess() {
    return this.serverSuccess;
  }

  public setServerErrors(value:string) {
    if (!value) return;
    this.serverErrors.push(value);
  }

  public setServerSuccess(value:string) {
    if (!value) return;
    this.serverSuccess.push(value);
  }

  public clearSystemMessages() {
    this.serverErrors = [];
    setTimeout(() => {
      this.serverSuccess = [];
    }, 3000)
  }
}


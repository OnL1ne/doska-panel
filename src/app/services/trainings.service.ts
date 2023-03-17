import {Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpEventType, HttpResponse} from "@angular/common/http";

import {Observable, pipe} from "rxjs";
import {catchError, filter, map, tap} from "rxjs/operators";

import {Training} from "src/app/models/training.model";
import {HttpErrorHandler, HandlerError} from "./http-error-handler.services";
import {environment} from "../../environments/environment";
import {FormControl} from "@angular/forms";

@Injectable()
export class TrainingsService {
  public handleError: HandlerError;
  private percentDone: number;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('TrainingsService');
  }

  public getTrainings(): Observable<Training[]> {
    return this.http
      .get<Training[]>(`${environment.API_ENDPOINT}/get-trainings/`)
      .pipe(catchError(this.handleError('getTrainings', [])))
  }

  public addTraining(value) {
    return this.http
      .post(`${environment.API_ENDPOINT}/create-training/`, value,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(
        catchError(this.handleError('addTrainingFile', value)),
        this.uploadProgress(progress => (this.percentDone = progress)),
        this.toResponseBody()
      )
  }

  public updateTraining(training: Training): Observable<Training> {
    return this.http
      .put<Training>(`${environment.API_ENDPOINT}/update-training/${training.id}`, training)
      .pipe(catchError(this.handleError('updateTraining', training)))
  }

  public deleteTraining(id: number): Observable<{}> {
    const url = `${environment.API_ENDPOINT}/delete-training/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError(this.handleError('deleteTraining')))
  }

  public downloadTraining(id: number) {
    const url = `${environment.API_ENDPOINT}/download-training/${id}`;
    return this.http
      .get(url, { responseType: 'blob', observe: 'response' })
      .pipe(
        catchError(this.handleError('downloadTraining'))
      )
  }

  public toResponseBody<T>() {
    return pipe(
      filter(( event: HttpEvent<T> ) => event.type === HttpEventType.Response),
      map(( res: HttpResponse<T> ) => res.body)
    );
  }

  public uploadProgress<T>( cb: ( progress: number ) => void ) {
    return tap(( event: HttpEvent<T> ) => {
      if ( event.type === HttpEventType.UploadProgress ) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }

  public requiredFileType(control:FormControl) {
    const types = ['png', 'jpg'];
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (types.filter(h => h === extension).length > 0) {
        return null;
      }
    }

    return {
      requiredFileType: false
    };
  }

  public toFormData<T>( formValue: T ) {
    const formData = new FormData();

    for ( const key of Object.keys(formValue) ) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
}

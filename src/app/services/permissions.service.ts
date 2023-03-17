import {Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {HandlerError, HttpErrorHandler} from "./http-error-handler.services";
import {some} from 'lodash'
import {Permission} from "src/app/models/permission.model";

@Injectable()
export class PermissionsService {
  /* User management */
  public PERMISSION_VIEW_USERS_LIST = 'View the list of users';
  public PERMISSION_CREATE_USER_ACCOUNT = 'Create a user account';
  public PERMISSION_UPDATE_USER_ACCOUNT = 'Change a user account data';
  public PERMISSION_DELETE_USER_ACCOUNT = 'Delete a user account';
  public PERMISSION_MANAGE_USER_ACCOUNT_LICENSE = 'Manage user account license';
  /* Manage training */
  public PERMISSION_VIEW_TRAININGS_LIST = 'View the list of training';
  public PERMISSION_CREATE_TRAINING = 'Create a new training';
  public PERMISSION_UPDATE_TRAINING = 'Update a training';
  public PERMISSION_DELETE_TRAINING = 'Delete a training';
  /* Dashboard */
  public PERMISSION_VIEW_TOTAL_STATISTICS = 'View the total statistics';
  public PERMISSION_VIEW_SPECIFIC_ACCOUNT_STATISTICS = 'View a specific account statistics';
  /* Account settings management */
  public PERMISSION_CHANGE_PASSWORD = 'Change password';
  public PERMISSION_USER_NAME = 'Change user name';
  public PERMISSION_VIEW_LICENSE = 'View the license information';
  /* Manage company */
  public PERMISSION_VIEW_COMPANIES_LIST = 'View the list of Companies';
  public PERMISSION_CREATE_COMPANY = 'Create a new Company';
  public PERMISSION_DELETE_COMPANY = 'Delete a Company';
  public PERMISSION_UPDATE_COMPANY = 'Change company account data';
  /* Manage licenses */
  public PERMISSION_VIEW_LICENSES_LIST = 'View the list of licenses';
  public PERMISSION_CREATE_LICENSE = 'Create a new license';
  public PERMISSION_UPDATE_LICENSE = 'Change the license';
  public PERMISSION_DELETE_LICENSE = 'Delete a license';
  /* Agreements management */
  public PERMISSION_VIEW_AGREEMENTS = 'View the agreements';
  public PERMISSION_UPDATE_AGREEMENTS = 'Change agreement';

  private permissions: Permission[];
  public handleError: HandlerError;

  constructor(
    public auth: AuthenticationService,
    private router: Router,
    private http: HttpClient, httpErrorHandler: HttpErrorHandler
  ) {}

  public initPermissions() {
    return this.getPermission().pipe(map(permissions => {
        this.permissions = permissions;
        return;
    }));
  }

  private getPermission(): Observable<Permission[]> {
    return this.http
      .get<Permission[]>(`${environment.API_ENDPOINT}/get-permissions/`)
  }

  public checkPermission(permission:string): boolean {
    return some(this.permissions, ['title', permission]);
  }

  public permissionRedirect(permission:string): void {
    if (!this.permissions.some(p => p.title === permission)) {
      this.router.navigateByUrl(`${environment.BASE_PATH}`);
    }
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpErrorHandler } from "./services/http-error-handler.services";
import { RouterModule, Routes} from "@angular/router";
import { DataTablesModule } from 'angular-datatables';
import { AlertModule } from "ngx-bootstrap/alert";
import { ModalModule } from 'ngx-bootstrap/modal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MessageService } from "./services/message.service";
import { TrainingsService } from "./services/trainings.service";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { UsersService } from "./services/users.service";
import { PermissionsService } from "./services/permissions.service";
import { CompaniesService } from "./services/companies.service";
import { LicensesService } from "./services/licenses.service";
import { SystemMessagesService } from "./services/system-messages";
import { MissingTranslationService } from "./services/missing-translation.service";
import { SortTableService } from "./services/sort-table.service";
import { SearchTableService } from "./services/search-table.service";

import { PermissionResolver } from "./resolvers/permission.resolve";

import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { TrainingsComponent } from './components/trainings/trainings.component';
import { AuthLayoutComponent } from './pages/auth-layout/auth-layout.component';
import { FrontendLayoutComponent } from './pages/frontend-layout/frontend-layout.component';
import { TrainingManagementComponent } from './pages/training-management/training-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UsersComponent } from './components/users/users.component';
import { JwtHttpInterceptor } from "./interceptors/jwt.http.interceptor";
import { CompaniesComponent } from './components/companies/companies.component';
import { CompanyManagementComponent } from './pages/company-management/company-management.component';
import { ContentLoaderComponent } from './components/content-loader/content-loader.component';
import { LicenseManagementComponent } from './pages/license-management/license-management.component';
import { LicensesComponent } from './components/licenses/licenses.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { AuditManagementComponent } from './pages/audit-management/audit-management.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordAcceptComponent } from './components/reset-password-accept/reset-password-accept.component';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: FrontendLayoutComponent,
    canActivate: [AuthGuardService],
    resolve: { items:PermissionResolver },
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'trainings',
        component: TrainingManagementComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'companies',
        component: CompanyManagementComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'licenses',
        component: LicenseManagementComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'activity_log',
        component: AuditManagementComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'terms',
        component: TermsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
        canActivate: [AuthGuardService]
      },
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'registration',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'forgot_password',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: ResetPasswordComponent
      }
    ]
  },
  {
    path: 'reset_password',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: ResetPasswordAcceptComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TrainingsComponent,
    FileUploadComponent,
    DashboardComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    AuthLayoutComponent,
    FrontendLayoutComponent,
    TrainingManagementComponent,
    UserManagementComponent,
    UsersComponent,
    CompaniesComponent,
    CompanyManagementComponent,
    ContentLoaderComponent,
    LicenseManagementComponent,
    LicensesComponent,
    ChangePasswordComponent,
    ConfirmationComponent,
    AuditManagementComponent,
    ResetPasswordComponent,
    ResetPasswordAcceptComponent,
    ContentHeaderComponent,
    TermsComponent,
    PrivacyComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    FontAwesomeModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot(routes),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationService },
    }),
    TooltipModule.forRoot(),
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    PermissionsService,
    HttpErrorHandler,
    MessageService,
    TrainingsService,
    UsersService,
    CompaniesService,
    LicensesService,
    SystemMessagesService,
    PermissionResolver,
    MissingTranslationService,
    SortTableService,
    SearchTableService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtHttpInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

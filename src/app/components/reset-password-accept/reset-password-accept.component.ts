import { Component, OnInit } from '@angular/core';
import {AuthenticationService, ResetPassword} from "../../services/authentication.service";
import {SystemMessagesService} from "../../services/system-messages";
import {ActivatedRoute, Router} from "@angular/router";
import {SuccessResult} from "../../models/user.model";

@Component({
  selector: 'app-reset-password-accept',
  templateUrl: './reset-password-accept.component.html',
  styleUrls: ['./reset-password-accept.component.scss']
})
export class ResetPasswordAcceptComponent implements OnInit {

  public resetLoad = false;
  public credentials:ResetPassword = {
    email: '',
    new_password: '',
    repeat_password: '',
    token:'',
  };

  constructor(
    public auth: AuthenticationService,
    public systemMessages: SystemMessagesService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    route.queryParams.subscribe(params => {
      this.credentials.token = params.token;
    });
  }

  ngOnInit() {
    this.systemMessages.clearSystemMessages();
  }

  public submit(emailInvalid:boolean, passwordInvalid:boolean, passwordConfirmInvalid:boolean) {
    if (passwordInvalid || passwordConfirmInvalid || emailInvalid) return false;
    this.systemMessages.clearSystemMessages();
    this.resetLoad = true;
    this.auth.reset(this.credentials).subscribe((response:SuccessResult) => {
        this.systemMessages.setServerSuccess(response.success);
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3000)
      },
      response => {
        this.resetLoad = false;
        this.systemMessages.setServerErrors(response.error.error);
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import {AuthenticationService, TokenPayload} from "../../services/authentication.service";
import {SystemMessagesService} from "../../services/system-messages";
import {SuccessResult} from "../../models/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetLoad = false;
  public credentials = {
    email: '',
  };

  constructor(
    public auth:AuthenticationService,
    public systemMessages: SystemMessagesService,
    public router: Router
  ) {}

  ngOnInit() {
    this.systemMessages.clearSystemMessages();
  }

  public submit(emailInvalid:boolean) {
    if (emailInvalid) return false;
    this.systemMessages.clearSystemMessages();
    this.resetLoad = true;
    this.auth.forgot(this.credentials.email).subscribe((response:SuccessResult) => {
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

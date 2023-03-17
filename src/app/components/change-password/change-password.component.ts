import {Component, Input, OnInit} from '@angular/core';
import {PermissionsService} from "../../services/permissions.service";
import {UsersService} from "../../services/users.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SuccessResult, User} from "../../models/user.model";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {SystemMessagesService} from "../../services/system-messages";
declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public passwordForm: FormGroup;

  @Input()
  public user: User;

  @Input()
  public profile: boolean;

  constructor(
    private permissions: PermissionsService,
    private usersService: UsersService,
    private systemMessages: SystemMessagesService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  public initForm() {
    this.passwordForm = new FormGroup({
      current_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      new_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeat_password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        RxwebValidators.compare({fieldName:'new_password'}),
      ]),
    });
  }

  private resetForm() {
    this.passwordForm.reset();
    this.systemMessages.clearSystemMessages();
  }

  public submit() {
    let data = {...this.passwordForm.value};
    data.user_id = this.user.id;
    if (this.profile) {
      data.profile = (this.profile);
    }
    this.usersService.changeUserPassword(data).subscribe((response:SuccessResult) => {
      this.systemMessages.setServerSuccess(response.success);
      $('#passwordModal').modal('hide');
      this.resetForm();
    }, response => {
      this.systemMessages.clearSystemMessages();
      this.systemMessages.setServerErrors(response.error.error);
    });
  }
}

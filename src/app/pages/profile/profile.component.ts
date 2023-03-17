import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {UsersService} from "../../services/users.service";
import {User} from "../../models/user.model";
import {PermissionsService} from "../../services/permissions.service";
import {SystemMessagesService} from "../../services/system-messages";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public editUser: User;
  public form: UntypedFormGroup;
  public contentLoaded: boolean;

  constructor(
    private auth: AuthenticationService,
    private userService: UsersService,
    private permissions: PermissionsService,
    private systemMessages: SystemMessagesService,
  ) {}

  ngOnInit() {
    this.initProfile();
    this.initForm();
  }

  public initProfile() {
    this.contentLoaded = false;
    this.auth.profile().subscribe(
      user => {
        this.auth.saveUserDetails(user);
        this.user = user;
        this.contentLoaded = true;
      },
      error => {
        console.error(error);
      }
    )
  }

  public initForm() {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null,[Validators.required]),
      email: new UntypedFormControl(null,[Validators.required]),
      first_name: new UntypedFormControl(''),
      last_name: new UntypedFormControl(''),
      title: new UntypedFormControl(''),
    });
  }

  public edit(user: User) {
    this.editUser = user;
    this.form.setValue({
      name: this.user.name,
      email: this.user.email,
      first_name: (this.user.detail && this.user.detail.first_name) ? this.user.detail.first_name : '',
      last_name: (this.user.detail && this.user.detail.last_name) ? this.user.detail.last_name : '',
      title: (this.user.detail && this.user.detail.title) ? this.user.detail.title : '',
    });

    this.form.get('name').disable();
  }

  private update() {
    if (this.editUser) {
      let editUser: User = {...this.form.value} as User;
      this.userService.updateProfile(editUser).subscribe(user => {
        this.user = user;
        this.systemMessages.setServerSuccess('panel.success.user_updated');
        $('#userModal').modal('hide');
        this.systemMessages.clearSystemMessages();
      }, response => {
        this.systemMessages.setServerErrors(response.error.error);
      });
      this.editUser = undefined;
    }
  }

  public resetForm() {
    this.systemMessages.clearSystemMessages();
  }

  public openPasswordForm() {
    $('#passwordModal').modal('show');
  }

}

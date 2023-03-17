import { Component, OnInit } from '@angular/core';
import { UsersService } from "../../services/users.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PermissionsService } from "../../services/permissions.service";
import { AuthenticationService, UserDetails } from "../../services/authentication.service";
import { CompaniesService } from "../../services/companies.service";
import { Company } from "src/app/models/company.model";
import { User, Role } from "src/app/models/user.model";
import { SystemMessagesService } from "../../services/system-messages";
import {SortTableService} from "../../services/sort-table.service";
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {SearchTableService} from "../../services/search-table.service";
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public form: FormGroup;
  public users: User[];
  public companies: Company[];
  public roles: Role[];
  public editUser: User;
  public loggedUser: UserDetails;
  public contentLoaded: boolean;
  protected roleAdmin = 'admin';
  private faEllipsisH = faEllipsisH;

  constructor(
    private usersService: UsersService,
    private permissions: PermissionsService,
    private companiesService: CompaniesService,
    private systemMessages: SystemMessagesService,
    private sortTableService: SortTableService,
    public auth: AuthenticationService,
    private searchTableService: SearchTableService,
  ) {
    this.permissions.permissionRedirect(this.permissions.PERMISSION_VIEW_USERS_LIST);
    this.loggedUser = this.auth.getUserDetails();
  }

  ngOnInit() {
    this.initForm();
    this.initUsers();
    this.initRoles();
    this.initCompanies();
    this.initSortColumns();
  }

  public initForm() {
    const companyId = (this.loggedUser.role_name !== this.roleAdmin) ? this.loggedUser.company_id : null;
    this.form = new FormGroup({
      role_id: new FormControl(null, [Validators.required]),
      company_id: new FormControl(companyId, [Validators.required]),
      name: new FormControl(null,[Validators.required]),
      password: new FormControl(null, [Validators.minLength(8), Validators.required]),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      title: new FormControl(''),
      editMode: new FormControl(false),
    });
  }

  public refreshForm(user: User) {
    this.editMode(true);
    this.form.setValue({
      role_id: user.role.id,
      company_id: user.company.id,
      name: user.name,
      first_name: (user.detail && user.detail.first_name) ? user.detail.first_name : '',
      last_name: (user.detail && user.detail.last_name) ? user.detail.last_name : '',
      title: (user.detail && user.detail.title) ? user.detail.title : '',
      password: null,
      editMode: true,
    });
  }

  public editMode(on:boolean) {
    if (on) {
      this.form.get('password').setValidators(null);
      this.form.get('role_id').disable();
      this.form.get('name').disable();
    } else {
      this.form.get('password').setValidators([Validators.minLength(8), Validators.required]);
      this.form.get('name').enable();
      this.form.get('role_id').enable();
    }
  }

  public get isEditMode():boolean {
    return this.form.value.editMode === true;
  }

  public initUsers():void {
    this.contentLoaded = false;
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.searchTableService.setDataTemplate(this.users);
      this.contentLoaded = true;
    });
  }

  public initRoles():void {
    this.usersService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  public initCompanies():void {
      if (this.loggedUser.role_name === 'admin') {
      this.companiesService.getCompanies().subscribe(companies => {
        this.companies = companies;
      });
    }
  }

  private submit() {
      this.editUser = undefined;
      const newUser: User = {...this.form.value} as User;
      this.usersService.addUser(this.usersService.toFormData(newUser)).subscribe(user => {
        this.systemMessages.setServerSuccess('panel.success.user_created');
        this.resetForm();
        this.users.push(<User>user);
        this.searchTableService.setDataTemplate(this.users);
        $('#userModal').modal('hide');
      }, response => {
        this.systemMessages.clearSystemMessages();
        this.systemMessages.setServerErrors(response.error.error);
      });
  }

  public delete(confirm:boolean, user: User):void {
    if (!confirm) return;
    this.usersService.deleteUser(user.id).subscribe(() => {
      this.users = this.users.filter(h => h !== user);
      this.searchTableService.setDataTemplate(this.users);
      this.systemMessages.setServerSuccess('panel.success.user_deleted');
      this.systemMessages.clearSystemMessages();
    }, response => {
      this.systemMessages.clearSystemMessages();
      this.systemMessages.setServerErrors(response.error.error);
    });
  }

  public edit(user: User) {
    this.editUser = user;
    this.refreshForm(this.editUser);
    $('#userModal').modal('show');
  }

  private update() {
    if (this.editUser) {
      let editUser: User = {...this.form.value} as User;
      editUser.id = this.editUser.id;
      this.usersService.updateUser(editUser).subscribe(user => {
        const i = user ? this.users.findIndex(h => h.id === user.id) : -1;
        if (i > -1) this.users[i] = user;
        this.searchTableService.setDataTemplate(this.users);
        this.systemMessages.setServerSuccess('panel.success.user_updated');
        $('#userModal').modal('hide');
        this.resetForm();
      });
      this.editUser = undefined;
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public resetForm() {
    const companyId = (this.loggedUser.role_name !== this.roleAdmin) ? this.loggedUser.company_id : null;
    this.form.reset();
    this.form.patchValue({
      company_id: companyId,
    });
    this.editMode(false);
    this.systemMessages.clearSystemMessages();
  }

  public onSubmitForm() {
    if (!this.form.valid) return false;
    !this.isEditMode ? this.submit() : this.update();
  }

  public openPasswordForm(user: User) {
    this.editUser = user;
    $('#passwordModal').modal('show');
  }

  private initSortColumns() {
    this.sortTableService.sortedColumns = [
      {name:'role.name', title: 'panel.tables.users.account_type', icon: this.sortTableService.sortArrowDefault},
      {name:'detail.first_name', title: 'panel.tables.users.first_name', icon: this.sortTableService.sortArrowDefault},
      {name:'detail.last_name', title: 'panel.tables.users.last_name', icon: this.sortTableService.sortArrowDefault},
      {name:'name', title: 'panel.tables.users.account_name', icon: this.sortTableService.sortArrowDefault},
      {name:'detail.title', title: 'panel.tables.users.title', icon: this.sortTableService.sortArrowDefault},
    ];
    if (this.loggedUser.role_name === this.roleAdmin) {
      let row = {name:'company.name', title: 'panel.tables.users.company_name', icon: this.sortTableService.sortArrowDefault};
      this.sortTableService.sortedColumns.push(row);
    }
  }

  public checkUsers() {
    return (this.searchTableService.getData().length === 0);
  }
}

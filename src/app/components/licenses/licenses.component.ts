import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PermissionsService} from "../../services/permissions.service";
import {License} from "src/app/models/company.model";
import {LicensesService} from "../../services/licenses.service";
import {SystemMessagesService} from "../../services/system-messages";
import {SortTableService} from "../../services/sort-table.service";
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
declare var $: any;

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {

  public form: FormGroup;
  public licenses: License[];
  public editLicense: License;
  public contentLoaded: boolean;
  private faEllipsisH = faEllipsisH;

  constructor(
    private permissions: PermissionsService,
    private licensesService: LicensesService,
    private systemMessages: SystemMessagesService,
    private sortTableService: SortTableService,
  ) {
    this.permissions.permissionRedirect(this.permissions.PERMISSION_VIEW_LICENSES_LIST);
  }

  ngOnInit() {
    this.initForm();
    this.initLicenses();
    this.initSortColumns();
  }

  public initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      validity: new FormControl(null, [Validators.required])
    });
  }

  public initLicenses():void {
    this.contentLoaded = false;
    this.licensesService.getLicenses().subscribe(licenses => {
      this.licenses = licenses;
      this.contentLoaded = true;
    });
  }

  public submit() {
    this.editLicense = undefined;
    const newLicense: License = {...this.form.value} as License;
    this.licensesService.addLicense(this.licensesService.toFormData(newLicense)).subscribe(license => {
      this.form.reset();
      this.licenses.push(<License>license);
      $('#licenseModal').modal('hide');
    });
  }

  public delete(confirm:boolean, license: License):void {
    if (!confirm) return;
    this.licensesService.deleteLicense(license.id).subscribe(() => {
      this.licenses = this.licenses.filter(h => h !== license);
    });
  }

  public edit(license) {
    this.editLicense = license;
  }

  public update() {
    if (this.editLicense) {
      this.licensesService.updateLicense(this.editLicense).subscribe(license => {
        const i = license ? this.licenses.findIndex(h => h.id === license.id) : -1;
        if (i > -1) this.licenses[i] = license
      });
      this.editLicense = undefined;
    }
  }

  private initSortColumns() {
    this.sortTableService.sortedColumns = [
      {name:'title', title: 'panel.tables.licenses.title', icon: this.sortTableService.sortArrowDefault},
      {name:'description', title: 'panel.tables.licenses.description', icon: this.sortTableService.sortArrowDefault},
      {name:'validity', title: 'panel.tables.licenses.validity', icon: this.sortTableService.sortArrowDefault},
    ]
  }

}

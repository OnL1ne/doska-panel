import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {PermissionsService} from "../../services/permissions.service";
import {CompaniesService} from "../../services/companies.service";
import {Company, License} from "src/app/models/company.model";
import {SystemMessagesService} from "../../services/system-messages";
import {SortTableService} from "../../services/sort-table.service";
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
declare var $: any;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  public form: UntypedFormGroup;
  public licenses: License[];
  public companies: Company[];
  public editCompany: Company;
  public contentLoaded: boolean;
  public faEllipsisH = faEllipsisH;

  constructor(
    public permissions: PermissionsService,
    public companiesService: CompaniesService,
    public systemMessages: SystemMessagesService,
    public sortTableService: SortTableService,
  ) {
    this.permissions.permissionRedirect(this.permissions.PERMISSION_VIEW_COMPANIES_LIST);
  }

  ngOnInit() {
    this.initForm();
    this.initCompanies();
    this.initLicenses();
    this.initSortColumns();
  }

  public initForm() {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      license_start: new UntypedFormControl(null, [Validators.required]),
      license_id: new UntypedFormControl(null, [Validators.required]),
      editMode: new UntypedFormControl(false),
    });
  }

  public refreshForm(company: Company) {
    this.form.setValue({
      name: company.name,
      license_start: company.license_start,
      license_id: company.license_id,
      editMode: true,
    });
  }

  public initCompanies():void {
    this.contentLoaded = false;
    this.companiesService.getCompanies().subscribe(companies => {
      this.companies = companies;
      this.contentLoaded = true;
    });
  }

  public initLicenses():void {
    this.companiesService.getLicenses().subscribe(licenses => {
      this.licenses = licenses;
    });
  }

  public submit() {
    if (!this.form.valid) return false;
    this.editCompany = undefined;
    const newCompany: Company = {...this.form.value} as Company;
    this.companiesService.addCompany(this.companiesService.toFormData(newCompany)).subscribe(company => {
      this.form.reset();
      this.companies.push(<Company>company);
      $('#companyModal').modal('hide');
    });
  }

  public delete(confirm:boolean, company: Company):void {
    if (!confirm) return;
    this.companiesService.deleteCompany(company.id).subscribe(() => {
      this.companies = this.companies.filter(h => h !== company);
    });
  }

  public onSubmitForm() {
    if (!this.form.valid) return false;
    !this.editCompany ? this.submit() : this.update();
  }

  public edit(company) {
    this.editCompany = company;
    this.refreshForm(this.editCompany);
    $('#companyModal').modal('show');
  }

  public update() {
    if (!this.form.valid) return false;
    if (this.editCompany) {
      let editCompany: Company = {...this.form.value} as Company;
      editCompany.id = this.editCompany.id;
      this.companiesService.updateCompany(editCompany).subscribe(company => {
        const i = company ? this.companies.findIndex(h => h.id === company.id) : -1;
        if (i > -1) this.companies[i] = company;
        this.systemMessages.setServerSuccess('panel.success.company_updated');
        $('#companyModal').modal('hide');
        this.resetForm();
      });
      this.editCompany = undefined;
    }
  }

  public get isEditMode():boolean {
    return this.form.value.editMode === true;
  }

  public resetForm() {
    this.form.reset();
    this.systemMessages.clearSystemMessages();
  }

  private initSortColumns() {
    this.sortTableService.sortedColumns = [
      {name:'name', title: 'panel.tables.companies.name', icon: this.sortTableService.sortArrowDefault},
      {name:'license_start', title: 'panel.tables.companies.license_start', icon: this.sortTableService.sortArrowDefault},
      {name:'license_finish', title: 'panel.tables.companies.license_finish', icon: this.sortTableService.sortArrowDefault},
      {name:'license.title', title: 'panel.tables.companies.license_title', icon: this.sortTableService.sortArrowDefault},
    ]
  }
}

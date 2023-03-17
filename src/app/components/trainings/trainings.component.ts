import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TrainingsService} from "../../services/trainings.service";
import {PermissionsService} from "../../services/permissions.service";
import {Training} from "src/app/models/training.model";
import {HttpResponse} from "@angular/common/http";
import {saveAs} from 'file-saver';
import {SystemMessagesService} from "../../services/system-messages";
import {SortTableService} from "../../services/sort-table.service";
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {SearchTableService} from "../../services/search-table.service";

declare var $: any;

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit {
  @ViewChild(FileUploadComponent, {static: false})
  private fileUploadComponent: FileUploadComponent;

  public form: FormGroup;
  public trainings: Training[];
  public editTraining: Training;
  private progress: number;
  public contentLoaded: boolean;
  private faEllipsisH = faEllipsisH;

  constructor(
    private trainingsService: TrainingsService,
    private permissions: PermissionsService,
    private systemMessages: SystemMessagesService,
    private sortTableService: SortTableService,
    private searchTableService: SearchTableService,
  ) {
    this.permissions.permissionRedirect(this.permissions.PERMISSION_VIEW_TRAININGS_LIST);
  }

  ngOnInit() {
    this.initForm();
    this.initTrainings();
    this.initSortColumns();
  }

  public initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      file: new FormControl(null, [Validators.required, this.trainingsService.requiredFileType]),
      editMode: new FormControl(false),
    });
  }

  public refreshForm(training: Training) {
    this.editModeForm(true);
    this.form.setValue({
      title: training.title,
      description: training.description,
      file: null,
      editMode: true,
    });
  }

  public editModeForm(on:boolean) {
    if (on) {
      this.form.get('file').setValidators(null);
    } else {
      this.form.get('file').setValidators([Validators.required, this.trainingsService.requiredFileType]);
    }
  }

  public get isEditMode():boolean {
    return this.form.value.editMode === true;
  }

  public initTrainings():void {
    this.contentLoaded = false;
    this.trainingsService.getTrainings().subscribe(trainings => {
      this.trainings = trainings;
      this.searchTableService.setDataTemplate(this.trainings);
      this.contentLoaded = true;
    });
  }

  private submit() {
    this.editTraining = undefined;
    const newTraining: Training = {...this.form.value} as Training;
    this.trainingsService.addTraining(this.trainingsService.toFormData(newTraining)).subscribe(training => {
      this.systemMessages.setServerSuccess('panel.success.training_created');
      this.progress = 0;
      this.resetForm();
      this.trainings.push(<Training>training);
      this.searchTableService.setDataTemplate(this.trainings);
      $('#trainingModal').modal('hide');
    });
  }

  public delete(confirm:boolean, training: Training):void {
    if (!confirm) return;
    this.trainingsService.deleteTraining(training.id).subscribe(() => {
      this.trainings = this.trainings.filter(h => h !== training);
      this.searchTableService.setDataTemplate(this.trainings);
      this.systemMessages.setServerSuccess('panel.success.training_deleted');
      this.systemMessages.clearSystemMessages();
    });
  }

  public edit(training) {
    this.editTraining = training;
    this.refreshForm(this.editTraining);
    $('#trainingModal').modal('show');
  }

  private update() {
    if (this.editTraining) {
      let editTraining: Training = {...this.form.value} as Training;
      editTraining.id = this.editTraining.id;
      this.trainingsService.updateTraining(editTraining).subscribe(training => {
        const i = training ? this.trainings.findIndex(h => h.id === training.id) : -1;
        if (i > -1) this.trainings[i] = training;
        this.searchTableService.setDataTemplate(this.trainings);
        this.systemMessages.setServerSuccess('panel.success.training_updated');
        $('#trainingModal').modal('hide');
        this.resetForm();
      });
      this.editTraining = undefined;
    }
  }

  public onSubmitForm() {
    if (!this.form.valid) return false;
    !this.isEditMode ? this.submit() : this.update();
  }

  public resetForm() {
    this.form.reset();
    this.systemMessages.clearSystemMessages();
    this.editModeForm(false);
    if (this.fileUploadComponent) {
      this.fileUploadComponent.writeValue(null);
    }
  }

  public download(training: Training) {
    this.trainingsService.downloadTraining(training.id).subscribe((response:HttpResponse<Blob>) => {
      const blob = new Blob([response.body], { type: response.body.type });
      saveAs(blob, training.file_name);
    });
  }

  private initSortColumns() {
    this.sortTableService.sortedColumns = [
      {name:'title', title: 'panel.tables.trainings.name', icon: this.sortTableService.sortArrowDefault},
      {name:'description', title: 'panel.tables.trainings.description', icon: this.sortTableService.sortArrowDefault},
      {name:'file_name', title: 'panel.tables.trainings.file', icon: this.sortTableService.sortArrowDefault},
    ]
  }

  public checkTrainings() {
    return (this.searchTableService.getData().length === 0);
  }
}

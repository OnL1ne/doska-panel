import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingManagementComponent } from './training-management.component';

describe('TrainingManagementComponent', () => {
  let component: TrainingManagementComponent;
  let fixture: ComponentFixture<TrainingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

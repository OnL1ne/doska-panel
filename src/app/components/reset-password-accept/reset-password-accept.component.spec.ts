import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordAcceptComponent } from './reset-password-accept.component';

describe('ResetPasswordAcceptComponent', () => {
  let component: ResetPasswordAcceptComponent;
  let fixture: ComponentFixture<ResetPasswordAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

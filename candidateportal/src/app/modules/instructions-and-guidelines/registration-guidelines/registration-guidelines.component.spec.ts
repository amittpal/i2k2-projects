import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationGuidelinesComponent } from './registration-guidelines.component';

describe('RegistrationGuidelinesComponent', () => {
  let component: RegistrationGuidelinesComponent;
  let fixture: ComponentFixture<RegistrationGuidelinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationGuidelinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

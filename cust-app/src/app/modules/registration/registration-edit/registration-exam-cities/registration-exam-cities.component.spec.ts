import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationExamCitiesComponent } from './registration-exam-cities.component';

describe('RegistrationExamCitiesComponent', () => {
  let component: RegistrationExamCitiesComponent;
  let fixture: ComponentFixture<RegistrationExamCitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationExamCitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationExamCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

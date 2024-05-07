import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationPerHourComponent } from './registration-per-hour.component';

describe('RegistrationPerHourComponent', () => {
  let component: RegistrationPerHourComponent;
  let fixture: ComponentFixture<RegistrationPerHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPerHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPerHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

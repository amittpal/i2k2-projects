import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsSetupFilterComponent } from './registrations-setup-filter.component';

describe('RegistrationsSetupFilterComponent', () => {
  let component: RegistrationsSetupFilterComponent;
  let fixture: ComponentFixture<RegistrationsSetupFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationsSetupFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationsSetupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

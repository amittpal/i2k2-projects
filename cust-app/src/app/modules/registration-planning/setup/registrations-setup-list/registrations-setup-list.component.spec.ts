import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsSetupListComponent } from './registrations-setup-list.component';

describe('RegistrationsSetupListComponent', () => {
  let component: RegistrationsSetupListComponent;
  let fixture: ComponentFixture<RegistrationsSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationsSetupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationsSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

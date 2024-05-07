import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationImportComponent } from './registration-import.component';

describe('RegistrationImportComponent', () => {
  let component: RegistrationImportComponent;
  let fixture: ComponentFixture<RegistrationImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

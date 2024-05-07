import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationImportFilterComponent } from './registration-import-filter.component';

describe('RegistrationImportFilterComponent', () => {
  let component: RegistrationImportFilterComponent;
  let fixture: ComponentFixture<RegistrationImportFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationImportFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationImportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

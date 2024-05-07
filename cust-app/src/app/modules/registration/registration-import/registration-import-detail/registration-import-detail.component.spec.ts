import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationImportDetailComponent } from './registration-import-detail.component';

describe('RegistrationImportDetailComponent', () => {
  let component: RegistrationImportDetailComponent;
  let fixture: ComponentFixture<RegistrationImportDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationImportDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationImportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

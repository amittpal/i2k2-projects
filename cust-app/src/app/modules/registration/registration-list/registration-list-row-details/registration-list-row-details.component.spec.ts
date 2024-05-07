import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationListRowDetailsComponent } from './registration-list-row-details.component';

describe('RegistrationListRowDetailsComponent', () => {
  let component: RegistrationListRowDetailsComponent;
  let fixture: ComponentFixture<RegistrationListRowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationListRowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationListRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

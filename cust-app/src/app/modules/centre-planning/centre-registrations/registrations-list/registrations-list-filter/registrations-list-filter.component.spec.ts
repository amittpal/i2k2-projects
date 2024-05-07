import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsListFilterComponent } from './registrations-list-filter.component';

describe('RegistrationsListFilterComponent', () => {
  let component: RegistrationsListFilterComponent;
  let fixture: ComponentFixture<RegistrationsListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationsListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationsListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

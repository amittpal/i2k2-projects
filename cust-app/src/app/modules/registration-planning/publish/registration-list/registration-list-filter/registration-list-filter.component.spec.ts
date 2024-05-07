import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationListFilterComponent } from './registration-list-filter.component';

describe('RegistrationListFilterComponent', () => {
  let component: RegistrationListFilterComponent;
  let fixture: ComponentFixture<RegistrationListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

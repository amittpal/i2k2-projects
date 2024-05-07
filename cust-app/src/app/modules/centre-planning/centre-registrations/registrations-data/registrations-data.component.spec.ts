import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationsDataComponent } from './registrations-data.component';

describe('RegistrationsDataComponent', () => {
  let component: RegistrationsDataComponent;
  let fixture: ComponentFixture<RegistrationsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

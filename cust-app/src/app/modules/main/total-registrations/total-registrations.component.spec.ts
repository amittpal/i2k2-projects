import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRegistrationsComponent } from './total-registrations.component';

describe('TotalRegistrationsComponent', () => {
  let component: TotalRegistrationsComponent;
  let fixture: ComponentFixture<TotalRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

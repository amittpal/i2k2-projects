import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefAComponent } from './assign-pref-1.component';

describe('AssignPrefAComponent', () => {
  let component: AssignPrefAComponent;
  let fixture: ComponentFixture<AssignPrefAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

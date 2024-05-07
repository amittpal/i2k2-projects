import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefBComponent } from './assign-pref-2.component';

describe('AssignPrefBComponent', () => {
  let component: AssignPrefBComponent;
  let fixture: ComponentFixture<AssignPrefBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

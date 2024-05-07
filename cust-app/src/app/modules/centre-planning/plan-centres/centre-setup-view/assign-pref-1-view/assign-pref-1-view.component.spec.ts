import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefAViewComponent } from './assign-pref-1-view.component';

describe('AssignPrefAViewComponent', () => {
  let component: AssignPrefAViewComponent;
  let fixture: ComponentFixture<AssignPrefAViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefAViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefAViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

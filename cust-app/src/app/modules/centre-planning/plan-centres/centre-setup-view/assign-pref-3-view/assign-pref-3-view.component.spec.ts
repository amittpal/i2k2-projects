import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefCViewComponent } from './assign-pref-3-view.component';

describe('AssignPrefCViewComponent', () => {
  let component: AssignPrefCViewComponent;
  let fixture: ComponentFixture<AssignPrefCViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefCViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefCViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

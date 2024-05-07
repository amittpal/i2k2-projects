import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefBViewComponent } from './assign-pref-2-view.component';

describe('AssignPrefBViewComponent', () => {
  let component: AssignPrefBViewComponent;
  let fixture: ComponentFixture<AssignPrefBViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefBViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefBViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

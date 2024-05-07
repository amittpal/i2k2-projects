import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPrefCComponent } from './assign-pref-3.component';

describe('AssignPrefCComponent', () => {
  let component: AssignPrefCComponent;
  let fixture: ComponentFixture<AssignPrefCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPrefCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPrefCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

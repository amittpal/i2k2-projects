import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredCandidatesViewComponent } from './registered-candidates-view.component';

describe('RegisteredCandidatesViewComponent', () => {
  let component: RegisteredCandidatesViewComponent;
  let fixture: ComponentFixture<RegisteredCandidatesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredCandidatesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredCandidatesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

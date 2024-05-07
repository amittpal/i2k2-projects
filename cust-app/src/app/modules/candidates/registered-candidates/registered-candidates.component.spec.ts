import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredCandidatesComponent } from './candidates.component';

describe('RegisteredCandidatesComponent', () => {
  let component: RegisteredCandidatesComponent;
  let fixture: ComponentFixture<RegisteredCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

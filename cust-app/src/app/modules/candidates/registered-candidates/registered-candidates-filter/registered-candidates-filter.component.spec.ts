import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredCandidatesFilterComponent } from './candidates-filter.component';

describe('RegisteredCandidatesFilterComponent', () => {
  let component: RegisteredCandidatesFilterComponent;
  let fixture: ComponentFixture<RegisteredCandidatesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredCandidatesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredCandidatesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

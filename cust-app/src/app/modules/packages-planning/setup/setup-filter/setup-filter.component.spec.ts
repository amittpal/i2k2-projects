import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupFilterComponent } from './setup-filter.component';

describe('SetupFilterComponent', () => {
  let component: SetupFilterComponent;
  let fixture: ComponentFixture<SetupFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalExamsComponent } from './total-exams.component';

describe('TotalExamsComponent', () => {
  let component: TotalExamsComponent;
  let fixture: ComponentFixture<TotalExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

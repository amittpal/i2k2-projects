import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicableFeesComponent } from './applicable-fees.component';

describe('ApplicableFeesComponent', () => {
  let component: ApplicableFeesComponent;
  let fixture: ComponentFixture<ApplicableFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicableFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicableFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

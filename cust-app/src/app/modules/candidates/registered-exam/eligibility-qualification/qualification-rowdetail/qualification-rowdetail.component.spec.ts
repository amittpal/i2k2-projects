import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationRowdetailComponent } from './qualification-rowdetail.component';

describe('QualificationRowdetailComponent', () => {
  let component: QualificationRowdetailComponent;
  let fixture: ComponentFixture<QualificationRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualificationRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualificationRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

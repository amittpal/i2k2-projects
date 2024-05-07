import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTabRowdetailComponent } from './first-tab-rowdetail.component';

describe('FirstTabRowdetailComponent', () => {
  let component: FirstTabRowdetailComponent;
  let fixture: ComponentFixture<FirstTabRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTabRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTabRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

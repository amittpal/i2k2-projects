import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTabCRowdetailComponent } from './first-tab-c-rowdetail.component';

describe('FirstTabCRowdetailComponent', () => {
  let component: FirstTabCRowdetailComponent;
  let fixture: ComponentFixture<FirstTabCRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTabCRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTabCRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

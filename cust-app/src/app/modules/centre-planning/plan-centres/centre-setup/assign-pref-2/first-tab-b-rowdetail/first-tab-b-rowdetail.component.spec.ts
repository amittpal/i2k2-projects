import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTabBRowdetailComponent } from './first-tab-b-rowdetail.component';

describe('FirstTabBRowdetailComponent', () => {
  let component: FirstTabBRowdetailComponent;
  let fixture: ComponentFixture<FirstTabBRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTabBRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTabBRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

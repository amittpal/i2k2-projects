import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListViewComponent } from './centre-list-view.component';

describe('CentreListViewComponent', () => {
  let component: CentreListViewComponent;
  let fixture: ComponentFixture<CentreListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

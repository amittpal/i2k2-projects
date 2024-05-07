import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListFilterViewComponent } from './centre-list-filter-view.component';

describe('CentreListFilterViewComponent', () => {
  let component: CentreListFilterViewComponent;
  let fixture: ComponentFixture<CentreListFilterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListFilterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListFilterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

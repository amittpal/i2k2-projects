import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListRowdetailViewComponent } from './table-list-rowdetail-view.component';

describe('TableListRowdetailViewComponent', () => {
  let component: TableListRowdetailViewComponent;
  let fixture: ComponentFixture<TableListRowdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListRowdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListRowdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

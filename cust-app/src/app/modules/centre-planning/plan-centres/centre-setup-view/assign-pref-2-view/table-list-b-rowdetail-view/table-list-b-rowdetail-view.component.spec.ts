import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListBRowdetailViewComponent } from './table-list-b-rowdetail-view.component';

describe('TableListBRowdetailViewComponent', () => {
  let component: TableListBRowdetailViewComponent;
  let fixture: ComponentFixture<TableListBRowdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListBRowdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListBRowdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

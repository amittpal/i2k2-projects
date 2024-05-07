import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListCRowdetailViewComponent } from './table-list-c-rowdetail-view.component';

describe('TableListCRowdetailViewComponent', () => {
  let component: TableListCRowdetailViewComponent;
  let fixture: ComponentFixture<TableListCRowdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListCRowdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListCRowdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

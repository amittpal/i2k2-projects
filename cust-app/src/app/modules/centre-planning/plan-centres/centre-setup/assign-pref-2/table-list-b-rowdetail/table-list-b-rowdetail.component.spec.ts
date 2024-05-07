import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListBRowdetailComponent } from './table-list-b-rowdetail.component';

describe('TableListBRowdetailComponent', () => {
  let component: TableListBRowdetailComponent;
  let fixture: ComponentFixture<TableListBRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListBRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListBRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

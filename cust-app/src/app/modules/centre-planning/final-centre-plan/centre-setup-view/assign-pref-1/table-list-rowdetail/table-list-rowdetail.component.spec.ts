import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListRowdetailComponent } from './table-list-rowdetail.component';

describe('TableListRowdetailComponent', () => {
  let component: TableListRowdetailComponent;
  let fixture: ComponentFixture<TableListRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListCRowdetailComponent } from './table-list-c-rowdetail.component';

describe('TableListCRowdetailComponent', () => {
  let component: TableListCRowdetailComponent;
  let fixture: ComponentFixture<TableListCRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableListCRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableListCRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingListFilterComponent } from './packaging-list-filter.component';

describe('PackagingListFilterComponent', () => {
  let component: PackagingListFilterComponent;
  let fixture: ComponentFixture<PackagingListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

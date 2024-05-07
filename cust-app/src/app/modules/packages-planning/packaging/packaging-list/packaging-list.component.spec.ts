import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingListComponent } from './packaging-list.component';

describe('PackagingListComponent', () => {
  let component: PackagingListComponent;
  let fixture: ComponentFixture<PackagingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

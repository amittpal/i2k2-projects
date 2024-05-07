import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMappingListComponent } from './layout-mapping-list.component';

describe('LayoutMappingListComponent', () => {
  let component: LayoutMappingListComponent;
  let fixture: ComponentFixture<LayoutMappingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMappingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

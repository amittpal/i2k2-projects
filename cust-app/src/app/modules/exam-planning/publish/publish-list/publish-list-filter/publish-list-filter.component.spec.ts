import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishListFilterComponent } from './publish-list-filter.component';

describe('PublishListFilterComponent', () => {
  let component: PublishListFilterComponent;
  let fixture: ComponentFixture<PublishListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

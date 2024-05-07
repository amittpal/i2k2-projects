import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreCenterComponent } from './add-more-center.component';

describe('AddMoreCenterComponent', () => {
  let component: AddMoreCenterComponent;
  let fixture: ComponentFixture<AddMoreCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

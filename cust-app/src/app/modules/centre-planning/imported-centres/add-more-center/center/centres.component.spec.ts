import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreCentresComponent } from './centres.component';

describe('AddMoreCentresComponent', () => {
  let component: AddMoreCentresComponent;
  let fixture: ComponentFixture<AddMoreCentresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreCentresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEditComponent } from './layout-edit.component';

describe('LayoutEditComponent', () => {
  let component: LayoutEditComponent;
  let fixture: ComponentFixture<LayoutEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

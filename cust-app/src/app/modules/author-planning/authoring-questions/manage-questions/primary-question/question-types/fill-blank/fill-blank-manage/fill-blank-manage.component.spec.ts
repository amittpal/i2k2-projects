import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillBlankManageComponent } from './fill-blank-manage.component';

describe('FillBlankManageComponent', () => {
  let component: FillBlankManageComponent;
  let fixture: ComponentFixture<FillBlankManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillBlankManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillBlankManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMainViewComponent } from './centre-main-view.component';

describe('CentreMainViewComponent', () => {
  let component: CentreMainViewComponent;
  let fixture: ComponentFixture<CentreMainViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMainViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

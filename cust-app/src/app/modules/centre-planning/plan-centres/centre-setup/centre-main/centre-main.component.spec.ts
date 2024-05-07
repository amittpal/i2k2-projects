import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMainComponent } from './centre-main.component';

describe('CentreMainComponent', () => {
  let component: CentreMainComponent;
  let fixture: ComponentFixture<CentreMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

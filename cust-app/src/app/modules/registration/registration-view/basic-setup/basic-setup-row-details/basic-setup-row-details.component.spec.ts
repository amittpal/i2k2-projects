import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSetupRowDetailsComponent } from './basic-setup-row-details.component';

describe('BasicSetupRowDetailsComponent', () => {
  let component: BasicSetupRowDetailsComponent;
  let fixture: ComponentFixture<BasicSetupRowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSetupRowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSetupRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

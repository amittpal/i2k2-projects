import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreEditDetailsComponent } from './centre-edit-details.component';

describe('CentreEditDetailsComponent', () => {
  let component: CentreEditDetailsComponent;
  let fixture: ComponentFixture<CentreEditDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreEditDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

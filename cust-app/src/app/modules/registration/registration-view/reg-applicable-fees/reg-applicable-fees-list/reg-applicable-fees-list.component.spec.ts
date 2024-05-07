import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegApplicableFeesListComponent } from './reg-applicable-fees-list.component';

describe('RegApplicableFeesListComponent', () => {
  let component: RegApplicableFeesListComponent;
  let fixture: ComponentFixture<RegApplicableFeesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegApplicableFeesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegApplicableFeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

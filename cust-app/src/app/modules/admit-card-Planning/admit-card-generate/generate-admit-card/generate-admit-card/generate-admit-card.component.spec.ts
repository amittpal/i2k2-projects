import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAdmitCardComponent } from './generate-admit-card.component';

describe('GenerateAdmitCardComponent', () => {
  let component: GenerateAdmitCardComponent;
  let fixture: ComponentFixture<GenerateAdmitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAdmitCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardsComponent } from './admit-cards.component';

describe('AdmitCardsComponent', () => {
  let component: AdmitCardsComponent;
  let fixture: ComponentFixture<AdmitCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

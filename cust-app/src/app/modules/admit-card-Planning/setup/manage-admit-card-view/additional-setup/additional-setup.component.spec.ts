import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSetupComponent } from './additional-setup.component';

describe('AdditionalSetupComponent', () => {
  let component: AdditionalSetupComponent;
  let fixture: ComponentFixture<AdditionalSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

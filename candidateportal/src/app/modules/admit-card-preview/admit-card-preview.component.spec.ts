import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardPreviewComponent } from './admit-card-preview.component';

describe('AdmitCardPreviewComponent', () => {
  let component: AdmitCardPreviewComponent;
  let fixture: ComponentFixture<AdmitCardPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

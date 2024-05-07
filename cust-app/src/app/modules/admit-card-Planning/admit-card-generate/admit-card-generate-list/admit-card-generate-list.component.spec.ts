import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardGenerateListComponent } from './admit-card-generate-list.component';

describe('AdmitCardGenerateListComponent', () => {
  let component: AdmitCardGenerateListComponent;
  let fixture: ComponentFixture<AdmitCardGenerateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardGenerateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardGenerateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

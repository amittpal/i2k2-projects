import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTypeMappingComponent } from './reg-type-mapping.component';

describe('RegTypeMappingComponent', () => {
  let component: RegTypeMappingComponent;
  let fixture: ComponentFixture<RegTypeMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTypeMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTypeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMappingAddComponent } from './layout-mapping-add.component';

describe('LayoutMappingAddComponent', () => {
  let component: LayoutMappingAddComponent;
  let fixture: ComponentFixture<LayoutMappingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMappingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMappingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

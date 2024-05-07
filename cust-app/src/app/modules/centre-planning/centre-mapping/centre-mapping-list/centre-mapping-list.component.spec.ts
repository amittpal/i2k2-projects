import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMappingListComponent } from './centre-mapping-list.component';

describe('CentreMappingListComponent', () => {
  let component: CentreMappingListComponent;
  let fixture: ComponentFixture<CentreMappingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMappingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

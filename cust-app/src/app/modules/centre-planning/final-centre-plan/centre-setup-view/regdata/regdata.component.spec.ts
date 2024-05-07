import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegDataComponent } from './regdata.component';

describe('RegDataComponent', () => {
  let component: RegDataComponent;
  let fixture: ComponentFixture<RegDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

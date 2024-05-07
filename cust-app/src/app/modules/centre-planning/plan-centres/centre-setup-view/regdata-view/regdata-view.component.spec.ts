import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegDataViewComponent } from './regdata-view.component';

describe('RegDataViewComponent', () => {
  let component: RegDataViewComponent;
  let fixture: ComponentFixture<RegDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

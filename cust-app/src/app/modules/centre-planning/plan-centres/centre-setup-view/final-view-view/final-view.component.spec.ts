import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalViewOnlyComponent } from './final-view.component';

describe('FinalViewOnlyComponent', () => {
  let component: FinalViewOnlyComponent;
  let fixture: ComponentFixture<FinalViewOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalViewOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalViewOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

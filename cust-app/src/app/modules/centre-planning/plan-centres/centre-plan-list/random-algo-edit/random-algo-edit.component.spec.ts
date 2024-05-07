import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAlgoEditComponent } from './random-algo-edit.component';

describe('RandomAlgoEditComponent', () => {
  let component: RandomAlgoEditComponent;
  let fixture: ComponentFixture<RandomAlgoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAlgoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAlgoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

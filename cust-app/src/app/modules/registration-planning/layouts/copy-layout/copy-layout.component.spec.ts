import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyLayoutComponent } from './copy-layout.component';

describe('CopyLayoutComponent', () => {
  let component: CopyLayoutComponent;
  let fixture: ComponentFixture<CopyLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

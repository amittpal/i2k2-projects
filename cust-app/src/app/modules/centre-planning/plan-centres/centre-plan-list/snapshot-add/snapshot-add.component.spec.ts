import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotAddComponent } from './snapshot-add.component';

describe('SnapshotAddComponent', () => {
  let component: SnapshotAddComponent;
  let fixture: ComponentFixture<SnapshotAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapshotAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

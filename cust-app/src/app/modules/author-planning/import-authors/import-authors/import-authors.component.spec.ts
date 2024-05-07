import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAuthorsComponent } from './import-authors.component';

describe('ImportAuthorsComponent', () => {
  let component: ImportAuthorsComponent;
  let fixture: ComponentFixture<ImportAuthorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAuthorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

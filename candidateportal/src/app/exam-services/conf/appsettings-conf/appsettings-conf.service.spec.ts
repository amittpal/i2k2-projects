import { TestBed } from '@angular/core/testing';

import { AppsettingsConfService } from './appsettings-conf.service';

describe('AppsettingsConfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppsettingsConfService = TestBed.get(AppsettingsConfService);
    expect(service).toBeTruthy();
  });
});

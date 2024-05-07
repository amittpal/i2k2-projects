import { TestBed } from '@angular/core/testing';

import { OnlinestatusService } from './onlinestatus.service';

describe('OnlinestatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlinestatusService = TestBed.get(OnlinestatusService);
    expect(service).toBeTruthy();
  });
});

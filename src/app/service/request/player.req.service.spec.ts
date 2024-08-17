import { TestBed } from '@angular/core/testing';

import { PlayerReqService } from './player.req.service';

describe('PlayerReqService', () => {
  let service: PlayerReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GameReqService } from './game.req.service';

describe('GameReqService', () => {
  let service: GameReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

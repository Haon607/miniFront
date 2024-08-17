import { TestBed } from '@angular/core/testing';

import { MemoryPlayerService } from './memory.player.service';

describe('MemoryPlayerService', () => {
  let service: MemoryPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

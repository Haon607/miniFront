import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerIntroGameComponent } from './player-intro.game.component';

describe('PlayerIntroGameComponent', () => {
  let component: PlayerIntroGameComponent;
  let fixture: ComponentFixture<PlayerIntroGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerIntroGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerIntroGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

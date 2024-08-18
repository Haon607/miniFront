import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardPlayerComponent } from './scoreboard.player.component';

describe('ScoreboardPlayerComponent', () => {
  let component: ScoreboardPlayerComponent;
  let fixture: ComponentFixture<ScoreboardPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

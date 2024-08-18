import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardGameComponent } from './scoreboard.game.component';

describe('ScoreboardGameComponent', () => {
  let component: ScoreboardGameComponent;
  let fixture: ComponentFixture<ScoreboardGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

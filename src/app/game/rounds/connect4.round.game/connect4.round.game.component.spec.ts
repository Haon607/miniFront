import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Connect4RoundGameComponent } from './connect4.round.game.component';

describe('SecondRoundGameComponent', () => {
  let component: Connect4RoundGameComponent;
  let fixture: ComponentFixture<Connect4RoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connect4RoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Connect4RoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

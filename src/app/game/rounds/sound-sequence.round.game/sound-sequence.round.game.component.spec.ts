import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundSequenceRoundGameComponent } from './sound-sequence.round.game.component';

describe('SoundSequenceRoundGameComponent', () => {
  let component: SoundSequenceRoundGameComponent;
  let fixture: ComponentFixture<SoundSequenceRoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundSequenceRoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundSequenceRoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

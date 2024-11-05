import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundSequenceRoundPlayerComponent } from './sound-sequence.round.player.component';

describe('SoundSequenceRoundPlayerComponent', () => {
  let component: SoundSequenceRoundPlayerComponent;
  let fixture: ComponentFixture<SoundSequenceRoundPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundSequenceRoundPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoundSequenceRoundPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

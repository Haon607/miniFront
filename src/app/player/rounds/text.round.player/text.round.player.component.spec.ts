import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextRoundPlayerComponent } from './text.round.player.component';

describe('TextRoundPlayerComponent', () => {
  let component: TextRoundPlayerComponent;
  let fixture: ComponentFixture<TextRoundPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextRoundPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextRoundPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

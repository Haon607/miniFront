import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondRoundGameComponent } from './second.round.game.component';

describe('SecondRoundGameComponent', () => {
  let component: SecondRoundGameComponent;
  let fixture: ComponentFixture<SecondRoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondRoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondRoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

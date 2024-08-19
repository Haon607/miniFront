import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstRoundGameComponent } from './first.round.game.component';

describe('FirstRoundGameComponent', () => {
  let component: FirstRoundGameComponent;
  let fixture: ComponentFixture<FirstRoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstRoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstRoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

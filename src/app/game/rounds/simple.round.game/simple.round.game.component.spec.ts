import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleRoundGameComponent } from './simple.round.game.component';

describe('SimpleRoundGameComponent', () => {
  let component: SimpleRoundGameComponent;
  let fixture: ComponentFixture<SimpleRoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleRoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleRoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

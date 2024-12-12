import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Connect4PlayerComponent } from './connect4.player.component';

describe('SelectSecondPlayerComponent', () => {
  let component: Connect4PlayerComponent;
  let fixture: ComponentFixture<Connect4PlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Connect4PlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Connect4PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

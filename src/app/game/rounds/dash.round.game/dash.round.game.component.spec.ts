import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashRoundGameComponent } from './dash.round.game.component';

describe('DashRoundGameComponent', () => {
  let component: DashRoundGameComponent;
  let fixture: ComponentFixture<DashRoundGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashRoundGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashRoundGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

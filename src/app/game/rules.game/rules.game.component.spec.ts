import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesGameComponent } from './rules.game.component';

describe('RulesGameComponent', () => {
  let component: RulesGameComponent;
  let fixture: ComponentFixture<RulesGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RulesGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

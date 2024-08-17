import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesPlayerComponent } from './rules.player.component';

describe('RulesPlayerComponent', () => {
  let component: RulesPlayerComponent;
  let fixture: ComponentFixture<RulesPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RulesPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

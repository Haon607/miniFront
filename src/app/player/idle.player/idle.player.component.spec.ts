import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdlePlayerComponent } from './idle.player.component';

describe('IdlePlayerComponent', () => {
  let component: IdlePlayerComponent;
  let fixture: ComponentFixture<IdlePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdlePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdlePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

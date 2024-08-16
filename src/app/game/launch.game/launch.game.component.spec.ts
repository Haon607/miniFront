import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchGameComponent } from './launch.game.component';

describe('LaunchGameComponent', () => {
  let component: LaunchGameComponent;
  let fixture: ComponentFixture<LaunchGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

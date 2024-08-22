import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSecondPlayerComponent } from './select.second.player.component';

describe('SelectSecondPlayerComponent', () => {
  let component: SelectSecondPlayerComponent;
  let fixture: ComponentFixture<SelectSecondPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSecondPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSecondPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

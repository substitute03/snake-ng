import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBounceComponent } from './game-bounce.component';

describe('GameBounceComponent', () => {
  let component: GameBounceComponent;
  let fixture: ComponentFixture<GameBounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameBounceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

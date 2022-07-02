import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameShadowComponent } from './game-shadow.component';

describe('GameShadowComponent', () => {
  let component: GameShadowComponent;
  let fixture: ComponentFixture<GameShadowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameShadowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

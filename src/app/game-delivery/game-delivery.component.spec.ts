import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDeliveryComponent } from './game-delivery.component';

describe('GameDeliveryComponent', () => {
  let component: GameDeliveryComponent;
  let fixture: ComponentFixture<GameDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

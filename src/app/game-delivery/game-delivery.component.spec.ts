import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { KeypressService } from '../shared/keypress-service';
import { StorageService } from '../shared/storage-service';

import { GameDeliveryComponent } from './game-delivery.component';

describe('GameDeliveryComponent', () => {
    let component: GameDeliveryComponent;

    let mockRouter: Router;
    let mockStorageService: StorageService;
    let mockKeypressService: KeypressService;
    
    mockRouter = jasmine.createSpyObj(['navigate']);

    mockStorageService = jasmine.createSpyObj([
        'getPlayerName',
        'getHighScore',
        'addHighScore'
    ]);

    mockKeypressService = jasmine.createSpyObj([
        'getNextDirection',
        'clearDirectionQueue',
        'setNextDirection'
    ]);

    beforeEach(function(){
        component = new GameDeliveryComponent(mockKeypressService, mockRouter, mockStorageService);
        component.gameboard = new GameboardComponent();
        component.gameboard!.ngOnInit(); // Create the gameboard and spawn the snake.
    });

    it('should increase the score by 1 when the snake consumes a pellet', function(){
        // Arrange
        component.score = 0;

        // Act
        component!.handlePelletConsumed();

        // Assert
        expect(component!.score).toBe(1);
    });
});

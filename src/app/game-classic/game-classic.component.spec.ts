import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KeypressService } from '../shared/keypress-service';
import { StorageService } from '../shared/storage-service';

import { GameClassicComponent } from './game-classic.component';

describe('GameComponent', () => {
    let component: GameClassicComponent;

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
        component = new GameClassicComponent(mockKeypressService, mockRouter, mockStorageService);
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { KeypressService } from '../shared/keypress-service';
import { StorageService } from '../shared/storage-service';

import { GamePortalComponent } from './game-portal.component';

describe('GamePortalComponent', () => {
    let component: GamePortalComponent;

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
        component = new GamePortalComponent(mockKeypressService, mockRouter, mockStorageService);
        component.gameboard = new GameboardComponent();
        component.gameboard!.ngOnInit(); // Create the gameboard and spawn the snake.
    });

    it('should increase the score by 1 when the snake enters a portal', function(){
        // Arrange
        component.score = 0;

        // Act
        component!.handlePortalEntered();

        // Assert
        expect(component!.score).toBe(1);
    });
});

import { SecondsToMinutesPipe } from './seconds-to-minutes-pipe.pipe';

describe('SecondsToMinutesPipePipe', () => {
    it('create an instance', () => {
        const pipe = new SecondsToMinutesPipe();
        expect(pipe).toBeTruthy();
    });

    it('should return a the correct mm:ss representation of a number of seconds', () => {
        // Arrange
        let sut = new SecondsToMinutesPipe();
        let input: string = "80";
        let expeceted = '1:20'
    
        // Act
        let actual: string = sut.transform(input);
    
        // Assert
        expect(actual).toBe(expeceted);
      });
});

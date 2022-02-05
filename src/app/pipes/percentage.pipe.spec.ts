import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  it('create an instance', () => {
    const pipe = new PercentagePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a string', () => {
    // Arrange
    let sut = new PercentagePipe();
    let input: number = 10;

    // Act
    let result: string = sut.transform(10);

    // Assert
    expect(result).toBeInstanceOf(String);
  });

  it('should add a percentage sign to the end of a number', () => {
    // Arrange
    let sut = new PercentagePipe();
    let input: number = 10;

    // Act
    let result: string = sut.transform(input);

    // Assert
    expect(result).toBe("10%");
  });
});

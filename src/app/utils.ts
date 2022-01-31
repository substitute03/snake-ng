export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
export function secondsToMinutes(seconds: number): string{
    let minutesLeft: number = Math.floor(+seconds / 60);
    let secondsLeft: number = +seconds % 60;

    return `${minutesLeft}:${secondsLeft >= 10 ? secondsLeft : "0" + secondsLeft}`;
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinutes'
})
export class SecondsToMinutesPipe implements PipeTransform {

  transform(seconds: string): string {
    let minutesLeft: number = Math.floor(+seconds / 60);
    let secondsLeft: number = +seconds % 60;

    return `${minutesLeft}:${secondsLeft >= 10 ? secondsLeft : "0" + secondsLeft}`;
  }

}

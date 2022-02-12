import { EventType } from "src/domain/enums";

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
export function secondsToMinutes(seconds: number): string{
    let minutesLeft: number = Math.floor(+seconds / 60);
    let secondsLeft: number = +seconds % 60;

    return `${minutesLeft}:${secondsLeft >= 10 ? secondsLeft : "0" + secondsLeft}`;
}

export async function playSound(event: EventType): Promise<void>{

    let audio = new Audio();

    switch(event){
        case EventType.CountdownInProgress: {
            audio.src = "../assets/sounds/CountdownInProgress.mp3";
            break;
        }
        case EventType.CountdownEnd: {
            audio.src = "../assets/sounds/CountdownEnd.mp3";
            break;
        }
        case EventType.PelletConsumed: {
            audio.src = "../assets/sounds/PelletConsumed.mp3";
            break;
        }
        case EventType.ParcelRepositioned: {
            audio.src = "../assets/sounds/ParcelRepositioned.mp3";
            break;
        }
        case EventType.ParcelDelivered: {
            audio.src = "../assets/sounds/ParcelDelivered.mp3";
            break;
        }
        case EventType.GameOver: {
            audio.src = "../assets/sounds/GameOver.mp3";
            break;
        }
        case EventType.Error: {
            audio.src = "../assets/sounds/Error.mp3";
            break;
        }
    }

    audio.load();
    audio.play();
}
export function Delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
}

export function GetActualTime(): number {
        return Date.now()
}

export interface PreviousVote {
        ExchangeRates: number
        Time: number
}
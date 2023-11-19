import 'colorts/lib/string';
import { getTime } from "./time";

export function InfoLog(msg: string) {
        console.log(getTime(), 'INFO'.green, msg);
}
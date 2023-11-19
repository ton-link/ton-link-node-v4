import 'colorts/lib/string';
import { getTime } from "./time";

export function Error(msg: string, error_msg: string) {
        console.log(getTime(), 'ERR'.red, msg, "error=", `"${error_msg}"`.red);
}
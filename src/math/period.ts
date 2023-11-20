import TonWeb from "tonweb";
import { GetActualTime } from "../constant"

export async function CalculateVotePeriod(oracle: string, client: TonWeb): Promise<[boolean, number]> {
        let last_update_time = await client.provider.call2(oracle, 'get_last_update_time');
        if ((GetActualTime() - last_update_time.toNumber()) >= 50) {
                return [true, (GetActualTime() - last_update_time)]
        } 
        return [false, (GetActualTime() - last_update_time)]
}
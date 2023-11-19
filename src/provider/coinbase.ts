import TonWeb from "tonweb"
const Cell = TonWeb.boc.Cell;
const ONCHAIN_CONTENT_PREFIX = 0x00;
const OFFCHAIN_CONTENT_PREFIX = 0x01;

function parseUri(bytes: AllowSharedBufferSource): string{
        return new TextDecoder().decode(bytes);
}



export async function GetPriceByDenom(denom:string): Promise<number> {
        var price = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${denom}`)
        var pricejson = await price.json()
        return ((pricejson.data.rates['PYUSD']).slice(0,15)) * 10**9
} 

export async function GetDenom(client: TonWeb, oracle: string): Promise<string> {
        let denom = await client.provider.call2(oracle, 'get_denom');
        /* TODO */
        //console.log(denom)
        //let denom_cell = denom.load_Ref()
        //return parseUri(denom_cell.slice(1))
        return 'TON'
}
import { Error } from "./error"
import { InfoLog } from "./info"
import { Delay, GetActualTime, PreviousVote } from "../constant/helpers";
import { GetPriceByDenom, GetDenom } from "../provider";
import { CalculateVotePeriod } from "../math"
import TonWeb from "tonweb";
import { mnemonicToKeyPair, KeyPair } from 'tonweb-mnemonic'
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { GetCellForVote } from "../constant";


async function InitWallet(mnemonic: string, client: TonWeb): Promise<[any, KeyPair]> {
        let seed = String(mnemonic)
        let arr = seed.split(' ');
        const keyPair = await mnemonicToKeyPair(arr);
        const WalletClass = client.wallet.all["v3R2"];
        const wallet = new WalletClass(client.provider, {
                publicKey: keyPair.publicKey,
                wc: 0
        });
        return [wallet, keyPair]
}

async function InitClient(network: string): Promise<TonWeb> {
        let endpoint: string;
        switch (network) {
                case 'testnet':
                        endpoint = await getHttpEndpoint({
                                network: 'testnet',
                        });
                        break;
                case 'mainnet':
                        endpoint = await getHttpEndpoint({});
                        break;
        
                default:
                        endpoint = await getHttpEndpoint({
                                network: 'testnet',
                        });
                        break;
        }
        const client = new TonWeb(new TonWeb.HttpProvider(endpoint))
        return client
}

export async function CmdStart(mnemonic: string, network: string, oracle: string) {
        let previousVotePeriod = 0;
        let previousVote = <PreviousVote>{};
        let lastBlock: number = 0;

        try {
                let client = await InitClient(network)
                let [wallet, keyPair] = await InitWallet(mnemonic, client)
                const walletAddress = await wallet.getAddress();
                const address = walletAddress.toString(true, true, true);
                InfoLog(`using wallet=${address}`)
                InfoLog(`using net=${network}`)

                while(1){
                        let [need_vote, diff] = await CalculateVotePeriod(previousVotePeriod, client)
                        if (!need_vote) {
                                InfoLog("got new chain height " + "seqno=" + (await client.provider.getMasterchainInfo()).last.seqno)
                        }
                        if (need_vote && diff <= 5) {
                                InfoLog("skipping until next voting period")
                                await Delay(1000)
                                continue
                        }
                        if (need_vote && diff <= 10) {
                                InfoLog("missing vote during voting period")
                                previousVotePeriod = GetActualTime()
                                continue
                        }

                        if (need_vote && Object.keys(previousVote).length === 0) {
                                let denom = await GetDenom(client, oracle)
                                let exchange_rates = await GetPriceByDenom(denom)
                                let msg = GetCellForVote(exchange_rates)

                                const seqno = (await wallet.methods.seqno().call()) || 0;
                                const result = await wallet.methods.transfer({
                                        secretKey: keyPair.secretKey,
                                        toAddress: (process.env).ORACLEADDRESS,
                                        amount: TonWeb.utils.toNano("0.05"),
                                        seqno: seqno,
                                        payload: msg,
                                        sendMode: 3
                                }).send()

                                InfoLog(`broadcasting vote feeder=${address} rates=${exchange_rates}`)
                                /*if (result.code !== undefined && result.code !== 0) {
                                        Error("", String("failed to send tx: " + result.rawLog))
                                        continue
                                } else {
                                        InfoLog(`succeed broadcasting pre-vote txhash=${result.transactionHash}`);
                                }*/

                                previousVote = <PreviousVote>{
                                        ExchangeRates: exchange_rates,
                                        Time: GetActualTime()
                                };
                                previousVotePeriod = GetActualTime()
                        }
                }
        } catch (error) {
                Error("get error", String(error))
        }
}
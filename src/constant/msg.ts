import TonWeb from "tonweb";
const Cell = TonWeb.boc.Cell;

export async function GetCellForVote(data: number) {
        const cell = new Cell();
        cell.bits.writeUint(160, 32)
        cell.bits.writeUint(0, 64)
        cell.bits.writeUint(data, 64)
        return cell
}
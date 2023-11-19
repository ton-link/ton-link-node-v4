import { Main } from "./src";
import dotenv from 'dotenv';
dotenv.config();
Main(process.env.SEED!, process.env.NETWORK!, process.env.ORACLEADDRESS!)
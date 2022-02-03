import Web3 from 'https://deno.land/x/web3/mod.ts';
import { readRuntimeConfig } from './config.ts';

const defaultProviderUrl = readRuntimeConfig('web3DefaultProviderUrl');
const defaultProvider = new Web3(new Web3.providers.HttpProvider(defaultProviderUrl!));

export const web3 = defaultProvider;

import yaml from 'yaml';
import {network} from '../lib';
import assert from 'assert';

const configYaml = `
custom:
  # Default network
  defaultNetwork:
    # Chain name
    chain: polygon
    # Network name
    network: mainnet
    # Use provider pool
    providerPool: true

  networks:
    # Polygon
    # Ref: https://docs.polygon.technology/docs/develop/network-details/network
    polygon:
      mainnet:
        chainId: 137
        provider:
          - https://polygon-rpc.com
          - https://matic-mainnet.chainstacklabs.com
          - https://rpc-mainnet.maticvigil.com
          - https://rpc-mainnet.matic.quiknode.pro
        browser: https://polygonscan.com
`

class YmlConfig {
	custom: any;
}

let setting: YmlConfig;

beforeAll(async () => {
	setting = yaml.parse(configYaml);
})

test('Connection with provider pool enabled', async () => {
	network.LoadConfig(setting.custom);
	const result = await network.isConnected();
	assert.strictEqual(result, true);

	const provider = network.MyProvider.Get();
	const blockNumber = await provider.getBlockNumber();
	assert.strictEqual(blockNumber > 0, true);
	console.debug("BlockNumber=", blockNumber);
}, 10000)

test('Connection with provider pool disabled', async () => {
	let poolDisabledConfig = setting.custom;
	poolDisabledConfig.defaultNetwork.providerPool = false;

	network.LoadConfig(poolDisabledConfig);
	const result = await network.isConnected();
	assert.strictEqual(result, true);

	const provider = network.MyProvider.Get();
	const blockNumber = await provider.getBlockNumber();
	assert.strictEqual(blockNumber > 0, true);
	console.debug("BlockNumber=", blockNumber);
}, 10000)

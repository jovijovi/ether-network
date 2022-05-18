import yaml from 'yaml';
import {network} from '../lib';
import assert from 'assert';

const configYaml = `
custom:
  # Default network
  defaultNetwork:
    # Chain name
    chain: dev
    # Network name
    network: local
    # Use provider pool
    providerPool: true

  networks:
    # Local Development
    dev:
      local:
        chainId: 666
        provider:
          - http://localhost:8545
        browser: http://localhost:4000
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

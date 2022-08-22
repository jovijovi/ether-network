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
        options: 'SOME OPTIONS'
`

const configYamlNetworkNotWorks = `
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
    dev:
      local:
        chainId: 1234567890
        provider:
          - https://localhost:12345
        browser: https://localhost:4000/
`

const configYamlEmptyNetwork = `
custom:
  # Default network
  defaultNetwork:
    # Chain name
    chain: ethereum
    # Network name
    network: mainnet
    # Use provider pool
    providerPool: true

  networks:
    ethereum:
      mainnet:
`

const configYamlInvalidNetworkEmptyProvider = `
custom:
  # Default network
  defaultNetwork:
    # Chain name
    chain: ethereum
    # Network name
    network: mainnet
    # Use provider pool
    providerPool: true

  networks:
    ethereum:
      mainnet:
        chainId: 1
        browser:
`

const configYamlInvalidNetworkEmptyChainId = `
custom:
  # Default network
  defaultNetwork:
    # Chain name
    chain: ethereum
    # Network name
    network: mainnet
    # Use provider pool
    providerPool: true

  networks:
    ethereum:
      mainnet:
        chainId:
        provider:
          - http://localhost:12345
        browser:
`


class YmlConfig {
	custom: any;
}

let setting: YmlConfig;
let mockNetworkNotWorks: YmlConfig;
let mockEmptyNetwork: YmlConfig;
let mockInvalidNetworkEmptyProvider: YmlConfig;
let mockInvalidNetworkEmptyChainId: YmlConfig;

beforeAll(async () => {
	setting = yaml.parse(configYaml);
	mockNetworkNotWorks = yaml.parse(configYamlNetworkNotWorks);
	mockEmptyNetwork = yaml.parse(configYamlEmptyNetwork);
	mockInvalidNetworkEmptyProvider = yaml.parse(configYamlInvalidNetworkEmptyProvider);
	mockInvalidNetworkEmptyChainId = yaml.parse(configYamlInvalidNetworkEmptyChainId);
})

test('ERROR: Network not works', async () => {
	try {
		const result = await network.isConnected();
		console.debug("Result=", result);
	} catch (e) {
		console.debug("Expected error=", e);
	}
	network.MyProvider.Reset();
}, 10000)

test('ERROR: Empty network', async () => {
	try {
		network.LoadConfig(mockEmptyNetwork.custom);
		const result = await network.isConnected();
		console.debug("Result=", result);
	} catch (e) {
		console.debug("Expected error=", e);
	}
	network.MyProvider.Reset();
}, 10000)

test('ERROR: Invalid network - Empty provider - isConnected failed', async () => {
	try {
		network.LoadConfig(mockInvalidNetworkEmptyProvider.custom);
		const result = await network.isConnected();
		console.debug("Result=", result);
	} catch (e) {
		console.debug("Expected error=", e);
	}
	network.MyProvider.Reset();
}, 10000)

test('ERROR: Invalid network - Empty provider - Get provider failed', async () => {
	try {
		network.LoadConfig(mockInvalidNetworkEmptyProvider.custom);
		const provider = network.MyProvider.Get(true);
		console.debug("Provider=", provider);
	} catch (e) {
		console.debug("Expected error=", e);
	}
	network.MyProvider.Reset();
}, 10000)

test('ERROR: Invalid network - Empty chainId', async () => {
	try {
		network.LoadConfig(mockInvalidNetworkEmptyChainId.custom);
		const result = await network.isConnected();
		console.debug("Result=", result);
	} catch (e) {
		console.debug("Expected error=", e);
	}
	network.MyProvider.Reset();
}, 10000)

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

test('Force new provider', async () => {
	network.LoadConfig(setting.custom);
	const result = await network.isConnected();
	assert.strictEqual(result, true);

	const provider = network.MyProvider.Get(true);
	const blockNumber = await provider.getBlockNumber();
	assert.strictEqual(blockNumber > 0, true);
	console.debug("BlockNumber=", blockNumber);
}, 10000)

test('Get browser', async () => {
	const browserURL = network.GetBrowser();
	console.debug("Browser=", browserURL);
	assert.notEqual(browserURL, undefined);
})

test('Get network options', async () => {
	const options = network.GetOptions();
	console.debug("Options=", options);
	assert.notEqual(options, undefined);
})

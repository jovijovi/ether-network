class Network {
	chainId: number
	provider: string[]
	browser?: string
	options: any
}

type Chain = Map<string, Map<string, Network>>;

class DefaultNetwork {
	chain: string
	network: string
	providerPool?: boolean
}

export class CustomConfig {
	defaultNetwork: DefaultNetwork
	networks: Chain
}

let customConfig: CustomConfig;

export function LoadConfig(custom: any) {
	customConfig = custom;
}

// GetDefaultNetwork returns default chain & network name
export function GetDefaultNetwork(): DefaultNetwork {
	if (customConfig && customConfig.defaultNetwork) {
		return customConfig.defaultNetwork;
	}

	throw new Error(`Invalid network config`);
}

// GetNetwork returns network config
export function GetNetworkConfig(defaultNetwork: DefaultNetwork): Network {
	const network = customConfig.networks[defaultNetwork.chain][defaultNetwork.network]
	if (!network) {
		throw new Error(`GetNetwork Failed, Unknown Network: ${defaultNetwork}`);
	}
	return network;
}

// GetProvider returns 1st provider
export function GetProvider(): string {
	const provider = GetNetworkConfig(GetDefaultNetwork()).provider;
	if (!provider || provider.length === 0 || !provider[0]) {
		throw new Error('GetProvider failed, invalid provider');
	}
	return provider[0];
}

// GetAllProviders returns all providers
export function GetAllProviders(): string[] {
	const provider = GetNetworkConfig(GetDefaultNetwork()).provider;
	if (!provider || provider.length === 0) {
		throw new Error('GetAllProviders failed, invalid provider');
	}
	return provider;
}

// GetChainId returns chain id
export function GetChainId(): number {
	const chainId = GetNetworkConfig(GetDefaultNetwork()).chainId;
	if (!chainId) {
		throw new Error('GetChainId failed, invalid chainId');
	}
	return chainId;
}

// GetBrowser returns blockchain browser URL
export function GetBrowser(): string {
	return GetNetworkConfig(GetDefaultNetwork()).browser;
}

// GetOptions returns network options
export function GetOptions(): any {
	return GetNetworkConfig(GetDefaultNetwork()).options;
}

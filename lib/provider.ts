import {log} from '@jovijovi/pedrojs-log';
import {JsonRpcProvider} from '@ethersproject/providers';
import * as customConfig from './config';
import {RandIntBetween} from './random';

export namespace MyProvider {
	// Provider
	let defaultProvider: JsonRpcProvider;

	// Provider Pool
	let providerPool: JsonRpcProvider[] = [];

	// New provider
	export function New(): JsonRpcProvider {
		return new JsonRpcProvider(customConfig.GetProvider(), customConfig.GetChainId());
	}

	// Get provider
	export function Get(isForceNew = false, reqId?: string): JsonRpcProvider {
		// Returns a new provider always if isForceNew is true
		if (isForceNew) {
			return New();
		}

		// Get provider from pool
		if (customConfig.GetDefaultNetwork().providerPool) {
			if (providerPool.length === 0) {
				providerPool = NewPool();
				log.RequestId(reqId).info("Init provider pool, Network=%s, ChainId=%d, Provider=%j",
					customConfig.GetDefaultNetwork(), customConfig.GetChainId(), customConfig.GetAllProviders());
			}

			const provider = GetFromPool();
			log.RequestId(reqId).trace("Network=%s, ChainId=%d, Provider=%s",
				customConfig.GetDefaultNetwork(), provider.network.chainId, provider.connection.url);
			return provider;
		}

		// Get default provider
		if (defaultProvider == null) {
			defaultProvider = New();
			log.RequestId(reqId).info("Network=%s, ChainId=%d, Provider=%s",
				customConfig.GetDefaultNetwork(), defaultProvider.network.chainId, defaultProvider.connection.url);
		}
		return defaultProvider;
	}

	// New provider pool
	export function NewPool(): JsonRpcProvider[] {
		return customConfig.GetAllProviders().map(url => new JsonRpcProvider(url, customConfig.GetChainId()));
	}

	// GetFromPool retrieve a provider from provider pool
	export function GetFromPool(): JsonRpcProvider {
		// Get random provider, range: [0, providerPool.length)
		return providerPool[RandIntBetween(0, providerPool.length)];
	}

	// Reset (NOT SAFE)
	export function Reset() {
		defaultProvider = undefined;
		providerPool = [];
	}
}

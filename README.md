# Ether Network

[![npm](https://img.shields.io/npm/v/@jovijovi/ether-network.svg)](https://www.npmjs.com/package/@jovijovi/ether-network)
[![GitHub Actions](https://github.com/jovijovi/ether-network/workflows/Test/badge.svg)](https://github.com/jovijovi/ether-network)
[![Coverage](https://img.shields.io/codecov/c/github/jovijovi/ether-network?label=\&logo=codecov\&logoColor=fff)](https://codecov.io/gh/jovijovi/ether-network)

A provider network toolkit for Ethereum ecosystem. 

## Philosophy

*:kiss: KISS. Keep it small and simple.*

## Features

- Provider connection test
- Provider pool

## Development Environment

- typescript `4.7.4`
- node `v16.16.0`
- ts-node `v10.9.1`
- yarn `v1.22.19`

## Install

```shell
npm install @jovijovi/ether-network
```

or

```shell
yarn add @jovijovi/ether-network
```

## Usage

```typescript
import {network} from '@jovijovi/ether-network';

network.LoadConfig(customConfig);
network.isConnected().then(r => {
	if (!r) {
		return;
	}
});

const provider = network.MyProvider.Get();
```

## Roadmap

- Documents

## License

[MIT](LICENSE)

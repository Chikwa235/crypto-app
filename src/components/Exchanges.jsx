import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import HTMLReactParser from 'html-react-parser';

const { Text } = Typography;
const { Panel } = Collapse;

// Hardcoded exchange data (10+ exchanges) with valid logos

const exchangesList = [
  {
    id: 'binance',
    rank: 1,
    name: 'Binance',
    iconUrl: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
    volume: 35000000000,
    numberOfMarkets: 1200,
    marketShare: 25.6,
    description: `<p>Binance is one of the world's largest cryptocurrency exchanges. It offers a wide range of crypto trading pairs and advanced trading features.</p>`
  },
  {
    id: 'coinbase',
    rank: 2,
    name: 'Coinbase',
    iconUrl: 'https://cryptologos.cc/logos/coinbase-coin-logo.png', // ✅ direct image
    volume: 12000000000,
    numberOfMarkets: 500,
    marketShare: 12.1,
    description: `<p>Coinbase is a popular US-based exchange that is beginner-friendly and highly regulated. It supports many major cryptocurrencies.</p>`
  },
  {
    id: 'kraken',
    rank: 3,
    name: 'Kraken',
    iconUrl: 'https://cryptologos.cc/logos/kraken-kraken-logo.png', // ✅ direct image
    volume: 8000000000,
    numberOfMarkets: 400,
    marketShare: 7.5,
    description: `<p>Kraken is a trusted exchange known for its strong security features and wide range of crypto assets.</p>`
  },
  {
    id: 'bitfinex',
    rank: 4,
    name: 'Bitfinex',
    iconUrl: 'https://cryptologos.cc/logos/bitfinex-bfx-logo.png',
    volume: 4500000000,
    numberOfMarkets: 300,
    marketShare: 5.2,
    description: `<p>Bitfinex is known for advanced trading features and liquidity. It supports margin trading and many crypto assets.</p>`
  },
  {
    id: 'bittrex',
    rank: 5,
    name: 'Bittrex',
    iconUrl: 'https://cryptologos.cc/logos/bittrex-btx-logo.png',
    volume: 3200000000,
    numberOfMarkets: 280,
    marketShare: 3.8,
    description: `<p>Bittrex is a US-based exchange with a strong reputation for security and wide crypto asset support.</p>`
  },
  {
    id: 'huobi',
    rank: 6,
    name: 'Huobi',
    iconUrl: 'https://cryptologos.cc/logos/huobi-token-ht-logo.png',
    volume: 2900000000,
    numberOfMarkets: 260,
    marketShare: 3.2,
    description: `<p>Huobi is a global exchange offering spot and derivatives trading for a wide range of cryptocurrencies.</p>`
  },
  {
    id: 'okex',
    rank: 7,
    name: 'OKEx',
    iconUrl: 'https://cryptologos.cc/logos/okx-okb-logo.png',
    volume: 2700000000,
    numberOfMarkets: 240,
    marketShare: 2.9,
    description: `<p>OKEx is a major exchange providing spot, futures, and options trading across multiple crypto assets.</p>`
  },
  {
    id: 'bitstamp',
    rank: 8,
    name: 'Bitstamp',
    iconUrl: 'https://cryptologos.cc/logos/bitstamp-btc-logo.png',
    volume: 2200000000,
    numberOfMarkets: 180,
    marketShare: 2.1,
    description: `<p>Bitstamp is one of the oldest crypto exchanges, known for reliability and fiat-to-crypto trading pairs.</p>`
  },
  {
    id: 'gemini',
    rank: 9,
    name: 'Gemini',
    iconUrl: 'https://cryptologos.cc/logos/gemini-gem-logo.png',
    volume: 1800000000,
    numberOfMarkets: 150,
    marketShare: 1.7,
    description: `<p>Gemini is a US-regulated exchange that focuses on security and compliance, ideal for institutional traders.</p>`
  },
  {
    id: 'kucoin',
    rank: 10,
    name: 'KuCoin',
    iconUrl: 'https://cryptologos.cc/logos/kucoin-kcs-logo.png',
    volume: 1300000000,
    numberOfMarkets: 110,
    marketShare: 1.2,
    description: `<p>KuCoin is a global exchange known for a wide selection of altcoins and user-friendly interface.</p>`
  }
];


const Exchanges = () => {
  return (
    <>
      <Row style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
        <Col span={6}>Exchanges</Col>
        <Col span={6}>24h Trade Volume</Col>
        <Col span={6}>Markets</Col>
        <Col span={6}>Change</Col>
      </Row>

      {exchangesList.map((exchange) => (
        <Row key={exchange.id} style={{ marginBottom: '10px' }}>
          <Col span={24}>
            <Collapse>
              <Panel
                showArrow={false}
                header={
                  <Row align="middle">
                    <Col span={6}>
                      <Text><strong>{exchange.rank}. </strong></Text>
                      <Avatar src={exchange.iconUrl} alt={exchange.name} style={{ marginRight: 8 }} />
                      <Text><strong>{exchange.name}</strong></Text>
                    </Col>
                    <Col span={6}>${millify(exchange.volume)}</Col>
                    <Col span={6}>{millify(exchange.numberOfMarkets)}</Col>
                    <Col span={6}>{millify(exchange.marketShare)}%</Col>
                  </Row>
                }
              >
                {HTMLReactParser(exchange.description)}
              </Panel>
            </Collapse>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default Exchanges;

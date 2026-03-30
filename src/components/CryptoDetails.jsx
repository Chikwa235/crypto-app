import React, { useMemo, useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select, Divider } from 'antd';
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const formatUsd = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  if (!Number.isFinite(n)) return 'N/A';
  return `$ ${millify(n)}`;
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const n = Number(value);
  if (!Number.isFinite(n)) return 'N/A';
  return millify(n);
};

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timePeriod, setTimePeriod] = useState('7d');

  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistoryData } = useGetCryptoHistoryQuery({ coinId, timePeriod });

  const cryptoDetails = data?.data?.coin;

  const time = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y'];

  const stats = useMemo(() => {
    if (!cryptoDetails) return [];
    return [
      {
        title: 'Price to USD',
        value: cryptoDetails.price ? `$ ${millify(cryptoDetails.price)}` : 'N/A',
        icon: <DollarCircleOutlined />,
      },
      { title: 'Rank', value: cryptoDetails.rank ?? 'N/A', icon: <NumberOutlined /> },
      {
        title: '24h Volume',
        value: cryptoDetails['24hVolume'] ? `$ ${millify(cryptoDetails['24hVolume'])}` : 'N/A',
        icon: <ThunderboltOutlined />,
      },
      {
        title: 'Market Cap',
        value: cryptoDetails.marketCap ? `$ ${millify(cryptoDetails.marketCap)}` : 'N/A',
        icon: <DollarCircleOutlined />,
      },
      {
        title: 'All-time-high(daily avg.)',
        value: cryptoDetails.allTimeHigh?.price ? `$ ${millify(cryptoDetails.allTimeHigh.price)}` : 'N/A',
        icon: <TrophyOutlined />,
      },
    ];
  }, [cryptoDetails]);

  const genericStats = useMemo(() => {
    if (!cryptoDetails) return [];
    return [
      { title: 'Number Of Markets', value: cryptoDetails.numberOfMarkets ?? 'N/A', icon: <FundOutlined /> },
      { title: 'Number Of Exchanges', value: cryptoDetails.numberOfExchanges ?? 'N/A', icon: <MoneyCollectOutlined /> },
      {
        title: 'Approved Supply',
        value: cryptoDetails.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />,
        icon: <ExclamationCircleOutlined />,
      },
      {
        title: 'Total Supply',
        value: cryptoDetails.supply?.total ? formatNumber(cryptoDetails.supply.total) : 'N/A',
        icon: <ExclamationCircleOutlined />,
      },
      {
        title: 'Circulating Supply',
        value: cryptoDetails.supply?.circulating ? formatNumber(cryptoDetails.supply.circulating) : 'N/A',
        icon: <ExclamationCircleOutlined />,
      },
    ];
  }, [cryptoDetails]);

  const quickFacts = useMemo(() => {
    if (!cryptoDetails) return [];

    return [
      { label: 'Symbol', value: cryptoDetails.symbol || cryptoDetails.slug || 'N/A' },
      { label: 'Rank', value: cryptoDetails.rank ?? 'N/A' },
      { label: 'Price (USD)', value: cryptoDetails.price ? formatUsd(cryptoDetails.price) : 'N/A' },
      { label: 'Market Cap', value: formatUsd(cryptoDetails.marketCap) },
      { label: '24h Volume', value: formatUsd(cryptoDetails['24hVolume']) },
      { label: 'Circulating Supply', value: formatNumber(cryptoDetails.supply?.circulating) },
      { label: 'Total Supply', value: formatNumber(cryptoDetails.supply?.total) },
      { label: 'Approved Supply', value: cryptoDetails.supply?.confirmed ? 'Yes' : 'No' },
      {
        label: 'All Time High',
        value: cryptoDetails.allTimeHigh?.price ? formatUsd(cryptoDetails.allTimeHigh.price) : 'N/A',
      },
    ];
  }, [cryptoDetails]);

  if (isFetching) return 'Loading...';
  if (!cryptoDetails) return 'No data available';

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {cryptoDetails.name} ({cryptoDetails.slug}) Price
        </Title>
        <p>
          {cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.
        </p>
      </Col>

      <Select
        value={timePeriod}
        className="select-timeperiod"
        placeholder="Select Timeperiod"
        onChange={setTimePeriod}
      >
        {time.map((date) => (
          <Option key={date} value={date}>
            {date}
          </Option>
        ))}
      </Select>

      <LineChart
        coinHistory={coinHistoryData}
        currentPrice={millify(cryptoDetails.price)}
        coinName={cryptoDetails.name}
      />

      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">
              {cryptoDetails.name} Value Statistics
            </Title>
            <p>
              An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank,
              and trading volume.
            </p>
          </Col>

          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>

        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>
              An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank,
              and trading volume.
            </p>
          </Col>

          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>

      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>

          {cryptoDetails.description ? HTMLReactParser(cryptoDetails.description) : <p>N/A</p>}

          <Divider />

          <Title level={4} className="coin-details-heading">Quick facts</Title>
          <Col style={{ width: '100%' }}>
            {quickFacts.map((f) => (
              <Row
                key={f.label}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Text strong>{f.label}</Text>
                <Text>{f.value}</Text>
              </Row>
            ))}
          </Col>
        </Row>

        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.length ? (
            cryptoDetails.links.map((link) => (
              <Row className="coin-link" key={link.name}>
                <Title level={5} className="link-name">{link.type}</Title>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.name}
                </a>
              </Row>
            ))
          ) : (
            <p>No links available</p>
          )}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;
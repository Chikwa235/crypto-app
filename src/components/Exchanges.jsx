import React, { useEffect, useState } from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar, Spin, Alert } from 'antd';

const { Text } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  const [exchangesList, setExchangesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setLoading(true);
        setErr(null);

        // CoinGecko: real exchange data + logos
        const res = await fetch(
          'https://api.coingecko.com/api/v3/exchanges?per_page=10&page=1'
        );
        if (!res.ok) throw new Error(`Failed to fetch exchanges (HTTP ${res.status})`);

        const data = await res.json();

        // Normalize to your UI fields
        const normalized = data.map((ex, idx) => ({
          id: ex.id,
          rank: ex.trust_score_rank ?? idx + 1,
          name: ex.name,
          iconUrl: ex.image, // reliable logos
          volumeBtc24h: ex.trade_volume_24h_btc ?? null,
          yearEstablished: ex.year_established ?? null,
          country: ex.country ?? null,
          url: ex.url ?? null,
          description:
            ex.description?.trim()
              ? ex.description
              : `<p>${ex.name} is a cryptocurrency exchange.</p>`,
        }));

        setExchangesList(normalized);
      } catch (e) {
        setErr(e?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  if (loading) return <Spin />;
  if (err) return <Alert type="error" message="Error loading exchanges" description={err} />;

  return (
    <>
      <Row style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
        <Col span={8}>Exchange</Col>
        <Col span={6}>24h Volume (BTC)</Col>
        <Col span={5}>Country</Col>
        <Col span={5}>Established</Col>
      </Row>

      {exchangesList.map((exchange) => (
        <Row key={exchange.id} style={{ marginBottom: '10px' }}>
          <Col span={24}>
            <Collapse>
              <Panel
                showArrow={false}
                header={
                  <Row align="middle">
                    <Col span={8}>
                      <Text>
                        <strong>{exchange.rank}. </strong>
                      </Text>

                      <Avatar
                        src={exchange.iconUrl}
                        alt={exchange.name}
                        size={28}
                        style={{ marginRight: 8 }}
                        onError={() => true}
                      >
                        {exchange.name?.[0]}
                      </Avatar>

                      <Text>
                        <strong>{exchange.name}</strong>
                      </Text>
                    </Col>

                    <Col span={6}>
                      {exchange.volumeBtc24h != null ? millify(exchange.volumeBtc24h) : '-'}
                    </Col>

                    <Col span={5}>{exchange.country || '-'}</Col>
                    <Col span={5}>{exchange.yearEstablished || '-'}</Col>
                  </Row>
                }
              >
                {/* CoinGecko description may contain HTML; render safely as plain text */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {(exchange.description || '').replace(/<[^>]*>/g, '')}
                </div>

                {exchange.url ? (
                  <div style={{ marginTop: 10 }}>
                    <a href={exchange.url} target="_blank" rel="noreferrer">
                      Visit exchange website
                    </a>
                  </div>
                ) : null}
              </Panel>
            </Collapse>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default Exchanges;
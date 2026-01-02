
import React, { useState } from 'react';
import moment from 'moment';
import { Button, Typography, Row, Col, Card, Avatar, Select } from 'antd';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';

const { Title, Text } = Typography;
const { Option } = Select;
const demoImage = 'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg';

// List of valid sources supported by the API
const sources = [
  { id: 'bitcoinmagazine', name: 'Bitcoin Magazine' },
  { id: 'coindesk', name: 'CoinDesk' },
  { id: 'cointelegraph', name: 'CoinTelegraph' },
  { id: 'decrypt', name: 'Decrypt' },
  { id: 'theblock', name: 'The Block' },
  { id: 'cryptoslate', name: 'CryptoSlate' },
  { id: 'newsbtc', name: 'NewsBTC' },
  { id: 'ambcrypto', name: 'AMBCrypto' },
];

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('bitcoinmagazine');
  const [pageSize, setPageSize] = useState(6);

  // Fetch news based on selected source
  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory,
    pageSize,
  });

  if (isFetching) return 'Loading...';

  const articles = cryptoNews?.data || [];
  if (!articles.length) return 'No news available';

  const displayArticles = simplified ? articles.slice(0, 6) : articles;

  return (
    <>
      <Row gutter={[24, 24]}>
        {!simplified && (
          <Col span={24}>
            <Select
              showSearch
              className="select-news"
              placeholder="Select a Source"
              value={newsCategory}
              onChange={(value) => setNewsCategory(value)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {sources.map((source) => (
                <Option value={source.id} key={source.id}>
                  {source.name}
                </Option>
              ))}
            </Select>
          </Col>
        )}

        {displayArticles.map((news) => (
          <Col xs={24} sm={12} lg={8} key={news.url}>
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <Title level={4}>{news.title}</Title>
                <Text>{news.description}</Text>
                <img
                  src={news?.image || demoImage}
                  alt={news.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = demoImage;
                  }}
                />
              </a>
              <p>
                {news.description && news.description.length > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>
              <div className="provider-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar
                    shape="square"
                    size={32}
                    src={news?.image || demoImage}
                    alt={news.source}
                  />
                  <Text className="provider-name">{news.source}</Text>
                  <Text type="secondary">
                    {moment(news.publishedAt, 'YYYY-MM-DD HH:mm:ss').fromNow()}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {!simplified && (
        <Col span={24} style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={() => setPageSize((prev) => prev + 6)}>Show More</Button>
        </Col>
      )}
    </>
  );
};

export default News;





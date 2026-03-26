import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Button, Typography, Row, Col, Card, Avatar, Select } from 'antd';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';

const { Title, Text } = Typography;
const { Option } = Select;

const demoImage =
  'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg';

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

// ---------- helpers ----------
const isHttpUrl = (value) =>
  typeof value === 'string' &&
  (value.startsWith('http://') || value.startsWith('https://'));

const nonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

const faviconFromUrl = (url) => {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
};

// Normalize each article regardless of whether API uses (thumbnail/link/pubDate) or (image/url/publishedAt)
const normalizeArticle = (raw) => {
  const url = raw?.url || raw?.link || '';
  const publishedAt = raw?.publishedAt || raw?.pubDate || '';
  const image =
    (nonEmptyString(raw?.image) && raw.image) ||
    (nonEmptyString(raw?.thumbnail) && raw.thumbnail) ||
    null;

  return {
    title: raw?.title || '',
    description: raw?.description || raw?.content || '',
    source: raw?.source || raw?.source_id || raw?.provider || '',
    url,
    publishedAt,
    image,
  };
};

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('bitcoinmagazine');
  const [pageSize, setPageSize] = useState(6);

  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory,
    pageSize,
  });

  const articlesRaw = useMemo(() => cryptoNews?.data || [], [cryptoNews]);

  const articles = useMemo(
    () => articlesRaw.map(normalizeArticle),
    [articlesRaw]
  );

  if (isFetching) return 'Loading...';
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
                (option?.children ?? '')
                  .toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
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

        {displayArticles.map((news, idx) => {
          const favicon = news.url ? faviconFromUrl(news.url) : null;

          // cover fallback chain: article image -> demo
          const coverSrc = (isHttpUrl(news.image) && news.image) || demoImage;

          const providerAvatar = favicon || demoImage;

          return (
            <Col xs={24} sm={12} lg={8} key={news.url || idx}>
              <Card hoverable className="news-card">
                <a href={news.url} target="_blank" rel="noreferrer">
                  <div style={{ marginBottom: 10 }}>
                    <Title level={4}>{news.title}</Title>
                    <Text type="secondary">
                      {news.description && news.description.length > 90
                        ? `${news.description.substring(0, 90)}...`
                        : news.description}
                    </Text>
                  </div>

                  <img
                    src={coverSrc}
                    alt={news.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = demoImage;
                    }}
                  />
                </a>

                <div className="provider-container" style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar
                      shape="square"
                      size={32}
                      src={providerAvatar}
                      alt={news.source}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = demoImage;
                      }}
                    />
                    <Text className="provider-name">{news.source || 'source'}</Text>
                    <Text type="secondary">
                      {news.publishedAt ? moment(news.publishedAt).fromNow() : ''}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
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
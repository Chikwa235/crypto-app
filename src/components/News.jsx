/*import React from 'react';
import { Typography, Row, Col, Card, Avatar } from 'antd';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import moment from 'moment';

const { Title, Text } = Typography;

const News = ({ simplified }) => {
  // Fetch crypto news
  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({ 
    newsCategory: 'Cryptocurrency' 
  });

  if (isFetching) return 'Loading...';

  // The new API returns articles array
  const articles = cryptoNews?.articles || [];
  if (!articles.length) return 'No news available';

  // Limit to top 6 if simplified mode
  const displayArticles = simplified ? articles.slice(0, 6) : articles;

  return (
    <Row gutter={[24, 24]}>
      {displayArticles.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title level={4}>
                  {news.title.length > 60 ? `${news.title.substring(0, 60)}...` : news.title}
                </Title>
                {news.urlToImage && (
                  <img src={news.urlToImage} alt="news" style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'cover', marginTop: '10px' }} />
                )}
              </div>
              <p>
                {news.description
                  ? news.description.length > 100
                    ? `${news.description.substring(0, 100)}...`
                    : news.description
                  : ''}
              </p>
              <div className="news-provider">
                {news.source?.name && (
                  <Text>{news.source.name}</Text>
                )}
                {news.publishedAt && (
                  <Text style={{ float: 'right' }}>{moment(news.publishedAt).startOf('ss').fromNow()}</Text>
                )}
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;*/

import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';

const { Title, Text } = Typography;

const News = ({ simplified }) => {
  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({ 
    newsCategory: 'Cryptocurrency' 
  });

  if (isFetching) return 'Loading...';

  // Use the correct API field
  const articles = cryptoNews?.data || [];
  if (!articles.length) return 'No news available';

  // Limit to top 6 if simplified
  const displayArticles = simplified ? articles.slice(0, 6) : articles;

  return (
    <Row gutter={[24, 24]}>
      {displayArticles.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <Title level={4}>{news.title}</Title>
              <Text>{news.description}</Text>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;


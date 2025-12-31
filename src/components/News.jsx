

import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card } from 'antd';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';

const { Title, Text } = Typography;
const demoImage = 'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg';

const News = ({ simplified }) => {
  const [pageSize, setPageSize] = useState(6);
  const { data: cryptoNews, isFetching } = useGetCryptoNewsQuery({
    newsCategory: 'Cryptocurrency',
    pageSize,
  });

  if (isFetching) return 'Loading...';

  const articles = cryptoNews?.data || [];
  if (!articles.length) return 'No news available';

  const displayArticles = simplified ? articles.slice(0, 6) : articles;

  return (
    <>
      <Row gutter={[24, 24]}>
        {displayArticles.map((news) => (
          <Col xs={24} sm={12} lg={8} key={news.url}>
            <Card hoverable className="news-card">
              <a href={news.url} target="_blank" rel="noreferrer">
                <Title level={4}>{news.title}</Title>
                <Text>{news.description}</Text>
              <img
                src={news?.logo || news?.favicon || demoImage}
                alt={news.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src = demoImage; }}
              />



              </a>
              <p>
                {news.description.length > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>
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

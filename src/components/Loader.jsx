import React from 'react';
import { Spin } from 'antd';

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
    <Spin size="large" />
  </div>
);

export default Loader;

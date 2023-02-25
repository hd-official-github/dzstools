import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#6d82ff',
        colorBgBase: '#fff',
        colorTextBase: '#465986',
        colorText: "#465986",
        colorLink: "#465986",
        colorLinkHover: "#152637",
        colorBgCard: "#ccc"
      },

    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  </ConfigProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


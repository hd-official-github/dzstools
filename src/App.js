/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Dashboard from './layout/dashboard'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom";
import ContentTools from './pages/ContentTools';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Lg from './pages/Login';
import Cookies from 'universal-cookie';
import { getApi } from './apis/getapi';
import { Layout, Spin } from 'antd';
import WebAudit from './pages/WebAudit';
import Homev2 from './pages/Homev2';

export default function App() {
  const [isloggedIn, setisloggedIn] = useState("loading")
  const cookies = new Cookies();
  async function verifyUser() {
    console.log('user verification');
    const v = await getApi('api/login/verify')
    if (v.success) {
      setisloggedIn(true)
    } else {
      setisloggedIn(false)
    }
  }
  useEffect(() => {
    console.log('render')
    if (cookies.get('user_id')) {
      verifyUser()
    } else {
      setisloggedIn(false)
    }
    return () => {
    }
  }, [])
  if (isloggedIn === "loading") {
    return (
      <Layout style={{ width: '100vw', height: '100vh', justifyContent: 'center' }}>
        <Spin tip="SABAR RAKH LE THODA ---">

        </Spin>
      </Layout>
    )
  }
  if (isloggedIn == false) {
    return <Lg />
  }
  return (
    // <h1>11</h1>
    <Routes>
      {/* <Route path="/" element={<Dashboard children={<Home />} />} /> */}
      <Route path="/" element={<Dashboard children={<Homev2 />} />} />
      <Route path="/content-tools" element={<Dashboard children={<ContentTools />} />} />
      <Route path="/admin/dashboard" element={<Dashboard children={<Admin />} />} />
      <Route path="/settings" element={<Dashboard children={<Settings />} />} />
      <Route path="/web-audit" element={<Dashboard children={<WebAudit />} />} />
    </Routes>
  )
}

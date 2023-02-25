/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Divider, Dropdown, Layout, theme } from 'antd'
import styles from '../style.module.css'
import logo from '../logo.png'
import {
  ToolOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
const { useToken } = theme
const { Header, Footer, Content } = Layout

export default function Dashboard ({ children }) {
  var cookie = new Cookies()
  if (!cookie.get('user_id')) {
    window.location.reload()
  }
  const location = useLocation()
  const { pathname } = location
  let navigate = useNavigate()
  const splitLocation = pathname.split('/')
  const items = [
    {
      label: 'Admin Console',
      key: '1',
      icon: <DashboardOutlined />
    },
    {
      label: 'Logout',
      danger: true,
      key: '2',
      icon: <LogoutOutlined />
    }
  ]
  const handleMenuClick = e => {
    console.log('click', e.key)

    if (e.key == 1) {
      navigate(`/admin/dashboard`)
    }
    if (e.key == 2) {
      cookie.remove('user_id')
      window.location.reload()
    }
  }
  const menuProps = {
    items,
    onClick: handleMenuClick
  }
  const { token } = useToken()
  return (
    <>
      <Layout>
        <Header style={{ backgroundColor: token.colorBgBase, width: '100%' }}>
          <div className={styles.heading}>
            <div style={{ marginRight: 10 }}>
              <Link className={`${styles.a}`} to='/'>
                <img src={logo} alt='logo' width={132} height={50} />
              </Link>
            </div>
            <div style={{ display: 'flex' }}>
              <Link
                className={`${styles.a} ${
                  splitLocation[1] === '' ? styles.isactive : ''
                }`}
                to='/'
              >
                <ToolOutlined style={{ marginRight: 10 }} /> All tools
              </Link>
              <Link
                className={`${styles.a} ${
                  splitLocation[1] === 'content-tools' ? styles.isactive : ''
                }`}
                to='/content-tools'
              >
                <FileTextOutlined style={{ marginRight: 10 }} /> Content
              </Link>
              <Link
                className={`${styles.a} ${
                  splitLocation[1] === 'web-audit' ? styles.isactive : ''
                }`}
                to='/web-audit'
              >
                <SettingOutlined style={{ marginRight: 10 }} />
                Web Audit
              </Link>
              <Link
                className={`${styles.a} ${
                  splitLocation[1] === 'settings' ? styles.isactive : ''
                }`}
                to='/settings'
              >
                <SettingOutlined style={{ marginRight: 10 }} />
                Settings
              </Link>
            </div>
            <div>
              <Dropdown.Button
                menu={menuProps}
                placement='bottomRight'
                arrow
                icon={<UserOutlined />}
              >
                Hello, Admin
              </Dropdown.Button>
            </div>
          </div>
        </Header>
        <Divider style={{ margin: '1px' }} />
        <Content>
          <div className={styles.content}>{children}</div>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </>
  )
}

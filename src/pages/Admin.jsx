import React from 'react'
import styles from '../style.module.css'
import { Tabs, Typography } from 'antd'
import Admintools from '../components/admin/Admintools'
import AdminContent from '../components/admin/AdminContent'
import { ToolOutlined, FileTextOutlined, CodeSandboxOutlined } from '@ant-design/icons'
import AuditAdmin from '../components/admin/AuditAdmin'
export default function Admin () {
  const {Title} = Typography
  const items = [
    {
      label: (
        <span>
          <ToolOutlined />
          All Tools
        </span>
      ),
      key: '1',
      children: <Admintools style={{paddingRight:20}}/>
    },
    {
      label: (
        <span>
          <FileTextOutlined />
          Content
        </span>
      ),
      key: '2',
      children: <AdminContent style={{paddingRight:20}}/>
    },
    {
      label: (
        <span>
          <CodeSandboxOutlined />
          Web audit
        </span>
      ),
      key: '3',
      children: <AuditAdmin style={{paddingRight:20}}/>
    }
  ]
  return (
    <div className={styles.container}>
      <Title level={1}>Admin Dashboard,</Title>
      <Tabs tabPosition='left' items={items} style={{ paddingTop: 30 }} size="large" />
    </div>
  )
}

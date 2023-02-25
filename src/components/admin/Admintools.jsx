import React from 'react'
import { ToolOutlined, FileTextOutlined } from '@ant-design/icons'
import AdminCategory from './AdminCategory'
import AdminWebsite from './AdminWebsite'
import { Tabs } from 'antd'

export default function Admintools() {
  const items = [
    {
      label: (
        <span>
         Category
        </span>
      ),
      key: '1',
      children: <AdminCategory />
    },
    {
      label: (
        <span>
          Website
        </span>
      ),
      key: '2',
      children: <AdminWebsite />
    }
  ]
  return (
    <Tabs tabPosition='top' items={items} size="small"/>
  )
}

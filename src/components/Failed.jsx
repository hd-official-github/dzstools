import { Button, Result, Space } from 'antd'
import React from 'react'

export default function Failed () {
  return (
    <Space>
      <Result
        status='warning'
        title='There are some problems with your operation.'
        extra={
          <Button
            type='primary'
            key='console'
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        }
      />
    </Space>
  )
}

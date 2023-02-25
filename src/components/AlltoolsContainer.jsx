/* eslint-disable eqeqeq */
import {
  AppstoreAddOutlined,
  CopyOutlined,
  LinkOutlined
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Empty, message } from 'antd'
import Meta from 'antd/es/card/Meta'
import React, { useState } from 'react'
import { Typography } from 'antd'
import copy from 'copy-to-clipboard'
export default function AlltoolsContainer ({ alltools }) {
  const [activeinfo, setActiveinfo] = useState()
  const [toggleinfo, settoogleInfo] = useState(false)
  const { Title, Paragraph, Text, Link } = Typography
  if (alltools == 'empty') {
    return (
      <Col span={24}>
        <Empty style={{ width: 1000 }} />
      </Col>
    )
  }
  const getlogininfo = e => {
    settoogleInfo(!toggleinfo)
    setActiveinfo(e)
  }
  const handleCopy = e => {
    copy(e)
    message.success('copied')
  }
  return alltools.map((i, index) => {
    return (
      <Col
        span={alltools.length == 3 ? 8 : alltools.length == 2 ? 12 : 6}
        key={index}
      >
        <Card
          style={{ width: 240 }}
          // loading={loading}
          extra={
            i.username && (
              <AppstoreAddOutlined
                onClick={() => getlogininfo(i.website_name)}
              />
            )
          }
          key={index}
          actions={[
            <Button
              type='link'
              href={i.link}
              target='_blank'
              icon={<LinkOutlined />}
            >
              Visit site
            </Button>
          ]}
        >
          <Meta avatar={<Avatar src={"data:image/png;base64, "+i.image} />} title={i.website_name} />
          {toggleinfo && i.website_name == activeinfo && (
            <>
              <Paragraph style={{ marginTop: 10 }} strong>
                Username : {i.username}{' '}
                <CopyOutlined onClick={() => handleCopy(i.username)} />
              </Paragraph>
              <Paragraph style={{ marginTop: 10 }} strong>
                Password : {i.password}{' '}
                <CopyOutlined onClick={() => handleCopy(i.password)} />
              </Paragraph>
            </>
          )}
        </Card>
      </Col>
    )
  })
}

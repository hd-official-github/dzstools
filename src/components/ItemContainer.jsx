/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react'
import { LinkOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, theme, Col, Row, Empty, Space } from 'antd'
import { postapis } from '../apis/postapi'
import LoadingCards from './LoadingCards'
import Failed from './Failed'
const { useToken } = theme
const { Meta } = Card
export default function ItemContainer ({ tabName, tabcat }) {
  const [tabdata, settabdata] = useState([])
  const [loading, setLoading] = useState(true)
  async function getTabdata () {
    try {
      const res = await postapis('api/website/get-website', {
        category: tabcat
      })
      console.log('TAB DATA ', res)
      if (res.length > 0) {
        settabdata(res)
        setLoading(false)
      } else {
        setLoading('empty')
      }
    } catch (err) {
      setLoading('failed')
    }
  }
  useEffect(() => {
    getTabdata()
    // return () => { setLoading(true)}
  }, [loading])

  if (loading == true) {
    return <LoadingCards />
  }
  if (loading == 'empty') {
    return (
      <Row>
        <Col span={24}>
          {' '}
          <Empty style={{ width: 400 }} />
        </Col>
      </Row>
    )
  }
  if (loading == 'failed') {
    return <Failed />
  }
  if (loading == false)
    return (
      <Space>
        <Row gutter={[8, 8]}>
          {tabdata.map((i, index) => {
            return (
              <Col span={tabdata.length == 2 ? 12 : 8} key={index}>
                <Card
                  style={{ width: 240 }}
                  // loading={loading}
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
                  <Meta
                    avatar={<Avatar src={i.icon} />}
                    title={i.website_name}
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      </Space>
    )
}

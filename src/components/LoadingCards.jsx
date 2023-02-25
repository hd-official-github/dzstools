import { Card, Col, Row } from 'antd'
import React from 'react'

export default function LoadingCards () {
  return (
    <Row gutter={[8, 8]}>
      <Col span={8}>
        <Card style={{ width: 200 }} loading={true}></Card>
      </Col>
      <Col span={8}>
        <Card style={{ width: 200 }} loading={true}></Card>
      </Col>
      <Col span={8}>
        <Card style={{ width: 200 }} loading={true}></Card>
      </Col>
    </Row>
  )
}

import { Card, Col } from 'antd'
import React from 'react'

export default function SkeletonContainer () {
  return (
    <>
      {[1, 2, 3, 4, 5, 6,7,8].map((i) => {
        return <Col span={6}  key={i}><Card style={{width:240}} loading></Card></Col>
      })}
    </>
  )
}

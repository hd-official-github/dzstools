/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import {
  DeleteOutlined,
  LoadingOutlined,
  PlaySquareOutlined
} from '@ant-design/icons'
import {
  Layout,
  Row,
  Col,
  List,
  Skeleton,
  Spin,
  Button,
  Card,
  Statistic,
  theme,
  Progress,
  Popconfirm,
  message
} from 'antd'
import Title from 'antd/es/typography/Title'
import Text from 'antd/es/typography/Text'
import React, { useEffect, useState } from 'react'
import { getApi } from '../apis/getapi'
import { postapis } from '../apis/postapi'
import styles from '../style.module.css'
import { API_URL } from '../utils/constants'
import Cookies from 'universal-cookie'
import { delapis } from '../apis/deleteapi'
export default function WebAudit () {
  const cookies = new Cookies()
  const { useToken } = theme
  const { token } = useToken()
  const [initLoading, setInitLoading] = useState(true)
  const [auditStart, setauditStart] = useState(false)
  const [list, setList] = useState([])
  const [audited, setaudited] = useState([])
  const [httpok, sethttpok] = useState([])
  const [httpfail, sethttpfail] = useState([])
  const [progress, setprogress] = useState(0)
  const [startpoint, setstartpoint] = useState(0)

  const confirm = async e => {
    console.log(e)
    const d = await delapis('api/audit/delete-website', { website_name: e })
    setList(list => list.filter(i => i.website_name !== e))
    if (d.success) {
      message.success('Deleted successfully')
    } else {
      message.error('Unable to delete')
    }
  }
  const cancel = e => {
    console.log(e)
    // message.error('Click on No');
  }

  async function getList () {
    const l = await getApi('api/audit/get-website')
    setList(l)
    setInitLoading(false)
    const a = l.filter(i => i.httpStatus != '')
    const b = l.filter(i => i.httpStatus == '200 HTTP OK')
    const c = l.filter(i => i.httpStatus == '400 HTTP')
    setaudited(a.length)
    sethttpok(b)
    sethttpfail(c)
  }
  async function executeAudit () {
    for (var i = startpoint; i < list.length; i++) {
      let newArr = [...list]
      newArr[i]['httpStatus'] = 'LOADING'
      setList(newArr)
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_name: list[i].website_name })
      }
      const f = await fetch(API_URL + 'api/audit/get-website-data', options)
      const r = await f.json()
      newArr[i]['httpStatus'] = r.httpStatus
      newArr[i]['meta_title'] = r.meta_title
      newArr[i]['meta_desc'] = r.meta_desc
      newArr[i]['snapshot'] = r.snapshot
      //   setaudited(newArr)
      const b = newArr.filter(i => i.httpStatus == '200 HTTP OK')
      sethttpok(b)
      const c = newArr.filter(i => i.httpStatus == '400 HTTP')
      sethttpfail(c)
      var prog = await Math.floor((100 * (i + 1)) / list.length)
      console.log('prog', prog, i + 1, list.length)
      setprogress(prog)
      setaudited(i + 1)
      setList(newArr)
    }
    setauditStart(false)
  }
  const handleExecuteclick = async () => {
    setauditStart(!auditStart)
    const nextYear = new Date()
    const current = new Date()
    nextYear.setFullYear(current.getFullYear() + 1)
    cookies.set(
      'lastaudit',
      current.getDate() +
        '/' +
        current.getMonth() +
        '/' +
        current.getFullYear(),
      {
        path: '/',
        expires: nextYear
      }
    )
    executeAudit()
  }
  useEffect(() => {
    if (!list.length) getList()
    console.log('listrender')
  }, [list])
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  return (
    <Layout
      className={styles.container}
      style={{ background: '#fff', paddingTop: 20 }}
    >
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='Websites'
              value={list.length}
              valueStyle={{
                color: '#3f8600'
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='Audited'
              value={audited}
              valueStyle={{
                color: token.colorPrimary
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='Unaudited'
              value={list.length - audited}
              valueStyle={{
                color: '#cf1322'
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='200 HTTP OK'
              value={httpok.length}
              valueStyle={{
                color: '#3f8600'
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='400 HTTP'
              value={httpfail.length}
              valueStyle={{
                color: '#cf1322'
              }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              loading={initLoading}
              title='Last audited'
              value={
                cookies.get('lastaudit')
                  ? cookies.get('lastaudit')
                  : 'Not auditted yet'
              }
              valueStyle={{
                color: token.colorText
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={18} style={{ paddingTop: 10 }}>
          {auditStart == true && 'Progress'}
          {auditStart == true && <Progress percent={progress} size='small' />}
        </Col>
        <Col span={6}>
          <Button
            icon={<PlaySquareOutlined />}
            block
            style={{
              marginTop: 16,
              background: token.colorText,
              color: '#fff'
            }}
            loading={auditStart}
            onClick={handleExecuteclick}
          >
            {auditStart == true ? 'Auditing' : 'Start audit'}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <List
            pagination={{
              onChange: (page) => {
                setstartpoint((page*3)-3)  //where 3 is the number of items in a page
               },
              pageSize: 3
            }}
            className='demo-loadmore-list'
            loading={initLoading}
            itemLayout='horizontal'
            dataSource={list}
            renderItem={(item, idex) => (
              <List.Item
                key={idex}
                actions={[
                  <Popconfirm
                    title='Delete the website'
                    description='Are you sure to delete this website?'
                    onConfirm={() => confirm(item.website_name)}
                    onCancel={cancel}
                    okText='Yes'
                    cancelText='No'
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      item.snapshot == '' ? (
                        <Skeleton.Avatar
                          active={false}
                          size={80}
                          shape='square'
                        />
                      ) : (
                        <img src={item.snapshot} width={80} height={80} />
                      )
                    }
                    title={
                      <a href={item.website_name}>
                        {item.website_name} |{' '}
                        {item.meta_title
                          ? item.meta_title
                          : 'Meta title unavailable'}{' '}
                      </a>
                    }
                    description={
                      item.meta_desc
                        ? item.meta_desc
                        : 'No meta description available'
                    }
                  />
                  {item.httpStatus == '' ? (
                    <Text level={5}>AUDIT UNAVAILABLE</Text>
                  ) : item.httpStatus == 'LOADING' ? (
                    <Spin indicator={antIcon} />
                  ) : (
                    <Title
                      level={5}
                      type={
                        item.httpStatus == '400 HTTP' ? 'danger' : 'success'
                      }
                    >
                      {item.httpStatus}
                    </Title>
                  )}
                  {/* <Spin indicator={antIcon} /> */}
                </Skeleton>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Layout>
  )
}

/* eslint-disable eqeqeq */
import {
  DeleteOutlined,
  PlusOutlined,
  WarningOutlined
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space
  // Typography
} from 'antd'
import React, { useEffect, useState } from 'react'
import { delapis } from '../../apis/deleteapi'
import { getApi } from '../../apis/getapi'
import { postapis } from '../../apis/postapi'

export default function AdminWebsite () {
  const [cat, setcat] = useState([])
  const [webs, setwebs] = useState([])
  const [secloading, setsecloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardTitle, setcardTitle] = useState()
  const [inpcat, setinpcat] = useState('')
  const [input, setInput] = useState('')
  const [inplink, setInplink] = useState('')
  const [inpusername, setInpusername] = useState('')
  const [inppass, setInppass] = useState('')
  const [inperr, setinperr] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = async () => {
    if (input == '' || inpcat == '' || inplink == '') {
      setinperr('error')
      setPlaceholder('Website data cannot be empty')
    } else {
      try {
        const d = await postapis('api/website/add-website', {
          name: input,
          category: inpcat,
          link: inplink,
          username: inpusername,
          password: inppass
        })
        if (d.err) {
          throw d.err
        }
        setwebs(r => [...r, d])
        setIsModalOpen(false)
      } catch (err) {
        alert(err)
      }
    }
  }
  const handleCancel = () => {
    setinperr('')
    setPlaceholder('')
    setInput('')
    setinpcat('')
    setInplink('')
    setIsModalOpen(false)
  }
  const handleinpcatChange = e => {
    setinpcat(e)
  }
  async function getWebsites (e) {
    try {
      const res = await postapis('api/website/get-website', {
        category: e
      })
      // console.log('TAB webs ', res)
      if (res.length > 0) {
        setsecloading(false)
        setwebs(res)
      } else {
        setsecloading(false)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])
  const gridStyle = {
    width: '33.33%',
    textAlign: 'center'
  }
  const handleChange = e => {
    setcardTitle(`${e.toUpperCase()} TOOLS`)
    setsecloading(true)
    setwebs([])
    getWebsites(e)
  }
  async function getCategory () {
    try {
      const res = await getApi('api/category/get-category')
      console.log('TAB CAT AD ', res)
      if (res.length > 0) {
        res.forEach(i => {
          setcat(prev => [
            ...prev,
            {
              label: i.cat_name[0].toUpperCase() + i.cat_name.substr(1),
              value: i.cat_name
            }
          ])
        })
      }
    } catch (err) {
      alert(err)
    }
  }
  async function handleDelete (e) {
    try {
      await delapis('api/website/del-website', { name: e })
      var d = webs.filter(i => i.website_name != e)
      setwebs(d)
      // console.log('TAB CAT AD ', res)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <Layout>
      <Row style={{ background: '#fff' }} type='flex'>
        <Col span={8}>
          <Select
            defaultValue='Select category'
            style={{ width: 220 }}
            onChange={handleChange}
            options={cat}
          />
        </Col>
        <Col span={3} offset={12}>
          <Button
            onClick={showModal}
            shape='round'
            style={{ float: 'right' }}
            size='middle'
            type='primary'
            icon={<PlusOutlined />}
          >
            New
          </Button>
        </Col>
      </Row>
      <Row style={{ background: '#fff', paddingTop: 20 }}>
        <Col span={24}>
          <Card title={cardTitle == '' ? 'ALL TOOLS WEBSITES' : cardTitle}>
            {secloading ? (
              <Skeleton active />
            ) : webs.length == 0 ? (
              <Empty />
            ) : (
              webs.map((i, idx) => {
                return (
                  <Card.Grid style={gridStyle} key={idx}>
                    <Space style={{ width: 250 }}>
                      <Avatar src={i.icon} /> {i.website_name}{' '}
                      <Popconfirm
                        title='Delete?'
                        description='Nashe me delete nahi krra na ?'
                        okText='Nahi Hosh me hu !'
                        cancelText='Thoda sa nasha hai'
                        // open={open}
                        onConfirm={() => handleDelete(i.website_name)}
                        // okButtonProps={{ loading: confirmLoading }}
                        onCancel={handleCancel}
                      >
                        <Button
                          danger
                          size='small'
                          type='primary'
                          shape='circle'
                          icon={<DeleteOutlined size={15} />}
                          style={{ marginLeft: 10 }}
                        />
                      </Popconfirm>
                    </Space>
                  </Card.Grid>
                )
              })
            )}
          </Card>
        </Col>
      </Row>
      <Modal
        title='Add Website'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          status={inperr}
          defaultValue='Select category'
          style={{ width: 220 }}
          onChange={handleinpcatChange}
          options={cat}
        />
        <Input
          value={input}
          prefix={inperr == 'error' ? <WarningOutlined /> : ''}
          placeholder={placeholder == '' ? 'Website name' : placeholder}
          style={{ marginTop: 10 }}
          onChange={e => setInput(e.target.value)}
          onPressEnter={handleOk}
          status={inperr}
        />
        <Input
          value={inplink}
          prefix={inperr == 'error' ? <WarningOutlined /> : ''}
          placeholder={placeholder == '' ? 'Website link' : placeholder}
          style={{ marginTop: 10 }}
          onChange={e => setInplink(e.target.value)}
          onPressEnter={handleOk}
          status={inperr}
        />
        <Input
          value={inpusername}
          prefix={inperr == 'error' ? <WarningOutlined /> : ''}
          placeholder={placeholder == '' ? 'Username' : placeholder}
          style={{ marginTop: 10 }}
          onChange={e => setInpusername(e.target.value)}
          onPressEnter={handleOk}
          status={inperr}
        />
        <Input
          value={inppass}
          prefix={inperr == 'error' ? <WarningOutlined /> : ''}
          placeholder={placeholder == '' ? 'Password' : placeholder}
          style={{ marginTop: 10 }}
          onChange={e => setInppass(e.target.value)}
          onPressEnter={handleOk}
          status={inperr}
        />
      </Modal>
    </Layout>
  )
}

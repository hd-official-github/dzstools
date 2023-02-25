/* eslint-disable eqeqeq */
import {
  DeleteOutlined,
  PlusOutlined,
  WarningOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  message,
  Popconfirm
} from 'antd'
import React, { useEffect, useState } from 'react'
import { delapis } from '../../apis/deleteapi'
import { getApi } from '../../apis/getapi'
import { postapis } from '../../apis/postapi'
export default function AdminCategory () {
  const [tabcat, setTabcat] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [input, setInput] = useState('')
  const [inperr, setinperr] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  const showModal = () => {
    setIsModalOpen(true)
  }
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Some error occured'
    })
  }
  const handleOk = async () => {
    if (input != '') {
      try {
        const d = await postapis('api/category/add-category', { name: input })
        setTabcat(r => [...r, d])
        // error()
      } catch (err) {
        error()
      }
      setIsModalOpen(false)
    } else {
      setinperr('error')
      setPlaceholder('Tool Category cannot be empty')
    }
    // setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  async function getCategory () {
    try {
      const res = await getApi('api/category/get-category')
      if (res.length > 0) {
        setTabcat(res)
      }
    } catch (err) {
      alert(err)
    }
  }
  async function handleDelete (e) {
    try {
      await delapis('api/category/del-category', { category: e })
      var d = tabcat.filter(i => i.cat_name != e)
      setTabcat(d)
      // console.log('TAB CAT AD ', res)
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getCategory()
  }, [])
  const gridStyle = {
    width: '25%',
    textAlign: 'center'
  }
  return (
    <Layout>
      {contextHolder}
      <Row style={{ background: '#fff' }} type='flex'>
        <Col span={8}>{/* <Title level={3}>All categories</Title> */}</Col>
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
          <Card title='All Tools'>
            {tabcat.map((i, idx) => {
              return (
                <Card.Grid style={gridStyle} key={idx}>
                  {i.cat_name[0].toUpperCase() + i.cat_name.substr(1)}
                  <Popconfirm
                    title='Delete?'
                    description='Nashe me delete nahi krra na ?'
                    okText='Nahi Hosh me hu !'
                    cancelText='Thoda sa nasha hai'
                    // open={open}
                    onConfirm={() => handleDelete(i.cat_name)}
                    // okButtonProps={{ loading: confirmLoading }}
                    onCancel={handleCancel}
                  >
                    <Button
                      danger
                      size='small'
                      type='primary'
                      shape='circle'
                      icon={<DeleteOutlined size={15}/>}
                      style={{ marginLeft: 10 }}
                    />
                  </Popconfirm>
                </Card.Grid>
              )
            })}
          </Card>
        </Col>
      </Row>
      <Modal
        title='Add Tool Category'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={input}
          prefix={inperr == 'error' ? <WarningOutlined /> : ''}
          placeholder={placeholder == '' ? 'Tool Category' : placeholder}
          style={{ marginTop: 10 }}
          onChange={e => setInput(e.target.value)}
          onPressEnter={handleOk}
          status={inperr}
        />
      </Modal>
    </Layout>
  )
}

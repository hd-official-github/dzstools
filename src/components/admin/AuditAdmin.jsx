import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Modal, Row, message, Upload, List, Alert } from 'antd'
import Title from 'antd/es/typography/Title'
import React, { useState } from 'react'
import Papa from 'papaparse'
import { postapis } from '../../apis/postapi'
export default function AuditAdmin () {
  const { Dragger } = Upload
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setfile] = useState()
  const [data, setData] = useState([])
  const showModal = () => {
    setIsModalOpen(true)
  }
  const csvtoarray = () => {
    // Parse local CSV file
    Papa.parse(file, {
      complete: function (results) {
        console.log('Finished:', results.data)
        let p = results.data
        p.pop()
        setData(p)
      }
    })
  }
  const handleOk = () => {
    csvtoarray()
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleSubmit =async () => {
    console.log('data ', data.flat(2))
    const r = await postapis('api/audit/add-website-array',{data:data.flat(2)})
    if(r.success){
      message.success(`Items added successfully.`)
      setData([])
      setfile([])
    }
  }
  const props = {
    name: 'file',
    multiple: false,
    onChange (info) {
      const { status } = info.file

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    beforeUpload: file => {
      setfile(file)
      return false
    },
    onDrop (e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
    onRemove (file) {
      console.log('rem ', file)
    }
  }
  return (
    <Layout>
      <Row style={{ background: '#fff', paddingBottom: 10 }} type='flex'>
        <Col span={8}>
          <Title level={4}>Import Websites for audit</Title>
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
      <Alert message="Adding new websites will make previously audited data to be removed" type="warning" showIcon  />
      <Row>
        <List
          style={{ width: '100%', background: '#fff', paddingBottom: 20 }}
          size='small'
          //   header={<div>Header</div>}
          //   footer={<div>Footer</div>}
          bordered
          dataSource={data}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
        {data.length > 0 && (
          <Button block type='primary' onClick={handleSubmit}>
            Upload
          </Button>
        )}
      </Row>
      <Modal
        title='Basic Modal'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            Click or drag file to this area to upload
          </p>
          <p className='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Modal>
    </Layout>
  )
}

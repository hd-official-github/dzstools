/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { SearchOutlined } from '@ant-design/icons'
import { Input, Radio, Row, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { getApi } from '../apis/getapi'
import AlltoolsContainer from '../components/AlltoolsContainer'
import SkeletonContainer from '../components/SkeletonContainer'
import styles from '../style.module.css'
export default function Homev2 () {
  const [cat, setcat] = useState('')
  const [inp, setinp] = useState('')
  const [alltools, setalltools] = useState([])
  const [toolfiltered, settoolfiltered] = useState([])
  const [tabcat, setTabcat] = useState([])
  const onChange = e => {
    console.log(e)
    setcat(e.target.value)
    const v = alltools.filter(p => p.categoryId == e.target.value)
    if (v.length > 0) {
      settoolfiltered(v)
    } else {
      settoolfiltered('empty')
    }
  }

  async function getAllCategory () {
    try {
      const res = await getApi('api/category/get-category')
      //   console.log('TAB CAT ', res)
      if (res.length > 0) {
        setTabcat(res)
      }
    } catch (err) {
      alert(err)
    }
  }
  async function getAllTools () {
    try {
      const res = await getApi('api/website/all-website')
      //   console.log('TAB DATA ', res)
      console.log('RS ', res)
      if (res.length > 0) {
        console.log('RS ', res)
        setalltools(res)
      } else {
      }
    } catch (err) {}
  }
  useEffect(() => {
    if (!tabcat.length) getAllCategory()
    if (!alltools.length) getAllTools()
    return () => {}
  }, [])

  return (
    <div className={styles.container}>
      <Input
        autoFocus
        size='large'
        value={inp}
        onChange={e => {
          if (inp == '') {
            settoolfiltered([])
            setcat('')
          }
          var r = alltools.filter(p =>
            p.website_name.toLowerCase().includes(e.target.value)
          )
          if (!r.length) {
            r = alltools.filter(p =>
              p.link.toLowerCase().includes(e.target.value)
            )
          }
          settoolfiltered(r)
          setinp(e.target.value)
        }}
        placeholder='Search for tools'
        prefix={<SearchOutlined style={{ marginRight: 20 }} />}
        style={{ marginTop: 20 }}
      />
      <Space
        style={{
          paddingTop: 20,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        direction='horizontal'
        align='center'
      >
        <Radio.Group
          disabled={alltools.length == 0}
          defaultValue={cat}
          buttonStyle='solid'
          value={cat}
          onChange={onChange}
          style={{
            marginBottom: 16,
            alignItems: 'center'
          }}
        >
          {tabcat.map((i, idx) => {
            return (
              <Radio.Button key={idx} value={i.cat_name} style={{ margin: 4 }}>
                {i.cat_name[0].toUpperCase() + i.cat_name.substr(1)} Tools
              </Radio.Button>
            )
          })}
        </Radio.Group>
      </Space>
      <Space>
        <Row gutter={[8, 8]}>
          {alltools.length == 0 && <SkeletonContainer />}
          {toolfiltered.length > 0 || toolfiltered == 'empty' ? (
            <AlltoolsContainer alltools={toolfiltered} />
          ) : (
            <AlltoolsContainer alltools={alltools} />
          )}
        </Row>
      </Space>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Button, Input, Layout, message, Spin, Typography } from 'antd'
import styles from '../style.module.css'
import { FontSizeOutlined, SearchOutlined } from '@ant-design/icons'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { postapis } from '../apis/postapi'

const { Sider, Content } = Layout
export default function ContentTools () {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [firstSearchCache, setfirstSearchCache] = useState('')
  const [currpageindex, setcurrpageindex] = useState()
  const [loading, setloading] = useState(false)
  useEffect(() => {
    return () => {}
  }, [editorState, firstSearchCache])

  const [keyword, setkeyword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [nextlink, setnextlink] = useState([])
  const [linkscache, setlinkscache] = useState([])

  const insertinString = (strsearch, text) => {
    var m = text.split(strsearch)
    return (
      m[0] +
      '<b>' +
      strsearch +
      '</b>' +
      m[1] +
      '<br/><br/><br/><br/><br/><br/>'
    )
  }
  const setContentstate = fullTexthtml => {
    // console.log('constate ', fullTexthtml.length)
    const contentBlocks = convertFromHTML(fullTexthtml)
    const contentState = ContentState.createFromBlockArray(
      contentBlocks.contentBlocks,
      contentBlocks.entityMap
    )
    setEditorState(EditorState.createWithContent(contentState))
  }
  const texttohtml = async data => {
    var fullTexthtml = ''
    await data.forEach(i => {
      fullTexthtml = fullTexthtml + insertinString(searchTerm, i)
    })
    return fullTexthtml
  }
  const updateContent = async data => {
    var fullTexthtml = await texttohtml(data)
    if (firstSearchCache === '') setfirstSearchCache(fullTexthtml)
    // else setpagesSearchCache(fullTexthtml)
    setContentstate(fullTexthtml)
  }
  const handleStateChange = e => {
    console.log(e)
    setEditorState(e)
  }

  const handleClickSearch = async () => {
    if (firstSearchCache === '') {
      setloading(true)
      const r = await postapis('api/content/get-content-result', {
        keyword: keyword,
        search_term: searchTerm
      })
      if (r.msg !== '') {
        message.error(r.msg)
      }
      if (r.nextlink !== '')
        if (nextlink.length === 0) setnextlink(e => [...e, r.nextlink])

      updateContent(r.result)
      setloading(false)
    } else {
      // console.log('esle reach ', firstSearchCache)
      setContentstate(firstSearchCache)
      setloading(false)
    }
  }
  const handlePageSearch = async (i, idx) => {
    if (linkscache.length >= idx + 1) {
      console.log('cache called  ', linkscache.length, idx + 1)
      setContentstate(linkscache[idx])
    } else {
      setloading(true)
      console.log('else called  ', linkscache.length, idx + 1)
      const r = await postapis('api/content/search-with-url', {
        keyword: keyword,
        search_term: searchTerm,
        url: i
      })
      if (r.msg !== '') {
        message.error(r.msg)
      }
      if (r.nextlink !== '')
        if (idx + 1 == nextlink.length) {
          setnextlink(e => [...e, r.nextlink])
        }
      updateContent(r.result)
      var tth = await texttohtml(r.result)
      setlinkscache(e => [...e, tth])
      setloading(false)
    }
  }
  const handleClearResults = () => {
    setlinkscache([])
    setnextlink([])
    setcurrpageindex()
    setSearchTerm('')
    setkeyword('')
    setloading(false)
    setfirstSearchCache('')
    setEditorState(EditorState.createEmpty())
  }
  return (
    <div className={styles.container}>
      <Layout style={{ backgroundColor: '#fff' }}>
        <Sider
          width={300}
          style={{
            background: '#fff',
            padding: 10
          }}
        >
          <div style={{ marginBottom: 30 }}>
            <Typography.Text strong>Keyword</Typography.Text>
            <Input
              value={keyword}
              onChange={e => setkeyword(e.target.value)}
              placeholder='Mumbai escorts'
              prefix={<FontSizeOutlined style={{ paddingRight: 10 }} />}
              autoFocus
              size='large'
              style={{ marginTop: 5 }}
            />
          </div>

          <Typography.Text strong>Search term</Typography.Text>
          <Input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='"Looking for"'
            prefix={<SearchOutlined style={{ paddingRight: 10 }} />}
            size='large'
            style={{ marginTop: 5 }}
          />
          <Button
            type='primary'
            block
            style={{ marginTop: 20 }}
            onClick={handleClickSearch}
          >
            Search
          </Button>
          {firstSearchCache != '' && (
            <Button style={{ marginTop: 20 }} onClick={handleClearResults}>
              Clear results
            </Button>
          )}

          {nextlink.length > 0 &&
            nextlink.map((i, idx) => {
              return (
                <Button
                  key={idx}
                  type={currpageindex == idx ? 'primary' : 'link'}
                  block
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    setcurrpageindex(idx)
                    handlePageSearch(i, idx)
                  }}
                >
                  Go to Page - {idx + 2}
                </Button>
              )
            })}
        </Sider>
        <Content>
          {loading == true ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'cener',
                padding: 30
              }}
            >
              <Spin />
            </div>
          ) : (
            <Editor
              editorState={editorState}
              toolbarClassName='toolbarClassName'
              wrapperClassName='wrapperClassName'
              editorClassName='editorClassName'
              onEditorStateChange={handleStateChange}
            />
          )}
        </Content>
      </Layout>
    </div>
  )
}

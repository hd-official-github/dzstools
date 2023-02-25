import { Space, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { getApi } from '../apis/getapi'
import ItemContainer from '../components/ItemContainer'
import styles from '../style.module.css'
export default function Home () {
  // const tabs = ['Photos', 'Videos', 'Email', 'SEO']
  const [tabcat, setTabcat] = useState([])
  async function getAllCategory () {
    try {
      const res = await getApi('api/category/get-category')
      console.log('TAB CAT ', res)
      if (res.length > 0) {
        setTabcat(res)
      }
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    getAllCategory()
    return () => {}
  }, [])

  return (
    <div className={styles.container}>
      <Space style={{ marginTop: 20 }}>
        <Tabs

          tabPosition={'left'}
          items={tabcat.map((r, i) => {
            // console.log(r);
            const id = r.cat_name[0].toUpperCase() + r.cat_name.substring(1)
            return {
              label: `${id} Tools `,
              key: id,
              children: <ItemContainer tabName={id} tabcat={r.cat_name} />
            }
          })}
        />
      </Space>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { Select } from 'antd';
import request from '@/utils/request'

const { Option } = Select;
export default function SelectUser() {
  const [list, serList] = useState([])
  useEffect(() => {
    request.get('/admin/authorizations/me/terraces').then(res => {
      if (res.data.length) {
        serList(res.data)
      }
    })
  }, [])

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    localStorage.setItem('terrace_id',value)
  }

  return (
    <div>
      {
        list.length ? <Select style={{ width: 100 }} defaultValue={1} onChange={handleChange}>
          {
            list.map(item => {
              // <Option value={item.id}>{item.terrace_name}</Option>
              return <Option value={item.id}>{item.terrace_name}</Option>
            })
          }
        </Select> : null
      }

    </div>
  )
}

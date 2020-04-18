import React, { useState, useEffect } from 'react'
import { Select } from 'antd';
import request from '@/utils/request'
import { history } from 'umi'
const { Option } = Select;
export default function SelectUser() {
  const [list, serList] = useState([])
  const [terrace_id, setTerraceId] = useState(1)
  useEffect(() => {
    request.get('/admin/authorizations/me/terraces').then(res => {
      if (res.data.length) {
        serList(res.data)
        let terrace_id = localStorage.getItem('terrace_id')
        if(!terrace_id){
          localStorage.setItem('terrace_id','1')
          setTerraceId(1)
        }else {
          setTerraceId(Number(terrace_id))
        }
      }
    })
  }, [])

  const handleChange = (value) => {
    localStorage.setItem('terrace_id',value)
    location.href = location.href
  }

  return (
    <div>
      {
        list.length ? <Select style={{ width: 100 }} value={terrace_id} onChange={handleChange}>
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

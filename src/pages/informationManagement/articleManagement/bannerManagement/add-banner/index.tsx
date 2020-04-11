import React, { Component } from 'react'
import { Breadcrumb, Select } from 'antd';

import styles from './index.less'

const { Option } = Select;
export default class AddBanner extends Component {
  state = {
    banner_type: 1
  }

  handleChange = (value) => {
    console.log(`selected ${value}`);
    this.setState({banner_type: value})
  }

  render() {
    const { banner_type } = this.state
    return (
      <div className={styles.add_banner_page}>
        <Breadcrumb className={styles.bread_box}>
          <Breadcrumb.Item>资讯管理</Breadcrumb.Item>
          <Breadcrumb.Item>文章管理</Breadcrumb.Item>
          <Breadcrumb.Item>banner管理</Breadcrumb.Item>
          <Breadcrumb.Item>添加banner</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.main_box}>
          {/* 选择banner类型 */}
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>请选择banner类型</div>
            <div className={styles.layout_right}>
            <Select value={banner_type} style={{ width: 120 }} onChange={this.handleChange}>
              <Option value={1}>图片</Option>
              <Option value={2}>文章</Option>
            </Select>
            </div>
          </div>
          {/* 选择banner位置 */}
          <div className={styles.layout_box}>
            <div className={styles.layout_label}>请选择banner位置</div>
            <div className={styles.layout_right}>
            <Select value={banner_type} style={{ width: 120 }} onChange={this.handleChange}>
              <Option value={1}>图片</Option>
              <Option value={2}>文章</Option>
            </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

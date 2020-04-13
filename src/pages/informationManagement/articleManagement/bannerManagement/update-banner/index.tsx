import React, { Component } from 'react'
import {
  Breadcrumb, Select, Form, Radio,
  Table, Input, InputNumber, Popconfirm
} from 'antd';
import UploadBox from "@/components/uploadBox"
import { connect } from 'dva'
import styles from './index.less'

const { Option } = Select;

interface Props {
  dispatch: (data: any) => void,
  choose_type: Number,
  choose_location: Number,
  allowed_show: Number,
  upload_type: Number,
  allowed_click: Number
}

export default connect((setAddBanner: any) => (setAddBanner.setAddBanner))(class UpdateBanner extends Component<Props> {
  state = {
    banner_type: 0,
    imgUrl: '',
    value: 1,
    data: [],//表格组件
    pagination: {},//表格组件
    loading: false,
    operation_index: 0,
    currentPage: 1,
    currentPageSize: 5,
  }


  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  getUploadImage = (data) => {
    console.log(data, '得到上传图片的数据')
  }

  // 成功的回调
  onFinish = () => {

  }

  //失败回调中校验 
  onFinishFailed = () => {

  }

  // checked 选中状态
  onChangeChecked = (data: string, e: any) => {
    this.dispatchAddProps('setAddBanner/setAddProps', {
      [data]: e.target.value
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(
      pagination, 'pagination', filters, 'filters', sorter,
      'sorter'
    )
  };


  recordOperation_index = (e: any) => {
    this.setState({ operation_index: e.target.value })
  }

  // 设置bannar类型 和 位置
  setBannarType = (data: any, bannar_type: string) => {
    this.dispatchAddProps('setAddBanner/setAddProps', {
      [data]: bannar_type
    })
  }

  // 处理 dva 赋值
  dispatchAddProps = (type: string, payload: Object) => {
    this.props.dispatch({
      type,
      payload
    })
  }

  changePageSize = (dd1, ddd2, cd3, dd4) => {
    // dd1返回这个
    // current: 3 //你点击的页数
    // pageSize: 5 这个是一页多少条么。。。。
    // defaultPageSize: 5
    // showSizeChanger: true
    // showQuickJumper: false
    // total: 111 总数
    console.log(dd1, ddd2, cd3, dd4, 'ioiooi')
  }


  // 编辑页面 依靠后台传值来觉得是显示图片， 还是文章 
  // 今日没完成点击分页触发，对接接口，如果有旧数据， 分页表格上面怎么显示出来
  render() {
    const {
      currentPage,
      currentPageSize,
    } = this.state
    const meta = [
      {
        key: '1',
        number: 1,
        title: '第一标题',
        author: '麒麟作者',
        image: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=620351645,3109707469&fm=26&gp=0.jpg',
        type: '已上架',
        time: "2020-02-18 05：37：15",
        read_number: '80',
        belong_to: '创客 新手上路',
        operation: 1
      },
      {
        key: '2',
        number: '1',
        title: '第一标题',
        author: '麒麟作者',
        image: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=620351645,3109707469&fm=26&gp=0.jpg',
        type: '已上架',
        time: "2020-02-18 05：37：15",
        read_number: '80',
        belong_to: '创客 新手上路',
        operation: 2
      }
    ];
    const columns = [
      {
        title: '编号',
        dataIndex: 'number',
        width: '8%',
        align: 'center'
      },
      {
        title: '文章标题',
        dataIndex: 'title',
        width: '20%',
        align: 'center'
      },
      {
        title: '发布作者',
        dataIndex: 'author',
        width: '10%',
        align: 'center'
      },
      {
        title: '标题图片',
        dataIndex: 'image',
        width: '10%',
        align: 'center',
        render: value => <img style={{
          width: '100%'
        }} src={value} alt="" />

      },
      {
        title: '发布状态',
        dataIndex: 'type',
        width: '8%',
        align: 'center'
      },
      {
        title: '发布时间',
        dataIndex: 'time',
        width: '15%',
        align: 'center'
      },
      {
        title: '阅读量',
        dataIndex: 'read_number',
        width: '7%',
        align: 'center'
      },
      {
        title: '所属分类',
        dataIndex: 'belong_to',
        width: '15%',
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        align: 'center',
        render: (item: any) => <Radio.Group onChange={this.recordOperation_index} value={this.state.operation_index} >
          <Radio value={item} />
        </Radio.Group>
      }
    ];
    const { banner_type } = this.state
    const {
      choose_type,
      choose_location,
      allowed_show,
      upload_type,
      allowed_click
    } = this.props
    return (
      <div className={styles.add_banner_page}>
        <Breadcrumb className={styles.bread_box}>
          <Breadcrumb.Item onClick={() => {
            console.log(this.props, 'props')
          }}>资讯管理</Breadcrumb.Item>
          <Breadcrumb.Item>文章管理</Breadcrumb.Item>
          <Breadcrumb.Item>banner管理</Breadcrumb.Item>
          <Breadcrumb.Item>添加banner</Breadcrumb.Item>
        </Breadcrumb>

        <Form
          layout="horizontal"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}               //提交表单证成功
          onFinishFailed={this.onFinishFailed}    //提交表单验证失败
        >
          < Form.Item
            label="请选择banner类型"
            name="choose_type"
          >
            文章
          </Form.Item>
          < Form.Item
            label="请选择banner位置"
            name="choose_location"
          >
          （创客）资讯中心
          </Form.Item>
          < Form.Item
            label="是否直接显示"
            name="upload-Image"
          >
            <Radio.Group
              onChange={this.onChangeChecked.bind(this, 'allowed_show')}
              value={allowed_show}
              style={{ paddingLeft: '15px' }}
            >
              <Radio value={0}>是</Radio>
              <Radio value={1}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {
            choose_type == 1 ? <Form.Item /* banner类型为图片 */
              label="上传bannar图片"
              name="upload-Image"
              className={styles.flex_start}
            >
              <UploadBox
                onChange={this.getUploadImage}
                imgUrl={this.state.imgUrl}
              />
            </Form.Item> : null
          }
          {
            choose_type == 2 ? <Form.Item
              label="上传bannar图片"
              name="upload-Image"
              style={{ margin: '10px 0px' }}
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'upload_type')}
                value={upload_type}
                style={{ margin: '5px 0' }}>
                <Radio value={1}>自定义图片</Radio>
                <Radio value={2}>使用文章封面图</Radio>
              </Radio.Group>
              <UploadBox
                onChange={this.getUploadImage}
                imgUrl={this.state.imgUrl}
              />
            </Form.Item> : null
          }
          {
            choose_type == 1 ? <Form.Item
              label="是否可点击"
              name="checked"
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'upload_type')}
                value={allowed_click}>
                <Radio value={1}>否</Radio>
                <Radio value={2}>是</Radio>
              </Radio.Group>
            </Form.Item> : null
          }
          {
            choose_type == 2 ? <Form.Item
              label="选择文章"
              name="choose"
              className={styles.chooseText}
            >
              <Table
                rowClassName="editable-row"
                position='topCenter'
                size="small"
                columns={columns}
                dataSource={meta}
                bordered
                scroll={{ x: 1200, y: 400 }}
                pagination={{
                  current: currentPage,
                  defaultPageSize: currentPageSize,
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total: 111,
                  showTotal: () => `共${111}条`
                }}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                onShowSizeChange={this.changePageSize}
              />
            </Form.Item> : null
          }

        </Form>

      </div>
    )
  }
})

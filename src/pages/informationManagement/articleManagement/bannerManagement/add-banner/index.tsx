import React, { Component } from 'react'
import {
  Breadcrumb, Select, Form, Radio,
  Table, Input, InputNumber, Popconfirm,
  Button,
  message
} from 'antd';
import UploadBox from "@/components/uploadBox"
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva'
import { history } from 'umi';
import {
  getListArticles, // 获取文章列表
  getTerraceRole,  // 获取所有角色
  getAddBanner     // 添加banner
} from "../servers"

import styles from './index.less'
const { Option } = Select;
interface Props {
  dispatch: (data: any) => void,
  choose_type: string,
  choose_location: string,
  allowed_show: number,
  upload_type: number,
  allowed_click: number,
  pagination: any,
  upload_image: string,
  chooseTextId: string,
  outside_chain: string,
  text_image: string,
  text_image_type: string | number,
  form: any,
  rank_order: number
}

export default connect((setAddBanner: any) => (setAddBanner.setAddBanner))(class AddBanner extends Component<Props> {
  state = {
    banner_type: 0,
    imgUrl: '',
    value: 1,
    data: [],//表格组件
    pagination: {},//表格组件
    loading: false,
    operation_index: 0,
    currentPage: 1,
    currentPageSize: 2,

    terraceRole: [],//选择位置（角色）
    ListArticles: [],//文章数组

    tailLayout: {
      wrapperCol: { offset: 0, span: 16 },
    },

    total: 100
  }

  // 获取文章列表配置参数
  componentDidMount = async () => {
    // await getListArticles({
    //   terrace_id: 1,
    //   page: 1
    // })
    //   .then(res => {
    //     this.dispatchAddProps('setAddBanner/setAddProps', {
    //       ['pagination']: {
    //         current: 1,       //当前页码
    //         pageSize: 5,      //每页条数
    //         total: res.data.length,//条数总和
    //       }
    //     })
    //   })
    //获取文章列表数据
    // await this.getArticleList()
    getTerraceRole({// 获取所有角色
      terrace_id: 1,
      is_category: 0
    })
      .then(res => {
        this.setState({
          terraceRole: res.data,
          total: res.data.length / this.props.pagination.pageSize
        })
      })

  }

  // 获取文章列表数据
  getArticleList = () => {
    const { pagination, choose_location } = this.props

    getListArticles({
      terrace_role_id: choose_location,
      terrace_id: 1,
      page: pagination.current,
      per_page: pagination.pageSize
    })
      .then(res => {
        this.dispatchAddProps('setAddBanner/setAddProps', {
          ['pagination']: {
            current: 1,       //当前页码
            pageSize: 5,      //每页条数
            total: res.data.length,//条数总和
          }
        })
        this.setState({
          ListArticles: res.data.map((item: any, _: number) => {
            return {
              key: item.id,
              title: item.article_title,          //标题
              author: item.article_author,
              image: item.author_cover,           //标题图片
              type: item.is_show,                 //是否已上架
              time: item.created_at,              //发布时间
              read_number: item.read_num,         //阅读量
              belong_to: item.data_category.map((value: any, index: number) => { //分类名称
                return value.category.category_name
              })
              ,
              belong_id: item.id,
              operation: _ + 1
            }
          })
        })
      })

  }


  // 上传图片 返回图片地址
  getUploadImage = (type: string, url: string) => {
    this.dispatchAddProps('setAddBanner/setAddProps', {
      [type]: url
    })
  }

  //  选中状态 --> 是否直接显示   上传bannar图片   是否可点击
  onChangeChecked = (data: string, e: any) => {
    if(data == 'text_image_type'){
      if(e.target.value == 2){
        this.dispatchAddProps('setAddBanner/setAddProps', {
          is_use_article_cover: 1
        })
      }else {
        this.dispatchAddProps('setAddBanner/setAddProps', {
          is_use_article_cover: 0
        })
      }
    }
    this.dispatchAddProps('setAddBanner/setAddProps', {
      [data]: e.target.value
    })
  }

  // 设置bannar类型 和 位置
  setBannarType = (data: any, bannar_type: string) => {
    const {choose_type, choose_location} = this.props
    if (data == 'choose_location' && choose_type == 2) {
      this.getArticleList()
    }else if(data == 'choose_type' && choose_location){
      this.getArticleList()
    }
    if(data == 'choose_type' && bannar_type == 1){
      this.dispatchAddProps('setAddBanner/setAddProps', {
        is_use_article_cover: 0
      })
    }
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


  // 点击表格 分页
  handleTableChange = async (pagination_props: any) => {
    const { pagination } = this.props
    await this.dispatchAddProps('setAddBanner/setAddProps', {
      ['pagination']: {
        ...pagination_props,
        total: pagination.total
      }
    })
    await this.getArticleList()
    // dd1返回这个
    // current: 3 //点击的页数
    // pageSize: 5 一页多少条
    // defaultPageSize: 5  一页多少条数据
    // showSizeChanger: true
    // showQuickJumper: false
    // total: 111 总数
  };

  // 选择文章
  recordOperation_index = (item: Number, e: any) => {
    console.log(item, e)
    this.dispatchAddProps('setAddBanner/setAddProps', {
      chooseTextId: item.belong_id,
    })
  }

  changePageSize = (dd1, ddd2, cd3, dd4) => {
    console.log(dd1, ddd2, cd3, dd4, 'ioiooi')
  }



  // 点击提交表单 成功的回调
  onFinish = () => {
    const {
      choose_type,// banner类型:1图片2文章
      upload_image,// 图片地址
      allowed_click,//是否可点击 1否 2是
      chooseTextId, //文章id
      allowed_show, //是否直接显示
      choose_location,//平台角色id
      upload_type,//上传bannar图片类型 是自定义还是使用文章封面图
      outside_chain,
      text_image, // 上传bannar图片地址
      text_image_type,// 上传bannar图片类型
      rank_order, // 排序
      is_use_article_cover // 是否使用封面图
    } = this.props
    var imageProps;

    if (!choose_type) return message.error('banner类型不能为空');
    if (!choose_location) return message.error('banner位置不能为空');
    switch (Number(choose_type)) {
      case 1://图片
        if (upload_type != 1 && !upload_image) return message.error('图片不能为空');
        if (allowed_click == 2 && !outside_chain) return message.error('外链不能为空');
        imageProps =
          upload_type == 1 || !upload_image ? undefined : upload_image
        break;
      case 2://文章
        if (text_image_type == 1 && !text_image) return message.error('图片不能为空');
        if (!chooseTextId) return message.error('请选择文章');
        imageProps =
          text_image_type == 2 || !text_image ? undefined : text_image
        break;
    }
    getAddBanner({
      terrace_id: 1,
      banner_type: choose_type,      // banner类型:1图片2文章
      terrace_role_id: choose_location,  // 平台角色id
      article_id: Number(choose_type) == 2 && chooseTextId ? chooseTextId : undefined,       // 文章id(banner_type为1时传0)
      banner_cover: imageProps,     // 封面图  upload_type为1的时候 不传参数
      external_url: allowed_click == 2 ? outside_chain : undefined,    // 需要跳转的url
      is_show: allowed_show,          // 是否显示：1显示0隐藏
      rank_order,        // 排序  默认0
      is_use_article_cover
    })
      .then(res => {
        if (res.status_code) {
          message.error(res.message);
        } else {
          message.success(res.message);
          this.dispatchAddProps('setAddBanner/clearAddProps', {})
          history.goBack()
        }

        // window.history.back();
      })

  }
  // 取消提交
  cancelSubmit = async () => {
    this.dispatchAddProps('setAddBanner/clearAddProps', {})
    history.goBack()
  }

  // 输入框赋值
  getInput = (e: any) => {
    this.dispatchAddProps('setAddBanner/setAddProps', { outside_chain: e.target.value.trim() })
  }

  sortInput = (e: any) => {
    this.dispatchAddProps('setAddBanner/setAddProps', { rank_order: e.target.value })
  }


  render() {
    const {
      choose_type,
      choose_location,
      allowed_show,
      upload_type,
      allowed_click,
      pagination,
      outside_chain,
      chooseTextId,
      upload_image,
      text_image_type,
      text_image,
      rank_order
    } = this.props
    const {
      currentPage,
      currentPageSize,
      terraceRole,
      ListArticles,
      tailLayout,
      total
    } = this.state
    const columnss = [
      {
        title: '编号',
        dataIndex: 'key',
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
          width: '100%',
          height: 'auto'
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
        align: 'center',
        render: (item: any) => <div>
          {
            item.map(res => {
              return <div key={res}>{res}</div>
            })
          }
        </div>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        align: 'center',
        render: (item: any, res: any) => <Radio.Group onChange={this.recordOperation_index.bind(this, res)} value={chooseTextId} >
          <Radio value={res.belong_id} />
        </Radio.Group>
      }
    ];
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
          onFinish={this.onFinish}               //验证成功
        >
          < Form.Item
            label="请选择banner类型"
            name="choose_type"
          >
            <Select
              defaultValue={choose_type ? choose_type : "请选择banner类型"}
              style={{ width: 300 }}
              onChange={this.setBannarType.bind(this, 'choose_type')}
              value={choose_type}
              placeholder={'请选择banner类型'}
            >
              <Option value={1}>图片</Option>
              <Option value={2}>文章</Option>
            </Select>

          </Form.Item>
          < Form.Item
            label="请选择所属角色"
            name="choose_location"
          >
            <Select
              defaultValue={choose_location ? choose_location : '请选择所属角色'}
              value={choose_location}
              // placeholder={'请选择banner位置'}
              style={{ width: 300 }}
              onChange={this.setBannarType.bind(this, 'choose_location')}
            >
              {
                terraceRole.map((value: any, _: number) => {
                  return <Option value={value.id} key={_}>{value.role_name}</Option>
                })
              }
            </Select>
          </Form.Item>
          < Form.Item
            label="排序"
            name="rank_order"
          >
            <Input value={rank_order} onChange={this.sortInput} style={{width: 100}} type='number'/>
          </Form.Item>
          < Form.Item
            label="是否直接显示"
            name="allowed_show"
          >
            <Radio.Group
              defaultValue={allowed_show}
              onChange={this.onChangeChecked.bind(this, 'allowed_show')}
              value={allowed_show}
              style={{ paddingLeft: '15px' }}
            >
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </Form.Item>

          {
            Number(choose_type) == 1 ? <Form.Item
              label="上传bannar图片"
              name="upload-Image"
              className={styles.flex_start}
            >
              <UploadBox
                onChange={this.getUploadImage.bind(this, 'upload_image')}
                imgUrl={upload_image}
              />
            </Form.Item> : null
          }
          {
            Number(choose_type) == 2 ? <Form.Item
              label="上传bannar图片"
              name="text_image_type"
              style={{ margin: '10px 0px' }}
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'text_image_type')}
                value={text_image_type}
                style={{ margin: '5px 0' }}>
                <Radio value={1}>自定义图片</Radio>
                <Radio value={2}>使用文章封面图</Radio>
              </Radio.Group>
              {
                text_image_type == 2 ? null : <UploadBox
                  onChange={this.getUploadImage.bind(this, 'text_image')}
                  imgUrl={text_image}
                />
              }
            </Form.Item> : null
          }
          {
            Number(choose_type) == 1 ? <Form.Item
              label="是否可点击"
              name="checked"
            >
              <Radio.Group
                defaultValue={allowed_click}
                onChange={this.onChangeChecked.bind(this, 'allowed_click')}
                value={allowed_click}>
                <Radio value={1}>否</Radio>
                <Radio value={2}>是</Radio>
              </Radio.Group>
            </Form.Item> : null
          }
          {
            Number(choose_type) == 1 && allowed_click == 2 ? <Form.Item
              label="添加外链接"
              name="input"
            >
              <Input
                onChange={this.getInput}
                value={outside_chain.trim()}
                defaultValue={outside_chain.trim()}
              />
            </Form.Item> : null
          }
          {
            Number(choose_type) == 2 ? <Form.Item
              label="选择文章"
              name="choose"
              className={styles.chooseText}
            >
              <Table
                rowClassName="editable-row"
                position='topCenter'
                size="small"
                columns={columnss}
                dataSource={ListArticles}
                bordered
                scroll={{ x: 1200, y: 400 }}
                pagination={{
                  current: pagination.current,
                  defaultPageSize: pagination.pageSize,
                  showSizeChanger: true,
                  showQuickJumper: false,
                  total: pagination.total,
                  showTotal: () => `共${pagination.total}条`
                }}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                onShowSizeChange={this.changePageSize}
              />
            </Form.Item> : null
          }


          <Form.Item {...tailLayout} className={styles.submit_box}>
            {
              console.log(pagination.total / pagination.pageSize, 'Number(pagination.total) / Number(pagination.pageSiz)')
            }
            <Button htmlType="submit" type="primary">
              确认添加
            </Button>
            <Button htmlType="button" style={{ margin: '0 38px' }} onClick={this.cancelSubmit}>
              取消
            </Button>
          </Form.Item>
        </Form>

      </div>
    )
  }
})

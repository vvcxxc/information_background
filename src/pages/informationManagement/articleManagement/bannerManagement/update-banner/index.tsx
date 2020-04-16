import React, { Component } from 'react'
import {
  Breadcrumb, Select, Form, Radio,
  Table, Input, Button, notification
} from 'antd';
import UploadBox from "@/components/uploadBox"
import { connect } from 'dva'
import styles from './index.less'
import { history } from 'umi'

import { getBannerInfo, getListArticles, putBannerInfo } from '../servers'
const { Option } = Select;


export default class UpdateBanner extends Component {
  state = {
    id: 0,
    terrace_id: 0,
    terrace_role_id: 0,
    imgUrl: '',// 上传bannar图片地址
    value: 1,
    data: [],//表格组件
    pagination: { current: 1, pageSize: 5 },//表格组件
    loading: false,
    operation_index: 0,
    currentPage: 1,
    currentPageSize: 5,

    rank_order: 0,//排序
    terraceRole: [],//选择位置（角色）
    ListArticles: [],//文章数组
    external_url: '',//外链
    banner_type: 1,// banner类型:1图片2文章
    choose_location: 0,
    is_show: 0,//是否直接显示
    allowed_click: 0,//可点击跳转外链
    text_image_type: 1,//文章图0上传新图1默认封面
    article_id: 0,//选中的文章id
    total: 0,
    article_title: '',
    role_name:'',
    flag: false
  }

  componentDidMount() {

    getBannerInfo({ id: this.props.location.query.id }).then(res => {
      this.setState({
        id: res.data.id,
        terrace_id: res.data.terrace_id,
        terrace_role_id: res.data.terrace_role_id,
        is_show: res.data.is_show,//可显示
        banner_type: res.data.banner_type,//1图片2文章,
        imgUrl: res.data.banner_cover,
        article_id: res.data.article_id,
        rank_order: res.data.rank_order,
        allowed_click: res.data.external_url ? 1 : 0,//可跳转
        external_url: res.data.external_url,//外链
        text_image_type: res.data.is_use_article_cover,
        article_title: res.data.article && res.data.article.article_title ? res.data.article.article_title : '',
        role_name:res.data.terrace_role && res.data.terrace_role.role_name ? res.data.terrace_role.role_name : '',
        flag: true // 判断用
      }, () => {
        res.data.banner_type == 2 && this.getArticleList(res.data.terrace_role_id,res.data.article_id)
      })
    })
  }
  // 获取文章列表数据
  getArticleList = (terrace_role_id: any,articles_id: any) => {
    const { pagination } = this.state
    getListArticles({
      terrace_id: this.state.terrace_id,
      page: pagination.current,
      per_page: pagination.pageSize,
      terrace_role_id,
      articles_id
    })
      .then(res => {
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
          }),
          total: res.meta.pagination.total
        })
      })

  }
  // checked 选中状态
  onChangeChecked = (type: string, e: any) => {
    if (type == 'allowed-show') {
      this.setState({ is_show: e.target.value })
    }
    else if (type == 'allowed-click') {
      this.setState({ allowed_click: e.target.value })
    } else if (type == 'upload-banner') {
      this.setState({ text_image_type: e.target.value })
    }
  }
  //上传封面图
  getUploadImage = (type: string, url: string) => {
    //两种封面图归为一个字段好了
    this.setState({ imgUrl: url })
  }
  // 点击表格 分页
  handleTableChange = async (pagination_props: any) => {
    console.log('handleTableChange', pagination_props)
    this.setState({ pagination: pagination_props, total: pagination_props.total }, () => {
      this.getArticleList(this.state.terrace_role_id,this.state.article_id);
    })
  };
  // 外链
  getInput = (e: any) => {
    this.setState({ external_url: e.target.value.trim() })
  }
  // 成功的回调
  onFinish = () => {
    let { id, terrace_id, terrace_role_id, banner_type, imgUrl, external_url, allowed_click, is_show, rank_order, article_id, text_image_type } = this.state;
    putBannerInfo({
      id,
      terrace_id,
      terrace_role_id,
      banner_type,
      banner_cover: text_image_type == 0 ? imgUrl : undefined,
      article_id,
      external_url: allowed_click ? external_url : '',
      is_show,
      rank_order,
      is_use_article_cover: text_image_type,
    }).then(res => {
      if (res.code == 200) {
        notification.open({
          message: '编辑成功',
          description: res.message,
        });
        setTimeout(() => {
          history.push({ "pathname": '/informationManagement/articleManagement/bannerManagement/bannerList' })
        }, 1500)
      } else {
        notification.open({
          message: '编辑失败',
          description: res.message,
        });
      }
    })
  }

  //失败回调中校验
  onFinishFailed = (err: any) => {
    notification.open({
      message: '编辑失败',
      description: err,
    });
  }

  // 选择文章
  recordOperation_index = (item: any, e: any) => {
    this.setState({ article_id: item.belong_id })
  }

  changePageSize = (dd1, ddd2, cd3, dd4) => {
    console.log(dd1, ddd2, cd3, dd4, 'ioiooi')
  }
  sortInput = (e: any) => {
    this.setState({ rank_order: e.target.value })
  }

  render() {
    const {
      text_image_type
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
        render: (value: any) => <img style={{
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
            item.map((res: any) => {
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
        render: (item: any, res: any) => <Radio.Group onChange={this.recordOperation_index.bind(this, res)} value={this.state.article_id} >
          <Radio value={res.belong_id} />
        </Radio.Group>
      }
    ];
    const {
      banner_type,
      external_url,
      is_show,
      allowed_click,
      ListArticles,
      pagination,
      flag
    } = this.state
    return (
      <div className={styles.add_banner_page}>
        <Breadcrumb className={styles.bread_box}>
          <Breadcrumb.Item >资讯管理</Breadcrumb.Item>
          <Breadcrumb.Item>文章管理</Breadcrumb.Item>
          <Breadcrumb.Item>banner管理</Breadcrumb.Item>
          <Breadcrumb.Item>编辑banner</Breadcrumb.Item>
        </Breadcrumb>

        <Form
          layout="horizontal"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}               //提交表单证成功
          onFinishFailed={this.onFinishFailed}    //提交表单验证失败
        >
          < Form.Item
            label="banner类型"
            name="choose_type"
          >
            {
              this.state.banner_type == 1 ? '图片' : '文章'
            }
          </Form.Item>
          < Form.Item
            label="所属角色"
            name="choose_location"
          >
            {this.state.role_name}
          </Form.Item>
          < Form.Item
            label="排序"
            name="rank_order"
          >
            {
              flag ? <Input defaultValue={this.state.rank_order} onChange={this.sortInput} style={{ width: 100 }} type='number' /> : null
            }

          </Form.Item>
          {
            flag ? < Form.Item
              label="是否直接显示"
              name="allowedShow"
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'allowed-show')}
                defaultValue={is_show}
                style={{ paddingLeft: '15px' }}
              >
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item> : null
          }
          {
            banner_type == 1 ? <Form.Item /* banner类型为图片 */
              label="上传bannar图片"
              name="upload-Image"
              className={styles.flex_start}
            >
              <UploadBox
                onChange={this.getUploadImage.bind(this, 'upload_image')}
                imgUrl={this.state.imgUrl}
              />
            </Form.Item> : null
          }
          {
            flag && banner_type == 1 ? <Form.Item
              label="是否可点击"
              name="allowed-click"
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'allowed-click')}
                defaultValue={allowed_click}
              >
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            </Form.Item> : null
          }
          {
            banner_type == 1 && allowed_click == 1 ? <Form.Item
              label="添加外链接"
              name="input"
            >
              <Input
                onChange={this.getInput}
                value={external_url.trim()}
                defaultValue={external_url.trim()}
              />
            </Form.Item> : null
          }
          {
            banner_type == 2 ? <Form.Item
              label="上传bannar图片"
              name="choose_type2"
              style={{ margin: '10px 0px' }}
            >
              <Radio.Group
                onChange={this.onChangeChecked.bind(this, 'upload-banner')}
                defaultValue={text_image_type}
                style={{ margin: '5px 0' }}>
                <Radio value={0}>自定义图片</Radio>
                <Radio value={1}>使用文章封面图</Radio>
              </Radio.Group>
              {
                text_image_type == 1 ? null : <UploadBox
                  onChange={this.getUploadImage.bind(this, 'upload-banner')}
                  imgUrl={this.state.imgUrl}
                />
              }
            </Form.Item> : null
          }
          {
            banner_type == 2 ? <Form.Item
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
                  total: this.state.total,
                  showTotal: () => `共${this.state.total}条`
                }}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                onShowSizeChange={this.changePageSize}
              />
            </Form.Item> : null
          }

          <Form.Item className={styles.submit_box}>
            <Button htmlType="submit" type="primary">
              确认修改
            </Button>
            <Button htmlType="button" style={{ margin: '0 38px' }} onClick={() => { window.history.back(); }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

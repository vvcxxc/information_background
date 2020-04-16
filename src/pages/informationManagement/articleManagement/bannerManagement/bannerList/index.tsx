import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Tabs, Divider, Modal, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, getAllRole, deleteBanner } from './http';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { history } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  bannerList: any;
}

export default Form.create()(
  connect(({ bannerList }: any) => ({ bannerList }))(
    class BannerList extends Component<Props> {
      state = {
        // CKLoading: false,
        // CKTotal: 0,

        // HZLoading: false,
        // HZTotal: 0,

        loading: false,
        total: 0,
        dataList: [],
        allRoleList: [],

        descVisible: false,
        linkVisible: false,
        linkUrl: "",
      };

      componentDidMount() {
        const {
          contentTitle,
          publishStatus,
          bannerType,
          classifyCategory,
          currentPage,
          currentPageSize,
        } = this.props.bannerList;
        this.requestListData(contentTitle, publishStatus, bannerType, classifyCategory, currentPage, currentPageSize);

        this.requestAllRole();
      }

      requestListData = async (article_title: any, is_show: any, banner_type: any, terrace_role_id: any, page: any, per_page: any) => {
        await this.setState({
          loading: true
        })
        getListData(article_title, is_show, banner_type, terrace_role_id, page, per_page).then((res: any) => {
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.meta.pagination.total
          })
        })
      }

      requestAllRole = () => {
        getAllRole().then((res: any) => {
          this.setState({
            allRoleList: res.data
          })
        })
      }

      /**
       * 查询
       */
      handleSearch = async () => {
        const contentTitle = this.props.form.getFieldValue('contentTitle');
        const publishStatus = this.props.form.getFieldValue('publishStatus');
        const bannerType = this.props.form.getFieldValue('bannerType');
        const classifyCategory = this.props.form.getFieldValue('classifyCategory');
        await this.props.dispatch({
          type: 'bannerList/setFussyForm',
          payload: {
            contentTitle,
            publishStatus,
            bannerType,
            classifyCategory,
          },
        });

        const { currentPage, currentPageSize } = this.props.bannerList;
        this.requestListData(contentTitle, publishStatus, bannerType, classifyCategory, currentPage, currentPageSize);
      };

      /**
       * 重置
       */
      handleFormReset = async () => {
        const { form } = this.props;
        const { dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'bannerList/resetFussySearch',
        });
      };

      /**
       * 切换Tab
       */
      // handleChangeTab = async (key) => {
      //   const { dispatch } = this.props;
      //   await dispatch({
      //     type: 'bannerList/setTabSelected',
      //     payload: {
      //       tabKey: key,
      //     },
      //   });
      // };

      /**
       * 创客表格改变
       */
      // handleChangeCKTable = async () => { };

      /**
       * 会长表格改变
       */
      // handleChangeHZTable = async () => { };

      /**
       * 表格改变
       */
      handleChange = async (pagination: any) => {
        await this.props.dispatch({
          type: 'bannerList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });

        const {
          contentTitle,
          publishStatus,
          bannerType,
          classifyCategory,
          currentPage,
          currentPageSize,
        } = this.props.bannerList;
        this.requestListData(contentTitle, publishStatus, bannerType, classifyCategory, currentPage, currentPageSize);
      }


      handleDeleteItem = (record: any) => {
        let _this = this;
        confirm({
          title: '确认操作',
          icon: <ExclamationCircleOutlined />,
          content: '您确认删除该文章吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            deleteBanner(record.id).then((res: any) => {
              if (res.code == 200) {
                message.success(res.message);
                const {
                  contentTitle,
                  publishStatus,
                  bannerType,
                  classifyCategory,
                  currentPage,
                  currentPageSize,
                } = _this.props.bannerList;
                _this.requestListData(contentTitle, publishStatus, bannerType, classifyCategory, currentPage, currentPageSize);
              }
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      handleDetailItem = (record: any) => {
        console.log(record);
        if (record.banner_type == 1) {
          if (record.external_url == "") {
            this.setState({
              descVisible: true
            })
          } else if (record.external_url != "") {
            this.setState({
              linkVisible: true,
              linkUrl: record.external_url
            })
          }
        } else {
          history.push('/informationManagement/articleManagement/previewArticle?id=' + record.article_id);
        }
      }

      handleEditItem = (record: any) => {
        history.push('/informationManagement/articleManagement/bannerManagement/update-banner?id=' + record.id);
      }

      goto = () => {
        history.push('/informationManagement/articleManagement/bannerManagement/add-banner')
      }

      render() {
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '图片',
            dataIndex: 'banner_cover',
            key: 'banner_cover',
            render: (text: any, record: any) => (
              <img className={styles.img_cover} src={record.banner_cover} alt="" />
            )
          },
          {
            title: '内容',
            dataIndex: 'article_title',
            key: 'article_title',
            render: (text: any, record: any) => (
              <span>{record.article.article_title}</span>
            )
          },
          {
            title: '类型',
            dataIndex: 'banner_type',
            key: ' banner_type',
            render: (text: any, record: any) => (
              <span>{record.banner_type == 1 ? "图片" : "文章"}</span>
            )
          },
          {
            title: '添加时间',
            dataIndex: 'created_at',
            key: 'created_at',
          },
          {
            title: '是否点击',
            dataIndex: 'external_url',
            key: 'external_url',
            render: (text: any, record: any) => (
              <span>{record.external_url == "" ? "否" : "是"}</span>
            )
          },
          {
            title: '展示状态',
            dataIndex: 'is_show',
            key: 'is_show',
            render: (text: any, record: any) => (
              <span>{record.is_show == 1 ? "是" : "否"}</span>
            )
          },
          {
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={this.handleDetailItem.bind(this, record)}>查看</a>
                <Divider type="vertical" />
                <a onClick={this.handleEditItem.bind(this, record)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={this.handleDeleteItem.bind(this, record)}>删除</a>
              </span>
            ),
          },
        ];

        const {
          form: { getFieldDecorator },
        } = this.props;
        const {
          contentTitle,
          publishStatus,
          bannerType,
          classifyCategory,
          currentPage,
          currentPageSize
          // CKCurrentPage,
          // CKCurrentPageSize,
          // HZCurrentPage,
          // HZCurrentPageSize,
          // tabKey,
        } = this.props.bannerList;
        // const { CKLoading, CKTotal, HZLoading, HZTotal } = this.state;
        const { loading, total, allRoleList, dataList } = this.state;
        return (
          <div className={styles.banner_list}>
            <Form>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={6} sm={24}>
                  <FormItem label="内容标题">
                    {getFieldDecorator('contentTitle', { initialValue: contentTitle })(
                      <Input placeholder="请输入内容标题" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="发布状态">
                    {getFieldDecorator('publishStatus', { initialValue: publishStatus })(
                      <Select
                        placeholder="请选择banner状态"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="1">是</Option>
                        <Option value="0">否</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}>
                <Col md={6} sm={24}>
                  <FormItem label="选择类型">
                    {getFieldDecorator('bannerType', { initialValue: bannerType })(
                      <Select
                        placeholder="请选择banner类型"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="0">文章</Option>
                        <Option value="1">图片</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="所属角色">
                    {getFieldDecorator('classifyCategory', { initialValue: classifyCategory })(
                      <Select
                        placeholder="请选择所属角色"
                        style={{
                          width: '100%',
                        }}
                      >
                        {
                          allRoleList.map((item: any) => (
                            <option value={item.id}>{item.role_name}</option>
                          ))
                        }
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <span>
                    <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                      查询
                    </Button>
                    <Button
                      style={{
                        marginLeft: 8,
                      }}
                      onClick={this.handleFormReset}
                    >
                      重置
                    </Button>
                    <Button type="primary" style={{ marginLeft: 20 }} onClick={this.goto}>
                      添加banner
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>

            <Table
              columns={columns}
              dataSource={dataList}
              loading={loading}
              onChange={this.handleChange}
              pagination={{
                current: currentPage,
                defaultPageSize: currentPageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                total,
                showTotal: () => {
                  return `共${total}条`;
                },
              }}
            />

            {/* <Tabs defaultActiveKey={tabKey} onChange={this.handleChangeTab}>
              <TabPane tab="创客（精品文章）" key="1">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={CKLoading}
                  onChange={this.handleChangeCKTable}
                  pagination={{
                    current: CKCurrentPage,
                    defaultPageSize: CKCurrentPageSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: () => {
                      return `共${CKTotal}条`;
                    },
                  }}
                />
              </TabPane>
              <TabPane tab="会长（精品文章）" key="2">
                <Table
                  columns={columns}
                  dataSource={data}
                  loading={HZLoading}
                  onChange={this.handleChangeHZTable}
                  pagination={{
                    current: HZCurrentPage,
                    defaultPageSize: HZCurrentPageSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: () => {
                      return `共${HZTotal}条`;
                    },
                  }}
                />
              </TabPane>
            </Tabs> */}

            <Modal
              title="温馨提示"
              visible={this.state.descVisible}
              closable={false}
              onCancel={() => { this.setState({ descVisible: false }) }}
              onOk={() => { this.setState({ descVisible: false }) }}
            >
              <p style={{ textAlign: "center" }}>内容为空</p>
            </Modal>

            <Modal
              title="温馨提示"
              visible={this.state.linkVisible}
              closable={false}
              cancelText="关闭并复制"
              okText="关闭"
              onCancel={() => { 
                this.setState({ 
                  linkVisible: false 
                })
                let ele = document.getElementById('linkUrl');
                ele.select();
                document.execCommand("copy"); 
                message.success('复制成功');
              }}
              onOk={() => { this.setState({ linkVisible: false }) }}
            >
              <Input id="linkUrl" value={this.state.linkUrl} readOnly/>
            </Modal>
          </div>
        );
      }
    },
  ),
);

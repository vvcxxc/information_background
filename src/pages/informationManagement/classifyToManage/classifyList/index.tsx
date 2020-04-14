import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Tabs, Divider } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, getAllRole } from './http';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  classifyList: any;
}

export default Form.create()(
  connect(({ classifyList }: any) => ({ classifyList }))(
    class ClassifyList extends Component<Props> {
      state = {
        // CKLoading: false,
        // CKTotal: 0,

        // HZLoading: false,
        // HZTotal: 0,

        loading: false,
        total: 0,
        dataList: [],
        allRoleList: [],
      };

      componentDidMount() {
        const {
          classifyTitle,
          typeStatus,
          classifyCategory,
          currentPage,
          currentPageSize,
        } = this.props.classifyList;
        this.requestListData(classifyTitle, typeStatus, classifyCategory, currentPage, currentPageSize);

        this.requestAllRole()
      }

      requestListData = async (category_name: any, is_show: any, terrace_role_id: any, page: any, per_page: any) => {
        await this.setState({
          loading: true
        })
        getListData(category_name, is_show, terrace_role_id, page, per_page).then((res: any) => {
          console.log('res', res)
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
        const classifyTitle = this.props.form.getFieldValue('classifyTitle');
        const typeStatus = this.props.form.getFieldValue('typeStatus');
        const classifyCategory = this.props.form.getFieldValue('classifyCategory');
        await this.props.dispatch({
          type: 'classifyList/setFussyForm',
          payload: {
            classifyTitle,
            typeStatus,
            classifyCategory,
          },
        });

        // console.log(this.props);

        const { currentPage, currentPageSize } = this.props.classifyList;
        this.requestListData(classifyTitle, typeStatus, classifyCategory, currentPage, currentPageSize);
      };

      /**
       * 重置
       */
      handleFormReset = async () => {
        const { form } = this.props;
        const { dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'classifyList/resetFussySearch',
        });
      };

      /**
       * 切换Tab
       */
      // handleChangeTab = async (key) => {
      //   const { dispatch } = this.props;
      //   await dispatch({
      //     type: 'classifyList/setTabSelected',
      //     payload: {
      //       tabKey: key,
      //     },
      //   });
      // };

      /**
       * 创客表格改变
       */
      // handleChangeCKTable = async () => {};

      /**
       * 会长表格改变
       */
      // handleChangeHZTable = async () => {};

      /**
       * 表格改变
       */
      handleChange = async (pagination: any) => {
        await this.props.dispatch({
          type: 'classifyList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });

        const { currentPage, currentPageSize } = this.props.classifyList;
        const classifyTitle = this.props.form.getFieldValue('classifyTitle');
        const typeStatus = this.props.form.getFieldValue('typeStatus');
        const classifyCategory = this.props.form.getFieldValue('classifyCategory');
        this.requestListData(classifyTitle, typeStatus, classifyCategory, currentPage, currentPageSize);
      };

      render() {
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '分类名称',
            dataIndex: 'category_name',
            key: 'category_name',
          },
          {
            title: '所属角色',
            dataIndex: 'terrace_role_id',
            key: 'terrace_role_id',
          },
          {
            title: '分类状态',
            dataIndex: 'is_show',
            key: 'is_show',
            render: (text: any, record: any) => (
              <span>
                {
                  record.is_show == 0 ? "已下架" : "已上架"
                }
              </span>
            )
          },
          {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
              <span>
                <a>查看</a>
                <Divider type="vertical" />
                <a>
                  {record.is_show == 0 ? "上架" : "下架"}
                </a>
                <Divider type="vertical" />
                <a>编辑</a>
                <Divider type="vertical" />
                <a>删除</a>
              </span>
            ),
          },
        ];

        const {
          form: { getFieldDecorator },
        } = this.props;

        const {
          classifyTitle,
          typeStatus,
          classifyCategory,
          currentPage,
          currentPageSize
          // CKCurrentPage,
          // CKCurrentPageSize,
          // HZCurrentPage,
          // HZCurrentPageSize,
          // tabKey,
        } = this.props.classifyList;

        // const { CKLoading, CKTotal, HZLoading, HZTotal } = this.state;
        const { loading, dataList, total, allRoleList } = this.state;
        return (
          <div>
            <Form>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={6} sm={24}>
                  <FormItem label="分类标题">
                    {getFieldDecorator('classifyTitle', { initialValue: classifyTitle })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="类型状态">
                    {getFieldDecorator('typeStatus', { initialValue: typeStatus })(
                      <Select
                        placeholder="请选择文章发布状态"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="1">已上架</Option>
                        <Option value="0">已下架</Option>
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
          </div>
        );
      }
    },
  ),
);

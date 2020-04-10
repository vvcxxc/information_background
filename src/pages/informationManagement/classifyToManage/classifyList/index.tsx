import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Tabs } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';

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
        CKLoading: false,
        CKTotal: 0,

        HZLoading: false,
        HZTotal: 0,
      };

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

        console.log(this.props);

        // const { currentPage, currentPageSize } = this.props.articleList;
        // this.getListData(classifyTitle, typeStatus, classifyCategory,currentPage, currentPageSize);
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
      handleChangeTab = async (key) => {
        const { dispatch } = this.props;
        await dispatch({
          type: 'classifyList/setTabSelected',
          payload: {
            tabKey: key,
          },
        });
      };

      /**
       * 创客表格改变
       */
      handleChangeCKTable = async () => {};

      /**
       * 会长表格改变
       */
      handleChangeHZTable = async () => {};

      render() {
        const columns = [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <span>
                <a style={{ marginRight: 16 }}>Invite {record.name}</a>
                <a>Delete</a>
              </span>
            ),
          },
        ];

        const data = [
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
          },
          {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
          },
        ];
        const {
          form: { getFieldDecorator },
        } = this.props;

        const {
          classifyTitle,
          typeStatus,
          classifyCategory,
          CKCurrentPage,
          CKCurrentPageSize,
          HZCurrentPage,
          HZCurrentPageSize,
          tabKey,
        } = this.props.classifyList;

        const { CKLoading, CKTotal, HZLoading, HZTotal } = this.state;
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
                        <Option value="0">已上架</Option>
                        <Option value="1">已下架</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="所属分类">
                    {getFieldDecorator('classifyCategory', { initialValue: classifyCategory })(
                      <Select
                        placeholder="请选择所属分类"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="0">创客</Option>
                        <Option value="1">会长</Option>
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

            <Tabs defaultActiveKey={tabKey} onChange={this.handleChangeTab}>
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
            </Tabs>
          </div>
        );
      }
    },
  ),
);

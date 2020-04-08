import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  articleList: any;
}

export default Form.create()(
  connect(({ articleList }: any) => ({ articleList }))(
    class ArticleList extends Component<Props> {
      state = {
        loading: false,
        total: 0,
      };

      componentDidMount() {}

      /**
       * 查询
       */
      handleSearch = async () => {
        const articleTitle = this.props.form.getFieldValue('articleTitle');
        const publishAuthor = this.props.form.getFieldValue('publishAuthor');
        const publishStatus = this.props.form.getFieldValue('publishStatus');
        const articleCategory = this.props.form.getFieldValue('articleCategory');
        await this.props.dispatch({
          type: 'articleList/setFussyForm',
          payload: {
            articleTitle,
            publishAuthor,
            publishStatus,
            articleCategory,
          },
        });

        // const { currentPage, currentPageSize } = this.props.articleList;
        // this.getListData(articleTitle, publishAuthor, publishStatus, articleCategory,currentPage, currentPageSize);
      };

      /**
       * 重置
       */
      handleFormReset = async () => {
        const { form } = this.props;
        const { dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'articleList/resetFussySearch',
        });
      };

      /**
       * 表格改变
       */
      handleChange = async () => {};

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
          articleTitle,
          publishAuthor,
          publishStatus,
          articleCategory,
          currentPage,
          currentPageSize,
        } = this.props.articleList;

        const { loading, total } = this.state;
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
                <Col md={8} sm={24}>
                  <FormItem label="文章标题">
                    {getFieldDecorator('articleTitle', { initialValue: articleTitle })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="发布作者">
                    {getFieldDecorator('publishAuthor', { initialValue: publishAuthor })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={8} sm={24}>
                  <FormItem label="发布状态">
                    {getFieldDecorator('publishStatus', { initialValue: publishStatus })(
                      <Select
                        placeholder="请选择文章发布状态"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="0">已发布</Option>
                        <Option value="1">未发布</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="所属分类">
                    {getFieldDecorator('articleCategory', { initialValue: articleCategory })(
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
                <Col md={8} sm={24}>
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
              dataSource={data}
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
          </div>
        );
      }
    },
  ),
);

import React, { Component } from 'react';
import { Table, Row, Col, Input, Button } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

const FormItem = Form.Item;

class RoleList extends Component {
  state = {
    roleName: '',
    loading: false,
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
    total: 0,
  };

  /**
   * 获取角色名称
   */
  handleChangeRoleName = (e) => {
    this.setState({
      roleName: e.target.value,
    });
  };

  /**
   * 搜索
   */
  handleSearch = () => {};

  /**
   * 重置
   */
  handleFormReset = () => {
    this.setState({
      roleName: '',
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
    const { roleName, loading, currentPage, currentPageSize, total } = this.state;
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
              <FormItem label="角色名称">
                <Input placeholder="请输入" value={roleName} onChange={this.handleChangeRoleName} />
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
}

export default RoleList;

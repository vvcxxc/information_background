import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Modal, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { getListData, getAllRole, editRole } from './http';
import { PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  form: any;
}

export default Form.create()(
  class RoleList extends Component<Props> {
    state = {
      roleName: undefined,
      loading: false,
      currentPage: 1, // 当前页
      currentPageSize: 10, // 每页数量
      total: 0,
      dataList: [],
      allRoleList: [], // 所有角色列表

      addModalVisible: false,
      addRoleName: "",


      editModalVisible: false,
      editRoleName: "",
      terrace_role_id: ""
    };


    componentDidMount() {
      const {
        roleName,
        currentPage,
        currentPageSize
      } = this.state;
      this.requestListData(roleName, currentPage, currentPageSize);

      this.requestAllRole();
    }


    requestListData = async (role_name: any, page: any, per_page: any) => {
      await this.setState({
        loading: true
      })
      getListData(role_name, page, per_page).then((res: any) => {
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
     * 获取角色名称
     */
    // handleChangeRoleName = (e) => {
    //   this.setState({
    //     roleName: e.target.value,
    //   });
    // };
    handleSelect = (e) => {
      this.setState({
        roleName: e
      })
    }

    /**
     * 搜索
     */
    handleSearch = () => {
      const {
        roleName,
        currentPage,
        currentPageSize
      } = this.state;
      this.requestListData(roleName, currentPage, currentPageSize);
    };

    /**
     * 重置
     */
    handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
      this.setState({
        roleName: undefined,
      });
    };

    /**
     * 表格改变
     */
    handleChange = async () => {
      const { currentPage, currentPageSize, roleName } = this.state;
      this.requestListData(roleName, currentPage, currentPageSize)
    };

    // handleAddModalOK = async () => {

    // }

    // handleAddModalCancel = () => {
    //   this.setState({
    //     addModalVisible: false,
    //     addRoleName: ""
    //   })
    // }

    // handleChangeAddRoleName = (e) => {
    //   this.setState({
    //     addRoleName: e.target.value
    //   })
    // }

    handleEditItem = (record: any) => {
      let terrace_role_id;
      const { allRoleList } = this.state;
      allRoleList.forEach((item: any) => {
        if (item.role_name == record.role_name) {
          terrace_role_id = item.id;
        }
      })
      this.setState({
        editModalVisible: true,
        editRoleName: record.role_name,
        terrace_role_id
      })
    }

    handleEditModalOK = () => {
      const { editRoleName, terrace_role_id } = this.state;
      editRole(terrace_role_id, editRoleName).then(async (res: any) => {
        if (res.code == 200) {
          message.success(res.message);
          await this.setState({
            editModalVisible: false
          })
          const {
            roleName,
            currentPage,
            currentPageSize
          } = this.state;
          this.requestListData(roleName, currentPage, currentPageSize);
        }
      })
    }

    handleEditModalCancel = () => {
      this.setState({
        editModalVisible: false,
        editRoleName: ""
      })
    }

    handleChangeEditRoleName = (e) => {
      this.setState({
        editRoleName: e.target.value
      })
    }

    render() {
      const columns = [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '角色名称',
          dataIndex: 'role_name',
          key: 'role_name',
        },
        {
          title: '操作',
          key: 'action',
          render: (text: any, record: any) => (
            <span>
              <a onClick={this.handleEditItem.bind(this, record)}>编辑</a>
            </span>
          ),
        },
      ];
      const {
        form: { getFieldDecorator },
      } = this.props;
      const { roleName, loading, currentPage, currentPageSize, total, dataList, allRoleList, addRoleName, editRoleName } = this.state;
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
                  {/* <Input placeholder="请输入" value={roleName} onChange={this.handleChangeRoleName} /> */}
                  {getFieldDecorator('articleTitle', { initialValue: roleName })(
                    <Select
                      placeholder="请选择角色名称"
                      style={{
                        width: '100%',
                      }}
                      onChange={this.handleSelect}
                    >
                      {
                        allRoleList.map((item: any) => (
                          <option value={item.role_name}>{item.role_name}</option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={15} sm={24}>
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
              {/* <Col md={3} sm={24}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => this.setState({ addModalVisible: true })}>添加角色</Button>
              </Col> */}
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

          {/* <Modal
            title="添加角色"
            visible={this.state.addModalVisible}
            onOk={this.handleAddModalOK}
            onCancel={this.handleAddModalCancel}
          >
            <p>
              <Input placeholder="请输入角色名称" value={addRoleName} onChange={this.handleChangeAddRoleName} />
            </p>
          </Modal> */}

          <Modal
            title="修改角色名称"
            visible={this.state.editModalVisible}
            onOk={this.handleEditModalOK}
            onCancel={this.handleEditModalCancel}
          >
            <p>
              <Input placeholder="请输入角色名称" value={editRoleName} onChange={this.handleChangeEditRoleName} />
            </p>
          </Modal>
        </div>
      );
    }
  })

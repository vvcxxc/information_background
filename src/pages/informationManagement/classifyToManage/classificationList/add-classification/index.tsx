import React, { Component } from 'react'
import { Form, Input, Button, Menu, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  getAllRoles,
  addClasasification
} from '@/pages/informationManagement/classifyToManage/servers'
import { connect } from 'dva'
import style from './index.less'

interface Porps {
  dispatch: (_: any) => null,
  addPage: any,
  classificationList: any
}

export default connect(({ classificationList }: any) => ({ classificationList }))(
  class AddClassification extends Component<Porps>{
    state = {
      typeData: [],
      tailLayout: {
        wrapperCol: { offset: 0, span: 16 },
      },
      input_value: ''
    }

    async componentDidMount() {
     await getAllRoles({
        terrace_id: 1,//平台id 
        is_category: 0
      }).then((res) => {
        this.setState({ typeData:res.data })
      })
    }


    // 输入框赋值
    getInput = (e: any) => {
      this.dispatchAddProps('classificationList/setAddProps', { category_name: e.target.value.trim() })
    }

    // 选择角色
    handleMenuClick = (data: any) => {
      this.dispatchAddProps('classificationList/setAddProps',{ terrace_role_id: data.id })
      this.dispatchAddProps('classificationList/setAddData',{ showType: data.role_name })
    }

    // 标题的校验规则
    validationRules = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback('标题不能为空')
        return
      }
      if (!value.trim()) {
        callback('标题不能为空')
        return
      }
      if (value.trim().length > 6) {
        callback('不可多于6个字')
        return
      }
      callback()
    }

    // 成功的回调
    onFinish = () => {
      const { addProps } = this.props.classificationList.addPage
      if (!addProps.terrace_role_id) {
        message.error('所属角色不能为空');
        return
      }

      addClasasification(addProps)
        .then(res => {
          this.dispatchAddProps('classificationList/clearAddData',{})
          message.error(message);
        }).catch(() => {
          console.log('catch')
        })
    }

    //失败回调中校验 
    onFinishFailed = () => {

    }

    // 取消提交
    cancelSubmit = async() => {
      await this.dispatchAddProps('classificationList/clearAddData', {})
      await window.history.back(-1); 
    }

    // 处理 dva 赋值
    dispatchAddProps = (type:string,payload:Object) => {
      this.props.dispatch({
        type,
        payload
      })
    }

    render() {
      const { typeData, tailLayout } = this.state
      const { showType, addProps } = this.props.classificationList.addPage
      const menu = (
        <Menu>
          {
            typeData.map((item:any,_) => {
              return <Menu.Item
                key={_}
                onClick={this.handleMenuClick.bind(this,item)}>
                {item.role_name}
              </Menu.Item>
            })
          }
        </Menu>
      );
      return (
        <div className={style.add_classification}>
          <main className={style.add_content}>
            <Form
              layout="horizontal"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}               //提交表单证成功
              onFinishFailed={this.onFinishFailed}    //提交表单验证失败
            >
              <Form.Item
                label="分类标题"
                name="分类标题"
                rules={[
                  { required: true, validator: this.validationRules.bind(this)}
                ]}
              >
                <Input
                  onChange={this.getInput}
                  value={addProps.category_name.trim()}
                  defaultValue={addProps.category_name.trim()}
                  placeholder="不可多于6个字"
                />
              </Form.Item>
              <Form.Item
                label="所属角色"
              >
                <Dropdown overlay={menu}>
                  <Button className={style.chooseRole}>
                    {showType}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Form.Item>

              <Form.Item {...tailLayout} className={style.submit_box}>
                <Button htmlType="submit" type="primary">
                  确认添加
            </Button>
                <Button htmlType="button" style={{ margin: '0 38px' }} onClick={this.cancelSubmit}>
                  取消
            </Button>
              </Form.Item>
            </Form>
          </main>
        </div>
      )
    }
  })
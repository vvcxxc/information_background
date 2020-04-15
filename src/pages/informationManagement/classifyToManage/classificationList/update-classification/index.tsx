import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import {
  detailsClasasification,
  updateClasasification
} from '@/pages/informationManagement/classifyToManage/servers'
import style from './index.less'

interface Porps {
  dispatch: (_: any) => null,
  addPage: any,
  classificationList: any
}

export default class UpdateClassification extends Component<Porps>{
    state = {
      typeData: [],
      tailLayout: {
        wrapperCol: { offset: 0, span: 16 },
      },
      input_value: '',
      listData: {
        category_name: '',
        terrace_id: '',
        terrace_role_id: '',
        is_show: '',
        rank_order:'',
        terrace_role: {
          role_name: ''
        }
      }
    }

    componentDidMount () {
      let id = this.props.location.query.id
      detailsClasasification(id)
        .then(res => {
          this.setState({ input_value: res.data.category_name ,listData: res.data })
        })
    }


    // 输入框赋值
  getInput = (e: any) => {
      this.setState({ input_value: e.target.value.trim()})
    }
// 排序
sortInput = (e: any) => {
  let listData = this.state.listData
  listData.rank_order =  e.target.value
  this.setState({ listData})
}
    // 标题的校验规则
  validationRules = (rule: any, value: any, callback: any) => {
    const { input_value} = this.state
    if (!input_value) {
        callback('标题不能为空')
        return
      }
    if (!input_value.trim()) {
        callback('标题不能为空')
        return
      }
    if (input_value.trim().length > 6) {
        callback('不可多于6个字')
        return
      }
      callback()
    }

    // 成功的回调
  onFinish = () => {
    const { listData,input_value } = this.state
    updateClasasification(
      this.props.location.query.id,
      {
      terrace_id: listData.terrace_id,//平台id
      category_name: input_value,
      is_show: listData.is_show,
      rank_order: listData.rank_order
      })
        .then(res => {
          message.success(res.message);
          history.back()
        }).catch((res) => {
          console.log('catch')
        })
    }

    //失败回调中校验
    onFinishFailed = () => {

    }

    // 取消提交
    cancelSubmit = async () => {
      await window.history.back(-1);
    }


    render() {
      const { tailLayout, listData } = this.state
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
                name="name"
                rules={[
                  { required: true, validator: this.validationRules.bind(this) }
                ]}
              >
                <Input
                  value={this.state.input_value}
                  defaultValue={this.state.input_value}
                  onChange={this.getInput}
                />
                {null}
              </Form.Item>
              <Form.Item
                label="排序"
                name="排序"
              >
                <Input
                  value={this.state.listData.rank_order}
                  type='number'
                  defaultValue={this.state.listData.rank_order}
                  onChange={this.sortInput}
                />
                {null}
              </Form.Item>
              <Form.Item label="所属角色">
                {listData.terrace_role.role_name}
              </Form.Item>
              <Form.Item {...tailLayout} className={style.submit_box}>
                <Button htmlType="submit" type="primary">
                  确认修改
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
  }

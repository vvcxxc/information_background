import { Model } from 'dva';
const model: Model = {
  namespace: 'setAddBanner',
  state: {
    choose_type: '',             //选择bannar类型
    choose_location: '',        //选择bannar位置
    allowed_show: 0,     //是否允许直接显示
    upload_type:'',       //上传图片类型
    upload_image: '',     //上传图片地址
    chooseText: '',       //选择文章
    allowed_click: 1,     //是否可以点击
    chooseTextId: '',//文章id
    text_image: '',  //文章类型图片
    text_image_type:1,       //上传图片类型
    pagination: {
      current: 1,//当前位于第几页
      pageSize: 5,//一页多少条数据
      total:100,
    },        //记录表格配置
    outside_chain: '',//外链
    upload_image_two:'',//文章图片
  },
  reducers: {
    setAddProps(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    clearAddProps(state: any, payload: any) {
      return {
        choose_type: undefined,             //选择bannar类型
        choose_location: '',        //选择bannar位置
        allowed_show: 0,     //是否允许直接显示
        upload_type: '',       //上传图片类型
        upload_image: '',     //上传图片地址
        chooseText: '',       //选择文章
        allowed_click: 1,     //是否可以点击
        chooseTextId: '',//文章id
        text_image: '',  //文章类型图片
        text_image_type: 1,       //上传图片类型
        pagination: {
          current: 1,//当前位于第几页
          pageSize: 5,//一页多少条数据
          total: 100,
        },        //记录表格配置
        outside_chain: '',//外链
        upload_image_two: '',//文章图片
      }
    }


  }
}

export default model
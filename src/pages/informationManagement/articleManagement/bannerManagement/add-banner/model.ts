import { Model } from 'dva';
const model: Model = {
  namespace: 'setAddBanner',
  state: {
    choose_type: '',             //选择bannar类型
    choose_location: '',        //选择bannar位置
    allowed_show: '',     //是否允许直接显示

    upload_type:'',       //上传图片类型
    upload_image: '',     //上传图片地址

    chooseText: '',       //选择文章
    allowed_click:'',     //是否可以点击
    
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
        ...state,
        ...payload
      }
    }


  }
}

export default model
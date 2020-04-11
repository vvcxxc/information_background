import { Model } from 'dva';
const model:Model = {
  namespace: 'classificationList',
  state: {
    addPage: {
      addProps: {
        terrace_id: 1,      //平台id
        terrace_role_id: '', //平台角色id
        category_name: '',   //分类名称
        is_show: 0,          //是否显示 不允许修改
        rank_order: 0        //排序大小 不允许修改
      },
      showType: '请选择角色'
    },
    updatePage:[]
  },
  reducers: {
    setAddProps(state, { payload }) {
      return {
        ...state,
        addPage: {
          ...state.addPage,
          addProps: {
            ...state.addPage.addProps,
            ...payload
          }
        }
        
      }
    },
    setAddData(state,{ payload }) {
      return {
        ...state,
        addPage: {
          ...state.addPage,
          ...payload
        }
      }
    },
    clearAddData(state, { payload }) {
      return {
        ...state,
        addPage: {
          ...state.addPage,
          showType:'请选择角色',
          addProps: {
            ...state.addPage.addProps,
            category_name: '',
            terrace_role_id:''
          }
        }

      }
    },
    setUpdateData(state: any, payload: any) {
      return {
        ...state,
        ...payload
      }
    }


  }
}

export default model
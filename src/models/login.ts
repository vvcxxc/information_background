import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

import configs from '../../env';
export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload)
      const res = yield call(fakeAccountLogin, payload)
      console.log(43523)
      if(res.data){
        localStorage.setItem('token',`${res.data.token_type} ${res.data.access_token}`)
        // yield put({
        //   type: 'user/saveCurrentUser',
        //   payload:{
        //     name: payload.username,
        //     avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        //   }
        // })
        history.push('/informationManagement/articleManagement/articleList')
      }else{
        notification.error({
          message: res.message,
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;

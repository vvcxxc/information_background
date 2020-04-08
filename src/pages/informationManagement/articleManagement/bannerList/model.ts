const Model = {
  namespace: 'bannerList',
  state: {
    contentTitle: undefined, // 内容标题
    publishStatus: undefined, // 发布状态
    bannerType: undefined, // 选择类型

    CKCurrentPage: 1, // 创客当前页
    CKCurrentPageSize: 10, // 创客每页数量
    HZCurrentPage: 1, // 会长当前页
    HZCurrentPageSize: 10, // 会长每页数量

    tabKey: 1, // Tab切换值
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        contentTitle: action.payload.contentTitle,
        publishStatus: action.payload.publishStatus,
        bannerType: action.payload.bannerType,
        // currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        contentTitle: undefined,
        publishStatus: undefined,
        bannerType: undefined,
      };
    },
    // 设置Tab
    setTabSelected(state: any, action: any) {
      return {
        ...state,
        tabKey: action.payload.tabKey,
      };
    },
  },
};

export default Model;

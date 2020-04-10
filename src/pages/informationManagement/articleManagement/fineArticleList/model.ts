const Model = {
  namespace: 'fineArticleList',
  state: {
    articleTitle: undefined, // 文章标题
    publishAuthor: undefined, // 发布作者
    publishStatus: undefined, // 发布状态

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
        articleTitle: action.payload.articleTitle,
        publishAuthor: action.payload.publishAuthor,
        publishStatus: action.payload.publishStatus,
        // currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        articleTitle: undefined,
        publishAuthor: undefined,
        publishStatus: undefined,
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

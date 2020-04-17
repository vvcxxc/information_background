const Model = {
  namespace: 'articleList',
  state: {
    articleTitle: undefined, // 文章标题
    publishAuthor: undefined, // 发布作者
    roleName: undefined,      // 所属角色
    publishStatus: undefined, // 发布状态
    articleCategory: undefined, // 所属分类
    isGood: undefined,          // 是否精品
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        articleTitle: action.payload.articleTitle,
        publishAuthor: action.payload.publishAuthor,
        roleName: action.payload.roleName,
        publishStatus: action.payload.publishStatus,
        articleCategory: action.payload.articleCategory,
        isGood: action.payload.isGood,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        articleTitle: undefined,
        publishAuthor: undefined,
        roleName: undefined,
        publishStatus: undefined,
        articleCategory: undefined,
        isGood: undefined
      };
    },
    setPaginationCurrent(state: any, action: any) {
      return {
        ...state,
        currentPage: action.payload.currentPage,
        currentPageSize: action.payload.currentPageSize,
      };
    },
  },
};

export default Model;

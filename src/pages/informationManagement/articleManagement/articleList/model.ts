const Model = {
  namespace: 'articleList',
  state: {
    articleTitle: undefined, // 文章标题
    publishAuthor: undefined, // 发布作者
    publishStatus: undefined, // 发布状态
    articleCategory: undefined, // 所属分类
    currentPage: 1, // 当前页
    currentPageSize: 10, // 每页数量
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        articleTitle: action.payload.articleTitle,
        publishAuthor: action.payload.publishAuthor,
        publishStatus: action.payload.publishStatus,
        articleCategory: action.payload.articleCategory,
        currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        articleTitle: undefined,
        publishAuthor: undefined,
        publishStatus: undefined,
        articleCategory: undefined,
      };
    },
  },
};

export default Model;

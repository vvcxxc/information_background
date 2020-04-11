const Model = {
  namespace: 'classifyList',
  state: {
    classifyTitle: undefined, // 分类标题
    typeStatus: undefined, // 类型状态
    classifyCategory: undefined, // 所属分类

    HZCurrentPage: 1, // 当前页
    HZCurrentPageSize: 10, // 每页数量
    CKCurrentPage: 1, // 当前页
    CKCurrentPageSize: 10, // 每页数量

    tabKey: 1, // Tab切换值
  },
  reducers: {
    setFussyForm(state: any, action: any) {
      return {
        ...state,
        classifyTitle: action.payload.classifyTitle,
        typeStatus: action.payload.typeStatus,
        classifyCategory: action.payload.classifyCategory,
        // currentPage: 1,
      };
    },
    resetFussySearch(state: any) {
      return {
        ...state,
        classifyTitle: undefined,
        typeStatus: undefined,
        classifyCategory: undefined,
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

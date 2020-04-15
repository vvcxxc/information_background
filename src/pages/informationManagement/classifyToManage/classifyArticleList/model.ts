const Model = {
    namespace: 'classifyArticleList',
    state: {
        articleTitle: undefined, // 文章标题
        publishStatus: undefined,  // 发布状态
        currentPage: 1, // 当前页
        currentPageSize: 10, // 每页数量
    },
    reducers: {
        setFussyForm(state: any, action: any) {
            return {
                ...state,
                articleTitle: action.payload.articleTitle,
                publishStatus: action.payload.publishStatus,
                currentPage: 1,
            };
        },
        resetFussySearch(state: any) {
            return {
                ...state,
                articleTitle: undefined,
                publishStatus: undefined,
            };
        },
        setPaginationCurrent(state: any, action: any) {
            return {
                ...state,
                currentPage: action.payload.currentPage,
                currentPageSize: action.payload.currentPageSize,
            };
        },
    }
}

export default Model;
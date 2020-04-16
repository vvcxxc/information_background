import Request from '@/utils/request';

/**
 * 获取列表页
 */
export function getListData(article_title: any, is_show: any, category_id: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/article', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
                article_title,
                is_show,
                category_id,
                page,
                per_page
            }
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 删除文章
 */
export function deleteArticle(id: any) {
    return new Promise((resolve, reject) => {
        Request(`/admin/article/${id}`, {
            method: 'DELETE'
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}
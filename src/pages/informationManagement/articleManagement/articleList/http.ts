import Request from '@/utils/request';

/**
 * 获取列表页
 */
export function getListData(article_title: any, article_author: any, terrace_role_id: any, is_show: any, category_id: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/article', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
                article_title,
                article_author,
                terrace_role_id,
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
 * 获取所有文章分类
 */
export function getArticleCategory() {
    return new Promise((resolve, reject) => {
        Request('/admin/common/getArticleCategory', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id')
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
 * 获取所有角色
 */
export function getAllRole() {
    return new Promise((resolve, reject) => {
        Request('/admin/common/getTerraceRole', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
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
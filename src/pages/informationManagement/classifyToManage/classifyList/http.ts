import Request from '@/utils/request';


/**
 * 获取列表页
 */

export function getListData(category_name: any, is_show: any, terrace_role_id: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/articleCategory', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
                orderBy: "rank_order",
                category_name,
                is_show,
                terrace_role_id,
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
 * 获取所有角色
 */
export function getAllRole() {
    return new Promise((resolve, reject) => {
        Request('/admin/common/getTerraceRole', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
                is_category: 0
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

export function deleteArticleClassify(id: any) {
    return new Promise((resolve, reject) => {
        Request(`/admin/articleCategory/${id}`, {
            method: 'DELETE'
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * 上下架
 */
export function changeIsShow(id: any, terrace_id: any, terrace_role_id: any, category_name: any, is_show: any, rank_order: any) {
    return new Promise((resolve, reject) => {
        Request(`/admin/articleCategory/${id}`, {
            method: 'PUT',
            data: {
                terrace_id,
                terrace_role_id,
                category_name,
                is_show,
                rank_order
            }
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}
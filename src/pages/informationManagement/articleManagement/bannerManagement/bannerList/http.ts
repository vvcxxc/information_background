import Request from '@/utils/request';


/**
 * 获取列表页
 */
export function getListData(article_title: any, is_show: any, banner_type: any, terrace_role_id: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/banner', {
            method: 'GET',
            params: {
                terrace_id: 1,
                article_title,
                is_show,
                banner_type,
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
                terrace_id: 1,
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
 * 删除banner
 */

export function deleteBanner(id: any) {
    return new Promise((resolve, reject) => {
        Request(`/admin/banner/${id}`, {
            method: 'DELETE'
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}
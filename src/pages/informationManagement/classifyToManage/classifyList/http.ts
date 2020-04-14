import Request from '@/utils/request';


/**
 * 获取列表页
 */

export function getListData(category_name: any, is_show: any, terrace_role_id: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/articleCategory', {
            method: 'GET',
            params: {
                terrace_id: 1,
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
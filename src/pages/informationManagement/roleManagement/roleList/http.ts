import Request from '@/utils/request';


/**
 * 获取列表页
 */

export function getListData(role_name: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/terraceRole', {
            method: 'GET',
            params: {
                terrace_id: 1,
                role_name,
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
            }
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}
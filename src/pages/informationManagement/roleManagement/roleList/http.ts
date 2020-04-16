import Request from '@/utils/request';


/**
 * 获取列表页
 */

export function getListData(role_name: any, page: any, per_page: any) {
    return new Promise((resolve, reject) => {
        Request('/admin/terraceRole', {
            method: 'GET',
            params: {
                terrace_id: localStorage.getItem('terrace_id'),
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
 * 修改角色
 */

export function editRole(terrace_role_id: any, role_name: any) {
    return new Promise((resolve, reject) => {
        Request(`/admin/terraceRole/${terrace_role_id}`, {
            method: 'PUT',
            data: {
                role_name
            }
        }).then(res => {
            resolve(res);
        })
            .catch(err => {
                reject(err)
            })
    })
}
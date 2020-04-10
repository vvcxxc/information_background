import request from '@/utils/request';

/**
*  下拉分类列表
*/
export async function getTerraceRole(data: object) {
    return request('/admin/common/getTerraceRole', {
        method: 'GET',
        data,
    });
}
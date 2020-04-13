import request from '@/utils/request';

/**
*  下拉分类列表
*/
export async function getTerraceRole(data: object) {
    return request('/admin/common/getTerraceRole', {
        method: 'GET',
        params: data,
    });
}

/**
*  添加文章
*/
export async function addArticle(data: object) {
    return request('/admin/article', {
        method: 'POST',
        params: data,
    });
}


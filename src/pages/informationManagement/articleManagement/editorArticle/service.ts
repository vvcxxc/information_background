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
* 文章详情
*/
export async function getArticle(id: any) {
    return request('/admin/article/' + id, {
        method: 'GET'
    });
}

/**
*  编辑文章
*/
export async function editorArticle(id: any, data: object) {
    return request('/admin/article/' + id, {
        method: 'PUT',
        params: data,
    });
}


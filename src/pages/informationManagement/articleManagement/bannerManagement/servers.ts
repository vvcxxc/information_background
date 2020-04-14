import request from '@/utils/request'

// 获取文章列表
interface listArticlesType {
  terrace_id:string | number, //平台id
  page?: string | number,      //页数
  per_page?: string | number   //每页几条
}
export const getListArticles = (params: listArticlesType) => {
  return request('/admin/article', {
    method: 'GET',
    params
  })
}

// 获取所有角色
interface getTerraceRoleType {
  terrace_id: Number,
  is_category: Number
}
export const getTerraceRole = (params: getTerraceRoleType) => {
  return request('/admin/common/getTerraceRole', {
    method: 'GET',
    params
  })
}
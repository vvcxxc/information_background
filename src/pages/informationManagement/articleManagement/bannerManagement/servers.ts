import request from '@/utils/request'

// 获取文章列表
interface listArticlesType {
  terrace_id: string | number, //平台id
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

interface getAddBannerType {
  terrace_id?: String | Number,       // 平台id
  terrace_role_id?: String | Number,  // 平台角色id
  banner_type?: String | Number,      // banner类型:1图片2文章
  banner_cover?: String | Number,     // 封面图
  article_id?: String | Number,       // 文章id(banner_type为1时传0)
  external_url?: String | Number,     // 需要跳转的url
  is_show?: String | Number,          // 是否显示：1显示0隐藏
  rank_order?: String | Number,        // 排序(越大越前)
}
// 添加banner
export const getAddBanner = (data: getAddBannerType) => {
  return request('/admin/banner', {
    method: 'POST',
    data
  })
}
//编辑getbanner
export const getBannerInfo = (params: any) => {
  return request('/admin/banner/' + params.id, {
    method: 'GET'
  })
}

//编辑banner
export const putBannerInfo = (data: any) => {
  return request('/admin/banner/' + data.id, {
    method: 'PUT',
    data
  })
}


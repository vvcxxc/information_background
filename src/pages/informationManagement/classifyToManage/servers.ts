import request from '@/utils/request'

// 获取角色列表信息
export const getAllRoles = (params:any) => {
  return request('./admin/common/getTerraceRole', {
    method: 'GET',
    params
  })
}

// 添加文章分类
export const addClasasification = (data: any) => {
  return request('/admin/articleCategory', {
    method: 'POST',
    data
  })
}

// 请求编辑文章分类旧数据 分类详情
export const detailsClasasification = (params:any) => {
  return request('/admin/articleCategory/' + params, {
    method: 'GET'
  })
}


// 编辑文章分类
export const updateClasasification = (id:Number | String,data: any) => {
  return request('/admin/articleCategory/'+id , {
    method: 'PUT',
    data
  })
}

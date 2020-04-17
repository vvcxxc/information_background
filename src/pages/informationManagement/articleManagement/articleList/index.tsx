import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Divider, Modal, message, Breadcrumb } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, getArticleCategory, getAllRole, deleteArticle } from './http';
import styles from './index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi'

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  articleList: any;
}

export default Form.create()(
  connect(({ articleList }: any) => ({ articleList }))(
    class ArticleList extends Component<Props> {
      formRef = React.createRef();

      state = {
        loading: false,
        total: 0,
        dataList: [],
        articleCategoryList: [],
        allRoleList: [],
      };

      componentDidMount() {
        const {
          articleTitle,
          publishAuthor,
          roleName,
          publishStatus,
          articleCategory,
          isGood,
          currentPage,
          currentPageSize,
        } = this.props.articleList;
        this.requestListData(articleTitle, publishAuthor, roleName, publishStatus, articleCategory, isGood, currentPage, currentPageSize);

        this.requestArticleCategory();

        this.requestAllRole();
      }


      requestListData = async (article_title: any, article_author: any, terrace_role_id: any, is_show: any, category_id: any, is_superiod: any, page: any, per_page: any) => {
        await this.setState({
          loading: true
        })
        getListData(article_title, article_author, terrace_role_id, is_show, category_id, is_superiod, page, per_page).then((res: any) => {
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.meta.pagination.total
          })
        })
      }

      requestArticleCategory = () => {
        getArticleCategory("").then((res: any) => {
          this.setState({
            articleCategoryList: res.data
          })
        })
      }

      requestAllRole = () => {
        getAllRole().then((res: any) => {
          this.setState({
            allRoleList: res.data
          })
        })
      }

      /**
       * 查询
       */
      handleSearch = async () => {
        const articleTitle = this.props.form.getFieldValue('articleTitle');
        const publishAuthor = this.props.form.getFieldValue('publishAuthor');
        const roleName = this.props.form.getFieldValue('roleName');
        const publishStatus = this.props.form.getFieldValue('publishStatus');
        const articleCategory = this.props.form.getFieldValue('articleCategory');
        const isGood = this.props.form.getFieldValue('isGood');
        await this.props.dispatch({
          type: 'articleList/setFussyForm',
          payload: {
            articleTitle,
            publishAuthor,
            roleName,
            publishStatus,
            articleCategory,
            isGood
          },
        });
        const { currentPage, currentPageSize } = this.props.articleList;
        this.requestListData(articleTitle, publishAuthor, roleName, publishStatus, articleCategory, isGood, currentPage, currentPageSize);
      };

      /**
       * 重置
       */
      handleFormReset = async () => {
        const { form } = this.props;
        const { dispatch } = this.props;
        form.resetFields();
        await dispatch({
          type: 'articleList/resetFussySearch',
        });
      };

      /**
       * 表格改变
       */
      handleChange = async (pagination: any) => {
        await this.props.dispatch({
          type: 'articleList/setPaginationCurrent',
          payload: {
            currentPage: pagination.current,
            currentPageSize: pagination.pageSize,
          },
        });

        const { currentPage, currentPageSize } = this.props.articleList;
        let articleTitle = this.props.form.getFieldValue('articleTitle');
        let publishAuthor = this.props.form.getFieldValue('publishAuthor');
        let roleName = this.props.form.getFieldValue('roleName');
        let publishStatus = this.props.form.getFieldValue('publishStatus');
        let articleCategory = this.props.form.getFieldValue('articleCategory');
        let isGood = this.props.form.getFieldValue('isGood');
        this.requestListData(articleTitle, publishAuthor, roleName, publishStatus, articleCategory, isGood, currentPage, currentPageSize);
      };

      handleDeleteItem = (record: any) => {
        let _this = this;
        confirm({
          title: '确认操作',
          icon: <ExclamationCircleOutlined />,
          content: '您确认删除该文章吗？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            deleteArticle(record.id).then((res: any) => {
              if (res.code == 200) {
                message.success(res.message);
                const {
                  articleTitle,
                  publishAuthor,
                  roleName,
                  publishStatus,
                  articleCategory,
                  isGood,
                  currentPage,
                  currentPageSize,
                } = _this.props.articleList;
                _this.requestListData(articleTitle, publishAuthor, roleName, publishStatus, articleCategory, isGood, currentPage, currentPageSize);
              }
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

      handleSelectItem = (key: any, item: any) => {
        // console.log(key, item)
        getArticleCategory(key).then((res: any) => {
          this.setState({
            articleCategoryList: res.data
          }, () => {
            this.props.form.setFieldsValue({
              articleCategory: undefined
            })
          })
        })
      }

      render() {
        const columns = [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
          },
          {
            title: '文章标题',
            dataIndex: 'article_title',
            key: 'article_title',
          },
          {
            title: '发布作者',
            dataIndex: 'article_author',
            key: 'article_author',
          },
          {
            title: '标题图片',
            dataIndex: 'author_cover',
            key: 'author_cover',
            render: (text: any, record: any) => (
              <img className={styles.img_cover} src={record.author_cover} alt="" />
            )
          },
          {
            title: '发布状态',
            dataIndex: 'is_show',
            key: 'is_show',
            render: (text: any, record: any) => (
              <span>
                {
                  record.is_show == 0 ? "未发布" : "已发布"
                }
              </span>
            )
          },
          {
            title: '发布时间',
            dataIndex: 'publish_time',
            key: 'publish_time',
          },
          {
            title: '阅读量',
            dataIndex: 'read_num',
            key: 'read_num',
          },
          {
            title: '所属分类',
            dataIndex: 'category_name',
            key: 'category_name',
            render: (text: any, record: any) => {
              return record.data_category.map((item: any) => (
                <span>{item.category.category_name + "-" + item.terrace_role.role_name + "(" + item.rank_order + ")"},</span>
              )
              )
            }
          },
          {
            title: '精品',
            dataIndex: 'terrace_role_id',
            key: 'terrace_role_id',
            render: (text: any, record: any) => {
              return record.data_category.map((item: any) => (
                <span>{item.is_superior == 1 ? item.terrace_role.role_name + "(" + item.superior_rank_order + ")," : ""}</span>

              )
              )
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
              <span>
                <a onClick={() => { history.push({ "pathname": '/informationManagement/articleManagement/previewArticle', query: { id: record.id } }) }}>查看</a>
                <Divider type="vertical" />
                {/* <a>下架</a> */}
                {/* <Divider type="vertical" /> */}
                <a onClick={() => { history.push({ "pathname": '/informationManagement/articleManagement/editorArticle', query: { id: record.id } }) }}>编辑</a>
                <Divider type="vertical" />
                <a onClick={this.handleDeleteItem.bind(this, record)}>删除</a>
              </span>
            ),
          },
        ];


        const {
          form: { getFieldDecorator },
        } = this.props;

        const {
          articleTitle,
          publishAuthor,
          roleName,
          publishStatus,
          articleCategory,
          isGood,
          currentPage,
          currentPageSize,
        } = this.props.articleList;

        const { loading, total, dataList, articleCategoryList, allRoleList } = this.state;
        return (
          <div className={styles.article_list}>
            <Breadcrumb>
              <Breadcrumb.Item>资讯管理</Breadcrumb.Item>
              <Breadcrumb.Item>
                文章管理
                </Breadcrumb.Item>
              <Breadcrumb.Item>文章列表</Breadcrumb.Item>
            </Breadcrumb>
            <Form ref={this.formRef}>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={8} sm={24}>
                  <FormItem label="文章标题">
                    {getFieldDecorator('articleTitle', { initialValue: articleTitle })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="发布作者">
                    {getFieldDecorator('publishAuthor', { initialValue: publishAuthor })(
                      <Input placeholder="请输入" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="所属角色">
                    {getFieldDecorator('roleName', { initialValue: roleName })(
                      <Select
                        placeholder="请选择角色"
                        style={{
                          width: '100%',
                        }}
                        onSelect={this.handleSelectItem}
                      >
                        {
                          allRoleList.map((item: any) => (
                            <option value={item.id}>{item.role_name}</option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row
                gutter={{
                  md: 24,
                  lg: 24,
                  xl: 48,
                }}
              >
                <Col md={8} sm={24}>
                  <FormItem label="发布状态">
                    {getFieldDecorator('publishStatus', { initialValue: publishStatus })(
                      <Select
                        placeholder="请选择文章发布状态"
                        style={{
                          width: '100%',
                        }}
                      >
                        <Option value="1">已发布</Option>
                        <Option value="0">未发布</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="所属分类" name="articleCategory">
                    {getFieldDecorator('articleCategory', { initialValue: articleCategory })(
                    <Select
                      placeholder="请选择所属分类"
                      style={{
                        width: '100%',
                      }}
                    >
                      {
                        articleCategoryList.map((item: any) => (
                          <option value={item.id}>{item.category_name}</option>
                        ))
                      }
                    </Select>,
                  )}
                  </FormItem>
                </Col>
              <Col md={8} sm={24}>
                <FormItem label="是否精品">
                  {getFieldDecorator('isGood', { initialValue: isGood })(
                    <Select
                      placeholder="请选择是否精品"
                      style={{
                        width: '100%',
                      }}
                    >
                      <option value={0}>否</option>
                      <option value={1}>是</option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              </Row>
            <Row
              gutter={{
                md: 24,
                lg: 24,
                xl: 48,
              }}
              style={{ marginBottom: "20px" }}
            >
              <Col md={8} sm={24}>
                <span>
                  <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                    查询
                    </Button>
                  <Button
                    style={{
                      marginLeft: 8,
                    }}
                    onClick={this.handleFormReset}
                  >
                    重置
                    </Button>
                </span>
              </Col>
            </Row>
            </Form>
          <Table
            columns={columns}
            dataSource={dataList}
            loading={loading}
            onChange={this.handleChange}
            pagination={{
              current: currentPage,
              defaultPageSize: currentPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total,
              showTotal: () => {
                return `共${total}条`;
              },
            }}
          />
          </div >
        );
      }
    },
  ),
);

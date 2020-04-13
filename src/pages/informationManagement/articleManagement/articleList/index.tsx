import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Divider } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, getArticleCategory } from './http';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  dispatch: (opt: any) => any;
  form: any;
  articleList: any;
}

export default Form.create()(
  connect(({ articleList }: any) => ({ articleList }))(
    class ArticleList extends Component<Props> {
      state = {
        loading: false,
        total: 0,
        dataList: [],
        articleCategoryList: []
      };

      componentDidMount() {
        const {
          articleTitle,
          publishAuthor,
          publishStatus,
          articleCategory,
          currentPage,
          currentPageSize,
        } = this.props.articleList;
        this.requestListData(articleTitle,publishAuthor,publishStatus,articleCategory,currentPage,currentPageSize);

        this.requestArticleCategory();
      }


      requestListData = async (article_title: any, article_author: any, is_show: any, category_id: any, page: any, per_page: any) => {
        await this.setState({
          loading: true
        })
        getListData(article_title, article_author, is_show, category_id, page, per_page).then((res: any) => {
          this.setState({
            dataList: res.data,
            loading: false,
            total: res.meta.pagination.total
          })
        })
      }

      requestArticleCategory = () => {
        getArticleCategory().then((res: any) => {
          this.setState({
            articleCategoryList: res.data
          })
        })
      }

      /**
       * 查询
       */
      handleSearch = async () => {
        const articleTitle = this.props.form.getFieldValue('articleTitle');
        const publishAuthor = this.props.form.getFieldValue('publishAuthor');
        const publishStatus = this.props.form.getFieldValue('publishStatus');
        const articleCategory = this.props.form.getFieldValue('articleCategory');
        await this.props.dispatch({
          type: 'articleList/setFussyForm',
          payload: {
            articleTitle,
            publishAuthor,
            publishStatus,
            articleCategory,
          },
        });
        // console.log(this.props);

        const { currentPage, currentPageSize } = this.props.articleList;
        this.requestListData(articleTitle, publishAuthor, publishStatus, articleCategory, currentPage, currentPageSize);
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
        let publishStatus = this.props.form.getFieldValue('publishStatus');
        let articleCategory = this.props.form.getFieldValue('articleCategory');
        this.requestListData(articleTitle, publishAuthor, publishStatus, articleCategory, currentPage, currentPageSize);
      };

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
                <span>{item.category.category_name}，</span>
              )
              )
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
              <span>
                <a>查看</a>
                <Divider type="vertical" />
                <a>下架</a>
                <Divider type="vertical" />
                <a>编辑</a>
                <Divider type="vertical" />
                <a>删除</a>
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
          publishStatus,
          articleCategory,
          currentPage,
          currentPageSize,
        } = this.props.articleList;

        const { loading, total, dataList, articleCategoryList } = this.state;
        return (
          <div className={styles.article_list}>
            <Form>
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
                  <FormItem label="所属分类">
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
          </div>
        );
      }
    },
  ),
);

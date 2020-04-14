import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Tabs, Divider, Modal, message } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, deleteArticle } from './http';
import styles from './index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
    dispatch: (opt: any) => any;
    form: any;
    match: any;
    classifyArticleList: any;
}

export default Form.create()(
    connect(({ classifyArticleList }: any) => ({ classifyArticleList }))(
        class ClassifyArticleList extends Component<Props> {

            state = {
                loading: false,
                total: 0,
                dataList: [],
            }

            componentDidMount() {
                // console.log(this.props);
                const categoryId = this.props.match.params.id;
                const {
                    articleTitle,
                    publishStatus,
                    currentPage,
                    currentPageSize,
                } = this.props.classifyArticleList;
                this.requestListData(articleTitle, publishStatus, categoryId, currentPage, currentPageSize)
            }

            requestListData = async (article_title: any, is_show: any, category_id: any, page: any, per_page: any) => {
                await this.setState({
                    loading: true
                })
                getListData(article_title, is_show, category_id, page, per_page).then((res: any) => {
                    // console.log('res', res)
                    this.setState({
                        dataList: res.data,
                        loading: false,
                        total: res.meta.pagination.total
                    })
                })
            }


            /**
            * 查询
            */
            handleSearch = async () => {
                const articleTitle = this.props.form.getFieldValue('articleTitle');
                const publishStatus = this.props.form.getFieldValue('publishStatus');
                await this.props.dispatch({
                    type: 'classifyArticleList/setFussyForm',
                    payload: {
                        articleTitle,
                        publishStatus,
                    },
                });

                const categoryId = this.props.match.params.id;
                const { currentPage, currentPageSize } = this.props.classifyArticleList;
                this.requestListData(articleTitle, publishStatus, categoryId, currentPage, currentPageSize)
            };

            /**
             * 重置
             */
            handleFormReset = async () => {
                const { form } = this.props;
                const { dispatch } = this.props;
                form.resetFields();
                await dispatch({
                    type: 'classifyArticleList/resetFussySearch',
                });
            };

            handleChange = async (pagination: any) => {
                await this.props.dispatch({
                    type: 'classifyArticleList/setPaginationCurrent',
                    payload: {
                        currentPage: pagination.current,
                        currentPageSize: pagination.pageSize,
                    },
                });


                const categoryId = this.props.match.params.id;
                const { currentPage, currentPageSize } = this.props.classifyArticleList;
                const articleTitle = this.props.form.getFieldValue('articleTitle');
                const publishStatus = this.props.form.getFieldValue('publishStatus');
                this.requestListData(articleTitle, publishStatus, categoryId, currentPage, currentPageSize)
            };

            handleDeleteItem = (record: any) => {
                let _this = this;
                confirm({
                    title: '确认操作',
                    icon: <ExclamationCircleOutlined />,
                    content: '您确认删除该文章分类吗？',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        deleteArticle(record.id).then((res: any) => {
                            if (res.code == 200) {
                                message.success(res.message);
                                const categoryId = _this.props.match.params.id;
                                const {
                                    articleTitle,
                                    publishStatus,
                                    currentPage,
                                    currentPageSize,
                                } = _this.props.classifyArticleList;
                                _this.requestListData(articleTitle, publishStatus, categoryId, currentPage, currentPageSize)
                            }
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
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
                        title: '操作',
                        key: 'action',
                        render: (text: any, record: any) => (
                            <span>
                                <a>查看</a>
                                <Divider type="vertical" />
                                <a>编辑</a>
                                <Divider type="vertical" />
                                <a onClick={this.handleDeleteItem.bind(this, record)}>移除</a>
                            </span>
                        ),
                    },
                ];


                const {
                    form: { getFieldDecorator },
                } = this.props;

                const {
                    articleTitle,
                    publishStatus,
                    currentPage,
                    currentPageSize
                } = this.props.classifyArticleList;

                const { loading, dataList, total } = this.state;
                return (
                    <div className={styles.classify_article_list}>
                        <Form>
                            <Row
                                gutter={{
                                    md: 24,
                                    lg: 24,
                                    xl: 48,
                                }}
                            >
                                <Col md={6} sm={24}>
                                    <FormItem label="分类标题">
                                        {getFieldDecorator('articleTitle', { initialValue: articleTitle })(
                                            <Input placeholder="请输入" />,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={6} sm={24}>
                                    <FormItem label="类型状态">
                                        {getFieldDecorator('publishStatus', { initialValue: publishStatus })(
                                            <Select
                                                placeholder="请选择文章发布状态"
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Option value="1">已上架</Option>
                                                <Option value="0">已下架</Option>
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={6} sm={24}>
                                    <span>
                                        <Button type="primary" htmlType="submit"
                                            onClick={this.handleSearch}
                                        >
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
                )
            }
        }
    )
)

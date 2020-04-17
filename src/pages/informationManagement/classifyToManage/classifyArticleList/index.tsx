import React, { Component } from 'react';
import { Table, Row, Col, Input, Button, Select, Tabs, Divider, Modal, message, Breadcrumb } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import { getListData, deleteArticle, getAllRole } from './http';
import styles from './index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { confirm } = Modal;

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
    dispatch: (opt: any) => any;
    form: any;
    match: any;
    location: any;
    classifyArticleList: any;
}

export default Form.create()(
    connect(({ classifyArticleList }: any) => ({ classifyArticleList }))(
        class ClassifyArticleList extends Component<Props> {

            state = {
                loading: false,
                total: 0,
                dataList: [],
                allRoleList: [],

                locationTitle: "",
                locationCategory: "",
            }

            componentDidMount = async () => {
                const categoryId = this.props.match.params.id;
                const {
                    articleTitle,
                    publishStatus,
                    currentPage,
                    currentPageSize,
                } = this.props.classifyArticleList;
                this.requestListData(articleTitle, publishStatus, categoryId, currentPage, currentPageSize);

                await this.requestAllRole();

                const { title } = this.props.location.query;
                this.setState({
                    locationTitle: title
                })

            }

            requestListData = async (article_title: any, is_show: any, category_id: any, page: any, per_page: any) => {
                await this.setState({
                    loading: true
                })
                const terrace_role_id = this.props.location.query.terrace_role_id
                getListData(article_title, is_show, category_id, page, per_page,terrace_role_id).then((res: any) => {
                    // console.log('res', res)
                    this.setState({
                        dataList: res.data,
                        loading: false,
                        total: res.meta.pagination.total
                    })
                })
            }

            requestAllRole = () => {
                getAllRole().then(async (res: any) => {
                    await this.setState({
                        allRoleList: res.data
                    })
                    const { category } = this.props.location.query;
                    this.state.allRoleList.forEach((item: any) => {
                        if (item.id == category) {
                            this.setState({
                                locationCategory: item.role_name
                            })
                        }
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
                    content: '您确认移除该文章分类吗？',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        const categoryId = _this.props.match.params.id;
                        deleteArticle(record.id, categoryId).then((res: any) => {
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

            handleDetailItem = (record: any) => {
                history.push('/informationManagement/articleManagement/previewArticle?id=' + record.id);
            }

            handleEditItem = (record: any) => {
                history.push('/informationManagement/articleManagement/editorArticle?id=' + record.id);
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
                                <a onClick={this.handleDetailItem.bind(this, record)}>查看</a>
                                <Divider type="vertical" />
                                <a onClick={this.handleEditItem.bind(this, record)}>编辑</a>
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

                const { loading, dataList, total, locationTitle, locationCategory } = this.state;
                return (
                    <div className={styles.classify_article_list}>
                        <Breadcrumb style={{ marginBottom: '20px' }}>
                            <Breadcrumb.Item>资讯管理</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                分类管理
                        </Breadcrumb.Item>
                            <Breadcrumb.Item>分类文章管理</Breadcrumb.Item>
                        </Breadcrumb>
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

                        <Breadcrumb style={{ marginBottom: '20px' }}>
                            <Breadcrumb.Item>{locationCategory}</Breadcrumb.Item>
                            <Breadcrumb.Item>{locationTitle}</Breadcrumb.Item>
                        </Breadcrumb>

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

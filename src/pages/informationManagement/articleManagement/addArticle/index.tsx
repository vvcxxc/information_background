import React, { Component } from 'react';
import { PageHeader, Checkbox, Select, Radio, DatePicker, TimePicker, Upload, notification, Spin, ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { PictureOutlined } from '@ant-design/icons';
import styles from './index.less';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import request from '@/utils/request';
import { getTerraceRole, addArticle } from './service';
export default class AddArticle extends React.Component {

    state = {
        showLoading: false,
        classList: [
            {
                id: 0,
                role_name: "",
                selectCheck: false,//分类选择框
                selectValue: '',//分类下拉框文章分类id //article_category[i].id
                inputNum: 0,//分类输入框数字排序
                qualityCheck: false,
                qualityInputNum: 0,
                article_category: [
                    {
                        id: 0,
                        terrace_id: 0,
                        terrace_role_id: 0,
                    }
                ]
            }
        ],
        title: '',//标题
        auth: '',//作者
        classHuizhangNum: '',//排序分类会长
        classChuangkeNum: '',//排序分类创客
        qualityHuizhangNum: '',//排序精品会长
        qualityChuangkeNum: '',//排序精品创客
        readNum: 0,//阅读数

        isShelvesValue: 1,//上架1是2否
        editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
        dateString: '',//发布日期
        timeString: '',//发布日期时间
        titleFileList: [],//封面图数组
        titleFileImg: '',//封面图地址
        articleFileList: []//文章图数组
    }

    async componentDidMount() {
        let terrace_id = localStorage.getItem('terrace_id');
        let data = localStorage.getItem('oss_data')
        if (!data) {
            request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
                let { data } = res;
                localStorage.setItem('oss_data', JSON.stringify(data))
            });
        }
        getTerraceRole({ terrace_id, is_category: true })
            .then((res: any) => {
                if (res.data && res.data.length) { this.setState({ classList: res.data }) }
            })
            .catch(err => this.showMessage('请求失败', '请求角色分类失败'))
    }
    //输入框
    editorInput = (type: any, e: any) => {
        this.setState({ [type]: e.target.value })
    }
    //分类选择
    onChangeClassHuizhang = (num: any, e: any) => {
        let classList = this.state.classList;
        classList[num].selectCheck = e.target.checked
        this.setState({ classList })
    }

    //分类下拉
    selectClassHuizhang = (num: any, value: any) => {
        let classList = this.state.classList;
        classList[num].selectValue = value;
        this.setState({ classList })
    }

    //分类输入数字排序
    editorInputNum = (num: any, e: any) => {
        let classList = this.state.classList;
        classList[num].inputNum = e.target.value;
        this.setState({ classList })
    }
    //精品选择
    onChangeQualityHuizhang = (num: any, e: any) => {
        let classList = this.state.classList;
        classList[num].qualityCheck = e.target.checked;
        this.setState({ classList })
    }
    //精品输入数字排序
    editorInputQualityNum = (num: any, e: any) => {
        let classList = this.state.classList;
        classList[num].qualityInputNum = e.target.value;
        this.setState({ classList })
    }
    //日期
    onChangeDate = (date: any, dateString: any) => {
        this.setState({ dateString })
    }
    onChangeTime = (time: any, timeString: any) => {
        this.setState({ timeString: timeString })
    }
    //是否上架
    onChangeShelvesValue = (e: any) => {
        this.setState({ isShelvesValue: e.target.value });
    };

    // 随机数
    randomString = (len: any) => {
        len = len || 32;
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
    //上传图片
    getData = (file: any) => {
        let res = localStorage.getItem('oss_data')
        if (res) {
            let data = JSON.parse(res)
            let data1 = {
                policy: data.policy,
                OSSAccessKeyId: data.accessid,
                success_action_status: 200, //让服务端返回200,不然，默认会返回204
                signature: data.signature,
                callback: data.callback,
                host: data.host,
                key: data.dir + this.randomString(32) + '.png',
            }
            return data1
        }
        return
    }
    //标题图片
    titleImageChange = (info: any) => {
        this.setState({ showLoading: true });
        let fileList = [...info.fileList];
        if (info.file.status === 'done') {
            this.setState({ titleFileList: fileList, titleFileImg: info.file.response.data.path, showLoading: false })
        }
        this.setState({ titleFileList: fileList })
    };
    //文章中图片
    articleImageChange = (info: any) => {
        let fileList = [...info.fileList];
        if (info.file.status === 'done') {
            this.setState({
                articleFileList: fileList,
                editorState: ContentUtils.insertMedias(this.state.editorState, [{
                    type: 'IMAGE',
                    url: 'http://oss.tdianyi.com/' + info.file.response.data.path + '?x-oss-process=image/resize,w_300'
                }])
            })
        }
        this.setState({ articleFileList: fileList })
    };
    //文章编辑
    articleChange = (editorState: any) => {
        this.setState({ editorState })
    }
    showMessage = (message: string, description: string) => {
        notification.open({
            message,
            description
        });
    }
    //提交
    submitContent = async () => {
        let terrace_id = localStorage.getItem('terrace_id');
        if (!this.state.title) {
            this.showMessage('发布失败', '请填写标题')
            return;
        }
        if (!this.state.auth) {
            this.showMessage('发布失败', '请填写作者')
            return;
        }
        if (!this.state.titleFileImg) {
            this.showMessage('发布失败', '请上传标题图片')
            return;
        }
        if (!this.state.dateString || !this.state.timeString) {
            this.showMessage('发布失败', '请上选择发布时间')
            return;
        }
        let classList = this.state.classList;
        let data_category = [], data_role = [];
        for (let i in classList) {
            classList[i].selectCheck && data_category.push({ category_id: classList[i].selectValue, rank_order: classList[i].inputNum ? classList[i].inputNum : '0' })
            classList[i].qualityCheck && data_role.push({ role_id: classList[i].id, rank_order: classList[i].qualityInputNum ? classList[i].qualityInputNum : '0' })
        }
        if (!data_role.length) {
            this.showMessage('发布失败', '请选择文章分类')
            return;
        }
        if (!data_role.length) {
            this.showMessage('发布失败', '请选择精品设置')
            return;
        }
        this.setState({ showLoading: true });
        let data = {
            terrace_id,//平台id
            article_title: this.state.title,
            article_author: this.state.auth,
            author_cover: this.state.titleFileImg,
            content: this.state.editorState.toHTML(),
            publish_time: this.state.dateString + ' ' + this.state.timeString,
            read_num: this.state.readNum,
            data_category: JSON.stringify(data_category),
            data_role: JSON.stringify(data_role),
            is_show: this.state.isShelvesValue == 1 ? 1 : 0,
        }
        addArticle(data)
            .then((res: any) => {
                this.setState({ showLoading: false });
                if (res.code == 200) {
                    notification.open({
                        message: '发布成功',
                        description: res.message,
                    });
                    setTimeout(() => {
                        window.history.back();
                    }, 1500)
                } else {
                    notification.open({
                        message: '发布失败',
                        description: res.message,
                    });
                }
            }).catch(err => this.setState({ showLoading: false }))
    }

    render() {
        const { Option } = Select;
        const { editorState, classList } = this.state
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator']
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        fileList={this.state.articleFileList}
                        onChange={this.articleImageChange}
                        showUploadList={false}
                        data={this.getData}
                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <PictureOutlined />
                        </button>
                    </Upload>
                )
            }
        ]
        return (
            <div className={styles.addArticle}>
                {
                    this.state.showLoading ? <div className={styles.loadingBox} ><Spin /></div> : null
                }
                <PageHeader
                    className="site-page-header"
                    backIcon={false}
                    title="发布文章"
                />
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>文章标题</div>
                    <input className={styles.titleInputLong} maxLength={30} type="text" placeholder="请输入文章标题" onChange={this.editorInput.bind(this, 'title')} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>文章作者</div>
                    <input className={styles.titleInputShort} maxLength={8} type="text" placeholder="请输入文章作者" onChange={this.editorInput.bind(this, 'auth')} />
                </div>
                <div className={styles.StartBox}>
                    <div className={styles.startWords}>标题图片</div>
                    <Upload
                        fileList={this.state.titleFileList}
                        onChange={this.titleImageChange}
                        showUploadList={false}
                        data={this.getData}
                        action="http://tmwl.oss-cn-shenzhen.aliyuncs.com/"
                    >
                        {
                            this.state.titleFileList.length >= 1 && this.state.titleFileImg ?
                                <img className={styles.startInputFiles} src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/" + this.state.titleFileImg} />
                                :
                                <img className={styles.startInputFiles} src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TDki5ZsBBsk6QXd67sWnr6FDinKDTkJh.png" />
                        }

                    </Upload>
                </div>
                <div className={styles.StartBox}>
                    <div className={styles.startWordsUnder}>文章分类</div>
                    <div className={styles.startChooseBox}>
                        {
                            classList.map((item: any, index: any) => {
                                return (
                                    <div className={styles.chooseContent} key={item.id}>
                                        <Checkbox className={styles.chooseRadio} onChange={this.onChangeClassHuizhang.bind(this, index)}>{item.role_name}</Checkbox>
                                        <div className={styles.chooseSelect} style={{ display: item.selectCheck ? 'block' : 'none' }}>
                                            <Select className={styles.chooseSelectItem} onChange={this.selectClassHuizhang.bind(this, index)}>
                                                {
                                                    item.article_category.map((item2: any, index: any) => {
                                                        return (<Option value={item2.id} key={item2.id}>{item2.category_name}</Option>)
                                                    })
                                                }
                                            </Select>
                                        </div>
                                        <input style={{ display: item.selectCheck ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInputNum.bind(this, index)} defaultValue='0' />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.StartBox}>
                    <div className={styles.startWordsUnder}>精品设置</div>
                    <div className={styles.startChooseBox}>
                        {
                            classList.map((item: any, index: any) => {
                                return (
                                    <div className={styles.chooseContent} key={item.id}>
                                        <Checkbox className={styles.chooseRadio} onChange={this.onChangeQualityHuizhang.bind(this, index)}>{item.role_name}</Checkbox>
                                        <input style={{ display: item.qualityCheck ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInputQualityNum.bind(this, index)} defaultValue='0' />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>文章上架</div>
                    <div className={styles.titleIsBox}>
                        <Radio.Group onChange={this.onChangeShelvesValue} value={this.state.isShelvesValue}>
                            <Radio value={1}>是</Radio>
                            <Radio value={2}>否</Radio>
                        </Radio.Group>
                    </div>
                </div>
                <div className={styles.StartBox}>
                    <div className={styles.startWords}>文章内容</div>
                    <div className={styles.startArticle}>
                        <BraftEditor
                            value={this.state.editorState}
                            onChange={this.articleChange}
                            controls={controls}
                            extendControls={extendControls}
                        />
                    </div>
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>阅读人数</div>
                    <input className={styles.titleInputShort} type="number" placeholder="阅读人数" onChange={this.editorInput.bind(this, 'readNum')} defaultValue={0} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>发布日期</div>
                    <ConfigProvider locale={zh_CN}>
                        <div className={styles.titleDate} >
                            <DatePicker onChange={this.onChangeDate} placeholder="发布日期" />
                            <TimePicker onChange={this.onChangeTime} placeholder="发布时间" />
                        </div>
                    </ConfigProvider>
                </div>
                <div className={styles.btnBox} onClick={this.submitContent}>
                    <div className={styles.btnIcon}>文章上架</div>
                </div>
            </div>
        )

    }
};

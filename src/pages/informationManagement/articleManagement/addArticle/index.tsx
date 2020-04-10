import React, { Component } from 'react';
import { Checkbox, Select, Radio, DatePicker, Upload } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import styles from './index.less';
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import 'braft-editor/dist/index.css'
import request from '@/utils/request';

export default class AddArticle extends React.Component {

    state = {
        title: '',//标题
        auth: '',//作者
        classHuizhangNum: '',//排序分类会长
        classChuangkeNum: '',//排序分类创客
        qualityHuizhangNum: '',//排序精品会长
        qualityChuangkeNum: '',//排序精品创客
        readNum: '',//阅读数
        classHuizhang: false,//分类会长勾选
        selectClassHuizhang: '',//分类会长下拉
        classChuangke: false,//分类创客勾选
        selectClassChuangke: '',//分类创客下拉
        qualityHuizhang: false,//精品会长勾选
        qualityChuangke: false,//精品创客勾选
        isShelvesValue: 1,//上架1是2否
        editorState: BraftEditor.createEditorState(null), // 创建一个空的editorState作为初始值
        dateString: '',//发布日期
        titleFileList: [],//封面图数组
        titleFileImg: '',//封面图地址
        articleFileList: []//文章图数组
    }

    async componentDidMount() {
        let data = localStorage.getItem('oss_data')
        if (!data) {
            request.get('http://release.api.supplier.tdianyi.com/api/v2/up').then(res => {
                let { data } = res;
                localStorage.setItem('oss_data', JSON.stringify(data))
            });
        }
        // 假设此处从服务端获取html格式的编辑器内容
        // const htmlContent = await fetchEditorContent()
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        // this.setState({
        //     editorState: BraftEditor.createEditorState(htmlContent)
        // })
    }
    //输入框
    editorInput = (type: any, e: any) => {
        this.setState({ [type]: e.target.value })
    }
    //分类会长选择
    onChangeClassHuizhang = (e: any) => {
        this.setState({ classHuizhang: e.target.checked })
    }
    //分类会长下拉
    selectClassHuizhang = (value: any) => {
        this.setState({ selectClassHuizhang: value })
    }
    //分类创客选择
    onChangeClassChuangke = (e: any) => {
        this.setState({ classChuangke: e.target.checked })
    }
    //分类创客下拉
    selectClassChuangke = (value: any) => {
        this.setState({ selectClassChuangke: value })
    }
    //精品会长选择
    onChangeQualityHuizhang = (e: any) => {
        this.setState({ qualityHuizhang: e.target.checked })
    }
    //精品创客选择
    onChangeQualityChuangke = (e: any) => {
        this.setState({ qualityChuangke: e.target.checked })
    }
    //日期
    onChangeDate = (date: any, dateString: any) => {
        this.setState({ dateString })
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
        let fileList = [...info.fileList];
        if (info.file.status === 'done') {
            this.setState({ titleFileList: fileList, titleFileImg: info.file.response.data.path })
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
                    url: 'http://oss.tdianyi.com/' + info.file.response.data.path
                }])
            })
        }
        this.setState({ articleFileList: fileList })
    };
    //文章编辑
    articleChange = (editorState: any) => {
        this.setState({ editorState })
    }
    //提交
    submitContent = async () => {
        const { title, auth, classHuizhangNum, classChuangkeNum, qualityHuizhangNum, qualityChuangkeNum, readNum, classHuizhang, selectClassHuizhang, classChuangke, selectClassChuangke, qualityHuizhang, qualityChuangke, isShelvesValue, editorState, dateString, titleFileImg } = this.state;
        console.log(this.state)
        const htmlContent = this.state.editorState.toHTML()
        // const result = await saveEditorContent(htmlContent)
    }

    render() {
        const { Option } = Select;
        const { editorState } = this.state
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

                        <div className={styles.chooseContent}>
                            <Checkbox className={styles.chooseRadio} onChange={this.onChangeClassHuizhang}>会长</Checkbox>
                            <div className={styles.chooseSelect} style={{ display: this.state.classHuizhang ? 'block' : 'none' }}>
                                <Select className={styles.chooseSelectItem} onChange={this.selectClassHuizhang}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                </Select>
                            </div>
                            <input style={{ display: this.state.classHuizhang ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInput.bind(this, 'classHuizhangNum')} />
                        </div>
                        <div className={styles.chooseContent}>
                            <Checkbox className={styles.chooseRadio} onChange={this.onChangeClassChuangke}>创客</Checkbox>
                            <div className={styles.chooseSelect} style={{ display: this.state.classChuangke ? 'block' : 'none' }}>
                                <Select className={styles.chooseSelectItem} onChange={this.selectClassChuangke}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                </Select>
                            </div>
                            <input style={{ display: this.state.classChuangke ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInput.bind(this, 'classChuangkeNum')} />
                        </div>
                    </div>
                </div>
                <div className={styles.StartBox}>
                    <div className={styles.startWordsUnder}>精品设置</div>
                    <div className={styles.startChooseBox}>
                        <div className={styles.chooseContent}>
                            <Checkbox className={styles.chooseRadio} onChange={this.onChangeQualityHuizhang}>会长</Checkbox>
                            <input style={{ display: this.state.qualityHuizhang ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInput.bind(this, 'qualityHuizhangNum')} />
                        </div>
                        <div className={styles.chooseContent}>
                            <Checkbox className={styles.chooseRadio} onChange={this.onChangeQualityChuangke}>创客</Checkbox>
                            <input style={{ display: this.state.qualityChuangke ? 'block' : 'none' }} className={styles.chooseSelectInput} type="number" placeholder="输入数字排序" onChange={this.editorInput.bind(this, 'qualityChuangkeNum')} />
                        </div>
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
                    <div className={styles.startWords}>标题图片</div>
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
                    <input className={styles.titleInputShort} type="number" placeholder="阅读人数（选填）" onChange={this.editorInput.bind(this, 'readNum')} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.titleWords}>发布日期</div>
                    <div className={styles.titleDate} >
                        <DatePicker onChange={this.onChangeDate} placeholder="发布日期（选填）" />
                    </div>
                </div>
                <div className={styles.btnBox} onClick={this.submitContent}>
                    <div className={styles.btnIcon}>文章上架</div>
                </div>
            </div>
        )

    }
};

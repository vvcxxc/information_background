import React, { Component } from 'react';
import styles from './index.less';
import { PageHeader, notification, Spin } from 'antd';
import { getArticle } from './service';
export default class AddArticle extends React.Component {

    state = {
        showLoading: false,
        data: {
            article_title: "",
            article_author: "",
            publish_time: "",
            content: ''
        }
    }

    componentDidMount() {
        getArticle(this.props.location.query.id)//文章id
            .then((res: any) => {
                this.setState({ data: res.data })
            })
            .catch(err => {
                this.setState({ showLoading: false })
                this.showMessage('请求失败', '请求文章数据失败');
                setTimeout(() => { window.history.back(); }, 1500)
            })
    }

    showMessage = (message: string, description: string) => {
        notification.open({
            message,
            description
        });
    }

    unitExportFn = (unit: any, type: any, target: any) => {
        // 定义rem基准值
        const sizeBase = 23.4375;
        if (type === 'line-height') {
            // 输出行高时不添加单位
            return unit
        }
        // target的值可能是html或者editor，对应输出到html和在编辑器中显示这两个场景
        if (target === 'html') {
            // 只在将内容输出为html时才进行转换
            return unit / sizeBase + 'rem'
        } else {
            // 在编辑器中显示时，按px单位展示
            return unit + 'px'
        }

    }

    render() {
        return (
            <div className={styles.previewArticle}>
                {
                    this.state.showLoading ? <div className={styles.loadingBox} ><Spin /></div> : null
                }
                <PageHeader
                    className="site-page-header"
                    backIcon={false}
                    title="预览文章"
                />
                <div className={styles.previewPhoneContent}>
                    <div className={styles.previewPhoneTitle}>{this.state.data.article_title}</div>
                    <div className={styles.previewPhoneAuthBox}>
                        <div className={styles.previewPhoneAuth}>发布者：{this.state.data.article_author}</div>
                        <div className={styles.previewPhoneTime}>发布时间：{this.state.data.publish_time}</div>
                    </div>
                    <div className={styles.previewPContent} dangerouslySetInnerHTML={{ __html: this.state.data.content }}></div>
                </div>

                <div className={styles.btnBox} onClick={() => { window.history.back(); }}>
                    <div className={styles.btnIcon}>返回</div>
                </div>

            </div>
        )

    }
};

import React from 'react';
import { Divider } from 'antd';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const MindToolbar = () => (
  <Toolbar className={styles.toolbar}>
    <ToolbarButton command="undo" text="⌘ + Z 撤销" />
    <ToolbarButton command="redo" text="⇧ + ⌘ + Z 重做" />
    <Divider type="vertical" />
    <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
    <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
    <ToolbarButton command="autoZoom" icon="fit-map" text="自适应比例" />
    <ToolbarButton command="resetZoom" icon="actual-size" text="原始比例" />
    <Divider type="vertical" />
    <ToolbarButton command="customAppendCase" icon="append" text="Enter 添加同级 case" />
    <ToolbarButton command="customAppendChildCase" icon="append-child" text="Tab 添加下级 case" />
    <Divider type="vertical" />
    <ToolbarButton command="customAppendCate" icon="append" text="⌘ + N 添加同级 cate" />
    <ToolbarButton
      command="customAppendChildCate"
      icon="append-child"
      text="⌘ + ⇧ + N 添加下级 cate "
    />
    <Divider type="vertical" />
    <ToolbarButton command="customCollapse" icon="collapse" text="⌘ + B / Ctrl + B 折叠" />
    <ToolbarButton command="customExpand" icon="expand" text="⌘ + B / Ctrl + B 展开" />
  </Toolbar>
);

export default MindToolbar;

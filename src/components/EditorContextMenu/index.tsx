import React from 'react';
import { NodeMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';
import styles from './index.less';

const MindContextMenu = () => (
  <ContextMenu className={styles.contextMenu}>
    <NodeMenu>
      <MenuItem command="customAppendCase" icon="append" text="Enter 添加同级 case" />
      <MenuItem command="customAppendChildCase" icon="append-child" text="Tab 添加下级 case" />
      <MenuItem command="customAppendCate" icon="append" text="⌘ + N 添加同级 cate" />
      <MenuItem
        command="customAppendChildCate"
        icon="append-child"
        text="⌘ + ⇧ + N 添加下级 cate "
      />
      <MenuItem command="customCollapse" icon="collapse" text="⌘ + B / Ctrl + B 折叠" />
      <MenuItem command="customExpand" icon="expand" text="⌘ + B / Ctrl + B 展开" />
      <MenuItem command="delete" text="Delete / BackSpace 删除" />
    </NodeMenu>
    <CanvasMenu>
      <MenuItem command="undo" text="撤销" />
      <MenuItem command="redo" text="重做" />
    </CanvasMenu>
  </ContextMenu>
);

export default MindContextMenu;

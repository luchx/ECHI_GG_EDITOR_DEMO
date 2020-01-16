> GG-Editor 是基于 G6-Editor 进行二次封装的一款可视化操作应用框架，不过目前相关的使用说明文档太稀少了，没有一个完整的项目应用案例，还有就是核心代码 gg-editor-core 没有开源，那么今天就教大家如何基于 GG-Editor 开发一款脑图应用。

## 一、介绍

本项目是基于 GG-Editor 进行开发的脑图应用，基本上是一个较为完整的应用了，可以说已经预先给你们把坑填好了，另外本项目所有代码基本可以很快速的实现一个流程图应用，因为基本的 API 使用上是相同的。
另外，本文不会过多的讲述官方文档有的内容，会注重于使用上。

## 二、使用

安装和使用 GG-Editor 可直接通过 npm 或 yarn 安装依赖

```js
npm install --save gg-editor
```

下面我们快速进入开发，首先上 github 上把项目拉取到本地 [https://github.com/alibaba/GGEditor](https://github.com/alibaba/GGEditor)，我们将它自带的 Demo 作为模版，在此基础上进行开发。

![image](https://user-images.githubusercontent.com/17548394/70695372-87913c00-1cfc-11ea-9672-4a2813b82137.png)

执行命令 yarn run start 后启动效果图

![image](https://user-images.githubusercontent.com/17548394/70695398-95df5800-1cfc-11ea-8577-2368715b9586.png)

下面我们对项目进行改造

### 1. 自定义节点

官方文档： [http://ggeditor.com/docs/api/registerNode.en-US.html](http://ggeditor.com/docs/api/registerNode.en-US.html)

在 `components` 文件夹下新增 `EditorCustomNode/index.jsx`

```js
import React, { Fragment } from 'react';
import { RegisterNode } from 'gg-editor';

import PLUS_URL from '@/assets/plus.svg';
import MINUS_URL from '@/assets/minus.svg';
import CATE_URL from '@/assets/docs.svg';
import CASE_URL from '@/assets/file.svg';

const ICON_SIZE = 16;
const COLLAPSED_ICON = 'node-inner-icon';

function getRectPath(x: string | number, y: any, w: number, h: number, r: number) {
  if (r) {
    return [
      ['M', +x + +r, y],
      ['l', w - r * 2, 0],
      ['a', r, r, 0, 0, 1, r, r],
      ['l', 0, h - r * 2],
      ['a', r, r, 0, 0, 1, -r, r],
      ['l', r * 2 - w, 0],
      ['a', r, r, 0, 0, 1, -r, -r],
      ['l', 0, r * 2 - h],
      ['a', r, r, 0, 0, 1, r, -r],
      ['z'],
    ];
  }

  const res = [['M', x, y], ['l', w, 0], ['l', 0, h], ['l', -w, 0], ['z']];

  res.toString = toString;

  return res;
}

class EditorCustomNode extends React.Component {
  render() {
    const config = {
      // 绘制标签
      // drawLabel(item) {
      // },

      // 绘制图标
      afterDraw(item) {
        const model = item.getModel();
        const group = item.getGraphicGroup();

        const label = group.findByClass('label')[0];
        const labelBox = label.getBBox();

        const { width } = labelBox;
        const { height } = labelBox;
        const x = -width / 2;
        const y = -height / 2;

        const { type, collapsed, children } = model;

        // 折叠状态图标
        if (type === 'cate' && children && children.length > 0) {
          group.addShape('image', {
            className: COLLAPSED_ICON,
            attrs: {
              img: collapsed ? PLUS_URL : MINUS_URL,
              x: x - 24,
              y: y - 2,
              width: ICON_SIZE,
              height: ICON_SIZE,
              style: 'cursor: pointer',
            },
          });
        }
        // 文件类型图标
        group.addShape('image', {
          attrs: {
            img: type === 'cate' ? CATE_URL : CASE_URL,
            x: children && children.length > 0 ? x + 4 : x - 12,
            y: y - 2,
            width: ICON_SIZE,
            height: ICON_SIZE,
          },
        });
      },

      // 对齐标签
      adjustLabelPosition(item, labelShape) {
        const size = this.getSize(item);
        const padding = this.getPadding(item);
        const width = size[0];
        const labelBox = labelShape.getBBox();

        labelShape.attr({
          x: -width / 2 + padding[3],
          y: -labelBox.height / 2,
        });
      },

      // 内置边距
      // [上, 右, 下, 左]
      getPadding(item) {
        const model = item.getModel();
        const { children } = model;
        if (children && children.length > 0) {
          return [12, 8, 12, 60];
        }
        return [12, 8, 12, 38];
      },

      // 标签尺寸
      // [宽, 高]
      getSize(item) {
        const group = item.getGraphicGroup();

        const label = group.findByClass('label')[0];
        const labelBox = label.getBBox();

        const padding = this.getPadding(item);

        return [
          labelBox.width + padding[1] + padding[3],
          labelBox.height + padding[0] + padding[2],
        ];
      },

      // 节点路径
      // x, y, w, h, r
      getPath(item) {
        const size = this.getSize(item);
        const style = this.getStyle(item);

        return getRectPath(-size[0] / 2, -size[1] / 2, size[0] + 4, size[1], style.radius);
      },

      // 节点样式
      getStyle(item) {
        return {
          // stroke: '#d9d9d9',
          radius: 2,
          lineWidth: 1,
        };
      },

      // 标签样式
      getLabelStyle(item) {
        return {
          fill: 'rgba(0,0,0,0.65)',
          lineHeight: 18,
          fontSize: 16,
        };
      },

      // 激活样式
      getActivedStyle(item) {
        return {
          stroke: '#096dd9',
        };
      },

      // 选中样式
      getSelectedStyle(item) {
        return {
          stroke: '#096dd9',
        };
      },
    };

    return (
      <Fragment>
        <RegisterNode name="mind-base" config={config} extend="mind-base" />
        <RegisterNode name="custom-node" config={config} extend="mind-base" />
      </Fragment>
    );
  }
}

export default EditorCustomNode;
```

修改 Mind 文件夹下新增并新增如下代码

```js
import EditorCustomNode from '../components/EditorCustomNode';

<Mind data={data} className={styles.mind}
// rootShape 自定义根节点
// rootShape="custom-root"
firstSubShape="custom-node"
secondSubShape="custom-node"
/>
{/* 自定义节点 */}
<EditorCustomNode />
```

### 2. 自定义快捷事件

官方文档：[http://ggeditor.com/docs/api/registerCommand.en-US.html](http://ggeditor.com/docs/api/registerCommand.en-US.html)

在 `components` 文件夹下新增 `EditorCommand/index.jsx`

```js
import React from 'react';
import { RegisterCommand } from 'gg-editor';

function addNodeCall(editor, node, id, type) {
  const graph = editor.getGraph();
  const model = node.getModel();
  const sideNode = editor.getFirstChildrenBySide('left');
  const currentNode = sideNode[0] && graph.find(sideNode[0].id);
  return graph.add('node', {
    id,
    parent: node.id,
    label: '新建节点',
    type,
    side: model.children.length > 2 ? 'left' : 'right',
    nth: currentNode ? graph.getNth(currentNode) : void 0,
  });
}

class CustomCommand extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', event => {
      event.preventDefault();
    });
  }

  render() {
    return [
      // Enter 添加同级 case
      <RegisterCommand
        key="customAppendCase"
        name="customAppendCase"
        config={{
          enable(editor) {
            const currentPage = editor.getCurrentPage();
            const selected = currentPage.getSelected();
            return currentPage.isMind && selected.length === 1;
          },
          getItem(editor) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            return this.selectedItemId
              ? graph.find(this.selectedItemId)
              : currentPage.getSelected()[0];
          },
          execute(editor) {
            let addNode;
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const root = currentPage.getRoot();
            const node = this.getItem(editor);
            const model = node.getModel();
            const { hierarchy } = model;
            const parent = node.getParent();
            if (node.isRoot) addNode = addNodeCall(currentPage, node, this.addItemId, 'case');
            else {
              const l = graph.getNth(node);
              addNode = graph.add('node', {
                id: this.addItemId,
                parent: parent.id,
                side: hierarchy === 2 && root.children.length === 3 ? 'left' : model.side,
                label: '新建节点',
                type: 'case',
                nth: model.side === 'left' && hierarchy === 2 ? l : l + 1,
              });
            }
            currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(addNode, true),
              this.executeTimes === 1 &&
                ((this.selectedItemId = node.id),
                (this.addItemId = addNode.id),
                currentPage.beginEditLabel(addNode));
          },
          back(editor: any) {
            const currentPage = editor.getCurrentPage();
            currentPage.getGraph().remove(this.addItemId),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(this.selectedItemId, true);
          },
          shortcutCodes: ['Enter'],
        }}
      />,
      // Tab 添加下级 case
      <RegisterCommand
        key="customAppendChildCase"
        name="customAppendChildCase"
        config={{
          enable(editor: any) {
            const currentPage = editor.getCurrentPage();
            const selected = currentPage.getSelected();
            const node = this.getItem(editor);
            // 不允许创建次级 case
            const isCase = node && node.getModel().type === 'case';
            return currentPage.isMind && selected.length > 0 && !isCase;
          },
          getItem(editor: any) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            return this.selectedItemId
              ? graph.find(this.selectedItemId)
              : currentPage.getSelected()[0];
          },
          execute(editor: any) {
            let addNode;
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const node = this.getItem(editor);
            (addNode = node.isRoot
              ? addNodeCall(currentPage, node, this.addItemId, 'case')
              : graph.add('node', {
                  id: this.addItemId,
                  parent: node.id,
                  label: '新建节点',
                  type: 'case',
                })),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(addNode, true),
              this.executeTimes === 1 &&
                ((this.selectedItemId = node.id),
                (this.addItemId = addNode.id),
                currentPage.beginEditLabel(addNode));
          },
          back(editor: any) {
            const currentPage = editor.getCurrentPage();
            currentPage.getGraph().remove(this.addItemId),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(this.selectedItemId, true);
          },
          shortcutCodes: ['Tab'],
        }}
      />,
      // ⌘ + N 添加同级 cate
      <RegisterCommand
        key="customAppendCate"
        name="customAppendCate"
        config={{
          enable(editor: any) {
            const currentPage = editor.getCurrentPage();
            const selected = currentPage.getSelected();
            return currentPage.isMind && selected.length === 1;
          },
          getItem(editor: any) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            return this.selectedItemId
              ? graph.find(this.selectedItemId)
              : currentPage.getSelected()[0];
          },
          execute(editor: any) {
            let addNode;
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const root = currentPage.getRoot();
            const node = this.getItem(editor);
            const model = node.getModel();
            const { hierarchy } = model;
            const parent = node.getParent();
            if (node.isRoot) addNode = addNodeCall(currentPage, node, this.addItemId, 'cate');
            else {
              const index = graph.getNth(node);
              addNode = graph.add('node', {
                id: this.addItemId,
                parent: parent.id,
                side: hierarchy === 2 && root.children.length === 3 ? 'left' : model.side,
                label: '新建节点',
                type: 'cate',
                nth: model.side === 'left' && hierarchy === 2 ? index : index + 1,
              });
            }
            currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(addNode, true),
              this.executeTimes === 1 &&
                ((this.selectedItemId = node.id),
                (this.addItemId = addNode.id),
                currentPage.beginEditLabel(addNode));
          },
          back(editor: any) {
            const currentPage = editor.getCurrentPage();
            currentPage.getGraph().remove(this.addItemId),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(this.selectedItemId, true);
          },
          shortcutCodes: ['metaKey', 'n'],
        }}
      />,
      // ⌘ + ⇧ + N 添加下级 cate
      <RegisterCommand
        key="customAppendChildCate"
        name="customAppendChildCate"
        config={{
          enable(editor: any) {
            const currentPage = editor.getCurrentPage();
            const selected = currentPage.getSelected();
            const node = this.getItem(editor);
            // 不允许创建次级 cate
            const isCase = node && node.getModel().type === 'case';
            return currentPage.isMind && selected.length > 0 && !isCase;
          },
          getItem(editor: any) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            return this.selectedItemId
              ? graph.find(this.selectedItemId)
              : currentPage.getSelected()[0];
          },
          execute(editor: any) {
            let addNode;
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const node = this.getItem(editor);
            (addNode = node.isRoot
              ? addNodeCall(currentPage, node, this.addItemId, 'cate')
              : graph.add('node', {
                  id: this.addItemId,
                  parent: node.id,
                  label: '新建节点',
                  type: 'cate',
                })),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(addNode, true),
              this.executeTimes === 1 &&
                ((this.selectedItemId = node.id),
                (this.addItemId = addNode.id),
                currentPage.beginEditLabel(addNode));
          },
          back(editor: any) {
            const currentPage = editor.getCurrentPage();
            currentPage.getGraph().remove(this.addItemId),
              currentPage.clearSelected(),
              currentPage.clearActived(),
              currentPage.setSelected(this.selectedItemId, true);
          },
          shortcutCodes: ['metaKey', 'shiftKey', 'N'],
        }}
      />,
      // ⌘ + B 折叠 / 展开
      <RegisterCommand
        key="customCollapseExpand"
        name="customCollapseExpand"
        config={{
          enable(editor) {
            const node = this.getItem(editor);
            if (!node) {
              return false;
            }
            const { type } = node.getModel();
            const hasChild = node.getChildren().length > 0;
            return node && hasChild && type !== 'case';
          },
          getItem(editor) {
            const currentPage = editor.getCurrentPage();
            const grapg = currentPage.getGraph();
            return this.itemId ? grapg.find(this.itemId) : currentPage.getSelected()[0];
          },
          execute(editor) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const node = this.getItem(editor);
            node.getModel().collapsed
              ? (graph.update(node, {
                  collapsed: false,
                }),
                node.getInnerEdges &&
                  node.getInnerEdges().forEach(editor => {
                    editor.update();
                  }),
                (this.toCollapsed = false))
              : (graph.update(node, {
                  collapsed: true,
                }),
                (this.toCollapsed = true)),
              currentPage.clearSelected(),
              currentPage.setSelected(node, true),
              this.executeTimes === 1 && (this.itemId = node.id);
          },
          back(editor) {
            const currentPage = editor.getCurrentPage();
            const graph = currentPage.getGraph();
            const node = this.getItem(editor);
            this.toCollapsed
              ? graph.update(node, {
                  collapsed: false,
                })
              : graph.update(node, {
                  collapsed: true,
                }),
              currentPage.clearSelected(),
              currentPage.setSelected(node, true);
          },
          shortcutCodes: [
            ['metaKey', 'b'],
            ['ctrlKey', 'b'],
          ],
        }}
      />,
      // ⌘ + B 折叠
      <RegisterCommand
        key="customCollapse"
        name="customCollapse"
        extend="customCollapseExpand"
        config={{
          enable(editor) {
            const node = this.getItem(editor);
            if (!node) {
              return false;
            }
            const { type, collapsed } = node.getModel();
            const hasChild = node.getChildren().length > 0;
            return node && hasChild && type !== 'case' && !collapsed;
          },
        }}
      />,
      // ⌘ + B 展开
      <RegisterCommand
        key="customExpand"
        name="customExpand"
        extend="customCollapseExpand"
        config={{
          enable(editor) {
            const node = this.getItem(editor);
            if (!node) {
              return false;
            }
            const { type, collapsed } = node.getModel();
            const hasChild = node.getChildren().length > 0;
            return node && hasChild && type !== 'case' && collapsed;
          },
        }}
      />,
    ];
  }
}

export default CustomCommand;
```

修改 `Mind` 文件夹下新增并新增如下代码

```js
import EditorCommand from '@/component/EditorCommand';

<Mind
  className={styles.mind}
  data={mindData}
  // rootShape="custom-root"
  firstSubShape="custom-node"
  secondSubShape="custom-node"
  graph={{
		// renderer: 'svg',
		fitView: 'cc', // 画布显示位置，cc为水平垂直居中显示
		// animate: true,
	}}
	// 注册快捷键
	shortcut={{
      append: false,
      appendChild: false,
      collaspeExpand: false,
      customAppendCase: true, // Enter 添加同级 case
      customAppendChildCase: true, // Tab 添加下级 case
      customAppendCate: true, // ⌘ + N 添加同级 cate
      customAppendChildCate: true, // ⌘ + ⇧ + N 添加下级 cate
      customCollapseExpand: true, // ⌘ + B 折叠 / 展开
      customExpand: true, // ⌘ + B / Ctrl + B 展开
      customCollapse: true, // ⌘ + B / Ctrl + B 折叠
	}}
/>

{/* 自定义快捷事件 */}
<EditorCommand />
```

### 3. 自定义右键菜单

官方文档：[http://ggeditor.com/docs/api/contextMenu.en-US.html](http://ggeditor.com/docs/api/contextMenu.en-US.html)

修改 `EditorContextMenu` 下的 `MindContextMenu.js` 文件

```js
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
```

### 4. 自定义工具条

官方文档：[http://ggeditor.com/docs/api/toolbar.en-US.html](http://ggeditor.com/docs/api/toolbar.en-US.html)

修改 `EditorToolbar` 下的 `MindToolbar.js` 文件

```js
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
```

## 三、最终效果图

[![Edit gg-editor-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/gg-editor-demo-9nvui?fontsize=14&hidenavigation=1&theme=dark)

![image](https://user-images.githubusercontent.com/17548394/70695426-a394dd80-1cfc-11ea-887f-172df719f93e.png)

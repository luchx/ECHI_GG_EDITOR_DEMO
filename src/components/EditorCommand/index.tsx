import React from 'react';
import { RegisterCommand } from 'gg-editor';

function addNodeCall(editor: any, node: any, id: string, type: string) {
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

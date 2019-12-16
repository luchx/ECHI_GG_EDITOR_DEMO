import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Row, Col, Button, message } from 'antd';
import { Util } from '@antv/g6';
import GGEditor, { Mind } from 'gg-editor';
import EditorMinimap from '@/components/EditorMinimap';
import EditorCommand from '@/components/EditorCommand';
import EditorCustomNode from '@/components/EditorCustomNode';
import MindContextMenu from '@/components/EditorContextMenu';
import MindToolbar from '@/components/EditorToolbar';
import { COLLAPSED_ICON, mockData } from '@/constant';
import styles from './index.less';

// 禁止发送数据 http://ggeditor.com/docs/api/ggEditor.en-US.html
GGEditor.setTrackable(false);

type NodeType = {
  id?: string;
  code: string;
  name: string;
  label?: string;
  type: string;
  isLeaf: boolean;
  isDeleted?: boolean;
  children: any[];
};

/**
 * 初始化数据节点
 * @param json 请求数据
 * @param collapsed 是否折叠
 * @param isLoaded 是否已加载次级
 */
const mapRoorTree = (json: NodeType, collapsed: boolean, isLoaded: boolean) => ({
  ...json,
  label: json.name,
  collapsed,
  isLoaded,
  children: formatDataTree({
    data: json.children,
    collapsed: true,
    isLoaded: false,
    hierarchy: 1,
  }),
});

/**
 * 格式化子级节点
 * @param data 请求数据
 * @param collapsed 是否折叠
 * @param isLoaded 是否已加载次级
 * @param parentId 父节点 id
 * @param hierarchy 层次
 */
const formatDataTree = ({ data = [], collapsed, isLoaded, parentId, hierarchy }: any) =>
  data.map((item: NodeType) => {
    const nextHierarchy = Number(hierarchy) + 1;
    return {
      ...item,
      label: item.label || item.name,
      parent: parentId,
      collapsed,
      isLoaded,
      hierarchy: nextHierarchy,
      children: formatDataTree({
        data: item.children,
        collapsed: true,
        isLoaded: false,
        parentId: item.id || item.code,
        hierarchy: nextHierarchy,
      }),
    };
  });

function getOriginItem(item: NodeType): NodeType {
  const { code, name, label, type, isLeaf, children } = item;
  return { code, name: label || name, type, isLeaf, children };
}

function handleFormatSave(originChildren = [], rootChildren = []) {
  const originCode = originChildren.reduce((arr: string[], next: NodeType) => {
    if (next.code) {
      arr.push(next.code);
    }
    return arr;
  }, []);
  const addNodes = rootChildren.reduce((arr: NodeType[], next: NodeType) => {
    if (!next.code || !originCode.includes(next.code)) {
      const node: any = getOriginItem(next);
      arr.push(node);
    }
    return arr;
  }, []);
  const rootCode = rootChildren.reduce((arr: string[], next: NodeType) => {
    if (next.code) {
      arr.push(next.code);
    }
    return arr;
  }, []);
  const originNodes: any = [];
  originChildren.forEach((item: NodeType) => {
    let children: any = item.children || [];
    const originItem = getOriginItem(item);
    if (!rootCode.includes(item.code)) {
      originItem.isDeleted = true;
    } else {
      const currentItem: any = rootChildren.find((root: NodeType) => item.code === root.code);
      children = handleFormatSave(children, currentItem.children);
    }
    originNodes.push({
      ...originItem,
      children,
    });
  });
  return [...addNodes, ...originNodes];
}

// 此处由于 mouseMove 事件特殊性，只能定义为全局变量
let startMatrix: any[] = [];
let startPoint: any = {};
let isMouseActived: boolean = false;

// 重置锚点状态
function resetStatus() {
  startMatrix = [];
  startPoint = {};
  isMouseActived = false;
}

export default () => {
  const [originData, setOriginData] = useState();
  const [mindData, setMindData] = useState();
  const MindRef = useRef<any>();

  const handleNodeClick = useCallback(event => {
    const { item, domEvent } = event;
    const { shape } = event;
    const { graph, model } = item;
    const { type, children, collapsed } = model;

    // 点击区域：非 case 节点、存在下级节点、折叠图标区域
    if (
      type === 'case' ||
      (children && children.length === 0) ||
      domEvent.button !== 0 ||
      shape.get('className') !== COLLAPSED_ICON
    ) {
      return;
    }
    graph.update(item, {
      collapsed: !collapsed,
    });
  }, []);

  const handleSave = useCallback(() => {
    const { editor } = MindRef.current;
    const currentPage = editor.getCurrentPage();
    const graph = currentPage.getGraph();
    const rootsData = graph.save().roots[0];

    const originChildren = originData.children;
    const rootChildren = rootsData.children;

    // 拼接数据
    const formatData = {
      ...getOriginItem(rootsData),
      children: handleFormatSave(originChildren, rootChildren),
    };
    console.log('保存数据 ======>', formatData);
  }, [originData]);

  const handleMouseDown = useCallback((event: any) => {
    const { item, domEvent } = event;
    const { editor } = MindRef.current;
    const currentPage = editor.getCurrentPage();
    const graph = currentPage.getGraph();
    if (item) {
      return;
    }
    isMouseActived = true;
    startMatrix = Util.clone(graph.getMatrix());
    startPoint = {
      clientX: domEvent.clientX,
      clientY: domEvent.clientY,
    };
  }, []);

  const handleMouseMove = useCallback((event: any) => {
    const { domEvent } = event;
    const { editor } = MindRef.current;
    const currentPage = editor.getCurrentPage();
    const graph = currentPage.getGraph();
    if (!isMouseActived) {
      return;
    }
    const dx = domEvent.clientX - startPoint.clientX;
    const dy = domEvent.clientY - startPoint.clientY;
    const matrix = Util.clone(startMatrix);
    Util.mat3.translate(matrix, matrix, [dx, dy]);
    graph.updateMatrix(matrix);
  }, []);

  useEffect(() => {
    const listener = e => {
      e.preventDefault();
      e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
    };
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  useEffect(() => {
    const rootsData = mockData
      ? {
          roots: [mapRoorTree(mockData, false, true)],
        }
      : null;
    setOriginData(mockData);
    setMindData(rootsData);
  }, []);

  if (!mindData) {
    return null;
  }

  return (
    <GGEditor ref={MindRef} className={styles.editor}>
      <Row type="flex" align="middle" className={styles.editorHd}>
        <Col span={20}>
          <MindToolbar />
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Col>
      </Row>
      <Row type="flex" className={styles.editorBd}>
        <Col span={20} className={styles.editorContent}>
          <Mind
            className={styles.mind}
            data={mindData}
            // rootShape="custom-root"
            firstSubShape="custom-node"
            secondSubShape="custom-node"
            onNodeClick={handleNodeClick}
            onMouseDown={handleMouseDown}
            onMouseUp={() => {
              resetStatus();
            }}
            onMouseLeave={() => {
              resetStatus();
            }}
            onMouseMove={handleMouseMove}
            graph={{
              renderer: 'svg',
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
              customAppendCate: true, // ⌘ + ⇩ / Ctrl + ⇩ 添加同级 cate
              customAppendChildCate: true, // ⌘ + ➩ / Ctrl + ➩ 添加下级 cate
              customCollapseExpand: true, // ⌘ + B / Ctrl + B 展开
              customExpand: true, // ⌘ + B / Ctrl + B 展开
              customCollapse: true, // ⌘ + B / Ctrl + B 折叠
            }}
          />
        </Col>
        <Col span={4} className={styles.editorSidebar}>
          <EditorMinimap />
        </Col>
      </Row>
      {/* 自定义快捷事件 */}
      <EditorCommand />
      {/* 自定义节点样式 */}
      <EditorCustomNode />
      {/* 右键菜单 */}
      <MindContextMenu />
    </GGEditor>
  );
};

const fabric = require('@umijs/fabric');

module.exports = {
  // singleQuote: true,
  // trailingComma: 'all',
  // printWidth: 100,
  // proseWrap: 'never',
  // overrides: [
  //   { files: '.prettierrc', options: [Object] },
  //   { files: 'document.ejs', options: [Object] }
  // ],
  ...fabric.prettier,
  tabWidth: 2, // 缩进字节数
  useTabs: false, // 缩进不使用tab，使用空格
  proseWrap: 'preserve', // 默认值。代码超出是否要换行 preserve保留
  trailingComma: 'es5', // 只在ES5 (objects, arrays, etc.)添加逗号
  semi: true, // 句末加分号
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格
  arrowParens: 'avoid', // 箭头函数尽可能省略括号
};

/* ────────────────────────────────────────────────────────────
   全局顶栏注入脚本
   用法：工具页 <head> 里引入本文件样式，body 末尾引入
        assets/tools.js + assets/nav.js（均加 defer）
   顶部就会出现与首页一致的「品牌 + 搜索 + 全部工具」，滚动时常驻。
   搜索框输入即出结果，点一下直接切换工具，不用先退回首页。
   ──────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var TOOLS = window.TOOLS || [];

  function decode(s) {
    try { return decodeURI(s); } catch (e) { return s; }
  }

  // 当前页面是哪个工具：用文件路径匹配，避免页面里再写一遍名字
  function currentPath() {
    return decode(location.pathname).split('/').pop() || '';
  }

  function matches(tool, q) {
    if (!q) return true;
    var hay = (tool.name + ' ' + tool.desc + ' ' + tool.cat + ' ' + (tool.tags || '')).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (kw) {
      return !kw || hay.indexOf(kw) !== -1;
    });
  }

  function build() {
    var header = document.createElement('header');
    header.className = 'gnav-topbar';
    header.innerHTML = [
      '<div class="gnav-inner">',
      '  <a class="gnav-brand" href="index.html" aria-label="返回小工具集首页">',
      '    <span class="gnav-mark">🧰</span>小工具集',
      '  </a>',
      '  <div class="gnav-search" id="gnavSearchBox">',
      '    <span class="gnav-ico">🔍</span>',
      '    <input id="gnavInput" type="search" autocomplete="off" aria-label="搜索工具"',
      '           placeholder="搜索工具，如：SQL、去重、回车…" role="combobox" aria-expanded="false">',
      '    <button class="gnav-clear" id="gnavClear" type="button" aria-label="清空搜索">✕</button>',
      '    <div class="gnav-results" id="gnavResults" role="listbox" aria-label="搜索结果"></div>',
      '  </div>',
      '  <a class="gnav-all" href="index.html">全部工具</a>',
      '</div>'
    ].join('');
    document.body.insertBefore(header, document.body.firstChild);
    return header;
  }

  function init() {
    var header = build();
    var box = header.querySelector('#gnavSearchBox');
    var input = header.querySelector('#gnavInput');
    var clearBtn = header.querySelector('#gnavClear');
    var panel = header.querySelector('#gnavResults');

    var here = currentPath();
    var selIndex = 0;
    var items = [];

    function close() {
      panel.classList.remove('open');
      input.setAttribute('aria-expanded', 'false');
      selIndex = 0;
    }

    function open() {
      panel.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
    }

    function highlight() {
      items.forEach(function (el, i) {
        el.classList.toggle('sel', i === selIndex);
      });
      if (items[selIndex]) {
        var r = items[selIndex].getBoundingClientRect();
        var pr = panel.getBoundingClientRect();
        if (r.top < pr.top + 4) panel.scrollTop += r.top - pr.top - 6;
        else if (r.bottom > pr.bottom - 4) panel.scrollTop += r.bottom - pr.bottom + 6;
      }
    }

    function render() {
      var q = input.value.trim();
      var list = TOOLS.filter(function (t) { return matches(t, q); });
      panel.textContent = '';
      items = [];

      if (!list.length) {
        var e = document.createElement('div');
        e.className = 'gnav-empty';
        e.textContent = q ? '没有找到匹配的工具，换个关键词试试' : '还没有添加工具';
        panel.appendChild(e);
        open();
        return;
      }

      list.forEach(function (tool) {
        var isCur = decode(tool.path) === here;   // 当前所在页，标一下免得以为点错
        var a = document.createElement('a');
        a.className = 'gnav-item' + (isCur ? ' cur' : '');
        a.href = encodeURI(tool.path);
        a.setAttribute('role', 'option');

        var ico = document.createElement('span');
        ico.className = 'gnav-ni';
        ico.textContent = tool.icon || '🔧';

        var tx = document.createElement('span');
        tx.className = 'gnav-tx';
        var name = document.createElement('span');
        name.className = 'gnav-nt';
        name.textContent = tool.name;
        var desc = document.createElement('span');
        desc.className = 'gnav-nd';
        desc.textContent = isCur ? '正在浏览这个工具' : tool.desc;
        tx.appendChild(name);
        tx.appendChild(desc);

        var cat = document.createElement('span');
        cat.className = 'gnav-nc';
        cat.textContent = isCur ? '当前页' : (tool.cat || '');

        a.appendChild(ico);
        a.appendChild(tx);
        a.appendChild(cat);
        panel.appendChild(a);
        items.push(a);
      });

      selIndex = 0;
      open();
      highlight();
    }

    function syncClear() {
      box.classList.toggle('has-value', !!input.value);
    }

    input.addEventListener('focus', function () { render(); });
    input.addEventListener('input', function () { syncClear(); selIndex = 0; render(); });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      syncClear();
      input.focus();
      render();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); input.blur(); return; }
      if (!items.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selIndex = (selIndex + 1) % items.length;
        highlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selIndex = (selIndex - 1 + items.length) % items.length;
        highlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selIndex]) location.href = items[selIndex].getAttribute('href');
      }
    });

    // 点面板外关闭；面板内点击交给链接自己跳转
    document.addEventListener('mousedown', function (e) {
      if (!header.contains(e.target)) close();
    });
    document.addEventListener('focusin', function (e) {
      if (!header.contains(e.target)) close();
    });

    // 快捷键：/ 或 Ctrl(⌘) + K 聚焦搜索（输入框里不触发）
    document.addEventListener('keydown', function (e) {
      var typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      var isSlash = e.key === '/' && !typing;
      var isCmdK = (e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k';
      if (isSlash || isCmdK) {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });

    syncClear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

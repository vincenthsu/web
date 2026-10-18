/**
 * Grind 75 Week 8 — Problems #66 to #75 (10 Problems)
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// Helper: Build Binary Tree Layout from Level-Order Array (e.g. [3,1,4,null,2])
// ============================================================================
function buildTreeFromLevelOrder(arr, width = 620) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return { root: null, nodes: [], edges: [], width, height: 220 };
  }

  const treeNodes = arr.map((val, idx) =>
    val === null || val === undefined ? null : { id: `n${idx}`, idx, val: Number(val), left: null, right: null, depth: 0, x: 0, y: 0 }
  );

  let i = 0;
  let j = 1;
  while (j < treeNodes.length) {
    while (i < treeNodes.length && !treeNodes[i]) i++;
    if (i >= treeNodes.length) break;
    if (j < treeNodes.length) treeNodes[i].left = treeNodes[j++];
    if (j < treeNodes.length) treeNodes[i].right = treeNodes[j++];
    i++;
  }

  const activeNodes = [];
  const edges = [];

  function assignCoords(node, depth, leftBound, rightBound) {
    if (!node) return;
    node.depth = depth;
    node.x = Math.round((leftBound + rightBound) / 2);
    node.y = 42 + depth * 72;
    activeNodes.push(node);
    const mid = (leftBound + rightBound) / 2;
    if (node.left) {
      edges.push({ from: node.id, to: node.left.id, label: "L", dir: true });
      assignCoords(node.left, depth + 1, leftBound, mid);
    }
    if (node.right) {
      edges.push({ from: node.id, to: node.right.id, label: "R", dir: true });
      assignCoords(node.right, depth + 1, mid, rightBound);
    }
  }

  assignCoords(treeNodes[0], 0, 36, width - 36);
  const maxDepth = activeNodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const height = Math.max(220, 85 + maxDepth * 72);
  return { root: treeNodes[0], nodes: activeNodes, edges, width, height };
}

// ============================================================================
// #66 Kth Smallest Element in a BST (LC #230, Medium)
// ============================================================================
window.PROBLEMS["kth-smallest-element-in-a-bst"] = {
  id: 66,
  leetcodeId: 230,
  slug: "kth-smallest-element-in-a-bst",
  title: "230. Kth Smallest Element in a BST (二元搜尋樹中第 K 小的元素)",
  difficulty: "Medium",
  topic: "Binary Search Tree",
  mins: 25,
  complexity: "Time O(H + k) · Space O(H)",
  argNames: ["root", "k"],
  description:
    "給定一個二元搜尋樹 (BST) 的根節點 root 和一個整數 k，請設計一個演算法查找其中第 k 小的元素（從 1 開始計數）。利用 BST 的中序走訪 (In-order Traversal: 左 → 根 → 右) 必為嚴格遞增序列的性質，搭配明確的 stack<TreeNode*> 進行迭代中序走訪，第 k 個彈出的節點即為所求。",

  presets: [
    { name: "範例 1：root = [3,1,4,null,2], k = 1", args: [[3, 1, 4, null, 2], 1] },
    { name: "範例 2：root = [5,3,6,2,4,null,null,1], k = 3", args: [[5, 3, 6, 2, 4, null, null, 1], 3] },
    { name: "範例 3：完整平衡 BST root = [4,2,6,1,3,5,7], k = 5", args: [[4, 2, 6, 1, 3, 5, 7], 5] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">kthSmallest</span>(<span class="tok-type">TreeNode</span>* root, <span class="tok-kw">int</span> k) {' },
    { line: 4,  code: '        <span class="tok-type">stack</span>&lt;<span class="tok-type">TreeNode</span>*&gt; st;' },
    { line: 5,  code: '        <span class="tok-type">TreeNode</span>* curr = root;' },
    { line: 6,  code: '        <span class="tok-kw">while</span> (curr != <span class="tok-kw">nullptr</span> || !st.<span class="tok-fn">empty</span>()) {' },
    { line: 7,  code: '            <span class="tok-kw">while</span> (curr != <span class="tok-kw">nullptr</span>) {' },
    { line: 8,  code: '                st.<span class="tok-fn">push</span>(curr);' },
    { line: 9,  code: '                curr = curr-&gt;left;' },
    { line: 10, code: '            }' },
    { line: 11, code: '            curr = st.<span class="tok-fn">top</span>(); st.<span class="tok-fn">pop</span>();' },
    { line: 12, code: '            <span class="tok-kw">if</span> (--k == <span class="tok-num">0</span>) <span class="tok-kw">return</span> curr-&gt;val;' },
    { line: 13, code: '            curr = curr-&gt;right;' },
    { line: 14, code: '        }' },
    { line: 15, code: '        <span class="tok-kw">return</span> -<span class="tok-num">1</span>;' },
    { line: 16, code: '    }' },
    { line: 17, code: '};' }
  ],

  generateTrace(rootArr, kInput) {
    const steps = [];
    const tree = buildTreeFromLevelOrder(rootArr, 620);
    let k = Number(kInput);
    const st = [];
    const visitedIds = new Set();
    const visitOrder = [];
    let curr = tree.root;
    let foundId = null;

    const snapState = (currNode, hlStackTop = false, retVal = "-", connectors = []) => {
      const nodes = tree.nodes.map((n) => {
        let status = "";
        if (foundId === n.id) status = "match";
        else if (currNode && currNode.id === n.id) status = "hl";
        else if (visitedIds.has(n.id)) status = "done";
        const ordIdx = visitOrder.indexOf(n.id);
        return {
          id: n.id,
          val: String(n.val),
          sub: ordIdx >= 0 ? `#${ordIdx + 1}` : "",
          x: n.x,
          y: n.y,
          status,
          ptr: currNode && currNode.id === n.id ? "curr" : ""
        };
      });

      const edges = tree.edges.map((e) => ({
        ...e,
        status: currNode && (e.from === currNode.id || e.to === currNode.id) ? "hl" : ""
      }));

      const stackItems = st.map((n, idx) => ({
        val: `Node(${n.val})`,
        status: hlStackTop && idx === st.length - 1 ? "hl" : ""
      }));

      return {
        boards: [
          {
            id: "bst",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元搜尋樹 (TreeNode*)",
            x: 325,
            y: 52,
            width: tree.width,
            height: tree.height,
            nodes,
            edges
          },
          {
            id: "st",
            type: "stack",
            name: "st",
            typeLabel: "中序走訪堆疊 (stack<TreeNode*>)",
            x: 325 + tree.width + 20,
            y: 52,
            items: stackItems
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "關鍵變數與計數器",
            x: 24,
            y: 215,
            items: [
              { id: "k", name: "k (剩餘步數)", val: String(k), status: k === 0 ? "match" : "hl" },
              { id: "curr", name: "curr", val: currNode ? `Node(${currNode.val})` : "nullptr", status: currNode ? "hl" : "" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 5,
      tag: "初始化指標與堆疊",
      tagType: "default",
      inlineBadge: `curr = ${curr ? curr.val : "nullptr"}, k = ${k}`,
      explanation: `初始化空堆疊 st，將指標 curr 指向根節點 ${curr ? curr.val : "nullptr"}，準備找第 ${k} 小的元素。`,
      vars: { k: String(k), curr: curr ? String(curr.val) : "nullptr", "st.size()": "0", return: "-" },
      state: snapState(curr)
    });

    while (curr !== null || st.length > 0) {
      while (curr !== null) {
        st.push(curr);
        const topIdx = st.length - 1;
        steps.push({
          line: 8,
          tag: "推入堆疊並向左深入",
          tagType: "tag-insert",
          inlineBadge: `st.push(${curr.val})`,
          explanation: `將當前節點 ${curr.val} 推入堆疊 st 暫存，接著準備往左子樹 curr->left 探索更小的值。`,
          vars: { k: String(k), curr: String(curr.val), "st.size()": String(st.length), return: "-" },
          state: snapState(curr, true, "-", [
            { from: `wb-node-bst-${curr.id}`, to: `wb-stack-st-${topIdx}`, label: `push(${curr.val})`, color: "purple" }
          ])
        });
        curr = curr.left;
        steps.push({
          line: 9,
          tag: "移動至左子節點",
          tagType: "tag-check",
          inlineBadge: `curr = ${curr ? curr.val : "nullptr"}`,
          explanation: curr
            ? `curr 移動至左子節點 ${curr.val}，繼續向左深入。`
            : `curr->left 為 nullptr，代表已到達當前分支最左側最小節點。`,
          vars: { k: String(k), curr: curr ? String(curr.val) : "nullptr", "st.size()": String(st.length), return: "-" },
          state: snapState(curr)
        });
      }

      curr = st.pop();
      visitedIds.add(curr.id);
      visitOrder.push(curr.id);
      steps.push({
        line: 11,
        tag: "彈出堆疊頂端節點",
        tagType: "tag-check",
        inlineBadge: `curr = ${curr.val}`,
        explanation: `從堆疊頂端彈出節點 ${curr.val}（中序走訪第 ${visitOrder.length} 小的元素）。`,
        vars: { k: String(k), curr: String(curr.val), "st.size()": String(st.length), return: "-" },
        state: snapState(curr)
      });

      k -= 1;
      if (k === 0) {
        foundId = curr.id;
        steps.push({
          line: 12,
          tag: "找到第 K 小元素",
          tagType: "tag-found",
          inlineBadge: `--k == 0 ➜ return ${curr.val}`,
          explanation: `k 遞減後變為 0！節點 ${curr.val} 即為 BST 中第 ${kInput} 小的元素，立即回傳 ${curr.val}。`,
          vars: { k: "0", curr: String(curr.val), "st.size()": String(st.length), return: String(curr.val) },
          state: snapState(curr, false, curr.val, [
            { from: `wb-node-bst-${curr.id}`, to: "wb-var-ret", label: `第 ${kInput} 小 = ${curr.val}`, color: "green" }
          ])
        });
        return steps;
      }

      steps.push({
        line: 12,
        tag: "遞減計數器 k",
        tagType: "tag-check",
        inlineBadge: `--k = ${k} != 0`,
        explanation: `將 k 遞減為 ${k}（尚未達到 0），接下來轉向檢查節點 ${curr.val} 的右子樹。`,
        vars: { k: String(k), curr: String(curr.val), "st.size()": String(st.length), return: "-" },
        state: snapState(curr)
      });

      curr = curr.right;
      steps.push({
        line: 13,
        tag: "轉向右子樹",
        tagType: "default",
        inlineBadge: `curr = ${curr ? curr.val : "nullptr"}`,
        explanation: curr
          ? `curr 轉向節點的右子節點 ${curr.val}。`
          : `右子節點為 nullptr，下一輪迴圈將繼續從堆疊 st 彈出上層祖先節點。`,
        vars: { k: String(k), curr: curr ? String(curr.val) : "nullptr", "st.size()": String(st.length), return: "-" },
        state: snapState(curr)
      });
    }

    return steps;
  }
};

// ============================================================================
// #67 Minimum Window Substring (LC #76, Hard)
// ============================================================================
window.PROBLEMS["minimum-window-substring"] = {
  id: 67,
  leetcodeId: 76,
  slug: "minimum-window-substring",
  title: "76. Minimum Window Substring (最小覆蓋子字串)",
  difficulty: "Hard",
  topic: "String",
  mins: 30,
  complexity: "Time O(|S| + |T|) · Space O(|Σ|)",
  argNames: ["s", "t"],
  description:
    "給定字串 s 與目標字串 t，請在 s 中找出涵蓋 t 所有字元（含重複次數）的最小子字串。使用雙指標滑動視窗 [left, right] 搭配 need 與 window 頻率表及 valid 達標種類數，在 O(|S| + |T|) 時間內完成。",

  presets: [
    { name: "範例 1：s = \"ADOBECODEBANC\", t = \"ABC\"", args: ["ADOBECODEBANC", "ABC"] },
    { name: "範例 2：s = \"CABWEFGE\", t = \"CAE\"", args: ["CABWEFGE", "CAE"] },
    { name: "範例 3：無法覆蓋 s = \"a\", t = \"aa\"", args: ["a", "aa"] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">string</span> <span class="tok-fn">minWindow</span>(<span class="tok-type">string</span> s, <span class="tok-type">string</span> t) {' },
    { line: 4,  code: '        <span class="tok-type">unordered_map</span>&lt;<span class="tok-kw">char</span>, <span class="tok-kw">int</span>&gt; need, window;' },
    { line: 5,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> c : t) need[c]++;' },
    { line: 6,  code: '        <span class="tok-kw">int</span> left = <span class="tok-num">0</span>, right = <span class="tok-num">0</span>, valid = <span class="tok-num">0</span>;' },
    { line: 7,  code: '        <span class="tok-kw">int</span> start = <span class="tok-num">0</span>, minLen = INT_MAX;' },
    { line: 8,  code: '        <span class="tok-kw">while</span> (right &lt; s.<span class="tok-fn">size</span>()) {' },
    { line: 9,  code: '            <span class="tok-kw">char</span> c = s[right++];' },
    { line: 10, code: '            <span class="tok-kw">if</span> (need.<span class="tok-fn">count</span>(c)) {' },
    { line: 11, code: '                <span class="tok-kw">if</span> (++window[c] == need[c]) valid++;' },
    { line: 12, code: '            }' },
    { line: 13, code: '            <span class="tok-kw">while</span> (valid == need.<span class="tok-fn">size</span>()) {' },
    { line: 14, code: '                <span class="tok-kw">if</span> (right - left &lt; minLen) { start = left; minLen = right - left; }' },
    { line: 15, code: '                <span class="tok-kw">char</span> d = s[left++];' },
    { line: 16, code: '                <span class="tok-kw">if</span> (need.<span class="tok-fn">count</span>(d)) {' },
    { line: 17, code: '                    <span class="tok-kw">if</span> (window[d]-- == need[d]) valid--;' },
    { line: 18, code: '                }' },
    { line: 19, code: '            }' },
    { line: 20, code: '        }' },
    { line: 21, code: '        <span class="tok-kw">return</span> minLen == INT_MAX ? <span class="tok-num">""</span> : s.<span class="tok-fn">substr</span>(start, minLen);' },
    { line: 22, code: '    }' },
    { line: 23, code: '};' }
  ],

  generateTrace(s, t) {
    const steps = [];
    const chars = String(s).split("");
    const need = {};
    const windowMap = {};
    for (const c of String(t)) {
      need[c] = (need[c] || 0) + 1;
      windowMap[c] = 0;
    }
    const needKeys = Object.keys(need);
    let left = 0;
    let right = 0;
    let valid = 0;
    let start = 0;
    let minLen = Infinity;

    const buildSnap = (lIdx, rIdx, activeChar, retStr = "-", connectors = []) => {
      const hl = [];
      const match = [];
      for (let i = lIdx; i < rIdx; i++) hl.push(i);
      if (minLen < Infinity) {
        for (let i = start; i < start + minLen; i++) {
          if (retStr !== "-") match.push(i);
        }
      }
      const pointers = [];
      if (lIdx < chars.length) pointers.push({ idx: lIdx, label: `L=${lIdx}`, color: "blue" });
      if (rIdx - 1 >= 0 && rIdx - 1 < chars.length) {
        pointers.push({ idx: rIdx - 1, label: `R=${rIdx - 1}`, color: "purple" });
      }

      const dictRows = needKeys.map((k) => {
        const wv = windowMap[k] || 0;
        const nv = need[k];
        const met = wv >= nv;
        return {
          id: k,
          key: `'${k}'`,
          val: `${wv} / ${nv}`,
          note: met ? "✓ 已達標" : `差 ${nv - wv} 個`,
          status: met ? "hit" : k === activeChar ? "inserted" : ""
        };
      });

      const bestWin = minLen === Infinity ? "尚未找到" : `"${s.slice(start, start + minLen)}" (len=${minLen})`;

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `字串 s (當前視窗 [${lIdx}, ${Math.max(lIdx, rIdx - 1)}])`,
            x: 325,
            y: 52,
            values: chars,
            hl,
            match,
            done: Array.from({ length: lIdx }, (_, i) => i),
            pointers
          },
          {
            id: "win",
            type: "dict",
            name: "window / need",
            typeLabel: `目標 t = "${t}" 頻率統計`,
            x: 325,
            y: 215,
            headers: ["字元", "window / need", "狀態"],
            rows: dictRows
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "滑動視窗變數",
            x: 24,
            y: 215,
            items: [
              { id: "valid", name: "valid", val: `${valid} / ${needKeys.length}`, status: valid === needKeys.length ? "match" : "hl" },
              { id: "best", name: "minWindow", val: bestWin, status: minLen < Infinity ? "hl" : "" },
              { id: "ret", name: "return", val: retStr, status: retStr !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 5,
      tag: "統計目標字元頻率",
      tagType: "default",
      inlineBadge: `need.size() = ${needKeys.length}`,
      explanation: `統計目標字串 t = "${t}" 的字元需求表 need，共有 ${needKeys.length} 種字元需要達標。`,
      vars: { left: "0", right: "0", valid: `0/${needKeys.length}`, minLen: "INF", return: "-" },
      state: buildSnap(0, 0, null)
    });

    while (right < chars.length) {
      const c = chars[right];
      right++;
      const rCellIdx = right - 1;

      if (need[c] !== undefined) {
        windowMap[c]++;
        const justMet = windowMap[c] === need[c];
        if (justMet) valid++;

        steps.push({
          line: 11,
          tag: "右指標擴張命中需求字元",
          tagType: justMet ? "tag-found" : "tag-insert",
          inlineBadge: `s[${rCellIdx}]='${c}', window['${c}']=${windowMap[c]}`,
          explanation: `右指標納入 s[${rCellIdx}] = '${c}'，視窗內 '${c}' 數量增為 ${windowMap[c]}/${need[c]}${justMet ? `，valid 增為 ${valid}/${needKeys.length}！` : "。"}`,
          vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: minLen === Infinity ? "INF" : String(minLen), return: "-" },
          state: buildSnap(left, right, c, "-", [
            { from: `wb-cw-s-${rCellIdx}`, to: `wb-dict-row-${c}`, label: `window['${c}']++`, color: justMet ? "green" : "purple" }
          ])
        });
      } else {
        steps.push({
          line: 9,
          tag: "右指標擴張視窗",
          tagType: "default",
          inlineBadge: `s[${rCellIdx}]='${c}' (非目標字元)`,
          explanation: `右指標納入 s[${rCellIdx}] = '${c}'，不在 need 中，繼續向右擴張。`,
          vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: minLen === Infinity ? "INF" : String(minLen), return: "-" },
          state: buildSnap(left, right, null)
        });
      }

      while (valid === needKeys.length) {
        const curLen = right - left;
        if (curLen < minLen) {
          start = left;
          minLen = curLen;
          steps.push({
            line: 14,
            tag: "更新最小覆蓋視窗",
            tagType: "tag-found",
            inlineBadge: `minLen = ${minLen} ("${s.slice(start, start + minLen)}")`,
            explanation: `視窗 [${left}, ${right - 1}] 已涵蓋 t 所有字元，長度 ${curLen} 更短，更新最小子字串為 "${s.slice(start, start + minLen)}"！`,
            vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: String(minLen), return: "-" },
            state: buildSnap(left, right, null, "-", [
              { from: `wb-cw-s-${left}`, to: "wb-var-best", label: `最佳視窗 "${s.slice(start, start + minLen)}"`, color: "green" }
            ])
          });
        }

        const d = chars[left];
        const oldLeft = left;
        left++;
        if (need[d] !== undefined) {
          if (windowMap[d] === need[d]) valid--;
          windowMap[d]--;
          steps.push({
            line: 17,
            tag: "左指標收縮視窗",
            tagType: "tag-check",
            inlineBadge: `移除 s[${oldLeft}]='${d}', valid=${valid}/${needKeys.length}`,
            explanation: `左指標右移移除 s[${oldLeft}] = '${d}'，window['${d}'] 減為 ${windowMap[d]}/${need[d]}，valid 變為 ${valid}/${needKeys.length}。`,
            vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: String(minLen), return: "-" },
            state: buildSnap(left, right, d)
          });
        } else {
          steps.push({
            line: 15,
            tag: "左指標收縮非目標字元",
            tagType: "default",
            inlineBadge: `移除 s[${oldLeft}]='${d}'`,
            explanation: `左指標右移移除非目標字元 s[${oldLeft}] = '${d}'，繼續嘗試收縮視窗以尋找更短解。`,
            vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: String(minLen), return: "-" },
            state: buildSnap(left, right, null)
          });
        }
      }
    }

    const ans = minLen === Infinity ? '""' : `"${s.slice(start, start + minLen)}"`;
    steps.push({
      line: 21,
      tag: "回傳最小覆蓋子字串",
      tagType: "tag-found",
      inlineBadge: `return ${ans}`,
      explanation: minLen === Infinity
        ? `掃描結束仍未湊齊目標字串 t，回傳空字串 ""。`
        : `掃描結束，最小覆蓋子字串為 ${ans}（起點 ${start}，長度 ${minLen}）。`,
      vars: { left: String(left), right: String(right), valid: `${valid}/${needKeys.length}`, minLen: minLen === Infinity ? "INF" : String(minLen), return: ans },
      state: buildSnap(left, right, null, ans)
    });

    return steps;
  }
};

// ============================================================================
// #68 Serialize and Deserialize Binary Tree (LC #297, Hard)
// ============================================================================
window.PROBLEMS["serialize-and-deserialize-binary-tree"] = {
  id: 68,
  leetcodeId: 297,
  slug: "serialize-and-deserialize-binary-tree",
  title: "297. Serialize and Deserialize Binary Tree (二元樹的序列化與反序列化)",
  difficulty: "Hard",
  topic: "Binary Tree",
  mins: 40,
  complexity: "Time O(N) · Space O(N)",
  argNames: ["root"],
  description:
    "設計一個演算法將二元樹序列化 (serialize) 為字串，並能將該字串反序列化 (deserialize) 還原為原始的二元樹結構。採用前序走訪 (Preorder Traversal) 將空指標記為 \"#\"，反序列化時以佇列或指標依序讀取 token 遞迴重建左右子樹。",

  presets: [
    { name: "範例 1：標準二元樹 [1, 2, 3, null, null, 4, 5]", args: [[1, 2, 3, null, null, 4, 5]] },
    { name: "範例 2：平衡樹 [4, 2, 7, 1, 3]", args: [[4, 2, 7, 1, 3]] },
    { name: "範例 3：右傾偏斜樹 [1, null, 2, null, 3]", args: [[1, null, 2, null, 3]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Codec</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">string</span> <span class="tok-fn">serialize</span>(<span class="tok-type">TreeNode</span>* root) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (!root) <span class="tok-kw">return</span> <span class="tok-num">"#"</span>;' },
    { line: 5,  code: '        <span class="tok-kw">return</span> <span class="tok-fn">to_string</span>(root-&gt;val) + <span class="tok-num">","</span> + <span class="tok-fn">serialize</span>(root-&gt;left) + <span class="tok-num">","</span> + <span class="tok-fn">serialize</span>(root-&gt;right);' },
    { line: 6,  code: '    }' },
    { line: 7,  code: '    <span class="tok-type">TreeNode</span>* <span class="tok-fn">deserialize</span>(<span class="tok-type">string</span> data) {' },
    { line: 8,  code: '        <span class="tok-type">stringstream</span> ss(data);' },
    { line: 9,  code: '        <span class="tok-kw">return</span> <span class="tok-fn">build</span>(ss);' },
    { line: 10, code: '    }' },
    { line: 11, code: '    <span class="tok-type">TreeNode</span>* <span class="tok-fn">build</span>(<span class="tok-type">stringstream</span>&amp; ss) {' },
    { line: 12, code: '        <span class="tok-type">string</span> tok; <span class="tok-fn">getline</span>(ss, tok, <span class="tok-num">\'\\,\'</span>);' },
    { line: 13, code: '        <span class="tok-kw">if</span> (tok == <span class="tok-num">"#"</span>) <span class="tok-kw">return</span> <span class="tok-kw">nullptr</span>;' },
    { line: 14, code: '        <span class="tok-type">TreeNode</span>* node = <span class="tok-kw">new</span> <span class="tok-type">TreeNode</span>(<span class="tok-fn">stoi</span>(tok));' },
    { line: 15, code: '        node-&gt;left = <span class="tok-fn">build</span>(ss);' },
    { line: 16, code: '        node-&gt;right = <span class="tok-fn">build</span>(ss);' },
    { line: 17, code: '        <span class="tok-kw">return</span> node;' },
    { line: 18, code: '    }' },
    { line: 19, code: '};' }
  ],

  generateTrace(rootArr) {
    const steps = [];
    const tree = buildTreeFromLevelOrder(rootArr, 620);
    const tokens = [];
    const serializedIds = new Set();
    const rebuiltIds = new Set();

    const makeBoard = (phase, activeNodeId, activeTokIdx, statusText, connectors = []) => {
      const nodes = tree.nodes.map((n) => {
        let status = "";
        if (n.id === activeNodeId) status = "hl";
        else if (phase === "deserialize" && rebuiltIds.has(n.id)) status = "match";
        else if (phase === "serialize" && serializedIds.has(n.id)) status = "done";
        return {
          id: n.id,
          val: String(n.val),
          sub: phase === "deserialize" && rebuiltIds.has(n.id) ? "已重建" : "",
          x: n.x,
          y: n.y,
          status,
          ptr: n.id === activeNodeId ? (phase === "serialize" ? "ser" : "build") : ""
        };
      });

      const edges = tree.edges.map((e) => ({
        ...e,
        status: phase === "deserialize" && rebuiltIds.has(e.from) && rebuiltIds.has(e.to) ? "match" : ""
      }));

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: phase === "serialize" ? "原始二元樹 (序列化中)" : "重建二元樹 (反序列化中)",
            x: 325,
            y: 52,
            width: tree.width,
            height: tree.height,
            nodes,
            edges
          },
          {
            id: "tokens",
            type: "array",
            name: "data_tokens",
            typeLabel: "前序序列化 Token 串流",
            x: 325,
            y: Math.max(340, 52 + tree.height + 22),
            values: [...tokens],
            hl: activeTokIdx >= 0 ? [activeTokIdx] : [],
            done: phase === "deserialize" && activeTokIdx > 0 ? Array.from({ length: activeTokIdx }, (_, i) => i) : [],
            pointers: activeTokIdx >= 0 ? [{ idx: activeTokIdx, label: phase === "serialize" ? "寫入" : "讀取", color: phase === "serialize" ? "purple" : "green" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "codec_state",
            typeLabel: "Codec 階段與字串",
            x: 24,
            y: 215,
            items: [
              { id: "phase", name: "phase", val: phase, status: "hl" },
              { id: "data", name: "data", val: tokens.length ? `"${tokens.join(",")}"` : '""', status: phase === "done" ? "match" : "" },
              { id: "info", name: "status", val: statusText, status: phase === "done" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    // Phase 1: Serialize
    function dfsSerialize(node, branchLabel) {
      if (!node) {
        tokens.push("#");
        const tIdx = tokens.length - 1;
        steps.push({
          line: 4,
          tag: "序列化空節點 #",
          tagType: "default",
          inlineBadge: `${branchLabel} == nullptr ➜ "#"`,
          explanation: `${branchLabel} 為空指標 nullptr，於序列化串流寫入 "#" 標記空子樹邊界。`,
          vars: { phase: "serialize", node: "nullptr", token: '"#"', tokensCount: String(tokens.length) },
          state: makeBoard("serialize", null, tIdx, `寫入空節點 "#"`)
        });
        return;
      }

      serializedIds.add(node.id);
      tokens.push(String(node.val));
      const tIdx = tokens.length - 1;
      steps.push({
        line: 5,
        tag: "序列化節點數值",
        tagType: "tag-insert",
        inlineBadge: `寫入 "${node.val}"`,
        explanation: `前序走訪至節點 ${node.val}，將 "${node.val}" 寫入序列化串流第 ${tIdx} 格，接著遞迴序列化其左、右子樹。`,
        vars: { phase: "serialize", node: String(node.val), token: `"${node.val}"`, tokensCount: String(tokens.length) },
        state: makeBoard("serialize", node.id, tIdx, `序列化 Node(${node.val})`, [
          { from: `wb-node-tree-${node.id}`, to: `wb-cw-tokens-${tIdx}`, label: `輸出 "${node.val}"`, color: "purple" }
        ])
      });

      dfsSerialize(node.left, `Node(${node.val})->left`);
      dfsSerialize(node.right, `Node(${node.val})->right`);
    }

    dfsSerialize(tree.root, "root");

    // Phase 2: Deserialize
    let readCursor = 0;
    function dfsDeserialize(node) {
      const tIdx = readCursor++;
      const tok = tokens[tIdx];
      if (!node || tok === "#") {
        steps.push({
          line: 13,
          tag: "讀取 # 回傳 nullptr",
          tagType: "tag-check",
          inlineBadge: `tok = "#" ➜ nullptr`,
          explanation: `從串流索引 ${tIdx} 讀取到 "#"，代表此子樹為空，回傳 nullptr。`,
          vars: { phase: "deserialize", node: "nullptr", token: '"#"', cursor: String(tIdx) },
          state: makeBoard("deserialize", null, tIdx, `讀取 "#" -> nullptr`)
        });
        return;
      }

      rebuiltIds.add(node.id);
      steps.push({
        line: 14,
        tag: "反序列化建立節點",
        tagType: "tag-found",
        inlineBadge: `new TreeNode(${tok})`,
        explanation: `從串流索引 ${tIdx} 讀取 "${tok}"，建立新節點 TreeNode(${tok})，接著遞迴重建左子樹與右子樹。`,
        vars: { phase: "deserialize", node: String(node.val), token: `"${tok}"`, cursor: String(tIdx) },
        state: makeBoard("deserialize", node.id, tIdx, `重建 Node(${tok})`, [
          { from: `wb-cw-tokens-${tIdx}`, to: `wb-node-tree-${node.id}`, label: `new Node(${tok})`, color: "green" }
        ])
      });

      dfsDeserialize(node.left);
      dfsDeserialize(node.right);
    }

    dfsDeserialize(tree.root);

    steps.push({
      line: 17,
      tag: "完成反序列化還原",
      tagType: "tag-found",
      inlineBadge: `return root (${rebuiltIds.size} 節點)`,
      explanation: `所有 ${tokens.length} 個前序 token 解析完畢，完整還原原始二元樹結構！`,
      vars: { phase: "done", node: tree.root ? String(tree.root.val) : "nullptr", token: "EOF", cursor: String(tokens.length) },
      state: makeBoard("done", null, -1, "完整還原二元樹 ✓")
    });

    return steps;
  }
};

// ============================================================================
// #69 Trapping Rain Water (LC #42, Hard)
// ============================================================================
window.PROBLEMS["trapping-rain-water"] = {
  id: 69,
  leetcodeId: 42,
  slug: "trapping-rain-water",
  title: "42. Trapping Rain Water (接雨水)",
  difficulty: "Hard",
  topic: "Stack",
  mins: 35,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["height"],
  description:
    "給定 n 個非負整數表示每個寬度為 1 的柱子的高度圖，計算下雨後能接多少雨水。採用 O(1) 空間的雙指標法 (left, right) 維護左側最高牆 leftMax 與右側最高牆 rightMax，每次移動較矮的一側並累加該格可接水量。",

  presets: [
    { name: "範例 1：經典測資 [0,1,0,2,1,0,1,3,2,1,2,1]", args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]] },
    { name: "範例 2：深谷凹槽 [4, 2, 0, 3, 2, 5]", args: [[4, 2, 0, 3, 2, 5]] },
    { name: "範例 3：雙峰包夾 [3, 0, 2, 0, 4]", args: [[3, 0, 2, 0, 4]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">trap</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; height) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> left = <span class="tok-num">0</span>, right = height.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">int</span> leftMax = <span class="tok-num">0</span>, rightMax = <span class="tok-num">0</span>, water = <span class="tok-num">0</span>;' },
    { line: 6,  code: '        <span class="tok-kw">while</span> (left &lt; right) {' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (height[left] &lt; height[right]) {' },
    { line: 8,  code: '                leftMax = <span class="tok-fn">max</span>(leftMax, height[left]);' },
    { line: 9,  code: '                water += leftMax - height[left];' },
    { line: 10, code: '                left++;' },
    { line: 11, code: '            } <span class="tok-kw">else</span> {' },
    { line: 12, code: '                rightMax = <span class="tok-fn">max</span>(rightMax, height[right]);' },
    { line: 13, code: '                water += rightMax - height[right];' },
    { line: 14, code: '                right--;' },
    { line: 15, code: '            }' },
    { line: 16, code: '        }' },
    { line: 17, code: '        <span class="tok-kw">return</span> water;' },
    { line: 18, code: '    }' },
    { line: 19, code: '};' }
  ],

  generateTrace(heightInput) {
    const steps = [];
    const height = heightInput.map(Number);
    const n = height.length;
    const trapped = new Array(n).fill(0);
    const processed = new Set();
    let left = 0;
    let right = n - 1;
    let leftMax = 0;
    let rightMax = 0;
    let water = 0;

    const snap = (activeIdx, retVal = "-", connectors = []) => {
      const matchWater = [];
      trapped.forEach((w, idx) => {
        if (w > 0) matchWater.push(idx);
      });
      return {
        boards: [
          {
            id: "height",
            type: "array",
            name: "height",
            typeLabel: "柱子高度 (vector<int>)",
            x: 325,
            y: 52,
            values: height,
            hl: activeIdx >= 0 ? [activeIdx] : [left, right],
            done: Array.from(processed),
            pointers: [
              { idx: left, label: `L=${left}`, color: "blue" },
              { idx: right, label: `R=${right}`, color: "red" }
            ]
          },
          {
            id: "water",
            type: "array",
            name: "trapped_at_i",
            typeLabel: "各柱上方接水量",
            x: 325,
            y: 198,
            values: [...trapped],
            hl: activeIdx >= 0 ? [activeIdx] : [],
            match: matchWater
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "雙指標與最高擋水牆",
            x: 24,
            y: 215,
            items: [
              { id: "lmax", name: "leftMax", val: String(leftMax), status: "hl" },
              { id: "rmax", name: "rightMax", val: String(rightMax), status: "hl" },
              { id: "tot", name: "water (總水量)", val: String(water), status: water > 0 ? "match" : "" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 4,
      tag: "初始化左右雙指標",
      tagType: "default",
      inlineBadge: `left = 0, right = ${right}`,
      explanation: `初始化 left = 0、right = ${right}，leftMax = 0、rightMax = 0，準備從兩端向中間夾逼計算接水量。`,
      vars: { left: String(left), right: String(right), leftMax: "0", rightMax: "0", water: "0" },
      state: snap(-1)
    });

    while (left < right) {
      if (height[left] < height[right]) {
        const curIdx = left;
        leftMax = Math.max(leftMax, height[left]);
        const add = leftMax - height[left];
        trapped[curIdx] = add;
        water += add;
        processed.add(curIdx);

        steps.push({
          line: 9,
          tag: add > 0 ? `左側接水 +${add}` : "更新左側最高牆",
          tagType: add > 0 ? "tag-found" : "tag-check",
          inlineBadge: `leftMax=${leftMax}, +${add} (總水量=${water})`,
          explanation: `因 height[left]=${height[curIdx]} < height[right]=${height[right]}，瓶頸在左側：leftMax = ${leftMax}，位置 ${curIdx} 可接水 ${leftMax} - ${height[curIdx]} = ${add} 格，left 右移。`,
          vars: { left: String(left + 1), right: String(right), leftMax: String(leftMax), rightMax: String(rightMax), water: String(water) },
          state: snap(curIdx, "-", [
            { from: `wb-cw-height-${curIdx}`, to: `wb-cw-water-${curIdx}`, label: `+${add} 水量`, color: add > 0 ? "green" : "blue" }
          ])
        });
        left++;
      } else {
        const curIdx = right;
        rightMax = Math.max(rightMax, height[right]);
        const add = rightMax - height[right];
        trapped[curIdx] = add;
        water += add;
        processed.add(curIdx);

        steps.push({
          line: 13,
          tag: add > 0 ? `右側接水 +${add}` : "更新右側最高牆",
          tagType: add > 0 ? "tag-found" : "tag-check",
          inlineBadge: `rightMax=${rightMax}, +${add} (總水量=${water})`,
          explanation: `因 height[left]=${height[left]} >= height[right]=${height[curIdx]}，瓶頸在右側：rightMax = ${rightMax}，位置 ${curIdx} 可接水 ${rightMax} - ${height[curIdx]} = ${add} 格，right 左移。`,
          vars: { left: String(left), right: String(right - 1), leftMax: String(leftMax), rightMax: String(rightMax), water: String(water) },
          state: snap(curIdx, "-", [
            { from: `wb-cw-height-${curIdx}`, to: `wb-cw-water-${curIdx}`, label: `+${add} 水量`, color: add > 0 ? "green" : "blue" }
          ])
        });
        right--;
      }
    }

    steps.push({
      line: 17,
      tag: "雙指標相遇回傳總水量",
      tagType: "tag-found",
      inlineBadge: `return ${water}`,
      explanation: `left 與 right 於索引 ${left} 相遇，總計可接雨水 ${water} 單位。`,
      vars: { left: String(left), right: String(right), leftMax: String(leftMax), rightMax: String(rightMax), water: String(water) },
      state: snap(-1, water)
    });

    return steps;
  }
};

// ============================================================================
// #70 Find Median from Data Stream (LC #295, Hard)
// ============================================================================
window.PROBLEMS["find-median-from-data-stream"] = {
  id: 70,
  leetcodeId: 295,
  slug: "find-median-from-data-stream",
  title: "295. Find Median from Data Stream (資料流的中位數)",
  difficulty: "Hard",
  topic: "Heap",
  mins: 30,
  complexity: "Time O(log N) addNum / O(1) findMedian · Space O(N)",
  argNames: ["stream"],
  description:
    "設計一個支援動態新增數字 addNum(num) 與即時查詢中位數 findMedian() 的資料結構。使用兩個堆積：最大堆 maxHeap 儲存較小的一半數字（堆頂為左半最大值），最小堆 minHeap 儲存較大的一半數字（堆頂為右半最小值），並維持兩堆大小差距不超過 1。",

  presets: [
    { name: "範例 1：遞增資料流 [1, 2, 3, 4, 5]", args: [[1, 2, 3, 4, 5]] },
    { name: "範例 2：亂序擺盪資料流 [5, 2, 8, 1, 9, 3]", args: [[5, 2, 8, 1, 9, 3]] },
    { name: "範例 3：偶數個元素 [10, 4, 6, 2]", args: [[10, 4, 6, 2]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">MedianFinder</span> {' },
    { line: 2,  code: '    <span class="tok-type">priority_queue</span>&lt;<span class="tok-kw">int</span>&gt; maxHeap; <span class="tok-cmt">// 較小半邊 (Top 最大)</span>' },
    { line: 3,  code: '    <span class="tok-type">priority_queue</span>&lt;<span class="tok-kw">int</span>, <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;, <span class="tok-type">greater</span>&lt;<span class="tok-kw">int</span>&gt;&gt; minHeap; <span class="tok-cmt">// 較大半邊</span>' },
    { line: 4,  code: '<span class="tok-kw">public</span>:' },
    { line: 5,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">addNum</span>(<span class="tok-kw">int</span> num) {' },
    { line: 6,  code: '        maxHeap.<span class="tok-fn">push</span>(num);' },
    { line: 7,  code: '        minHeap.<span class="tok-fn">push</span>(maxHeap.<span class="tok-fn">top</span>()); maxHeap.<span class="tok-fn">pop</span>();' },
    { line: 8,  code: '        <span class="tok-kw">if</span> (minHeap.<span class="tok-fn">size</span>() &gt; maxHeap.<span class="tok-fn">size</span>()) {' },
    { line: 9,  code: '            maxHeap.<span class="tok-fn">push</span>(minHeap.<span class="tok-fn">top</span>()); minHeap.<span class="tok-fn">pop</span>();' },
    { line: 10, code: '        }' },
    { line: 11, code: '    }' },
    { line: 12, code: '    <span class="tok-kw">double</span> <span class="tok-fn">findMedian</span>() {' },
    { line: 13, code: '        <span class="tok-kw">if</span> (maxHeap.<span class="tok-fn">size</span>() &gt; minHeap.<span class="tok-fn">size</span>()) <span class="tok-kw">return</span> maxHeap.<span class="tok-fn">top</span>();' },
    { line: 14, code: '        <span class="tok-kw">return</span> (maxHeap.<span class="tok-fn">top</span>() + minHeap.<span class="tok-fn">top</span>()) / <span class="tok-num">2.0</span>;' },
    { line: 15, code: '    }' },
    { line: 16, code: '};' }
  ],

  generateTrace(streamInput) {
    const steps = [];
    const stream = streamInput.map(Number);
    const maxHeap = []; // sorted descending: maxHeap[0] is top
    const minHeap = []; // sorted ascending: minHeap[0] is top

    const sortHeaps = () => {
      maxHeap.sort((a, b) => b - a);
      minHeap.sort((a, b) => a - b);
    };

    const snap = (curIdx, medianStr, connectors = []) => ({
      boards: [
        {
          id: "stream",
          type: "array",
          name: "stream",
          typeLabel: "輸入資料流",
          x: 325,
          y: 52,
          values: stream,
          hl: curIdx >= 0 ? [curIdx] : [],
          done: curIdx > 0 ? Array.from({ length: curIdx }, (_, i) => i) : [],
          pointers: curIdx >= 0 ? [{ idx: curIdx, label: `num=${stream[curIdx]}`, color: "blue" }] : []
        },
        {
          id: "maxh",
          type: "queue",
          name: "maxHeap (左半較小值)",
          typeLabel: "最大堆 (top 在最左)",
          x: 325,
          y: 195,
          leftLabel: "top (最大) ←",
          rightLabel: "← 較小元素",
          items: maxHeap.map((v, idx) => ({ val: v, status: idx === 0 ? "hl" : "" }))
        },
        {
          id: "minh",
          type: "queue",
          name: "minHeap (右半較大值)",
          typeLabel: "最小堆 (top 在最左)",
          x: 615,
          y: 195,
          leftLabel: "top (最小) ←",
          rightLabel: "← 較大元素",
          items: minHeap.map((v, idx) => ({ val: v, status: idx === 0 ? "hl" : "" }))
        },
        {
          id: "vars",
          type: "vars",
          name: "median_vars",
          typeLabel: "雙堆狀態與即時中位數",
          x: 24,
          y: 215,
          items: [
            { id: "ltop", name: "maxHeap.top()", val: maxHeap.length ? String(maxHeap[0]) : "-", status: maxHeap.length ? "hl" : "" },
            { id: "rtop", name: "minHeap.top()", val: minHeap.length ? String(minHeap[0]) : "-", status: minHeap.length ? "hl" : "" },
            { id: "med", name: "findMedian()", val: medianStr, status: medianStr !== "-" ? "match" : "" }
          ]
        }
      ],
      connectors
    });

    for (let i = 0; i < stream.length; i++) {
      const num = stream[i];
      maxHeap.push(num);
      sortHeaps();

      const movedToMin = maxHeap.shift();
      minHeap.push(movedToMin);
      sortHeaps();

      steps.push({
        line: 7,
        tag: `addNum(${num}) 推入與轉移`,
        tagType: "tag-insert",
        inlineBadge: `num=${num} 經 maxHeap 篩選將 ${movedToMin} 推入 minHeap`,
        explanation: `先將 ${num} 推入 maxHeap，再將左半最大值 ${movedToMin} 彈出並推入右半 minHeap，確保右半所有元素 >= 左半。`,
        vars: { num: String(num), "maxHeap.size": String(maxHeap.length), "minHeap.size": String(minHeap.length), median: "-" },
        state: snap(i, "-", [
          { from: `wb-cw-stream-${i}`, to: "wb-queue-minh-0", label: `篩選至 minHeap`, color: "purple" }
        ])
      });

      if (minHeap.length > maxHeap.length) {
        const rebalanceVal = minHeap.shift();
        maxHeap.push(rebalanceVal);
        sortHeaps();
        steps.push({
          line: 9,
          tag: "平衡兩堆大小",
          tagType: "tag-check",
          inlineBadge: `minHeap.top()=${rebalanceVal} 移回 maxHeap`,
          explanation: `因 minHeap.size() > maxHeap.size()，將 minHeap 堆頂 ${rebalanceVal} 移回 maxHeap，保持 maxHeap 比 minHeap 多 1 個元素。`,
          vars: { num: String(num), "maxHeap.size": String(maxHeap.length), "minHeap.size": String(minHeap.length), median: "-" },
          state: snap(i, "-", [
            { from: "wb-queue-maxh-0", to: "wb-var-ltop", label: `maxHeap.top()=${maxHeap[0]}`, color: "blue" }
          ])
        });
      }

      const isOdd = maxHeap.length > minHeap.length;
      const medVal = isOdd ? maxHeap[0] : (maxHeap[0] + minHeap[0]) / 2;
      const medStr = Number.isInteger(medVal) ? `${medVal}.0` : String(medVal);

      steps.push({
        line: isOdd ? 13 : 14,
        tag: `findMedian() = ${medStr}`,
        tagType: "tag-found",
        inlineBadge: isOdd ? `奇數個：maxHeap.top() = ${medStr}` : `偶數個：(${maxHeap[0]} + ${minHeap[0]}) / 2.0 = ${medStr}`,
        explanation: isOdd
          ? `目前共 ${i + 1} 個數（奇數），中位數直接取 maxHeap 堆頂 = ${medStr}。`
          : `目前共 ${i + 1} 個數（偶數），中位數取兩堆頂平均 (${maxHeap[0]} + ${minHeap[0]}) / 2.0 = ${medStr}。`,
        vars: { num: String(num), "maxHeap.size": String(maxHeap.length), "minHeap.size": String(minHeap.length), median: medStr },
        state: snap(i, medStr, [
          { from: "wb-queue-maxh-0", to: "wb-var-med", label: `中位數 = ${medStr}`, color: "green" }
        ])
      });
    }

    return steps;
  }
};

// ============================================================================
// #71 Word Ladder (LC #127, Hard)
// ============================================================================
window.PROBLEMS["word-ladder"] = {
  id: 71,
  leetcodeId: 127,
  slug: "word-ladder",
  title: "127. Word Ladder (單詞接龍)",
  difficulty: "Hard",
  topic: "Graph",
  mins: 45,
  complexity: "Time O(M² × N) · Space O(M × N)",
  argNames: ["beginWord", "endWord", "wordList"],
  description:
    "給定 beginWord、endWord 和字典 wordList，每次只能改變一個字母，且中間單詞必須存在於字典中，求從 beginWord 到 endWord 的最短轉換序列長度。將單詞視為圖節點、相差 1 字母視為無向邊，以廣度優先搜尋 (BFS) 逐層尋找最短路徑。",

  presets: [
    { name: "範例 1：hit -> cog (長度 5)", args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]] },
    { name: "範例 2：終點不在字典中 (回傳 0)", args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]] },
    { name: "範例 3：cat -> dog (長度 4)", args: ["cat", "dog", ["cot", "cog", "dog", "bat"]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">ladderLength</span>(<span class="tok-type">string</span> beginWord, <span class="tok-type">string</span> endWord, <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&amp; wordList) {' },
    { line: 4,  code: '        <span class="tok-type">unordered_set</span>&lt;<span class="tok-type">string</span>&gt; dict(wordList.<span class="tok-fn">begin</span>(), wordList.<span class="tok-fn">end</span>());' },
    { line: 5,  code: '        <span class="tok-kw">if</span> (!dict.<span class="tok-fn">count</span>(endWord)) <span class="tok-kw">return</span> <span class="tok-num">0</span>;' },
    { line: 6,  code: '        <span class="tok-type">queue</span>&lt;<span class="tok-type">string</span>&gt; q; q.<span class="tok-fn">push</span>(beginWord);' },
    { line: 7,  code: '        <span class="tok-kw">int</span> level = <span class="tok-num">1</span>;' },
    { line: 8,  code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {' },
    { line: 9,  code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> sz = q.<span class="tok-fn">size</span>(); sz &gt; <span class="tok-num">0</span>; --sz) {' },
    { line: 10, code: '                <span class="tok-type">string</span> word = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();' },
    { line: 11, code: '                <span class="tok-kw">if</span> (word == endWord) <span class="tok-kw">return</span> level;' },
    { line: 12, code: '                <span class="tok-kw">for</span> (<span class="tok-type">string</span> next : <span class="tok-fn">getNeighbors</span>(word, dict)) {' },
    { line: 13, code: '                    q.<span class="tok-fn">push</span>(next); dict.<span class="tok-fn">erase</span>(next);' },
    { line: 14, code: '                }' },
    { line: 15, code: '            }' },
    { line: 16, code: '            level++;' },
    { line: 17, code: '        }' },
    { line: 18, code: '        <span class="tok-kw">return</span> <span class="tok-num">0</span>;' },
    { line: 19, code: '    }' },
    { line: 20, code: '};' }
  ],

  generateTrace(beginWord, endWord, wordList) {
    const steps = [];
    const dict = new Set(wordList);
    const allWords = [beginWord, ...wordList.filter((w) => w !== beginWord)];
    const wordLevels = { [beginWord]: 1 };
    const parentEdge = {};
    const visited = new Set([beginWord]);
    const queue = [beginWord];

    const diffOne = (a, b) => {
      if (a.length !== b.length) return false;
      let d = 0;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) d++;
      }
      return d === 1;
    };

    const snap = (currWord, level, retVal = "-") => {
      const nodes = allWords.map((w, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const lv = wordLevels[w];
        let status = "";
        if (w === endWord && retVal !== "-" && retVal !== "0") status = "match";
        else if (w === currWord) status = "hl";
        else if (visited.has(w)) status = "done";
        return {
          id: w,
          val: w,
          sub: lv ? `L${lv}` : "",
          x: 52 + col * 105,
          y: 46 + row * 85,
          status,
          ptr: w === currWord ? "word" : ""
        };
      });

      const edges = [];
      for (let i = 0; i < allWords.length; i++) {
        for (let j = i + 1; j < allWords.length; j++) {
          const u = allWords[i];
          const v = allWords[j];
          if (diffOne(u, v)) {
            const isTreeEdge = parentEdge[v] === u || parentEdge[u] === v;
            edges.push({
              from: u,
              to: v,
              dir: false,
              status: isTreeEdge ? "hl" : ""
            });
          }
        }
      }

      return {
        boards: [
          {
            id: "graph",
            type: "graph",
            shape: "graph",
            name: "word_graph",
            typeLabel: "單詞 1-字母轉換圖 (BFS 層級)",
            x: 325,
            y: 52,
            width: 440,
            height: allWords.length > 4 ? 185 : 115,
            nodes,
            edges
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "BFS 佇列 (queue<string>)",
            x: 325,
            y: 280,
            items: queue.map((w, idx) => ({ val: `"${w}"`, status: idx === 0 ? "hl" : "" }))
          },
          {
            id: "dict",
            type: "set",
            name: "dict",
            typeLabel: "尚未走訪的字典集合 (unordered_set)",
            x: 610,
            y: 280,
            items: Array.from(dict).map((w) => ({ val: `"${w}"`, status: w === endWord ? "hl" : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "bfs_vars",
            typeLabel: "BFS 狀態變數",
            x: 24,
            y: 215,
            items: [
              { id: "lv", name: "level", val: String(level), status: "hl" },
              { id: "cw", name: "word", val: currWord ? `"${currWord}"` : "-", status: currWord === endWord ? "match" : "hl" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 4,
      tag: "建立字典雜湊集合",
      tagType: "default",
      inlineBadge: `dict.size() = ${dict.size}`,
      explanation: `將 wordList 轉入 unordered_set<string> dict（共 ${dict.size} 個單詞），支援 O(1) 查找與刪除。`,
      vars: { level: "0", word: "-", "q.size()": "0", return: "-" },
      state: snap(null, 0)
    });

    if (!dict.has(endWord)) {
      steps.push({
        line: 5,
        tag: "終點不在字典中",
        tagType: "tag-check",
        inlineBadge: `!dict.count("${endWord}") ➜ return 0`,
        explanation: `目標單詞 "${endWord}" 不在字典 wordList 中，無法完成轉換，直接回傳 0。`,
        vars: { level: "0", word: "-", "q.size()": "0", return: "0" },
        state: snap(null, 0, 0)
      });
      return steps;
    }

    let level = 1;
    dict.delete(beginWord);

    steps.push({
      line: 6,
      tag: "起點推入 BFS 佇列",
      tagType: "default",
      inlineBadge: `q.push("${beginWord}"), level = 1`,
      explanation: `將起點單詞 "${beginWord}" 推入佇列 q，設定初始層數 level = 1。`,
      vars: { level: "1", word: "-", "q.size()": "1", return: "-" },
      state: snap(beginWord, 1)
    });

    while (queue.length > 0) {
      const sz = queue.length;
      for (let i = 0; i < sz; i++) {
        const word = queue.shift();
        steps.push({
          line: 10,
          tag: `取出單詞 "${word}"`,
          tagType: "tag-check",
          inlineBadge: `word = "${word}" (level = ${level})`,
          explanation: `從佇列取出第 ${level} 層的單詞 "${word}"。`,
          vars: { level: String(level), word: `"${word}"`, "q.size()": String(queue.length), return: "-" },
          state: snap(word, level)
        });

        if (word === endWord) {
          steps.push({
            line: 11,
            tag: "抵達目標單詞！",
            tagType: "tag-found",
            inlineBadge: `word == "${endWord}" ➜ return ${level}`,
            explanation: `成功抵達目標單詞 "${endWord}"！最短接龍序列長度為 ${level}。`,
            vars: { level: String(level), word: `"${word}"`, "q.size()": String(queue.length), return: String(level) },
            state: snap(word, level, level)
          });
          return steps;
        }

        const neighbors = Array.from(dict).filter((cand) => diffOne(word, cand));
        for (const next of neighbors) {
          dict.delete(next);
          visited.add(next);
          wordLevels[next] = level + 1;
          parentEdge[next] = word;
          queue.push(next);

          steps.push({
            line: 13,
            tag: `擴展鄰居 "${next}"`,
            tagType: "tag-insert",
            inlineBadge: `"${word}" -> "${next}" (L${level + 1})`,
            explanation: `"${word}" 改變 1 個字母可得字典中的 "${next}"，將 "${next}" 推入佇列並從 dict 移除避免重複走訪。`,
            vars: { level: String(level), word: `"${word}"`, "q.size()": String(queue.length), return: "-" },
            state: snap(word, level)
          });
        }
      }
      level++;
    }

    steps.push({
      line: 18,
      tag: "佇列耗盡無法連通",
      tagType: "default",
      inlineBadge: "return 0",
      explanation: `BFS 佇列已空仍未抵達 "${endWord}"，回傳 0。`,
      vars: { level: String(level), word: "-", "q.size()": "0", return: "0" },
      state: snap(null, level, 0)
    });

    return steps;
  }
};

// ============================================================================
// #72 Basic Calculator (LC #224, Hard)
// ============================================================================
window.PROBLEMS["basic-calculator"] = {
  id: 72,
  leetcodeId: 224,
  slug: "basic-calculator",
  title: "224. Basic Calculator (基本計算機)",
  difficulty: "Hard",
  topic: "Stack",
  mins: 40,
  complexity: "Time O(N) · Space O(N)",
  argNames: ["s"],
  description:
    "給定一個包含非負整數、'+'、'-'、'('、')' 與空白字元的數學運算式字串 s，請實作基本計算機求值。利用 res 維護當前括號層累計結果、sign 表示當前正負號；遇到 '(' 時將 res 與 sign 推入堆疊重置，遇到 ')' 時彈出括號前的 sign 與 res 合併。",

  presets: [
    { name: "範例 1：巢狀括號 \"(1+(4+5+2)-3)+(6+8)\"", args: ["(1+(4+5+2)-3)+(6+8)"] },
    { name: "範例 2：含空白加減 \" 2-1 + 2 \"", args: [" 2-1 + 2 "] },
    { name: "範例 3：括號前負號變號 \"10-(4-(2+1))\"", args: ["10-(4-(2+1))"] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">calculate</span>(<span class="tok-type">string</span> s) {' },
    { line: 4,  code: '        <span class="tok-type">stack</span>&lt;<span class="tok-kw">int</span>&gt; st;' },
    { line: 5,  code: '        <span class="tok-kw">int</span> res = <span class="tok-num">0</span>, num = <span class="tok-num">0</span>, sign = <span class="tok-num">1</span>;' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> c : s) {' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (<span class="tok-fn">isdigit</span>(c)) num = num * <span class="tok-num">10</span> + (c - <span class="tok-num">\'0\'</span>);' },
    { line: 8,  code: '            <span class="tok-kw">else if</span> (c == <span class="tok-num">\'+\'</span> || c == <span class="tok-num">\'-\'</span>) {' },
    { line: 9,  code: '                res += sign * num; num = <span class="tok-num">0</span>;' },
    { line: 10, code: '                sign = (c == <span class="tok-num">\'+\'</span>) ? <span class="tok-num">1</span> : -<span class="tok-num">1</span>;' },
    { line: 11, code: '            } <span class="tok-kw">else if</span> (c == <span class="tok-num">\'(\'</span>) {' },
    { line: 12, code: '                st.<span class="tok-fn">push</span>(res); st.<span class="tok-fn">push</span>(sign);' },
    { line: 13, code: '                res = <span class="tok-num">0</span>; sign = <span class="tok-num">1</span>;' },
    { line: 14, code: '            } <span class="tok-kw">else if</span> (c == <span class="tok-num">\')\'</span>) {' },
    { line: 15, code: '                res += sign * num; num = <span class="tok-num">0</span>;' },
    { line: 16, code: '                res *= st.<span class="tok-fn">top</span>(); st.<span class="tok-fn">pop</span>();' },
    { line: 17, code: '                res += st.<span class="tok-fn">top</span>(); st.<span class="tok-fn">pop</span>();' },
    { line: 18, code: '            }' },
    { line: 19, code: '        }' },
    { line: 20, code: '        <span class="tok-kw">return</span> res + sign * num;' },
    { line: 21, code: '    }' },
    { line: 22, code: '};' }
  ],

  generateTrace(sInput) {
    const steps = [];
    const cleanChars = String(sInput).replace(/\s+/g, "").split("");
    const st = [];
    let res = 0;
    let num = 0;
    let sign = 1;

    const snap = (idx, retVal = "-", connectors = []) => ({
      boards: [
        {
          id: "expr",
          type: "array",
          name: "s (去空白)",
          typeLabel: "算式字元陣列",
          x: 325,
          y: 52,
          values: cleanChars,
          hl: idx >= 0 ? [idx] : [],
          done: idx > 0 ? Array.from({ length: idx }, (_, i) => i) : [],
          pointers: idx >= 0 ? [{ idx, label: `c='${cleanChars[idx]}'`, color: "blue" }] : []
        },
        {
          id: "st",
          type: "stack",
          name: "st",
          typeLabel: "外層暫存堆疊 (res, sign)",
          x: 325,
          y: 205,
          items: st.map((item, i) => ({
            val: item.label,
            status: i >= st.length - 2 ? "hl" : ""
          }))
        },
        {
          id: "vars",
          type: "vars",
          name: "calc_vars",
          typeLabel: "計算機狀態暫存器",
          x: 24,
          y: 215,
          items: [
            { id: "res", name: "res (當前層)", val: String(res), status: "hl" },
            { id: "num", name: "num", val: String(num), status: num > 0 ? "hl" : "" },
            { id: "sign", name: "sign", val: sign === 1 ? "+1" : "-1", status: "" },
            { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
          ]
        }
      ],
      connectors
    });

    steps.push({
      line: 5,
      tag: "初始化計算機暫存器",
      tagType: "default",
      inlineBadge: "res = 0, num = 0, sign = +1",
      explanation: `初始化當前累計值 res = 0、正在讀取的數字 num = 0、正負號 sign = +1。`,
      vars: { res: "0", num: "0", sign: "+1", "st.size()": "0", return: "-" },
      state: snap(-1)
    });

    for (let i = 0; i < cleanChars.length; i++) {
      const c = cleanChars[i];
      if (c >= "0" && c <= "9") {
        num = num * 10 + Number(c);
        steps.push({
          line: 7,
          tag: `累積數字 '${c}'`,
          tagType: "default",
          inlineBadge: `num = ${num}`,
          explanation: `讀取數字字元 '${c}'，更新 num = ${num}。`,
          vars: { res: String(res), num: String(num), sign: sign === 1 ? "+1" : "-1", "st.size()": String(st.length), return: "-" },
          state: snap(i, "-", [{ from: `wb-cw-expr-${i}`, to: "wb-var-num", label: `num=${num}`, color: "blue" }])
        });
      } else if (c === "+" || c === "-") {
        res += sign * num;
        num = 0;
        sign = c === "+" ? 1 : -1;
        steps.push({
          line: 10,
          tag: `結算前項並切換符號 '${c}'`,
          tagType: "tag-check",
          inlineBadge: `res = ${res}, sign = ${sign === 1 ? "+1" : "-1"}`,
          explanation: `遇到運算子 '${c}'：先將前一個數字結算入 res = ${res}，清空 num = 0，並設定下一個數的符號 sign = ${sign === 1 ? "+1" : "-1"}。`,
          vars: { res: String(res), num: "0", sign: sign === 1 ? "+1" : "-1", "st.size()": String(st.length), return: "-" },
          state: snap(i)
        });
      } else if (c === "(") {
        st.push({ val: res, label: `res=${res}` });
        st.push({ val: sign, label: `sign=${sign === 1 ? "+1" : "-1"}` });
        res = 0;
        sign = 1;
        steps.push({
          line: 12,
          tag: "遇到 '(' 推入外層狀態",
          tagType: "tag-insert",
          inlineBadge: `push(res, sign), 重置 res=0`,
          explanation: `遇到左括號 '('：將外層累計的 res 與括號前的 sign 推入堆疊 st 保存，並重置 res = 0, sign = +1 開始計算子括號。`,
          vars: { res: "0", num: "0", sign: "+1", "st.size()": String(st.length), return: "-" },
          state: snap(i, "-", [{ from: `wb-cw-expr-${i}`, to: `wb-stack-st-${st.length - 1}`, label: "暫存外層", color: "purple" }])
        });
      } else if (c === ")") {
        res += sign * num;
        num = 0;
        const prevSign = st.pop().val;
        const prevRes = st.pop().val;
        const subVal = res;
        res = prevRes + prevSign * subVal;
        steps.push({
          line: 17,
          tag: "遇到 ')' 彈出並合併外層",
          tagType: "tag-found",
          inlineBadge: `${prevRes} + (${prevSign === 1 ? "+1" : "-1"}) * ${subVal} = ${res}`,
          explanation: `遇到右括號 ')'：子括號內結果為 ${subVal}，乘上彈出的括號前符號 ${prevSign === 1 ? "+1" : "-1"} 後加回外層 ${prevRes}，得到 res = ${res}。`,
          vars: { res: String(res), num: "0", sign: sign === 1 ? "+1" : "-1", "st.size()": String(st.length), return: "-" },
          state: snap(i, "-", [{ from: `wb-cw-expr-${i}`, to: "wb-var-res", label: `合併得 ${res}`, color: "green" }])
        });
      }
    }

    const finalAns = res + sign * num;
    res = finalAns;
    num = 0;
    steps.push({
      line: 20,
      tag: "結算尾項並回傳結果",
      tagType: "tag-found",
      inlineBadge: `return ${finalAns}`,
      explanation: `掃描完畢，加上最後一項 sign * num，回傳最終計算結果 ${finalAns}。`,
      vars: { res: String(finalAns), num: "0", sign: sign === 1 ? "+1" : "-1", "st.size()": "0", return: String(finalAns) },
      state: snap(-1, finalAns)
    });

    return steps;
  }
};

// ============================================================================
// #73 Maximum Profit in Job Scheduling (LC #1235, Hard)
// ============================================================================
window.PROBLEMS["maximum-profit-in-job-scheduling"] = {
  id: 73,
  leetcodeId: 1235,
  slug: "maximum-profit-in-job-scheduling",
  title: "1235. Maximum Profit in Job Scheduling (規劃兼職工作)",
  difficulty: "Hard",
  topic: "Binary Search",
  mins: 45,
  complexity: "Time O(N log N) · Space O(N)",
  argNames: ["startTime", "endTime", "profit"],
  description:
    "給定 n 份兼職工作的 startTime、endTime 與報酬 profit，不可選擇時間重疊的工作，求最大總報酬。先將所有工作依結束時間 endTime 升序排列，再定義 dp[i] 為前 i 份工作的最大報酬，利用二分搜尋 (upper_bound) 找出在當前工作開始前已結束的最後一份工作 prev，轉移方程為 dp[i] = max(dp[i-1], dp[prev] + profit)。",

  presets: [
    { name: "範例 1：4 份工作 maxProfit = 120", args: [[1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70]] },
    { name: "範例 2：5 份工作 maxProfit = 150", args: [[1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60]] },
    { name: "範例 3：全部重疊取單一最高 [5, 6, 4]", args: [[1, 1, 1], [2, 3, 4], [5, 6, 4]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">jobScheduling</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; s, <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; e, <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; p) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> n = s.<span class="tok-fn">size</span>();' },
    { line: 5,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">array</span>&lt;<span class="tok-kw">int</span>, <span class="tok-num">3</span>&gt;&gt; jobs(n);' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; n; ++i) jobs[i] = {e[i], s[i], p[i]};' },
    { line: 7,  code: '        <span class="tok-fn">sort</span>(jobs.<span class="tok-fn">begin</span>(), jobs.<span class="tok-fn">end</span>());' },
    { line: 8,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; dp(n + <span class="tok-num">1</span>, <span class="tok-num">0</span>);' },
    { line: 9,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">1</span>; i &lt;= n; ++i) {' },
    { line: 10, code: '            <span class="tok-kw">auto</span> [end, start, pay] = jobs[i - <span class="tok-num">1</span>];' },
    { line: 11, code: '            <span class="tok-kw">int</span> prev = <span class="tok-fn">upper_bound</span>(jobs.<span class="tok-fn">begin</span>(), jobs.<span class="tok-fn">begin</span>() + i - <span class="tok-num">1</span>,' },
    { line: 12, code: '                <span class="tok-type">array</span>&lt;<span class="tok-kw">int</span>, <span class="tok-num">3</span>&gt;{start, INT_MAX, INT_MAX}) - jobs.<span class="tok-fn">begin</span>();' },
    { line: 13, code: '            dp[i] = <span class="tok-fn">max</span>(dp[i - <span class="tok-num">1</span>], dp[prev] + pay);' },
    { line: 14, code: '        }' },
    { line: 15, code: '        <span class="tok-kw">return</span> dp[n];' },
    { line: 16, code: '    }' },
    { line: 17, code: '};' }
  ],

  generateTrace(startTime, endTime, profit) {
    const steps = [];
    const n = startTime.length;
    const jobs = [];
    for (let i = 0; i < n; i++) {
      jobs.push({ s: Number(startTime[i]), e: Number(endTime[i]), p: Number(profit[i]) });
    }
    jobs.sort((a, b) => a.e - b.e || a.s - b.s);

    const dp = new Array(n + 1).fill(0);

    const snap = (jobIdx, prevCount, takeStr, skipStr, retVal = "-", connectors = []) => ({
      boards: [
        {
          id: "jobs",
          type: "array",
          name: "jobs (依 endTime 排序)",
          typeLabel: "區間 [start..end] $profit",
          x: 325,
          y: 52,
          values: jobs.map((j) => `[${j.s}..${j.e}] $${j.p}`),
          indexLabels: jobs.map((_, idx) => `J${idx + 1}`),
          hl: jobIdx >= 0 ? [jobIdx] : [],
          match: prevCount > 0 ? [prevCount - 1] : [],
          pointers: jobIdx >= 0 ? [{ idx: jobIdx, label: `i=${jobIdx + 1}`, color: "blue" }] : []
        },
        {
          id: "dp",
          type: "array",
          name: "dp",
          typeLabel: "前 i 份工作最大報酬 dp[0..n]",
          x: 325,
          y: 205,
          values: [...dp],
          hl: jobIdx >= 0 ? [jobIdx + 1] : [],
          match: prevCount >= 0 ? [prevCount] : [],
          pointers: [
            ...(prevCount >= 0 ? [{ idx: prevCount, label: `prev=${prevCount}`, color: "green" }] : []),
            ...(jobIdx >= 0 ? [{ idx: jobIdx + 1, label: `dp[${jobIdx + 1}]`, color: "purple" }] : [])
          ]
        },
        {
          id: "vars",
          type: "vars",
          name: "dp_vars",
          typeLabel: "二分搜尋與狀態轉移",
          x: 24,
          y: 215,
          items: [
            { id: "skip", name: "不選 (dp[i-1])", val: skipStr, status: "" },
            { id: "take", name: "選取 (dp[prev]+pay)", val: takeStr, status: "hl" },
            { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
          ]
        }
      ],
      connectors
    });

    steps.push({
      line: 7,
      tag: "依結束時間排序工作",
      tagType: "default",
      inlineBadge: `n = ${n} 份工作已排序`,
      explanation: `將 ${n} 份工作依結束時間 endTime 升序排列，並初始化 dp[0..${n}] = 0。`,
      vars: { i: "0", prev: "-", skip: "-", take: "-", "dp[i]": "0" },
      state: snap(-1, -1, "-", "-")
    });

    for (let i = 1; i <= n; i++) {
      const job = jobs[i - 1];
      let prev = 0;
      for (let j = 0; j < i - 1; j++) {
        if (jobs[j].e <= job.s) prev = j + 1;
      }

      const skipVal = dp[i - 1];
      const takeVal = dp[prev] + job.p;
      dp[i] = Math.max(skipVal, takeVal);

      steps.push({
        line: 13,
        tag: `狀態轉移計算 dp[${i}]`,
        tagType: takeVal > skipVal ? "tag-found" : "tag-check",
        inlineBadge: `prev=${prev}, dp[${i}] = max(${skipVal}, ${dp[prev]}+${job.p}) = ${dp[i]}`,
        explanation: `考慮第 ${i} 份工作 [${job.s}..${job.e}] ($${job.p})：二分搜尋找到結束時間 <= ${job.s} 的最後工作為 prev = ${prev}（dp[${prev}]=${dp[prev]}）。比較不選 (${skipVal}) 與選取 (${takeVal})，得 dp[${i}] = ${dp[i]}。`,
        vars: { i: String(i), prev: String(prev), skip: String(skipVal), take: `${dp[prev]}+${job.p}=${takeVal}`, "dp[i]": String(dp[i]) },
        state: snap(i - 1, prev, `${dp[prev]} + ${job.p} = ${takeVal}`, String(skipVal), "-", [
          { from: `wb-cw-jobs-${i - 1}`, to: `wb-cw-dp-${i}`, label: `dp[${i}] = ${dp[i]}`, color: takeVal > skipVal ? "green" : "blue" }
        ])
      });
    }

    steps.push({
      line: 15,
      tag: "回傳最大總報酬",
      tagType: "tag-found",
      inlineBadge: `return dp[${n}] = ${dp[n]}`,
      explanation: `所有工作規劃完畢，最大不重疊工作總報酬為 dp[${n}] = ${dp[n]}。`,
      vars: { i: String(n), prev: "-", skip: "-", take: "-", "dp[i]": String(dp[n]) },
      state: snap(-1, n, "-", "-", dp[n])
    });

    return steps;
  }
};

// ============================================================================
// #74 Merge k Sorted Lists (LC #23, Hard)
// ============================================================================
window.PROBLEMS["merge-k-sorted-lists"] = {
  id: 74,
  leetcodeId: 23,
  slug: "merge-k-sorted-lists",
  title: "23. Merge k Sorted Lists (合併 K 個升序鏈結串列)",
  difficulty: "Hard",
  topic: "Heap",
  mins: 30,
  complexity: "Time O(N log k) · Space O(k)",
  argNames: ["lists"],
  description:
    "給定一個包含 k 個升序鏈結串列的陣列 lists，請將所有鏈結串列合併為一個升序鏈結串列並回傳。使用容量為 k 的最小堆積 (priority_queue) 維護每條串列當前的頭節點，每次彈出最小節點接上結果串列，並將該節點的 next 推入最小堆。",

  presets: [
    { name: "範例 1：3 條串列 [[1,4,5], [1,3,4], [2,6]]", args: [[[1, 4, 5], [1, 3, 4], [2, 6]]] },
    { name: "範例 2：交錯數值 [[2,5], [1,3], [4,6]]", args: [[[2, 5], [1, 3], [4, 6]]] },
    { name: "範例 3：2 條不等長串列 [[1,10], [2,3,8]]", args: [[[1, 10], [2, 3, 8]]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">ListNode</span>* <span class="tok-fn">mergeKLists</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">ListNode</span>*&gt;&amp; lists) {' },
    { line: 4,  code: '        <span class="tok-kw">auto</span> cmp = [](<span class="tok-type">ListNode</span>* a, <span class="tok-type">ListNode</span>* b) { <span class="tok-kw">return</span> a-&gt;val &gt; b-&gt;val; };' },
    { line: 5,  code: '        <span class="tok-type">priority_queue</span>&lt;<span class="tok-type">ListNode</span>*, <span class="tok-type">vector</span>&lt;<span class="tok-type">ListNode</span>*&gt;, <span class="tok-kw">decltype</span>(cmp)&gt; pq(cmp);' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-type">ListNode</span>* head : lists) <span class="tok-kw">if</span> (head) pq.<span class="tok-fn">push</span>(head);' },
    { line: 7,  code: '        <span class="tok-type">ListNode</span> dummy(<span class="tok-num">0</span>), *tail = &amp;dummy;' },
    { line: 8,  code: '        <span class="tok-kw">while</span> (!pq.<span class="tok-fn">empty</span>()) {' },
    { line: 9,  code: '            <span class="tok-type">ListNode</span>* curr = pq.<span class="tok-fn">top</span>(); pq.<span class="tok-fn">pop</span>();' },
    { line: 10, code: '            tail-&gt;next = curr; tail = tail-&gt;next;' },
    { line: 11, code: '            <span class="tok-kw">if</span> (curr-&gt;next) pq.<span class="tok-fn">push</span>(curr-&gt;next);' },
    { line: 12, code: '        }' },
    { line: 13, code: '        <span class="tok-kw">return</span> dummy.next;' },
    { line: 14, code: '    }' },
    { line: 15, code: '};' }
  ],

  generateTrace(listsInput) {
    const steps = [];
    const lists = (listsInput || []).map((arr) => arr.map(Number));
    const pq = []; // items: { val, listIdx, elemIdx }
    const merged = [];

    const sortPq = () => {
      pq.sort((a, b) => a.val - b.val || a.listIdx - b.listIdx);
    };

    const snap = (poppedText, connectors = []) => ({
      boards: [
        {
          id: "pq",
          type: "queue",
          name: "pq (Min-Heap)",
          typeLabel: "最小堆積 (priority_queue)",
          x: 325,
          y: 52,
          leftLabel: "top (最小) ←",
          rightLabel: "← 候選頭節點",
          items: pq.map((it, idx) => ({
            val: `${it.val} (L${it.listIdx})`,
            status: idx === 0 ? "hl" : ""
          }))
        },
        {
          id: "merged",
          type: "array",
          name: "dummy.next (合併結果)",
          typeLabel: "有序鏈結串列",
          x: 325,
          y: 195,
          values: [...merged],
          hl: merged.length ? [merged.length - 1] : [],
          pointers: merged.length ? [{ idx: merged.length - 1, label: "tail", color: "green" }] : []
        },
        {
          id: "vars",
          type: "vars",
          name: "merge_vars",
          typeLabel: "合併進度與指標",
          x: 24,
          y: 215,
          items: [
            { id: "curr", name: "curr (彈出最小)", val: poppedText, status: poppedText !== "-" ? "hl" : "" },
            { id: "pqsz", name: "pq.size()", val: String(pq.length), status: "" },
            { id: "cnt", name: "已合併節點數", val: String(merged.length), status: "match" }
          ]
        }
      ],
      connectors
    });

    for (let li = 0; li < lists.length; li++) {
      if (lists[li] && lists[li].length > 0) {
        pq.push({ val: lists[li][0], listIdx: li, elemIdx: 0 });
      }
    }
    sortPq();

    steps.push({
      line: 6,
      tag: "各串列頭節點推入最小堆",
      tagType: "tag-insert",
      inlineBadge: `pq.size() = ${pq.length}`,
      explanation: `將 ${lists.length} 條升序串列的非空頭節點推入最小堆 pq，目前堆頂最小元素為 ${pq.length ? `${pq[0].val} (來自 L${pq[0].listIdx})` : "無"}。`,
      vars: { curr: "-", "pq.size()": String(pq.length), mergedLen: "0" },
      state: snap("-")
    });

    while (pq.length > 0) {
      const curr = pq.shift();
      merged.push(curr.val);
      const nextElemIdx = curr.elemIdx + 1;
      const hasNext = nextElemIdx < lists[curr.listIdx].length;
      if (hasNext) {
        pq.push({ val: lists[curr.listIdx][nextElemIdx], listIdx: curr.listIdx, elemIdx: nextElemIdx });
        sortPq();
      }

      const lastIdx = merged.length - 1;
      steps.push({
        line: 10,
        tag: `彈出最小節點 ${curr.val} 接至 tail`,
        tagType: "tag-found",
        inlineBadge: `tail->next = ${curr.val} (L${curr.listIdx})${hasNext ? `, push(${lists[curr.listIdx][nextElemIdx]})` : ""}`,
        explanation: `從最小堆彈出當前最小值 ${curr.val}（來自串列 L${curr.listIdx}）接在結果串列末端${hasNext ? `，並將其下一個節點 ${lists[curr.listIdx][nextElemIdx]} 推入最小堆。` : "（該串列已無後續節點）。"}`,
        vars: { curr: `${curr.val} (L${curr.listIdx})`, "pq.size()": String(pq.length), mergedLen: String(merged.length) },
        state: snap(`${curr.val} (L${curr.listIdx})`, [
          { from: `wb-cw-merged-${lastIdx}`, to: "wb-var-cnt", label: `接上 ${curr.val}`, color: "green" }
        ])
      });
    }

    steps.push({
      line: 13,
      tag: "完成合併回傳 dummy.next",
      tagType: "tag-found",
      inlineBadge: `共 ${merged.length} 個節點 [${merged.join(", ")}]`,
      explanation: `最小堆已空，K 條升序鏈結串列已完整合併為長度 ${merged.length} 的升序串列。`,
      vars: { curr: "nullptr", "pq.size()": "0", mergedLen: String(merged.length) },
      state: snap("完成 ✓")
    });

    return steps;
  }
};

// ============================================================================
// #75 Largest Rectangle in Histogram (LC #84, Hard)
// ============================================================================
window.PROBLEMS["largest-rectangle-in-histogram"] = {
  id: 75,
  leetcodeId: 84,
  slug: "largest-rectangle-in-histogram",
  title: "84. Largest Rectangle in Histogram (柱狀圖中最大的矩形)",
  difficulty: "Hard",
  topic: "Stack",
  mins: 35,
  complexity: "Time O(N) · Space O(N)",
  argNames: ["heights"],
  description:
    "給定 n 個非負整數表示柱狀圖中各柱子的高度（每個柱子寬度為 1），求該柱狀圖中能勾勒出的最大矩形面積。使用單調遞增索引堆疊 (Monotonic Increasing Stack)：當遇到比堆頂更矮的柱子時，彈出堆頂作為矩形高度 h，左邊界為新堆頂，右邊界為當前索引 i，計算面積 h × (i - st.top() - 1)。",

  presets: [
    { name: "範例 1：經典測資 [2, 1, 5, 6, 2, 3] (最大面積 10)", args: [[2, 1, 5, 6, 2, 3]] },
    { name: "範例 2：兩柱遞增 [2, 4] (最大面積 4)", args: [[2, 4]] },
    { name: "範例 3：起伏柱狀圖 [6, 2, 5, 4, 5, 1, 6] (最大面積 12)", args: [[6, 2, 5, 4, 5, 1, 6]] }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">largestRectangleArea</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; heights) {' },
    { line: 4,  code: '        <span class="tok-type">stack</span>&lt;<span class="tok-kw">int</span>&gt; st;' },
    { line: 5,  code: '        <span class="tok-kw">int</span> maxArea = <span class="tok-num">0</span>, n = heights.<span class="tok-fn">size</span>();' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt;= n; ++i) {' },
    { line: 7,  code: '            <span class="tok-kw">int</span> curH = (i == n) ? <span class="tok-num">0</span> : heights[i];' },
    { line: 8,  code: '            <span class="tok-kw">while</span> (!st.<span class="tok-fn">empty</span>() &amp;&amp; curH &lt; heights[st.<span class="tok-fn">top</span>()]) {' },
    { line: 9,  code: '                <span class="tok-kw">int</span> h = heights[st.<span class="tok-fn">top</span>()]; st.<span class="tok-fn">pop</span>();' },
    { line: 10, code: '                <span class="tok-kw">int</span> w = st.<span class="tok-fn">empty</span>() ? i : i - st.<span class="tok-fn">top</span>() - <span class="tok-num">1</span>;' },
    { line: 11, code: '                maxArea = <span class="tok-fn">max</span>(maxArea, h * w);' },
    { line: 12, code: '            }' },
    { line: 13, code: '            st.<span class="tok-fn">push</span>(i);' },
    { line: 14, code: '        }' },
    { line: 15, code: '        <span class="tok-kw">return</span> maxArea;' },
    { line: 16, code: '    }' },
    { line: 17, code: '};' }
  ],

  generateTrace(heightsInput) {
    const steps = [];
    const heights = heightsInput.map(Number);
    const n = heights.length;
    const displayHeights = [...heights, 0];
    const indexLabels = [...heights.map((_, idx) => idx), `${n}(哨兵)`];
    const st = [];
    let maxArea = 0;

    const snap = (iIdx, spanRange, hVal, wVal, areaVal, retVal = "-", connectors = []) => {
      const hl = iIdx >= 0 ? [iIdx] : [];
      const match = [];
      if (spanRange) {
        for (let k = spanRange[0]; k <= spanRange[1]; k++) match.push(k);
      }
      return {
        boards: [
          {
            id: "heights",
            type: "array",
            name: "heights (尾端含高度 0 哨兵)",
            typeLabel: "柱子高度陣列",
            x: 325,
            y: 52,
            values: displayHeights,
            indexLabels,
            hl,
            match,
            pointers: iIdx >= 0 ? [{ idx: iIdx, label: `i=${iIdx}`, color: "blue" }] : []
          },
          {
            id: "st",
            type: "stack",
            name: "st (單調遞增索引堆疊)",
            typeLabel: "stack<int>",
            x: 325,
            y: 205,
            items: st.map((idxVal, pos) => ({
              val: `idx=${idxVal} (h=${displayHeights[idxVal]})`,
              status: pos === st.length - 1 ? "hl" : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "hist_vars",
            typeLabel: "彈出柱子矩形面積計算",
            x: 24,
            y: 215,
            items: [
              { id: "hw", name: "h × w", val: hVal !== "-" ? `${hVal} × ${wVal} = ${areaVal}` : "-", status: hVal !== "-" ? "hl" : "" },
              { id: "max", name: "maxArea", val: String(maxArea), status: maxArea > 0 ? "match" : "" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    for (let i = 0; i <= n; i++) {
      const curH = i === n ? 0 : heights[i];

      while (st.length > 0 && curH < heights[st[st.length - 1]]) {
        const topIdx = st.pop();
        const h = heights[topIdx];
        const leftBound = st.length === 0 ? 0 : st[st.length - 1] + 1;
        const rightBound = i - 1;
        const w = st.length === 0 ? i : i - st[st.length - 1] - 1;
        const area = h * w;
        const improved = area > maxArea;
        if (improved) maxArea = area;

        steps.push({
          line: 11,
          tag: `彈出索引 ${topIdx} 計算矩形面積`,
          tagType: improved ? "tag-found" : "tag-check",
          inlineBadge: `h=${h}, w=${w} (區間 [${leftBound}..${rightBound}]), area=${area}`,
          explanation: `因當前高度 curH=${curH} < 堆頂高度 heights[${topIdx}]=${h}，彈出索引 ${topIdx}：以高度 h=${h} 向左右延伸至 [${leftBound}..${rightBound}]，寬度 w=${w}，面積 = ${h} × ${w} = ${area}，maxArea = ${maxArea}。`,
          vars: { i: String(i), h: String(h), w: String(w), area: String(area), maxArea: String(maxArea) },
          state: snap(i, [leftBound, rightBound], h, w, area, "-", [
            { from: `wb-cw-heights-${topIdx}`, to: "wb-var-hw", label: `${h} × ${w} = ${area}`, color: improved ? "green" : "blue" }
          ])
        });
      }

      st.push(i);
      if (i < n) {
        steps.push({
          line: 13,
          tag: `索引 ${i} (h=${curH}) 推入單調堆疊`,
          tagType: "tag-insert",
          inlineBadge: `st.push(${i})`,
          explanation: `將索引 i = ${i}（高度 ${curH}）推入堆疊 st，維持堆疊內高度單調遞增。`,
          vars: { i: String(i), h: "-", w: "-", area: "-", maxArea: String(maxArea) },
          state: snap(i, null, "-", "-", "-", "-", [
            { from: `wb-cw-heights-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `push(${i})`, color: "purple" }
          ])
        });
      }
    }

    steps.push({
      line: 15,
      tag: "回傳最大矩形面積",
      tagType: "tag-found",
      inlineBadge: `return ${maxArea}`,
      explanation: `所有柱子與尾端哨兵處理完畢，柱狀圖中最大矩形面積為 ${maxArea}。`,
      vars: { i: String(n), h: "-", w: "-", area: "-", maxArea: String(maxArea) },
      state: snap(-1, null, "-", "-", "-", maxArea)
    });

    return steps;
  }
};

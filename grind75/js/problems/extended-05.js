/**
 * Grind 75 延伸題 — Problems #124 to #135
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ==========================================================================
  // 共用輔助函式（僅限本檔使用）
  // ==========================================================================
  const esc5 = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const strVars5 = (obj) => {
    const out = {};
    Object.keys(obj).forEach((k) => {
      out[k] = String(obj[k]);
    });
    return out;
  };
  const step5 = (line, tag, tagType, inlineBadge, explanation, vars, boards, connectors = []) => ({
    line,
    tag,
    tagType,
    inlineBadge: String(inlineBadge),
    explanation,
    vars: strVars5(vars),
    state: { boards, connectors }
  });
  const varsBoard5 = (items, typeLabel = "關鍵變數與算式", y = 215) => ({
    id: "vars",
    type: "vars",
    name: "state_vars",
    typeLabel,
    x: 24,
    y,
    items: items.map((it) => ({ id: it.id, name: esc5(it.name), val: esc5(it.val), status: it.status || "" }))
  });
  const arrBoard5 = (id, name, typeLabel, x, y, values, o = {}) => {
    const b = {
      id,
      type: "array",
      name,
      typeLabel,
      x,
      y,
      values: values.map((v) => esc5(v)),
      hl: o.hl || [],
      match: o.match || [],
      done: o.done || [],
      warn: o.warn || [],
      pointers: (o.pointers || []).map((p) => ({ ...p, label: esc5(p.label) }))
    };
    if (o.indexLabels) b.indexLabels = o.indexLabels.map((v) => esc5(v));
    return b;
  };
  const listStr5 = (arr) => `[${arr.join(",")}]`;

  // ==========================================================================
  // #124 Longest Valid Parentheses (LC #32, Hard)
  // ==========================================================================
  window.PROBLEMS["longest-valid-parentheses"] = {
    id: 124,
    leetcodeId: 32,
    slug: "longest-valid-parentheses",
    title: "32. Longest Valid Parentheses (最長有效括號)",
    difficulty: "Hard",
    topic: "String / Stack",
    mins: 35,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["s"],
    description:
      "給定只包含 '(' 與 ')' 的字串 s，求最長的有效（格式正確且連續）括號子字串長度。使用 stack<int> 存放索引，並先推入 -1 作為「最後一個無法配對位置」的基準：遇到 '(' 推入其索引；遇到 ')' 先彈出頂端，若堆疊變空代表此 ')' 無法配對，把它的索引推入成為新基準，否則目前有效長度即為 i - st.top()。整體只掃描一次，時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：s = \"(()\"", args: ["(()"] },
      { name: "範例 2：s = \")()())\"", args: [")()())"] },
      { name: "範例 3：空字串 s = \"\"", args: [""] },
      { name: "巢狀相連：s = \"()(())\"", args: ["()(())"] },
      { name: "中間斷開：s = \"()(()\"", args: ["()(()"] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">longestValidParentheses</span>(<span class="tok-type">string</span> s) {' },
      { line: 4, code: '        <span class="tok-type">stack</span>&lt;<span class="tok-kw">int</span>&gt; st;' },
      { line: 5, code: '        st.<span class="tok-fn">push</span>(-<span class="tok-num">1</span>);  <span class="tok-cmt">// 最後一個無法配對位置的基準</span>' },
      { line: 6, code: '        <span class="tok-kw">int</span> maxLen = <span class="tok-num">0</span>;' },
      { line: 7, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; (<span class="tok-kw">int</span>)s.<span class="tok-fn">size</span>(); i++) {' },
      { line: 8, code: '            <span class="tok-kw">if</span> (s[i] == <span class="tok-num">\'(\'</span>) {' },
      { line: 9, code: '                st.<span class="tok-fn">push</span>(i);' },
      { line: 10, code: '            } <span class="tok-kw">else</span> {' },
      { line: 11, code: '                st.<span class="tok-fn">pop</span>();' },
      { line: 12, code: '                <span class="tok-kw">if</span> (st.<span class="tok-fn">empty</span>()) {' },
      { line: 13, code: '                    st.<span class="tok-fn">push</span>(i);  <span class="tok-cmt">// 新的基準</span>' },
      { line: 14, code: '                } <span class="tok-kw">else</span> {' },
      { line: 15, code: '                    maxLen = <span class="tok-fn">max</span>(maxLen, i - st.<span class="tok-fn">top</span>());' },
      { line: 16, code: '                }' },
      { line: 17, code: '            }' },
      { line: 18, code: '        }' },
      { line: 19, code: '        <span class="tok-kw">return</span> maxLen;' },
      { line: 20, code: '    }' },
      { line: 21, code: '};' }
    ],

    generateTrace(sInput) {
      const s = String(sInput === undefined || sInput === null ? "" : sInput);
      const n = s.length;
      const st = [];
      let maxLen = 0;
      let bestWin = null;
      const steps = [];

      const stackLabel = (idx) => (idx === -1 ? "-1 (基準)" : `${idx} '${s[idx]}'`);

      const snap = (o = {}) => {
        const { i = -1, topStatus = "", win = null, ret = "-", len = "-", conns = [] } = o;
        const match = [];
        if (win) for (let k = win[0]; k <= win[1]; k++) match.push(k);
        const done = [];
        for (let k = 0; k < (i < 0 ? 0 : i); k++) if (!match.includes(k)) done.push(k);
        const showWin = ret !== "-" && bestWin ? bestWin : null;
        const finalMatch = [];
        if (showWin) for (let k = showWin[0]; k <= showWin[1]; k++) finalMatch.push(k);
        return {
          boards: [
            arrBoard5("s", "s", "字串 (string)", 325, 52, s.split(""), {
              hl: i >= 0 && i < n ? [i] : [],
              match: showWin ? finalMatch : match,
              done: showWin ? [] : done,
              pointers: i >= 0 && i < n ? [{ idx: i, label: `i = ${i}`, color: "blue" }] : []
            }),
            {
              id: "st",
              type: "stack",
              name: "st",
              typeLabel: "索引堆疊 (stack&lt;int&gt;)",
              x: 325,
              y: 200,
              items: st.map((v, k) => ({ val: esc5(stackLabel(v)), status: k === st.length - 1 ? topStatus : "" }))
            },
            varsBoard5([
              { id: "i", name: "i", val: i >= 0 && i < n ? i : "-", status: i >= 0 && i < n ? "hl" : "" },
              { id: "ch", name: "s[i]", val: i >= 0 && i < n ? `'${s[i]}'` : "-" },
              { id: "top", name: "st.top()", val: st.length ? st[st.length - 1] : "empty" },
              { id: "len", name: "i - st.top()", val: len, status: len !== "-" ? "hl" : "" },
              { id: "max", name: "maxLen", val: maxLen },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };
      const vars = (i, extra = {}) => ({
        i: i >= 0 && i < n ? i : "-",
        "s[i]": i >= 0 && i < n ? s[i] : "-",
        "st.top()": st.length ? st[st.length - 1] : "empty",
        maxLen,
        ...extra
      });

      st.push(-1);
      steps.push(step5(5, "推入基準 -1", "tag-insert", "st = {-1}, maxLen = 0",
        `建立索引堆疊並先推入 -1 當作「最後一個無法配對位置」的基準，這樣第一段有效括號的長度可以直接用 i - (-1) 算出。字串長度 n = ${n}。`,
        vars(-1), snap({ topStatus: "hl" }).boards, []));

      for (let i = 0; i < n; i++) {
        const c = s[i];
        steps.push(step5(8, `檢查 s[${i}]`, "tag-check", `s[${i}] = '${c}' ➜ ${c === "(" ? "左括號" : "右括號"}`,
          c === "("
            ? `讀到 s[${i}] = '('，它可能是之後某段有效括號的起點，先把索引推入堆疊。`
            : `讀到 s[${i}] = ')'，嘗試與堆疊頂端的左括號配對。`,
          vars(i), snap({ i }).boards, []));
        if (c === "(") {
          st.push(i);
          const sn = snap({ i, topStatus: "hl" });
          steps.push(step5(9, "推入左括號索引", "tag-insert", `st.push(${i})`,
            `將左括號的索引 ${i} 推入堆疊，等待之後的 ')' 來配對。`,
            vars(i), sn.boards, [{ from: `wb-cw-s-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `push(${i})`, color: "purple" }]));
        } else {
          const popped = st.pop();
          steps.push(step5(11, "彈出頂端", "tag-check", `st.pop() ➜ ${popped}`,
            popped === -1 || (popped >= 0 && s[popped] === ")")
              ? `彈出頂端 ${popped}，它是基準而不是左括號，代表這個 ')' 前面沒有可配對的 '('。`
              : `彈出頂端索引 ${popped}（左括號），與 s[${i}] 的 ')' 配成一對。`,
            vars(i), snap({ i }).boards, []));
          if (st.length === 0) {
            st.push(i);
            steps.push(step5(13, "更新基準", "tag-insert", `st.empty() ➜ st.push(${i})`,
              `彈出後堆疊為空，表示 s[${i}] 這個 ')' 無法配對，有效括號不可能跨過它。把 ${i} 推入作為新的基準。`,
              vars(i), snap({ i, topStatus: "hl" }).boards,
              [{ from: `wb-cw-s-${i}`, to: `wb-stack-st-0`, label: `新基準 ${i}`, color: "red" }]));
          } else {
            const top = st[st.length - 1];
            const len = i - top;
            const improved = len > maxLen;
            if (improved) {
              maxLen = len;
              bestWin = [top + 1, i];
            }
            steps.push(step5(15, improved ? "更新最長長度" : "計算有效長度", improved ? "tag-found" : "tag-check",
              `${i} - ${top} = ${len}${improved ? ` ➜ maxLen = ${maxLen}` : ` ≤ ${maxLen}`}`,
              `堆疊仍非空，頂端 ${top} 是目前這段有效括號左側的邊界，因此 s[${top + 1}..${i}] 是有效括號，長度 ${i} - ${top} = ${len}。${improved ? `比原本的最大值大，maxLen 更新為 ${maxLen}。` : `沒有超過 maxLen = ${maxLen}。`}`,
              vars(i, { "i - st.top()": len }), snap({ i, topStatus: "hl", win: [top + 1, i], len }).boards,
              [{ from: `wb-cw-s-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `len = ${len}`, color: improved ? "green" : "blue" }]));
          }
        }
      }

      steps.push(step5(19, "回傳答案", "tag-found", `return ${maxLen}`,
        n === 0
          ? "字串為空，迴圈沒有執行，最長有效括號長度為 0。"
          : `掃描完成，最長有效括號子字串長度為 ${maxLen}${bestWin ? `（s[${bestWin[0]}..${bestWin[1]}] = "${s.slice(bestWin[0], bestWin[1] + 1)}"）` : ""}。`,
        vars(n, { return: maxLen }), snap({ i: n, ret: maxLen }).boards,
        bestWin ? [{ from: `wb-cw-s-${bestWin[1]}`, to: "wb-var-ret", label: `最長 ${maxLen}`, color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #125 Design In-Memory File System (LC #588, Hard)
  // ==========================================================================
  window.PROBLEMS["design-in-memory-file-system"] = {
    id: 125,
    leetcodeId: 588,
    slug: "design-in-memory-file-system",
    title: "588. Design In-Memory File System (設計記憶體檔案系統)",
    difficulty: "Hard",
    topic: "Design / Trie / Hash Table",
    mins: 40,
    complexity: "Time O(L + k log k) per op · Space O(總路徑長度 + 內容長度)",
    argNames: ["operations", "values"],
    description:
      "設計一個記憶體中的檔案系統，支援 ls、mkdir、addContentToFile、readContentFromFile。以 Trie（字典樹）表示目錄結構：每個節點有一個以名稱排序的 map<string, Node*> children、是否為檔案的 isFile 與檔案內容 content。所有操作都先用 walk 依 '/' 切開路徑逐層往下走（不存在就建立節點），ls 若停在檔案就回傳檔名，否則依 map 的字典序列出子項目。每次操作 O(路徑長度 + 子項目數 × log)。",

    presets: [
      {
        name: "範例 1：ls / mkdir /a/b/c / addContentToFile / ls / read",
        args: [
          ["FileSystem", "ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"],
          [[], ["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]]
        ]
      },
      {
        name: "附加內容與 ls 檔案路徑",
        args: [
          ["FileSystem", "addContentToFile", "addContentToFile", "readContentFromFile", "ls"],
          [[], ["/f", "ab"], ["/f", "cd"], ["/f"], ["/f"]]
        ]
      },
      {
        name: "字典序列出多個子目錄",
        args: [
          ["FileSystem", "mkdir", "mkdir", "addContentToFile", "ls", "ls"],
          [[], ["/x/z"], ["/x/b"], ["/x/m", "hi"], ["/x"], ["/x/z"]]
        ]
      }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">FileSystem</span> {' },
      { line: 2, code: '    <span class="tok-kw">struct</span> <span class="tok-type">Node</span> {' },
      { line: 3, code: '        <span class="tok-kw">bool</span> isFile = <span class="tok-kw">false</span>;' },
      { line: 4, code: '        <span class="tok-type">string</span> content;' },
      { line: 5, code: '        <span class="tok-type">map</span>&lt;<span class="tok-type">string</span>, <span class="tok-type">Node</span>*&gt; children;' },
      { line: 6, code: '    };' },
      { line: 7, code: '    <span class="tok-type">Node</span>* root = <span class="tok-kw">new</span> <span class="tok-type">Node</span>();' },
      { line: 8, code: '    <span class="tok-type">Node</span>* <span class="tok-fn">walk</span>(<span class="tok-kw">const</span> <span class="tok-type">string</span>&amp; path) {' },
      { line: 9, code: '        <span class="tok-type">Node</span>* cur = root;' },
      { line: 10, code: '        <span class="tok-type">stringstream</span> <span class="tok-fn">ss</span>(path);' },
      { line: 11, code: '        <span class="tok-type">string</span> part;' },
      { line: 12, code: '        <span class="tok-kw">while</span> (<span class="tok-fn">getline</span>(ss, part, <span class="tok-num">\'/\'</span>)) {' },
      { line: 13, code: '            <span class="tok-kw">if</span> (part.<span class="tok-fn">empty</span>()) <span class="tok-kw">continue</span>;' },
      { line: 14, code: '            <span class="tok-kw">if</span> (!cur-&gt;children.<span class="tok-fn">count</span>(part)) cur-&gt;children[part] = <span class="tok-kw">new</span> <span class="tok-type">Node</span>();' },
      { line: 15, code: '            cur = cur-&gt;children[part];' },
      { line: 16, code: '        }' },
      { line: 17, code: '        <span class="tok-kw">return</span> cur;' },
      { line: 18, code: '    }' },
      { line: 19, code: '<span class="tok-kw">public</span>:' },
      { line: 20, code: '    <span class="tok-fn">FileSystem</span>() {}' },
      { line: 21, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; <span class="tok-fn">ls</span>(<span class="tok-type">string</span> path) {' },
      { line: 22, code: '        <span class="tok-type">Node</span>* cur = <span class="tok-fn">walk</span>(path);' },
      { line: 23, code: '        <span class="tok-kw">if</span> (cur-&gt;isFile) <span class="tok-kw">return</span> {path.<span class="tok-fn">substr</span>(path.<span class="tok-fn">find_last_of</span>(<span class="tok-num">\'/\'</span>) + <span class="tok-num">1</span>)};' },
      { line: 24, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; res;' },
      { line: 25, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; [name, child] : cur-&gt;children) res.<span class="tok-fn">push_back</span>(name);' },
      { line: 26, code: '        <span class="tok-kw">return</span> res;' },
      { line: 27, code: '    }' },
      { line: 28, code: '    <span class="tok-kw">void</span> <span class="tok-fn">mkdir</span>(<span class="tok-type">string</span> path) {' },
      { line: 29, code: '        <span class="tok-fn">walk</span>(path);' },
      { line: 30, code: '    }' },
      { line: 31, code: '    <span class="tok-kw">void</span> <span class="tok-fn">addContentToFile</span>(<span class="tok-type">string</span> filePath, <span class="tok-type">string</span> content) {' },
      { line: 32, code: '        <span class="tok-type">Node</span>* cur = <span class="tok-fn">walk</span>(filePath);' },
      { line: 33, code: '        cur-&gt;isFile = <span class="tok-kw">true</span>;' },
      { line: 34, code: '        cur-&gt;content += content;' },
      { line: 35, code: '    }' },
      { line: 36, code: '    <span class="tok-type">string</span> <span class="tok-fn">readContentFromFile</span>(<span class="tok-type">string</span> filePath) {' },
      { line: 37, code: '        <span class="tok-kw">return</span> <span class="tok-fn">walk</span>(filePath)-&gt;content;' },
      { line: 38, code: '    }' },
      { line: 39, code: '};' }
    ],

    generateTrace(opsInput, valsInput) {
      const ops = Array.isArray(opsInput) ? opsInput.slice() : [];
      const vals = Array.isArray(valsInput) ? valsInput.map((v) => (Array.isArray(v) ? v.slice() : [])) : [];
      const steps = [];
      const splitPath = (p) => String(p).split("/").filter((x) => x.length);

      // 先預跑一次，取得最終樹狀結構以固定節點座標（避免逐步成長時節點跳動）。
      const allPaths = new Set(["/"]);
      ops.forEach((op, k) => {
        if (op === "FileSystem") return;
        const parts = splitPath((vals[k] || [])[0] || "/");
        let acc = "";
        parts.forEach((p) => {
          acc += `/${p}`;
          allPaths.add(acc);
        });
      });
      const parentOf = (p) => (p === "/" ? null : p.lastIndexOf("/") === 0 ? "/" : p.slice(0, p.lastIndexOf("/")));
      const nameOf = (p) => (p === "/" ? "/" : p.slice(p.lastIndexOf("/") + 1));
      const childList = {};
      allPaths.forEach((p) => {
        childList[p] = [];
      });
      allPaths.forEach((p) => {
        const par = parentOf(p);
        if (par !== null) childList[par].push(p);
      });
      Object.keys(childList).forEach((p) => childList[p].sort((a, b) => (nameOf(a) < nameOf(b) ? -1 : nameOf(a) > nameOf(b) ? 1 : 0)));
      const pos = {};
      let leafCursor = 0;
      let maxDepth = 0;
      const layout = (p, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const kids = childList[p];
        if (!kids.length) {
          pos[p] = { x: 50 + leafCursor * 92, y: 42 + depth * 78 };
          leafCursor++;
          return;
        }
        kids.forEach((c) => layout(c, depth + 1));
        pos[p] = { x: Math.round((pos[kids[0]].x + pos[kids[kids.length - 1]].x) / 2), y: 42 + depth * 78 };
      };
      layout("/", 0);
      const treeW = Math.max(320, 50 + leafCursor * 92);
      const treeH = Math.max(200, 100 + maxDepth * 78);
      let pathIdCounter = 0;
      const nodeIds = {};
      allPaths.forEach((p) => {
        nodeIds[p] = `p${pathIdCounter++}`;
      });

      // 真正的檔案系統狀態
      const fs = { "/": { isFile: false, content: "" } };
      const callRows = [];
      let opLabel = "-";

      const fmtRet = (r) => (r === null ? "null" : Array.isArray(r) ? `[${r.map((x) => `"${x}"`).join(",")}]` : `"${r}"`);

      const snap = (o = {}) => {
        const { cur = null, hlPath = [], newPath = null, part = "-", ret = "-", retStatus = "", rowStatus = {}, conns = [], extraVars = [] } = o;
        const nodes = Object.keys(fs).map((p) => {
          const info = fs[p];
          let status = "";
          if (p === newPath) status = "match";
          else if (p === cur) status = "hl";
          else if (hlPath.includes(p)) status = "done";
          return {
            id: nodeIds[p],
            val: esc5(nameOf(p)),
            sub: info.isFile ? esc5(`檔案 "${info.content}"`) : p === "/" ? "root" : "dir",
            x: pos[p].x,
            y: pos[p].y,
            status,
            ptr: p === cur ? "cur" : ""
          };
        });
        const edges = Object.keys(fs)
          .filter((p) => p !== "/")
          .map((p) => ({
            from: nodeIds[parentOf(p)],
            to: nodeIds[p],
            label: "",
            dir: true,
            status: hlPath.includes(p) || p === cur ? "hl" : ""
          }));
        return {
          boards: [
            {
              id: "fs",
              type: "tree",
              shape: "circle",
              name: "root",
              typeLabel: "目錄 Trie (map&lt;string, Node*&gt;)",
              x: 325,
              y: 52,
              width: treeW,
              height: treeH,
              nodes,
              edges
            },
            {
              id: "calls",
              type: "dict",
              name: "calls",
              typeLabel: "呼叫序列與回傳值",
              x: 325 + treeW + 30,
              y: 52,
              headers: ["呼叫", "回傳", "狀態"],
              rows: callRows.map((r) => ({ id: r.id, key: esc5(r.call), val: esc5(r.ret), note: rowStatus[r.id] ? rowStatus[r.id].note : r.note, status: rowStatus[r.id] ? rowStatus[r.id].status : "" }))
            },
            varsBoard5([
              { id: "op", name: "操作", val: opLabel, status: "hl" },
              { id: "part", name: "part", val: part },
              { id: "cur", name: "cur", val: cur === null ? "-" : cur },
              ...extraVars,
              { id: "ret", name: "return", val: ret, status: retStatus }
            ], "FileSystem 狀態")
          ],
          connectors: conns
        };
      };

      // 逐層走訪路徑：產生 walk 的步驟，回傳最終節點路徑
      const walk = (path, rowId) => {
        let cur = "/";
        const visited = ["/"];
        steps.push(step5(9, "walk：從根開始", "tag-check", `cur = root, path = "${path}"`,
          `呼叫 walk("${path}")，從根目錄 / 出發，接著用 getline 依 '/' 把路徑切成一段一段。`,
          { 操作: opLabel, path, cur: "/" }, snap({ cur, hlPath: visited, rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards, []));
        const parts = splitPath(path);
        parts.forEach((part) => {
          const child = cur === "/" ? `/${part}` : `${cur}/${part}`;
          if (!fs[child]) {
            fs[child] = { isFile: false, content: "" };
            steps.push(step5(14, `建立節點 ${part}`, "tag-insert", `children["${part}"] = new Node()`,
              `目錄 ${cur} 底下沒有名為 "${part}" 的子節點，建立一個新的 Node 並放進 children（map 會依名稱字典序排列）。`,
              { 操作: opLabel, part, cur }, snap({ cur, hlPath: visited, newPath: child, part, rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards,
              [{ from: `wb-node-fs-${nodeIds[cur]}`, to: `wb-node-fs-${nodeIds[child]}`, label: `new "${part}"`, color: "purple" }]));
          }
          const prev = cur;
          cur = child;
          visited.push(cur);
          steps.push(step5(15, `進入 ${part}`, "tag-check", `cur = cur->children["${part}"]`,
            `沿著 children["${part}"] 從 ${prev} 往下走到 ${cur}。`,
            { 操作: opLabel, part, cur }, snap({ cur, hlPath: visited, part, rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards,
            [{ from: `wb-node-fs-${nodeIds[prev]}`, to: `wb-node-fs-${nodeIds[cur]}`, label: part, color: "blue" }]));
        });
        return { cur, visited };
      };

      ops.forEach((op, k) => {
        const args = vals[k] || [];
        const rowId = `op${k}`;
        if (op === "FileSystem") {
          opLabel = "FileSystem()";
          callRows.push({ id: rowId, call: "FileSystem()", ret: "null", note: "完成" });
          steps.push(step5(20, "建立檔案系統", "default", "root = new Node()",
            "建構 FileSystem：只有一個空的根目錄節點 /，尚無任何子目錄或檔案。",
            { 操作: opLabel, cur: "-" }, snap({ rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards, []));
          return;
        }
        const path = String(args[0] === undefined ? "/" : args[0]);
        if (op === "ls") {
          opLabel = `ls("${path}")`;
          callRows.push({ id: rowId, call: opLabel, ret: "…", note: "" });
          const { cur, visited } = walk(path, rowId);
          const info = fs[cur];
          let res;
          if (info.isFile) {
            res = [nameOf(cur)];
            callRows[callRows.length - 1].ret = fmtRet(res);
            callRows[callRows.length - 1].note = "完成";
            steps.push(step5(23, "路徑是檔案", "tag-found", `isFile ➜ return {"${res[0]}"}`,
              `walk 停在 ${cur}，它是一個檔案，因此 ls 只回傳檔名 "${res[0]}"。`,
              { 操作: opLabel, cur, return: fmtRet(res) }, snap({ cur, hlPath: visited, ret: fmtRet(res), retStatus: "match", rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards,
              [{ from: `wb-node-fs-${nodeIds[cur]}`, to: `wb-dict-row-${rowId}`, label: "檔名", color: "green" }]));
          } else {
            steps.push(step5(23, "路徑是目錄", "tag-check", "isFile = false",
              `walk 停在 ${cur}，它是目錄而非檔案，要列出它底下所有子項目。`,
              { 操作: opLabel, cur }, snap({ cur, hlPath: visited, rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards, []));
            res = Object.keys(fs).filter((p) => parentOf(p) === cur).map(nameOf).sort();
            steps.push(step5(25, "依字典序收集子項目", "tag-insert", `res = ${fmtRet(res)}`,
              res.length
                ? `走訪 map children（已依名稱排序），把 ${res.map((x) => `"${x}"`).join("、")} 依序放入 res。`
                : `目錄 ${cur} 目前沒有任何子項目，res 為空陣列。`,
              { 操作: opLabel, cur, res: fmtRet(res) }, snap({ cur, hlPath: visited, extraVars: [{ id: "res", name: "res", val: fmtRet(res), status: "hl" }], rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards, []));
            callRows[callRows.length - 1].ret = fmtRet(res);
            callRows[callRows.length - 1].note = "完成";
            steps.push(step5(26, "回傳列表", "tag-found", `return ${fmtRet(res)}`,
              `ls("${path}") 回傳 ${fmtRet(res)}。`,
              { 操作: opLabel, cur, return: fmtRet(res) }, snap({ cur, hlPath: visited, ret: fmtRet(res), retStatus: "match", rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards,
              [{ from: `wb-node-fs-${nodeIds[cur]}`, to: `wb-dict-row-${rowId}`, label: "ls 結果", color: "green" }]));
          }
        } else if (op === "mkdir") {
          opLabel = `mkdir("${path}")`;
          callRows.push({ id: rowId, call: opLabel, ret: "…", note: "" });
          const { cur, visited } = walk(path, rowId);
          callRows[callRows.length - 1].ret = "null";
          callRows[callRows.length - 1].note = "完成";
          steps.push(step5(29, "mkdir 完成", "tag-found", "walk(path) ➜ void",
            `walk 已沿途建立所有缺少的目錄，mkdir("${path}") 完成，沒有回傳值。`,
            { 操作: opLabel, cur, return: "null" }, snap({ cur, hlPath: visited, ret: "null", retStatus: "match", rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards,
            [{ from: `wb-node-fs-${nodeIds[cur]}`, to: `wb-dict-row-${rowId}`, label: "已建立", color: "green" }]));
        } else if (op === "addContentToFile") {
          const content = String(args[1] === undefined ? "" : args[1]);
          opLabel = `addContentToFile("${path}", "${content}")`;
          callRows.push({ id: rowId, call: opLabel, ret: "…", note: "" });
          const { cur, visited } = walk(path, rowId);
          fs[cur].isFile = true;
          steps.push(step5(33, "標記為檔案", "tag-insert", "cur->isFile = true",
            `把 ${cur} 標記為檔案（若是新節點，就等同於建立新檔案）。`,
            { 操作: opLabel, cur, isFile: "true" }, snap({ cur, hlPath: visited, rowStatus: { [rowId]: { status: "inserted", note: "執行中" } } }).boards, []));
          const before = fs[cur].content;
          fs[cur].content += content;
          callRows[callRows.length - 1].ret = "null";
          callRows[callRows.length - 1].note = "完成";
          steps.push(step5(34, "附加內容", "tag-insert", `content = "${before}" + "${content}"`,
            before
              ? `檔案已有內容 "${before}"，在尾端附加 "${content}"，變成 "${fs[cur].content}"。`
              : `檔案原本為空，附加後內容為 "${fs[cur].content}"。`,
            { 操作: opLabel, cur, content: fs[cur].content, return: "null" }, snap({ cur, hlPath: visited, ret: "null", retStatus: "match", extraVars: [{ id: "content", name: "content", val: `"${fs[cur].content}"`, status: "hl" }], rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards,
            [{ from: `wb-node-fs-${nodeIds[cur]}`, to: "wb-var-content", label: `+= "${content}"`, color: "purple" }]));
        } else if (op === "readContentFromFile") {
          opLabel = `readContentFromFile("${path}")`;
          callRows.push({ id: rowId, call: opLabel, ret: "…", note: "" });
          const { cur, visited } = walk(path, rowId);
          const r = fs[cur].content;
          callRows[callRows.length - 1].ret = `"${r}"`;
          callRows[callRows.length - 1].note = "完成";
          steps.push(step5(37, "讀取檔案內容", "tag-found", `return "${r}"`,
            `walk 到達檔案 ${cur}，直接回傳它的內容 "${r}"。`,
            { 操作: opLabel, cur, return: `"${r}"` }, snap({ cur, hlPath: visited, ret: `"${r}"`, retStatus: "match", rowStatus: { [rowId]: { status: "hit", note: "完成" } } }).boards,
            [{ from: `wb-node-fs-${nodeIds[cur]}`, to: `wb-dict-row-${rowId}`, label: `"${r}"`, color: "green" }]));
        }
      });

      if (!steps.length) {
        steps.push(step5(20, "沒有操作", "default", "-", "操作序列為空。", { 操作: "-" }, snap().boards, []));
      }
      return steps;
    }
  };

  // ==========================================================================
  // #126 Employee Free Time (LC #759, Hard)
  // ==========================================================================
  window.PROBLEMS["employee-free-time"] = {
    id: 126,
    leetcodeId: 759,
    slug: "employee-free-time",
    title: "759. Employee Free Time (員工空閒時間)",
    difficulty: "Hard",
    topic: "Array / Sorting / Intervals",
    mins: 35,
    complexity: "Time O(N log N) · Space O(N)",
    argNames: ["schedule"],
    description:
      "給定每位員工已排序且互不重疊的工作區間清單 schedule，求所有員工「共同」的有限長度空閒時段。做法是把所有區間攤平成一個 vector<Interval>，依開始時間排序後由左往右掃描，維護目前已合併忙碌區塊的最晚結束時間 end：若下一個區間的開始時間大於 end，中間的 [end, start] 就是一段所有人都空閒的時間；否則把 end 延伸為兩者較大值。N 為區間總數，排序主導時間 O(N log N)。",

    presets: [
      { name: "範例 1：schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]", args: [[[[1, 2], [5, 6]], [[1, 3]], [[4, 10]]]] },
      { name: "範例 2：schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]", args: [[[[1, 3], [6, 7]], [[2, 4]], [[2, 5], [9, 12]]]] },
      { name: "單一員工：schedule = [[[1,2],[3,4],[7,8]]]", args: [[[[1, 2], [3, 4], [7, 8]]]] },
      { name: "完全重疊無空檔：schedule = [[[1,5]],[[2,3]],[[4,8]]]", args: [[[[1, 5]], [[2, 3]], [[4, 8]]]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">Interval</span>&gt; <span class="tok-fn">employeeFreeTime</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">Interval</span>&gt;&gt; schedule) {' },
      { line: 4, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">Interval</span>&gt; all, res;' },
      { line: 5, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; emp : schedule)' },
      { line: 6, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; it : emp) all.<span class="tok-fn">push_back</span>(it);' },
      { line: 7, code: '        <span class="tok-fn">sort</span>(all.<span class="tok-fn">begin</span>(), all.<span class="tok-fn">end</span>(), [](<span class="tok-kw">const</span> <span class="tok-type">Interval</span>&amp; a, <span class="tok-kw">const</span> <span class="tok-type">Interval</span>&amp; b) {' },
      { line: 8, code: '            <span class="tok-kw">return</span> a.start &lt; b.start;' },
      { line: 9, code: '        });' },
      { line: 10, code: '        <span class="tok-kw">int</span> end = all[<span class="tok-num">0</span>].end;' },
      { line: 11, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">1</span>; i &lt; (<span class="tok-kw">int</span>)all.<span class="tok-fn">size</span>(); i++) {' },
      { line: 12, code: '            <span class="tok-kw">if</span> (all[i].start &gt; end) {' },
      { line: 13, code: '                res.<span class="tok-fn">push_back</span>(<span class="tok-type">Interval</span>(end, all[i].start));' },
      { line: 14, code: '                end = all[i].end;' },
      { line: 15, code: '            } <span class="tok-kw">else</span> {' },
      { line: 16, code: '                end = <span class="tok-fn">max</span>(end, all[i].end);' },
      { line: 17, code: '            }' },
      { line: 18, code: '        }' },
      { line: 19, code: '        <span class="tok-kw">return</span> res;' },
      { line: 20, code: '    }' },
      { line: 21, code: '};' }
    ],

    generateTrace(scheduleInput) {
      const schedule = (Array.isArray(scheduleInput) ? scheduleInput : []).map((emp) =>
        (Array.isArray(emp) ? emp : []).map((it) => [Number(it[0]), Number(it[1])])
      );
      const steps = [];
      const all = [];
      const res = [];
      const origin = [];
      const maxCols = Math.max(1, ...schedule.map((e) => e.length));
      const gridCells = schedule.map((emp) => {
        const row = emp.map((it) => `[${it[0]},${it[1]}]`);
        while (row.length < maxCols) row.push("·");
        return row;
      });
      let end = "-";
      let sorted = false;

      const ivs = (arr) => arr.map((it) => `[${it[0]},${it[1]}]`);
      const resStr = () => `[${ivs(res).join(",")}]`;
      const snap = (o = {}) => {
        const { gridHl = [], gridDone = [], allHl = [], allMatch = [], allDone = [], ptrs = [], resHl = -1, ret = "-", conns = [] } = o;
        return {
          boards: [
            {
              id: "sch",
              type: "grid",
              name: "schedule",
              typeLabel: "每位員工的工作區間",
              x: 325,
              y: 52,
              cells: gridCells,
              rowLabels: schedule.map((_, r) => `emp ${r}`),
              hl: gridHl,
              done: gridDone,
              match: [],
              warn: []
            },
            arrBoard5("all", "all", sorted ? "攤平後依 start 排序 (vector&lt;Interval&gt;)" : "攤平的所有區間 (vector&lt;Interval&gt;)", 325, 120 + schedule.length * 44, ivs(all), {
              hl: allHl,
              match: allMatch,
              done: allDone,
              pointers: ptrs,
              indexLabels: sorted ? all.map((_, k) => `${k} (e${origin[k]})`) : all.map((_, k) => `${k}`)
            }),
            arrBoard5("res", "res", "共同空閒時段 (vector&lt;Interval&gt;)", 325, 270 + schedule.length * 44, ivs(res), {
              match: resHl >= 0 ? [resHl] : []
            }),
            varsBoard5([
              { id: "end", name: "end", val: end, status: end !== "-" ? "hl" : "" },
              { id: "n", name: "all.size()", val: all.length },
              { id: "res", name: "res.size()", val: res.length },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      const doneCells = [];
      schedule.forEach((emp, r) => {
        emp.forEach((it, c) => {
          all.push(it.slice());
          origin.push(r);
          const key = `${r},${c}`;
          steps.push(step5(6, `攤平 emp ${r} 的區間`, "tag-insert", `all.push_back([${it[0]},${it[1]}])`,
            `把員工 ${r} 的第 ${c} 個工作區間 [${it[0]}, ${it[1]}] 放進 all。我們只關心「有沒有任何人在忙」，所以可以把所有人的區間混在一起處理。`,
            { emp: r, it: `[${it[0]},${it[1]}]`, "all.size()": all.length },
            snap({ gridHl: [key], gridDone: doneCells.slice(), allHl: [all.length - 1] }).boards,
            [{ from: `wb-grid-sch-${r}-${c}`, to: `wb-cw-all-${all.length - 1}`, label: "push_back", color: "purple" }]));
          doneCells.push(key);
        });
      });

      const order = all.map((it, k) => ({ it, k, o: origin[k] }));
      order.sort((a, b) => a.it[0] - b.it[0] || a.k - b.k);
      const sortedAll = order.map((x) => x.it);
      const sortedOrigin = order.map((x) => x.o);
      all.length = 0;
      origin.length = 0;
      sortedAll.forEach((it, k) => {
        all.push(it);
        origin.push(sortedOrigin[k]);
      });
      sorted = true;
      steps.push(step5(7, "依開始時間排序", "default", `sort ➜ ${listStr5(ivs(all))}`,
        `將 all 依 start 由小到大排序：${ivs(all).join(" ")}。排序後只要由左往右掃描，就能把重疊的忙碌時間合併成連續區塊。索引下方的 e# 表示原本屬於哪位員工。`,
        { "all.size()": all.length }, snap({ gridDone: doneCells.slice() }).boards, []));

      if (!all.length) {
        steps.push(step5(19, "回傳答案", "tag-found", "return []", "沒有任何工作區間，因此沒有有限長度的共同空閒時段。", { return: "[]" }, snap({ ret: "[]" }).boards, []));
        return steps;
      }

      end = all[0][1];
      steps.push(step5(10, "初始化 end", "tag-check", `end = all[0].end = ${end}`,
        `第一個（最早開始的）區間是 [${all[0][0]}, ${all[0][1]}]，目前合併後的忙碌區塊延伸到 end = ${end}。`,
        { end, i: 0 }, snap({ gridDone: doneCells.slice(), allHl: [0], ptrs: [{ idx: 0, label: "i = 0", color: "blue" }] }).boards,
        [{ from: "wb-cw-all-0", to: "wb-var-end", label: `end = ${end}`, color: "blue" }]));

      for (let i = 1; i < all.length; i++) {
        const [st, en] = all[i];
        const doneIdx = Array.from({ length: i }, (_, k) => k);
        if (st > end) {
          steps.push(step5(12, "發現空檔", "tag-check", `${st} > end(${end}) ✓`,
            `區間 [${st}, ${en}] 的開始時間 ${st} 晚於目前忙碌區塊的結束 end = ${end}，代表 ${end} 到 ${st} 之間沒有任何員工在工作。`,
            { i, "all[i]": `[${st},${en}]`, end }, snap({ gridDone: doneCells.slice(), allHl: [i], allDone: doneIdx, ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }] }).boards,
            [{ from: `wb-cw-all-${i}`, to: "wb-var-end", label: `${st} > ${end}`, color: "blue" }]));
          res.push([end, st]);
          steps.push(step5(13, "加入空閒時段", "tag-found", `res.push_back([${end},${st}])`,
            `把共同空閒時段 [${end}, ${st}] 加入 res。`,
            { i, end, res: resStr() }, snap({ gridDone: doneCells.slice(), allHl: [i], allDone: doneIdx, ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }], resHl: res.length - 1 }).boards,
            [{ from: "wb-var-end", to: `wb-cw-res-${res.length - 1}`, label: "新空檔", color: "green" }]));
          end = en;
          steps.push(step5(14, "開始新的忙碌區塊", "tag-insert", `end = ${end}`,
            `從 [${st}, ${en}] 開始新的忙碌區塊，end 更新為 ${end}。`,
            { i, end }, snap({ gridDone: doneCells.slice(), allHl: [i], allDone: doneIdx, ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }] }).boards,
            [{ from: `wb-cw-all-${i}`, to: "wb-var-end", label: `end = ${end}`, color: "purple" }]));
        } else {
          const old = end;
          end = Math.max(end, en);
          steps.push(step5(16, "合併重疊區間", "tag-insert", `end = max(${old}, ${en}) = ${end}`,
            `區間 [${st}, ${en}] 的開始時間 ${st} ≤ end = ${old}，與目前忙碌區塊重疊或相接，沒有空檔。end 延伸為 max(${old}, ${en}) = ${end}。`,
            { i, "all[i]": `[${st},${en}]`, end }, snap({ gridDone: doneCells.slice(), allHl: [i], allDone: doneIdx, ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }] }).boards,
            [{ from: `wb-cw-all-${i}`, to: "wb-var-end", label: `max → ${end}`, color: "purple" }]));
        }
      }

      steps.push(step5(19, "回傳答案", "tag-found", `return ${resStr()}`,
        res.length ? `掃描完成，所有員工共同的有限空閒時段為 ${resStr()}。` : "掃描完成，所有忙碌時間彼此重疊或相接，沒有共同的有限空閒時段，回傳空陣列。",
        { end, return: resStr() }, snap({ gridDone: doneCells.slice(), allDone: all.map((_, k) => k), resHl: -1, ret: resStr() }).boards,
        res.length ? [{ from: `wb-cw-res-${res.length - 1}`, to: "wb-var-ret", label: "return res", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #127 Single Number (LC #136, Easy)
  // ==========================================================================
  window.PROBLEMS["single-number"] = {
    id: 127,
    leetcodeId: 136,
    slug: "single-number",
    title: "136. Single Number (只出現一次的數字)",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    mins: 15,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "整數陣列 nums 中除了某一個元素只出現一次外，其餘元素都恰好出現兩次，找出那個只出現一次的元素，且只能用常數額外空間。利用 XOR 的性質：a ^ a = 0、a ^ 0 = a，且滿足交換律與結合律。把所有數字依序 XOR 起來，成對的數字會互相抵銷成 0，最後剩下的就是答案。時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [2,2,1]", args: [[2, 2, 1]] },
      { name: "範例 2：nums = [4,1,2,1,2]", args: [[4, 1, 2, 1, 2]] },
      { name: "範例 3：nums = [1]", args: [[1]] },
      { name: "含負數：nums = [7,-3,5,7,5]", args: [[7, -3, 5, 7, 5]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">singleNumber</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums) {' },
      { line: 4, code: '        <span class="tok-kw">int</span> res = <span class="tok-num">0</span>;' },
      { line: 5, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> x : nums) {' },
      { line: 6, code: '            res ^= x;  <span class="tok-cmt">// 成對的數字互相抵銷</span>' },
      { line: 7, code: '        }' },
      { line: 8, code: '        <span class="tok-kw">return</span> res;' },
      { line: 9, code: '    }' },
      { line: 10, code: '};' }
    ],

    generateTrace(numsInput) {
      const nums = (Array.isArray(numsInput) ? numsInput : []).map(Number);
      const steps = [];
      const hasNeg = nums.some((v) => v < 0);
      const maxAbs = Math.max(1, ...nums.map((v) => Math.abs(v)));
      const W = hasNeg ? 8 : Math.max(4, Math.ceil(Math.log2(maxAbs + 1)));
      const bits = (v) => {
        const out = [];
        for (let b = W - 1; b >= 0; b--) out.push((v >> b) & 1);
        return out;
      };
      const colLabels = Array.from({ length: W }, (_, k) => `b${W - 1 - k}`);
      let res = 0;

      const snap = (o = {}) => {
        const { i = -1, before = null, x = null, ret = "-", conns = [], doneUpTo = 0 } = o;
        const rows = [];
        const rowLabels = [];
        const hl = [];
        const match = [];
        if (before !== null && x !== null) {
          rows.push(bits(before), bits(x), bits(before ^ x));
          rowLabels.push("res", "x", "res^x");
          bits(x).forEach((bv, c) => {
            if (bv) hl.push(`1,${c}`);
          });
          bits(before ^ x).forEach((bv, c) => {
            if (bv) match.push(`2,${c}`);
          });
        } else {
          rows.push(bits(res));
          rowLabels.push("res");
          bits(res).forEach((bv, c) => {
            if (bv) (ret !== "-" ? match : hl).push(`0,${c}`);
          });
        }
        return {
          boards: [
            arrBoard5("nums", "nums", "整數陣列 (vector&lt;int&gt;)", 325, 52, nums, {
              hl: i >= 0 ? [i] : [],
              done: Array.from({ length: doneUpTo }, (_, k) => k),
              pointers: i >= 0 ? [{ idx: i, label: `x = ${nums[i]}`, color: "blue" }] : []
            }),
            {
              id: "bits",
              type: "grid",
              name: "bits",
              typeLabel: hasNeg ? "二進位逐位 XOR（低 8 位，二補數）" : "二進位逐位 XOR",
              x: 325,
              y: 200,
              cells: rows,
              rowLabels,
              colLabels,
              hl,
              match,
              done: [],
              warn: []
            },
            varsBoard5([
              { id: "x", name: "x", val: i >= 0 ? nums[i] : "-", status: i >= 0 ? "hl" : "" },
              { id: "res", name: "res", val: res, status: "hl" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      steps.push(step5(4, "初始化 res", "default", "res = 0",
        `res 從 0 開始；任何數 x 與 0 做 XOR 都等於 x 本身。nums 共有 ${nums.length} 個數字。`,
        { res: 0 }, snap().boards, []));
      nums.forEach((x, i) => {
        steps.push(step5(5, `取出 nums[${i}]`, "tag-check", `x = ${x}`,
          `迴圈取出第 ${i} 個數字 x = ${x}。`,
          { i, x, res }, snap({ i, doneUpTo: i }).boards,
          [{ from: `wb-cw-nums-${i}`, to: "wb-var-x", label: `x = ${x}`, color: "blue" }]));
        const before = res;
        res ^= x;
        steps.push(step5(6, "res ^= x", "tag-insert", `${before} ^ ${x} = ${res}`,
          `逐位比較：相同位元 XOR 為 0、不同為 1。${before} ^ ${x} = ${res}。${res === 0 ? "目前所有數字都已兩兩抵銷。" : nums.slice(0, i).includes(x) ? `之前已出現過 ${x}，這次把它抵銷掉。` : ""}`,
          { i, x, res }, snap({ i, before, x, doneUpTo: i }).boards,
          [{ from: `wb-cw-nums-${i}`, to: "wb-dyn-bits", label: "XOR", color: "purple" }]));
      });
      steps.push(step5(8, "回傳答案", "tag-found", `return ${res}`,
        `所有出現兩次的數字都互相抵銷成 0，只剩下出現一次的 ${res}。`,
        { res, return: res }, snap({ ret: res, doneUpTo: nums.length }).boards,
        [{ from: "wb-dyn-bits", to: "wb-var-ret", label: `答案 ${res}`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #128 Palindrome Linked List (LC #234, Easy)
  // ==========================================================================
  window.PROBLEMS["palindrome-linked-list"] = {
    id: 128,
    leetcodeId: 234,
    slug: "palindrome-linked-list",
    title: "234. Palindrome Linked List (迴文鏈結串列)",
    difficulty: "Easy",
    topic: "Linked List / Two Pointers",
    mins: 20,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head"],
    description:
      "判斷單向鏈結串列 head 的節點值是否構成迴文。先用快慢指針（fast 一次走兩步、slow 一次走一步）找到後半段的起點，再把後半段原地反轉，最後讓 left 從頭、right 從反轉後的尾端同步往中間比較；只要有一對不相等就回傳 false。全程只用常數個指標，時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：head = [1,2,2,1]", args: [[1, 2, 2, 1]] },
      { name: "範例 2：head = [1,2]", args: [[1, 2]] },
      { name: "奇數長度：head = [1,2,3,2,1]", args: [[1, 2, 3, 2, 1]] },
      { name: "不是迴文：head = [1,2,3,1]", args: [[1, 2, 3, 1]] },
      { name: "單一節點：head = [7]", args: [[7]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isPalindrome</span>(<span class="tok-type">ListNode</span>* head) {' },
      { line: 4, code: '        <span class="tok-type">ListNode</span>* slow = head;' },
      { line: 5, code: '        <span class="tok-type">ListNode</span>* fast = head;' },
      { line: 6, code: '        <span class="tok-kw">while</span> (fast &amp;&amp; fast-&gt;next) {' },
      { line: 7, code: '            slow = slow-&gt;next;' },
      { line: 8, code: '            fast = fast-&gt;next-&gt;next;' },
      { line: 9, code: '        }' },
      { line: 10, code: '        <span class="tok-type">ListNode</span>* prev = <span class="tok-kw">nullptr</span>;' },
      { line: 11, code: '        <span class="tok-kw">while</span> (slow) {  <span class="tok-cmt">// 反轉後半段</span>' },
      { line: 12, code: '            <span class="tok-type">ListNode</span>* nxt = slow-&gt;next;' },
      { line: 13, code: '            slow-&gt;next = prev;' },
      { line: 14, code: '            prev = slow;' },
      { line: 15, code: '            slow = nxt;' },
      { line: 16, code: '        }' },
      { line: 17, code: '        <span class="tok-type">ListNode</span>* left = head;' },
      { line: 18, code: '        <span class="tok-type">ListNode</span>* right = prev;' },
      { line: 19, code: '        <span class="tok-kw">while</span> (right) {' },
      { line: 20, code: '            <span class="tok-kw">if</span> (left-&gt;val != right-&gt;val) <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
      { line: 21, code: '            left = left-&gt;next;' },
      { line: 22, code: '            right = right-&gt;next;' },
      { line: 23, code: '        }' },
      { line: 24, code: '        <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
      { line: 25, code: '    }' },
      { line: 26, code: '};' }
    ],

    generateTrace(headInput) {
      const vals = (Array.isArray(headInput) ? headInput : []).map(Number);
      const n = vals.length;
      const next = vals.map((_, k) => (k + 1 < n ? k + 1 : -1));
      const steps = [];
      const NUL = -1;
      const P = { slow: NUL, fast: NUL, prev: NUL, nxt: NUL, left: NUL, right: NUL };
      const nm = (k) => (k === NUL ? "nullptr" : `Node(${vals[k]})`);

      const snap = (o = {}) => {
        const { show = [], hl = [], match = [], warn = [], done = [], hlEdge = -1, ret = "-", conns = [] } = o;
        const nodes = vals.map((v, k) => {
          const ptrNames = show.filter((p) => P[p] === k);
          let status = "";
          if (warn.includes(k)) status = "warn";
          else if (match.includes(k)) status = "match";
          else if (hl.includes(k)) status = "hl";
          else if (done.includes(k)) status = "done";
          return { id: `n${k}`, val: String(v), sub: `#${k}`, x: 56 + k * 104, y: 78, status, ptr: ptrNames.join(" / ") };
        });
        const edges = [];
        next.forEach((t, k) => {
          if (t !== NUL) edges.push({ from: `n${k}`, to: `n${t}`, label: "next", dir: true, status: k === hlEdge ? "hl" : "" });
        });
        const nullTail = next.map((t, k) => (t === NUL ? k : null)).filter((k) => k !== null);
        return {
          boards: [
            {
              id: "ll",
              type: "list",
              shape: "list",
              name: "head",
              typeLabel: "單向鏈結串列 (ListNode*)",
              x: 325,
              y: 52,
              width: Math.max(320, 56 + n * 104),
              height: 170,
              nodes: nodes.map((nd, k) => (nullTail.includes(k) ? { ...nd, sub: `#${k} → null` } : nd)),
              edges
            },
            varsBoard5([
              ...show.map((p) => ({ id: p, name: p, val: nm(P[p]), status: hl.includes(P[p]) || match.includes(P[p]) || warn.includes(P[p]) ? "hl" : "" })),
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? (ret === "true" ? "match" : "warn") : "" }
            ], "指標變數")
          ],
          connectors: conns
        };
      };
      const V = (names, extra = {}) => {
        const o = {};
        names.forEach((p) => {
          o[p] = nm(P[p]);
        });
        return { ...o, ...extra };
      };

      P.slow = n ? 0 : NUL;
      P.fast = n ? 0 : NUL;
      steps.push(step5(5, "初始化快慢指針", "default", "slow = fast = head",
        n ? `slow 與 fast 都從 head（值 ${vals[0]}）出發。fast 每次走兩步、slow 每次走一步，fast 走到底時 slow 恰好位於後半段起點。` : "串列為空，slow 與 fast 都是 nullptr。",
        V(["slow", "fast"]), snap({ show: ["slow", "fast"], hl: n ? [0] : [] }).boards, []));

      while (P.fast !== NUL && next[P.fast] !== NUL) {
        const os = P.slow;
        P.slow = next[P.slow];
        steps.push(step5(7, "slow 前進一步", "tag-check", `slow = ${nm(P.slow)}`,
          `fast 後面至少還有一個節點，slow 往前走一步到索引 ${P.slow}（值 ${vals[P.slow]}）。`,
          V(["slow", "fast"]), snap({ show: ["slow", "fast"], hl: [P.slow, P.fast], hlEdge: os }).boards,
          [{ from: `wb-node-ll-n${os}`, to: `wb-node-ll-n${P.slow}`, label: "+1", color: "blue" }]));
        const of = P.fast;
        P.fast = next[next[P.fast]];
        steps.push(step5(8, "fast 前進兩步", "tag-check", `fast = ${nm(P.fast)}`,
          P.fast === NUL ? "fast 走兩步後變成 nullptr（偶數長度），迴圈即將結束。" : `fast 往前走兩步到索引 ${P.fast}（值 ${vals[P.fast]}）。`,
          V(["slow", "fast"]), snap({ show: ["slow", "fast"], hl: P.fast === NUL ? [P.slow] : [P.slow, P.fast], hlEdge: next[of] }).boards,
          P.fast === NUL ? [] : [{ from: `wb-node-ll-n${of}`, to: `wb-node-ll-n${P.fast}`, label: "+2", color: "red" }]));
      }

      P.prev = NUL;
      steps.push(step5(10, "準備反轉後半段", "default", `prev = nullptr, slow = ${nm(P.slow)}`,
        n ? `快慢指針結束，slow 停在索引 ${P.slow}（值 ${vals[P.slow]}），從這裡開始的後半段要原地反轉。` : "串列為空，沒有需要反轉的節點。",
        V(["slow", "prev"]), snap({ show: ["slow", "prev"], hl: P.slow === NUL ? [] : [P.slow] }).boards, []));

      const reversed = [];
      while (P.slow !== NUL) {
        P.nxt = next[P.slow];
        next[P.slow] = P.prev;
        reversed.push(P.slow);
        steps.push(step5(13, "反轉 next 指標", "tag-insert", `${nm(P.slow)}->next = ${nm(P.prev)}`,
          `先用 nxt 記住原本的下一個節點 ${nm(P.nxt)}，再把 slow（值 ${vals[P.slow]}）的 next 改指向 prev = ${nm(P.prev)}。`,
          V(["slow", "prev", "nxt"]), snap({ show: ["slow", "prev", "nxt"], hl: [P.slow], done: reversed.slice(0, -1), hlEdge: P.slow }).boards,
          P.prev === NUL ? [] : [{ from: `wb-node-ll-n${P.slow}`, to: `wb-node-ll-n${P.prev}`, label: "next ←", color: "purple" }]));
        P.prev = P.slow;
        P.slow = P.nxt;
        steps.push(step5(15, "prev、slow 前進", "tag-check", `prev = ${nm(P.prev)}, slow = ${nm(P.slow)}`,
          `prev 移到剛反轉的節點（值 ${vals[P.prev]}），slow 移到 nxt = ${nm(P.slow)}。`,
          V(["slow", "prev"]), snap({ show: ["slow", "prev"], hl: P.slow === NUL ? [] : [P.slow], done: reversed.slice() }).boards, []));
      }

      P.left = n ? 0 : NUL;
      P.right = P.prev;
      steps.push(step5(18, "設定左右指標", "default", `left = head, right = ${nm(P.right)}`,
        n ? `後半段已反轉完成。left 從 head 出發，right 從原本的尾端（值 ${vals[P.right]}）出發，兩邊同時往中間走並比較。` : "串列為空，right = nullptr，迴圈不會執行。",
        V(["left", "right"]), snap({ show: ["left", "right"], hl: n ? [P.left, P.right] : [] }).boards, []));

      const matched = [];
      while (P.right !== NUL) {
        const l = P.left;
        const r = P.right;
        if (vals[l] !== vals[r]) {
          steps.push(step5(20, "數值不相等", "tag-found", `${vals[l]} != ${vals[r]} ➜ return false`,
            `left 的值 ${vals[l]} 與 right 的值 ${vals[r]} 不同，串列不是迴文，立即回傳 false。`,
            V(["left", "right"], { return: "false" }), snap({ show: ["left", "right"], warn: [l, r], match: matched.slice(), ret: "false" }).boards,
            [{ from: `wb-node-ll-n${l}`, to: "wb-var-ret", label: `${vals[l]} ≠ ${vals[r]}`, color: "red" }]));
          return steps;
        }
        matched.push(l, r);
        steps.push(step5(20, "比較左右節點", "tag-check", `${vals[l]} == ${vals[r]} ✓`,
          `left（索引 ${l}）與 right（索引 ${r}）的值都是 ${vals[l]}，這一對對稱位置相符。`,
          V(["left", "right"]), snap({ show: ["left", "right"], match: matched.slice() }).boards,
          l === r ? [] : [{ from: `wb-node-ll-n${l}`, to: `wb-node-ll-n${r}`, label: "相等", color: "green" }]));
        P.left = next[l];
        P.right = next[r];
        steps.push(step5(22, "左右指標前進", "tag-check", `left = ${nm(P.left)}, right = ${nm(P.right)}`,
          P.right === NUL ? "right 走到 nullptr，代表後半段已全部比較完畢。" : `left 前進到索引 ${P.left}，right 沿著反轉後的 next 前進到索引 ${P.right}。`,
          V(["left", "right"]), snap({ show: ["left", "right"], match: matched.slice(), hl: [P.left, P.right].filter((k) => k !== NUL) }).boards, []));
      }

      steps.push(step5(24, "回傳答案", "tag-found", "return true",
        "所有對稱位置的值都相同，串列是迴文，回傳 true。",
        { return: "true" }, snap({ show: ["left", "right"], match: vals.map((_, k) => k), ret: "true" }).boards,
        n ? [{ from: "wb-node-ll-n0", to: "wb-var-ret", label: "迴文", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #129 Move Zeroes (LC #283, Easy)
  // ==========================================================================
  window.PROBLEMS["move-zeroes"] = {
    id: 129,
    leetcodeId: 283,
    slug: "move-zeroes",
    title: "283. Move Zeroes (移動零)",
    difficulty: "Easy",
    topic: "Array / Two Pointers",
    mins: 20,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "把整數陣列 nums 中所有的 0 移到尾端，同時保持非零元素的相對順序，且必須原地修改。使用讀寫雙指針：read 逐一掃描每個元素，write 指向下一個非零元素應該放的位置；遇到非零值就 swap(nums[write], nums[read]) 並讓 write 前進。如此非零元素依原順序集中到前面，0 自然被換到後面。時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [0,1,0,3,12]", args: [[0, 1, 0, 3, 12]] },
      { name: "範例 2：nums = [0]", args: [[0]] },
      { name: "沒有零：nums = [1,2,3]", args: [[1, 2, 3]] },
      { name: "零集中在前：nums = [0,0,4,0,5]", args: [[0, 0, 4, 0, 5]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">void</span> <span class="tok-fn">moveZeroes</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums) {' },
      { line: 4, code: '        <span class="tok-kw">int</span> write = <span class="tok-num">0</span>;  <span class="tok-cmt">// 下一個非零元素要放的位置</span>' },
      { line: 5, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> read = <span class="tok-num">0</span>; read &lt; (<span class="tok-kw">int</span>)nums.<span class="tok-fn">size</span>(); read++) {' },
      { line: 6, code: '            <span class="tok-kw">if</span> (nums[read] != <span class="tok-num">0</span>) {' },
      { line: 7, code: '                <span class="tok-fn">swap</span>(nums[write], nums[read]);' },
      { line: 8, code: '                write++;' },
      { line: 9, code: '            }' },
      { line: 10, code: '        }' },
      { line: 11, code: '    }' },
      { line: 12, code: '};' }
    ],

    generateTrace(numsInput) {
      const nums = (Array.isArray(numsInput) ? numsInput : []).map(Number);
      const n = nums.length;
      const steps = [];
      let write = 0;

      const snap = (o = {}) => {
        const { read = -1, hl = [], warn = [], ret = "-", conns = [] } = o;
        const ptrs = [];
        if (read >= 0 && read < n) ptrs.push({ idx: read, label: `read = ${read}`, color: "blue" });
        if (write < n) ptrs.push({ idx: write, label: `write = ${write}`, color: "purple" });
        const match = ret !== "-" ? nums.map((v, k) => (v !== 0 ? k : -1)).filter((k) => k >= 0) : Array.from({ length: write }, (_, k) => k);
        return {
          boards: [
            arrBoard5("nums", "nums", "原地修改的陣列 (vector&lt;int&gt;&amp;)", 325, 52, nums, {
              hl,
              warn,
              match,
              done: ret !== "-" ? nums.map((v, k) => (v === 0 ? k : -1)).filter((k) => k >= 0) : [],
              pointers: ret !== "-" ? [] : ptrs
            }),
            varsBoard5([
              { id: "read", name: "read", val: read >= 0 && read < n ? read : "-", status: read >= 0 && read < n ? "hl" : "" },
              { id: "write", name: "write", val: write, status: "hl" },
              { id: "cur", name: "nums[read]", val: read >= 0 && read < n ? nums[read] : "-" },
              { id: "ret", name: "nums (結果)", val: ret, status: ret !== "-" ? "match" : "" }
            ], "讀寫雙指針")
          ],
          connectors: conns
        };
      };

      steps.push(step5(4, "初始化 write", "default", "write = 0",
        "write 指向「下一個非零元素該放的位置」，一開始是索引 0。綠色區塊代表已經排好的非零前綴。",
        { write }, snap().boards, []));
      for (let read = 0; read < n; read++) {
        const v = nums[read];
        if (v === 0) {
          steps.push(step5(6, `nums[${read}] 是 0`, "tag-check", `nums[${read}] = 0 ➜ 跳過`,
            `nums[${read}] = 0，不需要搬動，write 留在 ${write} 等待下一個非零值。`,
            { read, write, "nums[read]": v }, snap({ read, warn: [read] }).boards, []));
          continue;
        }
        steps.push(step5(6, `nums[${read}] 非零`, "tag-check", `nums[${read}] = ${v} != 0 ✓`,
          `nums[${read}] = ${v} 是非零值，要把它放到 write = ${write} 的位置。`,
          { read, write, "nums[read]": v }, snap({ read, hl: [read] }).boards, []));
        const a = nums[write];
        nums[write] = nums[read];
        nums[read] = a;
        steps.push(step5(7, read === write ? "原地 swap" : "交換到前方", "tag-insert", `swap(nums[${write}], nums[${read}])`,
          read === write
            ? `read 與 write 指向同一格（前面還沒遇到 0），swap 不改變陣列。`
            : `交換 nums[${write}] 與 nums[${read}]：非零值 ${v} 移到索引 ${write}，原本的 ${a} 移到索引 ${read}。`,
          { read, write, nums: listStr5(nums) }, snap({ read, hl: [read, write] }).boards,
          read === write ? [] : [{ from: `wb-cw-nums-${read}`, to: `wb-cw-nums-${write}`, label: `swap ${v}`, color: "purple" }]));
        write++;
        steps.push(step5(8, "write 前進", "tag-check", `write = ${write}`,
          `非零前綴擴大到索引 0..${write - 1}，write 前進到 ${write}。`,
          { read, write, nums: listStr5(nums) }, snap({ read }).boards, []));
      }
      steps.push(step5(11, "函式結束", "tag-found", `nums = ${listStr5(nums)}`,
        `掃描完成，所有非零元素依原順序排在前 ${write} 格，剩下的 ${n - write} 格都是 0。最終 nums = ${listStr5(nums)}。`,
        { write, nums: listStr5(nums) }, snap({ read: n, ret: listStr5(nums) }).boards,
        n ? [{ from: `wb-cw-nums-${n - 1}`, to: "wb-var-ret", label: "原地完成", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #130 Maximal Square (LC #221, Medium)
  // ==========================================================================
  window.PROBLEMS["maximal-square"] = {
    id: 130,
    leetcodeId: 221,
    slug: "maximal-square",
    title: "221. Maximal Square (最大正方形)",
    difficulty: "Medium",
    topic: "Dynamic Programming / Matrix",
    mins: 30,
    complexity: "Time O(m·n) · Space O(m·n)",
    argNames: ["matrix"],
    description:
      "在只含 '0' 與 '1' 的 m × n 二元矩陣中，找出只包含 '1' 的最大正方形並回傳其面積。定義 dp[i][j] 為「以 matrix[i-1][j-1] 為右下角」的最大全 1 正方形邊長（dp 多開一列一欄當作 0 邊界）。若該格為 '1'，則 dp[i][j] = min(上方, 左方, 左上方) + 1，因為正方形能延伸多大取決於三個方向中最短的那一個；同時記錄最大邊長 best，答案為 best × best。時間與空間皆為 O(m·n)。",

    presets: [
      {
        name: "範例 1：4×5 矩陣，最大面積 4",
        args: [[["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]]
      },
      { name: "範例 2：matrix = [[\"0\",\"1\"],[\"1\",\"0\"]]", args: [[["0", "1"], ["1", "0"]]] },
      { name: "範例 3：matrix = [[\"0\"]]", args: [[["0"]]] },
      {
        name: "邊長 3 的正方形：4×4 矩陣",
        args: [[["0", "1", "1", "1"], ["1", "1", "1", "1"], ["0", "1", "1", "1"], ["1", "1", "0", "1"]]]
      }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">maximalSquare</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&gt;&amp; matrix) {' },
      { line: 4, code: '        <span class="tok-kw">int</span> m = matrix.<span class="tok-fn">size</span>(), n = matrix[<span class="tok-num">0</span>].<span class="tok-fn">size</span>(), best = <span class="tok-num">0</span>;' },
      { line: 5, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">dp</span>(m + <span class="tok-num">1</span>, <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;(n + <span class="tok-num">1</span>, <span class="tok-num">0</span>));' },
      { line: 6, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">1</span>; i &lt;= m; i++) {' },
      { line: 7, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> j = <span class="tok-num">1</span>; j &lt;= n; j++) {' },
      { line: 8, code: '                <span class="tok-kw">if</span> (matrix[i - <span class="tok-num">1</span>][j - <span class="tok-num">1</span>] == <span class="tok-num">\'1\'</span>) {' },
      { line: 9, code: '                    dp[i][j] = <span class="tok-fn">min</span>({dp[i - <span class="tok-num">1</span>][j], dp[i][j - <span class="tok-num">1</span>], dp[i - <span class="tok-num">1</span>][j - <span class="tok-num">1</span>]}) + <span class="tok-num">1</span>;' },
      { line: 10, code: '                    best = <span class="tok-fn">max</span>(best, dp[i][j]);' },
      { line: 11, code: '                }' },
      { line: 12, code: '            }' },
      { line: 13, code: '        }' },
      { line: 14, code: '        <span class="tok-kw">return</span> best * best;' },
      { line: 15, code: '    }' },
      { line: 16, code: '};' }
    ],

    generateTrace(matrixInput) {
      const matrix = (Array.isArray(matrixInput) ? matrixInput : []).map((row) => (Array.isArray(row) ? row.map((c) => String(c)) : []));
      const m = matrix.length;
      const n = m ? matrix[0].length : 0;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      const steps = [];
      let best = 0;
      let bestCell = null;
      const gridW = 30 + n * 54;

      const squareCells = (cell, size, offset) => {
        const out = [];
        if (!cell || !size) return out;
        const [bi, bj] = cell;
        for (let r = bi - size + 1; r <= bi; r++) for (let c = bj - size + 1; c <= bj; c++) out.push(`${r - offset},${c - offset}`);
        return out;
      };

      const snap = (o = {}) => {
        const { i = -1, j = -1, nb = false, ret = "-", conns = [] } = o;
        const doneM = [];
        const doneD = [];
        for (let r = 1; r <= m; r++) {
          for (let c = 1; c <= n; c++) {
            if (r < i || (r === i && c < j) || ret !== "-") {
              doneM.push(`${r - 1},${c - 1}`);
              doneD.push(`${r},${c}`);
            }
          }
        }
        const hlM = i >= 1 ? [`${i - 1},${j - 1}`] : [];
        const hlD = [];
        if (i >= 1) {
          hlD.push(`${i},${j}`);
          if (nb) hlD.push(`${i - 1},${j}`, `${i},${j - 1}`, `${i - 1},${j - 1}`);
        }
        const matchM = ret !== "-" ? squareCells(bestCell, best, 1) : [];
        const matchD = ret !== "-" && bestCell ? [`${bestCell[0]},${bestCell[1]}`] : [];
        return {
          boards: [
            {
              id: "mat",
              type: "grid",
              name: "matrix",
              typeLabel: "二元矩陣 (vector&lt;vector&lt;char&gt;&gt;)",
              x: 325,
              y: 52,
              cells: matrix.map((row) => row.map((c) => `'${c}'`)),
              hl: hlM,
              match: matchM,
              done: doneM.filter((k) => !hlM.includes(k)),
              warn: i >= 1 && matrix[i - 1][j - 1] === "0" ? hlM : []
            },
            {
              id: "dp",
              type: "grid",
              name: "dp",
              typeLabel: "dp[i][j] = 以此格為右下角的最大邊長",
              x: 325 + gridW + 50,
              y: 52,
              cells: dp.map((row) => row.slice()),
              hl: hlD,
              match: matchD,
              done: doneD.filter((k) => !hlD.includes(k)),
              warn: []
            },
            varsBoard5([
              { id: "i", name: "i", val: i >= 1 ? i : "-" },
              { id: "j", name: "j", val: j >= 1 ? j : "-" },
              { id: "cell", name: "matrix[i-1][j-1]", val: i >= 1 ? `'${matrix[i - 1][j - 1]}'` : "-", status: i >= 1 ? "hl" : "" },
              { id: "dpij", name: "dp[i][j]", val: i >= 1 ? dp[i][j] : "-", status: i >= 1 && dp[i][j] ? "hl" : "" },
              { id: "best", name: "best", val: best, status: ret !== "-" ? "" : "hl" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      steps.push(step5(5, "建立 dp 表", "default", `dp = (${m}+1) × (${n}+1) 全 0`,
        `矩陣大小 ${m} × ${n}。dp 多開第 0 列與第 0 欄並填 0，當作邊界，這樣第一列、第一欄也能直接套用轉移式。`,
        { m, n, best }, snap().boards, []));

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const c = matrix[i - 1][j - 1];
          if (c !== "1") {
            steps.push(step5(8, `matrix[${i - 1}][${j - 1}] = '0'`, "tag-check", `'0' ➜ dp[${i}][${j}] = 0`,
              `matrix[${i - 1}][${j - 1}] 是 '0'，不可能當作全 1 正方形的右下角，dp[${i}][${j}] 維持 0。`,
              { i, j, "matrix[i-1][j-1]": c, best }, snap({ i, j }).boards, []));
            continue;
          }
          const up = dp[i - 1][j];
          const left = dp[i][j - 1];
          const diag = dp[i - 1][j - 1];
          dp[i][j] = Math.min(up, left, diag) + 1;
          steps.push(step5(9, `計算 dp[${i}][${j}]`, "tag-insert", `min(${up}, ${left}, ${diag}) + 1 = ${dp[i][j]}`,
            `matrix[${i - 1}][${j - 1}] 是 '1'。以它為右下角的正方形受限於上方 dp = ${up}、左方 dp = ${left}、左上 dp = ${diag} 三者中最小者，因此 dp[${i}][${j}] = ${Math.min(up, left, diag)} + 1 = ${dp[i][j]}。`,
            { i, j, "matrix[i-1][j-1]": c, "dp[i][j]": dp[i][j], best }, snap({ i, j, nb: true }).boards,
            [{ from: `wb-grid-mat-${i - 1}-${j - 1}`, to: `wb-grid-dp-${i}-${j}`, label: `邊長 ${dp[i][j]}`, color: "purple" }]));
          const improved = dp[i][j] > best;
          const oldBest = best;
          if (improved) {
            best = dp[i][j];
            bestCell = [i, j];
          }
          steps.push(step5(10, improved ? "更新最大邊長" : "比較最大邊長", improved ? "tag-found" : "tag-check",
            `best = max(${oldBest}, ${dp[i][j]}) = ${best}`,
            improved ? `dp[${i}][${j}] = ${dp[i][j]} 比目前的 best 大，best 更新為 ${best}。` : `dp[${i}][${j}] = ${dp[i][j]} 沒有超過 best = ${best}。`,
            { i, j, "dp[i][j]": dp[i][j], best }, snap({ i, j }).boards,
            improved ? [{ from: `wb-grid-dp-${i}-${j}`, to: "wb-var-best", label: `best = ${best}`, color: "green" }] : []));
        }
      }

      steps.push(step5(14, "回傳面積", "tag-found", `return ${best} * ${best} = ${best * best}`,
        best
          ? `最大全 1 正方形邊長為 ${best}（右下角在 matrix[${bestCell[0] - 1}][${bestCell[1] - 1}]），面積 ${best} × ${best} = ${best * best}。`
          : "矩陣中沒有任何 '1'，最大正方形面積為 0。",
        { best, return: best * best }, snap({ ret: best * best }).boards,
        bestCell ? [{ from: `wb-grid-dp-${bestCell[0]}-${bestCell[1]}`, to: "wb-var-ret", label: `${best}² = ${best * best}`, color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #131 Rotate Image (LC #48, Medium)
  // ==========================================================================
  window.PROBLEMS["rotate-image"] = {
    id: 131,
    leetcodeId: 48,
    slug: "rotate-image",
    title: "48. Rotate Image (旋轉圖像)",
    difficulty: "Medium",
    topic: "Array / Matrix",
    mins: 25,
    complexity: "Time O(n²) · Space O(1)",
    argNames: ["matrix"],
    description:
      "將 n × n 的二維矩陣原地順時針旋轉 90 度，不得配置另一個矩陣。順時針旋轉等價於兩個原地操作：先沿主對角線轉置（交換 matrix[i][j] 與 matrix[j][i]），再把每一列左右反轉。轉置讓原本的第 i 列變成第 i 欄，左右反轉則把欄的順序倒過來，合起來就是順時針 90 度。時間 O(n²)、額外空間 O(1)。",

    presets: [
      { name: "範例 1：matrix = [[1,2,3],[4,5,6],[7,8,9]]", args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]] },
      { name: "範例 2：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]] },
      { name: "1×1 矩陣：matrix = [[1]]", args: [[[1]]] },
      { name: "2×2 矩陣：matrix = [[1,2],[3,4]]", args: [[[1, 2], [3, 4]]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">void</span> <span class="tok-fn">rotate</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; matrix) {' },
      { line: 4, code: '        <span class="tok-kw">int</span> n = matrix.<span class="tok-fn">size</span>();' },
      { line: 5, code: '        <span class="tok-cmt">// 1. 沿主對角線轉置</span>' },
      { line: 6, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; n; i++) {' },
      { line: 7, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> j = i + <span class="tok-num">1</span>; j &lt; n; j++) {' },
      { line: 8, code: '                <span class="tok-fn">swap</span>(matrix[i][j], matrix[j][i]);' },
      { line: 9, code: '            }' },
      { line: 10, code: '        }' },
      { line: 11, code: '        <span class="tok-cmt">// 2. 每一列左右反轉</span>' },
      { line: 12, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; n; i++) {' },
      { line: 13, code: '            <span class="tok-fn">reverse</span>(matrix[i].<span class="tok-fn">begin</span>(), matrix[i].<span class="tok-fn">end</span>());' },
      { line: 14, code: '        }' },
      { line: 15, code: '    }' },
      { line: 16, code: '};' }
    ],

    generateTrace(matrixInput) {
      const matrix = (Array.isArray(matrixInput) ? matrixInput : []).map((row) => (Array.isArray(row) ? row.map(Number) : []));
      const n = matrix.length;
      const steps = [];
      const fmt = () => `[${matrix.map((r) => `[${r.join(",")}]`).join(",")}]`;
      const transposed = [];
      const reversedRows = [];

      const snap = (o = {}) => {
        const { hl = [], match = [], phase = "轉置", i = "-", j = "-", ret = "-", conns = [] } = o;
        const done = [];
        if (phase === "反轉") {
          reversedRows.forEach((r) => {
            for (let c = 0; c < n; c++) done.push(`${r},${c}`);
          });
        } else {
          transposed.forEach((k) => done.push(k));
        }
        const diag = [];
        if (phase === "轉置" && ret === "-") for (let k = 0; k < n; k++) diag.push(`${k},${k}`);
        return {
          boards: [
            {
              id: "mat",
              type: "grid",
              name: "matrix",
              typeLabel: phase === "轉置" ? "步驟 1：沿主對角線轉置" : "步驟 2：每列左右反轉",
              x: 325,
              y: 52,
              cells: matrix.map((r) => r.slice()),
              hl,
              match: ret !== "-" ? matrix.flatMap((r, ri) => r.map((_, ci) => `${ri},${ci}`)) : match,
              done: done.filter((k) => !hl.includes(k) && !match.includes(k)),
              warn: diag.filter((k) => !hl.includes(k))
            },
            varsBoard5([
              { id: "n", name: "n", val: n },
              { id: "phase", name: "階段", val: phase, status: "hl" },
              { id: "i", name: "i", val: i },
              { id: "j", name: "j", val: j },
              { id: "ret", name: "matrix (結果)", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      steps.push(step5(4, "取得邊長", "default", `n = ${n}`,
        `矩陣大小為 ${n} × ${n}。順時針旋轉 90 度 = 先轉置、再把每一列左右反轉。紅框為主對角線，轉置時保持不動。`,
        { n }, snap().boards, []));

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = matrix[i][j];
          const b = matrix[j][i];
          matrix[i][j] = b;
          matrix[j][i] = a;
          transposed.push(`${i},${j}`, `${j},${i}`);
          steps.push(step5(8, `交換 (${i},${j}) ↔ (${j},${i})`, "tag-insert", `swap(${a}, ${b})`,
            `轉置：matrix[${i}][${j}] = ${a} 與對角線另一側的 matrix[${j}][${i}] = ${b} 互換位置。`,
            { n, i, j, "matrix[i][j]": b, "matrix[j][i]": a }, snap({ hl: [`${i},${j}`, `${j},${i}`], i, j }).boards,
            [{ from: `wb-grid-mat-${i}-${j}`, to: `wb-grid-mat-${j}-${i}`, label: "swap", color: "purple" }]));
        }
      }
      if (n > 1) {
        steps.push(step5(10, "轉置完成", "tag-check", `transpose ➜ ${fmt()}`,
          `轉置完成：原本的第 i 列變成了第 i 欄，目前 matrix = ${fmt()}。接下來把每一列左右反轉。`,
          { n, matrix: fmt() }, snap({ phase: "轉置" }).boards, []));
      }

      for (let i = 0; i < n; i++) {
        const before = `[${matrix[i].join(",")}]`;
        matrix[i].reverse();
        reversedRows.push(i);
        steps.push(step5(13, `反轉第 ${i} 列`, "tag-insert", `${before} ➜ [${matrix[i].join(",")}]`,
          `把第 ${i} 列左右反轉：${before} 變成 [${matrix[i].join(",")}]。`,
          { n, i, row: `[${matrix[i].join(",")}]` }, snap({ phase: "反轉", hl: matrix[i].map((_, c) => `${i},${c}`), i }).boards,
          n > 1 ? [{ from: `wb-grid-mat-${i}-0`, to: `wb-grid-mat-${i}-${n - 1}`, label: "reverse", color: "blue" }] : []));
      }

      steps.push(step5(15, "旋轉完成", "tag-found", `matrix = ${fmt()}`,
        `原地旋轉完成，matrix = ${fmt()}，已是原矩陣順時針轉 90 度的結果。`,
        { n, matrix: fmt() }, snap({ phase: "反轉", ret: fmt() }).boards,
        n ? [{ from: `wb-grid-mat-0-${n - 1}`, to: "wb-var-ret", label: "旋轉 90°", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #132 Binary Tree Zigzag Level Order Traversal (LC #103, Medium)
  // ==========================================================================
  window.PROBLEMS["binary-tree-zigzag-level-order-traversal"] = {
    id: 132,
    leetcodeId: 103,
    slug: "binary-tree-zigzag-level-order-traversal",
    title: "103. Binary Tree Zigzag Level Order Traversal (二元樹的鋸齒形層序走訪)",
    difficulty: "Medium",
    topic: "Binary Tree / BFS",
    mins: 25,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["root"],
    description:
      "回傳二元樹節點值的鋸齒形層序走訪：第 0 層由左到右、第 1 層由右到左，之後依此交替。以 queue<TreeNode*> 做標準 BFS，每一層先記錄節點數 sz 並開一個長度 sz 的 vector<int> level；依佇列順序取出第 i 個節點時，若本層由左到右就放在 level[i]，否則放在 level[sz - 1 - i]，最後切換方向旗標 leftToRight。每個節點只進出佇列一次，時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：root = [3,9,20,null,null,15,7]", args: [[3, 9, 20, null, null, 15, 7]] },
      { name: "範例 2：root = [1]", args: [[1]] },
      { name: "範例 3：root = []", args: [[]] },
      { name: "完整三層：root = [1,2,3,4,5,6,7]", args: [[1, 2, 3, 4, 5, 6, 7]] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">zigzagLevelOrder</span>(<span class="tok-type">TreeNode</span>* root) {' },
      { line: 4, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; res;' },
      { line: 5, code: '        <span class="tok-kw">if</span> (!root) <span class="tok-kw">return</span> res;' },
      { line: 6, code: '        <span class="tok-type">queue</span>&lt;<span class="tok-type">TreeNode</span>*&gt; q;' },
      { line: 7, code: '        q.<span class="tok-fn">push</span>(root);' },
      { line: 8, code: '        <span class="tok-kw">bool</span> leftToRight = <span class="tok-kw">true</span>;' },
      { line: 9, code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {' },
      { line: 10, code: '            <span class="tok-kw">int</span> sz = q.<span class="tok-fn">size</span>();' },
      { line: 11, code: '            <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; <span class="tok-fn">level</span>(sz);' },
      { line: 12, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; sz; i++) {' },
      { line: 13, code: '                <span class="tok-type">TreeNode</span>* node = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();' },
      { line: 14, code: '                <span class="tok-kw">int</span> idx = leftToRight ? i : sz - <span class="tok-num">1</span> - i;' },
      { line: 15, code: '                level[idx] = node-&gt;val;' },
      { line: 16, code: '                <span class="tok-kw">if</span> (node-&gt;left) q.<span class="tok-fn">push</span>(node-&gt;left);' },
      { line: 17, code: '                <span class="tok-kw">if</span> (node-&gt;right) q.<span class="tok-fn">push</span>(node-&gt;right);' },
      { line: 18, code: '            }' },
      { line: 19, code: '            res.<span class="tok-fn">push_back</span>(level);' },
      { line: 20, code: '            leftToRight = !leftToRight;' },
      { line: 21, code: '        }' },
      { line: 22, code: '        <span class="tok-kw">return</span> res;' },
      { line: 23, code: '    }' },
      { line: 24, code: '};' }
    ],

    generateTrace(rootArr) {
      const arr = Array.isArray(rootArr) ? rootArr.slice() : [];
      const tree = buildTreeFromLevelOrder(arr, 560);
      const steps = [];
      const res = [];
      let q = [];
      let level = [];
      let levelFilled = [];
      let leftToRight = true;
      const visited = new Set();
      const resStr = () => `[${res.map((l) => `[${l.join(",")}]`).join(",")}]`;

      const snap = (o = {}) => {
        const { cur = null, levelHl = -1, qHl = [], ret = "-", conns = [], i = "-", sz = "-", idx = "-" } = o;
        const nodes = tree.nodes.map((nd) => ({
          id: nd.id,
          val: String(nd.val),
          sub: `d=${nd.depth}`,
          x: nd.x,
          y: nd.y,
          status: cur && cur.id === nd.id ? "hl" : ret !== "-" ? "match" : visited.has(nd.id) ? "done" : "",
          ptr: cur && cur.id === nd.id ? "node" : ""
        }));
        const edges = tree.edges.map((e) => ({ ...e, status: cur && e.from === cur.id ? "hl" : "" }));
        const qY = 52 + tree.height + 24;
        return {
          boards: [
            { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)", x: 325, y: 52, width: tree.width, height: tree.height, nodes, edges },
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "BFS 佇列 (queue&lt;TreeNode*&gt;)",
              x: 325,
              y: qY,
              leftLabel: "front ←",
              rightLabel: "← back",
              items: q.map((nd, k) => ({ val: `Node(${nd.val})`, status: qHl.includes(k) ? "hl" : "" }))
            },
            arrBoard5("level", "level", `本層結果 (vector&lt;int&gt;)，方向：${leftToRight ? "左 → 右" : "右 → 左"}`, 325, qY + 110,
              level.map((v, k) => (levelFilled[k] ? v : "·")), {
                match: levelHl >= 0 ? [levelHl] : [],
                done: levelFilled.map((f, k) => (f && k !== levelHl ? k : -1)).filter((k) => k >= 0)
              }),
            {
              id: "res",
              type: "dict",
              name: "res",
              typeLabel: "結果 (vector&lt;vector&lt;int&gt;&gt;)",
              x: 325 + tree.width + 30,
              y: 52,
              headers: ["層", "內容", "方向"],
              rows: res.map((l, d) => ({ id: `lv${d}`, key: `第 ${d} 層`, val: `[${l.join(",")}]`, note: d % 2 === 0 ? "左 → 右" : "右 → 左", status: ret !== "-" ? "hit" : "" }))
            },
            varsBoard5([
              { id: "ltr", name: "leftToRight", val: leftToRight ? "true" : "false", status: "hl" },
              { id: "sz", name: "sz", val: sz },
              { id: "i", name: "i", val: i },
              { id: "idx", name: "idx", val: idx, status: idx !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      if (!tree.root) {
        steps.push(step5(5, "空樹", "tag-found", "root == nullptr ➜ return []",
          "根節點為空，沒有任何層可以走訪，直接回傳空陣列。",
          { return: "[]" }, snap({ ret: "[]" }).boards, []));
        return steps;
      }

      q.push(tree.root);
      steps.push(step5(7, "根節點入佇列", "tag-insert", `q.push(${tree.root.val})`,
        `把根節點 ${tree.root.val} 放入 BFS 佇列，第 0 層的方向為「左 → 右」。`,
        { "q.size()": 1, leftToRight: "true" }, snap({ qHl: [0] }).boards,
        [{ from: `wb-node-tree-${tree.root.id}`, to: "wb-queue-q-0", label: "push", color: "purple" }]));

      let depth = 0;
      while (q.length) {
        const sz = q.length;
        level = new Array(sz).fill(0);
        levelFilled = new Array(sz).fill(false);
        steps.push(step5(11, `開始第 ${depth} 層`, "tag-check", `sz = ${sz}, level(${sz})`,
          `佇列中目前的 ${sz} 個節點正好是第 ${depth} 層。開一個長度 ${sz} 的 level，本層方向為${leftToRight ? "「左 → 右」，第 i 個取出的節點放在 level[i]" : "「右 → 左」，第 i 個取出的節點放在 level[sz-1-i]"}。`,
          { depth, sz, leftToRight: String(leftToRight) }, snap({ sz, qHl: q.map((_, k) => k) }).boards, []));
        for (let i = 0; i < sz; i++) {
          const node = q.shift();
          visited.add(node.id);
          const idx = leftToRight ? i : sz - 1 - i;
          level[idx] = node.val;
          levelFilled[idx] = true;
          steps.push(step5(15, `放入 level[${idx}]`, "tag-insert", `idx = ${leftToRight ? i : `${sz}-1-${i}`} = ${idx}, level[${idx}] = ${node.val}`,
            `從佇列前端取出節點 ${node.val}（本層第 ${i} 個），依目前方向計算 idx = ${idx}，把 ${node.val} 寫入 level[${idx}]。`,
            { depth, sz, i, idx, "node->val": node.val }, snap({ cur: node, levelHl: idx, i, sz, idx }).boards,
            [{ from: `wb-node-tree-${node.id}`, to: `wb-cw-level-${idx}`, label: `level[${idx}]`, color: "purple" }]));
          const kids = [node.left, node.right].filter(Boolean);
          if (kids.length) {
            const start = q.length;
            kids.forEach((c) => q.push(c));
            steps.push(step5(node.right ? 17 : 16, "子節點入佇列", "tag-insert", `q.push(${kids.map((c) => c.val).join(", ")})`,
              `把節點 ${node.val} 的${node.left && node.right ? "左、右子節點" : node.left ? "左子節點" : "右子節點"} ${kids.map((c) => c.val).join("、")} 依「先左後右」放入佇列尾端，留給下一層處理。`,
              { depth, sz, i, "q.size()": q.length }, snap({ cur: node, i, sz, idx, qHl: kids.map((_, k) => start + k) }).boards,
              kids.map((c, k) => ({ from: `wb-node-tree-${c.id}`, to: `wb-queue-q-${start + k}`, label: k === 0 ? "push" : "", color: "blue" }))));
          }
        }
        res.push(level.slice());
        steps.push(step5(19, `第 ${depth} 層加入結果`, "tag-found", `res.push_back([${level.join(",")}])`,
          `第 ${depth} 層處理完畢，level = [${level.join(",")}] 加入 res。`,
          { depth, res: resStr() }, snap().boards,
          [{ from: "wb-dyn-level", to: `wb-dict-row-lv${depth}`, label: `第 ${depth} 層`, color: "green" }]));
        leftToRight = !leftToRight;
        steps.push(step5(20, "切換方向", "tag-check", `leftToRight = ${leftToRight}`,
          `下一層改為${leftToRight ? "「左 → 右」" : "「右 → 左」"}。佇列${q.length ? `還有 ${q.length} 個節點` : "已空，走訪即將結束"}。`,
          { depth, leftToRight: String(leftToRight), "q.size()": q.length }, snap().boards, []));
        depth++;
      }

      steps.push(step5(22, "回傳答案", "tag-found", `return ${resStr()}`,
        `所有層都已處理，鋸齒形層序走訪結果為 ${resStr()}。`,
        { return: resStr() }, snap({ ret: resStr() }).boards,
        [{ from: `wb-dict-row-lv${res.length - 1}`, to: "wb-var-ret", label: "return res", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #133 Design Hit Counter (LC #362, Medium)
  // ==========================================================================
  window.PROBLEMS["design-hit-counter"] = {
    id: 133,
    leetcodeId: 362,
    slug: "design-hit-counter",
    title: "362. Design Hit Counter (設計點擊計數器)",
    difficulty: "Medium",
    topic: "Design / Queue",
    mins: 30,
    complexity: "Time O(1) 均攤 per op · Space O(視窗內點擊數)",
    argNames: ["operations", "values"],
    description:
      "設計一個點擊計數器，hit(timestamp) 記錄一次點擊，getHits(timestamp) 回傳過去 300 秒內（含當下，即 (timestamp - 300, timestamp]）的點擊次數；呼叫的 timestamp 保證非遞減。用 queue<int> 依時間順序存放每次點擊的時間戳：hit 直接推入尾端；getHits 先把前端所有 timestamp - front ≥ 300 的過期點擊彈出，剩下的佇列長度就是答案。每筆點擊只進出佇列一次，均攤 O(1)。",

    presets: [
      {
        name: "範例 1：hit(1,2,3) getHits(4) hit(300) getHits(300,301)",
        args: [
          ["HitCounter", "hit", "hit", "hit", "getHits", "hit", "getHits", "getHits"],
          [[], [1], [2], [3], [4], [300], [300], [301]]
        ]
      },
      {
        name: "同一秒多次點擊：hit(1,1,100) getHits(300,301)",
        args: [
          ["HitCounter", "hit", "hit", "hit", "getHits", "getHits"],
          [[], [1], [1], [100], [300], [301]]
        ]
      },
      {
        name: "空計數器與恰好 300 秒邊界",
        args: [
          ["HitCounter", "getHits", "hit", "getHits", "getHits"],
          [[], [5], [10], [309], [310]]
        ]
      }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">HitCounter</span> {' },
      { line: 2, code: '    <span class="tok-type">queue</span>&lt;<span class="tok-kw">int</span>&gt; q;  <span class="tok-cmt">// 依時間順序存放每次點擊</span>' },
      { line: 3, code: '<span class="tok-kw">public</span>:' },
      { line: 4, code: '    <span class="tok-fn">HitCounter</span>() {}' },
      { line: 5, code: '    <span class="tok-kw">void</span> <span class="tok-fn">hit</span>(<span class="tok-kw">int</span> timestamp) {' },
      { line: 6, code: '        q.<span class="tok-fn">push</span>(timestamp);' },
      { line: 7, code: '    }' },
      { line: 8, code: '    <span class="tok-kw">int</span> <span class="tok-fn">getHits</span>(<span class="tok-kw">int</span> timestamp) {' },
      { line: 9, code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>() &amp;&amp; timestamp - q.<span class="tok-fn">front</span>() &gt;= <span class="tok-num">300</span>) {' },
      { line: 10, code: '            q.<span class="tok-fn">pop</span>();' },
      { line: 11, code: '        }' },
      { line: 12, code: '        <span class="tok-kw">return</span> q.<span class="tok-fn">size</span>();' },
      { line: 13, code: '    }' },
      { line: 14, code: '};' }
    ],

    generateTrace(opsInput, valsInput) {
      const ops = Array.isArray(opsInput) ? opsInput.slice() : [];
      const vals = Array.isArray(valsInput) ? valsInput.map((v) => (Array.isArray(v) ? v.slice() : [])) : [];
      const steps = [];
      const q = [];
      const rows = [];
      let opLabel = "-";

      const snap = (o = {}) => {
        const { ts = "-", qHl = [], qWarn = [], ret = "-", rowState = null, conns = [], diff = "-" } = o;
        return {
          boards: [
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "點擊時間戳佇列 (queue&lt;int&gt;)",
              x: 325,
              y: 52,
              leftLabel: "front（最舊）←",
              rightLabel: "← back（最新）",
              items: q.map((t, k) => ({ val: t, status: qWarn.includes(k) ? "warn" : qHl.includes(k) ? "hl" : "" }))
            },
            {
              id: "calls",
              type: "dict",
              name: "calls",
              typeLabel: "呼叫序列與回傳值",
              x: 325,
              y: 190,
              headers: ["呼叫", "回傳", "狀態"],
              rows: rows.map((r, k) => ({
                id: r.id,
                key: r.call,
                val: r.ret,
                note: rowState && k === rows.length - 1 ? rowState.note : r.note,
                status: rowState && k === rows.length - 1 ? rowState.status : ""
              }))
            },
            varsBoard5([
              { id: "op", name: "操作", val: opLabel, status: "hl" },
              { id: "ts", name: "timestamp", val: ts },
              { id: "front", name: "q.front()", val: q.length ? q[0] : "empty" },
              { id: "diff", name: "timestamp - front", val: diff, status: diff !== "-" ? "hl" : "" },
              { id: "size", name: "q.size()", val: q.length },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ], "HitCounter 狀態")
          ],
          connectors: conns
        };
      };

      ops.forEach((op, k) => {
        const args = vals[k] || [];
        const rowId = `op${k}`;
        if (op === "HitCounter") {
          opLabel = "HitCounter()";
          rows.push({ id: rowId, call: opLabel, ret: "null", note: "完成" });
          steps.push(step5(4, "建立計數器", "default", "q = {}",
            "建構 HitCounter，內部佇列 q 為空。之後每次點擊都依時間順序放到佇列尾端。",
            { 操作: opLabel, "q.size()": 0 }, snap({ rowState: { status: "hit", note: "完成" } }).boards, []));
          return;
        }
        const ts = Number(args[0]);
        if (op === "hit") {
          opLabel = `hit(${ts})`;
          rows.push({ id: rowId, call: opLabel, ret: "null", note: "完成" });
          q.push(ts);
          steps.push(step5(6, `記錄點擊 t=${ts}`, "tag-insert", `q.push(${ts})`,
            `在時間 ${ts} 發生一次點擊，把 ${ts} 推入佇列尾端。因為時間戳非遞減，佇列從前到後一定由舊到新排列。`,
            { 操作: opLabel, timestamp: ts, "q.size()": q.length }, snap({ ts, qHl: [q.length - 1], rowState: { status: "inserted", note: "完成" } }).boards,
            [{ from: `wb-dict-row-${rowId}`, to: `wb-queue-q-${q.length - 1}`, label: `push ${ts}`, color: "purple" }]));
          return;
        }
        if (op === "getHits") {
          opLabel = `getHits(${ts})`;
          rows.push({ id: rowId, call: opLabel, ret: "…", note: "" });
          while (q.length && ts - q[0] >= 300) {
            const diff = ts - q[0];
            steps.push(step5(9, "前端已過期", "tag-check", `${ts} - ${q[0]} = ${diff} ≥ 300 ✓`,
              `佇列前端的點擊時間 ${q[0]} 與現在相差 ${diff} 秒，已不在最近 300 秒的視窗 (${ts - 300}, ${ts}] 內。`,
              { 操作: opLabel, timestamp: ts, "q.front()": q[0], "timestamp - front": diff }, snap({ ts, qWarn: [0], diff, rowState: { status: "inserted", note: "清除過期" } }).boards,
              [{ from: "wb-var-ts", to: "wb-queue-q-0", label: `${diff} ≥ 300`, color: "red" }]));
            const gone = q.shift();
            steps.push(step5(10, `彈出 ${gone}`, "tag-insert", `q.pop() ➜ ${gone}`,
              `把過期的點擊 ${gone} 從佇列前端移除，剩下 ${q.length} 筆。`,
              { 操作: opLabel, timestamp: ts, "q.size()": q.length }, snap({ ts, rowState: { status: "inserted", note: "清除過期" } }).boards, []));
          }
          const diff = q.length ? ts - q[0] : "-";
          steps.push(step5(9, q.length ? "前端仍有效" : "佇列已空", "tag-check",
            q.length ? `${ts} - ${q[0]} = ${diff} < 300 ✗` : "q.empty() ➜ 停止",
            q.length
              ? `前端點擊 ${q[0]} 與現在只差 ${diff} 秒，仍在視窗內；由於佇列由舊到新排列，後面的點擊也都有效，停止清除。`
              : "佇列已經沒有任何點擊，停止清除。",
            { 操作: opLabel, timestamp: ts, "q.front()": q.length ? q[0] : "empty", "timestamp - front": diff }, snap({ ts, qHl: q.map((_, i) => i), diff, rowState: { status: "inserted", note: "檢查前端" } }).boards,
            q.length ? [{ from: "wb-var-ts", to: "wb-queue-q-0", label: `${diff} < 300`, color: "blue" }] : []));
          rows[rows.length - 1].ret = String(q.length);
          rows[rows.length - 1].note = "完成";
          steps.push(step5(12, "回傳點擊數", "tag-found", `return ${q.length}`,
            `佇列中剩下的 ${q.length} 筆點擊都發生在 (${ts - 300}, ${ts}] 之間，getHits(${ts}) 回傳 ${q.length}。`,
            { 操作: opLabel, timestamp: ts, "q.size()": q.length, return: q.length }, snap({ ts, qHl: q.map((_, i) => i), ret: q.length, rowState: { status: "hit", note: "完成" } }).boards,
            [{ from: "wb-dyn-q", to: `wb-dict-row-${rowId}`, label: `size = ${q.length}`, color: "green" }]));
        }
      });

      if (!steps.length) {
        steps.push(step5(4, "沒有操作", "default", "-", "操作序列為空。", { 操作: "-" }, snap().boards, []));
      }
      return steps;
    }
  };

  // ==========================================================================
  // #134 Path Sum III (LC #437, Medium)
  // ==========================================================================
  window.PROBLEMS["path-sum-iii"] = {
    id: 134,
    leetcodeId: 437,
    slug: "path-sum-iii",
    title: "437. Path Sum III (路徑總和 III)",
    difficulty: "Medium",
    topic: "Binary Tree / DFS / Prefix Sum",
    mins: 35,
    complexity: "Time O(n) · Space O(h)",
    argNames: ["root", "targetSum"],
    description:
      "計算二元樹中有多少條「向下」路徑（起點不必是根、終點不必是葉，但只能從父節點往子節點走）的節點值總和等於 targetSum。在 DFS 時維護從根到目前節點的前綴和 cur，並用 unordered_map<long long, int> cnt 記錄「目前路徑上各前綴和出現的次數」（初始 cnt[0] = 1）。以目前節點為終點、總和為 targetSum 的路徑數量就是 cnt[cur - targetSum]；遞迴左右子樹後再把 cnt[cur] 減一回溯，確保只計算同一條根到節點路徑上的前綴。時間 O(n)、空間 O(h)。",

    presets: [
      { name: "範例 1：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8", args: [[10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], 8] },
      { name: "範例 2：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22] },
      { name: "含負數：root = [1,-2,-3,1,3,-2,null,-1], targetSum = -1", args: [[1, -2, -3, 1, 3, -2, null, -1], -1] },
      { name: "全為 0：root = [0,0,0], targetSum = 0", args: [[0, 0, 0], 0] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '    <span class="tok-type">unordered_map</span>&lt;<span class="tok-kw">long long</span>, <span class="tok-kw">int</span>&gt; cnt;  <span class="tok-cmt">// 路徑上的前綴和 → 次數</span>' },
      { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">dfs</span>(<span class="tok-type">TreeNode</span>* node, <span class="tok-kw">long long</span> cur, <span class="tok-kw">int</span> target) {' },
      { line: 4, code: '        <span class="tok-kw">if</span> (!node) <span class="tok-kw">return</span> <span class="tok-num">0</span>;' },
      { line: 5, code: '        cur += node-&gt;val;' },
      { line: 6, code: '        <span class="tok-kw">int</span> res = cnt.<span class="tok-fn">count</span>(cur - target) ? cnt[cur - target] : <span class="tok-num">0</span>;' },
      { line: 7, code: '        cnt[cur]++;' },
      { line: 8, code: '        res += <span class="tok-fn">dfs</span>(node-&gt;left, cur, target);' },
      { line: 9, code: '        res += <span class="tok-fn">dfs</span>(node-&gt;right, cur, target);' },
      { line: 10, code: '        cnt[cur]--;  <span class="tok-cmt">// 回溯</span>' },
      { line: 11, code: '        <span class="tok-kw">return</span> res;' },
      { line: 12, code: '    }' },
      { line: 13, code: '<span class="tok-kw">public</span>:' },
      { line: 14, code: '    <span class="tok-kw">int</span> <span class="tok-fn">pathSum</span>(<span class="tok-type">TreeNode</span>* root, <span class="tok-kw">int</span> targetSum) {' },
      { line: 15, code: '        cnt[<span class="tok-num">0</span>] = <span class="tok-num">1</span>;  <span class="tok-cmt">// 空前綴</span>' },
      { line: 16, code: '        <span class="tok-kw">return</span> <span class="tok-fn">dfs</span>(root, <span class="tok-num">0</span>, targetSum);' },
      { line: 17, code: '    }' },
      { line: 18, code: '};' }
    ],

    generateTrace(rootArr, targetInput) {
      const arr = Array.isArray(rootArr) ? rootArr.slice() : [];
      const target = Number(targetInput);
      const tree = buildTreeFromLevelOrder(arr, 620);
      const steps = [];
      const cnt = new Map();
      const keyOrder = [];
      const prefix = {};
      const finished = new Set();
      const onPath = [];
      let total = 0;
      const rowId = (k) => `ps_${k < 0 ? `m${-k}` : k}`;

      const snap = (o = {}) => {
        const { cur = null, hitKey = null, insKey = null, ret = "-", conns = [], extra = [] } = o;
        const nodes = tree.nodes.map((nd) => ({
          id: nd.id,
          val: String(nd.val),
          sub: prefix[nd.id] !== undefined ? `cur=${prefix[nd.id]}` : "",
          x: nd.x,
          y: nd.y,
          status: cur && cur.id === nd.id ? "hl" : onPath.includes(nd.id) ? "match" : finished.has(nd.id) ? "done" : "",
          ptr: cur && cur.id === nd.id ? "node" : ""
        }));
        const edges = tree.edges.map((e) => ({ ...e, status: onPath.includes(e.from) && (onPath.includes(e.to) || (cur && cur.id === e.to)) ? "hl" : "" }));
        return {
          boards: [
            { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)，sub = 根到此的前綴和", x: 325, y: 52, width: tree.width, height: tree.height, nodes, edges },
            {
              id: "cnt",
              type: "dict",
              name: "cnt",
              typeLabel: "前綴和計數 (unordered_map&lt;long long, int&gt;)",
              x: 325 + tree.width + 30,
              y: 52,
              headers: ["前綴和", "次數", "狀態"],
              rows: keyOrder.map((k) => ({
                id: rowId(k),
                key: String(k),
                val: String(cnt.get(k)),
                note: k === hitKey ? "✓ 命中" : k === insKey ? "寫入" : cnt.get(k) === 0 ? "已回溯" : "",
                status: k === hitKey ? "hit" : k === insKey ? "inserted" : ""
              })),
              slot: { key: "cur - target", val: "查找", note: "命中 = 路徑數" }
            },
            varsBoard5([
              { id: "target", name: "targetSum", val: target },
              { id: "cur", name: "cur", val: cur ? prefix[cur.id] : "-", status: cur ? "hl" : "" },
              { id: "need", name: "cur - target", val: cur ? prefix[cur.id] - target : "-" },
              ...extra,
              { id: "total", name: "已找到路徑", val: total },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: conns
        };
      };

      const bump = (k, d) => {
        if (!cnt.has(k)) {
          cnt.set(k, 0);
          keyOrder.push(k);
        }
        cnt.set(k, cnt.get(k) + d);
      };

      bump(0, 1);
      steps.push(step5(15, "初始化 cnt[0] = 1", "tag-insert", "cnt[0] = 1",
        `先放入空前綴和 0（出現 1 次），讓「從根開始」的路徑也能被 cur - target = 0 查到。targetSum = ${target}。`,
        { targetSum: target, "cnt[0]": 1 }, snap({ insKey: 0 }).boards, []));

      if (!tree.root) {
        steps.push(step5(4, "空樹", "tag-found", "!node ➜ return 0",
          "根節點為空，沒有任何路徑，回傳 0。", { return: 0 }, snap({ ret: 0 }).boards, []));
        return steps;
      }

      const dfs = (node, parentCur) => {
        const cur = parentCur + node.val;
        prefix[node.id] = cur;
        const vStd = (extra = {}) => ({ node: node.val, cur, target, ...extra });
        steps.push(step5(5, `進入節點 ${node.val}`, "tag-check", `cur = ${parentCur} + ${node.val} = ${cur}`,
          `DFS 進入節點 ${node.val}，根到這裡的前綴和 cur = ${parentCur} + ${node.val} = ${cur}。`,
          vStd(), snap({ cur: node }).boards, []));
        const need = cur - target;
        const hits = cnt.has(need) ? cnt.get(need) : 0;
        let res = hits;
        total += hits;
        steps.push(step5(6, hits ? `命中 ${hits} 條路徑` : "查找 cur - target", hits ? "tag-found" : "tag-check",
          `cnt[${cur} - ${target} = ${need}] = ${hits}`,
          hits
            ? `路徑上之前出現過前綴和 ${need} 共 ${hits} 次；從那些位置的下一個節點走到 ${node.val}，總和恰好是 ${cur} - ${need} = ${target}，因此新增 ${hits} 條路徑。`
            : `cnt 中沒有前綴和 ${need}（或次數為 0），沒有以節點 ${node.val} 為終點、總和為 ${target} 的路徑。`,
          vStd({ res }), snap({ cur: node, hitKey: hits ? need : null, extra: [{ id: "res", name: "res", val: res, status: "hl" }] }).boards,
          hits && cnt.has(need) ? [{ from: `wb-node-tree-${node.id}`, to: `wb-dict-row-${rowId(need)}`, label: `+${hits}`, color: "green" }] : []));
        bump(cur, 1);
        onPath.push(node.id);
        steps.push(step5(7, `記錄前綴和 ${cur}`, "tag-insert", `cnt[${cur}] = ${cnt.get(cur)}`,
          `把目前的前綴和 ${cur} 加入 cnt（次數變成 ${cnt.get(cur)}），供子孫節點查找。`,
          vStd({ res }), snap({ cur: node, insKey: cur, extra: [{ id: "res", name: "res", val: res, status: "hl" }] }).boards,
          [{ from: `wb-node-tree-${node.id}`, to: `wb-dict-row-${rowId(cur)}`, label: `cnt[${cur}]++`, color: "purple" }]));
        const leftRes = node.left ? dfs(node.left, cur) : 0;
        res += leftRes;
        steps.push(step5(8, "加上左子樹結果", "tag-check", `res += dfs(left) = ${leftRes} ➜ ${res}`,
          node.left ? `左子樹（根為 ${node.left.val}）回傳 ${leftRes} 條路徑，節點 ${node.val} 的 res 累計為 ${res}。` : `節點 ${node.val} 沒有左子節點，dfs(nullptr) 直接回傳 0，res 維持 ${res}。`,
          vStd({ res }), snap({ cur: node, extra: [{ id: "res", name: "res", val: res, status: "hl" }] }).boards,
          node.left ? [{ from: `wb-node-tree-${node.left.id}`, to: `wb-node-tree-${node.id}`, label: `回傳 ${leftRes}`, color: "blue" }] : []));
        const rightRes = node.right ? dfs(node.right, cur) : 0;
        res += rightRes;
        steps.push(step5(9, "加上右子樹結果", "tag-check", `res += dfs(right) = ${rightRes} ➜ ${res}`,
          node.right ? `右子樹（根為 ${node.right.val}）回傳 ${rightRes} 條路徑，節點 ${node.val} 的 res 累計為 ${res}。` : `節點 ${node.val} 沒有右子節點，dfs(nullptr) 直接回傳 0，res 維持 ${res}。`,
          vStd({ res }), snap({ cur: node, extra: [{ id: "res", name: "res", val: res, status: "hl" }] }).boards,
          node.right ? [{ from: `wb-node-tree-${node.right.id}`, to: `wb-node-tree-${node.id}`, label: `回傳 ${rightRes}`, color: "blue" }] : []));
        bump(cur, -1);
        onPath.pop();
        finished.add(node.id);
        steps.push(step5(10, `回溯 cnt[${cur}]`, "tag-insert", `cnt[${cur}] = ${cnt.get(cur)}`,
          `節點 ${node.val} 的子樹都處理完了，要離開這條路徑，把 cnt[${cur}] 減一（剩 ${cnt.get(cur)}），避免其他分支誤用這個前綴和。`,
          vStd({ res }), snap({ cur: node, insKey: cur, extra: [{ id: "res", name: "res", val: res, status: "hl" }] }).boards,
          [{ from: `wb-node-tree-${node.id}`, to: `wb-dict-row-${rowId(cur)}`, label: `cnt[${cur}]--`, color: "red" }]));
        steps.push(step5(11, `回傳 ${res}`, "default", `return ${res}`,
          `以節點 ${node.val} 為根的子樹中，共有 ${res} 條符合條件且終點在這棵子樹內的路徑。`,
          vStd({ res }), snap({ cur: node, extra: [{ id: "res", name: "res", val: res, status: "match" }] }).boards, []));
        return res;
      };

      const ans = dfs(tree.root, 0);
      steps.push(step5(16, "回傳答案", "tag-found", `return ${ans}`,
        `DFS 結束，整棵樹中總和為 ${target} 的向下路徑共有 ${ans} 條。`,
        { targetSum: target, return: ans }, snap({ ret: ans }).boards,
        [{ from: `wb-node-tree-${tree.root.id}`, to: "wb-var-ret", label: `${ans} 條路徑`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #135 Pow(x, n) (LC #50, Medium)
  // ==========================================================================
  window.PROBLEMS["powx-n"] = {
    id: 135,
    leetcodeId: 50,
    slug: "powx-n",
    title: "50. Pow(x, n) (冪次運算)",
    difficulty: "Medium",
    topic: "Math / Recursion / Binary Exponentiation",
    mins: 20,
    complexity: "Time O(log n) · Space O(1)",
    argNames: ["x", "n"],
    description:
      "實作 pow(x, n)，計算 x 的 n 次方（n 可為負數）。使用快速冪（二進位拆解指數）：把 n 轉成 long long N 以避免 -2^31 取負時溢位，若 N 為負就改算 (1/x) 的 -N 次方。接著觀察 N 的二進位，每一輪若最低位為 1 就把目前的 x（代表原底數的 2^k 次方）乘進答案 res，然後 x 自乘、N 右移一位。迴圈只跑 log N 輪，時間 O(log n)、空間 O(1)。",

    presets: [
      { name: "範例 1：x = 2.00000, n = 10", args: [2, 10] },
      { name: "範例 2：x = 2.10000, n = 3", args: [2.1, 3] },
      { name: "範例 3：x = 2.00000, n = -2", args: [2, -2] },
      { name: "指數為 0：x = 0.50000, n = 0", args: [0.5, 0] },
      { name: "奇數位元較多：x = 1.50000, n = 13", args: [1.5, 13] }
    ],

    cppLines: [
      { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
      { line: 2, code: '<span class="tok-kw">public</span>:' },
      { line: 3, code: '    <span class="tok-kw">double</span> <span class="tok-fn">myPow</span>(<span class="tok-kw">double</span> x, <span class="tok-kw">int</span> n) {' },
      { line: 4, code: '        <span class="tok-kw">long long</span> N = n;  <span class="tok-cmt">// 避免 -2^31 取負溢位</span>' },
      { line: 5, code: '        <span class="tok-kw">if</span> (N &lt; <span class="tok-num">0</span>) {' },
      { line: 6, code: '            x = <span class="tok-num">1</span> / x;' },
      { line: 7, code: '            N = -N;' },
      { line: 8, code: '        }' },
      { line: 9, code: '        <span class="tok-kw">double</span> res = <span class="tok-num">1.0</span>;' },
      { line: 10, code: '        <span class="tok-kw">while</span> (N &gt; <span class="tok-num">0</span>) {' },
      { line: 11, code: '            <span class="tok-kw">if</span> (N &amp; <span class="tok-num">1</span>) res *= x;' },
      { line: 12, code: '            x *= x;' },
      { line: 13, code: '            N &gt;&gt;= <span class="tok-num">1</span>;' },
      { line: 14, code: '        }' },
      { line: 15, code: '        <span class="tok-kw">return</span> res;' },
      { line: 16, code: '    }' },
      { line: 17, code: '};' }
    ],

    generateTrace(xInput, nInput) {
      let x = Number(xInput);
      const n = Math.trunc(Number(nInput));
      const x0 = x;
      const steps = [];
      const fmt = (v) => {
        if (!Number.isFinite(v)) return String(v);
        if (Number.isInteger(v)) return String(v);
        const s = v.toPrecision(10);
        return String(Number(s));
      };
      let N = n;
      let res = 1;
      const baseLabel = n < 0 ? `(1/${fmt(x0)})` : fmt(x0);
      const absN = Math.abs(n);
      const bitList = absN.toString(2).split("").map(Number); // MSB → LSB
      const L = bitList.length;
      const powRows = [];
      let k = 0;

      const snap = (o = {}) => {
        const { bitIdx = -1, used = false, ret = "-", conns = [], rowHl = -1 } = o;
        const consumed = Math.min(k, L);
        const doneIdx = [];
        for (let b = 0; b < consumed; b++) doneIdx.push(L - 1 - b);
        const cur = bitIdx >= 0 ? L - 1 - bitIdx : -1;
        return {
          boards: [
            arrBoard5("bits", "N 的二進位", `|n| = ${absN}，由右往左逐位處理`, 325, 52, bitList, {
              indexLabels: bitList.map((_, i) => `2^${L - 1 - i}`),
              hl: cur >= 0 && !used ? [cur] : [],
              match: cur >= 0 && used ? [cur] : [],
              done: doneIdx.filter((i) => i !== cur),
              pointers: cur >= 0 ? [{ idx: cur, label: `第 ${bitIdx} 位`, color: used ? "green" : "blue" }] : []
            }),
            {
              id: "pw",
              type: "dict",
              name: "x 的平方序列",
              typeLabel: "每輪 x = base^(2^k)",
              x: 325,
              y: 200,
              headers: ["k", "x = base^(2^k)", "該位"],
              rows: powRows.map((r, i) => ({ id: `k${i}`, key: `k = ${i}`, val: esc5(r.val), note: r.bit ? "1 ➜ 乘入 res" : "0 ➜ 略過", status: i === rowHl ? (r.bit ? "hit" : "inserted") : "" }))
            },
            varsBoard5([
              { id: "x", name: "x", val: fmt(x), status: "hl" },
              { id: "N", name: "N", val: N, status: "hl" },
              { id: "res", name: "res", val: fmt(res), status: used ? "hl" : "" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ], "快速冪狀態")
          ],
          connectors: conns
        };
      };

      steps.push(step5(4, "轉成 long long", "default", `N = ${N}`,
        `把 n = ${n} 存進 64 位元的 N。若 n = -2147483648，直接對 int 取負會溢位，用 long long 才安全。`,
        { x: fmt(x), n, N }, snap().boards, []));
      if (N < 0) {
        x = 1 / x;
        N = -N;
        steps.push(step5(7, "負指數轉換", "tag-insert", `x = 1/${fmt(x0)} = ${fmt(x)}, N = ${N}`,
          `n 為負數：x^(${n}) = (1/x)^(${-n})，所以把 x 改成 1/${fmt(x0)} = ${fmt(x)}，N 取正成 ${N}。`,
          { x: fmt(x), N }, snap().boards, []));
      } else {
        steps.push(step5(5, "指數非負", "tag-check", `N = ${N} ≥ 0`,
          `N = ${N} 不是負數，不需要取倒數。`, { x: fmt(x), N }, snap().boards, []));
      }
      res = 1;
      steps.push(step5(9, "初始化 res", "default", "res = 1.0",
        `res 從 1 開始。${absN ? `|n| = ${absN} 的二進位是 ${absN.toString(2)}，答案就是二進位中為 1 的那些 ${baseLabel}^(2^k) 的乘積。` : "N = 0，任何數的 0 次方都是 1。"}`,
        { x: fmt(x), N, res: fmt(res) }, snap().boards, []));

      while (N > 0) {
        const bit = N % 2;
        powRows.push({ val: `${baseLabel}^${2 ** k} = ${fmt(x)}`, bit });
        if (bit) {
          const before = res;
          res *= x;
          steps.push(step5(11, `第 ${k} 位為 1`, "tag-found", `N & 1 = 1 ➜ res = ${fmt(before)} × ${fmt(x)} = ${fmt(res)}`,
            `N = ${N} 的最低位是 1，代表答案需要乘上 ${baseLabel}^(2^${k}) = ${fmt(x)}，res 變成 ${fmt(res)}。`,
            { x: fmt(x), N, "N & 1": 1, res: fmt(res) }, snap({ bitIdx: k, used: true, rowHl: k }).boards,
            [{ from: `wb-dict-row-k${k}`, to: "wb-var-res", label: `× ${fmt(x)}`, color: "green" }]));
        } else {
          steps.push(step5(11, `第 ${k} 位為 0`, "tag-check", "N & 1 = 0 ➜ 略過",
            `N = ${N} 的最低位是 0，這一輪的 ${baseLabel}^(2^${k}) 不需要乘進 res。`,
            { x: fmt(x), N, "N & 1": 0, res: fmt(res) }, snap({ bitIdx: k, rowHl: k }).boards, []));
        }
        const bx = x;
        x *= x;
        steps.push(step5(12, "x 自乘", "tag-insert", `x = ${fmt(bx)}² = ${fmt(x)}`,
          `x 自乘一次變成 ${fmt(x)} = ${baseLabel}^${2 ** (k + 1)}，準備對應下一個更高的位元。`,
          { x: fmt(x), N, res: fmt(res) }, snap({ bitIdx: k, used: !!bit }).boards,
          [{ from: `wb-dict-row-k${k}`, to: "wb-var-x", label: "平方", color: "purple" }]));
        const bN = N;
        N = Math.floor(N / 2);
        k++;
        steps.push(step5(13, "N 右移一位", "tag-check", `N = ${bN} >> 1 = ${N}`,
          N > 0 ? `丟掉已處理的最低位，N 從 ${bN} 變成 ${N}，繼續檢查下一位。` : `N 右移後變成 0，所有位元都處理完畢。`,
          { x: fmt(x), N, res: fmt(res) }, snap().boards, []));
      }

      const ret = res.toFixed(5);
      steps.push(step5(15, "回傳答案", "tag-found", `return ${ret}`,
        `迴圈結束，${fmt(x0)}^${n} = ${ret}（LeetCode 以小數點後 5 位顯示）。`,
        { res: fmt(res), return: ret }, snap({ ret }).boards,
        [{ from: "wb-var-res", to: "wb-var-ret", label: "return", color: "green" }]));
      return steps;
    }
  };
})();

/**
 * Grind 75 Week 4 — Problems #34 to #41 (8 Medium Problems)
 * #34 Course Schedule (LC #207)
 * #35 Implement Trie (Prefix Tree) (LC #208)
 * #36 Coin Change (LC #322)
 * #37 Product of Array Except Self (LC #238)
 * #38 Min Stack (LC #155)
 * #39 Validate Binary Search Tree (LC #98)
 * #40 Number of Islands (LC #200)
 * #41 Rotting Oranges (LC #994)
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #34 Course Schedule (LC #207, Medium, Graph — Kahn's Topological Sort)
// ============================================================================
window.PROBLEMS["course-schedule"] = {
  id: 34,
  leetcodeId: 207,
  slug: "course-schedule",
  title: "207. Course Schedule (課程表)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(V + E) · Space O(V + E)",
  argNames: ["numCourses", "prerequisites"],
  description:
    "你這個學期必須選修 numCourses 門課程（編號 0 到 numCourses - 1）。在選修某些課程之前需要一些先修課程 prerequisites[i] = [ai, bi]，表示如果要學習課程 ai，必須先完成課程 bi（即有向邊 bi → ai）。請判斷是否可能完成所有課程。使用 Kahn's Algorithm（入度陣列 indegree + BFS 佇列拓撲排序）可在 O(V + E) 時間內偵測圖中是否存在環。",

  presets: [
    {
      name: "範例 1：菱形先修圖 (4 門課無環 → true)",
      args: [
        4,
        [
          [1, 0],
          [2, 0],
          [3, 1],
          [3, 2]
        ]
      ]
    },
    {
      name: "範例 2：互相先修形成死結 (2 門課有環 → false)",
      args: [
        2,
        [
          [1, 0],
          [0, 1]
        ]
      ]
    },
    {
      name: "範例 3：局部環導致無法修完 (4 門課含環 → false)",
      args: [
        4,
        [
          [1, 0],
          [2, 1],
          [1, 2],
          [3, 2]
        ]
      ]
    },
    {
      name: "範例 4：線性鏈狀先修 (3 門課 0→1→2 → true)",
      args: [
        3,
        [
          [1, 0],
          [2, 1]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '<span class="tok-kw">public</span>:' },
    { line: 3, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">canFinish</span>(<span class="tok-kw">int</span> numCourses, <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; prerequisites) {' },
    { line: 4, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; adj(numCourses);' },
    { line: 5, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; indegree(numCourses, <span class="tok-num">0</span>);' },
    { line: 6, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">const</span> <span class="tok-kw">auto</span>&amp; pre : prerequisites) {' },
    { line: 7, code: '            adj[pre[<span class="tok-num">1</span>]].<span class="tok-fn">push_back</span>(pre[<span class="tok-num">0</span>]);' },
    { line: 8, code: '            ++indegree[pre[<span class="tok-num">0</span>]];' },
    { line: 9, code: '        }' },
    { line: 10, code: '        <span class="tok-type">queue</span>&lt;<span class="tok-kw">int</span>&gt; q;' },
    { line: 11, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; numCourses; ++i)' },
    { line: 12, code: '            <span class="tok-kw">if</span> (indegree[i] == <span class="tok-num">0</span>) q.<span class="tok-fn">push</span>(i);' },
    { line: 13, code: '        <span class="tok-kw">int</span> taken = <span class="tok-num">0</span>;' },
    { line: 14, code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {' },
    { line: 15, code: '            <span class="tok-kw">int</span> u = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();' },
    { line: 16, code: '            ++taken;' },
    { line: 17, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> v : adj[u]) {' },
    { line: 18, code: '                <span class="tok-kw">if</span> (--indegree[v] == <span class="tok-num">0</span>) q.<span class="tok-fn">push</span>(v);' },
    { line: 19, code: '            }' },
    { line: 20, code: '        }' },
    { line: 21, code: '        <span class="tok-kw">return</span> taken == numCourses;' },
    { line: 22, code: '    }' },
    { line: 23, code: '};' }
  ],

  generateTrace(numCourses, prerequisites) {
    const n = Math.max(1, Math.min(8, Number(numCourses) || 4));
    const prereqs = Array.isArray(prerequisites) ? prerequisites : [];
    const steps = [];

    const adj = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);
    const activeEdges = [];
    const queue = [];
    const completed = new Set();

    // Compute circular coordinates for graph nodes
    const graphW = 440;
    const graphH = 220;
    const cx = 220;
    const cy = 110;
    const rx = n <= 2 ? 95 : 135;
    const ry = n <= 2 ? 55 : 75;

    const getCoords = (i) => {
      if (n === 1) return { x: cx, y: cy };
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return {
        x: Math.round(cx + rx * Math.cos(angle)),
        y: Math.round(cy + ry * Math.sin(angle))
      };
    };

    const buildBoards = (opts = {}) => {
      const {
        hlNode = -1,
        hlTarget = -1,
        hlEdge = null,
        indegreeHl = [],
        indegreeMatch = [],
        indegreeWarn = [],
        taken = 0,
        u = "-",
        ret = "-",
        retStatus = "",
        connectors = []
      } = opts;

      const nodes = Array.from({ length: n }, (_, i) => {
        const pos = getCoords(i);
        let status = "";
        if (completed.has(i)) status = "match";
        if (i === hlNode || i === hlTarget) status = "hl";
        if (ret === "false" && !completed.has(i)) status = "warn";
        return {
          id: String(i),
          val: String(i),
          sub: `in=${indegree[i]}`,
          x: pos.x,
          y: pos.y,
          status,
          ptr: i === hlNode ? "u" : i === hlTarget ? "v" : ""
        };
      });

      const edges = activeEdges.map((e) => {
        const isHl = hlEdge && hlEdge[0] === e.u && hlEdge[1] === e.v;
        const isDone = completed.has(e.u);
        return {
          from: String(e.u),
          to: String(e.v),
          dir: true,
          status: isHl ? "hl" : isDone ? "match" : ""
        };
      });

      return {
        boards: [
          {
            id: "graph",
            type: "graph",
            shape: "graph",
            name: "Course Graph (adj)",
            typeLabel: "先修有向圖 (bi → ai)",
            x: 325,
            y: 52,
            width: graphW,
            height: graphH,
            nodes,
            edges
          },
          {
            id: "indegree",
            type: "array",
            name: "indegree",
            typeLabel: "入度陣列 (vector<int>)",
            x: 325,
            y: 315,
            values: [...indegree],
            hl: indegreeHl,
            match: indegreeMatch,
            warn: indegreeWarn,
            done: Array.from(completed),
            pointers:
              hlTarget >= 0
                ? [{ idx: hlTarget, label: `v=${hlTarget}`, color: "blue" }]
                : hlNode >= 0
                ? [{ idx: hlNode, label: `u=${hlNode}`, color: "green" }]
                : []
          },
          {
            id: "queue",
            type: "queue",
            name: "q (BFS Queue)",
            typeLabel: "可修課程佇列 (indegree == 0)",
            x: 24,
            y: 315,
            items: queue.map((c, idx) => ({
              val: c,
              status: idx === 0 && hlNode === -1 ? "hl" : "match"
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "拓撲排序狀態",
            x: 24,
            y: 205,
            items: [
              { id: "numCourses", name: "numCourses", val: String(n), status: "" },
              { id: "taken", name: "taken", val: `${taken} / ${n}`, status: taken === n ? "match" : "hl" },
              { id: "u", name: "u", val: String(u), status: u !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors
      };
    };

    // Initial step
    steps.push({
      line: 5,
      tag: "初始化圖與入度陣列",
      tagType: "default",
      inlineBadge: `numCourses = ${n}, indegree = [0..0]`,
      explanation: `建立大小為 ${n} 的鄰接表 adj 與入度陣列 indegree(numCourses, 0)，準備建構課程先修有向圖。`,
      vars: { numCourses: n, taken: 0, "q.size()": 0, return: "-" },
      state: buildBoards({})
    });

    // Build graph from prerequisites
    for (let i = 0; i < prereqs.length; i++) {
      const [course, pre] = prereqs[i];
      if (course >= 0 && course < n && pre >= 0 && pre < n) {
        adj[pre].push(course);
        indegree[course]++;
        activeEdges.push({ u: pre, v: course });

        steps.push({
          line: 8,
          tag: `建邊 ${pre} → ${course}`,
          tagType: "tag-insert",
          inlineBadge: `adj[${pre}].push_back(${course}), indegree[${course}] = ${indegree[course]}`,
          explanation: `讀取先修條件 [${course}, ${pre}]：想修課程 ${course} 必須先修 ${pre}，新增有向邊 ${pre} → ${course}，並將 indegree[${course}] 遞增為 ${indegree[course]}。`,
          vars: { numCourses: n, taken: 0, "q.size()": 0, return: "-" },
          state: buildBoards({
            hlNode: pre,
            hlTarget: course,
            hlEdge: [pre, course],
            indegreeHl: [course],
            connectors: [
              {
                from: `wb-node-graph-${course}`,
                to: `wb-cw-indegree-${course}`,
                label: `++indegree[${course}]`,
                color: "purple"
              }
            ]
          })
        });
      }
    }

    // Push initial 0-indegree courses
    const zeroInit = [];
    for (let i = 0; i < n; i++) {
      if (indegree[i] === 0) {
        queue.push(i);
        zeroInit.push(i);
      }
    }

    steps.push({
      line: 12,
      tag: "入度為 0 課程入列",
      tagType: zeroInit.length > 0 ? "tag-check" : "default",
      inlineBadge: `q.push(${zeroInit.length ? zeroInit.join(", ") : "無"})`,
      explanation:
        zeroInit.length > 0
          ? `掃描 indegree 陣列，找出無需先修即可直接修習的課程 [${zeroInit.join(", ")}]（indegree == 0）推入 BFS 佇列 q。`
          : `掃描 indegree 陣列，發現沒有任何課程的入度為 0！所有課程皆受困於環中。`,
      vars: { numCourses: n, taken: 0, "q.size()": queue.length, return: "-" },
      state: buildBoards({
        indegreeMatch: zeroInit
      })
    });

    let taken = 0;
    while (queue.length > 0) {
      const u = queue.shift();
      taken++;
      completed.add(u);

      steps.push({
        line: 16,
        tag: `修畢課程 u = ${u}`,
        tagType: "tag-found",
        inlineBadge: `u = ${u}, taken = ${taken}`,
        explanation: `從佇列取出課程 u = ${u} 完成修習，已修課程數 taken 增為 ${taken}。接著釋放所有以 ${u} 為先修的後續課程。`,
        vars: { numCourses: n, taken, "q.size()": queue.length, return: "-" },
        state: buildBoards({
          hlNode: u,
          taken,
          u
        })
      });

      for (const v of adj[u]) {
        indegree[v]--;
        const unlocked = indegree[v] === 0;
        if (unlocked) {
          queue.push(v);
        }

        steps.push({
          line: 18,
          tag: unlocked ? `解鎖課程 v = ${v}` : `減少入度 indegree[${v}]`,
          tagType: unlocked ? "tag-found" : "tag-check",
          inlineBadge: `--indegree[${v}] = ${indegree[v]}${unlocked ? ` == 0 → q.push(${v})` : ""}`,
          explanation: unlocked
            ? `沿邊 ${u} → ${v} 將 indegree[${v}] 減 1 後變為 0，代表課程 ${v} 的所有先修課皆已完成，將 ${v} 推入佇列 q！`
            : `沿邊 ${u} → ${v} 將 indegree[${v}] 減 1 變為 ${indegree[v]}，尚有其他先修課未完成。`,
          vars: { numCourses: n, taken, "q.size()": queue.length, return: "-" },
          state: buildBoards({
            hlNode: u,
            hlTarget: v,
            hlEdge: [u, v],
            indegreeHl: unlocked ? [] : [v],
            indegreeMatch: unlocked ? [v] : [],
            taken,
            u,
            connectors: [
              {
                from: `wb-node-graph-${v}`,
                to: `wb-cw-indegree-${v}`,
                label: unlocked ? `入度歸零！入列 q` : `indegree[${v}]=${indegree[v]}`,
                color: unlocked ? "green" : "blue"
              }
            ]
          })
        });
      }
    }

    const canFinish = taken === n;
    const stuckNodes = [];
    for (let i = 0; i < n; i++) {
      if (!completed.has(i)) stuckNodes.push(i);
    }

    steps.push({
      line: 21,
      tag: canFinish ? "無環！可修完所有課程" : "偵測到環！無法修完",
      tagType: canFinish ? "tag-found" : "default",
      inlineBadge: `taken (${taken}) == numCourses (${n}) → ${canFinish}`,
      explanation: canFinish
        ? `BFS 佇列清空，已修畢課程數 taken = ${taken} 等於總課程數 ${n}，圖中不存在環，回傳 true！`
        : `BFS 佇列已空，但僅修畢 ${taken} / ${n} 門課（課程 [${stuckNodes.join(", ")}] 因環狀依賴入度無法歸零），回傳 false。`,
      vars: { numCourses: n, taken, "q.size()": 0, return: String(canFinish) },
      state: buildBoards({
        indegreeWarn: stuckNodes,
        taken,
        ret: String(canFinish),
        retStatus: canFinish ? "match" : "warn"
      })
    });

    return steps;
  }
};

// ============================================================================
// #35 Implement Trie (Prefix Tree) (LC #208, Medium, Trie)
// ============================================================================
window.PROBLEMS["implement-trie-prefix-tree"] = {
  id: 35,
  leetcodeId: 208,
  slug: "implement-trie-prefix-tree",
  title: "208. Implement Trie (Prefix Tree) (實作前綴樹)",
  difficulty: "Medium",
  topic: "Trie",
  mins: 35,
  complexity: "Time O(L) per op · Space O(N·L)",
  argNames: ["ops", "words"],
  description:
    "Trie（發音類似 \"try\"）或者說前綴樹是一種樹形資料結構，用於高效地儲存和檢索字串資料集中的鍵。請實作 Trie 類別：insert(word) 向前綴樹中插入字串、search(word) 檢索完整單詞是否存在（需 isEnd == true）、startsWith(prefix) 檢索是否存在以 prefix 為前綴的單詞。",

  presets: [
    {
      name: "範例 1：LeetCode 標準範例 (apple / app)",
      args: [
        ["insert", "search", "search", "startsWith", "insert", "search"],
        ["apple", "apple", "app", "app", "app", "app"]
      ]
    },
    {
      name: "範例 2：共享前綴分支 (cat / car / cab)",
      args: [
        ["insert", "insert", "search", "startsWith", "search"],
        ["cat", "car", "car", "ca", "cab"]
      ]
    },
    {
      name: "範例 3：多分支檢索 (tea / ted / te / to)",
      args: [
        ["insert", "insert", "startsWith", "search", "startsWith"],
        ["tea", "ted", "te", "te", "to"]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Trie</span> {' },
    { line: 2, code: '    <span class="tok-kw">struct</span> <span class="tok-type">Node</span> {' },
    { line: 3, code: '        <span class="tok-type">Node</span>* child[<span class="tok-num">26</span>] = {<span class="tok-kw">nullptr</span>};' },
    { line: 4, code: '        <span class="tok-kw">bool</span> isEnd = <span class="tok-kw">false</span>;' },
    { line: 5, code: '    } *root = <span class="tok-kw">new</span> <span class="tok-type">Node</span>();' },
    { line: 6, code: '<span class="tok-kw">public</span>:' },
    { line: 7, code: '    <span class="tok-kw">void</span> <span class="tok-fn">insert</span>(<span class="tok-type">string</span> word) {' },
    { line: 8, code: '        <span class="tok-type">Node</span>* cur = root;' },
    { line: 9, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> c : word) {' },
    { line: 10, code: '            <span class="tok-kw">if</span> (!cur-&gt;child[c - <span class="tok-num">\'a\'</span>]) cur-&gt;child[c - <span class="tok-num">\'a\'</span>] = <span class="tok-kw">new</span> <span class="tok-type">Node</span>();' },
    { line: 11, code: '            cur = cur-&gt;child[c - <span class="tok-num">\'a\'</span>];' },
    { line: 12, code: '        }' },
    { line: 13, code: '        cur-&gt;isEnd = <span class="tok-kw">true</span>;' },
    { line: 14, code: '    }' },
    { line: 15, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">search</span>(<span class="tok-type">string</span> word) {' },
    { line: 16, code: '        <span class="tok-type">Node</span>* node = <span class="tok-fn">find</span>(word);' },
    { line: 17, code: '        <span class="tok-kw">return</span> node != <span class="tok-kw">nullptr</span> &amp;&amp; node-&gt;isEnd;' },
    { line: 18, code: '    }' },
    { line: 19, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">startsWith</span>(<span class="tok-type">string</span> prefix) {' },
    { line: 20, code: '        <span class="tok-kw">return</span> <span class="tok-fn">find</span>(prefix) != <span class="tok-kw">nullptr</span>;' },
    { line: 21, code: '    }' },
    { line: 22, code: '};' }
  ],

  generateTrace(ops, words) {
    const opList = Array.isArray(ops) ? ops : ["insert", "search"];
    const wordList = Array.isArray(words) ? words : ["app", "app"];
    const steps = [];

    // Internal Trie representation
    const root = { id: "root", ch: "root", prefix: "", isEnd: false, children: {} };

    const layoutTrie = (activeId = "root", pathIds = new Set(), matchId = null, warnId = null) => {
      const nodes = [];
      const edges = [];

      // Compute leaf counts for horizontal spacing
      const countLeaves = (nd) => {
        const keys = Object.keys(nd.children).sort();
        if (keys.length === 0) return 1;
        return keys.reduce((s, k) => s + countLeaves(nd.children[k]), 0);
      };

      let maxDepth = 0;
      const calcDepth = (nd, d) => {
        if (d > maxDepth) maxDepth = d;
        for (const k of Object.keys(nd.children)) {
          calcDepth(nd.children[k], d + 1);
        }
      };
      calcDepth(root, 0);

      const totalLeaves = Math.max(1, countLeaves(root));
      const width = Math.max(560, totalLeaves * 130);
      const levelH = 68;
      const height = Math.max(250, (maxDepth + 1) * levelH + 60);

      const assignPos = (nd, depth, leftX, rightX) => {
        const x = Math.round((leftX + rightX) / 2);
        const y = 42 + depth * levelH;
        let status = "";
        if (nd.id === matchId) status = "match";
        else if (nd.id === warnId) status = "warn";
        else if (nd.id === activeId || pathIds.has(nd.id)) status = "hl";

        nodes.push({
          id: nd.id,
          val: nd.ch === "root" ? "○" : nd.ch,
          sub: nd.isEnd ? "end" : nd.ch === "root" ? "root" : "",
          x,
          y,
          status,
          ptr: nd.id === activeId ? "cur" : ""
        });

        const keys = Object.keys(nd.children).sort();
        if (keys.length > 0) {
          const total = countLeaves(nd);
          let curLeft = leftX;
          for (const k of keys) {
            const child = nd.children[k];
            const wShare = ((rightX - leftX) * countLeaves(child)) / total;
            assignPos(child, depth + 1, curLeft, curLeft + wShare);
            edges.push({
              from: nd.id,
              to: child.id,
              label: k,
              dir: true,
              status: pathIds.has(child.id) ? (child.id === matchId ? "match" : "hl") : ""
            });
            curLeft += wShare;
          }
        }
      };

      assignPos(root, 0, 36, width - 36);
      return { width, height, nodes, edges };
    };

    const opLabels = opList.map((op, i) => `${op}("${wordList[i] || ""}")`);
    const doneOps = [];

    const buildBoards = (opts = {}) => {
      const {
        opIdx = -1,
        opStatus = "hl",
        activeId = "root",
        pathIds = new Set(),
        matchId = null,
        warnId = null,
        op = "-",
        word = "-",
        ch = "-",
        ret = "-",
        retStatus = ""
      } = opts;

      const treeSpec = layoutTrie(activeId, pathIds, matchId, warnId);

      return {
        boards: [
          {
            id: "ops",
            type: "array",
            name: "Operations",
            typeLabel: "操作序列",
            x: 325,
            y: 52,
            values: opLabels,
            hl: opIdx >= 0 && opStatus === "hl" ? [opIdx] : [],
            match: opIdx >= 0 && opStatus === "match" ? [opIdx] : [],
            warn: opIdx >= 0 && opStatus === "warn" ? [opIdx] : [],
            done: [...doneOps],
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx}`, color: "blue" }] : []
          },
          {
            id: "trie",
            type: "tree",
            shape: "circle",
            name: "Trie (Prefix Tree)",
            typeLabel: "前綴樹節點 (sub='end' 為單詞結尾)",
            x: 325,
            y: 195,
            width: treeSpec.width,
            height: treeSpec.height,
            nodes: treeSpec.nodes,
            edges: treeSpec.edges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "Trie 狀態變數",
            x: 24,
            y: 205,
            items: [
              { id: "op", name: "op", val: String(op), status: op !== "-" ? "hl" : "" },
              { id: "word", name: "word", val: word !== "-" ? `"${word}"` : "-", status: "" },
              { id: "ch", name: "char c", val: ch !== "-" ? `'${ch}'` : "-", status: ch !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 5,
      tag: "初始化 Trie 根節點",
      tagType: "default",
      inlineBadge: "root = new Node()",
      explanation: "建立空的 Trie 根節點 root（isEnd = false，26 個子指標皆為 nullptr）。",
      vars: { op: "Trie()", word: "-", char: "-", return: "-" },
      state: buildBoards({})
    });

    for (let i = 0; i < opList.length; i++) {
      const op = opList[i];
      const word = String(wordList[i] || "");
      const pathIds = new Set(["root"]);
      let cur = root;

      if (op === "insert") {
        for (let j = 0; j < word.length; j++) {
          const c = word[j];
          const created = !cur.children[c];
          if (created) {
            const nextPrefix = cur.prefix + c;
            cur.children[c] = {
              id: `n_${nextPrefix}`,
              ch: c,
              prefix: nextPrefix,
              isEnd: false,
              children: {}
            };
          }
          cur = cur.children[c];
          pathIds.add(cur.id);

          steps.push({
            line: 11,
            tag: created ? `新增節點 '${c}'` : `沿既有節點 '${c}' 前進`,
            tagType: created ? "tag-insert" : "tag-check",
            inlineBadge: `c = '${c}' (${created ? "new Node()" : "已存在"})`,
            explanation: created
              ? `insert("${word}")：字元 '${c}' 分支尚不存在，配置新節點 new Node() 並將 cur 移至 '${c}'。`
              : `insert("${word}")：字元 '${c}' 分支已存在於前綴樹中，直接將 cur 移至 '${c}'。`,
            vars: { op: "insert", word: `"${word}"`, char: `'${c}'`, return: "void" },
            state: buildBoards({
              opIdx: i,
              opStatus: "hl",
              activeId: cur.id,
              pathIds: new Set(pathIds),
              op: "insert",
              word,
              ch: c,
              ret: "void"
            })
          });
        }

        cur.isEnd = true;
        steps.push({
          line: 13,
          tag: `標記單詞結尾 "${word}"`,
          tagType: "tag-found",
          inlineBadge: `cur->isEnd = true ("${word}")`,
          explanation: `單詞 "${word}" 所有字元走訪完畢，將終點節點 '${cur.ch}' 的 isEnd 設為 true（顯示 sub = "end"）。`,
          vars: { op: "insert", word: `"${word}"`, char: `'${cur.ch}'`, return: "void" },
          state: buildBoards({
            opIdx: i,
            opStatus: "match",
            activeId: cur.id,
            pathIds: new Set(pathIds),
            matchId: cur.id,
            op: "insert",
            word,
            ch: cur.ch,
            ret: "void",
            retStatus: "match"
          })
        });
      } else {
        // search or startsWith
        const isSearch = op === "search";
        let failedChar = null;

        for (let j = 0; j < word.length; j++) {
          const c = word[j];
          if (!cur.children[c]) {
            failedChar = c;
            break;
          }
          cur = cur.children[c];
          pathIds.add(cur.id);
        }

        if (failedChar !== null) {
          steps.push({
            line: isSearch ? 17 : 20,
            tag: `${op}("${word}") 缺少字元 '${failedChar}'`,
            tagType: "default",
            inlineBadge: `child['${failedChar}'] == nullptr → false`,
            explanation: `${op}("${word}")：在節點 '${cur.ch}' 下找不到字元 '${failedChar}' 的子節點，查找失敗並回傳 false。`,
            vars: { op, word: `"${word}"`, char: `'${failedChar}'`, return: "false" },
            state: buildBoards({
              opIdx: i,
              opStatus: "warn",
              activeId: cur.id,
              pathIds: new Set(pathIds),
              warnId: cur.id,
              op,
              word,
              ch: failedChar,
              ret: "false",
              retStatus: "warn"
            })
          });
        } else {
          const ok = isSearch ? cur.isEnd : true;
          steps.push({
            line: isSearch ? 17 : 20,
            tag: ok ? `${op}("${word}") 命中 → true` : `非完整單詞 (isEnd=false)`,
            tagType: ok ? "tag-found" : "default",
            inlineBadge: isSearch
              ? `node != nullptr && node->isEnd (${cur.isEnd}) → ${ok}`
              : `find("${word}") != nullptr → true`,
            explanation: isSearch
              ? ok
                ? `search("${word}")：成功走完所有字元到達節點 '${cur.ch}'，且 cur->isEnd == true，確認單詞存在，回傳 true！`
                : `search("${word}")：雖然走完前綴 "${word}" 到達節點 '${cur.ch}'，但 cur->isEnd == false（僅為其他單詞的前綴），回傳 false。`
              : `startsWith("${word}")：成功沿路徑走完所有前綴字元到達節點 '${cur.ch}'，回傳 true！`,
            vars: { op, word: `"${word}"`, char: `'${cur.ch}'`, return: String(ok) },
            state: buildBoards({
              opIdx: i,
              opStatus: ok ? "match" : "warn",
              activeId: cur.id,
              pathIds: new Set(pathIds),
              matchId: ok ? cur.id : null,
              warnId: ok ? null : cur.id,
              op,
              word,
              ch: cur.ch,
              ret: String(ok),
              retStatus: ok ? "match" : "warn"
            })
          });
        }
      }

      doneOps.push(i);
    }

    return steps;
  }
};

// ============================================================================
// #36 Coin Change (LC #322, Medium, Dynamic Programming)
// ============================================================================
window.PROBLEMS["coin-change"] = {
  id: 36,
  leetcodeId: 322,
  slug: "coin-change",
  title: "322. Coin Change (零錢兌換)",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  mins: 25,
  complexity: "Time O(amount · N) · Space O(amount)",
  argNames: ["coins", "amount"],
  description:
    "給定不同面額的硬幣 coins 和一個總金額 amount。請計算並回傳可以湊成總金額所需的最少硬幣個數；如果沒有任何一種硬幣組合能組成總金額，回傳 -1。使用一維 Bottom-Up 動態規劃：dp[a] = min(dp[a], dp[a - coin] + 1)。",

  presets: [
    {
      name: "範例 1：標準硬幣 coins = [1, 2, 5], amount = 6 (最佳 5+1=2 枚)",
      args: [[1, 2, 5], 6]
    },
    {
      name: "範例 2：無法湊出 coins = [2], amount = 3 (回傳 -1)",
      args: [[2], 3]
    },
    {
      name: "範例 3：反貪婪範例 coins = [1, 3, 4], amount = 6 (3+3=2 枚勝過 4+1+1)",
      args: [[1, 3, 4], 6]
    },
    {
      name: "範例 4：LeetCode 經典 coins = [1, 2, 5], amount = 11 (5+5+1=3 枚)",
      args: [[1, 2, 5], 11]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '<span class="tok-kw">public</span>:' },
    { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">coinChange</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; coins, <span class="tok-kw">int</span> amount) {' },
    { line: 4, code: '        <span class="tok-kw">int</span> INF = amount + <span class="tok-num">1</span>;' },
    { line: 5, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; dp(amount + <span class="tok-num">1</span>, INF);' },
    { line: 6, code: '        dp[<span class="tok-num">0</span>] = <span class="tok-num">0</span>;' },
    { line: 7, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> a = <span class="tok-num">1</span>; a &lt;= amount; ++a) {' },
    { line: 8, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> coin : coins) {' },
    { line: 9, code: '                <span class="tok-kw">if</span> (a - coin &gt;= <span class="tok-num">0</span>) {' },
    { line: 10, code: '                    dp[a] = <span class="tok-fn">min</span>(dp[a], dp[a - coin] + <span class="tok-num">1</span>);' },
    { line: 11, code: '                }' },
    { line: 12, code: '            }' },
    { line: 13, code: '        }' },
    { line: 14, code: '        <span class="tok-kw">return</span> dp[amount] &gt; amount ? -<span class="tok-num">1</span> : dp[amount];' },
    { line: 15, code: '    }' },
    { line: 16, code: '};' }
  ],

  generateTrace(coins, amount) {
    const coinArr = Array.isArray(coins) && coins.length ? coins : [1, 2, 5];
    const amt = Math.max(0, Math.min(15, Number(amount) ?? 6));
    const INF = amt + 1;
    const dp = new Array(amt + 1).fill(INF);
    dp[0] = 0;
    const steps = [];

    const formatDp = () => dp.map((v) => (v > amt ? "∞" : v));

    const buildBoards = (opts = {}) => {
      const {
        a = -1,
        prevA = -1,
        coinIdx = -1,
        dpMatch = [],
        dpWarn = [],
        doneIdx = [],
        formula = "-",
        ret = "-",
        retStatus = "",
        connectors = []
      } = opts;

      const ptrs = [];
      if (a >= 0) ptrs.push({ idx: a, label: `a=${a}`, color: "blue" });
      if (prevA >= 0) ptrs.push({ idx: prevA, label: `a-c=${prevA}`, color: "green" });

      return {
        boards: [
          {
            id: "dp",
            type: "array",
            name: "dp[0..amount]",
            typeLabel: "最少硬幣數 DP 表 (∞ 代表 amount+1)",
            x: 325,
            y: 52,
            values: formatDp(),
            hl: a >= 0 ? [a] : [],
            match: dpMatch,
            warn: dpWarn,
            done: doneIdx,
            pointers: ptrs
          },
          {
            id: "coins",
            type: "array",
            name: "coins",
            typeLabel: "可用硬幣面額",
            x: 325,
            y: 205,
            values: coinArr,
            hl: coinIdx >= 0 ? [coinIdx] : [],
            pointers:
              coinIdx >= 0 ? [{ idx: coinIdx, label: `coin=${coinArr[coinIdx]}`, color: "purple" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "狀態轉移算式",
            x: 24,
            y: 205,
            items: [
              { id: "amount", name: "amount", val: String(amt), status: "" },
              { id: "a", name: "a", val: a >= 0 ? String(a) : "-", status: a >= 0 ? "hl" : "" },
              { id: "formula", name: "轉移比較", val: formula, status: formula !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 6,
      tag: "初始化 DP 陣列",
      tagType: "default",
      inlineBadge: `dp[0] = 0, dp[1..${amt}] = ${INF} (∞)`,
      explanation: `建立長度為 ${amt + 1} 的 dp 陣列，初始值設為 INF = ${INF}（代表無限大 ∞），並設定基底狀態 dp[0] = 0（湊出金額 0 需 0 枚硬幣）。`,
      vars: { amount: amt, a: "-", coin: "-", "dp[a]": "0", return: "-" },
      state: buildBoards({ dpMatch: [0] })
    });

    const doneIdx = [0];

    for (let a = 1; a <= amt; a++) {
      for (let ci = 0; ci < coinArr.length; ci++) {
        const coin = coinArr[ci];
        if (a - coin >= 0) {
          const prevVal = dp[a - coin];
          const candidate = prevVal + 1;
          const oldVal = dp[a];
          const updated = candidate < oldVal;
          if (updated) {
            dp[a] = candidate;
          }

          const oldStr = oldVal > amt ? "∞" : oldVal;
          const prevStr = prevVal > amt ? "∞" : prevVal;
          const candStr = prevVal > amt ? "∞" : candidate;

          steps.push({
            line: 10,
            tag: updated ? `更新 dp[${a}] = ${dp[a]}` : `嘗試硬幣 ${coin} (未更優)`,
            tagType: updated ? "tag-found" : "tag-check",
            inlineBadge: `dp[${a}] = min(${oldStr}, dp[${a - coin}]+1=${candStr}) → ${dp[a] > amt ? "∞" : dp[a]}`,
            explanation: updated
              ? `金額 a = ${a} 嘗試面額 coin = ${coin}：由 dp[${a - coin}] = ${prevStr} 加 1 枚硬幣可湊出 ${candidate} 枚，優於原本的 ${oldStr}，更新 dp[${a}] = ${dp[a]}！`
              : `金額 a = ${a} 嘗試面額 coin = ${coin}：dp[${a - coin}] + 1 = ${candStr}，未優於目前 dp[${a}] = ${oldStr}。`,
            vars: {
              amount: amt,
              a,
              coin,
              "dp[a]": dp[a] > amt ? "∞" : dp[a],
              return: "-"
            },
            state: buildBoards({
              a,
              prevA: a - coin,
              coinIdx: ci,
              dpMatch: updated ? [a, a - coin] : [a - coin],
              doneIdx: [...doneIdx],
              formula: `min(${oldStr}, ${prevStr}+1) = ${dp[a] > amt ? "∞" : dp[a]}`,
              connectors: [
                {
                  from: `wb-cw-dp-${a - coin}`,
                  to: `wb-cw-dp-${a}`,
                  label: `+1 (coin=${coin})`,
                  color: updated ? "green" : "blue"
                }
              ]
            })
          });
        }
      }
      doneIdx.push(a);
    }

    const ans = dp[amt] > amt ? -1 : dp[amt];
    steps.push({
      line: 14,
      tag: ans === -1 ? "無法湊出目標金額 (-1)" : `最少硬幣數 = ${ans}`,
      tagType: ans === -1 ? "default" : "tag-found",
      inlineBadge: `dp[${amt}] = ${dp[amt] > amt ? "INF" : dp[amt]} → return ${ans}`,
      explanation:
        ans === -1
          ? `檢查 dp[${amt}] 仍為 INF (${INF} > ${amt})，表示沒有任何硬幣組合能湊出金額 ${amt}，回傳 -1。`
          : `Bottom-Up 填表完成！湊出總金額 ${amt} 所需的最少硬幣個數為 dp[${amt}] = ${ans}，回傳 ${ans}。`,
      vars: { amount: amt, a: amt, coin: "-", "dp[a]": ans === -1 ? "∞" : ans, return: ans },
      state: buildBoards({
        a: amt,
        dpMatch: ans !== -1 ? [amt] : [],
        dpWarn: ans === -1 ? [amt] : [],
        doneIdx,
        ret: String(ans),
        retStatus: ans === -1 ? "warn" : "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #37 Product of Array Except Self (LC #238, Medium, Array)
// ============================================================================
window.PROBLEMS["product-of-array-except-self"] = {
  id: 37,
  leetcodeId: 238,
  slug: "product-of-array-except-self",
  title: "238. Product of Array Except Self (除自身以外陣列的乘積)",
  difficulty: "Medium",
  topic: "Array",
  mins: 30,
  complexity: "Time O(N) · Space O(1) extra",
  argNames: ["nums"],
  description:
    "給定一個整數陣列 nums，請回傳一個陣列 res，其中 res[i] 等於 nums 中除 nums[i] 之外其餘各元素的乘積。題目要求禁止使用除法，且必須在 O(N) 時間內、O(1) 額外空間（輸出陣列不計入）完成：先由左至右累乘 prefix，再由右至左累乘 suffix。",

  presets: [
    {
      name: "範例 1：標準正整數 nums = [1, 2, 3, 4] → [24, 12, 8, 6]",
      args: [[1, 2, 3, 4]]
    },
    {
      name: "範例 2：包含單個零與負數 nums = [-1, 1, 0, -3, 3] → [0, 0, 9, 0, 0]",
      args: [[-1, 1, 0, -3, 3]]
    },
    {
      name: "範例 3：尾端為零 nums = [2, 3, 5, 0] → [0, 0, 0, 30]",
      args: [[2, 3, 5, 0]]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '<span class="tok-kw">public</span>:' },
    { line: 3, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; <span class="tok-fn">productExceptSelf</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums) {' },
    { line: 4, code: '        <span class="tok-kw">int</span> n = nums.<span class="tok-fn">size</span>();' },
    { line: 5, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; res(n, <span class="tok-num">1</span>);' },
    { line: 6, code: '        <span class="tok-kw">int</span> prefix = <span class="tok-num">1</span>;' },
    { line: 7, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; n; ++i) {' },
    { line: 8, code: '            res[i] = prefix;' },
    { line: 9, code: '            prefix *= nums[i];' },
    { line: 10, code: '        }' },
    { line: 11, code: '        <span class="tok-kw">int</span> suffix = <span class="tok-num">1</span>;' },
    { line: 12, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = n - <span class="tok-num">1</span>; i &gt;= <span class="tok-num">0</span>; --i) {' },
    { line: 13, code: '            res[i] *= suffix;' },
    { line: 14, code: '            suffix *= nums[i];' },
    { line: 15, code: '        }' },
    { line: 16, code: '        <span class="tok-kw">return</span> res;' },
    { line: 17, code: '    }' },
    { line: 18, code: '};' }
  ],

  generateTrace(nums) {
    const arr = Array.isArray(nums) && nums.length ? nums.map((x) => (Object.is(x, -0) ? 0 : x)) : [1, 2, 3, 4];
    const n = arr.length;
    const res = new Array(n).fill(1);
    const steps = [];

    const norm = (x) => (Object.is(x, -0) ? 0 : x);

    const buildBoards = (opts = {}) => {
      const {
        i = -1,
        pass = "初始化",
        prefix = 1,
        suffix = "-",
        resHl = [],
        resMatch = [],
        resDone = [],
        ret = "-",
        connectors = []
      } = opts;

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "輸入陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: arr,
            hl: i >= 0 ? [i] : [],
            pointers: i >= 0 ? [{ idx: i, label: `i=${i}`, color: "blue" }] : []
          },
          {
            id: "res",
            type: "array",
            name: "res",
            typeLabel: "結果陣列 (左綴 × 右綴)",
            x: 325,
            y: 195,
            values: [...res],
            hl: resHl,
            match: resMatch,
            done: resDone,
            pointers: i >= 0 ? [{ idx: i, label: `res[${i}]=${res[i]}`, color: "green" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "雙向累乘變數 (O(1) 額外空間)",
            x: 24,
            y: 205,
            items: [
              { id: "pass", name: "階段", val: pass, status: "hl" },
              { id: "prefix", name: "prefix", val: String(prefix), status: pass.includes("左") ? "hl" : "" },
              { id: "suffix", name: "suffix", val: String(suffix), status: pass.includes("右") ? "hl" : "" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 6,
      tag: "初始化 res 與 prefix = 1",
      tagType: "default",
      inlineBadge: `res = [1..1], prefix = 1`,
      explanation: `建立長度為 ${n} 的結果陣列 res(n, 1)，並設定左側累乘變數 prefix = 1，準備進行第一趟由左至右掃描。`,
      vars: { i: "-", prefix: 1, suffix: "-", "res[i]": "-" },
      state: buildBoards({})
    });

    let prefix = 1;
    const pass1Done = [];
    for (let i = 0; i < n; i++) {
      res[i] = norm(prefix);
      const oldPrefix = prefix;
      prefix = norm(prefix * arr[i]);

      steps.push({
        line: 9,
        tag: `左綴趟 i=${i}：寫入 res[${i}]=${res[i]}`,
        tagType: "tag-insert",
        inlineBadge: `res[${i}] = ${oldPrefix}, prefix *= ${arr[i]} → ${prefix}`,
        explanation: `第一趟 (左→右) i = ${i}：先將 i 左側所有元素的乘積 prefix = ${oldPrefix} 寫入 res[${i}]，再將 prefix 乘上 nums[${i}] (${arr[i]}) 更新為 ${prefix}。`,
        vars: { i, prefix, suffix: "-", "res[i]": res[i] },
        state: buildBoards({
          i,
          pass: "Pass 1: 左綴累乘 (→)",
          prefix,
          resHl: [i],
          resDone: [...pass1Done],
          connectors: [
            {
              from: "wb-var-prefix",
              to: `wb-cw-res-${i}`,
              label: `res[${i}] = ${oldPrefix}`,
              color: "purple"
            }
          ]
        })
      });
      pass1Done.push(i);
    }

    let suffix = 1;
    const pass2Done = [];
    for (let i = n - 1; i >= 0; i--) {
      const before = res[i];
      const oldSuffix = suffix;
      res[i] = norm(res[i] * suffix);
      suffix = norm(suffix * arr[i]);
      pass2Done.push(i);

      steps.push({
        line: 14,
        tag: `右綴趟 i=${i}：res[${i}] *= ${oldSuffix}`,
        tagType: "tag-found",
        inlineBadge: `res[${i}] = ${before} * ${oldSuffix} = ${res[i]}, suffix → ${suffix}`,
        explanation: `第二趟 (右→左) i = ${i}：將原本存有左綴積的 res[${i}] (${before}) 乘上右側所有元素的乘積 suffix (${oldSuffix}) 得到最終值 ${res[i]}，再更新 suffix = ${suffix}。`,
        vars: { i, prefix, suffix, "res[i]": res[i] },
        state: buildBoards({
          i,
          pass: "Pass 2: 右綴累乘 (←)",
          prefix,
          suffix,
          resMatch: [...pass2Done],
          connectors: [
            {
              from: "wb-var-suffix",
              to: `wb-cw-res-${i}`,
              label: `× suffix (${oldSuffix})`,
              color: "green"
            }
          ]
        })
      });
    }

    steps.push({
      line: 16,
      tag: "雙趟累乘完成並回傳",
      tagType: "tag-found",
      inlineBadge: `return [${res.join(", ")}]`,
      explanation: `左右兩趟掃描完成，res 每個位置皆為「左側乘積 × 右側乘積」，回傳 [${res.join(", ")}]。`,
      vars: { i: "-", prefix, suffix, "res[i]": `[${res.join(",")}]` },
      state: buildBoards({
        pass: "完成",
        prefix,
        suffix,
        resMatch: Array.from({ length: n }, (_, k) => k),
        ret: `[${res.join(", ")}]`
      })
    });

    return steps;
  }
};

// ============================================================================
// #38 Min Stack (LC #155, Medium, Stack)
// ============================================================================
window.PROBLEMS["min-stack"] = {
  id: 38,
  leetcodeId: 155,
  slug: "min-stack",
  title: "155. Min Stack (最小堆疊)",
  difficulty: "Medium",
  topic: "Stack",
  mins: 20,
  complexity: "Time O(1) per op · Space O(N)",
  argNames: ["ops", "vals"],
  description:
    "設計一個支援 push、pop、top 操作，並能在常數時間 O(1) 內檢索到最小元素的堆疊 MinStack。透過維護一個與主堆疊 st 同步推入/彈出的輔助最小堆疊 minSt（頂端永遠記錄當前堆疊中的最小值），即可達成所有操作 O(1)。",

  presets: [
    {
      name: "範例 1：LeetCode 標準範例 [-2, 0, -3, getMin, pop, top, getMin]",
      args: [
        ["push", "push", "push", "getMin", "pop", "top", "getMin"],
        [-2, 0, -3, null, null, null, null]
      ]
    },
    {
      name: "範例 2：重複最小值測試 [5, 2, 2, getMin, pop, getMin]",
      args: [
        ["push", "push", "push", "getMin", "pop", "getMin"],
        [5, 2, 2, null, null, null]
      ]
    },
    {
      name: "範例 3：多次更新最小值 [3, 1, top, getMin, -4, getMin, pop, getMin]",
      args: [
        ["push", "push", "top", "getMin", "push", "getMin", "pop", "getMin"],
        [3, 1, null, null, -4, null, null, null]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">MinStack</span> {' },
    { line: 2, code: '    <span class="tok-type">stack</span>&lt;<span class="tok-kw">int</span>&gt; valSt, minSt;' },
    { line: 3, code: '<span class="tok-kw">public</span>:' },
    { line: 4, code: '    <span class="tok-kw">void</span> <span class="tok-fn">push</span>(<span class="tok-kw">int</span> val) {' },
    { line: 5, code: '        valSt.<span class="tok-fn">push</span>(val);' },
    { line: 6, code: '        <span class="tok-kw">int</span> curMin = minSt.<span class="tok-fn">empty</span>() ? val : <span class="tok-fn">min</span>(val, minSt.<span class="tok-fn">top</span>());' },
    { line: 7, code: '        minSt.<span class="tok-fn">push</span>(curMin);' },
    { line: 8, code: '    }' },
    { line: 9, code: '    <span class="tok-kw">void</span> <span class="tok-fn">pop</span>() {' },
    { line: 10, code: '        valSt.<span class="tok-fn">pop</span>();' },
    { line: 11, code: '        minSt.<span class="tok-fn">pop</span>();' },
    { line: 12, code: '    }' },
    { line: 13, code: '    <span class="tok-kw">int</span> <span class="tok-fn">top</span>() { <span class="tok-kw">return</span> valSt.<span class="tok-fn">top</span>(); }' },
    { line: 14, code: '    <span class="tok-kw">int</span> <span class="tok-fn">getMin</span>() { <span class="tok-kw">return</span> minSt.<span class="tok-fn">top</span>(); }' },
    { line: 15, code: '};' }
  ],

  generateTrace(ops, vals) {
    const opList = Array.isArray(ops) ? ops : ["push", "push", "getMin"];
    const valList = Array.isArray(vals) ? vals : [-2, 0, null];
    const valSt = [];
    const minSt = [];
    const doneOps = [];
    const steps = [];

    const opLabels = opList.map((op, i) =>
      op === "push" ? `push(${valList[i]})` : `${op}()`
    );

    const buildBoards = (opts = {}) => {
      const {
        opIdx = -1,
        opStatus = "hl",
        valTopStatus = "",
        minTopStatus = "",
        op = "-",
        ret = "-",
        retStatus = "",
        connectors = []
      } = opts;

      return {
        boards: [
          {
            id: "ops",
            type: "array",
            name: "Operations",
            typeLabel: "操作序列",
            x: 325,
            y: 52,
            values: opLabels,
            hl: opIdx >= 0 && opStatus === "hl" ? [opIdx] : [],
            match: opIdx >= 0 && opStatus === "match" ? [opIdx] : [],
            done: [...doneOps],
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx}`, color: "blue" }] : []
          },
          {
            id: "valStack",
            type: "stack",
            name: "valSt (主堆疊)",
            typeLabel: "stack<int>",
            x: 325,
            y: 195,
            items: valSt.map((v, idx) => ({
              val: v,
              status: idx === valSt.length - 1 ? valTopStatus : ""
            }))
          },
          {
            id: "minStack",
            type: "stack",
            name: "minSt (最小堆疊)",
            typeLabel: "同步記錄當層最小值",
            x: 545,
            y: 195,
            items: minSt.map((v, idx) => ({
              val: v,
              status: idx === minSt.length - 1 ? minTopStatus : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "MinStack 狀態",
            x: 24,
            y: 205,
            items: [
              { id: "op", name: "操作", val: op, status: "hl" },
              {
                id: "top",
                name: "valSt.top()",
                val: valSt.length ? String(valSt[valSt.length - 1]) : "empty",
                status: valTopStatus
              },
              {
                id: "min",
                name: "minSt.top()",
                val: minSt.length ? String(minSt[minSt.length - 1]) : "empty",
                status: minTopStatus
              },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 2,
      tag: "初始化雙堆疊",
      tagType: "default",
      inlineBadge: "valSt = [], minSt = []",
      explanation: "初始化主堆疊 valSt 與輔助最小堆疊 minSt，兩者高度永遠保持一致。",
      vars: { op: "MinStack()", "valSt.top()": "-", "minSt.top()": "-", return: "-" },
      state: buildBoards({})
    });

    for (let i = 0; i < opList.length; i++) {
      const op = opList[i];
      const v = valList[i];

      if (op === "push") {
        const curMin = minSt.length === 0 ? v : Math.min(v, minSt[minSt.length - 1]);
        valSt.push(v);
        minSt.push(curMin);
        const topIdx = valSt.length - 1;

        steps.push({
          line: 7,
          tag: `push(${v}) → curMin = ${curMin}`,
          tagType: "tag-insert",
          inlineBadge: `valSt.push(${v}), minSt.push(${curMin})`,
          explanation: `將 ${v} 推入主堆疊 valSt，同時計算當前最小值 curMin = ${curMin} 推入輔助堆疊 minSt。`,
          vars: {
            op: `push(${v})`,
            "valSt.top()": v,
            "minSt.top()": curMin,
            return: "void"
          },
          state: buildBoards({
            opIdx: i,
            opStatus: "hl",
            valTopStatus: "hl",
            minTopStatus: curMin === v ? "match" : "hl",
            op: `push(${v})`,
            ret: "void",
            connectors: [
              {
                from: `wb-stack-valStack-${topIdx}`,
                to: `wb-stack-minStack-${topIdx}`,
                label: `min=${curMin}`,
                color: "purple"
              }
            ]
          })
        });
      } else if (op === "pop") {
        const poppedVal = valSt.pop();
        const poppedMin = minSt.pop();

        steps.push({
          line: 11,
          tag: `pop() 同步彈出頂端`,
          tagType: "tag-check",
          inlineBadge: `valSt.pop() [${poppedVal}], minSt.pop() [${poppedMin}]`,
          explanation: `同步將 valSt 頂端 (${poppedVal}) 與 minSt 頂端 (${poppedMin}) 彈出，堆疊自動恢復上一層的歷史最小值 ${minSt.length ? minSt[minSt.length - 1] : "empty"}。`,
          vars: {
            op: "pop()",
            "valSt.top()": valSt.length ? valSt[valSt.length - 1] : "-",
            "minSt.top()": minSt.length ? minSt[minSt.length - 1] : "-",
            return: "void"
          },
          state: buildBoards({
            opIdx: i,
            opStatus: "hl",
            valTopStatus: "hl",
            minTopStatus: "hl",
            op: "pop()",
            ret: "void"
          })
        });
      } else if (op === "top") {
        const topVal = valSt[valSt.length - 1];
        const topIdx = valSt.length - 1;
        steps.push({
          line: 13,
          tag: `top() → ${topVal}`,
          tagType: "tag-found",
          inlineBadge: `return valSt.top() = ${topVal}`,
          explanation: `直接回傳主堆疊 valSt 頂端元素 ${topVal}，時間複雜度 O(1)。`,
          vars: {
            op: "top()",
            "valSt.top()": topVal,
            "minSt.top()": minSt[minSt.length - 1],
            return: topVal
          },
          state: buildBoards({
            opIdx: i,
            opStatus: "match",
            valTopStatus: "match",
            op: "top()",
            ret: String(topVal),
            retStatus: "match",
            connectors: [
              {
                from: `wb-stack-valStack-${topIdx}`,
                to: "wb-var-ret",
                label: `top() = ${topVal}`,
                color: "green"
              }
            ]
          })
        });
      } else if (op === "getMin") {
        const minVal = minSt[minSt.length - 1];
        const topIdx = minSt.length - 1;
        steps.push({
          line: 14,
          tag: `getMin() → ${minVal}`,
          tagType: "tag-found",
          inlineBadge: `return minSt.top() = ${minVal}`,
          explanation: `直接讀取輔助最小堆疊 minSt 的頂端元素 ${minVal}，在 O(1) 時間內取得整個堆疊的最小值！`,
          vars: {
            op: "getMin()",
            "valSt.top()": valSt[valSt.length - 1],
            "minSt.top()": minVal,
            return: minVal
          },
          state: buildBoards({
            opIdx: i,
            opStatus: "match",
            minTopStatus: "match",
            op: "getMin()",
            ret: String(minVal),
            retStatus: "match",
            connectors: [
              {
                from: `wb-stack-minStack-${topIdx}`,
                to: "wb-var-ret",
                label: `getMin() = ${minVal}`,
                color: "green"
              }
            ]
          })
        });
      }

      doneOps.push(i);
    }

    return steps;
  }
};

// ============================================================================
// #39 Validate Binary Search Tree (LC #98, Medium, Binary Search Tree)
// ============================================================================
window.PROBLEMS["validate-binary-search-tree"] = {
  id: 39,
  leetcodeId: 98,
  slug: "validate-binary-search-tree",
  title: "98. Validate Binary Search Tree (驗證二元搜尋樹)",
  difficulty: "Medium",
  topic: "Binary Search Tree",
  mins: 20,
  complexity: "Time O(N) · Space O(H)",
  argNames: ["tree"],
  description:
    "給你一個二元樹的根節點 root，判斷其是否是一個有效的二元搜尋樹 (Valid BST)。有效 BST 的每個節點不僅要滿足左子節點 < 根 < 右子節點，且其整個左子樹所有節點皆須小於根、整個右子樹所有節點皆須大於根。使用 DFS 遞迴傳遞開區間上下界 (minVal, maxVal) 可在 O(N) 時間內精確驗證。",

  presets: [
    {
      name: "範例 1：標準有效 BST [2, 1, 3] → true",
      args: [[2, 1, 3]]
    },
    {
      name: "範例 2：右子樹根違規 [5, 1, 4, null, null, 3, 6] → false",
      args: [[5, 1, 4, null, null, 3, 6]]
    },
    {
      name: "範例 3：經典深層陷阱 [5, 4, 6, null, null, 3, 7] (節點 3 < 祖先 5 → false)",
      args: [[5, 4, 6, null, null, 3, 7]]
    },
    {
      name: "範例 4：完整三層有效 BST [4, 2, 6, 1, 3, 5, 7] → true",
      args: [[4, 2, 6, 1, 3, 5, 7]]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '<span class="tok-kw">public</span>:' },
    { line: 3, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isValidBST</span>(<span class="tok-type">TreeNode</span>* root) {' },
    { line: 4, code: '        <span class="tok-kw">return</span> <span class="tok-fn">validate</span>(root, <span class="tok-num">LONG_MIN</span>, <span class="tok-num">LONG_MAX</span>);' },
    { line: 5, code: '    }' },
    { line: 6, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">validate</span>(<span class="tok-type">TreeNode</span>* node, <span class="tok-kw">long</span> minVal, <span class="tok-kw">long</span> maxVal) {' },
    { line: 7, code: '        <span class="tok-kw">if</span> (!node) <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 8, code: '        <span class="tok-kw">if</span> (node-&gt;val &lt;= minVal || node-&gt;val &gt;= maxVal)' },
    { line: 9, code: '            <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 10, code: '        <span class="tok-kw">return</span> <span class="tok-fn">validate</span>(node-&gt;left, minVal, node-&gt;val) &amp;&amp;' },
    { line: 11, code: '               <span class="tok-fn">validate</span>(node-&gt;right, node-&gt;val, maxVal);' },
    { line: 12, code: '    }' },
    { line: 13, code: '};' }
  ],

  generateTrace(treeArr) {
    const arr = Array.isArray(treeArr) && treeArr.length ? treeArr : [2, 1, 3];
    const steps = [];

    // Build tree nodes with coordinates
    const nodeList = [];
    const edgeList = [];
    const nodeByIdx = {};
    const rangesByIdx = {};
    const statusByIdx = {};

    const xOffsets = [0, 140, 70, 36];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null || arr[i] === undefined) continue;
      const depth = Math.floor(Math.log2(i + 1));
      let x = 310;
      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        const parent = nodeByIdx[parentIdx];
        if (!parent) continue;
        const isLeft = i % 2 === 1;
        const dx = xOffsets[depth] || 36;
        x = parent.x + (isLeft ? -dx : dx);
        edgeList.push({
          from: `n${parentIdx}`,
          to: `n${i}`,
          label: isLeft ? "L" : "R",
          dir: true
        });
      }
      const nd = {
        idx: i,
        id: `n${i}`,
        val: arr[i],
        x,
        y: 42 + depth * 74
      };
      nodeByIdx[i] = nd;
      nodeList.push(nd);
    }

    const fmtBound = (b) => (b === -Infinity ? "-∞" : b === Infinity ? "+∞" : String(b));

    const buildBoards = (opts = {}) => {
      const {
        currIdx = -1,
        nodeVal = "-",
        rangeStr = "(-∞, +∞)",
        ret = "-",
        retStatus = ""
      } = opts;

      const nodes = nodeList.map((n) => ({
        id: n.id,
        val: String(n.val),
        sub: rangesByIdx[n.idx] || "",
        x: n.x,
        y: n.y,
        status: statusByIdx[n.idx] || "",
        ptr: n.idx === currIdx ? "node" : ""
      }));

      const edges = edgeList.map((e) => {
        const toIdx = Number(e.to.slice(1));
        return {
          ...e,
          status:
            statusByIdx[toIdx] === "match"
              ? "match"
              : statusByIdx[toIdx] === "hl"
              ? "hl"
              : ""
        };
      });

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "BST Range Validation",
            typeLabel: "二元樹節點與合法區間 (minVal, maxVal)",
            x: 325,
            y: 52,
            width: 620,
            height: 280,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "DFS 區間驗證狀態",
            x: 24,
            y: 205,
            items: [
              { id: "val", name: "node->val", val: String(nodeVal), status: currIdx >= 0 ? "hl" : "" },
              { id: "range", name: "(minVal, maxVal)", val: rangeStr, status: "hl" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 4,
      tag: "啟動根節點區間驗證",
      tagType: "default",
      inlineBadge: "validate(root, -∞, +∞)",
      explanation: "從根節點開始呼叫 validate(root, LONG_MIN, LONG_MAX)，初始合法開區間為 (-∞, +∞)。",
      vars: { "node->val": arr[0] ?? "null", range: "(-∞, +∞)", return: "-" },
      state: buildBoards({})
    });

    const dfs = (idx, minVal, maxVal) => {
      const nd = nodeByIdx[idx];
      if (!nd) return true;

      const rStr = `(${fmtBound(minVal)}, ${fmtBound(maxVal)})`;
      rangesByIdx[idx] = rStr;
      statusByIdx[idx] = "hl";

      const valid = nd.val > minVal && nd.val < maxVal;

      if (!valid) {
        statusByIdx[idx] = "warn";
        steps.push({
          line: 9,
          tag: `節點 ${nd.val} 違反 BST 區間！`,
          tagType: "default",
          inlineBadge: `${nd.val} ∉ ${rStr} → return false`,
          explanation: `檢查節點 ${nd.val}：合法開區間為 ${rStr}，但 ${nd.val} 不在區間內（違反祖先節點的 BST 大小約束），立即回傳 false！`,
          vars: { "node->val": nd.val, range: rStr, return: "false" },
          state: buildBoards({
            currIdx: idx,
            nodeVal: nd.val,
            rangeStr: rStr,
            ret: "false",
            retStatus: "warn"
          })
        });
        return false;
      }

      steps.push({
        line: 8,
        tag: `驗證節點 ${nd.val} ∈ ${rStr}`,
        tagType: "tag-check",
        inlineBadge: `${fmtBound(minVal)} < ${nd.val} < ${fmtBound(maxVal)} (合法)`,
        explanation: `檢查節點 ${nd.val}：滿足 ${fmtBound(minVal)} < ${nd.val} < ${fmtBound(maxVal)}，接著遞迴驗證左子樹區間 (${fmtBound(minVal)}, ${nd.val}) 與右子樹區間 (${nd.val}, ${fmtBound(maxVal)})。`,
        vars: { "node->val": nd.val, range: rStr, return: "-" },
        state: buildBoards({
          currIdx: idx,
          nodeVal: nd.val,
          rangeStr: rStr
        })
      });

      const leftOk = dfs(idx * 2 + 1, minVal, nd.val);
      if (!leftOk) return false;

      const rightOk = dfs(idx * 2 + 2, nd.val, maxVal);
      if (!rightOk) return false;

      statusByIdx[idx] = "match";
      steps.push({
        line: 11,
        tag: `子樹 ${nd.val} 驗證通過`,
        tagType: "tag-found",
        inlineBadge: `validate(${nd.val}) == true`,
        explanation: `節點 ${nd.val} 及其左右子樹皆符合區間 ${rStr} 約束，回傳 true。`,
        vars: { "node->val": nd.val, range: rStr, return: "true" },
        state: buildBoards({
          currIdx: idx,
          nodeVal: nd.val,
          rangeStr: rStr,
          ret: "true",
          retStatus: "match"
        })
      });

      return true;
    };

    const finalRes = dfs(0, -Infinity, Infinity);

    steps.push({
      line: 4,
      tag: finalRes ? "整棵樹為有效 BST (true)" : "驗證失敗：非有效 BST (false)",
      tagType: finalRes ? "tag-found" : "default",
      inlineBadge: `isValidBST → ${finalRes}`,
      explanation: finalRes
        ? "所有節點皆通過 (minVal, maxVal) 嚴格開區間測試，確認為有效二元搜尋樹，回傳 true！"
        : "存在違反祖先區間約束的節點，該二元樹不是有效的 BST，回傳 false。",
      vars: { "node->val": "-", range: "(-∞, +∞)", return: String(finalRes) },
      state: buildBoards({
        ret: String(finalRes),
        retStatus: finalRes ? "match" : "warn"
      })
    });

    return steps;
  }
};

// ============================================================================
// #40 Number of Islands (LC #200, Medium, Graph / Grid DFS)
// ============================================================================
window.PROBLEMS["number-of-islands"] = {
  id: 40,
  leetcodeId: 200,
  slug: "number-of-islands",
  title: "200. Number of Islands (島嶼數量)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 25,
  complexity: "Time O(M·N) · Space O(M·N)",
  argNames: ["grid"],
  description:
    "給你一個由 '1'（陸地）和 '0'（水）組成的二維網格 grid，請你計算網格中島嶼的數量。島嶼總是包圍在水中，並且每座島嶼只能由水平方向和/或豎直方向上相鄰的陸地連接形成。每當掃描到未訪問的 '1'，便將島嶼計數 +1 並透過 DFS 將整座相連島嶼沉沒為 '0'。",

  presets: [
    {
      name: "範例 1：兩座分離島嶼 (3×4 網格 → 2 座島嶼)",
      args: [
        [
          ["1", "1", "0", "0"],
          ["1", "0", "0", "1"],
          ["0", "0", "1", "1"]
        ]
      ]
    },
    {
      name: "範例 2：棋盤狀五座獨立島嶼 (3×3 網格 → 5 座島嶼)",
      args: [
        [
          ["1", "0", "1"],
          ["0", "1", "0"],
          ["1", "0", "1"]
        ]
      ]
    },
    {
      name: "範例 3：H 型連通大陸塊 (3×3 網格 → 1 座島嶼)",
      args: [
        [
          ["1", "1", "1"],
          ["0", "1", "0"],
          ["1", "1", "1"]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '    <span class="tok-kw">void</span> <span class="tok-fn">dfs</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&gt;&amp; grid, <span class="tok-kw">int</span> r, <span class="tok-kw">int</span> c) {' },
    { line: 3, code: '        <span class="tok-kw">if</span> (r &lt; <span class="tok-num">0</span> || r &gt;= grid.<span class="tok-fn">size</span>() || c &lt; <span class="tok-num">0</span> || c &gt;= grid[<span class="tok-num">0</span>].<span class="tok-fn">size</span>() || grid[r][c] == <span class="tok-num">\'0\'</span>)' },
    { line: 4, code: '            <span class="tok-kw">return</span>;' },
    { line: 5, code: '        grid[r][c] = <span class="tok-num">\'0\'</span>; <span class="tok-cmt">// 沉島標記已走訪</span>' },
    { line: 6, code: '        <span class="tok-fn">dfs</span>(grid, r + <span class="tok-num">1</span>, c); <span class="tok-fn">dfs</span>(grid, r - <span class="tok-num">1</span>, c);' },
    { line: 7, code: '        <span class="tok-fn">dfs</span>(grid, r, c + <span class="tok-num">1</span>); <span class="tok-fn">dfs</span>(grid, r, c - <span class="tok-num">1</span>);' },
    { line: 8, code: '    }' },
    { line: 9, code: '<span class="tok-kw">public</span>:' },
    { line: 10, code: '    <span class="tok-kw">int</span> <span class="tok-fn">numIslands</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&gt;&amp; grid) {' },
    { line: 11, code: '        <span class="tok-kw">int</span> islands = <span class="tok-num">0</span>;' },
    { line: 12, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> r = <span class="tok-num">0</span>; r &lt; grid.<span class="tok-fn">size</span>(); ++r) {' },
    { line: 13, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> c = <span class="tok-num">0</span>; c &lt; grid[<span class="tok-num">0</span>].<span class="tok-fn">size</span>(); ++c) {' },
    { line: 14, code: '                <span class="tok-kw">if</span> (grid[r][c] == <span class="tok-num">\'1\'</span>) {' },
    { line: 15, code: '                    ++islands;' },
    { line: 16, code: '                    <span class="tok-fn">dfs</span>(grid, r, c);' },
    { line: 17, code: '                }' },
    { line: 18, code: '            }' },
    { line: 19, code: '        }' },
    { line: 20, code: '        <span class="tok-kw">return</span> islands;' },
    { line: 21, code: '    }' },
    { line: 22, code: '};' }
  ],

  generateTrace(inputGrid) {
    const raw =
      Array.isArray(inputGrid) && inputGrid.length
        ? inputGrid
        : [
            ["1", "1", "0"],
            ["0", "1", "0"],
            ["0", "0", "1"]
          ];
    const R = raw.length;
    const C = raw[0].length;
    const grid = raw.map((row) => row.map((v) => String(v)));
    const sunkSet = new Set();
    const callStack = [];
    const steps = [];

    const buildBoards = (opts = {}) => {
      const {
        hl = [],
        match = [],
        r = "-",
        c = "-",
        islands = 0,
        ret = "-",
        retStatus = ""
      } = opts;

      return {
        boards: [
          {
            id: "grid",
            type: "grid",
            name: "grid (2D 陸地網格)",
            typeLabel: "'1' 陸地 / '0' 水域 (已沉島變淡)",
            x: 325,
            y: 52,
            cells: grid.map((row) => [...row]),
            hl,
            match,
            done: Array.from(sunkSet)
          },
          {
            id: "frontier",
            type: "stack",
            name: "DFS Call Stack",
            typeLabel: "遞迴沉島堆疊 (r, c)",
            x: 700,
            y: 52,
            items: callStack.map((pos, idx) => ({
              val: pos,
              status: idx === callStack.length - 1 ? "hl" : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "島嶼計數與座標",
            x: 24,
            y: 205,
            items: [
              { id: "pos", name: "(r, c)", val: r !== "-" ? `(${r}, ${c})` : "-", status: r !== "-" ? "hl" : "" },
              { id: "islands", name: "islands", val: String(islands), status: islands > 0 ? "match" : "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 11,
      tag: "初始化 islands = 0",
      tagType: "default",
      inlineBadge: `grid = ${R}×${C}, islands = 0`,
      explanation: `準備掃描 ${R}×${C} 二維網格，尋找所有未訪問的陸地 '1'。`,
      vars: { r: "-", c: "-", islands: 0, return: "-" },
      state: buildBoards({})
    });

    let islands = 0;

    const dfs = (r, c) => {
      if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] === "0") {
        return;
      }
      const key = `${r},${c}`;
      callStack.push(`(${r},${c})`);
      grid[r][c] = "0";
      sunkSet.add(key);

      steps.push({
        line: 5,
        tag: `DFS 沉沒陸地 (${r}, ${c})`,
        tagType: "tag-check",
        inlineBadge: `grid[${r}][${c}] = '0'`,
        explanation: `DFS 走訪相鄰陸地 (${r}, ${c})，將其標記為 '0'（沉島避免重複計數），並繼續向四個方向擴散。`,
        vars: { r, c, islands, return: "-" },
        state: buildBoards({
          hl: [key],
          r,
          c,
          islands
        })
      });

      dfs(r + 1, c);
      dfs(r - 1, c);
      dfs(r, c + 1);
      dfs(r, c - 1);

      callStack.pop();
    };

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === "1") {
          islands++;
          const key = `${r},${c}`;

          steps.push({
            line: 15,
            tag: `發現第 ${islands} 座島嶼起點 (${r}, ${c})`,
            tagType: "tag-found",
            inlineBadge: `grid[${r}][${c}] == '1' → ++islands (${islands})`,
            explanation: `在座標 (${r}, ${c}) 發現新的陸地 '1'！島嶼數量 islands 遞增為 ${islands}，立即啟動 DFS 將整座相連島嶼沉沒。`,
            vars: { r, c, islands, return: "-" },
            state: buildBoards({
              match: [key],
              r,
              c,
              islands
            })
          });

          dfs(r, c);
        }
      }
    }

    steps.push({
      line: 20,
      tag: `掃描完成：共 ${islands} 座島嶼`,
      tagType: "tag-found",
      inlineBadge: `return islands = ${islands}`,
      explanation: `整個網格掃描完畢，所有陸地皆已透過 DFS 連通分組並沉沒，總共找到 ${islands} 座島嶼！`,
      vars: { r: "-", c: "-", islands, return: islands },
      state: buildBoards({
        islands,
        ret: String(islands),
        retStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #41 Rotting Oranges (LC #994, Medium, Graph — Multi-Source BFS)
// ============================================================================
window.PROBLEMS["rotting-oranges"] = {
  id: 41,
  leetcodeId: 994,
  slug: "rotting-oranges",
  title: "994. Rotting Oranges (腐爛的橘子)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(M·N) · Space O(M·N)",
  argNames: ["grid"],
  description:
    "在給定的 m × n 網格 grid 中，每個單元格的值為：0 代表空單元格、1 代表新鮮橘子、2 代表腐爛的橘子。每分鐘，腐爛的橘子周圍 4 個方向上相鄰的新鮮橘子都會腐爛。請回傳直到沒有新鮮橘子為止所必須經過的最小分鐘數；如果不可能全部腐爛則回傳 -1。使用多源廣度優先搜尋 (Multi-Source BFS) 按分鐘層序擴散。",

  presets: [
    {
      name: "範例 1：左上角起點擴散 (3×3 網格 → 4 分鐘)",
      args: [
        [
          [2, 1, 1],
          [1, 1, 0],
          [0, 1, 1]
        ]
      ]
    },
    {
      name: "範例 2：左下角被 0 隔離無法腐爛 (回傳 -1)",
      args: [
        [
          [2, 1, 1],
          [0, 1, 1],
          [1, 0, 1]
        ]
      ]
    },
    {
      name: "範例 3：初始無新鮮橘子 [[0, 2]] (回傳 0 分鐘)",
      args: [[[0, 2]]]
    },
    {
      name: "範例 4：雙腐爛源同時夾擊擴散 (3×3 網格 → 2 分鐘)",
      args: [
        [
          [2, 1, 0],
          [1, 1, 1],
          [0, 1, 2]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2, code: '<span class="tok-kw">public</span>:' },
    { line: 3, code: '    <span class="tok-kw">int</span> <span class="tok-fn">orangesRotting</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; grid) {' },
    { line: 4, code: '        <span class="tok-type">queue</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-kw">int</span>, <span class="tok-kw">int</span>&gt;&gt; q;' },
    { line: 5, code: '        <span class="tok-kw">int</span> freshCount = <span class="tok-num">0</span>, minutes = <span class="tok-num">0</span>;' },
    { line: 6, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> r = <span class="tok-num">0</span>; r &lt; grid.<span class="tok-fn">size</span>(); ++r)' },
    { line: 7, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> c = <span class="tok-num">0</span>; c &lt; grid[<span class="tok-num">0</span>].<span class="tok-fn">size</span>(); ++c)' },
    { line: 8, code: '                <span class="tok-kw">if</span> (grid[r][c] == <span class="tok-num">2</span>) q.<span class="tok-fn">push</span>({r, c});' },
    { line: 9, code: '                <span class="tok-kw">else</span> <span class="tok-kw">if</span> (grid[r][c] == <span class="tok-num">1</span>) ++freshCount;' },
    { line: 10, code: '        <span class="tok-kw">int</span> dirs[<span class="tok-num">4</span>][<span class="tok-num">2</span>] = {{<span class="tok-num">1</span>,<span class="tok-num">0</span>},{-<span class="tok-num">1</span>,<span class="tok-num">0</span>},{<span class="tok-num">0</span>,<span class="tok-num">1</span>},{<span class="tok-num">0</span>,-<span class="tok-num">1</span>}};' },
    { line: 11, code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>() &amp;&amp; freshCount &gt; <span class="tok-num">0</span>) {' },
    { line: 12, code: '            ++minutes;' },
    { line: 13, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> sz = q.<span class="tok-fn">size</span>(); sz &gt; <span class="tok-num">0</span>; --sz) {' },
    { line: 14, code: '                <span class="tok-kw">auto</span> [r, c] = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();' },
    { line: 15, code: '                <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; d : dirs) {' },
    { line: 16, code: '                    <span class="tok-kw">int</span> nr = r + d[<span class="tok-num">0</span>], nc = c + d[<span class="tok-num">1</span>];' },
    { line: 17, code: '                    <span class="tok-kw">if</span> (nr &lt; <span class="tok-num">0</span> || nr &gt;= grid.<span class="tok-fn">size</span>() || nc &lt; <span class="tok-num">0</span> || nc &gt;= grid[<span class="tok-num">0</span>].<span class="tok-fn">size</span>() || grid[nr][nc] != <span class="tok-num">1</span>) <span class="tok-kw">continue</span>;' },
    { line: 18, code: '                    grid[nr][nc] = <span class="tok-num">2</span>; --freshCount;' },
    { line: 19, code: '                    q.<span class="tok-fn">push</span>({nr, nc});' },
    { line: 20, code: '                }' },
    { line: 21, code: '            }' },
    { line: 22, code: '        }' },
    { line: 23, code: '        <span class="tok-kw">return</span> freshCount == <span class="tok-num">0</span> ? minutes : -<span class="tok-num">1</span>;' },
    { line: 24, code: '    }' },
    { line: 25, code: '};' }
  ],

  generateTrace(inputGrid) {
    const raw =
      Array.isArray(inputGrid) && inputGrid.length
        ? inputGrid
        : [
            [2, 1, 1],
            [1, 1, 0],
            [0, 1, 1]
          ];
    const R = raw.length;
    const C = raw[0].length;
    const grid = raw.map((row) => row.map((v) => Number(v)));
    const queue = [];
    let freshCount = 0;
    let minutes = 0;
    const steps = [];

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (grid[r][c] === 2) queue.push([r, c]);
        else if (grid[r][c] === 1) freshCount++;
      }
    }

    const buildBoards = (opts = {}) => {
      const {
        hl = [],
        newlyRotted = [],
        curr = "-",
        ret = "-",
        retStatus = ""
      } = opts;

      const warnCells = [];
      const matchCells = [];
      for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
          const k = `${r},${c}`;
          if (newlyRotted.includes(k)) {
            warnCells.push(k);
          } else if (grid[r][c] === 2 && !hl.includes(k)) {
            warnCells.push(k);
          } else if (grid[r][c] === 1) {
            matchCells.push(k);
          }
        }
      }

      return {
        boards: [
          {
            id: "grid",
            type: "grid",
            name: "grid (橘子網格)",
            typeLabel: "2=腐爛(紅) · 1=新鮮(綠) · 0=空",
            x: 325,
            y: 52,
            cells: grid.map((row) => [...row]),
            hl,
            warn: warnCells,
            match: matchCells
          },
          {
            id: "queue",
            type: "queue",
            name: "q (Multi-Source BFS Queue)",
            typeLabel: "腐爛橘子佇列 pair<int,int>",
            x: 325,
            y: 235,
            items: queue.map(([qr, qc], idx) => ({
              val: `(${qr},${qc})`,
              status: newlyRotted.includes(`${qr},${qc}`) ? "warn" : idx === 0 ? "hl" : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "BFS 時間與新鮮橘子計數",
            x: 24,
            y: 205,
            items: [
              { id: "minutes", name: "minutes", val: String(minutes), status: "hl" },
              {
                id: "freshCount",
                name: "freshCount",
                val: String(freshCount),
                status: freshCount === 0 ? "match" : "hl"
              },
              { id: "curr", name: "curr (r,c)", val: curr, status: curr !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 9,
      tag: "統計初始腐爛源與新鮮橘子",
      tagType: "default",
      inlineBadge: `q.size() = ${queue.length}, freshCount = ${freshCount}`,
      explanation: `掃描網格：將所有初始腐爛橘子 (值為 2，共 ${queue.length} 顆) 推入多源 BFS 佇列 q，並統計新鮮橘子數量 freshCount = ${freshCount}。`,
      vars: { minutes: 0, freshCount, "q.size()": queue.length, return: "-" },
      state: buildBoards({})
    });

    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    while (queue.length > 0 && freshCount > 0) {
      minutes++;
      const sz = queue.length;
      const newlyRottedThisMin = [];

      for (let i = 0; i < sz; i++) {
        const [r, c] = queue.shift();
        const curKey = `${r},${c}`;

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] !== 1) continue;

          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
          const nKey = `${nr},${nc}`;
          newlyRottedThisMin.push(nKey);

          steps.push({
            line: 19,
            tag: `第 ${minutes} 分鐘：感染 (${nr}, ${nc})`,
            tagType: "tag-insert",
            inlineBadge: `(${r},${c}) → (${nr},${nc}) 腐爛, freshCount = ${freshCount}`,
            explanation: `第 ${minutes} 分鐘：腐爛橘子 (${r}, ${c}) 感染相鄰的新鮮橘子 (${nr}, ${nc})，將 grid[${nr}][${nc}] 改為 2，剩餘新鮮橘子 freshCount 減為 ${freshCount}，並將 (${nr}, ${nc}) 推入佇列。`,
            vars: { minutes, freshCount, "q.size()": queue.length, return: "-" },
            state: buildBoards({
              hl: [curKey],
              newlyRotted: [...newlyRottedThisMin],
              curr: `(${r}, ${c})`
            })
          });
        }
      }

      if (newlyRottedThisMin.length === 0) {
        steps.push({
          line: 13,
          tag: `第 ${minutes} 分鐘：無新橘子被感染`,
          tagType: "tag-check",
          inlineBadge: `q.empty() == true, freshCount = ${freshCount}`,
          explanation: `第 ${minutes} 分鐘層序擴散未能觸及任何新鮮橘子，佇列已清空。`,
          vars: { minutes, freshCount, "q.size()": 0, return: "-" },
          state: buildBoards({})
        });
      }
    }

    const ans = freshCount === 0 ? minutes : -1;
    steps.push({
      line: 23,
      tag: ans === -1 ? `剩餘 ${freshCount} 顆無法腐爛 (-1)` : `全部腐爛！共需 ${ans} 分鐘`,
      tagType: ans === -1 ? "default" : "tag-found",
      inlineBadge: `freshCount (${freshCount}) == 0 ? ${minutes} : -1 → return ${ans}`,
      explanation:
        ans === -1
          ? `BFS 結束後仍有 freshCount = ${freshCount} 顆新鮮橘子被空格隔離無法被感染，回傳 -1。`
          : `所有新鮮橘子皆已腐爛 (freshCount == 0)，總共耗時 ${ans} 分鐘，回傳 ${ans}！`,
      vars: { minutes, freshCount, "q.size()": queue.length, return: ans },
      state: buildBoards({
        ret: String(ans),
        retStatus: ans === -1 ? "warn" : "match"
      })
    });

    return steps;
  }
};

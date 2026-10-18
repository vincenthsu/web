/**
 * Grind 75 — Week 3 (Problems #26 – #33)
 * #26 Insert Interval (LC #57)
 * #27 01 Matrix (LC #542)
 * #28 K Closest Points to Origin (LC #973)
 * #29 Longest Substring Without Repeating Characters (LC #3)
 * #30 3Sum (LC #15)
 * #31 Binary Tree Level Order Traversal (LC #102)
 * #32 Clone Graph (LC #133)
 * #33 Evaluate Reverse Polish Notation (LC #150)
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #26 Insert Interval (LC #57, Medium, Array)
// ============================================================================
window.PROBLEMS["insert-interval"] = {
  id: 26,
  leetcodeId: 57,
  slug: "insert-interval",
  title: "57. Insert Interval (插入區間)",
  difficulty: "Medium",
  topic: "Array",
  mins: 25,
  complexity: "Time O(N) · Space O(N)",
  description:
    "給定一組互不重疊且已按起點升序排列的區間列表 intervals，請在其中插入新區間 newInterval，並在必要時合併重疊區間。採用 C++ 三階段線性掃描：先加入左側不重疊區間，接著合併所有與 newInterval 重疊的區間，最後加入右側剩餘區間。",
  argNames: ["intervals", "newInterval"],

  presets: [
    {
      name: "範例 1：中間插入並合併 ([1,3],[6,9] + [2,5])",
      args: [
        [
          [1, 3],
          [6, 9]
        ],
        [2, 5]
      ]
    },
    {
      name: "範例 2：跨多區間連續合併 (5 個區間 + [4,8])",
      args: [
        [
          [1, 2],
          [3, 5],
          [6, 7],
          [8, 10],
          [12, 16]
        ],
        [4, 8]
      ]
    },
    {
      name: "範例 3：無重疊直接插入尾端 ([1,2],[3,5] + [7,9])",
      args: [
        [
          [1, 2],
          [3, 5]
        ],
        [7, 9]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">insert</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt;&amp; intervals, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; newInterval) {` },
    { line: 2, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; res;` },
    { line: 3, code: `    <span class="tok-type">int</span> i = <span class="tok-num">0</span>, n = intervals.<span class="tok-fn">size</span>();` },
    { line: 4, code: `    <span class="tok-cmt">// 階段 1：在 newInterval 左側且完全不重疊的區間</span>` },
    { line: 5, code: `    <span class="tok-kw">while</span> (i &lt; n &amp;&amp; intervals[i][<span class="tok-num">1</span>] &lt; newInterval[<span class="tok-num">0</span>]) {` },
    { line: 6, code: `        res.<span class="tok-fn">push_back</span>(intervals[i++]);` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-cmt">// 階段 2：與 newInterval 重疊的區間，合併更新邊界</span>` },
    { line: 9, code: `    <span class="tok-kw">while</span> (i &lt; n &amp;&amp; intervals[i][<span class="tok-num">0</span>] &lt;= newInterval[<span class="tok-num">1</span>]) {` },
    { line: 10, code: `        newInterval[<span class="tok-num">0</span>] = <span class="tok-fn">min</span>(newInterval[<span class="tok-num">0</span>], intervals[i][<span class="tok-num">0</span>]);` },
    { line: 11, code: `        newInterval[<span class="tok-num">1</span>] = <span class="tok-fn">max</span>(newInterval[<span class="tok-num">1</span>], intervals[i][<span class="tok-num">1</span>]);` },
    { line: 12, code: `        i++;` },
    { line: 13, code: `    }` },
    { line: 14, code: `    res.<span class="tok-fn">push_back</span>(newInterval);` },
    { line: 15, code: `    <span class="tok-cmt">// 階段 3：在 newInterval 右側剩餘不重疊的區間</span>` },
    { line: 16, code: `    <span class="tok-kw">while</span> (i &lt; n) {` },
    { line: 17, code: `        res.<span class="tok-fn">push_back</span>(intervals[i++]);` },
    { line: 18, code: `    }` },
    { line: 19, code: `    <span class="tok-kw">return</span> res;` },
    { line: 20, code: `}` }
  ],

  generateTrace(rawIntervals, rawNew) {
    const intervals = Array.isArray(rawIntervals)
      ? rawIntervals.map((iv) => [Number(iv[0]), Number(iv[1])])
      : [[1, 3], [6, 9]];
    const newInterval = Array.isArray(rawNew) && rawNew.length >= 2
      ? [Number(rawNew[0]), Number(rawNew[1])]
      : [2, 5];

    const n = intervals.length;
    const res = [];
    const steps = [];
    let i = 0;

    const fmtIv = (iv) => `[${iv[0]},${iv[1]}]`;
    const ivStrings = intervals.map(fmtIv);

    const makeSnap = (opts = {}) => {
      const doneIdx = [];
      for (let k = 0; k < i; k++) doneIdx.push(k);
      const resStrings = res.map(fmtIv);

      return {
        boards: [
          {
            id: "intervals",
            type: "array",
            name: "intervals",
            typeLabel: "原區間陣列 (vector<vector<int>>)",
            x: 330,
            y: 52,
            values: ivStrings,
            hl: opts.hlIv || [],
            match: opts.matchIv || [],
            done: doneIdx,
            pointers: i < n ? [{ idx: i, label: `i = ${i}`, color: opts.ptrColor || "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "合併區間與游標",
            x: 24,
            y: 215,
            items: [
              { id: "newInterval", name: "newInterval", val: fmtIv(newInterval), status: opts.newStatus || "hl" },
              { id: "i", name: "i", val: `${i} (n=${n})`, status: "" },
              { id: "phase", name: "階段", val: opts.phase || "初始化", status: opts.phaseStatus || "" }
            ]
          },
          {
            id: "res",
            type: "array",
            name: "res",
            typeLabel: "輸出結果區間 (vector<vector<int>>)",
            x: 330,
            y: 215,
            values: resStrings,
            hl: opts.hlRes || [],
            match: opts.matchRes || []
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 3,
      tag: "初始化",
      tagType: "default",
      inlineBadge: `i = 0, n = ${n}, newInterval = ${fmtIv(newInterval)}`,
      explanation: `準備將 newInterval = ${fmtIv(newInterval)} 插入 ${n} 個已排序區間中。建立空結果陣列 res，游標 i = 0。`,
      vars: { i: 0, newInterval: fmtIv(newInterval), "res.size()": 0, phase: "初始化" },
      state: makeSnap({ phase: "初始化", hlIv: n > 0 ? [0] : [] })
    });

    // Phase 1: strictly before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
      const cur = intervals[i];
      steps.push({
        line: 5,
        tag: "階段 1：檢查左側區間",
        tagType: "tag-check",
        inlineBadge: `${cur[1]} < ${newInterval[0]} (完全在左側)`,
        explanation: `檢查 intervals[${i}] = ${fmtIv(cur)}：其終點 ${cur[1]} < newInterval 起點 ${newInterval[0]}，無重疊，直接放入 res。`,
        vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "階段 1 (左側)" },
        state: makeSnap({
          phase: "階段 1 (左側不重疊)",
          hlIv: [i],
          connectors: [{ from: `wb-cw-intervals-${i}`, to: "wb-var-newInterval", label: `${cur[1]} < ${newInterval[0]}`, color: "blue" }]
        })
      });

      res.push([...cur]);
      const pushedIdx = i;
      i++;
      steps.push({
        line: 6,
        tag: "加入左側區間",
        tagType: "tag-insert",
        inlineBadge: `res.push_back(${fmtIv(cur)})`,
        explanation: `將 ${fmtIv(cur)} 推入 res，游標 i 前進至 ${i}。`,
        vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "階段 1 (左側)" },
        state: makeSnap({
          phase: "階段 1 (左側不重疊)",
          hlRes: [res.length - 1],
          connectors: [{ from: `wb-cw-intervals-${pushedIdx}`, to: `wb-cw-res-${res.length - 1}`, label: "push_back", color: "purple" }]
        })
      });
    }

    // Phase 2: overlapping with newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
      const cur = intervals[i];
      const oldNew = fmtIv(newInterval);
      newInterval[0] = Math.min(newInterval[0], cur[0]);
      newInterval[1] = Math.max(newInterval[1], cur[1]);

      steps.push({
        line: 11,
        tag: "階段 2：合併重疊區間",
        tagType: "tag-check",
        inlineBadge: `${oldNew} ∪ ${fmtIv(cur)} ➔ ${fmtIv(newInterval)}`,
        explanation: `intervals[${i}] = ${fmtIv(cur)} 的起點 ${cur[0]} <= newInterval 終點，發生重疊！合併更新 newInterval = [min, max] = ${fmtIv(newInterval)}。`,
        vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "階段 2 (重疊合併)" },
        state: makeSnap({
          phase: "階段 2 (重疊合併)",
          hlIv: [i],
          newStatus: "hl",
          ptrColor: "purple",
          connectors: [{ from: `wb-cw-intervals-${i}`, to: "wb-var-newInterval", label: `合併為 ${fmtIv(newInterval)}`, color: "purple" }]
        })
      });
      i++;
    }

    // Push merged newInterval
    res.push([...newInterval]);
    steps.push({
      line: 14,
      tag: "寫入合併後 newInterval",
      tagType: "tag-found",
      inlineBadge: `res.push_back(${fmtIv(newInterval)})`,
      explanation: `所有重疊區間皆已合併完畢，將最終的 newInterval = ${fmtIv(newInterval)} 推入 res。`,
      vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "階段 2 完成" },
      state: makeSnap({
        phase: "階段 2 完成",
        newStatus: "match",
        matchRes: [res.length - 1],
        connectors: [{ from: "wb-var-newInterval", to: `wb-cw-res-${res.length - 1}`, label: `寫入 ${fmtIv(newInterval)}`, color: "green" }]
      })
    });

    // Phase 3: remaining right intervals
    while (i < n) {
      const cur = intervals[i];
      res.push([...cur]);
      const pushedIdx = i;
      i++;
      steps.push({
        line: 17,
        tag: "階段 3：加入右側剩餘區間",
        tagType: "tag-insert",
        inlineBadge: `res.push_back(${fmtIv(cur)})`,
        explanation: `將右側不重疊區間 intervals[${pushedIdx}] = ${fmtIv(cur)} 直接加入 res。`,
        vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "階段 3 (右側)" },
        state: makeSnap({
          phase: "階段 3 (右側剩餘)",
          hlRes: [res.length - 1],
          connectors: [{ from: `wb-cw-intervals-${pushedIdx}`, to: `wb-cw-res-${res.length - 1}`, label: "push_back", color: "blue" }]
        })
      });
    }

    steps.push({
      line: 19,
      tag: "完成並回傳",
      tagType: "tag-found",
      inlineBadge: `return [${res.map(fmtIv).join(", ")}]`,
      explanation: `三階段掃描結束，共產生 ${res.length} 個互不重疊區間：${res.map(fmtIv).join(", ")}。`,
      vars: { i, newInterval: fmtIv(newInterval), "res.size()": res.length, phase: "完成" },
      state: makeSnap({
        phase: "完成回傳",
        phaseStatus: "match",
        newStatus: "match",
        matchRes: res.map((_, idx) => idx)
      })
    });

    return steps;
  }
};

// ============================================================================
// #27 01 Matrix (LC #542, Medium, Graph)
// ============================================================================
window.PROBLEMS["01-matrix"] = {
  id: 27,
  leetcodeId: 542,
  slug: "01-matrix",
  title: "542. 01 Matrix (01 矩陣)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(M·N) · Space O(M·N)",
  description:
    "給定一個由 0 與 1 組成的二維矩陣 mat，請找出每個格子到最近 0 的曼哈頓距離。採用「多源廣度優先搜尋 (Multi-source BFS)」：先將所有值為 0 的座標同時推入佇列作為起點（距離 0），再一層層向外擴散更新鄰近格子的最短距離。",
  argNames: ["mat"],

  presets: [
    {
      name: "範例 1：中心包圍 (3×3 標準測資)",
      args: [
        [
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 1]
        ]
      ]
    },
    {
      name: "範例 2：單一角落 0 向外擴散 (3×3)",
      args: [
        [
          [0, 1, 1],
          [1, 1, 1],
          [1, 1, 1]
        ]
      ]
    },
    {
      name: "範例 3：對角雙源 0 (3×3)",
      args: [
        [
          [0, 1, 1],
          [1, 1, 1],
          [1, 1, 0]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">updateMatrix</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt;&amp; mat) {` },
    { line: 2, code: `    <span class="tok-type">int</span> m = mat.<span class="tok-fn">size</span>(), n = mat[<span class="tok-num">0</span>].<span class="tok-fn">size</span>();` },
    { line: 3, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; dist(m, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;(n, <span class="tok-num">1e9</span>));` },
    { line: 4, code: `    <span class="tok-type">queue</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-type">int</span>,<span class="tok-type">int</span>&gt;&gt; q;` },
    { line: 5, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> r = <span class="tok-num">0</span>; r &lt; m; ++r)` },
    { line: 6, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> c = <span class="tok-num">0</span>; c &lt; n; ++c)` },
    { line: 7, code: `            <span class="tok-kw">if</span> (mat[r][c] == <span class="tok-num">0</span>) { dist[r][c] = <span class="tok-num">0</span>; q.<span class="tok-fn">push</span>({r, c}); }` },
    { line: 8, code: `    <span class="tok-type">int</span> dirs[<span class="tok-num">4</span>][<span class="tok-num">2</span>] = {{-1,0}, {1,0}, {0,-1}, {0,1}};` },
    { line: 9, code: `    <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {` },
    { line: 10, code: `        <span class="tok-kw">auto</span> [r, c] = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();` },
    { line: 11, code: `        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; d : dirs) {` },
    { line: 12, code: `            <span class="tok-type">int</span> nr = r + d[<span class="tok-num">0</span>], nc = c + d[<span class="tok-num">1</span>];` },
    { line: 13, code: `            <span class="tok-kw">if</span> (nr &gt;= <span class="tok-num">0</span> &amp;&amp; nr &lt; m &amp;&amp; nc &gt;= <span class="tok-num">0</span> &amp;&amp; nc &lt; n &amp;&amp; dist[nr][nc] &gt; dist[r][c] + <span class="tok-num">1</span>) {` },
    { line: 14, code: `                dist[nr][nc] = dist[r][c] + <span class="tok-num">1</span>;` },
    { line: 15, code: `                q.<span class="tok-fn">push</span>({nr, nc});` },
    { line: 16, code: `            }` },
    { line: 17, code: `        }` },
    { line: 18, code: `    }` },
    { line: 19, code: `    <span class="tok-kw">return</span> dist;` },
    { line: 20, code: `}` }
  ],

  generateTrace(rawMat) {
    const mat = Array.isArray(rawMat) && rawMat.length > 0
      ? rawMat.map((row) => row.map(Number))
      : [
          [0, 0, 0],
          [0, 1, 0],
          [1, 1, 1]
        ];
    const m = mat.length;
    const n = mat[0].length;
    const INF = 1e9;
    const dist = Array.from({ length: m }, () => Array(n).fill(INF));
    const q = [];
    const steps = [];
    const settled = new Set();

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (mat[r][c] === 0) {
          dist[r][c] = 0;
          q.push([r, c]);
          settled.add(`${r},${c}`);
        }
      }
    }

    const makeSnap = (opts = {}) => {
      const cells = dist.map((row) => row.map((v) => (v >= INF ? "∞" : v)));
      return {
        boards: [
          {
            id: "dist",
            type: "grid",
            name: "dist",
            typeLabel: `最短距離矩陣 (${m}×${n})`,
            x: 330,
            y: 52,
            cells,
            hl: opts.hl || [],
            match: opts.match || [],
            done: Array.from(settled)
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "BFS 佇列 (queue<pair<int,int>>)",
            x: 330,
            y: 235,
            leftLabel: "front ←",
            rightLabel: "← back",
            items: q.map(([r, c], idx) => ({
              val: `(${r},${c})`,
              status: idx === 0 && opts.frontHl ? "hl" : opts.newBack && idx === q.length - 1 ? "match" : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "bfs_vars",
            typeLabel: "當前擴散座標",
            x: 24,
            y: 215,
            items: [
              { id: "curr", name: "curr (r,c)", val: opts.curr || "-", status: opts.curr ? "hl" : "" },
              { id: "nei", name: "neighbor (nr,nc)", val: opts.nei || "-", status: opts.neiStatus || "" },
              { id: "qsize", name: "q.size()", val: String(q.length), status: "" }
            ]
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 7,
      tag: "多源起點入列",
      tagType: "tag-insert",
      inlineBadge: `將 ${q.length} 個 0 座標推入佇列，其餘設為 ∞`,
      explanation: `掃描整個 ${m}×${n} 矩陣：所有 mat[r][c] == 0 的格子距離設為 0 並同時加入 BFS 佇列 q；所有 1 的格子初始化為 ∞。`,
      vars: { "curr(r,c)": "-", "neighbor": "-", "q.size()": q.length },
      state: makeSnap({
        match: q.map(([r, c]) => `${r},${c}`)
      })
    });

    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];

    while (q.length > 0) {
      const [r, c] = q.shift();
      settled.add(`${r},${c}`);

      steps.push({
        line: 10,
        tag: "取出佇列前端",
        tagType: "tag-check",
        inlineBadge: `pop (${r},${c}), dist = ${dist[r][c]}`,
        explanation: `從佇列前端取出座標 (${r},${c})，其最短距離 dist[${r}][${c}] = ${dist[r][c]}，準備檢查上下左右四個鄰居。`,
        vars: { "curr(r,c)": `(${r},${c})`, "neighbor": "-", "q.size()": q.length },
        state: makeSnap({
          curr: `(${r},${c}) [d=${dist[r][c]}]`,
          hl: [`${r},${c}`]
        })
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] > dist[r][c] + 1) {
          dist[nr][nc] = dist[r][c] + 1;
          q.push([nr, nc]);
          settled.add(`${nr},${nc}`);

          steps.push({
            line: 15,
            tag: "更新鄰居最短距離",
            tagType: "tag-found",
            inlineBadge: `dist[${nr}][${nc}] = ${dist[nr][nc]}`,
            explanation: `鄰居 (${nr},${nc}) 原距離為 ∞，透過 (${r},${c}) 更新最短距離為 dist[${r}][${c}] + 1 = ${dist[nr][nc]}，並將 (${nr},${nc}) 推入佇列尾端。`,
            vars: { "curr(r,c)": `(${r},${c})`, "neighbor": `(${nr},${nc})=${dist[nr][nc]}`, "q.size()": q.length },
            state: makeSnap({
              curr: `(${r},${c}) [d=${dist[r][c]}]`,
              nei: `(${nr},${nc}) ➔ ${dist[nr][nc]}`,
              neiStatus: "match",
              hl: [`${r},${c}`],
              match: [`${nr},${nc}`],
              newBack: true,
              connectors: [
                {
                  from: `wb-grid-dist-${r}-${c}`,
                  to: `wb-grid-dist-${nr}-${nc}`,
                  label: `+1 ➔ ${dist[nr][nc]}`,
                  color: "green"
                }
              ]
            })
          });
        }
      }
    }

    const allCoords = [];
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) allCoords.push(`${r},${c}`);
    }

    steps.push({
      line: 19,
      tag: "BFS 完成回傳",
      tagType: "tag-found",
      inlineBadge: `return dist`,
      explanation: `佇列已空，所有格子的最短 0 距離皆已計算完成！`,
      vars: { "curr(r,c)": "完成", "neighbor": "-", "q.size()": 0 },
      state: makeSnap({
        match: allCoords
      })
    });

    return steps;
  }
};

// ============================================================================
// #28 K Closest Points to Origin (LC #973, Medium, Heap)
// ============================================================================
window.PROBLEMS["k-closest-points-to-origin"] = {
  id: 28,
  leetcodeId: 973,
  slug: "k-closest-points-to-origin",
  title: "973. K Closest Points to Origin (最接近原點的 K 個點)",
  difficulty: "Medium",
  topic: "Heap",
  mins: 30,
  complexity: "Time O(N log K) · Space O(K)",
  description:
    "給定平面上一組座標點 points 與整數 k，回傳距離原點 (0,0) 最近的 k 個點。使用大小維持在 k 的 C++ 最大堆積 (Max-Heap `priority_queue<pair<int,int>>`)，以歐幾里得距離平方 d² = x² + y² 排序：每當堆積超過 k 個元素，立即彈出頂端距離最遠的點。",
  argNames: ["points", "k"],

  presets: [
    {
      name: "範例 1：標準測資 ([[1,3],[-2,2]], k = 1)",
      args: [
        [
          [1, 3],
          [-2, 2]
        ],
        1
      ]
    },
    {
      name: "範例 2：取前 2 近點 ([[3,3],[5,-1],[-2,4],[1,1]], k = 2)",
      args: [
        [
          [3, 3],
          [5, -1],
          [-2, 4],
          [1, 1]
        ],
        2
      ]
    },
    {
      name: "範例 3：4 點取 3 近點 ([[2,2],[1,0],[0,3],[-1,-1]], k = 3)",
      args: [
        [
          [2, 2],
          [1, 0],
          [0, 3],
          [-1, -1]
        ],
        3
      ]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">kClosest</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt;&amp; points, <span class="tok-type">int</span> k) {` },
    { line: 2, code: `    <span class="tok-type">priority_queue</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-type">int</span>, <span class="tok-type">int</span>&gt;&gt; maxHeap; <span class="tok-cmt">// {distSq, idx}</span>` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; points.<span class="tok-fn">size</span>(); ++i) {` },
    { line: 4, code: `        <span class="tok-type">int</span> d2 = points[i][<span class="tok-num">0</span>] * points[i][<span class="tok-num">0</span>] + points[i][<span class="tok-num">1</span>] * points[i][<span class="tok-num">1</span>];` },
    { line: 5, code: `        maxHeap.<span class="tok-fn">push</span>({d2, i});` },
    { line: 6, code: `        <span class="tok-kw">if</span> (maxHeap.<span class="tok-fn">size</span>() &gt; k) {` },
    { line: 7, code: `            maxHeap.<span class="tok-fn">pop</span>(); <span class="tok-cmt">// 淘汰目前距離最遠的頂端點</span>` },
    { line: 8, code: `        }` },
    { line: 9, code: `    }` },
    { line: 10, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; res;` },
    { line: 11, code: `    <span class="tok-kw">while</span> (!maxHeap.<span class="tok-fn">empty</span>()) {` },
    { line: 12, code: `        res.<span class="tok-fn">push_back</span>(points[maxHeap.<span class="tok-fn">top</span>().second]);` },
    { line: 13, code: `        maxHeap.<span class="tok-fn">pop</span>();` },
    { line: 14, code: `    }` },
    { line: 15, code: `    <span class="tok-kw">return</span> res;` },
    { line: 16, code: `}` }
  ],

  generateTrace(rawPoints, rawK) {
    const points = Array.isArray(rawPoints) && rawPoints.length > 0
      ? rawPoints.map((p) => [Number(p[0]), Number(p[1])])
      : [[1, 3], [-2, 2]];
    const k = Math.max(1, Math.min(points.length, Number(rawK) || 1));

    const fmtPt = (p) => `(${p[0]},${p[1]})`;
    const ptLabels = points.map(fmtPt);
    const heap = []; // sorted descending by d2 (index 0 = maxHeap.top())
    const sortHeap = () => heap.sort((a, b) => b.d2 - a.d2 || b.idx - a.idx);

    const steps = [];

    const makeSnap = (opts = {}) => {
      const doneIdx = [];
      if (opts.curIdx !== undefined) {
        for (let j = 0; j < opts.curIdx; j++) doneIdx.push(j);
      }
      return {
        boards: [
          {
            id: "pts",
            type: "array",
            name: "points",
            typeLabel: `輸入座標點 (k = ${k})`,
            x: 330,
            y: 52,
            values: ptLabels,
            hl: opts.hlPt || [],
            match: opts.matchPt || [],
            warn: opts.warnPt || [],
            done: doneIdx,
            pointers: opts.curIdx !== undefined && opts.curIdx < points.length
              ? [{ idx: opts.curIdx, label: `i = ${opts.curIdx}`, color: "blue" }]
              : []
          },
          {
            id: "vars",
            type: "vars",
            name: "heap_vars",
            typeLabel: "距離平方與容量監看",
            x: 24,
            y: 215,
            items: [
              { id: "k", name: "容量上限 k", val: String(k), status: "" },
              { id: "d2", name: "d² = x² + y²", val: opts.d2Text || "-", status: opts.d2Text ? "hl" : "" },
              { id: "top", name: "maxHeap.top()", val: heap.length ? `d²=${heap[0].d2} ${fmtPt(points[heap[0].idx])}` : "empty", status: opts.topStatus || "" }
            ]
          },
          {
            id: "heap",
            type: "queue",
            name: "maxHeap",
            typeLabel: `最大堆積 (size=${heap.length}/${k})`,
            x: 330,
            y: 215,
            leftLabel: "top (最遠) ←",
            rightLabel: "← 較近",
            items: heap.map((item, idx) => ({
              val: `d²=${item.d2} ${fmtPt(points[item.idx])}`,
              status: opts.heapStatus ? opts.heapStatus(item, idx) : idx === 0 ? "hl" : ""
            }))
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 2,
      tag: "初始化最大堆積",
      tagType: "default",
      inlineBadge: `k = ${k}, maxHeap = empty`,
      explanation: `建立最大堆積 maxHeap，準備從 ${points.length} 個座標點中篩選出距離原點最近的 ${k} 個點。`,
      vars: { i: "-", "d²": "-", "maxHeap.size()": 0, k },
      state: makeSnap({})
    });

    for (let i = 0; i < points.length; i++) {
      const [x, y] = points[i];
      const d2 = x * x + y * y;
      const d2Formula = `(${x})²+(${y})² = ${d2}`;

      heap.push({ d2, idx: i });
      sortHeap();
      const insertedPos = heap.findIndex((h) => h.idx === i);

      steps.push({
        line: 5,
        tag: "計算距離並推入堆積",
        tagType: "tag-insert",
        inlineBadge: `push({d²=${d2}, ${fmtPt(points[i])}})`,
        explanation: `計算 points[${i}] = ${fmtPt(points[i])} 的距離平方 d² = ${d2Formula}，推入 maxHeap（目前堆積大小 ${heap.length}）。`,
        vars: { i, "d²": d2, "maxHeap.size()": heap.length, k },
        state: makeSnap({
          curIdx: i,
          hlPt: [i],
          d2Text: d2Formula,
          heapStatus: (it) => (it.idx === i ? "hl" : ""),
          connectors: [
            {
              from: `wb-cw-pts-${i}`,
              to: `wb-queue-heap-${insertedPos}`,
              label: `push d²=${d2}`,
              color: "purple"
            }
          ]
        })
      });

      if (heap.length > k) {
        const evicted = heap.shift();
        steps.push({
          line: 7,
          tag: "超過容量 k，淘汰最遠點",
          tagType: "tag-check",
          inlineBadge: `pop() 淘汰 d²=${evicted.d2} ${fmtPt(points[evicted.idx])}`,
          explanation: `maxHeap.size() > ${k}！彈出堆積頂端距離最遠的點 ${fmtPt(points[evicted.idx])} (d² = ${evicted.d2})，保留較近的 ${k} 個點。`,
          vars: { i, "d²": d2, "maxHeap.size()": heap.length, k },
          state: makeSnap({
            curIdx: i,
            hlPt: [i],
            warnPt: [evicted.idx],
            d2Text: d2Formula,
            topStatus: "warn"
          })
        });
      }
    }

    const winnerIndices = heap.map((h) => h.idx);
    const winnerStr = winnerIndices.map((idx) => fmtPt(points[idx])).join(", ");

    steps.push({
      line: 15,
      tag: "回傳最近的 K 個點",
      tagType: "tag-found",
      inlineBadge: `return [${winnerStr}]`,
      explanation: `掃描結束，maxHeap 中留下的 ${k} 個點即為距離原點最近的解：[${winnerStr}]。`,
      vars: { i: points.length, "d²": "-", "maxHeap.size()": heap.length, k },
      state: makeSnap({
        curIdx: points.length,
        matchPt: winnerIndices,
        topStatus: "match",
        heapStatus: () => "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #29 Longest Substring Without Repeating Characters (LC #3, Medium, String)
// ============================================================================
window.PROBLEMS["longest-substring-without-repeating-characters"] = {
  id: 29,
  leetcodeId: 3,
  slug: "longest-substring-without-repeating-characters",
  title: "3. Longest Substring Without Repeating Characters (無重複字元的最長子字串)",
  difficulty: "Medium",
  topic: "String",
  mins: 30,
  complexity: "Time O(N) · Space O(min(N, Σ))",
  description:
    "給定字串 s，請找出其中不含有重複字元的「最長子字串」之長度。使用「滑動視窗 (Sliding Window) [left, right]」搭配雜湊表 lastIdx 記錄每個字元最後出現的索引：若 s[right] 曾在視窗內出現過，則將 left 直接跳至 lastIdx[s[right]] + 1。",
  argNames: ["s"],

  presets: [
    {
      name: "範例 1：經典測資 (abcabcbb ➔ 3)",
      args: ["abcabcbb"]
    },
    {
      name: "範例 2：頭尾與連續重複 (pwwkew ➔ 3)",
      args: ["pwwkew"]
    },
    {
      name: "範例 3：跨距收縮視窗 (abba ➔ 2)",
      args: ["abba"]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">lengthOfLongestSubstring</span>(<span class="tok-type">string</span> s) {` },
    { line: 2, code: `    <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">char</span>, <span class="tok-type">int</span>&gt; lastIdx;` },
    { line: 3, code: `    <span class="tok-type">int</span> left = <span class="tok-num">0</span>, maxLen = <span class="tok-num">0</span>;` },
    { line: 4, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> right = <span class="tok-num">0</span>; right &lt; s.<span class="tok-fn">size</span>(); ++right) {` },
    { line: 5, code: `        <span class="tok-type">char</span> c = s[right];` },
    { line: 6, code: `        <span class="tok-kw">if</span> (lastIdx.<span class="tok-fn">count</span>(c) &amp;&amp; lastIdx[c] &gt;= left) {` },
    { line: 7, code: `            left = lastIdx[c] + <span class="tok-num">1</span>; <span class="tok-cmt">// 收縮左界避開重複字元</span>` },
    { line: 8, code: `        }` },
    { line: 9, code: `        lastIdx[c] = right;` },
    { line: 10, code: `        maxLen = <span class="tok-fn">max</span>(maxLen, right - left + <span class="tok-num">1</span>);` },
    { line: 11, code: `    }` },
    { line: 12, code: `    <span class="tok-kw">return</span> maxLen;` },
    { line: 13, code: `}` }
  ],

  generateTrace(rawS) {
    const s = typeof rawS === "string" && rawS.length > 0 ? rawS : "abcabcbb";
    const chars = s.split("");
    const lastIdx = new Map();
    let left = 0;
    let maxLen = 0;
    let bestRange = [0, -1];
    const steps = [];

    const makeSnap = (opts = {}) => {
      const right = opts.right !== undefined ? opts.right : -1;
      const winIndices = [];
      const doneIndices = [];
      if (right >= 0) {
        for (let k = 0; k < left; k++) doneIndices.push(k);
        for (let k = left; k <= right; k++) winIndices.push(k);
      }

      const pointers = [];
      if (right >= 0 && left < chars.length) {
        pointers.push({ idx: left, label: `L=${left}`, color: "green" });
      }
      if (right >= 0 && right < chars.length) {
        pointers.push({ idx: right, label: `R=${right}`, color: "blue" });
      }

      const dictRows = Array.from(lastIdx.entries()).map(([ch, idx]) => ({
        id: ch,
        key: `'${ch}'`,
        val: String(idx),
        note: opts.hitChar === ch ? "⚠ 視窗內重複！" : opts.updatedChar === ch ? "＋ 更新索引" : "最後位置",
        status: opts.hitChar === ch ? "hit" : opts.updatedChar === ch ? "inserted" : ""
      }));

      const curWinStr = right >= left ? `"${s.slice(left, right + 1)}" (長 ${right - left + 1})` : `""`;

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: "字串滑動視窗 [left..right]",
            x: 330,
            y: 52,
            values: chars.map((c) => `'${c}'`),
            hl: opts.hl || winIndices,
            match: opts.match || [],
            warn: opts.warn || [],
            done: doneIndices,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "win_vars",
            typeLabel: "視窗範圍與最長紀錄",
            x: 24,
            y: 215,
            items: [
              { id: "win", name: "當前視窗", val: curWinStr, status: "hl" },
              { id: "maxLen", name: "maxLen", val: String(maxLen), status: opts.maxUpdated ? "match" : "" }
            ]
          },
          {
            id: "lastIdx",
            type: "dict",
            name: "lastIdx",
            typeLabel: "字元最後出現位置 (unordered_map)",
            x: 330,
            y: 225,
            headers: ["char", "lastIdx", "狀態"],
            rows: dictRows
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 3,
      tag: "初始化滑動視窗",
      tagType: "default",
      inlineBadge: `left = 0, maxLen = 0`,
      explanation: `初始化滑動視窗左界 left = 0、最長長度 maxLen = 0，以及空的雜湊表 lastIdx。`,
      vars: { left: 0, right: "-", "s[right]": "-", maxLen: 0 },
      state: makeSnap({})
    });

    for (let right = 0; right < chars.length; right++) {
      const c = chars[right];
      const prevPos = lastIdx.has(c) ? lastIdx.get(c) : -1;

      if (prevPos >= left) {
        const oldLeft = left;
        left = prevPos + 1;
        steps.push({
          line: 7,
          tag: "發現重複字元，收縮左界",
          tagType: "tag-check",
          inlineBadge: `'${c}' 曾出現在 ${prevPos} >= L(${oldLeft}) ➔ left = ${left}`,
          explanation: `s[${right}] = '${c}' 曾在索引 ${prevPos} 出現（位於視窗 [${oldLeft}..${right}] 內）！將左界 left 直接跳至 ${prevPos} + 1 = ${left} 以消除重複。`,
          vars: { left, right, "s[right]": `'${c}'`, maxLen },
          state: makeSnap({
            right,
            warn: [prevPos, right],
            hitChar: c,
            connectors: [
              {
                from: `wb-cw-s-${right}`,
                to: `wb-dict-row-${c}`,
                label: `重複 '${c}' @ ${prevPos}`,
                color: "red"
              }
            ]
          })
        });
      }

      lastIdx.set(c, right);
      const curLen = right - left + 1;
      const isNewMax = curLen > maxLen;
      if (isNewMax) {
        maxLen = curLen;
        bestRange = [left, right];
      }

      steps.push({
        line: 10,
        tag: isNewMax ? "更新最長無重複子字串" : "記錄字元位置",
        tagType: isNewMax ? "tag-found" : "tag-insert",
        inlineBadge: `lastIdx['${c}'] = ${right}, winLen = ${curLen}, maxLen = ${maxLen}`,
        explanation: `記錄 lastIdx['${c}'] = ${right}。當前無重複視窗為 s[${left}..${right}] = "${s.slice(left, right + 1)}"（長度 ${curLen}），maxLen = ${maxLen}。`,
        vars: { left, right, "s[right]": `'${c}'`, maxLen },
        state: makeSnap({
          right,
          updatedChar: c,
          maxUpdated: isNewMax,
          connectors: [
            {
              from: `wb-cw-s-${right}`,
              to: `wb-dict-row-${c}`,
              label: `lastIdx['${c}']=${right}`,
              color: isNewMax ? "green" : "purple"
            }
          ]
        })
      });
    }

    const bestIndices = [];
    for (let k = bestRange[0]; k <= bestRange[1]; k++) bestIndices.push(k);

    steps.push({
      line: 12,
      tag: "完成並回傳 maxLen",
      tagType: "tag-found",
      inlineBadge: `return ${maxLen}`,
      explanation: `全字串掃描完畢！最長無重複字元子字串為 "${s.slice(bestRange[0], bestRange[1] + 1)}"，長度為 ${maxLen}。`,
      vars: { left, right: chars.length - 1, "s[right]": "完成", maxLen },
      state: makeSnap({
        right: chars.length - 1,
        hl: [],
        match: bestIndices,
        maxUpdated: true
      })
    });

    return steps;
  }
};

// ============================================================================
// #30 3Sum (LC #15, Medium, Array)
// ============================================================================
window.PROBLEMS["3sum"] = {
  id: 30,
  leetcodeId: 15,
  slug: "3sum",
  title: "15. 3Sum (三數之和)",
  difficulty: "Medium",
  topic: "Array",
  mins: 30,
  complexity: "Time O(N²) · Space O(1)",
  description:
    "給定整數陣列 nums，找出所有不重複且滿足 nums[i] + nums[left] + nums[right] == 0 的三元組。先將陣列升序排序，外層迴圈固定 nums[i]（跳過重複值），內層使用雙指標 left = i + 1 與 right = n - 1 向中間夾擠。",
  argNames: ["nums"],

  presets: [
    {
      name: "範例 1：標準測資 ([-1, 0, 1, 2, -1, -4])",
      args: [[-1, 0, 1, 2, -1, -4]]
    },
    {
      name: "範例 2：全零重複測資 ([0, 0, 0, 0])",
      args: [[0, 0, 0, 0]]
    },
    {
      name: "範例 3：多組對稱解 ([-2, 0, 1, 1, 2])",
      args: [[-2, 0, 1, 1, 2]]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">threeSum</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 2, code: `    <span class="tok-fn">sort</span>(nums.<span class="tok-fn">begin</span>(), nums.<span class="tok-fn">end</span>());` },
    { line: 3, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; res;` },
    { line: 4, code: `    <span class="tok-type">int</span> n = nums.<span class="tok-fn">size</span>();` },
    { line: 5, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; n - <span class="tok-num">2</span>; ++i) {` },
    { line: 6, code: `        <span class="tok-kw">if</span> (i &gt; <span class="tok-num">0</span> &amp;&amp; nums[i] == nums[i - <span class="tok-num">1</span>]) <span class="tok-kw">continue</span>;` },
    { line: 7, code: `        <span class="tok-type">int</span> L = i + <span class="tok-num">1</span>, R = n - <span class="tok-num">1</span>;` },
    { line: 8, code: `        <span class="tok-kw">while</span> (L &lt; R) {` },
    { line: 9, code: `            <span class="tok-type">int</span> sum = nums[i] + nums[L] + nums[R];` },
    { line: 10, code: `            <span class="tok-kw">if</span> (sum == <span class="tok-num">0</span>) {` },
    { line: 11, code: `                res.<span class="tok-fn">push_back</span>({nums[i], nums[L], nums[R]});` },
    { line: 12, code: `                <span class="tok-kw">while</span> (L &lt; R &amp;&amp; nums[L] == nums[L + <span class="tok-num">1</span>]) L++;` },
    { line: 13, code: `                <span class="tok-kw">while</span> (L &lt; R &amp;&amp; nums[R] == nums[R - <span class="tok-num">1</span>]) R--;` },
    { line: 14, code: `                L++; R--;` },
    { line: 15, code: `            } <span class="tok-kw">else if</span> (sum &lt; <span class="tok-num">0</span>) L++;` },
    { line: 16, code: `            <span class="tok-kw">else</span> R--;` },
    { line: 17, code: `        }` },
    { line: 18, code: `    }` },
    { line: 19, code: `    <span class="tok-kw">return</span> res;` },
    { line: 20, code: `}` }
  ],

  generateTrace(rawNums) {
    const nums = Array.isArray(rawNums) && rawNums.length >= 3
      ? rawNums.map(Number).sort((a, b) => a - b)
      : [-4, -1, -1, 0, 1, 2];
    const n = nums.length;
    const triplets = [];
    const steps = [];

    const makeSnap = (opts = {}) => {
      const { i, L, R } = opts;
      const pointers = [];
      if (i !== undefined && i < n) pointers.push({ idx: i, label: `i=${i}`, color: "purple" });
      if (L !== undefined && L < n) pointers.push({ idx: L, label: `L=${L}`, color: "blue" });
      if (R !== undefined && R < n) pointers.push({ idx: R, label: `R=${R}`, color: "red" });

      const done = [];
      if (i !== undefined) {
        for (let k = 0; k < i; k++) done.push(k);
      }

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums (已排序)",
            typeLabel: "升序陣列 + 三指標 (i, L, R)",
            x: 330,
            y: 52,
            values: nums,
            hl: opts.hl || [],
            match: opts.match || [],
            done,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "sum_vars",
            typeLabel: "三數總和算式",
            x: 24,
            y: 215,
            items: [
              {
                id: "sum",
                name: "sum = nums[i]+nums[L]+nums[R]",
                val: opts.sumFormula || "-",
                status: opts.sumStatus || ""
              }
            ]
          },
          {
            id: "res",
            type: "set",
            name: "res",
            typeLabel: `不重複三元組 (${triplets.length} 組)`,
            x: 330,
            y: 215,
            items: triplets.map((t, idx) => ({
              val: `[${t.join(", ")}]`,
              status: opts.newTriplet && idx === triplets.length - 1 ? "inserted" : ""
            }))
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 2,
      tag: "升序排序陣列",
      tagType: "default",
      inlineBadge: `nums = [${nums.join(", ")}]`,
      explanation: `先將陣列升序排序為 [${nums.join(", ")}]，以便用雙指標夾擠並輕鬆略過重複元素。`,
      vars: { i: "-", L: "-", R: "-", sum: "-", "res.size()": 0 },
      state: makeSnap({})
    });

    for (let i = 0; i < n - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) {
        steps.push({
          line: 6,
          tag: "略過重複起點 i",
          tagType: "default",
          inlineBadge: `nums[${i}] == nums[${i - 1}] (${nums[i]}) ➔ continue`,
          explanation: `nums[${i}] = ${nums[i]} 與前一個起點 nums[${i - 1}] 相同，為避免產生重複三元組直接跳過。`,
          vars: { i, L: "-", R: "-", sum: "略過重複", "res.size()": triplets.length },
          state: makeSnap({ i, hl: [i] })
        });
        continue;
      }

      let L = i + 1;
      let R = n - 1;

      while (L < R) {
        const sum = nums[i] + nums[L] + nums[R];
        const formula = `(${nums[i]}) + (${nums[L]}) + (${nums[R]}) = ${sum}`;

        if (sum === 0) {
          triplets.push([nums[i], nums[L], nums[R]]);
          steps.push({
            line: 11,
            tag: "命中三數之和為 0！",
            tagType: "tag-found",
            inlineBadge: `找到 [${nums[i]}, ${nums[L]}, ${nums[R]}]`,
            explanation: `sum = ${formula} 恰好為 0！將三元組 [${nums[i]}, ${nums[L]}, ${nums[R]}] 寫入結果陣列 res，並同時內縮 L 與 R（跳過重複值）。`,
            vars: { i, L, R, sum: 0, "res.size()": triplets.length },
            state: makeSnap({
              i,
              L,
              R,
              match: [i, L, R],
              sumFormula: formula,
              sumStatus: "match",
              newTriplet: true,
              connectors: [
                {
                  from: `wb-cw-nums-${L}`,
                  to: `wb-chip-res-${triplets.length - 1}`,
                  label: `命中 [${nums[i]},${nums[L]},${nums[R]}]`,
                  color: "green"
                }
              ]
            })
          });

          while (L < R && nums[L] === nums[L + 1]) L++;
          while (L < R && nums[R] === nums[R - 1]) R--;
          L++;
          R--;
        } else if (sum < 0) {
          steps.push({
            line: 15,
            tag: "總和偏小，左指標右移",
            tagType: "tag-check",
            inlineBadge: `sum = ${sum} < 0 ➔ L++`,
            explanation: `sum = ${formula} < 0，總和太小，將左指標 L 從 ${L} 右移至 ${L + 1} 以增大總和。`,
            vars: { i, L, R, sum, "res.size()": triplets.length },
            state: makeSnap({
              i,
              L,
              R,
              hl: [i, L, R],
              sumFormula: formula,
              sumStatus: "hl",
              connectors: [
                { from: `wb-cw-nums-${L}`, to: "wb-var-sum", label: `sum=${sum} < 0`, color: "blue" }
              ]
            })
          });
          L++;
        } else {
          steps.push({
            line: 16,
            tag: "總和偏大，右指標左移",
            tagType: "tag-check",
            inlineBadge: `sum = ${sum} > 0 ➔ R--`,
            explanation: `sum = ${formula} > 0，總和太大，將右指標 R 從 ${R} 左移至 ${R - 1} 以減小總和。`,
            vars: { i, L, R, sum, "res.size()": triplets.length },
            state: makeSnap({
              i,
              L,
              R,
              hl: [i, L, R],
              sumFormula: formula,
              sumStatus: "hl",
              connectors: [
                { from: `wb-cw-nums-${R}`, to: "wb-var-sum", label: `sum=${sum} > 0`, color: "red" }
              ]
            })
          });
          R--;
        }
      }
    }

    steps.push({
      line: 19,
      tag: "完成並回傳所有三元組",
      tagType: "tag-found",
      inlineBadge: `共找到 ${triplets.length} 組解`,
      explanation: `搜尋結束，共找到 ${triplets.length} 組不重複三元組。`,
      vars: { i: "完成", L: "-", R: "-", sum: "-", "res.size()": triplets.length },
      state: makeSnap({
        sumFormula: `共 ${triplets.length} 組三元組`,
        sumStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #31 Binary Tree Level Order Traversal (LC #102, Medium, Binary Tree)
// ============================================================================
window.PROBLEMS["binary-tree-level-order-traversal"] = {
  id: 31,
  leetcodeId: 102,
  slug: "binary-tree-level-order-traversal",
  title: "102. Binary Tree Level Order Traversal (二元樹的層序走訪)",
  difficulty: "Medium",
  topic: "Binary Tree",
  mins: 20,
  complexity: "Time O(N) · Space O(N)",
  description:
    "給定二元樹的根節點 root，請依「由上而下、由左至右」的順序，逐層回傳各層節點值的二維陣列。利用 C++ `queue<TreeNode*> q` 進行 BFS：每一輪先記錄當前層的節點數量 `int sz = q.size()`，再迴圈取出該層所有節點並將其左右子節點推入佇列。",
  argNames: ["tree"],

  presets: [
    {
      name: "範例 1：標準二元樹 ([3, 9, 20, null, null, 15, 7])",
      args: [[3, 9, 20, null, null, 15, 7]]
    },
    {
      name: "範例 2：完整滿二元樹 ([1, 2, 3, 4, 5, 6, 7])",
      args: [[1, 2, 3, 4, 5, 6, 7]]
    },
    {
      name: "範例 3：偏斜二元樹 ([1, 2, null, 3])",
      args: [[1, 2, null, 3]]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">levelOrder</span>(<span class="tok-type">TreeNode</span>* root) {` },
    { line: 2, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; res;` },
    { line: 3, code: `    <span class="tok-kw">if</span> (!root) <span class="tok-kw">return</span> res;` },
    { line: 4, code: `    <span class="tok-type">queue</span>&lt;<span class="tok-type">TreeNode</span>*&gt; q;` },
    { line: 5, code: `    q.<span class="tok-fn">push</span>(root);` },
    { line: 6, code: `    <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {` },
    { line: 7, code: `        <span class="tok-type">int</span> sz = q.<span class="tok-fn">size</span>();` },
    { line: 8, code: `        <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; level;` },
    { line: 9, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; sz; ++i) {` },
    { line: 10, code: `            <span class="tok-type">TreeNode</span>* curr = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();` },
    { line: 11, code: `            level.<span class="tok-fn">push_back</span>(curr-&gt;val);` },
    { line: 12, code: `            <span class="tok-kw">if</span> (curr-&gt;left)  q.<span class="tok-fn">push</span>(curr-&gt;left);` },
    { line: 13, code: `            <span class="tok-kw">if</span> (curr-&gt;right) q.<span class="tok-fn">push</span>(curr-&gt;right);` },
    { line: 14, code: `        }` },
    { line: 15, code: `        res.<span class="tok-fn">push_back</span>(level);` },
    { line: 16, code: `    }` },
    { line: 17, code: `    <span class="tok-kw">return</span> res;` },
    { line: 18, code: `}` }
  ],

  generateTrace(rawArr) {
    const arr = Array.isArray(rawArr) && rawArr.length > 0 ? rawArr : [3, 9, 20, null, null, 15, 7];

    // Build tree nodes with coordinates
    const coords = [
      { x: 310, y: 42, depth: 0 },
      { x: 170, y: 116, depth: 1 },
      { x: 450, y: 116, depth: 1 },
      { x: 100, y: 190, depth: 2 },
      { x: 240, y: 190, depth: 2 },
      { x: 380, y: 190, depth: 2 },
      { x: 520, y: 190, depth: 2 }
    ];

    const nodes = [];
    const edges = [];
    for (let i = 0; i < Math.min(arr.length, 7); i++) {
      if (arr[i] === null || arr[i] === undefined) continue;
      const pos = coords[i];
      nodes.push({
        idx: i,
        id: `n${i}`,
        val: String(arr[i]),
        depth: pos.depth,
        x: pos.x,
        y: pos.y
      });
      if (i > 0) {
        const p = Math.floor((i - 1) / 2);
        edges.push({
          from: `n${p}`,
          to: `n${i}`,
          label: i % 2 === 1 ? "L" : "R",
          dir: true
        });
      }
    }

    const q = [];
    const visited = new Set();
    const levels = [];
    const steps = [];

    const makeSnap = (opts = {}) => {
      const treeNodes = nodes.map((n) => ({
        id: n.id,
        val: n.val,
        sub: `Lv.${n.depth}`,
        x: n.x,
        y: n.y,
        ptr: opts.currId === n.id ? "curr" : "",
        status:
          opts.currId === n.id
            ? "hl"
            : opts.matchAll || visited.has(n.id)
            ? "match"
            : ""
      }));

      const dictRows = levels.map((lv, idx) => ({
        id: `lv${idx}`,
        key: `Level ${idx}`,
        val: `[${lv.join(", ")}]`,
        note: idx === levels.length - 1 && opts.activeLv ? "＋ 收集本層" : "已完成",
        status: idx === levels.length - 1 && opts.activeLv ? "inserted" : "hit"
      }));

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元樹結構 (TreeNode*)",
            x: 325,
            y: 48,
            width: 620,
            height: 270,
            nodes: treeNodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "bfs_vars",
            typeLabel: "層序控制變數",
            x: 24,
            y: 215,
            items: [
              { id: "lv", name: "當前層數", val: opts.lv !== undefined ? `Level ${opts.lv}` : "-", status: "hl" },
              { id: "sz", name: "本層節點數 sz", val: opts.sz !== undefined ? String(opts.sz) : "-", status: "" }
            ]
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "BFS 佇列 (queue<TreeNode*>)",
            x: 330,
            y: 270,
            leftLabel: "front ←",
            rightLabel: "← back",
            items: q.map((nid, idx) => {
              const nd = nodes.find((x) => x.id === nid);
              return {
                val: nd ? nd.val : nid,
                status: idx === 0 ? "hl" : ""
              };
            })
          },
          {
            id: "res",
            type: "dict",
            name: "res",
            typeLabel: "各層輸出結果 (vector<vector<int>>)",
            x: 590,
            y: 270,
            headers: ["層級", "節點值 level", "狀態"],
            rows: dictRows
          }
        ],
        connectors: opts.connectors || []
      };
    };

    if (nodes.length > 0) {
      q.push("n0");
    }

    steps.push({
      line: 5,
      tag: "根節點入列",
      tagType: "tag-insert",
      inlineBadge: `q.push(root = ${nodes[0]?.val})`,
      explanation: `將根節點 ${nodes[0]?.val} 推入 BFS 佇列 q，準備開始逐層走訪。`,
      vars: { level: 0, sz: 1, curr: "-", "q.size()": q.length },
      state: makeSnap({ lv: 0, sz: 1 })
    });

    let lvIdx = 0;
    while (q.length > 0) {
      const sz = q.length;
      levels.push([]);

      steps.push({
        line: 7,
        tag: `開始第 ${lvIdx} 層走訪`,
        tagType: "tag-check",
        inlineBadge: `sz = q.size() = ${sz}`,
        explanation: `進入第 ${lvIdx} 層，鎖定當前佇列長度 sz = ${sz}，代表本層共有 ${sz} 個節點需要處理。`,
        vars: { level: lvIdx, sz, curr: "-", "q.size()": q.length },
        state: makeSnap({ lv: lvIdx, sz, activeLv: true })
      });

      for (let i = 0; i < sz; i++) {
        const cid = q.shift();
        const cNode = nodes.find((x) => x.id === cid);
        visited.add(cid);
        levels[lvIdx].push(Number(cNode.val));

        const leftIdx = cNode.idx * 2 + 1;
        const rightIdx = cNode.idx * 2 + 2;
        const leftNode = nodes.find((x) => x.idx === leftIdx);
        const rightNode = nodes.find((x) => x.idx === rightIdx);

        const pushed = [];
        if (leftNode) {
          q.push(leftNode.id);
          pushed.push(leftNode.val);
        }
        if (rightNode) {
          q.push(rightNode.id);
          pushed.push(rightNode.val);
        }

        steps.push({
          line: 11,
          tag: `處理節點 ${cNode.val}`,
          tagType: "tag-found",
          inlineBadge: `level.push_back(${cNode.val})${pushed.length ? `, 子節點 [${pushed.join(",")}] 入列` : ""}`,
          explanation: `從佇列取出 curr = ${cNode.val} 加入 Level ${lvIdx}。${
            pushed.length ? `將其子節點 ${pushed.join(", ")} 推入佇列尾端供下一層處理。` : "該節點無子節點。"
          }`,
          vars: { level: lvIdx, sz, curr: cNode.val, "q.size()": q.length },
          state: makeSnap({
            lv: lvIdx,
            sz,
            currId: cid,
            activeLv: true,
            connectors: [
              {
                from: `wb-node-tree-${cid}`,
                to: `wb-dict-row-lv${lvIdx}`,
                label: `寫入 Level ${lvIdx}`,
                color: "green"
              }
            ]
          })
        });
      }

      lvIdx++;
    }

    steps.push({
      line: 17,
      tag: "層序走訪完成",
      tagType: "tag-found",
      inlineBadge: `return [${levels.map((l) => `[${l.join(",")}]`).join(", ")}]`,
      explanation: `BFS 佇列已空，共完成 ${levels.length} 層走訪並回傳結果。`,
      vars: { level: "完成", sz: 0, curr: "-", "q.size()": 0 },
      state: makeSnap({ matchAll: true })
    });

    return steps;
  }
};

// ============================================================================
// #32 Clone Graph (LC #133, Medium, Graph)
// ============================================================================
window.PROBLEMS["clone-graph"] = {
  id: 32,
  leetcodeId: 133,
  slug: "clone-graph",
  title: "133. Clone Graph (複製圖)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 25,
  complexity: "Time O(V + E) · Space O(V)",
  description:
    "給定無向連通圖中某個節點的參照 node，請回傳該圖的深拷貝 (Deep Copy)。由於無向圖含有迴圈，必須使用雜湊表 `unordered_map<Node*, Node*> cloned` 記錄「原節點 ➔ 複製節點」的對應關係，避免重複建立節點或陷入無限迴圈。",
  argNames: ["adjList"],

  presets: [
    {
      name: "範例 1：標準 4 節點方形圖 ([[2,4],[1,3],[2,4],[1,3]])",
      args: [
        [
          [2, 4],
          [1, 3],
          [2, 4],
          [1, 3]
        ]
      ]
    },
    {
      name: "範例 2：3 節點三角形全連通圖 ([[2,3],[1,3],[1,2]])",
      args: [
        [
          [2, 3],
          [1, 3],
          [1, 2]
        ]
      ]
    },
    {
      name: "範例 3：雙節點邊 ([[2],[1]])",
      args: [[[2], [1]]]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">Node</span>* <span class="tok-fn">cloneGraph</span>(<span class="tok-type">Node</span>* node) {` },
    { line: 2, code: `    <span class="tok-kw">if</span> (!node) <span class="tok-kw">return</span> <span class="tok-kw">nullptr</span>;` },
    { line: 3, code: `    <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">Node</span>*, <span class="tok-type">Node</span>*&gt; cloned;` },
    { line: 4, code: `    <span class="tok-type">queue</span>&lt;<span class="tok-type">Node</span>*&gt; q;` },
    { line: 5, code: `    cloned[node] = <span class="tok-kw">new</span> <span class="tok-fn">Node</span>(node-&gt;val);` },
    { line: 6, code: `    q.<span class="tok-fn">push</span>(node);` },
    { line: 7, code: `    <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {` },
    { line: 8, code: `        <span class="tok-type">Node</span>* curr = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();` },
    { line: 9, code: `        <span class="tok-kw">for</span> (<span class="tok-type">Node</span>* nei : curr-&gt;neighbors) {` },
    { line: 10, code: `            <span class="tok-kw">if</span> (!cloned.<span class="tok-fn">count</span>(nei)) {` },
    { line: 11, code: `                cloned[nei] = <span class="tok-kw">new</span> <span class="tok-fn">Node</span>(nei-&gt;val);` },
    { line: 12, code: `                q.<span class="tok-fn">push</span>(nei);` },
    { line: 13, code: `            }` },
    { line: 14, code: `            cloned[curr]-&gt;neighbors.<span class="tok-fn">push_back</span>(cloned[nei]);` },
    { line: 15, code: `        }` },
    { line: 16, code: `    }` },
    { line: 17, code: `    <span class="tok-kw">return</span> cloned[node];` },
    { line: 18, code: `}` }
  ],

  generateTrace(rawAdj) {
    const adj = Array.isArray(rawAdj) && rawAdj.length > 0
      ? rawAdj
      : [
          [2, 4],
          [1, 3],
          [2, 4],
          [1, 3]
        ];
    const vCount = adj.length;

    const layoutPos = [
      { x: 105, y: 48 },
      { x: 295, y: 48 },
      { x: 295, y: 158 },
      { x: 105, y: 158 }
    ];

    const graphNodes = Array.from({ length: vCount }, (_, idx) => {
      const idNum = idx + 1;
      const pos = layoutPos[idx] || {
        x: 200 + Math.round(90 * Math.cos((2 * Math.PI * idx) / vCount)),
        y: 105 + Math.round(70 * Math.sin((2 * Math.PI * idx) / vCount))
      };
      return { id: String(idNum), num: idNum, x: pos.x, y: pos.y };
    });

    const baseEdges = [];
    const seenPairs = new Set();
    adj.forEach((neis, idx) => {
      const u = idx + 1;
      (neis || []).forEach((v) => {
        const key = u < v ? `${u}-${v}` : `${v}-${u}`;
        if (!seenPairs.has(key)) {
          seenPairs.add(key);
          baseEdges.push({ from: String(u), to: String(v), dir: false });
        }
      });
    });

    const cloned = new Map(); // idNum -> array of cloned neighbor labels
    const q = [];
    const steps = [];

    const makeSnap = (opts = {}) => {
      const nodes = graphNodes.map((gn) => ({
        id: gn.id,
        val: String(gn.num),
        sub: cloned.has(gn.num) ? `已複製 ${gn.num}'` : "未複製",
        x: gn.x,
        y: gn.y,
        ptr: opts.curr === gn.num ? "curr" : opts.nei === gn.num ? "nei" : "",
        status:
          opts.curr === gn.num
            ? "hl"
            : cloned.has(gn.num)
            ? "match"
            : ""
      }));

      const edges = baseEdges.map((e) => {
        const isActive =
          (String(opts.curr) === e.from && String(opts.nei) === e.to) ||
          (String(opts.curr) === e.to && String(opts.nei) === e.from);
        return {
          ...e,
          status: isActive ? "hl" : opts.doneAll ? "match" : ""
        };
      });

      const rows = Array.from(cloned.entries()).map(([k, neiList]) => ({
        id: String(k),
        key: `Node(${k})`,
        val: `Node(${k}')`,
        note: `neighbors: [${neiList.map((x) => `${x}'`).join(", ")}]`,
        status: opts.justCloned === k ? "inserted" : opts.curr === k ? "hit" : ""
      }));

      return {
        boards: [
          {
            id: "g",
            type: "graph",
            shape: "graph",
            name: "graph",
            typeLabel: `原圖與複製狀態 (${vCount} 節點)`,
            x: 330,
            y: 48,
            width: 410,
            height: 205,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "clone_vars",
            typeLabel: "BFS 佇列與當前節點",
            x: 24,
            y: 215,
            items: [
              { id: "curr", name: "curr", val: opts.curr ? `Node(${opts.curr})` : "-", status: opts.curr ? "hl" : "" },
              { id: "q", name: "queue q", val: `[${q.join(", ")}]`, status: "" }
            ]
          },
          {
            id: "cloned",
            type: "dict",
            name: "cloned",
            typeLabel: "拷貝映射表 (unordered_map<Node*, Node*>)",
            x: 330,
            y: 270,
            headers: ["原節點", "新節點", "新節點鄰居串列"],
            rows
          }
        ],
        connectors: opts.connectors || []
      };
    };

    cloned.set(1, []);
    q.push(1);

    steps.push({
      line: 6,
      tag: "建立起點拷貝並入列",
      tagType: "tag-insert",
      inlineBadge: `cloned[1] = new Node(1'), q.push(1)`,
      explanation: `建立起點 Node(1) 的深拷貝 Node(1') 存入雜湊表 cloned，並將 Node(1) 推入 BFS 佇列 q。`,
      vars: { curr: "-", nei: "-", "cloned.size()": 1, "q.size()": 1 },
      state: makeSnap({
        justCloned: 1,
        connectors: [
          { from: "wb-node-g-1", to: "wb-dict-row-1", label: "new Node(1')", color: "purple" }
        ]
      })
    });

    while (q.length > 0) {
      const curr = q.shift();
      const neighbors = adj[curr - 1] || [];

      for (const nei of neighbors) {
        const isNew = !cloned.has(nei);
        if (isNew) {
          cloned.set(nei, []);
          q.push(nei);
        }
        cloned.get(curr).push(nei);

        steps.push({
          line: 14,
          tag: isNew ? `建立鄰居 ${nei}' 並連結` : `命中已複製鄰居 ${nei}' 並連結`,
          tagType: isNew ? "tag-insert" : "tag-found",
          inlineBadge: `${isNew ? `new Node(${nei}'), ` : ""}cloned[${curr}]->neighbors.push_back(${nei}')`,
          explanation: isNew
            ? `鄰居 Node(${nei}) 尚未在 cloned 中：先建立新節點 Node(${nei}') 並推入佇列 q，再將 ${nei}' 加入 ${curr}' 的鄰居串列。`
            : `鄰居 Node(${nei}) 已存在於 cloned 中！直接重用 cloned[${nei}] = Node(${nei}') 加入 ${curr}' 的鄰居串列，避免無限迴圈。`,
          vars: { curr, nei, "cloned.size()": cloned.size, "q.size()": q.length },
          state: makeSnap({
            curr,
            nei,
            justCloned: isNew ? nei : null,
            connectors: [
              {
                from: `wb-node-g-${nei}`,
                to: `wb-dict-row-${curr}`,
                label: `連向 ${nei}'`,
                color: isNew ? "purple" : "green"
              }
            ]
          })
        });
      }
    }

    steps.push({
      line: 17,
      tag: "深拷貝完成並回傳",
      tagType: "tag-found",
      inlineBadge: `return cloned[node] (Node 1')`,
      explanation: `所有節點與無向邊皆已完成深拷貝，回傳複製圖的起點 cloned[node] (Node 1')。`,
      vars: { curr: "完成", nei: "-", "cloned.size()": cloned.size, "q.size()": 0 },
      state: makeSnap({ doneAll: true })
    });

    return steps;
  }
};

// ============================================================================
// #33 Evaluate Reverse Polish Notation (LC #150, Medium, Stack)
// ============================================================================
window.PROBLEMS["evaluate-reverse-polish-notation"] = {
  id: 33,
  leetcodeId: 150,
  slug: "evaluate-reverse-polish-notation",
  title: "150. Evaluate Reverse Polish Notation (逆波蘭表示法求值)",
  difficulty: "Medium",
  topic: "Stack",
  mins: 30,
  complexity: "Time O(N) · Space O(N)",
  description:
    "給定一個逆波蘭表示法（後序運算式 Postfix Notation）的字串陣列 tokens，計算並回傳其整數算式結果（整數除法向零截斷）。使用 C++ `stack<int> st`：遇到數字直接推入堆疊；遇到運算子 `+`, `-`, `*`, `/` 時，依序彈出右運算元 b 與左運算元 a，計算 `a op b` 後推回堆疊。",
  argNames: ["tokens"],

  presets: [
    {
      name: "範例 1：基本加乘 ([\"2\",\"1\",\"+\",\"3\",\"*\"] ➔ 9)",
      args: [["2", "1", "+", "3", "*"]]
    },
    {
      name: "範例 2：含整數除法 ([\"4\",\"13\",\"5\",\"/\",\"+\"] ➔ 6)",
      args: [["4", "13", "5", "/", "+"]]
    },
    {
      name: "範例 3：進階減法與乘法 ([\"10\",\"6\",\"-\",\"3\",\"*\",\"2\",\"/\"] ➔ 6)",
      args: [["10", "6", "-", "3", "*", "2", "/"]]
    }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">evalRPN</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&amp; tokens) {` },
    { line: 2, code: `    <span class="tok-type">stack</span>&lt;<span class="tok-type">int</span>&gt; st;` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-kw">const</span> <span class="tok-type">string</span>&amp; tok : tokens) {` },
    { line: 4, code: `        <span class="tok-kw">if</span> (tok == <span class="tok-num">"+"</span> || tok == <span class="tok-num">"-"</span> || tok == <span class="tok-num">"*"</span> || tok == <span class="tok-num">"/"</span>) {` },
    { line: 5, code: `            <span class="tok-type">int</span> b = st.<span class="tok-fn">top</span>(); st.<span class="tok-fn">pop</span>(); <span class="tok-cmt">// 先彈出右運算元 b</span>` },
    { line: 6, code: `            <span class="tok-type">int</span> a = st.<span class="tok-fn">top</span>(); st.<span class="tok-fn">pop</span>(); <span class="tok-cmt">// 再彈出左運算元 a</span>` },
    { line: 7, code: `            <span class="tok-kw">if</span> (tok == <span class="tok-num">"+"</span>) st.<span class="tok-fn">push</span>(a + b);` },
    { line: 8, code: `            <span class="tok-kw">else if</span> (tok == <span class="tok-num">"-"</span>) st.<span class="tok-fn">push</span>(a - b);` },
    { line: 9, code: `            <span class="tok-kw">else if</span> (tok == <span class="tok-num">"*"</span>) st.<span class="tok-fn">push</span>(a * b);` },
    { line: 10, code: `            <span class="tok-kw">else</span> st.<span class="tok-fn">push</span>(a / b);` },
    { line: 11, code: `        } <span class="tok-kw">else</span> {` },
    { line: 12, code: `            st.<span class="tok-fn">push</span>(<span class="tok-fn">stoi</span>(tok));` },
    { line: 13, code: `        }` },
    { line: 14, code: `    }` },
    { line: 15, code: `    <span class="tok-kw">return</span> st.<span class="tok-fn">top</span>();` },
    { line: 16, code: `}` }
  ],

  generateTrace(rawTokens) {
    const tokens = Array.isArray(rawTokens) && rawTokens.length > 0
      ? rawTokens.map(String)
      : ["2", "1", "+", "3", "*"];
    const st = [];
    const steps = [];
    const ops = new Set(["+", "-", "*", "/"]);

    const makeSnap = (opts = {}) => {
      const done = [];
      if (opts.idx !== undefined) {
        for (let k = 0; k < opts.idx; k++) done.push(k);
      }
      return {
        boards: [
          {
            id: "tokens",
            type: "array",
            name: "tokens",
            typeLabel: "逆波蘭運算式陣列 (vector<string>)",
            x: 330,
            y: 52,
            values: tokens.map((t) => `"${t}"`),
            hl: opts.hl || [],
            match: opts.match || [],
            done,
            pointers:
              opts.idx !== undefined && opts.idx < tokens.length
                ? [{ idx: opts.idx, label: `i = ${opts.idx}`, color: opts.isOp ? "purple" : "blue" }]
                : []
          },
          {
            id: "vars",
            type: "vars",
            name: "rpn_vars",
            typeLabel: "二元運算暫存",
            x: 24,
            y: 215,
            items: [
              { id: "tok", name: "tok", val: opts.tok || "-", status: opts.tok ? "hl" : "" },
              { id: "expr", name: "a op b", val: opts.expr || "-", status: opts.exprStatus || "" }
            ]
          },
          {
            id: "st",
            type: "stack",
            name: "st",
            typeLabel: "運算元堆疊 (stack<int>)",
            x: 330,
            y: 215,
            items: st.map((v, idx) => ({
              val: v,
              status: idx === st.length - 1 ? (opts.topMatch ? "match" : "hl") : ""
            }))
          }
        ],
        connectors: opts.connectors || []
      };
    };

    steps.push({
      line: 2,
      tag: "初始化運算元堆疊",
      tagType: "default",
      inlineBadge: `st = empty`,
      explanation: `建立空堆疊 st，準備由左至右掃描 ${tokens.length} 個後序運算式 token。`,
      vars: { tok: "-", "a op b": "-", "st.top()": "empty", "st.size()": 0 },
      state: makeSnap({})
    });

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (ops.has(tok)) {
        const b = st.pop();
        const a = st.pop();
        let res = 0;
        let opLine = 7;
        if (tok === "+") {
          res = a + b;
          opLine = 7;
        } else if (tok === "-") {
          res = a - b;
          opLine = 8;
        } else if (tok === "*") {
          res = a * b;
          opLine = 9;
        } else {
          res = Math.trunc(a / b);
          opLine = 10;
        }
        st.push(res);
        const expr = `${a} ${tok} ${b} = ${res}`;

        steps.push({
          line: opLine,
          tag: `執行運算 ${tok}`,
          tagType: "tag-found",
          inlineBadge: `pop b=${b}, pop a=${a} ➔ push(${expr})`,
          explanation: `遇到運算子 "${tok}"：先從堆疊彈出右運算元 b = ${b}，再彈出左運算元 a = ${a}，計算 ${expr} 後將結果 ${res} 推回堆疊頂端。`,
          vars: { tok: `"${tok}"`, "a op b": expr, "st.top()": res, "st.size()": st.length },
          state: makeSnap({
            idx: i,
            hl: [i],
            isOp: true,
            tok: `"${tok}" (運算子)`,
            expr,
            exprStatus: "match",
            topMatch: true,
            connectors: [
              {
                from: `wb-cw-tokens-${i}`,
                to: `wb-stack-st-${st.length - 1}`,
                label: expr,
                color: "green"
              }
            ]
          })
        });
      } else {
        const num = Number(tok);
        st.push(num);
        steps.push({
          line: 12,
          tag: "推入運算元數字",
          tagType: "tag-insert",
          inlineBadge: `st.push(${num})`,
          explanation: `token "${tok}" 為數字，轉為整數 ${num} 後直接推入堆疊 st 頂端。`,
          vars: { tok: `"${tok}"`, "a op b": "-", "st.top()": num, "st.size()": st.length },
          state: makeSnap({
            idx: i,
            hl: [i],
            tok: `"${tok}"`,
            connectors: [
              {
                from: `wb-cw-tokens-${i}`,
                to: `wb-stack-st-${st.length - 1}`,
                label: `push(${num})`,
                color: "purple"
              }
            ]
          })
        });
      }
    }

    const finalAns = st.length ? st[st.length - 1] : 0;
    steps.push({
      line: 15,
      tag: "回傳堆疊頂端最終結果",
      tagType: "tag-found",
      inlineBadge: `return st.top() = ${finalAns}`,
      explanation: `所有 token 處理完畢，堆疊唯一剩餘元素 st.top() = ${finalAns} 即為逆波蘭表示法的計算結果！`,
      vars: { tok: "完成", "a op b": `最終結果 = ${finalAns}`, "st.top()": finalAns, "st.size()": st.length },
      state: makeSnap({
        idx: tokens.length,
        expr: `return ${finalAns}`,
        exprStatus: "match",
        topMatch: true
      })
    });

    return steps;
  }
};

/**
 * Grind 75 延伸題 — Problems #148 to #159
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ==========================================================================
  // 共用輔助函式（僅限本檔 IIFE 內使用）
  // ==========================================================================
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

  const CPP_KW = new Set([
    "class", "public", "private", "return", "if", "else", "for", "while", "const", "auto", "int", "bool",
    "void", "new", "nullptr", "break", "true", "false", "struct", "unsigned", "char"
  ]);
  const CPP_TYPE = new Set([
    "Solution", "Codec", "TreeNode", "ListNode", "string", "vector", "deque", "queue", "stack",
    "unordered_map", "unordered_set", "uint32_t", "size_t", "pair"
  ]);

  // 將純文字 C++ 原始碼轉為 tok-* 上色的 HTML（自動轉義 < > &）。
  function cppHighlight(src) {
    const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([A-Za-z_]\w*)|(\d+(?:e\d+)?)|([\s\S])/g;
    let out = "";
    let m;
    while ((m = re.exec(src))) {
      if (m[1]) out += `<span class="tok-cmt">${esc(m[1])}</span>`;
      else if (m[2]) out += esc(m[2]);
      else if (m[3]) {
        const w = m[3];
        if (CPP_KW.has(w)) out += `<span class="tok-kw">${w}</span>`;
        else if (CPP_TYPE.has(w)) out += `<span class="tok-type">${w}</span>`;
        else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += `<span class="tok-fn">${w}</span>`;
        else out += w;
      } else if (m[4]) out += `<span class="tok-num">${m[4]}</span>`;
      else out += esc(m[5]);
    }
    return out;
  }
  const cppLines = (arr) => arr.map((src, i) => ({ line: i + 1, code: cppHighlight(src) }));

  // 變數盒項目：名稱與值會自動轉義。
  const V = (id, name, val, status = "") => ({ id, name: esc(name), val: esc(String(val)), status });
  const varsBoard = (items, typeLabel = "關鍵變數與回傳值", y = 215) => ({
    id: "vars", type: "vars", name: "state_vars", typeLabel, x: 24, y, items
  });
  const mkStep = (line, tag, tagType, inlineBadge, explanation, vars, boards, connectors = []) => ({
    line, tag, tagType, inlineBadge, explanation, vars,
    state: { boards, connectors: connectors.map((c) => Object.assign({}, c, { label: esc(c.label) })) }
  });
  const fmtList = (arr) => `[${arr.join(",")}]`;

  // 將 buildTreeFromLevelOrder 的結果序列化回 level-order（去尾端 null）。
  function serializeTree(root) {
    const out = [];
    const q = [root];
    while (q.length) {
      const n = q.shift();
      if (!n) { out.push("null"); continue; }
      out.push(String(n.val));
      q.push(n.left, n.right);
    }
    while (out.length && out[out.length - 1] === "null") out.pop();
    return `[${out.join(",")}]`;
  }

  // ==========================================================================
  // #148 Encode and Decode Strings (LC #271, Medium)
  // ==========================================================================
  window.PROBLEMS["encode-and-decode-strings"] = {
    id: 148,
    leetcodeId: 271,
    slug: "encode-and-decode-strings",
    title: "271. Encode and Decode Strings (字串的編碼與解碼)",
    difficulty: "Medium",
    topic: "String / Design",
    mins: 25,
    complexity: "Time O(total length) · Space O(total length)",
    argNames: ["operations", "values"],
    description:
      "設計 Codec 類別，把字串清單 vector<string> 編碼成單一字串，再於另一端還原成完全相同的清單。字串內容可能包含任意字元（包括 # 或空字串），因此不能單純用分隔符號。採用「長度前綴」編碼：每個字串寫成 長度 + '#' + 內容；解碼時先往後找第一個 '#' 讀出長度 len，再直接擷取接下來的 len 個字元，內容中的 # 不會造成誤判。編碼與解碼皆為 O(總長度)。",

    presets: [
      {
        name: "範例 1：strs = [\"lint\",\"code\",\"love\",\"you\"]",
        args: [["encode", "decode"], [[["lint", "code", "love", "you"]], ["4#lint4#code4#love3#you"]]]
      },
      {
        name: "範例 2：內容含 # 與空字串 strs = [\"a#b\",\"\",\"12\"]",
        args: [["encode", "decode"], [[["a#b", "", "12"]], ["3#a#b0#2#12"]]]
      },
      {
        name: "範例 3：空清單 strs = []",
        args: [["encode", "decode"], [[[]], [""]]]
      },
      {
        name: "範例 4：單一字串 strs = [\"we\",\"say\",\":\"]",
        args: [["encode", "decode"], [[["we", "say", ":"]], ["2#we3#say1#:"]]]
      }
    ],

    cppLines: cppLines([
      "class Codec {",
      "public:",
      "    string encode(vector<string>& strs) {",
      "        string out;",
      "        for (const string& s : strs) {",
      "            out += to_string(s.size()) + \"#\" + s;",
      "        }",
      "        return out;",
      "    }",
      "    vector<string> decode(string s) {",
      "        vector<string> res;",
      "        int i = 0;",
      "        while (i < (int)s.size()) {",
      "            int j = s.find('#', i);",
      "            int len = stoi(s.substr(i, j - i));",
      "            res.push_back(s.substr(j + 1, len));",
      "            i = j + 1 + len;",
      "        }",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(operations, values) {
      const ops = clone(operations);
      const vals = clone(values);
      const steps = [];
      const calls = []; // { op, ret }
      const quote = (s) => `"${s}"`;

      const callsBoard = (y) => ({
        id: "calls", type: "dict", name: "calls", typeLabel: "呼叫紀錄與回傳值",
        x: 325, y, headers: ["呼叫", "回傳值", "狀態"],
        rows: calls.map((c, idx) => ({ id: `call-${idx}`, key: esc(c.op), val: esc(c.ret), note: "已完成", status: idx === calls.length - 1 ? "hit" : "" }))
      });

      for (let o = 0; o < ops.length; o++) {
        const op = ops[o];
        if (op === "encode") {
          const strs = clone(vals[o][0] || []);
          let out = "";
          const snap = (opt) => {
            const chars = out.split("");
            const boards = [
              varsBoard([
                V("op", "呼叫", `encode (#${o + 1})`),
                V("s", "s", opt.s !== undefined ? quote(opt.s) : "-", opt.s !== undefined ? "hl" : ""),
                V("piece", "附加片段", opt.piece || "-", opt.piece ? "hl" : ""),
                V("out", "out", quote(out), opt.ret ? "" : "hl"),
                V("ret", "return", opt.ret ? quote(out) : "-", opt.ret ? "match" : "")
              ], "編碼端變數"),
              {
                id: "strs", type: "array", name: "strs", typeLabel: "輸入清單 (vector&lt;string&gt;)",
                x: 325, y: 52, values: strs.map((t) => esc(quote(t))),
                hl: opt.idx !== undefined ? [opt.idx] : [],
                done: opt.idx !== undefined ? strs.map((_, k) => k).filter((k) => k < opt.idx) : opt.ret ? strs.map((_, k) => k) : [],
                pointers: opt.idx !== undefined ? [{ idx: opt.idx, label: "s", color: "blue" }] : []
              },
              {
                id: "enc", type: "array", name: "out", typeLabel: "編碼字串 (string，逐字元)",
                x: 325, y: 175, values: chars.map((c) => esc(c)),
                hl: opt.newFrom !== undefined ? chars.map((_, k) => k).filter((k) => k >= opt.newFrom) : [],
                match: opt.ret ? chars.map((_, k) => k) : []
              }
            ];
            if (calls.length) boards.push(callsBoard(300));
            return boards;
          };

          steps.push(mkStep(4, "建立輸出字串", "default", "out = \"\"",
            `呼叫 encode：準備把 ${strs.length} 個字串串接成一個字串。先建立空字串 out。`,
            { op: "encode", out: "\"\"", return: "-" }, snap({})));

          strs.forEach((s, idx) => {
            const piece = `${s.length}#${s}`;
            const from = out.length;
            out += piece;
            steps.push(mkStep(6, "附加長度前綴", "tag-insert", `out += "${s.length}" + "#" + "${s}"`,
              `第 ${idx} 個字串 "${s}" 長度為 ${s.length}，寫入「${s.length}#」再接上原內容，得到片段 "${piece}"。即使內容含 # 或為空字串，解碼時也能靠長度精準切出。`,
              { op: "encode", s: quote(s), out: quote(out), return: "-" },
              snap({ idx, s, piece: quote(piece), newFrom: from }),
              [{ from: `wb-cw-strs-${idx}`, to: `wb-cw-enc-${from}`, label: `寫入 ${piece}`, color: "purple" }]));
          });

          calls.push({ op: `encode(${strs.length} 個字串)`, ret: quote(out) });
          steps.push(mkStep(8, "回傳編碼字串", "tag-found", `return "${out}"`,
            `所有字串處理完畢，回傳編碼結果 "${out}"（長度 ${out.length}）。這個字串會被送到接收端解碼。`,
            { op: "encode", out: quote(out), return: quote(out) },
            snap({ ret: true }),
            out.length ? [{ from: "wb-cw-enc-0", to: "wb-var-ret", label: "回傳 out", color: "green" }] : []));
        } else if (op === "decode") {
          const s = String(vals[o][0] === undefined || vals[o][0] === null ? "" : vals[o][0]);
          const res = [];
          let i = 0;
          const snap = (opt) => {
            const chars = s.split("");
            const pointers = [];
            if (opt.i !== undefined && opt.i < chars.length) pointers.push({ idx: opt.i, label: "i", color: "blue" });
            if (opt.j !== undefined) pointers.push({ idx: opt.j, label: "j", color: "purple" });
            const hl = [];
            if (opt.rangeFrom !== undefined) for (let k = opt.rangeFrom; k < opt.rangeTo; k++) hl.push(k);
            const boards = [
              varsBoard([
                V("op", "呼叫", `decode (#${o + 1})`),
                V("i", "i", opt.i !== undefined ? opt.i : "-", "hl"),
                V("j", "j", opt.j !== undefined ? opt.j : "-"),
                V("len", "len", opt.len !== undefined ? opt.len : "-", opt.len !== undefined ? "hl" : ""),
                V("ret", "return", opt.ret ? fmtList(res.map(quote)) : "-", opt.ret ? "match" : "")
              ], "解碼端變數"),
              {
                id: "enc", type: "array", name: "s", typeLabel: "待解碼字串 (string，逐字元)",
                x: 325, y: 52, values: chars.map((c) => esc(c)), hl,
                done: chars.map((_, k) => k).filter((k) => k < (opt.doneTo || 0)),
                pointers
              },
              {
                id: "res", type: "array", name: "res", typeLabel: "解碼結果 (vector&lt;string&gt;)",
                x: 325, y: 175, values: res.map((t) => esc(quote(t))),
                hl: opt.newRes ? [res.length - 1] : [],
                match: opt.ret ? res.map((_, k) => k) : []
              }
            ];
            if (calls.length) boards.push(callsBoard(300));
            return boards;
          };

          steps.push(mkStep(12, "初始化讀取位置", "default", "res = {}, i = 0",
            `呼叫 decode：收到編碼字串 "${s}"（長度 ${s.length}）。建立空結果 res，讀取位置 i 從 0 開始。`,
            { op: "decode", i: "0", res: "[]", return: "-" }, snap({ i: 0 })));

          while (true) {
            if (!(i < s.length)) {
              steps.push(mkStep(13, "讀取完畢", "tag-check", `i = ${i} == s.size() = ${s.length}`,
                `i 已到達字串尾端（${i} 不小於 ${s.length}），所有片段都已還原，離開迴圈。`,
                { op: "decode", i: String(i), res: fmtList(res.map(quote)), return: "-" }, snap({ i, doneTo: i })));
              break;
            }
            steps.push(mkStep(13, "檢查是否還有片段", "tag-check", `i = ${i} < ${s.length}`,
              `i = ${i} 仍小於字串長度 ${s.length}，代表還有下一個「長度#內容」片段要解析。`,
              { op: "decode", i: String(i), res: fmtList(res.map(quote)), return: "-" }, snap({ i, doneTo: i })));
            const j = s.indexOf("#", i);
            steps.push(mkStep(14, "尋找分隔符號", "tag-check", `j = s.find('#', ${i}) = ${j}`,
              `從 i = ${i} 往後找第一個 '#'，位於 j = ${j}。i 到 j 之間就是長度數字。`,
              { op: "decode", i: String(i), j: String(j), res: fmtList(res.map(quote)), return: "-" },
              snap({ i, j, doneTo: i }),
              [{ from: `wb-cw-enc-${i}`, to: `wb-cw-enc-${j}`, label: "find('#')", color: "blue" }]));
            const len = parseInt(s.slice(i, j), 10);
            steps.push(mkStep(15, "讀出長度", "tag-check", `len = stoi("${s.slice(i, j)}") = ${len}`,
              `把 s[${i}..${j - 1}] = "${s.slice(i, j)}" 轉成整數，得到這個字串的長度 len = ${len}。`,
              { op: "decode", i: String(i), j: String(j), len: String(len), res: fmtList(res.map(quote)), return: "-" },
              snap({ i, j, len, rangeFrom: i, rangeTo: j, doneTo: i })));
            const piece = s.substr(j + 1, len);
            res.push(piece);
            steps.push(mkStep(16, "擷取內容", "tag-insert", `res.push_back("${piece}")`,
              len > 0
                ? `從 j + 1 = ${j + 1} 開始直接擷取 ${len} 個字元，得到 "${piece}" 並加入 res。內容中的字元（即使是 #）都不會被當成分隔符號。`
                : `len = 0，代表原本是空字串，加入 "" 到 res。`,
              { op: "decode", i: String(i), j: String(j), len: String(len), res: fmtList(res.map(quote)), return: "-" },
              snap({ i, j, len, rangeFrom: j + 1, rangeTo: j + 1 + len, doneTo: i, newRes: true }),
              [{ from: len > 0 ? `wb-cw-enc-${j + 1}` : `wb-cw-enc-${j}`, to: `wb-cw-res-${res.length - 1}`, label: `substr(${j + 1}, ${len})`, color: "purple" }]));
            i = j + 1 + len;
            steps.push(mkStep(17, "跳到下一片段", "default", `i = ${j} + 1 + ${len} = ${i}`,
              `讀取位置跳過 '#' 與 ${len} 個內容字元，移到 i = ${i}。`,
              { op: "decode", i: String(i), len: String(len), res: fmtList(res.map(quote)), return: "-" },
              snap({ i, doneTo: i })));
          }

          const retStr = fmtList(res.map(quote));
          calls.push({ op: `decode("${s}")`, ret: retStr });
          steps.push(mkStep(19, "回傳解碼清單", "tag-found", `return ${retStr}`,
            `解碼完成，回傳 ${res.length} 個字串 ${retStr}，與原本送出的清單完全相同。`,
            { op: "decode", i: String(i), res: retStr, return: retStr },
            snap({ i, doneTo: s.length, ret: true }),
            res.length ? [{ from: "wb-cw-res-0", to: "wb-var-ret", label: "回傳 res", color: "green" }] : []));
        }
      }
      return steps;
    }
  };

  // ==========================================================================
  // #149 Cheapest Flights Within K Stops (LC #787, Medium)
  // ==========================================================================
  window.PROBLEMS["cheapest-flights-within-k-stops"] = {
    id: 149,
    leetcodeId: 787,
    slug: "cheapest-flights-within-k-stops",
    title: "787. Cheapest Flights Within K Stops (K 站中轉內最便宜的航班)",
    difficulty: "Medium",
    topic: "Graph / Bellman-Ford",
    mins: 45,
    complexity: "Time O(k · E) · Space O(n)",
    argNames: ["n", "flights", "src", "dst", "k"],
    description:
      "給定 n 座城市與航班 flights[i] = [from, to, price]，求從 src 到 dst、最多經過 k 次中轉（即最多搭 k + 1 段航班）的最低票價，無法抵達則回傳 -1。使用限制輪數的 Bellman-Ford：dist[v] 表示目前最多 r 段航班抵達 v 的最低花費，每輪複製一份 tmp，只用「上一輪」的 dist 鬆弛所有航班並寫入 tmp，避免同一輪內連續使用多段航班。執行 k + 1 輪後 dist[dst] 即為答案。時間 O(k · E)，空間 O(n)。",

    presets: [
      {
        name: "範例 1：n = 4, src = 0, dst = 3, k = 1",
        args: [4, [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]], 0, 3, 1]
      },
      { name: "範例 2：n = 3, src = 0, dst = 2, k = 1", args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1] },
      { name: "範例 3：同圖但 k = 0（只能直飛）", args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0] },
      { name: "邊界：無法抵達 n = 3, flights = [[0,1,100]], dst = 2", args: [3, [[0, 1, 100]], 0, 2, 1] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {",
      "        const int INF = 1e9;",
      "        vector<int> dist(n, INF);",
      "        dist[src] = 0;",
      "        for (int round = 0; round <= k; ++round) {",
      "            vector<int> tmp = dist;  // 只用上一輪結果鬆弛",
      "            for (auto& f : flights) {",
      "                int u = f[0], v = f[1], w = f[2];",
      "                if (dist[u] != INF && dist[u] + w < tmp[v]) {",
      "                    tmp[v] = dist[u] + w;",
      "                }",
      "            }",
      "            dist = tmp;",
      "        }",
      "        return dist[dst] == INF ? -1 : dist[dst];",
      "    }",
      "};"
    ]),

    generateTrace(nInput, flightsInput, srcInput, dstInput, kInput) {
      const n = Number(nInput);
      const flights = clone(flightsInput);
      const src = Number(srcInput);
      const dst = Number(dstInput);
      const k = Number(kInput);
      const INF = Infinity;
      const steps = [];
      const show = (d) => (d === INF ? "∞" : String(d));

      // 節點環狀排列
      const W = 440, H = 230, cx = 220, cy = 112, R = Math.min(85, 40 + n * 12);
      const pos = Array.from({ length: n }, (_, i) => {
        const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
        return { x: Math.round(cx + R * Math.cos(ang)), y: Math.round(cy + R * Math.sin(ang)) };
      });

      let dist = new Array(n).fill(INF);
      let tmp = null;
      const relaxedEdges = new Set();

      const snap = (opt = {}) => {
        const nodes = pos.map((p, i) => {
          let status = "";
          if (opt.ret && i === dst) status = opt.retVal === -1 ? "warn" : "match";
          else if (opt.u === i || opt.v === i) status = "hl";
          else if (dist[i] !== INF) status = "done";
          const tags = [];
          if (i === src) tags.push("src");
          if (i === dst) tags.push("dst");
          return { id: `c${i}`, val: String(i), x: p.x, y: p.y, status, ptr: tags.join("/"), sub: `d=${show(dist[i])}` };
        });
        const edges = flights.map((f, idx) => ({
          from: `c${f[0]}`, to: `c${f[1]}`, label: `$${f[2]}`, dir: true,
          status: opt.edge === idx ? "hl" : relaxedEdges.has(idx) ? "match" : ""
        }));
        const boards = [
          varsBoard([
            V("round", "round", opt.round !== undefined ? `${opt.round} / k=${k}` : "-", "hl"),
            V("u", "u", opt.u !== undefined ? opt.u : "-"),
            V("v", "v", opt.v !== undefined ? opt.v : "-"),
            V("w", "w", opt.w !== undefined ? opt.w : "-"),
            V("cand", "dist[u] + w", opt.cand !== undefined ? opt.cand : "-", opt.cand !== undefined ? "hl" : ""),
            V("ret", "return", opt.ret ? opt.retVal : "-", opt.ret ? "match" : "")
          ], "Bellman-Ford 變數"),
          { id: "g", type: "graph", shape: "graph", name: "flights", typeLabel: "航班有向圖 (邊權 = 票價)", x: 325, y: 52, width: W, height: H, nodes, edges },
          {
            id: "dist", type: "array", name: "dist", typeLabel: "上一輪最低花費 (vector&lt;int&gt;)",
            x: 325, y: 52 + H + 30, values: dist.map(show),
            hl: opt.u !== undefined ? [opt.u] : [],
            match: opt.ret && dist[dst] !== INF ? [dst] : [],
            pointers: [{ idx: src, label: "src", color: "blue" }].concat(src !== dst ? [{ idx: dst, label: "dst", color: "green" }] : [])
          }
        ];
        if (tmp) {
          boards.push({
            id: "tmp", type: "array", name: "tmp", typeLabel: "本輪暫存 (vector&lt;int&gt;)",
            x: 325, y: 52 + H + 145, values: tmp.map(show),
            hl: opt.v !== undefined ? [opt.v] : [],
            match: opt.updated ? [opt.v] : []
          });
        }
        return boards;
      };
      const vs = (extra = {}) => Object.assign({ dist: fmtList(dist.map(show)) }, extra);

      steps.push(mkStep(5, "初始化 dist", "default", `dist = [${dist.map(show).join(",")}]`,
        `建立長度 ${n} 的 dist 陣列，全部設為無限大 INF（∞），表示一開始還無法抵達任何城市。`,
        vs({ return: "-" }), snap()));
      dist[src] = 0;
      steps.push(mkStep(6, "設定起點花費", "tag-insert", `dist[${src}] = 0`,
        `起點 src = ${src} 不需要搭機，花費為 0。接下來最多進行 k + 1 = ${k + 1} 輪鬆弛（每輪多搭一段航班）。`,
        vs({ return: "-" }), snap({ u: src })));

      for (let round = 0; round <= k; round++) {
        steps.push(mkStep(7, `第 ${round + 1} 輪`, "tag-check", `round = ${round} ≤ k = ${k}`,
          `開始第 ${round + 1} 輪：本輪結束後，dist 代表最多搭 ${round + 1} 段航班（${round} 次中轉）的最低花費。`,
          vs({ round: String(round), return: "-" }), snap({ round })));
        tmp = dist.slice();
        relaxedEdges.clear();
        steps.push(mkStep(8, "複製 tmp", "default", "tmp = dist",
          `把 dist 複製到 tmp。本輪只讀取上一輪的 dist、寫入 tmp，確保每輪最多只延伸一段航班，不會在同一輪內連搭多段。`,
          vs({ round: String(round), tmp: fmtList(tmp.map(show)), return: "-" }), snap({ round })));

        flights.forEach((f, idx) => {
          const [u, v, w] = f;
          const base = { round, u, v, w, edge: idx };
          if (dist[u] === INF) {
            steps.push(mkStep(11, "起點尚不可達", "tag-check", `dist[${u}] == INF，跳過`,
              `航班 ${u} → ${v}（$${w}）：上一輪還無法抵達城市 ${u}，無法從這裡出發，略過。`,
              vs({ round: String(round), u: String(u), v: String(v), w: String(w), return: "-" }),
              snap(base)));
            return;
          }
          const cand = dist[u] + w;
          if (cand < tmp[v]) {
            steps.push(mkStep(11, "找到更便宜路線", "tag-check", `${dist[u]} + ${w} = ${cand} < ${show(tmp[v])}`,
              `航班 ${u} → ${v}（$${w}）：dist[${u}] + ${w} = ${cand}，比 tmp[${v}] = ${show(tmp[v])} 更便宜，可以鬆弛。`,
              vs({ round: String(round), u: String(u), v: String(v), w: String(w), return: "-" }),
              snap(Object.assign({ cand }, base)),
              [{ from: `wb-cw-dist-${u}`, to: `wb-cw-tmp-${v}`, label: `${cand} < ${show(tmp[v])}`, color: "blue" }]));
            tmp[v] = cand;
            relaxedEdges.add(idx);
            steps.push(mkStep(12, "更新 tmp", "tag-insert", `tmp[${v}] = ${cand}`,
              `把 tmp[${v}] 更新為 ${cand}：目前已知經由城市 ${u} 抵達城市 ${v} 最便宜。`,
              vs({ round: String(round), u: String(u), v: String(v), w: String(w), tmp: fmtList(tmp.map(show)), return: "-" }),
              snap(Object.assign({ cand, updated: true }, base)),
              [{ from: `wb-node-g-c${u}`, to: `wb-cw-tmp-${v}`, label: `tmp[${v}] = ${cand}`, color: "purple" }]));
          } else {
            steps.push(mkStep(11, "沒有更便宜", "tag-check", `${dist[u]} + ${w} = ${cand} ≥ ${show(tmp[v])}`,
              `航班 ${u} → ${v}（$${w}）：dist[${u}] + ${w} = ${cand}，不比 tmp[${v}] = ${show(tmp[v])} 便宜，保持不變。`,
              vs({ round: String(round), u: String(u), v: String(v), w: String(w), return: "-" }),
              snap(Object.assign({ cand }, base)),
              [{ from: `wb-cw-dist-${u}`, to: `wb-cw-tmp-${v}`, label: `${cand} ≥ ${show(tmp[v])}`, color: "red" }]));
          }
        });

        dist = tmp.slice();
        steps.push(mkStep(15, "本輪結果寫回", "tag-insert", `dist = [${dist.map(show).join(",")}]`,
          `第 ${round + 1} 輪鬆弛完成，把 tmp 寫回 dist。現在 dist[${dst}] = ${show(dist[dst])}（最多 ${round + 1} 段航班）。`,
          vs({ round: String(round), return: "-" }), snap({ round })));
      }

      steps.push(mkStep(7, "輪數用完", "tag-check", `round = ${k + 1} > k = ${k}`,
        `已執行 k + 1 = ${k + 1} 輪，代表最多允許 ${k} 次中轉的所有路線都已考慮過，離開迴圈。`,
        vs({ round: String(k + 1), return: "-" }), snap({ round: k + 1 })));
      tmp = null;
      const retVal = dist[dst] === INF ? -1 : dist[dst];
      steps.push(mkStep(17, retVal === -1 ? "無法抵達" : "回傳最低票價", "tag-found",
        `return ${retVal}`,
        retVal === -1
          ? `dist[${dst}] 仍為 ∞，在 ${k} 次中轉內無法抵達城市 ${dst}，回傳 -1。`
          : `dist[${dst}] = ${retVal}，即在最多 ${k} 次中轉內從 ${src} 到 ${dst} 的最低票價。`,
        vs({ return: String(retVal) }), snap({ ret: true, retVal }),
        [{ from: `wb-cw-dist-${dst}`, to: "wb-var-ret", label: `return ${retVal}`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #150 All Nodes Distance K in Binary Tree (LC #863, Medium)
  // ==========================================================================
  window.PROBLEMS["all-nodes-distance-k-in-binary-tree"] = {
    id: 150,
    leetcodeId: 863,
    slug: "all-nodes-distance-k-in-binary-tree",
    title: "863. All Nodes Distance K in Binary Tree (二元樹中所有距離為 K 的節點)",
    difficulty: "Medium",
    topic: "Binary Tree / BFS",
    mins: 25,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["root", "target", "k"],
    description:
      "給定二元樹 root、樹中某個節點 target 與整數 k，回傳所有與 target 距離恰好為 k 的節點值。距離可以往下走到子節點，也可以往上走回父節點。先以 DFS 建立 parent 對照表 unordered_map<TreeNode*, TreeNode*>，把樹視為無向圖；再從 target 做分層 BFS，每個節點的鄰居為 left、right、parent，用 seen 集合避免走回頭路。擴展 k 層後佇列中剩下的節點即為答案。時間與空間皆為 O(n)。",

    presets: [
      { name: "範例 1：root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2", args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 2] },
      { name: "範例 2：root = [1], target = 1, k = 3", args: [[1], 1, 3] },
      { name: "邊界：k = 0 只回傳 target 本身", args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 0] },
      { name: "往上走：root = [0,1,null,3,2], target = 2, k = 1", args: [[0, 1, null, 3, 2], 2, 1] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "    unordered_map<TreeNode*, TreeNode*> parent;",
      "    void buildParent(TreeNode* node, TreeNode* par) {",
      "        if (!node) return;",
      "        parent[node] = par;",
      "        buildParent(node->left, node);",
      "        buildParent(node->right, node);",
      "    }",
      "public:",
      "    vector<int> distanceK(TreeNode* root, TreeNode* target, int k) {",
      "        buildParent(root, nullptr);",
      "        queue<TreeNode*> q;",
      "        unordered_set<TreeNode*> seen;",
      "        q.push(target); seen.insert(target);",
      "        int dist = 0;",
      "        while (!q.empty()) {",
      "            if (dist == k) break;",
      "            int sz = q.size();",
      "            for (int i = 0; i < sz; ++i) {",
      "                TreeNode* cur = q.front(); q.pop();",
      "                for (TreeNode* nb : {cur->left, cur->right, parent[cur]}) {",
      "                    if (nb && !seen.count(nb)) {",
      "                        seen.insert(nb);",
      "                        q.push(nb);",
      "                    }",
      "                }",
      "            }",
      "            ++dist;",
      "        }",
      "        vector<int> res;",
      "        while (!q.empty()) { res.push_back(q.front()->val); q.pop(); }",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(rootArr, targetVal, kInput) {
      const arr = clone(rootArr);
      const tree = buildTreeFromLevelOrder(arr, 620);
      const k = Number(kInput);
      const steps = [];
      const parent = new Map(); // id -> node|null
      const parentOrder = [];
      const q = [];
      const seen = [];
      const res = [];
      let dist = 0;
      const target = tree.nodes.find((nd) => nd.val === Number(targetVal));
      const resultIds = new Set();
      const treeH = tree.height;

      const snap = (opt = {}) => {
        const nodes = tree.nodes.map((nd) => {
          let status = "";
          if (resultIds.has(nd.id)) status = "match";
          else if (opt.cur && opt.cur.id === nd.id) status = "hl";
          else if (opt.nb && opt.nb.id === nd.id) status = "hl";
          else if (seen.includes(nd)) status = "done";
          const ptrs = [];
          if (target && nd.id === target.id) ptrs.push("target");
          if (opt.cur && opt.cur.id === nd.id) ptrs.push("cur");
          if (opt.nb && opt.nb.id === nd.id) ptrs.push("nb");
          return { id: nd.id, val: String(nd.val), x: nd.x, y: nd.y, status, ptr: ptrs.join(" / "), sub: opt.depthOf && opt.depthOf.has(nd.id) ? `d=${opt.depthOf.get(nd.id)}` : "" };
        });
        const edges = tree.edges.map((e) => ({
          ...e,
          status: opt.cur && opt.nb && ((e.from === opt.cur.id && e.to === opt.nb.id) || (e.to === opt.cur.id && e.from === opt.nb.id)) ? "hl" : ""
        }));
        const boards = [
          varsBoard([
            V("target", "target", target ? target.val : "-"),
            V("k", "k", k),
            V("dist", "dist", opt.phase === "bfs" || opt.phase === "res" ? dist : "-", opt.phase === "bfs" ? "hl" : ""),
            V("sz", "sz", opt.sz !== undefined ? opt.sz : "-"),
            V("cur", "cur", opt.cur ? `Node(${opt.cur.val})` : "-", opt.cur ? "hl" : ""),
            V("ret", "return", opt.ret ? fmtList(res) : res.length ? fmtList(res) + " …" : "-", opt.ret ? "match" : "")
          ], "BFS 變數"),
          { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)", x: 325, y: 52, width: tree.width, height: treeH, nodes, edges },
          {
            id: "par", type: "dict", name: "parent", typeLabel: "父節點表 (unordered_map)", x: 325 + tree.width + 24, y: 52,
            headers: ["node", "parent", "狀態"],
            rows: parentOrder.map((nd) => ({
              id: `p-${nd.id}`, key: String(nd.val), val: parent.get(nd.id) ? String(parent.get(nd.id).val) : "nullptr",
              note: opt.parRow === nd.id ? (opt.phase === "build" ? "寫入" : "查詢") : "",
              status: opt.parRow === nd.id ? (opt.phase === "build" ? "inserted" : "hit") : ""
            }))
          },
          {
            id: "q", type: "queue", name: "q", typeLabel: "BFS 佇列 (queue&lt;TreeNode*&gt;)", x: 325, y: 52 + treeH + 24,
            items: q.map((nd, idx) => ({ val: String(nd.val), status: opt.ret || opt.phase === "res" ? "match" : opt.qHl === idx ? "hl" : "" }))
          },
          {
            id: "seen", type: "set", name: "seen", typeLabel: "已拜訪 (unordered_set)", x: 325, y: 52 + treeH + 130,
            items: seen.map((nd) => ({ val: String(nd.val), status: opt.nb && opt.nb.id === nd.id ? "inserted" : "" }))
          }
        ];
        return boards;
      };

      steps.push(mkStep(11, "建立父節點表", "default", "buildParent(root, nullptr)",
        `距離可以往上走，但 TreeNode 沒有指向父節點的指標，所以先用 DFS 把每個節點的父節點記錄到 parent 表中。`,
        { dist: "-", return: "-" }, snap({ phase: "build" })));

      const build = (node, par) => {
        if (!node) return;
        parent.set(node.id, par);
        parentOrder.push(node);
        steps.push(mkStep(5, "記錄父節點", "tag-insert", `parent[${node.val}] = ${par ? par.val : "nullptr"}`,
          par ? `節點 ${node.val} 的父節點是 ${par.val}，寫入 parent 表。` : `根節點 ${node.val} 沒有父節點，記為 nullptr。`,
          { node: String(node.val), par: par ? String(par.val) : "nullptr", return: "-" },
          snap({ phase: "build", cur: node, parRow: node.id }),
          [{ from: `wb-node-tree-${node.id}`, to: `wb-dict-row-p-${node.id}`, label: `parent = ${par ? par.val : "null"}`, color: "purple" }]));
        build(node.left, node);
        build(node.right, node);
      };
      build(tree.root, null);

      if (!target) return steps;
      q.push(target);
      seen.push(target);
      const depthOf = new Map([[target.id, 0]]);
      steps.push(mkStep(14, "從 target 出發", "tag-insert", `q.push(${target.val}); seen.insert(${target.val})`,
        `把 target 節點 ${target.val} 放入佇列並標記為已拜訪，它與自己的距離為 0。`,
        { dist: "0", "q.size()": "1", return: "-" },
        snap({ phase: "bfs", depthOf, qHl: 0 }),
        [{ from: `wb-node-tree-${target.id}`, to: "wb-queue-q-0", label: "push(target)", color: "purple" }]));
      steps.push(mkStep(15, "初始化距離", "default", "dist = 0",
        `dist 表示目前佇列中節點與 target 的距離，從 0 開始。`,
        { dist: "0", "q.size()": "1", return: "-" }, snap({ phase: "bfs", depthOf })));

      while (q.length) {
        if (dist === k) {
          steps.push(mkStep(17, "已到達第 k 層", "tag-found", `dist == k == ${k} ➜ break`,
            `dist 已等於 k = ${k}，佇列中的 ${q.length} 個節點與 target 距離恰為 ${k}，停止擴展。`,
            { dist: String(dist), "q.size()": String(q.length), return: "-" },
            snap({ phase: "bfs", depthOf })));
          break;
        }
        steps.push(mkStep(17, "檢查層數", "tag-check", `dist = ${dist} != k = ${k}`,
          `dist = ${dist} 尚未達到 k = ${k}，繼續往外擴展一層。`,
          { dist: String(dist), "q.size()": String(q.length), return: "-" }, snap({ phase: "bfs", depthOf })));
        const sz = q.length;
        steps.push(mkStep(18, "記錄本層大小", "default", `sz = ${sz}`,
          `本層共有 ${sz} 個節點（距離 ${dist}），接下來逐一彈出並把未拜訪的鄰居加入下一層。`,
          { dist: String(dist), sz: String(sz), return: "-" }, snap({ phase: "bfs", depthOf, sz })));
        for (let i = 0; i < sz; i++) {
          const cur = q.shift();
          steps.push(mkStep(20, "彈出節點", "tag-check", `cur = ${cur.val}`,
            `從佇列前端取出節點 ${cur.val}（距離 ${dist}），檢查它的左子、右子與父節點。`,
            { dist: String(dist), sz: String(sz), i: String(i), cur: String(cur.val), return: "-" },
            snap({ phase: "bfs", depthOf, sz, cur, parRow: cur.id })));
          const nbs = [["左子", cur.left], ["右子", cur.right], ["父", parent.get(cur.id)]];
          for (const [kind, nb] of nbs) {
            if (!nb) continue;
            if (seen.includes(nb)) {
              steps.push(mkStep(22, "鄰居已拜訪", "tag-check", `seen.count(${nb.val}) = 1`,
                `${kind}節點 ${nb.val} 已在 seen 中（距離更近），略過以免走回頭路。`,
                { dist: String(dist), sz: String(sz), cur: String(cur.val), nb: String(nb.val), return: "-" },
                snap({ phase: "bfs", depthOf, sz, cur, nb })));
              continue;
            }
            seen.push(nb);
            q.push(nb);
            depthOf.set(nb.id, dist + 1);
            steps.push(mkStep(24, `加入${kind}節點`, "tag-insert", `q.push(${nb.val})`,
              `${kind}節點 ${nb.val} 尚未拜訪：加入 seen 並推入佇列，它與 target 的距離為 ${dist + 1}。`,
              { dist: String(dist), sz: String(sz), cur: String(cur.val), nb: String(nb.val), return: "-" },
              snap({ phase: "bfs", depthOf, sz, cur, nb, qHl: q.length - 1 }),
              [{ from: `wb-node-tree-${nb.id}`, to: `wb-queue-q-${q.length - 1}`, label: `push(${nb.val})`, color: "purple" }]));
          }
        }
        dist += 1;
        steps.push(mkStep(28, "距離加一", "default", `dist = ${dist}`,
          `第 ${dist - 1} 層處理完畢，佇列中現在都是距離 ${dist} 的節點（共 ${q.length} 個）。`,
          { dist: String(dist), "q.size()": String(q.length), return: "-" }, snap({ phase: "bfs", depthOf })));
      }
      if (!q.length) {
        steps.push(mkStep(16, "佇列已空", "tag-check", "q.empty() == true",
          `佇列已空：樹中沒有任何節點與 target 距離恰為 ${k}，離開迴圈。`,
          { dist: String(dist), "q.size()": "0", return: "-" }, snap({ phase: "bfs", depthOf })));
      }

      while (q.length) {
        const nd = q[0];
        res.push(nd.val);
        resultIds.add(nd.id);
        steps.push(mkStep(31, "收集答案", "tag-insert", `res.push_back(${nd.val})`,
          `佇列前端節點 ${nd.val} 與 target 距離為 ${k}，把它的值加入 res，然後彈出。`,
          { dist: String(dist), res: fmtList(res), return: "-" },
          snap({ phase: "res", depthOf, qHl: 0 }),
          [{ from: "wb-queue-q-0", to: "wb-var-ret", label: `res += ${nd.val}`, color: "green" }]));
        q.shift();
      }
      steps.push(mkStep(32, "回傳結果", "tag-found", `return ${fmtList(res)}`,
        res.length ? `所有距離 target ${k} 的節點值為 ${fmtList(res)}（順序不限）。` : `沒有節點距離 target 恰為 ${k}，回傳空陣列 []。`,
        { dist: String(dist), res: fmtList(res), return: fmtList(res) }, snap({ phase: "res", depthOf, ret: true })));
      return steps;
    }
  };

  // ==========================================================================
  // #151 Sliding Window Maximum (LC #239, Hard)
  // ==========================================================================
  window.PROBLEMS["sliding-window-maximum"] = {
    id: 151,
    leetcodeId: 239,
    slug: "sliding-window-maximum",
    title: "239. Sliding Window Maximum (滑動視窗最大值)",
    difficulty: "Hard",
    topic: "Array / Monotonic Deque",
    mins: 35,
    complexity: "Time O(n) · Space O(k)",
    argNames: ["nums", "k"],
    description:
      "給定整數陣列 nums 與視窗大小 k，視窗由左往右每次滑動一格，回傳每個視窗中的最大值。使用單調遞減雙端佇列 deque<int> 儲存索引：新元素進來前，先把前端已滑出視窗的索引 pop_front，再把尾端所有值比它小的索引 pop_back（它們之後不可能成為最大值），最後 push_back 自己。如此佇列前端永遠是目前視窗的最大值索引。每個索引最多進出佇列一次，時間 O(n)，空間 O(k)。",

    presets: [
      { name: "範例 1：nums = [1,3,-1,-3,5,3,6,7], k = 3", args: [[1, 3, -1, -3, 5, 3, 6, 7], 3] },
      { name: "範例 2：nums = [1], k = 1", args: [[1], 1] },
      { name: "遞減陣列（觸發前端過期）：nums = [9,8,7,6,5], k = 2", args: [[9, 8, 7, 6, 5], 2] },
      { name: "混合情況：nums = [1,3,1,2,0,5], k = 3", args: [[1, 3, 1, 2, 0, 5], 3] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    vector<int> maxSlidingWindow(vector<int>& nums, int k) {",
      "        deque<int> dq;  // 存索引，對應的值由前往後遞減",
      "        vector<int> res;",
      "        for (int i = 0; i < (int)nums.size(); ++i) {",
      "            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();",
      "            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();",
      "            dq.push_back(i);",
      "            if (i >= k - 1) res.push_back(nums[dq.front()]);",
      "        }",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput, kInput) {
      const nums = clone(numsInput);
      const k = Number(kInput);
      const steps = [];
      const dq = [];
      const res = [];

      const snap = (opt = {}) => {
        const i = opt.i;
        const winL = i !== undefined ? Math.max(0, i - k + 1) : -1;
        const hl = [];
        if (i !== undefined) for (let t = winL; t <= i; t++) hl.push(t);
        const pointers = [];
        if (i !== undefined) {
          if (winL !== i) pointers.push({ idx: winL, label: "L", color: "purple" });
          pointers.push({ idx: i, label: `i = ${i}`, color: "blue" });
        }
        return [
          varsBoard([
            V("k", "k", k),
            V("i", "i", i !== undefined ? i : "-", "hl"),
            V("win", "視窗", i !== undefined ? `[${winL}..${i}]` : "-"),
            V("front", "dq.front()", dq.length ? `${dq[0]} (值 ${nums[dq[0]]})` : "空"),
            V("ret", "return", opt.ret ? fmtList(res) : "-", opt.ret ? "match" : "")
          ], "滑動視窗變數"),
          {
            id: "nums", type: "array", name: "nums", typeLabel: "輸入陣列 (vector&lt;int&gt;)", x: 325, y: 52,
            values: nums.map(String), hl,
            match: opt.maxIdx !== undefined ? [opt.maxIdx] : [],
            warn: opt.warnIdx !== undefined ? [opt.warnIdx] : [],
            done: i !== undefined ? nums.map((_, t) => t).filter((t) => t < winL) : [],
            pointers
          },
          {
            id: "dq", type: "queue", name: "dq", typeLabel: "單調遞減雙端佇列 (deque&lt;int&gt; 索引)", x: 325, y: 175,
            leftLabel: "front（最大）", rightLabel: "back",
            items: dq.map((idx, t) => ({
              val: `${idx}:${nums[idx]}`,
              status: opt.dqWarn === t ? "warn" : opt.dqHl === t ? "hl" : opt.dqMatch === t ? "match" : ""
            }))
          },
          {
            id: "res", type: "array", name: "res", typeLabel: "各視窗最大值 (vector&lt;int&gt;)", x: 325, y: 290,
            values: res.map(String), hl: opt.newRes ? [res.length - 1] : [], match: opt.ret ? res.map((_, t) => t) : []
          }
        ];
      };

      steps.push(mkStep(5, "初始化", "default", "dq = {}, res = {}",
        `建立空的雙端佇列 dq（存索引，值由前往後遞減）與結果陣列 res，視窗大小 k = ${k}。`,
        { i: "-", dq: "[]", res: "[]", return: "-" }, snap()));

      const dqStr = () => fmtList(dq);
      for (let i = 0; i < nums.length; i++) {
        steps.push(mkStep(6, `處理 i = ${i}`, "default", `i = ${i}, nums[i] = ${nums[i]}`,
          `視窗右端移到索引 ${i}（值 ${nums[i]}），目前視窗為 [${Math.max(0, i - k + 1)}..${i}]。`,
          { i: String(i), dq: dqStr(), res: fmtList(res), return: "-" }, snap({ i })));
        if (dq.length && dq[0] <= i - k) {
          steps.push(mkStep(7, "移除過期索引", "tag-check", `dq.front() = ${dq[0]} ≤ ${i - k} ➜ pop_front`,
            `佇列前端索引 ${dq[0]} 已不在視窗 [${i - k + 1}..${i}] 內，從前端移除。`,
            { i: String(i), dq: dqStr(), res: fmtList(res), return: "-" },
            snap({ i, dqWarn: 0, warnIdx: dq[0] }),
            [{ from: "wb-queue-dq-0", to: `wb-cw-nums-${dq[0]}`, label: "滑出視窗", color: "red" }]));
          dq.shift();
        }
        while (dq.length && nums[dq[dq.length - 1]] < nums[i]) {
          const b = dq[dq.length - 1];
          steps.push(mkStep(8, "彈出較小尾端", "tag-check", `nums[${b}] = ${nums[b]} < nums[${i}] = ${nums[i]} ➜ pop_back`,
            `尾端索引 ${b} 的值 ${nums[b]} 小於新元素 ${nums[i]}，而且比它更早離開視窗，之後永遠不可能成為最大值，從尾端移除。`,
            { i: String(i), dq: dqStr(), res: fmtList(res), return: "-" },
            snap({ i, dqWarn: dq.length - 1, warnIdx: b }),
            [{ from: `wb-cw-nums-${i}`, to: `wb-queue-dq-${dq.length - 1}`, label: `${nums[i]} > ${nums[b]}`, color: "red" }]));
          dq.pop();
        }
        dq.push(i);
        steps.push(mkStep(9, "推入新索引", "tag-insert", `dq.push_back(${i})`,
          `把索引 ${i} 推入佇列尾端。佇列內對應的值仍保持由前往後遞減：${dq.map((t) => nums[t]).join(" ≥ ")}。`,
          { i: String(i), dq: dqStr(), res: fmtList(res), return: "-" },
          snap({ i, dqHl: dq.length - 1 }),
          [{ from: `wb-cw-nums-${i}`, to: `wb-queue-dq-${dq.length - 1}`, label: `push_back(${i})`, color: "purple" }]));
        if (i >= k - 1) {
          res.push(nums[dq[0]]);
          steps.push(mkStep(10, "記錄視窗最大值", "tag-found", `res.push_back(nums[${dq[0]}] = ${nums[dq[0]]})`,
            `視窗 [${i - k + 1}..${i}] 已滿 k 個元素，佇列前端索引 ${dq[0]} 的值 ${nums[dq[0]]} 就是這個視窗的最大值，加入 res。`,
            { i: String(i), dq: dqStr(), res: fmtList(res), return: "-" },
            snap({ i, dqMatch: 0, maxIdx: dq[0], newRes: true }),
            [{ from: "wb-queue-dq-0", to: `wb-cw-res-${res.length - 1}`, label: `max = ${nums[dq[0]]}`, color: "green" }]));
        }
      }
      steps.push(mkStep(12, "回傳結果", "tag-found", `return ${fmtList(res)}`,
        `所有 ${res.length} 個視窗都已處理，回傳各視窗最大值 ${fmtList(res)}。`,
        { i: String(nums.length), dq: dqStr(), res: fmtList(res), return: fmtList(res) }, snap({ ret: true }),
        res.length ? [{ from: "wb-cw-res-0", to: "wb-var-ret", label: "return res", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #152 Palindrome Number (LC #9, Easy)
  // ==========================================================================
  window.PROBLEMS["palindrome-number"] = {
    id: 152,
    leetcodeId: 9,
    slug: "palindrome-number",
    title: "9. Palindrome Number (迴文數)",
    difficulty: "Easy",
    topic: "Math",
    mins: 15,
    complexity: "Time O(log10 x) · Space O(1)",
    argNames: ["x"],
    description:
      "判斷整數 x 是否為迴文數（正著讀與反著讀相同），不得先轉成字串。負數因為有負號必不是迴文；個位數為 0 的正數（如 10）反轉後開頭為 0，也不可能是迴文。其餘情況只反轉「後半段」數字：每次把 x 的個位數接到 rev 尾端，直到 x ≤ rev，此時已處理到中間。偶數位數時要求 x == rev，奇數位數時中間位數落在 rev 的個位，比較 x == rev / 10。只反轉一半也避免了整數溢位。時間 O(log10 x)，空間 O(1)。",

    presets: [
      { name: "範例 1：x = 121", args: [121] },
      { name: "範例 2：x = -121", args: [-121] },
      { name: "範例 3：x = 10", args: [10] },
      { name: "偶數位數：x = 123321", args: [123321] },
      { name: "非迴文：x = 12341", args: [12341] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    bool isPalindrome(int x) {",
      "        if (x < 0 || (x % 10 == 0 && x != 0)) return false;",
      "        int rev = 0;",
      "        while (x > rev) {",
      "            rev = rev * 10 + x % 10;",
      "            x /= 10;",
      "        }",
      "        return x == rev || x == rev / 10;",
      "    }",
      "};"
    ]),

    generateTrace(xInput) {
      const x0 = Number(xInput);
      let x = x0;
      let rev = 0;
      const steps = [];
      const digits = (v) => String(v).split("");

      const snap = (opt = {}) => {
        const xd = digits(x);
        const rd = digits(rev);
        return [
          varsBoard([
            V("x0", "原始 x", x0),
            V("x", "x", x, opt.hlX ? "hl" : ""),
            V("rev", "rev", rev, opt.hlRev ? "hl" : ""),
            V("digit", "x % 10", opt.digit !== undefined ? opt.digit : "-"),
            V("ret", "return", opt.ret !== undefined ? String(opt.ret) : "-", opt.ret !== undefined ? (opt.ret ? "match" : "warn") : "")
          ], "數字反轉變數"),
          {
            id: "x", type: "array", name: "x", typeLabel: "尚未處理的前半段 (int 各位數)", x: 325, y: 52,
            values: xd, hl: opt.lastX ? [xd.length - 1] : [],
            match: opt.ret === true ? xd.map((_, t) => t) : [],
            warn: opt.warnAll ? xd.map((_, t) => t) : []
          },
          {
            id: "rev", type: "array", name: "rev", typeLabel: "已反轉的後半段 (int 各位數)", x: 325, y: 175,
            values: rd, hl: opt.lastRev ? [rd.length - 1] : [],
            match: opt.ret === true ? rd.map((_, t) => t) : []
          }
        ];
      };

      if (x < 0 || (x % 10 === 0 && x !== 0)) {
        const why = x < 0 ? "x 為負數，開頭有負號，反過來讀負號會跑到尾端" : `x 的個位數為 0 且 x ≠ 0，反轉後開頭會是 0`;
        steps.push(mkStep(4, "提早排除", "tag-found", "return false",
          `${why}，不可能是迴文數，直接回傳 false。`,
          { x: String(x), rev: "0", return: "false" }, snap({ ret: false, warnAll: true })));
        return steps;
      }
      steps.push(mkStep(4, "通過特例檢查", "tag-check", `x = ${x} ≥ 0 且個位數不為 0`,
        `x = ${x} 不是負數，個位數也不是 0（或 x 本身為 0），需要進一步檢查。`,
        { x: String(x), rev: "-", return: "-" }, snap()));
      steps.push(mkStep(5, "初始化 rev", "default", "rev = 0",
        `rev 用來存放「從個位開始反轉」的後半段數字，初始為 0。`,
        { x: String(x), rev: "0", return: "-" }, snap({ hlRev: true })));

      while (x > rev) {
        steps.push(mkStep(6, "還沒到中間", "tag-check", `x = ${x} > rev = ${rev}`,
          `x 仍大於 rev，代表後半段還沒反轉完，繼續搬移一位數。`,
          { x: String(x), rev: String(rev), return: "-" }, snap()));
        const d = x % 10;
        const before = rev;
        rev = rev * 10 + d;
        steps.push(mkStep(7, "搬移個位數", "tag-insert", `rev = ${before} * 10 + ${d} = ${rev}`,
          `取出 x 的個位數 ${d}，接到 rev 的尾端：rev = ${before} × 10 + ${d} = ${rev}。`,
          { x: String(x), rev: String(rev), digit: String(d), return: "-" },
          snap({ lastX: true, lastRev: true, hlRev: true, digit: d }),
          [{ from: `wb-cw-x-${digits(x).length - 1}`, to: `wb-cw-rev-${digits(rev).length - 1}`, label: `個位數 ${d}`, color: "purple" }]));
        x = Math.trunc(x / 10);
        steps.push(mkStep(8, "去掉個位數", "default", `x /= 10 ➜ ${x}`,
          `x 整除 10，去掉剛才搬走的個位數，x 變為 ${x}。`,
          { x: String(x), rev: String(rev), return: "-" }, snap({ hlX: true })));
      }
      steps.push(mkStep(6, "抵達中間", "tag-check", `x = ${x} ≤ rev = ${rev}`,
        `x 已不大於 rev，代表已經反轉了一半（或一半多一位），停止迴圈。`,
        { x: String(x), rev: String(rev), return: "-" }, snap()));
      const r1 = x === rev;
      const r2 = x === Math.trunc(rev / 10);
      const ret = r1 || r2;
      steps.push(mkStep(10, ret ? "是迴文數" : "不是迴文數", "tag-found",
        `${x} == ${rev} ? ${r1} ｜ ${x} == ${Math.trunc(rev / 10)} ? ${r2} ➜ ${ret}`,
        ret
          ? (r1 ? `x = ${x} 與 rev = ${rev} 相等（偶數位數），前半與反轉後的後半相同，回傳 true。` : `去掉 rev 的中間位數後 ${Math.trunc(rev / 10)} 與 x = ${x} 相等（奇數位數），回傳 true。`)
          : `x = ${x} 既不等於 rev = ${rev}，也不等於 rev / 10 = ${Math.trunc(rev / 10)}，前後半不對稱，回傳 false。`,
        { x: String(x), rev: String(rev), return: String(ret) }, snap({ ret }),
        [{ from: "wb-cw-x-0", to: "wb-cw-rev-0", label: ret ? "對稱" : "不對稱", color: ret ? "green" : "red" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #153 Convert Sorted Array to Binary Search Tree (LC #108, Easy)
  // ==========================================================================
  window.PROBLEMS["convert-sorted-array-to-binary-search-tree"] = {
    id: 153,
    leetcodeId: 108,
    slug: "convert-sorted-array-to-binary-search-tree",
    title: "108. Convert Sorted Array to Binary Search Tree (將有序陣列轉換為二元搜尋樹)",
    difficulty: "Easy",
    topic: "Binary Search Tree / Divide and Conquer",
    mins: 20,
    complexity: "Time O(n) · Space O(log n)",
    argNames: ["nums"],
    description:
      "給定已遞增排序的整數陣列 nums，將它轉換為高度平衡的二元搜尋樹（每個節點左右子樹高度差不超過 1）。採分治遞迴：在區間 [lo, hi] 中取中間位置 mid = lo + (hi - lo) / 2 作為根節點，左半 [lo, mid - 1] 遞迴建左子樹、右半 [mid + 1, hi] 遞迴建右子樹；區間為空時回傳 nullptr。因為每次都平分剩餘元素，左右子樹大小最多差 1，自然平衡，且中序走訪即為原陣列。時間 O(n)，遞迴深度 O(log n)。",

    presets: [
      { name: "範例 1：nums = [-10,-3,0,5,9]", args: [[-10, -3, 0, 5, 9]] },
      { name: "範例 2：nums = [1,3]", args: [[1, 3]] },
      { name: "邊界：nums = [0]", args: [[0]] },
      { name: "完全平衡：nums = [1,2,3,4,5,6,7]", args: [[1, 2, 3, 4, 5, 6, 7]] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    TreeNode* sortedArrayToBST(vector<int>& nums) {",
      "        return build(nums, 0, (int)nums.size() - 1);",
      "    }",
      "    TreeNode* build(vector<int>& nums, int lo, int hi) {",
      "        if (lo > hi) return nullptr;",
      "        int mid = lo + (hi - lo) / 2;",
      "        TreeNode* node = new TreeNode(nums[mid]);",
      "        node->left = build(nums, lo, mid - 1);",
      "        node->right = build(nums, mid + 1, hi);",
      "        return node;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput) {
      const nums = clone(numsInput);
      const steps = [];
      const W = 620;

      // 預先計算最終樹形與座標（與執行順序相同的 mid 規則）。
      const layout = {};
      const plan = (lo, hi, depth, lb, rb) => {
        if (lo > hi) return null;
        const mid = lo + Math.floor((hi - lo) / 2);
        layout[mid] = { x: Math.round((lb + rb) / 2), y: 42 + depth * 72, depth };
        const m = (lb + rb) / 2;
        plan(lo, mid - 1, depth + 1, lb, m);
        plan(mid + 1, hi, depth + 1, m, rb);
        return mid;
      };
      plan(0, nums.length - 1, 0, 36, W - 36);
      const maxDepth = Object.values(layout).reduce((m, p) => Math.max(m, p.depth), 0);
      const H = Math.max(220, 85 + maxDepth * 72);

      const created = []; // mid indices
      const edges = []; // {from, to, label}
      const frames = [];
      const nodesById = {};

      const snap = (opt = {}) => {
        const hl = [];
        if (opt.lo !== undefined && opt.lo <= opt.hi) for (let t = opt.lo; t <= opt.hi; t++) hl.push(t);
        const pointers = [];
        if (opt.lo !== undefined && nums.length) {
          if (opt.lo < nums.length) pointers.push({ idx: opt.lo, label: "lo", color: "blue" });
          if (opt.hi >= 0 && opt.hi !== opt.lo) pointers.push({ idx: opt.hi, label: "hi", color: "red" });
          if (opt.mid !== undefined) pointers.push({ idx: opt.mid, label: "mid", color: "green" });
        }
        const nodes = created.map((m) => ({
          id: `m${m}`, val: String(nums[m]), x: layout[m].x, y: layout[m].y, sub: `nums[${m}]`,
          status: opt.ret ? "match" : opt.mid === m ? "hl" : opt.node === m ? "hl" : "done",
          ptr: opt.node === m || opt.mid === m ? "node" : ""
        }));
        return [
          varsBoard([
            V("lo", "lo", opt.lo !== undefined ? opt.lo : "-"),
            V("hi", "hi", opt.hi !== undefined ? opt.hi : "-"),
            V("mid", "mid", opt.mid !== undefined ? opt.mid : "-", opt.mid !== undefined ? "hl" : ""),
            V("depth", "遞迴深度", frames.length),
            V("ret", "return", opt.retStr || "-", opt.ret ? "match" : "")
          ], "分治區間變數"),
          {
            id: "nums", type: "array", name: "nums", typeLabel: "有序陣列 (vector&lt;int&gt;)", x: 325, y: 52,
            values: nums.map(String), hl: opt.mid !== undefined ? hl.filter((t) => t !== opt.mid) : hl,
            match: opt.ret ? nums.map((_, t) => t) : opt.mid !== undefined ? [opt.mid] : [],
            done: created.filter((m) => m !== opt.mid), pointers
          },
          {
            id: "bst", type: "tree", shape: "circle", name: "root", typeLabel: "平衡 BST (TreeNode*)", x: 325, y: 175,
            width: W, height: H, nodes,
            edges: edges.map((e) => ({ ...e, dir: true, status: opt.edge === e.to ? "hl" : opt.ret ? "match" : "" }))
          },
          {
            id: "calls", type: "stack", name: "call stack", typeLabel: "遞迴呼叫堆疊", x: 325 + W + 24, y: 175,
            items: frames.map((f, t) => ({ val: esc(f), status: t === frames.length - 1 ? "hl" : "" }))
          }
        ];
      };

      const build = (lo, hi, side, parentMid) => {
        frames.push(`build(${lo}, ${hi})`);
        const where = parentMid === undefined ? "整棵樹" : `節點 ${nums[parentMid]} 的${side}子樹`;
        if (lo > hi) {
          steps.push(mkStep(7, "空區間", "tag-check", `lo = ${lo} > hi = ${hi} ➜ nullptr`,
            `區間 [${lo}, ${hi}] 為空，${where}沒有元素，回傳 nullptr。`,
            { lo: String(lo), hi: String(hi), mid: "-", return: "nullptr" }, snap({ lo, hi })));
          frames.pop();
          return null;
        }
        const mid = lo + Math.floor((hi - lo) / 2);
        steps.push(mkStep(8, "取中間位置", "tag-check", `mid = ${lo} + (${hi} - ${lo}) / 2 = ${mid}`,
          `為${where}處理區間 [${lo}, ${hi}]，取中間索引 mid = ${mid}（值 ${nums[mid]}），讓左右兩邊元素數量最多差 1。`,
          { lo: String(lo), hi: String(hi), mid: String(mid), return: "-" }, snap({ lo, hi, mid })));
        created.push(mid);
        nodesById[mid] = { val: nums[mid], left: null, right: null };
        steps.push(mkStep(9, "建立節點", "tag-insert", `node = new TreeNode(${nums[mid]})`,
          `以 nums[${mid}] = ${nums[mid]} 建立新節點，作為${where}的根。比它小的都在左半、比它大的都在右半。`,
          { lo: String(lo), hi: String(hi), mid: String(mid), return: "-" }, snap({ lo, hi, mid }),
          [{ from: `wb-cw-nums-${mid}`, to: `wb-node-bst-m${mid}`, label: `new TreeNode(${nums[mid]})`, color: "purple" }]));
        const left = build(lo, mid - 1, "左", mid);
        nodesById[mid].left = left === null ? null : nodesById[left];
        if (left !== null) edges.push({ from: `m${mid}`, to: `m${left}`, label: "L" });
        steps.push(mkStep(10, "接上左子樹", left !== null ? "tag-insert" : "default",
          `node->left = ${left !== null ? nums[left] : "nullptr"}`,
          left !== null ? `左半 [${lo}, ${mid - 1}] 建好的子樹根為 ${nums[left]}，接到節點 ${nums[mid]} 的左邊。` : `左半為空，節點 ${nums[mid]} 的左子為 nullptr。`,
          { lo: String(lo), hi: String(hi), mid: String(mid), return: "-" },
          snap({ lo, hi, node: mid, edge: left !== null ? `m${left}` : undefined }),
          left !== null ? [{ from: `wb-node-bst-m${mid}`, to: `wb-node-bst-m${left}`, label: "left", color: "blue" }] : []));
        const right = build(mid + 1, hi, "右", mid);
        nodesById[mid].right = right === null ? null : nodesById[right];
        if (right !== null) edges.push({ from: `m${mid}`, to: `m${right}`, label: "R" });
        steps.push(mkStep(11, "接上右子樹", right !== null ? "tag-insert" : "default",
          `node->right = ${right !== null ? nums[right] : "nullptr"}`,
          right !== null ? `右半 [${mid + 1}, ${hi}] 建好的子樹根為 ${nums[right]}，接到節點 ${nums[mid]} 的右邊。` : `右半為空，節點 ${nums[mid]} 的右子為 nullptr。`,
          { lo: String(lo), hi: String(hi), mid: String(mid), return: "-" },
          snap({ lo, hi, node: mid, edge: right !== null ? `m${right}` : undefined }),
          right !== null ? [{ from: `wb-node-bst-m${mid}`, to: `wb-node-bst-m${right}`, label: "right", color: "blue" }] : []));
        steps.push(mkStep(12, "回傳子樹根", "tag-check", `return node(${nums[mid]})`,
          `區間 [${lo}, ${hi}] 處理完成，回傳以 ${nums[mid]} 為根的平衡子樹給上一層。`,
          { lo: String(lo), hi: String(hi), mid: String(mid), return: `node(${nums[mid]})` }, snap({ lo, hi, node: mid })));
        frames.pop();
        return mid;
      };

      steps.push(mkStep(4, "呼叫 build", "default", `build(nums, 0, ${nums.length - 1})`,
        `從整個陣列區間 [0, ${nums.length - 1}] 開始遞迴建樹。`,
        { lo: "0", hi: String(nums.length - 1), return: "-" }, snap({ lo: 0, hi: nums.length - 1 })));
      const rootMid = build(0, nums.length - 1, "", undefined);
      const retStr = rootMid === null ? "[]" : serializeTree(nodesById[rootMid]);
      steps.push(mkStep(4, "回傳根節點", "tag-found", `return ${retStr}`,
        `整棵樹建立完成，根節點為 ${rootMid !== null ? nums[rootMid] : "nullptr"}。以層序表示為 ${retStr}，中序走訪正好是原本的有序陣列，且左右高度差不超過 1。`,
        { return: retStr }, snap({ ret: true, retStr }),
        rootMid !== null ? [{ from: `wb-node-bst-m${rootMid}`, to: "wb-var-ret", label: "return root", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #154 Reverse Bits (LC #190, Easy)
  // ==========================================================================
  window.PROBLEMS["reverse-bits"] = {
    id: 154,
    leetcodeId: 190,
    slug: "reverse-bits",
    title: "190. Reverse Bits (顛倒二進位位元)",
    difficulty: "Easy",
    topic: "Binary / Bit Manipulation",
    mins: 15,
    complexity: "Time O(32) · Space O(1)",
    argNames: ["n"],
    description:
      "將 32 位元整數 n 的二進位表示整個左右顛倒後回傳。以無號整數 uint32_t 處理避免符號位問題：重複 32 次，每次先把 res 左移一位騰出最低位，再用 x & 1 取出 x 目前的最低位放進去，接著 x 右移一位。如此 x 的第 0 位最後會到達 res 的第 31 位，依此類推。固定 32 次迴圈，時間 O(1)，空間 O(1)。",

    presets: [
      { name: "範例 1：n = 43261596", args: [43261596] },
      { name: "範例 2：n = 2147483644", args: [2147483644] },
      { name: "邊界：n = 0", args: [0] },
      { name: "單一位元：n = 2", args: [2] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    int reverseBits(int n) {",
      "        uint32_t x = n, res = 0;",
      "        for (int i = 0; i < 32; ++i) {",
      "            res = (res << 1) | (x & 1);",
      "            x >>= 1;",
      "        }",
      "        return (int)res;",
      "    }",
      "};"
    ]),

    generateTrace(nInput) {
      const n0 = Number(nInput) >>> 0;
      let x = n0;
      let res = 0;
      const steps = [];
      const bits = (v) => (v >>> 0).toString(2).padStart(32, "0").split("");
      const colLabels = Array.from({ length: 32 }, (_, c) => String(31 - c));

      const snap = (opt = {}) => {
        const hl = [];
        const match = [];
        const done = [];
        if (opt.xHl) hl.push("0,31");
        if (opt.resHl) match.push("1,31");
        // res 已填入的位元數
        const filled = opt.filled || 0;
        for (let c = 32 - filled; c < 32; c++) if (!(opt.resHl && c === 31)) done.push(`1,${c}`);
        if (opt.ret) for (let c = 0; c < 32; c++) match.push(`1,${c}`);
        return [
          varsBoard([
            V("n", "n", n0),
            V("i", "i", opt.i !== undefined ? opt.i : "-", "hl"),
            V("bit", "x & 1", opt.bit !== undefined ? opt.bit : "-", opt.bit !== undefined ? "hl" : ""),
            V("x", "x (十進位)", x >>> 0),
            V("res", "res (十進位)", res >>> 0, opt.resHl ? "hl" : ""),
            V("ret", "return", opt.ret ? String(res >>> 0) : "-", opt.ret ? "match" : "")
          ], "位元運算變數"),
          {
            id: "bits", type: "grid", name: "x / res", typeLabel: "32 位元二進位表示 (uint32_t，欄 = 位元編號)",
            x: 325, y: 52, rowLabels: ["x", "res"], colLabels,
            cells: [bits(x), bits(res)], hl, match, done
          }
        ];
      };

      steps.push(mkStep(4, "轉成無號整數", "default", `x = ${n0}, res = 0`,
        `把 n = ${n0} 存成 uint32_t x，避免右移時的符號擴展；res 從 0 開始，用來累積反轉後的位元。`,
        { i: "-", x: String(x), res: "0", return: "-" }, snap()));

      for (let i = 0; i < 32; i++) {
        const bit = x & 1;
        res = ((res << 1) | bit) >>> 0;
        steps.push(mkStep(6, `第 ${i + 1} 位`, bit ? "tag-insert" : "tag-check", `res = (res << 1) | ${bit} = ${res >>> 0}`,
          `第 ${i} 輪：res 左移一位騰出最低位，取出 x 的最低位 ${bit} 放進 res 的最低位。x 原本的第 ${i} 位最終會落在 res 的第 ${31 - i} 位。`,
          { i: String(i), bit: String(bit), x: String(x >>> 0), res: String(res >>> 0), return: "-" },
          snap({ i, bit, xHl: true, resHl: true, filled: i + 1 }),
          [{ from: "wb-grid-bits-0-31", to: "wb-grid-bits-1-31", label: `bit ${bit}`, color: bit ? "purple" : "blue" }]));
        x = x >>> 1;
        steps.push(mkStep(7, "x 右移", "default", `x >>= 1 ➜ ${x >>> 0}`,
          `x 右移一位，丟掉剛處理過的最低位，下一個要處理的位元移到最低位。`,
          { i: String(i), x: String(x >>> 0), res: String(res >>> 0), return: "-" },
          snap({ i, filled: i + 1 })));
      }
      steps.push(mkStep(9, "回傳結果", "tag-found", `return ${res >>> 0}`,
        `32 個位元全部處理完畢，res 的二進位正好是 n 的左右顛倒，回傳 ${res >>> 0}。`,
        { i: "32", x: String(x >>> 0), res: String(res >>> 0), return: String(res >>> 0) },
        snap({ ret: true, filled: 32 }),
        [{ from: "wb-grid-bits-1-0", to: "wb-var-ret", label: `return ${res >>> 0}`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #155 Subtree of Another Tree (LC #572, Easy)
  // ==========================================================================
  window.PROBLEMS["subtree-of-another-tree"] = {
    id: 155,
    leetcodeId: 572,
    slug: "subtree-of-another-tree",
    title: "572. Subtree of Another Tree (另一棵樹的子樹)",
    difficulty: "Easy",
    topic: "Binary Tree / DFS",
    mins: 20,
    complexity: "Time O(m · n) · Space O(h)",
    argNames: ["root", "subRoot"],
    description:
      "給定兩棵二元樹 root 與 subRoot，判斷 root 中是否存在某個節點，使得以它為根的整棵子樹（包含所有後代）與 subRoot 的結構和節點值完全相同。對 root 做 DFS，在每個節點呼叫 isSame 比較兩棵樹：兩者皆空為相同、只有一邊空或值不同則不同，否則遞迴比較左右子樹。任一節點比對成功即回傳 true。最壞時間 O(m · n)，空間為遞迴深度 O(h)。",

    presets: [
      { name: "範例 1：root = [3,4,5,1,2], subRoot = [4,1,2]", args: [[3, 4, 5, 1, 2], [4, 1, 2]] },
      { name: "範例 2：root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", args: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]] },
      { name: "重複值：root = [1,1], subRoot = [1]", args: [[1, 1], [1]] },
      { name: "結構不同：root = [1,2,3], subRoot = [1,2]", args: [[1, 2, 3], [1, 2]] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    bool isSubtree(TreeNode* root, TreeNode* subRoot) {",
      "        if (!root) return false;",
      "        if (isSame(root, subRoot)) return true;",
      "        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);",
      "    }",
      "    bool isSame(TreeNode* a, TreeNode* b) {",
      "        if (!a || !b) return a == b;",
      "        if (a->val != b->val) return false;",
      "        return isSame(a->left, b->left) && isSame(a->right, b->right);",
      "    }",
      "};"
    ]),

    generateTrace(rootArr, subArr) {
      const A = buildTreeFromLevelOrder(clone(rootArr), 460);
      const B = buildTreeFromLevelOrder(clone(subArr), 300);
      const steps = [];
      const frames = [];
      const tried = new Set(); // root 中已嘗試過且失敗的起點
      let cand = null; // 目前 isSubtree 的 root
      let pairOk = new Set(); // 本次 isSame 已比對相同的節點 id（兩棵樹）
      let pairBad = new Set();
      let found = null;
      const H = Math.max(A.height, B.height);
      const nodeName = (nd) => (nd ? `Node(${nd.val})` : "nullptr");

      const snap = (opt = {}) => {
        const mapNodes = (tree, isA) => tree.nodes.map((nd) => {
          let status = "";
          const key = (isA ? "A" : "B") + nd.id;
          if (found && (isA ? pairOk.has(key) : true)) status = "match";
          else if (pairBad.has(key)) status = "warn";
          else if ((isA ? opt.a : opt.b) === nd) status = "hl";
          else if (pairOk.has(key)) status = "match";
          else if (isA && tried.has(nd.id)) status = "done";
          const ptrs = [];
          if (isA && cand === nd) ptrs.push("root");
          if ((isA ? opt.a : opt.b) === nd) ptrs.push(isA ? "a" : "b");
          return { id: nd.id, val: String(nd.val), x: nd.x, y: nd.y, status, ptr: ptrs.join(" / ") };
        });
        return [
          varsBoard([
            V("root", "root", nodeName(cand), cand ? "hl" : ""),
            V("a", "a", opt.a !== undefined ? nodeName(opt.a) : "-"),
            V("b", "b", opt.b !== undefined ? nodeName(opt.b) : "-"),
            V("ret", "return", opt.ret !== undefined ? String(opt.ret) : "-", opt.ret !== undefined ? (opt.ret ? "match" : "warn") : "")
          ], "遞迴比對變數"),
          { id: "ta", type: "tree", shape: "circle", name: "root", typeLabel: "主樹 (TreeNode*)", x: 325, y: 52, width: A.width, height: H, nodes: mapNodes(A, true), edges: A.edges.map((e) => ({ ...e })) },
          { id: "tb", type: "tree", shape: "circle", name: "subRoot", typeLabel: "目標子樹 (TreeNode*)", x: 325 + A.width + 30, y: 52, width: B.width, height: H, nodes: mapNodes(B, false), edges: B.edges.map((e) => ({ ...e })) },
          { id: "calls", type: "stack", name: "call stack", typeLabel: "遞迴呼叫堆疊", x: 325, y: 52 + H + 30, items: frames.map((f, t) => ({ val: esc(f), status: t === frames.length - 1 ? "hl" : "" })) }
        ];
      };
      const vv = (a, b, ret = "-") => ({ root: cand ? String(cand.val) : "nullptr", a: a !== undefined ? (a ? String(a.val) : "nullptr") : "-", b: b !== undefined ? (b ? String(b.val) : "nullptr") : "-", return: ret });

      const isSame = (a, b) => {
        frames.push(`isSame(${a ? a.val : "null"}, ${b ? b.val : "null"})`);
        if (!a || !b) {
          const r = a === b;
          steps.push(mkStep(9, r ? "同為空" : "一邊為空", "tag-check", `${nodeName(a)} vs ${nodeName(b)} ➜ ${r}`,
            r ? `兩邊都是 nullptr，這個位置結構相同，回傳 true。` : `${a ? "subRoot 這邊已經沒有節點，但 root 這邊還有 " + a.val : "root 這邊是空的，但 subRoot 還有節點 " + b.val}，結構不同，回傳 false。`,
            vv(a, b), snap({ a, b })));
          if (!r && a) pairBad.add("A" + a.id);
          if (!r && b) pairBad.add("B" + b.id);
          frames.pop();
          return r;
        }
        if (a.val !== b.val) {
          pairBad.add("A" + a.id);
          pairBad.add("B" + b.id);
          steps.push(mkStep(10, "值不同", "tag-check", `${a.val} != ${b.val} ➜ false`,
            `比較 a = ${a.val} 與 b = ${b.val}：數值不同，這兩棵樹不相同，回傳 false。`,
            vv(a, b), snap({ a, b }),
            [{ from: `wb-node-ta-${a.id}`, to: `wb-node-tb-${b.id}`, label: `${a.val} ≠ ${b.val}`, color: "red" }]));
          frames.pop();
          return false;
        }
        pairOk.add("A" + a.id);
        pairOk.add("B" + b.id);
        steps.push(mkStep(10, "值相同", "tag-check", `${a.val} == ${b.val}`,
          `比較 a = ${a.val} 與 b = ${b.val}：數值相同，接著遞迴比較左子樹與右子樹。`,
          vv(a, b), snap({ a, b }),
          [{ from: `wb-node-ta-${a.id}`, to: `wb-node-tb-${b.id}`, label: `${a.val} = ${b.val}`, color: "blue" }]));
        const l = isSame(a.left, b.left);
        const r = l && isSame(a.right, b.right);
        steps.push(mkStep(11, l && r ? "子樹皆相同" : "子樹不同", "tag-check", `isSame(left) && isSame(right) = ${l && r}`,
          l && r ? `節點 ${a.val} 的左右子樹都相同，以它為根的兩棵樹一致，回傳 true。` : `節點 ${a.val} 的${l ? "右" : "左"}子樹比對失敗${l ? "" : "（&& 短路，不再比較右子樹）"}，回傳 false。`,
          vv(a, b), snap({ a, b })));
        frames.pop();
        return l && r;
      };

      const isSubtree = (root) => {
        const prev = cand;
        frames.push(`isSubtree(${root ? root.val : "null"})`);
        if (!root) {
          steps.push(mkStep(4, "空節點", "tag-check", "root == nullptr ➜ false",
            `走到空節點，這裡不可能包含 subRoot，回傳 false。`,
            vv(undefined, undefined), snap({})));
          frames.pop();
          return false;
        }
        cand = root;
        pairOk = new Set();
        pairBad = new Set();
        steps.push(mkStep(5, "嘗試以此節點為起點", "tag-check", `isSame(${root.val}, ${B.root ? B.root.val : "null"})`,
          `以主樹節點 ${root.val} 為起點，呼叫 isSame 比較它的整棵子樹是否與 subRoot 完全相同。`,
          vv(root, B.root), snap({ a: root, b: B.root || undefined }),
          B.root ? [{ from: `wb-node-ta-${root.id}`, to: `wb-node-tb-${B.root.id}`, label: "isSame?", color: "purple" }] : []));
        if (isSame(root, B.root)) {
          found = root;
          steps.push(mkStep(5, "找到相同子樹", "tag-found", "isSame == true ➜ return true",
            `以節點 ${root.val} 為根的子樹與 subRoot 結構與數值完全相同，回傳 true。`,
            vv(root, B.root, "true"), snap({ ret: true }),
            [{ from: `wb-node-ta-${root.id}`, to: "wb-var-ret", label: "return true", color: "green" }]));
          frames.pop();
          return true;
        }
        tried.add(root.id);
        pairOk = new Set();
        pairBad = new Set();
        steps.push(mkStep(6, "往子節點繼續找", "default", `isSubtree(${root.left ? root.left.val : "null"}) || isSubtree(${root.right ? root.right.val : "null"})`,
          `以 ${root.val} 為根不相同，改到它的左子樹找；左子樹找不到時再找右子樹。`,
          vv(), snap({})));
        const res = isSubtree(root.left) || isSubtree(root.right);
        cand = root;
        if (!res) {
          steps.push(mkStep(6, "此分支找不到", "tag-check", `isSubtree(${root.val}) = false`,
            `節點 ${root.val} 本身與它的左右子樹都沒有與 subRoot 相同的子樹，回傳 false。`,
            vv(undefined, undefined, "false"), snap({})));
        }
        frames.pop();
        cand = prev;
        return res;
      };

      const ans = isSubtree(A.root);
      if (ans) {
        steps.push(mkStep(3, "最終結果", "tag-found", "return true",
          `subRoot 是 root 的子樹，最終回傳 true。`,
          { return: "true" }, (cand = found, snap({ ret: true }))));
      } else {
        steps.push(mkStep(3, "最終結果", "tag-found", "return false",
          `root 中沒有任何節點的子樹與 subRoot 完全相同，最終回傳 false。`,
          { return: "false" }, snap({ ret: false })));
      }
      return steps;
    }
  };

  // ==========================================================================
  // #156 Squares of a Sorted Array (LC #977, Easy)
  // ==========================================================================
  window.PROBLEMS["squares-of-a-sorted-array"] = {
    id: 156,
    leetcodeId: 977,
    slug: "squares-of-a-sorted-array",
    title: "977. Squares of a Sorted Array (有序陣列的平方)",
    difficulty: "Easy",
    topic: "Array / Two Pointers",
    mins: 20,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["nums"],
    description:
      "給定非遞減排序的整數陣列 nums（可能含負數），回傳每個數平方後同樣依非遞減排序的陣列。平方後的最大值一定出現在原陣列的兩端（最負或最正），因此用左右雙指標 l、r 從兩端往中間收，每次比較 |nums[l]| 與 |nums[r]|，把較大者的平方由後往前填入結果陣列的 pos 位置。一次掃描完成，時間 O(n)，不需要排序。",

    presets: [
      { name: "範例 1：nums = [-4,-1,0,3,10]", args: [[-4, -1, 0, 3, 10]] },
      { name: "範例 2：nums = [-7,-3,2,3,11]", args: [[-7, -3, 2, 3, 11]] },
      { name: "全為負數：nums = [-5,-3,-2,-1]", args: [[-5, -3, -2, -1]] },
      { name: "全為正數：nums = [1,2,3]", args: [[1, 2, 3]] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    vector<int> sortedSquares(vector<int>& nums) {",
      "        int n = nums.size();",
      "        vector<int> res(n);",
      "        int l = 0, r = n - 1;",
      "        for (int pos = n - 1; pos >= 0; --pos) {",
      "            if (abs(nums[l]) > abs(nums[r])) {",
      "                res[pos] = nums[l] * nums[l];",
      "                ++l;",
      "            } else {",
      "                res[pos] = nums[r] * nums[r];",
      "                --r;",
      "            }",
      "        }",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput) {
      const nums = clone(numsInput);
      const n = nums.length;
      const steps = [];
      const res = new Array(n).fill(null);
      let l = 0;
      let r = n - 1;

      const snap = (opt = {}) => {
        const pointers = [];
        if (l <= r && l < n) {
          if (l === r) pointers.push({ idx: l, label: "l = r", color: "purple" });
          else {
            pointers.push({ idx: l, label: "l", color: "blue" });
            pointers.push({ idx: r, label: "r", color: "red" });
          }
        }
        const used = nums.map((_, t) => t).filter((t) => t < l || t > r);
        return [
          varsBoard([
            V("l", "l", l),
            V("r", "r", r),
            V("pos", "pos", opt.pos !== undefined ? opt.pos : "-", "hl"),
            V("cmp", "|nums[l]| vs |nums[r]|", opt.cmp || "-", opt.cmp ? "hl" : ""),
            V("ret", "return", opt.ret ? fmtList(res) : "-", opt.ret ? "match" : "")
          ], "雙指標變數"),
          {
            id: "nums", type: "array", name: "nums", typeLabel: "非遞減輸入 (vector&lt;int&gt;)", x: 325, y: 52,
            values: nums.map(String), hl: opt.pick !== undefined ? [opt.pick] : opt.cmp ? [l, r] : [],
            done: used, pointers
          },
          {
            id: "res", type: "array", name: "res", typeLabel: "平方結果 (由後往前填)", x: 325, y: 175,
            values: res.map((v) => (v === null ? "?" : String(v))),
            hl: opt.pos !== undefined && !opt.ret ? [opt.pos] : [],
            match: opt.ret ? res.map((_, t) => t) : res.map((v, t) => t).filter((t) => res[t] !== null && t !== opt.pos),
            pointers: opt.pos !== undefined && opt.pos >= 0 ? [{ idx: opt.pos, label: "pos", color: "green" }] : []
          }
        ];
      };
      const vs = (extra = {}) => Object.assign({ l: String(l), r: String(r) }, extra);

      steps.push(mkStep(6, "初始化雙指標", "default", `l = 0, r = ${n - 1}`,
        `建立長度 ${n} 的結果陣列 res。平方最大的數一定在 nums 的兩端，因此 l 指向最左、r 指向最右，從 res 的最後一格往前填。`,
        vs({ pos: "-", return: "-" }), snap()));

      for (let pos = n - 1; pos >= 0; pos--) {
        const al = Math.abs(nums[l]);
        const ar = Math.abs(nums[r]);
        const leftWins = al > ar;
        steps.push(mkStep(8, "比較兩端絕對值", "tag-check", `|${nums[l]}| = ${al} ${leftWins ? ">" : "≤"} |${nums[r]}| = ${ar}`,
          `比較兩端的絕對值：|nums[${l}]| = ${al}、|nums[${r}]| = ${ar}。${leftWins ? "左端較大" : "右端較大或相等"}，它的平方是剩餘數字中最大的，應放在 res[${pos}]。`,
          vs({ pos: String(pos), return: "-" }), snap({ pos, cmp: `${al} ${leftWins ? ">" : "≤"} ${ar}` }),
          [{ from: `wb-cw-nums-${l}`, to: `wb-cw-nums-${r}`, label: `${al} vs ${ar}`, color: "blue" }]));
        if (leftWins) {
          res[pos] = nums[l] * nums[l];
          steps.push(mkStep(9, "填入左端平方", "tag-insert", `res[${pos}] = ${nums[l]}² = ${res[pos]}`,
            `把 nums[${l}] = ${nums[l]} 的平方 ${res[pos]} 寫入 res[${pos}]。`,
            vs({ pos: String(pos), return: "-" }), snap({ pos, pick: l }),
            [{ from: `wb-cw-nums-${l}`, to: `wb-cw-res-${pos}`, label: `${nums[l]}² = ${res[pos]}`, color: "purple" }]));
          l++;
          steps.push(mkStep(10, "左指標右移", "default", `++l ➜ ${l}`,
            `左端已使用，l 往右移到 ${l}。`, vs({ pos: String(pos), return: "-" }), snap({ pos })));
        } else {
          res[pos] = nums[r] * nums[r];
          steps.push(mkStep(12, "填入右端平方", "tag-insert", `res[${pos}] = ${nums[r]}² = ${res[pos]}`,
            `把 nums[${r}] = ${nums[r]} 的平方 ${res[pos]} 寫入 res[${pos}]。`,
            vs({ pos: String(pos), return: "-" }), snap({ pos, pick: r }),
            [{ from: `wb-cw-nums-${r}`, to: `wb-cw-res-${pos}`, label: `${nums[r]}² = ${res[pos]}`, color: "purple" }]));
          r--;
          steps.push(mkStep(13, "右指標左移", "default", `--r ➜ ${r}`,
            `右端已使用，r 往左移到 ${r}。`, vs({ pos: String(pos), return: "-" }), snap({ pos })));
        }
      }
      steps.push(mkStep(16, "回傳結果", "tag-found", `return ${fmtList(res)}`,
        `res 從後往前全部填滿，已是非遞減排序的平方陣列 ${fmtList(res)}。`,
        vs({ pos: "-1", return: fmtList(res) }), snap({ ret: true }),
        n ? [{ from: "wb-cw-res-0", to: "wb-var-ret", label: "return res", color: "green" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #157 3Sum Closest (LC #16, Medium)
  // ==========================================================================
  window.PROBLEMS["3sum-closest"] = {
    id: 157,
    leetcodeId: 16,
    slug: "3sum-closest",
    title: "16. 3Sum Closest (最接近的三數之和)",
    difficulty: "Medium",
    topic: "Array / Two Pointers / Sorting",
    mins: 30,
    complexity: "Time O(n²) · Space O(log n)",
    argNames: ["nums", "target"],
    description:
      "給定整數陣列 nums 與目標 target，從中選出三個不同位置的數，使三數之和最接近 target，回傳該和（保證答案唯一）。先排序，再固定第一個數 nums[i]，對其右側區間用左右雙指標 l、r：計算 sum 並在 |sum - target| 更小時更新 best；sum 小於 target 時 l 右移讓和變大，大於時 r 左移讓和變小，剛好相等即可直接回傳。排序 O(n log n) 加雙指標 O(n²)，總時間 O(n²)。",

    presets: [
      { name: "範例 1：nums = [-1,2,1,-4], target = 1", args: [[-1, 2, 1, -4], 1] },
      { name: "範例 2：nums = [0,0,0], target = 1", args: [[0, 0, 0], 1] },
      { name: "提早命中：nums = [4,0,5,-5,3,3,0,-4,-5], target = -2", args: [[4, 0, 5, -5, 3, 3, 0, -4, -5], -2] },
      { name: "target 極小：nums = [1,1,1,0], target = -100", args: [[1, 1, 1, 0], -100] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    int threeSumClosest(vector<int>& nums, int target) {",
      "        sort(nums.begin(), nums.end());",
      "        int n = nums.size();",
      "        int best = nums[0] + nums[1] + nums[2];",
      "        for (int i = 0; i < n - 2; ++i) {",
      "            int l = i + 1, r = n - 1;",
      "            while (l < r) {",
      "                int sum = nums[i] + nums[l] + nums[r];",
      "                if (abs(sum - target) < abs(best - target)) best = sum;",
      "                if (sum == target) return sum;",
      "                if (sum < target) ++l;",
      "                else --r;",
      "            }",
      "        }",
      "        return best;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput, targetInput) {
      const nums = clone(numsInput);
      const target = Number(targetInput);
      const steps = [];
      const n = nums.length;
      let best = null;
      let i = -1, l = -1, r = -1, sum = null;

      const snap = (opt = {}) => {
        const pointers = [];
        if (i >= 0) pointers.push({ idx: i, label: "i", color: "purple" });
        if (l >= 0 && l < n && l !== r) pointers.push({ idx: l, label: "l", color: "blue" });
        if (r >= 0 && l !== r) pointers.push({ idx: r, label: "r", color: "red" });
        const trio = i >= 0 && l >= 0 && l < r ? [i, l, r] : [];
        return [
          varsBoard([
            V("target", "target", target),
            V("sum", "sum", sum !== null ? sum : "-", opt.sumHl ? "hl" : ""),
            V("diff", "|sum - target|", sum !== null ? Math.abs(sum - target) : "-"),
            V("best", "best", best !== null ? `${best} (差 ${Math.abs(best - target)})` : "-", opt.bestHl ? "hl" : ""),
            V("ret", "return", opt.ret !== undefined ? opt.ret : "-", opt.ret !== undefined ? "match" : "")
          ], "最接近和變數"),
          {
            id: "nums", type: "array", name: "nums", typeLabel: opt.unsorted ? "原始陣列 (vector&lt;int&gt;)" : "排序後陣列 (vector&lt;int&gt;)",
            x: 325, y: 52, values: nums.map(String),
            hl: opt.ret === undefined ? trio : [], match: opt.matchTrio ? trio : [],
            done: i >= 0 && opt.ret === undefined ? nums.map((_, t) => t).filter((t) => t < i) : [],
            pointers
          }
        ];
      };
      const vs = (extra = {}) => Object.assign({
        i: i >= 0 ? String(i) : "-", l: l >= 0 ? String(l) : "-", r: r >= 0 ? String(r) : "-",
        sum: sum !== null ? String(sum) : "-", best: best !== null ? String(best) : "-"
      }, extra);

      steps.push(mkStep(4, "排序前", "default", "sort(nums)",
        `原始陣列為 ${fmtList(nums)}，target = ${target}。先排序，才能用雙指標依 sum 與 target 的大小決定移動方向。`,
        vs({ return: "-" }), snap({ unsorted: true })));
      nums.sort((a, b) => a - b);
      steps.push(mkStep(4, "排序完成", "tag-insert", `nums = ${fmtList(nums)}`,
        `排序後 nums = ${fmtList(nums)}。`, vs({ return: "-" }), snap()));
      best = nums[0] + nums[1] + nums[2];
      steps.push(mkStep(6, "初始化 best", "default", `best = ${nums[0]} + ${nums[1]} + ${nums[2]} = ${best}`,
        `先以前三個數的和 ${best} 作為目前最接近的答案，與 target 相差 ${Math.abs(best - target)}。`,
        vs({ return: "-" }), snap({ bestHl: true }),
        [{ from: "wb-cw-nums-2", to: "wb-var-best", label: `best = ${best}`, color: "purple" }]));

      for (i = 0; i < n - 2; i++) {
        l = i + 1;
        r = n - 1;
        sum = null;
        steps.push(mkStep(8, `固定 i = ${i}`, "default", `i = ${i}, l = ${l}, r = ${r}`,
          `固定第一個數 nums[${i}] = ${nums[i]}，在它右側區間 [${l}, ${r}] 用左右指標找另外兩個數。`,
          vs({ return: "-" }), snap()));
        while (l < r) {
          sum = nums[i] + nums[l] + nums[r];
          steps.push(mkStep(10, "計算三數和", "tag-check", `sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}`,
            `三數和 sum = ${nums[i]} + ${nums[l]} + ${nums[r]} = ${sum}，與 target 相差 ${Math.abs(sum - target)}。`,
            vs({ return: "-" }), snap({ sumHl: true })));
          if (Math.abs(sum - target) < Math.abs(best - target)) {
            const old = best;
            best = sum;
            steps.push(mkStep(11, "更新 best", "tag-insert", `|${sum} - ${target}| < |${old} - ${target}| ➜ best = ${sum}`,
              `新的和 ${sum} 與 target 差 ${Math.abs(sum - target)}，比目前 best = ${old} 的差 ${Math.abs(old - target)} 更小，更新 best = ${sum}。`,
              vs({ return: "-" }), snap({ bestHl: true }),
              [{ from: `wb-cw-nums-${l}`, to: "wb-var-best", label: `best = ${sum}`, color: "purple" }]));
          } else {
            steps.push(mkStep(11, "保留 best", "tag-check", `|${sum} - ${target}| ≥ |${best} - ${target}|`,
              `和 ${sum} 與 target 差 ${Math.abs(sum - target)}，沒有比 best = ${best} 更接近，保留原值。`,
              vs({ return: "-" }), snap()));
          }
          if (sum === target) {
            steps.push(mkStep(12, "剛好等於 target", "tag-found", `sum == target ➜ return ${sum}`,
              `三數和恰好等於 target = ${target}，不可能更接近了，直接回傳 ${sum}。`,
              vs({ return: String(sum) }), snap({ ret: sum, matchTrio: true }),
              [{ from: `wb-cw-nums-${l}`, to: "wb-var-ret", label: `return ${sum}`, color: "green" }]));
            return steps;
          }
          if (sum < target) {
            l++;
            steps.push(mkStep(13, "和太小，l 右移", "default", `${sum} < ${target} ➜ ++l = ${l}`,
              `sum = ${sum} 小於 target，需要更大的數，左指標右移到 ${l}。`, vs({ return: "-" }), snap()));
          } else {
            r--;
            steps.push(mkStep(14, "和太大，r 左移", "default", `${sum} > ${target} ➜ --r = ${r}`,
              `sum = ${sum} 大於 target，需要更小的數，右指標左移到 ${r}。`, vs({ return: "-" }), snap()));
          }
        }
      }
      i = -1; l = -1; r = -1;
      steps.push(mkStep(17, "回傳最接近的和", "tag-found", `return ${best}`,
        `所有 i 都檢查完畢，最接近 target = ${target} 的三數和為 ${best}（差 ${Math.abs(best - target)}）。`,
        vs({ return: String(best) }), snap({ ret: best }),
        [{ from: "wb-var-best", to: "wb-var-ret", label: `return ${best}`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #158 Rotate List (LC #61, Medium)
  // ==========================================================================
  window.PROBLEMS["rotate-list"] = {
    id: 158,
    leetcodeId: 61,
    slug: "rotate-list",
    title: "61. Rotate List (旋轉鏈結串列)",
    difficulty: "Medium",
    topic: "Linked List / Two Pointers",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head", "k"],
    description:
      "給定單向鏈結串列 head 與非負整數 k，把串列向右旋轉 k 個位置（每次把尾節點移到頭部）。先走到尾端求出長度 len，k 對 len 取餘數去除整圈的重複旋轉；若餘數為 0 直接回傳。否則把尾節點接回 head 形成環，從 head 走 len - k - 1 步找到新的尾節點 newTail，它的下一個節點就是新的頭 newHead，最後把 newTail->next 斷開。時間 O(n)，空間 O(1)。",

    presets: [
      { name: "範例 1：head = [1,2,3,4,5], k = 2", args: [[1, 2, 3, 4, 5], 2] },
      { name: "範例 2：head = [0,1,2], k = 4", args: [[0, 1, 2], 4] },
      { name: "邊界：head = [], k = 0", args: [[], 0] },
      { name: "整圈旋轉：head = [1,2], k = 2", args: [[1, 2], 2] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    ListNode* rotateRight(ListNode* head, int k) {",
      "        if (!head || !head->next || k == 0) return head;",
      "        int len = 1;",
      "        ListNode* tail = head;",
      "        while (tail->next) { tail = tail->next; ++len; }",
      "        k %= len;",
      "        if (k == 0) return head;",
      "        tail->next = head;  // 先接成環",
      "        ListNode* newTail = head;",
      "        for (int i = 0; i < len - k - 1; ++i) newTail = newTail->next;",
      "        ListNode* newHead = newTail->next;",
      "        newTail->next = nullptr;",
      "        return newHead;",
      "    }",
      "};"
    ]),

    generateTrace(headArr, kInput) {
      const vals = clone(headArr);
      const n = vals.length;
      let k = Number(kInput);
      const k0 = k;
      const steps = [];
      // next[idx] = 下一個節點的原始索引（-1 表示 nullptr）
      const next = vals.map((_, t) => (t + 1 < n ? t + 1 : -1));
      let order = vals.map((_, t) => t); // 顯示順序
      let headIdx = n ? 0 : -1;
      const ptrs = {};
      let ringEdge = false;
      const spacing = 92;
      const width = Math.max(460, 60 + Math.max(0, n - 1) * spacing + 60);

      const listStr = (start) => {
        const out = [];
        let c = start;
        const guard = new Set();
        while (c !== -1 && !guard.has(c)) { guard.add(c); out.push(vals[c]); c = next[c]; }
        return fmtList(out);
      };

      const snap = (opt = {}) => {
        const nodes = order.map((idx, p) => {
          const labels = Object.keys(ptrs).filter((key) => ptrs[key] === idx);
          let status = "";
          if (opt.ret) status = "match";
          else if (opt.hl === idx) status = "hl";
          else if (labels.length) status = "done";
          return {
            id: `n${idx}`, val: String(vals[idx]), x: 60 + p * spacing, y: 95, status,
            ptr: labels.join(" / "), sub: next[idx] === -1 ? "next=null" : `next→${vals[next[idx]]}`
          };
        });
        const edges = [];
        order.forEach((idx) => {
          const t = next[idx];
          if (t === -1) return;
          if (ringEdge && t === headIdx && idx === ptrs.tail) return; // 環狀回邊改用連線箭頭呈現
          edges.push({ from: `n${idx}`, to: `n${t}`, label: "next", dir: true, status: opt.edgeFrom === idx ? "hl" : "" });
        });
        return [
          varsBoard([
            V("k", "k", k, opt.hlK ? "hl" : ""),
            V("len", "len", opt.len !== undefined ? opt.len : "-"),
            V("tail", "tail", ptrs.tail !== undefined ? `Node(${vals[ptrs.tail]})` : "-"),
            V("newTail", "newTail", ptrs.newTail !== undefined ? `Node(${vals[ptrs.newTail]})` : "-"),
            V("newHead", "newHead", ptrs.newHead !== undefined ? `Node(${vals[ptrs.newHead]})` : "-"),
            V("ret", "return", opt.retStr || "-", opt.retStr ? "match" : "")
          ], "旋轉指標變數"),
          { id: "list", type: "list", shape: "list", name: "head", typeLabel: "單向鏈結串列 (ListNode*)", x: 325, y: 52, width, height: 195, nodes, edges }
        ];
      };

      if (!n || n === 1 || k === 0) {
        const retStr = fmtList(vals);
        if (n) ptrs.head = 0;
        steps.push(mkStep(4, "不需旋轉", "tag-found", `return ${retStr}`,
          !n ? "串列為空，沒有節點可以旋轉，直接回傳 nullptr。" : n === 1 ? "只有一個節點，怎麼旋轉都一樣，直接回傳 head。" : "k = 0，不需要旋轉，直接回傳 head。",
          { k: String(k), return: retStr }, snap({ ret: true, retStr }),
          n ? [{ from: "wb-node-list-n0", to: "wb-var-ret", label: "return head", color: "green" }] : []));
        return steps;
      }

      ptrs.head = 0;
      steps.push(mkStep(4, "檢查特例", "tag-check", `head 有 ${n} 個節點, k = ${k}`,
        `串列至少有兩個節點且 k = ${k} 不為 0，需要實際旋轉。`, { k: String(k), return: "-" }, snap()));
      let len = 1;
      let tail = 0;
      ptrs.tail = 0;
      steps.push(mkStep(6, "初始化 tail", "default", "len = 1, tail = head",
        `tail 從 head 出發，len 先算 1（head 本身），準備走到尾端計算長度。`,
        { k: String(k), len: "1", return: "-" }, snap({ len, hl: tail })));
      while (next[tail] !== -1) {
        const from = tail;
        tail = next[tail];
        ptrs.tail = tail;
        len++;
        steps.push(mkStep(7, "走向尾端", "tag-check", `tail = ${vals[tail]}, len = ${len}`,
          `tail 往後移到節點 ${vals[tail]}，長度計數 len = ${len}。`,
          { k: String(k), len: String(len), return: "-" }, snap({ len, hl: tail, edgeFrom: from })));
      }
      k = k % len;
      steps.push(mkStep(8, "去除整圈", "tag-check", `k = ${k0} % ${len} = ${k}`,
        `旋轉 ${len} 次會回到原樣，所以只需要旋轉 k % len = ${k} 次。`,
        { k: String(k), len: String(len), return: "-" }, snap({ len, hlK: true })));
      if (k === 0) {
        const retStr = listStr(0);
        steps.push(mkStep(9, "等同不旋轉", "tag-found", `k == 0 ➜ return ${retStr}`,
          `k 取餘後為 0，旋轉剛好整圈，串列不變，直接回傳 head。`,
          { k: "0", len: String(len), return: retStr }, snap({ len, ret: true, retStr }),
          [{ from: "wb-node-list-n0", to: "wb-var-ret", label: "return head", color: "green" }]));
        return steps;
      }
      next[tail] = headIdx;
      ringEdge = true;
      steps.push(mkStep(10, "接成環", "tag-insert", `tail->next = head (${vals[tail]} → ${vals[0]})`,
        `把尾節點 ${vals[tail]} 的 next 指回 head ${vals[0]}，整條串列變成一個環。之後只要在正確位置斷開即可。`,
        { k: String(k), len: String(len), return: "-" }, snap({ len, hl: tail }),
        [{ from: `wb-node-list-n${tail}`, to: "wb-node-list-n0", label: "tail->next = head", color: "purple" }]));
      let newTail = 0;
      ptrs.newTail = 0;
      const ringConn = () => [{ from: `wb-node-list-n${tail}`, to: "wb-node-list-n0", label: "環", color: "blue" }];
      steps.push(mkStep(11, "newTail 從 head 出發", "default", `newTail = head, 需走 ${len - k - 1} 步`,
        `新的尾節點是原本第 len - k = ${len - k} 個節點，因此 newTail 從 head 往後走 len - k - 1 = ${len - k - 1} 步。`,
        { k: String(k), len: String(len), return: "-" }, snap({ len, hl: newTail }), ringConn()));
      for (let i = 0; i < len - k - 1; i++) {
        const from = newTail;
        newTail = next[newTail];
        ptrs.newTail = newTail;
        steps.push(mkStep(12, "移動 newTail", "tag-check", `i = ${i}, newTail = ${vals[newTail]}`,
          `第 ${i + 1} 步：newTail 前進到節點 ${vals[newTail]}。`,
          { k: String(k), len: String(len), i: String(i), return: "-" }, snap({ len, hl: newTail, edgeFrom: from }), ringConn()));
      }
      const newHead = next[newTail];
      ptrs.newHead = newHead;
      steps.push(mkStep(13, "找到新頭", "tag-check", `newHead = newTail->next = ${vals[newHead]}`,
        `newTail（${vals[newTail]}）的下一個節點 ${vals[newHead]} 就是旋轉後的新頭。`,
        { k: String(k), len: String(len), return: "-" }, snap({ len, hl: newHead, edgeFrom: newTail }), ringConn()));
      next[newTail] = -1;
      ringEdge = false;
      steps.push(mkStep(14, "斷開環", "tag-insert", `newTail->next = nullptr`,
        `把 newTail（${vals[newTail]}）的 next 設為 nullptr，在這裡切開環，得到旋轉後的串列。`,
        { k: String(k), len: String(len), return: "-" }, snap({ len, hl: newTail })));
      // 依新順序重新排列節點
      order = [];
      let c = newHead;
      while (c !== -1) { order.push(c); c = next[c]; }
      headIdx = newHead;
      const retStr = listStr(newHead);
      delete ptrs.head;
      steps.push(mkStep(15, "回傳新頭", "tag-found", `return ${retStr}`,
        `回傳 newHead。由新頭開始依序讀取得到 ${retStr}，相當於原串列向右旋轉 ${k0} 次。`,
        { k: String(k), len: String(len), return: retStr }, snap({ len, ret: true, retStr }),
        [{ from: `wb-node-list-n${newHead}`, to: "wb-var-ret", label: "return newHead", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #159 Find Minimum in Rotated Sorted Array (LC #153, Medium)
  // ==========================================================================
  window.PROBLEMS["find-minimum-in-rotated-sorted-array"] = {
    id: 159,
    leetcodeId: 153,
    slug: "find-minimum-in-rotated-sorted-array",
    title: "153. Find Minimum in Rotated Sorted Array (尋找旋轉排序陣列中的最小值)",
    difficulty: "Medium",
    topic: "Binary Search",
    mins: 30,
    complexity: "Time O(log n) · Space O(1)",
    argNames: ["nums"],
    description:
      "一個元素互不相同的遞增陣列在某個位置被旋轉（例如 [0,1,2,4,5,6,7] 變成 [4,5,6,7,0,1,2]），請以 O(log n) 找出最小值。二分搜尋時比較 nums[mid] 與區間右端 nums[hi]：若 nums[mid] > nums[hi]，代表斷點（最小值）一定在 mid 右側，令 lo = mid + 1；否則 mid 到 hi 是遞增段，最小值在 mid 或其左側，令 hi = mid。當 lo == hi 時即指向最小值。時間 O(log n)，空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [3,4,5,1,2]", args: [[3, 4, 5, 1, 2]] },
      { name: "範例 2：nums = [4,5,6,7,0,1,2]", args: [[4, 5, 6, 7, 0, 1, 2]] },
      { name: "範例 3：未旋轉 nums = [11,13,15,17]", args: [[11, 13, 15, 17]] },
      { name: "邊界：nums = [2,1]", args: [[2, 1]] }
    ],

    cppLines: cppLines([
      "class Solution {",
      "public:",
      "    int findMin(vector<int>& nums) {",
      "        int lo = 0, hi = nums.size() - 1;",
      "        while (lo < hi) {",
      "            int mid = lo + (hi - lo) / 2;",
      "            if (nums[mid] > nums[hi]) lo = mid + 1;",
      "            else hi = mid;",
      "        }",
      "        return nums[lo];",
      "    }",
      "};"
    ]),

    generateTrace(numsInput) {
      const nums = clone(numsInput);
      const steps = [];
      let lo = 0;
      let hi = nums.length - 1;
      let mid = null;

      const snap = (opt = {}) => {
        const pointers = [];
        if (lo === hi) pointers.push({ idx: lo, label: "lo = hi", color: opt.ret ? "green" : "blue" });
        else {
          pointers.push({ idx: lo, label: "lo", color: "blue" });
          pointers.push({ idx: hi, label: "hi", color: "red" });
        }
        if (mid !== null && opt.showMid) pointers.push({ idx: mid, label: "mid", color: "purple" });
        const range = [];
        for (let t = lo; t <= hi; t++) range.push(t);
        return [
          varsBoard([
            V("lo", "lo", lo),
            V("hi", "hi", hi),
            V("mid", "mid", mid !== null && opt.showMid ? mid : "-", opt.showMid ? "hl" : ""),
            V("cmp", "nums[mid] vs nums[hi]", opt.cmp || "-", opt.cmp ? "hl" : ""),
            V("ret", "return", opt.ret ? nums[lo] : "-", opt.ret ? "match" : "")
          ], "二分搜尋變數"),
          {
            id: "nums", type: "array", name: "nums", typeLabel: "旋轉排序陣列 (vector&lt;int&gt;)", x: 325, y: 52,
            values: nums.map(String),
            hl: opt.ret ? [] : opt.showMid ? [mid, hi] : range,
            match: opt.ret ? [lo] : [],
            done: nums.map((_, t) => t).filter((t) => t < lo || t > hi),
            pointers
          }
        ];
      };
      const vs = (extra = {}) => Object.assign({ lo: String(lo), hi: String(hi), mid: mid !== null ? String(mid) : "-" }, extra);

      steps.push(mkStep(4, "初始化搜尋區間", "default", `lo = 0, hi = ${hi}`,
        `搜尋區間為整個陣列 [0, ${hi}]。最小值就是「旋轉斷點」右側的第一個元素。`,
        vs({ return: "-" }), snap()));
      while (lo < hi) {
        steps.push(mkStep(5, "區間仍有多個元素", "tag-check", `lo = ${lo} < hi = ${hi}`,
          `區間 [${lo}, ${hi}] 還有 ${hi - lo + 1} 個元素，繼續二分。`, vs({ return: "-" }), snap()));
        mid = lo + Math.floor((hi - lo) / 2);
        steps.push(mkStep(6, "計算 mid", "default", `mid = ${lo} + (${hi} - ${lo}) / 2 = ${mid}`,
          `取中間位置 mid = ${mid}（值 ${nums[mid]}），與區間右端 nums[${hi}] = ${nums[hi]} 比較。`,
          vs({ return: "-" }), snap({ showMid: true })));
        if (nums[mid] > nums[hi]) {
          const cmp = `${nums[mid]} > ${nums[hi]}`;
          const oldMid = mid;
          steps.push(mkStep(7, "最小值在右半", "tag-check", `${cmp} ➜ lo = ${mid + 1}`,
            `nums[mid] = ${nums[mid]} 大於 nums[hi] = ${nums[hi]}，代表 mid 位於旋轉前較大的那一段，斷點一定在 mid 右側，捨棄 [${lo}, ${mid}]。`,
            vs({ return: "-" }), snap({ showMid: true, cmp }),
            [{ from: `wb-cw-nums-${mid}`, to: `wb-cw-nums-${hi}`, label: cmp, color: "red" }]));
          lo = oldMid + 1;
        } else {
          const cmp = `${nums[mid]} ≤ ${nums[hi]}`;
          steps.push(mkStep(8, "最小值在左半（含 mid）", "tag-check", `${nums[mid]} ≤ ${nums[hi]} ➜ hi = ${mid}`,
            `nums[mid] = ${nums[mid]} 不大於 nums[hi] = ${nums[hi]}，[mid, hi] 是遞增段，最小值是 mid 或在它左側，捨棄 [${mid + 1}, ${hi}]。`,
            vs({ return: "-" }), snap({ showMid: true, cmp }),
            [{ from: `wb-cw-nums-${mid}`, to: `wb-cw-nums-${hi}`, label: cmp, color: "blue" }]));
          hi = mid;
        }
      }
      steps.push(mkStep(5, "區間收斂", "tag-check", `lo = hi = ${lo}`,
        `lo 與 hi 相遇於索引 ${lo}，區間只剩一個元素，離開迴圈。`, vs({ return: "-" }), snap()));
      steps.push(mkStep(10, "回傳最小值", "tag-found", `return nums[${lo}] = ${nums[lo]}`,
        `nums[${lo}] = ${nums[lo]} 即為旋轉排序陣列中的最小值。`,
        vs({ return: String(nums[lo]) }), snap({ ret: true }),
        [{ from: `wb-cw-nums-${lo}`, to: "wb-var-ret", label: `min = ${nums[lo]}`, color: "green" }]));
      return steps;
    }
  };
})();

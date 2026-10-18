/**
 * Grind 75 延伸題 — Problems #88 to #99
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  const P = window.PROBLEMS;

  // ==========================================================================
  // 檔內共用輔助函式（不汙染全域）
  // ==========================================================================
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const CPP_KW = new Set(
    "class public private protected struct int bool void char long double auto const return for while do if else nullptr true false new delete break continue unsigned this using static".split(" ")
  );
  const CPP_TYPES = new Set(
    "Solution FreqStack ListNode TreeNode vector string queue stack unordered_map unordered_set map set priority_queue pair function size_t deque".split(" ")
  );

  // 將純文字 C++ 行轉為帶 .tok-* 上色的安全 HTML（<、>、& 皆轉義）。
  const cppHL = (line) => {
    const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|([A-Za-z_]\w*)|(\d+)|([\s\S])/g;
    let out = "";
    let m;
    while ((m = re.exec(line))) {
      if (m[1]) out += `<span class="tok-cmt">${esc(m[1])}</span>`;
      else if (m[2]) out += esc(m[2]);
      else if (m[3]) {
        const w = m[3];
        if (CPP_KW.has(w)) out += `<span class="tok-kw">${w}</span>`;
        else if (CPP_TYPES.has(w)) out += `<span class="tok-type">${w}</span>`;
        else if (/^\s*\(/.test(line.slice(re.lastIndex))) out += `<span class="tok-fn">${w}</span>`;
        else out += w;
      } else if (m[4]) out += `<span class="tok-num">${m[4]}</span>`;
      else out += esc(m[5]);
    }
    return out;
  };
  const cppBlock = (src) =>
    src
      .replace(/^\n+|\n+\s*$/g, "")
      .split("\n")
      .map((code, i) => ({ line: i + 1, code: cppHL(code) }));

  const strVals = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)]));
  const mkStep = (line, tag, tagType, inlineBadge, explanation, vars, state) => ({
    line,
    tag,
    tagType,
    inlineBadge: String(inlineBadge),
    explanation,
    vars: strVals(vars),
    state
  });
  const varsBoard = (items, typeLabel = "關鍵變數與回傳值", y = 215) => ({
    id: "vars",
    type: "vars",
    name: "state_vars",
    typeLabel,
    x: 24,
    y,
    items: items.map((it) => ({ ...it, name: esc(it.name), val: esc(it.val) }))
  });
  const arrStr = (a) => `[${a.join(",")}]`;
  // 圓環座標：圖節點均勻分佈在橢圓上
  const ringPos = (n, w, h) => (i) => {
    if (n === 1) return { x: Math.round(w / 2), y: Math.round(h / 2) };
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: Math.round(w / 2 + (w / 2 - 52) * Math.cos(a)), y: Math.round(h / 2 + (h / 2 - 42) * Math.sin(a)) };
  };

  // ==========================================================================
  // #88 Remove Nth Node From End of List (LC #19, Medium)
  // ==========================================================================
  P["remove-nth-node-from-end-of-list"] = {
    id: 88,
    leetcodeId: 19,
    slug: "remove-nth-node-from-end-of-list",
    title: "19. Remove Nth Node From End of List (刪除鏈結串列的倒數第 N 個節點)",
    difficulty: "Medium",
    topic: "Linked List / Two Pointers",
    mins: 20,
    complexity: "Time O(L) · Space O(1)",
    argNames: ["head", "n"],
    description:
      "給定鏈結串列的頭節點 head，刪除倒數第 n 個節點後回傳新的頭節點。先建立 dummy 節點接在 head 前面，讓 fast 與 slow 都從 dummy 出發；fast 先走 n + 1 步，使兩指標之間恰好相隔 n 個節點，之後兩者同步前進，當 fast 走到 nullptr 時，slow 正好停在待刪節點的前一個位置，執行 slow->next = slow->next->next 即可。只需一次走訪，時間 O(L)、額外空間 O(1)；dummy 節點讓刪除頭節點的情況不必特別處理。",

    presets: [
      { name: "範例 1：head = [1,2,3,4,5], n = 2", args: [[1, 2, 3, 4, 5], 2] },
      { name: "範例 2：head = [1], n = 1（刪除後為空串列）", args: [[1], 1] },
      { name: "範例 3：head = [1,2], n = 1（刪除尾節點）", args: [[1, 2], 1] },
      { name: "邊界：head = [7,8,9], n = 3（刪除頭節點）", args: [[7, 8, 9], 3] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* fast = &dummy;
        ListNode* slow = &dummy;
        for (int i = 0; i <= n; ++i) fast = fast->next;
        while (fast != nullptr) {
            fast = fast->next;
            slow = slow->next;
        }
        ListNode* del = slow->next;
        slow->next = del->next;
        delete del;
        return dummy.next;
    }
};`),

    generateTrace(headInput, nInput) {
      const vals = Array.isArray(headInput) ? headInput.slice() : [];
      const L = vals.length;
      const n = Number(nInput);
      const trace = [];
      // 節點編號：-1 = dummy，0..L-1 = 原串列節點，null = nullptr
      const nxt = new Map();
      nxt.set(-1, L ? 0 : null);
      for (let i = 0; i < L; i++) nxt.set(i, i + 1 < L ? i + 1 : null);
      let fast;
      let slow;
      let del;
      let raised = null;
      let deleted = null;
      let iVar = "-";
      let ret = "-";

      const name = (p) => (p === undefined ? "-" : p === null ? "nullptr" : p === -1 ? "&dummy" : `Node(${vals[p]})`);
      const nid = (p) => (p === -1 ? "d" : p === null ? "nil" : `n${p}`);
      const listStr = () => {
        const a = [];
        let p = nxt.get(-1);
        while (p !== null && p !== undefined) {
          a.push(vals[p]);
          p = nxt.get(p);
        }
        return arrStr(a);
      };
      const X = (p) => 52 + (p + 1) * 88;
      const nilX = 52 + (L + 1) * 88;

      const snap = (o = {}) => {
        const ptrs = (p) =>
          [p === fast ? "fast" : "", p === slow ? "slow" : "", del !== undefined && del === p ? "del" : ""].filter(Boolean).join(" / ");
        const nodes = [
          { id: "d", val: "D", sub: "dummy", x: X(-1), y: 110, status: o.final ? "match" : slow === -1 ? "hl" : "", ptr: ptrs(-1) }
        ];
        for (let i = 0; i < L; i++) {
          if (i === deleted) continue;
          let status = "";
          if (i === raised) status = "warn";
          else if (o.final) status = "match";
          else if (i === fast || i === slow) status = "hl";
          nodes.push({
            id: `n${i}`,
            val: esc(vals[i]),
            sub: `倒數第 ${L - i} 個`,
            x: X(i),
            y: i === raised ? 40 : 110,
            status,
            ptr: ptrs(i)
          });
        }
        nodes.push({ id: "nil", val: "null", sub: "nullptr", x: nilX, y: 110, status: fast === null ? "hl" : "", ptr: fast === null ? "fast" : "" });
        const edges = [];
        for (const [k, v] of nxt) {
          if (k === deleted) continue;
          const isHl = o.hlFrom !== undefined && o.hlFrom === k;
          edges.push({ from: nid(k), to: nid(v), label: isHl ? "next" : "", dir: true, status: isHl ? "hl" : "" });
        }
        return {
          boards: [
            {
              id: "list",
              type: "list",
              shape: "list",
              name: "head",
              typeLabel: "單向鏈結串列 (ListNode*)，D 為 dummy",
              x: 325,
              y: 52,
              width: Math.max(460, nilX + 60),
              height: 190,
              nodes,
              edges
            },
            varsBoard([
              { id: "n", name: "n", val: String(n), status: "" },
              { id: "i", name: "i", val: String(iVar), status: iVar !== "-" ? "hl" : "" },
              { id: "fast", name: "fast", val: name(fast), status: o.hlVar === "fast" ? "hl" : "" },
              { id: "slow", name: "slow", val: name(slow), status: o.hlVar === "slow" ? "hl" : "" },
              { id: "del", name: "del", val: del === undefined ? "-" : name(del), status: del !== undefined && deleted === null ? "warn" : "" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ n, i: iVar, fast: name(fast), slow: name(slow), del: del === undefined ? "-" : name(del), return: ret });

      trace.push(mkStep(4, "建立 dummy 節點", "default", `dummy.next = ${L ? vals[0] : "nullptr"}`,
        `在原串列前面放一個 dummy 節點 D，讓「刪除頭節點」與刪除其他節點的寫法完全相同。串列長度 L = ${L}，要刪除倒數第 ${n} 個節點。`,
        vars(), snap()));

      fast = -1;
      slow = -1;
      trace.push(mkStep(6, "fast、slow 指向 dummy", "default", "fast = slow = &dummy",
        "兩個指標都從 dummy 出發。接下來 fast 要先走 n + 1 步，製造出 n 個節點的間距。",
        vars(), snap()));

      for (let i = 0; i <= n; i++) {
        iVar = i;
        const from = fast;
        fast = nxt.get(fast);
        trace.push(mkStep(7, `fast 先行第 ${i + 1} 步`, "tag-check", `i = ${i}: fast = ${name(fast)}`,
          `i = ${i} ≤ n = ${n}，fast 沿 next 前進到 ${name(fast)}。fast 總共要先走 ${n + 1} 步，目前已走 ${i + 1} 步。`,
          vars(), snap({ hlFrom: from, hlVar: "fast" })));
      }
      iVar = "-";

      while (fast !== null) {
        const ff = fast;
        fast = nxt.get(fast);
        trace.push(mkStep(9, "fast 前進一步", "tag-check", `fast = ${name(fast)}`,
          `fast 仍不是 nullptr，兩指標同步前進：fast 從 ${name(ff)} 移到 ${name(fast)}。`,
          vars(), snap({ hlFrom: ff, hlVar: "fast" })));
        const ss = slow;
        slow = nxt.get(slow);
        trace.push(mkStep(10, "slow 前進一步", "tag-check", `slow = ${name(slow)}`,
          `slow 跟著從 ${name(ss)} 移到 ${name(slow)}，兩者之間仍保持 n = ${n} 個節點的距離。`,
          vars(), snap({ hlFrom: ss, hlVar: "slow" })));
      }

      trace.push(mkStep(8, "fast 抵達 nullptr", "default", "fast == nullptr → 結束迴圈",
        `fast 已走到串列尾端之後的 nullptr，此時 slow 停在 ${name(slow)}，它的下一個節點就是倒數第 ${n} 個節點。`,
        vars(), snap({ hlVar: "slow" })));

      del = nxt.get(slow);
      trace.push(mkStep(12, "鎖定待刪節點 del", "tag-check", `del = ${name(del)}`,
        `令 del = slow->next = ${name(del)}，這就是要刪除的倒數第 ${n} 個節點。`,
        vars(), snap({ hlFrom: slow, connectors: [{ from: `wb-node-list-${nid(slow)}`, to: `wb-node-list-${nid(del)}`, label: "slow->next", color: "red" }] })));

      const after = nxt.get(del);
      nxt.set(slow, after);
      raised = del;
      trace.push(mkStep(13, "跳過 del 重新接線", "tag-insert", `slow->next = ${name(after)}`,
        `把 slow 的 next 直接接到 del->next（${name(after)}），del 就從串列中被繞過了（白板上抬高標紅）。`,
        vars(), snap({ hlFrom: slow, connectors: [{ from: `wb-node-list-${nid(slow)}`, to: `wb-node-list-${nid(after)}`, label: "slow->next = del->next", color: "purple" }] })));

      deleted = del;
      raised = null;
      trace.push(mkStep(14, "釋放 del 記憶體", "default", `delete Node(${vals[del]})`,
        `呼叫 delete 釋放節點 ${vals[del]} 的記憶體，避免記憶體洩漏。`,
        vars(), snap()));

      ret = listStr();
      trace.push(mkStep(15, "回傳 dummy.next", "tag-found", `return ${ret}`,
        `dummy.next 就是新的頭節點，回傳的串列為 ${ret}。${del === 0 ? "這次刪掉的是原本的頭節點，dummy 讓這種情況不需特別處理。" : ""}`,
        vars(), snap({ final: true, connectors: [{ from: "wb-node-list-d", to: "wb-var-ret", label: "dummy.next", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #89 Shortest Path to Get Food (LC #1730, Medium)
  // ==========================================================================
  P["shortest-path-to-get-food"] = {
    id: 89,
    leetcodeId: 1730,
    slug: "shortest-path-to-get-food",
    title: "1730. Shortest Path to Get Food (取得食物的最短路徑)",
    difficulty: "Medium",
    topic: "Graph / Matrix BFS",
    mins: 30,
    complexity: "Time O(m · n) · Space O(m · n)",
    argNames: ["grid"],
    description:
      "在 m × n 的字元網格中，'*' 是你的位置（恰好一個），'#' 是食物，'O' 是可通行的空地，'X' 是障礙物。每一步可以往上下左右移動一格，求走到任一食物格的最短步數，無法抵達時回傳 -1。因為每一步代價都相同，從起點做多來源層序 BFS：每處理完一層，步數加 1；第一次在鄰格看到 '#' 時的層數就是最短距離。走過的格子直接改寫成 'X' 當作 visited 標記。時間與空間皆為 O(m · n)。",

    presets: [
      {
        name: "範例 1：食物在 3 步外",
        args: [[["X", "X", "X", "X", "X", "X"], ["X", "*", "O", "O", "O", "X"], ["X", "O", "O", "#", "O", "X"], ["X", "X", "X", "X", "X", "X"]]]
      },
      {
        name: "範例 2：被牆隔開，無法抵達（-1）",
        args: [[["X", "X", "X", "X", "X"], ["X", "*", "X", "O", "X"], ["X", "O", "X", "#", "X"], ["X", "X", "X", "X", "X"]]]
      },
      {
        name: "範例 3：多個食物，取最近者（6）",
        args: [[
          ["X", "X", "X", "X", "X", "X", "X", "X"],
          ["X", "*", "O", "X", "O", "#", "O", "X"],
          ["X", "O", "O", "X", "O", "O", "X", "X"],
          ["X", "O", "O", "O", "O", "#", "O", "X"],
          ["X", "X", "X", "X", "X", "X", "X", "X"]
        ]]
      },
      { name: "邊界：2 × 2 小網格 [[O,*],[#,O]]", args: [[["O", "*"], ["#", "O"]]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    int getFood(vector<vector<char>>& grid) {
        int m = grid.size(), n = grid[0].size();
        queue<pair<int, int>> q;
        for (int i = 0; i < m; ++i)
            for (int j = 0; j < n; ++j)
                if (grid[i][j] == '*') { q.push({i, j}); grid[i][j] = 'X'; }
        int dirs[5] = {-1, 0, 1, 0, -1};
        for (int steps = 1; !q.empty(); ++steps) {
            for (int k = q.size(); k > 0; --k) {
                auto [r, c] = q.front(); q.pop();
                for (int d = 0; d < 4; ++d) {
                    int x = r + dirs[d], y = c + dirs[d + 1];
                    if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 'X') continue;
                    if (grid[x][y] == '#') return steps;
                    grid[x][y] = 'X';
                    q.push({x, y});
                }
            }
        }
        return -1;
    }
};`),

    generateTrace(gridInput) {
      const grid = (Array.isArray(gridInput) ? gridInput : []).map((row) => row.slice());
      const orig = grid.map((row) => row.slice());
      const m = grid.length;
      const n = m ? grid[0].length : 0;
      const trace = [];
      const dist = grid.map((row) => row.map(() => -1));
      const q = [];
      let stepsVar = "-";
      let cur = null;
      let ret = "-";
      const DIRS = [[-1, 0, "上"], [0, 1, "右"], [1, 0, "下"], [0, -1, "左"]];

      const snap = (o = {}) => {
        const cells = orig.map((row, r) =>
          row.map((ch, c) => (ch === "*" ? "*" : dist[r][c] >= 0 ? String(dist[r][c]) : esc(ch)))
        );
        const hl = [];
        const match = [];
        const done = [];
        const warn = [];
        for (let r = 0; r < m; r++)
          for (let c = 0; c < n; c++) {
            if (dist[r][c] >= 0) done.push(`${r},${c}`);
          }
        if (cur) hl.push(`${cur[0]},${cur[1]}`);
        if (o.newCell) hl.push(`${o.newCell[0]},${o.newCell[1]}`);
        if (o.food) match.push(`${o.food[0]},${o.food[1]}`);
        return {
          boards: [
            {
              id: "g",
              type: "grid",
              name: "grid",
              typeLabel: "網格 (vector<vector<char>>)，數字 = 走訪時的步數",
              x: 325,
              y: 52,
              cells,
              hl,
              match,
              done,
              warn
            },
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "BFS 佇列 (queue<pair<int,int>>)",
              x: 325,
              y: 92 + m * 36,
              items: q.map(([r, c], i) => ({ val: `(${r},${c})`, status: o.newCell && i === q.length - 1 ? "hl" : "" }))
            },
            varsBoard([
              { id: "mn", name: "m × n", val: `${m} × ${n}`, status: "" },
              { id: "steps", name: "steps", val: String(stepsVar), status: stepsVar !== "-" ? "hl" : "" },
              { id: "rc", name: "(r, c)", val: cur ? `(${cur[0]}, ${cur[1]})` : "-", status: cur ? "hl" : "" },
              { id: "qs", name: "q.size()", val: String(q.length), status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret === "-" ? "" : ret === -1 ? "warn" : "match" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ m, n, steps: stepsVar, "(r,c)": cur ? `(${cur[0]},${cur[1]})` : "-", "q.size()": q.length, return: ret });

      trace.push(mkStep(4, "讀取網格大小", "default", `m = ${m}, n = ${n}`,
        `網格共有 ${m} 列、${n} 欄。'*' 是起點、'#' 是食物、'O' 可通行、'X' 是障礙物。`, vars(), snap()));

      let start = null;
      for (let i = 0; i < m && !start; i++) for (let j = 0; j < n; j++) if (grid[i][j] === "*") { start = [i, j]; break; }
      if (start) {
        q.push(start);
        grid[start[0]][start[1]] = "X";
        dist[start[0]][start[1]] = 0;
        trace.push(mkStep(8, "起點入列", "tag-insert", `q.push({${start[0]}, ${start[1]}})`,
          `掃描網格找到起點 '*' 在 (${start[0]}, ${start[1]})，推入佇列並改寫成 'X' 表示已走訪（白板以步數 0 標示）。`,
          vars(), snap({ connectors: [{ from: `wb-grid-g-${start[0]}-${start[1]}`, to: "wb-queue-q-0", label: "push 起點", color: "purple" }] })));
      }

      for (let steps = 1; q.length > 0; steps++) {
        stepsVar = steps;
        cur = null;
        const k = q.length;
        trace.push(mkStep(10, `開始第 ${steps} 層`, "default", `steps = ${steps}, k = q.size() = ${k}`,
          `佇列裡的 ${k} 個格子都距離起點 ${steps - 1} 步；從它們再走一步能到的格子，距離就是 ${steps}。`, vars(), snap()));
        for (let kk = k; kk > 0; kk--) {
          const [r, c] = q.shift();
          cur = [r, c];
          const notes = DIRS.map(([dr, dc, nm]) => {
            const x = r + dr;
            const y = c + dc;
            if (x < 0 || x >= m || y < 0 || y >= n) return `${nm}出界`;
            if (grid[x][y] === "X") return `${nm}(${x},${y}) 是 X`;
            if (grid[x][y] === "#") return `${nm}(${x},${y}) 是食物`;
            return `${nm}(${x},${y}) 可走`;
          });
          trace.push(mkStep(12, `取出 (${r}, ${c})`, "tag-check", `r = ${r}, c = ${c}`,
            `從佇列前端取出 (${r}, ${c})，檢查四個方向：${notes.join("、")}。出界或是 'X'（牆或已走訪）的方向直接 continue。`,
            vars(), snap()));
          for (const [dr, dc] of DIRS) {
            const x = r + dr;
            const y = c + dc;
            if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] === "X") continue;
            if (grid[x][y] === "#") {
              ret = steps;
              trace.push(mkStep(16, "抵達食物！", "tag-found", `grid[${x}][${y}] == '#' → return ${steps}`,
                `鄰格 (${x}, ${y}) 是食物 '#'。BFS 依層擴展，第一次碰到食物時的層數就是最短距離，回傳 ${steps}。`,
                vars(), snap({ food: [x, y], connectors: [
                  { from: `wb-grid-g-${r}-${c}`, to: `wb-grid-g-${x}-${y}`, label: `第 ${steps} 步`, color: "green" }
                ] })));
              return trace;
            }
            grid[x][y] = "X";
            dist[x][y] = steps;
            q.push([x, y]);
            trace.push(mkStep(18, `(${x}, ${y}) 入列`, "tag-insert", `grid[${x}][${y}] = 'X'; q.push({${x}, ${y}})`,
              `鄰格 (${x}, ${y}) 是空地，標記為已走訪（距離 ${steps}）並推入佇列，等下一層再往外擴展。`,
              vars(), snap({ newCell: [x, y], connectors: [
                { from: `wb-grid-g-${x}-${y}`, to: `wb-queue-q-${q.length - 1}`, label: `push (${x},${y})`, color: "purple" }
              ] })));
          }
        }
      }

      cur = null;
      ret = -1;
      trace.push(mkStep(22, "無法抵達食物", "default", "return -1",
        "佇列已清空，所有能走到的格子都探索過了，仍沒有碰到任何食物，回傳 -1。", vars(), snap()));
      return trace;
    }
  };

  // ==========================================================================
  // #90 Find the Duplicate Number (LC #287, Medium)
  // ==========================================================================
  P["find-the-duplicate-number"] = {
    id: 90,
    leetcodeId: 287,
    slug: "find-the-duplicate-number",
    title: "287. Find the Duplicate Number (尋找重複的數字)",
    difficulty: "Medium",
    topic: "Array / Two Pointers (Floyd Cycle)",
    mins: 20,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "長度為 n + 1 的陣列 nums 只包含 1 到 n 的整數，且恰好有一個數字重複（可能重複多次），要在不修改陣列、只用 O(1) 額外空間的條件下找出它。把每個索引 i 看成一個節點、i → nums[i] 看成一條邊，從索引 0 出發一定會走進一個環，而環的入口就是重複的數字（有兩個索引指向它）。使用 Floyd 龜兔賽跑：slow 每次走一步、fast 每次走兩步，相遇後把 slow 放回起點，兩者都改為每次一步，再次相遇的位置就是環的入口。時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [1,3,4,2,2]", args: [[1, 3, 4, 2, 2]] },
      { name: "範例 2：nums = [3,1,3,4,2]", args: [[3, 1, 3, 4, 2]] },
      { name: "範例 3：nums = [3,3,3,3,3]（同一數字重複多次）", args: [[3, 3, 3, 3, 3]] },
      { name: "範例 4：nums = [2,5,9,6,9,3,8,9,7,1]", args: [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.slice() : [];
      const N = nums.length;
      const trace = [];
      let slow;
      let fast;
      let phase = "第一階段：找相遇點";
      let ret = "-";
      const W = N > 6 ? 520 : 440;
      const H = N > 6 ? 270 : 220;
      const pos = ringPos(N, W, H);

      const snap = (o = {}) => {
        const ptrs = [];
        if (slow !== undefined) ptrs.push({ idx: slow, label: "slow", color: "blue" });
        if (fast !== undefined) ptrs.push({ idx: fast, label: "fast", color: "red" });
        const nodes = nums.map((v, i) => {
          const p = pos(i);
          const lab = [i === slow ? "slow" : "", i === fast ? "fast" : ""].filter(Boolean).join(" / ");
          let status = "";
          if (ret !== "-" && i === ret) status = "match";
          else if (i === slow || i === fast) status = "hl";
          return { id: String(i), val: String(i), sub: nums[i] === i ? `→ 自己` : `→ ${nums[i]}`, x: p.x, y: p.y, status, ptr: lab };
        });
        const edges = [];
        nums.forEach((v, i) => {
          if (v === i || v < 0 || v >= N) return;
          const isHl = (o.hlEdges || []).some(([a, b]) => a === i && b === v);
          edges.push({ from: String(i), to: String(v), dir: true, status: isHl ? "hl" : ret !== "-" && v === ret ? "match" : "" });
        });
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "陣列 (vector<int>)：索引 i 指向 nums[i]",
              x: 325,
              y: 52,
              values: nums.slice(),
              hl: o.hlIdx || [],
              match: ret !== "-" ? nums.map((v, i) => (v === ret ? i : -1)).filter((i) => i >= 0) : [],
              pointers: ptrs
            },
            {
              id: "g",
              type: "graph",
              shape: "graph",
              name: "i → nums[i]",
              typeLabel: "隱含的函數圖（必定有環）",
              x: 325,
              y: 190,
              width: W,
              height: H,
              nodes,
              edges
            },
            varsBoard([
              { id: "phase", name: "階段", val: phase, status: "" },
              { id: "slow", name: "slow", val: slow === undefined ? "-" : String(slow), status: o.hlVar === "slow" ? "hl" : "" },
              { id: "fast", name: "fast", val: fast === undefined ? "-" : String(fast), status: o.hlVar === "fast" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ slow: slow === undefined ? "-" : slow, fast: fast === undefined ? "-" : fast, return: ret });

      slow = nums[0];
      fast = nums[0];
      trace.push(mkStep(4, "slow、fast 從 nums[0] 出發", "default", `slow = fast = nums[0] = ${nums[0]}`,
        `把索引看成節點、i → nums[i] 看成邊。從節點 0 出發先走一步，slow 與 fast 都位於 ${nums[0]}。`,
        vars(), snap({ hlEdges: [[0, nums[0]]], hlIdx: [0] })));

      let guard = 0;
      do {
        const s0 = slow;
        slow = nums[slow];
        trace.push(mkStep(6, "slow 走一步", "tag-check", `slow = nums[${s0}] = ${slow}`,
          `烏龜 slow 讀取 nums[${s0}] = ${slow}，沿邊 ${s0} → ${slow} 前進一步。`,
          vars(), snap({ hlEdges: [[s0, slow]], hlVar: "slow", connectors: [{ from: `wb-cw-nums-${s0}`, to: `wb-node-g-${slow}`, label: `nums[${s0}]`, color: "blue" }] })));
        const f0 = fast;
        const mid = nums[fast];
        fast = nums[mid];
        trace.push(mkStep(7, "fast 走兩步", "tag-check", `fast = nums[nums[${f0}]] = nums[${mid}] = ${fast}`,
          `兔子 fast 一次走兩步：${f0} → ${mid} → ${fast}。`,
          vars(), snap({ hlEdges: [[f0, mid], [mid, fast]], hlVar: "fast", connectors: [{ from: `wb-cw-nums-${mid}`, to: `wb-node-g-${fast}`, label: `nums[${mid}]`, color: "red" }] })));
        trace.push(mkStep(8, slow === fast ? "龜兔相遇" : "尚未相遇", slow === fast ? "tag-found" : "default", `slow (${slow}) ${slow === fast ? "==" : "!="} fast (${fast})`,
          slow === fast
            ? `slow 與 fast 在節點 ${slow} 相遇，證明從 0 出發的路徑上存在環。相遇點不一定是入口，接著進入第二階段。`
            : `slow = ${slow}、fast = ${fast} 不相等，fast 在環中追趕 slow，繼續迴圈。`,
          vars(), snap({ hlIdx: [slow, fast] })));
      } while (slow !== fast && ++guard < 100);

      phase = "第二階段：找環入口";
      slow = nums[0];
      trace.push(mkStep(9, "slow 回到起點", "tag-insert", `slow = nums[0] = ${slow}`,
        `把 slow 放回起點的下一步 nums[0] = ${slow}，fast 留在相遇點 ${fast}。數學上兩者到環入口的距離相同，之後兩人都改為一次一步。`,
        vars(), snap({ hlVar: "slow", hlEdges: [[0, slow]] })));

      while (slow !== fast) {
        const s0 = slow;
        const f0 = fast;
        trace.push(mkStep(10, "尚未相遇", "default", `slow (${slow}) != fast (${fast})`,
          `slow = ${slow}、fast = ${fast} 還不相等，兩者各前進一步。`, vars(), snap({ hlIdx: [slow, fast] })));
        slow = nums[slow];
        trace.push(mkStep(11, "slow 走一步", "tag-check", `slow = nums[${s0}] = ${slow}`,
          `slow 沿邊 ${s0} → ${slow} 前進。`, vars(), snap({ hlEdges: [[s0, slow]], hlVar: "slow" })));
        fast = nums[fast];
        trace.push(mkStep(12, "fast 走一步", "tag-check", `fast = nums[${f0}] = ${fast}`,
          `fast 沿邊 ${f0} → ${fast} 前進（第二階段只走一步）。`, vars(), snap({ hlEdges: [[f0, fast]], hlVar: "fast" })));
      }

      trace.push(mkStep(10, "在環入口相遇", "tag-check", `slow (${slow}) == fast (${fast})`,
        `slow 與 fast 在節點 ${slow} 相遇，這就是環的入口：有兩個不同索引都指向 ${slow}。`, vars(), snap({ hlIdx: [slow] })));
      ret = slow;
      const srcs = nums.map((v, i) => (v === ret ? i : -1)).filter((i) => i >= 0);
      trace.push(mkStep(14, "回傳重複數字", "tag-found", `return ${ret}`,
        `索引 ${srcs.join("、")} 的值都是 ${ret}，因此 ${ret} 就是重複的數字。`,
        vars(), snap({ connectors: [{ from: `wb-node-g-${ret}`, to: "wb-var-ret", label: `入口 = ${ret}`, color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #91 Top K Frequent Words (LC #692, Medium)
  // ==========================================================================
  P["top-k-frequent-words"] = {
    id: 91,
    leetcodeId: 692,
    slug: "top-k-frequent-words",
    title: "692. Top K Frequent Words (前 K 個高頻單詞)",
    difficulty: "Medium",
    topic: "Hash Table / Heap (Priority Queue)",
    mins: 30,
    complexity: "Time O(n log k) · Space O(n)",
    argNames: ["words", "k"],
    description:
      "給定字串陣列 words 與整數 k，回傳出現次數最多的前 k 個單字，依出現次數由高到低排列；次數相同時依字典序由小到大排列。先用 unordered_map<string, int> 統計每個單字的次數，再維護一個大小不超過 k 的最小堆積：堆頂永遠是目前候選中「最弱」的單字（次數最少，次數相同時字典序最大）。每放入一個單字後，若堆積大小超過 k 就彈出堆頂。最後依序彈出堆積並由後往前填入答案。時間 O(n log k)、空間 O(n)。",

    presets: [
      { name: "範例 1：words = [i,love,leetcode,i,love,coding], k = 2", args: [["i", "love", "leetcode", "i", "love", "coding"], 2] },
      { name: "範例 2：words = [the,day,is,sunny,the,the,the,sunny,is,is], k = 4", args: [["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], 4] },
      { name: "範例 3：次數全相同，依字典序 words = [c,b,a], k = 3", args: [["c", "b", "a"], 3] },
      { name: "邊界：words = [aaa,aa,a], k = 1", args: [["aaa", "aa", "a"], 1] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    vector<string> topKFrequent(vector<string>& words, int k) {
        unordered_map<string, int> cnt;
        for (const string& w : words) ++cnt[w];
        auto cmp = [](const pair<int, string>& a, const pair<int, string>& b) {
            return a.first != b.first ? a.first > b.first : a.second < b.second;
        };
        priority_queue<pair<int, string>, vector<pair<int, string>>, decltype(cmp)> pq(cmp);
        for (const auto& [w, c] : cnt) {
            pq.push({c, w});
            if ((int)pq.size() > k) pq.pop();
        }
        vector<string> res(k);
        for (int i = k - 1; i >= 0; --i) {
            res[i] = pq.top().second;
            pq.pop();
        }
        return res;
    }
};`),

    generateTrace(wordsInput, kInput) {
      const words = Array.isArray(wordsInput) ? wordsInput.slice() : [];
      const k = Number(kInput);
      const trace = [];
      const cnt = new Map();
      let heap = []; // 依「最弱在前」排序：次數小者在前，次數相同時字典序大者在前
      let res = null;
      let ret = "-";
      let wIdx = -1;
      let curWord = null;
      const weaker = (a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0);
      const q = (s) => `"${s}"`;

      const snap = (o = {}) => {
        const rows = [...cnt.entries()].map(([w, c]) => ({
          id: `w-${w}`,
          key: esc(q(w)),
          val: String(c),
          note: o.rowNote && o.rowNote[0] === w ? o.rowNote[1] : "",
          status: curWord === w ? (o.rowStatus || "inserted") : ""
        }));
        const boards = [
          {
            id: "words",
            type: "array",
            name: "words",
            typeLabel: "輸入 (vector<string>)",
            x: 325,
            y: 52,
            values: words.map((w) => esc(w)),
            hl: wIdx >= 0 ? [wIdx] : [],
            done: wIdx >= 0 ? Array.from({ length: wIdx }, (_, i) => i) : [],
            pointers: wIdx >= 0 ? [{ idx: wIdx, label: "w", color: "blue" }] : []
          },
          {
            id: "cnt",
            type: "dict",
            name: "cnt",
            typeLabel: "次數表 (unordered_map<string,int>)",
            x: 325,
            y: 175,
            headers: ["word", "count", "狀態"],
            rows,
            slot: o.slot || null
          },
          {
            id: "pq",
            type: "queue",
            name: "pq",
            typeLabel: `最小堆積 (大小 ≤ k = ${k})`,
            x: 640,
            y: 175,
            leftLabel: "top：最弱 ←",
            rightLabel: "← 較強",
            items: heap.map(([c, w], i) => ({ val: esc(`(${c},${q(w)})`), status: o.heapHl === i ? "hl" : o.heapWarn === i ? "warn" : "" }))
          }
        ];
        if (res) {
          boards.push({
            id: "res",
            type: "array",
            name: "res",
            typeLabel: "答案 (vector<string>)",
            x: 640,
            y: 300,
            values: res.map((w) => (w === null ? '""' : esc(q(w)))),
            hl: o.resHl !== undefined ? [o.resHl] : [],
            match: ret !== "-" ? res.map((_, i) => i) : [],
            pointers: o.resHl !== undefined ? [{ idx: o.resHl, label: `i = ${o.resHl}`, color: "purple" }] : []
          });
        }
        boards.push(
          varsBoard([
            { id: "k", name: "k", val: String(k), status: "" },
            { id: "w", name: "w", val: curWord === null ? "-" : q(curWord), status: curWord !== null ? "hl" : "" },
            { id: "size", name: "pq.size()", val: String(heap.length), status: heap.length > k ? "warn" : "" },
            { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
          ])
        );
        return { boards, connectors: o.connectors || [] };
      };
      const vars = () => ({ k, w: curWord === null ? "-" : q(curWord), "cnt.size()": cnt.size, "pq.size()": heap.length, return: ret });

      trace.push(mkStep(4, "建立次數表", "default", "cnt = {}", `準備用 unordered_map 統計 ${words.length} 個單字各出現幾次。`, vars(), snap()));
      words.forEach((w, i) => {
        wIdx = i;
        curWord = w;
        const isNew = !cnt.has(w);
        cnt.set(w, (cnt.get(w) || 0) + 1);
        trace.push(mkStep(5, isNew ? `新單字 ${q(w)}` : `${q(w)} 次數 +1`, "tag-insert", `++cnt[${q(w)}] → ${cnt.get(w)}`,
          isNew ? `第一次看到 ${q(w)}，在 cnt 中建立鍵並記為 1。` : `${q(w)} 再次出現，cnt[${q(w)}] 增加為 ${cnt.get(w)}。`,
          vars(), snap({ connectors: [{ from: `wb-cw-words-${i}`, to: `wb-dict-row-w-${w}`, label: `++cnt`, color: "purple" }] })));
      });
      wIdx = -1;
      curWord = null;
      trace.push(mkStep(8, "定義比較器", "default", "cmp：次數大者較強；同次數字典序小者較強",
        "比較器讓 priority_queue 的堆頂成為「最弱」的候選：次數最少者，若次數相同則字典序較大者。這樣超過 k 個時彈出堆頂，剩下的就是最強的 k 個。",
        vars(), snap()));

      for (const [w, c] of cnt) {
        curWord = w;
        heap.push([c, w]);
        heap.sort(weaker);
        const at = heap.findIndex((e) => e[1] === w);
        trace.push(mkStep(11, `放入 (${c}, ${q(w)})`, "tag-insert", `pq.push({${c}, ${q(w)}})`,
          `走訪 cnt（unordered_map 走訪順序不固定，結果與順序無關），把 (${c}, ${q(w)}) 放入堆積；堆積依強弱自動調整，目前大小 ${heap.length}。`,
          vars(), snap({ heapHl: at, rowStatus: "hit", connectors: [{ from: `wb-dict-row-w-${w}`, to: `wb-queue-pq-${at}`, label: "push", color: "purple" }] })));
        if (heap.length > k) {
          const top = heap[0];
          trace.push(mkStep(12, "超過 k，彈出最弱者", "tag-check", `pq.size() = ${heap.length} > ${k} → pop (${top[0]},${q(top[1])})`,
            `堆積大小 ${heap.length} 超過 k = ${k}，彈出堆頂 (${top[0]}, ${q(top[1])})——它是目前最不可能進入前 ${k} 名的單字。`,
            vars(), snap({ heapWarn: 0, rowStatus: "hit" })));
          heap.shift();
        } else {
          trace.push(mkStep(12, "大小未超過 k", "default", `pq.size() = ${heap.length} ≤ ${k}`,
            `堆積大小 ${heap.length} 還沒超過 k = ${k}，保留所有候選。`, vars(), snap({ rowStatus: "hit" })));
        }
      }
      curWord = null;
      res = new Array(k).fill(null);
      trace.push(mkStep(14, "建立答案陣列", "default", `res(${k})`,
        `堆積中剩下的 ${heap.length} 個就是答案，但堆頂是最弱的，所以要從 res 的尾端往前填。`, vars(), snap()));
      for (let i = k - 1; i >= 0; i--) {
        const [c, w] = heap[0];
        res[i] = w;
        trace.push(mkStep(16, `res[${i}] = ${q(w)}`, "tag-insert", `res[${i}] = pq.top().second = ${q(w)}`,
          `堆頂 (${c}, ${q(w)}) 是剩餘候選中最弱的，放在 res[${i}]。`,
          vars(), snap({ heapHl: 0, resHl: i, connectors: [{ from: "wb-queue-pq-0", to: `wb-cw-res-${i}`, label: "top", color: "purple" }] })));
        heap.shift();
        trace.push(mkStep(17, "彈出堆頂", "default", "pq.pop()", `彈出已填入的堆頂，剩下 ${heap.length} 個候選。`, vars(), snap({ resHl: i })));
      }
      ret = arrStr(res.map(q));
      trace.push(mkStep(19, "回傳前 k 名", "tag-found", `return ${ret}`,
        `res 依次數由高到低（同次數依字典序）排列：${ret}。`,
        vars(), snap({ connectors: [{ from: "wb-cw-res-0", to: "wb-var-ret", label: "res", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #92 Binary Tree Maximum Path Sum (LC #124, Hard)
  // ==========================================================================
  P["binary-tree-maximum-path-sum"] = {
    id: 92,
    leetcodeId: 124,
    slug: "binary-tree-maximum-path-sum",
    title: "124. Binary Tree Maximum Path Sum (二元樹中的最大路徑和)",
    difficulty: "Hard",
    topic: "Binary Tree / DFS (Post-order)",
    mins: 35,
    complexity: "Time O(N) · Space O(H)",
    argNames: ["root"],
    description:
      "路徑是樹中沿著父子邊相連的一串節點，每個節點最多出現一次，不一定要經過根節點。給定二元樹 root，回傳所有非空路徑中最大的節點值總和。使用後序 DFS：dfs(node) 回傳「從 node 往下延伸的單邊路徑」最大和，子樹貢獻若為負數就以 0 取代（直接捨棄）。在每個節點計算「以它為最高點、左右兩邊都可延伸」的路徑和 node->val + left + right 來更新全域答案 best，而回傳給父節點時只能選擇較大的一邊。每個節點只拜訪一次，時間 O(N)、遞迴深度 O(H)。",

    presets: [
      { name: "範例 1：root = [1,2,3]", args: [[1, 2, 3]] },
      { name: "範例 2：root = [-10,9,20,null,null,15,7]", args: [[-10, 9, 20, null, null, 15, 7]] },
      { name: "範例 3：單一負數節點 root = [-3]", args: [[-3]] },
      { name: "範例 4：root = [5,4,8,11,null,13,4,7,2,null,null,null,1]", args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]] },
      { name: "邊界：負數子樹被捨棄 root = [2,-1,-2]", args: [[2, -1, -2]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    int maxPathSum(TreeNode* root) {
        int best = INT_MIN;
        dfs(root, best);
        return best;
    }
    int dfs(TreeNode* node, int& best) {
        if (node == nullptr) return 0;
        int left = max(0, dfs(node->left, best));
        int right = max(0, dfs(node->right, best));
        best = max(best, node->val + left + right);
        return node->val + max(left, right);
    }
};`),

    generateTrace(rootInput) {
      const arr = Array.isArray(rootInput) ? rootInput.slice() : [];
      const tree = buildTreeFromLevelOrder(arr, 620);
      const trace = [];
      let best = null;
      let ret = "-";
      const gain = {};
      const frames = [];
      const status = {};
      let cur = null;
      let lv = "-";
      let rv = "-";
      let bestPath = new Set();
      const bestStr = () => (best === null ? "INT_MIN" : String(best));

      const snap = (o = {}) => {
        const nodes = tree.nodes.map((n) => ({
          id: n.id,
          val: String(n.val),
          sub: gain[n.id] !== undefined ? `回傳 ${gain[n.id]}` : "",
          x: n.x,
          y: n.y,
          status: bestPath.has(n.id) ? "match" : cur && cur.id === n.id ? "hl" : status[n.id] || "",
          ptr: cur && cur.id === n.id ? "node" : ""
        }));
        const edges = tree.edges.map((e) => ({
          ...e,
          status: bestPath.has(e.from) && bestPath.has(e.to) ? "match" : (o.hlEdges || []).some(([a, b]) => a === e.from && b === e.to) ? "hl" : ""
        }));
        return {
          boards: [
            { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)", x: 325, y: 52, width: tree.width, height: tree.height, nodes, edges },
            {
              id: "calls",
              type: "stack",
              name: "呼叫堆疊",
              typeLabel: "遞迴 dfs(node) 框架",
              x: 325 + tree.width + 24,
              y: 52,
              items: frames.map((f, i) => ({ val: `dfs(${f.val})`, status: i === frames.length - 1 ? "hl" : "" }))
            },
            varsBoard([
              { id: "node", name: "node", val: cur ? `Node(${cur.val})` : "-", status: cur ? "hl" : "" },
              { id: "left", name: "left", val: String(lv), status: o.hlVar === "left" ? "hl" : "" },
              { id: "right", name: "right", val: String(rv), status: o.hlVar === "right" ? "hl" : "" },
              { id: "best", name: "best", val: bestStr(), status: o.hlVar === "best" ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" && o.final ? "match" : ret !== "-" ? "hl" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ node: cur ? cur.val : "-", left: lv, right: rv, best: bestStr(), return: ret });

      trace.push(mkStep(4, "best 初始化", "default", "best = INT_MIN",
        "best 記錄目前看過的最大路徑和。節點值可能全為負數，所以從 INT_MIN 開始，而不是 0。", vars(), snap()));
      cur = tree.root;
      trace.push(mkStep(5, "從根節點開始 DFS", "default", `dfs(Node(${tree.root.val}), best)`,
        `呼叫 dfs(root)。dfs 採後序走訪：先算完左右子樹能提供的最大單邊路徑，再處理自己。`, vars(), snap()));
      cur = null;

      let bestInfo = null;
      const dfs = (node, parent) => {
        if (!node) return 0;
        frames.push(node);
        cur = node;
        lv = "-";
        rv = "-";
        ret = "-";
        trace.push(mkStep(9, `進入 dfs(${node.val})`, "default", `node = ${node.val} ≠ nullptr`,
          `進入節點 ${node.val}，它不是空節點，先遞迴計算左子樹${node.left ? ` (Node ${node.left.val})` : "（空）"}的貢獻。`,
          vars(), snap({ hlEdges: parent ? [[parent.id, node.id]] : [] })));
        const lg = dfs(node.left, node);
        const left = Math.max(0, lg);
        cur = node;
        lv = left;
        rv = "-";
        ret = "-";
        trace.push(mkStep(10, `左貢獻 left = ${left}`, "tag-check", `left = max(0, ${lg}) = ${left}`,
          node.left
            ? lg < 0
              ? `左子樹最多只能提供 ${lg}（負數），接上反而變小，所以取 0，等於捨棄左邊。`
              : `左子樹最多能提供 ${lg}，left = ${left}。`
            : "左子節點是 nullptr，dfs 直接回傳 0，left = 0。",
          vars(), snap({ hlVar: "left", connectors: node.left ? [{ from: `wb-node-tree-${node.left.id}`, to: "wb-var-left", label: `gain ${lg}`, color: "blue" }] : [] })));
        const rg = dfs(node.right, node);
        const right = Math.max(0, rg);
        cur = node;
        lv = left;
        rv = right;
        ret = "-";
        trace.push(mkStep(11, `右貢獻 right = ${right}`, "tag-check", `right = max(0, ${rg}) = ${right}`,
          node.right
            ? rg < 0
              ? `右子樹最多只能提供 ${rg}（負數），取 0 捨棄右邊。`
              : `右子樹最多能提供 ${rg}，right = ${right}。`
            : "右子節點是 nullptr，dfs 直接回傳 0，right = 0。",
          vars(), snap({ hlVar: "right", connectors: node.right ? [{ from: `wb-node-tree-${node.right.id}`, to: "wb-var-right", label: `gain ${rg}`, color: "blue" }] : [] })));
        const cand = node.val + left + right;
        const old = best;
        const updated = best === null || cand > best;
        if (updated) {
          best = cand;
          bestInfo = { node, left, right };
        }
        trace.push(mkStep(12, updated ? "更新 best" : "best 不變", updated ? "tag-found" : "tag-check",
          `best = max(${old === null ? "INT_MIN" : old}, ${node.val} + ${left} + ${right} = ${cand}) = ${best}`,
          updated
            ? `以節點 ${node.val} 為轉折點、左右兩邊都延伸的路徑和為 ${cand}，比原本的 ${old === null ? "INT_MIN" : old} 大，更新 best = ${best}。`
            : `以節點 ${node.val} 為轉折點的路徑和 ${cand} 沒有超過 best = ${best}，維持不變。`,
          vars(), snap({ hlVar: "best", connectors: updated ? [{ from: `wb-node-tree-${node.id}`, to: "wb-var-best", label: `${cand}`, color: "green" }] : [] })));
        const g = node.val + Math.max(left, right);
        gain[node.id] = g;
        ret = g;
        status[node.id] = "done";
        trace.push(mkStep(13, `回傳單邊最大值 ${g}`, "tag-insert", `return ${node.val} + max(${left}, ${right}) = ${g}`,
          `往上回傳時路徑不能分岔，只能挑較大的一邊：${node.val} + ${Math.max(left, right)} = ${g}${parent ? `，交給父節點 ${parent.val}` : "，回到 maxPathSum"}。`,
          vars(), snap({ connectors: parent ? [{ from: `wb-node-tree-${node.id}`, to: `wb-node-tree-${parent.id}`, label: `回傳 ${g}`, color: "purple" }] : [] })));
        frames.pop();
        return g;
      };
      dfs(tree.root, null);

      // 重建最佳路徑以便在白板上標綠
      const nodeById = {};
      tree.nodes.forEach((n) => (nodeById[n.id] = n));
      const chain = (u) => {
        if (!u) return;
        bestPath.add(u.id);
        const lg = u.left ? Math.max(0, gain[u.left.id]) : 0;
        const rg = u.right ? Math.max(0, gain[u.right.id]) : 0;
        if (Math.max(lg, rg) > 0) chain(lg >= rg ? u.left : u.right);
      };
      bestPath.add(bestInfo.node.id);
      if (bestInfo.left > 0) chain(bestInfo.node.left);
      if (bestInfo.right > 0) chain(bestInfo.node.right);
      cur = null;
      lv = "-";
      rv = "-";
      ret = best;
      trace.push(mkStep(6, "回傳最大路徑和", "tag-found", `return best = ${best}`,
        `所有節點都處理完畢，最大路徑和為 ${best}（白板上綠色節點組成的路徑）。`,
        vars(), snap({ final: true, connectors: [{ from: `wb-node-tree-${bestInfo.node.id}`, to: "wb-var-ret", label: `best = ${best}`, color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #93 Maximum Frequency Stack (LC #895, Hard)
  // ==========================================================================
  P["maximum-frequency-stack"] = {
    id: 93,
    leetcodeId: 895,
    slug: "maximum-frequency-stack",
    title: "895. Maximum Frequency Stack (最大頻率堆疊)",
    difficulty: "Hard",
    topic: "Stack / Hash Table (Design)",
    mins: 40,
    complexity: "Time O(1) per op · Space O(N)",
    argNames: ["operations", "values"],
    description:
      "設計 FreqStack：push(val) 放入整數，pop() 移除並回傳目前出現頻率最高的元素；若有多個元素頻率並列最高，移除其中最接近堆疊頂端（最晚放入）的那一個。以 freq 雜湊表記錄每個值目前的頻率，並為每個頻率 f 準備一個堆疊 group[f]，存放「第 f 次被放入」的值；maxFreq 記錄目前最高頻率。push 時把值放進 group[++freq[val]]；pop 時從 group[maxFreq] 頂端取值，因為同一頻率堆疊內越晚放入越靠近頂端，剛好滿足並列時取最近者的規則；該堆疊空了就把 maxFreq 減 1。每個操作都是 O(1)。",

    presets: [
      {
        name: "範例 1：push 5,7,5,7,4,5 後 pop 四次",
        args: [
          ["FreqStack", "push", "push", "push", "push", "push", "push", "pop", "pop", "pop", "pop"],
          [[], [5], [7], [5], [7], [4], [5], [], [], [], []]
        ]
      },
      {
        name: "範例 2：頻率並列時取最晚放入者",
        args: [
          ["FreqStack", "push", "push", "push", "pop", "pop", "pop"],
          [[], [1], [2], [3], [], [], []]
        ]
      },
      {
        name: "範例 3：push 與 pop 交錯",
        args: [
          ["FreqStack", "push", "push", "push", "pop", "push", "pop", "pop", "pop"],
          [[], [4], [0], [4], [], [0], [], [], []]
        ]
      }
    ],

    cppLines: cppBlock(`
class FreqStack {
    unordered_map<int, int> freq;
    unordered_map<int, stack<int>> group;
    int maxFreq = 0;
public:
    void push(int val) {
        int f = ++freq[val];
        maxFreq = max(maxFreq, f);
        group[f].push(val);
    }
    int pop() {
        int val = group[maxFreq].top();
        group[maxFreq].pop();
        --freq[val];
        if (group[maxFreq].empty()) --maxFreq;
        return val;
    }
};`),

    generateTrace(opsInput, valsInput) {
      const ops = Array.isArray(opsInput) ? opsInput.slice() : [];
      const vals = (Array.isArray(valsInput) ? valsInput : []).map((v) => (Array.isArray(v) ? v.slice() : v));
      const trace = [];
      const freq = new Map();
      const group = {}; // f -> array（尾端為頂端）
      let maxGroup = 0;
      let maxFreq = 0;
      const results = ops.map(() => "-");
      const argOf = (i) => (Array.isArray(vals[i]) ? vals[i][0] : vals[i]);
      const labels = ops.map((op, i) => (op === "push" ? `push(${argOf(i)})` : `${op}()`));
      let opIdx = -1;
      let fVar = "-";
      let valVar = "-";
      let ret = "-";
      const doneOps = [];

      const snap = (o = {}) => {
        const boards = [
          {
            id: "ops",
            type: "array",
            name: "operations",
            typeLabel: "呼叫序列",
            x: 325,
            y: 52,
            values: labels,
            hl: opIdx >= 0 ? [opIdx] : [],
            done: doneOps.slice(),
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx}`, color: "blue" }] : []
          },
          {
            id: "out",
            type: "array",
            name: "output",
            typeLabel: "每次呼叫的回傳值",
            x: 325,
            y: 185,
            values: results.slice(),
            hl: o.outHl !== undefined ? [o.outHl] : [],
            match: results.map((r, i) => (r !== "-" && r !== "null" && i !== o.outHl ? i : -1)).filter((i) => i >= 0)
          },
          {
            id: "freq",
            type: "dict",
            name: "freq",
            typeLabel: "頻率表 (unordered_map<int,int>)",
            x: 325,
            y: 330,
            headers: ["val", "freq"],
            rows: [...freq.entries()].map(([v, c]) => ({ id: `f-${v}`, key: String(v), val: String(c), status: o.freqHl === v ? o.freqStatus || "inserted" : "" }))
          }
        ];
        for (let f = 1; f <= maxGroup; f++) {
          const items = (group[f] || []).map((v, i, a) => ({ val: v, status: o.grpHl === f && i === a.length - 1 ? o.grpStatus || "hl" : "" }));
          boards.push({
            id: `grp${f}`,
            type: "stack",
            name: `group[${f}]`,
            typeLabel: f === maxFreq ? "← maxFreq" : `頻率 ${f}`,
            x: 520 + (f - 1) * 140,
            y: 330,
            items
          });
        }
        boards.push(
          varsBoard([
            { id: "op", name: "op", val: opIdx >= 0 ? labels[opIdx] : "-", status: opIdx >= 0 ? "hl" : "" },
            { id: "f", name: "f", val: String(fVar), status: o.hlVar === "f" ? "hl" : "" },
            { id: "val", name: "val", val: String(valVar), status: o.hlVar === "val" ? "hl" : "" },
            { id: "maxFreq", name: "maxFreq", val: String(maxFreq), status: o.hlVar === "maxFreq" ? "hl" : "" },
            { id: "ret", name: "return", val: String(ret), status: ret !== "-" && ret !== "null" ? "match" : "" }
          ])
        );
        return { boards, connectors: o.connectors || [] };
      };
      const vars = () => ({ op: opIdx >= 0 ? labels[opIdx] : "-", f: fVar, val: valVar, maxFreq, return: ret });

      ops.forEach((op, i) => {
        opIdx = i;
        fVar = "-";
        valVar = "-";
        ret = "-";
        if (op === "FreqStack") {
          results[i] = "null";
          ret = "null";
          trace.push(mkStep(4, "建立 FreqStack", "default", "freq = {}, group = {}, maxFreq = 0",
            "建構子：頻率表 freq 與各頻率的堆疊 group 都是空的，maxFreq = 0。", vars(), snap({ outHl: i })));
        } else if (op === "push") {
          const v = argOf(i);
          valVar = v;
          const f = (freq.get(v) || 0) + 1;
          freq.set(v, f);
          fVar = f;
          trace.push(mkStep(7, `freq[${v}] 增為 ${f}`, "tag-insert", `f = ++freq[${v}] = ${f}`,
            `push(${v})：${v} 的頻率從 ${f - 1} 增加為 ${f}，這是 ${v} 第 ${f} 次在堆疊中出現。`,
            vars(), snap({ freqHl: v, connectors: [{ from: `wb-cw-ops-${i}`, to: `wb-dict-row-f-${v}`, label: "++freq", color: "purple" }] })));
          const oldMax = maxFreq;
          maxFreq = Math.max(maxFreq, f);
          maxGroup = Math.max(maxGroup, maxFreq);
          trace.push(mkStep(8, maxFreq > oldMax ? "maxFreq 提升" : "maxFreq 不變", "tag-check", `maxFreq = max(${oldMax}, ${f}) = ${maxFreq}`,
            maxFreq > oldMax ? `新的頻率 ${f} 超過原本的最高頻率 ${oldMax}，maxFreq 更新為 ${maxFreq}。` : `頻率 ${f} 沒有超過 maxFreq = ${maxFreq}。`,
            vars(), snap({ hlVar: "maxFreq", freqHl: v })));
          group[f] = group[f] || [];
          group[f].push(v);
          results[i] = "null";
          ret = "null";
          trace.push(mkStep(9, `放入 group[${f}]`, "tag-insert", `group[${f}].push(${v})`,
            `把 ${v} 推入 group[${f}] 的頂端。group[${f}] 收集所有「第 ${f} 次出現」的值，越晚放入越靠上。push 沒有回傳值。`,
            vars(), snap({ grpHl: f, outHl: i, connectors: [{ from: "wb-var-val", to: `wb-stack-grp${f}-${group[f].length - 1}`, label: `push ${v}`, color: "purple" }] })));
          doneOps.push(i);
        } else if (op === "pop") {
          const mf = maxFreq;
          const g = group[mf];
          const v = g[g.length - 1];
          valVar = v;
          trace.push(mkStep(12, `取 group[${mf}] 頂端`, "tag-check", `val = group[${mf}].top() = ${v}`,
            `pop()：最高頻率是 ${mf}，group[${mf}] 頂端的 ${v} 就是頻率最高、且並列時最晚放入的元素。`,
            vars(), snap({ grpHl: mf, hlVar: "val", connectors: [{ from: `wb-stack-grp${mf}-${g.length - 1}`, to: "wb-var-val", label: "top()", color: "blue" }] })));
          g.pop();
          trace.push(mkStep(13, `彈出 group[${mf}]`, "default", `group[${mf}].pop()`,
            `從 group[${mf}] 移除 ${v}；${v} 在較低頻率的堆疊裡仍保有它較早的出現紀錄。`, vars(), snap({ hlVar: "val" })));
          freq.set(v, freq.get(v) - 1);
          trace.push(mkStep(14, `freq[${v}] 減為 ${freq.get(v)}`, "tag-check", `--freq[${v}] → ${freq.get(v)}`,
            `${v} 的頻率減 1，變為 ${freq.get(v)}。`, vars(), snap({ freqHl: v, freqStatus: "hit" })));
          const empty = g.length === 0;
          if (empty) maxFreq--;
          trace.push(mkStep(15, empty ? "maxFreq 下降" : "maxFreq 不變", "tag-check",
            empty ? `group[${mf}] 為空 → maxFreq = ${maxFreq}` : `group[${mf}] 還有 ${g.length} 個元素`,
            empty ? `group[${mf}] 已經空了，代表沒有任何值的頻率達到 ${mf}，maxFreq 降為 ${maxFreq}。` : `group[${mf}] 仍有元素，最高頻率維持 ${maxFreq}。`,
            vars(), snap({ hlVar: "maxFreq" })));
          results[i] = String(v);
          ret = v;
          trace.push(mkStep(16, `回傳 ${v}`, "tag-found", `return ${v}`,
            `pop() 回傳 ${v}。`, vars(), snap({ outHl: i, connectors: [{ from: "wb-var-val", to: `wb-cw-out-${i}`, label: `return ${v}`, color: "green" }] })));
          doneOps.push(i);
        }
      });
      opIdx = -1;
      const outStr = arrStr(results.map((r) => (r === "-" ? "null" : r)));
      ret = outStr;
      trace.push(mkStep(16, "所有操作完成", "tag-found", `output = ${outStr}`,
        `全部呼叫執行完畢，各次回傳值依序為 ${outStr}（push 與建構子回傳 null）。`, vars(), snap()));
      return trace;
    }
  };

  // ==========================================================================
  // #94 Counting Bits (LC #338, Easy)
  // ==========================================================================
  P["counting-bits"] = {
    id: 94,
    leetcodeId: 338,
    slug: "counting-bits",
    title: "338. Counting Bits (位元計數)",
    difficulty: "Easy",
    topic: "Bit Manipulation / Dynamic Programming",
    mins: 15,
    complexity: "Time O(n) · Space O(1)（不含輸出）",
    argNames: ["n"],
    description:
      "給定整數 n，回傳長度為 n + 1 的陣列 ans，其中 ans[i] 是 i 的二進位表示中 1 的個數。觀察 i >> 1 是把 i 的最低位元去掉後的數，它比 i 小、早已算好，因此 ans[i] = ans[i >> 1] + (i & 1)：去掉最低位後的 1 的個數，再加上最低位本身是不是 1。由小到大一次填完，時間 O(n)，除了輸出陣列外只用 O(1) 空間。",

    presets: [
      { name: "範例 1：n = 2", args: [2] },
      { name: "範例 2：n = 5", args: [5] },
      { name: "範例 3：n = 8（跨越 2 的冪次）", args: [8] },
      { name: "邊界：n = 0", args: [0] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        for (int i = 1; i <= n; ++i) {
            ans[i] = ans[i >> 1] + (i & 1);
        }
        return ans;
    }
};`),

    generateTrace(nInput) {
      const n = Math.max(0, Number(nInput) || 0);
      const trace = [];
      const ans = new Array(n + 1).fill(0);
      const width = Math.max(1, n.toString(2).length);
      const bin = Array.from({ length: n + 1 }, (_, i) => i.toString(2).padStart(width, "0"));
      let iVar = "-";
      let ret = "-";

      const snap = (o = {}) => {
        const i = typeof iVar === "number" ? iVar : -1;
        const filled = Array.from({ length: n + 1 }, (_, k) => k).filter((k) => k === 0 || (i >= 0 ? k < i : ret !== "-"));
        return {
          boards: [
            {
              id: "bin",
              type: "array",
              name: "i 的二進位",
              typeLabel: `${width} 位元表示`,
              x: 325,
              y: 52,
              values: bin.slice(),
              hl: i >= 0 ? [i] : [],
              done: i >= 0 ? [i >> 1] : []
            },
            {
              id: "ans",
              type: "array",
              name: "ans",
              typeLabel: "答案 (vector<int>)",
              x: 325,
              y: 165,
              values: ans.slice(),
              hl: i >= 0 && o.written ? [i] : [],
              match: ret !== "-" ? ans.map((_, k) => k) : [],
              done: ret === "-" ? filled : [],
              pointers:
                i >= 0
                  ? (i >> 1) === i
                    ? [{ idx: i, label: "i", color: "blue" }]
                    : [{ idx: i >> 1, label: "i >> 1", color: "purple" }, { idx: i, label: `i = ${i}`, color: "blue" }]
                  : []
            },
            varsBoard([
              { id: "n", name: "n", val: String(n), status: "" },
              { id: "i", name: "i", val: i >= 0 ? `${i} (${bin[i]})` : "-", status: i >= 0 ? "hl" : "" },
              { id: "half", name: "i >> 1", val: i >= 0 ? String(i >> 1) : "-", status: "" },
              { id: "low", name: "i & 1", val: i >= 0 ? String(i & 1) : "-", status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => {
        const i = typeof iVar === "number" ? iVar : null;
        return { n, i: i === null ? "-" : i, "i >> 1": i === null ? "-" : i >> 1, "i & 1": i === null ? "-" : i & 1, return: ret };
      };

      trace.push(mkStep(4, "建立答案陣列", "default", `ans(${n + 1}, 0)`,
        `建立長度 ${n + 1} 的陣列 ans，全部初始化為 0；ans[0] = 0 已經正確（0 沒有任何 1）。`, vars(), snap()));
      for (let i = 1; i <= n; i++) {
        iVar = i;
        ans[i] = ans[i >> 1] + (i & 1);
        trace.push(mkStep(6, `ans[${i}] = ${ans[i]}`, "tag-insert", `ans[${i}] = ans[${i >> 1}] + ${i & 1} = ${ans[i >> 1]} + ${i & 1} = ${ans[i]}`,
          `${i} 的二進位是 ${bin[i]}。右移一位得到 ${i >> 1}（${bin[i >> 1]}），它的 1 個數 ans[${i >> 1}] = ${ans[i >> 1]} 已經算好；最低位 i & 1 = ${i & 1}，所以 ans[${i}] = ${ans[i]}。`,
          vars(), snap({ written: true, connectors: [{ from: `wb-cw-ans-${i >> 1}`, to: `wb-cw-ans-${i}`, label: `+ ${i & 1}`, color: "purple" }] })));
      }
      iVar = "-";
      ret = arrStr(ans);
      trace.push(mkStep(8, "回傳答案", "tag-found", `return ${ret}`,
        `0 到 ${n} 每個數字的 1 個數都已填好，回傳 ${ret}。`,
        vars(), snap({ connectors: [{ from: `wb-cw-ans-${n}`, to: "wb-var-ret", label: "ans", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #95 Longest Increasing Subsequence (LC #300, Medium)
  // ==========================================================================
  P["longest-increasing-subsequence"] = {
    id: 95,
    leetcodeId: 300,
    slug: "longest-increasing-subsequence",
    title: "300. Longest Increasing Subsequence (最長遞增子序列)",
    difficulty: "Medium",
    topic: "Dynamic Programming / Binary Search",
    mins: 30,
    complexity: "Time O(n log n) · Space O(n)",
    argNames: ["nums"],
    description:
      "給定整數陣列 nums，回傳最長嚴格遞增子序列的長度（子序列可以刪去部分元素，但不能改變相對順序）。維護陣列 tails，tails[len] 表示「所有長度為 len + 1 的遞增子序列中，最小可能的結尾值」，它必定嚴格遞增。對每個 x 用 lower_bound 找到第一個 ≥ x 的位置：若不存在，x 可以接在最長序列後面，tails 長度加 1；否則用 x 取代該位置，讓同長度序列的結尾更小、日後更容易延伸。最後 tails 的長度就是答案。時間 O(n log n)、空間 O(n)。",

    presets: [
      { name: "範例 1：nums = [10,9,2,5,3,7,101,18]", args: [[10, 9, 2, 5, 3, 7, 101, 18]] },
      { name: "範例 2：nums = [0,1,0,3,2,3]", args: [[0, 1, 0, 3, 2, 3]] },
      { name: "範例 3：全部相同 nums = [7,7,7,7,7,7,7]", args: [[7, 7, 7, 7, 7, 7, 7]] },
      { name: "範例 4：nums = [4,10,4,3,8,9]", args: [[4, 10, 4, 3, 8, 9]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.slice() : [];
      const trace = [];
      const tails = [];
      let idx = -1;
      let pos = "-";
      let ret = "-";

      const snap = (o = {}) => ({
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "輸入 (vector<int>)",
            x: 325,
            y: 52,
            values: nums.slice(),
            hl: idx >= 0 ? [idx] : [],
            done: idx >= 0 ? Array.from({ length: idx }, (_, i) => i) : ret !== "-" ? nums.map((_, i) => i) : [],
            pointers: idx >= 0 ? [{ idx, label: `x = ${nums[idx]}`, color: "blue" }] : []
          },
          {
            id: "tails",
            type: "array",
            name: "tails",
            typeLabel: "各長度遞增子序列的最小結尾 (vector<int>)",
            x: 325,
            y: 175,
            values: tails.slice(),
            indexLabels: tails.map((_, i) => `len ${i + 1}`),
            hl: o.tailHl !== undefined ? [o.tailHl] : [],
            match: ret !== "-" ? tails.map((_, i) => i) : [],
            pointers: o.itPtr !== undefined && o.itPtr < tails.length ? [{ idx: o.itPtr, label: "it", color: "purple" }] : []
          },
          varsBoard([
            { id: "x", name: "x", val: idx >= 0 ? String(nums[idx]) : "-", status: idx >= 0 ? "hl" : "" },
            { id: "it", name: "it 位置", val: String(pos), status: pos !== "-" ? "hl" : "" },
            { id: "len", name: "tails.size()", val: String(tails.length), status: "" },
            { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
          ])
        ],
        connectors: o.connectors || []
      });
      const vars = () => ({ x: idx >= 0 ? nums[idx] : "-", it: pos, "tails.size()": tails.length, tails: arrStr(tails), return: ret });

      trace.push(mkStep(4, "建立 tails", "default", "tails = []",
        "tails[k] 記錄長度為 k + 1 的遞增子序列能有的最小結尾值；一開始還沒有任何子序列。", vars(), snap()));
      nums.forEach((x, i) => {
        idx = i;
        let p = 0;
        while (p < tails.length && tails[p] < x) p++;
        pos = p === tails.length ? "end()" : p;
        trace.push(mkStep(6, `lower_bound(${x})`, "tag-check", p === tails.length ? `it = end()（沒有 ≥ ${x} 的值）` : `it → tails[${p}] = ${tails[p]} ≥ ${x}`,
          p === tails.length
            ? `在 tails ${arrStr(tails)} 中二分搜尋第一個 ≥ ${x} 的位置：所有結尾都比 ${x} 小，it 指向 end()。`
            : `在 tails ${arrStr(tails)} 中二分搜尋第一個 ≥ ${x} 的位置，找到索引 ${p}（值 ${tails[p]}）。`,
          vars(), snap({ itPtr: p, connectors: p < tails.length ? [{ from: `wb-cw-nums-${i}`, to: `wb-cw-tails-${p}`, label: "lower_bound", color: "blue" }] : [] })));
        if (p === tails.length) {
          tails.push(x);
          trace.push(mkStep(7, "延長最長序列", "tag-insert", `tails.push_back(${x}) → size = ${tails.length}`,
            `${x} 比所有結尾都大，可以接在目前最長的遞增子序列後面，得到長度 ${tails.length} 的新序列。`,
            vars(), snap({ tailHl: p, connectors: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-tails-${p}`, label: "push_back", color: "purple" }] })));
        } else {
          const old = tails[p];
          tails[p] = x;
          trace.push(mkStep(8, `替換 tails[${p}]`, "tag-insert", `*it = ${x}（原為 ${old}）`,
            old === x
              ? `tails[${p}] 已經是 ${x}，寫入相同的值，長度 ${p + 1} 的最小結尾不變（嚴格遞增不允許重複延伸）。`
              : `用 ${x} 取代 ${old}：長度 ${p + 1} 的遞增子序列現在可以用更小的 ${x} 結尾，之後更容易被延伸。tails 長度不變。`,
            vars(), snap({ tailHl: p, itPtr: p, connectors: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-tails-${p}`, label: `*it = ${x}`, color: "purple" }] })));
        }
      });
      idx = -1;
      pos = "-";
      ret = tails.length;
      trace.push(mkStep(10, "回傳 tails 長度", "tag-found", `return ${ret}`,
        `tails 的長度 ${ret} 就是最長遞增子序列的長度。注意 tails ${arrStr(tails)} 本身不一定是一組真實的子序列，只有長度有意義。`,
        vars(), snap({ connectors: tails.length ? [{ from: `wb-cw-tails-${tails.length - 1}`, to: "wb-var-ret", label: `size = ${ret}`, color: "green" }] : [] })));
      return trace;
    }
  };

  // ==========================================================================
  // #96 Graph Valid Tree (LC #261, Medium, Premium)
  // ==========================================================================
  P["graph-valid-tree"] = {
    id: 96,
    leetcodeId: 261,
    slug: "graph-valid-tree",
    title: "261. Graph Valid Tree (以圖驗樹)",
    difficulty: "Medium",
    topic: "Graph / Union Find",
    mins: 30,
    complexity: "Time O(n + E · α(n)) · Space O(n)",
    argNames: ["n", "edges"],
    description:
      "給定 n 個編號 0 到 n - 1 的節點，以及無向邊清單 edges，判斷這些邊是否恰好構成一棵樹。一棵 n 個節點的樹必須同時滿足：剛好有 n - 1 條邊，而且沒有環（兩者合起來也保證全部連通）。先檢查邊數，不等於 n - 1 就直接回傳 false；接著用並查集 (Union-Find) 逐條加入邊，find 時做路徑壓縮。若某條邊的兩個端點已經屬於同一集合，代表加入它會形成環，回傳 false；全部加完沒有出現環就回傳 true。時間 O(n + E · α(n))、空間 O(n)。",

    presets: [
      { name: "範例 1：n = 5, edges = [[0,1],[0,2],[0,3],[1,4]] → true", args: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]] },
      { name: "範例 2：n = 5，邊數過多 → false", args: [5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]] },
      { name: "範例 3：n = 4，邊數正確但有環且不連通 → false", args: [4, [[0, 1], [1, 2], [2, 0]]] },
      { name: "範例 4：n = 6 的鏈狀樹 → true", args: [6, [[0, 1], [1, 2], [3, 4], [2, 3], [4, 5]]] },
      { name: "邊界：n = 1, edges = [] → true", args: [1, []] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        vector<int> parent(n);
        iota(parent.begin(), parent.end(), 0);
        function<int(int)> find = [&](int x) {
            return parent[x] == x ? x : parent[x] = find(parent[x]);
        };
        for (auto& e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return false;
            parent[a] = b;
        }
        return true;
    }
};`),

    generateTrace(nInput, edgesInput) {
      const n = Math.max(1, Number(nInput) || 1);
      const edges = (Array.isArray(edgesInput) ? edgesInput : []).map((e) => e.slice());
      const trace = [];
      let parent = null;
      let eIdx = -1;
      let aVar = "-";
      let bVar = "-";
      let ret = "-";
      const W = n > 5 ? 480 : 440;
      const H = 230;
      const pos = ringPos(n, W, H);

      const snap = (o = {}) => {
        const nodes = Array.from({ length: n }, (_, i) => {
          const p = pos(i);
          const cur = eIdx >= 0 && (edges[eIdx][0] === i || edges[eIdx][1] === i);
          return {
            id: String(i),
            val: String(i),
            sub: parent ? `parent=${parent[i]}` : "",
            x: p.x,
            y: p.y,
            status: ret === "true" ? "match" : cur ? (o.cycle ? "warn" : "hl") : "",
            ptr: cur ? (edges[eIdx][0] === i ? "e[0]" : "e[1]") : ""
          };
        });
        const gEdges = edges.map((e, i) => ({
          from: String(e[0]),
          to: String(e[1]),
          dir: false,
          label: i === eIdx ? `#${i}` : "",
          status: i === eIdx ? (o.cycle ? "" : "hl") : (eIdx >= 0 && i < eIdx) || ret === "true" ? "match" : ""
        }));
        const boards = [
          { id: "g", type: "graph", shape: "graph", name: "edges", typeLabel: "無向圖（綠色 = 已合併的邊）", x: 325, y: 52, width: W, height: H, nodes, edges: gEdges }
        ];
        if (parent) {
          boards.push({
            id: "parent",
            type: "array",
            name: "parent",
            typeLabel: "並查集 (vector<int>)",
            x: 325,
            y: 52 + H + 40,
            values: parent.slice(),
            hl: o.parentHl || [],
            match: parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0 && ret === "true"),
            pointers: o.ptrs || []
          });
        }
        boards.push(
          varsBoard([
            { id: "n", name: "n", val: String(n), status: "" },
            { id: "E", name: "edges.size()", val: String(edges.length), status: o.sizeCheck ? (edges.length === n - 1 ? "hl" : "warn") : "" },
            { id: "e", name: "e", val: eIdx >= 0 ? arrStr(edges[eIdx]) : "-", status: eIdx >= 0 ? "hl" : "" },
            { id: "a", name: "a = find(e[0])", val: String(aVar), status: "" },
            { id: "b", name: "b = find(e[1])", val: String(bVar), status: "" },
            { id: "ret", name: "return", val: String(ret), status: ret === "true" ? "match" : ret === "false" ? "warn" : "" }
          ])
        );
        return { boards, connectors: o.connectors || [] };
      };
      const vars = () => ({ n, "edges.size()": edges.length, e: eIdx >= 0 ? arrStr(edges[eIdx]) : "-", a: aVar, b: bVar, return: ret });

      trace.push(mkStep(3, "讀入圖", "default", `n = ${n}, edges.size() = ${edges.length}`,
        `共有 ${n} 個節點與 ${edges.length} 條無向邊。樹的條件：恰好 n - 1 條邊，而且沒有環。`, vars(), snap()));
      if (edges.length !== n - 1) {
        ret = "false";
        trace.push(mkStep(4, "邊數不等於 n - 1", "tag-found", `${edges.length} != ${n - 1} → return false`,
          `一棵 ${n} 個節點的樹必定恰好有 ${n - 1} 條邊，但這裡有 ${edges.length} 條${edges.length > n - 1 ? "，多出來的邊一定會造成環" : "，邊不夠就不可能全部連通"}，直接回傳 false。`,
          vars(), snap({ sizeCheck: true, connectors: [{ from: "wb-var-E", to: "wb-var-ret", label: "邊數不符", color: "red" }] })));
        return trace;
      }
      trace.push(mkStep(4, "邊數檢查通過", "tag-check", `${edges.length} == ${n - 1}`,
        `共有 ${edges.length} 條邊，恰好等於 n - 1 = ${n - 1}。接下來只要確認沒有環，就能保證是一棵樹。`, vars(), snap({ sizeCheck: true })));
      parent = Array.from({ length: n }, (_, i) => i);
      trace.push(mkStep(6, "初始化並查集", "default", `parent = ${arrStr(parent)}`,
        "iota 讓每個節點的 parent 指向自己：一開始每個節點都是獨立的集合。", vars(), snap()));

      const find = (x, path) => {
        path.push(x);
        if (parent[x] === x) return x;
        const r = find(parent[x], path);
        parent[x] = r;
        return r;
      };

      for (let i = 0; i < edges.length; i++) {
        eIdx = i;
        const [u, v] = edges[i];
        const before = parent.slice();
        const pa = [];
        const pb = [];
        const a = find(u, pa);
        const b = find(v, pb);
        aVar = a;
        bVar = b;
        const changed = parent.map((p, k) => (p !== before[k] ? k : -1)).filter((k) => k >= 0);
        trace.push(mkStep(11, `處理邊 [${u},${v}]`, "tag-check", `a = find(${u}) = ${a}, b = find(${v}) = ${b}`,
          `沿 parent 往上找代表元素：${u} 的路徑 ${pa.join(" → ")}，代表為 ${a}；${v} 的路徑 ${pb.join(" → ")}，代表為 ${b}。${changed.length ? `路徑壓縮把 ${changed.map((k) => `parent[${k}]`).join("、")} 直接指向根。` : ""}`,
          vars(), snap({
            parentHl: [...new Set([a, b])],
            ptrs: a === b ? [{ idx: a, label: "a = b", color: "red" }] : [{ idx: a, label: "a", color: "blue" }, { idx: b, label: "b", color: "green" }],
            connectors: [
              { from: `wb-node-g-${u}`, to: `wb-cw-parent-${a}`, label: `find(${u})`, color: "blue" },
              { from: `wb-node-g-${v}`, to: `wb-cw-parent-${b}`, label: `find(${v})`, color: "blue" }
            ]
          })));
        if (a === b) {
          ret = "false";
          trace.push(mkStep(12, "發現環！", "tag-found", `a == b == ${a} → return false`,
            `節點 ${u} 與 ${v} 早已透過其他邊連通（同屬代表 ${a} 的集合），再加上邊 [${u},${v}] 會形成環，因此不是樹，回傳 false。`,
            vars(), snap({ cycle: true, parentHl: [a], connectors: [{ from: `wb-node-g-${u}`, to: `wb-node-g-${v}`, label: "形成環", color: "red" }] })));
          return trace;
        }
        parent[a] = b;
        trace.push(mkStep(13, `合併集合 ${a} → ${b}`, "tag-insert", `parent[${a}] = ${b}`,
          `${a} 與 ${b} 屬於不同集合，加入這條邊不會形成環。令 parent[${a}] = ${b}，把兩個集合合併。`,
          vars(), snap({ parentHl: [a], ptrs: [{ idx: a, label: "a", color: "purple" }], connectors: [{ from: `wb-cw-parent-${a}`, to: `wb-cw-parent-${b}`, label: `parent[${a}] = ${b}`, color: "purple" }] })));
      }
      eIdx = -1;
      aVar = "-";
      bVar = "-";
      ret = "true";
      trace.push(mkStep(15, "是一棵樹", "tag-found", "return true",
        `${edges.length} 條邊全部加入都沒有形成環，加上邊數剛好是 n - 1，所有節點必定連通成一棵樹，回傳 true。`,
        vars(), snap({ connectors: [{ from: "wb-dyn-g", to: "wb-var-ret", label: "valid tree", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #97 Course Schedule II (LC #210, Medium)
  // ==========================================================================
  P["course-schedule-ii"] = {
    id: 97,
    leetcodeId: 210,
    slug: "course-schedule-ii",
    title: "210. Course Schedule II (課程表 II)",
    difficulty: "Medium",
    topic: "Graph / Topological Sort (BFS)",
    mins: 35,
    complexity: "Time O(V + E) · Space O(V + E)",
    argNames: ["numCourses", "prerequisites"],
    description:
      "共有 numCourses 門課，prerequisites[i] = [a, b] 表示修 a 之前必須先修完 b。回傳任一個能修完所有課程的順序；若不可能（先修關係有環）就回傳空陣列。使用 Kahn 拓撲排序：建立有向邊 b → a 並統計每門課的入度，把入度為 0 的課放進佇列；每次從佇列取出一門課加入答案，並把它指向的課入度減 1，減到 0 的課再入列。若最後答案長度不足 numCourses，代表剩下的課彼此卡在環中，回傳空陣列。時間與空間皆為 O(V + E)。",

    presets: [
      { name: "範例 1：numCourses = 2, prerequisites = [[1,0]]", args: [2, [[1, 0]]] },
      { name: "範例 2：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]] },
      { name: "範例 3：numCourses = 1, prerequisites = []", args: [1, []] },
      { name: "範例 4：三門課互相先修形成環 → []", args: [3, [[0, 1], [1, 2], [2, 0]]] },
      { name: "範例 5：6 門課的多層依賴", args: [6, [[2, 0], [2, 1], [3, 2], [4, 2], [5, 3], [5, 4]]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);
        for (const auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            ++indegree[p[0]];
        }
        queue<int> q;
        for (int i = 0; i < numCourses; ++i)
            if (indegree[i] == 0) q.push(i);
        vector<int> order;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            order.push_back(u);
            for (int v : adj[u])
                if (--indegree[v] == 0) q.push(v);
        }
        if ((int)order.size() != numCourses) return {};
        return order;
    }
};`),

    generateTrace(nInput, preInput) {
      const n = Math.max(1, Number(nInput) || 1);
      const pres = (Array.isArray(preInput) ? preInput : []).map((p) => p.slice());
      const trace = [];
      const adj = Array.from({ length: n }, () => []);
      const indeg = new Array(n).fill(0);
      const gEdges = [];
      const q = [];
      const order = [];
      const taken = new Set();
      let uVar = "-";
      let ret = "-";
      const W = n > 4 ? 480 : 440;
      const H = 230;
      const pos = ringPos(n, W, H);

      const snap = (o = {}) => {
        const nodes = Array.from({ length: n }, (_, i) => {
          const p = pos(i);
          let status = "";
          if (taken.has(i)) status = "match";
          if (i === o.u || i === o.v) status = "hl";
          if (o.stuck && !taken.has(i)) status = "warn";
          return { id: String(i), val: String(i), sub: `in=${indeg[i]}`, x: p.x, y: p.y, status, ptr: i === o.u ? "u" : i === o.v ? "v" : "" };
        });
        const edges = gEdges.map(([a, b]) => ({
          from: String(a),
          to: String(b),
          dir: true,
          status: o.hlEdge && o.hlEdge[0] === a && o.hlEdge[1] === b ? "hl" : taken.has(a) ? "match" : ""
        }));
        return {
          boards: [
            { id: "g", type: "graph", shape: "graph", name: "adj", typeLabel: "先修有向圖 (b → a)", x: 325, y: 52, width: W, height: H, nodes, edges },
            {
              id: "indeg",
              type: "array",
              name: "indegree",
              typeLabel: "入度 (vector<int>)",
              x: 325,
              y: 52 + H + 36,
              values: indeg.slice(),
              hl: o.indegHl || [],
              match: o.indegMatch || [],
              warn: o.stuck ? indeg.map((d, i) => (taken.has(i) ? -1 : i)).filter((i) => i >= 0) : [],
              done: [...taken]
            },
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "入度為 0 的課程 (queue<int>)",
              x: 325,
              y: 52 + H + 150,
              items: q.map((c, i) => ({ val: c, status: o.qHl === i ? "hl" : "" }))
            },
            {
              id: "order",
              type: "array",
              name: "order",
              typeLabel: "修課順序 (vector<int>)",
              x: 600,
              y: 52 + H + 150,
              values: order.slice(),
              hl: o.orderHl !== undefined ? [o.orderHl] : [],
              match: ret !== "-" && ret !== "[]" ? order.map((_, i) => i) : []
            },
            varsBoard([
              { id: "num", name: "numCourses", val: String(n), status: "" },
              { id: "u", name: "u", val: String(uVar), status: uVar !== "-" ? "hl" : "" },
              { id: "size", name: "order.size()", val: String(order.length), status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret === "-" ? "" : ret === "[]" ? "warn" : "match" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ numCourses: n, u: uVar, "q.size()": q.length, order: arrStr(order), return: ret });

      trace.push(mkStep(5, "建立鄰接表與入度", "default", `adj(${n}), indegree(${n}, 0)`,
        `為 ${n} 門課建立鄰接表 adj 與入度陣列 indegree，入度代表「還有幾門先修課沒修」。`, vars(), snap()));
      for (const [a, b] of pres) {
        adj[b].push(a);
        indeg[a]++;
        gEdges.push([b, a]);
        trace.push(mkStep(8, `建邊 ${b} → ${a}`, "tag-insert", `adj[${b}].push_back(${a}); indegree[${a}] = ${indeg[a]}`,
          `先修條件 [${a}, ${b}]：修 ${a} 之前要先修 ${b}，加入有向邊 ${b} → ${a}，indegree[${a}] 增為 ${indeg[a]}。`,
          vars(), snap({ u: b, v: a, hlEdge: [b, a], indegHl: [a], connectors: [{ from: `wb-node-g-${a}`, to: `wb-cw-indeg-${a}`, label: `++indegree[${a}]`, color: "purple" }] })));
      }
      const zero = [];
      for (let i = 0; i < n; i++) if (indeg[i] === 0) { q.push(i); zero.push(i); }
      trace.push(mkStep(12, zero.length ? "入度 0 的課入列" : "沒有可先修的課", zero.length ? "tag-insert" : "tag-check",
        zero.length ? `q.push(${zero.join(", ")})` : "沒有 indegree == 0 的課",
        zero.length ? `課程 ${zero.join("、")} 沒有任何先修條件，可以馬上修，全部放進佇列。` : "每門課都還有先修課沒完成，佇列為空，代表所有課都卡在環中。",
        vars(), snap({ indegMatch: zero })));
      trace.push(mkStep(13, "建立 order", "default", "order = []", "order 會依序記錄實際修課的順序。", vars(), snap()));

      while (q.length) {
        const u = q.shift();
        uVar = u;
        order.push(u);
        taken.add(u);
        trace.push(mkStep(16, `修課程 ${u}`, "tag-found", `u = ${u}; order.push_back(${u})`,
          `從佇列前端取出課程 ${u}，它的先修課都已修完，加入 order（目前 ${arrStr(order)}）。接著把以 ${u} 為先修的課程入度減 1。`,
          vars(), snap({ u, orderHl: order.length - 1, connectors: [{ from: `wb-node-g-${u}`, to: `wb-cw-order-${order.length - 1}`, label: `修 ${u}`, color: "green" }] })));
        for (const v of adj[u]) {
          indeg[v]--;
          const ok = indeg[v] === 0;
          if (ok) q.push(v);
          trace.push(mkStep(18, ok ? `解鎖課程 ${v}` : `indegree[${v}] 減為 ${indeg[v]}`, ok ? "tag-insert" : "tag-check",
            `--indegree[${v}] = ${indeg[v]}${ok ? ` → q.push(${v})` : ""}`,
            ok ? `沿邊 ${u} → ${v}，課程 ${v} 的入度降為 0，所有先修都完成了，放入佇列。` : `沿邊 ${u} → ${v}，課程 ${v} 的入度降為 ${indeg[v]}，還有其他先修課沒修。`,
            vars(), snap({
              u, v, hlEdge: [u, v], indegHl: ok ? [] : [v], indegMatch: ok ? [v] : [], qHl: ok ? q.length - 1 : undefined,
              connectors: [ok ? { from: `wb-cw-indeg-${v}`, to: `wb-queue-q-${q.length - 1}`, label: "入度 0 → 入列", color: "green" } : { from: `wb-node-g-${v}`, to: `wb-cw-indeg-${v}`, label: `in=${indeg[v]}`, color: "blue" }]
            })));
        }
      }
      uVar = "-";
      if (order.length !== n) {
        ret = "[]";
        trace.push(mkStep(20, "有環，無法修完", "tag-found", `order.size() = ${order.length} != ${n} → return {}`,
          `佇列已空，但只修了 ${order.length} / ${n} 門課；剩下的課彼此形成循環依賴，入度永遠無法歸零，回傳空陣列。`,
          vars(), snap({ stuck: true })));
        return trace;
      }
      trace.push(mkStep(20, "全部課程都修完", "tag-check", `order.size() == ${n}`, `order 收齊了全部 ${n} 門課，沒有環。`, vars(), snap()));
      ret = arrStr(order);
      trace.push(mkStep(21, "回傳修課順序", "tag-found", `return ${ret}`,
        `${ret} 是一個合法的修課順序：每門課都排在它所有先修課之後。`,
        vars(), snap({ connectors: [{ from: `wb-cw-order-${order.length - 1}`, to: "wb-var-ret", label: "order", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #98 Swap Nodes in Pairs (LC #24, Medium)
  // ==========================================================================
  P["swap-nodes-in-pairs"] = {
    id: 98,
    leetcodeId: 24,
    slug: "swap-nodes-in-pairs",
    title: "24. Swap Nodes in Pairs (兩兩交換鏈結串列中的節點)",
    difficulty: "Medium",
    topic: "Linked List",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head"],
    description:
      "給定鏈結串列的頭節點 head，把每兩個相鄰節點交換位置後回傳新的頭節點；只能改變節點之間的連結，不能修改節點內的值。在 head 前放一個 dummy 節點，prev 指向每一對節點的前一個位置。只要 prev 後面還有兩個節點 a、b，就依序執行 a->next = b->next、b->next = a、prev->next = b 三次改接，完成這一對的交換，然後把 prev 移到 a（交換後這一對的尾巴）。落單的最後一個節點保持不動。時間 O(n)、額外空間 O(1)。",

    presets: [
      { name: "範例 1：head = [1,2,3,4]", args: [[1, 2, 3, 4]] },
      { name: "範例 2：head = []（空串列）", args: [[]] },
      { name: "範例 3：head = [1]", args: [[1]] },
      { name: "範例 4：奇數長度 head = [1,2,3,4,5]", args: [[1, 2, 3, 4, 5]] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode dummy(0, head);
        ListNode* prev = &dummy;
        while (prev->next && prev->next->next) {
            ListNode* a = prev->next;
            ListNode* b = a->next;
            a->next = b->next;
            b->next = a;
            prev->next = b;
            prev = a;
        }
        return dummy.next;
    }
};`),

    generateTrace(headInput) {
      const vals = Array.isArray(headInput) ? headInput.slice() : [];
      const L = vals.length;
      const trace = [];
      const nxt = new Map();
      nxt.set(-1, L ? 0 : null);
      for (let i = 0; i < L; i++) nxt.set(i, i + 1 < L ? i + 1 : null);
      let prev;
      let a;
      let b;
      let ret = "-";
      const swapped = new Set();
      const nid = (p) => (p === -1 ? "d" : p === null ? "nil" : `n${p}`);
      const name = (p) => (p === undefined ? "-" : p === null ? "nullptr" : p === -1 ? "&dummy" : `Node(${vals[p]})`);
      const listStr = () => {
        const out = [];
        let p = nxt.get(-1);
        while (p !== null) {
          out.push(vals[p]);
          p = nxt.get(p);
        }
        return arrStr(out);
      };

      const snap = (o = {}) => {
        // 依目前從 dummy 出發的走訪順序排版；暫時脫離主鏈的節點抬高顯示
        const order = [-1];
        const seen = new Set([-1]);
        let p = nxt.get(-1);
        while (p !== null && !seen.has(p)) {
          order.push(p);
          seen.add(p);
          p = nxt.get(p);
        }
        const posX = {};
        order.forEach((k, i) => (posX[k] = 52 + i * 88));
        const nilX = 52 + order.length * 88;
        const ptrs = (k) => [k === prev ? "prev" : "", k === a ? "a" : "", k === b ? "b" : ""].filter(Boolean).join(" / ");
        const nodes = [];
        const all = [-1, ...vals.map((_, i) => i)];
        all.forEach((k) => {
          let x = posX[k];
          let y = 115;
          if (x === undefined) {
            // 脫離主鏈：放在它 next 指向的節點與前一格之間的上方
            const t = nxt.get(k);
            const tx = t === null ? nilX : posX[t];
            x = tx - 44;
            y = 40;
          }
          let status = "";
          if (o.final) status = "match";
          else if (k === a || k === b) status = "hl";
          else if (swapped.has(k)) status = "done";
          nodes.push({ id: nid(k), val: k === -1 ? "D" : esc(vals[k]), sub: k === -1 ? "dummy" : "", x, y, status, ptr: ptrs(k) });
        });
        nodes.push({ id: "nil", val: "null", sub: "nullptr", x: nilX, y: 115, status: "" });
        const edges = [];
        for (const [k, v] of nxt) {
          const isHl = o.hlFrom !== undefined && o.hlFrom === k;
          edges.push({ from: nid(k), to: nid(v), dir: true, label: isHl ? "next" : "", status: isHl ? "hl" : o.final ? "match" : "" });
        }
        return {
          boards: [
            { id: "list", type: "list", shape: "list", name: "head", typeLabel: "單向鏈結串列 (ListNode*)，D 為 dummy", x: 325, y: 52, width: Math.max(460, nilX + 60), height: 190, nodes, edges },
            varsBoard([
              { id: "prev", name: "prev", val: name(prev), status: o.hlVar === "prev" ? "hl" : "" },
              { id: "a", name: "a", val: name(a), status: o.hlVar === "a" ? "hl" : "" },
              { id: "b", name: "b", val: name(b), status: o.hlVar === "b" ? "hl" : "" },
              { id: "curList", name: "目前串列", val: listStr(), status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ prev: name(prev), a: name(a), b: name(b), list: listStr(), return: ret });

      trace.push(mkStep(4, "建立 dummy 節點", "default", `dummy.next = ${L ? vals[0] : "nullptr"}`,
        "在 head 前放一個 dummy 節點，第一對交換後新的頭節點會自動接在 dummy 後面。", vars(), snap()));
      prev = -1;
      trace.push(mkStep(5, "prev 指向 dummy", "default", "prev = &dummy", "prev 永遠停在「下一對節點」的前一個位置。", vars(), snap({ hlVar: "prev" })));

      for (;;) {
        const p1 = nxt.get(prev);
        const p2 = p1 === null ? null : nxt.get(p1);
        const cont = p1 !== null && p2 !== null;
        trace.push(mkStep(6, cont ? "後面還有一對" : "不足一對，結束", cont ? "tag-check" : "default",
          cont ? `prev->next = ${vals[p1]}, prev->next->next = ${vals[p2]}` : p1 === null ? "prev->next == nullptr" : "prev->next->next == nullptr",
          cont
            ? `prev 後面還有兩個節點 ${vals[p1]} 與 ${vals[p2]}，可以交換。`
            : p1 === null
            ? "prev 後面已經沒有節點，迴圈結束。"
            : `prev 後面只剩落單的節點 ${vals[p1]}，不需交換，迴圈結束。`,
          vars(), snap({ hlFrom: prev })));
        if (!cont) break;
        a = p1;
        trace.push(mkStep(7, `a = ${vals[a]}`, "default", `a = prev->next = ${name(a)}`, `a 指向這一對的第一個節點 ${vals[a]}。`, vars(), snap({ hlVar: "a" })));
        b = nxt.get(a);
        trace.push(mkStep(8, `b = ${vals[b]}`, "default", `b = a->next = ${name(b)}`, `b 指向這一對的第二個節點 ${vals[b]}。`, vars(), snap({ hlVar: "b" })));
        const after = nxt.get(b);
        nxt.set(a, after);
        trace.push(mkStep(9, "a 接到下一對", "tag-insert", `a->next = b->next = ${name(after)}`,
          `先讓 a 跳過 b，直接指向下一對的開頭 ${name(after)}。此時 b 暫時脫離主鏈（白板上抬高），但 b 仍指著 ${name(after)}。`,
          vars(), snap({ hlFrom: a, hlVar: "a" })));
        nxt.set(b, a);
        trace.push(mkStep(10, "b 指回 a", "tag-insert", `b->next = a = ${name(a)}`,
          `讓 b 的 next 改指向 a，這一對的內部方向反轉了。`,
          vars(), snap({ hlFrom: b, hlVar: "b" })));
        nxt.set(prev, b);
        swapped.add(a);
        swapped.add(b);
        trace.push(mkStep(11, "prev 接上 b", "tag-insert", `prev->next = b = ${name(b)}`,
          `最後把 prev 的 next 接到 b，主鏈變成 ... → ${vals[b]} → ${vals[a]} → ...，這一對交換完成：${listStr()}。`,
          vars(), snap({ hlFrom: prev, connectors: [{ from: `wb-node-list-${nid(prev)}`, to: `wb-node-list-${nid(b)}`, label: "prev->next = b", color: "purple" }] })));
        prev = a;
        trace.push(mkStep(12, "prev 移到 a", "default", `prev = a = ${name(a)}`,
          `a 現在是這一對的尾巴，把 prev 移到 a，準備處理下一對。`, vars(), snap({ hlVar: "prev" })));
        a = undefined;
        b = undefined;
      }
      ret = listStr();
      trace.push(mkStep(14, "回傳 dummy.next", "tag-found", `return ${ret}`,
        L ? `所有相鄰的節點都已兩兩交換，新串列為 ${ret}。` : "原串列是空的，dummy.next 仍為 nullptr，回傳空串列。",
        vars(), snap({ final: true, connectors: [{ from: "wb-node-list-d", to: "wb-var-ret", label: "dummy.next", color: "green" }] })));
      return trace;
    }
  };

  // ==========================================================================
  // #99 Path Sum II (LC #113, Medium)
  // ==========================================================================
  P["path-sum-ii"] = {
    id: 99,
    leetcodeId: 113,
    slug: "path-sum-ii",
    title: "113. Path Sum II (路徑總和 II)",
    difficulty: "Medium",
    topic: "Binary Tree / Backtracking (DFS)",
    mins: 25,
    complexity: "Time O(N²) · Space O(H)（不含輸出）",
    argNames: ["root", "targetSum"],
    description:
      "給定二元樹 root 與整數 targetSum，找出所有「從根節點走到葉節點」且節點值總和等於 targetSum 的路徑，每條路徑以節點值的陣列表示。使用 DFS 回溯：用 path 記錄目前從根走到這裡的節點，remain 記錄還差多少。進入節點時把值放進 path、remain 減去節點值；若它是葉節點且 remain 恰好為 0，就把 path 複製一份加入答案。左右子樹都處理完後把節點從 path 移除（回溯），讓 path 回到父節點的狀態。每個節點拜訪一次，但複製路徑最壞需 O(N) 次 × O(N) 長度，時間 O(N²)；遞迴與 path 空間 O(H)。",

    presets: [
      { name: "範例 1：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1], 22] },
      { name: "範例 2：root = [1,2,3], targetSum = 5 → []", args: [[1, 2, 3], 5] },
      { name: "範例 3：root = [1,2], targetSum = 0 → []", args: [[1, 2], 0] },
      { name: "範例 4：含負數 root = [1,-2,-3,1,3,-2,null,-1], targetSum = -1", args: [[1, -2, -3, 1, 3, -2, null, -1], -1] },
      { name: "邊界：空樹 root = [], targetSum = 0", args: [[], 0] }
    ],

    cppLines: cppBlock(`
class Solution {
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        vector<vector<int>> res;
        vector<int> path;
        dfs(root, targetSum, path, res);
        return res;
    }
    void dfs(TreeNode* node, int remain, vector<int>& path, vector<vector<int>>& res) {
        if (node == nullptr) return;
        path.push_back(node->val);
        remain -= node->val;
        if (!node->left && !node->right && remain == 0) res.push_back(path);
        dfs(node->left, remain, path, res);
        dfs(node->right, remain, path, res);
        path.pop_back();
    }
};`),

    generateTrace(rootInput, targetInput) {
      const arr = Array.isArray(rootInput) ? rootInput.slice() : [];
      const target = Number(targetInput);
      const tree = buildTreeFromLevelOrder(arr, 620);
      const trace = [];
      const path = [];
      const pathNodes = [];
      const res = [];
      const resNodes = new Set();
      const status = {};
      let cur = null;
      let remain = "-";
      let ret = "-";

      const snap = (o = {}) => {
        const onPath = new Set(pathNodes.map((n) => n.id));
        const nodes = tree.nodes.map((n) => ({
          id: n.id,
          val: String(n.val),
          sub: !n.left && !n.right ? "葉" : "",
          x: n.x,
          y: n.y,
          status: o.foundIds && o.foundIds.has(n.id) ? "match" : cur && cur.id === n.id ? "hl" : onPath.has(n.id) ? "hl" : status[n.id] || "",
          ptr: cur && cur.id === n.id ? "node" : ""
        }));
        const edges = tree.edges.map((e) => ({
          ...e,
          status: o.foundIds && o.foundIds.has(e.from) && o.foundIds.has(e.to) ? "match" : onPath.has(e.from) && onPath.has(e.to) ? "hl" : ""
        }));
        const below = 52 + tree.height + 30;
        return {
          boards: [
            { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)", x: 325, y: 52, width: tree.width, height: tree.height, nodes, edges },
            {
              id: "path",
              type: "array",
              name: "path",
              typeLabel: "目前路徑 (vector<int>&)",
              x: 325,
              y: below,
              values: path.slice(),
              hl: o.pathHl ? [path.length - 1] : [],
              match: o.foundIds ? path.map((_, i) => i) : []
            },
            {
              id: "res",
              type: "dict",
              name: "res",
              typeLabel: "答案 (vector<vector<int>>)",
              x: 640,
              y: below,
              headers: ["#", "路徑"],
              rows: res.map((r, i) => ({ id: `r${i}`, key: String(i), val: arrStr(r), status: o.newRes === i ? "inserted" : ret !== "-" ? "hit" : "" }))
            },
            varsBoard([
              { id: "target", name: "targetSum", val: String(target), status: "" },
              { id: "node", name: "node", val: cur ? `Node(${cur.val})` : "-", status: cur ? "hl" : "" },
              { id: "remain", name: "remain", val: String(remain), status: o.hlVar === "remain" ? "hl" : remain === 0 ? "match" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ])
          ],
          connectors: o.connectors || []
        };
      };
      const vars = () => ({ targetSum: target, node: cur ? cur.val : "-", remain, path: arrStr(path), "res.size()": res.length, return: ret });

      trace.push(mkStep(5, "初始化 res 與 path", "default", "res = {}, path = {}",
        `準備收集所有總和為 ${target} 的根到葉路徑；path 是 DFS 過程中共用的路徑陣列。`, vars(), snap()));
      trace.push(mkStep(6, "從根節點開始 DFS", "default", tree.root ? `dfs(Node(${tree.root.val}), ${target})` : "dfs(nullptr, ...)",
        tree.root ? `從根節點 ${tree.root.val} 出發，remain 一開始等於 targetSum = ${target}。` : "樹是空的，dfs 一進去就會因 node == nullptr 直接返回。",
        vars(), snap()));
      if (!tree.root) {
        trace.push(mkStep(10, "空節點直接返回", "tag-check", "node == nullptr → return", "根節點為 nullptr，沒有任何路徑。", vars(), snap()));
      }

      const dfs = (node, rem, parent) => {
        if (!node) return;
        cur = node;
        path.push(node.val);
        pathNodes.push(node);
        remain = rem;
        trace.push(mkStep(11, `path 加入 ${node.val}`, "tag-insert", `path.push_back(${node.val}) → ${arrStr(path)}`,
          `走到節點 ${node.val}，把它加入目前路徑：${arrStr(path)}。`,
          vars(), snap({ pathHl: true, connectors: [{ from: `wb-node-tree-${node.id}`, to: `wb-cw-path-${path.length - 1}`, label: "push_back", color: "purple" }] })));
        rem -= node.val;
        remain = rem;
        const leaf = !node.left && !node.right;
        trace.push(mkStep(12, `remain = ${rem}`, "tag-check", `remain = ${rem + node.val} - ${node.val} = ${rem}`,
          `還需要的總和扣掉 ${node.val}，remain = ${rem}。${leaf ? "這是葉節點，接著檢查 remain 是否歸零。" : "不是葉節點，繼續往下走。"}`,
          vars(), snap({ hlVar: "remain" })));
        if (leaf) {
          if (rem === 0) {
            res.push(path.slice());
            const ids = new Set(pathNodes.map((n) => n.id));
            pathNodes.forEach((n) => resNodes.add(n.id));
            trace.push(mkStep(13, "找到一條路徑！", "tag-found", `葉節點且 remain == 0 → res.push_back(${arrStr(path)})`,
              `節點 ${node.val} 是葉節點，而且 remain 剛好為 0，代表 ${path.join(" + ")} = ${target}。把 path 複製一份加入 res。`,
              vars(), snap({ foundIds: ids, newRes: res.length - 1, connectors: [{ from: `wb-cw-path-${path.length - 1}`, to: `wb-dict-row-r${res.length - 1}`, label: "res.push_back", color: "green" }] })));
          } else {
            trace.push(mkStep(13, "葉節點但總和不符", "tag-check", `remain = ${rem} != 0`,
              `節點 ${node.val} 是葉節點，但 remain = ${rem} 不是 0，路徑 ${arrStr(path)} 的總和為 ${target - rem}，不等於 ${target}。`,
              vars(), snap()));
          }
        }
        dfs(node.left, rem, node);
        dfs(node.right, rem, node);
        cur = node;
        remain = rem;
        path.pop();
        pathNodes.pop();
        status[node.id] = resNodes.has(node.id) ? "match" : "done";
        trace.push(mkStep(16, `回溯移除 ${node.val}`, "default", `path.pop_back() → ${arrStr(path)}`,
          `節點 ${node.val} 的左右子樹都探索完畢，把它從 path 移除，回到${parent ? `父節點 ${parent.val}` : "呼叫端"}的狀態：${arrStr(path)}。`,
          vars(), snap({ connectors: parent ? [{ from: `wb-node-tree-${node.id}`, to: `wb-node-tree-${parent.id}`, label: "回溯", color: "blue" }] : [] })));
      };
      dfs(tree.root, target, null);
      cur = null;
      remain = "-";
      ret = res.length ? `[${res.map(arrStr).join(",")}]` : "[]";
      trace.push(mkStep(7, "回傳所有路徑", "tag-found", `return ${ret}`,
        res.length ? `共找到 ${res.length} 條總和為 ${target} 的根到葉路徑：${ret}。` : `沒有任何根到葉路徑的總和等於 ${target}，回傳空陣列。`,
        vars(), snap({ connectors: res.length ? [{ from: "wb-dict-row-r0", to: "wb-var-ret", label: "res", color: "green" }] : [] })));
      return trace;
    }
  };
})();

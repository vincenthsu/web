/**
 * Grind 75 延伸題 — Problems #136 to #147
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ==========================================================================
  // 共用輔助函式（僅限本檔 IIFE 內使用）
  // ==========================================================================
  const e06Esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const E06_KW = new Set([
    "class", "struct", "public", "private", "return", "if", "else", "for", "while", "bool", "int", "char",
    "void", "auto", "const", "new", "nullptr", "true", "false", "break", "continue", "long", "unsigned"
  ]);
  const E06_TYPES = new Set([
    "Solution", "TreeNode", "ListNode", "TrieNode", "vector", "string", "stack", "queue", "unordered_map",
    "unordered_set", "map", "set", "priority_queue", "greater", "size_t"
  ]);

  // 將純文字 C++ 程式碼轉成帶 .tok-* 上色、且已轉義 < > & 的 HTML。
  const e06Hl = (src) => {
    const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\b)|([A-Za-z_]\w*)|([\s\S])/g;
    let out = "";
    let m;
    while ((m = re.exec(src)) !== null) {
      const [tok, cmt, str, num, ident] = m;
      if (cmt) out += `<span class="tok-cmt">${e06Esc(cmt)}</span>`;
      else if (str) out += `<span class="tok-num">${e06Esc(str)}</span>`;
      else if (num) out += `<span class="tok-num">${num}</span>`;
      else if (ident) {
        if (E06_KW.has(ident)) out += `<span class="tok-kw">${ident}</span>`;
        else if (E06_TYPES.has(ident)) out += `<span class="tok-type">${ident}</span>`;
        else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += `<span class="tok-fn">${ident}</span>`;
        else if (/^INT_M(AX|IN)$/.test(ident)) out += `<span class="tok-num">${ident}</span>`;
        else out += ident;
      } else out += e06Esc(tok);
    }
    return out;
  };
  const e06Lines = (arr) => arr.map((code, i) => ({ line: i + 1, code: e06Hl(code) }));

  const e06Vars = (o) => {
    const r = {};
    Object.keys(o).forEach((k) => {
      r[k] = String(o[k]);
    });
    return r;
  };
  const e06Step = (line, tag, tagType, inlineBadge, explanation, vars, state) => ({
    line,
    tag,
    tagType,
    inlineBadge,
    explanation,
    vars: e06Vars(vars),
    state
  });
  const e06Clone = (v) => JSON.parse(JSON.stringify(v));

  // ==========================================================================
  // #136 Search a 2D Matrix (LC #74, Medium)
  // ==========================================================================
  window.PROBLEMS["search-a-2d-matrix"] = {
    id: 136,
    leetcodeId: 74,
    slug: "search-a-2d-matrix",
    title: "74. Search a 2D Matrix (搜尋二維矩陣)",
    difficulty: "Medium",
    topic: "Binary Search / Matrix",
    mins: 30,
    complexity: "Time O(log(m·n)) · Space O(1)",
    argNames: ["matrix", "target"],
    description:
      "矩陣每列由左到右遞增，且每列第一個數大於上一列最後一個數，因此把整個 m × n 矩陣依列串接後就是一條遞增序列。將一維索引 mid 換算為 (mid / n, mid % n) 直接在矩陣上做二分搜尋：值相等即回傳 true，較小則 lo = mid + 1，較大則 hi = mid - 1，區間為空時回傳 false。時間 O(log(m·n))，空間 O(1)。",

    presets: [
      { name: "範例 1：matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3] },
      { name: "範例 2：同矩陣, target = 13（不存在）", args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13] },
      { name: "邊界：matrix = [[1]], target = 1", args: [[[1]], 1] },
      { name: "特殊：單列 matrix = [[1,3]], target = 3", args: [[[1, 3]], 3] },
      { name: "特殊：target = 60 位於最後一格", args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 60] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    bool searchMatrix(vector<vector<int>>& matrix, int target) {",
      "        int m = matrix.size(), n = matrix[0].size();",
      "        int lo = 0, hi = m * n - 1;",
      "        while (lo <= hi) {",
      "            int mid = lo + (hi - lo) / 2;",
      "            int val = matrix[mid / n][mid % n];",
      "            if (val == target) return true;",
      "            if (val < target) lo = mid + 1;",
      "            else hi = mid - 1;",
      "        }",
      "        return false;",
      "    }",
      "};"
    ]),

    generateTrace(matrixInput, targetInput) {
      const matrix = e06Clone(matrixInput);
      const target = Number(targetInput);
      const m = matrix.length;
      const n = matrix[0].length;
      const steps = [];
      let lo = "-";
      let hi = "-";
      let mid = "-";
      let val = "-";
      let ret = "-";
      let found = -1;

      const snap = (opts = {}) => {
        const { hlVar = "", connectors = [] } = opts;
        const hl = [];
        const done = [];
        const match = [];
        for (let k = 0; k < m * n; k++) {
          const key = `${Math.floor(k / n)},${k % n}`;
          if (found === k) match.push(key);
          else if (mid !== "-" && k === mid) hl.push(key);
          else if (lo !== "-" && (k < lo || k > hi)) done.push(key);
        }
        const rc = mid === "-" ? "-" : `(${Math.floor(mid / n)}, ${mid % n})`;
        return {
          boards: [
            {
              id: "mat",
              type: "grid",
              name: "matrix",
              typeLabel: `矩陣 ${m}×${n} (vector&lt;vector&lt;int&gt;&gt;)`,
              x: 325,
              y: 52,
              cells: matrix.map((row) => row.map(String)),
              hl,
              match,
              done
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "二分搜尋狀態",
              x: 24,
              y: 215,
              items: [
                { id: "target", name: "target", val: String(target), status: "" },
                { id: "mn", name: "m × n", val: `${m} × ${n}`, status: "" },
                { id: "lo", name: "lo", val: String(lo), status: hlVar === "lo" ? "hl" : "" },
                { id: "hi", name: "hi", val: String(hi), status: hlVar === "hi" ? "hl" : "" },
                { id: "mid", name: "mid", val: String(mid), status: hlVar === "mid" ? "hl" : "" },
                { id: "rc", name: "(mid/n, mid%n)", val: rc, status: hlVar === "mid" ? "hl" : "" },
                { id: "val", name: "val", val: String(val), status: hlVar === "val" ? "hl" : found >= 0 ? "match" : "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = () => ({ lo, hi, mid, val, return: ret });

      steps.push(e06Step(4, "取得矩陣尺寸", "default", `m = ${m}, n = ${n}`,
        `矩陣共有 ${m} 列 ${n} 欄。由於整個矩陣依列串接後是一條遞增序列，可以把它當作長度 ${m * n} 的一維陣列做二分搜尋。`,
        V(), snap()));
      lo = 0;
      hi = m * n - 1;
      steps.push(e06Step(5, "初始化搜尋區間", "default", `lo = 0, hi = ${hi}`,
        `搜尋區間設為一維索引 [0, ${hi}]，涵蓋整個矩陣。`, V(), snap({ hlVar: "hi" })));

      while (true) {
        if (!(lo <= hi)) {
          steps.push(e06Step(6, "區間為空", "tag-check", `lo = ${lo} > hi = ${hi}`,
            `lo (${lo}) 已大於 hi (${hi})，搜尋區間為空，代表 target = ${target} 不在矩陣中。`, V(), snap()));
          break;
        }
        steps.push(e06Step(6, "檢查區間", "tag-check", `lo = ${lo} ≤ hi = ${hi}`,
          `區間 [${lo}, ${hi}] 仍有 ${hi - lo + 1} 個候選位置，繼續二分。`, V(), snap()));
        mid = lo + Math.floor((hi - lo) / 2);
        const r = Math.floor(mid / n);
        const c = mid % n;
        steps.push(e06Step(7, "計算中點", "default", `mid = ${lo} + (${hi} - ${lo}) / 2 = ${mid}`,
          `取區間中點 mid = ${mid}，對應矩陣位置 (${mid} / ${n}, ${mid} % ${n}) = (${r}, ${c})。`, V(),
          snap({ hlVar: "mid", connectors: [{ from: "wb-var-mid", to: `wb-grid-mat-${r}-${c}`, label: `(${r}, ${c})`, color: "blue" }] })));
        val = matrix[r][c];
        steps.push(e06Step(8, "讀取中點值", "tag-check", `val = matrix[${r}][${c}] = ${val}`,
          `讀出 matrix[${r}][${c}] = ${val}，準備與 target = ${target} 比較。`, V(),
          snap({ hlVar: "val", connectors: [{ from: `wb-grid-mat-${r}-${c}`, to: "wb-var-val", label: `讀取 ${val}`, color: "blue" }] })));
        if (val === target) {
          found = mid;
          ret = "true";
          steps.push(e06Step(9, "找到目標", "tag-found", `${val} == ${target} ➜ return true`,
            `matrix[${r}][${c}] 等於 target = ${target}，找到目標，回傳 true。`, V(),
            snap({ connectors: [{ from: `wb-grid-mat-${r}-${c}`, to: "wb-var-ret", label: "命中", color: "green" }] })));
          return steps;
        }
        steps.push(e06Step(9, "不相等", "tag-check", `${val} != ${target}`,
          `${val} 不等於 ${target}，需要判斷要往哪一半繼續搜尋。`, V(), snap()));
        if (val < target) {
          lo = mid + 1;
          steps.push(e06Step(10, "捨棄左半", "default", `${val} 小於 ${target} ➜ lo = ${lo}`,
            `${val} 比 target 小，答案只可能在 mid 右側，將 lo 移到 mid + 1 = ${lo}。`, V(), snap({ hlVar: "lo" })));
        } else {
          hi = mid - 1;
          steps.push(e06Step(11, "捨棄右半", "default", `${val} 大於 ${target} ➜ hi = ${hi}`,
            `${val} 比 target 大，答案只可能在 mid 左側，將 hi 移到 mid - 1 = ${hi}。`, V(), snap({ hlVar: "hi" })));
        }
        mid = "-";
        val = "-";
      }
      ret = "false";
      steps.push(e06Step(13, "回傳 false", "tag-found", "return false",
        `整個矩陣都找不到 ${target}，回傳 false。`, V(), snap()));
      return steps;
    }
  };

  // ==========================================================================
  // #137 Largest Number (LC #179, Medium)
  // ==========================================================================
  window.PROBLEMS["largest-number"] = {
    id: 137,
    leetcodeId: 179,
    slug: "largest-number",
    title: "179. Largest Number (最大數)",
    difficulty: "Medium",
    topic: "String / Sorting (Custom Comparator)",
    mins: 20,
    complexity: "Time O(n log n · L) · Space O(n · L)",
    argNames: ["nums"],
    description:
      "先把每個整數轉成字串，再以自訂比較器排序：若 a + b 串接後比 b + a 大，a 就應排在 b 前面。這個順序具有遞移性，排序後依序串接即得最大數。若排序後第一個字串是 \"0\"，代表全部都是 0，直接回傳 \"0\" 以避免前導零。時間 O(n log n · L)（L 為數字位數），空間 O(n · L)。",

    presets: [
      { name: "範例 1：nums = [10,2]", args: [[10, 2]] },
      { name: "範例 2：nums = [3,30,34,5,9]", args: [[3, 30, 34, 5, 9]] },
      { name: "邊界：nums = [0,0]（全為 0）", args: [[0, 0]] },
      { name: "特殊：nums = [432,43243]（共同前綴）", args: [[432, 43243]] },
      { name: "特殊：nums = [8,308,830]", args: [[8, 308, 830]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    string largestNumber(vector<int>& nums) {",
      "        vector<string> s;",
      "        for (int x : nums) s.push_back(to_string(x));",
      "        sort(s.begin(), s.end(), [](const string& a, const string& b) {",
      "            return a + b > b + a;",
      "        });",
      "        if (s[0] == \"0\") return \"0\";",
      "        string res;",
      "        for (const string& t : s) res += t;",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput) {
      const nums = e06Clone(numsInput);
      const steps = [];
      const s = [];
      let a = "-";
      let b = "-";
      let cmp = "-";
      let res = "";
      let ret = "-";
      let sortedUpTo = -1;

      const snap = (opts = {}) => {
        const { hl = [], match = [], ptrs = [], hlVar = "", connectors = [], resBoard = false, resHl = -1 } = opts;
        const boards = [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "輸入 (vector&lt;int&gt;)",
            x: 325,
            y: 52,
            values: nums.map(String),
            hl: opts.numsHl !== undefined ? [opts.numsHl] : [],
            done: []
          },
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: "字串陣列 (vector&lt;string&gt;)",
            x: 325,
            y: 175,
            values: s.map((t) => `"${t}"`),
            hl,
            match,
            done: sortedUpTo >= 0 ? s.map((_, i) => i).filter((i) => i <= sortedUpTo && !hl.includes(i) && !match.includes(i)) : [],
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "比較器與結果",
            x: 24,
            y: 215,
            items: [
              { id: "a", name: "a", val: a === "-" ? "-" : `"${a}"`, status: hlVar === "cmp" ? "hl" : "" },
              { id: "b", name: "b", val: b === "-" ? "-" : `"${b}"`, status: hlVar === "cmp" ? "hl" : "" },
              { id: "cmp", name: "a+b vs b+a", val: cmp, status: hlVar === "cmp" ? "hl" : "" },
              { id: "res", name: "res", val: `"${res}"`, status: hlVar === "res" ? "hl" : "" },
              { id: "ret", name: "return", val: ret === "-" ? "-" : `"${ret}"`, status: ret !== "-" ? "match" : "" }
            ]
          }
        ];
        if (resBoard) {
          boards.push({
            id: "res",
            type: "array",
            name: "res",
            typeLabel: "結果字串 (string)",
            x: 325,
            y: 300,
            values: res.length ? res.split("") : [],
            hl: resHl >= 0 ? Array.from({ length: res.length - resHl }, (_, k) => resHl + k) : [],
            match: ret !== "-" ? res.split("").map((_, i) => i) : []
          });
        }
        return { boards, connectors };
      };
      const V = () => ({ a: a === "-" ? "-" : a, b: b === "-" ? "-" : b, res, return: ret });

      steps.push(e06Step(4, "建立字串陣列", "default", "s = {}（空字串陣列）",
        `建立空的字串陣列 s，準備把 ${nums.length} 個整數逐一轉成字串，方便比較「串接後」的大小。`, V(), snap()));
      for (let i = 0; i < nums.length; i++) {
        s.push(String(nums[i]));
        steps.push(e06Step(5, `轉字串 ${nums[i]}`, "tag-insert", `s.push_back("${nums[i]}")`,
          `把 nums[${i}] = ${nums[i]} 轉成字串 "${nums[i]}" 放入 s[${i}]。`, V(),
          snap({ numsHl: i, hl: [i], connectors: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-s-${i}`, label: "to_string", color: "purple" }] })));
      }

      // std::sort 在小陣列時以插入排序完成；此處依插入排序的順序展示每次比較器呼叫。
      sortedUpTo = 0;
      steps.push(e06Step(6, "開始自訂排序", "default", "sort(s, a+b > b+a)",
        `以比較器 a + b > b + a 排序：若 a 串在前面得到的數字較大，a 就該排在 b 前。小陣列時 std::sort 以插入排序完成，以下逐次展示比較。`, V(), snap()));
      for (let i = 1; i < s.length; i++) {
        const key = s[i];
        let j = i - 1;
        steps.push(e06Step(6, `插入 "${key}"`, "default", `key = s[${i}] = "${key}"`,
          `取出 s[${i}] = "${key}"，要把它插入前面已排好序的 s[0..${i - 1}] 中的正確位置。`, V(),
          snap({ hl: [i], ptrs: [{ idx: i, label: "key", color: "purple" }] })));
        while (j >= 0) {
          a = key;
          b = s[j];
          const ab = a + b;
          const ba = b + a;
          const before = ab > ba;
          cmp = `"${ab}" ${before ? ">" : "≤"} "${ba}"`;
          const keyPos = j + 1;
          steps.push(e06Step(7, before ? "a 應在前" : "b 保持在前", "tag-check", `"${ab}" > "${ba}" ➜ ${before}`,
            before
              ? `比較 a = "${a}"、b = "${b}"：${ab} 大於 ${ba}，所以 "${a}" 應排在 "${b}" 前面，"${b}" 往右移一格。`
              : `比較 a = "${a}"、b = "${b}"：${ab} 不大於 ${ba}，"${b}" 應留在前面，"${a}" 就插在它後面。`,
            V(),
            snap({
              hl: [keyPos, j],
              ptrs: [{ idx: keyPos, label: "a", color: "purple" }, { idx: j, label: "b", color: "blue" }],
              hlVar: "cmp",
              connectors: [{ from: `wb-cw-s-${keyPos}`, to: "wb-var-cmp", label: before ? "a 在前" : "b 在前", color: before ? "purple" : "blue" }]
            })));
          if (!before) break;
          s[j + 1] = s[j];
          s[j] = key;
          j--;
        }
        sortedUpTo = i;
        a = "-";
        b = "-";
        cmp = "-";
        steps.push(e06Step(8, `"${key}" 定位`, "tag-insert", `s[${j + 1}] = "${key}"`,
          `"${key}" 放在 s[${j + 1}]，目前 s[0..${i}] = [${s.slice(0, i + 1).map((t) => `"${t}"`).join(", ")}] 已依串接規則排序。`, V(),
          snap({ match: [j + 1] })));
      }

      if (s[0] === "0") {
        ret = "0";
        steps.push(e06Step(9, "全為 0", "tag-found", 's[0] == "0" ➜ return "0"',
          `排序後最大的字串仍是 "0"，表示所有數字都是 0，直接回傳 "0" 避免出現 "${s.join("")}" 這種前導零。`, V(),
          snap({ match: [0], connectors: [{ from: "wb-cw-s-0", to: "wb-var-ret", label: '"0"', color: "green" }] })));
        return steps;
      }
      steps.push(e06Step(9, "檢查前導零", "tag-check", `s[0] = "${s[0]}" != "0"`,
        `s[0] = "${s[0]}" 不是 "0"，結果不會是全零，開始串接。`, V(), snap({ hl: [0] })));
      steps.push(e06Step(10, "建立結果字串", "default", 'res = ""',
        "宣告空字串 res，依排序後的順序把每個字串接上去。", V(), snap({ resBoard: true })));
      for (let i = 0; i < s.length; i++) {
        const start = res.length;
        res += s[i];
        steps.push(e06Step(11, `串接 "${s[i]}"`, "tag-insert", `res += "${s[i]}" ➜ "${res}"`,
          `把 s[${i}] = "${s[i]}" 接到 res 後面，res 變成 "${res}"。`, V(),
          snap({ hl: [i], hlVar: "res", resBoard: true, resHl: start,
            connectors: [{ from: `wb-cw-s-${i}`, to: `wb-cw-res-${start}`, label: "+=", color: "purple" }] })));
      }
      ret = res;
      steps.push(e06Step(12, "回傳最大數", "tag-found", `return "${res}"`,
        `所有字串串接完成，最大數為 "${res}"。`, V(),
        snap({ match: s.map((_, i) => i), resBoard: true, connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: "回傳", color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #138 Word Search II (LC #212, Hard)
  // ==========================================================================
  window.PROBLEMS["word-search-ii"] = {
    id: 138,
    leetcodeId: 212,
    slug: "word-search-ii",
    title: "212. Word Search II (單詞搜尋 II)",
    difficulty: "Hard",
    topic: "Trie / Backtracking (DFS)",
    mins: 40,
    complexity: "Time O(m·n·4·3^(L-1)) · Space O(總字母數)",
    argNames: ["board", "words"],
    description:
      "先把所有單字插入字典樹 (Trie)，終點節點記錄完整單字。接著以每個格子為起點做 DFS，並讓 Trie 指標隨路徑同步往下走：若格子已走過（標成 #）或 Trie 沒有對應子節點就立刻剪枝；走到記錄單字的節點時加入答案並清空該單字以避免重複。往四個方向遞迴後再還原格子。時間約 O(m·n·4·3^(L-1))（L 為最長單字長度），空間 O(總字母數)。",

    presets: [
      {
        name: "範例 1：board 4×4, words = [\"oath\",\"pea\",\"eat\",\"rain\"]",
        args: [[["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"]]
      },
      { name: "範例 2：board = [[a,b],[c,d]], words = [\"abcb\"]（無解）", args: [[["a", "b"], ["c", "d"]], ["abcb"]] },
      { name: "特殊：多個單字共用前綴 [\"ab\",\"abdc\",\"ca\",\"bd\",\"x\"]", args: [[["a", "b"], ["c", "d"]], ["ab", "abdc", "ca", "bd", "x"]] },
      { name: "邊界：board = [[a]], words = [\"a\"]", args: [[["a"]], ["a"]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "    struct TrieNode {",
      "        TrieNode* next[26] = {};",
      "        string word;",
      "    };",
      "    vector<string> res;",
      "    void dfs(vector<vector<char>>& b, int r, int c, TrieNode* p) {",
      "        char ch = b[r][c];",
      "        if (ch == '#' || !p->next[ch - 'a']) return;",
      "        p = p->next[ch - 'a'];",
      "        if (!p->word.empty()) { res.push_back(p->word); p->word.clear(); }",
      "        b[r][c] = '#';",
      "        if (r > 0) dfs(b, r - 1, c, p);",
      "        if (c > 0) dfs(b, r, c - 1, p);",
      "        if (r + 1 < (int)b.size()) dfs(b, r + 1, c, p);",
      "        if (c + 1 < (int)b[0].size()) dfs(b, r, c + 1, p);",
      "        b[r][c] = ch;",
      "    }",
      "public:",
      "    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {",
      "        TrieNode* root = new TrieNode();",
      "        for (const string& w : words) {",
      "            TrieNode* p = root;",
      "            for (char ch : w) {",
      "                if (!p->next[ch - 'a']) p->next[ch - 'a'] = new TrieNode();",
      "                p = p->next[ch - 'a'];",
      "            }",
      "            p->word = w;",
      "        }",
      "        for (int i = 0; i < (int)board.size(); i++)",
      "            for (int j = 0; j < (int)board[0].size(); j++)",
      "                dfs(board, i, j, root);",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(boardInput, wordsInput) {
      const b = e06Clone(boardInput);
      const words = e06Clone(wordsInput);
      const R = b.length;
      const C = b[0].length;
      const steps = [];

      // ---- Trie 結構 ----
      const trie = [{ id: "t0", ch: "root", depth: 0, next: {}, word: "", endWord: "", parent: -1 }];
      const res = [];
      const callStack = [];
      let curNode = -1;
      let curCell = null;
      const foundNodes = new Set();

      const layoutTrie = () => {
        // 以葉節點順序分配 x，深度決定 y，確保同層水平對齊。
        let leaf = 0;
        const pos = {};
        const walk = (idx) => {
          const kids = Object.keys(trie[idx].next).sort().map((k) => trie[idx].next[k]);
          if (!kids.length) {
            pos[idx] = 40 + leaf * 56;
            leaf++;
          } else {
            kids.forEach(walk);
            pos[idx] = Math.round((pos[kids[0]] + pos[kids[kids.length - 1]]) / 2);
          }
        };
        walk(0);
        const maxDepth = trie.reduce((mx, t) => Math.max(mx, t.depth), 0);
        return { pos, width: Math.max(260, 40 + leaf * 56 + 20), height: Math.max(170, 40 + maxDepth * 62 + 60) };
      };

      const snap = (opts = {}) => {
        const { trieHl = -1, cellHl = null, connectors = [], hlVar = "", ret = "-", vars = {} } = opts;
        const lay = layoutTrie();
        const pathSet = new Set(callStack.map((f) => f.node));
        const nodes = trie.map((t, idx) => ({
          id: t.id,
          val: t.ch === "root" ? "∅" : t.ch,
          sub: t.word ? `"${t.word}"` : t.endWord ? `✓${t.endWord}` : "",
          x: lay.pos[idx],
          y: 40 + t.depth * 62,
          status: idx === trieHl ? "hl" : foundNodes.has(idx) ? "match" : pathSet.has(idx) ? "done" : "",
          ptr: idx === trieHl ? "p" : ""
        }));
        const edges = [];
        trie.forEach((t, idx) => {
          Object.keys(t.next).forEach((k) => {
            const to = t.next[k];
            edges.push({ from: t.id, to: trie[to].id, dir: true, status: to === trieHl ? "hl" : "" });
          });
        });
        const hlCells = [];
        const doneCells = [];
        for (let r = 0; r < R; r++) {
          for (let c = 0; c < C; c++) {
            if (cellHl && cellHl[0] === r && cellHl[1] === c) hlCells.push(`${r},${c}`);
            else if (b[r][c] === "#") doneCells.push(`${r},${c}`);
          }
        }
        const gridW = 60 + C * 40;
        const gridH = 70 + R * 36;
        return {
          boards: [
            {
              id: "board",
              type: "grid",
              name: "board",
              typeLabel: "字母矩陣（# 表示路徑中）",
              x: 325,
              y: 52,
              cells: b.map((row) => row.map((ch) => (ch === "#" ? "#" : ch))),
              hl: hlCells,
              done: doneCells
            },
            {
              id: "trie",
              type: "tree",
              shape: "circle",
              name: "root",
              typeLabel: "字典樹 (TrieNode*)",
              x: 325 + gridW + 40,
              y: 52,
              width: lay.width,
              height: lay.height,
              nodes,
              edges
            },
            {
              id: "res",
              type: "set",
              name: "res",
              typeLabel: "找到的單字 (vector&lt;string&gt;)",
              x: 325,
              y: 52 + gridH + 30,
              items: res.map((w, i) => ({ val: `"${w}"`, status: opts.newRes === i ? "inserted" : "" }))
            },
            {
              id: "calls",
              type: "stack",
              name: "dfs 呼叫堆疊",
              typeLabel: "遞迴路徑 (r, c)",
              x: 325,
              y: 52 + gridH + 120,
              items: callStack.map((f, i) => ({ val: `(${f.r},${f.c}) '${f.ch}'`, status: i === callStack.length - 1 ? "hl" : "" }))
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "DFS 狀態",
              x: 24,
              y: 215,
              items: [
                { id: "rc", name: "(r, c)", val: vars.rc || "-", status: hlVar === "rc" ? "hl" : "" },
                { id: "ch", name: "ch", val: vars.ch || "-", status: hlVar === "ch" ? "hl" : "" },
                { id: "p", name: "p", val: vars.p || "-", status: "" },
                { id: "word", name: "word", val: vars.word || "-", status: "" },
                { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const trieLabel = (idx) => {
        if (idx === 0) return "root";
        let s = "";
        let k = idx;
        while (k > 0) {
          s = trie[k].ch + s;
          k = trie[k].parent;
        }
        return `"${s}"`;
      };

      steps.push(e06Step(21, "建立 Trie 根節點", "default", "root = new TrieNode()",
        `建立空的字典樹根節點，準備插入 ${words.length} 個單字：${words.map((w) => `"${w}"`).join("、")}。`,
        { w: "-", ch: "-", "res.size()": 0, return: "-" }, snap({ trieHl: 0, vars: { p: "root" } })));

      words.forEach((w) => {
        let p = 0;
        for (const ch of w) {
          let created = false;
          if (trie[p].next[ch] === undefined) {
            trie.push({ id: `t${trie.length}`, ch, depth: trie[p].depth + 1, next: {}, word: "", endWord: "", parent: p });
            trie[p].next[ch] = trie.length - 1;
            created = true;
          }
          const parent = p;
          p = trie[p].next[ch];
          steps.push(e06Step(created ? 25 : 26, created ? `新增節點 '${ch}'` : `沿用節點 '${ch}'`, created ? "tag-insert" : "default",
            created ? `p->next['${ch}'] = new TrieNode()` : `p = p->next['${ch}']`,
            created
              ? `插入 "${w}"：${trieLabel(parent)} 底下沒有 '${ch}'，新建子節點後移動過去。`
              : `插入 "${w}"：${trieLabel(parent)} 底下已有 '${ch}'（共用前綴），直接往下走。`,
            { w, ch, "res.size()": res.length, return: "-" },
            snap({ trieHl: p, vars: { ch: `'${ch}'`, p: trieLabel(p), word: `"${w}"` },
              connectors: [{ from: `wb-node-trie-${trie[parent].id}`, to: `wb-node-trie-${trie[p].id}`, label: `'${ch}'`, color: created ? "purple" : "blue" }] })));
        }
        trie[p].word = w;
        steps.push(e06Step(28, `標記單字 "${w}"`, "tag-insert", `p->word = "${w}"`,
          `"${w}" 的最後一個字母節點記錄完整單字，之後 DFS 走到這裡就代表找到它。`,
          { w, ch: "-", "res.size()": res.length, return: "-" },
          snap({ trieHl: p, vars: { p: trieLabel(p), word: `"${w}"` } })));
      });

      const dfs = (r, c, p) => {
        const ch = b[r][c];
        const vars = { rc: `(${r}, ${c})`, ch: `'${ch}'`, p: trieLabel(p) };
        const baseVars = () => ({ w: "-", ch, "res.size()": res.length, return: "-" });
        if (ch === "#" || trie[p].next[ch] === undefined) {
          steps.push(e06Step(9, ch === "#" ? "已在路徑中" : "Trie 無此字母", "tag-check",
            ch === "#" ? `b[${r}][${c}] == '#' ➜ return` : `!p->next['${ch}'] ➜ return`,
            ch === "#"
              ? `(${r}, ${c}) 已在目前路徑上（標成 #），不能重複使用，剪枝返回。`
              : `${trieLabel(p)} 之後沒有以 '${ch}' 延續的單字，剪枝返回。`,
            baseVars(), snap({ cellHl: [r, c], trieHl: p, hlVar: "ch", vars,
              connectors: [{ from: `wb-grid-board-${r}-${c}`, to: `wb-node-trie-${trie[p].id}`, label: "✗ 剪枝", color: "red" }] })));
          return;
        }
        const np = trie[p].next[ch];
        callStack.push({ r, c, ch, node: np });
        vars.p = trieLabel(np);
        steps.push(e06Step(10, `前進 '${ch}'`, "tag-check", `p = p->next['${ch}'] ➜ ${trieLabel(np)}`,
          `(${r}, ${c}) 的 '${ch}' 在 Trie 中有對應節點，指標 p 前進到 ${trieLabel(np)}。`,
          baseVars(), snap({ cellHl: [r, c], trieHl: np, hlVar: "rc", vars,
            connectors: [{ from: `wb-grid-board-${r}-${c}`, to: `wb-node-trie-${trie[np].id}`, label: `'${ch}'`, color: "blue" }] })));
        if (trie[np].word) {
          const w = trie[np].word;
          res.push(w);
          trie[np].endWord = w;
          trie[np].word = "";
          foundNodes.add(np);
          steps.push(e06Step(11, `找到 "${w}"`, "tag-found", `res.push_back("${w}")`,
            `p 所在節點記錄著單字 "${w}"，加入答案後把 p->word 清空，避免從別的起點重複加入。`,
            { w, ch, "res.size()": res.length, return: "-" },
            snap({ cellHl: [r, c], trieHl: np, vars: { ...vars, word: `"${w}"` }, newRes: res.length - 1,
              connectors: [{ from: `wb-node-trie-${trie[np].id}`, to: `wb-chip-res-${res.length - 1}`, label: "加入答案", color: "green" }] })));
        }
        b[r][c] = "#";
        steps.push(e06Step(12, "標記走過", "tag-insert", `b[${r}][${c}] = '#'`,
          `把 (${r}, ${c}) 暫時改成 #，避免同一條路徑重複使用這個格子，接著往上、左、下、右四個方向遞迴。`,
          baseVars(), snap({ cellHl: [r, c], trieHl: np, vars })));
        const nbrs = [
          [r > 0, r - 1, c],
          [c > 0, r, c - 1],
          [r + 1 < R, r + 1, c],
          [c + 1 < C, r, c + 1]
        ];
        nbrs.forEach(([ok, nr, nc]) => {
          if (ok) dfs(nr, nc, np);
        });
        b[r][c] = ch;
        callStack.pop();
        steps.push(e06Step(17, "回溯還原", "default", `b[${r}][${c}] = '${ch}'`,
          `四個方向都試完，把 (${r}, ${c}) 還原成 '${ch}' 並返回上一層。`,
          baseVars(), snap({ cellHl: [r, c], trieHl: p, vars })));
      };

      for (let i = 0; i < R; i++) {
        for (let j = 0; j < C; j++) dfs(i, j, 0);
      }
      const ret = `[${res.map((w) => `"${w}"`).join(", ")}]`;
      steps.push(e06Step(33, "回傳答案", "tag-found", `return ${ret}`,
        res.length ? `所有起點都搜尋完畢，共找到 ${res.length} 個單字：${ret}。` : "所有起點都搜尋完畢，沒有任何單字能在矩陣中拼出，回傳空陣列。",
        { w: "-", ch: "-", "res.size()": res.length, return: ret },
        snap({ ret, connectors: res.length ? [{ from: "wb-chip-res-0", to: "wb-var-ret", label: "回傳", color: "green" }] : [] })));
      return steps;
    }
  };

  // ==========================================================================
  // #139 Alien Dictionary (LC #269, Hard, Premium)
  // ==========================================================================
  window.PROBLEMS["alien-dictionary"] = {
    id: 139,
    leetcodeId: 269,
    slug: "alien-dictionary",
    title: "269. Alien Dictionary (外星字典)",
    difficulty: "Hard",
    topic: "Graph / Topological Sort (Kahn BFS)",
    mins: 45,
    complexity: "Time O(C) · Space O(U + min(U², N))",
    argNames: ["words"],
    description:
      "相鄰兩個單字第一個不同的字母決定一條先後關係 a[j] → b[j]，把所有字母當作節點、這些關係當作有向邊，再做 Kahn 拓撲排序：入度為 0 的字母先放入佇列，取出時接到答案並把鄰居入度減一。若前一個單字比後一個長且後者是它的前綴，或排序後字母數不足（有環），代表順序矛盾，回傳空字串。C 為所有字母總數、U 為不同字母數；時間 O(C)，空間 O(U + min(U², N))。",

    presets: [
      { name: "範例 1：words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]", args: [["wrt", "wrf", "er", "ett", "rftt"]] },
      { name: "範例 2：words = [\"z\",\"x\"]", args: [["z", "x"]] },
      { name: "範例 3：words = [\"z\",\"x\",\"z\"]（有環）", args: [["z", "x", "z"]] },
      { name: "邊界：words = [\"abc\",\"ab\"]（前綴矛盾）", args: [["abc", "ab"]] },
      { name: "特殊：words = [\"ac\",\"ab\",\"zc\",\"zb\"]", args: [["ac", "ab", "zc", "zb"]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    string alienOrder(vector<string>& words) {",
      "        map<char, set<char>> adj;",
      "        map<char, int> indeg;",
      "        for (const string& w : words)",
      "            for (char c : w) indeg.emplace(c, 0);",
      "        for (int i = 0; i + 1 < (int)words.size(); i++) {",
      "            const string& a = words[i];",
      "            const string& b = words[i + 1];",
      "            int len = min(a.size(), b.size());",
      "            if (a.size() > b.size() && a.compare(0, len, b) == 0) return \"\";",
      "            for (int j = 0; j < len; j++) {",
      "                if (a[j] != b[j]) {",
      "                    if (adj[a[j]].insert(b[j]).second) indeg[b[j]]++;",
      "                    break;",
      "                }",
      "            }",
      "        }",
      "        queue<char> q;",
      "        for (auto& [c, d] : indeg) if (d == 0) q.push(c);",
      "        string res;",
      "        while (!q.empty()) {",
      "            char c = q.front(); q.pop();",
      "            res += c;",
      "            for (char nx : adj[c])",
      "                if (--indeg[nx] == 0) q.push(nx);",
      "        }",
      "        return res.size() == indeg.size() ? res : \"\";",
      "    }",
      "};"
    ]),

    generateTrace(wordsInput) {
      const words = e06Clone(wordsInput);
      const steps = [];
      const indeg = {};
      const adj = {};
      const edges = [];
      const q = [];
      let res = "";
      let ret = "-";
      let chars = [];
      const out = new Set();

      const coords = () => {
        const n = chars.length;
        const cx = 150;
        const cy = 110;
        const map = {};
        chars.forEach((ch, i) => {
          if (n === 1) map[ch] = { x: cx, y: cy };
          else {
            const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
            map[ch] = { x: Math.round(cx + 110 * Math.cos(ang)), y: Math.round(cy + 75 * Math.sin(ang)) };
          }
        });
        return map;
      };

      const snap = (opts = {}) => {
        const { wordsHl = [], wordPtrs = [], nodeHl = [], edgeHl = null, connectors = [], qHl = -1, vars = {}, hlVar = "" } = opts;
        const pos = coords();
        const boards = [
          {
            id: "words",
            type: "array",
            name: "words",
            typeLabel: "外星字典排序的單字 (vector&lt;string&gt;)",
            x: 325,
            y: 52,
            values: words.map((w) => `"${w}"`),
            hl: wordsHl,
            pointers: wordPtrs
          },
          {
            id: "g",
            type: "graph",
            shape: "graph",
            name: "adj",
            typeLabel: "字母先後關係圖 (map&lt;char, set&lt;char&gt;&gt;)",
            x: 325,
            y: 175,
            width: 300,
            height: 230,
            nodes: chars.map((ch) => ({
              id: ch,
              val: ch,
              sub: `in=${indeg[ch]}`,
              x: pos[ch].x,
              y: pos[ch].y,
              status: nodeHl.includes(ch) ? "hl" : out.has(ch) ? "match" : ret === '""' ? "warn" : ""
            })),
            edges: edges.map(([u, v]) => ({ from: u, to: v, dir: true, status: edgeHl && edgeHl[0] === u && edgeHl[1] === v ? "hl" : out.has(u) ? "match" : "" }))
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "入度為 0 的字母 (queue&lt;char&gt;)",
            x: 665,
            y: 175,
            items: q.map((ch, i) => ({ val: `'${ch}'`, status: i === qHl ? "hl" : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "拓撲排序狀態",
            x: 24,
            y: 215,
            items: [
              { id: "i", name: "i", val: vars.i !== undefined ? String(vars.i) : "-", status: "" },
              { id: "j", name: "j", val: vars.j !== undefined ? String(vars.j) : "-", status: "" },
              { id: "c", name: "c", val: vars.c || "-", status: hlVar === "c" ? "hl" : "" },
              { id: "res", name: "res", val: `"${res}"`, status: hlVar === "res" ? "hl" : "" },
              { id: "ret", name: "return", val: ret, status: ret !== "-" ? "match" : "" }
            ]
          }
        ];
        return { boards, connectors };
      };
      const V = (extra = {}) => ({ "a / b": extra.ab || "-", c: extra.c || "-", res: `"${res}"`, return: ret });

      words.forEach((w) => {
        for (const c of w) {
          if (indeg[c] === undefined) {
            indeg[c] = 0;
            chars.push(c);
          }
        }
      });
      chars = chars.slice().sort();
      steps.push(e06Step(7, "登記所有字母", "tag-insert", `indeg 共 ${chars.length} 個字母`,
        `掃過每個單字的每個字母，把出現過的字母都放進 indeg（初始入度 0），共有 ${chars.length} 種：${chars.join("、")}。`,
        V(), snap({ nodeHl: chars.slice() })));

      for (let i = 0; i + 1 < words.length; i++) {
        const a = words[i];
        const b = words[i + 1];
        const len = Math.min(a.length, b.length);
        const ab = `"${a}" / "${b}"`;
        const ptrs = [{ idx: i, label: "a", color: "blue" }, { idx: i + 1, label: "b", color: "purple" }];
        steps.push(e06Step(11, `比較第 ${i}、${i + 1} 個單字`, "tag-check", `a = "${a}", b = "${b}", len = ${len}`,
          `取相鄰單字 a = "${a}" 與 b = "${b}"，在前 ${len} 個字母中尋找第一個不同的位置。`,
          V({ ab }), snap({ wordsHl: [i, i + 1], wordPtrs: ptrs, vars: { i } })));
        if (a.length > b.length && a.slice(0, len) === b) {
          ret = '""';
          steps.push(e06Step(12, "前綴矛盾", "tag-found", `"${b}" 是 "${a}" 的前綴 ➜ return ""`,
            `b = "${b}" 是 a = "${a}" 的前綴，但較長的 a 卻排在前面，任何字母順序都不可能成立，回傳空字串。`,
            V({ ab }), snap({ wordsHl: [i, i + 1], wordPtrs: ptrs, vars: { i },
              connectors: [{ from: `wb-cw-words-${i}`, to: "wb-var-ret", label: "矛盾", color: "red" }] })));
          return steps;
        }
        let foundDiff = false;
        for (let j = 0; j < len; j++) {
          if (a[j] !== b[j]) {
            foundDiff = true;
            adj[a[j]] = adj[a[j]] || new Set();
            const isNew = !adj[a[j]].has(b[j]);
            if (isNew) {
              adj[a[j]].add(b[j]);
              indeg[b[j]]++;
              edges.push([a[j], b[j]]);
            }
            steps.push(e06Step(15, isNew ? `新增邊 ${a[j]} → ${b[j]}` : `邊 ${a[j]} → ${b[j]} 已存在`, isNew ? "tag-insert" : "default",
              isNew ? `adj['${a[j]}'].insert('${b[j]}'), indeg['${b[j]}'] = ${indeg[b[j]]}` : `insert('${b[j]}').second = false`,
              isNew
                ? `第 ${j} 個字母首次不同：'${a[j]}' ≠ '${b[j]}'，表示 ${a[j]} 排在 ${b[j]} 前面，加入有向邊並讓 ${b[j]} 的入度變為 ${indeg[b[j]]}。之後的字母不再提供資訊，直接 break。`
                : `第 ${j} 個字母首次不同：'${a[j]}' ≠ '${b[j]}'，但這條關係先前已記錄過，不重複增加入度，直接 break。`,
              V({ ab }), snap({ wordsHl: [i, i + 1], wordPtrs: ptrs, nodeHl: [a[j], b[j]], edgeHl: [a[j], b[j]], vars: { i, j },
                connectors: [{ from: `wb-cw-words-${i}`, to: `wb-node-g-${a[j]}`, label: `${a[j]} 在 ${b[j]} 前`, color: "purple" }] })));
            break;
          }
        }
        if (!foundDiff) {
          steps.push(e06Step(13, "無差異字母", "default", `前 ${len} 個字母都相同`,
            `前 ${len} 個字母完全相同，且 a 不比 b 長，這對單字沒有提供任何順序資訊。`,
            V({ ab }), snap({ wordsHl: [i, i + 1], wordPtrs: ptrs, vars: { i } })));
        }
      }

      chars.forEach((c) => {
        if (indeg[c] === 0) q.push(c);
      });
      steps.push(e06Step(21, "入度 0 入佇列", "tag-insert", `q = [${q.join(", ")}]`,
        q.length
          ? `依字母順序檢查 indeg，入度為 0 的 ${q.join("、")} 沒有任何前置字母，可以先排，放入佇列。`
          : "沒有任何字母的入度為 0，代表所有字母都在環上，佇列為空。",
        V(), snap({ nodeHl: q.slice() })));

      while (q.length) {
        const c = q.shift();
        out.add(c);
        res += c;
        steps.push(e06Step(25, `取出 '${c}'`, "tag-check", `res += '${c}' ➜ "${res}"`,
          `從佇列前端取出 '${c}'（它的前置字母都已排好），接到答案後面，res = "${res}"。`,
          V({ c: `'${c}'` }), snap({ nodeHl: [c], hlVar: "res", vars: { c: `'${c}'` },
            connectors: [{ from: `wb-node-g-${c}`, to: "wb-var-res", label: `+= '${c}'`, color: "green" }] })));
        const nbrs = adj[c] ? [...adj[c]].sort() : [];
        for (const nx of nbrs) {
          indeg[nx]--;
          const zero = indeg[nx] === 0;
          if (zero) q.push(nx);
          steps.push(e06Step(27, zero ? `'${nx}' 入度歸零` : `'${nx}' 入度減一`, zero ? "tag-insert" : "default",
            `--indeg['${nx}'] = ${indeg[nx]}${zero ? " ➜ push" : ""}`,
            zero
              ? `移除邊 ${c} → ${nx}，${nx} 的入度降到 0，所有前置字母都已排好，放入佇列。`
              : `移除邊 ${c} → ${nx}，${nx} 的入度降為 ${indeg[nx]}，仍有前置字母未排。`,
            V({ c: `'${c}'` }), snap({ nodeHl: [c, nx], edgeHl: [c, nx], vars: { c: `'${c}'` }, qHl: zero ? q.length - 1 : -1,
              connectors: zero ? [{ from: `wb-node-g-${nx}`, to: `wb-queue-q-${q.length - 1}`, label: "push", color: "purple" }] : [] })));
        }
      }
      const ok = res.length === chars.length;
      ret = ok ? `"${res}"` : '""';
      steps.push(e06Step(29, ok ? "回傳字母順序" : "偵測到環", "tag-found",
        `${res.length} ${ok ? "==" : "!="} ${chars.length} ➜ return ${ret}`,
        ok
          ? `所有 ${chars.length} 個字母都已排出，回傳外星字母順序 "${res}"。`
          : `只排出 ${res.length} 個字母，少於 ${chars.length} 個，剩下的字母互相依賴形成環，順序矛盾，回傳空字串。`,
        V(), snap({ connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: ok ? "合法順序" : "有環", color: ok ? "green" : "red" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #140 Bus Routes (LC #815, Hard)
  // ==========================================================================
  window.PROBLEMS["bus-routes"] = {
    id: 140,
    leetcodeId: 815,
    slug: "bus-routes",
    title: "815. Bus Routes (公車路線)",
    difficulty: "Hard",
    topic: "Graph / BFS",
    mins: 45,
    complexity: "Time O(Σ|routes[i]|) · Space O(Σ|routes[i]|)",
    argNames: ["routes", "source", "target"],
    description:
      "先建立「站牌 → 經過的公車」索引 stopToBus，再以站牌為單位做分層 BFS：每一層代表多搭一班公車。取出站牌時，把所有還沒搭過的公車整條路線展開，路線上的站牌若是 target 就回傳目前公車數，否則把沒到過的站牌放入下一層。每班公車只展開一次，因此每個站牌出現在路線中的次數只會被掃描一次。起點等於終點回傳 0，無法到達回傳 -1。時間與空間皆為 O(Σ|routes[i]|)。",

    presets: [
      { name: "範例 1：routes = [[1,2,7],[3,6,7]], source = 1, target = 6", args: [[[1, 2, 7], [3, 6, 7]], 1, 6] },
      { name: "範例 2：routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12", args: [[[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12] },
      { name: "邊界：source = target = 3", args: [[[1, 2, 3]], 3, 3] },
      { name: "特殊：一路轉乘 routes = [[1,2],[2,3],[3,4],[4,5]], 1 → 5", args: [[[1, 2], [2, 3], [3, 4], [4, 5]], 1, 5] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {",
      "        if (source == target) return 0;",
      "        unordered_map<int, vector<int>> stopToBus;",
      "        for (int i = 0; i < (int)routes.size(); i++)",
      "            for (int s : routes[i]) stopToBus[s].push_back(i);",
      "        queue<int> q;",
      "        vector<bool> usedBus(routes.size(), false);",
      "        unordered_set<int> seenStop{source};",
      "        q.push(source);",
      "        int buses = 0;",
      "        while (!q.empty()) {",
      "            buses++;",
      "            for (int sz = q.size(); sz > 0; sz--) {",
      "                int stop = q.front(); q.pop();",
      "                for (int bus : stopToBus[stop]) {",
      "                    if (usedBus[bus]) continue;",
      "                    usedBus[bus] = true;",
      "                    for (int nxt : routes[bus]) {",
      "                        if (nxt == target) return buses;",
      "                        if (seenStop.insert(nxt).second) q.push(nxt);",
      "                    }",
      "                }",
      "            }",
      "        }",
      "        return -1;",
      "    }",
      "};"
    ]),

    generateTrace(routesInput, sourceInput, targetInput) {
      const routes = e06Clone(routesInput);
      const source = Number(sourceInput);
      const target = Number(targetInput);
      const steps = [];
      const stopToBus = new Map();
      const usedBus = routes.map(() => false);
      const seen = [];
      const q = [];
      let buses = 0;
      let ret = "-";
      let built = false;
      const maxLen = routes.reduce((mx, r) => Math.max(mx, r.length), 0);

      const snap = (opts = {}) => {
        const { routeHl = [], routeMatch = [], dictHl = null, busHl = -1, qHl = -1, seenHl = -1, connectors = [], vars = {} } = opts;
        const cells = routes.map((r) => Array.from({ length: maxLen }, (_, k) => (k < r.length ? String(r[k]) : "·")));
        const doneCells = [];
        routes.forEach((r, i) => {
          if (usedBus[i]) r.forEach((_, k) => doneCells.push(`${i},${k}`));
        });
        const gridW = 70 + maxLen * 42;
        const boards = [
          {
            id: "routes",
            type: "grid",
            name: "routes",
            typeLabel: "公車路線（列 = 公車編號）",
            x: 325,
            y: 52,
            cells,
            rowLabels: routes.map((_, i) => `bus ${i}`),
            hl: routeHl,
            match: routeMatch,
            done: doneCells
          },
          {
            id: "stb",
            type: "dict",
            name: "stopToBus",
            typeLabel: "站牌 → 公車 (unordered_map)",
            x: 325 + gridW + 40,
            y: 52,
            headers: ["stop", "buses", "狀態"],
            rows: [...stopToBus.entries()].map(([s, list]) => ({
              id: `s${s}`,
              key: String(s),
              val: `[${list.join(", ")}]`,
              note: s === source ? "起點" : s === target ? "終點" : "",
              status: dictHl === s ? "hit" : ""
            })),
            slot: built ? null : { key: "＋ stop", val: "bus", note: "建立中" }
          },
          {
            id: "used",
            type: "array",
            name: "usedBus",
            typeLabel: "公車是否搭過 (vector&lt;bool&gt;)",
            x: 325,
            y: 52 + 70 + routes.length * 36 + 20,
            values: usedBus.map((u) => (u ? "T" : "F")),
            hl: busHl >= 0 ? [busHl] : [],
            done: usedBus.map((u, i) => (u && i !== busHl ? i : -1)).filter((i) => i >= 0)
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "BFS 站牌佇列 (queue&lt;int&gt;)",
            x: 325,
            y: 52 + 70 + routes.length * 36 + 130,
            items: q.map((s, i) => ({ val: s, status: i === qHl ? "hl" : "" }))
          },
          {
            id: "seen",
            type: "set",
            name: "seenStop",
            typeLabel: "到過的站牌 (unordered_set)",
            x: 325,
            y: 52 + 70 + routes.length * 36 + 240,
            items: seen.map((s, i) => ({ val: s, status: i === seenHl ? "inserted" : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "BFS 狀態",
            x: 24,
            y: 215,
            items: [
              { id: "st", name: "source → target", val: `${source} → ${target}`, status: "" },
              { id: "buses", name: "buses", val: String(buses), status: vars.hlBuses ? "hl" : "" },
              { id: "stop", name: "stop", val: vars.stop !== undefined ? String(vars.stop) : "-", status: "" },
              { id: "bus", name: "bus", val: vars.bus !== undefined ? String(vars.bus) : "-", status: "" },
              { id: "nxt", name: "nxt", val: vars.nxt !== undefined ? String(vars.nxt) : "-", status: vars.hit ? "match" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ];
        return { boards, connectors };
      };
      const V = (v = {}) => ({
        buses,
        stop: v.stop !== undefined ? v.stop : "-",
        bus: v.bus !== undefined ? v.bus : "-",
        nxt: v.nxt !== undefined ? v.nxt : "-",
        return: ret
      });

      if (source === target) {
        ret = 0;
        steps.push(e06Step(4, "起點即終點", "tag-found", `${source} == ${target} ➜ return 0`,
          `起點站 ${source} 就是終點站，不需要搭任何公車，直接回傳 0。`, V(),
          snap({ connectors: [{ from: "wb-var-st", to: "wb-var-ret", label: "不用搭車", color: "green" }] })));
        return steps;
      }
      steps.push(e06Step(4, "起點不是終點", "tag-check", `${source} != ${target}`,
        `起點 ${source} 與終點 ${target} 不同，需要搭車；先建立站牌到公車的索引。`, V(), snap()));

      routes.forEach((r, i) => {
        r.forEach((s) => {
          if (!stopToBus.has(s)) stopToBus.set(s, []);
          stopToBus.get(s).push(i);
        });
        steps.push(e06Step(7, `登記 bus ${i}`, "tag-insert", `bus ${i} 經過 [${r.join(", ")}]`,
          `公車 ${i} 會停靠 ${r.join("、")}，把 ${i} 加到這些站牌的公車清單中。`, V({ bus: i }),
          snap({ routeHl: r.map((_, k) => `${i},${k}`), vars: { bus: i },
            connectors: [{ from: `wb-grid-routes-${i}-0`, to: `wb-dict-row-s${r[0]}`, label: `登記 bus ${i}`, color: "purple" }] })));
      });
      built = true;

      seen.push(source);
      q.push(source);
      steps.push(e06Step(11, "起點入佇列", "tag-insert", `q.push(${source})`,
        `建立 usedBus（每班公車只展開一次）與 seenStop = {${source}}，把起點 ${source} 放入佇列，buses = 0。`, V(),
        snap({ qHl: 0, seenHl: 0 })));

      while (q.length) {
        buses++;
        const sz0 = q.length;
        steps.push(e06Step(14, `第 ${buses} 班車`, "default", `buses = ${buses}`,
          `開始新一層：佇列中的 ${sz0} 個站牌都是搭 ${buses - 1} 班車可到的，從它們再搭一班車，總數變成 ${buses}。`, V(),
          snap({ vars: { hlBuses: true } })));
        for (let sz = sz0; sz > 0; sz--) {
          const stop = q.shift();
          const list = stopToBus.get(stop) || [];
          steps.push(e06Step(16, `取出站牌 ${stop}`, "tag-check", `stop = ${stop}, 公車 [${list.join(", ")}]`,
            `從佇列取出站牌 ${stop}，查表得知經過它的公車有 [${list.join(", ")}]。`, V({ stop }),
            snap({ dictHl: stop, vars: { stop },
              connectors: stopToBus.has(stop) ? [{ from: "wb-var-stop", to: `wb-dict-row-s${stop}`, label: "查表", color: "blue" }] : [] })));
          for (const bus of list) {
            if (usedBus[bus]) {
              steps.push(e06Step(18, `bus ${bus} 已搭過`, "default", `usedBus[${bus}] ➜ continue`,
                `公車 ${bus} 先前已經展開過整條路線，跳過。`, V({ stop, bus }),
                snap({ dictHl: stop, busHl: bus, vars: { stop, bus } })));
              continue;
            }
            usedBus[bus] = true;
            steps.push(e06Step(19, `搭上 bus ${bus}`, "tag-insert", `usedBus[${bus}] = true`,
              `搭上還沒坐過的公車 ${bus}，標記為已使用，接著掃描它的整條路線 [${routes[bus].join(", ")}]。`, V({ stop, bus }),
              snap({ dictHl: stop, busHl: bus, routeHl: routes[bus].map((_, k) => `${bus},${k}`), vars: { stop, bus },
                connectors: [{ from: `wb-dict-row-s${stop}`, to: `wb-cw-used-${bus}`, label: `bus ${bus}`, color: "purple" }] })));
            for (let k = 0; k < routes[bus].length; k++) {
              const nxt = routes[bus][k];
              if (nxt === target) {
                ret = buses;
                steps.push(e06Step(21, "抵達終點", "tag-found", `${nxt} == target ➜ return ${buses}`,
                  `公車 ${bus} 會停靠終點 ${target}！總共搭了 ${buses} 班公車，回傳 ${buses}。`, V({ stop, bus, nxt }),
                  snap({ busHl: bus, routeMatch: [`${bus},${k}`], vars: { stop, bus, nxt, hit: true },
                    connectors: [{ from: `wb-grid-routes-${bus}-${k}`, to: "wb-var-ret", label: "抵達終點", color: "green" }] })));
                return steps;
              }
              const isNew = !seen.includes(nxt);
              if (isNew) {
                seen.push(nxt);
                q.push(nxt);
              }
              steps.push(e06Step(22, isNew ? `站牌 ${nxt} 入佇列` : `站牌 ${nxt} 已到過`, isNew ? "tag-insert" : "default",
                isNew ? `seenStop.insert(${nxt}) ➜ q.push(${nxt})` : `seenStop 已有 ${nxt}`,
                isNew
                  ? `站牌 ${nxt} 不是終點且第一次到達，加入 seenStop 並放入佇列，下一層可從這裡轉乘。`
                  : `站牌 ${nxt} 先前已到過，不重複放入佇列。`,
                V({ stop, bus, nxt }),
                snap({ busHl: bus, routeHl: [`${bus},${k}`], vars: { stop, bus, nxt },
                  qHl: isNew ? q.length - 1 : -1, seenHl: isNew ? seen.length - 1 : seen.indexOf(nxt),
                  connectors: [{ from: `wb-grid-routes-${bus}-${k}`, to: isNew ? `wb-queue-q-${q.length - 1}` : `wb-chip-seen-${seen.indexOf(nxt)}`, label: isNew ? "push" : "已到過", color: isNew ? "purple" : "blue" }] })));
            }
          }
        }
      }
      ret = -1;
      steps.push(e06Step(27, "無法抵達", "tag-found", "return -1",
        `佇列已空，所有能轉乘到的公車都試過了，仍到不了 ${target}，回傳 -1。`, V(), snap()));
      return steps;
    }
  };

  // ==========================================================================
  // #141 Symmetric Tree (LC #101, Easy)
  // ==========================================================================
  window.PROBLEMS["symmetric-tree"] = {
    id: 141,
    leetcodeId: 101,
    slug: "symmetric-tree",
    title: "101. Symmetric Tree (對稱二元樹)",
    difficulty: "Easy",
    topic: "Binary Tree / DFS",
    mins: 20,
    complexity: "Time O(n) · Space O(h)",
    argNames: ["root"],
    description:
      "一棵樹對稱，等同於根的左子樹與右子樹互為鏡像。以遞迴函式 isMirror(a, b) 同時走兩棵子樹：兩者皆空為鏡像；只有一邊為空或數值不同則不是；否則必須外側配對 (a->left, b->right) 與內側配對 (a->right, b->left) 都互為鏡像。每個節點最多比較一次，時間 O(n)，遞迴堆疊空間 O(h)。",

    presets: [
      { name: "範例 1：root = [1,2,2,3,4,4,3]", args: [[1, 2, 2, 3, 4, 4, 3]] },
      { name: "範例 2：root = [1,2,2,null,3,null,3]", args: [[1, 2, 2, null, 3, null, 3]] },
      { name: "邊界：root = [1]（單一節點）", args: [[1]] },
      { name: "特殊：數值相同但結構不對稱 [1,2,2,2,null,2]", args: [[1, 2, 2, 2, null, 2]] },
      { name: "特殊：四層對稱樹 [2,3,3,4,5,5,4,null,null,8,9,9,8]", args: [[2, 3, 3, 4, 5, 5, 4, null, null, 8, 9, 9, 8]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    bool isSymmetric(TreeNode* root) {",
      "        return isMirror(root->left, root->right);",
      "    }",
      "    bool isMirror(TreeNode* a, TreeNode* b) {",
      "        if (!a && !b) return true;",
      "        if (!a || !b) return false;",
      "        if (a->val != b->val) return false;",
      "        return isMirror(a->left, b->right) && isMirror(a->right, b->left);",
      "    }",
      "};"
    ]),

    generateTrace(rootInput) {
      const arr = e06Clone(rootInput);
      const tree = buildTreeFromLevelOrder(arr, 620);
      const steps = [];
      const calls = [];
      const matched = new Set();
      const bad = new Set();
      let ret = "-";

      const nm = (n) => (n ? String(n.val) : "null");
      const snap = (a, b, opts = {}) => {
        const { connectors = [] } = opts;
        const nodes = tree.nodes.map((n) => {
          let status = "";
          if ((a && a.id === n.id) || (b && b.id === n.id)) status = bad.has(n.id) ? "warn" : "hl";
          else if (bad.has(n.id)) status = "warn";
          else if (matched.has(n.id)) status = "match";
          return {
            id: n.id,
            val: String(n.val),
            x: n.x,
            y: n.y,
            status,
            ptr: a && a.id === n.id ? "a" : b && b.id === n.id ? "b" : ""
          };
        });
        const edges = tree.edges.map((e) => ({ ...e, status: (a && e.to === a.id) || (b && e.to === b.id) ? "hl" : "" }));
        return {
          boards: [
            {
              id: "tree",
              type: "tree",
              shape: "circle",
              name: "root",
              typeLabel: "二元樹 (TreeNode*)",
              x: 325,
              y: 52,
              width: tree.width,
              height: tree.height,
              nodes,
              edges
            },
            {
              id: "calls",
              type: "stack",
              name: "呼叫堆疊",
              typeLabel: "isMirror(a, b) 遞迴框",
              x: 325 + tree.width + 30,
              y: 52,
              items: calls.map((f, i) => ({ val: `isMirror(${f})`, status: i === calls.length - 1 ? "hl" : "" }))
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "目前比較的兩個節點",
              x: 24,
              y: 215,
              items: [
                { id: "a", name: "a", val: nm(a), status: a ? "hl" : "" },
                { id: "b", name: "b", val: nm(b), status: b ? "hl" : "" },
                { id: "depth", name: "遞迴深度", val: String(calls.length), status: "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = (a, b, r = "-") => ({ a: nm(a), b: nm(b), depth: calls.length, return: r });
      const pairLink = (a, b, label, color) => (a && b ? [{ from: `wb-node-tree-${a.id}`, to: `wb-node-tree-${b.id}`, label, color }] : []);

      const root = tree.root;
      steps.push(e06Step(4, "比較左右子樹", "default", `isMirror(${nm(root.left)}, ${nm(root.right)})`,
        `樹是否對稱，取決於根 ${root.val} 的左子樹與右子樹是否互為鏡像，呼叫 isMirror(root->left, root->right)。`,
        V(root.left, root.right), snap(root.left, root.right)));

      const mirror = (a, b, side) => {
        calls.push(`${nm(a)}, ${nm(b)}`);
        if (!a && !b) {
          steps.push(e06Step(7, "兩邊皆空", "tag-check", "!a && !b ➜ true",
            `${side}兩個位置都是空節點，空對空互為鏡像，回傳 true。`, V(a, b, "true"), snap(a, b)));
          calls.pop();
          return true;
        }
        if (!a || !b) {
          const one = a || b;
          bad.add(one.id);
          steps.push(e06Step(8, "只有一邊為空", "tag-found", "!a || !b ➜ false",
            `${side}一邊是節點 ${one.val}、另一邊卻是空的，結構不對稱，回傳 false。`, V(a, b, "false"), snap(a, b)));
          calls.pop();
          return false;
        }
        if (a.val !== b.val) {
          bad.add(a.id);
          bad.add(b.id);
          steps.push(e06Step(9, "數值不同", "tag-found", `${a.val} != ${b.val} ➜ false`,
            `${side}a = ${a.val} 與 b = ${b.val} 數值不同，不是鏡像，回傳 false。`, V(a, b, "false"),
            snap(a, b, { connectors: pairLink(a, b, "≠", "red") })));
          calls.pop();
          return false;
        }
        matched.add(a.id);
        matched.add(b.id);
        steps.push(e06Step(9, "數值相同", "tag-check", `${a.val} == ${b.val}`,
          `${side}a 與 b 都是 ${a.val}，接著檢查外側配對 (a->left, b->right) 與內側配對 (a->right, b->left)。`, V(a, b),
          snap(a, b, { connectors: pairLink(a, b, "鏡像配對", "blue") })));
        const outer = mirror(a.left, b.right, `外側 (${a.val}.left, ${b.val}.right)：`);
        let inner = false;
        if (outer) inner = mirror(a.right, b.left, `內側 (${a.val}.right, ${b.val}.left)：`);
        const r = outer && inner;
        steps.push(e06Step(10, r ? "子樹互為鏡像" : "子樹不對稱", r ? "tag-check" : "tag-found",
          outer ? `${outer} && ${inner} ➜ ${r}` : "false && ... ➜ false（短路）",
          outer
            ? `回到 isMirror(${a.val}, ${b.val})：外側與內側配對${r ? "都是鏡像，回傳 true" : "中內側失敗，回傳 false"}。`
            : `回到 isMirror(${a.val}, ${b.val})：外側配對已失敗，&& 短路不再檢查內側，直接回傳 false。`,
          V(a, b, String(r)), snap(a, b, { connectors: pairLink(a, b, r ? "✓" : "✗", r ? "green" : "red") })));
        calls.pop();
        return r;
      };
      const result = mirror(root.left, root.right, "");
      ret = String(result);
      if (result) tree.nodes.forEach((n) => matched.add(n.id));
      steps.push(e06Step(4, result ? "對稱" : "不對稱", "tag-found", `return ${result}`,
        result ? "左右子樹完全互為鏡像，這棵樹是對稱的，回傳 true。" : "左右子樹不是鏡像，這棵樹不對稱，回傳 false。",
        V(null, null, ret), snap(null, null, { connectors: [{ from: `wb-node-tree-${root.id}`, to: "wb-var-ret", label: ret, color: result ? "green" : "red" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #142 Missing Number (LC #268, Easy)
  // ==========================================================================
  window.PROBLEMS["missing-number"] = {
    id: 142,
    leetcodeId: 268,
    slug: "missing-number",
    title: "268. Missing Number (遺失的數字)",
    difficulty: "Easy",
    topic: "Bit Manipulation (XOR)",
    mins: 15,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "nums 含有 0 到 n 之中的 n 個相異數字，恰好缺一個。利用 XOR 的性質 x ^ x = 0、x ^ 0 = x：把 res 初始化為 n，再對每個索引 i 與 nums[i] 都做 XOR。0 到 n 的每個數字若同時出現在索引（或初始的 n）與陣列中就會兩兩抵銷，最後只剩下缺少的那個數。時間 O(n)，空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [3,0,1]", args: [[3, 0, 1]] },
      { name: "範例 2：nums = [0,1]", args: [[0, 1]] },
      { name: "範例 3：nums = [9,6,4,2,3,5,7,0,1]", args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]] },
      { name: "邊界：nums = [1]（缺 0）", args: [[1]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    int missingNumber(vector<int>& nums) {",
      "        int n = nums.size(), res = n;",
      "        for (int i = 0; i < n; i++)",
      "            res ^= i ^ nums[i];",
      "        return res;",
      "    }",
      "};"
    ]),

    generateTrace(numsInput) {
      const nums = e06Clone(numsInput);
      const n = nums.length;
      const steps = [];
      const bitsW = Math.max(1, n.toString(2).length);
      const bin = (v) => v.toString(2).padStart(bitsW, "0");
      let res = n;
      let ret = "-";

      const snap = (i, opts = {}) => {
        const { connectors = [], hlRes = false } = opts;
        const bits = bin(res).split("");
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "輸入 (vector&lt;int&gt;)",
              x: 325,
              y: 52,
              values: nums.map(String),
              hl: i >= 0 && i < n ? [i] : [],
              done: Array.from({ length: Math.max(0, Math.min(i, n)) }, (_, k) => k),
              pointers: i >= 0 && i < n ? [{ idx: i, label: `i = ${i}`, color: "blue" }] : []
            },
            {
              id: "bits",
              type: "array",
              name: "res (二進位)",
              typeLabel: `res = ${res} 的位元`,
              x: 325,
              y: 185,
              values: bits,
              indexLabels: bits.map((_, k) => `2^${bitsW - 1 - k}`),
              hl: hlRes ? bits.map((_, k) => k) : [],
              match: ret !== "-" ? bits.map((_, k) => k) : []
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "XOR 累積",
              x: 24,
              y: 215,
              items: [
                { id: "n", name: "n", val: String(n), status: "" },
                { id: "i", name: "i", val: i >= 0 && i < n ? String(i) : "-", status: "" },
                { id: "res", name: "res", val: `${res} (${bin(res)})`, status: hlRes ? "hl" : "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = (i) => ({ n, i: i >= 0 && i < n ? i : "-", res, return: ret });

      steps.push(e06Step(4, "初始化 res = n", "default", `n = ${n}, res = ${n}`,
        `陣列長度 n = ${n}，應包含 0～${n} 中的 ${n} 個數。res 先設為 n，補上索引 0～${n - 1} 中缺少的「${n}」。`,
        V(-1), snap(-1, { hlRes: true })));
      for (let i = 0; i < n; i++) {
        steps.push(e06Step(5, "檢查迴圈條件", "tag-check", `i = ${i} ＜ ${n}`,
          `i = ${i} 仍小於 n，處理 nums[${i}] = ${nums[i]}。`, V(i), snap(i)));
        const old = res;
        res = res ^ i ^ nums[i];
        steps.push(e06Step(6, `XOR i 與 nums[${i}]`, "tag-insert", `res = ${old} ^ ${i} ^ ${nums[i]} = ${res}`,
          `res ^= ${i} ^ ${nums[i]}：二進位 ${bin(old)} ^ ${bin(i)} ^ ${bin(nums[i])} = ${bin(res)}。相同的數字會在某一步互相抵銷。`,
          V(i), snap(i, { hlRes: true, connectors: [{ from: `wb-cw-nums-${i}`, to: "wb-var-res", label: `^ ${i} ^ ${nums[i]}`, color: "purple" }] })));
      }
      steps.push(e06Step(5, "迴圈結束", "tag-check", `i = ${n} == n`,
        `所有索引與數值都已 XOR 進 res，成對出現的數字已全部抵銷。`, V(n), snap(n)));
      ret = res;
      steps.push(e06Step(7, "回傳缺少的數字", "tag-found", `return ${res}`,
        `剩下沒有被抵銷的就是缺少的數字 ${res}。`, V(n),
        snap(n, { connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: `缺少 ${res}`, color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #143 Decode Ways (LC #91, Medium)
  // ==========================================================================
  window.PROBLEMS["decode-ways"] = {
    id: 143,
    leetcodeId: 91,
    slug: "decode-ways",
    title: "91. Decode Ways (解碼方法)",
    difficulty: "Medium",
    topic: "Dynamic Programming (1D)",
    mins: 25,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["s"],
    description:
      "令 dp[i] 為前 i 個字元的解碼方法數，dp[0] = 1 代表空字串有一種解法。處理第 i 個字元時：若 s[i-1] 不是 '0'，它可以單獨解碼成一個字母，dp[i] += dp[i-1]；若最後兩個字元組成 10～26 的數字，也可以合併解碼，dp[i] += dp[i-2]。'0' 不能單獨解碼，像 \"06\" 這種前導零的兩位數也不合法。答案為 dp[n]，時間 O(n)，空間 O(n)。",

    presets: [
      { name: "範例 1：s = \"12\"", args: ["12"] },
      { name: "範例 2：s = \"226\"", args: ["226"] },
      { name: "範例 3：s = \"06\"（前導零）", args: ["06"] },
      { name: "特殊：s = \"11106\"", args: ["11106"] },
      { name: "特殊：s = \"2101\"（0 只能與前一位合併）", args: ["2101"] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    int numDecodings(string s) {",
      "        int n = s.size();",
      "        vector<int> dp(n + 1, 0);",
      "        dp[0] = 1;",
      "        for (int i = 1; i <= n; i++) {",
      "            if (s[i - 1] != '0') dp[i] += dp[i - 1];",
      "            if (i >= 2) {",
      "                int two = (s[i - 2] - '0') * 10 + (s[i - 1] - '0');",
      "                if (two >= 10 && two <= 26) dp[i] += dp[i - 2];",
      "            }",
      "        }",
      "        return dp[n];",
      "    }",
      "};"
    ]),

    generateTrace(sInput) {
      const s = String(sInput);
      const n = s.length;
      const steps = [];
      const dp = Array(n + 1).fill(0);
      let filled = -1;
      let two = "-";
      let ret = "-";

      const snap = (i, opts = {}) => {
        const { sHl = [], dpHl = [], dpMatch = [], connectors = [], hlVar = "" } = opts;
        return {
          boards: [
            {
              id: "s",
              type: "array",
              name: "s",
              typeLabel: "數字字串 (string)",
              x: 325,
              y: 52,
              values: s.split("").map((ch) => `'${ch}'`),
              hl: sHl,
              done: i > 0 ? Array.from({ length: Math.min(i, n) }, (_, k) => k).filter((k) => !sHl.includes(k)) : []
            },
            {
              id: "dp",
              type: "array",
              name: "dp",
              typeLabel: "解碼方法數 dp[0..n] (vector&lt;int&gt;)",
              x: 325,
              y: 180,
              values: dp.map((v, k) => (k <= filled ? String(v) : "0")),
              hl: dpHl,
              match: dpMatch,
              done: dp.map((_, k) => k).filter((k) => k <= filled && !dpHl.includes(k) && !dpMatch.includes(k)),
              pointers: i >= 1 && i <= n ? [{ idx: i, label: `i = ${i}`, color: "blue" }] : []
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "DP 狀態",
              x: 24,
              y: 215,
              items: [
                { id: "n", name: "n", val: String(n), status: "" },
                { id: "i", name: "i", val: i >= 1 && i <= n ? String(i) : "-", status: "" },
                { id: "two", name: "two", val: String(two), status: hlVar === "two" ? "hl" : "" },
                { id: "dpi", name: "dp[i]", val: i >= 1 && i <= n ? String(dp[i]) : "-", status: hlVar === "dpi" ? "hl" : "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = (i) => ({ i: i >= 1 && i <= n ? i : "-", two, "dp[i]": i >= 1 && i <= n ? dp[i] : "-", return: ret });

      steps.push(e06Step(5, "建立 dp 陣列", "default", `dp(${n + 1}, 0)`,
        `字串長度 n = ${n}，建立長度 ${n + 1} 的 dp，dp[i] 表示前 i 個字元有幾種解碼方法。`, V(0), snap(0)));
      dp[0] = 1;
      filled = 0;
      steps.push(e06Step(6, "空字串基底", "tag-insert", "dp[0] = 1",
        "空字串只有「什麼都不解」這一種方法，dp[0] = 1，作為後續累加的基底。", V(0), snap(0, { dpHl: [0] })));

      for (let i = 1; i <= n; i++) {
        two = "-";
        filled = i;
        const c = s[i - 1];
        if (c !== "0") {
          dp[i] += dp[i - 1];
          steps.push(e06Step(8, `單字元 '${c}'`, "tag-insert", `s[${i - 1}] = '${c}' ➜ dp[${i}] += dp[${i - 1}] = ${dp[i]}`,
            `s[${i - 1}] = '${c}' 不是 '0'，可以單獨解碼成一個字母，沿用前 ${i - 1} 個字元的 ${dp[i - 1]} 種解法，dp[${i}] = ${dp[i]}。`,
            V(i), snap(i, { sHl: [i - 1], dpHl: [i], hlVar: "dpi",
              connectors: [{ from: `wb-cw-dp-${i - 1}`, to: `wb-cw-dp-${i}`, label: `+ ${dp[i - 1]}`, color: "purple" }] })));
        } else {
          steps.push(e06Step(8, "'0' 不能單獨解碼", "tag-check", `s[${i - 1}] == '0' ➜ 跳過`,
            `s[${i - 1}] 是 '0'，沒有對應字母，不能單獨解碼，dp[${i}] 不從 dp[${i - 1}] 累加。`,
            V(i), snap(i, { sHl: [i - 1], dpHl: [i] })));
        }
        if (i >= 2) {
          two = Number(s[i - 2]) * 10 + Number(s[i - 1]);
          steps.push(e06Step(10, "組合兩位數", "tag-check", `two = ${s[i - 2]}${s[i - 1]} = ${two}`,
            `把 s[${i - 2}] 與 s[${i - 1}] 組成兩位數 two = ${two}，檢查能否合併解碼。`,
            V(i), snap(i, { sHl: [i - 2, i - 1], dpHl: [i], hlVar: "two",
              connectors: [{ from: `wb-cw-s-${i - 2}`, to: "wb-var-two", label: `"${s[i - 2]}${s[i - 1]}"`, color: "blue" }] })));
          if (two >= 10 && two <= 26) {
            dp[i] += dp[i - 2];
            steps.push(e06Step(11, `合併解碼 ${two}`, "tag-insert", `10 ≤ ${two} ≤ 26 ➜ dp[${i}] += dp[${i - 2}] = ${dp[i]}`,
              `${two} 介於 10～26，可以合併成一個字母，再加上前 ${i - 2} 個字元的 ${dp[i - 2]} 種解法，dp[${i}] = ${dp[i]}。`,
              V(i), snap(i, { sHl: [i - 2, i - 1], dpHl: [i], hlVar: "dpi",
                connectors: [{ from: `wb-cw-dp-${i - 2}`, to: `wb-cw-dp-${i}`, label: `+ ${dp[i - 2]}`, color: "purple" }] })));
          } else {
            steps.push(e06Step(11, "兩位數不合法", "tag-check", `${two} 不在 10～26`,
              two < 10
                ? `兩位數 "${s[i - 2]}${s[i - 1]}" 有前導零，不能合併解碼，dp[${i}] 維持 ${dp[i]}。`
                : `${two} 大於 26，沒有對應字母，不能合併解碼，dp[${i}] 維持 ${dp[i]}。`,
              V(i), snap(i, { sHl: [i - 2, i - 1], dpHl: [i] })));
          }
        }
      }
      ret = dp[n];
      two = "-";
      steps.push(e06Step(14, "回傳 dp[n]", "tag-found", `return dp[${n}] = ${dp[n]}`,
        dp[n] ? `整個字串共有 ${dp[n]} 種解碼方法。` : "沒有任何合法的解碼方式，回傳 0。",
        V(n + 1), snap(n + 1, { dpMatch: [n], connectors: [{ from: `wb-cw-dp-${n}`, to: "wb-var-ret", label: `${dp[n]} 種`, color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #144 Meeting Rooms II (LC #253, Medium, Premium)
  // ==========================================================================
  window.PROBLEMS["meeting-rooms-ii"] = {
    id: 144,
    leetcodeId: 253,
    slug: "meeting-rooms-ii",
    title: "253. Meeting Rooms II (會議室 II)",
    difficulty: "Medium",
    topic: "Array / Sorting / Min-Heap",
    mins: 30,
    complexity: "Time O(n log n) · Space O(n)",
    argNames: ["intervals"],
    description:
      "把會議依開始時間排序，用最小堆積 (priority_queue + greater) 記錄每間使用中會議室的結束時間，堆頂就是最早空出來的房間。依序處理每場會議：若堆頂結束時間 ≤ 本場開始時間，代表該房間已空出，可以先彈出再重複使用；接著把本場的結束時間推入堆積。處理完後堆積大小就是同時需要的會議室數。時間 O(n log n)，空間 O(n)。",

    presets: [
      { name: "範例 1：intervals = [[0,30],[5,10],[15,20]]", args: [[[0, 30], [5, 10], [15, 20]]] },
      { name: "範例 2：intervals = [[7,10],[2,4]]", args: [[[7, 10], [2, 4]]] },
      { name: "邊界：intervals = [[1,5]]（單一會議）", args: [[[1, 5]]] },
      { name: "特殊：首尾相接可共用 [[1,5],[5,9],[8,9]]", args: [[[1, 5], [5, 9], [8, 9]]] },
      { name: "特殊：高峰時段 [[1,10],[2,7],[3,19],[8,12],[10,20],[11,30]]", args: [[[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    int minMeetingRooms(vector<vector<int>>& intervals) {",
      "        sort(intervals.begin(), intervals.end());",
      "        priority_queue<int, vector<int>, greater<int>> pq;",
      "        for (auto& in : intervals) {",
      "            if (!pq.empty() && pq.top() <= in[0]) pq.pop();",
      "            pq.push(in[1]);",
      "        }",
      "        return pq.size();",
      "    }",
      "};"
    ]),

    generateTrace(intervalsInput) {
      const iv = e06Clone(intervalsInput);
      const steps = [];
      let pq = [];
      let ret = "-";

      const snap = (k, opts = {}) => {
        const { pqHl = -1, pqWarn = -1, connectors = [], cells = iv, matchAll = false } = opts;
        const hl = k >= 0 && k < cells.length ? [`${k},0`, `${k},1`] : [];
        const done = [];
        for (let r = 0; r < Math.min(k, cells.length); r++) done.push(`${r},0`, `${r},1`);
        return {
          boards: [
            {
              id: "iv",
              type: "grid",
              name: "intervals",
              typeLabel: "會議時段 [start, end]",
              x: 325,
              y: 52,
              cells: cells.map((p) => [String(p[0]), String(p[1])]),
              colLabels: ["start", "end"],
              hl,
              done: matchAll ? [] : done,
              match: matchAll ? cells.flatMap((_, r) => [`${r},0`, `${r},1`]) : []
            },
            {
              id: "pq",
              type: "queue",
              name: "pq",
              typeLabel: "最小堆積：各房間結束時間 (greater&lt;int&gt;)",
              x: 560,
              y: 52,
              leftLabel: "top（最早結束）←",
              rightLabel: "較晚結束",
              items: pq.map((v, i) => ({ val: v, status: i === pqHl ? "hl" : i === pqWarn ? "warn" : ret !== "-" ? "match" : "" }))
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "排程狀態",
              x: 24,
              y: 215,
              items: [
                { id: "in", name: "in", val: k >= 0 && k < cells.length ? `[${cells[k][0]}, ${cells[k][1]}]` : "-", status: k >= 0 && k < cells.length ? "hl" : "" },
                { id: "top", name: "pq.top()", val: pq.length ? String(pq[0]) : "空", status: "" },
                { id: "size", name: "pq.size()", val: String(pq.length), status: "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = (k) => ({ in: k >= 0 && k < iv.length ? `[${iv[k][0]}, ${iv[k][1]}]` : "-", "pq.top()": pq.length ? pq[0] : "空", "pq.size()": pq.length, return: ret });

      const orig = e06Clone(iv);
      iv.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      steps.push(e06Step(4, "依開始時間排序", "default", `sort ➜ [${iv.map((p) => `[${p[0]},${p[1]}]`).join(",")}]`,
        `把 [${orig.map((p) => `[${p[0]},${p[1]}]`).join(",")}] 依開始時間（相同時再比結束時間）排序，這樣就能按時間順序安排會議。`,
        V(-1), snap(-1)));
      steps.push(e06Step(5, "建立最小堆積", "default", "pq = {}",
        "建立最小堆積 pq，裡面每個數字代表一間會議室的結束時間；堆頂是最早空出來的房間。", V(-1), snap(-1)));

      for (let k = 0; k < iv.length; k++) {
        const [st, en] = iv[k];
        steps.push(e06Step(6, `處理會議 [${st}, ${en}]`, "default", `in = [${st}, ${en}]`,
          `取出第 ${k} 場會議 [${st}, ${en}]，看看能否沿用已經空出的房間。`, V(k), snap(k)));
        if (pq.length && pq[0] <= st) {
          const t = pq[0];
          steps.push(e06Step(7, "房間已空出", "tag-check", `pq.top() = ${t} ≤ ${st} ➜ pop`,
            `最早結束的房間在 ${t} 結束，不晚於本場開始時間 ${st}，可以把它彈出重複使用。`, V(k),
            snap(k, { pqHl: 0, connectors: [{ from: `wb-grid-iv-${k}-0`, to: "wb-queue-pq-0", label: `${t} ≤ ${st}`, color: "green" }] })));
          pq.shift();
        } else {
          steps.push(e06Step(7, pq.length ? "沒有空房" : "堆積為空", "tag-check",
            pq.length ? `pq.top() = ${pq[0]} 大於 ${st}` : "pq.empty()",
            pq.length
              ? `最早結束的房間要到 ${pq[0]} 才空出，晚於本場開始時間 ${st}，必須另開一間房間。`
              : "目前沒有任何會議室在使用，直接開一間新房間。",
            V(k), snap(k, { pqWarn: pq.length ? 0 : -1,
              connectors: pq.length ? [{ from: `wb-grid-iv-${k}-0`, to: "wb-queue-pq-0", label: "仍在使用", color: "red" }] : [] })));
        }
        pq.push(en);
        pq = pq.slice().sort((a, b) => a - b);
        const pos = pq.lastIndexOf(en);
        steps.push(e06Step(8, `推入結束時間 ${en}`, "tag-insert", `pq.push(${en}) ➜ size = ${pq.length}`,
          `本場會議占用一間房間到 ${en}，把結束時間推入堆積；目前有 ${pq.length} 間房間在使用。`, V(k),
          snap(k, { pqHl: pos, connectors: [{ from: `wb-grid-iv-${k}-1`, to: `wb-queue-pq-${pos}`, label: `push(${en})`, color: "purple" }] })));
      }
      ret = pq.length;
      steps.push(e06Step(10, "回傳會議室數", "tag-found", `return pq.size() = ${pq.length}`,
        `所有會議都排完，堆積中仍有 ${pq.length} 間房間，這就是最少需要的會議室數量。`, V(iv.length),
        snap(iv.length, { matchAll: true, connectors: [{ from: "wb-var-size", to: "wb-var-ret", label: `${pq.length} 間`, color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #145 Reverse Integer (LC #7, Medium)
  // ==========================================================================
  window.PROBLEMS["reverse-integer"] = {
    id: 145,
    leetcodeId: 7,
    slug: "reverse-integer",
    title: "7. Reverse Integer (整數反轉)",
    difficulty: "Medium",
    topic: "Math / Overflow Check",
    mins: 25,
    complexity: "Time O(log|x|) · Space O(1)",
    argNames: ["x"],
    description:
      "每次用 x % 10 取出最低位數字 d（C++ 的餘數與 x 同號，負數會取出負的位數），再以 x /= 10 去掉它，並把 d 接到 rev 的尾端：rev = rev * 10 + d。由於不能使用 64 位元整數，必須在乘 10 之前先檢查：rev 大於 INT_MAX / 10，或等於它且 d 大於 7 會正溢位；rev 小於 INT_MIN / 10，或等於它且 d 小於 -8 會負溢位，這兩種情況回傳 0。時間 O(log|x|)，空間 O(1)。",

    presets: [
      { name: "範例 1：x = 123", args: [123] },
      { name: "範例 2：x = -123", args: [-123] },
      { name: "範例 3：x = 120（尾端的 0）", args: [120] },
      { name: "溢位：x = 1534236469", args: [1534236469] },
      { name: "邊界：x = -2147483412（接近 INT_MIN 但不溢位）", args: [-2147483412] },
      { name: "邊界：x = 0", args: [0] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    int reverse(int x) {",
      "        int rev = 0;",
      "        while (x != 0) {",
      "            int d = x % 10;",
      "            x /= 10;",
      "            if (rev > INT_MAX / 10 || (rev == INT_MAX / 10 && d > 7)) return 0;",
      "            if (rev < INT_MIN / 10 || (rev == INT_MIN / 10 && d < -8)) return 0;",
      "            rev = rev * 10 + d;",
      "        }",
      "        return rev;",
      "    }",
      "};"
    ]),

    generateTrace(xInput) {
      const x0 = Number(xInput);
      const INT_MAX = 2147483647;
      const INT_MIN = -2147483648;
      const MAXD = Math.trunc(INT_MAX / 10);
      const MIND = Math.trunc(INT_MIN / 10);
      const digits = String(Math.abs(x0)).split("");
      const L = digits.length;
      const steps = [];
      let x = x0;
      let rev = 0;
      let d = "-";
      let consumed = 0;
      let ret = "-";

      const snap = (opts = {}) => {
        const { hlD = false, hlRev = false, warn = false, connectors = [], hlVar = "" } = opts;
        const revDigits = rev === 0 && consumed === 0 ? [] : String(Math.abs(rev)).split("");
        const curIdx = L - consumed;
        return {
          boards: [
            {
              id: "xd",
              type: "array",
              name: `x0 = ${x0}`,
              typeLabel: "原始位數（由右往左取出）",
              x: 325,
              y: 52,
              values: digits,
              hl: hlD && curIdx >= 0 && curIdx < L ? [curIdx] : [],
              done: digits.map((_, k) => k).filter((k) => k >= L - consumed && !(hlD && k === curIdx)),
              pointers: hlD && curIdx >= 0 && curIdx < L ? [{ idx: curIdx, label: `d = ${d}`, color: "purple" }] : []
            },
            {
              id: "rv",
              type: "array",
              name: "rev",
              typeLabel: `反轉結果 ${rev < 0 || x0 < 0 ? "（負號）" : ""}`,
              x: 325,
              y: 180,
              values: revDigits,
              hl: hlRev && revDigits.length ? [revDigits.length - 1] : [],
              warn: warn ? revDigits.map((_, k) => k) : [],
              match: ret !== "-" && !warn ? revDigits.map((_, k) => k) : []
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "位數與溢位檢查",
              x: 24,
              y: 215,
              items: [
                { id: "x", name: "x", val: String(x), status: hlVar === "x" ? "hl" : "" },
                { id: "d", name: "d", val: String(d), status: hlVar === "d" ? "hl" : "" },
                { id: "rev", name: "rev", val: String(rev), status: hlVar === "rev" ? "hl" : warn ? "warn" : "" },
                { id: "lim", name: "INT_MAX/10, INT_MIN/10", val: `${MAXD}, ${MIND}`, status: hlVar === "lim" ? "hl" : "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = () => ({ x, d, rev, return: ret });

      steps.push(e06Step(4, "初始化 rev", "default", "rev = 0",
        `輸入 x = ${x0}。rev 從 0 開始，每次從 x 取出最低位接到 rev 尾端。`, V(), snap()));
      while (true) {
        if (x === 0) {
          steps.push(e06Step(5, "x 已為 0", "tag-check", "x == 0 ➜ 結束",
            consumed ? "x 的每一位都已取出，迴圈結束。" : "x 本身就是 0，不需要反轉，迴圈不執行。", V(), snap()));
          break;
        }
        steps.push(e06Step(5, "x 不為 0", "tag-check", `x = ${x} != 0`,
          `x = ${x} 還有位數沒處理，繼續取出最低位。`, V(), snap()));
        d = x % 10;
        if (Object.is(d, -0)) d = 0;
        steps.push(e06Step(6, "取最低位", "default", `d = ${x} % 10 = ${d}`,
          `x % 10 取出最低位 d = ${d}${x < 0 ? "（C++ 的餘數與被除數同號，所以是負的）" : ""}。`, V(),
          snap({ hlD: true, hlVar: "d", connectors: [{ from: `wb-cw-xd-${L - consumed - 1}`, to: "wb-var-d", label: `d = ${d}`, color: "blue" }] })));
        x = Math.trunc(x / 10);
        consumed++;
        steps.push(e06Step(7, "去掉最低位", "default", `x /= 10 ➜ ${x}`,
          `整數除法向零截斷，x 變成 ${x}。`, V(), snap({ hlVar: "x" })));
        const posOv = rev > MAXD || (rev === MAXD && d > 7);
        if (posOv) {
          ret = 0;
          steps.push(e06Step(8, "正溢位", "tag-found", `rev = ${rev}, d = ${d} ➜ return 0`,
            `rev = ${rev} ${rev > MAXD ? `已大於 INT_MAX / 10 = ${MAXD}` : `等於 INT_MAX / 10 且 d = ${d} 大於 7`}，再乘 10 加 d 就會超過 2147483647，依題意回傳 0。`, V(),
            snap({ warn: true, hlVar: "lim", connectors: [{ from: "wb-var-lim", to: "wb-var-ret", label: "溢位", color: "red" }] })));
          return steps;
        }
        steps.push(e06Step(8, "正溢位檢查通過", "tag-check", `${rev} ≤ ${MAXD}`,
          `rev = ${rev} 乘 10 再加 ${d} 不會超過 INT_MAX。`, V(), snap({ hlVar: "lim" })));
        const negOv = rev < MIND || (rev === MIND && d < -8);
        if (negOv) {
          ret = 0;
          steps.push(e06Step(9, "負溢位", "tag-found", `rev = ${rev}, d = ${d} ➜ return 0`,
            `rev = ${rev} ${rev < MIND ? `已小於 INT_MIN / 10 = ${MIND}` : `等於 INT_MIN / 10 且 d = ${d} 小於 -8`}，再乘 10 加 d 會低於 -2147483648，回傳 0。`, V(),
            snap({ warn: true, hlVar: "lim", connectors: [{ from: "wb-var-lim", to: "wb-var-ret", label: "溢位", color: "red" }] })));
          return steps;
        }
        steps.push(e06Step(9, "負溢位檢查通過", "tag-check", `${rev} ≥ ${MIND}`,
          rev >= 0 ? `rev = ${rev} 不是負數，不可能低於 INT_MIN。` : `rev = ${rev} 乘 10 再加 ${d} 不會低於 INT_MIN。`, V(), snap({ hlVar: "lim" })));
        const old = rev;
        rev = rev * 10 + d;
        steps.push(e06Step(10, "接到 rev 尾端", "tag-insert", `rev = ${old} * 10 + ${d} = ${rev}`,
          `把 d = ${d} 接到 rev 尾端，rev = ${rev}。`, V(),
          snap({ hlRev: true, hlVar: "rev", connectors: [{ from: "wb-var-d", to: `wb-cw-rv-${Math.max(0, String(Math.abs(rev)).length - 1)}`, label: `+ ${d}`, color: "purple" }] })));
        d = "-";
      }
      ret = rev;
      steps.push(e06Step(12, "回傳結果", "tag-found", `return ${rev}`,
        `反轉完成且沒有溢位，回傳 ${rev}。`, V(),
        snap({ connectors: [{ from: "wb-var-rev", to: "wb-var-ret", label: "回傳", color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #146 Set Matrix Zeroes (LC #73, Medium)
  // ==========================================================================
  window.PROBLEMS["set-matrix-zeroes"] = {
    id: 146,
    leetcodeId: 73,
    slug: "set-matrix-zeroes",
    title: "73. Set Matrix Zeroes (矩陣置零)",
    difficulty: "Medium",
    topic: "Matrix / In-place Markers",
    mins: 25,
    complexity: "Time O(m·n) · Space O(1)",
    argNames: ["matrix"],
    description:
      "用第 0 列與第 0 欄本身當作標記陣列，達到 O(1) 額外空間。先用兩個布林值記住第 0 列、第 0 欄原本是否含 0；再掃描其餘格子，遇到 0 就把所在列的第 0 欄與所在欄的第 0 列設為 0 作為標記；第二輪依標記把內部格子清零；最後依兩個布林值決定是否清空第 0 列與第 0 欄（必須最後處理，否則會污染標記）。時間 O(m·n)，空間 O(1)。",

    presets: [
      { name: "範例 1：matrix = [[1,1,1],[1,0,1],[1,1,1]]", args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]] },
      { name: "範例 2：matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]] },
      { name: "邊界：matrix = [[1]]", args: [[[1]]] },
      { name: "特殊：多個 0 [[1,2,3,4],[5,0,7,8],[0,10,11,12],[13,14,15,0]]", args: [[[1, 2, 3, 4], [5, 0, 7, 8], [0, 10, 11, 12], [13, 14, 15, 0]]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    void setZeroes(vector<vector<int>>& matrix) {",
      "        int m = matrix.size(), n = matrix[0].size();",
      "        bool firstRowZero = false, firstColZero = false;",
      "        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;",
      "        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;",
      "        for (int i = 1; i < m; i++)",
      "            for (int j = 1; j < n; j++)",
      "                if (matrix[i][j] == 0) matrix[i][0] = matrix[0][j] = 0;",
      "        for (int i = 1; i < m; i++)",
      "            for (int j = 1; j < n; j++)",
      "                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;",
      "        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;",
      "        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;",
      "    }",
      "};"
    ]),

    generateTrace(matrixInput) {
      const mat = e06Clone(matrixInput);
      const m = mat.length;
      const n = mat[0].length;
      const steps = [];
      let frz = "-";
      let fcz = "-";
      let ret = "-";
      const zeroed = new Set();

      const snap = (opts = {}) => {
        const { hl = [], warn = [], match = [], connectors = [], cur = "-", hlVar = "" } = opts;
        const done = [];
        zeroed.forEach((k) => {
          if (!hl.includes(k) && !warn.includes(k) && !match.includes(k)) done.push(k);
        });
        return {
          boards: [
            {
              id: "mat",
              type: "grid",
              name: "matrix",
              typeLabel: `矩陣 ${m}×${n}（第 0 列／欄兼作標記）`,
              x: 325,
              y: 52,
              cells: mat.map((row) => row.map(String)),
              hl,
              warn,
              match,
              done
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "標記旗標",
              x: 24,
              y: 215,
              items: [
                { id: "mn", name: "m × n", val: `${m} × ${n}`, status: "" },
                { id: "frz", name: "firstRowZero", val: String(frz), status: hlVar === "frz" ? "hl" : "" },
                { id: "fcz", name: "firstColZero", val: String(fcz), status: hlVar === "fcz" ? "hl" : "" },
                { id: "cur", name: "(i, j)", val: cur, status: cur !== "-" ? "hl" : "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const V = (cur = "-") => ({ firstRowZero: frz, firstColZero: fcz, "(i, j)": cur, return: ret });
      const setZero = (r, c) => {
        mat[r][c] = 0;
        zeroed.add(`${r},${c}`);
      };

      steps.push(e06Step(4, "取得尺寸", "default", `m = ${m}, n = ${n}`,
        `矩陣有 ${m} 列 ${n} 欄。目標是只用 O(1) 額外空間，把含 0 的整列與整欄都設成 0。`, V(), snap()));
      frz = false;
      fcz = false;
      steps.push(e06Step(5, "初始化旗標", "default", "firstRowZero = firstColZero = false",
        "第 0 列與第 0 欄等一下要拿來當標記，所以先用兩個布林值記住它們「原本」是否含 0。", V(), snap()));

      const row0 = Array.from({ length: n }, (_, j) => `0,${j}`);
      const z0 = row0.filter((k) => mat[0][Number(k.split(",")[1])] === 0);
      frz = z0.length > 0;
      steps.push(e06Step(6, "掃描第 0 列", "tag-check", `firstRowZero = ${frz}`,
        frz ? `第 0 列原本就有 0（在第 ${z0.map((k) => k.split(",")[1]).join("、")} 欄），最後要整列清零。` : "第 0 列原本沒有 0。",
        V(), snap({ hl: row0.filter((k) => !z0.includes(k)), warn: z0, hlVar: "frz" })));
      const col0 = Array.from({ length: m }, (_, i) => `${i},0`);
      const zc = col0.filter((k) => mat[Number(k.split(",")[0])][0] === 0);
      fcz = zc.length > 0;
      steps.push(e06Step(7, "掃描第 0 欄", "tag-check", `firstColZero = ${fcz}`,
        fcz ? `第 0 欄原本就有 0（在第 ${zc.map((k) => k.split(",")[0]).join("、")} 列），最後要整欄清零。` : "第 0 欄原本沒有 0。",
        V(), snap({ hl: col0.filter((k) => !zc.includes(k)), warn: zc, hlVar: "fcz" })));

      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          const cur = `(${i}, ${j})`;
          if (mat[i][j] === 0) {
            setZero(i, 0);
            setZero(0, j);
            steps.push(e06Step(10, `標記列 ${i}、欄 ${j}`, "tag-insert", `matrix[${i}][0] = matrix[0][${j}] = 0`,
              `matrix[${i}][${j}] 是 0，把第 ${i} 列的標記 matrix[${i}][0] 與第 ${j} 欄的標記 matrix[0][${j}] 設為 0。`,
              V(cur), snap({ warn: [`${i},${j}`], hl: [`${i},0`, `0,${j}`], cur,
                connectors: [
                  { from: `wb-grid-mat-${i}-${j}`, to: `wb-grid-mat-${i}-0`, label: "標記列", color: "purple" },
                  { from: `wb-grid-mat-${i}-${j}`, to: `wb-grid-mat-0-${j}`, label: "標記欄", color: "purple" }
                ] })));
          } else {
            steps.push(e06Step(10, "不是 0", "tag-check", `matrix[${i}][${j}] = ${mat[i][j]}`,
              `matrix[${i}][${j}] = ${mat[i][j]} 不是 0，不需要標記。`, V(cur), snap({ hl: [`${i},${j}`], cur })));
          }
        }
      }

      for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
          const cur = `(${i}, ${j})`;
          const rowMark = mat[i][0] === 0;
          const colMark = mat[0][j] === 0;
          if (rowMark || colMark) {
            const was = mat[i][j];
            setZero(i, j);
            const src = rowMark ? `${i}-0` : `0-${j}`;
            steps.push(e06Step(13, "依標記清零", "tag-insert", `${rowMark ? `matrix[${i}][0]` : `matrix[0][${j}]`} == 0 ➜ matrix[${i}][${j}] = 0`,
              `${rowMark ? `第 ${i} 列被標記` : ""}${rowMark && colMark ? "、" : ""}${colMark ? `第 ${j} 欄被標記` : ""}，matrix[${i}][${j}]（原為 ${was}）設為 0。`,
              V(cur), snap({ hl: [`${i},${j}`], cur,
                connectors: [{ from: `wb-grid-mat-${src}`, to: `wb-grid-mat-${i}-${j}`, label: "清零", color: "red" }] })));
          } else {
            steps.push(e06Step(13, "保留原值", "tag-check", `matrix[${i}][0] 與 matrix[0][${j}] 都不是 0`,
              `第 ${i} 列與第 ${j} 欄都沒有被標記，matrix[${i}][${j}] = ${mat[i][j]} 保持不變。`, V(cur), snap({ match: [`${i},${j}`], cur })));
          }
        }
      }

      if (frz) {
        for (let j = 0; j < n; j++) setZero(0, j);
        steps.push(e06Step(14, "清空第 0 列", "tag-insert", "firstRowZero ➜ matrix[0][*] = 0",
          "第 0 列原本就含 0，標記用途結束後把整列設為 0。", V(), snap({ hl: row0, hlVar: "frz" })));
      } else {
        steps.push(e06Step(14, "第 0 列不清空", "tag-check", "firstRowZero = false",
          "第 0 列原本沒有 0，保持標記處理後的結果。", V(), snap({ hlVar: "frz" })));
      }
      if (fcz) {
        for (let i = 0; i < m; i++) setZero(i, 0);
        steps.push(e06Step(15, "清空第 0 欄", "tag-insert", "firstColZero ➜ matrix[*][0] = 0",
          "第 0 欄原本就含 0，最後把整欄設為 0。", V(), snap({ hl: col0, hlVar: "fcz" })));
      } else {
        steps.push(e06Step(15, "第 0 欄不清空", "tag-check", "firstColZero = false",
          "第 0 欄原本沒有 0，保持標記處理後的結果。", V(), snap({ hlVar: "fcz" })));
      }
      ret = `[${mat.map((r) => `[${r.join(",")}]`).join(",")}]`;
      steps.push(e06Step(16, "原地修改完成", "tag-found", `matrix = ${ret}`,
        `函式為 void，直接在原矩陣上完成修改，結果為 ${ret}。`, V(),
        snap({ match: [], connectors: [{ from: "wb-dyn-mat", to: "wb-var-ret", label: "原地結果", color: "green" }] })));
      return steps;
    }
  };

  // ==========================================================================
  // #147 Reorder List (LC #143, Medium)
  // ==========================================================================
  window.PROBLEMS["reorder-list"] = {
    id: 147,
    leetcodeId: 143,
    slug: "reorder-list",
    title: "143. Reorder List (重排鏈結串列)",
    difficulty: "Medium",
    topic: "Linked List / Two Pointers",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head"],
    description:
      "分三步原地完成 L0 → Ln → L1 → Ln-1 → … 的重排：一、快慢指標找中點，slow 停在前半段的最後一個節點；二、從 slow->next 切開，將後半段原地反轉；三、以 first、second 兩個指標交錯合併，前半一個、後半一個依序接起來。只改動 next 指標、不修改節點值。時間 O(n)，空間 O(1)。",

    presets: [
      { name: "範例 1：head = [1,2,3,4]", args: [[1, 2, 3, 4]] },
      { name: "範例 2：head = [1,2,3,4,5]", args: [[1, 2, 3, 4, 5]] },
      { name: "邊界：head = [1]（單一節點）", args: [[1]] },
      { name: "邊界：head = [1,2]", args: [[1, 2]] },
      { name: "特殊：head = [10,20,30,40,50,60]", args: [[10, 20, 30, 40, 50, 60]] }
    ],

    cppLines: e06Lines([
      "class Solution {",
      "public:",
      "    void reorderList(ListNode* head) {",
      "        if (!head || !head->next) return;",
      "        ListNode *slow = head, *fast = head;",
      "        while (fast->next && fast->next->next) {",
      "            slow = slow->next;",
      "            fast = fast->next->next;",
      "        }",
      "        ListNode *prev = nullptr, *curr = slow->next;",
      "        slow->next = nullptr;",
      "        while (curr) {",
      "            ListNode* nxt = curr->next;",
      "            curr->next = prev;",
      "            prev = curr;",
      "            curr = nxt;",
      "        }",
      "        ListNode *first = head, *second = prev;",
      "        while (second) {",
      "            ListNode *t1 = first->next, *t2 = second->next;",
      "            first->next = second;",
      "            second->next = t1;",
      "            first = t1;",
      "            second = t2;",
      "        }",
      "    }",
      "};"
    ]),

    generateTrace(headInput) {
      const vals = e06Clone(headInput);
      const n = vals.length;
      const steps = [];
      const next = vals.map((_, i) => (i + 1 < n ? i + 1 : -1));
      const P = {};
      let ret = "-";

      const chain = (start) => {
        const out = [];
        const seen = new Set();
        let k = start;
        while (k !== -1 && k !== undefined && !seen.has(k)) {
          seen.add(k);
          out.push(k);
          k = next[k];
        }
        return out;
      };
      const listStr = (start) => `[${chain(start).map((k) => vals[k]).join(" → ")}]`;
      const nm = (k) => (k === -1 || k === undefined ? "nullptr" : `Node(${vals[k]})`);

      const snap = (opts = {}) => {
        const { hlEdge = -1, hlNodes = [], matchAll = false, connectors = [], hlVar = "" } = opts;
        const row1 = chain(0);
        const inRow1 = new Set(row1);
        const row2 = vals.map((_, i) => i).filter((i) => !inRow1.has(i));
        const posOf = {};
        row1.forEach((k, idx) => (posOf[k] = { x: 52 + idx * 86, y: 60 }));
        row2.forEach((k, idx) => (posOf[k] = { x: 95 + idx * 86, y: 165 }));
        const nodes = vals.map((v, i) => {
          const ptrs = Object.keys(P).filter((name) => P[name] === i);
          return {
            id: `n${i}`,
            val: String(v),
            sub: next[i] === -1 ? "next=null" : `next→${vals[next[i]]}`,
            x: posOf[i].x,
            y: posOf[i].y,
            status: matchAll ? "match" : hlNodes.includes(i) ? "hl" : "",
            ptr: ptrs.join("/")
          };
        });
        const edges = [];
        next.forEach((t, i) => {
          if (t !== -1) edges.push({ from: `n${i}`, to: `n${t}`, label: "next", dir: true, status: i === hlEdge ? "hl" : matchAll ? "match" : "" });
        });
        const varItems = [
          { id: "slow", name: "slow", val: nm(P.slow), status: hlVar === "slow" ? "hl" : "" },
          { id: "fast", name: "fast", val: nm(P.fast), status: hlVar === "fast" ? "hl" : "" },
          { id: "prev", name: "prev", val: nm(P.prev), status: hlVar === "prev" ? "hl" : "" },
          { id: "curr", name: "curr", val: nm(P.curr), status: hlVar === "curr" ? "hl" : "" },
          { id: "first", name: "first", val: nm(P.first), status: hlVar === "first" ? "hl" : "" },
          { id: "second", name: "second", val: nm(P.second), status: hlVar === "second" ? "hl" : "" },
          { id: "ret", name: "head (結果)", val: ret, status: ret !== "-" ? "match" : "" }
        ];
        return {
          boards: [
            {
              id: "list",
              type: "list",
              shape: "list",
              name: "head",
              typeLabel: "單向鏈結串列 (ListNode*)：上排 = 從 head 可達",
              x: 325,
              y: 52,
              width: Math.max(460, 95 + n * 86 + 40),
              height: 240,
              nodes,
              edges
            },
            {
              id: "vars",
              type: "vars",
              name: "ptr_vars",
              typeLabel: "指標狀態",
              x: 24,
              y: 215,
              items: varItems
            }
          ],
          connectors
        };
      };
      const V = () => ({
        slow: P.slow !== undefined ? vals[P.slow] ?? "null" : "-",
        fast: P.fast !== undefined ? vals[P.fast] ?? "null" : "-",
        first: P.first !== undefined ? vals[P.first] ?? "null" : "-",
        second: P.second !== undefined ? vals[P.second] ?? "null" : "-",
        head: ret === "-" ? listStr(0) : ret
      });

      if (n <= 1 || next[0] === -1) {
        ret = listStr(0);
        steps.push(e06Step(4, "不需重排", "tag-found", n ? "!head->next ➜ return" : "!head ➜ return",
          `串列只有 ${n} 個節點，重排後順序不變，直接返回。`, V(), snap({ matchAll: true })));
        return steps;
      }
      steps.push(e06Step(4, "至少兩個節點", "tag-check", "head && head->next",
        `串列 ${listStr(0)} 至少有兩個節點，需要重排成 L0 → Ln → L1 → Ln-1 → …。`, V(), snap()));
      P.slow = 0;
      P.fast = 0;
      steps.push(e06Step(5, "快慢指標起點", "default", `slow = fast = Node(${vals[0]})`,
        "slow 每次走一步、fast 每次走兩步，fast 走到尾端時 slow 會停在前半段最後一個節點。", V(), snap({ hlNodes: [0] })));
      while (next[P.fast] !== -1 && next[next[P.fast]] !== -1) {
        steps.push(e06Step(6, "fast 可再走兩步", "tag-check", `fast->next->next = Node(${vals[next[next[P.fast]]]})`,
          `fast 後面還有兩個節點，快慢指標繼續前進。`, V(), snap({ hlNodes: [P.fast] })));
        P.slow = next[P.slow];
        steps.push(e06Step(7, "slow 走一步", "default", `slow = ${nm(P.slow)}`,
          `slow 前進一步到 ${vals[P.slow]}。`, V(), snap({ hlNodes: [P.slow], hlVar: "slow" })));
        P.fast = next[next[P.fast]];
        steps.push(e06Step(8, "fast 走兩步", "default", `fast = ${nm(P.fast)}`,
          `fast 前進兩步到 ${vals[P.fast]}。`, V(), snap({ hlNodes: [P.fast], hlVar: "fast" })));
      }
      steps.push(e06Step(6, "找到中點", "tag-found", `slow = ${nm(P.slow)}`,
        `fast 已無法再走兩步，slow = ${vals[P.slow]} 就是前半段的最後一個節點。`, V(), snap({ hlNodes: [P.slow], hlVar: "slow" })));
      delete P.fast;

      P.prev = -1;
      P.curr = next[P.slow];
      steps.push(e06Step(10, "準備反轉後半", "default", `prev = nullptr, curr = ${nm(P.curr)}`,
        `後半段從 slow->next = ${vals[P.curr]} 開始，用 prev / curr 兩個指標原地反轉。`, V(), snap({ hlNodes: [P.curr], hlVar: "curr" })));
      const oldNext = next[P.slow];
      next[P.slow] = -1;
      steps.push(e06Step(11, "切斷前後兩半", "tag-insert", `Node(${vals[P.slow]})->next = nullptr`,
        `把 slow->next 設為 nullptr，前半段 ${listStr(0)} 與後半段（從 ${vals[oldNext]} 開始）分開；後半段移到下排。`, V(),
        snap({ hlNodes: [P.slow], hlVar: "slow" })));
      while (P.curr !== -1) {
        const c = P.curr;
        const nx = next[c];
        steps.push(e06Step(13, "暫存 nxt", "tag-check", `nxt = ${nm(nx)}`,
          `先記住 curr = ${vals[c]} 原本的下一個節點 ${nx === -1 ? "nullptr" : vals[nx]}，避免反轉後遺失。`, V(), snap({ hlNodes: [c], hlEdge: c, hlVar: "curr" })));
        next[c] = P.prev;
        steps.push(e06Step(14, `反轉 ${vals[c]} 的 next`, "tag-insert", `Node(${vals[c]})->next = ${nm(P.prev)}`,
          `把 ${vals[c]} 的 next 改指向 prev（${P.prev === -1 ? "nullptr" : vals[P.prev]}）。`, V(),
          snap({ hlNodes: [c], hlEdge: c, hlVar: "curr",
            connectors: P.prev === -1 ? [] : [{ from: `wb-node-list-n${c}`, to: `wb-node-list-n${P.prev}`, label: "反轉", color: "purple" }] })));
        P.prev = c;
        P.curr = nx;
        steps.push(e06Step(16, "prev、curr 前進", "default", `prev = ${nm(P.prev)}, curr = ${nm(P.curr)}`,
          `prev 移到 ${vals[P.prev]}，curr 移到 ${P.curr === -1 ? "nullptr" : vals[P.curr]}。`, V(), snap({ hlNodes: [P.prev], hlVar: "prev" })));
      }
      delete P.curr;
      P.first = 0;
      P.second = P.prev;
      delete P.prev;
      steps.push(e06Step(18, "準備交錯合併", "default", `first = ${nm(0)}, second = ${nm(P.second)}`,
        `後半段反轉完成：${listStr(P.second)}。first 指向前半段頭 ${vals[0]}，second 指向反轉後的後半段頭 ${vals[P.second]}。`, V(),
        snap({ hlNodes: [0, P.second], hlVar: "second" })));
      while (P.second !== -1) {
        const f = P.first;
        const s = P.second;
        const t1 = next[f];
        const t2 = next[s];
        steps.push(e06Step(20, "暫存 t1、t2", "tag-check", `t1 = ${nm(t1)}, t2 = ${nm(t2)}`,
          `先記住 first 與 second 原本的下一個節點：t1 = ${t1 === -1 ? "nullptr" : vals[t1]}、t2 = ${t2 === -1 ? "nullptr" : vals[t2]}。`, V(), snap({ hlNodes: [f, s] })));
        next[f] = s;
        steps.push(e06Step(21, `${vals[f]} 接上 ${vals[s]}`, "tag-insert", `Node(${vals[f]})->next = Node(${vals[s]})`,
          `把前半的 ${vals[f]} 接到後半的 ${vals[s]}。`, V(),
          snap({ hlNodes: [f, s], hlEdge: f, hlVar: "first", connectors: [{ from: `wb-node-list-n${f}`, to: `wb-node-list-n${s}`, label: "first→second", color: "purple" }] })));
        next[s] = t1;
        steps.push(e06Step(22, `${vals[s]} 接回 ${t1 === -1 ? "nullptr" : vals[t1]}`, "tag-insert", `Node(${vals[s]})->next = ${nm(t1)}`,
          `再把 ${vals[s]} 接回前半段原本的下一個節點 ${t1 === -1 ? "nullptr" : vals[t1]}，目前 head 串列為 ${listStr(0)}。`, V(),
          snap({ hlNodes: [s], hlEdge: s, hlVar: "second",
            connectors: t1 === -1 ? [] : [{ from: `wb-node-list-n${s}`, to: `wb-node-list-n${t1}`, label: "second→t1", color: "purple" }] })));
        P.first = t1;
        P.second = t2;
        steps.push(e06Step(24, "first、second 前進", "default", `first = ${nm(t1)}, second = ${nm(t2)}`,
          `first 前進到 ${t1 === -1 ? "nullptr" : vals[t1]}，second 前進到 ${t2 === -1 ? "nullptr" : vals[t2]}。`, V(),
          snap({ hlNodes: [t1, t2].filter((k) => k !== -1) })));
      }
      ret = listStr(0);
      steps.push(e06Step(19, "合併完成", "tag-found", `second == nullptr ➜ ${ret}`,
        `後半段已全部插入，原地重排完成：${ret}。`, V(), snap({ matchAll: true })));
      return steps;
    }
  };
})();

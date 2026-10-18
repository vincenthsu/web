/**
 * Grind 75 — Week 7 (Problems #59 – #65)
 * C++17 單步執行與 Trace-by-Hand 手動跑題白板視覺化模組
 *
 * 包含題目：
 *   #59 (LC #11)  Container With Most Water (盛最多水的容器)
 *   #60 (LC #17)  Letter Combinations of a Phone Number (電話號碼的字母組合)
 *   #61 (LC #79)  Word Search (單詞搜尋)
 *   #62 (LC #438) Find All Anagrams in a String (找到字串中所有字母異位詞)
 *   #63 (LC #310) Minimum Height Trees (最小高度樹)
 *   #64 (LC #621) Task Scheduler (任務調度器)
 *   #65 (LC #146) LRU Cache (LRU 快取)
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #59 (LC #11) Container With Most Water (盛最多水的容器)
// ============================================================================
window.PROBLEMS["container-with-most-water"] = {
  id: 59,
  leetcodeId: 11,
  slug: "container-with-most-water",
  title: "11. Container With Most Water (盛最多水的容器)",
  difficulty: "Medium",
  topic: "Array",
  mins: 35,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["height"],
  description:
    "給定長度為 n 的整數陣列 height，代表 n 條垂直線的高度。找出兩條線與 x 軸構成的容器，使其能容納最多的水。使用雙指標 left 與 right 從兩端向中間收斂，每次計算 area = min(height[left], height[right]) * (right - left)，並移動較短的那一側指標。",

  presets: [
    {
      name: "範例 1：標準情況 height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
      args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]]
    },
    {
      name: "範例 2：對稱雙柱 height = [1, 1]",
      args: [[1, 1]]
    },
    {
      name: "範例 3：中間高柱 height = [4, 3, 2, 1, 4]",
      args: [[4, 3, 2, 1, 4]]
    },
    {
      name: "範例 4：遞增再遞減 height = [1, 3, 8, 9, 2, 4]",
      args: [[1, 3, 8, 9, 2, 4]]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">maxArea</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; height) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> left = <span class="tok-num">0</span>, right = (<span class="tok-kw">int</span>)height.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">int</span> best = <span class="tok-num">0</span>;' },
    { line: 6,  code: '        <span class="tok-kw">while</span> (left &lt; right) {' },
    { line: 7,  code: '            <span class="tok-kw">int</span> width = right - left;' },
    { line: 8,  code: '            <span class="tok-kw">int</span> h = <span class="tok-fn">min</span>(height[left], height[right]);' },
    { line: 9,  code: '            <span class="tok-kw">int</span> area = h * width;' },
    { line: 10, code: '            best = <span class="tok-fn">max</span>(best, area);' },
    { line: 11, code: '            <span class="tok-kw">if</span> (height[left] &lt; height[right]) ++left;' },
    { line: 12, code: '            <span class="tok-kw">else</span> --right;' },
    { line: 13, code: '        }' },
    { line: 14, code: '        <span class="tok-kw">return</span> best;' },
    { line: 15, code: '    }' },
    { line: 16, code: '};' }
  ],

  generateTrace(heightInput) {
    const height = Array.isArray(heightInput) && heightInput.length >= 2 ? heightInput.map(Number) : [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const steps = [];
    let left = 0;
    let right = height.length - 1;
    let best = 0;
    let bestPair = [-1, -1];
    const doneIndices = [];

    const buildBoards = (opts = {}) => {
      const {
        l = left,
        r = right,
        width = "-",
        h = "-",
        area = "-",
        bestVal = best,
        hl = [],
        match = [],
        varStatus = {},
        connectors = []
      } = opts;

      const pointers = [];
      if (l >= 0 && l < height.length) {
        pointers.push({ idx: l, label: `L=${l} (h=${height[l]})`, color: "blue" });
      }
      if (r >= 0 && r < height.length) {
        pointers.push({ idx: r, label: `R=${r} (h=${height[r]})`, color: "red" });
      }

      return {
        boards: [
          {
            id: "height",
            type: "array",
            name: "height",
            typeLabel: "雙指標陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: height,
            hl,
            match,
            done: [...doneIndices],
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "關鍵變數與算式",
            x: 24,
            y: 205,
            items: [
              { id: "left", name: "left", val: String(l), status: varStatus.left || "" },
              { id: "right", name: "right", val: String(r), status: varStatus.right || "" },
              { id: "width", name: "width", val: String(width), status: varStatus.width || "" },
              { id: "area", name: "area", val: String(area), status: varStatus.area || "" },
              { id: "maxArea", name: "maxArea", val: String(bestVal), status: varStatus.maxArea || "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 4,
      tag: "初始化雙指標",
      tagType: "default",
      inlineBadge: `left = 0, right = ${right}, best = 0`,
      explanation: `將左指標 left 置於最左端索引 0 (高 ${height[0]})，右指標 right 置於最右端索引 ${right} (高 ${height[right]})，最大面積 best 初始化為 0。`,
      vars: { left: "0", right: String(right), width: "-", area: "-", maxArea: "0" },
      state: buildBoards({
        hl: [left, right],
        varStatus: { left: "hl", right: "hl" }
      })
    });

    while (left < right) {
      const width = right - left;
      const h = Math.min(height[left], height[right]);
      const area = h * width;
      const isNewBest = area > best;
      if (isNewBest) {
        best = area;
        bestPair = [left, right];
      }

      steps.push({
        line: 9,
        tag: `計算面積 [L=${left}, R=${right}]`,
        tagType: isNewBest ? "tag-found" : "tag-check",
        inlineBadge: `min(${height[left]}, ${height[right]}) * (${right} - ${left}) = ${area}`,
        explanation: `計算區間 [${left}, ${right}]：寬度 width = ${right} - ${left} = ${width}，受限於較短邊 h = min(${height[left]}, ${height[right]}) = ${h}，面積 area = ${h} × ${width} = ${area}。${
          isNewBest ? `刷新最大面積 maxArea = ${best}！` : `未超過目前最大面積 ${best}。`
        }`,
        vars: {
          left: String(left),
          right: String(right),
          width: String(width),
          area: `${h} * ${width} = ${area}`,
          maxArea: String(best)
        },
        state: buildBoards({
          width,
          h,
          area: `${h}×${width}=${area}`,
          bestVal: best,
          hl: isNewBest ? [] : [left, right],
          match: isNewBest ? [left, right] : [],
          varStatus: {
            width: "hl",
            area: isNewBest ? "match" : "hl",
            maxArea: isNewBest ? "match" : ""
          },
          connectors: [
            {
              from: `wb-cw-height-${height[left] <= height[right] ? left : right}`,
              to: "wb-var-area",
              label: `短板 h=${h} → area=${area}`,
              color: isNewBest ? "green" : "blue"
            }
          ]
        })
      });

      if (height[left] < height[right]) {
        const oldLeft = left;
        doneIndices.push(oldLeft);
        left++;
        steps.push({
          line: 11,
          tag: `左柱較短 → ++left`,
          tagType: "tag-insert",
          inlineBadge: `height[${oldLeft}]=${height[oldLeft]} < height[${right}]=${height[right]} → left = ${left}`,
          explanation: `因為左側高度 height[${oldLeft}] = ${height[oldLeft]} 小於右側 height[${right}] = ${height[right]}，保留短板無法在寬度縮小時獲得更大面積，故淘汰左柱並將 left 右移至 ${left}。`,
          vars: {
            left: String(left),
            right: String(right),
            width: String(width),
            area: String(area),
            maxArea: String(best)
          },
          state: buildBoards({
            width,
            h,
            area,
            bestVal: best,
            hl: left < right ? [left, right] : [left],
            varStatus: { left: "hl" }
          })
        });
      } else {
        const oldRight = right;
        doneIndices.push(oldRight);
        right--;
        steps.push({
          line: 12,
          tag: `右柱較短或相等 → --right`,
          tagType: "tag-insert",
          inlineBadge: `height[${left}]=${height[left]} >= height[${oldRight}]=${height[oldRight]} → right = ${right}`,
          explanation: `因為右側高度 height[${oldRight}] = ${height[oldRight]} 不大於左側 height[${left}] = ${height[left]}，淘汰右柱並將 right 左移至 ${right}。`,
          vars: {
            left: String(left),
            right: String(right),
            width: String(width),
            area: String(area),
            maxArea: String(best)
          },
          state: buildBoards({
            width,
            h,
            area,
            bestVal: best,
            hl: left < right ? [left, right] : [left],
            varStatus: { right: "hl" }
          })
        });
      }
    }

    steps.push({
      line: 14,
      tag: "回傳最大盛水量",
      tagType: "tag-found",
      inlineBadge: `return ${best}`,
      explanation: `left (${left}) 與 right (${right}) 相遇，雙指標掃描結束。最大盛水面積為 ${best}（由索引 ${bestPair[0]} 與 ${bestPair[1]} 構成）。`,
      vars: {
        left: String(left),
        right: String(right),
        width: "0",
        area: "-",
        maxArea: String(best)
      },
      state: buildBoards({
        match: bestPair[0] !== -1 ? bestPair : [],
        varStatus: { maxArea: "match" },
        connectors:
          bestPair[0] !== -1
            ? [
                {
                  from: `wb-cw-height-${bestPair[0]}`,
                  to: "wb-var-maxArea",
                  label: `最佳容器 [${bestPair[0]}, ${bestPair[1]}] = ${best}`,
                  color: "green"
                }
              ]
            : []
      })
    });

    return steps;
  }
};

// ============================================================================
// #60 (LC #17) Letter Combinations of a Phone Number (電話號碼的字母組合)
// ============================================================================
window.PROBLEMS["letter-combinations-of-a-phone-number"] = {
  id: 60,
  leetcodeId: 17,
  slug: "letter-combinations-of-a-phone-number",
  title: "17. Letter Combinations of a Phone Number (電話號碼的字母組合)",
  difficulty: "Medium",
  topic: "Recursion",
  mins: 30,
  complexity: "Time O(4^N · N) · Space O(N)",
  argNames: ["digits"],
  description:
    "給定一個僅包含數字 2–9 的字串 digits，回傳所有它能表示的電話按鍵字母組合。使用回溯法 (Backtracking DFS) 依序展開每個數位對應的字母，當路徑長度等於 digits.size() 時收錄結果並回溯。",

  presets: [
    {
      name: '範例 1：標準雙鍵 digits = "23"',
      args: ["23"]
    },
    {
      name: '範例 2：包含四字母鍵 digits = "79"',
      args: ["79"]
    },
    {
      name: '範例 3：單一按鍵 digits = "2"',
      args: ["2"]
    },
    {
      name: '範例 4：三鍵組合 digits = "246"',
      args: ["246"]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-kw">const</span> <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; pad = {' },
    { line: 3,  code: '        <span class="tok-num">""</span>, <span class="tok-num">""</span>, <span class="tok-num">"abc"</span>, <span class="tok-num">"def"</span>, <span class="tok-num">"ghi"</span>, <span class="tok-num">"jkl"</span>, <span class="tok-num">"mno"</span>, <span class="tok-num">"pqrs"</span>, <span class="tok-num">"tuv"</span>, <span class="tok-num">"wxyz"</span>' },
    { line: 4,  code: '    };' },
    { line: 5,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">dfs</span>(<span class="tok-kw">const</span> <span class="tok-type">string</span>&amp; digits, <span class="tok-kw">int</span> idx, <span class="tok-type">string</span>&amp; path, <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&amp; res) {' },
    { line: 6,  code: '        <span class="tok-kw">if</span> (idx == (<span class="tok-kw">int</span>)digits.<span class="tok-fn">size</span>()) {' },
    { line: 7,  code: '            res.<span class="tok-fn">push_back</span>(path);' },
    { line: 8,  code: '            <span class="tok-kw">return</span>;' },
    { line: 9,  code: '        }' },
    { line: 10, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> c : pad[digits[idx] - <span class="tok-num">\'0\'</span>]) {' },
    { line: 11, code: '            path.<span class="tok-fn">push_back</span>(c);' },
    { line: 12, code: '            <span class="tok-fn">dfs</span>(digits, idx + <span class="tok-num">1</span>, path, res);' },
    { line: 13, code: '            path.<span class="tok-fn">pop_back</span>();' },
    { line: 14, code: '        }' },
    { line: 15, code: '    }' },
    { line: 16, code: '<span class="tok-kw">public</span>:' },
    { line: 17, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; <span class="tok-fn">letterCombinations</span>(<span class="tok-type">string</span> digits) {' },
    { line: 18, code: '        <span class="tok-kw">if</span> (digits.<span class="tok-fn">empty</span>()) <span class="tok-kw">return</span> {};' },
    { line: 19, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; res; <span class="tok-type">string</span> path;' },
    { line: 20, code: '        <span class="tok-fn">dfs</span>(digits, <span class="tok-num">0</span>, path, res);' },
    { line: 21, code: '        <span class="tok-kw">return</span> res;' },
    { line: 22, code: '    }' },
    { line: 23, code: '};' }
  ],

  generateTrace(digitsInput) {
    const raw = String(digitsInput || "23").replace(/[^2-9]/g, "").slice(0, 3);
    const digits = raw;
    const padMap = {
      "2": "abc",
      "3": "def",
      "4": "ghi",
      "5": "jkl",
      "6": "mno",
      "7": "pqrs",
      "8": "tuv",
      "9": "wxyz"
    };

    const steps = [];
    const path = [];
    const res = [];
    const digitChars = digits.split("");

    const buildBoards = (opts = {}) => {
      const {
        idx = 0,
        activeDigit = null,
        activeChar = "-",
        justAddedCombo = null,
        connectors = []
      } = opts;

      const uniqueDigits = Array.from(new Set(digitChars.length ? digitChars : ["2", "3"]));
      const dictRows = uniqueDigits.map((d) => ({
        id: d,
        key: `'${d}'`,
        val: `"${padMap[d]}"`,
        note: d === activeDigit ? `← 展開 '${activeChar}'` : "按鍵映射",
        status: d === activeDigit ? "hit" : ""
      }));

      return {
        boards: [
          {
            id: "digits",
            type: "array",
            name: "digits",
            typeLabel: "輸入號碼 (string)",
            x: 325,
            y: 52,
            values: digitChars.map((c) => `'${c}'`),
            hl: idx >= 0 && idx < digitChars.length ? [idx] : [],
            done: Array.from({ length: Math.min(idx, digitChars.length) }, (_, k) => k),
            pointers:
              idx >= 0 && idx < digitChars.length
                ? [{ idx, label: `idx = ${idx}`, color: "blue" }]
                : []
          },
          {
            id: "vars",
            type: "vars",
            name: "dfs_state",
            typeLabel: "DFS 回溯狀態",
            x: 24,
            y: 205,
            items: [
              { id: "idx", name: "idx", val: String(idx), status: "hl" },
              { id: "char", name: "c", val: `'${activeChar}'`, status: activeChar !== "-" ? "hl" : "" },
              { id: "path", name: "path", val: `"${path.join("")}"`, status: justAddedCombo ? "match" : "hl" },
              { id: "count", name: "res.size()", val: String(res.length), status: justAddedCombo ? "match" : "" }
            ]
          },
          {
            id: "pad",
            type: "dict",
            name: "pad",
            typeLabel: "電話按鍵表 (vector<string>)",
            x: 325,
            y: 195,
            headers: ["按鍵", "對應字母", "狀態"],
            rows: dictRows
          },
          {
            id: "path",
            type: "stack",
            name: "path",
            typeLabel: "當前路徑堆疊 (string)",
            x: 615,
            y: 52,
            items: path.map((ch, i) => ({
              val: `'${ch}'`,
              status: i === path.length - 1 ? "hl" : ""
            }))
          },
          {
            id: "result",
            type: "set",
            name: "res",
            typeLabel: "已收集組合 (vector<string>)",
            x: 615,
            y: 215,
            items: res.map((str) => ({
              val: `"${str}"`,
              status: str === justAddedCombo ? "inserted" : ""
            }))
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 19,
      tag: "初始化回溯搜尋",
      tagType: "default",
      inlineBadge: `digits = "${digits}"`,
      explanation: `準備對電話號碼 "${digits}" 進行 DFS 回溯搜尋，依序展開每個數位對應的字母組合。`,
      vars: { idx: "0", c: "-", path: '""', "res.size()": "0" },
      state: buildBoards({ idx: 0 })
    });

    function dfs(idx) {
      if (idx === digitChars.length) {
        const combo = path.join("");
        res.push(combo);
        steps.push({
          line: 7,
          tag: `收錄組合 "${combo}"`,
          tagType: "tag-found",
          inlineBadge: `res.push_back("${combo}")`,
          explanation: `遞迴深度 idx = ${idx} 已達字串長度 ${digitChars.length}，將完整路徑 "${combo}" 加入結果陣列 res（目前共 ${res.length} 組）。`,
          vars: { idx: String(idx), c: "-", path: `"${combo}"`, "res.size()": String(res.length) },
          state: buildBoards({
            idx,
            justAddedCombo: combo,
            connectors: [
              {
                from: "wb-var-path",
                to: `wb-chip-result-${res.length - 1}`,
                label: `push "${combo}"`,
                color: "green"
              }
            ]
          })
        });
        return;
      }

      const d = digitChars[idx];
      const letters = padMap[d] || "";
      for (let i = 0; i < letters.length; i++) {
        const c = letters[i];
        path.push(c);

        if (steps.length < 42) {
          steps.push({
            line: 11,
            tag: `選取 '${c}' (鍵 ${d})`,
            tagType: "tag-insert",
            inlineBadge: `path.push_back('${c}') → "${path.join("")}"`,
            explanation: `在 idx = ${idx} 處，從按鍵 '${d}' 的字母 "${letters}" 中選取 '${c}' 推入 path，當前路徑為 "${path.join("")}"。`,
            vars: { idx: String(idx), c: `'${c}'`, path: `"${path.join("")}"`, "res.size()": String(res.length) },
            state: buildBoards({
              idx,
              activeDigit: d,
              activeChar: c,
              connectors: [
                {
                  from: `wb-dict-row-${d}`,
                  to: `wb-stack-path-${path.length - 1}`,
                  label: `選取 '${c}'`,
                  color: "purple"
                }
              ]
            })
          });
        }

        dfs(idx + 1);

        const popped = path.pop();
        if (steps.length < 42 && idx === 0) {
          steps.push({
            line: 13,
            tag: `回溯彈出 '${popped}'`,
            tagType: "tag-check",
            inlineBadge: `path.pop_back() → "${path.join("")}"`,
            explanation: `完成以 '${popped}' 開頭的分支後，執行 path.pop_back() 回溯，準備嘗試按鍵 '${d}' 的下一個字母。`,
            vars: { idx: String(idx), c: `'${popped}'`, path: `"${path.join("")}"`, "res.size()": String(res.length) },
            state: buildBoards({ idx, activeDigit: d, activeChar: popped })
          });
        }
      }
    }

    if (digitChars.length > 0) {
      dfs(0);
    }

    steps.push({
      line: 21,
      tag: "回傳所有字母組合",
      tagType: "tag-found",
      inlineBadge: `return res (共 ${res.length} 組)`,
      explanation: `DFS 回溯全部完成，共產生 ${res.length} 組電話字母組合。`,
      vars: { idx: String(digitChars.length), c: "-", path: '""', "res.size()": String(res.length) },
      state: buildBoards({ idx: digitChars.length })
    });

    return steps;
  }
};

// ============================================================================
// #61 (LC #79) Word Search (單詞搜尋)
// ============================================================================
window.PROBLEMS["word-search"] = {
  id: 61,
  leetcodeId: 79,
  slug: "word-search",
  title: "79. Word Search (單詞搜尋)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(M·N·3^L) · Space O(L)",
  argNames: ["board", "word"],
  description:
    "給定一個 m × n 二維字元網格 board 和一個目標字串 word。若 word 存在於網格中（由水平或垂直相鄰的格子依序連接，且同一格子不可重複使用），則回傳 true。使用二維網格 DFS 回溯並以 '#' 原地標記已走訪格子。",

  presets: [
    {
      name: '範例 1：標準命中 word = "ABCCED"',
      args: [
        [
          ["A", "B", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        "ABCCED"
      ]
    },
    {
      name: '範例 2：右下命中 word = "SEE"',
      args: [
        [
          ["A", "B", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        "SEE"
      ]
    },
    {
      name: '範例 3：不可重複用格 word = "ABCB" (回傳 false)',
      args: [
        [
          ["A", "B", "C", "E"],
          ["S", "F", "C", "S"],
          ["A", "D", "E", "E"]
        ],
        "ABCB"
      ]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-kw">bool</span> <span class="tok-fn">dfs</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&gt;&amp; b, <span class="tok-kw">const</span> <span class="tok-type">string</span>&amp; w, <span class="tok-kw">int</span> r, <span class="tok-kw">int</span> c, <span class="tok-kw">int</span> k) {' },
    { line: 3,  code: '        <span class="tok-kw">if</span> (k == (<span class="tok-kw">int</span>)w.<span class="tok-fn">size</span>()) <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (r &lt; <span class="tok-num">0</span> || r &gt;= b.<span class="tok-fn">size</span>() || c &lt; <span class="tok-num">0</span> || c &gt;= b[<span class="tok-num">0</span>].<span class="tok-fn">size</span>() || b[r][c] != w[k])' },
    { line: 5,  code: '            <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 6,  code: '        <span class="tok-kw">char</span> tmp = b[r][c];' },
    { line: 7,  code: '        b[r][c] = <span class="tok-num">\'#\'</span>; <span class="tok-cmt">// 原地標記已走訪</span>' },
    { line: 8,  code: '        <span class="tok-kw">bool</span> found = <span class="tok-fn">dfs</span>(b, w, r+<span class="tok-num">1</span>, c, k+<span class="tok-num">1</span>) || <span class="tok-fn">dfs</span>(b, w, r-<span class="tok-num">1</span>, c, k+<span class="tok-num">1</span>) ||' },
    { line: 9,  code: '                     <span class="tok-fn">dfs</span>(b, w, r, c+<span class="tok-num">1</span>, k+<span class="tok-num">1</span>) || <span class="tok-fn">dfs</span>(b, w, r, c-<span class="tok-num">1</span>, k+<span class="tok-num">1</span>);' },
    { line: 10, code: '        b[r][c] = tmp; <span class="tok-cmt">// 回溯還原字元</span>' },
    { line: 11, code: '        <span class="tok-kw">return</span> found;' },
    { line: 12, code: '    }' },
    { line: 13, code: '<span class="tok-kw">public</span>:' },
    { line: 14, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">exist</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&gt;&amp; board, <span class="tok-type">string</span> word) {' },
    { line: 15, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> r = <span class="tok-num">0</span>; r &lt; board.<span class="tok-fn">size</span>(); ++r)' },
    { line: 16, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> c = <span class="tok-num">0</span>; c &lt; board[<span class="tok-num">0</span>].<span class="tok-fn">size</span>(); ++c)' },
    { line: 17, code: '                <span class="tok-kw">if</span> (<span class="tok-fn">dfs</span>(board, word, r, c, <span class="tok-num">0</span>)) <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 18, code: '        <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 19, code: '    }' },
    { line: 20, code: '};' }
  ],

  generateTrace(boardInput, wordInput) {
    const origBoard =
      Array.isArray(boardInput) && boardInput.length
        ? boardInput.map((row) => row.map(String))
        : [
            ["A", "B", "C", "E"],
            ["S", "F", "C", "S"],
            ["A", "D", "E", "E"]
          ];
    const word = String(wordInput || "ABCCED");
    const wordChars = word.split("");
    const R = origBoard.length;
    const C = origBoard[0].length;
    const b = origBoard.map((row) => [...row]);

    const steps = [];
    const pathCoords = [];

    const buildBoards = (opts = {}) => {
      const {
        r = 0,
        c = 0,
        k = 0,
        hlCell = null,
        warnCell = null,
        foundAll = false,
        retVal = "-",
        connectors = []
      } = opts;

      const matchCells = pathCoords.map(([pr, pc]) => `${pr},${pc}`);
      const hlCells = hlCell ? [hlCell] : [];
      const warnCells = warnCell ? [warnCell] : [];

      return {
        boards: [
          {
            id: "board",
            type: "grid",
            name: "board",
            typeLabel: `字元網格 (${R}×${C})`,
            x: 325,
            y: 52,
            cells: b.map((row) => [...row]),
            hl: hlCells,
            match: matchCells,
            warn: warnCells
          },
          {
            id: "word",
            type: "array",
            name: "word",
            typeLabel: "目標單詞 (string)",
            x: 560,
            y: 52,
            values: wordChars.map((ch) => `'${ch}'`),
            hl: k < wordChars.length && !foundAll ? [k] : [],
            match: Array.from({ length: Math.min(k + (foundAll ? 1 : 0), wordChars.length) }, (_, idx) => idx),
            pointers:
              k < wordChars.length
                ? [{ idx: k, label: `k = ${k}`, color: foundAll ? "green" : "blue" }]
                : []
          },
          {
            id: "vars",
            type: "vars",
            name: "dfs_vars",
            typeLabel: "搜尋座標與深度",
            x: 24,
            y: 205,
            items: [
              { id: "rc", name: "(r, c)", val: `(${r}, ${c})`, status: "hl" },
              { id: "k", name: "k", val: `${k} / ${word.length}`, status: foundAll ? "match" : "hl" },
              { id: "target", name: "word[k]", val: k < word.length ? `'${word[k]}'` : "完成", status: foundAll ? "match" : "" },
              { id: "ret", name: "return", val: retVal, status: foundAll ? "match" : retVal === "false" ? "warn" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 14,
      tag: "開始網格單詞搜尋",
      tagType: "default",
      inlineBadge: `word = "${word}"`,
      explanation: `在 ${R}×${C} 網格中尋找單詞 "${word}"，依序嘗試從符合首字元 '${word[0]}' 的格子啟動四方向 DFS。`,
      vars: { "(r, c)": "(0, 0)", k: "0", "word[k]": `'${word[0]}'`, return: "-" },
      state: buildBoards({ r: 0, c: 0, k: 0 })
    });

    let foundResult = false;

    function dfs(r, c, k) {
      if (k === word.length) return true;
      if (r < 0 || r >= R || c < 0 || c >= C || b[r][c] !== word[k]) {
        if (k > 0 && r >= 0 && r < R && c >= 0 && c < C && steps.length < 36) {
          steps.push({
            line: 4,
            tag: `(${r},${c}) 不符 '${word[k]}'`,
            tagType: "tag-check",
            inlineBadge: `board[${r}][${c}]='${b[r][c]}' != '${word[k]}'`,
            explanation: `嘗試延伸至鄰格 (${r}, ${c})，但其字元 '${b[r][c]}' 與目標 word[${k}] = '${word[k]}' 不符，此方向回傳 false。`,
            vars: { "(r, c)": `(${r}, ${c})`, k: String(k), "word[k]": `'${word[k]}'`, return: "false" },
            state: buildBoards({ r, c, k, warnCell: `${r},${c}` })
          });
        }
        return false;
      }

      const tmp = b[r][c];
      b[r][c] = `${tmp}✓`;
      pathCoords.push([r, c]);

      if (steps.length < 38) {
        steps.push({
          line: 7,
          tag: `命中 word[${k}]='${tmp}' @ (${r},${c})`,
          tagType: k === word.length - 1 ? "tag-found" : "tag-insert",
          inlineBadge: `board[${r}][${c}] == '${tmp}' (k=${k})`,
          explanation: `格子 (${r}, ${c}) 字元為 '${tmp}'，成功匹配 word[${k}]！將其標記為已走訪，繼續向四個方向尋找下一個字元 (k = ${k + 1})。`,
          vars: { "(r, c)": `(${r}, ${c})`, k: String(k), "word[k]": `'${tmp}'`, return: "-" },
          state: buildBoards({
            r,
            c,
            k,
            hlCell: `${r},${c}`,
            connectors: [
              {
                from: `wb-grid-board-${r}-${c}`,
                to: `wb-cw-word-${k}`,
                label: `匹配 '${tmp}'`,
                color: "green"
              }
            ]
          })
        });
      }

      if (k + 1 === word.length) {
        return true;
      }

      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ];
      for (const [dr, dc] of dirs) {
        if (dfs(r + dr, c + dc, k + 1)) {
          return true;
        }
      }

      b[r][c] = tmp;
      pathCoords.pop();

      if (steps.length < 38) {
        steps.push({
          line: 10,
          tag: `回溯還原 (${r},${c})='${tmp}'`,
          tagType: "tag-check",
          inlineBadge: `board[${r}][${c}] = '${tmp}'`,
          explanation: `從 (${r}, ${c}) 出發的四個方向皆無法完成剩餘匹配，回溯還原 board[${r}][${c}] = '${tmp}'。`,
          vars: { "(r, c)": `(${r}, ${c})`, k: String(k), "word[k]": `'${tmp}'`, return: "false" },
          state: buildBoards({ r, c, k, hlCell: `${r},${c}` })
        });
      }
      return false;
    }

    outer: for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (b[r][c] === word[0]) {
          if (dfs(r, c, 0)) {
            foundResult = true;
            break outer;
          }
        }
      }
    }

    steps.push({
      line: foundResult ? 17 : 18,
      tag: foundResult ? `成功找到 "${word}"` : `未找到 "${word}"`,
      tagType: foundResult ? "tag-found" : "tag-check",
      inlineBadge: `return ${foundResult}`,
      explanation: foundResult
        ? `已在網格中完整匹配單詞 "${word}" 的相鄰路徑，回傳 true！`
        : `已嘗試網格所有可能起點與路徑，無法構成 "${word}"，回傳 false。`,
      vars: {
        "(r, c)": pathCoords.length ? `(${pathCoords[pathCoords.length - 1][0]}, ${pathCoords[pathCoords.length - 1][1]})` : "-",
        k: foundResult ? String(word.length) : "0",
        "word[k]": foundResult ? "完成" : "-",
        return: String(foundResult)
      },
      state: buildBoards({
        r: pathCoords.length ? pathCoords[pathCoords.length - 1][0] : 0,
        c: pathCoords.length ? pathCoords[pathCoords.length - 1][1] : 0,
        k: foundResult ? word.length - 1 : 0,
        foundAll: foundResult,
        retVal: String(foundResult)
      })
    });

    return steps;
  }
};

// ============================================================================
// #62 (LC #438) Find All Anagrams in a String (找到字串中所有字母異位詞)
// ============================================================================
window.PROBLEMS["find-all-anagrams-in-a-string"] = {
  id: 62,
  leetcodeId: 438,
  slug: "find-all-anagrams-in-a-string",
  title: "438. Find All Anagrams in a String (找到字串中所有字母異位詞)",
  difficulty: "Medium",
  topic: "String",
  mins: 30,
  complexity: "Time O(|S|) · Space O(1)",
  argNames: ["s", "p"],
  description:
    "給定兩個字串 s 與 p，找出 s 中所有 p 的字母異位詞 (Anagram) 子字串，並回傳這些子字串的起始索引。使用長度固定為 |p| 的滑動視窗 [left..right] 維護字元頻率表 sCount，當 sCount == pCount 時將 left 加入答案。",

  presets: [
    {
      name: '範例 1：標準情況 s = "cbaebabacd", p = "abc"',
      args: ["cbaebabacd", "abc"]
    },
    {
      name: '範例 2：連續重疊異位詞 s = "abab", p = "ab"',
      args: ["abab", "ab"]
    },
    {
      name: '範例 3：包含重複字元 s = "baa", p = "aa"',
      args: ["baa", "aa"]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; <span class="tok-fn">findAnagrams</span>(<span class="tok-type">string</span> s, <span class="tok-type">string</span> p) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (s.<span class="tok-fn">size</span>() &lt; p.<span class="tok-fn">size</span>()) <span class="tok-kw">return</span> {};' },
    { line: 5,  code: '        <span class="tok-type">array</span>&lt;<span class="tok-kw">int</span>, <span class="tok-num">26</span>&gt; pCount{}, sCount{};' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> c : p) pCount[c - <span class="tok-num">\'a\'</span>]++;' },
    { line: 7,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; res;' },
    { line: 8,  code: '        <span class="tok-kw">int</span> k = p.<span class="tok-fn">size</span>();' },
    { line: 9,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> right = <span class="tok-num">0</span>; right &lt; (<span class="tok-kw">int</span>)s.<span class="tok-fn">size</span>(); ++right) {' },
    { line: 10, code: '            sCount[s[right] - <span class="tok-num">\'a\'</span>]++;' },
    { line: 11, code: '            <span class="tok-kw">if</span> (right &gt;= k) sCount[s[right - k] - <span class="tok-num">\'a\'</span>]--;' },
    { line: 12, code: '            <span class="tok-kw">if</span> (right &gt;= k - <span class="tok-num">1</span> &amp;&amp; sCount == pCount)' },
    { line: 13, code: '                res.<span class="tok-fn">push_back</span>(right - k + <span class="tok-num">1</span>);' },
    { line: 14, code: '        }' },
    { line: 15, code: '        <span class="tok-kw">return</span> res;' },
    { line: 16, code: '    }' },
    { line: 17, code: '};' }
  ],

  generateTrace(sInput, pInput) {
    const s = String(sInput || "cbaebabacd");
    const p = String(pInput || "abc");
    const sChars = s.split("");
    const k = p.length;
    const steps = [];

    const pCount = {};
    const sCount = {};
    const allKeys = Array.from(new Set((p + s).split(""))).sort();
    allKeys.forEach((ch) => {
      pCount[ch] = 0;
      sCount[ch] = 0;
    });
    for (const ch of p) pCount[ch] = (pCount[ch] || 0) + 1;

    const res = [];

    const isMatch = () => allKeys.every((ch) => (sCount[ch] || 0) === (pCount[ch] || 0));

    const buildBoards = (opts = {}) => {
      const {
        left = 0,
        right = -1,
        matchedWin = false,
        changedChar = null,
        connectors = []
      } = opts;

      const winIndices = [];
      for (let i = Math.max(0, left); i <= right && i < sChars.length; i++) {
        winIndices.push(i);
      }

      const pointers = [];
      if (right >= 0 && left <= right && left < sChars.length) {
        pointers.push({ idx: left, label: `L=${left}`, color: matchedWin ? "green" : "blue" });
      }
      if (right >= 0 && right < sChars.length) {
        pointers.push({ idx: right, label: `R=${right}`, color: matchedWin ? "green" : "red" });
      }

      const dictRows = allKeys
        .filter((ch) => pCount[ch] > 0 || sCount[ch] > 0)
        .map((ch) => {
          const sc = sCount[ch] || 0;
          const pc = pCount[ch] || 0;
          const eq = sc === pc && pc > 0;
          return {
            id: ch,
            key: `'${ch}'`,
            val: `${sc} / 目標 ${pc}`,
            note: eq ? "✓ 數量吻合" : sc > pc ? "超出目標" : "不足",
            status: eq ? "hit" : ch === changedChar ? "inserted" : ""
          };
        });

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `滑動視窗 k=${k} (string)`,
            x: 325,
            y: 52,
            values: sChars.map((c) => `'${c}'`),
            hl: matchedWin ? [] : winIndices,
            match: matchedWin ? winIndices : [],
            done: Array.from({ length: Math.max(0, left) }, (_, idx) => idx),
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "win_vars",
            typeLabel: "視窗邊界與目標 p",
            x: 24,
            y: 205,
            items: [
              { id: "p", name: "p", val: `"${p}"`, status: "" },
              { id: "win", name: "window", val: right >= 0 ? `"${s.slice(Math.max(0, left), right + 1)}"` : '""', status: matchedWin ? "match" : "hl" },
              { id: "eq", name: "sCount==pCount", val: right >= 0 ? String(matchedWin) : "-", status: matchedWin ? "match" : "" }
            ]
          },
          {
            id: "freq",
            type: "dict",
            name: "sCount vs pCount",
            typeLabel: "視窗字元頻率對照",
            x: 325,
            y: 195,
            headers: ["字元", "視窗 / pCount", "比對狀態"],
            rows: dictRows
          },
          {
            id: "result",
            type: "array",
            name: "res",
            typeLabel: "異位詞起始索引 (vector<int>)",
            x: 635,
            y: 195,
            values: [...res],
            match: res.map((_, i) => i)
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 6,
      tag: `統計目標 p="${p}" 頻率`,
      tagType: "default",
      inlineBadge: `k = ${k}`,
      explanation: `統計目標字串 p = "${p}" 的字元頻率 pCount，準備以長度 k = ${k} 的固定滑動視窗掃描字串 s。`,
      vars: { left: "0", right: "-", window: '""', "res.size()": "0" },
      state: buildBoards({ left: 0, right: -1 })
    });

    for (let right = 0; right < sChars.length; right++) {
      const inChar = sChars[right];
      sCount[inChar] = (sCount[inChar] || 0) + 1;
      const left = Math.max(0, right - k + 1);

      if (right >= k) {
        const outChar = sChars[right - k];
        sCount[outChar]--;
      }

      const matched = right >= k - 1 && isMatch();
      if (matched) {
        res.push(left);
      }

      steps.push({
        line: matched ? 13 : 12,
        tag: matched ? `命中異位詞 @ L=${left}` : `滑動視窗 [${left}..${right}]`,
        tagType: matched ? "tag-found" : "tag-check",
        inlineBadge: matched
          ? `s.substr(${left}, ${k}) = "${s.slice(left, right + 1)}" → push ${left}`
          : `window = "${s.slice(left, right + 1)}"`,
        explanation:
          right < k - 1
            ? `右端納入 s[${right}] = '${inChar}'，目前視窗長度 ${right + 1} 尚未達 ${k}。`
            : matched
            ? `視窗 [${left}..${right}] 子字串 "${s.slice(left, right + 1)}" 的字元頻率 sCount 與 pCount 完全相同！將起始索引 ${left} 加入 res。`
            : `視窗 [${left}..${right}] 子字串為 "${s.slice(left, right + 1)}"（納入 '${inChar}'${
                right >= k ? `、移出 s[${right - k}]='${sChars[right - k]}'` : ""
              }），頻率與 pCount 不相等。`,
        vars: {
          left: String(left),
          right: String(right),
          window: `"${s.slice(left, right + 1)}"`,
          "res.size()": String(res.length)
        },
        state: buildBoards({
          left,
          right,
          matchedWin: matched,
          changedChar: inChar,
          connectors: matched
            ? [
                {
                  from: `wb-cw-s-${left}`,
                  to: `wb-cw-result-${res.length - 1}`,
                  label: `加入起始索引 ${left}`,
                  color: "green"
                }
              ]
            : [
                {
                  from: `wb-cw-s-${right}`,
                  to: `wb-dict-row-${inChar}`,
                  label: `sCount['${inChar}']++`,
                  color: "blue"
                }
              ]
        })
      });
    }

    steps.push({
      line: 15,
      tag: "回傳所有異位詞索引",
      tagType: "tag-found",
      inlineBadge: `return [${res.join(", ")}]`,
      explanation: `滑動視窗掃描完畢，共找到 ${res.length} 個異位詞起始索引：[${res.join(", ")}]。`,
      vars: { left: String(Math.max(0, sChars.length - k)), right: String(sChars.length - 1), window: "完成", "res.size()": String(res.length) },
      state: buildBoards({ left: Math.max(0, sChars.length - k), right: sChars.length - 1, matchedWin: false })
    });

    return steps;
  }
};

// ============================================================================
// #63 (LC #310) Minimum Height Trees (最小高度樹)
// ============================================================================
window.PROBLEMS["minimum-height-trees"] = {
  id: 63,
  leetcodeId: 310,
  slug: "minimum-height-trees",
  title: "310. Minimum Height Trees (最小高度樹)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(V) · Space O(V)",
  argNames: ["n", "edges"],
  description:
    "給定一棵包含 n 個節點（編號 0 到 n-1）的無向樹與邊集 edges。請找出所有能使樹高度最小的根節點（中心節點 Centroids，最多不超過 2 個）。使用拓撲排序剝洋蔥法：每一輪將所有度數 degree == 1 的葉節點同時剝除，直到剩餘節點數 <= 2。",

  presets: [
    {
      name: "範例 1：星狀樹 n = 4, edges = [[1,0],[1,2],[1,3]] (中心 [1])",
      args: [
        4,
        [
          [1, 0],
          [1, 2],
          [1, 3]
        ]
      ]
    },
    {
      name: "範例 2：雙中心樹 n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]] (中心 [3,4])",
      args: [
        6,
        [
          [3, 0],
          [3, 1],
          [3, 2],
          [3, 4],
          [5, 4]
        ]
      ]
    },
    {
      name: "範例 3：線性鏈樹 n = 5, edges = [[0,1],[1,2],[2,3],[3,4]] (中心 [2])",
      args: [
        5,
        [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; <span class="tok-fn">findMinHeightTrees</span>(<span class="tok-kw">int</span> n, <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; edges) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (n == <span class="tok-num">1</span>) <span class="tok-kw">return</span> {<span class="tok-num">0</span>};' },
    { line: 5,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; adj(n);' },
    { line: 6,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; degree(n, <span class="tok-num">0</span>);' },
    { line: 7,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; e : edges) {' },
    { line: 8,  code: '            adj[e[<span class="tok-num">0</span>]].<span class="tok-fn">push_back</span>(e[<span class="tok-num">1</span>]); adj[e[<span class="tok-num">1</span>]].<span class="tok-fn">push_back</span>(e[<span class="tok-num">0</span>]);' },
    { line: 9,  code: '            degree[e[<span class="tok-num">0</span>]]++; degree[e[<span class="tok-num">1</span>]]++;' },
    { line: 10, code: '        }' },
    { line: 11, code: '        <span class="tok-type">queue</span>&lt;<span class="tok-kw">int</span>&gt; leaves;' },
    { line: 12, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; n; ++i)' },
    { line: 13, code: '            <span class="tok-kw">if</span> (degree[i] == <span class="tok-num">1</span>) leaves.<span class="tok-fn">push</span>(i);' },
    { line: 14, code: '        <span class="tok-kw">int</span> rem = n;' },
    { line: 15, code: '        <span class="tok-kw">while</span> (rem &gt; <span class="tok-num">2</span>) {' },
    { line: 16, code: '            <span class="tok-kw">int</span> sz = leaves.<span class="tok-fn">size</span>(); rem -= sz;' },
    { line: 17, code: '            <span class="tok-kw">while</span> (sz--) {' },
    { line: 18, code: '                <span class="tok-kw">int</span> u = leaves.<span class="tok-fn">front</span>(); leaves.<span class="tok-fn">pop</span>();' },
    { line: 19, code: '                <span class="tok-kw">for</span> (<span class="tok-kw">int</span> v : adj[u])' },
    { line: 20, code: '                    <span class="tok-kw">if</span> (--degree[v] == <span class="tok-num">1</span>) leaves.<span class="tok-fn">push</span>(v);' },
    { line: 21, code: '            }' },
    { line: 22, code: '        }' },
    { line: 23, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; res;' },
    { line: 24, code: '        <span class="tok-kw">while</span> (!leaves.<span class="tok-fn">empty</span>()) { res.<span class="tok-fn">push_back</span>(leaves.<span class="tok-fn">front</span>()); leaves.<span class="tok-fn">pop</span>(); }' },
    { line: 25, code: '        <span class="tok-kw">return</span> res;' },
    { line: 26, code: '    }' },
    { line: 27, code: '};' }
  ],

  generateTrace(nInput, edgesInput) {
    const n = Math.max(1, Number(nInput) || 4);
    const edges =
      Array.isArray(edgesInput) && edgesInput.length
        ? edgesInput
        : [
            [1, 0],
            [1, 2],
            [1, 3]
          ];

    const adj = Array.from({ length: n }, () => []);
    const degree = Array(n).fill(0);
    edges.forEach(([u, v]) => {
      if (u < n && v < n) {
        adj[u].push(v);
        adj[v].push(u);
        degree[u]++;
        degree[v]++;
      }
    });

    const removed = new Set();
    let leaves = [];
    const steps = [];

    const buildGraphNodes = (hlSet = new Set(), matchSet = new Set()) => {
      const cx = 210;
      const cy = 105;
      const radius = 74;
      return Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const x = n === 1 ? cx : Math.round(cx + radius * Math.cos(angle));
        const y = n === 1 ? cy : Math.round(cy + radius * Math.sin(angle));
        let status = "";
        if (matchSet.has(i)) status = "match";
        else if (hlSet.has(i)) status = "hl";
        else if (removed.has(i)) status = "done";
        return {
          id: String(i),
          val: String(i),
          sub: removed.has(i) ? "已剝除" : `deg=${degree[i]}`,
          x,
          y,
          status,
          ptr: matchSet.has(i) ? "root" : hlSet.has(i) ? "leaf" : ""
        };
      });
    };

    const buildBoards = (opts = {}) => {
      const {
        rem = n - removed.size,
        round = 0,
        hlNodes = [],
        matchNodes = [],
        connectors = []
      } = opts;

      const hlSet = new Set(hlNodes);
      const matchSet = new Set(matchNodes);

      return {
        boards: [
          {
            id: "tree",
            type: "graph",
            shape: "graph",
            name: "tree_graph",
            typeLabel: `無向樹拓撲剝葉 (n=${n})`,
            x: 325,
            y: 52,
            width: 420,
            height: 210,
            nodes: buildGraphNodes(hlSet, matchSet),
            edges: edges.map(([u, v]) => ({
              from: String(u),
              to: String(v),
              dir: false,
              status:
                matchSet.has(u) && matchSet.has(v)
                  ? "match"
                  : hlSet.has(u) || hlSet.has(v)
                  ? "hl"
                  : ""
            }))
          },
          {
            id: "degree",
            type: "array",
            name: "degree",
            typeLabel: "各節點度數 (vector<int>)",
            x: 325,
            y: 285,
            values: [...degree],
            hl: hlNodes,
            match: matchNodes,
            done: Array.from(removed)
          },
          {
            id: "leaves",
            type: "queue",
            name: "leaves",
            typeLabel: "當前葉節點佇列 (queue<int>)",
            x: 610,
            y: 285,
            leftLabel: "front ←",
            rightLabel: "← back",
            items: leaves.map((u) => ({
              val: u,
              status: matchSet.has(u) ? "match" : "hl"
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "mht_vars",
            typeLabel: "剩餘節點與輪次",
            x: 24,
            y: 205,
            items: [
              { id: "rem", name: "rem", val: String(rem), status: rem <= 2 ? "match" : "hl" },
              { id: "round", name: "round", val: String(round), status: "" },
              { id: "qsize", name: "leaves.size()", val: String(leaves.length), status: "hl" }
            ]
          }
        ],
        connectors
      };
    };

    for (let i = 0; i < n; i++) {
      if (degree[i] <= 1) leaves.push(i);
    }

    steps.push({
      line: 13,
      tag: "找出初始葉節點 (deg=1)",
      tagType: "tag-insert",
      inlineBadge: `leaves = [${leaves.join(", ")}]`,
      explanation: `建立鄰接表與度數陣列 degree 後，將所有度數為 1 的外圍葉節點 [${leaves.join(", ")}] 推入佇列 leaves。`,
      vars: { rem: String(n), round: "0", "leaves.size()": String(leaves.length), centroids: "-" },
      state: buildBoards({
        rem: n,
        round: 0,
        hlNodes: [...leaves],
        connectors:
          leaves.length > 0
            ? [
                {
                  from: `wb-node-tree-${leaves[0]}`,
                  to: "wb-queue-leaves-0",
                  label: "deg==1 入列",
                  color: "blue"
                }
              ]
            : []
      })
    });

    let rem = n;
    let round = 0;
    while (rem > 2) {
      round++;
      const currentBatch = [...leaves];
      const nextLeaves = [];
      rem -= currentBatch.length;

      for (const u of currentBatch) {
        removed.add(u);
        degree[u] = 0;
        for (const v of adj[u]) {
          if (!removed.has(v)) {
            degree[v]--;
            if (degree[v] === 1) {
              nextLeaves.push(v);
            }
          }
        }
      }
      leaves = nextLeaves;

      steps.push({
        line: 20,
        tag: `第 ${round} 輪剝葉 [${currentBatch.join(",")}]`,
        tagType: "tag-check",
        inlineBadge: `rem = ${rem}, 新葉節點 = [${leaves.join(", ")}]`,
        explanation: `剝除外圍葉節點 [${currentBatch.join(", ")}]，並將其相鄰節點的度數減 1。新產生度數為 1 的內層節點 [${leaves.join(", ")}] 入列，剩餘節點數 rem = ${rem}。`,
        vars: { rem: String(rem), round: String(round), "leaves.size()": String(leaves.length), centroids: "-" },
        state: buildBoards({
          rem,
          round,
          hlNodes: [...leaves],
          connectors:
            leaves.length > 0
              ? [
                  {
                    from: `wb-cw-degree-${leaves[0]}`,
                    to: "wb-queue-leaves-0",
                    label: `--degree[${leaves[0]}]==1`,
                    color: "purple"
                  }
                ]
              : []
        })
      });
    }

    steps.push({
      line: 25,
      tag: `回傳最小高度樹根 [${leaves.join(", ")}]`,
      tagType: "tag-found",
      inlineBadge: `return {${leaves.join(", ")}}`,
      explanation: `剩餘節點數 rem = ${rem} <= 2，停止剝葉！佇列中剩下的中心節點 [${leaves.join(", ")}] 即為能使樹高最小的根節點 (Centroids)。`,
      vars: {
        rem: String(rem),
        round: String(round),
        "leaves.size()": String(leaves.length),
        centroids: `[${leaves.join(", ")}]`
      },
      state: buildBoards({
        rem,
        round,
        matchNodes: [...leaves],
        connectors:
          leaves.length > 0
            ? [
                {
                  from: `wb-node-tree-${leaves[0]}`,
                  to: "wb-var-rem",
                  label: `中心節點 {${leaves.join(", ")}}`,
                  color: "green"
                }
              ]
            : []
      })
    });

    return steps;
  }
};

// ============================================================================
// #64 (LC #621) Task Scheduler (任務調度器)
// ============================================================================
window.PROBLEMS["task-scheduler"] = {
  id: 64,
  leetcodeId: 621,
  slug: "task-scheduler",
  title: "621. Task Scheduler (任務調度器)",
  difficulty: "Medium",
  topic: "Heap",
  mins: 35,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["tasks", "n"],
  description:
    "給定 CPU 任務字元陣列 tasks 與同類任務的冷卻時間 n（兩個相同任務之間至少需間隔 n 個時間單位）。計算完成所有任務所需的最短時間單位數。利用最大頻率 maxFreq 與擁有最大頻率的任務種類數 maxCount，最短時間為 max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount)。",

  presets: [
    {
      name: '範例 1：需要待命週期 tasks = ["A","A","A","B","B","B"], n = 2',
      args: [["A", "A", "A", "B", "B", "B"], 2]
    },
    {
      name: '範例 2：冷卻為 1 無須待命 tasks = ["A","C","A","B","D","B"], n = 1',
      args: [["A", "C", "A", "B", "D", "B"], 1]
    },
    {
      name: '範例 3：長冷卻週期 tasks = ["A","A","A","B","B","B"], n = 3',
      args: [["A", "A", "A", "B", "B", "B"], 3]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">leastInterval</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">char</span>&gt;&amp; tasks, <span class="tok-kw">int</span> n) {' },
    { line: 4,  code: '        <span class="tok-type">array</span>&lt;<span class="tok-kw">int</span>, <span class="tok-num">26</span>&gt; freq{};' },
    { line: 5,  code: '        <span class="tok-kw">int</span> maxFreq = <span class="tok-num">0</span>;' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">char</span> t : tasks) {' },
    { line: 7,  code: '            maxFreq = <span class="tok-fn">max</span>(maxFreq, ++freq[t - <span class="tok-num">\'A\'</span>]);' },
    { line: 8,  code: '        }' },
    { line: 9,  code: '        <span class="tok-kw">int</span> maxCount = <span class="tok-num">0</span>;' },
    { line: 10, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> f : freq) <span class="tok-kw">if</span> (f == maxFreq) ++maxCount;' },
    { line: 11, code: '        <span class="tok-kw">int</span> slots = (maxFreq - <span class="tok-num">1</span>) * (n + <span class="tok-num">1</span>) + maxCount;' },
    { line: 12, code: '        <span class="tok-kw">return</span> <span class="tok-fn">max</span>((<span class="tok-kw">int</span>)tasks.<span class="tok-fn">size</span>(), slots);' },
    { line: 13, code: '    }' },
    { line: 14, code: '};' }
  ],

  generateTrace(tasksInput, nInput) {
    const tasks =
      Array.isArray(tasksInput) && tasksInput.length
        ? tasksInput.map(String)
        : ["A", "A", "A", "B", "B", "B"];
    const n = Math.max(0, Number(nInput) ?? 2);
    const steps = [];

    const freq = {};
    tasks.forEach((t) => {
      freq[t] = (freq[t] || 0) + 1;
    });

    const sortedKeys = Object.keys(freq).sort((a, b) => freq[b] - freq[a] || a.localeCompare(b));
    const maxFreq = Math.max(...Object.values(freq));
    const maxCount = sortedKeys.filter((k) => freq[k] === maxFreq).length;
    const slots = (maxFreq - 1) * (n + 1) + maxCount;
    const ans = Math.max(tasks.length, slots);

    // Simulate actual execution timeline using greedy max-heap + cooldown per cycle (n + 1)
    const remFreq = { ...freq };
    const timeline = [];
    let remainingTasks = tasks.length;

    const buildBoards = (opts = {}) => {
      const {
        hlTasks = [],
        showMaxCount = false,
        slotsVal = "-",
        ansVal = "-",
        connectors = []
      } = opts;

      const dictRows = sortedKeys.map((k) => ({
        id: k,
        key: `'${k}'`,
        val: `${remFreq[k]} / 總計 ${freq[k]}`,
        note: freq[k] === maxFreq ? "★ 最高頻任務 (maxFreq)" : "一般任務",
        status: showMaxCount && freq[k] === maxFreq ? "hit" : "inserted"
      }));

      return {
        boards: [
          {
            id: "tasks",
            type: "array",
            name: "tasks",
            typeLabel: `任務列表 (共 ${tasks.length} 個, n=${n})`,
            x: 325,
            y: 52,
            values: tasks.map((t) => `'${t}'`),
            hl: hlTasks
          },
          {
            id: "vars",
            type: "vars",
            name: "sched_vars",
            typeLabel: "頻率與冷卻時間桶公式",
            x: 24,
            y: 205,
            items: [
              { id: "n", name: "n (冷卻)", val: String(n), status: "" },
              { id: "maxFreq", name: "maxFreq", val: String(maxFreq), status: "hl" },
              { id: "maxCount", name: "maxCount", val: showMaxCount ? String(maxCount) : "-", status: showMaxCount ? "hl" : "" },
              { id: "slots", name: "slots", val: String(slotsVal), status: slotsVal !== "-" ? "hl" : "" },
              { id: "ans", name: "return", val: String(ansVal), status: ansVal !== "-" ? "match" : "" }
            ]
          },
          {
            id: "freq",
            type: "dict",
            name: "freq",
            typeLabel: "任務剩餘 / 總頻率表",
            x: 325,
            y: 185,
            headers: ["任務", "剩餘 / 總數", "角色"],
            rows: dictRows
          },
          {
            id: "timeline",
            type: "queue",
            name: "cpu_timeline",
            typeLabel: `CPU 排程時間軸 (${timeline.length} 單位)`,
            x: 325,
            y: 335,
            leftLabel: "t=1 →",
            rightLabel: `→ t=${timeline.length}`,
            items: timeline.map((item, idx) => ({
              val: item,
              status: item === "idle" ? "warn" : idx === timeline.length - 1 ? "match" : "hl"
            }))
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 7,
      tag: "統計任務頻率與 maxFreq",
      tagType: "tag-insert",
      inlineBadge: `maxFreq = ${maxFreq}`,
      explanation: `掃描 tasks 陣列統計各任務出現次數，最高頻率 maxFreq = ${maxFreq}。`,
      vars: { n: String(n), maxFreq: String(maxFreq), maxCount: "-", slots: "-", return: "-" },
      state: buildBoards({
        hlTasks: tasks.map((_, i) => i),
        connectors: [
          {
            from: `wb-dict-row-${sortedKeys[0]}`,
            to: "wb-var-maxFreq",
            label: `最高頻 ${maxFreq} 次`,
            color: "blue"
          }
        ]
      })
    });

    steps.push({
      line: 10,
      tag: "計算最高頻任務種類數 maxCount",
      tagType: "tag-check",
      inlineBadge: `maxCount = ${maxCount}`,
      explanation: `共有 ${maxCount} 種任務並列最高頻率 (${maxFreq} 次)：${sortedKeys
        .filter((k) => freq[k] === maxFreq)
        .map((k) => `'${k}'`)
        .join(", ")}。`,
      vars: { n: String(n), maxFreq: String(maxFreq), maxCount: String(maxCount), slots: "-", return: "-" },
      state: buildBoards({ showMaxCount: true })
    });

    // Simulate round by round of length (n + 1)
    let cycle = 0;
    while (remainingTasks > 0) {
      cycle++;
      const avail = Object.keys(remFreq)
        .filter((k) => remFreq[k] > 0)
        .sort((a, b) => remFreq[b] - remFreq[a] || a.localeCompare(b));

      const cyclePicked = [];
      for (let slot = 0; slot <= n; slot++) {
        if (remainingTasks === 0) break;
        if (slot < avail.length) {
          const t = avail[slot];
          remFreq[t]--;
          remainingTasks--;
          timeline.push(t);
          cyclePicked.push(t);
        } else {
          timeline.push("idle");
          cyclePicked.push("idle");
        }
      }

      steps.push({
        line: 11,
        tag: `排程週期 #${cycle} (長度 n+1=${n + 1})`,
        tagType: cyclePicked.includes("idle") ? "tag-check" : "tag-insert",
        inlineBadge: `執行 [${cyclePicked.join(" → ")}]`,
        explanation: `第 ${cycle} 個冷卻週期（每週期需 ${n + 1} 單位時間）：優先挑選剩餘次數最多的任務執行 [${cyclePicked.join(" → ")}]，目前累計耗時 ${timeline.length} 單位。`,
        vars: {
          n: String(n),
          maxFreq: String(maxFreq),
          maxCount: String(maxCount),
          slots: `(${maxFreq}-1)*(${n}+1)+${maxCount} = ${slots}`,
          return: "-"
        },
        state: buildBoards({
          showMaxCount: true,
          slotsVal: `${slots}`
        })
      });
    }

    steps.push({
      line: 12,
      tag: `回傳最短總時間 ${ans}`,
      tagType: "tag-found",
      inlineBadge: `max(${tasks.length}, ${slots}) = ${ans}`,
      explanation: `由公式計算框架槽位數 slots = (maxFreq - 1) × (n + 1) + maxCount = (${maxFreq} - 1) × ${n + 1} + ${maxCount} = ${slots}，與總任務數 ${tasks.length} 取最大值，回傳最短時間 ${ans}。`,
      vars: {
        n: String(n),
        maxFreq: String(maxFreq),
        maxCount: String(maxCount),
        slots: String(slots),
        return: String(ans)
      },
      state: buildBoards({
        showMaxCount: true,
        slotsVal: String(slots),
        ansVal: String(ans),
        connectors: [
          {
            from: `wb-queue-timeline-${timeline.length - 1}`,
            to: "wb-var-ans",
            label: `總時間 = ${ans}`,
            color: "green"
          }
        ]
      })
    });

    return steps;
  }
};

// ============================================================================
// #65 (LC #146) LRU Cache (LRU 快取)
// ============================================================================
window.PROBLEMS["lru-cache"] = {
  id: 65,
  leetcodeId: 146,
  slug: "lru-cache",
  title: "146. LRU Cache (LRU 快取)",
  difficulty: "Medium",
  topic: "Linked List",
  mins: 30,
  complexity: "Time O(1) get/put · Space O(capacity)",
  argNames: ["capacity", "ops"],
  description:
    "設計並實作滿足 LRU (Least Recently Used 最近最少使用) 淘汰策略的快取資料結構，支援 O(1) 的 get(key) 與 put(key, value)。C++ 結合雙向鏈結串列 std::list<pair<int,int>>（維護 MRU 到 LRU 順序）與雜湊表 unordered_map<int, list::iterator>（支援 O(1) 定位並呼叫 splice 移至串列頭）。",

  presets: [
    {
      name: "範例 1：LeetCode 官方範例 capacity = 2",
      args: [
        2,
        [
          ["put", 1, 1],
          ["put", 2, 2],
          ["get", 1],
          ["put", 3, 3],
          ["get", 2],
          ["put", 4, 4],
          ["get", 1],
          ["get", 3],
          ["get", 4]
        ]
      ]
    },
    {
      name: "範例 2：更新既有鍵值避免被淘汰 capacity = 2",
      args: [
        2,
        [
          ["put", 1, 10],
          ["put", 2, 20],
          ["put", 1, 99],
          ["put", 3, 30],
          ["get", 1],
          ["get", 2]
        ]
      ]
    },
    {
      name: "範例 3：容量為 3 的快取存取 capacity = 3",
      args: [
        3,
        [
          ["put", 1, 1],
          ["put", 2, 2],
          ["put", 3, 3],
          ["get", 1],
          ["put", 4, 4],
          ["get", 2]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">LRUCache</span> {' },
    { line: 2,  code: '    <span class="tok-kw">int</span> cap;' },
    { line: 3,  code: '    <span class="tok-type">list</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-kw">int</span>, <span class="tok-kw">int</span>&gt;&gt; dll; <span class="tok-cmt">// front=MRU(最新), back=LRU(最舊)</span>' },
    { line: 4,  code: '    <span class="tok-type">unordered_map</span>&lt;<span class="tok-kw">int</span>, <span class="tok-type">list</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-kw">int</span>, <span class="tok-kw">int</span>&gt;&gt;::iterator&gt; cache;' },
    { line: 5,  code: '<span class="tok-kw">public</span>:' },
    { line: 6,  code: '    <span class="tok-fn">LRUCache</span>(<span class="tok-kw">int</span> capacity) : cap(capacity) {}' },
    { line: 7,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">get</span>(<span class="tok-kw">int</span> key) {' },
    { line: 8,  code: '        <span class="tok-kw">auto</span> it = cache.<span class="tok-fn">find</span>(key);' },
    { line: 9,  code: '        <span class="tok-kw">if</span> (it == cache.<span class="tok-fn">end</span>()) <span class="tok-kw">return</span> -<span class="tok-num">1</span>;' },
    { line: 10, code: '        dll.<span class="tok-fn">splice</span>(dll.<span class="tok-fn">begin</span>(), dll, it-&gt;second); <span class="tok-cmt">// 移至 MRU 頭端</span>' },
    { line: 11, code: '        <span class="tok-kw">return</span> it-&gt;second-&gt;second;' },
    { line: 12, code: '    }' },
    { line: 13, code: '    <span class="tok-kw">void</span> <span class="tok-fn">put</span>(<span class="tok-kw">int</span> key, <span class="tok-kw">int</span> value) {' },
    { line: 14, code: '        <span class="tok-kw">if</span> (cache.<span class="tok-fn">count</span>(key)) {' },
    { line: 15, code: '            cache[key]-&gt;second = value;' },
    { line: 16, code: '            dll.<span class="tok-fn">splice</span>(dll.<span class="tok-fn">begin</span>(), dll, cache[key]);' },
    { line: 17, code: '            <span class="tok-kw">return</span>;' },
    { line: 18, code: '        }' },
    { line: 19, code: '        <span class="tok-kw">if</span> ((<span class="tok-kw">int</span>)cache.<span class="tok-fn">size</span>() == cap) {' },
    { line: 20, code: '            cache.<span class="tok-fn">erase</span>(dll.<span class="tok-fn">back</span>().first);' },
    { line: 21, code: '            dll.<span class="tok-fn">pop_back</span>(); <span class="tok-cmt">// 淘汰最久未用 LRU 尾端</span>' },
    { line: 22, code: '        }' },
    { line: 23, code: '        dll.<span class="tok-fn">emplace_front</span>(key, value);' },
    { line: 24, code: '        cache[key] = dll.<span class="tok-fn">begin</span>();' },
    { line: 25, code: '    }' },
    { line: 26, code: '};' }
  ],

  generateTrace(capInput, opsInput) {
    const cap = Math.max(1, Number(capInput) || 2);
    const ops =
      Array.isArray(opsInput) && opsInput.length
        ? opsInput
        : [
            ["put", 1, 1],
            ["put", 2, 2],
            ["get", 1],
            ["put", 3, 3],
            ["get", 2]
          ];

    const dll = []; // [{ key, val }], index 0 = MRU (front), index length-1 = LRU (back)
    const steps = [];

    const opLabels = ops.map((op) =>
      op[0] === "put" ? `put(${op[1]},${op[2]})` : `get(${op[1]})`
    );

    const buildBoards = (opts = {}) => {
      const {
        opIdx = -1,
        opStr = "-",
        retVal = "-",
        evictedKey = null,
        activeKey = null,
        isHit = false,
        connectors = []
      } = opts;

      const listNodes = dll.map((item, idx) => ({
        id: String(item.key),
        val: `${item.key}:${item.val}`,
        sub: idx === 0 && dll.length === 1 ? "MRU/LRU" : idx === 0 ? "MRU(最新)" : idx === dll.length - 1 ? "LRU(最舊)" : `pos=${idx}`,
        x: 65 + idx * 105,
        y: 62,
        status: item.key === activeKey ? (isHit ? "match" : "hl") : "",
        ptr: idx === 0 ? "begin()" : idx === dll.length - 1 ? "back()" : ""
      }));

      const listEdges = [];
      for (let i = 0; i < dll.length - 1; i++) {
        listEdges.push({
          from: String(dll[i].key),
          to: String(dll[i + 1].key),
          label: "⇄",
          dir: true,
          status: i === 0 && dll[0].key === activeKey ? "hl" : ""
        });
      }

      const dictRows = dll.map((item, idx) => ({
        id: String(item.key),
        key: `key = ${item.key}`,
        val: `iter → (${item.key}, ${item.val})`,
        note: idx === 0 ? "指向 MRU 頭節點" : idx === dll.length - 1 ? "指向 LRU 尾節點" : `節點 #${idx}`,
        status: item.key === activeKey ? (isHit ? "hit" : "inserted") : ""
      }));

      return {
        boards: [
          {
            id: "ops",
            type: "array",
            name: "operations",
            typeLabel: "操作序列 (get / put)",
            x: 325,
            y: 52,
            values: opLabels,
            hl: opIdx >= 0 ? [opIdx] : [],
            done: Array.from({ length: Math.max(0, opIdx) }, (_, i) => i),
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx + 1}`, color: "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "lru_vars",
            typeLabel: "快取狀態與回傳值",
            x: 24,
            y: 205,
            items: [
              { id: "cap", name: "capacity", val: `${dll.length} / ${cap}`, status: dll.length === cap ? "hl" : "" },
              { id: "op", name: "current_op", val: opStr, status: "hl" },
              { id: "evict", name: "evicted", val: evictedKey !== null ? `key=${evictedKey}` : "-", status: evictedKey !== null ? "warn" : "" },
              { id: "ret", name: "return", val: String(retVal), status: isHit ? "match" : retVal === "-1" ? "warn" : "" }
            ]
          },
          {
            id: "dll",
            type: "list",
            shape: "list",
            name: "dll (std::list<pair<int,int>>)",
            typeLabel: "雙向鏈結串列 (左 MRU 最新 ⇄ 右 LRU 最舊)",
            x: 325,
            y: 175,
            width: Math.max(380, dll.length * 110 + 40),
            height: 125,
            nodes: listNodes,
            edges: listEdges
          },
          {
            id: "cache",
            type: "dict",
            name: "cache (unordered_map)",
            typeLabel: "O(1) 雜湊表映射 (key → list::iterator)",
            x: 325,
            y: 335,
            headers: ["key", "list::iterator", "串列位置"],
            rows: dictRows
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 6,
      tag: `初始化 LRUCache(cap=${cap})`,
      tagType: "default",
      inlineBadge: `cap = ${cap}, dll = [], cache = {}`,
      explanation: `建立容量為 ${cap} 的 LRUCache，雙向鏈結串列 dll 與雜湊表 cache 皆為空。`,
      vars: { capacity: `0 / ${cap}`, current_op: "init", evicted: "-", return: "-" },
      state: buildBoards({})
    });

    ops.forEach((op, opIdx) => {
      const type = op[0];
      const key = Number(op[1]);
      const opStr = opLabels[opIdx];

      if (type === "get") {
        const idx = dll.findIndex((x) => x.key === key);
        if (idx === -1) {
          steps.push({
            line: 9,
            tag: `${opStr} → 未命中 (-1)`,
            tagType: "tag-check",
            inlineBadge: `cache.find(${key}) == end() → return -1`,
            explanation: `執行 ${opStr}：在 cache 雜湊表中找不到 key = ${key}（可能從未寫入或已被 LRU 淘汰），直接回傳 -1。`,
            vars: { capacity: `${dll.length} / ${cap}`, current_op: opStr, evicted: "-", return: "-1" },
            state: buildBoards({
              opIdx,
              opStr,
              retVal: "-1"
            })
          });
        } else {
          const [item] = dll.splice(idx, 1);
          dll.unshift(item);
          steps.push({
            line: 10,
            tag: `${opStr} → 命中回傳 ${item.val}`,
            tagType: "tag-found",
            inlineBadge: `splice(${key}:${item.val} 至 MRU 頭) → return ${item.val}`,
            explanation: `執行 ${opStr}：在 cache 中 O(1) 命中 key = ${key}（值為 ${item.val}），透過 dll.splice 將該節點移至雙向鏈結串列最前端 (MRU)，並回傳 ${item.val}。`,
            vars: { capacity: `${dll.length} / ${cap}`, current_op: opStr, evicted: "-", return: String(item.val) },
            state: buildBoards({
              opIdx,
              opStr,
              retVal: String(item.val),
              activeKey: key,
              isHit: true,
              connectors: [
                {
                  from: `wb-dict-row-${key}`,
                  to: `wb-node-dll-${key}`,
                  label: `splice 至 MRU 頭`,
                  color: "green"
                }
              ]
            })
          });
        }
      } else if (type === "put") {
        const val = Number(op[2]);
        const idx = dll.findIndex((x) => x.key === key);

        if (idx !== -1) {
          dll[idx].val = val;
          const [item] = dll.splice(idx, 1);
          dll.unshift(item);

          steps.push({
            line: 16,
            tag: `${opStr} → 更新並移至 MRU`,
            tagType: "tag-insert",
            inlineBadge: `更新 key=${key} 值為 ${val}，移至 MRU`,
            explanation: `執行 ${opStr}：key = ${key} 已存在於快取中，將其值更新為 ${val}，並透過 dll.splice 移至串列最前端 (MRU)。`,
            vars: { capacity: `${dll.length} / ${cap}`, current_op: opStr, evicted: "-", return: "void" },
            state: buildBoards({
              opIdx,
              opStr,
              retVal: "void",
              activeKey: key,
              isHit: true,
              connectors: [
                {
                  from: `wb-dict-row-${key}`,
                  to: `wb-node-dll-${key}`,
                  label: `更新 ${key}:${val}`,
                  color: "purple"
                }
              ]
            })
          });
        } else {
          let evictedKey = null;
          if (dll.length === cap) {
            const evicted = dll.pop();
            evictedKey = evicted.key;
          }
          dll.unshift({ key, val });

          steps.push({
            line: evictedKey !== null ? 21 : 23,
            tag: evictedKey !== null ? `${opStr} (淘汰 LRU key=${evictedKey})` : `${opStr} → 插入 MRU 頭`,
            tagType: "tag-insert",
            inlineBadge:
              evictedKey !== null
                ? `淘汰尾部 key=${evictedKey}，頭插 (${key}, ${val})`
                : `dll.emplace_front(${key}, ${val})`,
            explanation:
              evictedKey !== null
                ? `執行 ${opStr}：快取已滿 (${cap}/${cap})，先淘汰雙向鏈結串列最尾端 (LRU 最久未使用) 的節點 key = ${evictedKey}，再將新節點 (${key}, ${val}) 插入串列頭端 (MRU) 並註冊至 cache。`
                : `執行 ${opStr}：將新節點 (${key}, ${val}) 插入雙向鏈結串列最前端 (MRU)，並在 cache 雜湊表中記錄 cache[${key}] = dll.begin()。`,
            vars: {
              capacity: `${dll.length} / ${cap}`,
              current_op: opStr,
              evicted: evictedKey !== null ? `key=${evictedKey}` : "-",
              return: "void"
            },
            state: buildBoards({
              opIdx,
              opStr,
              retVal: "void",
              evictedKey,
              activeKey: key,
              connectors: [
                {
                  from: `wb-node-dll-${key}`,
                  to: `wb-dict-row-${key}`,
                  label: `cache[${key}] = begin()`,
                  color: "purple"
                }
              ]
            })
          });
        }
      }
    });

    return steps;
  }
};

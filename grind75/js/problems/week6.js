/**
 * Grind 75 — Week 6 (Problems #50 ～ #58)
 * 包含：
 *  #50 Word Break (LC 139)
 *  #51 Partition Equal Subset Sum (LC 416)
 *  #52 String to Integer (atoi) (LC 8)
 *  #53 Spiral Matrix (LC 54)
 *  #54 Subsets (LC 78)
 *  #55 Binary Tree Right Side View (LC 199)
 *  #56 Longest Palindromic Substring (LC 5)
 *  #57 Unique Paths (LC 62)
 *  #58 Construct Binary Tree from Preorder and Inorder Traversal (LC 105)
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #50 Word Break (LC 139) — 1D Dynamic Programming
// ============================================================================
window.PROBLEMS["word-break"] = {
  id: 50,
  leetcodeId: 139,
  slug: "word-break",
  title: "139. Word Break (單詞拆分)",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  mins: 30,
  complexity: "Time O(N² · L) · Space O(N + W)",
  description:
    "給定字串 s 與單詞字典 wordDict，判斷 s 是否可以被拆分為一個或多個在字典中出現的單詞（單詞可重複使用）。定義一維布林狀態 dp[i] 代表前綴 s[0..i-1] 是否可拆分；對每個終點 i，枚舉切分點 j < i，若 dp[j] 為 true 且子字串 s[j..i-1] 存在於雜湊集合 wordSet 中，則 dp[i] = true。",
  argNames: ["s", "wordDict"],

  presets: [
    { name: "標準拆分 (leetcode)", args: ["leetcode", ["leet", "code"]] },
    { name: "重複使用單詞 (applepenapple)", args: ["applepenapple", ["apple", "pen"]] },
    { name: "無法完整拆分 (catsandog)", args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-kw">bool</span> <span class="tok-fn">wordBreak</span>(<span class="tok-type">string</span> s, <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&amp; wordDict) {` },
    { line: 2, code: `    <span class="tok-type">unordered_set</span>&lt;<span class="tok-type">string</span>&gt; wordSet(wordDict.begin(), wordDict.end());` },
    { line: 3, code: `    <span class="tok-type">int</span> n = s.size();` },
    { line: 4, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-kw">bool</span>&gt; dp(n + <span class="tok-num">1</span>, <span class="tok-kw">false</span>);` },
    { line: 5, code: `    dp[<span class="tok-num">0</span>] = <span class="tok-kw">true</span>; <span class="tok-cmt">// 空前綴基底狀態</span>` },
    { line: 6, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">1</span>; i &lt;= n; ++i) {` },
    { line: 7, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> j = <span class="tok-num">0</span>; j &lt; i; ++j) {` },
    { line: 8, code: `            <span class="tok-kw">if</span> (dp[j] &amp;&amp; wordSet.count(s.substr(j, i - j))) {` },
    { line: 9, code: `                dp[i] = <span class="tok-kw">true</span>;` },
    { line: 10, code: `                <span class="tok-kw">break</span>;` },
    { line: 11, code: `            }` },
    { line: 12, code: `        }` },
    { line: 13, code: `    }` },
    { line: 14, code: `    <span class="tok-kw">return</span> dp[n];` },
    { line: 15, code: `}` }
  ],

  generateTrace(sInput, dictInput) {
    const s = String(sInput || "leetcode").slice(0, 14);
    const wordDict = Array.isArray(dictInput) && dictInput.length > 0 ? dictInput.map(String) : ["leet", "code"];
    const wordSet = Array.from(new Set(wordDict));
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    const steps = [];

    const buildBoards = (opts = {}) => {
      const {
        i = -1,
        j = -1,
        sub = "-",
        hitWord = null,
        justSetI = -1,
        retVal = "-",
        connectors = []
      } = opts;

      const sChars = s.split("");
      const sHl = [];
      const sMatch = [];
      for (let k = 0; k < n; k++) {
        if (justSetI > 0 && j >= 0 && k >= j && k < i) sMatch.push(k);
        else if (i > 0 && j >= 0 && k >= j && k < i) sHl.push(k);
      }
      const sPtrs = [];
      if (j >= 0 && j < n) sPtrs.push({ idx: j, label: `j=${j}`, color: "blue" });
      if (i > 0 && i - 1 < n) sPtrs.push({ idx: i - 1, label: `i-1=${i - 1}`, color: "purple" });

      const dpVals = dp.map((v) => (v ? "T" : "F"));
      const dpHl = [];
      const dpMatch = [];
      for (let k = 0; k <= n; k++) {
        if (k === justSetI || (dp[k] && k === 0) || dp[k]) dpMatch.push(k);
        if (k === i && !dp[k]) dpHl.push(k);
      }
      const dpPtrs = [];
      if (j >= 0) dpPtrs.push({ idx: j, label: `j=${j}`, color: dp[j] ? "green" : "red" });
      if (i >= 0) dpPtrs.push({ idx: i, label: `i=${i}`, color: "blue" });

      const setItems = wordSet.map((w) => ({
        val: `"${w}"`,
        status: hitWord === w ? "hit" : ""
      }));

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `字串 (length = ${n})`,
            x: 325,
            y: 52,
            values: sChars,
            hl: sHl,
            match: sMatch,
            pointers: sPtrs
          },
          {
            id: "dp",
            type: "array",
            name: "dp",
            typeLabel: `vector<bool> (0..${n})`,
            x: 325,
            y: 190,
            values: dpVals,
            hl: dpHl,
            match: dpMatch,
            pointers: dpPtrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "子字串切分狀態",
            x: 24,
            y: 205,
            items: [
              { id: "ij", name: "(j, i)", val: i >= 0 ? `(${j >= 0 ? j : "-"}, ${i})` : "-", status: i >= 0 ? "hl" : "" },
              { id: "sub", name: "s[j..i-1]", val: sub !== "-" ? `"${sub}"` : "-", status: hitWord ? "match" : sub !== "-" ? "hl" : "" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          },
          {
            id: "wordSet",
            type: "set",
            name: "wordSet",
            typeLabel: "字典集合 (unordered_set)",
            x: 325,
            y: 325,
            items: setItems
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 5,
      tag: "初始化 DP 與字典",
      tagType: "default",
      inlineBadge: `dp[0] = true, wordSet.size() = ${wordSet.length}`,
      explanation: `將 wordDict 轉入雜湊集合 wordSet 加速 O(1) 查詢；建立長度 ${n + 1} 的布林陣列 dp，並將基底狀態 dp[0] 設為 true（代表空字串可成功拆分）。`,
      vars: { i: "-", j: "-", substr: "-", "dp[i]": "dp[0]=true" },
      state: buildBoards({})
    });

    for (let i = 1; i <= n; i++) {
      let matched = false;
      for (let j = 0; j < i; j++) {
        if (!dp[j]) continue;
        const sub = s.slice(j, i);
        const inSet = wordSet.includes(sub);
        const wIdx = wordSet.indexOf(sub);

        steps.push({
          line: 8,
          tag: `檢查切分 s[${j}..${i - 1}]`,
          tagType: inSet ? "tag-found" : "tag-check",
          inlineBadge: `dp[${j}]=T, "${sub}" ${inSet ? "∈" : "∉"} wordSet`,
          explanation: `外層終點 i = ${i}，選擇合法前綴切分點 j = ${j}（因為 dp[${j}] = true），檢查子字串 s[${j}..${i - 1}] = "${sub}" 是否在 wordSet 中：${inSet ? "命中字典！" : "不在字典中，繼續嘗試下一個 j。"}`,
          vars: { i, j, substr: `"${sub}"`, "dp[i]": String(dp[i]) },
          state: buildBoards({
            i,
            j,
            sub,
            hitWord: inSet ? sub : null,
            connectors: inSet
              ? [{ from: `wb-cw-dp-${j}`, to: `wb-chip-wordSet-${wIdx}`, label: `命中 "${sub}"`, color: "green" }]
              : [{ from: `wb-cw-dp-${j}`, to: "wb-var-sub", label: `測試 "${sub}"`, color: "blue" }]
          })
        });

        if (inSet) {
          dp[i] = true;
          matched = true;
          steps.push({
            line: 9,
            tag: `更新 dp[${i}] = true`,
            tagType: "tag-insert",
            inlineBadge: `dp[${i}] = true (break)`,
            explanation: `因為 dp[${j}] 為 true 且 "${sub}" 存在於字典中，前綴 s[0..${i - 1}] = "${s.slice(0, i)}" 可合法拆分！設定 dp[${i}] = true 並 break 跳出內層迴圈。`,
            vars: { i, j, substr: `"${sub}"`, "dp[i]": "true" },
            state: buildBoards({
              i,
              j,
              sub,
              hitWord: sub,
              justSetI: i,
              connectors: [{ from: `wb-cw-dp-${j}`, to: `wb-cw-dp-${i}`, label: `+ "${sub}" → dp[${i}]=T`, color: "green" }]
            })
          });
          break;
        }
      }

      if (!matched && i === n) {
        steps.push({
          line: 12,
          tag: `終點 i=${i} 無合法切分`,
          tagType: "default",
          inlineBadge: `dp[${i}] 維持 false`,
          explanation: `所有满足 dp[j] == true 的切分點 j 皆無法使 s[j..${i - 1}] 命中字典，因此 dp[${i}] 保持 false。`,
          vars: { i, j: i, substr: "-", "dp[i]": "false" },
          state: buildBoards({ i, j: -1 })
        });
      }
    }

    steps.push({
      line: 14,
      tag: dp[n] ? "成功拆分！回傳 true" : "無法拆分，回傳 false",
      tagType: dp[n] ? "tag-found" : "default",
      inlineBadge: `return dp[${n}] = ${dp[n]}`,
      explanation: `動態規劃結束，回傳 dp[${n}] = ${dp[n]}，代表整個字串 "${s}" ${dp[n] ? "可以" : "無法"}由字典單詞拼接而成。`,
      vars: { i: n, j: "-", substr: "-", "dp[i]": String(dp[n]) },
      state: buildBoards({
        i: n,
        retVal: String(dp[n]),
        connectors: [{ from: `wb-cw-dp-${n}`, to: "wb-var-ret", label: `return ${dp[n]}`, color: dp[n] ? "green" : "red" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #51 Partition Equal Subset Sum (LC 416) — 0/1 Knapsack 1D DP
// ============================================================================
window.PROBLEMS["partition-equal-subset-sum"] = {
  id: 51,
  leetcodeId: 416,
  slug: "partition-equal-subset-sum",
  title: "416. Partition Equal Subset Sum (分割等和子集)",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  mins: 30,
  complexity: "Time O(N · Sum) · Space O(Sum)",
  description:
    "給定只含正整數的陣列 nums，判斷是否能將其分割成兩個元素總和相等的子集。等價於 0/1 背包問題：計算總和 totalSum，若為奇數則必不可能；否則目標為湊出 target = totalSum / 2。使用一維布林陣列 dp[w] 由 target 往 num 逆序更新，避免同一元素被重複選取。",
  argNames: ["nums"],

  presets: [
    { name: "可等分 ([1, 5, 11, 5] -> 11)", args: [[1, 5, 11, 5]] },
    { name: "總和偶數但不可等分 ([1, 2, 5])", args: [[1, 2, 5]] },
    { name: "總和奇數直接排除 ([1, 2, 3, 5])", args: [[1, 2, 3, 5]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-kw">bool</span> <span class="tok-fn">canPartition</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 2, code: `    <span class="tok-type">int</span> total = <span class="tok-fn">accumulate</span>(nums.begin(), nums.end(), <span class="tok-num">0</span>);` },
    { line: 3, code: `    <span class="tok-kw">if</span> (total % <span class="tok-num">2</span> != <span class="tok-num">0</span>) <span class="tok-kw">return</span> <span class="tok-kw">false</span>;` },
    { line: 4, code: `    <span class="tok-type">int</span> target = total / <span class="tok-num">2</span>;` },
    { line: 5, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-kw">bool</span>&gt; dp(target + <span class="tok-num">1</span>, <span class="tok-kw">false</span>);` },
    { line: 6, code: `    dp[<span class="tok-num">0</span>] = <span class="tok-kw">true</span>;` },
    { line: 7, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> num : nums) {` },
    { line: 8, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> w = target; w &gt;= num; --w) {` },
    { line: 9, code: `            dp[w] = dp[w] || dp[w - num];` },
    { line: 10, code: `        }` },
    { line: 11, code: `    }` },
    { line: 12, code: `    <span class="tok-kw">return</span> dp[target];` },
    { line: 13, code: `}` }
  ],

  generateTrace(numsInput) {
    const raw = Array.isArray(numsInput) && numsInput.length > 0 ? numsInput.map(Number) : [1, 5, 11, 5];
    const nums = raw.slice(0, 8);
    const total = nums.reduce((a, b) => a + b, 0);
    const target = Math.floor(total / 2);
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    const steps = [];

    const buildBoards = (opts = {}) => {
      const {
        numIdx = -1,
        w = -1,
        fromW = -1,
        retVal = "-",
        connectors = []
      } = opts;

      const numsDone = [];
      for (let k = 0; k < numIdx; k++) numsDone.push(k);

      const dpVals = dp.map((v) => (v ? "T" : "F"));
      const dpMatch = [];
      const dpHl = [];
      for (let k = 0; k <= target; k++) {
        if (dp[k]) dpMatch.push(k);
        if (k === w && !dp[k]) dpHl.push(k);
      }
      const dpPtrs = [];
      if (fromW >= 0) dpPtrs.push({ idx: fromW, label: `w-num=${fromW}`, color: "blue" });
      if (w >= 0) dpPtrs.push({ idx: w, label: `w=${w}`, color: "green" });

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "輸入陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: nums,
            hl: numIdx >= 0 ? [numIdx] : [],
            done: numsDone,
            pointers: numIdx >= 0 ? [{ idx: numIdx, label: `num=${nums[numIdx]}`, color: "blue" }] : []
          },
          {
            id: "dp",
            type: "array",
            name: "dp",
            typeLabel: `0/1 背包可達總和 dp[0..${target}]`,
            x: 325,
            y: 195,
            values: dpVals,
            hl: dpHl,
            match: dpMatch,
            pointers: dpPtrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "背包參數與目標",
            x: 24,
            y: 205,
            items: [
              { id: "total", name: "total", val: String(total), status: total % 2 !== 0 ? "warn" : "" },
              { id: "target", name: "target", val: total % 2 === 0 ? String(target) : "奇數不可分", status: "hl" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 2,
      tag: "計算總和 total",
      tagType: "default",
      inlineBadge: `total = ${total}`,
      explanation: `先計算陣列所有元素的總和 total = ${total}。`,
      vars: { total, target: "-", num: "-", "dp[target]": "-" },
      state: buildBoards({})
    });

    if (total % 2 !== 0) {
      steps.push({
        line: 3,
        tag: "總和為奇數，直接回傳 false",
        tagType: "default",
        inlineBadge: `${total} % 2 != 0 → return false`,
        explanation: `因為總和 ${total} 是奇數，無法平分成兩個相等的整數子集，直接回傳 false。`,
        vars: { total, target: "N/A", num: "-", "dp[target]": "false" },
        state: buildBoards({ retVal: "false" })
      });
      return steps;
    }

    steps.push({
      line: 6,
      tag: "初始化 0/1 背包 DP",
      tagType: "default",
      inlineBadge: `target = ${target}, dp[0] = true`,
      explanation: `總和為偶數，設定目標容量 target = ${total} / 2 = ${target}，並初始化 dp[0] = true。`,
      vars: { total, target, num: "-", "dp[target]": "false" },
      state: buildBoards({})
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      steps.push({
        line: 7,
        tag: `考慮數字 num = ${num}`,
        tagType: "tag-check",
        inlineBadge: `nums[${idx}] = ${num}`,
        explanation: `取出第 ${idx} 個元素 num = ${num}，準備將 w 從 ${target} 逆序掃描至 ${num}。`,
        vars: { total, target, num, "dp[target]": String(dp[target]) },
        state: buildBoards({ numIdx: idx })
      });

      for (let w = target; w >= num; w--) {
        if (!dp[w] && dp[w - num]) {
          dp[w] = true;
          steps.push({
            line: 9,
            tag: `湊出總和 w = ${w}`,
            tagType: w === target ? "tag-found" : "tag-insert",
            inlineBadge: `dp[${w}] = dp[${w - num}] (true)`,
            explanation: `因為 dp[${w - num}] 為 true，加上當前元素 ${num} 後即可湊出總和 ${w}，更新 dp[${w}] = true！`,
            vars: { total, target, num, "dp[target]": String(dp[target]) },
            state: buildBoards({
              numIdx: idx,
              w,
              fromW: w - num,
              connectors: [
                { from: `wb-cw-dp-${w - num}`, to: `wb-cw-dp-${w}`, label: `+${num} → dp[${w}]=T`, color: w === target ? "green" : "purple" }
              ]
            })
          });
        }
      }
    }

    steps.push({
      line: 12,
      tag: dp[target] ? "成功分割等和子集！" : "無法湊出 target",
      tagType: dp[target] ? "tag-found" : "default",
      inlineBadge: `return dp[${target}] = ${dp[target]}`,
      explanation: `所有元素處理完畢，檢視 dp[${target}] = ${dp[target]}，回傳最終結果 ${dp[target]}。`,
      vars: { total, target, num: "-", "dp[target]": String(dp[target]) },
      state: buildBoards({
        retVal: String(dp[target]),
        connectors: [{ from: `wb-cw-dp-${target}`, to: "wb-var-ret", label: `return ${dp[target]}`, color: dp[target] ? "green" : "red" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #52 String to Integer (atoi) (LC 8) — String Parsing & Overflow Guard
// ============================================================================
window.PROBLEMS["string-to-integer-atoi"] = {
  id: 52,
  leetcodeId: 8,
  slug: "string-to-integer-atoi",
  title: "8. String to Integer (atoi) (字串轉換整數)",
  difficulty: "Medium",
  topic: "String",
  mins: 25,
  complexity: "Time O(N) · Space O(1)",
  description:
    "實作 C/C++ 的 atoi 函式將字串轉換為 32 位元有號整數：1. 跳過前導空白字元；2. 讀取可選的正負號 '+' 或 '-'；3. 連續讀取十進位數字直到遇到非數字或結尾；4. 若累加過程超過 32 位元有號整數範圍 [-2147483648, 2147483647]，則截斷（Clamp）至 INT_MIN 或 INT_MAX。",
  argNames: ["s"],

  presets: [
    { name: "前導空白與負號 (\"   -42\")", args: ["   -42"] },
    { name: "數字後接文字 (\"4193 with\")", args: ["4193 with"] },
    { name: "32位元溢位截斷 (\"-91283472332\")", args: ["-91283472332"] },
    { name: "開頭即非數字 (\"words 987\")", args: ["words 987"] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">myAtoi</span>(<span class="tok-type">string</span> s) {` },
    { line: 2, code: `    <span class="tok-type">int</span> i = <span class="tok-num">0</span>, n = s.size(), sign = <span class="tok-num">1</span>;` },
    { line: 3, code: `    <span class="tok-type">long</span> <span class="tok-type">long</span> res = <span class="tok-num">0</span>;` },
    { line: 4, code: `    <span class="tok-kw">while</span> (i &lt; n &amp;&amp; s[i] == <span class="tok-num">' '</span>) ++i;` },
    { line: 5, code: `    <span class="tok-kw">if</span> (i &lt; n &amp;&amp; (s[i] == <span class="tok-num">'+'</span> || s[i] == <span class="tok-num">'-'</span>)) {` },
    { line: 6, code: `        sign = (s[i++] == <span class="tok-num">'-'</span>) ? -<span class="tok-num">1</span> : <span class="tok-num">1</span>;` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">while</span> (i &lt; n &amp;&amp; <span class="tok-fn">isdigit</span>(s[i])) {` },
    { line: 9, code: `        res = res * <span class="tok-num">10</span> + (s[i++] - <span class="tok-num">'0'</span>);` },
    { line: 10, code: `        <span class="tok-kw">if</span> (res * sign &gt;= INT_MAX) <span class="tok-kw">return</span> INT_MAX;` },
    { line: 11, code: `        <span class="tok-kw">if</span> (res * sign &lt;= INT_MIN) <span class="tok-kw">return</span> INT_MIN;` },
    { line: 12, code: `    }` },
    { line: 13, code: `    <span class="tok-kw">return</span> <span class="tok-kw">static_cast</span>&lt;<span class="tok-type">int</span>&gt;(res * sign);` },
    { line: 14, code: `}` }
  ],

  generateTrace(sInput) {
    const s = String(sInput !== undefined ? sInput : "   -42").slice(0, 15);
    const INT_MAX = 2147483647;
    const INT_MIN = -2147483648;
    const chars = s.split("").map((ch) => (ch === " " ? "␣" : ch));
    const n = s.length;
    let i = 0;
    let sign = 1;
    let res = 0;
    const steps = [];

    const buildBoards = (opts = {}) => {
      const {
        curIdx = i,
        digit = "-",
        retVal = "-",
        warnIdx = -1,
        connectors = []
      } = opts;

      const done = [];
      for (let k = 0; k < Math.min(curIdx, n); k++) done.push(k);

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `輸入字串 (length = ${n})`,
            x: 325,
            y: 52,
            values: chars,
            hl: curIdx >= 0 && curIdx < n && warnIdx !== curIdx ? [curIdx] : [],
            warn: warnIdx >= 0 ? [warnIdx] : [],
            done,
            pointers: curIdx >= 0 && curIdx < n ? [{ idx: curIdx, label: `i = ${curIdx}`, color: "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "parser_state",
            typeLabel: "解析器狀態與溢位檢查",
            x: 24,
            y: 205,
            items: [
              { id: "sign", name: "sign", val: sign === 1 ? "+1" : "-1", status: sign === -1 ? "hl" : "" },
              { id: "digit", name: "digit", val: String(digit), status: digit !== "-" ? "hl" : "" },
              { id: "res", name: "res", val: String(res), status: "hl" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 2,
      tag: "初始化指標與累加器",
      tagType: "default",
      inlineBadge: `i = 0, sign = +1, res = 0`,
      explanation: `初始化掃描指標 i = 0、正負號 sign = +1、64 位元暫存累加結果 res = 0。`,
      vars: { i, sign: "+1", res: 0, return: "-" },
      state: buildBoards({ curIdx: 0 })
    });

    while (i < n && s[i] === " ") {
      i++;
    }
    if (i > 0) {
      steps.push({
        line: 4,
        tag: "跳過前導空白",
        tagType: "tag-check",
        inlineBadge: `跳過 ${i} 個空白 → i = ${i}`,
        explanation: `while 迴圈跳過所有前導空白字元 ' '，指標推進至 i = ${i}。`,
        vars: { i, sign: "+1", res: 0, return: "-" },
        state: buildBoards({ curIdx: i })
      });
    }

    if (i < n && (s[i] === "+" || s[i] === "-")) {
      const ch = s[i];
      sign = ch === "-" ? -1 : 1;
      const signIdx = i;
      i++;
      steps.push({
        line: 6,
        tag: `讀取正負號 '${ch}'`,
        tagType: "tag-insert",
        inlineBadge: `sign = ${sign === 1 ? "+1" : "-1"}, i = ${i}`,
        explanation: `在索引 ${signIdx} 偵測到符號 '${ch}'，設定 sign = ${sign === 1 ? "+1" : "-1"}，並將 i 推進至 ${i}。`,
        vars: { i, sign: sign === 1 ? "+1" : "-1", res: 0, return: "-" },
        state: buildBoards({
          curIdx: signIdx,
          connectors: [{ from: `wb-cw-s-${signIdx}`, to: "wb-var-sign", label: `sign = ${sign}`, color: "purple" }]
        })
      });
    }

    while (i < n && s[i] >= "0" && s[i] <= "9") {
      const d = s.charCodeAt(i) - 48;
      const dIdx = i;
      const prevRes = res;
      res = res * 10 + d;
      i++;

      steps.push({
        line: 9,
        tag: `累加數位 '${d}'`,
        tagType: "tag-insert",
        inlineBadge: `res = ${prevRes}*10 + ${d} = ${res}`,
        explanation: `讀取數字字元 s[${dIdx}] = '${d}'，更新累加值 res = ${prevRes} × 10 + ${d} = ${res}。`,
        vars: { i, sign: sign === 1 ? "+1" : "-1", res, return: "-" },
        state: buildBoards({
          curIdx: dIdx,
          digit: d,
          connectors: [{ from: `wb-cw-s-${dIdx}`, to: "wb-var-res", label: `×10 + ${d}`, color: "blue" }]
        })
      });

      if (res * sign >= INT_MAX) {
        steps.push({
          line: 10,
          tag: "超過 INT_MAX，截斷回傳",
          tagType: "tag-found",
          inlineBadge: `return INT_MAX (${INT_MAX})`,
          explanation: `當前帶號數值 ${res * sign} 已達到或超過 32 位元上限 INT_MAX (${INT_MAX})，立即截斷並回傳 ${INT_MAX}。`,
          vars: { i, sign: "+1", res, return: INT_MAX },
          state: buildBoards({
            curIdx: dIdx,
            warnIdx: dIdx,
            digit: d,
            retVal: INT_MAX,
            connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: "Clamp INT_MAX", color: "red" }]
          })
        });
        return steps;
      }

      if (res * sign <= INT_MIN) {
        steps.push({
          line: 11,
          tag: "低於 INT_MIN，截斷回傳",
          tagType: "tag-found",
          inlineBadge: `return INT_MIN (${INT_MIN})`,
          explanation: `當前帶號數值 ${res * sign} 已低於或等於 32 位元下限 INT_MIN (${INT_MIN})，立即截斷並回傳 ${INT_MIN}。`,
          vars: { i, sign: "-1", res, return: INT_MIN },
          state: buildBoards({
            curIdx: dIdx,
            warnIdx: dIdx,
            digit: d,
            retVal: INT_MIN,
            connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: "Clamp INT_MIN", color: "red" }]
          })
        });
        return steps;
      }
    }

    if (i < n) {
      steps.push({
        line: 8,
        tag: `遇到非數字 '${s[i]}' 停止`,
        tagType: "tag-check",
        inlineBadge: `s[${i}] = '${s[i]}' 非數字`,
        explanation: `索引 i = ${i} 處字元 '${s[i]}' 不是十進位數字，結束數字掃描迴圈。`,
        vars: { i, sign: sign === 1 ? "+1" : "-1", res, return: "-" },
        state: buildBoards({ curIdx: i, warnIdx: i })
      });
    }

    const finalAns = res * sign === 0 ? 0 : res * sign;
    steps.push({
      line: 13,
      tag: "回傳轉換結果",
      tagType: "tag-found",
      inlineBadge: `return ${finalAns}`,
      explanation: `將累加結果乘上符號：${res} × (${sign}) = ${finalAns}，回傳最終整數。`,
      vars: { i, sign: sign === 1 ? "+1" : "-1", res, return: finalAns },
      state: buildBoards({
        curIdx: i,
        retVal: finalAns,
        connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: `return ${finalAns}`, color: "green" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #53 Spiral Matrix (LC 54) — Four Boundary Pointers Simulation
// ============================================================================
window.PROBLEMS["spiral-matrix"] = {
  id: 53,
  leetcodeId: 54,
  slug: "spiral-matrix",
  title: "54. Spiral Matrix (螺旋矩陣)",
  difficulty: "Medium",
  topic: "Matrix",
  mins: 25,
  complexity: "Time O(M · N) · Space O(1)",
  description:
    "給定 m × n 矩陣 matrix，請按照順時針螺旋順序回傳矩陣中的所有元素。維護四個邊界指標 top、bottom、left、right，依序執行「頂列向右 → 右欄向下 → 底列向左 → 左欄向上」四個階段，每走完一條邊便收縮對應邊界，直到邊界交錯為止。",
  argNames: ["matrix"],

  presets: [
    { name: "3×3 方陣標準螺旋", args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]] },
    { name: "3×4 長方形矩陣", args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]] },
    { name: "2×3 雙列矩陣", args: [[[1, 2, 3], [4, 5, 6]]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; <span class="tok-fn">spiralOrder</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt;&amp; matrix) {` },
    { line: 2, code: `    <span class="tok-type">int</span> top = <span class="tok-num">0</span>, bottom = matrix.size() - <span class="tok-num">1</span>;` },
    { line: 3, code: `    <span class="tok-type">int</span> left = <span class="tok-num">0</span>, right = matrix[<span class="tok-num">0</span>].size() - <span class="tok-num">1</span>;` },
    { line: 4, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; res;` },
    { line: 5, code: `    <span class="tok-kw">while</span> (top &lt;= bottom &amp;&amp; left &lt;= right) {` },
    { line: 6, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> c = left; c &lt;= right; ++c) res.push_back(matrix[top][c]);` },
    { line: 7, code: `        ++top;` },
    { line: 8, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> r = top; r &lt;= bottom; ++r) res.push_back(matrix[r][right]);` },
    { line: 9, code: `        --right;` },
    { line: 10, code: `        <span class="tok-kw">if</span> (top &lt;= bottom) {` },
    { line: 11, code: `            <span class="tok-kw">for</span> (<span class="tok-type">int</span> c = right; c &gt;= left; --c) res.push_back(matrix[bottom][c]);` },
    { line: 12, code: `            --bottom;` },
    { line: 13, code: `        }` },
    { line: 14, code: `        <span class="tok-kw">if</span> (left &lt;= right) {` },
    { line: 15, code: `            <span class="tok-kw">for</span> (<span class="tok-type">int</span> r = bottom; r &gt;= top; --r) res.push_back(matrix[r][left]);` },
    { line: 16, code: `            ++left;` },
    { line: 17, code: `        }` },
    { line: 18, code: `    }` },
    { line: 19, code: `    <span class="tok-kw">return</span> res;` },
    { line: 20, code: `}` }
  ],

  generateTrace(matInput) {
    const matrix =
      Array.isArray(matInput) && matInput.length > 0 && Array.isArray(matInput[0])
        ? matInput
        : [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const m = matrix.length;
    const n = matrix[0].length;
    let top = 0;
    let bottom = m - 1;
    let left = 0;
    let right = n - 1;
    const res = [];
    const visited = [];
    const steps = [];

    const buildBoards = (opts = {}) => {
      const { hlCells = [], dirLabel = "-", connectors = [], finished = false } = opts;

      return {
        boards: [
          {
            id: "mat",
            type: "grid",
            name: "matrix",
            typeLabel: `${m}×${n} 二維矩陣`,
            x: 325,
            y: 52,
            cells: matrix,
            hl: hlCells,
            match: finished ? [...visited] : [],
            done: finished ? [] : [...visited]
          },
          {
            id: "vars",
            type: "vars",
            name: "boundaries",
            typeLabel: "四邊界指標狀態",
            x: 24,
            y: 205,
            items: [
              { id: "top", name: "top", val: String(top), status: "hl" },
              { id: "bottom", name: "bottom", val: String(bottom), status: "hl" },
              { id: "left", name: "left", val: String(left), status: "hl" },
              { id: "right", name: "right", val: String(right), status: "hl" },
              { id: "dir", name: "方向", val: dirLabel, status: finished ? "match" : "" }
            ]
          },
          {
            id: "res",
            type: "array",
            name: "res",
            typeLabel: `螺旋收集結果 (${res.length}/${m * n})`,
            x: 325,
            y: 255,
            values: [...res],
            hl: res.length > 0 && !finished ? [res.length - 1] : [],
            match: finished ? res.map((_, idx) => idx) : []
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 3,
      tag: "初始化四個邊界指標",
      tagType: "default",
      inlineBadge: `top=0, bottom=${bottom}, left=0, right=${right}`,
      explanation: `設定初始邊界：top = 0, bottom = ${bottom}, left = 0, right = ${right}，準備順時針螺旋走訪。`,
      vars: { top, bottom, left, right },
      state: buildBoards({ dirLabel: "準備出發" })
    });

    while (top <= bottom && left <= right) {
      // 1. Top row left -> right
      const rowCells = [];
      const rowVals = [];
      for (let c = left; c <= right; c++) {
        const key = `${top},${c}`;
        rowCells.push(key);
        visited.push(key);
        res.push(matrix[top][c]);
        rowVals.push(matrix[top][c]);
      }
      const lastTopCol = right;
      top++;
      steps.push({
        line: 6,
        tag: `向右走訪頂列 (row ${top - 1})`,
        tagType: "tag-insert",
        inlineBadge: `收集 [${rowVals.join(", ")}], ++top=${top}`,
        explanation: `沿頂列 row = ${top - 1} 從 col = ${left} 向右走訪至 ${right}，將 [${rowVals.join(", ")}] 加入 res，接著收縮上邊界 ++top = ${top}。`,
        vars: { top, bottom, left, right },
        state: buildBoards({
          hlCells: rowCells,
          dirLabel: "→ 向右 (頂列)",
          connectors: [
            { from: `wb-grid-mat-${top - 1}-${lastTopCol}`, to: `wb-cw-res-${res.length - 1}`, label: `push ${matrix[top - 1][lastTopCol]}`, color: "blue" }
          ]
        })
      });

      // 2. Right col top -> bottom
      if (top <= bottom) {
        const colCells = [];
        const colVals = [];
        for (let r = top; r <= bottom; r++) {
          const key = `${r},${right}`;
          colCells.push(key);
          visited.push(key);
          res.push(matrix[r][right]);
          colVals.push(matrix[r][right]);
        }
        const lastRightRow = bottom;
        right--;
        steps.push({
          line: 8,
          tag: `向下走訪右欄 (col ${right + 1})`,
          tagType: "tag-insert",
          inlineBadge: `收集 [${colVals.join(", ")}], --right=${right}`,
          explanation: `沿右欄 col = ${right + 1} 從 row = ${top} 向下走訪至 ${bottom}，將 [${colVals.join(", ")}] 加入 res，接著收縮右邊界 --right = ${right}。`,
          vars: { top, bottom, left, right },
          state: buildBoards({
            hlCells: colCells,
            dirLabel: "↓ 向下 (右欄)",
            connectors: [
              { from: `wb-grid-mat-${lastRightRow}-${right + 1}`, to: `wb-cw-res-${res.length - 1}`, label: `push ${matrix[lastRightRow][right + 1]}`, color: "purple" }
            ]
          })
        });
      } else {
        right--;
      }

      // 3. Bottom row right -> left
      if (top <= bottom && left <= right) {
        const bCells = [];
        const bVals = [];
        for (let c = right; c >= left; c--) {
          const key = `${bottom},${c}`;
          bCells.push(key);
          visited.push(key);
          res.push(matrix[bottom][c]);
          bVals.push(matrix[bottom][c]);
        }
        const lastBotCol = left;
        bottom--;
        steps.push({
          line: 11,
          tag: `向左走訪底列 (row ${bottom + 1})`,
          tagType: "tag-insert",
          inlineBadge: `收集 [${bVals.join(", ")}], --bottom=${bottom}`,
          explanation: `確認 top <= bottom 後，沿底列 row = ${bottom + 1} 從 col = ${right} 向左走訪至 ${left}，將 [${bVals.join(", ")}] 加入 res，並收縮下邊界 --bottom = ${bottom}。`,
          vars: { top, bottom, left, right },
          state: buildBoards({
            hlCells: bCells,
            dirLabel: "← 向左 (底列)",
            connectors: [
              { from: `wb-grid-mat-${bottom + 1}-${lastBotCol}`, to: `wb-cw-res-${res.length - 1}`, label: `push ${matrix[bottom + 1][lastBotCol]}`, color: "blue" }
            ]
          })
        });
      } else if (top <= bottom) {
        bottom--;
      }

      // 4. Left col bottom -> top
      if (left <= right && top <= bottom) {
        const lCells = [];
        const lVals = [];
        for (let r = bottom; r >= top; r--) {
          const key = `${r},${left}`;
          lCells.push(key);
          visited.push(key);
          res.push(matrix[r][left]);
          lVals.push(matrix[r][left]);
        }
        const lastLeftRow = top;
        left++;
        steps.push({
          line: 15,
          tag: `向上走訪左欄 (col ${left - 1})`,
          tagType: "tag-insert",
          inlineBadge: `收集 [${lVals.join(", ")}], ++left=${left}`,
          explanation: `確認 left <= right 後，沿左欄 col = ${left - 1} 從 row = ${bottom} 向上走訪至 ${top}，將 [${lVals.join(", ")}] 加入 res，並收縮左邊界 ++left = ${left}。`,
          vars: { top, bottom, left, right },
          state: buildBoards({
            hlCells: lCells,
            dirLabel: "↑ 向上 (左欄)",
            connectors: [
              { from: `wb-grid-mat-${lastLeftRow}-${left - 1}`, to: `wb-cw-res-${res.length - 1}`, label: `push ${matrix[lastLeftRow][left - 1]}`, color: "purple" }
            ]
          })
        });
      } else if (left <= right) {
        left++;
      }
    }

    steps.push({
      line: 19,
      tag: "螺旋走訪完成！回傳 res",
      tagType: "tag-found",
      inlineBadge: `共收集 ${res.length} 個元素`,
      explanation: `邊界交錯 (top=${top} > bottom=${bottom} 或 left=${left} > right=${right})，所有 ${res.length} 個元素皆已按順時針螺旋順序收入 res！`,
      vars: { top, bottom, left, right },
      state: buildBoards({ dirLabel: "✓ 完成", finished: true })
    });

    return steps;
  }
};

// ============================================================================
// #54 Subsets (LC 78) — Backtracking Power Set Generation
// ============================================================================
window.PROBLEMS["subsets"] = {
  id: 54,
  leetcodeId: 78,
  slug: "subsets",
  title: "78. Subsets (子集 / 冪集)",
  difficulty: "Medium",
  topic: "Recursion",
  mins: 30,
  complexity: "Time O(N · 2ᴺ) · Space O(N)",
  description:
    "給定不含重複元素的整數陣列 nums，回傳所有可能的子集（冪集 Power Set）。透過回溯法（Backtracking）在進入每個遞迴節點時先將當前路徑 path 收錄至答案集 res，接著從索引 start 到 n-1 依序嘗試「選入 nums[i] → 遞迴 dfs(i + 1) → pop_back 撤銷選擇」。",
  argNames: ["nums"],

  presets: [
    { name: "3 個元素 ([1, 2, 3] -> 8 組子集)", args: [[1, 2, 3]] },
    { name: "2 個元素 ([4, 9] -> 4 組子集)", args: [[4, 9]] },
    { name: "單一元素 ([0] -> 2 組子集)", args: [[0]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-kw">void</span> <span class="tok-fn">dfs</span>(<span class="tok-type">int</span> start, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; path, <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt;&amp; res) {` },
    { line: 2, code: `    res.push_back(path); <span class="tok-cmt">// 每個遞迴狀態皆是一個合法子集</span>` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = start; i &lt; nums.size(); ++i) {` },
    { line: 4, code: `        path.push_back(nums[i]);` },
    { line: 5, code: `        <span class="tok-fn">dfs</span>(i + <span class="tok-num">1</span>, nums, path, res);` },
    { line: 6, code: `        path.pop_back(); <span class="tok-cmt">// 回溯撤銷選擇</span>` },
    { line: 7, code: `    }` },
    { line: 8, code: `}` },
    { line: 9, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; <span class="tok-fn">subsets</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 10, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; res; <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; path;` },
    { line: 11, code: `    <span class="tok-fn">dfs</span>(<span class="tok-num">0</span>, nums, path, res);` },
    { line: 12, code: `    <span class="tok-kw">return</span> res;` },
    { line: 13, code: `}` }
  ],

  generateTrace(numsInput) {
    const raw = Array.isArray(numsInput) && numsInput.length > 0 ? numsInput.map(Number) : [1, 2, 3];
    const nums = raw.slice(0, 4);
    const path = [];
    const collected = [];
    const steps = [];

    const fmtSet = (arr) => `{${arr.join(",")}}`;

    const buildBoards = (opts = {}) => {
      const { start = 0, i = -1, justAddedSet = false, connectors = [] } = opts;

      const ptrs = [];
      if (start >= 0 && start < nums.length) ptrs.push({ idx: start, label: `start=${start}`, color: "blue" });
      if (i >= 0 && i < nums.length) ptrs.push({ idx: i, label: `i=${i}`, color: "purple" });

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: `候選元素 (size = ${nums.length})`,
            x: 325,
            y: 52,
            values: nums,
            hl: i >= 0 ? [i] : [],
            pointers: ptrs
          },
          {
            id: "path",
            type: "stack",
            name: "path",
            typeLabel: "當前子集堆疊 (vector<int>)",
            x: 24,
            y: 205,
            items: path.map((v, idx) => ({ val: v, status: idx === path.length - 1 ? "hl" : "" }))
          },
          {
            id: "subsets",
            type: "set",
            name: "res",
            typeLabel: `已收錄子集 (${collected.length} / ${1 << nums.length})`,
            x: 325,
            y: 195,
            items: collected.map((sStr, idx) => ({
              val: sStr,
              status: justAddedSet && idx === collected.length - 1 ? "inserted" : "hit"
            }))
          }
        ],
        connectors
      };
    };

    function dfs(start) {
      const curStr = fmtSet(path);
      collected.push(curStr);
      const chipIdx = collected.length - 1;

      steps.push({
        line: 2,
        tag: `收錄子集 ${curStr}`,
        tagType: "tag-found",
        inlineBadge: `res.push_back(${curStr})`,
        explanation: `進入 dfs(start = ${start})，將當前 path = ${curStr} 加入結果集 res（目前共 ${collected.length} 組子集）。`,
        vars: { start, i: "-", path: curStr, "res.size()": collected.length },
        state: buildBoards({
          start,
          justAddedSet: true,
          connectors:
            path.length > 0
              ? [{ from: `wb-stack-path-${path.length - 1}`, to: `wb-chip-subsets-${chipIdx}`, label: `收錄 ${curStr}`, color: "green" }]
              : []
        })
      });

      for (let i = start; i < nums.length; i++) {
        path.push(nums[i]);
        steps.push({
          line: 4,
          tag: `選取 nums[${i}] = ${nums[i]}`,
          tagType: "tag-insert",
          inlineBadge: `path.push_back(${nums[i]}) → ${fmtSet(path)}`,
          explanation: `在索引 i = ${i} 選擇元素 ${nums[i]} 推入 path，準備往下遞迴呼叫 dfs(${i + 1})。`,
          vars: { start, i, path: fmtSet(path), "res.size()": collected.length },
          state: buildBoards({
            start,
            i,
            connectors: [
              { from: `wb-cw-nums-${i}`, to: `wb-stack-path-${path.length - 1}`, label: `push ${nums[i]}`, color: "purple" }
            ]
          })
        });

        dfs(i + 1);

        const popped = path.pop();
        steps.push({
          line: 6,
          tag: `回溯彈出 ${popped}`,
          tagType: "default",
          inlineBadge: `path.pop_back() → ${fmtSet(path)}`,
          explanation: `結束 dfs(${i + 1}) 分支返回，從 path 彈出 ${popped} 撤銷選擇，繼續嘗試同層下一個元素。`,
          vars: { start, i, path: fmtSet(path), "res.size()": collected.length },
          state: buildBoards({ start, i })
        });
      }
    }

    dfs(0);

    steps.push({
      line: 12,
      tag: `回傳全部 ${collected.length} 組子集`,
      tagType: "tag-found",
      inlineBadge: `return res (size = ${collected.length})`,
      explanation: `回溯搜尋樹完整走訪完畢，共產生 2^${nums.length} = ${collected.length} 組不重複子集！`,
      vars: { start: "-", i: "-", path: "{}", "res.size()": collected.length },
      state: buildBoards({ start: -1, i: -1 })
    });

    return steps;
  }
};

// ============================================================================
// #55 Binary Tree Right Side View (LC 199) — BFS Level-Order Last Node
// ============================================================================
window.PROBLEMS["binary-tree-right-side-view"] = {
  id: 55,
  leetcodeId: 199,
  slug: "binary-tree-right-side-view",
  title: "199. Binary Tree Right Side View (二元樹的右視圖)",
  difficulty: "Medium",
  topic: "Binary Tree",
  mins: 20,
  complexity: "Time O(N) · Space O(W)",
  description:
    "給定二元樹的根節點 root，想像你站在它的右側，按照從頂部到底部的順序，回傳從右側所能看到的節點值。使用佇列進行 BFS 層序走訪，每層記錄節點數 sz = q.size()，當處理到該層最後一個節點 (i == sz - 1) 時，它就是該層最右側可見的節點。",
  argNames: ["tree"],

  presets: [
    { name: "標準雙側二元樹 ([1,2,3,null,5,null,4])", args: [[1, 2, 3, null, 5, null, 4]] },
    { name: "左子樹較深露出左節點 ([1,2,3,4])", args: [[1, 2, 3, 4]] },
    { name: "偏斜右子樹 ([1,null,3,null,null,null,7])", args: [[1, null, 3, null, null, null, 7]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; <span class="tok-fn">rightSideView</span>(<span class="tok-type">TreeNode</span>* root) {` },
    { line: 2, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; res;` },
    { line: 3, code: `    <span class="tok-kw">if</span> (!root) <span class="tok-kw">return</span> res;` },
    { line: 4, code: `    <span class="tok-type">queue</span>&lt;<span class="tok-type">TreeNode</span>*&gt; q; q.push(root);` },
    { line: 5, code: `    <span class="tok-kw">while</span> (!q.empty()) {` },
    { line: 6, code: `        <span class="tok-type">int</span> sz = q.size();` },
    { line: 7, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; sz; ++i) {` },
    { line: 8, code: `            <span class="tok-type">TreeNode</span>* cur = q.front(); q.pop();` },
    { line: 9, code: `            <span class="tok-kw">if</span> (i == sz - <span class="tok-num">1</span>) res.push_back(cur-&gt;val);` },
    { line: 10, code: `            <span class="tok-kw">if</span> (cur-&gt;left)  q.push(cur-&gt;left);` },
    { line: 11, code: `            <span class="tok-kw">if</span> (cur-&gt;right) q.push(cur-&gt;right);` },
    { line: 12, code: `        }` },
    { line: 13, code: `    }` },
    { line: 14, code: `    <span class="tok-kw">return</span> res;` },
    { line: 15, code: `}` }
  ],

  generateTrace(treeArr) {
    const arr = Array.isArray(treeArr) && treeArr.length > 0 ? treeArr : [1, 2, 3, null, 5, null, 4];
    const nodesMeta = [];
    const edgesMeta = [];

    // Build binary tree layout from level-order array
    const posCoords = [
      { x: 310, y: 42, depth: 0 },
      { x: 170, y: 116, depth: 1 },
      { x: 450, y: 116, depth: 1 },
      { x: 100, y: 190, depth: 2 },
      { x: 240, y: 190, depth: 2 },
      { x: 380, y: 190, depth: 2 },
      { x: 520, y: 190, depth: 2 }
    ];

    const validMap = {};
    for (let idx = 0; idx < Math.min(arr.length, 7); idx++) {
      if (arr[idx] !== null && arr[idx] !== undefined) {
        const p = posCoords[idx];
        const nodeObj = {
          id: `n${idx}`,
          idx,
          val: arr[idx],
          x: p.x,
          y: p.y,
          depth: p.depth,
          left: null,
          right: null
        };
        validMap[idx] = nodeObj;
        nodesMeta.push(nodeObj);
      }
    }
    nodesMeta.forEach((nd) => {
      const lIdx = 2 * nd.idx + 1;
      const rIdx = 2 * nd.idx + 2;
      if (validMap[lIdx]) {
        nd.left = validMap[lIdx];
        edgesMeta.push({ from: nd.id, to: validMap[lIdx].id, label: "L", dir: true });
      }
      if (validMap[rIdx]) {
        nd.right = validMap[rIdx];
        edgesMeta.push({ from: nd.id, to: validMap[rIdx].id, label: "R", dir: true });
      }
    });

    const rightSet = new Set();
    const doneSet = new Set();
    const res = [];
    const q = [];
    const steps = [];

    const buildBoards = (opts = {}) => {
      const { curId = null, connectors = [] } = opts;

      const treeNodes = nodesMeta.map((nd) => ({
        id: nd.id,
        val: String(nd.val),
        sub: `d=${nd.depth}`,
        x: nd.x,
        y: nd.y,
        status: rightSet.has(nd.id) ? "match" : curId === nd.id ? "hl" : doneSet.has(nd.id) ? "done" : "",
        ptr: curId === nd.id ? "cur" : rightSet.has(nd.id) ? "👁右視" : ""
      }));

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元樹層序走訪 (TreeNode*)",
            x: 325,
            y: 52,
            width: 620,
            height: 270,
            nodes: treeNodes,
            edges: edgesMeta
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "BFS 佇列 (queue<TreeNode*>)",
            x: 24,
            y: 205,
            items: q.map((nd, idx) => ({ val: nd.val, status: idx === 0 ? "hl" : "" }))
          },
          {
            id: "res",
            type: "array",
            name: "res",
            typeLabel: "右視圖結果 (rightView)",
            x: 325,
            y: 285,
            values: [...res],
            match: res.map((_, i) => i)
          }
        ],
        connectors
      };
    };

    if (!validMap[0]) {
      steps.push({
        line: 3,
        tag: "空樹直接回傳",
        tagType: "default",
        inlineBadge: "root == nullptr",
        explanation: "根節點為空，回傳空陣列 []。",
        vars: { sz: 0, i: "-", "cur->val": "-", "res.size()": 0 },
        state: buildBoards({})
      });
      return steps;
    }

    q.push(validMap[0]);
    steps.push({
      line: 4,
      tag: "根節點入列",
      tagType: "tag-insert",
      inlineBadge: `q.push(${validMap[0].val})`,
      explanation: `將根節點 ${validMap[0].val} 推入 BFS 佇列 q，開始逐層走訪。`,
      vars: { sz: 1, i: "-", "cur->val": "-", "res.size()": 0 },
      state: buildBoards({ curId: validMap[0].id })
    });

    let level = 0;
    while (q.length > 0) {
      const sz = q.length;
      for (let i = 0; i < sz; i++) {
        const cur = q.shift();
        const isRightmost = i === sz - 1;
        if (cur.left) q.push(cur.left);
        if (cur.right) q.push(cur.right);

        if (isRightmost) {
          rightSet.add(cur.id);
          res.push(cur.val);
        } else {
          doneSet.add(cur.id);
        }

        steps.push({
          line: isRightmost ? 9 : 8,
          tag: isRightmost ? `第 ${level} 層最右節點：${cur.val}` : `走訪節點 ${cur.val} (i=${i}/${sz - 1})`,
          tagType: isRightmost ? "tag-found" : "tag-check",
          inlineBadge: isRightmost
            ? `i == ${sz - 1} → res.push_back(${cur.val})`
            : `cur = ${cur.val}, 非本層最右`,
          explanation: isRightmost
            ? `處理第 ${level} 層的最後一個節點 cur = ${cur.val} (i = ${i} == sz - 1)，這正是從右側看到的節點！將 ${cur.val} 加入 res，並將其左右子節點排入佇列。`
            : `從佇列取出第 ${level} 層節點 cur = ${cur.val} (i = ${i} < sz - 1 = ${sz - 1})，它被右側同層節點遮擋；將其子節點推入佇列。`,
          vars: { sz, i, "cur->val": cur.val, "res.size()": res.length },
          state: buildBoards({
            curId: cur.id,
            connectors: isRightmost
              ? [{ from: `wb-node-tree-${cur.id}`, to: `wb-cw-res-${res.length - 1}`, label: `右視可見 ${cur.val}`, color: "green" }]
              : []
          })
        });
      }
      level++;
    }

    steps.push({
      line: 14,
      tag: "回傳右視圖結果",
      tagType: "tag-found",
      inlineBadge: `return [${res.join(", ")}]`,
      explanation: `BFS 佇列已空，所有層級的最右側節點 [${res.join(", ")}] 皆已收集完成！`,
      vars: { sz: 0, i: "-", "cur->val": "-", "res.size()": res.length },
      state: buildBoards({})
    });

    return steps;
  }
};

// ============================================================================
// #56 Longest Palindromic Substring (LC 5) — Expand Around Center
// ============================================================================
window.PROBLEMS["longest-palindromic-substring"] = {
  id: 56,
  leetcodeId: 5,
  slug: "longest-palindromic-substring",
  title: "5. Longest Palindromic Substring (最長迴文子字串)",
  difficulty: "Medium",
  topic: "String",
  mins: 25,
  complexity: "Time O(N²) · Space O(1)",
  description:
    "給定字串 s，找出 s 中最長的迴文子字串。採用「中心擴展法 (Expand Around Center)」：迴文中心可能是單一字元 (奇數長度，L=i, R=i) 或兩字元間隙 (偶數長度，L=i, R=i+1)。對每個索引 i 同時向左右對稱擴展，只要 s[L] == s[R] 就持續外擴並更新最佳起點 start 與最大長度 maxLen。",
  argNames: ["s"],

  presets: [
    { name: "奇數長度迴文 (\"babad\")", args: ["babad"] },
    { name: "偶數長度迴文 (\"cbbd\")", args: ["cbbd"] },
    { name: "完整對稱迴文 (\"racecar\")", args: ["racecar"] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">string</span> <span class="tok-fn">longestPalindrome</span>(<span class="tok-type">string</span> s) {` },
    { line: 2, code: `    <span class="tok-type">int</span> start = <span class="tok-num">0</span>, maxLen = <span class="tok-num">1</span>, n = s.size();` },
    { line: 3, code: `    <span class="tok-kw">auto</span> expand = [&amp;](<span class="tok-type">int</span> L, <span class="tok-type">int</span> R) {` },
    { line: 4, code: `        <span class="tok-kw">while</span> (L &gt;= <span class="tok-num">0</span> &amp;&amp; R &lt; n &amp;&amp; s[L] == s[R]) {` },
    { line: 5, code: `            <span class="tok-kw">if</span> (R - L + <span class="tok-num">1</span> &gt; maxLen) {` },
    { line: 6, code: `                start = L; maxLen = R - L + <span class="tok-num">1</span>;` },
    { line: 7, code: `            }` },
    { line: 8, code: `            --L; ++R;` },
    { line: 9, code: `        }` },
    { line: 10, code: `    };` },
    { line: 11, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; n; ++i) {` },
    { line: 12, code: `        <span class="tok-fn">expand</span>(i, i);     <span class="tok-cmt">// 奇數長度中心</span>` },
    { line: 13, code: `        <span class="tok-fn">expand</span>(i, i + <span class="tok-num">1</span>); <span class="tok-cmt">// 偶數長度中心</span>` },
    { line: 14, code: `    }` },
    { line: 15, code: `    <span class="tok-kw">return</span> s.substr(start, maxLen);` },
    { line: 16, code: `}` }
  ],

  generateTrace(sInput) {
    const s = String(sInput || "babad").slice(0, 12);
    const n = s.length;
    const chars = s.split("");
    let start = 0;
    let maxLen = 1;
    const steps = [];

    const buildBoards = (opts = {}) => {
      const { center = -1, L = -1, R = -1, updatedBest = false, finished = false, connectors = [] } = opts;

      const match = [];
      const hl = [];
      for (let k = start; k < start + maxLen; k++) match.push(k);
      if (!finished && L >= 0 && R < n) {
        for (let k = L; k <= R; k++) {
          if (!match.includes(k)) hl.push(k);
        }
      }

      const ptrs = [];
      if (center >= 0 && center < n) ptrs.push({ idx: center, label: `i=${center}`, color: "blue" });
      if (L >= 0 && L < n) ptrs.push({ idx: L, label: `L=${L}`, color: "purple" });
      if (R >= 0 && R < n) ptrs.push({ idx: R, label: `R=${R}`, color: "green" });

      const bestSubstr = s.slice(start, start + maxLen);

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `字串中心擴展 (length = ${n})`,
            x: 325,
            y: 52,
            values: chars,
            hl,
            match,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "palindrome_vars",
            typeLabel: "最佳迴文紀錄",
            x: 24,
            y: 205,
            items: [
              { id: "start", name: "start", val: String(start), status: updatedBest ? "hl" : "" },
              { id: "maxLen", name: "maxLen", val: String(maxLen), status: updatedBest ? "hl" : "" },
              { id: "best", name: "bestSubstr", val: `"${bestSubstr}"`, status: updatedBest || finished ? "match" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 2,
      tag: "初始化最長迴文紀錄",
      tagType: "default",
      inlineBadge: `start = 0, maxLen = 1 ("${s[0]}")`,
      explanation: `初始化最佳迴文起點 start = 0、長度 maxLen = 1（預設首字元 "${s[0]}" 為最短迴文）。`,
      vars: { i: "-", L: "-", R: "-", bestSubstr: `"${s[0]}"` },
      state: buildBoards({})
    });

    const runExpand = (i, initL, initR, modeLabel, lineNum) => {
      let L = initL;
      let R = initR;
      while (L >= 0 && R < n && s[L] === s[R]) {
        const curLen = R - L + 1;
        const isBetter = curLen > maxLen;
        if (isBetter) {
          start = L;
          maxLen = curLen;
        }
        if (curLen > 1 || i === 0) {
          steps.push({
            line: isBetter ? 6 : 4,
            tag: isBetter ? `更新最長迴文 "${s.slice(L, R + 1)}"` : `${modeLabel}擴展 s[${L}]==s[${R}]`,
            tagType: isBetter ? "tag-found" : "tag-check",
            inlineBadge: `s[${L}..${R}] = "${s.slice(L, R + 1)}" (len=${curLen})`,
            explanation: `中心 i = ${i} (${modeLabel})：s[${L}] == s[${R}] == '${s[L]}'，構成迴文 "${s.slice(L, R + 1)}"（長度 ${curLen}）${isBetter ? `，打破紀錄更新 start = ${start}, maxLen = ${maxLen}！` : "。"}`,
            vars: { i, L, R, bestSubstr: `"${s.slice(start, start + maxLen)}"` },
            state: buildBoards({
              center: i,
              L,
              R,
              updatedBest: isBetter,
              connectors: isBetter
                ? [{ from: `wb-cw-s-${L}`, to: "wb-var-best", label: `新紀錄 "${s.slice(L, R + 1)}"`, color: "green" }]
                : []
            })
          });
        }
        L--;
        R++;
      }
    };

    for (let i = 0; i < n; i++) {
      runExpand(i, i, i, "奇數中心", 12);
      runExpand(i, i, i + 1, "偶數中心", 13);
    }

    const ans = s.slice(start, start + maxLen);
    steps.push({
      line: 15,
      tag: `回傳最長迴文 "${ans}"`,
      tagType: "tag-found",
      inlineBadge: `return "${ans}" (maxLen = ${maxLen})`,
      explanation: `所有中心點擴展完畢，回傳最長迴文子字串 s.substr(${start}, ${maxLen}) = "${ans}"。`,
      vars: { i: n, L: start, R: start + maxLen - 1, bestSubstr: `"${ans}"` },
      state: buildBoards({
        L: start,
        R: start + maxLen - 1,
        finished: true,
        connectors: [{ from: `wb-cw-s-${start}`, to: "wb-var-best", label: `return "${ans}"`, color: "green" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #57 Unique Paths (LC 62) — 2D Grid Dynamic Programming
// ============================================================================
window.PROBLEMS["unique-paths"] = {
  id: 57,
  leetcodeId: 62,
  slug: "unique-paths",
  title: "62. Unique Paths (不同路徑)",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  mins: 20,
  complexity: "Time O(M · N) · Space O(M · N)",
  description:
    "機器人位於 m × n 網格的左上角 (0, 0)，每次只能向下或向右移動一步，試問到達右下角 (m-1, n-1) 共有多少條不同路徑？定義二維 DP 表格 dp[r][c]：第一列與第一欄皆只有 1 條直線路徑 (dp[0][c] = dp[r][0] = 1)，其餘格子由上方與左方路徑數相加：dp[r][c] = dp[r-1][c] + dp[r][c-1]。",
  argNames: ["m", "n"],

  presets: [
    { name: "3×4 網格 (10 條路徑)", args: [3, 4] },
    { name: "3×3 方陣網格 (6 條路徑)", args: [3, 3] },
    { name: "3×7 經典測資 (28 條路徑)", args: [3, 7] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">uniquePaths</span>(<span class="tok-type">int</span> m, <span class="tok-type">int</span> n) {` },
    { line: 2, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&gt; dp(m, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;(n, <span class="tok-num">1</span>));` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> r = <span class="tok-num">1</span>; r &lt; m; ++r) {` },
    { line: 4, code: `        <span class="tok-kw">for</span> (<span class="tok-type">int</span> c = <span class="tok-num">1</span>; c &lt; n; ++c) {` },
    { line: 5, code: `            dp[r][c] = dp[r - <span class="tok-num">1</span>][c] + dp[r][c - <span class="tok-num">1</span>];` },
    { line: 6, code: `        }` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">return</span> dp[m - <span class="tok-num">1</span>][n - <span class="tok-num">1</span>];` },
    { line: 9, code: `}` }
  ],

  generateTrace(mInput, nInput) {
    const m = Math.max(2, Math.min(6, Number(mInput) || 3));
    const n = Math.max(2, Math.min(8, Number(nInput) || 4));
    const dp = Array.from({ length: m }, (_, r) =>
      Array.from({ length: n }, (__, c) => (r === 0 || c === 0 ? 1 : 0))
    );
    const done = [];
    for (let r = 0; r < m; r++) done.push(`${r},0`);
    for (let c = 1; c < n; c++) done.push(`0,${c}`);

    const steps = [];

    const buildBoards = (opts = {}) => {
      const { r = -1, c = -1, formula = "-", finished = false, connectors = [] } = opts;

      const hl = [];
      const match = [];
      if (finished) {
        match.push(`${m - 1},${n - 1}`);
      } else if (r >= 1 && c >= 1) {
        match.push(`${r},${c}`);
        hl.push(`${r - 1},${c}`, `${r},${c - 1}`);
      }

      return {
        boards: [
          {
            id: "dp",
            type: "grid",
            name: "dp",
            typeLabel: `${m}×${n} 路徑數 DP 表格`,
            x: 325,
            y: 52,
            cells: dp.map((row) => [...row]),
            hl,
            match,
            done: [...done]
          },
          {
            id: "vars",
            type: "vars",
            name: "dp_state",
            typeLabel: "狀態轉移方程式",
            x: 24,
            y: 205,
            items: [
              { id: "rc", name: "(r, c)", val: r >= 0 ? `(${r}, ${c})` : "-", status: r >= 0 ? "hl" : "" },
              { id: "cur", name: "dp[r][c]", val: formula, status: finished ? "match" : r >= 0 ? "hl" : "" }
            ]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 2,
      tag: "初始化第一列與第一欄為 1",
      tagType: "default",
      inlineBadge: `dp[0][*] = 1, dp[*][0] = 1`,
      explanation: `建立 ${m}×${n} 的 DP 表格，第一列與第一欄只能一路向右或一路向下，因此初始路徑數皆為 1。`,
      vars: { r: 0, c: 0, "dp[r][c]": 1 },
      state: buildBoards({ formula: "邊界皆為 1" })
    });

    for (let r = 1; r < m; r++) {
      for (let c = 1; c < n; c++) {
        const up = dp[r - 1][c];
        const left = dp[r][c - 1];
        dp[r][c] = up + left;
        const formStr = `${up} + ${left} = ${dp[r][c]}`;

        steps.push({
          line: 5,
          tag: `計算 dp[${r}][${c}] = ${dp[r][c]}`,
          tagType: r === m - 1 && c === n - 1 ? "tag-found" : "tag-insert",
          inlineBadge: `dp[${r}][${c}] = ${up} (上) + ${left} (左) = ${dp[r][c]}`,
          explanation: `格子 (${r}, ${c}) 可由上方 (${r - 1}, ${c}) 的 ${up} 條路徑或左方 (${r}, ${c - 1}) 的 ${left} 條路徑抵達，合計 dp[${r}][${c}] = ${up} + ${left} = ${dp[r][c]}。`,
          vars: { r, c, "dp[r][c]": dp[r][c] },
          state: buildBoards({
            r,
            c,
            formula: formStr,
            connectors: [
              { from: `wb-grid-dp-${r - 1}-${c}`, to: "wb-var-cur", label: `上方 ${up}`, color: "blue" },
              { from: `wb-grid-dp-${r}-${c - 1}`, to: "wb-var-cur", label: `左方 ${left}`, color: "purple" }
            ]
          })
        });
        done.push(`${r},${c}`);
      }
    }

    const ans = dp[m - 1][n - 1];
    steps.push({
      line: 8,
      tag: `回傳右下角總路徑數 ${ans}`,
      tagType: "tag-found",
      inlineBadge: `return dp[${m - 1}][${n - 1}] = ${ans}`,
      explanation: `DP 表格填寫完成，從左上角到右下角 (${m - 1}, ${n - 1}) 共有 ${ans} 條不同路徑！`,
      vars: { r: m - 1, c: n - 1, "dp[r][c]": ans },
      state: buildBoards({
        r: m - 1,
        c: n - 1,
        formula: String(ans),
        finished: true,
        connectors: [{ from: `wb-grid-dp-${m - 1}-${n - 1}`, to: "wb-var-cur", label: `return ${ans}`, color: "green" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #58 Construct Binary Tree from Preorder and Inorder Traversal (LC 105)
// ============================================================================
window.PROBLEMS["construct-binary-tree-from-preorder-and-inorder-traversal"] = {
  id: 58,
  leetcodeId: 105,
  slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
  title: "105. Construct Binary Tree from Preorder and Inorder Traversal (前序與中序構造二元樹)",
  difficulty: "Medium",
  topic: "Binary Tree",
  mins: 25,
  complexity: "Time O(N) · Space O(N)",
  description:
    "給定二元樹的前序走訪 preorder 與中序走訪 inorder，請構造並回傳該二元樹。前序序列的第 preIdx 個元素必為當前子樹的根節點 rootVal；透過雜湊表在 O(1) 內查出 rootVal 在 inorder 中的位置 mid，即可將 inorder 切分為左子樹區間 [inL..mid-1] 與右子樹區間 [mid+1..inR]，遞迴完成建樹。",
  argNames: ["preorder", "inorder"],

  presets: [
    { name: "標準完整範例 ([3,9,20,15,7])", args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]] },
    { name: "完美對稱 3 層二元樹 ([1,2,4,5,3,6,7])", args: [[1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]] },
    { name: "左偏斜二元樹 ([1,2,3])", args: [[1, 2, 3], [3, 2, 1]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">TreeNode</span>* <span class="tok-fn">build</span>(<span class="tok-type">int</span>&amp; preIdx, <span class="tok-type">int</span> inL, <span class="tok-type">int</span> inR, <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; pre, <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">int</span>,<span class="tok-type">int</span>&gt;&amp; pos) {` },
    { line: 2, code: `    <span class="tok-kw">if</span> (inL &gt; inR) <span class="tok-kw">return</span> <span class="tok-kw">nullptr</span>;` },
    { line: 3, code: `    <span class="tok-type">int</span> rootVal = pre[preIdx++];` },
    { line: 4, code: `    <span class="tok-type">TreeNode</span>* root = <span class="tok-kw">new</span> <span class="tok-fn">TreeNode</span>(rootVal);` },
    { line: 5, code: `    <span class="tok-type">int</span> mid = pos[rootVal]; <span class="tok-cmt">// 於 inorder 中切分左右子樹</span>` },
    { line: 6, code: `    root-&gt;left  = <span class="tok-fn">build</span>(preIdx, inL, mid - <span class="tok-num">1</span>, pre, pos);` },
    { line: 7, code: `    root-&gt;right = <span class="tok-fn">build</span>(preIdx, mid + <span class="tok-num">1</span>, inR, pre, pos);` },
    { line: 8, code: `    <span class="tok-kw">return</span> root;` },
    { line: 9, code: `}` }
  ],

  generateTrace(preInput, inInput) {
    let preorder = Array.isArray(preInput) && preInput.length > 0 ? preInput.map(Number) : [3, 9, 20, 15, 7];
    let inorder = Array.isArray(inInput) && inInput.length === preorder.length ? inInput.map(Number) : [9, 3, 15, 20, 7];

    // Validate that preorder and inorder contain the same elements
    const sortedPre = [...preorder].sort((a, b) => a - b).join(",");
    const sortedIn = [...inorder].sort((a, b) => a - b).join(",");
    if (sortedPre !== sortedIn) {
      preorder = [3, 9, 20, 15, 7];
      inorder = [9, 3, 15, 20, 7];
    }

    const posMap = {};
    inorder.forEach((v, idx) => {
      posMap[v] = idx;
    });

    const builtNodes = [];
    const builtEdges = [];
    const steps = [];
    let preIdx = 0;

    const buildBoards = (opts = {}) => {
      const {
        curPreIdx = -1,
        inL = -1,
        inR = -1,
        mid = -1,
        activeNodeId = null,
        finished = false,
        connectors = []
      } = opts;

      const preDone = [];
      for (let k = 0; k < curPreIdx; k++) preDone.push(k);

      const inHl = [];
      if (inL >= 0 && inR >= inL) {
        for (let k = inL; k <= inR; k++) {
          if (k !== mid) inHl.push(k);
        }
      }

      const inPtrs = [];
      if (inL >= 0 && inL < inorder.length) inPtrs.push({ idx: inL, label: `inL=${inL}`, color: "blue" });
      if (mid >= 0 && mid < inorder.length) inPtrs.push({ idx: mid, label: `mid=${mid}`, color: "green" });
      if (inR >= 0 && inR < inorder.length && inR !== inL) inPtrs.push({ idx: inR, label: `inR=${inR}`, color: "purple" });

      return {
        boards: [
          {
            id: "pre",
            type: "array",
            name: "preorder",
            typeLabel: "前序序列 (根 → 左 → 右)",
            x: 325,
            y: 52,
            values: preorder,
            hl: curPreIdx >= 0 && curPreIdx < preorder.length ? [curPreIdx] : [],
            done: preDone,
            pointers:
              curPreIdx >= 0 && curPreIdx < preorder.length
                ? [{ idx: curPreIdx, label: `preIdx=${curPreIdx}`, color: "blue" }]
                : []
          },
          {
            id: "ino",
            type: "array",
            name: "inorder",
            typeLabel: "中序序列 (左 → 根 → 右)",
            x: 325,
            y: 175,
            values: inorder,
            hl: inHl,
            match: mid >= 0 ? [mid] : [],
            pointers: inPtrs
          },
          {
            id: "vars",
            type: "vars",
            name: "build_vars",
            typeLabel: "遞迴建樹區間",
            x: 24,
            y: 205,
            items: [
              { id: "range", name: "[inL, inR]", val: inL >= 0 ? `[${inL}, ${inR}]` : "-", status: "hl" },
              { id: "mid", name: "mid (根索引)", val: mid >= 0 ? String(mid) : "-", status: mid >= 0 ? "match" : "" }
            ]
          },
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "constructed_tree",
            typeLabel: `逐步構造之二元樹 (${builtNodes.length}/${preorder.length})`,
            x: 325,
            y: 300,
            width: 620,
            height: 280,
            nodes: builtNodes.map((nd) => ({
              ...nd,
              status: finished ? "match" : nd.id === activeNodeId ? "hl" : "match",
              ptr: nd.id === activeNodeId ? "new" : ""
            })),
            edges: [...builtEdges]
          }
        ],
        connectors
      };
    };

    steps.push({
      line: 1,
      tag: "建立中序索引表並啟動遞迴",
      tagType: "default",
      inlineBadge: `inL = 0, inR = ${inorder.length - 1}`,
      explanation: `先將 inorder 每個值對應的索引存入雜湊表 pos，接著從 preIdx = 0、區間 [0, ${inorder.length - 1}] 開始遞迴建樹。`,
      vars: { preIdx: 0, rootVal: "-", mid: "-", "[inL,inR]": `[0, ${inorder.length - 1}]` },
      state: buildBoards({ curPreIdx: 0, inL: 0, inR: inorder.length - 1 })
    });

    function buildTree(inL, inR, depth, x, y, spread, parentId, sideLabel) {
      if (inL > inR || preIdx >= preorder.length) return;

      const curPre = preIdx;
      const rootVal = preorder[preIdx++];
      const mid = posMap[rootVal];
      const nodeId = `n_${curPre}`;

      builtNodes.push({
        id: nodeId,
        val: String(rootVal),
        sub: `in[${mid}]`,
        x: Math.round(x),
        y: Math.round(y)
      });

      if (parentId) {
        builtEdges.push({
          from: parentId,
          to: nodeId,
          label: sideLabel,
          dir: true,
          status: "hl"
        });
      }

      steps.push({
        line: 5,
        tag: `建立節點 ${rootVal} (切分點 mid=${mid})`,
        tagType: "tag-insert",
        inlineBadge: `pre[${curPre}]=${rootVal} → inorder[${mid}]`,
        explanation: `從 preorder[${curPre}] 取出當前子樹根節點 ${rootVal}，查表得其在 inorder 的索引 mid = ${mid}；因此左子樹區間為 [${inL}, ${mid - 1}]，右子樹區間為 [${mid + 1}, ${inR}]。`,
        vars: { preIdx, rootVal, mid, "[inL,inR]": `[${inL}, ${inR}]` },
        state: buildBoards({
          curPreIdx: curPre,
          inL,
          inR,
          mid,
          activeNodeId: nodeId,
          connectors: [
            { from: `wb-cw-pre-${curPre}`, to: `wb-cw-ino-${mid}`, label: `定位根 ${rootVal}`, color: "green" },
            { from: `wb-cw-ino-${mid}`, to: `wb-node-tree-${nodeId}`, label: `new TreeNode(${rootVal})`, color: "purple" }
          ]
        })
      });

      const nextSpread = Math.max(68, Math.round(spread * 0.52));
      buildTree(inL, mid - 1, depth + 1, x - spread, y + 74, nextSpread, nodeId, "L");
      buildTree(mid + 1, inR, depth + 1, x + spread, y + 74, nextSpread, nodeId, "R");
    }

    buildTree(0, inorder.length - 1, 0, 310, 42, 140, null, "");

    steps.push({
      line: 8,
      tag: "二元樹構造完成！",
      tagType: "tag-found",
      inlineBadge: `共建立 ${builtNodes.length} 個節點`,
      explanation: `所有前序與中序區間皆已遞迴構造完畢，成功還原整棵二元樹並回傳根節點！`,
      vars: { preIdx, rootVal: preorder[0], mid: posMap[preorder[0]], "[inL,inR]": "完成" },
      state: buildBoards({ finished: true })
    });

    return steps;
  }
};

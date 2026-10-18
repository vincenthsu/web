/**
 * Week 2 (#14 ~ #25) — Grind 75 C++17 手動跑題白板視覺化題庫模組
 * 嚴格遵循 DESIGN.md 與 VisualizerPlayer 宣告式渲染規範 (state.boards & state.connectors)
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #14 First Bad Version (LC #278, Easy, Binary Search)
// ============================================================================
window.PROBLEMS["first-bad-version"] = {
  id: 14,
  leetcodeId: 278,
  slug: "first-bad-version",
  title: "278. First Bad Version (第一個錯誤的版本)",
  difficulty: "Easy",
  topic: "Binary Search",
  mins: 20,
  complexity: "Time O(log N) · Space O(1)",
  argNames: ["n", "bad"],
  description:
    "你是產品經理，目前正在帶領團隊開發新產品。假設有 1..n 個版本，自從某個版本 bad 出錯後，其後所有版本皆會出錯。請呼叫最少次數的 isBadVersion(version) 找出第一個錯誤的版本。使用二分搜尋可在 O(log N) 時間內定位左邊界。",

  presets: [
    { name: "範例 1：n = 7, bad = 4", args: [7, 4] },
    { name: "範例 2：n = 8, bad = 6", args: [8, 6] },
    { name: "邊界情況：n = 5, bad = 1 (首版即損壞)", args: [5, 1] },
    { name: "邊界情況：n = 6, bad = 6 (末版損壞)", args: [6, 6] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">firstBadVersion</span>(<span class="tok-type">int</span> n) {` },
    { line: 2, code: `    <span class="tok-type">int</span> left = <span class="tok-num">1</span>, right = n;` },
    { line: 3, code: `    <span class="tok-kw">while</span> (left &lt; right) {` },
    { line: 4, code: `        <span class="tok-type">int</span> mid = left + (right - left) / <span class="tok-num">2</span>;` },
    { line: 5, code: `        <span class="tok-kw">if</span> (<span class="tok-fn">isBadVersion</span>(mid)) {` },
    { line: 6, code: `            right = mid;     <span class="tok-cmt">// 第一個錯誤版本在 [left, mid]</span>` },
    { line: 7, code: `        } <span class="tok-kw">else</span> {` },
    { line: 8, code: `            left = mid + <span class="tok-num">1</span>;  <span class="tok-cmt">// 第一個錯誤版本在 [mid+1, right]</span>` },
    { line: 9, code: `        }` },
    { line: 10, code: `    }` },
    { line: 11, code: `    <span class="tok-kw">return</span> left;` },
    { line: 12, code: `}` }
  ],

  generateTrace(nInput, badInput) {
    const n = Math.max(1, Math.min(12, Number(nInput) || 7));
    const bad = Math.max(1, Math.min(n, Number(badInput) || 4));
    const versions = Array.from({ length: n }, (_, i) => i + 1);
    const steps = [];

    let left = 1;
    let right = n;
    let mid = null;
    const checkedGood = new Set();
    const checkedBad = new Set();

    const buildState = (opts = {}) => {
      const {
        hlIdx = [],
        matchIdx = [],
        statusMid = "",
        statusIsBad = "",
        statusRet = "",
        isBadVal = "-",
        retVal = "-",
        conn = []
      } = opts;

      const warn = [];
      const done = [];
      for (let idx = 0; idx < n; idx++) {
        const v = idx + 1;
        if (matchIdx.includes(idx)) continue;
        if (checkedBad.has(v)) warn.push(idx);
        else if (checkedGood.has(v) || v < left || v > right) done.push(idx);
      }

      const pointers = [];
      if (left >= 1 && left <= n) {
        pointers.push({ idx: left - 1, label: `L=${left}`, color: "blue" });
      }
      if (mid !== null && mid >= 1 && mid <= n) {
        pointers.push({ idx: mid - 1, label: `mid=${mid}`, color: "purple" });
      }
      if (right >= 1 && right <= n) {
        pointers.push({ idx: right - 1, label: `R=${right}`, color: "red" });
      }

      return {
        boards: [
          {
            id: "ver",
            type: "array",
            name: "versions",
            typeLabel: `版本序列 1..${n} (隱藏 bad=${bad})`,
            x: 325,
            y: 52,
            values: versions.map((v) => `v${v}`),
            indexLabels: versions,
            hl: hlIdx,
            match: matchIdx,
            done,
            warn,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "binary_search_vars",
            typeLabel: "二分搜尋左邊界狀態",
            x: 24,
            y: 225,
            items: [
              { id: "v_range", name: "搜尋區間 [L, R]", val: `[${left}, ${right}]`, status: "" },
              { id: "v_mid", name: "mid", val: mid !== null ? `${mid}` : "-", status: statusMid },
              { id: "v_api", name: "isBadVersion(mid)", val: isBadVal, status: statusIsBad },
              { id: "v_ret", name: "return", val: retVal, status: statusRet }
            ]
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 2,
      tag: "初始化搜尋邊界",
      tagType: "default",
      inlineBadge: `left = 1, right = ${n}`,
      explanation: `將二分搜尋左右邊界設為版本區間 [1, ${n}]，準備透過 isBadVersion(mid) 縮小範圍。`,
      vars: { left, right, mid: "-", return: "-" },
      state: buildState()
    });

    while (left < right) {
      mid = left + Math.floor((right - left) / 2);
      const midIdx = mid - 1;

      steps.push({
        line: 4,
        tag: "計算中間版本 mid",
        tagType: "tag-check",
        inlineBadge: `mid = ${left} + (${right}-${left})/2 = ${mid}`,
        explanation: `左邊界 left=${left} < right=${right}，以防溢位寫法計算中間版本 mid = ${mid}。`,
        vars: { left, right, mid, return: "-" },
        state: buildState({
          hlIdx: [midIdx],
          statusMid: "hl",
          conn: [{ from: `wb-cw-ver-${midIdx}`, to: "wb-var-v_mid", label: `檢查 v${mid}`, color: "blue" }]
        })
      });

      const isBad = mid >= bad;
      if (isBad) checkedBad.add(mid);
      else checkedGood.add(mid);

      steps.push({
        line: 5,
        tag: `呼叫 isBadVersion(${mid})`,
        tagType: isBad ? "tag-insert" : "tag-check",
        inlineBadge: `isBadVersion(${mid}) == ${isBad}`,
        explanation: isBad
          ? `呼叫 API 發現版本 v${mid} 是錯誤版本 (true)！代表第一個錯誤版本必在 [${left}, ${mid}] 之間。`
          : `呼叫 API 發現版本 v${mid} 是正常版本 (false)！代表 v1..v${mid} 全數正常，第一個錯誤版本必在 [${mid + 1}, ${right}]。`,
        vars: { left, right, mid, return: "-" },
        state: buildState({
          hlIdx: [midIdx],
          statusIsBad: isBad ? "warn" : "hl",
          isBadVal: isBad ? "true (錯誤版本)" : "false (正常版本)",
          conn: [
            {
              from: `wb-cw-ver-${midIdx}`,
              to: "wb-var-v_api",
              label: isBad ? `v${mid} 已損壞!` : `v${mid} 正常`,
              color: isBad ? "red" : "green"
            }
          ]
        })
      });

      if (isBad) {
        right = mid;
        steps.push({
          line: 6,
          tag: "收縮右邊界 right = mid",
          tagType: "tag-insert",
          inlineBadge: `right = ${right}`,
          explanation: `因為 v${mid} 本身可能就是第一個錯誤版本，不可排除 mid，將 right 收縮為 ${right}。`,
          vars: { left, right, mid, return: "-" },
          state: buildState({
            hlIdx: [midIdx],
            isBadVal: "true (錯誤版本)"
          })
        });
      } else {
        left = mid + 1;
        steps.push({
          line: 8,
          tag: "推進左邊界 left = mid + 1",
          tagType: "tag-check",
          inlineBadge: `left = ${left}`,
          explanation: `因為 v${mid} 正常，第一個錯誤版本一定在 mid 右側，將 left 推進至 ${left}。`,
          vars: { left, right, mid, return: "-" },
          state: buildState({
            isBadVal: "false (正常版本)"
          })
        });
      }
    }

    checkedBad.add(left);
    steps.push({
      line: 11,
      tag: "收斂完成，回傳答案",
      tagType: "tag-found",
      inlineBadge: `return ${left}`,
      explanation: `當 left == right == ${left} 時迴圈結束，搜尋區間收斂為單點，版本 v${left} 即為第一個錯誤的版本！`,
      vars: { left, right, mid: mid !== null ? mid : "-", return: left },
      state: buildState({
        matchIdx: [left - 1],
        statusRet: "match",
        retVal: `${left} (v${left})`,
        conn: [{ from: `wb-cw-ver-${left - 1}`, to: "wb-var-v_ret", label: `找到首個損壞版本 v${left}`, color: "green" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #15 Ransom Note (LC #383, Easy, Hash Table)
// ============================================================================
window.PROBLEMS["ransom-note"] = {
  id: 15,
  leetcodeId: 383,
  slug: "ransom-note",
  title: "383. Ransom Note (贖金信)",
  difficulty: "Easy",
  topic: "Hash Table",
  mins: 15,
  complexity: "Time O(M + N) · Space O(1)",
  argNames: ["ransomNote", "magazine"],
  description:
    "給定兩個字串 ransomNote（贖金信）與 magazine（雜誌），判斷 ransomNote 能不能由 magazine 裡面的字元構成（雜誌中的每個字元只能使用一次）。先統計 magazine 的字元頻率表，再逐一扣除 ransomNote 所需字元。",

  presets: [
    { name: "範例 1：\"aab\" 與 \"baa\" (可構成 true)", args: ["aab", "baa"] },
    { name: "範例 2：\"aa\" 與 \"ab\" (字元不足 false)", args: ["aa", "ab"] },
    { name: "範例 3：\"code\" 與 \"leetcode\" (可構成 true)", args: ["code", "leetcode"] },
    { name: "範例 4：\"az\" 與 \"abc\" (缺字元 false)", args: ["az", "abc"] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">bool</span> <span class="tok-fn">canConstruct</span>(<span class="tok-type">string</span> ransomNote, <span class="tok-type">string</span> magazine) {` },
    { line: 2, code: `    <span class="tok-type">int</span> freq[<span class="tok-num">26</span>] = {<span class="tok-num">0</span>};` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">char</span> c : magazine) {` },
    { line: 4, code: `        freq[c - <span class="tok-num">'a'</span>]++;` },
    { line: 5, code: `    }` },
    { line: 6, code: `    <span class="tok-kw">for</span> (<span class="tok-type">char</span> c : ransomNote) {` },
    { line: 7, code: `        <span class="tok-kw">if</span> (--freq[c - <span class="tok-num">'a'</span>] &lt; <span class="tok-num">0</span>) {` },
    { line: 8, code: `            <span class="tok-kw">return</span> <span class="tok-kw">false</span>;` },
    { line: 9, code: `        }` },
    { line: 10, code: `    }` },
    { line: 11, code: `    <span class="tok-kw">return</span> <span class="tok-kw">true</span>;` },
    { line: 12, code: `}` }
  ],

  generateTrace(ransomInput, magInput) {
    const ransomNote = String(ransomInput || "aab");
    const magazine = String(magInput || "baa");
    const rChars = ransomNote.split("");
    const freqMap = {};
    const steps = [];

    const buildDictRows = (activeChar = null, activeMode = "") => {
      return Object.keys(freqMap)
        .sort()
        .map((ch) => {
          const cnt = freqMap[ch];
          let status = "";
          let note = cnt > 0 ? `剩餘 ${cnt} 個` : cnt === 0 ? "剛好用盡" : "❌ 不足 (< 0)";
          if (ch === activeChar) {
            status = activeMode === "hit" ? "hit" : "inserted";
            if (activeMode === "add") note = `＋ 累計至 ${cnt}`;
            else if (activeMode === "use") note = `✓ 扣除後剩 ${cnt}`;
            else if (activeMode === "fail") note = `❌ 不足 (${cnt} < 0)`;
          }
          return { id: ch, key: `'${ch}'`, val: `${cnt}`, note, status };
        });
    };

    const buildState = (opts = {}) => {
      const {
        rIdx = -1,
        rDone = [],
        rMatch = [],
        rWarn = [],
        activeChar = null,
        activeMode = "",
        phase = "統計 magazine",
        retVal = "-",
        retStatus = "",
        conn = []
      } = opts;

      const ptrs = [];
      if (rIdx >= 0) {
        ptrs.push({
          idx: rIdx,
          label: `c='${rChars[rIdx]}'`,
          color: rWarn.includes(rIdx) ? "red" : "blue"
        });
      }

      return {
        boards: [
          {
            id: "ransom",
            type: "array",
            name: "ransomNote",
            typeLabel: `目標字串 "${ransomNote}"`,
            x: 325,
            y: 52,
            values: rChars,
            hl: rIdx >= 0 && !rWarn.includes(rIdx) && !rMatch.includes(rIdx) ? [rIdx] : [],
            match: rMatch,
            done: rDone,
            warn: rWarn,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "執行階段與結果",
            x: 24,
            y: 205,
            items: [
              { id: "mag_str", name: "magazine", val: `"${magazine}"`, status: phase === "統計 magazine" ? "hl" : "" },
              { id: "cur_c", name: "當前字元 c", val: activeChar ? `'${activeChar}'` : "-", status: activeChar ? "hl" : "" },
              { id: "ret", name: "return", val: retVal, status: retStatus }
            ]
          },
          {
            id: "freq",
            type: "dict",
            name: "freq",
            typeLabel: "字元庫存表 (int freq[26])",
            x: 325,
            y: 205,
            headers: ["字元 key", "庫存數量", "狀態說明"],
            rows: buildDictRows(activeChar, activeMode),
            slot: { key: "a..z", val: "0", note: "其餘字元庫存為 0" }
          }
        ],
        connectors: conn
      };
    };

    // Step 1: 統計 magazine
    for (const ch of magazine) {
      freqMap[ch] = (freqMap[ch] || 0) + 1;
    }

    steps.push({
      line: 4,
      tag: "統計 magazine 字元庫存",
      tagType: "tag-insert",
      inlineBadge: `magazine = "${magazine}"`,
      explanation: `掃描 magazine ("${magazine}") 的所有字元，將各字元出現次數記錄至雜湊表 freq 中作為可用庫存。`,
      vars: { phase: "統計雜誌", char_c: "-", "freq[c]": "-", return: "-" },
      state: buildState({ phase: "統計 magazine" })
    });

    // Step 2: 逐一檢查 ransomNote
    const doneIndices = [];
    for (let i = 0; i < rChars.length; i++) {
      const c = rChars[i];
      freqMap[c] = (freqMap[c] || 0) - 1;
      const afterCnt = freqMap[c];

      if (afterCnt < 0) {
        steps.push({
          line: 7,
          tag: `扣除 '${c}' 庫存不足`,
          tagType: "tag-insert",
          inlineBadge: `--freq['${c}'] = ${afterCnt} (< 0)`,
          explanation: `檢查 ransomNote[${i}] = '${c}'，將庫存減 1 後變為 ${afterCnt} (< 0)，代表雜誌中的 '${c}' 不夠用！`,
          vars: { phase: "檢查贖金信", char_c: `'${c}'`, "freq[c]": afterCnt, return: "-" },
          state: buildState({
            rIdx: i,
            rDone: [...doneIndices],
            rWarn: [i],
            activeChar: c,
            activeMode: "fail",
            phase: "檢查 ransomNote",
            conn: [{ from: `wb-cw-ransom-${i}`, to: `wb-dict-row-${c}`, label: `--freq['${c}'] = ${afterCnt}`, color: "red" }]
          })
        });

        steps.push({
          line: 8,
          tag: "無法構成，回傳 false",
          tagType: "tag-insert",
          inlineBadge: "return false",
          explanation: `字元 '${c}' 庫存小於 0，無法拼出贖金信，立即回傳 false。`,
          vars: { phase: "結束", char_c: `'${c}'`, "freq[c]": afterCnt, return: "false" },
          state: buildState({
            rIdx: i,
            rDone: [...doneIndices],
            rWarn: [i],
            activeChar: c,
            activeMode: "fail",
            phase: "結束",
            retVal: "false",
            retStatus: "warn",
            conn: [{ from: `wb-dict-row-${c}`, to: "wb-var-ret", label: "庫存不足 → false", color: "red" }]
          })
        });

        return steps;
      }

      steps.push({
        line: 7,
        tag: `扣除字元 '${c}' 庫存`,
        tagType: "tag-check",
        inlineBadge: `--freq['${c}'] = ${afterCnt} (>= 0)`,
        explanation: `贖金信第 ${i} 個字元需要 '${c}'，從 freq['${c}'] 扣除 1 後剩餘 ${afterCnt} (>= 0)，庫存充足。`,
        vars: { phase: "檢查贖金信", char_c: `'${c}'`, "freq[c]": afterCnt, return: "-" },
        state: buildState({
          rIdx: i,
          rDone: [...doneIndices],
          activeChar: c,
          activeMode: "hit",
          phase: "檢查 ransomNote",
          conn: [{ from: `wb-cw-ransom-${i}`, to: `wb-dict-row-${c}`, label: `消耗 1 個 '${c}' (剩 ${afterCnt})`, color: "green" }]
        })
      });

      doneIndices.push(i);
    }

    steps.push({
      line: 11,
      tag: "全部字元皆滿足，回傳 true",
      tagType: "tag-found",
      inlineBadge: "return true",
      explanation: `ransomNote 所有字元皆成功從 magazine 庫存中抵扣完畢，回傳 true！`,
      vars: { phase: "完成", char_c: "-", "freq[c]": "-", return: "true" },
      state: buildState({
        rMatch: rChars.map((_, idx) => idx),
        phase: "完成",
        retVal: "true",
        retStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #16 Climbing Stairs (LC #70, Easy, Dynamic Programming)
// ============================================================================
window.PROBLEMS["climbing-stairs"] = {
  id: 16,
  leetcodeId: 70,
  slug: "climbing-stairs",
  title: "70. Climbing Stairs (爬樓梯)",
  difficulty: "Easy",
  topic: "Dynamic Programming",
  mins: 20,
  complexity: "Time O(N) · Space O(N)",
  argNames: ["n"],
  description:
    "假設你正在爬樓梯，需要 n 階才能到達樓頂。每次你可以爬 1 或 2 個台階。請問有多少種不同的方法可以爬到樓頂？狀態轉移方程為 dp[i] = dp[i - 1] + dp[i - 2]（費氏數列）。",

  presets: [
    { name: "範例 1：n = 4 (共 5 種走法)", args: [4] },
    { name: "範例 2：n = 5 (共 8 種走法)", args: [5] },
    { name: "範例 3：n = 6 (共 13 種走法)", args: [6] },
    { name: "邊界情況：n = 2 (共 2 種走法)", args: [2] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">climbStairs</span>(<span class="tok-type">int</span> n) {` },
    { line: 2, code: `    <span class="tok-kw">if</span> (n &lt;= <span class="tok-num">2</span>) <span class="tok-kw">return</span> n;` },
    { line: 3, code: `    <span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt; dp(n + <span class="tok-num">1</span>, <span class="tok-num">0</span>);` },
    { line: 4, code: `    dp[<span class="tok-num">1</span>] = <span class="tok-num">1</span>; dp[<span class="tok-num">2</span>] = <span class="tok-num">2</span>;` },
    { line: 5, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">3</span>; i &lt;= n; ++i) {` },
    { line: 6, code: `        dp[i] = dp[i - <span class="tok-num">1</span>] + dp[i - <span class="tok-num">2</span>];` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">return</span> dp[n];` },
    { line: 9, code: `}` }
  ],

  generateTrace(nInput) {
    const n = Math.max(1, Math.min(10, Number(nInput) || 5));
    const steps = [];
    const dp = Array(n + 1).fill(0);

    const buildState = (opts = {}) => {
      const {
        curI = -1,
        hl = [],
        match = [],
        done = [],
        formulaVal = "-",
        retVal = "-",
        retStatus = "",
        conn = []
      } = opts;

      const ptrs = [];
      if (curI >= 3) {
        ptrs.push({ idx: curI - 2, label: "i-2", color: "purple" });
        ptrs.push({ idx: curI - 1, label: "i-1", color: "green" });
        ptrs.push({ idx: curI, label: `i=${curI}`, color: "blue" });
      }

      return {
        boards: [
          {
            id: "dp",
            type: "array",
            name: "dp",
            typeLabel: `一維 DP 表 vector<int> dp(0..${n})`,
            x: 325,
            y: 52,
            values: [...dp],
            indexLabels: dp.map((_, idx) => `階${idx}`),
            hl,
            match,
            done,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "dp_vars",
            typeLabel: "狀態轉移方程式",
            x: 24,
            y: 225,
            items: [
              { id: "v_n", name: "目標階數 n", val: `${n}`, status: "" },
              { id: "v_eq", name: "dp[i] = dp[i-1] + dp[i-2]", val: formulaVal, status: formulaVal !== "-" ? "hl" : "" },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          }
        ],
        connectors: conn
      };
    };

    if (n <= 2) {
      dp[n] = n;
      steps.push({
        line: 2,
        tag: "基底情況直接回傳",
        tagType: "tag-found",
        inlineBadge: `n = ${n} <= 2 -> return ${n}`,
        explanation: `當 n = ${n} <= 2 時，方法數即為 ${n} 種，直接回傳 ${n}。`,
        vars: { i: "-", "dp[i-1]": "-", "dp[i-2]": "-", return: n },
        state: buildState({ match: [n], retVal: `${n}`, retStatus: "match" })
      });
      return steps;
    }

    dp[1] = 1;
    dp[2] = 2;
    steps.push({
      line: 4,
      tag: "設定 DP 基底狀態",
      tagType: "tag-insert",
      inlineBadge: "dp[1] = 1, dp[2] = 2",
      explanation: `初始化一維 DP 陣列：爬到第 1 階有 dp[1]=1 種方法，爬到第 2 階有 dp[2]=2 種方法 (1+1 或 2)。`,
      vars: { i: "-", "dp[i-1]": 2, "dp[i-2]": 1, return: "-" },
      state: buildState({ hl: [1, 2], done: [0] })
    });

    for (let i = 3; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
      const doneArr = Array.from({ length: i - 2 }, (_, k) => k);
      const eqStr = `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`;

      steps.push({
        line: 6,
        tag: `狀態轉移計算 dp[${i}]`,
        tagType: "tag-check",
        inlineBadge: eqStr,
        explanation: `計算第 ${i} 階：可從第 ${i - 1} 階跨 1 步 (${dp[i - 1]} 種) 或從第 ${i - 2} 階跨 2 步 (${dp[i - 2]} 種) 到達，故 dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}。`,
        vars: { i, "dp[i-1]": dp[i - 1], "dp[i-2]": dp[i - 2], return: "-" },
        state: buildState({
          curI: i,
          hl: [i],
          match: [i - 1, i - 2],
          done: doneArr,
          formulaVal: eqStr,
          conn: [
            { from: `wb-cw-dp-${i}`, to: "wb-var-v_eq", label: `${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`, color: "blue" }
          ]
        })
      });
    }

    steps.push({
      line: 8,
      tag: "回傳 dp[n] 總方法數",
      tagType: "tag-found",
      inlineBadge: `return dp[${n}] = ${dp[n]}`,
      explanation: `動態規劃填表完成，爬到第 ${n} 階共有 dp[${n}] = ${dp[n]} 種不同方法！`,
      vars: { i: n, "dp[i-1]": dp[n - 1], "dp[i-2]": dp[n - 2], return: dp[n] },
      state: buildState({
        match: [n],
        done: Array.from({ length: n }, (_, k) => k),
        formulaVal: `dp[${n}] = ${dp[n]}`,
        retVal: `${dp[n]}`,
        retStatus: "match",
        conn: [{ from: `wb-cw-dp-${n}`, to: "wb-var-v_ret", label: `答案 dp[${n}] = ${dp[n]}`, color: "green" }]
      })
    });

    return steps;
  }
};

// ============================================================================
// #17 Longest Palindrome (LC #409, Easy, String)
// ============================================================================
window.PROBLEMS["longest-palindrome"] = {
  id: 17,
  leetcodeId: 409,
  slug: "longest-palindrome",
  title: "409. Longest Palindrome (最長迴文串)",
  difficulty: "Easy",
  topic: "String",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["s"],
  description:
    "給定一個包含大小寫字母的字串 s，回傳通過這些字母可以構造出的最長迴文串的長度。每個字母若出現 cnt 次，可以對稱放入 (cnt / 2) * 2 個字元；若最終長度小於原字串長度，代表還有剩餘的奇數字元可放進迴文正中央（長度 +1）。",

  presets: [
    { name: "範例 1：\"abccccdd\" (最長 7，如 dccaccd)", args: ["abccccdd"] },
    { name: "範例 2：\"aabbcc\" (全偶數，最長 6)", args: ["aabbcc"] },
    { name: "範例 3：\"bananas\" (最長 5，如 anana)", args: ["bananas"] },
    { name: "邊界情況：\"a\" (單一字元，最長 1)", args: ["a"] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">longestPalindrome</span>(<span class="tok-type">string</span> s) {` },
    { line: 2, code: `    <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">char</span>, <span class="tok-type">int</span>&gt; freq;` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">char</span> c : s) freq[c]++;` },
    { line: 4, code: `    <span class="tok-type">int</span> length = <span class="tok-num">0</span>;` },
    { line: 5, code: `    <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; [ch, cnt] : freq) {` },
    { line: 6, code: `        length += (cnt / <span class="tok-num">2</span>) * <span class="tok-num">2</span>;` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">if</span> (length &lt; s.<span class="tok-fn">size</span>()) length++;` },
    { line: 9, code: `    <span class="tok-kw">return</span> length;` },
    { line: 10, code: `}` }
  ],

  generateTrace(sInput) {
    const s = String(sInput || "abccccdd");
    const chars = s.split("");
    const freq = {};
    for (const c of chars) freq[c] = (freq[c] || 0) + 1;
    const keys = Object.keys(freq);
    const steps = [];

    let length = 0;
    const processedKeys = new Set();

    const buildState = (opts = {}) => {
      const {
        activeKey = null,
        hlChars = [],
        matchChars = [],
        pairFormula = "-",
        retVal = "-",
        retStatus = "",
        oddNote = "-",
        conn = []
      } = opts;

      const dictRows = keys.map((k) => {
        const cnt = freq[k];
        const pairs = Math.floor(cnt / 2) * 2;
        const isAct = k === activeKey;
        const isDone = processedKeys.has(k);
        return {
          id: k,
          key: `'${k}'`,
          val: `${cnt}`,
          note: isAct || isDone ? `成對貢獻 +${pairs}${cnt % 2 === 1 ? " (剩1單數)" : ""}` : "待統計",
          status: isAct ? "hit" : isDone ? "inserted" : ""
        };
      });

      return {
        boards: [
          {
            id: "str",
            type: "array",
            name: "s",
            typeLabel: `輸入字串 (長度 ${s.length})`,
            x: 325,
            y: 52,
            values: chars,
            hl: hlChars,
            match: matchChars,
            done: []
          },
          {
            id: "vars",
            type: "vars",
            name: "pal_vars",
            typeLabel: "迴文長度累加器",
            x: 24,
            y: 205,
            items: [
              { id: "v_len", name: "length", val: `${length}`, status: activeKey ? "hl" : "" },
              { id: "v_pair", name: "本步成對貢獻", val: pairFormula, status: pairFormula !== "-" ? "hl" : "" },
              { id: "v_odd", name: "中央單數字元", val: oddNote, status: oddNote.includes("+1") ? "match" : "" },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          },
          {
            id: "freq",
            type: "dict",
            name: "freq",
            typeLabel: "字元頻率表 (unordered_map<char,int>)",
            x: 325,
            y: 205,
            headers: ["字元 ch", "次數 cnt", "迴文成對貢獻"],
            rows: dictRows
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 3,
      tag: "統計所有字元出現次數",
      tagType: "tag-insert",
      inlineBadge: `freq 共 ${keys.length} 種字元`,
      explanation: `掃描字串 s = "${s}"，統計每個字元的出現頻率存入雜湊表 freq。`,
      vars: { ch: "-", cnt: "-", length: 0, return: "-" },
      state: buildState()
    });

    for (const k of keys) {
      const cnt = freq[k];
      const add = Math.floor(cnt / 2) * 2;
      length += add;
      processedKeys.add(k);

      const chIndices = chars.map((c, idx) => (c === k ? idx : -1)).filter((idx) => idx >= 0);

      steps.push({
        line: 6,
        tag: `計算 '${k}' 的成對貢獻`,
        tagType: add > 0 ? "tag-check" : "default",
        inlineBadge: `cnt=${cnt} -> +${add} (length=${length})`,
        explanation: `字元 '${k}' 出現 ${cnt} 次，可對稱放入迴文左右兩側共 (${cnt}/2)*2 = ${add} 個，目前 length = ${length}。`,
        vars: { ch: `'${k}'`, cnt, length, return: "-" },
        state: buildState({
          activeKey: k,
          hlChars: chIndices,
          pairFormula: `(${cnt} / 2) * 2 = +${add}`,
          conn: [{ from: `wb-dict-row-${k}`, to: "wb-var-v_len", label: `+${add} -> length=${length}`, color: add > 0 ? "green" : "blue" }]
        })
      });
    }

    if (length < s.length) {
      length += 1;
      steps.push({
        line: 8,
        tag: "放入正中央單數字元 (+1)",
        tagType: "tag-insert",
        inlineBadge: `length < ${s.length} -> length++ (${length})`,
        explanation: `目前偶數配對長度 ${length - 1} 小於原字串長度 ${s.length}，代表至少有 1 個落單字元可放在迴文正中央，length 加 1 變為 ${length}。`,
        vars: { ch: "-", cnt: "-", length, return: "-" },
        state: buildState({
          oddNote: "有落單字元 (+1)",
          conn: [{ from: "wb-var-v_odd", to: "wb-var-v_len", label: "中央放 1 個奇數字元", color: "purple" }]
        })
      });
    } else {
      steps.push({
        line: 8,
        tag: "檢查是否有落單字元",
        tagType: "default",
        inlineBadge: `length == ${s.length} (無剩餘字元)`,
        explanation: `所有字元出現次數皆為偶數，已全數放入迴文中 (length == ${s.length})，無需額外加 1。`,
        vars: { ch: "-", cnt: "-", length, return: "-" },
        state: buildState({ oddNote: "無落單字元 (+0)" })
      });
    }

    steps.push({
      line: 9,
      tag: "回傳最長迴文長度",
      tagType: "tag-found",
      inlineBadge: `return ${length}`,
      explanation: `計算完畢，可構造出的最長迴文串長度為 ${length}。`,
      vars: { ch: "-", cnt: "-", length, return: length },
      state: buildState({
        matchChars: chars.map((_, idx) => idx),
        oddNote: length <= s.length ? `最終長度 ${length}` : "-",
        retVal: `${length}`,
        retStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #18 Reverse Linked List (LC #206, Easy, Linked List)
// ============================================================================
window.PROBLEMS["reverse-linked-list"] = {
  id: 18,
  leetcodeId: 206,
  slug: "reverse-linked-list",
  title: "206. Reverse Linked List (反轉鏈結串列)",
  difficulty: "Easy",
  topic: "Linked List",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["head"],
  description:
    "給定單向鏈結串列的頭節點 head，請原地反轉該串列並回傳反轉後的頭節點。利用三個指標 prev、curr、nextTemp，在每次迭代中將 curr->next 轉向指回 prev。",

  presets: [
    { name: "範例 1：[1, 2, 3, 4, 5]", args: [[1, 2, 3, 4, 5]] },
    { name: "範例 2：[10, 20, 30]", args: [[10, 20, 30]] },
    { name: "範例 3：[1, 2] (雙節點)", args: [[1, 2]] },
    { name: "邊界情況：[7] (單一節點)", args: [[7]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">ListNode</span>* <span class="tok-fn">reverseList</span>(<span class="tok-type">ListNode</span>* head) {` },
    { line: 2, code: `    <span class="tok-type">ListNode</span>* prev = <span class="tok-kw">nullptr</span>;` },
    { line: 3, code: `    <span class="tok-type">ListNode</span>* curr = head;` },
    { line: 4, code: `    <span class="tok-kw">while</span> (curr != <span class="tok-kw">nullptr</span>) {` },
    { line: 5, code: `        <span class="tok-type">ListNode</span>* nextTemp = curr-&gt;next;` },
    { line: 6, code: `        curr-&gt;next = prev;  <span class="tok-cmt">// 反轉 next 指標方向</span>` },
    { line: 7, code: `        prev = curr;` },
    { line: 8, code: `        curr = nextTemp;` },
    { line: 9, code: `    }` },
    { line: 10, code: `    <span class="tok-kw">return</span> prev;` },
    { line: 11, code: `}` }
  ],

  generateTrace(headInput) {
    const vals = Array.isArray(headInput) && headInput.length > 0 ? headInput.slice(0, 6) : [1, 2, 3, 4, 5];
    const n = vals.length;
    const steps = [];

    // nextTarget[i]: index of node that node i points to (-1 means nullptr)
    const nextTarget = vals.map((_, i) => (i + 1 < n ? i + 1 : -1));
    const reversedSet = new Set();

    let prev = -1;
    let curr = 0;
    let nextTemp = -1;

    const buildListBoard = (opts = {}) => {
      const { activeEdgeIdx = -1, allMatch = false, retVal = "-", retStatus = "" } = opts;
      const spacing = 86;
      const startX = 52;
      const width = Math.max(460, startX + n * spacing + 40);

      const nodes = vals.map((v, idx) => {
        const ptrLabels = [];
        if (prev === idx) ptrLabels.push("prev");
        if (curr === idx) ptrLabels.push("curr");
        if (nextTemp === idx) ptrLabels.push("next");

        let status = "";
        if (allMatch) status = "match";
        else if (curr === idx) status = "hl";
        else if (reversedSet.has(idx)) status = "match";

        const tgt = nextTarget[idx];
        const subText = tgt === -1 ? "next=null" : `next→${vals[tgt]}`;

        return {
          id: `n${idx}`,
          val: `${v}`,
          sub: subText,
          x: startX + idx * spacing,
          y: 95,
          status,
          ptr: ptrLabels.join(" / ")
        };
      });

      const edges = [];
      for (let i = 0; i < n; i++) {
        const tgt = nextTarget[i];
        if (tgt !== -1) {
          const isRev = reversedSet.has(i);
          const isAct = i === activeEdgeIdx;
          edges.push({
            from: `n${i}`,
            to: `n${tgt}`,
            label: isRev ? "←rev" : "next",
            dir: true,
            status: isAct ? "hl" : isRev ? "match" : ""
          });
        }
      }

      const prevStr = prev === -1 ? "nullptr" : `節點(${vals[prev]})`;
      const currStr = curr === -1 ? "nullptr" : `節點(${vals[curr]})`;
      const nextStr = nextTemp === -1 ? "nullptr" : `節點(${vals[nextTemp]})`;

      return {
        boards: [
          {
            id: "list",
            type: "list",
            shape: "list",
            name: "head",
            typeLabel: "單向鏈結串列 (ListNode*)",
            x: 325,
            y: 52,
            width,
            height: 195,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "ptr_vars",
            typeLabel: "三指標狀態",
            x: 24,
            y: 215,
            items: [
              { id: "v_prev", name: "prev", val: prevStr, status: prev !== -1 ? "match" : "" },
              { id: "v_curr", name: "curr", val: currStr, status: curr !== -1 ? "hl" : "" },
              { id: "v_next", name: "nextTemp", val: nextStr, status: "" },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 3,
      tag: "初始化 prev 與 curr 指標",
      tagType: "default",
      inlineBadge: `prev = nullptr, curr = Node(${vals[0]})`,
      explanation: `將 prev 設為 nullptr，curr 指向原頭節點 ${vals[0]}，準備逐一反轉每個節點的 next 指標。`,
      vars: { prev: "nullptr", curr: vals[0], nextTemp: "-", return: "-" },
      state: buildListBoard()
    });

    while (curr !== -1 && curr < n) {
      nextTemp = nextTarget[curr];
      const nextName = nextTemp === -1 ? "nullptr" : vals[nextTemp];
      const prevName = prev === -1 ? "nullptr" : vals[prev];

      steps.push({
        line: 5,
        tag: `暫存下一節點 nextTemp`,
        tagType: "tag-check",
        inlineBadge: `nextTemp = ${nextName}`,
        explanation: `在修改節點 ${vals[curr]} 的 next 之前，先用 nextTemp 記住原本的下一個節點 (${nextName})，以免斷鏈遺失。`,
        vars: { prev: prevName, curr: vals[curr], nextTemp: nextName, return: "-" },
        state: buildListBoard({ activeEdgeIdx: curr })
      });

      // Reverse pointer!
      nextTarget[curr] = prev;
      reversedSet.add(curr);

      steps.push({
        line: 6,
        tag: `反轉節點 ${vals[curr]} 的 next 指標`,
        tagType: "tag-insert",
        inlineBadge: `Node(${vals[curr]})->next = ${prevName}`,
        explanation: `執行 curr->next = prev，將節點 ${vals[curr]} 的箭頭方向原地反轉指向 ${prevName}！`,
        vars: { prev: prevName, curr: vals[curr], nextTemp: nextName, return: "-" },
        state: buildListBoard({ activeEdgeIdx: curr })
      });

      prev = curr;
      curr = nextTemp;

      steps.push({
        line: 8,
        tag: "prev 與 curr 同步向前推進",
        tagType: "default",
        inlineBadge: `prev = ${vals[prev]}, curr = ${curr === -1 ? "nullptr" : vals[curr]}`,
        explanation: `將 prev 移至剛完成反轉的節點 ${vals[prev]}，並將 curr 移至下一節點 ${curr === -1 ? "nullptr" : vals[curr]}。`,
        vars: { prev: vals[prev], curr: curr === -1 ? "nullptr" : vals[curr], nextTemp: nextName, return: "-" },
        state: buildListBoard()
      });
    }

    const revArrStr = `[${[...vals].reverse().join(" → ")}]`;
    steps.push({
      line: 10,
      tag: "反轉完成，回傳新頭節點 prev",
      tagType: "tag-found",
      inlineBadge: `return prev (Node ${vals[prev]})`,
      explanation: `當 curr 為 nullptr 時迴圈結束，prev 指向原串列尾端節點 ${vals[prev]}，即為反轉後的新頭節點 ${revArrStr}！`,
      vars: { prev: vals[prev], curr: "nullptr", nextTemp: "nullptr", return: revArrStr },
      state: buildListBoard({ allMatch: true, retVal: revArrStr, retStatus: "match" })
    });

    return steps;
  }
};

// ============================================================================
// #19 Majority Element (LC #169, Easy, Array)
// ============================================================================
window.PROBLEMS["majority-element"] = {
  id: 19,
  leetcodeId: 169,
  slug: "majority-element",
  title: "169. Majority Element (多數元素)",
  difficulty: "Easy",
  topic: "Array",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["nums"],
  description:
    "給定大小為 n 的陣列 nums，回傳其中的多數元素（出現次數嚴格大於 ⌊n / 2⌋ 的元素）。採用 Boyer-Moore 投票演算法：維護當前候選人 candidate 與票數 count，相同則加票、不同則抵銷，最後留下的必為多數元素。",

  presets: [
    { name: "範例 1：[2, 2, 1, 1, 1, 2, 2] (多數為 2)", args: [[2, 2, 1, 1, 1, 2, 2]] },
    { name: "範例 2：[3, 2, 3] (多數為 3)", args: [[3, 2, 3]] },
    { name: "範例 3：[6, 5, 5] (多數為 5)", args: [[6, 5, 5]] },
    { name: "範例 4：[1, 3, 1, 1, 4, 1, 2] (多數為 1)", args: [[1, 3, 1, 1, 4, 1, 2]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">majorityElement</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 2, code: `    <span class="tok-type">int</span> candidate = <span class="tok-num">0</span>, count = <span class="tok-num">0</span>;` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> x : nums) {` },
    { line: 4, code: `        <span class="tok-kw">if</span> (count == <span class="tok-num">0</span>) {` },
    { line: 5, code: `            candidate = x;` },
    { line: 6, code: `        }` },
    { line: 7, code: `        count += (x == candidate) ? <span class="tok-num">1</span> : <span class="tok-num">-1</span>;` },
    { line: 8, code: `    }` },
    { line: 9, code: `    <span class="tok-kw">return</span> candidate;` },
    { line: 10, code: `}` }
  ],

  generateTrace(numsInput) {
    const nums = Array.isArray(numsInput) && numsInput.length > 0 ? numsInput : [2, 2, 1, 1, 1, 2, 2];
    const steps = [];
    let candidate = "-";
    let count = 0;

    const buildState = (opts = {}) => {
      const {
        curIdx = -1,
        done = [],
        match = [],
        candStatus = "",
        cntStatus = "",
        retVal = "-",
        retStatus = "",
        conn = []
      } = opts;

      const ptrs = curIdx >= 0 ? [{ idx: curIdx, label: `i=${curIdx}`, color: "blue" }] : [];

      return {
        boards: [
          {
            id: "arr",
            type: "array",
            name: "nums",
            typeLabel: "投票陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: nums,
            hl: curIdx >= 0 ? [curIdx] : [],
            match,
            done,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "boyer_moore_vars",
            typeLabel: "Boyer-Moore 摩爾投票狀態",
            x: 24,
            y: 220,
            items: [
              { id: "v_x", name: "nums[i]", val: curIdx >= 0 ? `${nums[curIdx]}` : "-", status: curIdx >= 0 ? "hl" : "" },
              { id: "v_cand", name: "candidate (候選人)", val: `${candidate}`, status: candStatus },
              { id: "v_cnt", name: "count (淨勝票數)", val: `${count}`, status: cntStatus },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 2,
      tag: "初始化摩爾投票狀態",
      tagType: "default",
      inlineBadge: "candidate = 0, count = 0",
      explanation: `初始化候選人 candidate 與淨勝票數 count = 0。當 count 歸零時，下一個元素即成為新候選人。`,
      vars: { "nums[i]": "-", candidate: "-", count: 0, return: "-" },
      state: buildState()
    });

    const doneIndices = [];
    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];

      if (count === 0) {
        candidate = x;
        steps.push({
          line: 5,
          tag: `票數為 0，更換候選人為 ${x}`,
          tagType: "tag-insert",
          inlineBadge: `count == 0 -> candidate = ${x}`,
          explanation: `目前淨勝票數 count == 0，將當前元素 nums[${i}] = ${x} 設為新的多數候選人 candidate = ${x}。`,
          vars: { "nums[i]": x, candidate, count, return: "-" },
          state: buildState({
            curIdx: i,
            done: [...doneIndices],
            candStatus: "hl",
            conn: [{ from: `wb-cw-arr-${i}`, to: "wb-var-v_cand", label: `新候選人 ${x}`, color: "purple" }]
          })
        });
      }

      const delta = x === candidate ? 1 : -1;
      count += delta;

      steps.push({
        line: 7,
        tag: delta > 0 ? `同陣營支援 (+1 票)` : `不同陣營抵銷 (-1 票)`,
        tagType: delta > 0 ? "tag-check" : "default",
        inlineBadge: `x=${x} ${delta > 0 ? "==" : "!="} ${candidate} -> count = ${count}`,
        explanation:
          delta > 0
            ? `nums[${i}] = ${x} 與候選人 ${candidate} 相同，票數加 1，目前 count = ${count}。`
            : `nums[${i}] = ${x} 與候選人 ${candidate} 不同，雙方同歸於盡抵銷 1 票，目前 count = ${count}。`,
        vars: { "nums[i]": x, candidate, count, return: "-" },
        state: buildState({
          curIdx: i,
          done: [...doneIndices],
          cntStatus: delta > 0 ? "match" : "warn",
          conn: [
            {
              from: `wb-cw-arr-${i}`,
              to: "wb-var-v_cnt",
              label: delta > 0 ? `+1 票 (count=${count})` : `-1 抵銷 (count=${count})`,
              color: delta > 0 ? "green" : "red"
            }
          ]
        })
      });

      doneIndices.push(i);
    }

    const matchAll = nums.map((v, idx) => (v === candidate ? idx : -1)).filter((idx) => idx >= 0);
    steps.push({
      line: 9,
      tag: "投票結束，回傳多數元素",
      tagType: "tag-found",
      inlineBadge: `return ${candidate}`,
      explanation: `因為多數元素出現次數超過一半，抵銷後最終勝出的候選人 candidate = ${candidate} 必為多數元素！`,
      vars: { "nums[i]": "-", candidate, count, return: candidate },
      state: buildState({
        match: matchAll,
        done: nums.map((_, idx) => idx).filter((idx) => !matchAll.includes(idx)),
        candStatus: "match",
        retVal: `${candidate}`,
        retStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #20 Add Binary (LC #67, Easy, Binary)
// ============================================================================
window.PROBLEMS["add-binary"] = {
  id: 20,
  leetcodeId: 67,
  slug: "add-binary",
  title: "67. Add Binary (二進位求和)",
  difficulty: "Easy",
  topic: "Binary",
  mins: 15,
  complexity: "Time O(max(M, N)) · Space O(max(M, N))",
  argNames: ["a", "b"],
  description:
    "給定兩個二進位字串 a 和 b，以二進位字串形式回傳它們的總和。從兩字串最右側（最低位元）同步向左掃描，計算 sum = carry + bitA + bitB，當前位元為 sum % 2，進位為 sum / 2。",

  presets: [
    { name: "範例 1：a = \"1010\", b = \"1011\" (結果 10101)", args: ["1010", "1011"] },
    { name: "範例 2：a = \"11\", b = \"1\" (連續進位 100)", args: ["11", "1"] },
    { name: "範例 3：a = \"111\", b = \"111\" (全進位 1110)", args: ["111", "111"] },
    { name: "邊界情況：a = \"0\", b = \"0\" (結果 0)", args: ["0", "0"] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">string</span> <span class="tok-fn">addBinary</span>(<span class="tok-type">string</span> a, <span class="tok-type">string</span> b) {` },
    { line: 2, code: `    <span class="tok-type">string</span> res = <span class="tok-num">""</span>;` },
    { line: 3, code: `    <span class="tok-type">int</span> i = a.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>, j = b.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>, carry = <span class="tok-num">0</span>;` },
    { line: 4, code: `    <span class="tok-kw">while</span> (i &gt;= <span class="tok-num">0</span> || j &gt;= <span class="tok-num">0</span> || carry) {` },
    { line: 5, code: `        <span class="tok-type">int</span> sum = carry;` },
    { line: 6, code: `        <span class="tok-kw">if</span> (i &gt;= <span class="tok-num">0</span>) sum += a[i--] - <span class="tok-num">'0'</span>;` },
    { line: 7, code: `        <span class="tok-kw">if</span> (j &gt;= <span class="tok-num">0</span>) sum += b[j--] - <span class="tok-num">'0'</span>;` },
    { line: 8, code: `        res.<span class="tok-fn">push_back</span>(<span class="tok-num">'0'</span> + (sum % <span class="tok-num">2</span>));` },
    { line: 9, code: `        carry = sum / <span class="tok-num">2</span>;` },
    { line: 10, code: `    }` },
    { line: 11, code: `    <span class="tok-fn">reverse</span>(res.<span class="tok-fn">begin</span>(), res.<span class="tok-fn">end</span>());` },
    { line: 12, code: `    <span class="tok-kw">return</span> res;` },
    { line: 13, code: `}` }
  ],

  generateTrace(aInput, bInput) {
    const a = String(aInput ?? "1010").replace(/[^01]/g, "") || "1010";
    const b = String(bInput ?? "1011").replace(/[^01]/g, "") || "1011";
    const aArr = a.split("");
    const bArr = b.split("");
    const resBits = [];
    const steps = [];

    let i = aArr.length - 1;
    let j = bArr.length - 1;
    let carry = 0;

    const buildState = (opts = {}) => {
      const {
        curI = i,
        curJ = j,
        sumExpr = "-",
        carryVal = carry,
        allMatch = false,
        retVal = "-"
      } = opts;

      const displayRes = allMatch ? [...resBits].reverse() : [...resBits].reverse();

      return {
        boards: [
          {
            id: "a",
            type: "array",
            name: "a",
            typeLabel: `二進位字串 a ("${a}")`,
            x: 325,
            y: 42,
            values: aArr,
            hl: curI >= 0 ? [curI] : [],
            done: aArr.map((_, idx) => idx).filter((idx) => idx > curI),
            pointers: curI >= 0 ? [{ idx: curI, label: `i=${curI}`, color: "blue" }] : []
          },
          {
            id: "b",
            type: "array",
            name: "b",
            typeLabel: `二進位字串 b ("${b}")`,
            x: 325,
            y: 168,
            values: bArr,
            hl: curJ >= 0 ? [curJ] : [],
            done: bArr.map((_, idx) => idx).filter((idx) => idx > curJ),
            pointers: curJ >= 0 ? [{ idx: curJ, label: `j=${curJ}`, color: "purple" }] : []
          },
          {
            id: "res",
            type: "array",
            name: "result (由右至左生成)",
            typeLabel: `二進位總和結果`,
            x: 325,
            y: 294,
            values: displayRes,
            hl: !allMatch && displayRes.length > 0 ? [0] : [],
            match: allMatch ? displayRes.map((_, idx) => idx) : []
          },
          {
            id: "vars",
            type: "vars",
            name: "adder_vars",
            typeLabel: "全加器狀態 (Full Adder)",
            x: 24,
            y: 205,
            items: [
              { id: "v_i", name: "i, j", val: `i=${curI}, j=${curJ}`, status: "" },
              { id: "v_sum", name: "sum", val: sumExpr, status: sumExpr !== "-" ? "hl" : "" },
              { id: "v_carry", name: "carry (進位)", val: `${carryVal}`, status: carryVal > 0 ? "warn" : "" },
              { id: "v_res", name: "res", val: retVal !== "-" ? `"${retVal}"` : `"${displayRes.join("")}"`, status: allMatch ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 3,
      tag: "初始化尾端指標與進位",
      tagType: "default",
      inlineBadge: `i = ${i}, j = ${j}, carry = 0`,
      explanation: `將指標 i = ${i}、j = ${j} 指向兩字串最右端（最低有效位元 LSB），進位 carry 設為 0。`,
      vars: { i, j, sum: "-", carry: 0, res: '""' },
      state: buildState()
    });

    while (i >= 0 || j >= 0 || carry > 0) {
      const usedI = i;
      const usedJ = j;
      const prevCarry = carry;
      const bitA = i >= 0 ? Number(aArr[i--]) : 0;
      const bitB = j >= 0 ? Number(bArr[j--]) : 0;
      const sum = prevCarry + bitA + bitB;
      const bitOut = sum % 2;
      carry = Math.floor(sum / 2);
      resBits.push(String(bitOut));

      const expr = `${prevCarry}(carry) + ${bitA}(a) + ${bitB}(b) = ${sum}`;
      const curStr = [...resBits].reverse().join("");

      steps.push({
        line: 8,
        tag: `位元相加：寫入 ${bitOut}，進位 ${carry}`,
        tagType: carry > 0 ? "tag-insert" : "tag-check",
        inlineBadge: `sum=${sum} -> bit=${bitOut}, carry=${carry}`,
        explanation: `計算當前位元總和 sum = ${expr}。結果位元 sum % 2 = ${bitOut} 寫入答案，更新進位 carry = sum / 2 = ${carry}。`,
        vars: { i: usedI, j: usedJ, sum, carry, res: `"${curStr}"` },
        state: buildState({
          curI: usedI,
          curJ: usedJ,
          sumExpr: expr,
          carryVal: carry
        })
      });
    }

    const finalAns = [...resBits].reverse().join("");
    steps.push({
      line: 12,
      tag: "反轉字串並回傳總和",
      tagType: "tag-found",
      inlineBadge: `return "${finalAns}"`,
      explanation: `所有位元與進位皆處理完畢，反轉結果字串得到最終二進位總和 "${finalAns}"！`,
      vars: { i: -1, j: -1, sum: "-", carry: 0, res: `"${finalAns}"` },
      state: buildState({
        curI: -1,
        curJ: -1,
        carryVal: 0,
        allMatch: true,
        retVal: finalAns
      })
    });

    return steps;
  }
};

// ============================================================================
// #21 Diameter of Binary Tree (LC #543, Easy, Binary Tree)
// ============================================================================
window.PROBLEMS["diameter-of-binary-tree"] = {
  id: 21,
  leetcodeId: 543,
  slug: "diameter-of-binary-tree",
  title: "543. Diameter of Binary Tree (二元樹的直徑)",
  difficulty: "Easy",
  topic: "Binary Tree",
  mins: 30,
  complexity: "Time O(N) · Space O(H)",
  argNames: ["root"],
  description:
    "給定一棵二元樹，計算它的直徑長度（任意兩個節點之間最長路徑的邊數，這條路徑不一定穿過根節點）。透過後序 DFS 計算每個節點的左右子樹高度 L 與 R，經過該節點的最長路徑邊數即為 L + R，同步更新全域最大直徑 maxDia。",

  presets: [
    { name: "範例 1：[1, 2, 3, 4, 5] (直徑為 3：4-2-1-3)", args: [[1, 2, 3, 4, 5]] },
    { name: "範例 2：[1, 2] (雙節點，直徑為 1)", args: [[1, 2]] },
    { name: "範例 3：[1, 2, 3, 4, 5, null, null, 6, null, null, 7] (不經過根)", args: [[1, 2, 3, 4, 5, null, null]] },
    { name: "範例 4：[1, 2, 3, 4, 5, 6, 7] (完整二元樹，直徑 4)", args: [[1, 2, 3, 4, 5, 6, 7]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> maxDia = <span class="tok-num">0</span>;` },
    { line: 2, code: `<span class="tok-type">int</span> <span class="tok-fn">dfsHeight</span>(<span class="tok-type">TreeNode</span>* node) {` },
    { line: 3, code: `    <span class="tok-kw">if</span> (!node) <span class="tok-kw">return</span> <span class="tok-num">0</span>;` },
    { line: 4, code: `    <span class="tok-type">int</span> L = <span class="tok-fn">dfsHeight</span>(node-&gt;left);` },
    { line: 5, code: `    <span class="tok-type">int</span> R = <span class="tok-fn">dfsHeight</span>(node-&gt;right);` },
    { line: 6, code: `    maxDia = <span class="tok-fn">max</span>(maxDia, L + R);` },
    { line: 7, code: `    <span class="tok-kw">return</span> <span class="tok-num">1</span> + <span class="tok-fn">max</span>(L, R);` },
    { line: 8, code: `}` },
    { line: 9, code: `<span class="tok-type">int</span> <span class="tok-fn">diameterOfBinaryTree</span>(<span class="tok-type">TreeNode</span>* root) {` },
    { line: 10, code: `    <span class="tok-fn">dfsHeight</span>(root);` },
    { line: 11, code: `    <span class="tok-kw">return</span> maxDia;` },
    { line: 12, code: `}` }
  ],

  generateTrace(rootInput) {
    const arr = Array.isArray(rootInput) && rootInput.length > 0 ? rootInput.slice(0, 7) : [1, 2, 3, 4, 5];
    const steps = [];

    const coords = [
      { x: 310, y: 42 },
      { x: 170, y: 116 },
      { x: 450, y: 116 },
      { x: 100, y: 190 },
      { x: 240, y: 190 },
      { x: 380, y: 190 },
      { x: 520, y: 190 }
    ];

    const subLabels = {};
    const doneNodes = new Set();
    let maxDia = 0;
    let bestRootIdx = 0;

    const buildTreeState = (opts = {}) => {
      const { curIdx = -1, lVal = "-", rVal = "-", retVal = "-", allMatch = false } = opts;
      const nodes = [];
      const edges = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null || arr[i] === undefined) continue;
        let st = "";
        if (allMatch && i === bestRootIdx) st = "match";
        else if (i === curIdx) st = "hl";
        else if (doneNodes.has(i)) st = "match";

        nodes.push({
          id: `n${i}`,
          val: `${arr[i]}`,
          sub: subLabels[i] || "",
          x: coords[i].x,
          y: coords[i].y,
          status: st,
          ptr: i === curIdx ? "node" : ""
        });

        const leftIdx = 2 * i + 1;
        const rightIdx = 2 * i + 2;
        if (leftIdx < arr.length && arr[leftIdx] !== null && arr[leftIdx] !== undefined) {
          edges.push({
            from: `n${i}`,
            to: `n${leftIdx}`,
            label: "L",
            dir: true,
            status: doneNodes.has(leftIdx) ? "match" : i === curIdx ? "hl" : ""
          });
        }
        if (rightIdx < arr.length && arr[rightIdx] !== null && arr[rightIdx] !== undefined) {
          edges.push({
            from: `n${i}`,
            to: `n${rightIdx}`,
            label: "R",
            dir: true,
            status: doneNodes.has(rightIdx) ? "match" : i === curIdx ? "hl" : ""
          });
        }
      }

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元樹後序高度與直徑計算",
            x: 325,
            y: 52,
            width: 620,
            height: 270,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "dia_vars",
            typeLabel: "DFS 節點高度與最大直徑",
            x: 24,
            y: 215,
            items: [
              { id: "v_node", name: "當前節點", val: curIdx >= 0 ? `${arr[curIdx]}` : "-", status: curIdx >= 0 ? "hl" : "" },
              { id: "v_lr", name: "L + R (經過此節點路徑)", val: lVal !== "-" ? `${lVal} + ${rVal} = ${lVal + rVal}` : "-", status: lVal !== "-" ? "hl" : "" },
              { id: "v_max", name: "maxDia (最大直徑)", val: `${maxDia}`, status: "match" },
              { id: "v_ret", name: "return", val: retVal, status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 10,
      tag: "從根節點啟動後序 DFS",
      tagType: "default",
      inlineBadge: `dfsHeight(root=${arr[0]})`,
      explanation: `從根節點 ${arr[0]} 開始後序走訪，自底向上計算每個節點的左右子樹高度 L 與 R。`,
      vars: { node: arr[0], L: "-", R: "-", maxDia: 0 },
      state: buildTreeState({ curIdx: 0 })
    });

    function dfs(idx) {
      if (idx >= arr.length || arr[idx] === null || arr[idx] === undefined) return 0;

      const L = dfs(2 * idx + 1);
      const R = dfs(2 * idx + 2);
      const localDia = L + R;
      if (localDia >= maxDia) {
        maxDia = localDia;
        bestRootIdx = idx;
      }
      const h = 1 + Math.max(L, R);
      subLabels[idx] = `L=${L},R=${R}`;
      doneNodes.add(idx);

      steps.push({
        line: 6,
        tag: `節點 ${arr[idx]}：L=${L}, R=${R} → 更新直徑`,
        tagType: localDia === maxDia && localDia > 0 ? "tag-insert" : "tag-check",
        inlineBadge: `L+R = ${L}+${R} = ${localDia}, maxDia = ${maxDia}`,
        explanation: `節點 ${arr[idx]} 左子樹高 L=${L}、右子樹高 R=${R}，經過該節點的最長路徑為 L+R=${localDia}，更新 maxDia=${maxDia}，並向上回傳高度 1+max(${L},${R})=${h}。`,
        vars: { node: arr[idx], L, R, maxDia },
        state: buildTreeState({ curIdx: idx, lVal: L, rVal: R })
      });

      return h;
    }

    dfs(0);

    steps.push({
      line: 11,
      tag: "回傳二元樹最大直徑",
      tagType: "tag-found",
      inlineBadge: `return maxDia = ${maxDia}`,
      explanation: `後序 DFS 完成，全樹任意兩節點間的最長路徑邊數（直徑）為 maxDia = ${maxDia}。`,
      vars: { node: "-", L: "-", R: "-", maxDia },
      state: buildTreeState({ allMatch: true, retVal: `${maxDia}` })
    });

    return steps;
  }
};

// ============================================================================
// #22 Middle of the Linked List (LC #876, Easy, Linked List)
// ============================================================================
window.PROBLEMS["middle-of-the-linked-list"] = {
  id: 22,
  leetcodeId: 876,
  slug: "middle-of-the-linked-list",
  title: "876. Middle of the Linked List (鏈結串列的中間節點)",
  difficulty: "Easy",
  topic: "Linked List",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["head"],
  description:
    "給定單向鏈結串列的頭節點 head，請回傳該串列的中間節點（若有兩個中間節點，則回傳第二個中間節點）。使用快慢指標 (Tortoise and Hare)：slow 每次走 1 步，fast 每次走 2 步；當 fast 抵達尾端時，slow 恰好位於正中央。",

  presets: [
    { name: "範例 1：[1, 2, 3, 4, 5] (奇數長度，中間為 3)", args: [[1, 2, 3, 4, 5]] },
    { name: "範例 2：[1, 2, 3, 4, 5, 6] (偶數長度，回傳第2個中間 4)", args: [[1, 2, 3, 4, 5, 6]] },
    { name: "範例 3：[10, 20] (雙節點，中間為 20)", args: [[10, 20]] },
    { name: "邊界情況：[99] (單一節點)", args: [[99]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">ListNode</span>* <span class="tok-fn">middleNode</span>(<span class="tok-type">ListNode</span>* head) {` },
    { line: 2, code: `    <span class="tok-type">ListNode</span>* slow = head;` },
    { line: 3, code: `    <span class="tok-type">ListNode</span>* fast = head;` },
    { line: 4, code: `    <span class="tok-kw">while</span> (fast != <span class="tok-kw">nullptr</span> &amp;&amp; fast-&gt;next != <span class="tok-kw">nullptr</span>) {` },
    { line: 5, code: `        slow = slow-&gt;next;        <span class="tok-cmt">// 慢指標走 1 步</span>` },
    { line: 6, code: `        fast = fast-&gt;next-&gt;next;  <span class="tok-cmt">// 快指標走 2 步</span>` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">return</span> slow;` },
    { line: 9, code: `}` }
  ],

  generateTrace(headInput) {
    const vals = Array.isArray(headInput) && headInput.length > 0 ? headInput.slice(0, 7) : [1, 2, 3, 4, 5];
    const n = vals.length;
    const steps = [];

    let slow = 0;
    let fast = 0;

    const buildState = (opts = {}) => {
      const { found = false, retVal = "-" } = opts;
      const spacing = 82;
      const startX = 50;
      const width = Math.max(460, startX + n * spacing + 40);

      const nodes = vals.map((v, idx) => {
        const ptrs = [];
        if (slow === idx) ptrs.push("slow");
        if (fast === idx) ptrs.push("fast");

        let st = "";
        if (found && idx === slow) st = "match";
        else if (idx === slow || idx === fast) st = "hl";

        return {
          id: `n${idx}`,
          val: `${v}`,
          sub: `idx=${idx}`,
          x: startX + idx * spacing,
          y: 95,
          status: st,
          ptr: ptrs.join(" & ")
        };
      });

      const edges = [];
      for (let i = 0; i < n - 1; i++) {
        edges.push({
          from: `n${i}`,
          to: `n${i + 1}`,
          label: "next",
          dir: true,
          status: i < slow ? "match" : ""
        });
      }

      const fastStr = fast < n ? `節點(${vals[fast]}) [idx=${fast}]` : "nullptr (超出尾端)";

      return {
        boards: [
          {
            id: "list",
            type: "list",
            shape: "list",
            name: "head",
            typeLabel: "快慢指標鏈結串列 (ListNode*)",
            x: 325,
            y: 52,
            width,
            height: 195,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "ptr_vars",
            typeLabel: "快慢指標位置",
            x: 24,
            y: 215,
            items: [
              { id: "v_slow", name: "slow (每次 +1)", val: `節點(${vals[slow]}) [idx=${slow}]`, status: found ? "match" : "hl" },
              { id: "v_fast", name: "fast (每次 +2)", val: fastStr, status: fast < n ? "hl" : "" },
              { id: "v_ret", name: "return", val: retVal, status: found ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 3,
      tag: "初始化快慢指標於頭節點",
      tagType: "default",
      inlineBadge: `slow = ${vals[0]}, fast = ${vals[0]}`,
      explanation: `將慢指標 slow 與快指標 fast 同時指向頭節點 ${vals[0]} (索引 0)。`,
      vars: { slow: vals[0], fast: vals[0], return: "-" },
      state: buildState()
    });

    while (fast < n && fast + 1 < n) {
      slow += 1;
      fast += 2;
      const fastLabel = fast < n ? vals[fast] : "nullptr";

      steps.push({
        line: 6,
        tag: "slow 走 1 步，fast 走 2 步",
        tagType: "tag-check",
        inlineBadge: `slow -> ${vals[slow]}, fast -> ${fastLabel}`,
        explanation: `fast 與 fast->next 皆非空：慢指標 slow 推進 1 步至節點 ${vals[slow]}，快指標 fast 推進 2 步至 ${fastLabel}。`,
        vars: { slow: vals[slow], fast: fastLabel, return: "-" },
        state: buildState()
      });
    }

    const stopReason = fast >= n ? "fast == nullptr" : "fast->next == nullptr";
    steps.push({
      line: 8,
      tag: "找到中間節點並回傳 slow",
      tagType: "tag-found",
      inlineBadge: `return slow (Node ${vals[slow]})`,
      explanation: `此時 ${stopReason}，迴圈結束！慢指標 slow 所在節點 ${vals[slow]} (索引 ${slow}) 即為鏈結串列的中間節點。`,
      vars: { slow: vals[slow], fast: fast < n ? vals[fast] : "nullptr", return: `Node(${vals[slow]})` },
      state: buildState({ found: true, retVal: `Node(${vals[slow]})` })
    });

    return steps;
  }
};

// ============================================================================
// #23 Maximum Depth of Binary Tree (LC #104, Easy, Binary Tree)
// ============================================================================
window.PROBLEMS["maximum-depth-of-binary-tree"] = {
  id: 23,
  leetcodeId: 104,
  slug: "maximum-depth-of-binary-tree",
  title: "104. Maximum Depth of Binary Tree (二元樹的最大深度)",
  difficulty: "Easy",
  topic: "Binary Tree",
  mins: 15,
  complexity: "Time O(N) · Space O(H)",
  argNames: ["root"],
  description:
    "給定一棵二元樹的根節點 root，回傳其最大深度（從根節點到最遠葉節點的最長路徑上的節點數）。遞迴關係式：空節點深度為 0，非空節點深度為 1 + max(maxDepth(left), maxDepth(right))。",

  presets: [
    { name: "範例 1：[3, 9, 20, null, null, 15, 7] (最大深度 3)", args: [[3, 9, 20, null, null, 15, 7]] },
    { name: "範例 2：[1, null, 2] (右斜樹，最大深度 2)", args: [[1, null, 2]] },
    { name: "範例 3：[1, 2, 3, 4, null, null, 5] (對稱深度 3)", args: [[1, 2, 3, 4, null, null, 5]] },
    { name: "邊界情況：[42] (單節點，最大深度 1)", args: [[42]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">maxDepth</span>(<span class="tok-type">TreeNode</span>* root) {` },
    { line: 2, code: `    <span class="tok-kw">if</span> (root == <span class="tok-kw">nullptr</span>) {` },
    { line: 3, code: `        <span class="tok-kw">return</span> <span class="tok-num">0</span>;` },
    { line: 4, code: `    }` },
    { line: 5, code: `    <span class="tok-type">int</span> leftDepth = <span class="tok-fn">maxDepth</span>(root-&gt;left);` },
    { line: 6, code: `    <span class="tok-type">int</span> rightDepth = <span class="tok-fn">maxDepth</span>(root-&gt;right);` },
    { line: 7, code: `    <span class="tok-kw">return</span> <span class="tok-num">1</span> + <span class="tok-fn">max</span>(leftDepth, rightDepth);` },
    { line: 8, code: `}` }
  ],

  generateTrace(rootInput) {
    const arr = Array.isArray(rootInput) && rootInput.length > 0 ? rootInput.slice(0, 7) : [3, 9, 20, null, null, 15, 7];
    const steps = [];

    const coords = [
      { x: 310, y: 42 },
      { x: 170, y: 116 },
      { x: 450, y: 116 },
      { x: 100, y: 190 },
      { x: 240, y: 190 },
      { x: 380, y: 190 },
      { x: 520, y: 190 }
    ];

    const depthSub = {};
    const doneNodes = new Set();

    const buildTreeState = (opts = {}) => {
      const { curIdx = -1, eqStr = "-", retVal = "-" } = opts;
      const nodes = [];
      const edges = [];

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === null || arr[i] === undefined) continue;
        let st = "";
        if (i === curIdx) st = "hl";
        else if (doneNodes.has(i)) st = "match";

        nodes.push({
          id: `n${i}`,
          val: `${arr[i]}`,
          sub: depthSub[i] || "",
          x: coords[i].x,
          y: coords[i].y,
          status: st,
          ptr: i === curIdx ? "root" : ""
        });

        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < arr.length && arr[l] !== null && arr[l] !== undefined) {
          edges.push({
            from: `n${i}`,
            to: `n${l}`,
            label: "L",
            dir: true,
            status: doneNodes.has(l) ? "match" : ""
          });
        }
        if (r < arr.length && arr[r] !== null && arr[r] !== undefined) {
          edges.push({
            from: `n${i}`,
            to: `n${r}`,
            label: "R",
            dir: true,
            status: doneNodes.has(r) ? "match" : ""
          });
        }
      }

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元樹遞迴深度計算 (TreeNode*)",
            x: 325,
            y: 52,
            width: 620,
            height: 270,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "depth_vars",
            typeLabel: "遞迴回傳深度",
            x: 24,
            y: 215,
            items: [
              { id: "v_cur", name: "當前節點", val: curIdx >= 0 ? `${arr[curIdx]}` : "-", status: curIdx >= 0 ? "hl" : "" },
              { id: "v_eq", name: "1 + max(L, R)", val: eqStr, status: eqStr !== "-" ? "hl" : "" },
              { id: "v_ret", name: "return (最大深度)", val: retVal, status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 1,
      tag: "開始計算二元樹最大深度",
      tagType: "default",
      inlineBadge: `maxDepth(root=${arr[0]})`,
      explanation: `從根節點 ${arr[0]} 出發向下遞迴，計算各子樹高度。`,
      vars: { node: arr[0], leftDepth: "-", rightDepth: "-", return: "-" },
      state: buildTreeState({ curIdx: 0 })
    });

    function dfs(idx) {
      if (idx >= arr.length || arr[idx] === null || arr[idx] === undefined) return 0;

      const lDepth = dfs(2 * idx + 1);
      const rDepth = dfs(2 * idx + 2);
      const myDepth = 1 + Math.max(lDepth, rDepth);
      depthSub[idx] = `depth=${myDepth}`;
      doneNodes.add(idx);

      const eqStr = `1 + max(${lDepth}, ${rDepth}) = ${myDepth}`;
      steps.push({
        line: 7,
        tag: `節點 ${arr[idx]} 深度 = ${myDepth}`,
        tagType: idx === 0 ? "tag-found" : "tag-check",
        inlineBadge: `node=${arr[idx]}: ${eqStr}`,
        explanation: `節點 ${arr[idx]} 的左子樹深度 = ${lDepth}，右子樹深度 = ${rDepth}，故以 ${arr[idx]} 為根的子樹最大深度為 ${eqStr}。`,
        vars: { node: arr[idx], leftDepth: lDepth, rightDepth: rDepth, return: myDepth },
        state: buildTreeState({
          curIdx: idx,
          eqStr,
          retVal: idx === 0 ? `${myDepth}` : "-"
        })
      });

      return myDepth;
    }

    dfs(0);
    return steps;
  }
};

// ============================================================================
// #24 Contains Duplicate (LC #217, Easy, Array)
// ============================================================================
window.PROBLEMS["contains-duplicate"] = {
  id: 24,
  leetcodeId: 217,
  slug: "contains-duplicate",
  title: "217. Contains Duplicate (存在重複元素)",
  difficulty: "Easy",
  topic: "Array",
  mins: 15,
  complexity: "Time O(N) · Space O(N)",
  argNames: ["nums"],
  description:
    "給定一個整數陣列 nums，如果任一數值在陣列中出現至少兩次，則回傳 true；如果每個元素皆不相同，則回傳 false。使用雜湊集合 unordered_set<int> seen 即可在 O(1) 平均時間內檢查元素是否已出現過。",

  presets: [
    { name: "範例 1：[1, 2, 3, 1] (存在重複 1 → true)", args: [[1, 2, 3, 1]] },
    { name: "範例 2：[1, 2, 3, 4] (全無重複 → false)", args: [[1, 2, 3, 4]] },
    { name: "範例 3：[1, 1, 1, 3, 3, 4] (首對即重複 → true)", args: [[1, 1, 1, 3, 3, 4]] },
    { name: "範例 4：[10, 20, 30, 20, 40] (中間重複 20 → true)", args: [[10, 20, 30, 20, 40]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">bool</span> <span class="tok-fn">containsDuplicate</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 2, code: `    <span class="tok-type">unordered_set</span>&lt;<span class="tok-type">int</span>&gt; seen;` },
    { line: 3, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> x : nums) {` },
    { line: 4, code: `        <span class="tok-kw">if</span> (seen.<span class="tok-fn">count</span>(x)) {` },
    { line: 5, code: `            <span class="tok-kw">return</span> <span class="tok-kw">true</span>;  <span class="tok-cmt">// 發現重複元素</span>` },
    { line: 6, code: `        }` },
    { line: 7, code: `        seen.<span class="tok-fn">insert</span>(x);` },
    { line: 8, code: `    }` },
    { line: 9, code: `    <span class="tok-kw">return</span> <span class="tok-kw">false</span>;` },
    { line: 10, code: `}` }
  ],

  generateTrace(numsInput) {
    const nums = Array.isArray(numsInput) && numsInput.length > 0 ? numsInput : [1, 2, 3, 1];
    const steps = [];
    const seenList = [];

    const buildState = (opts = {}) => {
      const {
        curIdx = -1,
        done = [],
        match = [],
        warn = [],
        activeChipIdx = -1,
        chipMode = "",
        lookupText = "-",
        retVal = "-",
        retStatus = "",
        conn = []
      } = opts;

      const setItems = seenList.map((val, idx) => ({
        val: `${val}`,
        status: idx === activeChipIdx ? chipMode : ""
      }));

      return {
        boards: [
          {
            id: "arr",
            type: "array",
            name: "nums",
            typeLabel: "整數陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: nums,
            hl: curIdx >= 0 && !warn.includes(curIdx) && !match.includes(curIdx) ? [curIdx] : [],
            match,
            done,
            warn,
            pointers: curIdx >= 0 ? [{ idx: curIdx, label: `i=${curIdx}`, color: warn.length ? "red" : "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "dup_vars",
            typeLabel: "雜湊集合查找狀態",
            x: 24,
            y: 205,
            items: [
              { id: "v_x", name: "當前元素 x", val: curIdx >= 0 ? `${nums[curIdx]}` : "-", status: curIdx >= 0 ? "hl" : "" },
              { id: "v_cnt", name: "seen.count(x)", val: lookupText, status: lookupText.includes("1") ? "match" : "" },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          },
          {
            id: "seen",
            type: "set",
            name: "seen",
            typeLabel: "已出現元素集合 (unordered_set<int>)",
            x: 325,
            y: 205,
            items: setItems
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 2,
      tag: "初始化空的雜湊集合 seen",
      tagType: "default",
      inlineBadge: "seen = {}",
      explanation: `建立空的 unordered_set<int> seen，用來記錄已經走訪過的數字。`,
      vars: { i: "-", x: "-", "seen.size()": 0, return: "-" },
      state: buildState()
    });

    const doneIndices = [];
    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      const existingIdx = seenList.indexOf(x);

      if (existingIdx !== -1) {
        const firstIdx = nums.indexOf(x);
        steps.push({
          line: 4,
          tag: `查找 seen.count(${x}) 命中重複！`,
          tagType: "tag-found",
          inlineBadge: `seen.count(${x}) == 1`,
          explanation: `檢查 nums[${i}] = ${x}，發現 ${x} 已經存在於集合 seen 中（最早出現於索引 ${firstIdx}）！`,
          vars: { i, x, "seen.size()": seenList.length, return: "-" },
          state: buildState({
            curIdx: i,
            match: [firstIdx, i],
            done: doneIndices.filter((d) => d !== firstIdx),
            activeChipIdx: existingIdx,
            chipMode: "hit",
            lookupText: "1 (已存在!)",
            conn: [{ from: `wb-cw-arr-${i}`, to: `wb-chip-seen-${existingIdx}`, label: `命中重複元素 ${x}`, color: "green" }]
          })
        });

        steps.push({
          line: 5,
          tag: "發現重複，立即回傳 true",
          tagType: "tag-found",
          inlineBadge: "return true",
          explanation: `陣列中包含重複元素 ${x}，立即結束迴圈並回傳 true。`,
          vars: { i, x, "seen.size()": seenList.length, return: "true" },
          state: buildState({
            curIdx: i,
            match: [firstIdx, i],
            done: doneIndices.filter((d) => d !== firstIdx),
            activeChipIdx: existingIdx,
            chipMode: "hit",
            lookupText: "1 (已存在!)",
            retVal: "true",
            retStatus: "match",
            conn: [{ from: `wb-chip-seen-${existingIdx}`, to: "wb-var-v_ret", label: "回傳 true", color: "green" }]
          })
        });

        return steps;
      }

      seenList.push(x);
      const newChipIdx = seenList.length - 1;

      steps.push({
        line: 7,
        tag: `${x} 未出現過，加入集合 seen`,
        tagType: "tag-insert",
        inlineBadge: `seen.insert(${x})`,
        explanation: `seen.count(${x}) 為 0，將新元素 ${x} 插入集合 seen 中。`,
        vars: { i, x, "seen.size()": seenList.length, return: "-" },
        state: buildState({
          curIdx: i,
          done: [...doneIndices],
          activeChipIdx: newChipIdx,
          chipMode: "inserted",
          lookupText: "0 (未出現)",
          conn: [{ from: `wb-cw-arr-${i}`, to: `wb-chip-seen-${newChipIdx}`, label: `insert(${x})`, color: "purple" }]
        })
      });

      doneIndices.push(i);
    }

    steps.push({
      line: 9,
      tag: "全部元素皆不重複，回傳 false",
      tagType: "tag-found",
      inlineBadge: "return false",
      explanation: `走訪完所有元素皆未發現重複，回傳 false。`,
      vars: { i: nums.length, x: "-", "seen.size()": seenList.length, return: "false" },
      state: buildState({
        done: doneIndices,
        retVal: "false",
        retStatus: "match"
      })
    });

    return steps;
  }
};

// ============================================================================
// #25 Maximum Subarray (LC #53, Medium, Dynamic Programming / Kadane's)
// ============================================================================
window.PROBLEMS["maximum-subarray"] = {
  id: 25,
  leetcodeId: 53,
  slug: "maximum-subarray",
  title: "53. Maximum Subarray (最大子陣列和)",
  difficulty: "Medium",
  topic: "Dynamic Programming",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  argNames: ["nums"],
  description:
    "給定一個整數陣列 nums，請找出一個具有最大總和的連續子陣列（最少包含一個元素），並回傳其最大總和。採用 Kadane 演算法：若先前累加和 currSum < 0 則對後續只有負面拖累，應果斷捨棄並從當前元素重新開始 currSum = max(nums[i], currSum + nums[i])。",

  presets: [
    { name: "範例 1：[-2, 1, -3, 4, -1, 2, 1, -5, 4] (最大和 6：[4,-1,2,1])", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]] },
    { name: "範例 2：[5, 4, -1, 7, 8] (全段總和 23)", args: [[5, 4, -1, 7, 8]] },
    { name: "範例 3：[-3, -1, -2] (全負數，最大和 -1)", args: [[-3, -1, -2]] },
    { name: "範例 4：[2, -3, 4, -1, 3, -5] (重起區間最大和 6)", args: [[2, -3, 4, -1, 3, -5]] }
  ],

  cppLines: [
    { line: 1, code: `<span class="tok-type">int</span> <span class="tok-fn">maxSubArray</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">int</span>&gt;&amp; nums) {` },
    { line: 2, code: `    <span class="tok-type">int</span> currSum = nums[<span class="tok-num">0</span>];` },
    { line: 3, code: `    <span class="tok-type">int</span> maxSum = nums[<span class="tok-num">0</span>];` },
    { line: 4, code: `    <span class="tok-kw">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">1</span>; i &lt; nums.<span class="tok-fn">size</span>(); ++i) {` },
    { line: 5, code: `        currSum = <span class="tok-fn">max</span>(nums[i], currSum + nums[i]);` },
    { line: 6, code: `        maxSum = <span class="tok-fn">max</span>(maxSum, currSum);` },
    { line: 7, code: `    }` },
    { line: 8, code: `    <span class="tok-kw">return</span> maxSum;` },
    { line: 9, code: `}` }
  ],

  generateTrace(numsInput) {
    const nums = Array.isArray(numsInput) && numsInput.length > 0 ? numsInput : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const steps = [];

    let currSum = nums[0];
    let maxSum = nums[0];
    let winStart = 0;
    let bestStart = 0;
    let bestEnd = 0;

    const buildState = (opts = {}) => {
      const {
        curIdx = 0,
        showBest = false,
        decisionText = "-",
        retVal = "-",
        retStatus = "",
        conn = []
      } = opts;

      const hl = [];
      const match = [];
      const done = [];

      if (showBest) {
        for (let k = 0; k < nums.length; k++) {
          if (k >= bestStart && k <= bestEnd) match.push(k);
          else done.push(k);
        }
      } else {
        for (let k = 0; k <= curIdx; k++) {
          if (k >= winStart && k <= curIdx) hl.push(k);
          else done.push(k);
        }
      }

      const ptrs = [];
      if (showBest) {
        ptrs.push({ idx: bestStart, label: "bestL", color: "green" });
        ptrs.push({ idx: bestEnd, label: "bestR", color: "green" });
      } else if (curIdx >= 0) {
        ptrs.push({ idx: winStart, label: "start", color: "purple" });
        ptrs.push({ idx: curIdx, label: `i=${curIdx}`, color: "blue" });
      }

      return {
        boards: [
          {
            id: "arr",
            type: "array",
            name: "nums",
            typeLabel: "Kadane 當前子陣列視窗 (vector<int>)",
            x: 325,
            y: 52,
            values: nums,
            hl,
            match,
            done,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "kadane_vars",
            typeLabel: "Kadane 動態規劃變數",
            x: 24,
            y: 225,
            items: [
              { id: "v_dec", name: "決策 (延續 vs 重起)", val: decisionText, status: decisionText !== "-" ? "hl" : "" },
              { id: "v_curr", name: "currSum (當前子陣列和)", val: `${currSum}`, status: "hl" },
              { id: "v_max", name: "maxSum (歷史最大和)", val: `${maxSum}`, status: "match" },
              { id: "v_ret", name: "return", val: retVal, status: retStatus }
            ]
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 3,
      tag: "初始化 currSum 與 maxSum",
      tagType: "default",
      inlineBadge: `currSum = ${currSum}, maxSum = ${maxSum}`,
      explanation: `以第一個元素 nums[0] = ${nums[0]} 初始化當前子陣列和 currSum = ${currSum} 與歷史最大和 maxSum = ${maxSum}。`,
      vars: { i: 0, "nums[i]": nums[0], currSum, maxSum },
      state: buildState({ curIdx: 0, decisionText: `初始區間 [0..0]` })
    });

    for (let i = 1; i < nums.length; i++) {
      const x = nums[i];
      const extendSum = currSum + x;
      const restart = x > extendSum;

      if (restart) {
        currSum = x;
        winStart = i;
      } else {
        currSum = extendSum;
      }

      const decStr = restart
        ? `捨棄舊和! 重起 nums[${i}]=${x} > ${extendSum}`
        : `延續區間: ${extendSum} >= ${x}`;

      const updatedMax = currSum > maxSum;
      if (currSum > maxSum) {
        maxSum = currSum;
        bestStart = winStart;
        bestEnd = i;
      }

      steps.push({
        line: 6,
        tag: restart ? `i=${i}：捨棄負累，從 ${x} 重新開始` : `i=${i}：將 ${x} 併入當前子陣列`,
        tagType: updatedMax ? "tag-found" : restart ? "tag-insert" : "tag-check",
        inlineBadge: `currSum = ${currSum}, maxSum = ${maxSum}`,
        explanation: restart
          ? `先前 currSum 為負數，加上 ${x} 後僅為 ${extendSum}，不如直接從 nums[${i}]=${x} 重新開新子陣列！更新 currSum=${currSum}，maxSum=${maxSum}。`
          : `將 nums[${i}]=${x} 加入當前子陣列得 currSum=${currSum}，並更新歷史最大和 maxSum=${maxSum}。`,
        vars: { i, "nums[i]": x, currSum, maxSum },
        state: buildState({
          curIdx: i,
          decisionText: decStr,
          conn: [
            {
              from: `wb-cw-arr-${i}`,
              to: updatedMax ? "wb-var-v_max" : "wb-var-v_curr",
              label: updatedMax ? `創新高 maxSum=${maxSum}!` : `currSum=${currSum}`,
              color: updatedMax ? "green" : restart ? "purple" : "blue"
            }
          ]
        })
      });
    }

    const bestSubStr = `[${nums.slice(bestStart, bestEnd + 1).join(", ")}]`;
    steps.push({
      line: 8,
      tag: "回傳最大連續子陣列和 maxSum",
      tagType: "tag-found",
      inlineBadge: `return ${maxSum}`,
      explanation: `掃描完成！最大連續子陣列為索引 [${bestStart}..${bestEnd}] 的 ${bestSubStr}，最大總和為 ${maxSum}。`,
      vars: { i: nums.length, "nums[i]": "-", currSum, maxSum },
      state: buildState({
        showBest: true,
        decisionText: `最佳區間 ${bestSubStr}`,
        retVal: `${maxSum}`,
        retStatus: "match"
      })
    });

    return steps;
  }
};

/**
 * Grind 75 Week 5 (Problems #42 to #49)
 * 8 Medium Problems with C++17 Step-by-Step Whiteboard Visualizations
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #42 Search in Rotated Sorted Array (LC #33)
// ============================================================================
window.PROBLEMS["search-in-rotated-sorted-array"] = {
  id: 42,
  leetcodeId: 33,
  slug: "search-in-rotated-sorted-array",
  title: "33. Search in Rotated Sorted Array (搜尋旋轉排序陣列)",
  difficulty: "Medium",
  topic: "Binary Search",
  mins: 30,
  complexity: "Time O(log N) · Space O(1)",
  description:
    "給定一個經過旋轉、原本升序排列且無重複元素的整數陣列 nums 與目標值 target。每次二分取中點 mid 時，左半部 [L..mid] 與右半部 [mid..R] 必有一側是嚴格有序的；先判斷哪一側有序，再檢查 target 是否落在該有序區間內，即可在 O(log N) 時間內收斂。",
  argNames: ["nums", "target"],

  presets: [
    {
      name: "範例 1：target 在右半旋轉段 nums = [4,5,6,7,0,1,2], target = 0",
      args: [[4, 5, 6, 7, 0, 1, 2], 0]
    },
    {
      name: "範例 2：target 不存在 nums = [4,5,6,7,0,1,2], target = 3",
      args: [[4, 5, 6, 7, 0, 1, 2], 3]
    },
    {
      name: "範例 3：target 在左半有序段 nums = [6,7,0,1,2,4,5], target = 7",
      args: [[6, 7, 0, 1, 2, 4, 5], 7]
    },
    {
      name: "範例 4：單元素陣列 nums = [1], target = 0",
      args: [[1], 0]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">search</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums, <span class="tok-kw">int</span> target) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> L = <span class="tok-num">0</span>, R = (<span class="tok-kw">int</span>)nums.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (L &lt;= R) {' },
    { line: 6,  code: '            <span class="tok-kw">int</span> mid = L + (R - L) / <span class="tok-num">2</span>;' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (nums[mid] == target) <span class="tok-kw">return</span> mid;' },
    { line: 8,  code: '            <span class="tok-kw">if</span> (nums[L] &lt;= nums[mid]) { <span class="tok-cmt">// 左半部 [L..mid] 有序</span>' },
    { line: 9,  code: '                <span class="tok-kw">if</span> (nums[L] &lt;= target &amp;&amp; target &lt; nums[mid]) R = mid - <span class="tok-num">1</span>;' },
    { line: 10, code: '                <span class="tok-kw">else</span> L = mid + <span class="tok-num">1</span>;' },
    { line: 11, code: '            } <span class="tok-kw">else</span> { <span class="tok-cmt">// 右半部 [mid..R] 有序</span>' },
    { line: 12, code: '                <span class="tok-kw">if</span> (nums[mid] &lt; target &amp;&amp; target &lt;= nums[R]) L = mid + <span class="tok-num">1</span>;' },
    { line: 13, code: '                <span class="tok-kw">else</span> R = mid - <span class="tok-num">1</span>;' },
    { line: 14, code: '            }' },
    { line: 15, code: '        }' },
    { line: 16, code: '        <span class="tok-kw">return</span> -<span class="tok-num">1</span>;' },
    { line: 17, code: '    }' },
    { line: 18, code: '};' }
  ],

  generateTrace(nums, target) {
    const arr = Array.isArray(nums) ? [...nums] : [4, 5, 6, 7, 0, 1, 2];
    const tgt = Number(target ?? 0);
    const steps = [];
    let L = 0;
    let R = arr.length - 1;

    const buildState = (opts = {}) => {
      const {
        curL = L,
        curR = R,
        mid = -1,
        foundIdx = -1,
        sortedRange = null,
        halfLabel = "-",
        retVal = "-",
        conn = []
      } = opts;

      const done = [];
      const hl = [];
      const match = [];
      for (let i = 0; i < arr.length; i++) {
        if (foundIdx === i) match.push(i);
        else if (i === mid) hl.push(i);
        else if (sortedRange && i >= sortedRange[0] && i <= sortedRange[1]) hl.push(i);
        else if (i < curL || i > curR) done.push(i);
      }

      const pointers = [];
      if (curL >= 0 && curL < arr.length) pointers.push({ idx: curL, label: `L=${curL}`, color: "blue" });
      if (mid >= 0 && mid < arr.length) pointers.push({ idx: mid, label: `mid=${mid}`, color: foundIdx === mid ? "green" : "purple" });
      if (curR >= 0 && curR < arr.length) pointers.push({ idx: curR, label: `R=${curR}`, color: "red" });

      return {
        boards: [
          {
            id: "arr",
            type: "array",
            name: "nums",
            typeLabel: "旋轉排序陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: [...arr],
            hl,
            match,
            done,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "binary_search_state",
            typeLabel: "二分搜尋關鍵變數",
            x: 24,
            y: 205,
            items: [
              { id: "target", name: "target", val: String(tgt), status: "" },
              { id: "range", name: "[L, R]", val: `[${curL}, ${curR}]`, status: curL <= curR ? "hl" : "warn" },
              { id: "midbox", name: "nums[mid]", val: mid >= 0 ? `nums[${mid}] = ${arr[mid]}` : "-", status: foundIdx >= 0 ? "match" : mid >= 0 ? "hl" : "" },
              { id: "half", name: "有序半邊", val: halfLabel, status: sortedRange ? "hl" : "" },
              { id: "ret", name: "return", val: String(retVal), status: retVal !== "-" ? (retVal === -1 ? "warn" : "match") : "" }
            ]
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 4,
      tag: "初始化指標",
      tagType: "default",
      inlineBadge: `L = 0, R = ${R}`,
      explanation: `初始化左右邊界指標 L = 0, R = ${R}，準備在旋轉排序陣列中二分搜尋 target = ${tgt}。`,
      vars: { L: "0", R: String(R), mid: "-", "nums[mid]": "-", target: String(tgt), return: "-" },
      state: buildState()
    });

    while (L <= R) {
      const mid = L + Math.floor((R - L) / 2);

      steps.push({
        line: 6,
        tag: "計算中點 mid",
        tagType: "tag-check",
        inlineBadge: `mid = ${mid}, nums[${mid}] = ${arr[mid]}`,
        explanation: `區間 [L=${L}, R=${R}] 有效，計算中點 mid = ${L} + (${R} - ${L}) / 2 = ${mid}，對應值 nums[${mid}] = ${arr[mid]}。`,
        vars: { L: String(L), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
        state: buildState({
          mid,
          conn: [{ from: `wb-cw-arr-${mid}`, to: "wb-var-midbox", label: `nums[${mid}]=${arr[mid]}`, color: "purple" }]
        })
      });

      if (arr[mid] === tgt) {
        steps.push({
          line: 7,
          tag: "命中目標值",
          tagType: "tag-found",
          inlineBadge: `nums[${mid}] == ${tgt} -> return ${mid}`,
          explanation: `中點元素 nums[${mid}] = ${arr[mid]} 等於 target = ${tgt}，直接回傳索引 ${mid}！`,
          vars: { L: String(L), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: String(mid) },
          state: buildState({
            mid,
            foundIdx: mid,
            retVal: mid,
            conn: [{ from: `wb-cw-arr-${mid}`, to: "wb-var-ret", label: `找到索引 ${mid}`, color: "green" }]
          })
        });
        return steps;
      }

      if (arr[L] <= arr[mid]) {
        const inLeft = arr[L] <= tgt && tgt < arr[mid];
        steps.push({
          line: 8,
          tag: "左半部有序",
          tagType: "tag-check",
          inlineBadge: `nums[${L}](${arr[L]}) <= nums[${mid}](${arr[mid]})`,
          explanation: `因為 nums[L]=${arr[L]} <= nums[mid]=${arr[mid]}，代表左半部子陣列 [${L}..${mid}] 是嚴格遞增有序的。`,
          vars: { L: String(L), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
          state: buildState({
            mid,
            sortedRange: [L, mid],
            halfLabel: `左半 [${L}..${mid}] (${arr[L]}..${arr[mid]})`,
            conn: [{ from: `wb-cw-arr-${L}`, to: "wb-var-half", label: `左半有序`, color: "blue" }]
          })
        });

        if (inLeft) {
          const nextR = mid - 1;
          steps.push({
            line: 9,
            tag: "縮減右界 R",
            tagType: "tag-insert",
            inlineBadge: `${arr[L]} <= ${tgt} < ${arr[mid]} => R = ${nextR}`,
            explanation: `target = ${tgt} 落在左半有序範圍 [${arr[L]}, ${arr[mid]}) 內，因此捨棄右半部，更新 R = mid - 1 = ${nextR}。`,
            vars: { L: String(L), R: String(nextR), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
            state: buildState({
              curL: L,
              curR: nextR,
              mid,
              halfLabel: `鎖定左半 [${L}..${nextR}]`
            })
          });
          R = nextR;
        } else {
          const nextL = mid + 1;
          steps.push({
            line: 10,
            tag: "縮減左界 L",
            tagType: "tag-insert",
            inlineBadge: `target 不在左半 => L = ${nextL}`,
            explanation: `target = ${tgt} 不在左半有序範圍 [${arr[L]}, ${arr[mid]}) 內，轉往右半部搜尋，更新 L = mid + 1 = ${nextL}。`,
            vars: { L: String(nextL), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
            state: buildState({
              curL: nextL,
              curR: R,
              mid,
              halfLabel: `轉往右半 [${nextL}..${R}]`
            })
          });
          L = nextL;
        }
      } else {
        const inRight = arr[mid] < tgt && tgt <= arr[R];
        steps.push({
          line: 11,
          tag: "右半部有序",
          tagType: "tag-check",
          inlineBadge: `nums[${L}](${arr[L]}) > nums[${mid}](${arr[mid]})`,
          explanation: `因為 nums[L]=${arr[L]} > nums[mid]=${arr[mid]}，旋轉斷點在左半，故右半部子陣列 [${mid}..${R}] 是嚴格遞增有序的。`,
          vars: { L: String(L), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
          state: buildState({
            mid,
            sortedRange: [mid, R],
            halfLabel: `右半 [${mid}..${R}] (${arr[mid]}..${arr[R]})`,
            conn: [{ from: `wb-cw-arr-${R}`, to: "wb-var-half", label: `右半有序`, color: "red" }]
          })
        });

        if (inRight) {
          const nextL = mid + 1;
          steps.push({
            line: 12,
            tag: "縮減左界 L",
            tagType: "tag-insert",
            inlineBadge: `${arr[mid]} < ${tgt} <= ${arr[R]} => L = ${nextL}`,
            explanation: `target = ${tgt} 落在右半有序範圍 (${arr[mid]}, ${arr[R]}] 內，捨棄左半部，更新 L = mid + 1 = ${nextL}。`,
            vars: { L: String(nextL), R: String(R), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
            state: buildState({
              curL: nextL,
              curR: R,
              mid,
              halfLabel: `鎖定右半 [${nextL}..${R}]`
            })
          });
          L = nextL;
        } else {
          const nextR = mid - 1;
          steps.push({
            line: 13,
            tag: "縮減右界 R",
            tagType: "tag-insert",
            inlineBadge: `target 不在右半 => R = ${nextR}`,
            explanation: `target = ${tgt} 不在右半有序範圍 (${arr[mid]}, ${arr[R]}] 內，轉往左半部搜尋，更新 R = mid - 1 = ${nextR}。`,
            vars: { L: String(L), R: String(nextR), mid: String(mid), "nums[mid]": String(arr[mid]), target: String(tgt), return: "-" },
            state: buildState({
              curL: L,
              curR: nextR,
              mid,
              halfLabel: `轉往左半 [${L}..${nextR}]`
            })
          });
          R = nextR;
        }
      }
    }

    steps.push({
      line: 16,
      tag: "搜尋失敗回傳 -1",
      tagType: "default",
      inlineBadge: `L(${L}) > R(${R}) -> return -1`,
      explanation: `搜尋區間已空 (L = ${L} > R = ${R})，陣列中不存在 target = ${tgt}，回傳 -1。`,
      vars: { L: String(L), R: String(R), mid: "-", "nums[mid]": "-", target: String(tgt), return: "-1" },
      state: buildState({ curL: L, curR: R, retVal: -1 })
    });

    return steps;
  }
};

// ============================================================================
// #43 Combination Sum (LC #39)
// ============================================================================
window.PROBLEMS["combination-sum"] = {
  id: 43,
  leetcodeId: 39,
  slug: "combination-sum",
  title: "39. Combination Sum (組合總和)",
  difficulty: "Medium",
  topic: "Recursion",
  mins: 30,
  complexity: "Time O(N^(T/M)) · Space O(T/M)",
  description:
    "給定無重複正整數陣列 candidates 與目標正整數 target，找出所有總和為 target 的組合（同一個數字可重複選取無限次）。使用回溯法 (Backtracking) 維護當前路徑 path 與剩餘目標值 remain，並從索引 idx 開始枚舉以避免產生重複排列。",
  argNames: ["candidates", "target"],

  presets: [
    {
      name: "範例 1：經典範例 candidates = [2, 3, 6, 7], target = 7",
      args: [[2, 3, 6, 7], 7]
    },
    {
      name: "範例 2：多組解 candidates = [2, 3, 5], target = 8",
      args: [[2, 3, 5], 8]
    },
    {
      name: "範例 3：無解情況 candidates = [3, 5], target = 4",
      args: [[3, 5], 4]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">dfs</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; cand, <span class="tok-kw">int</span> remain, <span class="tok-kw">int</span> idx,' },
    { line: 3,  code: '             <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; path, <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; res) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (remain == <span class="tok-num">0</span>) { res.<span class="tok-fn">push_back</span>(path); <span class="tok-kw">return</span>; }' },
    { line: 5,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = idx; i &lt; cand.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 6,  code: '            <span class="tok-kw">if</span> (cand[i] &gt; remain) <span class="tok-kw">continue</span>; <span class="tok-cmt">// 剪枝：超過剩餘值</span>' },
    { line: 7,  code: '            path.<span class="tok-fn">push_back</span>(cand[i]);' },
    { line: 8,  code: '            <span class="tok-fn">dfs</span>(cand, remain - cand[i], i, path, res);' },
    { line: 9,  code: '            path.<span class="tok-fn">pop_back</span>(); <span class="tok-cmt">// 回溯復原</span>' },
    { line: 10, code: '        }' },
    { line: 11, code: '    }' },
    { line: 12, code: '<span class="tok-kw">public</span>:' },
    { line: 13, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">combinationSum</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; cand, <span class="tok-kw">int</span> target) {' },
    { line: 14, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; res; <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; path;' },
    { line: 15, code: '        <span class="tok-fn">dfs</span>(cand, target, <span class="tok-num">0</span>, path, res);' },
    { line: 16, code: '        <span class="tok-kw">return</span> res;' },
    { line: 17, code: '    }' },
    { line: 18, code: '};' }
  ],

  generateTrace(candidates, target) {
    const cand = Array.isArray(candidates) ? [...candidates] : [2, 3, 6, 7];
    const tgt = Number(target ?? 7);
    const steps = [];
    const path = [];
    const results = [];

    const snapshot = (opts = {}) => {
      const { curIdx = -1, remain = tgt, status = "", justFound = false } = opts;
      return {
        boards: [
          {
            id: "cand",
            type: "array",
            name: "candidates",
            typeLabel: "候選數字 (vector<int>)",
            x: 325,
            y: 52,
            values: [...cand],
            hl: curIdx >= 0 && status !== "warn" ? [curIdx] : [],
            warn: curIdx >= 0 && status === "warn" ? [curIdx] : [],
            pointers: curIdx >= 0 ? [{ idx: curIdx, label: `i=${curIdx}`, color: status === "warn" ? "red" : "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "dfs_state",
            typeLabel: "回溯狀態變數",
            x: 24,
            y: 205,
            items: [
              { id: "rem", name: "remain", val: String(remain), status: remain === 0 ? "match" : status === "warn" ? "warn" : "hl" },
              { id: "idx", name: "idx", val: curIdx >= 0 ? String(curIdx) : "0", status: "" },
              { id: "sum", name: "path_sum", val: String(tgt - remain), status: remain === 0 ? "match" : "" }
            ]
          },
          {
            id: "path",
            type: "stack",
            name: "path",
            typeLabel: "當前組合堆疊 (vector<int>)",
            x: 325,
            y: 205,
            topText: "↓ path.back()",
            items: path.map((v, i) => ({
              val: v,
              status: justFound ? "match" : i === path.length - 1 ? "hl" : ""
            }))
          },
          {
            id: "res",
            type: "set",
            name: "res",
            typeLabel: `合法組合集合 (共 ${results.length} 組)`,
            x: 520,
            y: 205,
            items: results.map((comb, i) => ({
              val: `[${comb.join(",")}]`,
              status: justFound && i === results.length - 1 ? "inserted" : ""
            }))
          }
        ]
      };
    };

    steps.push({
      line: 15,
      tag: "啟動 DFS 回溯",
      tagType: "default",
      inlineBadge: `dfs(cand, remain=${tgt}, idx=0)`,
      explanation: `初始化空路徑 path = [] 與結果陣列 res = []，從索引 idx = 0、剩餘目標值 remain = ${tgt} 開始深度優先搜尋。`,
      vars: { remain: String(tgt), idx: "0", path: "[]", "res.size()": "0" },
      state: snapshot({ curIdx: 0, remain: tgt })
    });

    let stepLimit = 75;
    function dfs(remain, idx) {
      if (steps.length >= stepLimit) return;

      if (remain === 0) {
        results.push([...path]);
        steps.push({
          line: 4,
          tag: "湊出目標組合！",
          tagType: "tag-found",
          inlineBadge: `remain == 0 => push [${path.join(", ")}]`,
          explanation: `剩餘值 remain == 0，代表當前路徑 [${path.join(", ")}] 總和剛好等於 ${tgt}，將其加入結果集 res！`,
          vars: { remain: "0", idx: String(idx), path: `[${path.join(",")}]`, "res.size()": String(results.length) },
          state: snapshot({ curIdx: idx, remain: 0, justFound: true })
        });
        return;
      }

      for (let i = idx; i < cand.length; i++) {
        if (steps.length >= stepLimit) return;
        const val = cand[i];

        if (val > remain) {
          steps.push({
            line: 6,
            tag: `剪枝略過 ${val}`,
            tagType: "default",
            inlineBadge: `cand[${i}](${val}) > remain(${remain})`,
            explanation: `候選值 cand[${i}] = ${val} 大於剩餘目標 remain = ${remain}，無法選取，直接剪枝略過。`,
            vars: { remain: String(remain), idx: String(i), path: `[${path.join(",")}]`, "res.size()": String(results.length) },
            state: snapshot({ curIdx: i, remain, status: "warn" })
          });
          continue;
        }

        path.push(val);
        const nextRem = remain - val;
        steps.push({
          line: 7,
          tag: `選取 ${val}`,
          tagType: "tag-insert",
          inlineBadge: `path.push_back(${val}), remain -> ${nextRem}`,
          explanation: `將 cand[${i}] = ${val} 放入 path，當前路徑變為 [${path.join(", ")}]，剩餘目標值減為 ${nextRem}。`,
          vars: { remain: String(nextRem), idx: String(i), path: `[${path.join(",")}]`, "res.size()": String(results.length) },
          state: snapshot({ curIdx: i, remain: nextRem })
        });

        dfs(nextRem, i);

        path.pop();
        if (steps.length < stepLimit) {
          steps.push({
            line: 9,
            tag: `回溯移除 ${val}`,
            tagType: "tag-check",
            inlineBadge: `path.pop_back() -> [${path.join(", ")}]`,
            explanation: `結束針對 [${[...path, val].join(", ")}] 的子樹探索，執行 path.pop_back() 退回 ${val}，恢復 remain = ${remain}。`,
            vars: { remain: String(remain), idx: String(i), path: `[${path.join(",")}]`, "res.size()": String(results.length) },
            state: snapshot({ curIdx: i, remain })
          });
        }
      }
    }

    dfs(tgt, 0);

    steps.push({
      line: 16,
      tag: "回傳所有組合",
      tagType: "tag-found",
      inlineBadge: `return res (${results.length} 組解)`,
      explanation: `回溯搜尋完成，共找到 ${results.length} 組總和為 ${tgt} 的不重複組合。`,
      vars: { remain: "-", idx: "-", path: "[]", "res.size()": String(results.length) },
      state: snapshot({ curIdx: -1, remain: tgt })
    });

    return steps;
  }
};

// ============================================================================
// #44 Permutations (LC #46)
// ============================================================================
window.PROBLEMS["permutations"] = {
  id: 44,
  leetcodeId: 46,
  slug: "permutations",
  title: "46. Permutations (全排列)",
  difficulty: "Medium",
  topic: "Recursion",
  mins: 30,
  complexity: "Time O(N · N!) · Space O(N)",
  description:
    "給定一個不含重複數字的陣列 nums，回傳所有可能的全排列。利用原地交換回溯法 (In-place Swap Backtracking)：第 idx 層遞迴將 nums[idx] 依序與 nums[i] (i >= idx) 交換以固定第 idx 個位置，遞迴結束後再交換回來還原狀態。",
  argNames: ["nums"],

  presets: [
    {
      name: "範例 1：3 個元素全排列 nums = [1, 2, 3] (6 組)",
      args: [[1, 2, 3]]
    },
    {
      name: "範例 2：2 個元素全排列 nums = [0, 1] (2 組)",
      args: [[0, 1]]
    },
    {
      name: "範例 3：包含負數 nums = [-1, 2, 5] (6 組)",
      args: [[-1, 2, 5]]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">backtrack</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums, <span class="tok-kw">int</span> idx, <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; res) {' },
    { line: 3,  code: '        <span class="tok-kw">if</span> (idx == nums.<span class="tok-fn">size</span>()) {' },
    { line: 4,  code: '            res.<span class="tok-fn">push_back</span>(nums);' },
    { line: 5,  code: '            <span class="tok-kw">return</span>;' },
    { line: 6,  code: '        }' },
    { line: 7,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = idx; i &lt; nums.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 8,  code: '            <span class="tok-fn">swap</span>(nums[idx], nums[i]); <span class="tok-cmt">// 選定 nums[i] 放到位置 idx</span>' },
    { line: 9,  code: '            <span class="tok-fn">backtrack</span>(nums, idx + <span class="tok-num">1</span>, res);' },
    { line: 10, code: '            <span class="tok-fn">swap</span>(nums[idx], nums[i]); <span class="tok-cmt">// 回溯還原交換</span>' },
    { line: 11, code: '        }' },
    { line: 12, code: '    }' },
    { line: 13, code: '<span class="tok-kw">public</span>:' },
    { line: 14, code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">permute</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums) {' },
    { line: 15, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; res;' },
    { line: 16, code: '        <span class="tok-fn">backtrack</span>(nums, <span class="tok-num">0</span>, res);' },
    { line: 17, code: '        <span class="tok-kw">return</span> res;' },
    { line: 18, code: '    }' },
    { line: 19, code: '};' }
  ],

  generateTrace(nums) {
    const arr = Array.isArray(nums) ? [...nums].slice(0, 4) : [1, 2, 3];
    const steps = [];
    const results = [];

    const buildState = (opts = {}) => {
      const { idx = 0, swapI = -1, isLeaf = false } = opts;
      const done = [];
      const hl = [];
      const match = [];
      for (let k = 0; k < arr.length; k++) {
        if (isLeaf) match.push(k);
        else if (k === idx || k === swapI) hl.push(k);
        else if (k < idx) done.push(k);
      }

      const pointers = [];
      if (idx < arr.length) pointers.push({ idx, label: `idx=${idx}`, color: "blue" });
      if (swapI >= 0 && swapI < arr.length) pointers.push({ idx: swapI, label: `i=${swapI}`, color: "purple" });

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "當前排列緩衝陣列 (vector<int>&)",
            x: 325,
            y: 52,
            values: [...arr],
            hl,
            match,
            done,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "perm_vars",
            typeLabel: "遞迴深度與狀態",
            x: 24,
            y: 205,
            items: [
              { id: "idx", name: "idx (固定位)", val: String(idx), status: isLeaf ? "match" : "hl" },
              { id: "i", name: "i (交換位)", val: swapI >= 0 ? String(swapI) : "-", status: swapI >= 0 ? "hl" : "" },
              { id: "cnt", name: "res.size()", val: String(results.length), status: isLeaf ? "match" : "" }
            ]
          },
          {
            id: "res",
            type: "set",
            name: "res",
            typeLabel: `已收集全排列 (${results.length} 組)`,
            x: 325,
            y: 205,
            items: results.map((p, k) => ({
              val: `[${p.join(",")}]`,
              status: isLeaf && k === results.length - 1 ? "inserted" : ""
            }))
          }
        ]
      };
    };

    steps.push({
      line: 16,
      tag: "開始全排列回溯",
      tagType: "default",
      inlineBadge: `backtrack(nums, idx=0)`,
      explanation: `呼叫 backtrack(nums, 0, res)，從第 0 個位置開始依序固定每個位置的元素。`,
      vars: { idx: "0", i: "-", nums: `[${arr.join(",")}]`, "res.size()": "0" },
      state: buildState({ idx: 0 })
    });

    function backtrack(idx) {
      if (idx === arr.length) {
        results.push([...arr]);
        steps.push({
          line: 4,
          tag: "收集完整排列",
          tagType: "tag-found",
          inlineBadge: `res.push_back([${arr.join(", ")}])`,
          explanation: `遞迴深度 idx == ${arr.length}，所有位置皆已固定，將排列 [${arr.join(", ")}] 存入 res（第 ${results.length} 組）。`,
          vars: { idx: String(idx), i: "-", nums: `[${arr.join(",")}]`, "res.size()": String(results.length) },
          state: buildState({ idx, isLeaf: true })
        });
        return;
      }

      for (let i = idx; i < arr.length; i++) {
        const tmp = arr[idx];
        arr[idx] = arr[i];
        arr[i] = tmp;

        steps.push({
          line: 8,
          tag: `交換固定位置 ${idx}`,
          tagType: "tag-insert",
          inlineBadge: `swap(nums[${idx}], nums[${i}]) -> [${arr.join(",")}]`,
          explanation: `將索引 i = ${i} 的元素 (${arr[idx]}) 交換到位置 idx = ${idx}，固定前 ${idx + 1} 個元素為 [${arr.slice(0, idx + 1).join(", ")}]。`,
          vars: { idx: String(idx), i: String(i), nums: `[${arr.join(",")}]`, "res.size()": String(results.length) },
          state: buildState({ idx, swapI: i })
        });

        backtrack(idx + 1);

        const tmp2 = arr[idx];
        arr[idx] = arr[i];
        arr[i] = tmp2;

        steps.push({
          line: 10,
          tag: `回溯還原位置 ${idx}`,
          tagType: "tag-check",
          inlineBadge: `swap(nums[${idx}], nums[${i}]) -> [${arr.join(",")}]`,
          explanation: `回溯：將 nums[${idx}] 與 nums[${i}] 交換回來，還原陣列為 [${arr.join(", ")}]，準備嘗試下一個 i。`,
          vars: { idx: String(idx), i: String(i), nums: `[${arr.join(",")}]`, "res.size()": String(results.length) },
          state: buildState({ idx, swapI: i })
        });
      }
    }

    backtrack(0);

    steps.push({
      line: 17,
      tag: "完成全排列",
      tagType: "tag-found",
      inlineBadge: `return res (共 ${results.length} 組排列)`,
      explanation: `全排列回溯結束，共產生 ${results.length} 組排列並回傳。`,
      vars: { idx: "-", i: "-", nums: `[${arr.join(",")}]`, "res.size()": String(results.length) },
      state: buildState({ idx: arr.length, isLeaf: true })
    });

    return steps;
  }
};

// ============================================================================
// #45 Merge Intervals (LC #56)
// ============================================================================
window.PROBLEMS["merge-intervals"] = {
  id: 45,
  leetcodeId: 56,
  slug: "merge-intervals",
  title: "56. Merge Intervals (合併區間)",
  difficulty: "Medium",
  topic: "Array",
  mins: 30,
  complexity: "Time O(N log N) · Space O(N)",
  description:
    "給定一個區間陣列 intervals，其中 intervals[i] = [start_i, end_i]，請合併所有重疊的區間。先將所有區間依左端點 start 升序排序，再線性掃描：若當前區間左端點 <= merged.back()[1] 則代表重疊，直接取 max 更新右端點；否則直接放入 merged。",
  argNames: ["intervals"],

  presets: [
    {
      name: "範例 1：標準區間合併 [[1,3],[2,6],[8,10],[15,18]]",
      args: [[[1, 3], [2, 6], [8, 10], [15, 18]]]
    },
    {
      name: "範例 2：端點相接重疊 [[1,4],[4,5]]",
      args: [[[1, 4], [4, 5]]]
    },
    {
      name: "範例 3：未排序且完全包含 [[4,7],[1,10],[2,6],[12,15]]",
      args: [[[4, 7], [1, 10], [2, 6], [12, 15]]]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">merge</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; intervals) {' },
    { line: 4,  code: '        <span class="tok-fn">sort</span>(intervals.<span class="tok-fn">begin</span>(), intervals.<span class="tok-fn">end</span>());' },
    { line: 5,  code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; merged;' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">const</span> <span class="tok-kw">auto</span>&amp; cur : intervals) {' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (merged.<span class="tok-fn">empty</span>() || merged.<span class="tok-fn">back</span>()[<span class="tok-num">1</span>] &lt; cur[<span class="tok-num">0</span>]) {' },
    { line: 8,  code: '                merged.<span class="tok-fn">push_back</span>(cur); <span class="tok-cmt">// 無重疊，新增區間</span>' },
    { line: 9,  code: '            } <span class="tok-kw">else</span> {' },
    { line: 10, code: '                merged.<span class="tok-fn">back</span>()[<span class="tok-num">1</span>] = <span class="tok-fn">max</span>(merged.<span class="tok-fn">back</span>()[<span class="tok-num">1</span>], cur[<span class="tok-num">1</span>]);' },
    { line: 11, code: '            }' },
    { line: 12, code: '        }' },
    { line: 13, code: '        <span class="tok-kw">return</span> merged;' },
    { line: 14, code: '    }' },
    { line: 15, code: '};' }
  ],

  generateTrace(intervals) {
    const raw = Array.isArray(intervals) ? intervals.map((x) => [...x]) : [[1, 3], [2, 6], [8, 10], [15, 18]];
    const steps = [];
    const merged = [];

    const fmt = (iv) => `[${iv[0]},${iv[1]}]`;

    const buildState = (arr, curIdx, action, conn = []) => {
      return {
        boards: [
          {
            id: "ivs",
            type: "array",
            name: "intervals",
            typeLabel: "排序後區間陣列 (vector<vector<int>>)",
            x: 325,
            y: 52,
            values: arr.map(fmt),
            hl: curIdx >= 0 ? [curIdx] : [],
            done: Array.from({ length: Math.max(0, curIdx) }, (_, k) => k),
            pointers: curIdx >= 0 ? [{ idx: curIdx, label: `cur=${fmt(arr[curIdx])}`, color: "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "merge_check",
            typeLabel: "重疊判斷條件",
            x: 24,
            y: 205,
            items: [
              { id: "cur", name: "cur", val: curIdx >= 0 ? fmt(arr[curIdx]) : "-", status: curIdx >= 0 ? "hl" : "" },
              { id: "back", name: "merged.back()", val: merged.length ? fmt(merged[merged.length - 1]) : "empty", status: action === "merge" ? "match" : "" },
              { id: "act", name: "動作", val: action === "merge" ? "重疊 → 擴展右界" : action === "push" ? "不重疊 → 新增" : "待處理", status: action === "merge" ? "match" : action === "push" ? "hl" : "" }
            ]
          },
          {
            id: "merged",
            type: "array",
            name: "merged",
            typeLabel: `合併結果陣列 (${merged.length} 個區間)`,
            x: 325,
            y: 205,
            values: merged.map(fmt),
            hl: action === "push" && merged.length ? [merged.length - 1] : [],
            match: action === "merge" && merged.length ? [merged.length - 1] : [],
            pointers: merged.length ? [{ idx: merged.length - 1, label: "back()", color: action === "merge" ? "green" : "purple" }] : []
          }
        ],
        connectors: conn
      };
    };

    const sorted = [...raw].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    steps.push({
      line: 4,
      tag: "依起點排序區間",
      tagType: "default",
      inlineBadge: `sort -> ${sorted.map(fmt).join(", ")}`,
      explanation: `將輸入區間依左端點 start 由小到大排序，得到 ${sorted.map(fmt).join(", ")}，確保可重疊的區間一定相鄰。`,
      vars: { i: "-", cur: "-", "merged.back()": "empty", "merged.size()": "0" },
      state: buildState(sorted, -1, "")
    });

    for (let i = 0; i < sorted.length; i++) {
      const cur = sorted[i];
      const isDisjoint = merged.length === 0 || merged[merged.length - 1][1] < cur[0];

      steps.push({
        line: 7,
        tag: `檢查區間 ${fmt(cur)}`,
        tagType: "tag-check",
        inlineBadge:
          merged.length === 0
            ? `merged.empty() == true`
            : `back()[1](${merged[merged.length - 1][1]}) ${isDisjoint ? "<" : ">="} cur[0](${cur[0]})`,
        explanation:
          merged.length === 0
            ? `目前 merged 為空，準備放入第一個區間 ${fmt(cur)}。`
            : `比較 merged.back() 的右端點 ${merged[merged.length - 1][1]} 與當前區間 ${fmt(cur)} 的左端點 ${cur[0]}：${
                isDisjoint ? "無重疊" : "發生重疊！"
              }`,
        vars: {
          i: String(i),
          cur: fmt(cur),
          "merged.back()": merged.length ? fmt(merged[merged.length - 1]) : "empty",
          "merged.size()": String(merged.length)
        },
        state: buildState(sorted, i, "", [
          { from: `wb-cw-ivs-${i}`, to: "wb-var-cur", label: `檢查 ${fmt(cur)}`, color: "blue" }
        ])
      });

      if (isDisjoint) {
        merged.push([...cur]);
        steps.push({
          line: 8,
          tag: `新增不重疊區間`,
          tagType: "tag-insert",
          inlineBadge: `merged.push_back(${fmt(cur)})`,
          explanation: `區間 ${fmt(cur)} 與前一個區間不重疊，直接加入 merged 尾端。`,
          vars: {
            i: String(i),
            cur: fmt(cur),
            "merged.back()": fmt(merged[merged.length - 1]),
            "merged.size()": String(merged.length)
          },
          state: buildState(sorted, i, "push", [
            { from: `wb-cw-ivs-${i}`, to: `wb-cw-merged-${merged.length - 1}`, label: `push_back`, color: "purple" }
          ])
        });
      } else {
        const oldEnd = merged[merged.length - 1][1];
        const newEnd = Math.max(oldEnd, cur[1]);
        merged[merged.length - 1][1] = newEnd;
        steps.push({
          line: 10,
          tag: `合併重疊區間`,
          tagType: "tag-found",
          inlineBadge: `back()[1] = max(${oldEnd}, ${cur[1]}) = ${newEnd}`,
          explanation: `區間 ${fmt(cur)} 與前一區間重疊，將 merged.back() 右端點更新為 max(${oldEnd}, ${cur[1]}) = ${newEnd}，合併為 ${fmt(merged[merged.length - 1])}。`,
          vars: {
            i: String(i),
            cur: fmt(cur),
            "merged.back()": fmt(merged[merged.length - 1]),
            "merged.size()": String(merged.length)
          },
          state: buildState(sorted, i, "merge", [
            { from: `wb-cw-ivs-${i}`, to: `wb-cw-merged-${merged.length - 1}`, label: `合併為 ${fmt(merged[merged.length - 1])}`, color: "green" }
          ])
        });
      }
    }

    steps.push({
      line: 13,
      tag: "回傳合併結果",
      tagType: "tag-found",
      inlineBadge: `return ${merged.map(fmt).join(", ")}`,
      explanation: `所有區間掃描完畢，回傳合併後的 ${merged.length} 個區間：${merged.map(fmt).join(", ")}。`,
      vars: {
        i: "done",
        cur: "-",
        "merged.back()": merged.length ? fmt(merged[merged.length - 1]) : "-",
        "merged.size()": String(merged.length)
      },
      state: buildState(sorted, -1, "merge")
    });

    return steps;
  }
};

// ============================================================================
// #46 Lowest Common Ancestor of a Binary Tree (LC #236)
// ============================================================================
window.PROBLEMS["lowest-common-ancestor-of-a-binary-tree"] = {
  id: 46,
  leetcodeId: 236,
  slug: "lowest-common-ancestor-of-a-binary-tree",
  title: "236. Lowest Common Ancestor of a Binary Tree (二元樹的最近公共祖先)",
  difficulty: "Medium",
  topic: "Binary Tree",
  mins: 25,
  complexity: "Time O(N) · Space O(H)",
  description:
    "給定一棵一般二元樹 root 以及兩個目標節點 p 與 q，找出它們的最近公共祖先 (LCA)。透過後序 DFS：若當前節點為空或等於 p 或 q，直接回傳該節點；遞迴搜尋左右子樹得到 left 與 right，若兩者皆非空代表 p, q 分居左右兩側，當前節點即為 LCA！",
  argNames: ["tree", "p", "q"],

  presets: [
    {
      name: "範例 1：p=5, q=1 分居左右子樹 -> LCA 為 3",
      args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1]
    },
    {
      name: "範例 2：p=5 為 q=4 的直系祖先 -> LCA 為 5",
      args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4]
    },
    {
      name: "範例 3：同在左子樹 p=6, q=4 -> LCA 為 5",
      args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 6, 4]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">TreeNode</span>* <span class="tok-fn">lowestCommonAncestor</span>(<span class="tok-type">TreeNode</span>* root, <span class="tok-type">TreeNode</span>* p, <span class="tok-type">TreeNode</span>* q) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (!root || root == p || root == q) <span class="tok-kw">return</span> root;' },
    { line: 5,  code: '        <span class="tok-type">TreeNode</span>* left = <span class="tok-fn">lowestCommonAncestor</span>(root-&gt;left, p, q);' },
    { line: 6,  code: '        <span class="tok-type">TreeNode</span>* right = <span class="tok-fn">lowestCommonAncestor</span>(root-&gt;right, p, q);' },
    { line: 7,  code: '        <span class="tok-kw">if</span> (left &amp;&amp; right) <span class="tok-kw">return</span> root; <span class="tok-cmt">// p, q 分居左右，root 即 LCA</span>' },
    { line: 8,  code: '        <span class="tok-kw">return</span> left ? left : right;' },
    { line: 9,  code: '    }' },
    { line: 10, code: '};' }
  ],

  generateTrace(treeArr, pVal, qVal) {
    const arr = Array.isArray(treeArr) && treeArr.length ? treeArr : [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];
    const p = Number(pVal ?? 5);
    const q = Number(qVal ?? 1);
    const steps = [];

    // Build layout coordinates for binary tree level-order array (up to 4 levels)
    const coords = [
      { x: 320, y: 40 },
      { x: 170, y: 108 }, { x: 470, y: 108 },
      { x: 95,  y: 176 }, { x: 245, y: 176 }, { x: 395, y: 176 }, { x: 545, y: 176 },
      { x: 58,  y: 244 }, { x: 132, y: 244 }, { x: 208, y: 244 }, { x: 282, y: 244 },
      { x: 358, y: 244 }, { x: 432, y: 244 }, { x: 508, y: 244 }, { x: 582, y: 244 }
    ];

    const retMap = {}; // idx -> returned value label

    const renderTreeState = (curIdx, lcaIdx, leftRet, rightRet) => {
      const nodes = [];
      const edges = [];
      for (let i = 0; i < Math.min(arr.length, coords.length); i++) {
        if (arr[i] === null || arr[i] === undefined) continue;
        let status = "";
        if (i === lcaIdx) status = "match";
        else if (i === curIdx) status = "hl";
        else if (arr[i] === p || arr[i] === q) status = "match";
        else if (retMap[i] !== undefined) status = "done";

        const subParts = [];
        if (arr[i] === p) subParts.push("p");
        if (arr[i] === q) subParts.push("q");
        if (retMap[i] !== undefined) subParts.push(`ret=${retMap[i]}`);

        nodes.push({
          id: `n${i}`,
          val: String(arr[i]),
          x: coords[i].x,
          y: coords[i].y,
          status,
          ptr: i === lcaIdx ? "LCA!" : i === curIdx ? "curr" : "",
          sub: subParts.join(" ")
        });

        const li = 2 * i + 1;
        const ri = 2 * i + 2;
        if (li < arr.length && arr[li] !== null && arr[li] !== undefined && coords[li]) {
          edges.push({
            from: `n${i}`,
            to: `n${li}`,
            label: "L",
            dir: true,
            status: retMap[li] && retMap[li] !== "null" ? "match" : curIdx === li ? "hl" : ""
          });
        }
        if (ri < arr.length && arr[ri] !== null && arr[ri] !== undefined && coords[ri]) {
          edges.push({
            from: `n${i}`,
            to: `n${ri}`,
            label: "R",
            dir: true,
            status: retMap[ri] && retMap[ri] !== "null" ? "match" : curIdx === ri ? "hl" : ""
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
            typeLabel: `二元樹後序 DFS (尋找 p=${p}, q=${q})`,
            x: 325,
            y: 52,
            width: 640,
            height: 300,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "lca_vars",
            typeLabel: "遞迴回傳狀態",
            x: 24,
            y: 205,
            items: [
              { id: "pq", name: "(p, q)", val: `(${p}, ${q})`, status: "" },
              { id: "cur", name: "root", val: curIdx >= 0 && arr[curIdx] != null ? String(arr[curIdx]) : "null", status: "hl" },
              { id: "lret", name: "left", val: leftRet, status: leftRet !== "-" && leftRet !== "null" ? "match" : "" },
              { id: "rret", name: "right", val: rightRet, status: rightRet !== "-" && rightRet !== "null" ? "match" : "" }
            ]
          }
        ]
      };
    };

    function dfs(idx) {
      if (idx >= arr.length || arr[idx] === null || arr[idx] === undefined) {
        return null;
      }
      const val = arr[idx];

      steps.push({
        line: 4,
        tag: `走訪節點 ${val}`,
        tagType: val === p || val === q ? "tag-found" : "tag-check",
        inlineBadge: `root = ${val} ${val === p ? "(命中 p!)" : val === q ? "(命中 q!)" : ""}`,
        explanation:
          val === p || val === q
            ? `走訪節點 ${val}，發現它就是目標節點 ${val === p ? `p=${p}` : `q=${q}`}！直接向上回傳節點 ${val}（無需繼續往下找）。`
            : `走訪節點 ${val}，它不是 p(${p}) 也不是 q(${q})，準備遞迴搜尋其左右子樹。`,
        vars: { root: String(val), p: String(p), q: String(q), left: "-", right: "-" },
        state: renderTreeState(idx, -1, "-", "-")
      });

      if (val === p || val === q) {
        retMap[idx] = String(val);
        return val;
      }

      const leftVal = dfs(2 * idx + 1);
      const leftStr = leftVal === null ? "null" : String(leftVal);

      const rightVal = dfs(2 * idx + 2);
      const rightStr = rightVal === null ? "null" : String(rightVal);

      if (leftVal !== null && rightVal !== null) {
        retMap[idx] = String(val);
        steps.push({
          line: 7,
          tag: `找到 LCA = ${val}！`,
          tagType: "tag-found",
          inlineBadge: `left(${leftStr}) && right(${rightStr}) => return ${val}`,
          explanation: `在節點 ${val} 處，左子樹回傳 ${leftStr}、右子樹回傳 ${rightStr}，兩側皆非空！代表 p 與 q 分居 ${val} 的左右子樹，節點 ${val} 即為最近公共祖先！`,
          vars: { root: String(val), p: String(p), q: String(q), left: leftStr, right: rightStr },
          state: renderTreeState(idx, idx, leftStr, rightStr)
        });
        return val;
      }

      const picked = leftVal !== null ? leftVal : rightVal;
      const pickedStr = picked === null ? "null" : String(picked);
      retMap[idx] = pickedStr;

      steps.push({
        line: 8,
        tag: `節點 ${val} 向上回傳 ${pickedStr}`,
        tagType: picked !== null ? "tag-insert" : "default",
        inlineBadge: `left=${leftStr}, right=${rightStr} => return ${pickedStr}`,
        explanation: `節點 ${val} 的左右子樹回傳值為 left=${leftStr}, right=${rightStr}，將非空結果 ${pickedStr} 繼續向上層回傳。`,
        vars: { root: String(val), p: String(p), q: String(q), left: leftStr, right: rightStr },
        state: renderTreeState(idx, -1, leftStr, rightStr)
      });

      return picked;
    }

    const ans = dfs(0);
    const ansIdx = arr.indexOf(ans);

    steps.push({
      line: 9,
      tag: `最終回傳 LCA = ${ans}`,
      tagType: "tag-found",
      inlineBadge: `LCA(${p}, ${q}) = ${ans}`,
      explanation: `整棵二元樹後序 DFS 完成，節點 ${p} 與節點 ${q} 的最近公共祖先 (LCA) 為節點 ${ans}。`,
      vars: { root: String(arr[0]), p: String(p), q: String(q), left: "-", right: "-", return: String(ans) },
      state: renderTreeState(ansIdx, ansIdx, "-", "-")
    });

    return steps;
  }
};

// ============================================================================
// #47 Time Based Key-Value Store (LC #981)
// ============================================================================
window.PROBLEMS["time-based-key-value-store"] = {
  id: 47,
  leetcodeId: 981,
  slug: "time-based-key-value-store",
  title: "981. Time Based Key-Value Store (基於時間的鍵值儲存)",
  difficulty: "Medium",
  topic: "Binary Search",
  mins: 35,
  complexity: "set: O(1) · get: O(log N) · Space O(N)",
  description:
    "設計一個支援時間戳記的鍵值儲存類別 TimeMap：set(key, value, timestamp) 由於題目保證寫入的 timestamp 嚴格遞增，可直接 push_back 到 unordered_map<string, vector<pair<int, string>>>；get(key, timestamp) 則在該陣列上執行二分搜尋，尋找最大的 timestamp_prev <= timestamp。",
  argNames: ["operations"],

  presets: [
    {
      name: "範例 1：LeetCode 標準序列 (set foo=bar@1, get@1, get@3, set foo=bar2@4, get@4, get@5)",
      args: [
        [
          ["set", "foo", "bar", 1],
          ["get", "foo", 1],
          ["get", "foo", 3],
          ["set", "foo", "bar2", 4],
          ["get", "foo", 4],
          ["get", "foo", 5]
        ]
      ]
    },
    {
      name: "範例 2：多個時間點二分查找與早於首筆查詢",
      args: [
        [
          ["set", "k1", "v10", 10],
          ["set", "k1", "v20", 20],
          ["set", "k1", "v30", 30],
          ["get", "k1", 5],
          ["get", "k1", 25],
          ["get", "k1", 30]
        ]
      ]
    },
    {
      name: "範例 3：密集時間戳二分收斂",
      args: [
        [
          ["set", "user", "online", 2],
          ["set", "user", "idle", 5],
          ["set", "user", "away", 9],
          ["set", "user", "offline", 14],
          ["get", "user", 11]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">TimeMap</span> {' },
    { line: 2,  code: '    <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">string</span>, <span class="tok-type">vector</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-kw">int</span>, <span class="tok-type">string</span>&gt;&gt;&gt; store;' },
    { line: 3,  code: '<span class="tok-kw">public</span>:' },
    { line: 4,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">set</span>(<span class="tok-type">string</span> key, <span class="tok-type">string</span> value, <span class="tok-kw">int</span> timestamp) {' },
    { line: 5,  code: '        store[key].<span class="tok-fn">push_back</span>({timestamp, value}); <span class="tok-cmt">// 時間戳遞增，O(1) 尾端附加</span>' },
    { line: 6,  code: '    }' },
    { line: 7,  code: '    <span class="tok-type">string</span> <span class="tok-fn">get</span>(<span class="tok-type">string</span> key, <span class="tok-kw">int</span> timestamp) {' },
    { line: 8,  code: '        <span class="tok-kw">auto</span>&amp; vec = store[key];' },
    { line: 9,  code: '        <span class="tok-kw">int</span> L = <span class="tok-num">0</span>, R = (<span class="tok-kw">int</span>)vec.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 10, code: '        <span class="tok-type">string</span> ans = <span class="tok-num">""</span>;' },
    { line: 11, code: '        <span class="tok-kw">while</span> (L &lt;= R) {' },
    { line: 12, code: '            <span class="tok-kw">int</span> mid = L + (R - L) / <span class="tok-num">2</span>;' },
    { line: 13, code: '            <span class="tok-kw">if</span> (vec[mid].first &lt;= timestamp) {' },
    { line: 14, code: '                ans = vec[mid].second; <span class="tok-cmt">// 記錄候選答案，繼續往右找更大時間戳</span>' },
    { line: 15, code: '                L = mid + <span class="tok-num">1</span>;' },
    { line: 16, code: '            } <span class="tok-kw">else</span> {' },
    { line: 17, code: '                R = mid - <span class="tok-num">1</span>;' },
    { line: 18, code: '            }' },
    { line: 19, code: '        }' },
    { line: 20, code: '        <span class="tok-kw">return</span> ans;' },
    { line: 21, code: '    }' },
    { line: 22, code: '};' }
  ],

  generateTrace(operations) {
    const ops = Array.isArray(operations) && operations.length
      ? operations
      : [
          ["set", "foo", "bar", 1],
          ["get", "foo", 1],
          ["get", "foo", 3],
          ["set", "foo", "bar2", 4],
          ["get", "foo", 4],
          ["get", "foo", 5]
        ];

    const steps = [];
    const store = {}; // key -> [{ ts, val }]

    const fmtOp = (op) =>
      op[0] === "set" ? `set("${op[1]}","${op[2]}",${op[3]})` : `get("${op[1]}",${op[2]})`;

    const buildState = (opIdx, key, bs = {}) => {
      const vec = store[key] || [];
      const { L = -1, R = -1, mid = -1, bestIdx = -1, ans = "-", queryTs = "-" } = bs;

      const pointers = [];
      if (L >= 0 && L < vec.length) pointers.push({ idx: L, label: `L=${L}`, color: "blue" });
      if (mid >= 0 && mid < vec.length) pointers.push({ idx: mid, label: `mid=${mid}`, color: "purple" });
      if (R >= 0 && R < vec.length) pointers.push({ idx: R, label: `R=${R}`, color: "red" });

      return {
        boards: [
          {
            id: "ops",
            type: "array",
            name: "operations",
            typeLabel: "操作序列",
            x: 325,
            y: 52,
            values: ops.map(fmtOp),
            hl: [opIdx],
            done: Array.from({ length: opIdx }, (_, k) => k),
            pointers: [{ idx: opIdx, label: `op#${opIdx}`, color: "blue" }]
          },
          {
            id: "vars",
            type: "vars",
            name: "timemap_vars",
            typeLabel: "查詢與二分狀態",
            x: 24,
            y: 205,
            items: [
              { id: "key", name: "key", val: `"${key}"`, status: "" },
              { id: "qts", name: "timestamp", val: String(queryTs), status: "hl" },
              { id: "ans", name: "ans", val: ans === "" ? '"" (空字串)' : String(ans), status: bestIdx >= 0 ? "match" : "" }
            ]
          },
          {
            id: "vec",
            type: "array",
            name: `store["${key}"]`,
            typeLabel: "時間戳有序陣列 vector<pair<int,string>>",
            x: 325,
            y: 205,
            values: vec.map((it) => `(${it.ts}, "${it.val}")`),
            hl: mid >= 0 ? [mid] : [],
            match: bestIdx >= 0 ? [bestIdx] : [],
            pointers
          }
        ]
      };
    };

    for (let idx = 0; idx < ops.length; idx++) {
      const op = ops[idx];
      if (op[0] === "set") {
        const [, key, val, ts] = op;
        if (!store[key]) store[key] = [];
        store[key].push({ ts: Number(ts), val: String(val) });

        steps.push({
          line: 5,
          tag: `寫入 set("${key}", "${val}", ${ts})`,
          tagType: "tag-insert",
          inlineBadge: `store["${key}"].push_back({${ts}, "${val}"})`,
          explanation: `由於寫入時間戳嚴格遞增，直接將 (${ts}, "${val}") O(1) 附加至 store["${key}"] 尾端（目前共 ${store[key].length} 筆）。`,
          vars: { op: fmtOp(op), key: `"${key}"`, timestamp: String(ts), L: "-", R: "-", ans: "-" },
          state: buildState(idx, key, { bestIdx: store[key].length - 1, queryTs: ts, ans: `"${val}"` })
        });
      } else {
        const [, key, qTs] = op;
        const ts = Number(qTs);
        const vec = store[key] || [];
        let L = 0;
        let R = vec.length - 1;
        let ans = "";
        let bestIdx = -1;

        steps.push({
          line: 9,
          tag: `查詢 get("${key}", ${ts})`,
          tagType: "tag-check",
          inlineBadge: `L = 0, R = ${R}, target_ts = ${ts}`,
          explanation: `開始在 store["${key}"] (共 ${vec.length} 筆) 中二分搜尋滿足 timestamp_prev <= ${ts} 的最後一筆資料。`,
          vars: { op: fmtOp(op), key: `"${key}"`, timestamp: String(ts), L: String(L), R: String(R), ans: '""' },
          state: buildState(idx, key, { L, R, queryTs: ts, ans: '""' })
        });

        while (L <= R) {
          const mid = L + Math.floor((R - L) / 2);
          const item = vec[mid];

          if (item.ts <= ts) {
            ans = item.val;
            bestIdx = mid;
            const nextL = mid + 1;
            steps.push({
              line: 14,
              tag: `時間戳 ${item.ts} <= ${ts} (合法候選)`,
              tagType: "tag-found",
              inlineBadge: `ans = "${ans}", L = ${nextL}`,
              explanation: `中點 vec[${mid}] 的時間戳 ${item.ts} <= 查詢時間 ${ts}，記錄候選答案 ans = "${ans}"，並向右收斂 L = ${nextL} 嘗試尋找更接近的時間戳。`,
              vars: { op: fmtOp(op), key: `"${key}"`, timestamp: String(ts), L: String(nextL), R: String(R), ans: `"${ans}"` },
              state: buildState(idx, key, { L: nextL, R, mid, bestIdx, queryTs: ts, ans: `"${ans}"` })
            });
            L = nextL;
          } else {
            const nextR = mid - 1;
            steps.push({
              line: 17,
              tag: `時間戳 ${item.ts} > ${ts} (太新)`,
              tagType: "tag-check",
              inlineBadge: `vec[${mid}].first(${item.ts}) > ${ts} => R = ${nextR}`,
              explanation: `中點 vec[${mid}] 的時間戳 ${item.ts} 大於查詢時間 ${ts}，不可使用，向左縮小右界 R = ${nextR}。`,
              vars: { op: fmtOp(op), key: `"${key}"`, timestamp: String(ts), L: String(L), R: String(nextR), ans: ans ? `"${ans}"` : '""' },
              state: buildState(idx, key, { L, R: nextR, mid, bestIdx, queryTs: ts, ans: ans ? `"${ans}"` : '""' })
            });
            R = nextR;
          }
        }

        steps.push({
          line: 20,
          tag: `回傳查詢結果 ${ans ? `"${ans}"` : '""'}`,
          tagType: ans ? "tag-found" : "default",
          inlineBadge: `return ${ans ? `"${ans}"` : '""'}`,
          explanation: `二分搜尋結束，get("${key}", ${ts}) 回傳 ${ans ? `"${ans}"` : '"" (無任何早於該時間的紀錄)'}。`,
          vars: { op: fmtOp(op), key: `"${key}"`, timestamp: String(ts), L: String(L), R: String(R), ans: ans ? `"${ans}"` : '""' },
          state: buildState(idx, key, { bestIdx, queryTs: ts, ans: ans ? `"${ans}"` : '""' })
        });
      }
    }

    return steps;
  }
};

// ============================================================================
// #48 Accounts Merge (LC #721)
// ============================================================================
window.PROBLEMS["accounts-merge"] = {
  id: 48,
  leetcodeId: 721,
  slug: "accounts-merge",
  title: "721. Accounts Merge (帳戶合併)",
  difficulty: "Medium",
  topic: "Graph",
  mins: 30,
  complexity: "Time O(N log N · α(N)) · Space O(N)",
  description:
    "給定多筆帳戶清單，每筆格式為 [名稱, email_1, email_2, ...]；若兩個帳戶擁有任何相同的信箱，則屬於同一人。使用並查集 (Union-Find / Disjoint Set)：將同一帳戶內的所有信箱與第一個信箱執行 unionSet 連通，最後依各連通分量的代表元 (root) 分組並按字典序排列。",
  argNames: ["accounts"],

  presets: [
    {
      name: "範例 1：John 的兩個帳戶透過共通信箱合併",
      args: [
        [
          ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
          ["John", "johnsmith@mail.com", "john00@mail.com"],
          ["Mary", "mary@mail.com"],
          ["John", "johnnybravo@mail.com"]
        ]
      ]
    },
    {
      name: "範例 2：鏈式傳遞合併 (A-B, B-C -> A-B-C 同人)",
      args: [
        [
          ["Alex", "a@m.co", "b@m.co"],
          ["Alex", "b@m.co", "c@m.co"],
          ["Bob", "x@m.co"]
        ]
      ]
    },
    {
      name: "範例 3：多組交錯合併",
      args: [
        [
          ["Gabe", "g0@m.co", "g1@m.co"],
          ["Gabe", "g1@m.co", "g2@m.co"],
          ["Hanzo", "h0@m.co", "h1@m.co"]
        ]
      ]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">string</span>, <span class="tok-type">string</span>&gt; parent, owner;' },
    { line: 3,  code: '    <span class="tok-type">string</span> <span class="tok-fn">find</span>(<span class="tok-type">string</span> x) {' },
    { line: 4,  code: '        <span class="tok-kw">return</span> parent[x] == x ? x : parent[x] = <span class="tok-fn">find</span>(parent[x]);' },
    { line: 5,  code: '    }' },
    { line: 6,  code: '<span class="tok-kw">public</span>:' },
    { line: 7,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&gt; <span class="tok-fn">accountsMerge</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&gt;&amp; accounts) {' },
    { line: 8,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; acc : accounts) {' },
    { line: 9,  code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">1</span>; i &lt; acc.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 10, code: '                <span class="tok-kw">if</span> (!parent.<span class="tok-fn">count</span>(acc[i])) parent[acc[i]] = acc[i];' },
    { line: 11, code: '                owner[acc[i]] = acc[<span class="tok-num">0</span>];' },
    { line: 12, code: '                <span class="tok-kw">if</span> (i &gt; <span class="tok-num">1</span>) parent[<span class="tok-fn">find</span>(acc[i])] = <span class="tok-fn">find</span>(acc[<span class="tok-num">1</span>]); <span class="tok-cmt">// Union</span>' },
    { line: 13, code: '            }' },
    { line: 14, code: '        }' },
    { line: 15, code: '        <span class="tok-type">unordered_map</span>&lt;<span class="tok-type">string</span>, <span class="tok-type">set</span>&lt;<span class="tok-type">string</span>&gt;&gt; groups;' },
    { line: 16, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; [email, _] : parent) groups[<span class="tok-fn">find</span>(email)].<span class="tok-fn">insert</span>(email);' },
    { line: 17, code: '        <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt;&gt; res;' },
    { line: 18, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; [root, emails] : groups) {' },
    { line: 19, code: '            <span class="tok-type">vector</span>&lt;<span class="tok-type">string</span>&gt; row = {owner[root]};' },
    { line: 20, code: '            row.<span class="tok-fn">insert</span>(row.<span class="tok-fn">end</span>(), emails.<span class="tok-fn">begin</span>(), emails.<span class="tok-fn">end</span>());' },
    { line: 21, code: '            res.<span class="tok-fn">push_back</span>(row);' },
    { line: 22, code: '        }' },
    { line: 23, code: '        <span class="tok-kw">return</span> res;' },
    { line: 24, code: '    }' },
    { line: 25, code: '};' }
  ],

  generateTrace(accounts) {
    const accs = Array.isArray(accounts) && accounts.length
      ? accounts
      : [
          ["John", "johnsmith@mail.com", "john_newyork@mail.com"],
          ["John", "johnsmith@mail.com", "john00@mail.com"],
          ["Mary", "mary@mail.com"],
          ["John", "johnnybravo@mail.com"]
        ];

    const steps = [];
    const parent = {};
    const owner = {};
    const emailsList = [];

    const find = (x) => {
      if (parent[x] === x) return x;
      parent[x] = find(parent[x]);
      return parent[x];
    };

    const shortEmail = (e) => (e.length > 14 ? e.split("@")[0] : e);

    const buildState = (hlEmail = "", mergedGroups = null) => {
      // Position up to 8 unique emails in a 2-row graph layout
      const nodes = emailsList.slice(0, 8).map((em, idx) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        const root = find(em);
        return {
          id: em,
          val: shortEmail(em).slice(0, 6),
          sub: `${owner[em]}:${shortEmail(root)}`,
          x: 62 + col * 110,
          y: 48 + row * 105,
          status: em === hlEmail ? "hl" : root === em ? "match" : ""
        };
      });

      const edges = [];
      emailsList.slice(0, 8).forEach((em) => {
        if (parent[em] && parent[em] !== em) {
          edges.push({
            from: em,
            to: parent[em],
            label: "parent",
            dir: true,
            status: em === hlEmail ? "hl" : "match"
          });
        }
      });

      const groupRows = [];
      if (mergedGroups) {
        Object.entries(mergedGroups).forEach(([root, setArr]) => {
          groupRows.push({
            id: root,
            key: `${owner[root]} (${shortEmail(root)})`,
            val: setArr.map(shortEmail).join(", "),
            note: `${setArr.length} 個信箱`,
            status: "hit"
          });
        });
      } else {
        emailsList.forEach((em) => {
          groupRows.push({
            id: em,
            key: shortEmail(em),
            val: shortEmail(find(em)),
            note: `owner: ${owner[em]}`,
            status: em === hlEmail ? "inserted" : ""
          });
        });
      }

      return {
        boards: [
          {
            id: "uf_graph",
            type: "graph",
            shape: "graph",
            name: "Union-Find Disjoint Set",
            typeLabel: "信箱連通分量圖 (節點指向代表元 root)",
            x: 325,
            y: 52,
            width: 460,
            height: 215,
            nodes,
            edges
          },
          {
            id: "uf_table",
            type: "dict",
            name: mergedGroups ? "groups (合併後帳戶)" : "parent (並查集父節點表)",
            typeLabel: mergedGroups ? "unordered_map<string, set<string>>" : "unordered_map<string, string>",
            x: 325,
            y: 310,
            headers: mergedGroups ? ["代表元 (Owner)", "已排序信箱清單", "數量"] : ["信箱 (email)", "代表元 find(email)", "擁有者"],
            rows: groupRows
          }
        ]
      };
    };

    for (let aIdx = 0; aIdx < accs.length; aIdx++) {
      const acc = accs[aIdx];
      const name = acc[0];
      const firstEmail = acc[1];

      for (let i = 1; i < acc.length; i++) {
        const em = acc[i];
        const isNew = !parent[em];
        if (isNew) {
          parent[em] = em;
          emailsList.push(em);
        }
        owner[em] = name;

        if (i === 1) {
          steps.push({
            line: 10,
            tag: `註冊帳戶 #${aIdx + 1} 首信箱`,
            tagType: isNew ? "tag-insert" : "tag-found",
            inlineBadge: `${name}: ${shortEmail(em)} (root=${shortEmail(find(em))})`,
            explanation: isNew
              ? `帳戶 #${aIdx + 1} (${name}) 的首個信箱 ${em} 首次出現，初始化 parent["${shortEmail(em)}"] = 自己。`
              : `帳戶 #${aIdx + 1} (${name}) 的首個信箱 ${em} 已在先前帳戶出現過（當前代表元為 ${shortEmail(find(em))}）！`,
            vars: { account: `${name} (#${aIdx + 1})`, email: shortEmail(em), root: shortEmail(find(em)), totalEmails: String(emailsList.length) },
            state: buildState(em)
          });
        } else {
          const r1 = find(em);
          const r0 = find(firstEmail);
          parent[r1] = r0;
          steps.push({
            line: 12,
            tag: `Union 合併同帳戶信箱`,
            tagType: "tag-insert",
            inlineBadge: `union(${shortEmail(em)}, ${shortEmail(firstEmail)}) -> root=${shortEmail(r0)}`,
            explanation: `將同屬於 ${name} 的信箱 ${shortEmail(em)} 與首信箱 ${shortEmail(firstEmail)} 進行 Union 合併，指向共同代表元 ${shortEmail(r0)}。`,
            vars: { account: `${name} (#${aIdx + 1})`, email: shortEmail(em), root: shortEmail(r0), totalEmails: String(emailsList.length) },
            state: buildState(em)
          });
        }
      }
    }

    const groups = {};
    emailsList.forEach((em) => {
      const r = find(em);
      if (!groups[r]) groups[r] = [];
      groups[r].push(em);
    });
    Object.values(groups).forEach((arr) => arr.sort());

    steps.push({
      line: 16,
      tag: "依代表元分組並排序",
      tagType: "tag-found",
      inlineBadge: `共合併為 ${Object.keys(groups).length} 個獨立帳戶`,
      explanation: `對所有信箱呼叫 find(email) 進行路徑壓縮並歸入對應代表元集合 set<string>（自動依字典序排列），最終合併為 ${Object.keys(groups).length} 個獨立帳戶。`,
      vars: { account: "done", email: "-", root: "-", mergedCount: String(Object.keys(groups).length) },
      state: buildState("", groups)
    });

    return steps;
  }
};

// ============================================================================
// #49 Sort Colors (LC #75)
// ============================================================================
window.PROBLEMS["sort-colors"] = {
  id: 49,
  leetcodeId: 75,
  slug: "sort-colors",
  title: "75. Sort Colors (顏色分類 / 荷蘭國旗問題)",
  difficulty: "Medium",
  topic: "Array",
  mins: 25,
  complexity: "Time O(N) · Space O(1)",
  description:
    "給定包含紅(0)、白(1)、藍(2) 三種顏色的陣列 nums，請原地 (in-place) 單次掃描排序。採用 Dijkstra 荷蘭國旗三指標分區法 (Dutch National Flag Algorithm)：維護 [0..low-1] 全為 0、[low..mid-1] 全為 1、[high+1..n-1] 全為 2，當 mid 掃過 [mid..high] 未知區時即可在 O(N) 時間完成分類。",
  argNames: ["nums"],

  presets: [
    {
      name: "範例 1：標準混合陣列 nums = [2, 0, 2, 1, 1, 0]",
      args: [[2, 0, 2, 1, 1, 0]]
    },
    {
      name: "範例 2：精簡陣列 nums = [2, 0, 1]",
      args: [[2, 0, 1]]
    },
    {
      name: "範例 3：反序陣列 nums = [2, 2, 1, 0, 0, 1]",
      args: [[2, 2, 1, 0, 0, 1]]
    }
  ],

  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">sortColors</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> low = <span class="tok-num">0</span>, mid = <span class="tok-num">0</span>, high = (<span class="tok-kw">int</span>)nums.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (mid &lt;= high) {' },
    { line: 6,  code: '            <span class="tok-kw">if</span> (nums[mid] == <span class="tok-num">0</span>) {' },
    { line: 7,  code: '                <span class="tok-fn">swap</span>(nums[low++], nums[mid++]); <span class="tok-cmt">// 0 交換至左區</span>' },
    { line: 8,  code: '            } <span class="tok-kw">else</span> <span class="tok-kw">if</span> (nums[mid] == <span class="tok-num">1</span>) {' },
    { line: 9,  code: '                mid++; <span class="tok-cmt">// 1 留在中間區</span>' },
    { line: 10, code: '            } <span class="tok-kw">else</span> {' },
    { line: 11, code: '                <span class="tok-fn">swap</span>(nums[mid], nums[high--]); <span class="tok-cmt">// 2 交換至右區，mid 不遞增</span>' },
    { line: 12, code: '            }' },
    { line: 13, code: '        }' },
    { line: 14, code: '    }' },
    { line: 15, code: '};' }
  ],

  generateTrace(nums) {
    const arr = Array.isArray(nums) ? [...nums] : [2, 0, 2, 1, 1, 0];
    const steps = [];
    let low = 0;
    let mid = 0;
    let high = arr.length - 1;

    const buildState = (opts = {}) => {
      const { curLow = low, curMid = mid, curHigh = high, hlIdx = [], matchIdx = [], conn = [], doneAll = false } = opts;
      const pointers = [];
      if (!doneAll) {
        if (curLow >= 0 && curLow < arr.length) pointers.push({ idx: curLow, label: `low=${curLow}`, color: "blue" });
        if (curMid >= 0 && curMid < arr.length) pointers.push({ idx: curMid, label: `mid=${curMid}`, color: "purple" });
        if (curHigh >= 0 && curHigh < arr.length) pointers.push({ idx: curHigh, label: `high=${curHigh}`, color: "red" });
      }

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "荷蘭國旗三色陣列 (0:紅, 1:白, 2:藍)",
            x: 325,
            y: 52,
            values: [...arr],
            hl: hlIdx,
            match: doneAll ? arr.map((_, i) => i) : matchIdx,
            pointers
          },
          {
            id: "vars",
            type: "vars",
            name: "dnf_partitions",
            typeLabel: "三區段不變量 (Loop Invariant)",
            x: 24,
            y: 205,
            items: [
              { id: "z0", name: "0 區 [0..low-1]", val: curLow > 0 ? `[0..${curLow - 1}]` : "空", status: curLow > 0 ? "match" : "" },
              { id: "z1", name: "1 區 [low..mid-1]", val: curMid > curLow ? `[${curLow}..${curMid - 1}]` : "空", status: curMid > curLow ? "hl" : "" },
              { id: "z2", name: "2 區 [high+1..n-1]", val: curHigh < arr.length - 1 ? `[${curHigh + 1}..${arr.length - 1}]` : "空", status: curHigh < arr.length - 1 ? "warn" : "" }
            ]
          }
        ],
        connectors: conn
      };
    };

    steps.push({
      line: 4,
      tag: "初始化三指標",
      tagType: "default",
      inlineBadge: `low = 0, mid = 0, high = ${high}`,
      explanation: `初始化荷蘭國旗三指標：low = 0 (0 的右界)、mid = 0 (當前掃描指標)、high = ${high} (2 的左界)。`,
      vars: { low: "0", mid: "0", high: String(high), "nums[mid]": String(arr[0]), nums: `[${arr.join(",")}]` },
      state: buildState({ hlIdx: [0] })
    });

    while (mid <= high) {
      const val = arr[mid];

      if (val === 0) {
        const oldLow = low;
        const oldMid = mid;
        const tmp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = tmp;
        low++;
        mid++;

        steps.push({
          line: 7,
          tag: `遇到 0 → 交換至左區`,
          tagType: "tag-found",
          inlineBadge: `swap(nums[${oldLow}], nums[${oldMid}]), low=${low}, mid=${mid}`,
          explanation: `nums[mid=${oldMid}] == 0，將其與 nums[low=${oldLow}] 交換歸入左側 0 區，並同時遞增 low = ${low}, mid = ${mid}。`,
          vars: { low: String(low), mid: String(mid), high: String(high), "nums[mid]": mid < arr.length ? String(arr[mid]) : "-", nums: `[${arr.join(",")}]` },
          state: buildState({
            hlIdx: [oldMid],
            matchIdx: [oldLow],
            conn: [{ from: `wb-cw-nums-${oldMid}`, to: "wb-var-z0", label: `歸入 0 區`, color: "green" }]
          })
        });
      } else if (val === 1) {
        const oldMid = mid;
        mid++;
        steps.push({
          line: 9,
          tag: `遇到 1 → 保留於中區`,
          tagType: "tag-check",
          inlineBadge: `nums[${oldMid}] == 1 => mid = ${mid}`,
          explanation: `nums[mid=${oldMid}] == 1 已在正確的中間區域，無需交換，直接遞增 mid = ${mid}。`,
          vars: { low: String(low), mid: String(mid), high: String(high), "nums[mid]": mid < arr.length ? String(arr[mid]) : "-", nums: `[${arr.join(",")}]` },
          state: buildState({
            hlIdx: [oldMid],
            conn: [{ from: `wb-cw-nums-${oldMid}`, to: "wb-var-z1", label: `留在 1 區`, color: "blue" }]
          })
        });
      } else {
        const oldMid = mid;
        const oldHigh = high;
        const tmp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = tmp;
        high--;

        steps.push({
          line: 11,
          tag: `遇到 2 → 交換至右區`,
          tagType: "tag-insert",
          inlineBadge: `swap(nums[${oldMid}], nums[${oldHigh}]), high=${high}`,
          explanation: `nums[mid=${oldMid}] == 2，將其與 nums[high=${oldHigh}] 交換歸入右側 2 區，遞減 high = ${high}（注意：換過來的元素尚未檢查，故 mid 保持 ${mid} 不變！）。`,
          vars: { low: String(low), mid: String(mid), high: String(high), "nums[mid]": String(arr[mid]), nums: `[${arr.join(",")}]` },
          state: buildState({
            hlIdx: [oldMid, oldHigh],
            conn: [{ from: `wb-cw-nums-${oldHigh}`, to: "wb-var-z2", label: `歸入 2 區`, color: "red" }]
          })
        });
      }
    }

    steps.push({
      line: 14,
      tag: "三色分類完成",
      tagType: "tag-found",
      inlineBadge: `mid(${mid}) > high(${high}) => [${arr.join(", ")}]`,
      explanation: `當 mid = ${mid} > high = ${high} 時未知區間已清空，陣列原地排序完成：[${arr.join(", ")}]！`,
      vars: { low: String(low), mid: String(mid), high: String(high), "nums[mid]": "-", nums: `[${arr.join(",")}]` },
      state: buildState({ doneAll: true })
    });

    return steps;
  }
};

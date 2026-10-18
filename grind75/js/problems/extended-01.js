/**
 * Grind 75 延伸題 — Problems #76 to #87
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  const P = window.PROBLEMS;

  // ==========================================================================
  // 共用輔助：HTML 轉義、C++ 語法上色、步驟與變數盒建構
  // ==========================================================================
  const ext1Esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const EXT1_KW = new Set(
    "class struct public private return if else for while int bool char void auto const new nullptr true false long double break continue static using this".split(" ")
  );
  const EXT1_TY = new Set(
    "Solution vector string stack unordered_map unordered_set queue pair TreeNode Node WordDictionary size_t".split(" ")
  );

  function ext1HlLine(ln) {
    const re = /(\/\/.*$)|('(?:\\.|[^'\\])'|"(?:\\.|[^"\\])*")|([A-Za-z_]\w*)|(\d+)|([\s\S])/g;
    let out = "";
    let m;
    while ((m = re.exec(ln))) {
      if (m[1]) out += `<span class="tok-cmt">${ext1Esc(m[1])}</span>`;
      else if (m[2]) out += `<span class="tok-num">${ext1Esc(m[2])}</span>`;
      else if (m[3]) {
        const w = m[3];
        const rest = ln.slice(re.lastIndex);
        if (EXT1_KW.has(w)) out += `<span class="tok-kw">${w}</span>`;
        else if (EXT1_TY.has(w)) out += `<span class="tok-type">${w}</span>`;
        else if (/^\s*\(/.test(rest)) out += `<span class="tok-fn">${w}</span>`;
        else out += w;
      } else if (m[4]) out += `<span class="tok-num">${m[4]}</span>`;
      else out += ext1Esc(m[5]);
    }
    return out;
  }

  // 將多行 C++ 原始碼轉成 1-indexed、已上色的 cppLines。
  function ext1Cpp(src) {
    return src
      .replace(/^\n+/, "")
      .replace(/\s+$/, "")
      .split("\n")
      .map((ln, i) => ({ line: i + 1, code: ext1HlLine(ln) }));
  }

  // 建立一個步驟物件；vars 的值一律轉成字串。
  function ext1Step(line, tag, tagType, inlineBadge, explanation, vars, state) {
    const v = {};
    Object.keys(vars || {}).forEach((k) => {
      v[k] = String(vars[k]);
    });
    return { line, tag, tagType, inlineBadge: String(inlineBadge), explanation, vars: v, state };
  }

  // 左欄變數盒；items 為 [id, name, val, status] 陣列。
  function ext1Vars(items, typeLabel = "關鍵變數與算式", y = 215) {
    return {
      id: "vars",
      type: "vars",
      name: "state_vars",
      typeLabel,
      x: 24,
      y,
      items: items.map(([id, name, val, status]) => ({ id, name: ext1Esc(name), val: ext1Esc(val), status: status || "" }))
    };
  }

  const ext1Json = (v) => JSON.stringify(v);

  // ==========================================================================
  // #76 Daily Temperatures (LC #739, Medium)
  // ==========================================================================
  P["daily-temperatures"] = {
    id: 76,
    leetcodeId: 739,
    slug: "daily-temperatures",
    title: "739. Daily Temperatures (每日溫度)",
    difficulty: "Medium",
    topic: "Stack / Monotonic Stack",
    mins: 30,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["temperatures"],
    description:
      "給定每日溫度陣列 temperatures，對每一天求出還要再等幾天才會遇到更高的溫度；若之後都不會更暖，答案為 0。使用存放索引的單調遞減堆疊 stack<int>：由左到右掃描，只要今天的溫度高於堆疊頂端那天的溫度，就把頂端索引 j 彈出並寫入 answer[j] = i - j，最後再把今天的索引 i 推入堆疊。每個索引最多進出堆疊各一次，時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：temperatures = [73,74,75,71,69,72,76,73]", args: [[73, 74, 75, 71, 69, 72, 76, 73]] },
      { name: "範例 2：持續升溫 temperatures = [30,40,50,60]", args: [[30, 40, 50, 60]] },
      { name: "範例 3：持續降溫 temperatures = [60,50,40,30]（全部為 0）", args: [[60, 50, 40, 30]] },
      { name: "範例 4：單一天 temperatures = [55]", args: [[55]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> answer(n, 0);
        stack<int> st;  // 存索引，對應的溫度由底到頂單調遞減
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
                int j = st.top(); st.pop();
                answer[j] = i - j;
            }
            st.push(i);
        }
        return answer;
    }
};`),

    generateTrace(temperatures) {
      const t = Array.isArray(temperatures) ? temperatures.slice() : [];
      const n = t.length;
      const ans = new Array(n).fill(0);
      const st = [];
      const filled = new Set();
      const steps = [];
      let curI = -1;
      let curJ = -1;
      let ret = "-";

      const snap = (o = {}) => {
        const pointers = [];
        if (curI >= 0 && curI < n) pointers.push({ idx: curI, label: `i = ${curI}`, color: "blue" });
        if (st.length && st[st.length - 1] !== curI) pointers.push({ idx: st[st.length - 1], label: "top", color: "purple" });
        if (o.jPtr !== undefined) pointers.push({ idx: o.jPtr, label: `j = ${o.jPtr}`, color: "green" });
        return {
          boards: [
            {
              id: "temps",
              type: "array",
              name: "temperatures",
              typeLabel: "每日溫度 (vector<int>)",
              x: 325,
              y: 52,
              values: t,
              hl: o.hl || (curI >= 0 && curI < n ? [curI] : []),
              match: o.match || [],
              done: Array.from(filled),
              warn: o.warn || [],
              pointers
            },
            {
              id: "ans",
              type: "array",
              name: "answer",
              typeLabel: "等待天數 (vector<int>)",
              x: 325,
              y: 178,
              values: ans.slice(),
              match: o.ansMatch || [],
              hl: o.ansHl || [],
              done: Array.from(filled)
            },
            {
              id: "st",
              type: "stack",
              name: "st",
              typeLabel: "單調遞減堆疊 (stack&lt;int&gt; 存索引)",
              x: 325,
              y: 300,
              items: st.map((j, k) => ({
                val: `${j} (${t[j]}°)`,
                status: o.stTop && k === st.length - 1 ? o.stTop : ""
              }))
            },
            ext1Vars([
              ["i", "i", curI >= 0 && curI < n ? curI : "-", o.iSt],
              ["ti", "temperatures[i]", curI >= 0 && curI < n ? t[curI] : "-", ""],
              ["j", "j", curJ >= 0 ? curJ : "-", o.jSt],
              ["aj", "answer[j]", curJ >= 0 ? ans[curJ] : "-", o.ajSt],
              ["sz", "st.size()", st.length, ""],
              ["ret", "return", ret, ret !== "-" ? "match" : ""]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({
        i: curI >= 0 && curI < n ? curI : "-",
        "temperatures[i]": curI >= 0 && curI < n ? t[curI] : "-",
        j: curJ >= 0 ? curJ : "-",
        "st.size()": st.length,
        return: ret
      });

      steps.push(
        ext1Step(5, "初始化答案陣列", "default", `answer(${n}, 0)`,
          `共有 ${n} 天，先把 answer 全部設為 0（代表「之後沒有更暖的一天」），並準備一個空堆疊 st 存放「還在等待更高溫」的日期索引。`,
          V(), snap())
      );

      for (let i = 0; i < n; i++) {
        curI = i;
        curJ = -1;
        steps.push(
          ext1Step(7, `掃描第 ${i} 天`, "default", `i = ${i}, temperatures[${i}] = ${t[i]}`,
            `讀取第 ${i} 天的溫度 ${t[i]}°，接著檢查它能否讓堆疊中尚在等待的日子「等到」更暖的天氣。`,
            V(), snap({ iSt: "hl" }))
        );
        while (st.length && t[i] > t[st[st.length - 1]]) {
          const top = st[st.length - 1];
          steps.push(
            ext1Step(8, "比較堆疊頂端", "tag-check", `${t[i]} > temperatures[${top}] = ${t[top]} ✓`,
              `堆疊頂端是第 ${top} 天（${t[top]}°），今天 ${t[i]}° 比它高，所以第 ${top} 天的等待結束，條件成立。`,
              V(), snap({ stTop: "hl", conn: [{ from: `wb-cw-temps-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `${t[i]} > ${t[top]}`, color: "blue" }] }))
          );
          const j = st.pop();
          curJ = j;
          steps.push(
            ext1Step(9, "彈出頂端索引", "default", `j = ${j}, st.pop()`,
              `把頂端索引 j = ${j} 彈出堆疊，準備寫入它的等待天數。`,
              V(), snap({ jPtr: j, jSt: "hl" }))
          );
          ans[j] = i - j;
          filled.add(j);
          steps.push(
            ext1Step(10, "寫入等待天數", "tag-found", `answer[${j}] = ${i} - ${j} = ${i - j}`,
              `第 ${j} 天要等到第 ${i} 天才變暖，因此 answer[${j}] = ${i} - ${j} = ${i - j}。`,
              V(), snap({ jPtr: j, jSt: "hl", ajSt: "match", ansMatch: [j], conn: [{ from: `wb-cw-temps-${i}`, to: `wb-cw-ans-${j}`, label: `answer[${j}] = ${i - j}`, color: "green" }] }))
          );
        }
        if (st.length) {
          const top = st[st.length - 1];
          steps.push(
            ext1Step(8, "比較堆疊頂端", "tag-check", `${t[i]} > ${t[top]} ✗`,
              `今天 ${t[i]}° 沒有高於頂端第 ${top} 天的 ${t[top]}°，堆疊維持單調遞減，停止彈出。`,
              V(), snap({ stTop: "warn" }))
          );
        } else {
          steps.push(
            ext1Step(8, "堆疊為空", "tag-check", "st.empty() ➜ 結束 while",
              `堆疊已經是空的，沒有任何日子在等待，結束 while 迴圈。`,
              V(), snap())
          );
        }
        st.push(i);
        steps.push(
          ext1Step(12, "推入今天索引", "tag-insert", `st.push(${i})`,
            `把第 ${i} 天（${t[i]}°）推入堆疊，它也開始等待之後更高的溫度。`,
            V(), snap({ stTop: "hl", conn: [{ from: `wb-cw-temps-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `push(${i})`, color: "purple" }] }))
        );
      }

      curI = n;
      curJ = -1;
      ret = ext1Json(ans);
      steps.push(
        ext1Step(14, "回傳答案", "tag-found", `return ${ret}`,
          st.length
            ? `掃描結束。堆疊中剩下的第 ${st.join("、")} 天之後都沒有更暖的日子，維持 0。回傳 answer = ${ret}。`
            : `掃描結束，回傳 answer = ${ret}。`,
          V(), snap({ ansMatch: ans.map((_, k) => k), conn: n ? [{ from: "wb-dyn-ans", to: "wb-var-ret", label: "return answer", color: "green" }] : [] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #77 House Robber (LC #198, Medium)
  // ==========================================================================
  P["house-robber"] = {
    id: 77,
    leetcodeId: 198,
    slug: "house-robber",
    title: "198. House Robber (打家劫舍)",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "一排房屋各藏有 nums[i] 的金額，相鄰兩間不能在同一晚都被搶，求能搶到的最大總金額。定義 dp[i] 為考慮前 i 間房屋時的最大金額，轉移式為 dp[i] = max(dp[i-1], dp[i-2] + nums[i])：不搶第 i 間就沿用 dp[i-1]，搶第 i 間就只能接在 dp[i-2] 之後。由於只依賴前兩項，以 prev2、prev1 兩個變數滾動即可，時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [1,2,3,1]", args: [[1, 2, 3, 1]] },
      { name: "範例 2：nums = [2,7,9,3,1]", args: [[2, 7, 9, 3, 1]] },
      { name: "範例 3：跳過兩間 nums = [2,1,1,2]", args: [[2, 1, 1, 2]] },
      { name: "範例 4：只有一間 nums = [5]", args: [[5]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;  // dp[i-2], dp[i-1]
        for (int x : nums) {
            int cur = max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.slice() : [];
      const n = nums.length;
      const dp = new Array(n).fill("-");
      const steps = [];
      let prev2 = 0;
      let prev1 = 0;
      let cur = "-";
      let x = "-";
      let i = -1;
      let ret = "-";

      const snap = (o = {}) => {
        const pointers = [];
        if (i >= 0 && i < n) pointers.push({ idx: i, label: `i = ${i}`, color: "blue" });
        const dpPtr = [];
        if (i - 1 >= 0 && i - 1 < n) dpPtr.push({ idx: i - 1, label: "prev1", color: "purple" });
        if (i - 2 >= 0 && i - 2 < n) dpPtr.push({ idx: i - 2, label: "prev2", color: "purple" });
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "每間房屋金額 (vector<int>)",
              x: 325,
              y: 52,
              values: nums,
              hl: i >= 0 && i < n ? [i] : [],
              done: nums.map((_, k) => k).filter((k) => k < i),
              pointers
            },
            {
              id: "dp",
              type: "array",
              name: "dp",
              typeLabel: "dp[i] = 前 i 間最大金額（概念表）",
              x: 325,
              y: 180,
              values: dp.slice(),
              hl: o.dpHl || [],
              match: o.dpMatch || [],
              done: dp.map((v, k) => (v !== "-" ? k : -1)).filter((k) => k >= 0 && k !== i),
              pointers: dpPtr
            },
            ext1Vars([
              ["x", "x = nums[i]", x, o.xSt],
              ["prev2", "prev2 (dp[i-2])", prev2, o.p2St],
              ["prev1", "prev1 (dp[i-1])", prev1, o.p1St],
              ["cur", "cur", cur, o.curSt],
              ["ret", "return", ret, ret !== "-" ? "match" : ""]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({ i: i >= 0 && i < n ? i : "-", x, prev2, prev1, cur, return: ret });

      steps.push(
        ext1Step(4, "初始化滾動變數", "default", "prev2 = 0, prev1 = 0",
          `一間都還沒考慮時最多搶到 0 元，因此 prev2（dp[i-2]）與 prev1（dp[i-1]）都設為 0。`,
          V(), snap({ p2St: "hl", p1St: "hl" }))
      );

      for (i = 0; i < n; i++) {
        x = nums[i];
        cur = "-";
        steps.push(
          ext1Step(5, `考慮第 ${i} 間房屋`, "default", `x = nums[${i}] = ${x}`,
            `取出第 ${i} 間房屋的金額 x = ${x}，接著決定要不要搶它。`,
            V(), snap({ xSt: "hl", conn: [{ from: `wb-cw-nums-${i}`, to: "wb-var-x", label: `x = ${x}`, color: "blue" }] }))
        );
        const take = prev2 + x;
        cur = Math.max(prev1, take);
        dp[i] = cur;
        steps.push(
          ext1Step(6, take > prev1 ? "搶這一間較划算" : "跳過這一間", "tag-check", `max(${prev1}, ${prev2} + ${x}) = ${cur}`,
            take > prev1
              ? `不搶：沿用 prev1 = ${prev1}；搶：prev2 + x = ${prev2} + ${x} = ${take}。搶第 ${i} 間比較多，cur = ${cur}。`
              : `不搶：沿用 prev1 = ${prev1}；搶：prev2 + x = ${prev2} + ${x} = ${take}。不搶第 ${i} 間不會更差，cur = ${cur}。`,
            V(), snap({ curSt: "hl", dpHl: [i], conn: [
              { from: take > prev1 ? "wb-var-prev2" : "wb-var-prev1", to: "wb-var-cur", label: take > prev1 ? `${prev2} + ${x}` : `沿用 ${prev1}`, color: "purple" },
              { from: "wb-var-cur", to: `wb-cw-dp-${i}`, label: `dp[${i}] = ${cur}`, color: "green" }
            ] }))
        );
        prev2 = prev1;
        steps.push(
          ext1Step(7, "前移 prev2", "default", `prev2 = ${prev2}`,
            `視窗往右滑一格：原本的 dp[i-1] 變成下一輪的 dp[i-2]，prev2 = ${prev2}。`,
            V(), snap({ p2St: "hl" }))
        );
        prev1 = cur;
        steps.push(
          ext1Step(8, "前移 prev1", "tag-insert", `prev1 = ${prev1}`,
            `本輪結果 cur = ${cur} 成為下一輪的 dp[i-1]，prev1 = ${prev1}。`,
            V(), snap({ p1St: "hl", dpHl: [i] }))
        );
      }

      i = n;
      ret = prev1;
      steps.push(
        ext1Step(10, "回傳最大金額", "tag-found", `return ${ret}`,
          `所有房屋都考慮完畢，prev1 即為整排房屋可搶到的最大金額 ${ret}。`,
          V(), snap({ dpMatch: n ? [n - 1] : [], conn: [{ from: "wb-var-prev1", to: "wb-var-ret", label: `return ${ret}`, color: "green" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #78 Meeting Rooms (LC #252, Easy)
  // ==========================================================================
  P["meeting-rooms"] = {
    id: 78,
    leetcodeId: 252,
    slug: "meeting-rooms",
    title: "252. Meeting Rooms (會議室)",
    difficulty: "Easy",
    topic: "Array / Sorting",
    mins: 20,
    complexity: "Time O(n log n) · Space O(log n)",
    argNames: ["intervals"],
    description:
      "給定多場會議的時間區間 intervals[i] = [start, end]，判斷一個人能否參加全部會議（任兩場會議不得重疊）。先依開始時間排序，之後只需比較相鄰兩場：若某場的開始時間早於前一場的結束時間就代表衝突，回傳 false；全部檢查通過則回傳 true。前一場結束與下一場開始在同一時刻不算重疊。排序 O(n log n)，掃描 O(n)。",

    presets: [
      { name: "範例 1：intervals = [[0,30],[5,10],[15,20]]", args: [[[0, 30], [5, 10], [15, 20]]] },
      { name: "範例 2：intervals = [[7,10],[2,4]]", args: [[[7, 10], [2, 4]]] },
      { name: "範例 3：首尾相接不算重疊 [[5,8],[1,5],[8,9],[12,15]]", args: [[[5, 8], [1, 5], [8, 9], [12, 15]]] },
      { name: "範例 4：沒有會議 intervals = []", args: [[]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false;  // 這場在上一場結束前就開始
            }
        }
        return true;
    }
};`),

    generateTrace(intervalsInput) {
      const original = Array.isArray(intervalsInput) ? intervalsInput.map((p) => p.slice()) : [];
      let iv = original.map((p) => p.slice());
      const n = iv.length;
      const steps = [];
      let i = -1;
      let ret = "-";
      let sorted = false;

      const snap = (o = {}) => {
        const hl = [];
        const match = [];
        const warn = [];
        const done = [];
        iv.forEach((_, r) => {
          const keyS = `${r},0`;
          const keyE = `${r},1`;
          if (o.warnRows && o.warnRows.includes(r)) {
            warn.push(r === i ? keyS : keyE);
          } else if (r === i) hl.push(keyS);
          else if (r === i - 1) hl.push(keyE);
          else if (sorted && i > 0 && r < i - 1) done.push(keyS, keyE);
          if (o.allMatch) match.push(keyS, keyE);
        });
        const boards = [
          {
            id: "iv",
            type: "grid",
            name: sorted ? "intervals（已排序）" : "intervals（原始順序）",
            typeLabel: "會議區間 (vector&lt;vector&lt;int&gt;&gt;)",
            x: 325,
            y: 52,
            cells: iv.map((p) => [p[0], p[1]]),
            colLabels: ["start", "end"],
            rowLabels: iv.map((_, r) => `#${r}`),
            hl,
            match,
            warn,
            done
          }
        ];
        if (sorted && n) {
          boards.push({
            id: "timeline",
            type: "array",
            name: "時間軸",
            typeLabel: "依開始時間排列的會議",
            x: 600,
            y: 52,
            values: iv.map((p) => `[${p[0]},${p[1]})`),
            hl: i > 0 && i < n ? [i - 1, i] : [],
            warn: o.warnRows || [],
            match: o.allMatch ? iv.map((_, k) => k) : [],
            done: i > 0 ? iv.map((_, k) => k).filter((k) => k < i - 1) : [],
            pointers: i > 0 && i < n ? [{ idx: i - 1, label: "i-1", color: "purple" }, { idx: i, label: `i = ${i}`, color: "blue" }] : []
          });
        }
        boards.push(
          ext1Vars([
            ["i", "i", i > 0 && i < n ? i : "-", ""],
            ["start", "intervals[i][0]", i > 0 && i < n ? iv[i][0] : "-", o.cmpSt],
            ["prevEnd", "intervals[i-1][1]", i > 0 && i < n ? iv[i - 1][1] : "-", o.cmpSt],
            ["ret", "return", ret, ret !== "-" ? (ret === "false" ? "warn" : "match") : ""]
          ])
        );
        return { boards, connectors: o.conn || [] };
      };
      const V = () => ({
        i: i > 0 && i < n ? i : "-",
        "intervals[i][0]": i > 0 && i < n ? iv[i][0] : "-",
        "intervals[i-1][1]": i > 0 && i < n ? iv[i - 1][1] : "-",
        return: ret
      });

      steps.push(
        ext1Step(4, "準備排序", "default", `${n} 場會議`,
          n ? `輸入共有 ${n} 場會議，原始順序並未依時間排列，無法直接只比較相鄰兩場。` : "輸入沒有任何會議。",
          V(), snap())
      );
      iv.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      sorted = true;
      steps.push(
        ext1Step(4, "依開始時間排序", "tag-insert", `sort ➜ ${iv.map((p) => `[${p[0]},${p[1]}]`).join(",") || "[]"}`,
          n ? `依開始時間（相同時再比結束時間）排序後，任何衝突一定會出現在相鄰的兩場會議之間。` : "空陣列排序後仍是空的。",
          V(), snap())
      );

      for (i = 1; i < n; i++) {
        const s = iv[i][0];
        const e = iv[i - 1][1];
        steps.push(
          ext1Step(5, `檢查第 ${i} 場`, "default", `i = ${i}`,
            `取出排序後的第 ${i} 場會議 [${iv[i][0]},${iv[i][1]}]，與前一場 [${iv[i - 1][0]},${iv[i - 1][1]}] 比較。`,
            V(), snap())
        );
        if (s < e) {
          steps.push(
            ext1Step(6, "偵測到重疊", "tag-check", `${s} < ${e} ✓ 衝突`,
              `第 ${i} 場在 ${s} 開始，但前一場要到 ${e} 才結束，兩場會議時間重疊。`,
              V(), snap({ cmpSt: "warn", warnRows: [i - 1, i], conn: [{ from: `wb-grid-iv-${i}-0`, to: `wb-grid-iv-${i - 1}-1`, label: `${s} < ${e}`, color: "red" }] }))
          );
          ret = "false";
          steps.push(
            ext1Step(7, "回傳 false", "tag-found", "return false",
              `只要有一組重疊就不可能參加全部會議，立即回傳 false。`,
              V(), snap({ cmpSt: "warn", warnRows: [i - 1, i], conn: [{ from: `wb-cw-timeline-${i}`, to: "wb-var-ret", label: "衝突 ➜ false", color: "red" }] }))
          );
          return steps;
        }
        steps.push(
          ext1Step(6, "沒有重疊", "tag-check", `${s} < ${e} ✗`,
            s === e
              ? `第 ${i} 場剛好在前一場結束的 ${e} 開始，首尾相接不算重疊，繼續檢查。`
              : `第 ${i} 場在 ${s} 開始，前一場已在 ${e} 結束，沒有衝突，繼續檢查。`,
            V(), snap({ cmpSt: "hl", conn: [{ from: `wb-grid-iv-${i}-0`, to: `wb-grid-iv-${i - 1}-1`, label: `${s} ≥ ${e}`, color: "blue" }] }))
        );
      }

      i = n;
      ret = "true";
      steps.push(
        ext1Step(10, "回傳 true", "tag-found", "return true",
          n > 1 ? `所有相鄰會議都沒有重疊，可以參加全部 ${n} 場會議。` : `會議數不超過 1 場，不可能互相衝突，回傳 true。`,
          V(), snap({ allMatch: true, conn: n ? [{ from: "wb-dyn-iv", to: "wb-var-ret", label: "全部不重疊", color: "green" }] : [] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #79 Roman to Integer (LC #13, Easy)
  // ==========================================================================
  P["roman-to-integer"] = {
    id: 79,
    leetcodeId: 13,
    slug: "roman-to-integer",
    title: "13. Roman to Integer (羅馬數字轉整數)",
    difficulty: "Easy",
    topic: "Math / Hash Table / String",
    mins: 20,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["s"],
    description:
      "將羅馬數字字串 s 轉成整數。以 unordered_map<char, int> 建立 I、V、X、L、C、D、M 對應的數值，由左到右掃描：若目前符號的值小於右邊下一個符號（例如 IV、IX、XL、CM 的左側字母），代表減法規則，總和減去目前值；否則加上目前值。只需掃描一次，時間 O(n)，對照表大小固定為 O(1) 空間。",

    presets: [
      { name: '範例 1：s = "III"', args: ["III"] },
      { name: '範例 2：s = "LVIII"', args: ["LVIII"] },
      { name: '範例 3：多組減法 s = "MCMXCIV"', args: ["MCMXCIV"] },
      { name: '範例 4：單一減法 s = "XLIX"', args: ["XLIX"] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char, int> val = {{'I', 1}, {'V', 5}, {'X', 10}, {'L', 50},
                                        {'C', 100}, {'D', 500}, {'M', 1000}};
        int total = 0;
        for (int i = 0; i < s.size(); i++) {
            int cur = val[s[i]];
            if (i + 1 < s.size() && cur < val[s[i + 1]]) {
                total -= cur;  // 減法規則：小值在大值左邊
            } else {
                total += cur;
            }
        }
        return total;
    }
};`),

    generateTrace(sInput) {
      const s = String(sInput || "");
      const chars = s.split("");
      const n = chars.length;
      const VAL = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      const steps = [];
      let i = -1;
      let total = "-";
      let cur = "-";
      let nxt = "-";
      let ret = "-";
      const signs = new Array(n).fill("");

      const snap = (o = {}) => {
        const pointers = [];
        if (i >= 0 && i < n) pointers.push({ idx: i, label: `i = ${i}`, color: "blue" });
        if (o.showNext && i + 1 < n) pointers.push({ idx: i + 1, label: "i+1", color: "purple" });
        return {
          boards: [
            {
              id: "s",
              type: "array",
              name: "s",
              typeLabel: "羅馬數字字串 (string)",
              x: 325,
              y: 52,
              values: chars,
              hl: i >= 0 && i < n ? [i] : [],
              done: chars.map((_, k) => k).filter((k) => k < i),
              match: o.allMatch ? chars.map((_, k) => k) : [],
              warn: o.warn || [],
              pointers
            },
            {
              id: "contrib",
              type: "array",
              name: "貢獻值",
              typeLabel: "每個符號對 total 的加減",
              x: 325,
              y: 180,
              values: signs.map((v) => v || "·"),
              hl: o.contribHl || [],
              warn: signs.map((v, k) => (v.startsWith("-") ? k : -1)).filter((k) => k >= 0),
              done: signs.map((v, k) => (v.startsWith("+") ? k : -1)).filter((k) => k >= 0)
            },
            {
              id: "val",
              type: "dict",
              name: "val",
              typeLabel: "符號對照表 (unordered_map&lt;char, int&gt;)",
              x: 325,
              y: 300,
              headers: ["key", "value", "狀態"],
              rows: Object.keys(VAL).map((k) => ({
                id: `rom-${k}`,
                key: `'${k}'`,
                val: String(VAL[k]),
                note: (o.hitRows || []).includes(k) ? o.hitNote || "✓ 查表" : "",
                status: (o.hitRows || []).includes(k) ? "hit" : ""
              }))
            },
            ext1Vars([
              ["i", "i", i >= 0 && i < n ? i : "-", ""],
              ["cur", "cur = val[s[i]]", cur, o.curSt],
              ["nxt", "val[s[i+1]]", nxt, o.nxtSt],
              ["total", "total", total, o.totalSt],
              ["ret", "return", ret, ret !== "-" ? "match" : ""]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({ i: i >= 0 && i < n ? i : "-", cur, "val[s[i+1]]": nxt, total, return: ret });

      steps.push(
        ext1Step(4, "建立符號對照表", "default", "val = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000}",
          `先建立七個羅馬符號對應數值的雜湊表 val，之後每個字元都能 O(1) 查到數值。`,
          V(), snap({ hitRows: Object.keys(VAL), hitNote: "已建立" }))
      );
      total = 0;
      steps.push(
        ext1Step(6, "初始化總和", "default", "total = 0",
          `累加器 total 從 0 開始，接著由左到右掃描字串 "${s}"。`,
          V(), snap({ totalSt: "hl" }))
      );

      for (i = 0; i < n; i++) {
        const c = chars[i];
        cur = VAL[c];
        nxt = "-";
        steps.push(
          ext1Step(8, `查表 '${c}'`, "tag-check", `cur = val['${c}'] = ${cur}`,
            `讀取 s[${i}] = '${c}'，查表得到 cur = ${cur}。`,
            V(), snap({ curSt: "hl", hitRows: [c], conn: [{ from: `wb-cw-s-${i}`, to: `wb-dict-row-rom-${c}`, label: `val['${c}']`, color: "blue" }] }))
        );
        const hasNext = i + 1 < n;
        if (hasNext) nxt = VAL[chars[i + 1]];
        const subtract = hasNext && cur < nxt;
        steps.push(
          ext1Step(9, subtract ? "符合減法規則" : "一般加法", "tag-check",
            hasNext ? `${cur} < val['${chars[i + 1]}'] = ${nxt} ? ${subtract ? "✓" : "✗"}` : "i + 1 == s.size() ➜ 沒有下一個符號",
            hasNext
              ? subtract
                ? `下一個符號 '${chars[i + 1]}' 的值 ${nxt} 比 ${cur} 大，代表 '${c}${chars[i + 1]}' 是減法組合，'${c}' 要被減掉。`
                : `下一個符號 '${chars[i + 1]}' 的值 ${nxt} 不大於 ${cur}，'${c}' 照常加上。`
              : `'${c}' 已是最後一個符號，右邊沒有更大的值，照常加上。`,
            V(), snap({ showNext: hasNext, nxtSt: hasNext ? "hl" : "", hitRows: hasNext ? [c, chars[i + 1]] : [c],
              conn: hasNext ? [{ from: `wb-cw-s-${i + 1}`, to: `wb-dict-row-rom-${chars[i + 1]}`, label: `val['${chars[i + 1]}'] = ${nxt}`, color: "purple" }] : [] }))
        );
        if (subtract) {
          total -= cur;
          signs[i] = `-${cur}`;
          steps.push(
            ext1Step(10, "減去目前值", "tag-insert", `total -= ${cur} ➜ ${total}`,
              `套用減法規則：total = total - ${cur} = ${total}。`,
              V(), snap({ totalSt: "hl", contribHl: [i], warn: [i], conn: [{ from: `wb-cw-contrib-${i}`, to: "wb-var-total", label: `-${cur}`, color: "red" }] }))
          );
        } else {
          total += cur;
          signs[i] = `+${cur}`;
          steps.push(
            ext1Step(12, "加上目前值", "tag-insert", `total += ${cur} ➜ ${total}`,
              `把 '${c}' 的 ${cur} 加進總和：total = ${total}。`,
              V(), snap({ totalSt: "hl", contribHl: [i], conn: [{ from: `wb-cw-contrib-${i}`, to: "wb-var-total", label: `+${cur}`, color: "green" }] }))
          );
        }
      }

      i = n;
      cur = "-";
      nxt = "-";
      ret = total;
      steps.push(
        ext1Step(15, "回傳整數", "tag-found", `return ${ret}`,
          `掃描完畢，"${s}" = ${signs.join(" ") || "0"} = ${ret}。`,
          V(), snap({ allMatch: true, conn: [{ from: "wb-var-total", to: "wb-var-ret", label: `return ${ret}`, color: "green" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #80 Backspace String Compare (LC #844, Easy)
  // ==========================================================================
  P["backspace-string-compare"] = {
    id: 80,
    leetcodeId: 844,
    slug: "backspace-string-compare",
    title: "844. Backspace String Compare (比較含退格的字串)",
    difficulty: "Easy",
    topic: "Stack / String",
    mins: 15,
    complexity: "Time O(n + m) · Space O(n + m)",
    argNames: ["s", "t"],
    description:
      "字串 s 與 t 是在文字編輯器中依序輸入的結果，其中 # 代表退格鍵。判斷兩者最後顯示的文字是否相同。把每個字串當作堆疊處理：一般字元推入，遇到 # 且堆疊非空時彈出頂端字元（空的時候退格沒有效果），最後比較兩個堆疊組成的字串。時間 O(n + m)、空間 O(n + m)；進階可改用由後往前的雙指標達成 O(1) 空間。",

    presets: [
      { name: '範例 1：s = "ab#c", t = "ad#c"', args: ["ab#c", "ad#c"] },
      { name: '範例 2：全部刪光 s = "ab##", t = "c#d#"', args: ["ab##", "c#d#"] },
      { name: '範例 3：s = "a#c", t = "b"', args: ["a#c", "b"] },
      { name: '範例 4：空字串退格 s = "a##c", t = "#a#c"', args: ["a##c", "#a#c"] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        return build(s) == build(t);
    }
private:
    string build(const string& str) {
        string st;  // 當作堆疊：push_back 推入、pop_back 彈出
        for (char c : str) {
            if (c != '#') {
                st.push_back(c);
            } else if (!st.empty()) {
                st.pop_back();
            }
        }
        return st;
    }
};`),

    generateTrace(sInput, tInput) {
      const src = { s: String(sInput || "").split(""), t: String(tInput || "").split("") };
      const stacks = { s: [], t: [] };
      const built = { s: null, t: null };
      const steps = [];
      let active = "s";
      let idx = -1;
      let ret = "-";

      const fmt = (arr) => `"${arr.join("")}"`;
      const snap = (o = {}) => {
        const arrBoard = (key, y) => ({
          id: key,
          type: "array",
          name: key,
          typeLabel: `輸入字串 ${key} (string)`,
          x: 325,
          y,
          values: src[key].length ? src[key] : [],
          hl: active === key && idx >= 0 && idx < src[key].length ? [idx] : [],
          done: active === key ? src[key].map((_, k) => k).filter((k) => k < idx) : built[key] !== null ? src[key].map((_, k) => k) : [],
          warn: active === key && o.warnCur ? [idx] : [],
          match: o.allMatch ? src[key].map((_, k) => k) : [],
          pointers: active === key && idx >= 0 && idx < src[key].length ? [{ idx, label: `c = '${src[key][idx]}'`, color: "blue" }] : []
        });
        const stackBoard = (key, x) => ({
          id: `st${key}`,
          type: "stack",
          name: `build(${key})`,
          typeLabel: "string 當堆疊",
          x,
          y: 290,
          items: stacks[key].map((ch, k) => ({
            val: `'${ch}'`,
            status: active === key && o.topSt && k === stacks[key].length - 1 ? o.topSt : built[key] !== null ? (o.cmpSt || "done") : ""
          }))
        });
        return {
          boards: [
            arrBoard("s", 52),
            arrBoard("t", 170),
            stackBoard("s", 325),
            stackBoard("t", 500),
            ext1Vars([
              ["c", "c", active && idx >= 0 && idx < src[active].length ? `'${src[active][idx]}'` : "-", o.cSt],
              ["st", "st", fmt(stacks[active] || []), o.stSt],
              ["bs", "build(s)", built.s === null ? "-" : `"${built.s}"`, o.bsSt],
              ["bt", "build(t)", built.t === null ? "-" : `"${built.t}"`, o.btSt],
              ["ret", "return", ret, ret === "-" ? "" : ret === "true" ? "match" : "warn"]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({
        "正在處理": active ? `build(${active})` : "-",
        c: active && idx >= 0 && idx < src[active].length ? `'${src[active][idx]}'` : "-",
        st: fmt(stacks[active] || []),
        "build(s)": built.s === null ? "-" : `"${built.s}"`,
        "build(t)": built.t === null ? "-" : `"${built.t}"`,
        return: ret
      });

      for (const key of ["s", "t"]) {
        active = key;
        idx = -1;
        steps.push(
          ext1Step(8, `開始 build(${key})`, "default", 'string st = ""',
            key === "s"
              ? `比較式 build(s) == build(t) 先呼叫 build(s)：建立空字串 st 當作堆疊，模擬在編輯器中輸入 "${src.s.join("")}"。`
              : `接著呼叫 build(t)：同樣建立空堆疊 st，模擬輸入 "${src.t.join("")}"。`,
            V(), snap({ stSt: "hl" }))
        );
        for (idx = 0; idx < src[key].length; idx++) {
          const c = src[key][idx];
          steps.push(
            ext1Step(9, `讀取 '${c}'`, "default", `c = '${c}'`,
              `讀取 ${key}[${idx}] = '${c}'。`,
              V(), snap({ cSt: "hl" }))
          );
          if (c !== "#") {
            stacks[key].push(c);
            steps.push(
              ext1Step(11, "推入字元", "tag-insert", `st.push_back('${c}') ➜ ${fmt(stacks[key])}`,
                `'${c}' 是一般字元，推入堆疊頂端，目前畫面顯示 ${fmt(stacks[key])}。`,
                V(), snap({ topSt: "hl", stSt: "hl", conn: [{ from: `wb-cw-${key}-${idx}`, to: `wb-stack-st${key}-${stacks[key].length - 1}`, label: `push '${c}'`, color: "purple" }] }))
            );
          } else if (stacks[key].length) {
            const topIdx = stacks[key].length - 1;
            const removed = stacks[key][topIdx];
            const before = snap({ topSt: "warn", warnCur: true, conn: [{ from: `wb-cw-${key}-${idx}`, to: `wb-stack-st${key}-${topIdx}`, label: `退格刪除 '${removed}'`, color: "red" }] });
            stacks[key].pop();
            steps.push(
              ext1Step(13, "退格彈出", "tag-check", `st.pop_back() 刪除 '${removed}' ➜ ${fmt(stacks[key])}`,
                `遇到退格 #，而且堆疊不是空的，刪除最後輸入的 '${removed}'，畫面剩下 ${fmt(stacks[key])}。`,
                V(), before)
            );
          } else {
            steps.push(
              ext1Step(12, "空白退格", "tag-check", "st.empty() ➜ 忽略 #",
                `遇到退格 #，但目前沒有任何字元可刪，退格不產生效果。`,
                V(), snap({ warnCur: true }))
            );
          }
        }
        idx = src[key].length;
        built[key] = stacks[key].join("");
        steps.push(
          ext1Step(16, `build(${key}) 完成`, "tag-found", `return "${built[key]}"`,
            `${key} 處理完畢，最後畫面上的文字是 "${built[key]}"。`,
            V(), snap({ [key === "s" ? "bsSt" : "btSt"]: "hl", conn: [{ from: `wb-dyn-st${key}`, to: key === "s" ? "wb-var-bs" : "wb-var-bt", label: `"${built[key]}"`, color: "green" }] }))
        );
      }

      active = "t";
      idx = -1;
      const eq = built.s === built.t;
      ret = eq ? "true" : "false";
      steps.push(
        ext1Step(4, eq ? "結果相同" : "結果不同", "tag-found", `"${built.s}" == "${built.t}" ➜ ${ret}`,
          eq
            ? `兩個字串退格後都顯示 "${built.s}"，回傳 true。`
            : `s 退格後是 "${built.s}"，t 退格後是 "${built.t}"，兩者不同，回傳 false。`,
          V(), snap({ allMatch: eq, cmpSt: eq ? "match" : "warn", bsSt: eq ? "match" : "warn", btSt: eq ? "match" : "warn",
            conn: [{ from: "wb-var-bs", to: "wb-var-bt", label: eq ? "相等" : "不相等", color: eq ? "green" : "red" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #81 Gas Station (LC #134, Medium)
  // ==========================================================================
  P["gas-station"] = {
    id: 81,
    leetcodeId: 134,
    slug: "gas-station",
    title: "134. Gas Station (加油站)",
    difficulty: "Medium",
    topic: "Array / Greedy",
    mins: 30,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["gas", "cost"],
    description:
      "環狀路線上有 n 個加油站，第 i 站可加 gas[i] 單位油，開到下一站要耗 cost[i] 單位油，油箱一開始是空的。求能繞行一圈的起點索引，無解回傳 -1（有解時答案唯一）。貪心觀察：若總油量 total = Σ(gas[i] - cost[i]) 小於 0 必定無解；否則從 start 出發，一旦油箱 tank 在第 i 站後變成負數，代表 start 到 i 之間任何一站當起點都會失敗，直接把起點改成 i + 1 並把油箱歸零。一次掃描即可，時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：gas = [1,2,3,4,5], cost = [3,4,5,1,2]", args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]] },
      { name: "範例 2：總油量不足 gas = [2,3,4], cost = [3,4,3]", args: [[2, 3, 4], [3, 4, 3]] },
      { name: "範例 3：起點在最後 gas = [5,1,2,3,4], cost = [4,4,1,5,1]", args: [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]] },
      { name: "範例 4：單一加油站 gas = [3], cost = [2]", args: [[3], [2]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.size(); i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) {  // 從 start 出發到不了 i + 1
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
};`),

    generateTrace(gasInput, costInput) {
      const gas = Array.isArray(gasInput) ? gasInput.slice() : [];
      const cost = Array.isArray(costInput) ? costInput.slice() : [];
      const n = gas.length;
      const diffs = new Array(n).fill("·");
      const steps = [];
      let total = 0;
      let tank = 0;
      let start = 0;
      let diff = "-";
      let i = -1;
      let ret = "-";
      const failed = new Set();

      const snap = (o = {}) => {
        const ptr = (withStart) => {
          const p = [];
          if (i >= 0 && i < n) p.push({ idx: i, label: `i = ${i}`, color: "blue" });
          if (withStart && start < n) p.push({ idx: start, label: "start", color: "green" });
          return p;
        };
        const doneIdx = Array.from(failed);
        return {
          boards: [
            {
              id: "gas",
              type: "array",
              name: "gas",
              typeLabel: "各站可加油量 (vector<int>)",
              x: 325,
              y: 52,
              values: gas,
              hl: i >= 0 && i < n ? [i] : [],
              done: doneIdx,
              match: o.startMatch && start < n ? [start] : [],
              pointers: ptr(true)
            },
            {
              id: "cost",
              type: "array",
              name: "cost",
              typeLabel: "開往下一站耗油 (vector<int>)",
              x: 325,
              y: 172,
              values: cost,
              hl: i >= 0 && i < n ? [i] : [],
              done: doneIdx,
              pointers: ptr(false)
            },
            {
              id: "diff",
              type: "array",
              name: "gas[i] - cost[i]",
              typeLabel: "每站淨油量",
              x: 325,
              y: 292,
              values: diffs.slice(),
              hl: o.diffHl || [],
              warn: diffs.map((v, k) => (typeof v === "number" && v < 0 ? k : -1)).filter((k) => k >= 0 && k !== i),
              done: doneIdx
            },
            ext1Vars([
              ["i", "i", i >= 0 && i < n ? i : "-", ""],
              ["diff", "diff", diff, o.diffSt],
              ["total", "total", total, o.totalSt],
              ["tank", "tank", tank, o.tankSt],
              ["start", "start", start, o.startSt],
              ["ret", "return", ret, ret === "-" ? "" : ret === "-1" ? "warn" : "match"]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({ i: i >= 0 && i < n ? i : "-", diff, total, tank, start, return: ret });

      steps.push(
        ext1Step(4, "初始化", "default", "total = 0, tank = 0, start = 0",
          `total 記錄整圈的淨油量，tank 記錄從目前起點 start 出發後油箱剩多少；先假設從第 0 站出發。`,
          V(), snap({ startSt: "hl" }))
      );

      for (i = 0; i < n; i++) {
        diff = gas[i] - cost[i];
        diffs[i] = diff;
        steps.push(
          ext1Step(6, `計算第 ${i} 站淨油量`, "default", `diff = ${gas[i]} - ${cost[i]} = ${diff}`,
            `在第 ${i} 站加 ${gas[i]} 單位油，開往下一站要耗 ${cost[i]}，淨油量 diff = ${diff}。`,
            V(), snap({ diffSt: "hl", diffHl: [i], conn: [{ from: `wb-cw-cost-${i}`, to: `wb-cw-diff-${i}`, label: `${gas[i]} - ${cost[i]}`, color: "blue" }] }))
        );
        total += diff;
        steps.push(
          ext1Step(7, "累加整圈油量", "default", `total += ${diff} ➜ ${total}`,
            `把 diff 累加到整圈淨油量：total = ${total}。`,
            V(), snap({ totalSt: "hl", diffHl: [i], conn: [{ from: `wb-cw-diff-${i}`, to: "wb-var-total", label: `+(${diff})`, color: "purple" }] }))
        );
        tank += diff;
        steps.push(
          ext1Step(8, "更新油箱", "tag-insert", `tank += ${diff} ➜ ${tank}`,
            `從第 ${start} 站出發，到達第 ${i + 1 < n ? i + 1 : 0} 站時油箱剩 tank = ${tank}。`,
            V(), snap({ tankSt: tank < 0 ? "warn" : "hl", diffHl: [i], conn: [{ from: `wb-cw-diff-${i}`, to: "wb-var-tank", label: `+(${diff})`, color: "purple" }] }))
        );
        if (tank < 0) {
          steps.push(
            ext1Step(9, "油箱變負", "tag-check", `tank = ${tank} < 0 ✓`,
              `油箱變成負數，代表從第 ${start} 站出發無法抵達下一站；而 ${start}～${i} 之間任何一站出發，到這裡時油量只會更少，因此它們都不可能是答案。`,
              V(), snap({ tankSt: "warn", diffHl: [i] }))
          );
          for (let k = start; k <= i; k++) failed.add(k);
          start = i + 1;
          steps.push(
            ext1Step(10, "改由下一站出發", "tag-insert", `start = ${start}`,
              start < n ? `把候選起點移到第 ${start} 站。` : `候選起點移到 ${start}，已經沒有站可選；這代表每一段累積油量都是負的，整圈 total 必定小於 0，最後會回傳 -1。`,
              V(), snap({ startSt: "hl", conn: start < n ? [{ from: "wb-var-start", to: `wb-cw-gas-${start}`, label: `start = ${start}`, color: "green" }] : [] }))
          );
          tank = 0;
          steps.push(
            ext1Step(11, "油箱歸零", "default", "tank = 0",
              `新起點出發時油箱是空的，tank 重設為 0。`,
              V(), snap({ tankSt: "hl" }))
          );
        } else {
          steps.push(
            ext1Step(9, "油量足夠", "tag-check", `tank = ${tank} < 0 ✗`,
              `油箱沒有變成負數，可以繼續往下一站前進，起點 start = ${start} 維持不變。`,
              V(), snap({ tankSt: "hl" }))
          );
        }
      }

      i = n;
      diff = "-";
      ret = total >= 0 ? String(start) : "-1";
      steps.push(
        ext1Step(14, total >= 0 ? "回傳起點" : "總油量不足", "tag-found", `total = ${total} ${total >= 0 ? "≥ 0" : "< 0"} ➜ return ${ret}`,
          total >= 0
            ? `整圈淨油量 total = ${total} ≥ 0，必定存在解，而唯一沒被淘汰的起點就是第 ${start} 站。`
            : `整圈淨油量 total = ${total} < 0，總加油量少於總耗油量，不可能繞完一圈，回傳 -1。`,
          V(), snap({ startMatch: total >= 0, totalSt: total >= 0 ? "match" : "warn",
            conn: [{ from: total >= 0 ? "wb-var-start" : "wb-var-total", to: "wb-var-ret", label: `return ${ret}`, color: total >= 0 ? "green" : "red" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #82 Next Permutation (LC #31, Medium)
  // ==========================================================================
  P["next-permutation"] = {
    id: 82,
    leetcodeId: 31,
    slug: "next-permutation",
    title: "31. Next Permutation (下一個排列)",
    difficulty: "Medium",
    topic: "Array / Two Pointers",
    mins: 30,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "原地把整數陣列 nums 改成字典序中的下一個排列；若已是最大排列，則改成最小排列（遞增排序）。步驟：從右往左找出第一個「下降點」i，使 nums[i] < nums[i+1]，此時 i 右側整段是非遞增的；再從右往左找第一個比 nums[i] 大的 nums[j] 並交換兩者；最後把 i + 1 之後的後綴反轉成遞增，得到恰好大一號的排列。若找不到下降點（i = -1），直接反轉整個陣列。時間 O(n)、額外空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [1,2,3]", args: [[1, 2, 3]] },
      { name: "範例 2：已是最大排列 nums = [3,2,1]", args: [[3, 2, 1]] },
      { name: "範例 3：含重複值 nums = [1,1,5]", args: [[1, 1, 5]] },
      { name: "範例 4：nums = [1,3,5,4,2]", args: [[1, 3, 5, 4, 2]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size(), i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;  // 找下降點
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;  // 找右側第一個比 nums[i] 大的數
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());  // 後綴改成遞增
    }
};`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.slice() : [];
      const n = nums.length;
      const steps = [];
      let i = n - 2;
      let j = -1;
      let pivot = -2;
      let suffixFrom = n;
      let lo = -1;
      let hi = -1;
      let ret = "-";

      const snap = (o = {}) => {
        const pointers = [];
        if (o.showI !== false && i >= 0 && i < n) pointers.push({ idx: i, label: `i = ${i}`, color: pivot === i ? "red" : "blue" });
        if (j >= 0) pointers.push({ idx: j, label: `j = ${j}`, color: "green" });
        if (lo >= 0 && lo < hi) {
          pointers.push({ idx: lo, label: "lo", color: "purple" });
          pointers.push({ idx: hi, label: "hi", color: "purple" });
        }
        const suffix = [];
        for (let k = suffixFrom; k < n; k++) suffix.push(k);
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "排列 (vector<int>，原地修改)",
              x: 325,
              y: 52,
              values: nums.slice(),
              hl: o.hl || [],
              match: o.match || [],
              warn: o.warn || [],
              done: o.done || suffix.filter((k) => !(o.hl || []).includes(k) && !(o.match || []).includes(k)),
              pointers
            },
            {
              id: "orig",
              type: "array",
              name: "原始排列",
              typeLabel: "對照用（輸入時的 nums）",
              x: 325,
              y: 180,
              values: Array.isArray(numsInput) ? numsInput.slice() : []
            },
            ext1Vars([
              ["n", "n", n, ""],
              ["i", "i", pivot === -2 ? i : pivot, o.iSt],
              ["j", "j", j >= 0 ? j : "-", o.jSt],
              ["ret", "nums（結果）", ret, ret !== "-" ? "match" : ""]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({ n, i: pivot === -2 ? i : pivot, j: j >= 0 ? j : "-", nums: ext1Json(nums), return: ret === "-" ? "-" : "void" });

      steps.push(
        ext1Step(4, "從倒數第二格開始", "default", `n = ${n}, i = ${i}`,
          `準備從右往左尋找第一個下降點，i 從倒數第二個位置 ${i} 開始。`,
          V(), snap({ iSt: "hl" }))
      );

      suffixFrom = n - 1;
      while (true) {
        if (i < 0) {
          steps.push(
            ext1Step(5, "找不到下降點", "tag-check", "i = -1 ➜ 停止",
              `i 已經走到 -1，整個陣列由左到右都是非遞增的，代表目前已是最大排列。`,
              V(), snap({ iSt: "warn", done: nums.map((_, k) => k) }))
          );
          break;
        }
        const desc = nums[i] >= nums[i + 1];
        steps.push(
          ext1Step(5, desc ? "仍是非遞增，繼續左移" : "找到下降點", "tag-check",
            `nums[${i}] = ${nums[i]} >= nums[${i + 1}] = ${nums[i + 1]} ? ${desc ? "✓" : "✗"}`,
            desc
              ? `${nums[i]} ≥ ${nums[i + 1]}，右側後綴仍是非遞增，下降點還在更左邊，i--。`
              : `${nums[i]} < ${nums[i + 1]}，第 ${i} 格就是下降點：右側 ${i + 1}..${n - 1} 這段已經無法再變大，必須提升 nums[${i}]。`,
            V(), snap({ hl: [i, i + 1], iSt: "hl", conn: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-nums-${i + 1}`, label: desc ? `${nums[i]} ≥ ${nums[i + 1]}` : `${nums[i]} < ${nums[i + 1]}`, color: desc ? "blue" : "red" }] }))
        );
        if (!desc) break;
        i--;
        suffixFrom = i + 1;
      }
      pivot = i;
      suffixFrom = i + 1;

      if (i >= 0) {
        steps.push(
          ext1Step(6, "存在下降點", "tag-check", `i = ${i} >= 0 ✓`,
            `i = ${i} 合法，要在右側後綴中找一個「比 nums[${i}] = ${nums[i]} 大的最小值」來替換它。`,
            V(), snap({ warn: [i], iSt: "hl" }))
        );
        j = n - 1;
        steps.push(
          ext1Step(7, "j 從最右邊開始", "default", `j = ${j}`,
            `由於後綴是非遞增的，從最右邊往左找到的第一個大於 nums[i] 的數，就是後綴中比它大的最小值。`,
            V(), snap({ warn: [i], hl: [j], jSt: "hl" }))
        );
        while (true) {
          const le = nums[j] <= nums[i];
          steps.push(
            ext1Step(8, le ? "不夠大，j 左移" : "找到交換對象", "tag-check",
              `nums[${j}] = ${nums[j]} <= nums[${i}] = ${nums[i]} ? ${le ? "✓" : "✗"}`,
              le ? `${nums[j]} 沒有比 ${nums[i]} 大，j 繼續往左。` : `${nums[j]} > ${nums[i]}，停在 j = ${j}。`,
              V(), snap({ warn: [i], hl: [j], jSt: "hl", conn: [{ from: `wb-cw-nums-${j}`, to: `wb-cw-nums-${i}`, label: le ? `${nums[j]} ≤ ${nums[i]}` : `${nums[j]} > ${nums[i]}`, color: le ? "blue" : "green" }] }))
          );
          if (!le) break;
          j--;
        }
        const a = nums[i];
        const b = nums[j];
        nums[i] = b;
        nums[j] = a;
        steps.push(
          ext1Step(9, "交換", "tag-insert", `swap(nums[${i}], nums[${j}]) ➜ ${ext1Json(nums)}`,
            `交換 nums[${i}] 與 nums[${j}]：第 ${i} 格由 ${a} 提升為 ${b}，右側後綴仍保持非遞增。`,
            V(), snap({ match: [i, j], conn: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-nums-${j}`, label: `swap ${a} ↔ ${b}`, color: "purple" }] }))
        );
      } else {
        steps.push(
          ext1Step(6, "沒有下降點", "tag-check", "i = -1 < 0 ✗",
            `沒有下降點，跳過交換，直接把整個陣列反轉成最小排列。`,
            V(), snap({ done: nums.map((_, k) => k) }))
        );
      }

      j = -1;
      lo = i + 1;
      hi = n - 1;
      steps.push(
        ext1Step(11, "準備反轉後綴", "default", `reverse(nums[${i + 1}..${n - 1}])`,
          i + 1 <= n - 1
            ? `把第 ${i + 1}..${n - 1} 格的後綴反轉，讓它從非遞增變成遞增（最小）。`
            : `後綴為空，反轉不會改變任何元素。`,
          V(), snap({ hl: Array.from({ length: Math.max(0, n - i - 1) }, (_, k) => i + 1 + k), done: [] }))
      );
      while (lo < hi) {
        const a = nums[lo];
        const b = nums[hi];
        nums[lo] = b;
        nums[hi] = a;
        steps.push(
          ext1Step(11, "反轉：首尾交換", "tag-insert", `swap(nums[${lo}], nums[${hi}]) ➜ ${ext1Json(nums)}`,
            `reverse 內部從兩端往中間交換：nums[${lo}] 與 nums[${hi}] 互換（${a} ↔ ${b}）。`,
            V(), snap({ match: [lo, hi], done: [], conn: [{ from: `wb-cw-nums-${lo}`, to: `wb-cw-nums-${hi}`, label: `${a} ↔ ${b}`, color: "purple" }] }))
        );
        lo++;
        hi--;
      }
      lo = -1;
      hi = -1;
      ret = ext1Json(nums);
      steps.push(
        ext1Step(12, "完成", "tag-found", `nums = ${ret}`,
          i >= 0 ? `完成！nums 已原地變成下一個排列 ${ret}。` : `完成！最大排列循環回最小排列 ${ret}。`,
          V(), snap({ match: nums.map((_, k) => k), done: [], showI: false, conn: n ? [{ from: "wb-dyn-nums", to: "wb-var-ret", label: "原地修改完成", color: "green" }] : [] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #83 Valid Sudoku (LC #36, Medium)
  // ==========================================================================
  const EXT1_SUDOKU_VALID = [
    ["5", "3", ".", ".", "7", ".", ".", ".", "."],
    ["6", ".", ".", "1", "9", "5", ".", ".", "."],
    [".", "9", "8", ".", ".", ".", ".", "6", "."],
    ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
    ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
    ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
    [".", "6", ".", ".", ".", ".", "2", "8", "."],
    [".", ".", ".", "4", "1", "9", ".", ".", "5"],
    [".", ".", ".", ".", "8", ".", ".", "7", "9"]
  ];

  P["valid-sudoku"] = {
    id: 83,
    leetcodeId: 36,
    slug: "valid-sudoku",
    title: "36. Valid Sudoku (有效的數獨)",
    difficulty: "Medium",
    topic: "Matrix / Hash Table",
    mins: 35,
    complexity: "Time O(81) · Space O(81)",
    argNames: ["board"],
    description:
      "判斷一個 9×9 的數獨盤面目前已填入的數字是否合法：每一列、每一行、以及九個 3×3 宮格內，數字 1～9 都不能重複（空格以 '.' 表示，不需判斷是否有解）。以三組 9×9 布林表 row[r][d]、col[c][d]、box[b][d] 記錄「第 r 列／第 c 行／第 b 宮已出現數字 d」，其中宮格編號 b = (r / 3) * 3 + c / 3。逐格掃描，若任一表已標記就回傳 false，否則三表同時標記。盤面固定 81 格，時間與空間皆為 O(1)（O(81)）。",

    presets: [
      { name: "範例 1：LeetCode 合法盤面", args: [EXT1_SUDOKU_VALID.map((r) => r.slice())] },
      {
        name: "範例 2：左上宮格重複 8（LeetCode 範例 2）",
        args: [EXT1_SUDOKU_VALID.map((r, i) => (i === 0 ? ["8"].concat(r.slice(1)) : r.slice()))]
      },
      {
        name: "範例 3：同一列重複 4",
        args: [[
          ["4", ".", ".", ".", "2", ".", ".", "4", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."]
        ]]
      },
      {
        name: "範例 4：同一行重複 7",
        args: [[
          [".", ".", "7", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", "1", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", "3", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", "5", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", "7", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."],
          [".", ".", ".", ".", ".", ".", ".", ".", "."]
        ]]
      }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        bool row[9][9] = {}, col[9][9] = {}, box[9][9] = {};
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                int d = board[r][c] - '1', b = (r / 3) * 3 + c / 3;
                if (row[r][d] || col[c][d] || box[b][d]) return false;
                row[r][d] = col[c][d] = box[b][d] = true;
            }
        }
        return true;
    }
};`),

    generateTrace(boardInput) {
      const board = Array.isArray(boardInput) ? boardInput.map((r) => r.slice()) : [];
      const row = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const col = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const box = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const steps = [];
      const doneCells = [];
      let r = -1;
      let c = -1;
      let d = -1;
      let b = -1;
      let ret = "-";

      const digitsOf = (tbl, k) => (k >= 0 ? tbl[k].map((v, x) => (v ? x + 1 : 0)).filter(Boolean) : []);
      const setBoard = (id, name, tbl, k, x, y, o) => {
        const ds = digitsOf(tbl, k);
        return {
          id,
          type: "set",
          name: k >= 0 ? `${name}[${k}]` : name,
          typeLabel: "已出現的數字",
          x,
          y,
          items: ds.map((v) => ({
            val: v,
            status: o.conflict === id && v === d + 1 ? "hl" : o.inserted && v === d + 1 ? "inserted" : ""
          }))
        };
      };
      const chipIdx = (tbl, k, digit) => digitsOf(tbl, k).indexOf(digit);

      const snap = (o = {}) => {
        const hl = [];
        const warn = [];
        if (r >= 0 && c >= 0 && r < 9 && c < 9) (o.warnCell ? warn : hl).push(`${r},${c}`);
        (o.peers || []).forEach((k) => warn.push(k));
        return {
          boards: [
            {
              id: "bd",
              type: "grid",
              name: "board",
              typeLabel: "9×9 盤面 (vector&lt;vector&lt;char&gt;&gt;)",
              x: 325,
              y: 52,
              cells: board.map((rw) => rw.map((v) => (v === "." ? "·" : v))),
              hl,
              warn,
              match: o.allMatch ? doneCells : o.match || [],
              done: o.allMatch ? [] : doneCells.filter((k) => !hl.includes(k))
            },
            setBoard("rowset", "row", row, r >= 0 && r < 9 ? r : -1, 750, 52, o),
            setBoard("colset", "col", col, c >= 0 && c < 9 ? c : -1, 750, 150, o),
            setBoard("boxset", "box", box, b, 750, 248, o),
            ext1Vars([
              ["rc", "(r, c)", r >= 0 && r < 9 && c >= 0 && c < 9 ? `(${r}, ${c})` : "-", "hl"],
              ["cell", "board[r][c]", r >= 0 && r < 9 && c >= 0 && c < 9 ? `'${board[r][c]}'` : "-", ""],
              ["d", "d (數字-1)", d >= 0 ? d : "-", o.dSt],
              ["b", "b (宮格)", b >= 0 ? b : "-", o.dSt],
              ["ret", "return", ret, ret === "-" ? "" : ret === "true" ? "match" : "warn"]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({
        r: r >= 0 && r < 9 ? r : "-",
        c: c >= 0 && c < 9 ? c : "-",
        d: d >= 0 ? d : "-",
        b: b >= 0 ? b : "-",
        return: ret
      });

      steps.push(
        ext1Step(4, "建立三組標記表", "default", "row / col / box 全部為 false",
          `建立 row、col、box 三組 9×9 布林表，分別記錄每一列、每一行、每一宮已經出現過哪些數字。右側三個集合顯示目前這格所屬列／行／宮的內容。`,
          V(), snap())
      );

      for (r = 0; r < 9; r++) {
        let emptyRun = [];
        const flushEmpty = () => {
          if (!emptyRun.length) return;
          const saveC = c;
          c = emptyRun[emptyRun.length - 1];
          d = -1;
          b = -1;
          steps.push(
            ext1Step(7, "略過空格", "default", emptyRun.length > 1 ? `(${r},${emptyRun[0]})～(${r},${c}) == '.'` : `board[${r}][${c}] == '.'`,
              emptyRun.length > 1
                ? `第 ${r} 列第 ${emptyRun.join("、")} 欄都是空格 '.'，逐一 continue 跳過，不需要檢查。`
                : `board[${r}][${c}] 是空格 '.'，continue 跳過。`,
              V(), snap({ match: [], peers: [] }))
          );
          emptyRun.forEach((cc) => doneCells.push(`${r},${cc}`));
          emptyRun = [];
          c = saveC;
        };
        for (c = 0; c < 9; c++) {
          const ch = board[r][c];
          if (ch === ".") {
            emptyRun.push(c);
            continue;
          }
          flushEmpty();
          d = ch.charCodeAt(0) - 49;
          b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
          steps.push(
            ext1Step(8, `讀取 '${ch}'`, "default", `d = ${d}, b = (${r}/3)*3 + ${c}/3 = ${b}`,
              `board[${r}][${c}] = '${ch}'，換成索引 d = ${d}；它位於第 ${b} 個 3×3 宮格。`,
              V(), snap({ dSt: "hl" }))
          );
          const inRow = row[r][d];
          const inCol = col[c][d];
          const inBox = box[b][d];
          if (inRow || inCol || inBox) {
            const which = inRow ? "rowset" : inCol ? "colset" : "boxset";
            const tbl = inRow ? row : inCol ? col : box;
            const k = inRow ? r : inCol ? c : b;
            const label = inRow ? `第 ${r} 列` : inCol ? `第 ${c} 行` : `第 ${b} 宮`;
            const peers = [];
            for (let rr = 0; rr < 9; rr++) {
              for (let cc = 0; cc < 9; cc++) {
                if (rr === r && cc === c) continue;
                if (board[rr][cc] !== ch) continue;
                const same = inRow ? rr === r : inCol ? cc === c : Math.floor(rr / 3) * 3 + Math.floor(cc / 3) === b;
                if (same && doneCells.includes(`${rr},${cc}`)) peers.push(`${rr},${cc}`);
              }
            }
            steps.push(
              ext1Step(9, "發現重複", "tag-check", `${inRow ? `row[${r}][${d}]` : inCol ? `col[${c}][${d}]` : `box[${b}][${d}]`} == true ✓`,
                `${label}之前已經出現過 ${ch}，這一格再放 ${ch} 違反數獨規則。`,
                V(), snap({ warnCell: true, peers, conflict: which,
                  conn: [{ from: `wb-grid-bd-${r}-${c}`, to: `wb-chip-${which}-${chipIdx(tbl, k, d + 1)}`, label: `${label}已有 ${ch}`, color: "red" }] }))
            );
            ret = "false";
            steps.push(
              ext1Step(9, "回傳 false", "tag-found", "return false",
                `盤面不合法，立即回傳 false，不必再檢查剩下的格子。`,
                V(), snap({ warnCell: true, peers, conflict: which, conn: [{ from: `wb-grid-bd-${r}-${c}`, to: "wb-var-ret", label: "重複 ➜ false", color: "red" }] }))
            );
            return steps;
          }
          steps.push(
            ext1Step(9, "三個方向都沒出現過", "tag-check", `row[${r}][${d}] || col[${c}][${d}] || box[${b}][${d}] ➜ false`,
              `第 ${r} 列、第 ${c} 行、第 ${b} 宮都還沒有 ${ch}，這一格合法。`,
              V(), snap({ dSt: "hl" }))
          );
          row[r][d] = true;
          col[c][d] = true;
          box[b][d] = true;
          doneCells.push(`${r},${c}`);
          steps.push(
            ext1Step(10, "標記已出現", "tag-insert", `row[${r}][${d}] = col[${c}][${d}] = box[${b}][${d}] = true`,
              `把 ${ch} 同時記錄到第 ${r} 列、第 ${c} 行與第 ${b} 宮的集合中。`,
              V(), snap({ inserted: true, match: [`${r},${c}`],
                conn: [
                  { from: `wb-grid-bd-${r}-${c}`, to: `wb-chip-rowset-${chipIdx(row, r, d + 1)}`, label: `row[${r}] ← ${ch}`, color: "purple" },
                  { from: `wb-grid-bd-${r}-${c}`, to: `wb-chip-boxset-${chipIdx(box, b, d + 1)}`, label: `box[${b}] ← ${ch}`, color: "purple" }
                ] }))
          );
        }
        c = 9;
        flushEmpty();
      }

      r = 9;
      c = 9;
      d = -1;
      b = -1;
      ret = "true";
      steps.push(
        ext1Step(13, "盤面合法", "tag-found", "return true",
          `81 格全部檢查完畢，沒有任何列、行或宮格出現重複數字，回傳 true。`,
          V(), snap({ allMatch: true, conn: [{ from: "wb-dyn-bd", to: "wb-var-ret", label: "全部合法", color: "green" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #84 Group Anagrams (LC #49, Medium)
  // ==========================================================================
  P["group-anagrams"] = {
    id: 84,
    leetcodeId: 49,
    slug: "group-anagrams",
    title: "49. Group Anagrams (字母異位詞分組)",
    difficulty: "Medium",
    topic: "String / Hash Table / Sorting",
    mins: 25,
    complexity: "Time O(n · k log k) · Space O(n · k)",
    argNames: ["strs"],
    description:
      "給定字串陣列 strs，把互為字母異位詞（字母種類與出現次數完全相同、只是順序不同）的字串分在同一組，組別與組內順序皆不限。關鍵是為每個字串找出一個「代表鍵」：把字串的字元排序後，所有異位詞都會得到相同的 key。以 unordered_map<string, vector<string>> 依 key 分桶，最後把每個桶收集成答案。n 為字串數、k 為最長字串長度，時間 O(n · k log k)、空間 O(n · k)。",

    presets: [
      { name: '範例 1：strs = ["eat","tea","tan","ate","nat","bat"]', args: [["eat", "tea", "tan", "ate", "nat", "bat"]] },
      { name: '範例 2：只有空字串 strs = [""]', args: [[""]] },
      { name: '範例 3：單一字串 strs = ["a"]', args: [["a"]] },
      { name: '範例 4：strs = ["abc","bca","xyz","cab","zyx","foo"]', args: [["abc", "bca", "xyz", "cab", "zyx", "foo"]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());  // 異位詞排序後相同
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [key, group] : groups) {
            result.push_back(group);
        }
        return result;
    }
};`),

    generateTrace(strsInput) {
      const strs = Array.isArray(strsInput) ? strsInput.slice() : [];
      const n = strs.length;
      const order = [];
      const groups = {};
      const result = [];
      const steps = [];
      let i = -1;
      let key = "-";
      let ret = "-";

      const q = (s) => `"${s}"`;
      const snap = (o = {}) => {
        const rows = order.map((k, gi) => ({
          id: `ga-${gi}`,
          key: ext1Esc(q(k)),
          val: ext1Esc(`[${groups[k].map(q).join(", ")}]`),
          note: o.rowNote && o.rowNote[0] === gi ? o.rowNote[1] : `${groups[k].length} 個`,
          status: o.rowNote && o.rowNote[0] === gi ? o.rowNote[2] : (o.doneRows || []).includes(gi) ? "hit" : ""
        }));
        const boards = [
          {
            id: "strs",
            type: "array",
            name: "strs",
            typeLabel: "輸入字串 (vector&lt;string&gt;)",
            x: 325,
            y: 52,
            values: strs.map(q),
            hl: i >= 0 && i < n ? [i] : [],
            done: strs.map((_, k) => k).filter((k) => k < i),
            match: o.allMatch ? strs.map((_, k) => k) : [],
            pointers: i >= 0 && i < n ? [{ idx: i, label: "s", color: "blue" }] : []
          },
          {
            id: "groups",
            type: "dict",
            name: "groups",
            typeLabel: "分桶 (unordered_map&lt;string, vector&lt;string&gt;&gt;)",
            x: 325,
            y: 175,
            headers: ["key（排序後）", "vector&lt;string&gt;", "狀態"],
            rows,
            slot: o.slot || null
          }
        ];
        if (o.showResult) {
          boards.push({
            id: "result",
            type: "array",
            name: "result",
            typeLabel: "輸出 (vector&lt;vector&lt;string&gt;&gt;)",
            x: 325,
            y: 200 + 44 * (order.length + 2),
            values: result.length ? result.map((g) => ext1Esc(`[${g.map(q).join(",")}]`)) : [],
            match: o.resultMatch || [],
            hl: o.resultHl || []
          });
        }
        boards.push(
          ext1Vars([
            ["s", "s", i >= 0 && i < n ? q(strs[i]) : "-", o.sSt],
            ["key", "key", key === "-" ? "-" : q(key), o.keySt],
            ["gsz", "groups.size()", order.length, ""],
            ["ret", "return", ret, ret !== "-" ? "match" : ""]
          ])
        );
        return { boards, connectors: o.conn || [] };
      };
      const V = () => ({
        s: i >= 0 && i < n ? q(strs[i]) : "-",
        key: key === "-" ? "-" : q(key),
        "groups.size()": order.length,
        return: ret
      });

      steps.push(
        ext1Step(4, "建立分桶雜湊表", "default", "groups = {}",
          `建立空的雜湊表 groups：key 是「排序後的字串」，value 是所有能排成這個 key 的原字串。`,
          V(), snap())
      );

      for (i = 0; i < n; i++) {
        const s = strs[i];
        key = s;
        steps.push(
          ext1Step(6, `複製 ${q(s)}`, "default", `key = ${q(s)}`,
            `處理第 ${i} 個字串 ${q(s)}，先複製一份到 key。`,
            V(), snap({ sSt: "hl", keySt: "hl", conn: [{ from: `wb-cw-strs-${i}`, to: "wb-var-key", label: "複製", color: "blue" }] }))
        );
        key = s.split("").sort().join("");
        steps.push(
          ext1Step(7, "排序字元得到 key", "tag-check", `sort ➜ key = ${q(key)}`,
            s.length ? `把 key 的字元排序，${q(s)} 變成 ${q(key)}；所有異位詞排序後都會得到同一個字串。` : `空字串排序後仍是空字串 ""。`,
            V(), snap({ keySt: "hl" }))
        );
        let gi = order.indexOf(key);
        const isNew = gi < 0;
        if (isNew) {
          order.push(key);
          groups[key] = [];
          gi = order.length - 1;
        }
        groups[key].push(s);
        steps.push(
          ext1Step(8, isNew ? "建立新桶並加入" : "加入既有桶", isNew ? "tag-insert" : "tag-found", `groups[${q(key)}].push_back(${q(s)})`,
            isNew
              ? `groups 中還沒有 key ${q(key)}，operator[] 自動建立空的 vector，再把 ${q(s)} 放進去。`
              : `key ${q(key)} 已存在，${q(s)} 與 ${groups[key].slice(0, -1).map(q).join("、")} 互為異位詞，加入同一桶。`,
            V(), snap({ keySt: "hl", rowNote: [gi, isNew ? "新建" : "✓ 命中", isNew ? "inserted" : "hit"],
              conn: [{ from: `wb-cw-strs-${i}`, to: `wb-dict-row-ga-${gi}`, label: isNew ? "新 key" : `命中 ${q(key)}`, color: isNew ? "purple" : "green" }] }))
        );
      }

      i = n;
      key = "-";
      steps.push(
        ext1Step(10, "準備輸出", "default", "result = {}",
          `所有字串分桶完成，共 ${order.length} 組。建立 result 收集每個桶。`,
          V(), snap({ showResult: true }))
      );
      order.forEach((k, gi) => {
        key = k;
        result.push(groups[k].slice());
        steps.push(
          ext1Step(12, `收集第 ${gi + 1} 組`, "tag-insert", `result.push_back(${ext1Json(groups[k])})`,
            `走訪到 key ${q(k)} 的桶，把整組 [${groups[k].map(q).join(", ")}] 推入 result。（unordered_map 走訪順序不固定，題目允許任意順序。）`,
            V(), snap({ showResult: true, rowNote: [gi, "收集", "hit"], doneRows: order.map((_, x) => x).filter((x) => x < gi), resultHl: [gi],
              conn: [{ from: `wb-dict-row-ga-${gi}`, to: `wb-cw-result-${gi}`, label: "push_back", color: "purple" }] }))
        );
      });
      key = "-";
      ret = ext1Json(result);
      steps.push(
        ext1Step(14, "回傳分組", "tag-found", `return ${order.length} 組`,
          `回傳 result = ${ret}。`,
          V(), snap({ showResult: true, allMatch: true, doneRows: order.map((_, x) => x), resultMatch: result.map((_, x) => x),
            conn: result.length ? [{ from: "wb-dyn-result", to: "wb-var-ret", label: "return result", color: "green" }] : [] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #85 Maximum Product Subarray (LC #152, Medium)
  // ==========================================================================
  P["maximum-product-subarray"] = {
    id: 85,
    leetcodeId: 152,
    slug: "maximum-product-subarray",
    title: "152. Maximum Product Subarray (乘積最大子陣列)",
    difficulty: "Medium",
    topic: "Dynamic Programming / Array",
    mins: 30,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "給定整數陣列 nums，找出乘積最大的非空連續子陣列並回傳該乘積。因為負數會讓最大值與最小值互換，所以同時維護「以目前位置結尾的最大乘積 curMax」與「最小乘積 curMin」：遇到負數先交換兩者，再更新 curMax = max(x, curMax * x)、curMin = min(x, curMin * x)，其中只取 x 代表從這裡重新開始（可切斷 0）。全域答案 best 取所有 curMax 的最大值。一次掃描，時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [2,3,-2,4]", args: [[2, 3, -2, 4]] },
      { name: "範例 2：被 0 切斷 nums = [-2,0,-1]", args: [[-2, 0, -1]] },
      { name: "範例 3：負負得正 nums = [-2,3,-4]", args: [[-2, 3, -4]] },
      { name: "範例 4：nums = [2,-5,-2,-4,3]", args: [[2, -5, -2, -4, 3]] },
      { name: "範例 5：單一負數 nums = [-3]", args: [[-3]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int curMax = nums[0], curMin = nums[0], best = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            int x = nums[i];
            if (x < 0) swap(curMax, curMin);  // 負數讓大小互換
            curMax = max(x, curMax * x);
            curMin = min(x, curMin * x);
            best = max(best, curMax);
        }
        return best;
    }
};`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.slice() : [];
      const n = nums.length;
      const z = (v) => (v === 0 ? 0 : v); // 避免 -0
      const maxEnd = new Array(n).fill("·");
      const minEnd = new Array(n).fill("·");
      const steps = [];
      let i = 0;
      let x = "-";
      let curMax = nums[0];
      let curMin = nums[0];
      let best = nums[0];
      let bestIdx = 0;
      let ret = "-";

      const snap = (o = {}) => ({
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "整數陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: nums,
            hl: i < n ? [i] : [],
            warn: i < n && nums[i] < 0 && o.negWarn ? [i] : [],
            done: nums.map((_, k) => k).filter((k) => k < i),
            pointers: i < n ? [{ idx: i, label: `i = ${i}`, color: "blue" }] : []
          },
          {
            id: "mx",
            type: "array",
            name: "curMax 歷程",
            typeLabel: "以 i 結尾的最大乘積",
            x: 325,
            y: 172,
            values: maxEnd.slice(),
            hl: o.mxHl || [],
            match: o.mxMatch || [bestIdx].filter((k) => typeof maxEnd[k] === "number")
          },
          {
            id: "mn",
            type: "array",
            name: "curMin 歷程",
            typeLabel: "以 i 結尾的最小乘積",
            x: 325,
            y: 292,
            values: minEnd.slice(),
            hl: o.mnHl || []
          },
          ext1Vars([
            ["x", "x = nums[i]", x, o.xSt],
            ["curMax", "curMax", curMax, o.maxSt],
            ["curMin", "curMin", curMin, o.minSt],
            ["best", "best", best, o.bestSt],
            ["ret", "return", ret, ret !== "-" ? "match" : ""]
          ])
        ],
        connectors: o.conn || []
      });
      const V = () => ({ i: i < n ? i : "-", x, curMax, curMin, best, return: ret });

      maxEnd[0] = curMax;
      minEnd[0] = curMin;
      steps.push(
        ext1Step(4, "以第一個元素初始化", "default", `curMax = curMin = best = ${nums[0]}`,
          `只看 nums[0] 時，以它結尾的最大、最小乘積都是 ${nums[0]}，目前最佳答案 best 也是 ${nums[0]}。`,
          V(), snap({ maxSt: "hl", minSt: "hl", bestSt: "hl", mxHl: [0], mnHl: [0] }))
      );

      for (i = 1; i < n; i++) {
        x = nums[i];
        steps.push(
          ext1Step(6, `讀取 nums[${i}]`, "default", `x = ${x}`,
            `考慮以第 ${i} 個元素 x = ${x} 結尾的子陣列。`,
            V(), snap({ xSt: "hl", conn: [{ from: `wb-cw-nums-${i}`, to: "wb-var-x", label: `x = ${x}`, color: "blue" }] }))
        );
        if (x < 0) {
          const a = curMax;
          curMax = curMin;
          curMin = a;
          steps.push(
            ext1Step(7, "負數：交換大小", "tag-check", `x < 0 ✓ ➜ swap ➜ curMax = ${curMax}, curMin = ${curMin}`,
              `x = ${x} 是負數，乘上它之後原本最大的會變最小、最小的會變最大，所以先交換 curMax 與 curMin。`,
              V(), snap({ negWarn: true, maxSt: "warn", minSt: "warn", conn: [{ from: "wb-var-curMax", to: "wb-var-curMin", label: "swap", color: "red" }] }))
          );
        } else {
          steps.push(
            ext1Step(7, "非負數：不交換", "tag-check", `x = ${x} < 0 ✗`,
              `x = ${x} 不是負數，curMax、curMin 的角色不變。`,
              V(), snap({}))
          );
        }
        const pMax = curMax * x;
        const newMax = z(Math.max(x, pMax));
        steps.push(
          ext1Step(8, newMax === x && pMax !== x ? "從 x 重新開始" : "延伸最大乘積", "tag-insert", `curMax = max(${x}, ${curMax} × ${x} = ${z(pMax)}) = ${newMax}`,
            newMax === x && pMax !== x
              ? `延伸前一段得到 ${z(pMax)}，不如單獨從 x = ${x} 重新開始，curMax = ${newMax}。`
              : `延伸前一段：${curMax} × ${x} = ${z(pMax)}，比單獨的 ${x} 大，curMax = ${newMax}。`,
            V(), (() => {
              curMax = newMax;
              maxEnd[i] = curMax;
              return snap({ maxSt: "hl", mxHl: [i], conn: [{ from: "wb-var-curMax", to: `wb-cw-mx-${i}`, label: `curMax = ${curMax}`, color: "purple" }] });
            })())
        );
        steps[steps.length - 1].vars.curMax = String(curMax);
        const pMin = curMin * x;
        const newMin = z(Math.min(x, pMin));
        curMin = newMin;
        minEnd[i] = curMin;
        steps.push(
          ext1Step(9, "更新最小乘積", "tag-insert", `curMin = min(${x}, ${z(pMin)}) = ${curMin}`,
            `同理維護以 i 結尾的最小乘積：min(${x}, ${z(pMin)}) = ${curMin}，它可能在之後遇到負數時翻身成最大值。`,
            V(), snap({ minSt: "hl", mnHl: [i], conn: [{ from: "wb-var-curMin", to: `wb-cw-mn-${i}`, label: `curMin = ${curMin}`, color: "purple" }] }))
        );
        const oldBest = best;
        const improved = curMax > best;
        if (improved) {
          best = curMax;
          bestIdx = i;
        }
        steps.push(
          ext1Step(10, improved ? "刷新最佳答案" : "最佳答案不變", improved ? "tag-found" : "tag-check", `best = max(${oldBest}, ${curMax}) = ${best}`,
            improved ? `curMax = ${curMax} 超過先前的最佳值，best 更新為 ${best}。` : `curMax = ${curMax} 沒有超過 best = ${best}，維持不變。`,
            V(), snap({ bestSt: improved ? "match" : "", mxHl: [i], conn: improved ? [{ from: `wb-cw-mx-${i}`, to: "wb-var-best", label: `best = ${best}`, color: "green" }] : [] }))
        );
      }

      i = n;
      x = "-";
      ret = best;
      steps.push(
        ext1Step(12, "回傳最大乘積", "tag-found", `return ${ret}`,
          `掃描完成，乘積最大的連續子陣列乘積為 ${ret}（在索引 ${bestIdx} 結尾）。`,
          V(), snap({ bestSt: "match", mxMatch: [bestIdx], conn: [{ from: "wb-var-best", to: "wb-var-ret", label: `return ${ret}`, color: "green" }] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // #86 Design Add and Search Words Data Structure (LC #211, Medium)
  // ==========================================================================
  P["design-add-and-search-words-data-structure"] = {
    id: 86,
    leetcodeId: 211,
    slug: "design-add-and-search-words-data-structure",
    title: "211. Design Add and Search Words Data Structure (設計新增與搜尋單詞的資料結構)",
    difficulty: "Medium",
    topic: "Trie / Depth-First Search / Design",
    mins: 35,
    complexity: "Time O(L) add · O(26^d · L) search · Space O(總字元數)",
    argNames: ["operations", "values"],
    description:
      "設計 WordDictionary 類別：addWord(word) 加入一個單字，search(word) 判斷是否存在與 word 完全相符的已加入單字，其中 word 可包含萬用字元 '.'，可匹配任意一個字母。以前綴樹 (Trie) 儲存單字：addWord 沿路建立節點並在結尾標記 isEnd；search 以 DFS 逐字元往下走，一般字母只走對應的子節點，遇到 '.' 就嘗試所有非空子節點，任何一條路徑在字尾停在 isEnd 節點即成功。addWord 為 O(L)；search 在無萬用字元時為 O(L)，最壞情況（d 個 '.'）需展開 26^d 條路徑。",

    presets: [
      {
        name: "範例 1：LeetCode 範例 bad / dad / mad + pad、bad、.ad、b..",
        args: [
          ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"],
          [[], ["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]
        ]
      },
      {
        name: "範例 2：前綴不等於單字 app / apple + ap、app、a.p.e、....",
        args: [
          ["WordDictionary", "addWord", "addWord", "search", "search", "search", "search"],
          [[], ["app"], ["apple"], ["ap"], ["app"], ["a.p.e"], ["...."]]
        ]
      },
      {
        name: "範例 3：萬用字元回溯 at / an / and + a.d、.t、b.、a..",
        args: [
          ["WordDictionary", "addWord", "addWord", "addWord", "search", "search", "search", "search"],
          [[], ["at"], ["an"], ["and"], ["a.d"], [".t"], ["b."], ["a.."]]
        ]
      },
      {
        name: "範例 4：空字典先搜尋 search(a) ➜ addWord(a) ➜ search(.)",
        args: [
          ["WordDictionary", "search", "addWord", "search"],
          [[], ["a"], ["a"], ["."]]
        ]
      }
    ],

    cppLines: ext1Cpp(`
class WordDictionary {
    struct Node {
        Node* child[26] = {nullptr};
        bool isEnd = false;
    };
    Node* root = new Node();

    bool dfs(Node* node, const string& word, int i) {
        if (!node) return false;
        if (i == word.size()) return node->isEnd;
        if (word[i] == '.') {  // 萬用字元：嘗試每一個子節點
            for (Node* next : node->child)
                if (dfs(next, word, i + 1)) return true;
            return false;
        }
        return dfs(node->child[word[i] - 'a'], word, i + 1);
    }
public:
    void addWord(string word) {
        Node* cur = root;
        for (char c : word) {
            if (!cur->child[c - 'a']) cur->child[c - 'a'] = new Node();
            cur = cur->child[c - 'a'];
        }
        cur->isEnd = true;
    }
    bool search(string word) {
        return dfs(root, word, 0);
    }
};`),

    generateTrace(opsInput, valsInput) {
      const ops = Array.isArray(opsInput) ? opsInput.slice() : [];
      const vals = Array.isArray(valsInput) ? valsInput.map((v) => (Array.isArray(v) ? v.slice() : [v])) : [];
      const steps = [];
      let nodeSeq = 0;
      let root = null;
      const results = ops.map(() => "·");
      const frames = [];
      let opIdx = -1;
      let word = "-";
      let ci = "-";
      let curNode = null;
      let ret = "-";

      const mk = (ch) => ({ id: `t${nodeSeq++}`, ch, isEnd: false, children: {} });
      const labelOf = (nd) => (nd ? (nd === root ? "root" : `'${nd.ch}'`) : "nullptr");

      const layout = (o) => {
        const nodes = [];
        const edges = [];
        if (!root) return { nodes, edges, width: 420, height: 160 };
        const leaves = (nd) => {
          const ks = Object.keys(nd.children);
          return ks.length ? ks.reduce((s, k) => s + leaves(nd.children[k]), 0) : 1;
        };
        let maxDepth = 0;
        const depth = (nd, d) => {
          maxDepth = Math.max(maxDepth, d);
          Object.keys(nd.children).forEach((k) => depth(nd.children[k], d + 1));
        };
        depth(root, 0);
        const width = Math.max(420, leaves(root) * 92);
        const levelH = 64;
        const height = Math.max(180, (maxDepth + 1) * levelH + 40);
        const place = (nd, d, l, r) => {
          let status = "";
          if (o.matchId === nd.id) status = "match";
          else if (o.warnId === nd.id) status = "warn";
          else if (o.activeId === nd.id || (o.path || []).includes(nd.id)) status = "hl";
          nodes.push({
            id: nd.id,
            val: nd === root ? "○" : nd.ch,
            sub: nd.isEnd ? "end" : nd === root ? "root" : "",
            x: Math.round((l + r) / 2),
            y: 36 + d * levelH,
            status,
            ptr: o.activeId === nd.id ? o.ptrLabel || "cur" : ""
          });
          const ks = Object.keys(nd.children).sort();
          const total = leaves(nd);
          let left = l;
          ks.forEach((k) => {
            const ch = nd.children[k];
            const w = ((r - l) * leaves(ch)) / total;
            place(ch, d + 1, left, left + w);
            edges.push({ from: nd.id, to: ch.id, label: k, dir: true, status: (o.path || []).includes(ch.id) || o.activeId === ch.id ? "hl" : "" });
            left += w;
          });
        };
        place(root, 0, 30, width - 30);
        return { nodes, edges, width, height };
      };

      const opLabel = (k) => (ops[k] === "WordDictionary" ? "WordDictionary()" : `${ops[k]}("${(vals[k] || [])[0]}")`);

      const snap = (o = {}) => {
        const tr = layout(o);
        const boards = [
          {
            id: "ops",
            type: "array",
            name: "呼叫序列",
            typeLabel: "operations",
            x: 325,
            y: 52,
            values: ops.map((_, k) => opLabel(k)),
            hl: opIdx >= 0 && opIdx < ops.length ? [opIdx] : [],
            done: ops.map((_, k) => k).filter((k) => k < opIdx),
            match: o.allDone ? ops.map((_, k) => k) : []
          },
          {
            id: "res",
            type: "array",
            name: "回傳值",
            typeLabel: "每次呼叫的輸出",
            x: 325,
            y: 165,
            values: results.slice(),
            match: results.map((v, k) => (v === "true" ? k : -1)).filter((k) => k >= 0),
            warn: results.map((v, k) => (v === "false" ? k : -1)).filter((k) => k >= 0),
            hl: o.resHl !== undefined ? [o.resHl] : []
          }
        ];
        if (root) {
          boards.push({
            id: "trie",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "前綴樹 (Node*)",
            x: 325,
            y: 280,
            width: tr.width,
            height: tr.height,
            nodes: tr.nodes,
            edges: tr.edges
          });
        }
        boards.push({
          id: "calls",
          type: "stack",
          name: "dfs 呼叫堆疊",
          typeLabel: "遞迴 frame",
          x: 325 + tr.width + 30,
          y: 280,
          items: frames.map((f, k) => ({ val: `dfs(${f.label}, i=${f.i})`, status: k === frames.length - 1 ? o.frameSt || "hl" : "" }))
        });
        boards.push(
          ext1Vars([
            ["op", "操作", opIdx >= 0 && opIdx < ops.length ? opLabel(opIdx) : "-", "hl"],
            ["ci", "i / c", ci, o.ciSt],
            ["node", "cur / node", labelOf(curNode), o.nodeSt],
            ["ret", "return", ret, ret === "true" || ret === "null" ? "match" : ret === "false" ? "warn" : ""]
          ])
        );
        return { boards, connectors: o.conn || [] };
      };
      const V = () => ({
        op: opIdx >= 0 && opIdx < ops.length ? opLabel(opIdx) : "-",
        word,
        "i / c": ci,
        node: labelOf(curNode),
        return: ret
      });

      // DFS：回傳 true/false；同步產生步驟
      const dfs = (node, i) => {
        frames.push({ label: labelOf(node), i });
        curNode = node;
        ci = `i = ${i}`;
        if (!node) {
          steps.push(
            ext1Step(9, "走到空節點", "tag-check", "!node ➜ return false",
              `dfs(nullptr, ${i})：上一層要求的字母 '${word[i - 1]}' 沒有對應子節點，這條路徑失敗，回傳 false。`,
              V(), snap({ frameSt: "warn", ciSt: "warn" }))
          );
          frames.pop();
          return false;
        }
        if (i === word.length) {
          const ok = node.isEnd;
          steps.push(
            ext1Step(10, ok ? "到達字尾且為單字" : "到達字尾但非單字", "tag-check", `i == ${word.length} ➜ return isEnd = ${ok}`,
              ok
                ? `已比對完 "${word}" 的全部 ${word.length} 個字元，停在 ${labelOf(node)} 且 isEnd = true，代表這條路徑是一個已加入的單字。`
                : `已比對完 "${word}" 的全部字元，但停在 ${labelOf(node)} 的 isEnd = false，它只是某個單字的前綴，回傳 false。`,
              V(), snap({ activeId: node.id, ptrLabel: "node", matchId: ok ? node.id : null, warnId: ok ? null : node.id, frameSt: ok ? "match" : "warn", nodeSt: ok ? "match" : "warn",
                conn: [{ from: `wb-node-trie-${node.id}`, to: `wb-stack-calls-${frames.length - 1}`, label: `isEnd = ${ok}`, color: ok ? "green" : "red" }] }))
          );
          frames.pop();
          return ok;
        }
        const w = word[i];
        if (w === ".") {
          const ks = Object.keys(node.children).sort();
          steps.push(
            ext1Step(11, "遇到萬用字元", "tag-check", `word[${i}] == '.' ✓`,
              ks.length
                ? `word[${i}] 是 '.'，可以匹配任何字母。${labelOf(node)} 有 ${ks.length} 個非空子節點（${ks.map((k) => `'${k}'`).join("、")}），依序嘗試；其餘 nullptr 子節點會在第 9 行立刻回傳 false，略過不畫。`
                : `word[${i}] 是 '.'，但 ${labelOf(node)} 沒有任何子節點，所有分支都會在第 9 行立刻回傳 false。`,
              V(), snap({ activeId: node.id, ptrLabel: "node", ciSt: "hl" }))
          );
          for (const k of ks) {
            const nxt = node.children[k];
            curNode = node;
            ci = `i = ${i}`;
            steps.push(
              ext1Step(13, `嘗試分支 '${k}'`, "default", `dfs(child['${k}'], word, ${i + 1})`,
                `讓 '.' 匹配 '${k}'，遞迴進入子節點 '${k}' 繼續比對 word[${i + 1}..]。`,
                V(), snap({ activeId: nxt.id, ptrLabel: "next", conn: [{ from: `wb-node-trie-${node.id}`, to: `wb-node-trie-${nxt.id}`, label: `'.' = '${k}'`, color: "purple" }] }))
            );
            const ok = dfs(nxt, i + 1);
            curNode = node;
            ci = `i = ${i}`;
            if (ok) {
              steps.push(
                ext1Step(13, "分支成功", "tag-found", "return true",
                  `分支 '${k}' 回傳 true，這一層也立即回傳 true，不必再試其他字母。`,
                  V(), snap({ activeId: node.id, ptrLabel: "node", frameSt: "match" }))
              );
              frames.pop();
              return true;
            }
            steps.push(
              ext1Step(13, "分支失敗，回溯", "tag-check", `dfs('${k}') == false`,
                `分支 '${k}' 回傳 false，回到 ${labelOf(node)} 嘗試下一個子節點。`,
                V(), snap({ activeId: node.id, ptrLabel: "node", warnId: nxt.id }))
            );
          }
          steps.push(
            ext1Step(14, "所有分支皆失敗", "tag-check", "return false",
              `${labelOf(node)} 的所有子節點都無法完成比對，回傳 false。`,
              V(), snap({ activeId: node.id, ptrLabel: "node", frameSt: "warn" }))
          );
          frames.pop();
          return false;
        }
        const nxt = node.children[w] || null;
        steps.push(
          ext1Step(16, `走向字母 '${w}'`, "tag-check", `child['${w}'] ${nxt ? "存在" : "== nullptr"}`,
            nxt
              ? `word[${i}] = '${w}' 是一般字母，只能走 ${labelOf(node)} 的子節點 '${w}'，遞迴到下一層。`
              : `word[${i}] = '${w}'，但 ${labelOf(node)} 沒有子節點 '${w}'，遞迴時會傳入 nullptr。`,
            V(), snap({ activeId: node.id, ptrLabel: "node", ciSt: "hl",
              conn: nxt ? [{ from: `wb-node-trie-${node.id}`, to: `wb-node-trie-${nxt.id}`, label: `'${w}'`, color: "blue" }] : [] }))
        );
        const ok = dfs(nxt, i + 1);
        curNode = node;
        ci = `i = ${i}`;
        frames.pop();
        return ok;
      };

      for (opIdx = 0; opIdx < ops.length; opIdx++) {
        const op = ops[opIdx];
        word = (vals[opIdx] || [])[0];
        ret = "-";
        ci = "-";
        curNode = null;
        if (op === "WordDictionary") {
          root = mk("");
          ret = "null";
          results[opIdx] = "null";
          word = "-";
          steps.push(
            ext1Step(6, "建立字典", "tag-insert", "root = new Node()",
              `呼叫建構子：建立前綴樹的根節點 root（26 個子指標都是 nullptr，isEnd = false）。`,
              V(), snap({ activeId: root.id, ptrLabel: "root", resHl: opIdx }))
          );
        } else if (op === "addWord") {
          curNode = root;
          steps.push(
            ext1Step(20, `addWord("${word}")`, "default", "cur = root",
              `加入單字 "${word}"：指標 cur 從根節點出發，逐字元往下建立路徑。`,
              V(), snap({ activeId: root.id, conn: [{ from: `wb-cw-ops-${opIdx}`, to: `wb-node-trie-${root.id}`, label: "從 root 開始", color: "blue" }] }))
          );
          for (let k = 0; k < word.length; k++) {
            const c = word[k];
            ci = `c = '${c}'`;
            const exists = !!curNode.children[c];
            if (!exists) curNode.children[c] = mk(c);
            const child = curNode.children[c];
            steps.push(
              ext1Step(22, exists ? `'${c}' 已存在` : `建立節點 '${c}'`, exists ? "tag-check" : "tag-insert",
                exists ? `child['${c}'] 已存在` : `child['${c}'] = new Node()`,
                exists
                  ? `${labelOf(curNode)} 已經有子節點 '${c}'（與先前單字共用前綴），不需建立新節點。`
                  : `${labelOf(curNode)} 沒有子節點 '${c}'，新建一個節點掛上去。`,
                V(), snap({ activeId: curNode.id, path: [child.id], matchId: exists ? null : child.id, ciSt: "hl",
                  conn: [{ from: `wb-node-trie-${curNode.id}`, to: `wb-node-trie-${child.id}`, label: `'${c}'`, color: exists ? "blue" : "purple" }] }))
            );
            curNode = child;
            steps.push(
              ext1Step(23, `cur 移到 '${c}'`, "default", `cur = child['${c}']`,
                `cur 往下移動到節點 '${c}'。`,
                V(), snap({ activeId: curNode.id }))
            );
          }
          curNode.isEnd = true;
          ci = "-";
          ret = "null";
          results[opIdx] = "null";
          steps.push(
            ext1Step(25, "標記單字結尾", "tag-found", "cur->isEnd = true",
              `"${word}" 的最後一個字元節點標記 isEnd = true，代表從 root 到這裡是一個完整單字。addWord 沒有回傳值（null）。`,
              V(), snap({ matchId: curNode.id, activeId: curNode.id, resHl: opIdx }))
          );
        } else if (op === "search") {
          curNode = root;
          steps.push(
            ext1Step(28, `search("${word}")`, "default", "dfs(root, word, 0)",
              `搜尋 "${word}"：從根節點、第 0 個字元開始 DFS。`,
              V(), snap({ activeId: root.id, ptrLabel: "node", conn: [{ from: `wb-cw-ops-${opIdx}`, to: `wb-node-trie-${root.id}`, label: "dfs(root, 0)", color: "blue" }] }))
          );
          const ok = dfs(root, 0);
          ret = ok ? "true" : "false";
          results[opIdx] = ret;
          curNode = null;
          ci = "-";
          steps.push(
            ext1Step(28, ok ? "搜尋成功" : "搜尋失敗", "tag-found", `search("${word}") = ${ret}`,
              ok ? `"${word}" 在字典中有相符的單字，回傳 true。` : `字典中沒有任何單字能與 "${word}" 完全相符，回傳 false。`,
              V(), snap({ resHl: opIdx, conn: [{ from: "wb-var-ret", to: `wb-cw-res-${opIdx}`, label: ret, color: ok ? "green" : "red" }] }))
          );
        }
      }

      opIdx = ops.length;
      word = "-";
      ret = `[${results.join(",")}]`;
      steps.push(
        ext1Step(30, "全部呼叫完成", "tag-found", `輸出 ${ret}`,
          `所有操作執行完畢，各呼叫的回傳值依序為 ${ret}。`,
          V(), snap({ allDone: true, conn: ops.length ? [{ from: "wb-dyn-res", to: "wb-var-ret", label: "輸出序列", color: "green" }] : [] }))
      );
      steps[steps.length - 1].state.boards.find((b) => b.id === "vars").items.find((it) => it.id === "ret").status = "match";
      return steps;
    }
  };

  // ==========================================================================
  // #87 Pacific Atlantic Water Flow (LC #417, Medium)
  // ==========================================================================
  P["pacific-atlantic-water-flow"] = {
    id: 87,
    leetcodeId: 417,
    slug: "pacific-atlantic-water-flow",
    title: "417. Pacific Atlantic Water Flow (太平洋大西洋水流問題)",
    difficulty: "Medium",
    topic: "Graph / Matrix / Depth-First Search",
    mins: 30,
    complexity: "Time O(M·N) · Space O(M·N)",
    argNames: ["heights"],
    description:
      "m×n 島嶼的左邊與上邊鄰接太平洋、右邊與下邊鄰接大西洋，雨水可從一格流向上下左右高度小於或等於它的相鄰格。求所有雨水既能流到太平洋、也能流到大西洋的座標。反向思考：從海洋邊界出發「逆流而上」，只往高度大於或等於目前格的鄰居走，能走到的格子就是能流進該海洋的格子。分別從太平洋邊界與大西洋邊界做 DFS，標記 pac 與 atl 兩張布林表，兩者皆為 true 的格子即為答案。每格在每張表最多被標記一次，時間與空間皆為 O(M·N)。",

    presets: [
      {
        name: "範例 1：LeetCode 5×5 標準範例",
        args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]]
      },
      { name: "範例 2：單一格 heights = [[1]]", args: [[[1]]] },
      { name: "範例 3：3×3 螺旋高地 [[1,2,3],[8,9,4],[7,6,5]]", args: [[[1, 2, 3], [8, 9, 4], [7, 6, 5]]] },
      { name: "範例 4：中央盆地 [[3,3,3],[3,1,3],[3,3,3]]", args: [[[3, 3, 3], [3, 1, 3], [3, 3, 3]]] }
    ],

    cppLines: ext1Cpp(`
class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();
        vector<vector<bool>> pac(m, vector<bool>(n)), atl(m, vector<bool>(n));
        for (int r = 0; r < m; r++) {
            dfs(heights, pac, r, 0);      // 左邊界接太平洋
            dfs(heights, atl, r, n - 1);  // 右邊界接大西洋
        }
        for (int c = 0; c < n; c++) {
            dfs(heights, pac, 0, c);      // 上邊界接太平洋
            dfs(heights, atl, m - 1, c);  // 下邊界接大西洋
        }
        vector<vector<int>> result;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (pac[r][c] && atl[r][c]) result.push_back({r, c});
        return result;
    }
private:
    void dfs(const vector<vector<int>>& h, vector<vector<bool>>& ocean, int r, int c) {
        if (ocean[r][c]) return;
        ocean[r][c] = true;  // 雨水可從 (r,c) 流進這個海洋
        const int dr[4] = {-1, 1, 0, 0}, dc[4] = {0, 0, -1, 1};
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nc < 0 || nr >= h.size() || nc >= h[0].size()) continue;
            if (h[nr][nc] >= h[r][c]) dfs(h, ocean, nr, nc);  // 逆流往高處走
        }
    }
};`),

    generateTrace(heightsInput) {
      const h = Array.isArray(heightsInput) ? heightsInput.map((row) => row.slice()) : [[]];
      const m = h.length;
      const n = m ? h[0].length : 0;
      const pac = Array.from({ length: m }, () => new Array(n).fill(false));
      const atl = Array.from({ length: m }, () => new Array(n).fill(false));
      const result = [];
      const steps = [];
      let cur = null; // [r, c]
      let oceanName = "-";
      let depth = 0;
      let ret = "-";

      const keysOf = (tbl) => {
        const out = [];
        tbl.forEach((row, r) => row.forEach((v, c) => v && out.push(`${r},${c}`)));
        return out;
      };
      const snap = (o = {}) => {
        const curKey = cur ? `${cur[0]},${cur[1]}` : null;
        const both = [];
        for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (pac[r][c] && atl[r][c]) both.push(`${r},${c}`);
        const gridY = 52 + (m + 1) * 40 + 40;
        return {
          boards: [
            {
              id: "h",
              type: "grid",
              name: "heights",
              typeLabel: "高度矩陣 (vector&lt;vector&lt;int&gt;&gt;)",
              x: 325,
              y: 52,
              cells: h.map((row) => row.slice()),
              hl: curKey ? [curKey] : [],
              match: o.hMatch || [],
              warn: o.hWarn || [],
              done: o.hDone || []
            },
            {
              id: "pac",
              type: "grid",
              name: "pac",
              typeLabel: "可流進太平洋 (左／上邊界)",
              x: 325,
              y: gridY,
              cells: pac.map((row) => row.map((v) => (v ? "P" : "·"))),
              hl: oceanName === "pac" && curKey ? [curKey] : [],
              match: o.collect ? both : keysOf(pac).filter((k) => !(oceanName === "pac" && k === curKey))
            },
            {
              id: "atl",
              type: "grid",
              name: "atl",
              typeLabel: "可流進大西洋 (右／下邊界)",
              x: 325 + n * 42 + 80,
              y: gridY,
              cells: atl.map((row) => row.map((v) => (v ? "A" : "·"))),
              hl: oceanName === "atl" && curKey ? [curKey] : [],
              match: o.collect ? both : keysOf(atl).filter((k) => !(oceanName === "atl" && k === curKey))
            },
            {
              id: "res",
              type: "set",
              name: "result",
              typeLabel: "兩洋皆可到達 (vector&lt;vector&lt;int&gt;&gt;)",
              x: 325 + n * 42 + 80,
              y: 52,
              items: result.map(([r, c], k) => ({ val: `[${r},${c}]`, status: o.resNew && k === result.length - 1 ? "inserted" : o.resAll ? "match" : "" }))
            },
            ext1Vars([
              ["ocean", "ocean", oceanName, o.oceanSt],
              ["rc", "(r, c)", cur ? `(${cur[0]}, ${cur[1]})` : "-", "hl"],
              ["hrc", "h[r][c]", cur ? h[cur[0]][cur[1]] : "-", ""],
              ["depth", "遞迴深度", depth, ""],
              ["ret", "return", ret, ret !== "-" ? "match" : ""]
            ])
          ],
          connectors: o.conn || []
        };
      };
      const V = () => ({
        ocean: oceanName,
        "(r,c)": cur ? `(${cur[0]},${cur[1]})` : "-",
        "h[r][c]": cur ? h[cur[0]][cur[1]] : "-",
        depth,
        "result.size()": result.length,
        return: ret
      });

      steps.push(
        ext1Step(5, "建立兩張標記表", "default", `m = ${m}, n = ${n}`,
          `建立 ${m}×${n} 的 pac 與 atl 布林表（全部 false）。之後從海岸線出發逆流而上，標記雨水能流進各海洋的格子。`,
          V(), snap())
      );

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      const dfs = (tbl, name, r, c, from) => {
        depth++;
        tbl[r][c] = true;
        cur = [r, c];
        oceanName = name;
        const oceanZh = name === "pac" ? "太平洋" : "大西洋";
        steps.push(
          ext1Step(23, `標記 ${name}[${r}][${c}]`, "tag-insert", `${name}[${r}][${c}] = true`,
            from
              ? `(${r},${c}) 高度 ${h[r][c]} ≥ (${from[0]},${from[1]}) 的高度 ${h[from[0]][from[1]]}，雨水可以從 (${r},${c}) 往低處流到 (${from[0]},${from[1]})，進而流進${oceanZh}，標記為 true 並繼續往四周逆流探索。`
              : `(${r},${c}) 位於${oceanZh}海岸，雨水可直接流入，標記為 true 並開始往四周逆流探索。`,
            V(), snap({ oceanSt: "hl",
              conn: from ? [{ from: `wb-grid-h-${from[0]}-${from[1]}`, to: `wb-grid-h-${r}-${c}`, label: `${h[from[0]][from[1]]} ≤ ${h[r][c]}`, color: "blue" },
                { from: `wb-grid-h-${r}-${c}`, to: `wb-grid-${name}-${r}-${c}`, label: "標記", color: "purple" }]
                : [{ from: `wb-grid-h-${r}-${c}`, to: `wb-grid-${name}-${r}-${c}`, label: `${oceanZh}海岸`, color: "purple" }] }))
        );
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
          if (h[nr][nc] >= h[r][c] && !tbl[nr][nc]) {
            dfs(tbl, name, nr, nc, [r, c]);
            cur = [r, c];
          }
        }
        depth--;
      };

      const border = (line, tbl, name, r, c, side) => {
        cur = [r, c];
        oceanName = name;
        if (tbl[r][c]) {
          steps.push(
            ext1Step(line, `${side} (${r},${c}) 已標記`, "tag-check", `dfs(${name}, ${r}, ${c}) ➜ 第 22 行直接 return`,
              `${side}格 (${r},${c}) 先前已經被逆流探索標記過，dfs 在第 22 行檢查到 ${name}[${r}][${c}] == true 直接返回。`,
              V(), snap({ oceanSt: "hl" }))
          );
          return;
        }
        steps.push(
          ext1Step(line, `從${side} (${r},${c}) 出發`, "default", `dfs(heights, ${name}, ${r}, ${c})`,
            `${side}格 (${r},${c}) 尚未標記，從這裡開始一次 DFS。`,
            V(), snap({ oceanSt: "hl" }))
        );
        dfs(tbl, name, r, c, null);
      };

      for (let r = 0; r < m; r++) {
        border(7, pac, "pac", r, 0, "左邊界（太平洋）");
        border(8, atl, "atl", r, n - 1, "右邊界（大西洋）");
      }
      for (let c = 0; c < n; c++) {
        border(11, pac, "pac", 0, c, "上邊界（太平洋）");
        border(12, atl, "atl", m - 1, c, "下邊界（大西洋）");
      }

      cur = null;
      oceanName = "-";
      steps.push(
        ext1Step(14, "比對兩張表", "default", "result = {}",
          `兩次逆流探索都完成了。接著逐格檢查 pac 與 atl，兩者都為 true 的格子代表雨水能同時流到兩個海洋。`,
          V(), snap({ collect: true }))
      );
      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          if (pac[r][c] && atl[r][c]) {
            result.push([r, c]);
            cur = [r, c];
            steps.push(
              ext1Step(17, `加入 [${r},${c}]`, "tag-found", `pac[${r}][${c}] && atl[${r}][${c}] ➜ push_back({${r}, ${c}})`,
                `(${r},${c}) 高度 ${h[r][c]}，同時標記在 pac 與 atl 中，加入答案。`,
                V(), snap({ collect: true, resNew: true, conn: [
                  { from: `wb-grid-pac-${r}-${c}`, to: `wb-grid-atl-${r}-${c}`, label: "P 且 A", color: "green" },
                  { from: `wb-grid-atl-${r}-${c}`, to: `wb-chip-res-${result.length - 1}`, label: `[${r},${c}]`, color: "green" }
                ] }))
            );
          }
        }
      }
      cur = null;
      ret = ext1Json(result);
      steps.push(
        ext1Step(18, "回傳答案", "tag-found", `return ${result.length} 個座標`,
          `共有 ${result.length} 個格子的雨水能同時流進太平洋與大西洋：${ret}。`,
          V(), snap({ collect: true, resAll: true, hMatch: result.map(([r, c]) => `${r},${c}`),
            conn: result.length ? [{ from: "wb-dyn-res", to: "wb-var-ret", label: "return result", color: "green" }] : [] }))
      );
      return steps;
    }
  };

  // ==========================================================================
  // 白板字串安全轉義：播放器以 innerHTML 組裝白板與連線標籤，
  // 將尚未轉義的 < > & 轉成實體（已是 &lt; &gt; &amp; 者保留）。
  // ==========================================================================
  const ext1SafeText = (s) => s.replace(/&(?!(?:amp|lt|gt);)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const ext1SanitizeDeep = (o) => {
    if (typeof o === "string") return ext1SafeText(o);
    if (Array.isArray(o)) return o.map(ext1SanitizeDeep);
    if (o && typeof o === "object") {
      const out = {};
      Object.keys(o).forEach((k) => {
        out[k] = ext1SanitizeDeep(o[k]);
      });
      return out;
    }
    return o;
  };
  [
    "daily-temperatures",
    "house-robber",
    "meeting-rooms",
    "roman-to-integer",
    "backspace-string-compare",
    "gas-station",
    "next-permutation",
    "valid-sudoku",
    "group-anagrams",
    "maximum-product-subarray",
    "design-add-and-search-words-data-structure",
    "pacific-atlantic-water-flow"
  ].forEach((slug) => {
    const raw = P[slug].generateTrace;
    P[slug].generateTrace = function (...args) {
      return raw.apply(this, args).map((step) => ({
        ...step,
        state: {
          boards: ext1SanitizeDeep(step.state.boards || []),
          connectors: (step.state.connectors || []).map((c) => ({ ...c, label: c.label === undefined ? c.label : ext1SafeText(String(c.label)) }))
        }
      }));
    };
  });
})();

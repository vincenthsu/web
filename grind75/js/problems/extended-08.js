/**
 * Grind 75 延伸題 — Problems #160 to #169
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ---------------------------------------------------------------------------
  // 檔內共用輔助函式（不汙染全域）
  // ---------------------------------------------------------------------------
  const ext8Lines = (arr) => arr.map((code, i) => ({ line: i + 1, code }));
  const K = (s) => `<span class="tok-kw">${s}</span>`;
  const T = (s) => `<span class="tok-type">${s}</span>`;
  const F = (s) => `<span class="tok-fn">${s}</span>`;
  const N = (s) => `<span class="tok-num">${s}</span>`;
  const C = (s) => `<span class="tok-cmt">${s}</span>`;
  const ext8Esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const ext8Clone = (v) => JSON.parse(JSON.stringify(v));
  const ext8Fmt = (v) => (Array.isArray(v) ? `[${v.map(ext8Fmt).join(",")}]` : String(v));

  // ============================================================================
  // #160 Basic Calculator II (LC #227, Medium, Stack)
  // ============================================================================
  window.PROBLEMS["basic-calculator-ii"] = {
    id: 160,
    leetcodeId: 227,
    slug: "basic-calculator-ii",
    title: "227. Basic Calculator II (基本計算機 II)",
    difficulty: "Medium",
    topic: "Stack / String",
    mins: 30,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["s"],
    description:
      "給定只含非負整數、+ - * / 與空白的運算式字串 s，計算其值（整數除法向零截斷）。從左到右掃描並累積目前數字 num，同時記住它前面的運算子 op；遇到下一個運算子或字串結尾時，依 op 處理 num：加號推入 num、減號推入 -num、乘除則立即與堆疊頂端運算後放回。如此乘除會先完成，最後把 stack<int> 中所有項目相加即為答案。時間 O(n)，空間 O(n)。",

    presets: [
      { name: "範例 1：s = \"3+2*2\"", args: ["3+2*2"] },
      { name: "範例 2：s = \" 3/2 \"（含空白與整數除法）", args: [" 3/2 "] },
      { name: "範例 3：s = \" 3+5 / 2 \"", args: [" 3+5 / 2 "] },
      { name: "範例 4：s = \"14-3*2/4+10\"（多位數與連續乘除）", args: ["14-3*2/4+10"] },
      { name: "範例 5：s = \"2-7/2\"（負項的除法向零截斷）", args: ["2-7/2"] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${K("int")} ${F("calculate")}(${T("string")} s) {`,
      `        ${T("stack")}&lt;${K("int")}&gt; st;`,
      `        ${K("long")} num = ${N("0")};`,
      `        ${K("char")} op = ${N("'+'")};`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; (${K("int")})s.${F("size")}(); i++) {`,
      `            ${K("char")} c = s[i];`,
      `            ${K("if")} (${F("isdigit")}(c)) num = num * ${N("10")} + (c - ${N("'0'")});`,
      `            ${K("if")} ((!${F("isdigit")}(c) &amp;&amp; c != ${N("' '")}) || i == (${K("int")})s.${F("size")}() - ${N("1")}) {`,
      `                ${K("if")} (op == ${N("'+'")}) st.${F("push")}(num);`,
      `                ${K("else if")} (op == ${N("'-'")}) st.${F("push")}(-num);`,
      `                ${K("else if")} (op == ${N("'*'")}) { ${K("int")} t = st.${F("top")}(); st.${F("pop")}(); st.${F("push")}(t * num); }`,
      `                ${K("else")} { ${K("int")} t = st.${F("top")}(); st.${F("pop")}(); st.${F("push")}(t / num); }`,
      `                op = c;`,
      `                num = ${N("0")};`,
      `            }`,
      `        }`,
      `        ${K("int")} res = ${N("0")};`,
      `        ${K("while")} (!st.${F("empty")}()) { res += st.${F("top")}(); st.${F("pop")}(); }`,
      `        ${K("return")} res;`,
      `    }`,
      `};`
    ]),

    generateTrace(sInput) {
      const s = String(sInput === undefined || sInput === null ? "" : sInput);
      const chars = s.split("");
      const n = chars.length;
      const steps = [];
      const st = [];
      const done = new Set();
      let num = 0;
      let op = "+";
      let res = null;
      let curI = -1;
      let curC = "-";

      const show = (ch) => (ch === " " ? "␣" : ch);
      const snap = ({ hlIdx = -1, stackHl = -1, stackStatus = "hl", ret = "-", hot = [], connectors = [] } = {}) => ({
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: "運算式字串 (string)",
            x: 325,
            y: 52,
            values: chars.map((ch) => ext8Esc(show(ch))),
            hl: hlIdx >= 0 ? [hlIdx] : [],
            done: [...done].filter((k) => k !== hlIdx),
            pointers: hlIdx >= 0 ? [{ idx: hlIdx, label: `i = ${hlIdx}`, color: "blue" }] : []
          },
          {
            id: "st",
            type: "stack",
            name: "st",
            typeLabel: "待加總的項 (stack<int>)",
            x: 325,
            y: 205,
            items: st.map((v, k) => ({ val: v, status: k === stackHl ? stackStatus : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "掃描狀態",
            x: 24,
            y: 215,
            items: [
              { id: "i", name: "i", val: curI >= 0 ? String(curI) : "-", status: hot.includes("i") ? "hl" : "" },
              { id: "c", name: "c", val: curC === "-" ? "-" : `'${ext8Esc(curC)}'`, status: hot.includes("c") ? "hl" : "" },
              { id: "num", name: "num", val: String(num), status: hot.includes("num") ? "hl" : "" },
              { id: "op", name: "op", val: `'${ext8Esc(op)}'`, status: hot.includes("op") ? "hl" : "" },
              { id: "res", name: "res", val: res === null ? "-" : String(res), status: hot.includes("res") ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      });
      const vars = (extra = {}) => ({
        i: curI >= 0 ? String(curI) : "-",
        c: curC === "-" ? "-" : `'${curC}'`,
        num: String(num),
        op: `'${op}'`,
        "st": `[${st.join(", ")}]`,
        res: res === null ? "-" : String(res),
        return: "-",
        ...extra
      });

      steps.push({
        line: 6,
        tag: "初始化",
        tagType: "default",
        inlineBadge: "st = [], num = 0, op = '+'",
        explanation: "建立空堆疊 st，目前數字 num 設為 0，並假設第一個數字前面有一個 '+'，這樣第一個數字也能用同一套規則處理。",
        vars: vars(),
        state: snap({ hot: ["num", "op"] })
      });

      for (let i = 0; i < n; i++) {
        const c = chars[i];
        curI = i;
        curC = c;
        const isDigit = c >= "0" && c <= "9";
        const trigger = (!isDigit && c !== " ") || i === n - 1;

        if (isDigit) {
          const before = num;
          num = num * 10 + Number(c);
          steps.push({
            line: 9,
            tag: `累積數字 ${num}`,
            tagType: "default",
            inlineBadge: `num = ${before} * 10 + ${c} = ${num}`,
            explanation: `s[${i}] = '${c}' 是數字，把它接到 num 的尾端：${before} × 10 + ${c} = ${num}。`,
            vars: vars(),
            state: snap({ hlIdx: i, hot: ["c", "num"] })
          });
        } else if (!trigger) {
          steps.push({
            line: 8,
            tag: "略過空白",
            tagType: "default",
            inlineBadge: "c = ' '",
            explanation: `s[${i}] 是空白，既不是數字也不是運算子，不需要處理，直接看下一個字元。`,
            vars: vars(),
            state: snap({ hlIdx: i, hot: ["c"] })
          });
        }

        if (trigger) {
          const why = i === n - 1 && (isDigit || c === " ") ? "已到字串結尾" : `遇到運算子 '${c}'`;
          let line;
          let tag;
          let badge;
          let expl;
          if (op === "+") {
            st.push(num);
            line = 11;
            tag = `push(${num})`;
            badge = `op == '+' → st.push(${num})`;
            expl = `${why}，結算前一個數字。它前面的運算子是 '+'，所以把 ${num} 原樣推入堆疊，等最後一起相加。`;
          } else if (op === "-") {
            st.push(-num);
            line = 12;
            tag = `push(${-num})`;
            badge = `op == '-' → st.push(${-num})`;
            expl = `${why}，結算前一個數字。它前面的運算子是 '-'，所以推入 -${num}，把減法改寫成加上負數。`;
          } else if (op === "*") {
            const t = st.pop();
            st.push(t * num);
            line = 13;
            tag = `${t} * ${num} = ${t * num}`;
            badge = `t = ${t} → st.push(${t} * ${num})`;
            expl = `${why}，結算前一個數字。它前面的運算子是 '*'，乘法優先，立刻取出頂端 ${t} 與 ${num} 相乘，把結果 ${t * num} 放回堆疊。`;
          } else {
            const t = st.pop();
            const q = Math.trunc(t / num);
            st.push(q);
            line = 14;
            tag = `${t} / ${num} = ${q}`;
            badge = `t = ${t} → st.push(${t} / ${num} = ${q})`;
            expl = `${why}，結算前一個數字。它前面的運算子是 '/'，除法優先，立刻取出頂端 ${t} 除以 ${num}，整數除法向零截斷得到 ${q}，再放回堆疊。`;
          }
          const top = st.length - 1;
          steps.push({
            line,
            tag,
            tagType: "tag-insert",
            inlineBadge: badge,
            explanation: expl,
            vars: vars(),
            state: snap({
              hlIdx: i,
              stackHl: top,
              hot: ["op", "num"],
              connectors: [{ from: `wb-cw-s-${i}`, to: `wb-stack-st-${top}`, label: `st.top() = ${st[top]}`, color: "purple" }]
            })
          });

          op = c;
          num = 0;
          steps.push({
            line: 16,
            tag: "更新 op，num 歸零",
            tagType: "default",
            inlineBadge: `op = '${c}', num = 0`,
            explanation: isDigit || c === " "
              ? "op 被設成最後一個字元，但字串已結束，不會再用到；num 歸零。"
              : `記住新的運算子 op = '${c}'，它會作用在下一個讀到的數字上；num 歸零，準備累積下一個數字。`,
            vars: vars(),
            state: snap({ hlIdx: i, hot: ["op", "num"] })
          });
        }
        done.add(i);
      }

      res = 0;
      curI = -1;
      curC = "-";
      steps.push({
        line: 19,
        tag: "準備加總",
        tagType: "default",
        inlineBadge: "res = 0",
        explanation: `掃描完畢，堆疊中剩下的都是只需相加的項：[${st.join(", ")}]。從 res = 0 開始逐一彈出並累加。`,
        vars: vars(),
        state: snap({ hot: ["res"] })
      });

      while (st.length) {
        const top = st.length - 1;
        const v = st[top];
        const before = res;
        res += v;
        steps.push({
          line: 20,
          tag: `res += ${v}`,
          tagType: "tag-check",
          inlineBadge: `res = ${before} + ${v} = ${res}`,
          explanation: `彈出頂端 ${v} 加到 res：${before} + (${v}) = ${res}。`,
          vars: vars(),
          state: snap({
            stackHl: top,
            hot: ["res"],
            connectors: [{ from: `wb-stack-st-${top}`, to: "wb-var-res", label: `+${v}`, color: "blue" }]
          })
        });
        st.pop();
      }

      steps.push({
        line: 21,
        tag: `回傳 ${res}`,
        tagType: "tag-found",
        inlineBadge: `return ${res}`,
        explanation: `堆疊已清空，運算式的值為 ${res}。`,
        vars: vars({ return: String(res) }),
        state: snap({ ret: res, connectors: [{ from: "wb-var-res", to: "wb-var-ret", label: `= ${res}`, color: "green" }] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #161 Combination Sum IV (LC #377, Medium, Dynamic Programming)
  // ============================================================================
  window.PROBLEMS["combination-sum-iv"] = {
    id: 161,
    leetcodeId: 377,
    slug: "combination-sum-iv",
    title: "377. Combination Sum IV (組合總和 IV)",
    difficulty: "Medium",
    topic: "Dynamic Programming / 1D DP",
    mins: 35,
    complexity: "Time O(target · n) · Space O(target)",
    argNames: ["nums", "target"],
    description:
      "給定互不相同的正整數陣列 nums 與目標值 target，求總和為 target 的「有序」組合數（順序不同視為不同組合）。令 dp[t] 為湊出 t 的序列數，最後一個放入的數字若為 num，前面就是湊出 t - num 的任一序列，因此 dp[t] = Σ dp[t - num]（num ≤ t），dp[0] = 1 代表空序列。外層迴圈跑金額 t、內層跑 nums，正是計算排列數的關鍵。使用 vector<unsigned int> 讓中間值溢位時依模數自然回繞（題目保證答案在 32 位元內）。時間 O(target · n)，空間 O(target)。",

    presets: [
      { name: "範例 1：nums = [1,2,3], target = 4", args: [[1, 2, 3], 4] },
      { name: "範例 2：nums = [9], target = 3（無法湊出）", args: [[9], 3] },
      { name: "範例 3：nums = [2,3,5], target = 8", args: [[2, 3, 5], 8] },
      { name: "範例 4：nums = [1,2], target = 7（費氏數列）", args: [[1, 2], 7] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${K("int")} ${F("combinationSum4")}(${T("vector")}&lt;${K("int")}&gt;&amp; nums, ${K("int")} target) {`,
      `        ${T("vector")}&lt;${K("unsigned int")}&gt; dp(target + ${N("1")}, ${N("0")});`,
      `        dp[${N("0")}] = ${N("1")};`,
      `        ${K("for")} (${K("int")} t = ${N("1")}; t &lt;= target; t++) {`,
      `            ${K("for")} (${K("int")} num : nums) {`,
      `                ${K("if")} (num &lt;= t) {`,
      `                    dp[t] += dp[t - num];`,
      `                }`,
      `            }`,
      `        }`,
      `        ${K("return")} dp[target];`,
      `    }`,
      `};`
    ]),

    generateTrace(numsInput, targetInput) {
      const nums = ext8Clone(numsInput || []).map(Number);
      const target = Number(targetInput);
      const steps = [];
      const dp = new Array(target + 1).fill(0);
      const filled = new Set();
      let curT = "-";
      let curNum = "-";

      const snap = ({ numHl = -1, dpHl = [], dpMatch = [], dpWarn = [], tPtr = -1, srcPtr = -1, ret = "-", connectors = [] } = {}) => ({
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "可用數字 (vector<int>)",
            x: 325,
            y: 52,
            values: [...nums],
            hl: numHl >= 0 ? [numHl] : [],
            pointers: numHl >= 0 ? [{ idx: numHl, label: "num", color: "purple" }] : []
          },
          {
            id: "dp",
            type: "array",
            name: "dp",
            typeLabel: "dp[t] = 湊出 t 的序列數",
            x: 325,
            y: 190,
            values: [...dp],
            hl: dpHl,
            match: dpMatch,
            warn: dpWarn,
            done: [...filled].filter((k) => !dpHl.includes(k) && !dpMatch.includes(k)),
            pointers: [
              ...(tPtr >= 0 ? [{ idx: tPtr, label: "t", color: "blue" }] : []),
              ...(srcPtr >= 0 && srcPtr !== tPtr ? [{ idx: srcPtr, label: "t-num", color: "green" }] : [])
            ]
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "迴圈變數",
            x: 24,
            y: 215,
            items: [
              { id: "target", name: "target", val: String(target), status: "" },
              { id: "t", name: "t", val: String(curT), status: curT !== "-" ? "hl" : "" },
              { id: "num", name: "num", val: String(curNum), status: curNum !== "-" ? "hl" : "" },
              { id: "dpt", name: "dp[t]", val: curT !== "-" ? String(dp[curT]) : "-", status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      });
      const vars = (extra = {}) => ({
        t: String(curT),
        num: String(curNum),
        "dp[t]": curT !== "-" ? String(dp[curT]) : "-",
        dp: `[${dp.join(",")}]`,
        return: "-",
        ...extra
      });

      steps.push({
        line: 4,
        tag: "建立 dp 陣列",
        tagType: "default",
        inlineBadge: `dp.size() = ${target + 1}`,
        explanation: `建立長度 target + 1 = ${target + 1} 的 dp 陣列並全部設為 0，dp[t] 代表總和恰為 t 的有序序列數。`,
        vars: vars(),
        state: snap()
      });

      dp[0] = 1;
      filled.add(0);
      steps.push({
        line: 5,
        tag: "dp[0] = 1",
        tagType: "tag-insert",
        inlineBadge: "dp[0] = 1",
        explanation: "總和為 0 只有一種方式：什麼都不選（空序列），這是所有序列的起點。",
        vars: vars(),
        state: snap({ dpHl: [0] })
      });

      for (let t = 1; t <= target; t++) {
        curT = t;
        for (let k = 0; k < nums.length; k++) {
          const num = nums[k];
          curNum = num;
          if (num <= t) {
            const before = dp[t];
            dp[t] = (dp[t] + dp[t - num]) >>> 0;
            filled.add(t);
            steps.push({
              line: 9,
              tag: `dp[${t}] += dp[${t - num}]`,
              tagType: "tag-insert",
              inlineBadge: `dp[${t}] = ${before} + ${dp[t - num]} = ${dp[t]}`,
              explanation: `最後一個數字選 ${num}：前面必須湊出 ${t} - ${num} = ${t - num}，共有 dp[${t - num}] = ${dp[t - num]} 種，累加後 dp[${t}] = ${dp[t]}。`,
              vars: vars(),
              state: snap({
                numHl: k,
                dpHl: [t],
                tPtr: t,
                srcPtr: t - num,
                connectors: [{ from: `wb-cw-dp-${t - num}`, to: `wb-cw-dp-${t}`, label: `+${dp[t - num]}`, color: "purple" }]
              })
            });
          } else {
            steps.push({
              line: 8,
              tag: `${num} > ${t} 跳過`,
              tagType: "tag-check",
              inlineBadge: `${num} <= ${t} 為 false`,
              explanation: `數字 ${num} 比目前的總和 ${t} 還大，無法作為最後一個數字，跳過。`,
              vars: vars(),
              state: snap({ numHl: k, dpWarn: [t], tPtr: t })
            });
          }
        }
        filled.add(t);
      }

      curNum = "-";
      const ans = dp[target];
      steps.push({
        line: 13,
        tag: `回傳 ${ans}`,
        tagType: "tag-found",
        inlineBadge: `return dp[${target}] = ${ans}`,
        explanation: `dp 表填完，總和為 ${target} 的有序組合共有 ${ans} 種。`,
        vars: vars({ return: String(ans) }),
        state: snap({
          dpMatch: [target],
          tPtr: target,
          ret: ans,
          connectors: [{ from: `wb-cw-dp-${target}`, to: "wb-var-ret", label: `dp[${target}]`, color: "green" }]
        })
      });
      return steps;
    }
  };

  // ============================================================================
  // #162 Insert Delete GetRandom O(1) (LC #380, Medium, Hash Table / Design)
  // ============================================================================
  window.PROBLEMS["insert-delete-getrandom-o1"] = {
    id: 162,
    leetcodeId: 380,
    slug: "insert-delete-getrandom-o1",
    title: "380. Insert Delete GetRandom O(1) (常數時間插入、刪除與隨機取得)",
    difficulty: "Medium",
    topic: "Hash Table / Array / Design",
    mins: 20,
    complexity: "Time O(1) per op · Space O(n)",
    argNames: ["operations", "values"],
    description:
      "設計 RandomizedSet，在平均 O(1) 時間內完成 insert、remove 與 getRandom（等機率回傳任一元素）。用 vector<int> nums 緊密存放元素，讓隨機取值只需產生一個索引；再用 unordered_map<int, int> pos 記錄每個值在 nums 中的位置。刪除時把最後一個元素搬到被刪位置、更新它的 pos，再 pop_back，避免中間挖洞造成 O(n) 搬移。為了讓單步追蹤可重現，getRandom 的 rand() 值預先寫在測資 values 中，索引為 rand() % nums.size()。",

    presets: [
      {
        name: "範例 1：LeetCode 標準範例（rand() 依序為 1, 5）",
        args: [
          ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"],
          [[], [1], [2], [2], [1], [1], [2], [5]]
        ]
      },
      {
        name: "範例 2：刪除中間元素時把尾端搬過來",
        args: [
          ["RandomizedSet", "insert", "insert", "insert", "insert", "remove", "getRandom", "remove", "getRandom"],
          [[], [10], [20], [30], [40], [20], [4], [40], [7]]
        ]
      },
      {
        name: "範例 3：重複插入、刪除不存在與刪除尾端",
        args: [
          ["RandomizedSet", "insert", "insert", "insert", "remove", "remove", "insert", "getRandom"],
          [[], [-1], [-1], [3], [8], [3], [3], [2]]
        ]
      }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("RandomizedSet")} {`,
      `    ${T("vector")}&lt;${K("int")}&gt; nums;`,
      `    ${T("unordered_map")}&lt;${K("int")}, ${K("int")}&gt; pos;`,
      `${K("public")}:`,
      `    ${F("RandomizedSet")}() {}`,
      `    ${K("bool")} ${F("insert")}(${K("int")} val) {`,
      `        ${K("if")} (pos.${F("count")}(val)) ${K("return")} ${K("false")};`,
      `        pos[val] = nums.${F("size")}();`,
      `        nums.${F("push_back")}(val);`,
      `        ${K("return")} ${K("true")};`,
      `    }`,
      `    ${K("bool")} ${F("remove")}(${K("int")} val) {`,
      `        ${K("if")} (!pos.${F("count")}(val)) ${K("return")} ${K("false")};`,
      `        ${K("int")} idx = pos[val], last = nums.${F("back")}();`,
      `        nums[idx] = last;`,
      `        pos[last] = idx;`,
      `        nums.${F("pop_back")}();`,
      `        pos.${F("erase")}(val);`,
      `        ${K("return")} ${K("true")};`,
      `    }`,
      `    ${K("int")} ${F("getRandom")}() {`,
      `        ${K("return")} nums[${F("rand")}() % nums.${F("size")}()];`,
      `    }`,
      `};`
    ]),

    generateTrace(opsInput, valsInput) {
      const ops = ext8Clone(opsInput || []);
      const vals = ext8Clone(valsInput || []);
      const steps = [];
      const nums = [];
      const pos = new Map();
      const outputs = ops.map(() => "");
      const doneOps = new Set();
      let local = { idx: "-", last: "-" };

      const label = (k) => {
        const op = ops[k];
        if (op === "insert" || op === "remove") return `${op}(${vals[k][0]})`;
        if (op === "getRandom") return "getRandom()";
        return `${op}()`;
      };
      const rowId = (v) => `p${v}`;

      const snap = ({ opIdx = -1, opStatus = "hl", outHl = -1, numsHl = [], numsMatch = [], numsWarn = [], ptrs = [], rowStatus = {}, op = "-", ret = "-", retStatus = "", slot = null, connectors = [] } = {}) => ({
        boards: [
          {
            id: "ops",
            type: "array",
            name: "operations",
            typeLabel: "呼叫序列",
            x: 325,
            y: 52,
            values: ops.map((_, k) => label(k)),
            hl: opIdx >= 0 && opStatus === "hl" ? [opIdx] : [],
            match: opIdx >= 0 && opStatus === "match" ? [opIdx] : [],
            done: [...doneOps].filter((k) => k !== opIdx),
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx}`, color: "blue" }] : []
          },
          {
            id: "out",
            type: "array",
            name: "output",
            typeLabel: "每次呼叫的回傳值",
            x: 325,
            y: 170,
            values: outputs.map((o) => (o === "" ? "?" : o)),
            hl: outHl >= 0 ? [outHl] : [],
            done: outputs.map((o, k) => (o !== "" && k !== outHl ? k : -1)).filter((k) => k >= 0)
          },
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "緊密存放 (vector<int>)",
            x: 325,
            y: 285,
            values: [...nums],
            hl: numsHl,
            match: numsMatch,
            warn: numsWarn,
            pointers: ptrs
          },
          {
            id: "pos",
            type: "dict",
            name: "pos",
            typeLabel: "值 → 索引 (unordered_map)",
            x: 620,
            y: 285,
            headers: ["val", "idx", "狀態"],
            rows: [...pos.entries()].map(([v, i]) => ({
              id: rowId(v),
              key: String(v),
              val: String(i),
              note: rowStatus[v] ? rowStatus[v][1] : "",
              status: rowStatus[v] ? rowStatus[v][0] : ""
            })),
            slot
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "目前呼叫",
            x: 24,
            y: 215,
            items: [
              { id: "op", name: "呼叫", val: op, status: op !== "-" ? "hl" : "" },
              { id: "idx", name: "idx", val: String(local.idx), status: "" },
              { id: "last", name: "last", val: String(local.last), status: "" },
              { id: "size", name: "nums.size()", val: String(nums.length), status: "" },
              { id: "ret", name: "return", val: String(ret), status: retStatus }
            ]
          }
        ],
        connectors
      });
      const vars = (op, ret = "-") => ({
        op,
        idx: String(local.idx),
        last: String(local.last),
        nums: `[${nums.join(",")}]`,
        pos: `{${[...pos.entries()].map(([v, i]) => `${v}:${i}`).join(", ")}}`,
        return: String(ret)
      });

      for (let k = 0; k < ops.length; k++) {
        const op = ops[k];
        const lab = label(k);
        local = { idx: "-", last: "-" };
        if (op === "RandomizedSet") {
          outputs[k] = "null";
          steps.push({
            line: 5,
            tag: "建構空集合",
            tagType: "default",
            inlineBadge: "nums = [], pos = {}",
            explanation: "建立 RandomizedSet：nums 用來緊密存放元素，pos 記錄每個值目前在 nums 的哪個索引。",
            vars: vars(lab, "null"),
            state: snap({ opIdx: k, outHl: k, op: lab, ret: "null" })
          });
        } else if (op === "insert") {
          const v = vals[k][0];
          if (pos.has(v)) {
            outputs[k] = "false";
            steps.push({
              line: 7,
              tag: `${v} 已存在 → false`,
              tagType: "tag-check",
              inlineBadge: `pos.count(${v}) = 1 → return false`,
              explanation: `pos 中已經有 ${v}（位於 nums[${pos.get(v)}]），集合不允許重複，插入失敗回傳 false。`,
              vars: vars(lab, "false"),
              state: snap({
                opIdx: k,
                outHl: k,
                op: lab,
                ret: "false",
                retStatus: "warn",
                rowStatus: { [v]: ["hit", "已存在"] },
                numsWarn: [pos.get(v)],
                connectors: [{ from: `wb-dict-row-${rowId(v)}`, to: "wb-var-ret", label: "已存在", color: "red" }]
              })
            });
          } else {
            pos.set(v, nums.length);
            steps.push({
              line: 8,
              tag: `pos[${v}] = ${nums.length}`,
              tagType: "tag-insert",
              inlineBadge: `pos[${v}] = nums.size() = ${nums.length}`,
              explanation: `${v} 不在集合中。它將被放在 nums 尾端，所以先記錄 pos[${v}] = ${nums.length}。`,
              vars: vars(lab),
              state: snap({ opIdx: k, op: lab, rowStatus: { [v]: ["inserted", "新增"] } })
            });
            nums.push(v);
            const at = nums.length - 1;
            steps.push({
              line: 9,
              tag: `push_back(${v})`,
              tagType: "tag-insert",
              inlineBadge: `nums[${at}] = ${v}`,
              explanation: `把 ${v} 加到 nums 尾端（索引 ${at}），與 pos[${v}] 的紀錄一致。`,
              vars: vars(lab),
              state: snap({
                opIdx: k,
                op: lab,
                numsHl: [at],
                rowStatus: { [v]: ["inserted", "新增"] },
                connectors: [{ from: `wb-dict-row-${rowId(v)}`, to: `wb-cw-nums-${at}`, label: `idx ${at}`, color: "purple" }]
              })
            });
            outputs[k] = "true";
            steps.push({
              line: 10,
              tag: "回傳 true",
              tagType: "tag-found",
              inlineBadge: "return true",
              explanation: `插入 ${v} 成功，回傳 true。目前 nums = [${nums.join(", ")}]。`,
              vars: vars(lab, "true"),
              state: snap({ opIdx: k, opStatus: "match", outHl: k, op: lab, ret: "true", retStatus: "match", numsMatch: [at] })
            });
          }
        } else if (op === "remove") {
          const v = vals[k][0];
          if (!pos.has(v)) {
            outputs[k] = "false";
            steps.push({
              line: 13,
              tag: `${v} 不存在 → false`,
              tagType: "tag-check",
              inlineBadge: `pos.count(${v}) = 0 → return false`,
              explanation: `pos 中查不到 ${v}，集合裡沒有這個值，刪除失敗回傳 false。`,
              vars: vars(lab, "false"),
              state: snap({ opIdx: k, outHl: k, op: lab, ret: "false", retStatus: "warn", slot: { key: String(v), val: "?", note: "查無此值" } })
            });
          } else {
            const idx = pos.get(v);
            const lastIdx = nums.length - 1;
            const last = nums[lastIdx];
            local = { idx, last };
            steps.push({
              line: 14,
              tag: `idx = ${idx}, last = ${last}`,
              tagType: "tag-check",
              inlineBadge: `idx = pos[${v}] = ${idx}, last = ${last}`,
              explanation: `查到 ${v} 位於 nums[${idx}]；nums 的最後一個元素是 ${last}。接下來用 ${last} 填補 ${v} 的位置。`,
              vars: vars(lab),
              state: snap({
                opIdx: k,
                op: lab,
                numsWarn: [idx],
                numsHl: idx !== lastIdx ? [lastIdx] : [],
                ptrs: [{ idx, label: "idx", color: "red" }, ...(idx !== lastIdx ? [{ idx: lastIdx, label: "back", color: "purple" }] : [])],
                rowStatus: { [v]: ["hit", "要刪除"] },
                connectors: [{ from: `wb-dict-row-${rowId(v)}`, to: `wb-cw-nums-${idx}`, label: `pos[${v}] = ${idx}`, color: "blue" }]
              })
            });
            nums[idx] = last;
            steps.push({
              line: 15,
              tag: `nums[${idx}] = ${last}`,
              tagType: "tag-insert",
              inlineBadge: `nums[${idx}] = ${last}`,
              explanation: idx === lastIdx
                ? `要刪除的 ${v} 本身就是最後一個元素，自己覆蓋自己，不影響結果。`
                : `把尾端的 ${last} 複製到索引 ${idx}，覆蓋掉 ${v}。`,
              vars: vars(lab),
              state: snap({
                opIdx: k,
                op: lab,
                numsHl: [idx],
                ptrs: [{ idx, label: "idx", color: "red" }, ...(idx !== lastIdx ? [{ idx: lastIdx, label: "back", color: "purple" }] : [])],
                rowStatus: { [v]: ["hit", "要刪除"] },
                connectors: idx !== lastIdx ? [{ from: `wb-cw-nums-${lastIdx}`, to: `wb-cw-nums-${idx}`, label: `搬移 ${last}`, color: "purple" }] : []
              })
            });
            pos.set(last, idx);
            steps.push({
              line: 16,
              tag: `pos[${last}] = ${idx}`,
              tagType: "tag-insert",
              inlineBadge: `pos[${last}] = ${idx}`,
              explanation: `${last} 搬到了索引 ${idx}，同步更新 pos[${last}] = ${idx}。`,
              vars: vars(lab),
              state: snap({
                opIdx: k,
                op: lab,
                numsHl: [idx],
                rowStatus: { [last]: ["inserted", "更新位置"], ...(last !== v ? { [v]: ["hit", "要刪除"] } : {}) },
                connectors: [{ from: `wb-dict-row-${rowId(last)}`, to: `wb-cw-nums-${idx}`, label: `idx ${idx}`, color: "purple" }]
              })
            });
            nums.pop();
            steps.push({
              line: 17,
              tag: "pop_back()",
              tagType: "tag-check",
              inlineBadge: `nums.size() = ${nums.length}`,
              explanation: `移除 nums 尾端多出來的那一格，nums = [${nums.join(", ")}]，整個過程不需要搬動其他元素。`,
              vars: vars(lab),
              state: snap({ opIdx: k, op: lab, rowStatus: { [v]: ["hit", "要刪除"] } })
            });
            pos.delete(v);
            steps.push({
              line: 18,
              tag: `erase(${v})`,
              tagType: "tag-check",
              inlineBadge: `pos.erase(${v})`,
              explanation: `從 pos 刪除 ${v} 的紀錄。`,
              vars: vars(lab),
              state: snap({ opIdx: k, op: lab, slot: { key: String(v), val: "—", note: "已刪除" } })
            });
            outputs[k] = "true";
            steps.push({
              line: 19,
              tag: "回傳 true",
              tagType: "tag-found",
              inlineBadge: "return true",
              explanation: `刪除 ${v} 成功，回傳 true。`,
              vars: vars(lab, "true"),
              state: snap({ opIdx: k, opStatus: "match", outHl: k, op: lab, ret: "true", retStatus: "match" })
            });
          }
        } else if (op === "getRandom") {
          const r = Number(vals[k] && vals[k].length ? vals[k][0] : 0);
          const idx = r % nums.length;
          const got = nums[idx];
          local = { idx, last: "-" };
          outputs[k] = String(got);
          steps.push({
            line: 22,
            tag: `getRandom() → ${got}`,
            tagType: "tag-found",
            inlineBadge: `rand() = ${r}, ${r} % ${nums.length} = ${idx} → ${got}`,
            explanation: `本次預設 rand() = ${r}，索引 = ${r} % ${nums.length} = ${idx}，回傳 nums[${idx}] = ${got}。因為 nums 沒有空洞，每個元素被選中的機率都相同。`,
            vars: vars(lab, String(got)),
            state: snap({
              opIdx: k,
              opStatus: "match",
              outHl: k,
              op: lab,
              ret: String(got),
              retStatus: "match",
              numsMatch: [idx],
              ptrs: [{ idx, label: `rand % ${nums.length}`, color: "green" }],
              connectors: [{ from: `wb-cw-nums-${idx}`, to: "wb-var-ret", label: `nums[${idx}]`, color: "green" }]
            })
          });
        }
        doneOps.add(k);
      }
      return steps;
    }
  };

  // ============================================================================
  // #163 Non-overlapping Intervals (LC #435, Medium, Greedy)
  // ============================================================================
  window.PROBLEMS["non-overlapping-intervals"] = {
    id: 163,
    leetcodeId: 435,
    slug: "non-overlapping-intervals",
    title: "435. Non-overlapping Intervals (無重疊區間)",
    difficulty: "Medium",
    topic: "Array / Greedy / Sorting",
    mins: 20,
    complexity: "Time O(n log n) · Space O(log n)",
    argNames: ["intervals"],
    description:
      "給定區間陣列 intervals，求最少要移除幾個區間，才能讓剩下的區間兩兩不重疊（只在端點相接不算重疊）。貪婪策略：依結束點由小到大排序，每次保留結束最早、且與上一個保留區間不衝突的區間，因為結束越早，留給後面的空間越多。掃描時記錄最後保留區間的結束點 prevEnd，若目前區間的起點 < prevEnd 就必須移除（removed++），否則保留並更新 prevEnd。排序 O(n log n)，掃描 O(n)。",

    presets: [
      { name: "範例 1：intervals = [[1,2],[2,3],[3,4],[1,3]]", args: [[[1, 2], [2, 3], [3, 4], [1, 3]]] },
      { name: "範例 2：intervals = [[1,2],[1,2],[1,2]]（完全相同）", args: [[[1, 2], [1, 2], [1, 2]]] },
      { name: "範例 3：intervals = [[1,2],[2,3]]（端點相接不算重疊）", args: [[[1, 2], [2, 3]]] },
      { name: "範例 4：intervals = [[1,100],[11,22],[1,11],[2,12],[23,30],[25,40]]", args: [[[1, 100], [11, 22], [1, 11], [2, 12], [23, 30], [25, 40]]] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${K("int")} ${F("eraseOverlapIntervals")}(${T("vector")}&lt;${T("vector")}&lt;${K("int")}&gt;&gt;&amp; intervals) {`,
      `        ${F("sort")}(intervals.${F("begin")}(), intervals.${F("end")}(), [](${K("const auto")}&amp; a, ${K("const auto")}&amp; b) {`,
      `            ${K("return")} a[${N("1")}] &lt; b[${N("1")}];`,
      `        });`,
      `        ${K("int")} removed = ${N("0")};`,
      `        ${K("int")} prevEnd = intervals[${N("0")}][${N("1")}];`,
      `        ${K("for")} (${K("int")} i = ${N("1")}; i &lt; (${K("int")})intervals.${F("size")}(); i++) {`,
      `            ${K("if")} (intervals[i][${N("0")}] &lt; prevEnd) {`,
      `                removed++;`,
      `            } ${K("else")} {`,
      `                prevEnd = intervals[i][${N("1")}];`,
      `            }`,
      `        }`,
      `        ${K("return")} removed;`,
      `    }`,
      `};`
    ]),

    generateTrace(intervalsInput) {
      const original = ext8Clone(intervalsInput || []);
      const steps = [];
      const fmt = (iv) => `[${iv[0]},${iv[1]}]`;
      let arr = original.map((iv) => [Number(iv[0]), Number(iv[1])]);
      let sorted = false;
      const kept = new Set();
      const removedSet = new Set();
      let removed = "-";
      let prevEnd = "-";
      let curI = "-";

      const snap = ({ hlIdx = -1, warnNow = -1, ret = "-", prevIdx = -1, connectors = [] } = {}) => ({
        boards: [
          {
            id: "iv",
            type: "array",
            name: sorted ? "intervals（依結束點排序）" : "intervals",
            typeLabel: "vector<vector<int>>",
            x: 325,
            y: 52,
            values: arr.map(fmt),
            hl: hlIdx >= 0 ? [hlIdx] : [],
            match: [...kept].filter((k) => k !== hlIdx),
            warn: [...removedSet].filter((k) => k !== hlIdx).concat(warnNow >= 0 ? [warnNow] : []),
            pointers: [
              ...(hlIdx >= 0 ? [{ idx: hlIdx, label: `i = ${hlIdx}`, color: "blue" }] : []),
              ...(prevIdx >= 0 && prevIdx !== hlIdx ? [{ idx: prevIdx, label: "prevEnd", color: "green" }] : [])
            ]
          },
          {
            id: "keep",
            type: "set",
            name: "保留的區間",
            typeLabel: "互不重疊",
            x: 325,
            y: 190,
            items: [...kept].sort((a, b) => a - b).map((k) => ({ val: fmt(arr[k]), status: "" }))
          },
          {
            id: "drop",
            type: "set",
            name: "移除的區間",
            typeLabel: "removed 計數",
            x: 325,
            y: 280,
            items: [...removedSet].sort((a, b) => a - b).map((k) => ({ val: fmt(arr[k]), status: "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "貪婪掃描狀態",
            x: 24,
            y: 215,
            items: [
              { id: "i", name: "i", val: String(curI), status: curI !== "-" ? "hl" : "" },
              { id: "prevEnd", name: "prevEnd", val: String(prevEnd), status: "" },
              { id: "removed", name: "removed", val: String(removed), status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      });
      const vars = (extra = {}) => ({ i: String(curI), prevEnd: String(prevEnd), removed: String(removed), return: "-", ...extra });

      steps.push({
        line: 4,
        tag: "原始區間",
        tagType: "default",
        inlineBadge: `n = ${arr.length}`,
        explanation: `共有 ${arr.length} 個區間。先依「結束點」由小到大排序，讓結束得早的區間排在前面優先考慮。`,
        vars: vars(),
        state: snap()
      });

      arr = arr.map((iv, k) => ({ iv, k })).sort((a, b) => a.iv[1] - b.iv[1] || a.k - b.k).map((o) => o.iv);
      sorted = true;
      steps.push({
        line: 5,
        tag: "依結束點排序",
        tagType: "tag-check",
        inlineBadge: `a[1] < b[1]`,
        explanation: `排序後為 ${arr.map(fmt).join(" ")}。接下來從左到右貪婪地挑選。`,
        vars: vars(),
        state: snap()
      });

      removed = 0;
      prevEnd = arr[0][1];
      kept.add(0);
      let prevIdx = 0;
      steps.push({
        line: 8,
        tag: `保留 ${fmt(arr[0])}`,
        tagType: "tag-insert",
        inlineBadge: `removed = 0, prevEnd = ${prevEnd}`,
        explanation: `結束最早的區間 ${fmt(arr[0])} 一定可以保留。removed = 0，prevEnd = ${prevEnd}。`,
        vars: vars(),
        state: snap({ prevIdx, connectors: [{ from: "wb-cw-iv-0", to: "wb-var-prevEnd", label: `end = ${prevEnd}`, color: "green" }] })
      });

      for (let i = 1; i < arr.length; i++) {
        curI = i;
        const [st, en] = arr[i];
        const overlap = st < prevEnd;
        steps.push({
          line: 10,
          tag: overlap ? "與上一個保留區間重疊" : "不重疊",
          tagType: "tag-check",
          inlineBadge: `${st} < ${prevEnd} → ${overlap}`,
          explanation: overlap
            ? `區間 ${fmt(arr[i])} 的起點 ${st} 小於 prevEnd = ${prevEnd}，與上一個保留的區間重疊。`
            : `區間 ${fmt(arr[i])} 的起點 ${st} 不小於 prevEnd = ${prevEnd}，可以接在後面而不重疊。`,
          vars: vars(),
          state: snap({
            hlIdx: i,
            prevIdx,
            connectors: [{ from: `wb-cw-iv-${i}`, to: "wb-var-prevEnd", label: `${st} < ${prevEnd} ?`, color: overlap ? "red" : "blue" }]
          })
        });
        if (overlap) {
          removed += 1;
          removedSet.add(i);
          steps.push({
            line: 11,
            tag: `移除 ${fmt(arr[i])}`,
            tagType: "tag-insert",
            inlineBadge: `removed = ${removed}`,
            explanation: `移除 ${fmt(arr[i])}。因為它的結束點 ${en} 不早於 prevEnd，留下先前的區間對後面更有利。removed = ${removed}。`,
            vars: vars(),
            state: snap({ prevIdx, warnNow: i, connectors: [{ from: `wb-cw-iv-${i}`, to: `wb-chip-drop-${[...removedSet].sort((a, b) => a - b).indexOf(i)}`, label: "removed++", color: "red" }] })
          });
        } else {
          prevEnd = en;
          kept.add(i);
          prevIdx = i;
          steps.push({
            line: 13,
            tag: `保留 ${fmt(arr[i])}`,
            tagType: "tag-insert",
            inlineBadge: `prevEnd = ${en}`,
            explanation: `保留 ${fmt(arr[i])}，並把 prevEnd 更新為它的結束點 ${en}。`,
            vars: vars(),
            state: snap({ prevIdx, connectors: [{ from: `wb-cw-iv-${i}`, to: "wb-var-prevEnd", label: `prevEnd = ${en}`, color: "green" }] })
          });
        }
      }

      curI = "-";
      steps.push({
        line: 16,
        tag: `回傳 ${removed}`,
        tagType: "tag-found",
        inlineBadge: `return ${removed}`,
        explanation: `掃描結束，保留了 ${kept.size} 個互不重疊的區間，最少需要移除 ${removed} 個。`,
        vars: vars({ return: String(removed) }),
        state: snap({ ret: removed, connectors: [{ from: "wb-var-removed", to: "wb-var-ret", label: `= ${removed}`, color: "green" }] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #164 Palindrome Pairs (LC #336, Hard, String / Hash Table)
  // ============================================================================
  window.PROBLEMS["palindrome-pairs"] = {
    id: 164,
    leetcodeId: 336,
    slug: "palindrome-pairs",
    title: "336. Palindrome Pairs (迴文對)",
    difficulty: "Hard",
    topic: "String / Hash Table",
    mins: 40,
    complexity: "Time O(n · L²) · Space O(n · L)",
    argNames: ["words"],
    description:
      "給定互不相同的字串陣列 words，找出所有索引對 (i, j)（i ≠ j），使 words[i] + words[j] 為迴文。先把每個單字反轉後存入 unordered_map<string, int> idx。對每個單字 w 枚舉切點 j，把它分成前綴 w[0..j) 與後綴 w[j..n)：若後綴是迴文、且前綴的反轉是某個單字 k，則 w + words[k] 為迴文；若前綴是迴文（j > 0 以免重複）、且後綴的反轉是某個單字 k，則 words[k] + w 為迴文。每個單字有 L + 1 個切點，每次檢查迴文與取子字串 O(L)，總時間 O(n · L²)。",

    presets: [
      { name: "範例 1：words = [\"abcd\",\"dcba\",\"lls\",\"s\",\"sssll\"]", args: [["abcd", "dcba", "lls", "s", "sssll"]] },
      { name: "範例 2：words = [\"bat\",\"tab\",\"cat\"]", args: [["bat", "tab", "cat"]] },
      { name: "範例 3：words = [\"a\",\"\"]（含空字串）", args: [["a", ""]] },
      { name: "範例 4：words = [\"ab\",\"ba\",\"aba\",\"b\"]", args: [["ab", "ba", "aba", "b"]] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `    ${K("bool")} ${F("isPal")}(${K("const")} ${T("string")}&amp; s, ${K("int")} l, ${K("int")} r) {`,
      `        ${K("while")} (l &lt; r) ${K("if")} (s[l++] != s[r--]) ${K("return")} ${K("false")};`,
      `        ${K("return")} ${K("true")};`,
      `    }`,
      `${K("public")}:`,
      `    ${T("vector")}&lt;${T("vector")}&lt;${K("int")}&gt;&gt; ${F("palindromePairs")}(${T("vector")}&lt;${T("string")}&gt;&amp; words) {`,
      `        ${T("unordered_map")}&lt;${T("string")}, ${K("int")}&gt; idx;`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; (${K("int")})words.${F("size")}(); i++) {`,
      `            ${T("string")} r = words[i]; ${F("reverse")}(r.${F("begin")}(), r.${F("end")}());`,
      `            idx[r] = i;`,
      `        }`,
      `        ${T("vector")}&lt;${T("vector")}&lt;${K("int")}&gt;&gt; res;`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; (${K("int")})words.${F("size")}(); i++) {`,
      `            ${K("const")} ${T("string")}&amp; w = words[i];`,
      `            ${K("int")} n = w.${F("size")}();`,
      `            ${K("for")} (${K("int")} j = ${N("0")}; j &lt;= n; j++) {`,
      `                ${C("// 情況一：後綴 w[j..n) 是迴文，前綴 w[0..j) 的反轉是某個單字 → w + words[k]")}`,
      `                ${K("if")} (${F("isPal")}(w, j, n - ${N("1")})) {`,
      `                    ${K("auto")} it = idx.${F("find")}(w.${F("substr")}(${N("0")}, j));`,
      `                    ${K("if")} (it != idx.${F("end")}() &amp;&amp; it-&gt;second != i) res.${F("push_back")}({i, it-&gt;second});`,
      `                }`,
      `                ${C("// 情況二：前綴 w[0..j) 是迴文，後綴 w[j..n) 的反轉是某個單字 → words[k] + w")}`,
      `                ${K("if")} (j &gt; ${N("0")} &amp;&amp; ${F("isPal")}(w, ${N("0")}, j - ${N("1")})) {`,
      `                    ${K("auto")} it = idx.${F("find")}(w.${F("substr")}(j));`,
      `                    ${K("if")} (it != idx.${F("end")}() &amp;&amp; it-&gt;second != i) res.${F("push_back")}({it-&gt;second, i});`,
      `                }`,
      `            }`,
      `        }`,
      `        ${K("return")} res;`,
      `    }`,
      `};`
    ]),

    generateTrace(wordsInput) {
      const words = ext8Clone(wordsInput || []).map(String);
      const steps = [];
      const idx = new Map();
      const idxOrder = [];
      const res = [];
      const rev = (s) => s.split("").reverse().join("");
      const isPal = (s, l, r) => {
        while (l < r) if (s[l++] !== s[r--]) return false;
        return true;
      };
      const q = (s) => `"${ext8Esc(s)}"`;
      const qp = (s) => `"${s}"`;
      let curI = -1;
      let curW = null;
      let curJ = "-";

      const snap = ({ wordHl = -1, wordMatch = [], charHl = [], charMatch = [], charWarn = [], jPtr = -1, rowHit = null, rowStatus = "hit", rowNote = "", slot = null, resHl = -1, ret = "-", connectors = [] } = {}) => {
        const boards = [
          {
            id: "words",
            type: "array",
            name: "words",
            typeLabel: "vector<string>",
            x: 325,
            y: 52,
            values: words.map(q),
            hl: wordHl >= 0 ? [wordHl] : [],
            match: wordMatch,
            pointers: curI >= 0 ? [{ idx: curI, label: `i = ${curI}`, color: "blue" }] : []
          },
          {
            id: "w",
            type: "array",
            name: curW === null ? "w" : `w = ${q(curW)}`,
            typeLabel: "切點 j：前綴 w[0..j) ｜ 後綴 w[j..n)",
            x: 325,
            y: 175,
            values: curW === null ? [] : curW.split("").map(ext8Esc),
            hl: charHl,
            match: charMatch,
            warn: charWarn,
            pointers: jPtr >= 0 && curW !== null && jPtr < curW.length ? [{ idx: jPtr, label: `j = ${jPtr}`, color: "purple" }] : []
          },
          {
            id: "idx",
            type: "dict",
            name: "idx",
            typeLabel: "反轉字串 → 索引 (unordered_map)",
            x: 325,
            y: 300,
            headers: ["reverse(words[i])", "i", "狀態"],
            rows: idxOrder.map((k) => ({
              id: `r${k}`,
              key: q(rev(words[k])),
              val: String(k),
              note: rowHit === k ? rowNote : "",
              status: rowHit === k ? rowStatus : ""
            })),
            slot
          },
          {
            id: "res",
            type: "set",
            name: "res",
            typeLabel: "迴文對 (vector<vector<int>>)",
            x: 680,
            y: 300,
            items: res.map((p, k) => ({ val: `[${p[0]},${p[1]}]`, status: k === resHl ? "inserted" : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "目前切點",
            x: 24,
            y: 215,
            items: [
              { id: "i", name: "i", val: curI >= 0 ? String(curI) : "-", status: "" },
              { id: "w", name: "w", val: curW === null ? "-" : q(curW), status: "" },
              { id: "j", name: "j", val: String(curJ), status: curJ !== "-" ? "hl" : "" },
              { id: "cnt", name: "res.size()", val: String(res.length), status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ];
        return { boards, connectors };
      };
      const vars = (extra = {}) => ({
        i: curI >= 0 ? String(curI) : "-",
        w: curW === null ? "-" : qp(curW),
        j: String(curJ),
        res: `[${res.map((p) => `[${p[0]},${p[1]}]`).join(",")}]`,
        return: "-",
        ...extra
      });
      const range = (a, b) => Array.from({ length: Math.max(0, b - a) }, (_, k) => a + k);

      for (let i = 0; i < words.length; i++) {
        const r = rev(words[i]);
        idx.set(r, i);
        idxOrder.push(i);
        steps.push({
          line: 11,
          tag: `idx[${qp(r)}] = ${i}`,
          tagType: "tag-insert",
          inlineBadge: `reverse(${qp(words[i])}) = ${qp(r)}`,
          explanation: `把 words[${i}] = ${qp(words[i])} 反轉成 ${qp(r)} 存進雜湊表，之後只要查到某段字串等於 ${qp(r)}，就知道它的反轉是 words[${i}]。`,
          vars: vars(),
          state: snap({ wordHl: i, rowHit: i, rowStatus: "inserted", rowNote: "寫入", connectors: [{ from: `wb-cw-words-${i}`, to: `wb-dict-row-r${i}`, label: "反轉後存入", color: "purple" }] })
        });
      }

      for (let i = 0; i < words.length; i++) {
        curI = i;
        curW = words[i];
        const w = curW;
        const n = w.length;
        curJ = "-";
        steps.push({
          line: 16,
          tag: `處理 words[${i}]`,
          tagType: "default",
          inlineBadge: `w = ${qp(w)}, n = ${n}`,
          explanation: `取出 w = ${qp(w)}（長度 ${n}），接著枚舉 j = 0..${n} 共 ${n + 1} 個切點，把 w 分成前綴與後綴。`,
          vars: vars(),
          state: snap({ wordHl: i })
        });

        for (let j = 0; j <= n; j++) {
          curJ = j;
          const prefix = w.slice(0, j);
          const suffix = w.slice(j);
          // 情況一
          if (!isPal(w, j, n - 1)) {
            steps.push({
              line: 19,
              tag: "情況一：後綴非迴文",
              tagType: "tag-check",
              inlineBadge: `isPal(${qp(suffix)}) = false`,
              explanation: `j = ${j}：後綴 ${qp(suffix)} 不是迴文，w 後面接任何單字都無法以它為中心對稱，跳過情況一。`,
              vars: vars(),
              state: snap({ wordHl: i, jPtr: j, charWarn: range(j, n), charHl: range(0, j) })
            });
          } else {
            const hit = idx.has(prefix) ? idx.get(prefix) : -1;
            if (hit >= 0 && hit !== i) {
              res.push([i, hit]);
              steps.push({
                line: 21,
                tag: `找到 [${i},${hit}]`,
                tagType: "tag-found",
                inlineBadge: `find(${qp(prefix)}) → ${hit}`,
                explanation: `j = ${j}：後綴 ${qp(suffix)} 是迴文，且前綴 ${qp(prefix)} 的反轉正是 words[${hit}] = ${qp(words[hit])}。所以 ${qp(w)} + ${qp(words[hit])} = ${qp(w + words[hit])} 是迴文，加入 [${i}, ${hit}]。`,
                vars: vars(),
                state: snap({
                  wordHl: i,
                  wordMatch: [hit],
                  jPtr: j,
                  charHl: range(0, j),
                  charMatch: range(j, n),
                  rowHit: hit,
                  rowNote: "✓ 命中",
                  resHl: res.length - 1,
                  connectors: [{ from: `wb-dict-row-r${hit}`, to: `wb-chip-res-${res.length - 1}`, label: `[${i},${hit}]`, color: "green" }]
                })
              });
            } else {
              const why = hit === i ? `查到的是自己（words[${i}]），不能和自己配對` : "雜湊表中沒有這個字串";
              steps.push({
                line: 21,
                tag: "情況一：查無配對",
                tagType: "tag-check",
                inlineBadge: `find(${qp(prefix)}) → ${hit === i ? "自己" : "end"}`,
                explanation: `j = ${j}：後綴 ${qp(suffix)} 是迴文，於是查詢前綴 ${qp(prefix)}，但${why}。`,
                vars: vars(),
                state: snap({
                  wordHl: i,
                  jPtr: j,
                  charHl: range(0, j),
                  charMatch: range(j, n),
                  rowHit: hit === i ? i : null,
                  rowStatus: "hl",
                  rowNote: "自己",
                  slot: hit === i ? null : { key: q(prefix), val: "—", note: "查無" }
                })
              });
            }
          }
          // 情況二
          if (j === 0) continue;
          if (!isPal(w, 0, j - 1)) {
            steps.push({
              line: 24,
              tag: "情況二：前綴非迴文",
              tagType: "tag-check",
              inlineBadge: `isPal(${qp(prefix)}) = false`,
              explanation: `j = ${j}：前綴 ${qp(prefix)} 不是迴文，無法在 w 前面接單字形成迴文，跳過情況二。`,
              vars: vars(),
              state: snap({ wordHl: i, jPtr: j, charWarn: range(0, j), charHl: range(j, n) })
            });
          } else {
            const hit = idx.has(suffix) ? idx.get(suffix) : -1;
            if (hit >= 0 && hit !== i) {
              res.push([hit, i]);
              steps.push({
                line: 26,
                tag: `找到 [${hit},${i}]`,
                tagType: "tag-found",
                inlineBadge: `find(${qp(suffix)}) → ${hit}`,
                explanation: `j = ${j}：前綴 ${qp(prefix)} 是迴文，且後綴 ${qp(suffix)} 的反轉正是 words[${hit}] = ${qp(words[hit])}。所以 ${qp(words[hit])} + ${qp(w)} = ${qp(words[hit] + w)} 是迴文，加入 [${hit}, ${i}]。`,
                vars: vars(),
                state: snap({
                  wordHl: i,
                  wordMatch: [hit],
                  jPtr: j,
                  charMatch: range(0, j),
                  charHl: range(j, n),
                  rowHit: hit,
                  rowNote: "✓ 命中",
                  resHl: res.length - 1,
                  connectors: [{ from: `wb-dict-row-r${hit}`, to: `wb-chip-res-${res.length - 1}`, label: `[${hit},${i}]`, color: "green" }]
                })
              });
            } else {
              const why = hit === i ? `查到的是自己（words[${i}]），不能和自己配對` : "雜湊表中沒有這個字串";
              steps.push({
                line: 26,
                tag: "情況二：查無配對",
                tagType: "tag-check",
                inlineBadge: `find(${qp(suffix)}) → ${hit === i ? "自己" : "end"}`,
                explanation: `j = ${j}：前綴 ${qp(prefix)} 是迴文，於是查詢後綴 ${qp(suffix)}，但${why}。`,
                vars: vars(),
                state: snap({
                  wordHl: i,
                  jPtr: j,
                  charMatch: range(0, j),
                  charHl: range(j, n),
                  rowHit: hit === i ? i : null,
                  rowStatus: "hl",
                  rowNote: "自己",
                  slot: hit === i ? null : { key: q(suffix), val: "—", note: "查無" }
                })
              });
            }
          }
        }
      }

      curJ = "-";
      const out = `[${res.map((p) => `[${p[0]},${p[1]}]`).join(",")}]`;
      steps.push({
        line: 30,
        tag: `回傳 ${res.length} 組`,
        tagType: "tag-found",
        inlineBadge: `return ${out}`,
        explanation: res.length ? `所有切點檢查完畢，共找到 ${res.length} 組迴文對：${out}。` : "所有切點檢查完畢，沒有任何兩個單字能拼成迴文，回傳空陣列。",
        vars: vars({ return: out }),
        state: snap({ ret: ext8Esc(out), connectors: res.length ? [{ from: "wb-dyn-res", to: "wb-var-ret", label: `${res.length} 組`, color: "green" }] : [] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #165 Reverse Nodes in k-Group (LC #25, Hard, Linked List)
  // ============================================================================
  window.PROBLEMS["reverse-nodes-in-k-group"] = {
    id: 165,
    leetcodeId: 25,
    slug: "reverse-nodes-in-k-group",
    title: "25. Reverse Nodes in k-Group (K 個一組反轉鏈結串列)",
    difficulty: "Hard",
    topic: "Linked List / Pointer Manipulation",
    mins: 35,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head", "k"],
    description:
      "給定鏈結串列，每 k 個節點為一組進行反轉，最後不足 k 個的節點維持原順序，只能改變節點的 next 指標。使用虛擬頭節點 dummy 與 groupPrev（上一組的尾端）：先從 groupPrev 往前走 k 步找到本組第 k 個節點 kth，走不到就結束；記下下一組的開頭 groupNext，把 prev 設為 groupNext 後就地反轉本組（反轉後原本的第一個節點會直接接上 groupNext），最後讓 groupPrev->next 指向 kth，並把 groupPrev 移到本組新的尾端（原本的第一個節點）。每個節點被走訪常數次，時間 O(n)，額外空間 O(1)。",

    presets: [
      { name: "範例 1：head = [1,2,3,4,5], k = 2", args: [[1, 2, 3, 4, 5], 2] },
      { name: "範例 2：head = [1,2,3,4,5], k = 3（尾端 2 個不足一組）", args: [[1, 2, 3, 4, 5], 3] },
      { name: "範例 3：head = [1,2,3,4], k = 4（整串反轉）", args: [[1, 2, 3, 4], 4] },
      { name: "範例 4：head = [1,2,3], k = 1（不變）", args: [[1, 2, 3], 1] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${T("ListNode")}* ${F("reverseKGroup")}(${T("ListNode")}* head, ${K("int")} k) {`,
      `        ${T("ListNode")} dummy(${N("0")}, head);`,
      `        ${T("ListNode")}* groupPrev = &amp;dummy;`,
      `        ${K("while")} (${K("true")}) {`,
      `            ${T("ListNode")}* kth = groupPrev;`,
      `            ${K("for")} (${K("int")} i = ${N("0")}; i &lt; k &amp;&amp; kth; i++) kth = kth-&gt;next;`,
      `            ${K("if")} (!kth) ${K("break")};`,
      `            ${T("ListNode")}* groupNext = kth-&gt;next;`,
      `            ${T("ListNode")}* prev = groupNext;`,
      `            ${T("ListNode")}* curr = groupPrev-&gt;next;`,
      `            ${K("while")} (curr != groupNext) {`,
      `                ${T("ListNode")}* nxt = curr-&gt;next;`,
      `                curr-&gt;next = prev;`,
      `                prev = curr;`,
      `                curr = nxt;`,
      `            }`,
      `            ${T("ListNode")}* first = groupPrev-&gt;next;`,
      `            groupPrev-&gt;next = kth;`,
      `            groupPrev = first;`,
      `        }`,
      `        ${K("return")} dummy.next;`,
      `    }`,
      `};`
    ]),

    generateTrace(headInput, kInput) {
      const vals = ext8Clone(headInput || []).map(Number);
      const k = Number(kInput);
      const n = vals.length;
      const steps = [];
      // 節點 0 為 dummy，節點 1..n 為原串列；-1 代表 nullptr
      const next = [];
      for (let id = 0; id <= n; id++) next[id] = id < n ? id + 1 : -1;
      const label = (id) => (id === -1 ? "nullptr" : id === 0 ? "dummy" : `節點(${vals[id - 1]})`);
      const short = (id) => (id === -1 ? "null" : id === 0 ? "dummy" : String(vals[id - 1]));

      const P = { groupPrev: 0, kth: -1, groupNext: -1, prev: -1, curr: -1, nxt: -1, first: -1 };
      const shown = new Set();
      let order = [];
      let lifted = new Set();
      let loopI = "-";

      const chainOrder = () => {
        const out = [];
        let c = 0;
        const seen = new Set();
        while (c !== -1 && !seen.has(c)) {
          seen.add(c);
          out.push(c);
          c = next[c];
        }
        return out;
      };
      order = chainOrder();

      const spacing = 82;
      const snap = ({ hl = [], match = [], edgeHl = [], ret = "-", connectors = [] } = {}) => {
        const posOf = {};
        order.forEach((id, p) => {
          posOf[id] = { x: 44 + p * spacing, y: lifted.has(id) ? 52 : 150 };
        });
        const nodes = order.map((id) => {
          const ptrs = Object.keys(P).filter((key) => shown.has(key) && P[key] === id);
          return {
            id: `n${id}`,
            val: id === 0 ? "D" : String(vals[id - 1]),
            sub: `→ ${short(next[id])}`,
            x: posOf[id].x,
            y: posOf[id].y,
            status: match.includes(id) ? "match" : hl.includes(id) ? "hl" : "",
            ptr: ptrs.join("/")
          };
        });
        const edges = order
          .filter((id) => next[id] !== -1 && posOf[next[id]])
          .map((id) => ({
            from: `n${id}`,
            to: `n${next[id]}`,
            label: "",
            dir: true,
            status: edgeHl.includes(id) ? "hl" : ""
          }));
        return {
          boards: [
            {
              id: "list",
              type: "list",
              shape: "list",
              name: "dummy → head",
              typeLabel: lifted.size ? "鏈結串列（上排為正在反轉的這一組）" : "單向鏈結串列 (ListNode*)",
              x: 325,
              y: 52,
              width: Math.max(440, 44 + order.length * spacing),
              height: 215,
              nodes,
              edges
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "指標變數",
              x: 24,
              y: 215,
              items: [
                { id: "k", name: "k", val: String(k), status: "" },
                { id: "i", name: "i", val: String(loopI), status: "" },
                ...["groupPrev", "kth", "groupNext", "prev", "curr", "nxt", "first"]
                  .filter((key) => shown.has(key))
                  .map((key) => ({ id: key, name: key, val: label(P[key]), status: "" })),
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const vars = (extra = {}) => {
        const o = { k: String(k), i: String(loopI) };
        ["groupPrev", "kth", "groupNext", "prev", "curr", "nxt", "first"].forEach((key) => {
          if (shown.has(key)) o[key] = short(P[key]);
        });
        o.return = "-";
        return { ...o, ...extra };
      };

      steps.push({
        line: 4,
        tag: "建立 dummy",
        tagType: "default",
        inlineBadge: `dummy.next = ${n ? vals[0] : "nullptr"}`,
        explanation: "在 head 前面放一個虛擬頭節點 D（dummy），這樣第一組反轉後也能用同一套「上一組尾端接本組新頭」的寫法。",
        vars: vars(),
        state: snap({ hl: [0] })
      });
      shown.add("groupPrev");
      P.groupPrev = 0;
      steps.push({
        line: 5,
        tag: "groupPrev = &dummy",
        tagType: "default",
        inlineBadge: "groupPrev = dummy",
        explanation: "groupPrev 代表「上一組反轉完成後的尾端」，一開始就是 dummy。",
        vars: vars(),
        state: snap({ hl: [0] })
      });

      let group = 0;
      while (true) {
        group += 1;
        shown.add("kth");
        ["groupNext", "prev", "curr", "nxt", "first"].forEach((key) => shown.delete(key));
        P.kth = P.groupPrev;
        loopI = 0;
        steps.push({
          line: 7,
          tag: `第 ${group} 組：kth = groupPrev`,
          tagType: "default",
          inlineBadge: `kth = ${short(P.kth)}`,
          explanation: `準備處理第 ${group} 組。kth 先放在 groupPrev，接著往前走 k = ${k} 步，檢查剩下的節點是否還湊得滿一組。`,
          vars: vars(),
          state: snap({ hl: [P.kth] })
        });
        for (loopI = 0; loopI < k && P.kth !== -1; ) {
          const from = P.kth;
          P.kth = next[P.kth];
          loopI += 1;
          steps.push({
            line: 8,
            tag: `kth 前進第 ${loopI} 步`,
            tagType: "tag-check",
            inlineBadge: `kth = ${short(P.kth)}`,
            explanation: P.kth === -1
              ? `kth 從 ${label(from)} 前進後變成 nullptr，剩下的節點不足 ${k} 個。`
              : `kth 從 ${label(from)} 前進到 ${label(P.kth)}（已走 ${loopI} 步）。`,
            vars: vars(),
            state: P.kth === -1
              ? snap({ hl: [from] })
              : snap({ hl: [P.kth], edgeHl: [from], connectors: [{ from: `wb-node-list-n${from}`, to: `wb-node-list-n${P.kth}`, label: `第 ${loopI} 步`, color: "blue" }] })
          });
        }
        if (P.kth === -1) {
          steps.push({
            line: 9,
            tag: "不足 k 個，結束",
            tagType: "tag-check",
            inlineBadge: "kth == nullptr → break",
            explanation: `從 groupPrev 往後已經不足 ${k} 個節點，依題意這些節點維持原順序，離開迴圈。`,
            vars: vars(),
            state: snap({ hl: [P.groupPrev] })
          });
          break;
        }
        steps.push({
          line: 9,
          tag: "湊滿一組",
          tagType: "tag-check",
          inlineBadge: `kth = ${short(P.kth)} ≠ nullptr`,
          explanation: `kth 停在 ${label(P.kth)}，代表 groupPrev 後面至少還有 ${k} 個節點，這一組需要反轉。`,
          vars: vars(),
          state: snap({ hl: [P.kth] })
        });

        P.groupNext = next[P.kth];
        shown.add("groupNext");
        steps.push({
          line: 10,
          tag: "記住下一組開頭",
          tagType: "default",
          inlineBadge: `groupNext = ${short(P.groupNext)}`,
          explanation: `groupNext = kth->next = ${label(P.groupNext)}，它是下一組的開頭，也是本組反轉後尾端要接的位置。`,
          vars: vars(),
          state: snap({ hl: P.groupNext !== -1 ? [P.groupNext] : [] })
        });

        // 將本組節點抬到上排顯示
        lifted = new Set();
        let c = next[P.groupPrev];
        while (c !== P.groupNext) {
          lifted.add(c);
          c = next[c];
        }
        P.prev = P.groupNext;
        shown.add("prev");
        steps.push({
          line: 11,
          tag: "prev = groupNext",
          tagType: "default",
          inlineBadge: `prev = ${short(P.prev)}`,
          explanation: "反轉時 prev 不從 nullptr 開始，而是從 groupNext 開始；如此本組第一個節點反轉後會自動接上下一組。上排是本組要反轉的節點。",
          vars: vars(),
          state: snap({ hl: P.prev !== -1 ? [P.prev] : [] })
        });
        P.curr = next[P.groupPrev];
        shown.add("curr");
        steps.push({
          line: 12,
          tag: "curr = groupPrev->next",
          tagType: "default",
          inlineBadge: `curr = ${short(P.curr)}`,
          explanation: `curr 指向本組的第一個節點 ${label(P.curr)}，開始逐一反轉 next 指標。`,
          vars: vars(),
          state: snap({ hl: [P.curr] })
        });

        while (P.curr !== P.groupNext) {
          P.nxt = next[P.curr];
          shown.add("nxt");
          steps.push({
            line: 14,
            tag: "暫存 nxt",
            tagType: "default",
            inlineBadge: `nxt = ${short(P.nxt)}`,
            explanation: `先把 curr->next（${label(P.nxt)}）存到 nxt，否則改掉 curr->next 之後就找不到後面的節點。`,
            vars: vars(),
            state: snap({ hl: [P.curr], edgeHl: [P.curr] })
          });
          next[P.curr] = P.prev;
          steps.push({
            line: 15,
            tag: `${short(P.curr)}->next = ${short(P.prev)}`,
            tagType: "tag-insert",
            inlineBadge: `curr->next = ${short(P.prev)}`,
            explanation: `把 ${label(P.curr)} 的 next 改成指向 prev（${label(P.prev)}），這條指標反轉方向。`,
            vars: vars(),
            state: snap({
              hl: [P.curr],
              edgeHl: [P.curr],
              connectors: P.prev !== -1 ? [{ from: `wb-node-list-n${P.curr}`, to: `wb-node-list-n${P.prev}`, label: "next 改向", color: "purple" }] : []
            })
          });
          P.prev = P.curr;
          steps.push({
            line: 16,
            tag: "prev 前進",
            tagType: "default",
            inlineBadge: `prev = ${short(P.prev)}`,
            explanation: `prev 移到 ${label(P.prev)}，它是目前已反轉部分的新開頭。`,
            vars: vars(),
            state: snap({ hl: [P.prev] })
          });
          P.curr = P.nxt;
          steps.push({
            line: 17,
            tag: "curr 前進",
            tagType: "default",
            inlineBadge: `curr = ${short(P.curr)}`,
            explanation: P.curr === P.groupNext
              ? `curr 走到 groupNext（${label(P.curr)}），本組 ${k} 個節點的指標都已反轉。`
              : `curr 移到 ${label(P.curr)}，繼續反轉下一個節點。`,
            vars: vars(),
            state: snap({ hl: P.curr !== -1 ? [P.curr] : [] })
          });
        }

        P.first = next[P.groupPrev];
        shown.add("first");
        steps.push({
          line: 19,
          tag: "first = groupPrev->next",
          tagType: "default",
          inlineBadge: `first = ${short(P.first)}`,
          explanation: `groupPrev 仍指向本組原本的第一個節點 ${label(P.first)}，反轉後它變成本組的尾端，先記為 first。`,
          vars: vars(),
          state: snap({ hl: [P.first] })
        });
        next[P.groupPrev] = P.kth;
        lifted = new Set();
        order = chainOrder();
        const groupIds = [];
        let g = P.kth;
        for (let t = 0; t < k; t++) {
          groupIds.push(g);
          g = next[g];
        }
        steps.push({
          line: 20,
          tag: `${short(P.groupPrev)}->next = ${short(P.kth)}`,
          tagType: "tag-insert",
          inlineBadge: `groupPrev->next = kth (${short(P.kth)})`,
          explanation: `讓上一組的尾端 ${label(P.groupPrev)} 改接本組新的開頭 kth = ${label(P.kth)}。整條串列重新連通，本組已反轉為 ${groupIds.map(short).join(" → ")}。`,
          vars: vars(),
          state: snap({
            match: groupIds,
            edgeHl: [P.groupPrev],
            connectors: [{ from: `wb-node-list-n${P.groupPrev}`, to: `wb-node-list-n${P.kth}`, label: "接上新開頭", color: "green" }]
          })
        });
        P.groupPrev = P.first;
        steps.push({
          line: 21,
          tag: "groupPrev = first",
          tagType: "default",
          inlineBadge: `groupPrev = ${short(P.groupPrev)}`,
          explanation: `groupPrev 移到本組的新尾端 ${label(P.groupPrev)}，作為下一組的「上一組尾端」。`,
          vars: vars(),
          state: snap({ hl: [P.groupPrev] })
        });
      }

      const result = chainOrder().slice(1).map((id) => vals[id - 1]);
      const retStr = `[${result.join(",")}]`;
      steps.push({
        line: 23,
        tag: "回傳 dummy.next",
        tagType: "tag-found",
        inlineBadge: `return ${retStr}`,
        explanation: `所有完整的組都已反轉，回傳 dummy.next，串列為 ${retStr}。`,
        vars: vars({ return: retStr }),
        state: snap({
          match: chainOrder().slice(1),
          ret: retStr,
          connectors: n ? [{ from: `wb-node-list-n${next[0]}`, to: "wb-var-ret", label: "dummy.next", color: "green" }] : []
        })
      });
      return steps;
    }
  };

  // ============================================================================
  // #166 Sudoku Solver (LC #37, Hard, Backtracking)
  // ============================================================================
  const ext8Board = (...rows) => rows.map((r) => r.split(""));

  window.PROBLEMS["sudoku-solver"] = {
    id: 166,
    leetcodeId: 37,
    slug: "sudoku-solver",
    title: "37. Sudoku Solver (解數獨)",
    difficulty: "Hard",
    topic: "Matrix / Backtracking",
    mins: 40,
    complexity: "Time O(9^m)（m 為空格數）· Space O(m)",
    argNames: ["board"],
    description:
      "給定 9 × 9 的數獨盤面（'.' 代表空格），就地填滿所有空格，使每一列、每一行與每個 3 × 3 宮格都恰好包含 1～9 各一次，題目保證唯一解。先掃描盤面，用三個布林表 row[r][d]、col[c][d]、box[b][d] 記錄每列、每行、每宮已使用的數字，並把空格座標收集到 empties。接著回溯 dfs(k)：替第 k 個空格依序嘗試 1～9，與三個表衝突就 continue；可行就填入並標記，遞迴處理下一格，失敗則撤銷標記與填寫（回溯）。所有空格都填好時回傳 true。最壞情況指數時間，空間為遞迴深度 O(m)。為了能逐步瀏覽，預設盤面只保留少量空格，但仍包含需要回溯的情況。",

    presets: [
      {
        name: "範例 1：13 個空格（每格第一個可行數字就正確，無需回溯）",
        args: [ext8Board(
          ".34678912",
          "67..9.348",
          ".983..567",
          "859761.23",
          "42685379.",
          "713924856",
          "961537284",
          "2.7419635",
          "..5.86179"
        )]
      },
      {
        name: "範例 2：12 個空格（出現 1 次回溯）",
        args: [ext8Board(
          "534678912",
          "672195.48",
          "198.42567",
          "..976.423",
          "426853791",
          "7.3.248.6",
          ".615372..",
          "287.19635",
          "345286179"
        )]
      },
      {
        name: "範例 3：17 個空格（多次回溯）",
        args: [ext8Board(
          "53.6.8912",
          "672195348",
          "198342.67",
          "8.9.61423",
          ".2685.791",
          ".1.92485.",
          "96..372..",
          "287.19635",
          ".45.86179"
        )]
      }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `    ${K("bool")} row[${N("9")}][${N("9")}], col[${N("9")}][${N("9")}], box[${N("9")}][${N("9")}];`,
      `    ${T("vector")}&lt;${T("pair")}&lt;${K("int")}, ${K("int")}&gt;&gt; empties;`,
      `    ${K("bool")} ${F("dfs")}(${T("vector")}&lt;${T("vector")}&lt;${K("char")}&gt;&gt;&amp; board, ${K("int")} k) {`,
      `        ${K("if")} (k == (${K("int")})empties.${F("size")}()) ${K("return")} ${K("true")};`,
      `        ${K("auto")} [r, c] = empties[k];`,
      `        ${K("int")} b = r / ${N("3")} * ${N("3")} + c / ${N("3")};`,
      `        ${K("for")} (${K("int")} d = ${N("0")}; d &lt; ${N("9")}; d++) {`,
      `            ${K("if")} (row[r][d] || col[c][d] || box[b][d]) ${K("continue")};`,
      `            row[r][d] = col[c][d] = box[b][d] = ${K("true")};`,
      `            board[r][c] = ${N("'1'")} + d;`,
      `            ${K("if")} (${F("dfs")}(board, k + ${N("1")})) ${K("return")} ${K("true")};`,
      `            row[r][d] = col[c][d] = box[b][d] = ${K("false")};`,
      `            board[r][c] = ${N("'.'")};`,
      `        }`,
      `        ${K("return")} ${K("false")};`,
      `    }`,
      `${K("public")}:`,
      `    ${K("void")} ${F("solveSudoku")}(${T("vector")}&lt;${T("vector")}&lt;${K("char")}&gt;&gt;&amp; board) {`,
      `        ${F("memset")}(row, ${N("0")}, ${K("sizeof")} row); ${F("memset")}(col, ${N("0")}, ${K("sizeof")} col); ${F("memset")}(box, ${N("0")}, ${K("sizeof")} box);`,
      `        ${K("for")} (${K("int")} r = ${N("0")}; r &lt; ${N("9")}; r++)`,
      `            ${K("for")} (${K("int")} c = ${N("0")}; c &lt; ${N("9")}; c++) {`,
      `                ${K("if")} (board[r][c] == ${N("'.'")}) { empties.${F("push_back")}({r, c}); ${K("continue")}; }`,
      `                ${K("int")} d = board[r][c] - ${N("'1'")};`,
      `                row[r][d] = col[c][d] = box[r / ${N("3")} * ${N("3")} + c / ${N("3")}][d] = ${K("true")};`,
      `            }`,
      `        ${F("dfs")}(board, ${N("0")});`,
      `    }`,
      `};`
    ]),

    generateTrace(boardInput) {
      const board = ext8Clone(boardInput || []).map((row) => row.map(String));
      const steps = [];
      const row = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const col = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const box = Array.from({ length: 9 }, () => new Array(9).fill(false));
      const empties = [];
      const givens = new Set();
      const frames = [];
      let cur = null;

      const snap = ({ hl = [], warn = [], match = [], cand = null, frameHl = -1, ret = "-", connectors = [] } = {}) => {
        const filled = [];
        empties.forEach(([r, c]) => {
          if (board[r][c] !== "." && !match.includes(`${r},${c}`) && !hl.includes(`${r},${c}`)) filled.push(`${r},${c}`);
        });
        const boards = [
          {
            id: "board",
            type: "grid",
            name: "board",
            typeLabel: "數獨盤面 (vector<vector<char>>)",
            x: 325,
            y: 52,
            cells: board.map((rw) => rw.map((ch) => (ch === "." ? "·" : ch))),
            hl,
            warn,
            match: match.concat(filled)
          },
          {
            id: "cand",
            type: "array",
            name: "候選數字 d + 1",
            typeLabel: cur ? `空格 (${cur.r},${cur.c})，宮格 b = ${cur.b}` : "row / col / box 已使用標記",
            x: 325,
            y: 420,
            values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            hl: cand && cand.hl !== undefined ? [cand.hl] : [],
            warn: cand ? cand.warn || [] : [],
            match: cand && cand.match !== undefined ? [cand.match] : [],
            done: cand ? cand.done || [] : []
          },
          {
            id: "calls",
            type: "stack",
            name: "遞迴呼叫堆疊",
            typeLabel: "dfs(board, k)",
            x: 700,
            y: 52,
            items: frames.map((f, idx) => ({
              val: `k=${f.k} (${f.r},${f.c})${f.d ? ` = ${f.d}` : ""}`,
              status: idx === frameHl ? "hl" : ""
            }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "回溯狀態",
            x: 24,
            y: 215,
            items: [
              { id: "k", name: "k", val: cur ? String(cur.k) : "-", status: "" },
              { id: "m", name: "empties.size()", val: String(empties.length), status: "" },
              { id: "rc", name: "(r, c)", val: cur ? `(${cur.r}, ${cur.c})` : "-", status: cur ? "hl" : "" },
              { id: "b", name: "b", val: cur ? String(cur.b) : "-", status: "" },
              { id: "d", name: "d + 1", val: cur && cur.d !== undefined ? String(cur.d + 1) : "-", status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ];
        return { boards, connectors };
      };
      const vars = (extra = {}) => ({
        k: cur ? String(cur.k) : "-",
        r: cur ? String(cur.r) : "-",
        c: cur ? String(cur.c) : "-",
        b: cur ? String(cur.b) : "-",
        "d+1": cur && cur.d !== undefined ? String(cur.d + 1) : "-",
        "空格數": String(empties.length),
        return: "-",
        ...extra
      });
      // 找出造成衝突的已填格子（列 → 行 → 宮）
      const conflictCell = (r, c, b, d) => {
        const ch = String(d + 1);
        for (let cc = 0; cc < 9; cc++) if (cc !== c && board[r][cc] === ch) return [r, cc, "同列"];
        for (let rr = 0; rr < 9; rr++) if (rr !== r && board[rr][c] === ch) return [rr, c, "同行"];
        const br = Math.floor(b / 3) * 3;
        const bc = (b % 3) * 3;
        for (let rr = br; rr < br + 3; rr++) for (let cc = bc; cc < bc + 3; cc++) if (board[rr][cc] === ch) return [rr, cc, "同宮"];
        return null;
      };

      steps.push({
        line: 20,
        tag: "清空標記表",
        tagType: "default",
        inlineBadge: "row = col = box = false",
        explanation: "把 row、col、box 三個 9 × 9 布林表全部清成 false，row[r][d] 表示第 r 列是否已經用過數字 d + 1，col 與 box 同理。",
        vars: vars(),
        state: snap()
      });

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === ".") {
            empties.push([r, c]);
            continue;
          }
          const d = Number(board[r][c]) - 1;
          givens.add(`${r},${c}`);
          row[r][d] = col[c][d] = box[Math.floor(r / 3) * 3 + Math.floor(c / 3)][d] = true;
        }
      }
      steps.push({
        line: 23,
        tag: `收集 ${empties.length} 個空格`,
        tagType: "tag-insert",
        inlineBadge: `empties.size() = ${empties.length}`,
        explanation: `掃描 81 格：已填數字的格子在 row、col、box 中標記為已使用；空格依列優先順序放入 empties：${empties.map(([r, c]) => `(${r},${c})`).join(" ")}。`,
        vars: vars(),
        state: snap({ hl: empties.map(([r, c]) => `${r},${c}`) })
      });

      const dfs = (k) => {
        if (k === empties.length) {
          cur = null;
          steps.push({
            line: 5,
            tag: "全部填完",
            tagType: "tag-found",
            inlineBadge: `k == ${empties.length} → return true`,
            explanation: "所有空格都已經填入且沒有任何衝突，找到解答，回傳 true，並沿著遞迴一路傳回 true。",
            vars: vars({ k: String(k) }),
            state: snap({ match: empties.map(([r, c]) => `${r},${c}`) })
          });
          return true;
        }
        const [r, c] = empties[k];
        const b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        frames.push({ k, r, c, d: "" });
        cur = { k, r, c, b };
        steps.push({
          line: 7,
          tag: `dfs(${k})：空格 (${r},${c})`,
          tagType: "default",
          inlineBadge: `r = ${r}, c = ${c}, b = ${b}`,
          explanation: `處理第 ${k} 個空格 (${r}, ${c})，它位於第 ${b} 個 3 × 3 宮格。接著從 1 到 9 依序嘗試。`,
          vars: vars(),
          state: snap({ hl: [`${r},${c}`], frameHl: frames.length - 1 })
        });

        const tried = [];
        let pending = [];
        const flushConflicts = () => {
          if (!pending.length) return;
          const conns = [];
          const warnCells = [];
          pending.slice(0, 3).forEach((d) => {
            const src = conflictCell(r, c, b, d);
            if (src) {
              warnCells.push(`${src[0]},${src[1]}`);
              conns.push({ from: `wb-grid-board-${src[0]}-${src[1]}`, to: `wb-grid-board-${r}-${c}`, label: `${d + 1} ${src[2]}`, color: "red" });
            }
          });
          cur = { k, r, c, b, d: pending[pending.length - 1] };
          steps.push({
            line: 9,
            tag: `${pending.map((d) => d + 1).join(",")} 衝突`,
            tagType: "tag-check",
            inlineBadge: `${pending.map((d) => d + 1).join(", ")} 已被使用 → continue`,
            explanation: `數字 ${pending.map((d) => d + 1).join("、")} 已出現在第 ${r} 列、第 ${c} 行或第 ${b} 宮，row / col / box 標記為 true，直接 continue 跳過。`,
            vars: vars(),
            state: snap({
              hl: [`${r},${c}`],
              warn: warnCells,
              cand: { warn: pending.slice(), done: tried.slice() },
              frameHl: frames.length - 1,
              connectors: conns
            })
          });
          tried.push(...pending);
          pending = [];
        };

        for (let d = 0; d < 9; d++) {
          if (row[r][d] || col[c][d] || box[b][d]) {
            pending.push(d);
            continue;
          }
          flushConflicts();
          row[r][d] = col[c][d] = box[b][d] = true;
          board[r][c] = String(d + 1);
          frames[frames.length - 1].d = String(d + 1);
          cur = { k, r, c, b, d };
          steps.push({
            line: 11,
            tag: `填入 ${d + 1}`,
            tagType: "tag-insert",
            inlineBadge: `board[${r}][${c}] = '${d + 1}'`,
            explanation: `${d + 1} 在第 ${r} 列、第 ${c} 行、第 ${b} 宮都還沒出現，標記 row / col / box 後暫時填入 (${r}, ${c})，再遞迴處理下一個空格。`,
            vars: vars(),
            state: snap({
              hl: [`${r},${c}`],
              cand: { hl: d, done: tried.slice() },
              frameHl: frames.length - 1,
              connectors: [{ from: `wb-cw-cand-${d}`, to: `wb-grid-board-${r}-${c}`, label: `填 ${d + 1}`, color: "purple" }]
            })
          });
          if (dfs(k + 1)) return true;
          cur = { k, r, c, b, d };
          row[r][d] = col[c][d] = box[b][d] = false;
          board[r][c] = ".";
          frames[frames.length - 1].d = "";
          tried.push(d);
          steps.push({
            line: 14,
            tag: `回溯：撤銷 ${d + 1}`,
            tagType: "tag-check",
            inlineBadge: `board[${r}][${c}] = '.'`,
            explanation: `把 ${d + 1} 填在 (${r}, ${c}) 之後，後面的空格無解，所以撤銷 row / col / box 標記並把格子還原成 '.'，改試下一個數字。`,
            vars: vars(),
            state: snap({ hl: [`${r},${c}`], cand: { warn: [d], done: tried.slice(0, -1) }, frameHl: frames.length - 1 })
          });
        }
        flushConflicts();
        cur = { k, r, c, b };
        steps.push({
          line: 16,
          tag: `(${r},${c}) 無數字可填`,
          tagType: "tag-check",
          inlineBadge: "return false",
          explanation: `1～9 在 (${r}, ${c}) 全部失敗，代表前面某個空格填錯了，回傳 false 讓上一層撤銷並改試其他數字。`,
          vars: vars({ return: "false" }),
          state: snap({ warn: [`${r},${c}`], cand: { done: tried.slice() }, frameHl: frames.length - 1 })
        });
        frames.pop();
        return false;
      };

      dfs(0);
      cur = null;
      frames.length = 0;
      steps.push({
        line: 27,
        tag: "數獨完成",
        tagType: "tag-found",
        inlineBadge: "dfs(board, 0) = true",
        explanation: "dfs 回傳 true，board 已就地填成唯一解；solveSudoku 回傳型別為 void，答案就是被修改後的 board。",
        vars: vars({ return: "board 已填滿" }),
        state: snap({ ret: "board 已填滿", match: empties.map(([r, c]) => `${r},${c}`), connectors: [{ from: "wb-dyn-board", to: "wb-var-ret", label: "就地填好", color: "green" }] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #167 First Missing Positive (LC #41, Hard, Cyclic Sort)
  // ============================================================================
  window.PROBLEMS["first-missing-positive"] = {
    id: 167,
    leetcodeId: 41,
    slug: "first-missing-positive",
    title: "41. First Missing Positive (缺失的第一個正整數)",
    difficulty: "Hard",
    topic: "Array / Hash Table / Cyclic Sort",
    mins: 35,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "給定未排序的整數陣列 nums，找出沒有出現的最小正整數，要求 O(n) 時間與 O(1) 額外空間。長度為 n 的陣列答案必在 1～n + 1 之間，因此把陣列本身當成雜湊表：值 v 若在 1～n 範圍內，就應該放在索引 v - 1。第一輪對每個位置不斷把 nums[i] 交換到它的正確位置，直到目前的值超出範圍或目標位置已經是同一個值（避免重複值造成無窮迴圈）；每次交換都讓一個值歸位，所以總交換次數不超過 n。第二輪找第一個 nums[i] != i + 1 的位置，答案即 i + 1；若全部歸位則答案為 n + 1。",

    presets: [
      { name: "範例 1：nums = [1,2,0]", args: [[1, 2, 0]] },
      { name: "範例 2：nums = [3,4,-1,1]", args: [[3, 4, -1, 1]] },
      { name: "範例 3：nums = [7,8,9,11,12]（全部超出範圍）", args: [[7, 8, 9, 11, 12]] },
      { name: "範例 4：nums = [2,1,1,5,3]（含重複值）", args: [[2, 1, 1, 5, 3]] },
      { name: "範例 5：nums = [4,3,2,1]（全部歸位 → n + 1）", args: [[4, 3, 2, 1]] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${K("int")} ${F("firstMissingPositive")}(${T("vector")}&lt;${K("int")}&gt;&amp; nums) {`,
      `        ${K("int")} n = nums.${F("size")}();`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; n; i++) {`,
      `            ${K("while")} (nums[i] &gt; ${N("0")} &amp;&amp; nums[i] &lt;= n &amp;&amp; nums[nums[i] - ${N("1")}] != nums[i]) {`,
      `                ${F("swap")}(nums[i], nums[nums[i] - ${N("1")}]);`,
      `            }`,
      `        }`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; n; i++) {`,
      `            ${K("if")} (nums[i] != i + ${N("1")}) ${K("return")} i + ${N("1")};`,
      `        }`,
      `        ${K("return")} n + ${N("1")};`,
      `    }`,
      `};`
    ]),

    generateTrace(numsInput) {
      const nums = ext8Clone(numsInput || []).map(Number);
      const n = nums.length;
      const steps = [];
      const placed = () => nums.map((v, i) => (v === i + 1 ? i : -1)).filter((i) => i >= 0);
      let curI = "-";
      let phase = 1;

      const snap = ({ hl = [], warn = [], match = null, ptrs = [], ret = "-", connectors = [] } = {}) => ({
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: phase === 1 ? "就地雜湊：值 v 應放在索引 v - 1" : "第二輪：檢查 nums[i] == i + 1",
            x: 325,
            y: 52,
            values: [...nums],
            indexLabels: nums.map((_, i) => `${i}（應為 ${i + 1}）`),
            hl,
            warn,
            match: match || placed().filter((i) => !hl.includes(i) && !warn.includes(i)),
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: phase === 1 ? "第一輪：歸位" : "第二輪：找缺口",
            x: 24,
            y: 215,
            items: [
              { id: "n", name: "n", val: String(n), status: "" },
              { id: "i", name: "i", val: String(curI), status: curI !== "-" ? "hl" : "" },
              { id: "v", name: "nums[i]", val: curI !== "-" && curI < n ? String(nums[curI]) : "-", status: "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      });
      const vars = (extra = {}) => ({
        n: String(n),
        i: String(curI),
        "nums[i]": curI !== "-" && curI < n ? String(nums[curI]) : "-",
        nums: `[${nums.join(",")}]`,
        return: "-",
        ...extra
      });

      steps.push({
        line: 4,
        tag: `n = ${n}`,
        tagType: "default",
        inlineBadge: `n = ${n}`,
        explanation: `陣列長度 n = ${n}，答案一定落在 1～${n + 1} 之間。目標是讓每個 1～${n} 的值 v 都放到索引 v - 1（綠色代表已歸位）。`,
        vars: vars(),
        state: snap()
      });

      for (let i = 0; i < n; i++) {
        curI = i;
        while (true) {
          const v = nums[i];
          const inRange = v > 0 && v <= n;
          const already = inRange && nums[v - 1] === v;
          if (!inRange || already) {
            const why = !inRange
              ? `nums[${i}] = ${v} 不在 1～${n} 範圍內，它不影響答案，留在原地`
              : v - 1 === i
              ? `nums[${i}] = ${v} 已經在正確位置`
              : `目標位置 nums[${v - 1}] 已經是 ${v}（重複值），不需要再交換`;
            steps.push({
              line: 6,
              tag: "停止交換",
              tagType: "tag-check",
              inlineBadge: !inRange ? `${v} ∉ [1, ${n}]` : `nums[${v - 1}] == ${v}`,
              explanation: `${why}，換下一個位置。`,
              vars: vars(),
              state: snap({
                hl: [i],
                warn: !inRange ? [i] : [],
                ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }, ...(inRange && v - 1 !== i ? [{ idx: v - 1, label: `${v} 的家`, color: "green" }] : [])]
              })
            });
            break;
          }
          const j = v - 1;
          steps.push({
            line: 6,
            tag: `${v} 應放在索引 ${j}`,
            tagType: "tag-check",
            inlineBadge: `nums[${j}] = ${nums[j]} != ${v}`,
            explanation: `nums[${i}] = ${v} 在範圍內，它的正確位置是索引 ${j}，但那裡目前是 ${nums[j]}，需要交換。`,
            vars: vars(),
            state: snap({
              hl: [i, j],
              ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }, { idx: j, label: `${v} 的家`, color: "purple" }],
              connectors: [{ from: `wb-cw-nums-${i}`, to: `wb-cw-nums-${j}`, label: `${v} → 索引 ${j}`, color: "blue" }]
            })
          });
          const tmp = nums[j];
          nums[j] = nums[i];
          nums[i] = tmp;
          steps.push({
            line: 7,
            tag: `swap(nums[${i}], nums[${j}])`,
            tagType: "tag-insert",
            inlineBadge: `nums[${j}] = ${v}, nums[${i}] = ${tmp}`,
            explanation: `交換後 ${v} 歸位到索引 ${j}；換過來的 ${tmp} 留在索引 ${i}，繼續檢查它是否也要搬走。`,
            vars: vars(),
            state: snap({
              hl: [i],
              ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }],
              connectors: [{ from: `wb-cw-nums-${j}`, to: `wb-cw-nums-${i}`, label: `換回 ${tmp}`, color: "purple" }]
            })
          });
        }
      }

      phase = 2;
      for (let i = 0; i < n; i++) {
        curI = i;
        if (nums[i] !== i + 1) {
          steps.push({
            line: 11,
            tag: `回傳 ${i + 1}`,
            tagType: "tag-found",
            inlineBadge: `nums[${i}] = ${nums[i]} != ${i + 1} → return ${i + 1}`,
            explanation: `索引 ${i} 應該放 ${i + 1}，卻是 ${nums[i]}，代表 ${i + 1} 不在陣列中；前面 1～${i} 都已出現，所以 ${i + 1} 就是缺失的最小正整數。`,
            vars: vars({ return: String(i + 1) }),
            state: snap({
              warn: [i],
              match: placed().filter((t) => t < i),
              ptrs: [{ idx: i, label: `缺 ${i + 1}`, color: "red" }],
              ret: i + 1,
              connectors: [{ from: `wb-cw-nums-${i}`, to: "wb-var-ret", label: `缺 ${i + 1}`, color: "green" }]
            })
          });
          return steps;
        }
        steps.push({
          line: 11,
          tag: `${i + 1} 存在`,
          tagType: "tag-check",
          inlineBadge: `nums[${i}] == ${i + 1}`,
          explanation: `索引 ${i} 正好是 ${i + 1}，這個正整數存在，繼續往後找。`,
          vars: vars(),
          state: snap({ hl: [i], match: placed().filter((t) => t < i), ptrs: [{ idx: i, label: `i = ${i}`, color: "blue" }] })
        });
      }
      curI = "-";
      steps.push({
        line: 13,
        tag: `回傳 ${n + 1}`,
        tagType: "tag-found",
        inlineBadge: `return n + 1 = ${n + 1}`,
        explanation: `1～${n} 全部都在正確位置，缺失的最小正整數是 n + 1 = ${n + 1}。`,
        vars: vars({ return: String(n + 1) }),
        state: snap({ ret: n + 1, connectors: [{ from: "wb-var-n", to: "wb-var-ret", label: "n + 1", color: "green" }] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #168 N-Queens (LC #51, Hard, Backtracking)
  // ============================================================================
  window.PROBLEMS["n-queens"] = {
    id: 168,
    leetcodeId: 51,
    slug: "n-queens",
    title: "51. N-Queens (N 皇后)",
    difficulty: "Hard",
    topic: "Recursion / Backtracking",
    mins: 40,
    complexity: "Time O(n!) · Space O(n)",
    argNames: ["n"],
    description:
      "在 n × n 棋盤上放 n 個皇后，使任兩個皇后都不在同一列、同一行或同一條對角線上，回傳所有不同的擺法（以 'Q' 與 '.' 組成的字串表示每一列）。逐列放置皇后，每列恰好一個；用三個布林陣列記錄被占用的行 cols[c]、主對角線 d1[r + c] 與副對角線 d2[r - c + n - 1]，讓衝突檢查為 O(1)。dfs(r) 在第 r 列依序嘗試每一行：衝突就跳過，否則放下皇后並標記，遞迴到下一列，返回後撤銷（回溯）。r == n 代表 n 個皇后都放好，把棋盤加入答案。時間約 O(n!)，額外空間 O(n)（不含輸出）。",

    presets: [
      { name: "範例 1：n = 4（兩組解）", args: [4] },
      { name: "範例 2：n = 1", args: [1] },
      { name: "範例 3：n = 3（無解）", args: [3] },
      { name: "範例 4：n = 5（十組解）", args: [5] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `    ${T("vector")}&lt;${T("vector")}&lt;${T("string")}&gt;&gt; res;`,
      `    ${T("vector")}&lt;${T("string")}&gt; board;`,
      `    ${T("vector")}&lt;${K("bool")}&gt; cols, d1, d2;`,
      `    ${K("void")} ${F("dfs")}(${K("int")} r, ${K("int")} n) {`,
      `        ${K("if")} (r == n) { res.${F("push_back")}(board); ${K("return")}; }`,
      `        ${K("for")} (${K("int")} c = ${N("0")}; c &lt; n; c++) {`,
      `            ${K("if")} (cols[c] || d1[r + c] || d2[r - c + n - ${N("1")}]) ${K("continue")};`,
      `            cols[c] = d1[r + c] = d2[r - c + n - ${N("1")}] = ${K("true")};`,
      `            board[r][c] = ${N("'Q'")};`,
      `            ${F("dfs")}(r + ${N("1")}, n);`,
      `            board[r][c] = ${N("'.'")};`,
      `            cols[c] = d1[r + c] = d2[r - c + n - ${N("1")}] = ${K("false")};`,
      `        }`,
      `    }`,
      `${K("public")}:`,
      `    ${T("vector")}&lt;${T("vector")}&lt;${T("string")}&gt;&gt; ${F("solveNQueens")}(${K("int")} n) {`,
      `        board.${F("assign")}(n, ${T("string")}(n, ${N("'.'")}));`,
      `        cols.${F("assign")}(n, ${K("false")}); d1.${F("assign")}(${N("2")} * n - ${N("1")}, ${K("false")}); d2.${F("assign")}(${N("2")} * n - ${N("1")}, ${K("false")});`,
      `        ${F("dfs")}(${N("0")}, n);`,
      `        ${K("return")} res;`,
      `    }`,
      `};`
    ]),

    generateTrace(nInput) {
      const n = Number(nInput);
      const steps = [];
      const board = Array.from({ length: n }, () => new Array(n).fill("."));
      const cols = new Array(n).fill(false);
      const d1 = new Array(Math.max(0, 2 * n - 1)).fill(false);
      const d2 = new Array(Math.max(0, 2 * n - 1)).fill(false);
      const res = [];
      const queenCol = new Array(n).fill(-1);
      const frames = [];
      let cur = { r: "-", c: "-" };

      const snap = ({ hl = [], warn = [], match = [], frameHl = -1, resHl = -1, ret = "-", connectors = [] } = {}) => {
        const queens = [];
        for (let r = 0; r < n; r++) if (queenCol[r] >= 0) queens.push(`${r},${queenCol[r]}`);
        return {
          boards: [
            {
              id: "board",
              type: "grid",
              name: "board",
              typeLabel: `${n} × ${n} 棋盤 (vector<string>)`,
              x: 325,
              y: 52,
              cells: board.map((rw) => rw.map((ch) => (ch === "Q" ? "♛" : "·"))),
              hl,
              warn,
              match: match.length ? match : queens.filter((q) => !hl.includes(q) && !warn.includes(q))
            },
            {
              id: "calls",
              type: "stack",
              name: "遞迴呼叫堆疊",
              typeLabel: "dfs(r, n)",
              x: 325 + n * 44 + 70,
              y: 52,
              items: frames.map((f, idx) => ({ val: `dfs(r=${f.r})${f.c >= 0 ? ` 皇后在 c=${f.c}` : ""}`, status: idx === frameHl ? "hl" : "" }))
            },
            {
              id: "res",
              type: "set",
              name: "res",
              typeLabel: "已找到的解（每列皇后所在行）",
              x: 325,
              y: 52 + n * 34 + 70,
              items: res.map((cs, idx) => ({ val: `解 ${idx + 1}: [${cs.join(",")}]`, status: idx === resHl ? "inserted" : "" }))
            },
            {
              id: "vars",
              type: "vars",
              name: "state_vars",
              typeLabel: "回溯狀態",
              x: 24,
              y: 215,
              items: [
                { id: "n", name: "n", val: String(n), status: "" },
                { id: "r", name: "r", val: String(cur.r), status: cur.r !== "-" ? "hl" : "" },
                { id: "c", name: "c", val: String(cur.c), status: "" },
                { id: "cnt", name: "res.size()", val: String(res.length), status: "" },
                { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
              ]
            }
          ],
          connectors
        };
      };
      const vars = (extra = {}) => ({
        n: String(n),
        r: String(cur.r),
        c: String(cur.c),
        cols: `[${cols.map((b) => (b ? 1 : 0)).join("")}]`,
        "res.size()": String(res.length),
        return: "-",
        ...extra
      });
      const attacker = (r, c) => {
        for (let rr = 0; rr < r; rr++) {
          const cc = queenCol[rr];
          if (cc < 0) continue;
          if (cc === c) return [rr, cc, "同一行"];
          if (rr + cc === r + c) return [rr, cc, "副斜線 ↙"];
          if (rr - cc === r - c) return [rr, cc, "主斜線 ↘"];
        }
        return null;
      };

      steps.push({
        line: 19,
        tag: "初始化棋盤與標記",
        tagType: "default",
        inlineBadge: `board = ${n}×${n} '.', d1/d2 長度 ${Math.max(0, 2 * n - 1)}`,
        explanation: `建立全為 '.' 的 ${n} × ${n} 棋盤。cols[c] 記錄第 c 行是否有皇后；同一條「↙」斜線上 r + c 相同，用 d1 記錄；同一條「↘」斜線上 r - c 相同，加上 n - 1 平移成非負索引後用 d2 記錄。`,
        vars: vars(),
        state: snap()
      });

      const dfs = (r) => {
        frames.push({ r, c: -1 });
        if (r === n) {
          const sol = queenCol.slice();
          res.push(sol);
          cur = { r, c: "-" };
          steps.push({
            line: 6,
            tag: `找到第 ${res.length} 組解`,
            tagType: "tag-found",
            inlineBadge: `r == ${n} → res.push_back(board)`,
            explanation: `${n} 列都成功放好皇后，彼此互不攻擊。把目前的棋盤（每列皇后在第 ${sol.join("、")} 行）加入 res，然後返回繼續找其他解。`,
            vars: vars(),
            state: snap({
              frameHl: frames.length - 1,
              resHl: res.length - 1,
              connectors: [{ from: "wb-dyn-board", to: `wb-chip-res-${res.length - 1}`, label: "push_back", color: "green" }]
            })
          });
          frames.pop();
          return;
        }
        for (let c = 0; c < n; c++) {
          cur = { r, c };
          if (cols[c] || d1[r + c] || d2[r - c + n - 1]) {
            const att = attacker(r, c);
            steps.push({
              line: 8,
              tag: `(${r},${c}) 被攻擊`,
              tagType: "tag-check",
              inlineBadge: `cols[${c}]=${cols[c] ? 1 : 0}, d1[${r + c}]=${d1[r + c] ? 1 : 0}, d2[${r - c + n - 1}]=${d2[r - c + n - 1] ? 1 : 0}`,
              explanation: att
                ? `格子 (${r}, ${c}) 與第 ${att[0]} 列的皇后 (${att[0]}, ${att[1]}) 在${att[2]}上，不能放，continue。`
                : `格子 (${r}, ${c}) 已被占用，continue。`,
              vars: vars(),
              state: snap({
                warn: [`${r},${c}`],
                hl: att ? [`${att[0]},${att[1]}`] : [],
                frameHl: frames.length - 1,
                connectors: att ? [{ from: `wb-grid-board-${att[0]}-${att[1]}`, to: `wb-grid-board-${r}-${c}`, label: att[2], color: "red" }] : []
              })
            });
            continue;
          }
          cols[c] = d1[r + c] = d2[r - c + n - 1] = true;
          board[r][c] = "Q";
          queenCol[r] = c;
          frames[frames.length - 1].c = c;
          steps.push({
            line: 10,
            tag: `放皇后 (${r},${c})`,
            tagType: "tag-insert",
            inlineBadge: `board[${r}][${c}] = 'Q'`,
            explanation: `(${r}, ${c}) 不在任何已放皇后的同一行或斜線上。標記 cols[${c}]、d1[${r + c}]、d2[${r - c + n - 1}] 並放下皇后，接著遞迴到第 ${r + 1} 列。`,
            vars: vars(),
            state: snap({ hl: [`${r},${c}`], frameHl: frames.length - 1 })
          });
          dfs(r + 1);
          cur = { r, c };
          board[r][c] = ".";
          queenCol[r] = -1;
          cols[c] = d1[r + c] = d2[r - c + n - 1] = false;
          frames[frames.length - 1].c = -1;
          steps.push({
            line: 12,
            tag: `移除皇后 (${r},${c})`,
            tagType: "default",
            inlineBadge: `board[${r}][${c}] = '.'`,
            explanation: `第 ${r + 1} 列以下的可能都試完了，回溯：拿走 (${r}, ${c}) 的皇后並清除三個標記，讓第 ${r} 列改試下一行。`,
            vars: vars(),
            state: snap({ hl: [`${r},${c}`], frameHl: frames.length - 1 })
          });
        }
        frames.pop();
      };
      dfs(0);

      cur = { r: "-", c: "-" };
      const out = `${res.length} 組解`;
      steps.push({
        line: 21,
        tag: `回傳 ${res.length} 組解`,
        tagType: "tag-found",
        inlineBadge: `return res (size = ${res.length})`,
        explanation: res.length
          ? `搜尋結束，共找到 ${res.length} 種擺法：${res.map((cs) => `[${cs.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)).map((s) => `"${s}"`).join(",")}]`).join("、")}。`
          : `搜尋結束，${n} × ${n} 棋盤上無法放下 ${n} 個互不攻擊的皇后，回傳空陣列。`,
        vars: vars({ return: out }),
        state: snap({ ret: out, connectors: res.length ? [{ from: "wb-dyn-res", to: "wb-var-ret", label: out, color: "green" }] : [] })
      });
      return steps;
    }
  };

  // ============================================================================
  // #169 Smallest Range Covering Elements from K Lists (LC #632, Hard, Heap)
  // ============================================================================
  window.PROBLEMS["smallest-range-covering-elements-from-k-lists"] = {
    id: 169,
    leetcodeId: 632,
    slug: "smallest-range-covering-elements-from-k-lists",
    title: "632. Smallest Range Covering Elements from K Lists (涵蓋 K 個串列元素的最小區間)",
    difficulty: "Hard",
    topic: "Heap / K-way Merge / Sliding Window",
    mins: 40,
    complexity: "Time O(N log k) · Space O(k)",
    argNames: ["nums"],
    description:
      "給定 k 個已排序的整數串列，找出最小的區間 [a, b]，使每個串列至少有一個元素落在區間內；長度相同時取 a 較小者。做法類似 k 路合併：最小堆積 priority_queue 內永遠放「每個串列各一個」目前的元素，並記錄這些元素的最大值 curMax。此時堆頂 val 到 curMax 就是一個涵蓋所有串列的區間，用它更新最佳答案 best。接著彈出堆頂，把同一串列的下一個元素放入並更新 curMax；若某個串列已經用完，就不可能再涵蓋所有串列，立即停止。N 為元素總數，每個元素進出堆積一次，時間 O(N log k)，空間 O(k)。",

    presets: [
      { name: "範例 1：nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", args: [[[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]] },
      { name: "範例 2：nums = [[1,2,3],[1,2,3],[1,2,3]]", args: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]] },
      { name: "範例 3：nums = [[10],[11]]（單一元素）", args: [[[10], [11]]] },
      { name: "範例 4：nums = [[1,5,8],[4,12],[7,8,10]]", args: [[[1, 5, 8], [4, 12], [7, 8, 10]]] }
    ],

    cppLines: ext8Lines([
      `${K("class")} ${T("Solution")} {`,
      `${K("public")}:`,
      `    ${T("vector")}&lt;${K("int")}&gt; ${F("smallestRange")}(${T("vector")}&lt;${T("vector")}&lt;${K("int")}&gt;&gt;&amp; nums) {`,
      `        ${K("using")} ${T("T")} = ${T("tuple")}&lt;${K("int")}, ${K("int")}, ${K("int")}&gt;; ${C("// 值, 串列編號, 串列內索引")}`,
      `        ${T("priority_queue")}&lt;${T("T")}, ${T("vector")}&lt;${T("T")}&gt;, ${T("greater")}&lt;${T("T")}&gt;&gt; pq;`,
      `        ${K("int")} curMax = INT_MIN;`,
      `        ${K("for")} (${K("int")} i = ${N("0")}; i &lt; (${K("int")})nums.${F("size")}(); i++) {`,
      `            pq.${F("push")}({nums[i][${N("0")}], i, ${N("0")}});`,
      `            curMax = ${F("max")}(curMax, nums[i][${N("0")}]);`,
      `        }`,
      `        ${T("vector")}&lt;${K("int")}&gt; best = {${F("get")}&lt;${N("0")}&gt;(pq.${F("top")}()), curMax};`,
      `        ${K("while")} (${K("true")}) {`,
      `            ${K("auto")} [val, i, j] = pq.${F("top")}(); pq.${F("pop")}();`,
      `            ${K("if")} (curMax - val &lt; best[${N("1")}] - best[${N("0")}]) best = {val, curMax};`,
      `            ${K("if")} (j + ${N("1")} == (${K("int")})nums[i].${F("size")}()) ${K("break")};`,
      `            ${K("int")} nxt = nums[i][j + ${N("1")}];`,
      `            pq.${F("push")}({nxt, i, j + ${N("1")}});`,
      `            curMax = ${F("max")}(curMax, nxt);`,
      `        }`,
      `        ${K("return")} best;`,
      `    }`,
      `};`
    ]),

    generateTrace(numsInput) {
      const nums = ext8Clone(numsInput || []).map((l) => l.map(Number));
      const k = nums.length;
      const width = Math.max(...nums.map((l) => l.length));
      const steps = [];
      const pq = [];
      const used = new Set();
      let curMax = null;
      let best = null;
      let loc = { val: "-", i: "-", j: "-", nxt: "-" };
      const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
      const push = (t) => {
        pq.push(t);
        pq.sort(cmp);
      };
      const inHeap = () => pq.map((t) => `${t[1]},${t[2]}`);

      const snap = ({ gridHl = [], gridMatch = [], pqHl = -1, pqStatus = "hl", ret = "-", hot = [], connectors = [] } = {}) => ({
        boards: [
          {
            id: "lists",
            type: "grid",
            name: "nums",
            typeLabel: "k 個已排序串列（列 = 串列 i，欄 = 索引 j）",
            x: 325,
            y: 52,
            cells: nums.map((l) => Array.from({ length: width }, (_, j) => (j < l.length ? l[j] : ""))),
            rowLabels: nums.map((_, i) => `L${i}`),
            hl: gridHl.concat(inHeap().filter((key) => !gridHl.includes(key) && !gridMatch.includes(key))),
            match: gridMatch,
            done: [...used].filter((key) => !inHeap().includes(key) && !gridHl.includes(key))
          },
          {
            id: "pq",
            type: "queue",
            name: "pq (最小堆積)",
            typeLabel: "priority_queue<tuple<val,i,j>>",
            x: 325,
            y: 90 + k * 34 + 40,
            leftLabel: "top (最小) ←",
            rightLabel: "較大",
            items: pq.map((t, idx) => ({ val: `${t[0]} (L${t[1]}[${t[2]}])`, status: idx === pqHl ? pqStatus : "" }))
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "目前區間",
            x: 24,
            y: 215,
            items: [
              { id: "val", name: "val (堆頂)", val: String(loc.val), status: hot.includes("val") ? "hl" : "" },
              { id: "curMax", name: "curMax", val: curMax === null ? "INT_MIN" : String(curMax), status: hot.includes("curMax") ? "hl" : "" },
              { id: "nxt", name: "nxt", val: String(loc.nxt), status: hot.includes("nxt") ? "hl" : "" },
              { id: "best", name: "best", val: best ? `[${best[0]},${best[1]}]` : "-", status: hot.includes("best") ? "hl" : "" },
              { id: "ret", name: "return", val: String(ret), status: ret !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors
      });
      const vars = (extra = {}) => ({
        val: String(loc.val),
        i: String(loc.i),
        j: String(loc.j),
        nxt: String(loc.nxt),
        curMax: curMax === null ? "INT_MIN" : String(curMax),
        best: best ? `[${best[0]},${best[1]}]` : "-",
        return: "-",
        ...extra
      });

      steps.push({
        line: 6,
        tag: "建立最小堆積",
        tagType: "default",
        inlineBadge: "pq = {}, curMax = INT_MIN",
        explanation: `共有 k = ${k} 個串列。最小堆積 pq 會同時保存每個串列各一個元素，curMax 記錄這 k 個元素中的最大值。`,
        vars: vars(),
        state: snap()
      });

      for (let i = 0; i < k; i++) {
        const v = nums[i][0];
        push([v, i, 0]);
        used.add(`${i},0`);
        const before = curMax;
        curMax = curMax === null ? v : Math.max(curMax, v);
        const at = pq.findIndex((t) => t[1] === i && t[2] === 0);
        steps.push({
          line: 9,
          tag: `放入 L${i}[0] = ${v}`,
          tagType: "tag-insert",
          inlineBadge: `push(${v}), curMax = max(${before === null ? "INT_MIN" : before}, ${v}) = ${curMax}`,
          explanation: `把串列 L${i} 的第一個元素 ${v} 放入堆積，並更新 curMax = ${curMax}。`,
          vars: vars(),
          state: snap({
            gridHl: [`${i},0`],
            pqHl: at,
            pqStatus: "hl",
            hot: ["curMax"],
            connectors: [{ from: `wb-grid-lists-${i}-0`, to: `wb-queue-pq-${at}`, label: `push ${v}`, color: "purple" }]
          })
        });
      }

      best = [pq[0][0], curMax];
      steps.push({
        line: 11,
        tag: `best = [${best[0]},${best[1]}]`,
        tagType: "tag-insert",
        inlineBadge: `best = {${best[0]}, ${best[1]}}`,
        explanation: `堆積中的元素涵蓋每一個串列，最小值 ${best[0]} 到最大值 ${best[1]} 就是第一個可行區間，先當作目前最佳答案。`,
        vars: vars(),
        state: snap({ pqHl: 0, hot: ["best"], connectors: [{ from: "wb-queue-pq-0", to: "wb-var-best", label: `[${best[0]},${best[1]}]`, color: "blue" }] })
      });

      while (true) {
        const [val, i, j] = pq.shift();
        loc = { val, i, j, nxt: "-" };
        const lenNow = curMax - val;
        const lenBest = best[1] - best[0];
        const better = lenNow < lenBest;
        if (better) best = [val, curMax];
        steps.push({
          line: 14,
          tag: better ? `更新 best = [${val},${curMax}]` : `[${val},${curMax}] 未更好`,
          tagType: better ? "tag-found" : "tag-check",
          inlineBadge: `${curMax} - ${val} = ${lenNow} ${better ? "<" : ">="} ${lenBest}`,
          explanation: better
            ? `彈出堆頂 ${val}（L${i}[${j}]）。目前區間 [${val}, ${curMax}] 長度 ${lenNow}，比原本最佳的 ${lenBest} 更短，更新 best = [${val}, ${curMax}]。`
            : `彈出堆頂 ${val}（L${i}[${j}]）。目前區間 [${val}, ${curMax}] 長度 ${lenNow}，沒有比最佳長度 ${lenBest} 更短（長度相同時保留起點較小的舊答案），best 不變。`,
          vars: vars(),
          state: snap({
            gridHl: [`${i},${j}`],
            hot: better ? ["val", "best"] : ["val"],
            connectors: [{ from: `wb-grid-lists-${i}-${j}`, to: "wb-var-val", label: `pop ${val}`, color: better ? "green" : "blue" }]
          })
        });
        if (j + 1 === nums[i].length) {
          steps.push({
            line: 15,
            tag: `L${i} 已用完`,
            tagType: "tag-check",
            inlineBadge: `j + 1 == ${nums[i].length} → break`,
            explanation: `串列 L${i} 已經沒有下一個元素了。之後的任何區間都無法再包含 L${i} 的元素（最小值只會更大），所以停止搜尋。`,
            vars: vars(),
            state: snap({ gridHl: [`${i},${j}`] })
          });
          break;
        }
        const nxt = nums[i][j + 1];
        loc.nxt = nxt;
        push([nxt, i, j + 1]);
        used.add(`${i},${j + 1}`);
        const at = pq.findIndex((t) => t[1] === i && t[2] === j + 1);
        const before = curMax;
        curMax = Math.max(curMax, nxt);
        steps.push({
          line: 17,
          tag: `放入 L${i}[${j + 1}] = ${nxt}`,
          tagType: "tag-insert",
          inlineBadge: `push(${nxt}), curMax = max(${before}, ${nxt}) = ${curMax}`,
          explanation: `用同一串列 L${i} 的下一個元素 ${nxt} 補上被彈出的位置，堆積仍然保持每個串列各一個元素；curMax 更新為 ${curMax}。`,
          vars: vars(),
          state: snap({
            gridHl: [`${i},${j + 1}`],
            pqHl: at,
            hot: ["nxt", "curMax"],
            connectors: [{ from: `wb-grid-lists-${i}-${j + 1}`, to: `wb-queue-pq-${at}`, label: `push ${nxt}`, color: "purple" }]
          })
        });
      }

      const out = `[${best[0]},${best[1]}]`;
      steps.push({
        line: 20,
        tag: `回傳 ${out}`,
        tagType: "tag-found",
        inlineBadge: `return ${out}`,
        explanation: `涵蓋每個串列至少一個元素的最小區間為 ${out}。`,
        vars: vars({ return: out }),
        state: snap({ ret: out, connectors: [{ from: "wb-var-best", to: "wb-var-ret", label: out, color: "green" }] })
      });
      return steps;
    }
  };
})();

/**
 * Grind 75 延伸題 — Problems #100 to #111
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 *
 * #100 Longest Consecutive Sequence (LC #128)
 * #101 Rotate Array (LC #189)
 * #102 Odd Even Linked List (LC #328)
 * #103 Decode String (LC #394)
 * #104 Contiguous Array (LC #525)
 * #105 Maximum Width of Binary Tree (LC #662)
 * #106 Find K Closest Elements (LC #658)
 * #107 Longest Repeating Character Replacement (LC #424)
 * #108 Median of Two Sorted Arrays (LC #4)
 * #109 Same Tree (LC #100)
 * #110 Number of 1 Bits (LC #191)
 * #111 Longest Common Prefix (LC #14)
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ==========================================================================
  // 共用輔助：HTML 轉義、C++ 語法上色、步驟收集
  // ==========================================================================
  const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const CPP_KW = new Set([
    "class", "public", "private", "int", "bool", "char", "void", "double", "return", "if", "else",
    "while", "for", "auto", "nullptr", "true", "false", "const", "unsigned", "long", "continue", "break"
  ]);
  const CPP_TYPES = new Set([
    "Solution", "vector", "string", "stack", "queue", "unordered_map", "unordered_set", "TreeNode", "ListNode", "pair"
  ]);

  const highlightCpp = (src) => {
    let code = src;
    let cmt = "";
    const ci = src.indexOf("//");
    if (ci >= 0) {
      code = src.slice(0, ci);
      cmt = src.slice(ci);
    }
    const re = /([A-Za-z_]\w*)|(\d+(?:\.\d+)?)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|([\s\S])/g;
    let out = "";
    let m;
    while ((m = re.exec(code))) {
      if (m[1]) {
        const w = m[1];
        if (CPP_KW.has(w)) out += `<span class="tok-kw">${w}</span>`;
        else if (CPP_TYPES.has(w)) out += `<span class="tok-type">${w}</span>`;
        else if (/^\s*\(/.test(code.slice(re.lastIndex))) out += `<span class="tok-fn">${w}</span>`;
        else out += w;
      } else if (m[2]) out += `<span class="tok-num">${m[2]}</span>`;
      else if (m[3]) out += `<span class="tok-num">${esc(m[3])}</span>`;
      else out += esc(m[4]);
    }
    if (cmt) out += `<span class="tok-cmt">${esc(cmt)}</span>`;
    return out;
  };

  const cpp = (text) =>
    text
      .replace(/^\n/, "")
      .replace(/\n\s*$/, "")
      .split("\n")
      .map((code, i) => ({ line: i + 1, code: highlightCpp(code) }));

  const strVars = (o) => {
    const r = {};
    Object.keys(o).forEach((k) => {
      r[k] = String(o[k]);
    });
    return r;
  };

  const makeRecorder = () => {
    const steps = [];
    const push = (line, tag, tagType, inlineBadge, explanation, vars, state) => {
      steps.push({ line, tag, tagType, inlineBadge: String(inlineBadge), explanation, vars: strVars(vars), state });
    };
    return { steps, push };
  };

  const varsBoard = (items, typeLabel = "關鍵變數與回傳值", y = 215) => ({
    id: "vars",
    type: "vars",
    name: "state_vars",
    typeLabel,
    x: 24,
    y,
    items
  });

  const fmtArr = (a) => `[${a.join(",")}]`;

  // ==========================================================================
  // #100 Longest Consecutive Sequence (LC #128, Medium)
  // ==========================================================================
  window.PROBLEMS["longest-consecutive-sequence"] = {
    id: 100,
    leetcodeId: 128,
    slug: "longest-consecutive-sequence",
    title: "128. Longest Consecutive Sequence (最長連續序列)",
    difficulty: "Medium",
    topic: "Array / Hash Set",
    mins: 30,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["nums"],
    description:
      "給定未排序的整數陣列 nums，求數值連續（如 1,2,3,4）的最長序列長度，元素在原陣列中不必相鄰，且要求 O(n) 時間。先把所有數字放進 unordered_set 去除重複並支援 O(1) 查詢；只有當 num - 1 不在集合中時，num 才是一段連續序列的起點，再從起點不斷查詢 num + 1 延伸長度。每個數字最多在延伸時被走訪一次，因此時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：nums = [100,4,200,1,3,2]", args: [[100, 4, 200, 1, 3, 2]] },
      { name: "範例 2：nums = [0,3,7,2,5,8,4,6,0,1]", args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]] },
      { name: "重複值：nums = [1,2,0,1]", args: [[1, 2, 0, 1]] },
      { name: "邊界情況：nums = [] (空陣列)", args: [[]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longest = 0;
        for (int num : numSet) {
            if (numSet.count(num - 1)) continue;  // 不是序列起點
            int curr = num, streak = 1;
            while (numSet.count(curr + 1)) {
                curr++;
                streak++;
            }
            longest = max(longest, streak);
        }
        return longest;
    }
};
`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.map(Number) : [];
      const { steps, push } = makeRecorder();
      const order = [];
      const inSet = new Set();
      nums.forEach((v) => {
        if (!inSet.has(v)) {
          inSet.add(v);
          order.push(v);
        }
      });
      let built = false;
      let longest = null;
      let num = null;
      let curr = null;
      let streak = null;
      let ret = null;
      let probe = null;
      const run = new Set();
      const chip = (v) => `wb-chip-set-${order.indexOf(v)}`;
      const show = (v) => (v === null ? "-" : String(v));

      const V = () => ({ num: show(num), curr: show(curr), streak: show(streak), longest: show(longest), return: show(ret) });

      const snap = (conn = [], focus = "") => {
        const hl = [];
        const match = [];
        const pointers = [];
        nums.forEach((v, i) => {
          if (run.has(v)) match.push(i);
          else if (v === num) hl.push(i);
        });
        if (num !== null) {
          const pi = nums.indexOf(num);
          if (pi >= 0) pointers.push({ idx: pi, label: "num", color: "blue" });
        }
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "輸入陣列 (vector&lt;int&gt;)",
              x: 325,
              y: 52,
              values: nums.map(esc),
              hl,
              match,
              pointers
            },
            {
              id: "set",
              type: "set",
              name: "numSet",
              typeLabel: "雜湊集合 (unordered_set&lt;int&gt;)",
              x: 325,
              y: 180,
              items: (built ? order : []).map((v) => ({
                val: esc(v),
                status: run.has(v) ? "match" : v === probe || v === num ? "hl" : ""
              }))
            },
            varsBoard([
              { id: "num", name: "num", val: show(num), status: focus === "num" ? "hl" : "" },
              { id: "curr", name: "curr", val: show(curr), status: focus === "curr" ? "hl" : "" },
              { id: "streak", name: "streak", val: show(streak), status: focus === "streak" ? "hl" : "" },
              { id: "longest", name: "longest", val: show(longest), status: focus === "longest" ? "hl" : "" },
              { id: "ret", name: "return", val: show(ret), status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      built = true;
      push(4, "建立雜湊集合", "tag-insert", `numSet 大小 = ${order.length}`,
        nums.length
          ? `把 nums 的 ${nums.length} 個數字放進 unordered_set，重複值只會保留一份，共 ${order.length} 個不同數字；之後查詢某個數字是否存在只需 O(1)。（白板依加入順序列出集合元素。）`
          : "nums 是空陣列，建立出來的 numSet 也是空集合。",
        V(), snap());

      longest = 0;
      push(5, "初始化 longest", "default", "longest = 0", "longest 記錄目前找到的最長連續序列長度，先設為 0。", V(), snap([], "longest"));

      for (const v of order) {
        num = v;
        curr = null;
        streak = null;
        probe = null;
        run.clear();
        push(6, "取出 num", "default", `num = ${v}`, `從集合中取出下一個數字 num = ${v}，準備判斷它是不是某段連續序列的起點。`, V(), snap([], "num"));

        if (inSet.has(v - 1)) {
          probe = v - 1;
          push(7, "不是起點，跳過", "tag-check", `numSet.count(${v - 1}) = 1 ➜ continue`,
            `${v - 1} 也在集合中，代表 ${v} 前面還能接數字，不是序列起點；從更小的起點延伸時自然會數到 ${v}，因此直接跳過，避免重複計算。`,
            V(), snap([{ from: chip(v), to: chip(v - 1), label: `${v - 1} 存在`, color: "red" }], "num"));
          probe = null;
          continue;
        }
        push(7, "確認為序列起點", "tag-check", `numSet.count(${v - 1}) = 0`,
          `${v - 1} 不在集合中，所以 ${v} 是一段連續序列的起點，從這裡開始往上延伸。`, V(), snap([], "num"));

        curr = v;
        streak = 1;
        run.add(v);
        push(8, "開始延伸序列", "tag-insert", `curr = ${v}, streak = 1`, `以 ${v} 為起點，curr 指向目前序列的最後一個數字，streak 為目前長度 1。`, V(), snap([], "streak"));

        while (inSet.has(curr + 1)) {
          probe = curr + 1;
          push(9, "下一個數字存在", "tag-check", `numSet.count(${curr + 1}) = 1`,
            `查詢 ${curr + 1}：存在於集合中，可以接在 ${curr} 後面，序列繼續延伸。`,
            V(), snap([{ from: chip(curr), to: chip(curr + 1), label: `${curr} + 1 存在`, color: "green" }], "curr"));
          probe = null;
          curr += 1;
          streak += 1;
          run.add(curr);
          push(11, "延伸長度", "tag-insert", `curr = ${curr}, streak = ${streak}`, `curr 前進到 ${curr}，目前序列長度增加為 ${streak}。`, V(), snap([], "streak"));
        }
        push(9, "序列中斷", "tag-check", `numSet.count(${curr + 1}) = 0`,
          `${curr + 1} 不在集合中，從 ${v} 開始的連續序列到 ${curr} 結束，長度為 ${streak}。`,
          V(), snap([{ from: chip(curr), to: "wb-var-streak", label: `長度 ${streak}`, color: "blue" }], "streak"));

        const old = longest;
        longest = Math.max(longest, streak);
        push(13, longest > old ? "更新最長長度" : "保持最長長度", longest > old ? "tag-found" : "default",
          `longest = max(${old}, ${streak}) = ${longest}`,
          longest > old ? `這段序列長度 ${streak} 比之前的 ${old} 更長，更新 longest = ${longest}。` : `長度 ${streak} 沒有超過目前的 longest = ${old}，維持不變。`,
          V(), snap([{ from: "wb-var-streak", to: "wb-var-longest", label: "max", color: longest > old ? "green" : "blue" }], "longest"));
      }

      num = null;
      curr = null;
      streak = null;
      run.clear();
      ret = longest;
      push(15, "回傳答案", "tag-found", `return ${longest}`,
        `所有起點都檢查完畢，最長連續序列的長度為 ${longest}。`, V(), snap([{ from: "wb-var-longest", to: "wb-var-ret", label: `答案 ${longest}`, color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #101 Rotate Array (LC #189, Medium)
  // ==========================================================================
  window.PROBLEMS["rotate-array"] = {
    id: 101,
    leetcodeId: 189,
    slug: "rotate-array",
    title: "189. Rotate Array (輪轉陣列)",
    difficulty: "Medium",
    topic: "Array / Two Pointers",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums", "k"],
    description:
      "給定整數陣列 nums，將所有元素向右輪轉 k 個位置，必須原地修改。先令 k %= n 處理 k 大於長度的情況，再使用三次反轉：整體反轉後，原本最後 k 個元素會跑到最前面但順序顛倒，再分別反轉前 k 個與後 n - k 個即可恢復各段順序。每次反轉用左右雙指標交換，時間 O(n)、額外空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [1,2,3,4,5,6,7], k = 3", args: [[1, 2, 3, 4, 5, 6, 7], 3] },
      { name: "範例 2：nums = [-1,-100,3,99], k = 2", args: [[-1, -100, 3, 99], 2] },
      { name: "k 大於長度：nums = [1,2,3], k = 4", args: [[1, 2, 3], 4] },
      { name: "邊界情況：nums = [5], k = 0", args: [[5], 0] }
    ],

    cppLines: cpp(`
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverseRange(nums, 0, n - 1);  // 整體反轉
        reverseRange(nums, 0, k - 1);  // 反轉前 k 個
        reverseRange(nums, k, n - 1);  // 反轉後 n - k 個
    }
private:
    void reverseRange(vector<int>& nums, int l, int r) {
        while (l < r) {
            swap(nums[l], nums[r]);
            l++, r--;
        }
    }
};
`),

    generateTrace(numsInput, kInput) {
      const orig = Array.isArray(numsInput) ? numsInput.map(Number) : [];
      const nums = orig.slice();
      const n = nums.length;
      let k = Number(kInput);
      const { steps, push } = makeRecorder();
      let l = null;
      let r = null;
      let phase = "-";
      let range = null;
      let ret = null;
      const swapped = [];

      const V = () => ({ n, k, 階段: phase, l: l === null ? "-" : l, r: r === null ? "-" : r, return: ret === null ? "-" : ret });

      const snap = (conn = []) => {
        const hl = [];
        if (range) for (let i = range[0]; i <= range[1]; i++) hl.push(i);
        const pointers = [];
        if (l !== null && l >= 0 && l < n) pointers.push({ idx: l, label: "l", color: "blue" });
        if (r !== null && r >= 0 && r < n) pointers.push({ idx: r, label: "r", color: "red" });
        return {
          boards: [
            {
              id: "orig",
              type: "array",
              name: "原始 nums",
              typeLabel: "輸入快照 (參考用)",
              x: 325,
              y: 52,
              values: orig.map(esc),
              done: orig.map((_, i) => i)
            },
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "原地修改 (vector&lt;int&gt;&amp;)",
              x: 325,
              y: 165,
              values: nums.map(esc),
              hl: ret !== null ? [] : hl.filter((i) => !swapped.includes(i)),
              match: ret !== null ? nums.map((_, i) => i) : swapped.slice(),
              pointers
            },
            varsBoard([
              { id: "n", name: "n", val: String(n) },
              { id: "k", name: "k", val: String(k) },
              { id: "phase", name: "階段", val: phase, status: range ? "hl" : "" },
              { id: "l", name: "l", val: l === null ? "-" : String(l) },
              { id: "r", name: "r", val: r === null ? "-" : String(r) },
              { id: "ret", name: "nums", val: ret === null ? "-" : ret, status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      push(4, "取得長度", "default", `n = ${n}`, `陣列長度 n = ${n}，目標是把每個元素向右移動 ${k} 格。`, V(), snap());
      const k0 = k;
      k %= n;
      push(5, "k 取餘數", "default", `k = ${k0} % ${n} = ${k}`,
        k0 >= n
          ? `向右輪轉 n 次會回到原樣，所以只需輪轉 ${k0} % ${n} = ${k} 次。`
          : `k = ${k0} 小於 n，取餘數後不變，仍為 ${k}。`,
        V(), snap([{ from: "wb-var-k", to: "wb-var-n", label: "k %= n", color: "blue" }]));

      const phases = [
        [6, 0, n - 1, "整體反轉"],
        [7, 0, k - 1, "反轉前 k 個"],
        [8, k, n - 1, "反轉後 n-k 個"]
      ];
      for (const [line, a, b, name] of phases) {
        phase = name;
        range = a <= b ? [a, b] : null;
        swapped.length = 0;
        l = null;
        r = null;
        push(line, `呼叫 reverseRange：${name}`, "default", `reverseRange(nums, ${a}, ${b})`,
          a < b
            ? `${name}：反轉索引 ${a} 到 ${b} 的區段。`
            : `${name}：區段 [${a}, ${b}] 長度不超過 1，反轉不會改變任何元素。`,
          V(), snap());
        l = a;
        r = b;
        while (l < r) {
          const vl = nums[l];
          const vr = nums[r];
          nums[l] = vr;
          nums[r] = vl;
          swapped.push(l, r);
          push(13, "交換左右兩端", "tag-insert", `swap(nums[${l}], nums[${r}]) ➜ ${vr}, ${vl}`,
            `交換 nums[${l}] = ${vl} 與 nums[${r}] = ${vr}，左右兩端的元素對調位置。`,
            V(), snap([{ from: `wb-cw-nums-${l}`, to: `wb-cw-nums-${r}`, label: "swap", color: "purple" }]));
          l += 1;
          r -= 1;
          push(14, "雙指標向內收縮", "default", `l = ${l}, r = ${r}`, `l 右移、r 左移，繼續處理內側的一對元素。`, V(), snap());
        }
        push(12, `${name}完成`, "tag-check", `l = ${l}, r = ${r} ➜ l ≥ r`,
          `l 已不小於 r，區段內所有成對元素都交換完成，結束這次 reverseRange。`, V(), snap());
        range = null;
      }

      l = null;
      r = null;
      phase = "完成";
      swapped.length = 0;
      ret = fmtArr(nums);
      push(9, "輪轉完成", "tag-found", `nums = ${ret}`,
        `三次反轉完成，nums 已原地向右輪轉 ${k0} 步，結果為 ${ret}。`, V(), snap([{ from: "wb-dyn-nums", to: "wb-var-ret", label: "結果", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #102 Odd Even Linked List (LC #328, Medium)
  // ==========================================================================
  window.PROBLEMS["odd-even-linked-list"] = {
    id: 102,
    leetcodeId: 328,
    slug: "odd-even-linked-list",
    title: "328. Odd Even Linked List (奇偶鏈結串列)",
    difficulty: "Medium",
    topic: "Linked List",
    mins: 25,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["head"],
    description:
      "給定單向鏈結串列的頭節點 head，把所有位於奇數位置（第 1、3、5… 個）的節點依原順序串在前面，偶數位置的節點依原順序接在後面，並回傳重新排列後的頭節點。使用 odd 與 even 兩個指標分別串接奇數鏈與偶數鏈，並用 evenHead 記住偶數鏈的開頭；走訪結束後把奇數鏈尾端接上 evenHead。只改變 next 指標，時間 O(n)、額外空間 O(1)。白板將奇數位置節點畫在上排、偶數位置節點畫在下排。",

    presets: [
      { name: "範例 1：head = [1,2,3,4,5]", args: [[1, 2, 3, 4, 5]] },
      { name: "範例 2：head = [2,1,3,5,6,4,7]", args: [[2, 1, 3, 5, 6, 4, 7]] },
      { name: "偶數個節點：head = [1,2,3,4]", args: [[1, 2, 3, 4]] },
      { name: "邊界情況：head = [1] (單一節點)", args: [[1]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* odd = head;
        ListNode* even = head->next;
        ListNode* evenHead = even;
        while (even && even->next) {
            odd->next = even->next;
            odd = odd->next;
            even->next = odd->next;
            even = even->next;
        }
        odd->next = evenHead;
        return head;
    }
};
`),

    generateTrace(headInput) {
      const vals = Array.isArray(headInput) ? headInput.slice() : [];
      const n = vals.length;
      const next = vals.map((_, i) => (i + 1 < n ? i + 1 : -1));
      const { steps, push } = makeRecorder();
      let odd = -1;
      let even = -1;
      let evenHead = -1;
      let ret = null;
      const nm = (i) => (i === -1 ? "nullptr" : `Node(${vals[i]})`);
      const nid = (i) => `wb-node-list-n${i}`;

      const listStr = () => {
        const out = [];
        let c = n ? 0 : -1;
        let guard = 0;
        while (c !== -1 && guard++ <= n) {
          out.push(vals[c]);
          c = next[c];
        }
        return fmtArr(out);
      };

      const V = () => ({ odd: nm(odd), even: nm(even), evenHead: nm(evenHead), return: ret === null ? "-" : ret });

      const snap = (activeEdge = -1, conn = []) => {
        const spacing = 82;
        const nodes = vals.map((v, i) => {
          const ptr = [];
          if (i === 0) ptr.push("head");
          if (i === odd) ptr.push("odd");
          if (i === even) ptr.push("even");
          if (i === evenHead && evenHead !== even) ptr.push("evenHead");
          return {
            id: `n${i}`,
            val: esc(v),
            sub: i % 2 === 0 ? `第 ${i + 1} 個(奇)` : `第 ${i + 1} 個(偶)`,
            x: 52 + i * spacing,
            y: i % 2 === 0 ? 62 : 162,
            status: ret !== null ? "match" : i === odd ? "hl" : i === even ? "warn" : "",
            ptr: ptr.join(" / ")
          };
        });
        const edges = [];
        vals.forEach((_, i) => {
          if (next[i] !== -1) edges.push({ from: `n${i}`, to: `n${next[i]}`, label: "next", dir: true, status: i === activeEdge ? "hl" : "" });
        });
        return {
          boards: [
            {
              id: "list",
              type: "list",
              shape: "list",
              name: "head",
              typeLabel: "單向鏈結串列 (上排奇數位置 / 下排偶數位置)",
              x: 325,
              y: 52,
              width: Math.max(460, 52 + n * spacing + 40),
              height: 235,
              nodes,
              edges
            },
            varsBoard([
              { id: "odd", name: "odd", val: nm(odd), status: odd !== -1 ? "hl" : "" },
              { id: "even", name: "even", val: nm(even), status: even !== -1 ? "warn" : "" },
              { id: "evenHead", name: "evenHead", val: nm(evenHead) },
              { id: "cur", name: "串列", val: listStr() },
              { id: "ret", name: "return", val: ret === null ? "-" : ret, status: ret !== null ? "match" : "" }
            ], "指標狀態與回傳值", 225)
          ],
          connectors: conn
        };
      };

      if (n < 2) {
        ret = listStr();
        push(4, "節點不足 2 個，直接回傳", "tag-found", "return head",
          n === 0 ? "串列是空的，不需要重新排列，直接回傳 nullptr。" : "只有一個節點，奇偶分組後順序不變，直接回傳 head。",
          V(), snap(-1, n ? [{ from: nid(0), to: "wb-var-ret", label: "head", color: "green" }] : []));
        return steps;
      }

      push(4, "檢查串列長度", "tag-check", "head 與 head->next 皆存在", "串列至少有兩個節點，需要進行奇偶重排。", V(), snap());
      odd = 0;
      push(5, "odd 指向 head", "default", `odd = ${nm(0)}`, `odd 指向第 1 個節點 ${vals[0]}，它是奇數鏈的開頭也是答案的頭節點。`, V(), snap(-1, [{ from: nid(0), to: "wb-var-odd", label: "odd", color: "blue" }]));
      even = 1;
      push(6, "even 指向第二個節點", "default", `even = ${nm(1)}`, `even 指向第 2 個節點 ${vals[1]}，它是偶數鏈的開頭。`, V(), snap(-1, [{ from: nid(1), to: "wb-var-even", label: "even", color: "red" }]));
      evenHead = 1;
      push(7, "記住偶數鏈開頭", "tag-insert", `evenHead = ${nm(1)}`, `用 evenHead 保存偶數鏈的第一個節點，最後要把奇數鏈的尾端接到這裡。`, V(), snap(-1, [{ from: nid(1), to: "wb-var-evenHead", label: "evenHead", color: "purple" }]));

      while (even !== -1 && next[even] !== -1) {
        push(8, "繼續串接", "tag-check", `even = ${vals[even]}, even->next = ${vals[next[even]]}`,
          `even 與 even->next 都存在，代表後面還有一個奇數位置節點可以接到奇數鏈。`, V(), snap());
        next[odd] = next[even];
        push(9, "奇數鏈跳過偶數節點", "tag-insert", `${vals[odd]}->next = ${vals[next[odd]]}`,
          `把 odd(${vals[odd]}) 的 next 改指向 even 的下一個節點 ${vals[next[odd]]}，跳過偶數位置的 ${vals[even]}。`,
          V(), snap(odd, [{ from: nid(odd), to: nid(next[odd]), label: "odd->next", color: "purple" }]));
        odd = next[odd];
        push(10, "odd 前進", "default", `odd = ${nm(odd)}`, `odd 移動到奇數鏈的新尾端 ${vals[odd]}。`, V(), snap());
        next[even] = next[odd];
        push(11, "偶數鏈跳過奇數節點", "tag-insert", `${vals[even]}->next = ${next[even] === -1 ? "nullptr" : vals[next[even]]}`,
          next[even] === -1
            ? `odd 後面已經沒有節點，把 even(${vals[even]}) 的 next 設為 nullptr。`
            : `把 even(${vals[even]}) 的 next 改指向 odd 的下一個節點 ${vals[next[even]]}，跳過奇數位置的 ${vals[odd]}。`,
          V(), snap(even, next[even] === -1 ? [] : [{ from: nid(even), to: nid(next[even]), label: "even->next", color: "purple" }]));
        even = next[even];
        push(12, "even 前進", "default", `even = ${nm(even)}`,
          even === -1 ? "even 前進到 nullptr，偶數鏈已到尾端。" : `even 移動到偶數鏈的新尾端 ${vals[even]}。`, V(), snap());
      }

      push(8, "停止串接", "tag-check", even === -1 ? "even == nullptr" : "even->next == nullptr",
        even === -1 ? "even 為 nullptr，沒有更多節點，結束迴圈。" : `even(${vals[even]}) 後面沒有節點，奇數鏈已無法再延伸，結束迴圈。`, V(), snap());
      next[odd] = evenHead;
      push(14, "奇數鏈尾端接上偶數鏈", "tag-insert", `${vals[odd]}->next = evenHead(${vals[evenHead]})`,
        `把奇數鏈最後一個節點 ${vals[odd]} 的 next 接到 evenHead(${vals[evenHead]})，兩條鏈合併成一條。`,
        V(), snap(odd, [{ from: nid(odd), to: nid(evenHead), label: "接上 evenHead", color: "green" }]));
      ret = listStr();
      push(15, "回傳 head", "tag-found", `return ${ret}`, `重新排列完成，從 head 走訪得到 ${ret}。`, V(), snap(-1, [{ from: nid(0), to: "wb-var-ret", label: "head", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #103 Decode String (LC #394, Medium)
  // ==========================================================================
  window.PROBLEMS["decode-string"] = {
    id: 103,
    leetcodeId: 394,
    slug: "decode-string",
    title: "394. Decode String (字串解碼)",
    difficulty: "Medium",
    topic: "Stack / String",
    mins: 30,
    complexity: "Time O(輸出長度) · Space O(輸出長度)",
    argNames: ["s"],
    description:
      "給定經過編碼的字串 s，編碼規則為 k[encoded_string]，表示中括號內的字串重複 k 次，且可以巢狀。由左到右掃描，用兩個堆疊分別保存外層的重複次數 counts 與外層已組好的字串 strs：遇到數字累積 k；遇到 [ 把 k 與目前字串 cur 推入堆疊並清空；遇到 ] 彈出次數與外層字串，把 cur 重複 times 次後接回外層；遇到字母直接附加到 cur。時間與空間皆和解碼後的輸出長度成正比。",

    presets: [
      { name: "範例 1：s = \"3[a]2[bc]\"", args: ["3[a]2[bc]"] },
      { name: "範例 2：s = \"3[a2[c]]\"（巢狀）", args: ["3[a2[c]]"] },
      { name: "範例 3：s = \"2[abc]3[cd]ef\"", args: ["2[abc]3[cd]ef"] },
      { name: "多位數次數：s = \"10[x]y\"", args: ["10[x]y"] }
    ],

    cppLines: cpp(`
class Solution {
public:
    string decodeString(string s) {
        stack<int> counts;
        stack<string> strs;
        string cur;
        int k = 0;
        for (char c : s) {
            if (isdigit(c)) {
                k = k * 10 + (c - '0');
            } else if (c == '[') {
                counts.push(k);
                strs.push(cur);
                k = 0, cur = "";
            } else if (c == ']') {
                int times = counts.top(); counts.pop();
                string prev = strs.top(); strs.pop();
                string rep;
                while (times--) rep += cur;
                cur = prev + rep;
            } else {
                cur += c;
            }
        }
        return cur;
    }
};
`),

    generateTrace(sInput) {
      const s = String(sInput || "");
      const chars = s.split("");
      const { steps, push } = makeRecorder();
      const counts = [];
      const strs = [];
      let cur = "";
      let k = 0;
      let i = -1;
      let times = null;
      let prev = null;
      let ret = null;
      const q = (x) => `"${x}"`;

      const V = () => ({
        i: i < 0 ? "-" : i,
        c: i >= 0 && i < chars.length ? chars[i] : "-",
        k,
        cur: q(cur),
        times: times === null ? "-" : times,
        prev: prev === null ? "-" : q(prev),
        return: ret === null ? "-" : q(ret)
      });

      const snap = (conn = [], hlTop = "") => ({
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: "編碼字串 (string)",
            x: 325,
            y: 52,
            values: chars.map(esc),
            hl: i >= 0 && i < chars.length && ret === null ? [i] : [],
            done: chars.map((_, j) => j).filter((j) => j < i),
            match: ret !== null ? chars.map((_, j) => j) : [],
            pointers: i >= 0 && i < chars.length && ret === null ? [{ idx: i, label: "c", color: "blue" }] : []
          },
          {
            id: "counts",
            type: "stack",
            name: "counts",
            typeLabel: "次數堆疊 (stack&lt;int&gt;)",
            x: 325,
            y: 180,
            items: counts.map((v, j) => ({ val: esc(v), status: hlTop === "counts" && j === counts.length - 1 ? "hl" : "" }))
          },
          {
            id: "strs",
            type: "stack",
            name: "strs",
            typeLabel: "外層字串堆疊 (stack&lt;string&gt;)",
            x: 500,
            y: 180,
            items: strs.map((v, j) => ({ val: esc(q(v)), status: hlTop === "strs" && j === strs.length - 1 ? "hl" : "" }))
          },
          varsBoard([
            { id: "c", name: "c", val: V().c, status: i >= 0 && ret === null ? "hl" : "" },
            { id: "k", name: "k", val: String(k) },
            { id: "cur", name: "cur", val: esc(q(cur)), status: hlTop === "cur" ? "hl" : "" },
            { id: "times", name: "times", val: times === null ? "-" : String(times) },
            { id: "prev", name: "prev", val: prev === null ? "-" : esc(q(prev)) },
            { id: "ret", name: "return", val: ret === null ? "-" : esc(q(ret)), status: ret !== null ? "match" : "" }
          ])
        ],
        connectors: conn
      });

      push(7, "初始化", "default", 'cur = "", k = 0', "建立兩個空堆疊：counts 保存外層的重複次數，strs 保存進入中括號前已組好的字串；cur 為目前層級正在組的字串，k 為正在讀取的數字。", V(), snap());

      for (i = 0; i < chars.length; i++) {
        const c = chars[i];
        const cw = `wb-cw-s-${i}`;
        if (c >= "0" && c <= "9") {
          const old = k;
          k = k * 10 + Number(c);
          push(10, "累積重複次數", "default", `k = ${old} * 10 + ${c} = ${k}`,
            old ? `讀到數字 ${c}，與前面的數字組成多位數：k = ${old} × 10 + ${c} = ${k}。` : `讀到數字 ${c}，k 更新為 ${k}，代表接下來中括號內的內容要重複 ${k} 次。`,
            V(), snap([{ from: cw, to: "wb-var-k", label: "k", color: "blue" }]));
        } else if (c === "[") {
          counts.push(k);
          push(12, "次數推入堆疊", "tag-insert", `counts.push(${k})`, `遇到 [，把重複次數 ${k} 推入 counts，等遇到對應的 ] 再取出。`,
            V(), snap([{ from: cw, to: `wb-stack-counts-${counts.length - 1}`, label: `push(${k})`, color: "purple" }], "counts"));
          strs.push(cur);
          push(13, "外層字串推入堆疊", "tag-insert", `strs.push("${cur}")`, `把目前外層已組好的字串 "${cur}" 推入 strs 保存，進入新的一層。`,
            V(), snap([{ from: "wb-var-cur", to: `wb-stack-strs-${strs.length - 1}`, label: "push(cur)", color: "purple" }], "strs"));
          k = 0;
          cur = "";
          push(14, "重置 k 與 cur", "default", 'k = 0, cur = ""', "清空 k 與 cur，開始收集中括號內部的字串。", V(), snap());
        } else if (c === "]") {
          times = counts.pop();
          push(16, "彈出重複次數", "tag-check", `times = ${times}`, `遇到 ]，從 counts 彈出這一層的重複次數 times = ${times}。`,
            V(), snap([{ from: cw, to: "wb-var-times", label: "pop", color: "blue" }]));
          prev = strs.pop();
          push(17, "彈出外層字串", "tag-check", `prev = "${prev}"`, `從 strs 彈出進入這層之前的外層字串 prev = "${prev}"。`,
            V(), snap([{ from: cw, to: "wb-var-prev", label: "pop", color: "blue" }]));
          const rep = cur.repeat(times);
          push(19, "重複中括號內容", "default", `rep = "${cur}" × ${times}`, `把這層的 cur = "${cur}" 重複 ${times} 次，得到 "${rep}"。`, V(), snap([], "cur"));
          const inner = cur;
          cur = prev + rep;
          push(20, "接回外層字串", "tag-insert", `cur = "${prev}" + "${rep}"`, `外層字串 "${prev}" 接上重複結果，cur 變成 "${cur}"，回到外層繼續處理。（內層原本為 "${inner}"。）`,
            V(), snap([{ from: "wb-var-prev", to: "wb-var-cur", label: "prev + rep", color: "green" }], "cur"));
          times = null;
          prev = null;
        } else {
          cur += c;
          push(22, "附加字母", "tag-insert", `cur += '${c}' ➜ "${cur}"`, `一般字母 ${c} 直接接到目前字串後面，cur = "${cur}"。`,
            V(), snap([{ from: cw, to: "wb-var-cur", label: `+ ${c}`, color: "purple" }], "cur"));
        }
      }

      i = chars.length;
      ret = cur;
      push(25, "回傳解碼結果", "tag-found", `return "${cur}"`, `整個字串掃描完畢，所有中括號都已展開，解碼結果為 "${cur}"。`,
        V(), snap([{ from: "wb-var-cur", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #104 Contiguous Array (LC #525, Medium)
  // ==========================================================================
  window.PROBLEMS["contiguous-array"] = {
    id: 104,
    leetcodeId: 525,
    slug: "contiguous-array",
    title: "525. Contiguous Array (連續陣列)",
    difficulty: "Medium",
    topic: "Array / Prefix Sum / Hash Table",
    mins: 30,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["nums"],
    description:
      "給定只含 0 與 1 的二元陣列 nums，求 0 與 1 個數相等的最長連續子陣列長度。把 0 視為 -1、1 視為 +1，問題轉為找總和為 0 的最長子陣列：若前綴和 sum 在索引 i 與更早的索引 j 相同，代表 (j, i] 區間的總和為 0。用 unordered_map 記錄每個前綴和第一次出現的索引（並預放 first[0] = -1），每次遇到重複的前綴和就以 i - first[sum] 更新答案。時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：nums = [0,1]", args: [[0, 1]] },
      { name: "範例 2：nums = [0,1,0]", args: [[0, 1, 0]] },
      { name: "範例 3：nums = [0,1,1,1,1,1,0,0,0]", args: [[0, 1, 1, 1, 1, 1, 0, 0, 0]] },
      { name: "無解：nums = [1,1,1]", args: [[1, 1, 1]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    int findMaxLength(vector<int>& nums) {
        unordered_map<int, int> first;  // 前綴和 → 最早索引
        first[0] = -1;
        int sum = 0, best = 0;
        for (int i = 0; i < nums.size(); i++) {
            sum += nums[i] == 1 ? 1 : -1;
            auto it = first.find(sum);
            if (it != first.end()) {
                best = max(best, i - it->second);
            } else {
                first[sum] = i;
            }
        }
        return best;
    }
};
`),

    generateTrace(numsInput) {
      const nums = Array.isArray(numsInput) ? numsInput.map(Number) : [];
      const { steps, push } = makeRecorder();
      const first = new Map();
      let sum = 0;
      let best = 0;
      let i = -1;
      let ret = null;
      let bestRange = null;
      const rid = (v) => `s${v}`;

      const V = () => ({ i: i < 0 ? "-" : i, sum, best, return: ret === null ? "-" : ret });

      const snap = (conn = [], rowStatus = {}, curRange = null) => {
        const match = [];
        const rng = curRange || (ret !== null ? bestRange : null);
        if (rng) for (let j = rng[0]; j <= rng[1]; j++) match.push(j);
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "二元陣列 (vector&lt;int&gt;)",
              x: 325,
              y: 52,
              values: nums.map(esc),
              hl: i >= 0 && i < nums.length && ret === null ? [i] : [],
              match,
              done: nums.map((_, j) => j).filter((j) => j < i && !match.includes(j)),
              pointers: i >= 0 && i < nums.length && ret === null ? [{ idx: i, label: `i = ${i}`, color: "blue" }] : []
            },
            {
              id: "first",
              type: "dict",
              name: "first",
              typeLabel: "前綴和 → 最早索引 (unordered_map)",
              x: 325,
              y: 175,
              headers: ["sum", "最早索引", "狀態"],
              rows: [...first.entries()].map(([key, val]) => ({
                id: rid(key),
                key: esc(key),
                val: String(val),
                note: rowStatus[key] ? rowStatus[key][1] : "",
                status: rowStatus[key] ? rowStatus[key][0] : ""
              }))
            },
            varsBoard([
              { id: "i", name: "i", val: i < 0 ? "-" : String(i) },
              { id: "sum", name: "sum", val: String(sum), status: "hl" },
              { id: "best", name: "best", val: String(best) },
              { id: "ret", name: "return", val: ret === null ? "-" : String(ret), status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      first.set(0, -1);
      push(5, "預放前綴和 0", "tag-insert", "first[0] = -1",
        "先放入 first[0] = -1，代表「還沒讀任何元素時前綴和為 0」；這樣從索引 0 開始的子陣列也能被計算到。", V(),
        snap([], { 0: ["inserted", "初始"] }));
      push(6, "初始化 sum 與 best", "default", "sum = 0, best = 0", "sum 為目前的前綴和（0 記為 -1、1 記為 +1），best 為目前找到的最長長度。", V(), snap());

      for (i = 0; i < nums.length; i++) {
        const old = sum;
        sum += nums[i] === 1 ? 1 : -1;
        push(8, "更新前綴和", "default", `sum = ${old} ${nums[i] === 1 ? "+ 1" : "- 1"} = ${sum}`,
          `nums[${i}] = ${nums[i]}，${nums[i] === 1 ? "1 視為 +1" : "0 視為 -1"}，前綴和由 ${old} 變為 ${sum}。`,
          V(), snap([{ from: `wb-cw-nums-${i}`, to: "wb-var-sum", label: nums[i] === 1 ? "+1" : "-1", color: "blue" }]));
        if (first.has(sum)) {
          const j = first.get(sum);
          const len = i - j;
          const oldBest = best;
          best = Math.max(best, len);
          if (best > oldBest) bestRange = [j + 1, i];
          push(11, best > oldBest ? "命中！更新最長長度" : "命中但未更長", best > oldBest ? "tag-found" : "tag-check",
            `best = max(${oldBest}, ${i} - (${j})) = ${best}`,
            `前綴和 ${sum} 先前在索引 ${j} 出現過，代表區間 [${j + 1}, ${i}] 內 0 與 1 個數相同，長度 ${len}。${best > oldBest ? `比目前的 ${oldBest} 更長，更新 best = ${best}。` : `沒有超過目前的 best = ${oldBest}。`}`,
            V(), snap([{ from: `wb-cw-nums-${i}`, to: `wb-dict-row-${rid(sum)}`, label: `命中 first[${sum}]`, color: "green" }],
              { [sum]: ["hit", `✓ 長度 ${len}`] }, [j + 1, i]));
        } else {
          first.set(sum, i);
          push(13, "記錄前綴和首次出現", "tag-insert", `first[${sum}] = ${i}`,
            `前綴和 ${sum} 第一次出現，記錄它的索引 ${i}；之後若再遇到相同的前綴和，就能用最早的索引算出最長區間。`,
            V(), snap([{ from: `wb-cw-nums-${i}`, to: `wb-dict-row-${rid(sum)}`, label: `寫入 first[${sum}]`, color: "purple" }],
              { [sum]: ["inserted", "新寫入"] }));
        }
      }

      i = nums.length;
      ret = best;
      push(16, "回傳答案", "tag-found", `return ${best}`,
        best ? `掃描完畢，0 與 1 數量相等的最長連續子陣列為索引 [${bestRange[0]}, ${bestRange[1]}]，長度 ${best}。` : "掃描完畢，找不到 0 與 1 數量相等的子陣列，回傳 0。",
        V(), snap([{ from: "wb-var-best", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #105 Maximum Width of Binary Tree (LC #662, Medium)
  // ==========================================================================
  window.PROBLEMS["maximum-width-of-binary-tree"] = {
    id: 105,
    leetcodeId: 662,
    slug: "maximum-width-of-binary-tree",
    title: "662. Maximum Width of Binary Tree (二元樹的最大寬度)",
    difficulty: "Medium",
    topic: "Binary Tree / BFS",
    mins: 20,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["root"],
    description:
      "給定二元樹的根節點 root，求所有層中的最大寬度。某層的寬度定義為該層最左與最右非空節點之間的距離（包含兩端），中間的空位置也要計算，就像把樹補成完全二元樹後的位置差。以 BFS 逐層走訪，並為每個節點編號：根為 0，左子節點為 2 × idx + 1、右子節點為 2 × idx + 2；每層寬度為最後一個節點編號減去第一個節點編號再加 1。使用 unsigned long long 讓深層編號溢位時差值仍正確。時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：root = [1,3,2,5,3,null,9]", args: [[1, 3, 2, 5, 3, null, 9]] },
      { name: "範例 2：root = [1,3,2,5,null,null,9,6,null,7]", args: [[1, 3, 2, 5, null, null, 9, 6, null, 7]] },
      { name: "範例 3：root = [1,3,2,5]", args: [[1, 3, 2, 5]] },
      { name: "邊界情況：root = [1] (單一節點)", args: [[1]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    int widthOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        unsigned long long best = 0;
        queue<pair<TreeNode*, unsigned long long>> q;
        q.push({root, 0});
        while (!q.empty()) {
            int size = q.size();
            unsigned long long left = q.front().second, right = left;
            for (int i = 0; i < size; i++) {
                auto [node, idx] = q.front(); q.pop();
                right = idx;
                if (node->left) q.push({node->left, 2 * idx + 1});
                if (node->right) q.push({node->right, 2 * idx + 2});
            }
            best = max(best, right - left + 1);
        }
        return (int)best;
    }
};
`),

    generateTrace(rootInput) {
      const arr = Array.isArray(rootInput) ? rootInput.slice() : [];
      const tree = buildTreeFromLevelOrder(arr, 620);
      const { steps, push } = makeRecorder();
      const q = [];
      const pos = {};
      const doneIds = new Set();
      let cur = null;
      let level = 0;
      let size = null;
      let left = null;
      let right = null;
      let best = null;
      let ret = null;
      let levelIds = [];
      const show = (v) => (v === null ? "-" : String(v));

      const V = () => ({ 層: level || "-", size: show(size), left: show(left), right: show(right), best: show(best), return: show(ret) });

      const snap = (conn = []) => {
        const nodes = tree.nodes.map((nd) => ({
          id: nd.id,
          val: esc(nd.val),
          sub: pos[nd.id] !== undefined ? `idx=${pos[nd.id]}` : "",
          x: nd.x,
          y: nd.y,
          status: cur && cur.id === nd.id ? "hl" : levelIds.includes(nd.id) && ret === null ? "match" : doneIds.has(nd.id) ? "done" : "",
          ptr: cur && cur.id === nd.id ? "node" : ""
        }));
        const edges = tree.edges.map((e) => ({ ...e, status: cur && e.from === cur.id ? "hl" : "" }));
        return {
          boards: [
            { id: "tree", type: "tree", shape: "circle", name: "root", typeLabel: "二元樹 (TreeNode*)", x: 325, y: 52, width: tree.width, height: tree.height, nodes, edges },
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "BFS 佇列 (節點值@編號)",
              x: 325,
              y: 52 + tree.height + 26,
              leftLabel: "front ←",
              rightLabel: "← back",
              items: q.map((it) => ({ val: `${esc(it.node.val)}@${it.idx}`, status: "" }))
            },
            varsBoard([
              { id: "level", name: "層", val: level ? String(level) : "-" },
              { id: "size", name: "size", val: show(size) },
              { id: "left", name: "left", val: show(left), status: left !== null && ret === null ? "hl" : "" },
              { id: "right", name: "right", val: show(right), status: right !== null && ret === null ? "hl" : "" },
              { id: "best", name: "best", val: show(best) },
              { id: "ret", name: "return", val: show(ret), status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      if (!tree.root) {
        ret = 0;
        push(4, "空樹", "tag-found", "return 0", "root 為 nullptr，樹中沒有任何層，寬度為 0。", V(), snap());
        return steps;
      }

      push(4, "檢查根節點", "tag-check", `root = ${tree.root.val}`, `根節點存在（值為 ${tree.root.val}），開始以 BFS 逐層計算寬度。`, V(), snap());
      best = 0;
      push(5, "初始化 best", "default", "best = 0", "best 記錄目前看過的最大層寬度，先設為 0。", V(), snap());
      q.push({ node: tree.root, idx: 0 });
      pos[tree.root.id] = 0;
      push(7, "根節點入佇列", "tag-insert", `q.push({${tree.root.val}, 0})`, `把根節點與它的位置編號 0 一起放入佇列。`,
        V(), snap([{ from: `wb-node-tree-${tree.root.id}`, to: "wb-queue-q-0", label: "編號 0", color: "purple" }]));

      while (q.length) {
        level += 1;
        size = q.length;
        left = q[0].idx;
        right = left;
        levelIds = [];
        push(10, `開始第 ${level} 層`, "default", `size = ${size}, left = ${left}`,
          `佇列目前有 ${size} 個節點，正好是第 ${level} 層的所有節點；最左節點的編號 left = ${left}。`,
          V(), snap([{ from: "wb-queue-q-0", to: "wb-var-left", label: "front 編號", color: "blue" }]));
        for (let t = 0; t < size; t++) {
          const { node, idx } = q.shift();
          cur = node;
          right = idx;
          levelIds.push(node.id);
          push(13, "取出節點", "tag-check", `node = ${node.val}, idx = ${idx}, right = ${idx}`,
            `從佇列前端取出節點 ${node.val}（編號 ${idx}），並把 right 更新為 ${idx}；這一層最後取出的節點編號就是最右端。`,
            V(), snap([{ from: `wb-node-tree-${node.id}`, to: "wb-var-right", label: `idx ${idx}`, color: "blue" }]));
          if (node.left) {
            const ci = 2 * idx + 1;
            q.push({ node: node.left, idx: ci });
            pos[node.left.id] = ci;
            push(14, "左子節點入佇列", "tag-insert", `q.push({${node.left.val}, 2*${idx}+1 = ${ci}})`,
              `節點 ${node.val} 有左子節點 ${node.left.val}，編號為 2 × ${idx} + 1 = ${ci}，放入佇列尾端。`,
              V(), snap([{ from: `wb-node-tree-${node.left.id}`, to: `wb-queue-q-${q.length - 1}`, label: `編號 ${ci}`, color: "purple" }]));
          }
          if (node.right) {
            const ci = 2 * idx + 2;
            q.push({ node: node.right, idx: ci });
            pos[node.right.id] = ci;
            push(15, "右子節點入佇列", "tag-insert", `q.push({${node.right.val}, 2*${idx}+2 = ${ci}})`,
              `節點 ${node.val} 有右子節點 ${node.right.val}，編號為 2 × ${idx} + 2 = ${ci}，放入佇列尾端。`,
              V(), snap([{ from: `wb-node-tree-${node.right.id}`, to: `wb-queue-q-${q.length - 1}`, label: `編號 ${ci}`, color: "purple" }]));
          }
          doneIds.add(node.id);
        }
        cur = null;
        const oldBest = best;
        const width = right - left + 1;
        best = Math.max(best, width);
        push(17, best > oldBest ? "更新最大寬度" : "保持最大寬度", best > oldBest ? "tag-found" : "default",
          `best = max(${oldBest}, ${right} - ${left} + 1) = ${best}`,
          `第 ${level} 層的寬度為 ${right} - ${left} + 1 = ${width}${best > oldBest ? `，大於目前的 ${oldBest}，更新 best = ${best}。` : `，沒有超過目前的 best = ${oldBest}。`}`,
          V(), snap([{ from: "wb-var-right", to: "wb-var-best", label: `寬度 ${width}`, color: best > oldBest ? "green" : "blue" }]));
        levelIds = [];
      }

      size = null;
      ret = best;
      push(19, "回傳最大寬度", "tag-found", `return ${best}`, `佇列已空，所有層都處理完畢，最大寬度為 ${best}。`,
        V(), snap([{ from: "wb-var-best", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #106 Find K Closest Elements (LC #658, Medium)
  // ==========================================================================
  window.PROBLEMS["find-k-closest-elements"] = {
    id: 106,
    leetcodeId: 658,
    slug: "find-k-closest-elements",
    title: "658. Find K Closest Elements (尋找 K 個最接近的元素)",
    difficulty: "Medium",
    topic: "Binary Search / Sliding Window",
    mins: 30,
    complexity: "Time O(log(n - k) + k) · Space O(1)",
    argNames: ["arr", "k", "x"],
    description:
      "給定已排序的整數陣列 arr、整數 k 與 x，找出最接近 x 的 k 個數並以遞增順序回傳；距離相同時較小的數優先。答案必為 arr 中一段長度 k 的連續區間，因此對區間左端點 lo 在 [0, n - k] 上二分搜尋：比較視窗左端 arr[mid] 與視窗右側下一個元素 arr[mid + k] 到 x 的距離，若 x - arr[mid] > arr[mid + k] - x，代表左端比較遠，視窗應右移（lo = mid + 1），否則 hi = mid。時間 O(log(n - k) + k)，不計輸出的額外空間 O(1)。",

    presets: [
      { name: "範例 1：arr = [1,2,3,4,5], k = 4, x = 3", args: [[1, 2, 3, 4, 5], 4, 3] },
      { name: "範例 2：arr = [1,1,2,3,4,5], k = 4, x = -1", args: [[1, 1, 2, 3, 4, 5], 4, -1] },
      { name: "x 在中間：arr = [1,3,5,7,9,11,13,15], k = 3, x = 8", args: [[1, 3, 5, 7, 9, 11, 13, 15], 3, 8] },
      { name: "x 大於全部：arr = [2,4,6,8,10], k = 2, x = 20", args: [[2, 4, 6, 8, 10], 2, 20] }
    ],

    cppLines: cpp(`
class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        int lo = 0, hi = arr.size() - k;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (x - arr[mid] > arr[mid + k] - x)
                lo = mid + 1;  // arr[mid] 較遠，視窗右移
            else
                hi = mid;      // arr[mid + k] 不比較近，保留左側
        }
        return vector<int>(arr.begin() + lo, arr.begin() + lo + k);
    }
};
`),

    generateTrace(arrInput, kInput, xInput) {
      const arr = Array.isArray(arrInput) ? arrInput.map(Number) : [];
      const k = Number(kInput);
      const x = Number(xInput);
      const n = arr.length;
      const { steps, push } = makeRecorder();
      let lo = 0;
      let hi = n - k;
      let mid = null;
      let dl = null;
      let dr = null;
      let result = null;
      const show = (v) => (v === null ? "-" : String(v));

      const V = () => ({ lo, hi, mid: show(mid), "x - arr[mid]": show(dl), "arr[mid+k] - x": show(dr), return: result ? fmtArr(result) : "-" });

      const snap = (conn = []) => {
        const pointers = [];
        if (!result) {
          pointers.push({ idx: lo, label: "lo", color: "blue" });
          if (hi !== lo) pointers.push({ idx: hi, label: "hi", color: "red" });
          if (mid !== null) {
            pointers.push({ idx: mid, label: "mid", color: "purple" });
            pointers.push({ idx: mid + k, label: "mid+k", color: "green" });
          }
        }
        const done = [];
        const match = [];
        arr.forEach((_, i) => {
          if (result) {
            if (i >= lo && i < lo + k) match.push(i);
            else done.push(i);
          } else if (i < lo || i > hi + k - 1) done.push(i);
        });
        const boards = [
          {
            id: "arr",
            type: "array",
            name: "arr",
            typeLabel: "已排序陣列 (vector&lt;int&gt;)",
            x: 325,
            y: 52,
            values: arr.map(esc),
            hl: mid !== null && !result ? [mid, mid + k] : [],
            match,
            done,
            pointers
          },
          varsBoard([
            { id: "kx", name: "k, x", val: `${k}, ${x}` },
            { id: "lo", name: "lo", val: String(lo), status: "hl" },
            { id: "hi", name: "hi", val: String(hi) },
            { id: "mid", name: "mid", val: show(mid) },
            { id: "dl", name: "x - arr[mid]", val: show(dl) },
            { id: "dr", name: "arr[mid+k] - x", val: show(dr) },
            { id: "ret", name: "return", val: result ? fmtArr(result) : "-", status: result ? "match" : "" }
          ])
        ];
        if (result) {
          boards.push({ id: "res", type: "array", name: "result", typeLabel: "回傳 (vector&lt;int&gt;)", x: 325, y: 175, values: result.map(esc), match: result.map((_, i) => i) });
        }
        return { boards, connectors: conn };
      };

      push(4, "設定左端點的搜尋範圍", "default", `lo = 0, hi = ${n} - ${k} = ${hi}`,
        `答案是一段長度 ${k} 的連續區間，其左端點只可能落在 [0, ${hi}]。用二分搜尋找出最佳左端點 lo。（灰色為已排除的元素。）`, V(), snap());

      while (lo < hi) {
        push(5, "繼續二分", "tag-check", `${lo} < ${hi} ➜ true`, `lo = ${lo} 仍小於 hi = ${hi}，左端點尚未確定。`, V(), snap());
        mid = lo + Math.floor((hi - lo) / 2);
        dl = null;
        dr = null;
        push(6, "計算 mid", "default", `mid = ${lo} + (${hi} - ${lo}) / 2 = ${mid}`,
          `取中間的候選左端點 mid = ${mid}，視窗為 arr[${mid}..${mid + k - 1}]，要和視窗右側的下一個元素 arr[${mid + k}] 比較。`, V(), snap());
        dl = x - arr[mid];
        dr = arr[mid + k] - x;
        const goRight = dl > dr;
        push(7, "比較兩端距離", "tag-check", `${x} - ${arr[mid]} = ${dl} ${goRight ? ">" : "≤"} ${arr[mid + k]} - ${x} = ${dr}`,
          goRight
            ? `arr[${mid}] = ${arr[mid]} 離 x 比 arr[${mid + k}] = ${arr[mid + k]} 更遠（${dl} > ${dr}），左端點應該往右移。`
            : `arr[${mid + k}] = ${arr[mid + k]} 並沒有比 arr[${mid}] = ${arr[mid]} 更接近 x（距離相同時較小的數優先），最佳左端點在 mid 或其左側。`,
          V(), snap([
            { from: `wb-cw-arr-${mid}`, to: "wb-var-dl", label: "左端距離", color: "purple" },
            { from: `wb-cw-arr-${mid + k}`, to: "wb-var-dr", label: "右側距離", color: "green" }
          ]));
        if (goRight) {
          lo = mid + 1;
          push(8, "視窗右移", "tag-insert", `lo = ${mid} + 1 = ${lo}`, `排除左端點 ≤ ${mid} 的所有視窗，lo 更新為 ${lo}。`, V(), snap());
        } else {
          hi = mid;
          push(10, "保留左側", "tag-insert", `hi = ${mid}`, `排除左端點 > ${mid} 的視窗，hi 更新為 ${mid}。`, V(), snap());
        }
        mid = null;
        dl = null;
        dr = null;
      }

      push(5, "二分結束", "tag-check", `lo = hi = ${lo}`, `lo 與 hi 相遇於 ${lo}，最佳視窗的左端點確定為 ${lo}。`, V(), snap());
      result = arr.slice(lo, lo + k);
      push(12, "回傳最接近的 k 個數", "tag-found", `return arr[${lo}..${lo + k - 1}] = ${fmtArr(result)}`,
        `從 arr[${lo}] 開始取 ${k} 個元素，得到 ${fmtArr(result)}，已依遞增順序排列。`,
        V(), snap([{ from: `wb-cw-arr-${lo}`, to: "wb-cw-res-0", label: "複製視窗", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #107 Longest Repeating Character Replacement (LC #424, Medium)
  // ==========================================================================
  window.PROBLEMS["longest-repeating-character-replacement"] = {
    id: 107,
    leetcodeId: 424,
    slug: "longest-repeating-character-replacement",
    title: "424. Longest Repeating Character Replacement (替換後的最長重複字元)",
    difficulty: "Medium",
    topic: "String / Sliding Window",
    mins: 30,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["s", "k"],
    description:
      "給定只含大寫英文字母的字串 s 與整數 k，最多可以把 k 個字元改成任意大寫字母，求改完後只含同一種字母的最長子字串長度。使用滑動視窗並以 count 陣列統計視窗內各字母數量，maxFreq 為視窗中出現最多的字母次數：視窗長度減去 maxFreq 就是需要替換的字元數，超過 k 時把左端右移縮小視窗。maxFreq 不需在縮小時回降，因為只有更大的 maxFreq 才能產生更長的答案。時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：s = \"ABAB\", k = 2", args: ["ABAB", 2] },
      { name: "範例 2：s = \"AABABBA\", k = 1", args: ["AABABBA", 1] },
      { name: "不需替換：s = \"AAAB\", k = 0", args: ["AAAB", 0] },
      { name: "全部不同：s = \"ABCDE\", k = 1", args: ["ABCDE", 1] }
    ],

    cppLines: cpp(`
class Solution {
public:
    int characterReplacement(string s, int k) {
        vector<int> count(26, 0);
        int left = 0, maxFreq = 0, best = 0;
        for (int right = 0; right < s.size(); right++) {
            maxFreq = max(maxFreq, ++count[s[right] - 'A']);
            while (right - left + 1 - maxFreq > k) {
                count[s[left] - 'A']--;
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};
`),

    generateTrace(sInput, kInput) {
      const s = String(sInput || "");
      const k = Number(kInput);
      const chars = s.split("");
      const { steps, push } = makeRecorder();
      const count = {};
      const seen = [];
      let left = 0;
      let right = -1;
      let maxFreq = 0;
      let best = 0;
      let ret = null;
      const show = (v) => (v === null ? "-" : String(v));
      const win = () => (right >= left ? right - left + 1 : 0);

      const V = () => ({ left, right: right < 0 ? "-" : right, 視窗長度: win(), maxFreq, 需替換: win() - maxFreq, best, return: show(ret) });

      const snap = (conn = [], rowSt = {}) => {
        const hl = [];
        for (let i = left; i <= right; i++) hl.push(i);
        const pointers = [];
        if (ret === null && right >= 0) {
          pointers.push({ idx: left, label: "left", color: "blue" });
          if (right !== left) pointers.push({ idx: right, label: "right", color: "red" });
          else pointers[0].label = "left / right";
        }
        return {
          boards: [
            {
              id: "s",
              type: "array",
              name: "s",
              typeLabel: "字串 (string)",
              x: 325,
              y: 52,
              values: chars.map(esc),
              hl: ret === null ? hl : [],
              match: ret === null ? [] : [],
              done: chars.map((_, i) => i).filter((i) => i < left),
              pointers
            },
            {
              id: "count",
              type: "dict",
              name: "count",
              typeLabel: "視窗內字母次數 (vector&lt;int&gt;(26))",
              x: 325,
              y: 175,
              headers: ["字母", "次數", "狀態"],
              rows: seen.map((ch) => ({ id: `c${ch}`, key: esc(ch), val: String(count[ch]), note: rowSt[ch] ? rowSt[ch][1] : count[ch] === maxFreq && maxFreq > 0 ? "= maxFreq" : "", status: rowSt[ch] ? rowSt[ch][0] : "" }))
            },
            varsBoard([
              { id: "left", name: "left", val: String(left) },
              { id: "right", name: "right", val: right < 0 ? "-" : String(right) },
              { id: "maxFreq", name: "maxFreq", val: String(maxFreq) },
              { id: "need", name: "需替換 = 長度 - maxFreq", val: `${win()} - ${maxFreq} = ${win() - maxFreq}`, status: win() - maxFreq > k ? "warn" : "" },
              { id: "best", name: "best", val: String(best) },
              { id: "ret", name: "return", val: show(ret), status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      push(5, "初始化", "default", "left = 0, maxFreq = 0, best = 0",
        `count 統計視窗內每個字母的次數。視窗長度減去出現最多的字母次數 maxFreq，就是需要替換的字元數，必須不超過 k = ${k}。`, V(), snap());

      for (right = 0; right < chars.length; right++) {
        const ch = chars[right];
        if (count[ch] === undefined) {
          count[ch] = 0;
          seen.push(ch);
        }
        count[ch] += 1;
        const oldMax = maxFreq;
        maxFreq = Math.max(maxFreq, count[ch]);
        push(7, "右端納入字元", "tag-insert", `++count['${ch}'] = ${count[ch]}, maxFreq = ${maxFreq}`,
          `right 移到 ${right}，把 '${ch}' 加入視窗，count['${ch}'] 變為 ${count[ch]}；maxFreq = max(${oldMax}, ${count[ch]}) = ${maxFreq}。`,
          V(), snap([{ from: `wb-cw-s-${right}`, to: `wb-dict-row-c${ch}`, label: `count['${ch}']++`, color: "purple" }], { [ch]: ["inserted", "+1"] }));

        while (win() - maxFreq > k) {
          push(8, "替換數超過 k", "tag-check", `${win()} - ${maxFreq} = ${win() - maxFreq} > ${k}`,
            `視窗長度 ${win()} 減去 maxFreq ${maxFreq} 等於 ${win() - maxFreq}，需要替換的字元超過 k = ${k}，必須縮小視窗。`,
            V(), snap([{ from: "wb-var-need", to: "wb-var-left", label: "需縮小", color: "red" }]));
          const lc = chars[left];
          count[lc] -= 1;
          left += 1;
          push(9, "左端移出字元", "tag-check", `count['${lc}']-- ➜ ${count[lc]}, left = ${left}`,
            `把左端字元 '${lc}' 移出視窗，count['${lc}'] 減為 ${count[lc]}，left 前進到 ${left}。（maxFreq 不回降，不影響答案正確性。）`,
            V(), snap([{ from: `wb-cw-s-${left - 1}`, to: `wb-dict-row-c${lc}`, label: `count['${lc}']--`, color: "red" }], { [lc]: ["hit", "-1"] }));
        }
        push(8, "視窗合法", "tag-check", `${win()} - ${maxFreq} = ${win() - maxFreq} ≤ ${k}`,
          `需要替換的字元數 ${win() - maxFreq} 不超過 k = ${k}，目前視窗 s[${left}..${right}] 可以全部變成同一字母。`, V(), snap());
        const oldBest = best;
        best = Math.max(best, win());
        push(12, best > oldBest ? "更新最長長度" : "保持最長長度", best > oldBest ? "tag-found" : "default",
          `best = max(${oldBest}, ${win()}) = ${best}`,
          best > oldBest ? `視窗長度 ${win()} 超過目前的 ${oldBest}，更新 best = ${best}。` : `視窗長度 ${win()} 沒有超過 best = ${oldBest}。`,
          V(), snap([{ from: `wb-cw-s-${right}`, to: "wb-var-best", label: `長度 ${win()}`, color: best > oldBest ? "green" : "blue" }]));
      }

      right = chars.length - 1;
      ret = best;
      push(14, "回傳答案", "tag-found", `return ${best}`, `右端走完整個字串，最多替換 ${k} 個字元後的最長重複字母子字串長度為 ${best}。`,
        V(), snap([{ from: "wb-var-best", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #108 Median of Two Sorted Arrays (LC #4, Hard)
  // ==========================================================================
  window.PROBLEMS["median-of-two-sorted-arrays"] = {
    id: 108,
    leetcodeId: 4,
    slug: "median-of-two-sorted-arrays",
    title: "4. Median of Two Sorted Arrays (尋找兩個正序陣列的中位數)",
    difficulty: "Hard",
    topic: "Array / Binary Search",
    mins: 40,
    complexity: "Time O(log(min(m, n))) · Space O(1)",
    argNames: ["nums1", "nums2"],
    description:
      "給定兩個已排序的陣列 nums1 與 nums2（長度 m、n），求合併後的中位數，要求 O(log(m + n))。在較短的陣列 A 上二分搜尋切分點 i，並令另一陣列 B 的切分點 j = (m + n + 1) / 2 - i，使左半部共有一半的元素。當 A[i - 1] ≤ B[j] 且 B[j - 1] ≤ A[i] 時，左半部所有元素都不大於右半部：總數為奇數時中位數為左半最大值，偶數時為左半最大值與右半最小值的平均。若 A[i - 1] > B[j] 則 i 太大往左找，否則往右找。邊界以 INT_MIN／INT_MAX 代替。時間 O(log(min(m, n)))、空間 O(1)。",

    presets: [
      { name: "範例 1：nums1 = [1,3], nums2 = [2]", args: [[1, 3], [2]] },
      { name: "範例 2：nums1 = [1,2], nums2 = [3,4]", args: [[1, 2], [3, 4]] },
      { name: "需多次二分：nums1 = [1,3,8,9,15], nums2 = [7,11,18,19,21,25]", args: [[1, 3, 8, 9, 15], [7, 11, 18, 19, 21, 25]] },
      { name: "一邊為空：nums1 = [], nums2 = [1,4]", args: [[], [1, 4]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
        if (A.size() > B.size()) return findMedianSortedArrays(B, A);
        int m = A.size(), n = B.size();
        int lo = 0, hi = m, half = (m + n + 1) / 2;
        while (lo <= hi) {
            int i = lo + (hi - lo) / 2;  // A 左半取 i 個
            int j = half - i;            // B 左半取 j 個
            int aL = i == 0 ? INT_MIN : A[i - 1];
            int aR = i == m ? INT_MAX : A[i];
            int bL = j == 0 ? INT_MIN : B[j - 1];
            int bR = j == n ? INT_MAX : B[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2 == 1) return max(aL, bL);
                return (max(aL, bL) + (double)min(aR, bR)) / 2.0;
            } else if (aL > bR) {
                hi = i - 1;
            } else {
                lo = i + 1;
            }
        }
        return 0.0;
    }
};
`),

    generateTrace(aInput, bInput) {
      let A = Array.isArray(aInput) ? aInput.map(Number) : [];
      let B = Array.isArray(bInput) ? bInput.map(Number) : [];
      let nameA = "nums1";
      let nameB = "nums2";
      const { steps, push } = makeRecorder();
      let m = null;
      let n = null;
      let lo = null;
      let hi = null;
      let half = null;
      let i = null;
      let j = null;
      let aL = null;
      let aR = null;
      let bL = null;
      let bR = null;
      let ret = null;
      const show = (v) => (v === null ? "-" : v === -Infinity ? "INT_MIN" : v === Infinity ? "INT_MAX" : String(v));

      const V = () => ({ m: show(m), n: show(n), lo: show(lo), hi: show(hi), half: show(half), i: show(i), j: show(j), aL: show(aL), aR: show(aR), bL: show(bL), bR: show(bR), return: show(ret) });

      const arrBoard = (id, name, vals, cut, y) => {
        const hl = [];
        const pointers = [];
        if (cut !== null) {
          for (let t = 0; t < cut; t++) hl.push(t);
          if (cut - 1 >= 0) pointers.push({ idx: cut - 1, label: id === "A" ? "aL" : "bL", color: "blue" });
          if (cut < vals.length) pointers.push({ idx: cut, label: id === "A" ? "aR" : "bR", color: "red" });
        }
        return {
          id,
          type: "array",
          name: `${id} (${name})`,
          typeLabel: cut !== null ? `左半取 ${cut} 個（黃色）` : "已排序陣列 (vector&lt;int&gt;)",
          x: 325,
          y,
          values: vals.map(esc),
          hl: ret !== null ? [] : hl,
          match: ret !== null && cut !== null ? hl : [],
          pointers
        };
      };

      const snap = (conn = []) => ({
        boards: [
          arrBoard("A", nameA, A, i, 52),
          arrBoard("B", nameB, B, j, 170),
          varsBoard([
            { id: "mn", name: "m, n", val: m === null ? "-" : `${m}, ${n}` },
            { id: "lohi", name: "lo, hi", val: lo === null ? "-" : `${lo}, ${hi}` },
            { id: "half", name: "half", val: show(half) },
            { id: "ij", name: "i, j", val: i === null ? "-" : `${i}, ${j}`, status: i !== null && ret === null ? "hl" : "" },
            { id: "aL", name: "aL", val: show(aL) },
            { id: "aR", name: "aR", val: show(aR) },
            { id: "bL", name: "bL", val: show(bL) },
            { id: "bR", name: "bR", val: show(bR) },
            { id: "ret", name: "return", val: show(ret), status: ret !== null ? "match" : "" }
          ], "切分點與邊界值", 205)
        ],
        connectors: conn
      });

      if (A.length > B.length) {
        push(4, "交換為較短陣列在前", "tag-check", `${A.length} > ${B.length} ➜ swap`,
          `nums1 長度 ${A.length} 大於 nums2 長度 ${B.length}，以交換參數的方式重新呼叫，確保在較短的陣列上二分搜尋，切分點 j 才不會超出範圍。`, V(), snap());
        [A, B] = [B, A];
        [nameA, nameB] = [nameB, nameA];
      } else {
        push(4, "確認 A 為較短陣列", "tag-check", `${A.length} ≤ ${B.length}`, `A 的長度 ${A.length} 不大於 B 的長度 ${B.length}，直接在 A 上二分搜尋切分點。`, V(), snap());
      }
      m = A.length;
      n = B.length;
      push(5, "取得長度", "default", `m = ${m}, n = ${n}`, `A 有 ${m} 個元素，B 有 ${n} 個元素，合併後共 ${m + n} 個。`, V(), snap());
      lo = 0;
      hi = m;
      half = Math.floor((m + n + 1) / 2);
      push(6, "設定搜尋範圍", "default", `lo = 0, hi = ${m}, half = ${half}`,
        `切分點 i 表示 A 的前 i 個元素放進左半部，可能值為 0..${m}。左半部總共要有 half = (${m} + ${n} + 1) / 2 = ${half} 個元素。`, V(), snap());

      while (lo <= hi) {
        i = lo + Math.floor((hi - lo) / 2);
        j = half - i;
        aL = aR = bL = bR = null;
        push(9, "決定切分點", "default", `i = ${i}, j = ${half} - ${i} = ${j}`,
          `A 取前 ${i} 個、B 取前 ${j} 個組成左半部（黃色），合計 ${half} 個。`, V(), snap());
        aL = i === 0 ? -Infinity : A[i - 1];
        aR = i === m ? Infinity : A[i];
        bL = j === 0 ? -Infinity : B[j - 1];
        bR = j === n ? Infinity : B[j];
        const conn = [];
        if (i > 0) conn.push({ from: `wb-cw-A-${i - 1}`, to: "wb-var-aL", label: "aL", color: "blue" });
        if (j < n) conn.push({ from: `wb-cw-B-${j}`, to: "wb-var-bR", label: "bR", color: "red" });
        push(13, "讀取四個邊界值", "tag-check", `aL=${show(aL)}, aR=${show(aR)}, bL=${show(bL)}, bR=${show(bR)}`,
          "取出切分線兩側的四個值；切分點落在陣列端點時以 INT_MIN／INT_MAX 代替，表示該側沒有元素。", V(), snap(conn));
        if (aL <= bR && bL <= aR) {
          push(14, "切分合法", "tag-found", `${show(aL)} ≤ ${show(bR)} 且 ${show(bL)} ≤ ${show(aR)}`,
            "左半部的最大值都不超過右半部的最小值，找到正確的切分位置。", V(), snap());
          const leftMax = Math.max(aL, bL);
          if ((m + n) % 2 === 1) {
            ret = leftMax.toFixed(5);
            push(15, "總數為奇數", "tag-found", `return max(${show(aL)}, ${show(bL)}) = ${leftMax}`,
              `合併後共 ${m + n} 個（奇數），中位數就是左半部的最大值 ${leftMax}。`,
              V(), snap([{ from: "wb-var-aL", to: "wb-var-ret", label: "左半最大", color: "green" }]));
          } else {
            const rightMin = Math.min(aR, bR);
            ret = ((leftMax + rightMin) / 2).toFixed(5);
            push(16, "總數為偶數", "tag-found", `return (${leftMax} + ${rightMin}) / 2.0 = ${ret}`,
              `合併後共 ${m + n} 個（偶數），中位數為左半最大值 ${leftMax} 與右半最小值 ${rightMin} 的平均 = ${ret}。`,
              V(), snap([{ from: "wb-var-bR", to: "wb-var-ret", label: "平均", color: "green" }]));
          }
          return steps;
        } else if (aL > bR) {
          push(17, "A 左半太大", "tag-check", `aL = ${show(aL)} > bR = ${show(bR)}`,
            `A 左半的最大值 ${show(aL)} 大於 B 右半的最小值 ${show(bR)}，代表 A 放進左半的元素太多，i 要變小。`, V(), snap());
          hi = i - 1;
          push(18, "往左搜尋", "tag-insert", `hi = ${i} - 1 = ${hi}`, `把搜尋範圍縮小為 [${lo}, ${hi}]。`, V(), snap());
        } else {
          push(19, "A 左半太小", "tag-check", `bL = ${show(bL)} > aR = ${show(aR)}`,
            `B 左半的最大值 ${show(bL)} 大於 A 右半的最小值 ${show(aR)}，代表 A 放進左半的元素太少，i 要變大。`, V(), snap());
          lo = i + 1;
          push(20, "往右搜尋", "tag-insert", `lo = ${i} + 1 = ${lo}`, `把搜尋範圍縮小為 [${lo}, ${hi}]。`, V(), snap());
        }
      }
      ret = (0).toFixed(5);
      push(23, "未找到（輸入不合法）", "tag-found", "return 0.0", "兩個陣列都必須已排序；正常輸入不會走到這一行。", V(), snap());
      return steps;
    }
  };

  // ==========================================================================
  // #109 Same Tree (LC #100, Easy)
  // ==========================================================================
  window.PROBLEMS["same-tree"] = {
    id: 109,
    leetcodeId: 100,
    slug: "same-tree",
    title: "100. Same Tree (相同的樹)",
    difficulty: "Easy",
    topic: "Binary Tree / DFS",
    mins: 20,
    complexity: "Time O(n) · Space O(h)",
    argNames: ["p", "q"],
    description:
      "給定兩棵二元樹的根節點 p 與 q，判斷它們是否相同：結構完全一致且對應位置的節點值也相同。以遞迴同步走訪兩棵樹：兩邊都為空時相同；只有一邊為空或數值不同時不相同；否則左子樹與右子樹都必須相同。使用 && 短路，左子樹不同時不再比較右子樹。時間 O(n)，遞迴堆疊空間 O(h)。",

    presets: [
      { name: "範例 1：p = [1,2,3], q = [1,2,3]", args: [[1, 2, 3], [1, 2, 3]] },
      { name: "範例 2：p = [1,2], q = [1,null,2]", args: [[1, 2], [1, null, 2]] },
      { name: "範例 3：p = [1,2,1], q = [1,1,2]", args: [[1, 2, 1], [1, 1, 2]] },
      { name: "較大樹：p = [4,2,6,1,3,5,7], q = [4,2,6,1,3,5,7]", args: [[4, 2, 6, 1, 3, 5, 7], [4, 2, 6, 1, 3, 5, 7]] },
      { name: "邊界情況：p = [], q = []", args: [[], []] }
    ],

    cppLines: cpp(`
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) return true;           // 兩邊皆空
        if (!p || !q) return false;          // 只有一邊為空
        if (p->val != q->val) return false;  // 數值不同
        return isSameTree(p->left, q->left) &&
               isSameTree(p->right, q->right);
    }
};
`),

    generateTrace(pInput, qInput) {
      const P = buildTreeFromLevelOrder(Array.isArray(pInput) ? pInput.slice() : [], 300);
      const Q = buildTreeFromLevelOrder(Array.isArray(qInput) ? qInput.slice() : [], 300);
      const { steps, push } = makeRecorder();
      const pSt = {};
      const qSt = {};
      const frames = [];
      let curP = null;
      let curQ = null;
      let ret = null;
      const lab = (nd) => (nd ? String(nd.val) : "∅");
      const pid = (nd) => (nd ? `wb-node-pt-${nd.id}` : "wb-dyn-pt");
      const qid = (nd) => (nd ? `wb-node-qt-${nd.id}` : "wb-dyn-qt");

      const V = () => ({ p: curP ? `Node(${curP.val})` : "nullptr", q: curQ ? `Node(${curQ.val})` : "nullptr", 遞迴深度: frames.length, return: ret === null ? "-" : ret });

      const treeBoard = (id, name, T, st, curNode, x) => ({
        id,
        type: "tree",
        shape: "circle",
        name,
        typeLabel: "二元樹 (TreeNode*)",
        x,
        y: 52,
        width: T.width,
        height: Math.max(P.height, Q.height),
        nodes: T.nodes.map((nd) => ({
          id: nd.id,
          val: esc(nd.val),
          x: nd.x,
          y: nd.y,
          status: curNode && curNode.id === nd.id && ret === null ? "hl" : st[nd.id] || "",
          ptr: curNode && curNode.id === nd.id && ret === null ? id === "pt" ? "p" : "q" : ""
        })),
        edges: T.edges.map((e) => ({ ...e }))
      });

      const snap = (conn = []) => ({
        boards: [
          treeBoard("pt", "p", P, pSt, curP, 325),
          treeBoard("qt", "q", Q, qSt, curQ, 325 + P.width + 24),
          {
            id: "calls",
            type: "stack",
            name: "呼叫堆疊",
            typeLabel: "isSameTree(p, q) 遞迴框架",
            x: 325,
            y: 52 + Math.max(P.height, Q.height) + 26,
            items: frames.map((f, idx) => ({ val: esc(f), status: idx === frames.length - 1 && ret === null ? "hl" : "" }))
          },
          varsBoard([
            { id: "p", name: "p", val: V().p, status: curP ? "hl" : "" },
            { id: "q", name: "q", val: V().q, status: curQ ? "hl" : "" },
            { id: "depth", name: "遞迴深度", val: String(frames.length) },
            { id: "ret", name: "return", val: ret === null ? "-" : ret, status: ret !== null ? (ret === "true" ? "match" : "warn") : "" }
          ])
        ],
        connectors: conn
      });

      const rec = (p, q) => {
        frames.push(`isSameTree(${lab(p)}, ${lab(q)})`);
        curP = p;
        curQ = q;
        push(3, "進入遞迴", "default", `isSameTree(${lab(p)}, ${lab(q)})`,
          `比較 p = ${p ? `節點 ${p.val}` : "nullptr"} 與 q = ${q ? `節點 ${q.val}` : "nullptr"} 這兩棵子樹（∅ 代表 nullptr）。`,
          V(), snap(p && q ? [{ from: pid(p), to: qid(q), label: "比較", color: "blue" }] : []));
        if (!p && !q) {
          push(4, "兩邊皆為空", "tag-found", "!p && !q ➜ return true", "兩邊都是 nullptr，空樹與空樹相同，回傳 true。", V(), snap());
          frames.pop();
          return true;
        }
        if (!p || !q) {
          const one = p || q;
          if (p) pSt[p.id] = "warn";
          if (q) qSt[q.id] = "warn";
          push(5, "只有一邊為空", "tag-check", "!p || !q ➜ return false",
            `一邊是 nullptr、另一邊是節點 ${one.val}，結構不同，回傳 false。`,
            V(), snap([{ from: p ? pid(p) : qid(q), to: p ? "wb-dyn-qt" : "wb-dyn-pt", label: "對面為空", color: "red" }]));
          frames.pop();
          return false;
        }
        if (p.val !== q.val) {
          pSt[p.id] = "warn";
          qSt[q.id] = "warn";
          push(6, "數值不同", "tag-check", `${p.val} != ${q.val} ➜ return false`, `p->val = ${p.val} 與 q->val = ${q.val} 不同，回傳 false。`,
            V(), snap([{ from: pid(p), to: qid(q), label: "≠", color: "red" }]));
          frames.pop();
          return false;
        }
        pSt[p.id] = "match";
        qSt[q.id] = "match";
        push(7, "數值相同，比較左子樹", "tag-check", `${p.val} == ${q.val} ➜ isSameTree(${lab(p.left)}, ${lab(q.left)})`,
          `兩個節點的值都是 ${p.val}，接著遞迴比較左子樹 (${lab(p.left)}, ${lab(q.left)})。`,
          V(), snap([{ from: pid(p), to: qid(q), label: "相等", color: "green" }]));
        const L = rec(p.left, q.left);
        curP = p;
        curQ = q;
        if (!L) {
          push(7, "左子樹不同，短路", "tag-check", "false && ... ➜ return false",
            `節點 ${p.val} 的左子樹不同，&& 短路，不需要再比較右子樹，直接回傳 false。`, V(), snap());
          frames.pop();
          return false;
        }
        push(8, "左子樹相同，比較右子樹", "default", `isSameTree(${lab(p.right)}, ${lab(q.right)})`,
          `節點 ${p.val} 的左子樹相同，接著遞迴比較右子樹 (${lab(p.right)}, ${lab(q.right)})。`, V(), snap());
        const R = rec(p.right, q.right);
        curP = p;
        curQ = q;
        push(8, R ? "左右子樹皆相同" : "右子樹不同", R ? "tag-found" : "tag-check", `return ${R}`,
          R ? `節點 ${p.val} 的值、左子樹、右子樹都相同，這兩棵子樹相同，回傳 true。` : `節點 ${p.val} 的右子樹不同，回傳 false。`,
          V(), snap(R ? [{ from: pid(p), to: qid(q), label: "子樹相同", color: "green" }] : []));
        frames.pop();
        return R;
      };

      const result = rec(P.root, Q.root);
      curP = P.root;
      curQ = Q.root;
      ret = String(result);
      const last = steps[steps.length - 1];
      push(last.line, "最外層回傳結果", result ? "tag-found" : "tag-check", `return ${ret}`,
        result ? "所有對應位置的節點都相同，兩棵樹相同，回傳 true。" : "在某個位置發現結構或數值不同，兩棵樹不相同，回傳 false。",
        V(), snap(P.root ? [{ from: pid(P.root), to: "wb-var-ret", label: ret, color: result ? "green" : "red" }] : []));
      return steps;
    }
  };

  // ==========================================================================
  // #110 Number of 1 Bits (LC #191, Easy)
  // ==========================================================================
  window.PROBLEMS["number-of-1-bits"] = {
    id: 110,
    leetcodeId: 191,
    slug: "number-of-1-bits",
    title: "191. Number of 1 Bits (位元為 1 的個數)",
    difficulty: "Easy",
    topic: "Bit Manipulation",
    mins: 15,
    complexity: "Time O(1 的個數) · Space O(1)",
    argNames: ["n"],
    description:
      "給定正整數 n，回傳其二進位表示中 1 的個數（漢明重量）。利用 n & (n - 1) 會消去 n 最低位的 1 的性質：n - 1 會把最低位的 1 變成 0，並把它右邊的 0 全部變成 1，兩者做 AND 後恰好只少了那一個 1。重複直到 n 變為 0，執行次數就是 1 的個數。時間 O(1 的個數)，最多 31 次，空間 O(1)。",

    presets: [
      { name: "範例 1：n = 11 (1011)", args: [11] },
      { name: "範例 2：n = 128 (10000000)", args: [128] },
      { name: "範例 3：n = 2147483645", args: [2147483645] },
      { name: "連續的 1：n = 255", args: [255] }
    ],

    cppLines: cpp(`
class Solution {
public:
    int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= n - 1;  // 消去最低位的 1
            count++;
        }
        return count;
    }
};
`),

    generateTrace(nInput) {
      const n0 = Math.trunc(Number(nInput)) >>> 0;
      let n = n0;
      const W = Math.max(8, n0.toString(2).length);
      const { steps, push } = makeRecorder();
      let count = 0;
      let ret = null;
      let showMinus = false;
      const bits = (v) => (v >>> 0).toString(2).padStart(W, "0").slice(-W).split("");
      const labels = Array.from({ length: W }, (_, i) => W - 1 - i);
      const lowIdx = (v) => (v === 0 ? -1 : W - 1 - Math.log2(v & -v));

      const V = () => ({ n, "n (二進位)": (n >>> 0).toString(2), count, return: ret === null ? "-" : ret });

      const snap = (conn = [], low = -1) => {
        const nb = bits(n);
        const boards = [
          {
            id: "nbits",
            type: "array",
            name: "n",
            typeLabel: `二進位位元 (int，顯示低 ${W} 位)`,
            x: 325,
            y: 52,
            values: nb,
            indexLabels: labels,
            hl: nb.map((b, i) => (b === "1" && i !== low ? i : -1)).filter((i) => i >= 0),
            warn: low >= 0 ? [low] : [],
            match: ret !== null ? [] : []
          }
        ];
        if (showMinus) {
          const mb = bits(n - 1);
          boards.push({
            id: "mbits",
            type: "array",
            name: "n - 1",
            typeLabel: "最低位的 1 變 0，右側的 0 全變 1",
            x: 325,
            y: 170,
            values: mb,
            indexLabels: labels,
            hl: mb.map((b, i) => (b === "1" ? i : -1)).filter((i) => i >= 0),
            warn: low >= 0 ? [low] : []
          });
        }
        boards.push(varsBoard([
          { id: "n", name: "n", val: String(n), status: "hl" },
          { id: "count", name: "count", val: String(count) },
          { id: "ret", name: "return", val: ret === null ? "-" : String(ret), status: ret !== null ? "match" : "" }
        ]));
        return { boards, connectors: conn };
      };

      push(4, "初始化計數器", "default", "count = 0", `n = ${n0} 的二進位為 ${n0.toString(2)}。count 記錄消去了幾個 1，先設為 0。`, V(), snap());
      while (n !== 0) {
        const low = lowIdx(n);
        push(5, "n 不為 0", "tag-check", `n = ${n} != 0`, `n 還有位元為 1（黃色），最低位的 1 在第 ${W - 1 - low} 位（紅色），繼續消去。`, V(), snap([], low));
        showMinus = true;
        const before = n;
        const after = (n & (n - 1)) >>> 0;
        push(6, "計算 n & (n - 1)", "tag-check", `${before} & ${before - 1} = ${after}`,
          `n - 1 = ${before - 1}：最低位的 1 變成 0，它右側的 0 全部變成 1。兩者做 AND，只有那一個 1 被消去，其他位元不變。`,
          V(), snap([{ from: `wb-cw-mbits-${low}`, to: `wb-cw-nbits-${low}`, label: "AND 消去", color: "red" }], low));
        n = after;
        showMinus = false;
        push(6, "寫回 n", "tag-insert", `n = ${n}`, `n 更新為 ${n}（二進位 ${(n >>> 0).toString(2)}），原本最低位的 1 已經變成 0。`,
          V(), snap([{ from: `wb-cw-nbits-${low}`, to: "wb-var-n", label: "n 更新", color: "purple" }]));
        count += 1;
        push(7, "計數加一", "tag-insert", `count = ${count}`, `成功消去一個 1，count 增加為 ${count}。`, V(), snap([{ from: "wb-var-n", to: "wb-var-count", label: "+1", color: "green" }]));
      }
      push(5, "n 變為 0", "tag-check", "n == 0 ➜ 結束迴圈", "所有位元都是 0，已經沒有 1 可以消去。", V(), snap());
      ret = count;
      push(9, "回傳 1 的個數", "tag-found", `return ${count}`, `${n0} 的二進位 ${n0.toString(2)} 中共有 ${count} 個 1。`,
        V(), snap([{ from: "wb-var-count", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };

  // ==========================================================================
  // #111 Longest Common Prefix (LC #14, Easy)
  // ==========================================================================
  window.PROBLEMS["longest-common-prefix"] = {
    id: 111,
    leetcodeId: 14,
    slug: "longest-common-prefix",
    title: "14. Longest Common Prefix (最長公共前綴)",
    difficulty: "Easy",
    topic: "String",
    mins: 20,
    complexity: "Time O(S) · Space O(1)",
    argNames: ["strs"],
    description:
      "給定字串陣列 strs，找出所有字串共同擁有的最長前綴；若不存在則回傳空字串。採用縱向掃描：以第一個字串為基準，逐一檢查第 i 個字元，並與其他每個字串的第 i 個字元比較；一旦某個字串長度不足或字元不同，前 i 個字元就是答案。若第一個字串全部比對成功，答案就是第一個字串本身。時間 O(S)，S 為所有字串的字元總數，額外空間 O(1)。",

    presets: [
      { name: "範例 1：strs = [\"flower\",\"flow\",\"flight\"]", args: [["flower", "flow", "flight"]] },
      { name: "範例 2：strs = [\"dog\",\"racecar\",\"car\"]", args: [["dog", "racecar", "car"]] },
      { name: "較長前綴：strs = [\"interview\",\"internet\",\"interval\"]", args: [["interview", "internet", "interval"]] },
      { name: "基準字串最短：strs = [\"ab\",\"abc\",\"abd\"]", args: [["ab", "abc", "abd"]] },
      { name: "邊界情況：strs = [\"a\"]", args: [["a"]] }
    ],

    cppLines: cpp(`
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        for (int i = 0; i < strs[0].size(); i++) {
            char c = strs[0][i];
            for (int j = 1; j < strs.size(); j++) {
                if (i == strs[j].size() || strs[j][i] != c)
                    return strs[0].substr(0, i);
            }
        }
        return strs[0];
    }
};
`),

    generateTrace(strsInput) {
      const strs = Array.isArray(strsInput) ? strsInput.map(String) : [""];
      const maxLen = Math.max(1, ...strs.map((s) => s.length));
      const { steps, push } = makeRecorder();
      let i = -1;
      let j = -1;
      let c = null;
      let ret = null;
      const q = (x) => `"${x}"`;

      const V = () => ({ i: i < 0 ? "-" : i, j: j < 0 ? "-" : j, c: c === null ? "-" : `'${c}'`, 前綴: q(strs[0].slice(0, Math.max(0, i))), return: ret === null ? "-" : q(ret) });

      const snap = (conn = [], warnCell = null) => {
        const hl = [];
        const match = [];
        const done = [];
        strs.forEach((s, r) => {
          for (let col = 0; col < maxLen; col++) {
            const key = `${r},${col}`;
            if (ret !== null) {
              if (col < ret.length) match.push(key);
            } else if (col < i) match.push(key);
            else if (col === i && (r === 0 || r < j)) hl.push(key);
            else if (col === i && r === j) hl.push(key);
            if (col >= s.length) done.push(key);
          }
        });
        return {
          boards: [
            {
              id: "g",
              type: "grid",
              name: "strs",
              typeLabel: "每列一個字串，每欄一個字元位置",
              x: 325,
              y: 52,
              cells: strs.map((s) => Array.from({ length: maxLen }, (_, col) => (col < s.length ? esc(s[col]) : "·"))),
              rowLabels: strs.map((_, r) => `strs[${r}]`),
              hl,
              match,
              done,
              warn: warnCell ? [warnCell] : []
            },
            varsBoard([
              { id: "i", name: "i", val: i < 0 ? "-" : String(i) },
              { id: "j", name: "j", val: j < 0 ? "-" : String(j) },
              { id: "c", name: "c", val: c === null ? "-" : `'${esc(c)}'`, status: c !== null && ret === null ? "hl" : "" },
              { id: "pre", name: "目前前綴", val: esc(q(strs[0].slice(0, Math.max(0, ret !== null ? ret.length : i)))) },
              { id: "ret", name: "return", val: ret === null ? "-" : esc(q(ret)), status: ret !== null ? "match" : "" }
            ])
          ],
          connectors: conn
        };
      };

      push(4, "以 strs[0] 為基準", "default", `strs[0] = "${strs[0]}"`,
        `以第一個字串 "${strs[0]}" 為基準，逐一檢查每個字元位置 i 是否在所有字串中都相同。`, V(), snap());

      for (i = 0; i < strs[0].length; i++) {
        c = strs[0][i];
        j = -1;
        push(5, "取基準字元", "default", `c = strs[0][${i}] = '${c}'`, `取出基準字串的第 ${i} 個字元 '${c}'，接著和其他字串的同一位置比較。`,
          V(), snap([{ from: `wb-grid-g-0-${i}`, to: "wb-var-c", label: `c = '${c}'`, color: "blue" }]));
        for (j = 1; j < strs.length; j++) {
          const s = strs[j];
          if (i === s.length || s[i] !== c) {
            const short = i === s.length;
            ret = strs[0].slice(0, i);
            push(8, "不相符，回傳前綴", "tag-found",
              short ? `i == strs[${j}].size() ➜ return "${ret}"` : `strs[${j}][${i}] = '${s[i]}' != '${c}' ➜ return "${ret}"`,
              short
                ? `strs[${j}] = "${s}" 長度只有 ${s.length}，沒有第 ${i} 個字元，公共前綴只能到前 ${i} 個字元："${ret}"。`
                : `strs[${j}] 的第 ${i} 個字元是 '${s[i]}'，與 '${c}' 不同，公共前綴為前 ${i} 個字元："${ret}"。`,
              V(), snap([{ from: `wb-grid-g-${j}-${i}`, to: "wb-var-ret", label: short ? "長度不足" : "字元不同", color: "red" }], `${j},${i}`));
            return steps;
          }
          push(7, "字元相同", "tag-check", `strs[${j}][${i}] = '${s[i]}' == '${c}'`, `strs[${j}] 的第 ${i} 個字元也是 '${c}'，繼續檢查下一個字串。`,
            V(), snap([{ from: `wb-grid-g-${j}-${i}`, to: "wb-var-c", label: "相同", color: "green" }]));
        }
      }
      i = strs[0].length;
      j = -1;
      c = null;
      ret = strs[0];
      push(11, "基準字串全部相符", "tag-found", `return "${ret}"`, `基準字串 "${ret}" 的每個字元都出現在所有字串的相同位置，整個 strs[0] 就是最長公共前綴。`,
        V(), snap([{ from: "wb-var-pre", to: "wb-var-ret", label: "答案", color: "green" }]));
      return steps;
    }
  };
})();

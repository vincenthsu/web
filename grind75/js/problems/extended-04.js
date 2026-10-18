/**
 * Grind 75 延伸題 — Problems #112 to #123
 * C++17 單步執行代碼與 Trace-by-Hand 宣告式白板狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

(() => {
  // ==========================================================================
  // 共用輔助函式（僅限本檔使用）
  // ==========================================================================
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const CPP_KW = new Set([
    "class", "public", "private", "return", "if", "else", "while", "for", "auto", "bool", "int", "void",
    "true", "false", "nullptr", "new", "continue", "break", "const", "struct"
  ]);
  const CPP_TYPES = new Set([
    "Solution", "TreeNode", "ListNode", "vector", "string", "stack", "queue", "pair", "priority_queue",
    "unordered_map", "set", "greater"
  ]);

  // 將純文字 C++ 原始碼行轉為帶 .tok-* 上色的 cppLines（自動轉義 < > &）。
  function cppHighlight(src) {
    let code = src;
    let cmt = "";
    const ci = src.indexOf("//");
    if (ci >= 0) {
      code = src.slice(0, ci);
      cmt = src.slice(ci);
    }
    let out = "";
    let i = 0;
    while (i < code.length) {
      const ch = code[i];
      if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < code.length && /\w/.test(code[j])) j++;
        const word = code.slice(i, j);
        let k = j;
        while (k < code.length && code[k] === " ") k++;
        if (CPP_KW.has(word)) out += `<span class="tok-kw">${word}</span>`;
        else if (CPP_TYPES.has(word)) out += `<span class="tok-type">${word}</span>`;
        else if (code[k] === "(" && !/^(sizeof)$/.test(word)) out += `<span class="tok-fn">${word}</span>`;
        else out += word;
        i = j;
      } else if (/\d/.test(ch)) {
        let j = i;
        while (j < code.length && /\d/.test(code[j])) j++;
        out += `<span class="tok-num">${code.slice(i, j)}</span>`;
        i = j;
      } else {
        out += esc(ch);
        i++;
      }
    }
    if (cmt) out += `<span class="tok-cmt">${esc(cmt)}</span>`;
    return out;
  }
  const cpp = (lines) => lines.map((code, idx) => ({ line: idx + 1, code: cppHighlight(code) }));

  const V = (id, name, val, status = "") => ({ id, name, val: esc(val), status });
  const varsBoard = (items, typeLabel = "關鍵變數與算式", y = 215) => ({
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
  // #112 Inorder Successor in BST (LC #285, Medium)
  // ==========================================================================
  window.PROBLEMS["inorder-successor-in-bst"] = {
    id: 112,
    leetcodeId: 285,
    slug: "inorder-successor-in-bst",
    title: "285. Inorder Successor in BST (二元搜尋樹中的中序後繼)",
    difficulty: "Medium",
    topic: "Binary Search Tree",
    mins: 30,
    complexity: "Time O(H) · Space O(1)",
    argNames: ["root", "p"],
    description:
      "給定二元搜尋樹的根節點 root 與樹中某個節點 p，找出 p 在中序走訪中的下一個節點（值大於 p->val 的最小節點）；若不存在則回傳 nullptr。利用 BST 性質從根往下走：若 p->val 小於目前節點值，目前節點就是候選後繼，記下後往左子樹找更小的候選；否則後繼一定在右側，往右子樹走。只走一條根到葉的路徑，時間 O(H)、額外空間 O(1)。",

    presets: [
      { name: "範例 1：root = [2,1,3], p = 1", args: [[2, 1, 3], 1] },
      { name: "範例 2：root = [5,3,6,2,4,null,null,1], p = 6（無後繼）", args: [[5, 3, 6, 2, 4, null, null, 1], 6] },
      { name: "範例 3：root = [5,3,6,2,4,null,null,1], p = 4（後繼是祖先）", args: [[5, 3, 6, 2, 4, null, null, 1], 4] },
      {
        name: "範例 4：root = [20,8,22,4,12,null,null,null,null,10,14], p = 8（後繼在右子樹）",
        args: [[20, 8, 22, 4, 12, null, null, null, null, 10, 14], 8]
      }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    TreeNode* inorderSuccessor(TreeNode* root, TreeNode* p) {",
      "        TreeNode* succ = nullptr;",
      "        while (root != nullptr) {",
      "            if (p->val < root->val) {",
      "                succ = root;          // 目前節點是候選後繼",
      "                root = root->left;    // 往左找更小的候選",
      "            } else {",
      "                root = root->right;   // 後繼必在右側",
      "            }",
      "        }",
      "        return succ;",
      "    }",
      "};"
    ]),

    generateTrace(rootArr, pVal) {
      const steps = [];
      const tree = buildTreeFromLevelOrder(Array.isArray(rootArr) ? rootArr.slice() : [], 620);
      const p = Number(pVal);
      const pNode = tree.nodes.find((n) => n.val === p) || null;
      let root = tree.root;
      let succ = null;
      const walked = new Set();

      const snap = (retVal = "-", connectors = []) => {
        const nodes = tree.nodes.map((n) => {
          const ptrs = [];
          if (root && root.id === n.id) ptrs.push("root");
          if (succ && succ.id === n.id) ptrs.push("succ");
          if (pNode && pNode.id === n.id) ptrs.push("p");
          let status = "";
          if (succ && succ.id === n.id) status = "match";
          else if (root && root.id === n.id) status = "hl";
          else if (pNode && pNode.id === n.id) status = "warn";
          else if (walked.has(n.id)) status = "done";
          return { id: n.id, val: String(n.val), x: n.x, y: n.y, status, ptr: ptrs.join(" / ") };
        });
        const edges = tree.edges.map((e) => ({ ...e, status: walked.has(e.from) && walked.has(e.to) ? "hl" : "" }));
        return {
          boards: [
            {
              id: "bst",
              type: "tree",
              shape: "circle",
              name: "root",
              typeLabel: "二元搜尋樹 (TreeNode*)",
              x: 325,
              y: 52,
              width: tree.width,
              height: tree.height,
              nodes,
              edges
            },
            varsBoard([
              V("p", "p->val", p, "warn"),
              V("root", "root", root ? `Node(${root.val})` : "nullptr", root ? "hl" : ""),
              V("succ", "succ", succ ? `Node(${succ.val})` : "nullptr", succ ? "hl" : ""),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        "p->val": String(p),
        root: root ? String(root.val) : "nullptr",
        succ: succ ? String(succ.val) : "nullptr",
        return: ret
      });

      steps.push({
        line: 4,
        tag: "初始化候選後繼",
        tagType: "default",
        inlineBadge: "succ = nullptr",
        explanation: `目標是找出中序走訪中排在 ${p} 後面的節點。先把候選後繼 succ 設為 nullptr，從根節點 ${root ? root.val : "nullptr"} 開始往下走。`,
        vars: vars(),
        state: snap()
      });

      while (root) {
        walked.add(root.id);
        steps.push({
          line: 5,
          tag: "檢查 root 是否為空",
          tagType: "tag-check",
          inlineBadge: `root = Node(${root.val}) ≠ nullptr`,
          explanation: `root 指向節點 ${root.val}，不是空指標，繼續比較。`,
          vars: vars(),
          state: snap()
        });
        const goLeft = p < root.val;
        steps.push({
          line: 6,
          tag: "比較 p 與目前節點",
          tagType: "tag-check",
          inlineBadge: `${p} < ${root.val} ➜ ${goLeft}`,
          explanation: goLeft
            ? `p->val = ${p} 小於 ${root.val}，所以 ${root.val} 比 p 大，可能是後繼；但左子樹裡可能還有更小且仍大於 ${p} 的節點。`
            : `p->val = ${p} 不小於 ${root.val}，${root.val} 與它的左子樹都不可能是後繼，答案只會在右子樹。`,
          vars: vars(),
          state: snap("-", [{ from: "wb-var-p", to: `wb-node-bst-${root.id}`, label: `${p} < ${root.val} ?`, color: "blue" }])
        });
        if (goLeft) {
          succ = root;
          steps.push({
            line: 7,
            tag: "更新候選後繼",
            tagType: "tag-insert",
            inlineBadge: `succ = Node(${succ.val})`,
            explanation: `記錄 succ = ${succ.val}。這是目前看過比 ${p} 大的節點中最小的一個。`,
            vars: vars(),
            state: snap("-", [{ from: `wb-node-bst-${succ.id}`, to: "wb-var-succ", label: "succ = root", color: "purple" }])
          });
          root = root.left;
          steps.push({
            line: 8,
            tag: "往左子樹移動",
            tagType: "default",
            inlineBadge: `root = ${root ? `Node(${root.val})` : "nullptr"}`,
            explanation: root
              ? `往左子節點 ${root.val} 移動，尋找更接近 ${p} 的候選。`
              : `左子節點是 nullptr，沒有更小的候選了。`,
            vars: vars(),
            state: snap()
          });
        } else {
          root = root.right;
          steps.push({
            line: 10,
            tag: "往右子樹移動",
            tagType: "default",
            inlineBadge: `root = ${root ? `Node(${root.val})` : "nullptr"}`,
            explanation: root ? `往右子節點 ${root.val} 移動。` : `右子節點是 nullptr，走到底了。`,
            vars: vars(),
            state: snap()
          });
        }
      }

      steps.push({
        line: 5,
        tag: "走到空節點，結束迴圈",
        tagType: "tag-check",
        inlineBadge: "root == nullptr",
        explanation: "root 已變成 nullptr，整條搜尋路徑走完，succ 中保存的就是答案。",
        vars: vars(),
        state: snap()
      });
      const ret = succ ? `Node(${succ.val})` : "nullptr";
      steps.push({
        line: 13,
        tag: "回傳中序後繼",
        tagType: "tag-found",
        inlineBadge: `return ${ret}`,
        explanation: succ
          ? `回傳 succ = ${succ.val}：它是樹中大於 ${p} 的最小值，也就是中序走訪中 ${p} 的下一個節點。`
          : `succ 仍為 nullptr，表示樹中沒有比 ${p} 更大的值，${p} 是中序走訪的最後一個節點，回傳 nullptr。`,
        vars: vars(succ ? String(succ.val) : "null"),
        state: snap(succ ? String(succ.val) : "null", succ ? [{ from: `wb-node-bst-${succ.id}`, to: "wb-var-ret", label: "中序後繼", color: "green" }] : [])
      });
      return steps;
    }
  };

  // ==========================================================================
  // #113 Jump Game (LC #55, Medium)
  // ==========================================================================
  window.PROBLEMS["jump-game"] = {
    id: 113,
    leetcodeId: 55,
    slug: "jump-game",
    title: "55. Jump Game (跳躍遊戲)",
    difficulty: "Medium",
    topic: "Array / Greedy",
    mins: 20,
    complexity: "Time O(n) · Space O(1)",
    argNames: ["nums"],
    description:
      "給定非負整數陣列 nums，從索引 0 出發，nums[i] 表示在位置 i 最多可以往前跳幾格，判斷能否抵達最後一個索引。貪婪法：維護目前能到達的最遠索引 farthest，從左到右掃描；若某個 i 已經超過 farthest，代表 i 根本到不了，回傳 false；否則用 i + nums[i] 更新 farthest，一旦 farthest 覆蓋最後一格即回傳 true。時間 O(n)、空間 O(1)。",

    presets: [
      { name: "範例 1：nums = [2,3,1,1,4]", args: [[2, 3, 1, 1, 4]] },
      { name: "範例 2：nums = [3,2,1,0,4]（卡在 0）", args: [[3, 2, 1, 0, 4]] },
      { name: "邊界情況：nums = [0]（起點即終點）", args: [[0]] },
      { name: "範例 4：nums = [1,0,1,0]", args: [[1, 0, 1, 0]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    bool canJump(vector<int>& nums) {",
      "        int farthest = 0;   // 目前能到達的最遠索引",
      "        for (int i = 0; i < (int)nums.size(); ++i) {",
      "            if (i > farthest) return false;",
      "            farthest = max(farthest, i + nums[i]);",
      "            if (farthest >= (int)nums.size() - 1) return true;",
      "        }",
      "        return true;",
      "    }",
      "};"
    ]),

    generateTrace(numsIn) {
      const nums = Array.isArray(numsIn) ? numsIn.slice() : [];
      const n = nums.length;
      const steps = [];
      let farthest = 0;
      let i = -1;

      const snap = (opts = {}) => {
        const { retVal = "-", warnI = false, success = false, connectors = [] } = opts;
        const done = [];
        for (let k = 0; k < n && k <= farthest; k++) if (k !== i) done.push(k);
        const pointers = [];
        if (i >= 0 && i < n) pointers.push({ idx: i, label: `i = ${i}`, color: warnI ? "red" : "blue" });
        const fIdx = Math.min(farthest, n - 1);
        if (n && fIdx !== i) pointers.push({ idx: fIdx, label: "farthest", color: "purple" });
        return {
          boards: [
            {
              id: "nums",
              type: "array",
              name: "nums",
              typeLabel: "跳躍長度 (vector<int>)",
              x: 325,
              y: 52,
              values: nums,
              hl: i >= 0 && !warnI ? [i] : [],
              warn: warnI ? [i] : [],
              match: success ? [n - 1] : [],
              done,
              pointers
            },
            varsBoard([
              V("i", "i", i >= 0 ? i : "-", i >= 0 ? "hl" : ""),
              V("numsi", "nums[i]", i >= 0 && i < n ? nums[i] : "-"),
              V("far", "farthest", farthest, "hl"),
              V("last", "nums.size() - 1", n - 1),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        i: i >= 0 ? String(i) : "-",
        "nums[i]": i >= 0 && i < n ? String(nums[i]) : "-",
        farthest: String(farthest),
        return: ret
      });

      steps.push({
        line: 4,
        tag: "初始化最遠可達位置",
        tagType: "default",
        inlineBadge: "farthest = 0",
        explanation: `從索引 0 出發，一開始只能確定索引 0 可到達，所以 farthest = 0。終點是索引 ${n - 1}。`,
        vars: vars(),
        state: snap()
      });

      for (i = 0; i < n; i++) {
        if (i > farthest) {
          steps.push({
            line: 6,
            tag: "位置不可達",
            tagType: "tag-found",
            inlineBadge: `${i} > ${farthest} ➜ return false`,
            explanation: `索引 ${i} 已經超過最遠可達位置 ${farthest}，前面沒有任何格子能跳到這裡，更不可能到達終點，回傳 false。`,
            vars: vars("false"),
            state: snap({ retVal: "false", warnI: true, connectors: [{ from: `wb-cw-nums-${i}`, to: "wb-var-far", label: `${i} > ${farthest}`, color: "red" }] })
          });
          return steps;
        }
        steps.push({
          line: 6,
          tag: "確認位置可達",
          tagType: "tag-check",
          inlineBadge: `${i} > ${farthest} ➜ false`,
          explanation: `索引 ${i} 不超過 farthest = ${farthest}，代表可以到達這一格，可以從這裡繼續往前跳。`,
          vars: vars(),
          state: snap()
        });
        const reach = i + nums[i];
        const old = farthest;
        farthest = Math.max(farthest, reach);
        steps.push({
          line: 7,
          tag: "更新最遠可達位置",
          tagType: farthest > old ? "tag-insert" : "tag-check",
          inlineBadge: `max(${old}, ${i}+${nums[i]}) = ${farthest}`,
          explanation:
            farthest > old
              ? `從索引 ${i} 最多跳 ${nums[i]} 格，可到達 ${reach}，比原本的 ${old} 更遠，更新 farthest = ${farthest}。`
              : `從索引 ${i} 最多只能到 ${reach}，沒有超過原本的 ${old}，farthest 維持 ${farthest}。`,
          vars: vars(),
          state: snap({ connectors: [{ from: `wb-cw-nums-${i}`, to: "wb-var-far", label: `${i} + ${nums[i]} = ${reach}`, color: "purple" }] })
        });
        if (farthest >= n - 1) {
          steps.push({
            line: 8,
            tag: "可以抵達終點",
            tagType: "tag-found",
            inlineBadge: `${farthest} >= ${n - 1} ➜ return true`,
            explanation: `farthest = ${farthest} 已涵蓋最後一個索引 ${n - 1}，確定能跳到終點，回傳 true。`,
            vars: vars("true"),
            state: snap({ retVal: "true", success: true, connectors: [{ from: "wb-var-far", to: `wb-cw-nums-${n - 1}`, label: "抵達終點", color: "green" }] })
          });
          return steps;
        }
        steps.push({
          line: 8,
          tag: "尚未覆蓋終點",
          tagType: "tag-check",
          inlineBadge: `${farthest} >= ${n - 1} ➜ false`,
          explanation: `farthest = ${farthest} 還沒到終點 ${n - 1}，繼續檢查下一個索引。`,
          vars: vars(),
          state: snap()
        });
      }
      i = n;
      steps.push({
        line: 10,
        tag: "掃描結束",
        tagType: "tag-found",
        inlineBadge: "return true",
        explanation: "所有索引都檢查完畢且皆可到達，回傳 true。",
        vars: vars("true"),
        state: snap({ retVal: "true", success: true })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #114 Add Two Numbers (LC #2, Medium)
  // ==========================================================================
  window.PROBLEMS["add-two-numbers"] = {
    id: 114,
    leetcodeId: 2,
    slug: "add-two-numbers",
    title: "2. Add Two Numbers (兩數相加)",
    difficulty: "Medium",
    topic: "Linked List / Math",
    mins: 25,
    complexity: "Time O(max(m, n)) · Space O(1)（不含輸出）",
    argNames: ["l1", "l2"],
    description:
      "兩個非負整數以逆序（個位數在頭）存放在兩條鏈結串列 l1、l2 中，每個節點存一位數字，回傳兩數相加後同樣以逆序表示的串列。模擬直式加法：用 dummy 頭節點與 tail 指標建構答案，每輪把 carry 與兩串列目前位數相加，sum % 10 成為新節點、sum / 10 成為下一輪的進位；只要任一串列未走完或仍有進位就繼續。時間 O(max(m, n))。",

    presets: [
      { name: "範例 1：l1 = [2,4,3], l2 = [5,6,4]（342 + 465 = 807）", args: [[2, 4, 3], [5, 6, 4]] },
      { name: "邊界情況：l1 = [0], l2 = [0]", args: [[0], [0]] },
      { name: "範例 3：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]（連續進位）", args: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]] },
      { name: "範例 4：l1 = [5], l2 = [5]（最後仍有進位）", args: [[5], [5]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {",
      "        ListNode dummy(0);",
      "        ListNode* tail = &dummy;",
      "        int carry = 0;",
      "        while (l1 != nullptr || l2 != nullptr || carry != 0) {",
      "            int sum = carry;",
      "            if (l1 != nullptr) { sum += l1->val; l1 = l1->next; }",
      "            if (l2 != nullptr) { sum += l2->val; l2 = l2->next; }",
      "            carry = sum / 10;",
      "            tail->next = new ListNode(sum % 10);",
      "            tail = tail->next;",
      "        }",
      "        return dummy.next;",
      "    }",
      "};"
    ]),

    generateTrace(l1In, l2In) {
      const A = Array.isArray(l1In) ? l1In.slice() : [];
      const B = Array.isArray(l2In) ? l2In.slice() : [];
      const steps = [];
      const res = [];
      let p1 = A.length ? 0 : -1;
      let p2 = B.length ? 0 : -1;
      let carry = 0;
      let sum = "-";
      let tail = -1; // -1 代表 dummy

      const listBoard = (id, name, label, vals, ptrIdx, y, prefix, extra = {}) => {
        const spacing = 80;
        const startX = 50;
        const nodes = vals.map((v, idx) => ({
          id: `${prefix}${idx}`,
          val: String(v),
          x: startX + idx * spacing,
          y: 52,
          status: idx === ptrIdx ? "hl" : ptrIdx === -1 || idx < ptrIdx ? "done" : "",
          ptr: idx === ptrIdx ? name : ""
        }));
        const edges = [];
        for (let k = 0; k + 1 < vals.length; k++) edges.push({ from: `${prefix}${k}`, to: `${prefix}${k + 1}`, label: "next", dir: true });
        return {
          id,
          type: "list",
          shape: "list",
          name,
          typeLabel: label,
          x: 325,
          y,
          width: Math.max(440, startX + vals.length * spacing + 30),
          height: 110,
          nodes,
          edges,
          ...extra
        };
      };

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], newIdx = -1, final = false } = opts;
        const resNodes = [{ id: "d", val: "0", sub: "dummy", x: 50, y: 52, status: "done", ptr: tail === -1 ? "tail" : "" }];
        const resEdges = [];
        res.forEach((v, idx) => {
          resNodes.push({
            id: `r${idx}`,
            val: String(v),
            x: 50 + (idx + 1) * 80,
            y: 52,
            status: final ? "match" : idx === newIdx ? "hl" : "",
            ptr: tail === idx ? "tail" : ""
          });
          resEdges.push({ from: idx === 0 ? "d" : `r${idx - 1}`, to: `r${idx}`, label: "next", dir: true, status: idx === newIdx ? "hl" : final ? "match" : "" });
        });
        const resBoard = {
          id: "res",
          type: "list",
          shape: "list",
          name: "dummy → 結果",
          typeLabel: "答案串列 (ListNode*)",
          x: 325,
          y: 348,
          width: Math.max(440, 50 + (res.length + 1) * 80 + 30),
          height: 110,
          nodes: resNodes,
          edges: resEdges
        };
        return {
          boards: [
            listBoard("l1", "l1", "加數 1（逆序）", A, p1, 52, "a"),
            listBoard("l2", "l2", "加數 2（逆序）", B, p2, 200, "b"),
            resBoard,
            varsBoard([
              V("carry", "carry", carry, carry ? "hl" : ""),
              V("sum", "sum", sum, sum !== "-" ? "hl" : ""),
              V("l1", "l1", p1 >= 0 ? `Node(${A[p1]})` : "nullptr"),
              V("l2", "l2", p2 >= 0 ? `Node(${B[p2]})` : "nullptr"),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        l1: p1 >= 0 ? String(A[p1]) : "nullptr",
        l2: p2 >= 0 ? String(B[p2]) : "nullptr",
        carry: String(carry),
        sum: String(sum),
        tail: tail === -1 ? "dummy" : String(res[tail]),
        return: ret
      });

      steps.push({
        line: 5,
        tag: "建立 dummy 與 tail",
        tagType: "default",
        inlineBadge: "tail = &dummy",
        explanation: "建立值為 0 的 dummy 頭節點，tail 指向它；之後每算出一位就接在 tail 後面，最後回傳 dummy.next。",
        vars: vars(),
        state: snap()
      });
      steps.push({
        line: 6,
        tag: "進位歸零",
        tagType: "default",
        inlineBadge: "carry = 0",
        explanation: "最低位相加之前沒有進位，carry = 0。",
        vars: vars(),
        state: snap()
      });

      while (p1 >= 0 || p2 >= 0 || carry !== 0) {
        steps.push({
          line: 7,
          tag: "檢查是否還有位數",
          tagType: "tag-check",
          inlineBadge: `l1=${p1 >= 0 ? A[p1] : "null"}, l2=${p2 >= 0 ? B[p2] : "null"}, carry=${carry}`,
          explanation:
            p1 < 0 && p2 < 0
              ? `兩條串列都已走完，但 carry = ${carry} 還沒寫出，需要再補一位。`
              : "至少一條串列還有數字，繼續計算下一位。",
          vars: vars(),
          state: snap()
        });
        sum = carry;
        steps.push({
          line: 8,
          tag: "以進位作為起始和",
          tagType: "default",
          inlineBadge: `sum = ${carry}`,
          explanation: `本位的和先放入上一位留下的進位 ${carry}。`,
          vars: vars(),
          state: snap({ connectors: [{ from: "wb-var-carry", to: "wb-var-sum", label: "carry", color: "blue" }] })
        });
        if (p1 >= 0) {
          const v = A[p1];
          const from = `wb-node-l1-a${p1}`;
          sum += v;
          p1 = p1 + 1 < A.length ? p1 + 1 : -1;
          steps.push({
            line: 9,
            tag: "加上 l1 的位數",
            tagType: "tag-check",
            inlineBadge: `sum += ${v} ➜ ${sum}`,
            explanation: `l1 目前位數是 ${v}，加入後 sum = ${sum}，l1 前進到${p1 >= 0 ? `節點 ${A[p1]}` : " nullptr"}。`,
            vars: vars(),
            state: snap({ connectors: [{ from, to: "wb-var-sum", label: `+${v}`, color: "blue" }] })
          });
        } else {
          steps.push({
            line: 9,
            tag: "l1 已走完",
            tagType: "tag-check",
            inlineBadge: "l1 == nullptr",
            explanation: "l1 已經沒有節點，這一位視為 0，不加任何值。",
            vars: vars(),
            state: snap()
          });
        }
        if (p2 >= 0) {
          const v = B[p2];
          const from = `wb-node-l2-b${p2}`;
          sum += v;
          p2 = p2 + 1 < B.length ? p2 + 1 : -1;
          steps.push({
            line: 10,
            tag: "加上 l2 的位數",
            tagType: "tag-check",
            inlineBadge: `sum += ${v} ➜ ${sum}`,
            explanation: `l2 目前位數是 ${v}，加入後 sum = ${sum}，l2 前進到${p2 >= 0 ? `節點 ${B[p2]}` : " nullptr"}。`,
            vars: vars(),
            state: snap({ connectors: [{ from, to: "wb-var-sum", label: `+${v}`, color: "blue" }] })
          });
        } else {
          steps.push({
            line: 10,
            tag: "l2 已走完",
            tagType: "tag-check",
            inlineBadge: "l2 == nullptr",
            explanation: "l2 已經沒有節點，這一位視為 0，不加任何值。",
            vars: vars(),
            state: snap()
          });
        }
        carry = Math.floor(sum / 10);
        steps.push({
          line: 11,
          tag: "計算新進位",
          tagType: "default",
          inlineBadge: `carry = ${sum} / 10 = ${carry}`,
          explanation: carry ? `sum = ${sum} 達到 10 以上，向下一位進 ${carry}。` : `sum = ${sum} 小於 10，沒有進位。`,
          vars: vars(),
          state: snap({ connectors: [{ from: "wb-var-sum", to: "wb-var-carry", label: "/ 10", color: "purple" }] })
        });
        res.push(sum % 10);
        const newIdx = res.length - 1;
        steps.push({
          line: 12,
          tag: "建立本位節點",
          tagType: "tag-insert",
          inlineBadge: `new ListNode(${sum} % 10 = ${sum % 10})`,
          explanation: `本位數字是 ${sum} % 10 = ${sum % 10}，建立新節點接在 tail 後面。`,
          vars: vars(),
          state: snap({ newIdx, connectors: [{ from: "wb-var-sum", to: `wb-node-res-r${newIdx}`, label: `% 10 = ${sum % 10}`, color: "purple" }] })
        });
        tail = newIdx;
        steps.push({
          line: 13,
          tag: "tail 前進",
          tagType: "default",
          inlineBadge: `tail = Node(${res[tail]})`,
          explanation: "tail 移到剛建立的節點，準備接下一位。",
          vars: vars(),
          state: snap({ newIdx })
        });
      }

      steps.push({
        line: 7,
        tag: "全部位數處理完畢",
        tagType: "tag-check",
        inlineBadge: "l1 == l2 == nullptr && carry == 0",
        explanation: "兩條串列都走完而且沒有剩餘進位，離開迴圈。",
        vars: vars(),
        state: snap()
      });
      const out = fmtArr(res);
      steps.push({
        line: 15,
        tag: "回傳 dummy.next",
        tagType: "tag-found",
        inlineBadge: `return ${out}`,
        explanation: `dummy 後面接的就是答案串列 ${out}（逆序表示 ${[...res].reverse().join("")}）。`,
        vars: vars(out),
        state: snap({ retVal: out, final: true, connectors: res.length ? [{ from: "wb-node-res-r0", to: "wb-var-ret", label: "dummy.next", color: "green" }] : [] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #115 Generate Parentheses (LC #22, Medium)
  // ==========================================================================
  window.PROBLEMS["generate-parentheses"] = {
    id: 115,
    leetcodeId: 22,
    slug: "generate-parentheses",
    title: "22. Generate Parentheses (括號生成)",
    difficulty: "Medium",
    topic: "Recursion / Backtracking",
    mins: 25,
    complexity: "Time O(4^n / √n) · Space O(n)",
    argNames: ["n"],
    description:
      "給定括號對數 n，產生所有由 n 對小括號組成且合法的字串。回溯法：逐字元建構字串 cur，同時記錄已用的左括號 open 與右括號 close；只要 open < n 就能再放 '('，只有 close < open 時才能放 ')'，確保任何前綴都不會出現多餘的右括號。長度達 2n 時收集答案，回溯時把剛放入的字元彈出。結果數為第 n 個卡特蘭數。",

    presets: [
      { name: "範例 1：n = 3", args: [3] },
      { name: "邊界情況：n = 1", args: [1] },
      { name: "範例 3：n = 2", args: [2] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    vector<string> generateParenthesis(int n) {",
      "        vector<string> res;",
      "        string cur;",
      "        backtrack(n, 0, 0, cur, res);",
      "        return res;",
      "    }",
      "private:",
      "    void backtrack(int n, int open, int close, string& cur, vector<string>& res) {",
      "        if ((int)cur.size() == 2 * n) {",
      "            res.push_back(cur);",
      "            return;",
      "        }",
      "        if (open < n) {",
      "            cur.push_back('(');",
      "            backtrack(n, open + 1, close, cur, res);",
      "            cur.pop_back();",
      "        }",
      "        if (close < open) {",
      "            cur.push_back(')');",
      "            backtrack(n, open, close + 1, cur, res);",
      "            cur.pop_back();",
      "        }",
      "    }",
      "};"
    ]),

    generateTrace(nIn) {
      const n = Math.max(1, Number(nIn) || 1);
      const steps = [];
      const cur = [];
      const res = [];
      const frames = [];
      let open = 0;
      let close = 0;

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], newRes = -1, curHl = -1 } = opts;
        return {
          boards: [
            {
              id: "cur",
              type: "array",
              name: "cur",
              typeLabel: "目前字串 (string)",
              x: 325,
              y: 52,
              values: cur.map((c) => `'${c}'`),
              hl: curHl >= 0 ? [curHl] : [],
              match: cur.length === 2 * n ? cur.map((_, i) => i) : [],
              pointers: cur.length ? [{ idx: cur.length - 1, label: "back", color: "blue" }] : []
            },
            {
              id: "calls",
              type: "stack",
              name: "call stack",
              typeLabel: "遞迴呼叫堆疊",
              x: 325,
              y: 180,
              items: frames.map((f, i) => ({ val: `bt(open=${f.open}, close=${f.close})`, status: i === frames.length - 1 ? "hl" : "" }))
            },
            {
              id: "res",
              type: "set",
              name: "res",
              typeLabel: "結果 (vector<string>)",
              x: 620,
              y: 180,
              items: res.map((s, i) => ({ val: `"${s}"`, status: i === newRes ? "inserted" : retVal !== "-" ? "match" : "" }))
            },
            varsBoard([
              V("n", "n", n),
              V("open", "open", open, "hl"),
              V("close", "close", close, "hl"),
              V("cur", "cur", `"${cur.join("")}"`),
              V("cnt", "res.size()", res.length),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({ open: String(open), close: String(close), cur: `"${cur.join("")}"`, "res.size()": String(res.length), return: ret });

      steps.push({
        line: 6,
        tag: "啟動回溯",
        tagType: "default",
        inlineBadge: `backtrack(${n}, 0, 0, "", res)`,
        explanation: `以空字串開始回溯，目標長度為 2 × ${n} = ${2 * n}。`,
        vars: vars(),
        state: snap()
      });

      const bt = () => {
        frames.push({ open, close });
        if (cur.length === 2 * n) {
          steps.push({
            line: 11,
            tag: "長度已滿",
            tagType: "tag-check",
            inlineBadge: `cur.size() = ${cur.length} == ${2 * n}`,
            explanation: `cur = "${cur.join("")}" 已有 ${2 * n} 個字元，而且建構過程保證合法，可以收集。`,
            vars: vars(),
            state: snap()
          });
          res.push(cur.join(""));
          steps.push({
            line: 12,
            tag: "收集合法字串",
            tagType: "tag-found",
            inlineBadge: `res.push_back("${cur.join("")}")`,
            explanation: `把 "${cur.join("")}" 放入 res，目前共有 ${res.length} 個答案。`,
            vars: vars(),
            state: snap({ newRes: res.length - 1, connectors: [{ from: "wb-dyn-cur", to: `wb-chip-res-${res.length - 1}`, label: "push_back", color: "green" }] })
          });
          frames.pop();
          steps.push({
            line: 13,
            tag: "返回上一層",
            tagType: "default",
            inlineBadge: "return",
            explanation: "這條路徑結束，回到上一層呼叫繼續嘗試其他選擇。",
            vars: vars(),
            state: snap()
          });
          return;
        }
        steps.push({
          line: 11,
          tag: "進入遞迴",
          tagType: "tag-check",
          inlineBadge: `cur.size() = ${cur.length} < ${2 * n}`,
          explanation: `進入 backtrack(open=${open}, close=${close})，cur = "${cur.join("")}" 還沒填滿，繼續選下一個字元。`,
          vars: vars(),
          state: snap()
        });
        if (open < n) {
          cur.push("(");
          steps.push({
            line: 16,
            tag: "放入左括號",
            tagType: "tag-insert",
            inlineBadge: `open = ${open} < ${n} ➜ push '('`,
            explanation: `左括號只用了 ${open} 個（上限 ${n}），可以再放一個 '('，cur 變成 "${cur.join("")}"。`,
            vars: vars(),
            state: snap({ curHl: cur.length - 1, connectors: [{ from: "wb-var-open", to: `wb-cw-cur-${cur.length - 1}`, label: "'('", color: "purple" }] })
          });
          open++;
          bt();
          open--;
          cur.pop();
          steps.push({
            line: 18,
            tag: "回溯：移除 '('",
            tagType: "default",
            inlineBadge: `cur.pop_back() ➜ "${cur.join("")}"`,
            explanation: `從放 '(' 的分支回來，彈出它，cur 恢復成 "${cur.join("")}"，接著嘗試放 ')'。`,
            vars: vars(),
            state: snap()
          });
        } else {
          steps.push({
            line: 15,
            tag: "左括號已用完",
            tagType: "tag-check",
            inlineBadge: `open = ${open} == ${n}`,
            explanation: `已經放了 ${n} 個 '('，不能再放左括號。`,
            vars: vars(),
            state: snap()
          });
        }
        if (close < open) {
          cur.push(")");
          steps.push({
            line: 21,
            tag: "放入右括號",
            tagType: "tag-insert",
            inlineBadge: `close = ${close} < open = ${open} ➜ push ')'`,
            explanation: `目前有 ${open - close} 個 '(' 尚未配對，可以放 ')'，cur 變成 "${cur.join("")}"。`,
            vars: vars(),
            state: snap({ curHl: cur.length - 1, connectors: [{ from: "wb-var-close", to: `wb-cw-cur-${cur.length - 1}`, label: "')'", color: "purple" }] })
          });
          close++;
          bt();
          close--;
          cur.pop();
          steps.push({
            line: 23,
            tag: "回溯：移除 ')'",
            tagType: "default",
            inlineBadge: `cur.pop_back() ➜ "${cur.join("")}"`,
            explanation: `從放 ')' 的分支回來，彈出它，cur 恢復成 "${cur.join("")}"。`,
            vars: vars(),
            state: snap()
          });
        } else {
          steps.push({
            line: 20,
            tag: "不能放右括號",
            tagType: "tag-check",
            inlineBadge: `close = ${close} == open = ${open}`,
            explanation: "左右括號數量相同，此時放 ')' 會沒有可配對的 '('，跳過。",
            vars: vars(),
            state: snap()
          });
        }
        frames.pop();
      };
      bt();

      const out = `[${res.map((s) => `"${s}"`).join(",")}]`;
      steps.push({
        line: 7,
        tag: "回傳所有組合",
        tagType: "tag-found",
        inlineBadge: `return ${res.length} 個字串`,
        explanation: `回溯完成，共找到 ${res.length} 個合法括號字串：${res.join("、")}。`,
        vars: vars(out),
        state: snap({ retVal: out, connectors: [{ from: "wb-dyn-res", to: "wb-var-ret", label: "return res", color: "green" }] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #116 Sort List (LC #148, Medium)
  // ==========================================================================
  window.PROBLEMS["sort-list"] = {
    id: 116,
    leetcodeId: 148,
    slug: "sort-list",
    title: "148. Sort List (排序鏈結串列)",
    difficulty: "Medium",
    topic: "Linked List / Merge Sort",
    mins: 25,
    complexity: "Time O(n log n) · Space O(log n)",
    argNames: ["head"],
    description:
      "給定單向鏈結串列的頭節點 head，將串列依節點值遞增排序後回傳。採用由上而下的合併排序：以快慢指標找出中點，把 slow->next 斷開成左右兩半，分別遞迴排序後，再用 dummy 節點與 tail 指標把兩條已排序串列合併。只改變 next 指標、不複製節點，時間 O(n log n)，遞迴深度 O(log n)。",

    presets: [
      { name: "範例 1：head = [4,2,1,3]", args: [[4, 2, 1, 3]] },
      { name: "範例 2：head = [-1,5,3,4,0]", args: [[-1, 5, 3, 4, 0]] },
      { name: "邊界情況：head = []（空串列）", args: [[]] },
      { name: "範例 4：head = [3,1,3]（重複值）", args: [[3, 1, 3]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    ListNode* sortList(ListNode* head) {",
      "        if (head == nullptr || head->next == nullptr) return head;",
      "        ListNode* slow = head;",
      "        ListNode* fast = head->next;",
      "        while (fast != nullptr && fast->next != nullptr) {",
      "            slow = slow->next;",
      "            fast = fast->next->next;",
      "        }",
      "        ListNode* mid = slow->next;",
      "        slow->next = nullptr;              // 從中間斷開",
      "        ListNode* left = sortList(head);",
      "        ListNode* right = sortList(mid);",
      "        return merge(left, right);",
      "    }",
      "private:",
      "    ListNode* merge(ListNode* a, ListNode* b) {",
      "        ListNode dummy(0);",
      "        ListNode* tail = &dummy;",
      "        while (a != nullptr && b != nullptr) {",
      "            if (a->val <= b->val) { tail->next = a; a = a->next; }",
      "            else { tail->next = b; b = b->next; }",
      "            tail = tail->next;",
      "        }",
      "        tail->next = (a != nullptr) ? a : b;",
      "        return dummy.next;",
      "    }",
      "};"
    ]),

    generateTrace(headIn) {
      const vals = Array.isArray(headIn) ? headIn.slice() : [];
      const n = vals.length;
      const N = vals.map((v, i) => ({ id: `n${i}`, val: v, next: i + 1 < n ? i + 1 : -1 }));
      const steps = [];
      const frames = [];
      const nm = (i) => (i === -1 ? "nullptr" : `Node(${N[i].val})`);
      const chainVals = (h) => {
        const out = [];
        let c = h;
        let guard = 0;
        while (c !== -1 && guard++ < 20) {
          out.push(N[c].val);
          c = N[c].next;
        }
        return out;
      };
      const chainStr = (h) => (h === -1 ? "null" : chainVals(h).join("→"));

      const layout = () => {
        const indeg = new Array(n).fill(0);
        N.forEach((nd) => {
          if (nd.next !== -1) indeg[nd.next]++;
        });
        const chains = [];
        for (let i = 0; i < n; i++) {
          if (indeg[i] !== 0) continue;
          const ch = [];
          let c = i;
          while (c !== -1) {
            ch.push(c);
            c = N[c].next;
          }
          chains.push(ch);
        }
        chains.sort((x, y) => Math.min(...x) - Math.min(...y));
        const pos = {};
        let x = 46;
        chains.forEach((ch) => {
          ch.forEach((idx) => {
            pos[idx] = x;
            x += 78;
          });
          x += 34;
        });
        return { pos, width: Math.max(460, x + 10) };
      };

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hlEdge = -1, hlNodes = [], matchAll = false } = opts;
        const top = frames[frames.length - 1];
        const ptr = top ? top.ptr : {};
        const { pos, width } = layout();
        const nodes = N.map((nd, i) => {
          const labels = Object.keys(ptr).filter((k) => ptr[k] === i);
          let status = "";
          if (matchAll) status = "match";
          else if (hlNodes.includes(i)) status = "hl";
          else if (top && top.scope && top.scope.has(i)) status = "";
          else if (top && top.scope) status = "done";
          return { id: nd.id, val: String(nd.val), x: pos[i], y: 62, status, ptr: labels.join("/") };
        });
        const edges = [];
        N.forEach((nd, i) => {
          if (nd.next !== -1) edges.push({ from: nd.id, to: N[nd.next].id, label: "next", dir: true, status: i === hlEdge ? "hl" : matchAll ? "match" : "" });
        });
        const items = [V("fn", "目前函式", top ? top.label : "-")];
        Object.keys(ptr).forEach((k) => items.push(V(`v_${k}`, k, ptr[k] === -2 ? "&dummy" : nm(ptr[k]), "hl")));
        items.push(V("ret", "return", retVal, retVal !== "-" ? "match" : ""));
        return {
          boards: [
            {
              id: "list",
              type: "list",
              shape: "list",
              name: "nodes",
              typeLabel: "鏈結串列節點與 next 指標",
              x: 325,
              y: 52,
              width,
              height: 130,
              nodes,
              edges
            },
            {
              id: "calls",
              type: "stack",
              name: "call stack",
              typeLabel: "遞迴呼叫堆疊",
              x: 325,
              y: 225,
              items: frames.map((f, i) => ({ val: esc(f.label), status: i === frames.length - 1 ? "hl" : "" }))
            },
            varsBoard(items, "目前呼叫的指標")
          ],
          connectors
        };
      };
      const vars = (ret = "-") => {
        const top = frames[frames.length - 1];
        const o = { 函式: top ? top.label : "-" };
        if (top) Object.keys(top.ptr).forEach((k) => (o[k] = top.ptr[k] === -2 ? "dummy" : top.ptr[k] === -1 ? "nullptr" : String(N[top.ptr[k]].val)));
        o.return = ret;
        return o;
      };
      const scopeOf = (h) => {
        const s = new Set();
        let c = h;
        while (c !== -1) {
          s.add(c);
          c = N[c].next;
        }
        return s;
      };

      const merge = (a0, b0) => {
        const f = { label: `merge(${chainStr(a0)}, ${chainStr(b0)})`, ptr: { a: a0, b: b0, tail: -2 } };
        f.scope = new Set([...scopeOf(a0), ...scopeOf(b0)]);
        frames.push(f);
        let a = a0;
        let b = b0;
        let tail = -2;
        let dummyNext = -1;
        steps.push({
          line: 20,
          tag: "建立 dummy 準備合併",
          tagType: "default",
          inlineBadge: "tail = &dummy",
          explanation: `合併兩條已排序串列 [${chainStr(a0)}] 與 [${chainStr(b0)}]：建立 dummy 節點，tail 指向它。`,
          vars: vars(),
          state: snap()
        });
        while (a !== -1 && b !== -1) {
          const pickA = N[a].val <= N[b].val;
          const chosen = pickA ? a : b;
          const fromId = tail === -2 ? "wb-var-v_tail" : `wb-node-list-${N[tail].id}`;
          if (tail === -2) dummyNext = chosen;
          else N[tail].next = chosen;
          if (pickA) a = N[a].next;
          else b = N[b].next;
          f.ptr.a = a;
          f.ptr.b = b;
          steps.push({
            line: pickA ? 22 : 23,
            tag: pickA ? "接上 a 的節點" : "接上 b 的節點",
            tagType: "tag-insert",
            inlineBadge: `${N[chosen].val} ${pickA ? "<=" : "<"} ${pickA ? (b !== -1 ? N[b].val : "-") : a !== -1 ? N[a].val : "-"} ➜ tail->next = ${N[chosen].val}`,
            explanation: pickA
              ? `比較兩串列開頭：a 的 ${N[chosen].val} ≤ b 的 ${N[b].val}，把 ${N[chosen].val} 接到 tail 後面，a 前進到 ${a === -1 ? "nullptr" : N[a].val}。`
              : `比較兩串列開頭：b 的 ${N[chosen].val} < a 的 ${N[a].val}，把 ${N[chosen].val} 接到 tail 後面，b 前進到 ${b === -1 ? "nullptr" : N[b].val}。`,
            vars: vars(),
            state: snap({ hlNodes: [chosen], hlEdge: tail >= 0 ? tail : -1, connectors: [{ from: fromId, to: `wb-node-list-${N[chosen].id}`, label: "tail->next", color: "purple" }] })
          });
          tail = chosen;
          f.ptr.tail = tail;
          steps.push({
            line: 24,
            tag: "tail 前進",
            tagType: "default",
            inlineBadge: `tail = Node(${N[tail].val})`,
            explanation: `tail 移到剛接上的節點 ${N[tail].val}，已合併部分為 [${chainStr(dummyNext)}]。`,
            vars: vars(),
            state: snap({ hlNodes: [tail] })
          });
        }
        const rest = a !== -1 ? a : b;
        if (tail === -2) dummyNext = rest;
        else N[tail].next = rest;
        steps.push({
          line: 26,
          tag: "接上剩餘部分",
          tagType: "tag-insert",
          inlineBadge: `tail->next = ${rest === -1 ? "nullptr" : `Node(${N[rest].val})`}`,
          explanation:
            rest === -1
              ? "兩條串列都已用完，tail->next 設為 nullptr。"
              : `其中一條已用完，另一條剩下的 [${chainStr(rest)}] 本來就有序，整段直接接到 tail 後面。`,
          vars: vars(),
          state: snap({
            hlEdge: tail >= 0 ? tail : -1,
            connectors: rest !== -1 && tail >= 0 ? [{ from: `wb-node-list-${N[tail].id}`, to: `wb-node-list-${N[rest].id}`, label: "接上剩餘", color: "purple" }] : []
          })
        });
        steps.push({
          line: 27,
          tag: "回傳合併結果",
          tagType: "tag-found",
          inlineBadge: `return [${chainStr(dummyNext)}]`,
          explanation: `合併完成，回傳 dummy.next，得到有序串列 [${chainStr(dummyNext)}]。`,
          vars: vars(`[${chainStr(dummyNext)}]`),
          state: snap({ retVal: `[${chainStr(dummyNext)}]`, hlNodes: [...scopeOf(dummyNext)] })
        });
        frames.pop();
        return dummyNext;
      };

      const sortList = (h) => {
        const f = { label: `sortList(${chainStr(h)})`, ptr: { head: h } };
        f.scope = scopeOf(h);
        frames.push(f);
        if (h === -1 || N[h].next === -1) {
          steps.push({
            line: 4,
            tag: "基底情況",
            tagType: "tag-found",
            inlineBadge: `return ${nm(h)}`,
            explanation: h === -1 ? "串列為空，不需要排序，直接回傳 nullptr。" : `只有一個節點 ${N[h].val}，本身就有序，直接回傳。`,
            vars: vars(h === -1 ? "nullptr" : `[${N[h].val}]`),
            state: snap({ retVal: h === -1 ? "nullptr" : `[${N[h].val}]`, hlNodes: h === -1 ? [] : [h] })
          });
          frames.pop();
          return h;
        }
        steps.push({
          line: 4,
          tag: "檢查基底情況",
          tagType: "tag-check",
          inlineBadge: "至少兩個節點 ➜ 繼續",
          explanation: `[${chainStr(h)}] 至少有兩個節點，需要拆成兩半分別排序。`,
          vars: vars(),
          state: snap()
        });
        let slow = h;
        let fast = N[h].next;
        f.ptr.slow = slow;
        f.ptr.fast = fast;
        steps.push({
          line: 6,
          tag: "初始化快慢指標",
          tagType: "default",
          inlineBadge: `slow = ${N[slow].val}, fast = ${N[fast].val}`,
          explanation: "slow 從 head 出發、fast 從 head->next 出發；這樣偶數長度時 slow 會停在前半段的最後一個節點。",
          vars: vars(),
          state: snap({ hlNodes: [slow, fast] })
        });
        while (fast !== -1 && N[fast].next !== -1) {
          slow = N[slow].next;
          fast = N[N[fast].next].next;
          f.ptr.slow = slow;
          f.ptr.fast = fast;
          steps.push({
            line: 9,
            tag: "快慢指標前進",
            tagType: "tag-check",
            inlineBadge: `slow = ${N[slow].val}, fast = ${fast === -1 ? "nullptr" : N[fast].val}`,
            explanation: `slow 走一步到 ${N[slow].val}，fast 走兩步到 ${fast === -1 ? "nullptr" : N[fast].val}。`,
            vars: vars(),
            state: snap({ hlNodes: fast === -1 ? [slow] : [slow, fast] })
          });
        }
        steps.push({
          line: 7,
          tag: "fast 抵達尾端",
          tagType: "tag-check",
          inlineBadge: fast === -1 ? "fast == nullptr" : "fast->next == nullptr",
          explanation: `fast 已無法再走兩步，slow = ${N[slow].val} 就是前半段的最後一個節點。`,
          vars: vars(),
          state: snap({ hlNodes: [slow] })
        });
        const mid = N[slow].next;
        f.ptr.mid = mid;
        steps.push({
          line: 11,
          tag: "記錄後半段開頭",
          tagType: "default",
          inlineBadge: `mid = Node(${N[mid].val})`,
          explanation: `mid = slow->next = ${N[mid].val}，它是後半段的開頭。`,
          vars: vars(),
          state: snap({ hlEdge: slow, hlNodes: [mid], connectors: [{ from: `wb-node-list-${N[slow].id}`, to: "wb-var-v_mid", label: "slow->next", color: "blue" }] })
        });
        N[slow].next = -1;
        steps.push({
          line: 12,
          tag: "從中間斷開",
          tagType: "tag-insert",
          inlineBadge: `Node(${N[slow].val})->next = nullptr`,
          explanation: `把 ${N[slow].val} 的 next 設為 nullptr，串列拆成 [${chainStr(h)}] 與 [${chainStr(mid)}] 兩段。`,
          vars: vars(),
          state: snap({ hlNodes: [slow, mid] })
        });
        delete f.ptr.slow;
        delete f.ptr.fast;
        const left = sortList(h);
        f.ptr.left = left;
        steps.push({
          line: 13,
          tag: "左半段排序完成",
          tagType: "default",
          inlineBadge: `left = [${chainStr(left)}]`,
          explanation: `遞迴回到 ${f.label}，左半段已排序為 [${chainStr(left)}]。`,
          vars: vars(),
          state: snap({ hlNodes: [...scopeOf(left)] })
        });
        const right = sortList(mid);
        f.ptr.right = right;
        steps.push({
          line: 14,
          tag: "右半段排序完成",
          tagType: "default",
          inlineBadge: `right = [${chainStr(right)}]`,
          explanation: `右半段已排序為 [${chainStr(right)}]，接著把兩段合併。`,
          vars: vars(),
          state: snap({ hlNodes: [...scopeOf(right)] })
        });
        f.scope = new Set([...scopeOf(left), ...scopeOf(right)]);
        const merged = merge(left, right);
        f.ptr = { head: merged };
        f.scope = scopeOf(merged);
        const out = `[${chainStr(merged)}]`;
        steps.push({
          line: 15,
          tag: frames.length === 1 ? "排序完成" : "回傳合併結果",
          tagType: "tag-found",
          inlineBadge: `return ${out}`,
          explanation: frames.length === 1 ? `最外層合併完成，整條串列排序為 ${out}。` : `${f.label} 回傳排序好的 ${out} 給上一層。`,
          vars: vars(out),
          state: snap({ retVal: out, matchAll: frames.length === 1, hlNodes: [...scopeOf(merged)] })
        });
        frames.pop();
        return merged;
      };

      sortList(n ? 0 : -1);
      return steps;
    }
  };

  // ==========================================================================
  // #117 Number of Connected Components in an Undirected Graph (LC #323, Medium)
  // ==========================================================================
  window.PROBLEMS["number-of-connected-components-in-an-undirected-graph"] = {
    id: 117,
    leetcodeId: 323,
    slug: "number-of-connected-components-in-an-undirected-graph",
    title: "323. Number of Connected Components in an Undirected Graph (無向圖中的連通分量數)",
    difficulty: "Medium",
    topic: "Graph / Union Find",
    mins: 30,
    complexity: "Time O(E · α(n)) · Space O(n)",
    argNames: ["n", "edges"],
    description:
      "給定 n 個編號 0 到 n-1 的節點與無向邊陣列 edges，求圖中連通分量的數量。使用並查集 (Union-Find)：一開始每個節點自成一個集合，components = n；逐條處理邊 (a, b)，以 find 找出兩端的根（過程中做路徑減半壓縮），若根不同就把一棵樹掛到另一棵下並讓 components 減一；根相同代表這條邊在同一分量內，不影響答案。時間近似 O(E · α(n))。",

    presets: [
      { name: "範例 1：n = 5, edges = [[0,1],[1,2],[3,4]]", args: [5, [[0, 1], [1, 2], [3, 4]]] },
      { name: "範例 2：n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]] },
      { name: "邊界情況：n = 4, edges = []（沒有邊）", args: [4, []] },
      { name: "範例 4：n = 6, edges = [[0,1],[2,3],[1,3],[0,2],[4,5]]（含多餘邊）", args: [6, [[0, 1], [2, 3], [1, 3], [0, 2], [4, 5]]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    int countComponents(int n, vector<vector<int>>& edges) {",
      "        vector<int> parent(n);",
      "        iota(parent.begin(), parent.end(), 0);",
      "        int components = n;",
      "        for (auto& e : edges) {",
      "            int ra = find(parent, e[0]);",
      "            int rb = find(parent, e[1]);",
      "            if (ra != rb) {",
      "                parent[ra] = rb;       // 合併兩個集合",
      "                --components;",
      "            }",
      "        }",
      "        return components;",
      "    }",
      "private:",
      "    int find(vector<int>& parent, int x) {",
      "        while (parent[x] != x) {",
      "            parent[x] = parent[parent[x]];   // 路徑減半",
      "            x = parent[x];",
      "        }",
      "        return x;",
      "    }",
      "};"
    ]),

    generateTrace(nIn, edgesIn) {
      const n = Math.max(1, Number(nIn) || 1);
      const edges = (Array.isArray(edgesIn) ? edgesIn : []).map((e) => e.slice());
      const steps = [];
      const parent = [];
      let components = n;
      let ei = -1;
      let ra = "-";
      let rb = "-";
      const merged = new Set();

      const cx = 170;
      const cy = 128;
      const R = n === 1 ? 0 : 92;
      const coords = Array.from({ length: n }, (_, i) => ({
        x: Math.round(cx + R * Math.sin((2 * Math.PI * i) / n)),
        y: Math.round(cy - R * Math.cos((2 * Math.PI * i) / n))
      }));
      const rootOf = (x) => {
        while (parent[x] !== x) x = parent[x];
        return x;
      };

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hlNodes = [], hlCells = [], warnCells = [] } = opts;
        const ready = parent.length === n;
        const nodes = coords.map((c, i) => ({
          id: `v${i}`,
          val: String(i),
          sub: ready ? `root ${rootOf(i)}` : "",
          x: c.x,
          y: c.y,
          status: retVal !== "-" ? (ready && rootOf(i) === i ? "match" : "done") : hlNodes.includes(i) ? "hl" : ready && rootOf(i) === i ? "" : "done"
        }));
        const gEdges = edges.map((e, k) => ({
          from: `v${e[0]}`,
          to: `v${e[1]}`,
          dir: false,
          status: k === ei ? "hl" : merged.has(k) ? "match" : ""
        }));
        const boards = [
          {
            id: "g",
            type: "graph",
            shape: "graph",
            name: "graph",
            typeLabel: "無向圖 (edges)",
            x: 325,
            y: 52,
            width: 340,
            height: 262,
            nodes,
            edges: gEdges
          },
          {
            id: "parent",
            type: "array",
            name: "parent",
            typeLabel: "並查集父節點 (vector<int>)",
            x: 325,
            y: 360,
            values: parent.slice(),
            hl: hlCells,
            warn: warnCells,
            done: parent.map((p, i) => (p !== i ? i : -1)).filter((i) => i >= 0 && !hlCells.includes(i) && !warnCells.includes(i))
          },
          varsBoard([
            V("edge", "e", ei >= 0 && ei < edges.length ? `[${edges[ei].join(",")}]` : "-", ei >= 0 ? "hl" : ""),
            V("ra", "ra", ra),
            V("rb", "rb", rb),
            V("comp", "components", components, "hl"),
            V("ret", "return", retVal, retVal !== "-" ? "match" : "")
          ])
        ];
        return { boards, connectors };
      };
      const vars = (ret = "-") => ({
        e: ei >= 0 && ei < edges.length ? `[${edges[ei].join(",")}]` : "-",
        ra: String(ra),
        rb: String(rb),
        components: String(components),
        parent: fmtArr(parent),
        return: ret
      });

      for (let i = 0; i < n; i++) parent.push(i);
      steps.push({
        line: 5,
        tag: "初始化並查集",
        tagType: "default",
        inlineBadge: `parent = ${fmtArr(parent)}`,
        explanation: `每個節點的父節點先指向自己，代表 ${n} 個各自獨立的集合。`,
        vars: vars(),
        state: snap()
      });
      steps.push({
        line: 6,
        tag: "分量數初始為 n",
        tagType: "default",
        inlineBadge: `components = ${n}`,
        explanation: `還沒加入任何邊之前，共有 ${n} 個連通分量。`,
        vars: vars(),
        state: snap()
      });

      const find = (x0, label, line) => {
        let x = x0;
        while (parent[x] !== x) {
          const before = parent[x];
          parent[x] = parent[parent[x]];
          steps.push({
            line: 20,
            tag: "路徑減半",
            tagType: "tag-insert",
            inlineBadge: `parent[${x}] = parent[${before}] = ${parent[x]}`,
            explanation: `find(${x0}) 途中：${x} 不是根（父節點是 ${before}），把它直接指向祖父 ${parent[x]} 縮短路徑，再跳到 ${parent[x]} 繼續。`,
            vars: vars(),
            state: snap({ hlNodes: [x], hlCells: [x], connectors: [{ from: `wb-cw-parent-${x}`, to: `wb-cw-parent-${parent[x]}`, label: "指向祖父", color: "purple" }] })
          });
          x = parent[x];
        }
        if (label === "ra") ra = x;
        else rb = x;
        steps.push({
          line,
          tag: `找到 ${label} 的根`,
          tagType: "tag-check",
          inlineBadge: `${label} = find(${x0}) = ${x}`,
          explanation: x === x0 ? `節點 ${x0} 的父節點就是自己，所以 ${label} = ${x}。` : `沿著父節點一路往上，節點 ${x0} 所在集合的根是 ${x}，${label} = ${x}。`,
          vars: vars(),
          state: snap({ hlNodes: [x0], hlCells: [x], connectors: [{ from: `wb-node-g-v${x0}`, to: `wb-var-${label}`, label: `find(${x0})`, color: "blue" }] })
        });
        return x;
      };

      for (ei = 0; ei < edges.length; ei++) {
        const [a, b] = edges[ei];
        ra = "-";
        rb = "-";
        steps.push({
          line: 7,
          tag: "取出下一條邊",
          tagType: "default",
          inlineBadge: `e = [${a}, ${b}]`,
          explanation: `處理第 ${ei + 1} 條邊 (${a}, ${b})：先找出兩端各自所屬集合的根。`,
          vars: vars(),
          state: snap({ hlNodes: [a, b] })
        });
        const x = find(a, "ra", 8);
        const y = find(b, "rb", 9);
        if (x !== y) {
          steps.push({
            line: 10,
            tag: "根不同，需要合併",
            tagType: "tag-check",
            inlineBadge: `${x} != ${y}`,
            explanation: `ra = ${x} 與 rb = ${y} 不同，代表 ${a} 與 ${b} 原本在不同分量，這條邊把兩個分量連起來。`,
            vars: vars(),
            state: snap({ hlNodes: [a, b], hlCells: [x, y] })
          });
          parent[x] = y;
          merged.add(ei);
          steps.push({
            line: 11,
            tag: "合併集合",
            tagType: "tag-insert",
            inlineBadge: `parent[${x}] = ${y}`,
            explanation: `把根 ${x} 掛到根 ${y} 底下，兩個集合合而為一。`,
            vars: vars(),
            state: snap({ hlNodes: [x, y], warnCells: [x], connectors: [{ from: `wb-cw-parent-${x}`, to: `wb-cw-parent-${y}`, label: `parent[${x}] = ${y}`, color: "purple" }] })
          });
          components--;
          steps.push({
            line: 12,
            tag: "分量數減一",
            tagType: "tag-insert",
            inlineBadge: `components = ${components}`,
            explanation: `成功合併一次，連通分量少一個，現在剩 ${components} 個。`,
            vars: vars(),
            state: snap({ hlNodes: [a, b] })
          });
        } else {
          steps.push({
            line: 10,
            tag: "已在同一分量",
            tagType: "tag-check",
            inlineBadge: `${x} == ${y} ➜ 略過`,
            explanation: `兩端的根都是 ${x}，${a} 與 ${b} 早已連通，這條邊不會改變分量數。`,
            vars: vars(),
            state: snap({ hlNodes: [a, b], warnCells: [x] })
          });
        }
      }
      ei = edges.length;
      steps.push({
        line: 15,
        tag: "回傳連通分量數",
        tagType: "tag-found",
        inlineBadge: `return ${components}`,
        explanation: `所有邊處理完畢。仍是自己根的節點數就是分量數：共 ${components} 個連通分量（綠色節點為各分量的根）。`,
        vars: vars(String(components)),
        state: snap({ retVal: String(components), connectors: [{ from: "wb-var-comp", to: "wb-var-ret", label: "components", color: "green" }] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #118 Minimum Knight Moves (LC #1197, Medium)
  // ==========================================================================
  window.PROBLEMS["minimum-knight-moves"] = {
    id: 118,
    leetcodeId: 1197,
    slug: "minimum-knight-moves",
    title: "1197. Minimum Knight Moves (騎士的最少移動次數)",
    difficulty: "Medium",
    topic: "Graph / BFS",
    mins: 35,
    complexity: "Time O(|x| · |y|) · Space O(|x| · |y|)",
    argNames: ["x", "y"],
    description:
      "在無限大的棋盤上，騎士從 (0, 0) 出發，每步走「日」字形的 8 種方向之一，求到達 (x, y) 的最少步數。棋盤對兩軸對稱，先取 x = |x|、y = |y| 把目標移到第一象限，再從原點做逐層 BFS：每一層代表多走一步，第一次從佇列取出目標時的層數即為答案。為避免在無限棋盤上無止盡擴散，只保留座標落在 [-2, x+2] × [-2, y+2] 範圍內的格子（最短路徑不會超出這個邊界），並用 seen 集合避免重複入隊。",

    presets: [
      { name: "範例 1：x = 2, y = 1", args: [2, 1] },
      { name: "範例 2：x = 1, y = 0（相鄰格反而要 3 步）", args: [1, 0] },
      { name: "邊界情況：x = 0, y = 0", args: [0, 0] },
      { name: "範例 4：x = -1, y = -1（需要繞到負座標）", args: [-1, -1] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    int minKnightMoves(int x, int y) {",
      "        x = abs(x); y = abs(y);                 // 對稱：只看第一象限",
      "        int dirs[8][2] = {{1,2},{2,1},{2,-1},{1,-2},{-1,-2},{-2,-1},{-2,1},{-1,2}};",
      "        queue<pair<int, int>> q;",
      "        set<pair<int, int>> seen;",
      "        q.push({0, 0}); seen.insert({0, 0});",
      "        for (int steps = 0; !q.empty(); ++steps) {",
      "            for (int sz = q.size(); sz > 0; --sz) {",
      "                auto [cx, cy] = q.front(); q.pop();",
      "                if (cx == x && cy == y) return steps;",
      "                for (auto& d : dirs) {",
      "                    int nx = cx + d[0], ny = cy + d[1];",
      "                    if (nx < -2 || ny < -2 || nx > x + 2 || ny > y + 2) continue;",
      "                    if (seen.insert({nx, ny}).second) q.push({nx, ny});",
      "                }",
      "            }",
      "        }",
      "        return -1;",
      "    }",
      "};"
    ]),

    generateTrace(xIn, yIn) {
      const x0 = Number(xIn) || 0;
      const y0 = Number(yIn) || 0;
      const X = Math.abs(x0);
      const Y = Math.abs(y0);
      const DIRS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
      const steps = [];
      const dist = new Map();
      const processed = new Set();
      let q = [];
      let level = 0;
      let cur = null;
      let sz = "-";
      const key = (a, b) => `${a},${b}`;
      const xs = [];
      for (let a = -2; a <= X + 2; a++) xs.push(a);
      const ys = [];
      for (let b = Y + 2; b >= -2; b--) ys.push(b);
      const cellId = (a, b) => `wb-grid-board-${Y + 2 - b}-${a + 2}`;
      const rc = (a, b) => `${Y + 2 - b},${a + 2}`;

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], fresh = [], found = false } = opts;
        const cells = ys.map((b) =>
          xs.map((a) => {
            if (a === 0 && b === 0 && !dist.has(key(a, b))) return "S";
            if (dist.has(key(a, b))) return String(dist.get(key(a, b)));
            if (a === X && b === Y) return "T";
            return "·";
          })
        );
        const hl = [];
        const done = [];
        const match = [];
        const warn = [];
        processed.forEach((k) => {
          const [a, b] = k.split(",").map(Number);
          done.push(rc(a, b));
        });
        if (cur) hl.push(rc(cur[0], cur[1]));
        fresh.forEach(([a, b]) => warn.push(rc(a, b)));
        if (found) match.push(rc(X, Y));
        return {
          boards: [
            {
              id: "board",
              type: "grid",
              name: "棋盤 (只看第一象限)",
              typeLabel: "格內數字 = 最少步數",
              x: 325,
              y: 52,
              cells,
              rowLabels: ys.map((b) => `y=${b}`),
              colLabels: xs.map((a) => `${a}`),
              hl,
              done,
              match,
              warn
            },
            {
              id: "q",
              type: "queue",
              name: "q",
              typeLabel: "BFS 佇列 (queue<pair<int,int>>)",
              x: 325,
              y: 52 + (ys.length + 1) * 33 + 40,
              items: q.map(([a, b]) => ({ val: `${a},${b}`, status: fresh.some(([c, d]) => c === a && d === b) ? "hl" : "" }))
            },
            varsBoard([
              V("target", "(x, y)", `(${X}, ${Y})`, "warn"),
              V("steps", "steps", level, "hl"),
              V("sz", "sz", sz),
              V("cur", "(cx, cy)", cur ? `(${cur[0]}, ${cur[1]})` : "-", cur ? "hl" : ""),
              V("seen", "seen.size()", dist.size),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        steps: String(level),
        sz: String(sz),
        "(cx,cy)": cur ? `(${cur[0]},${cur[1]})` : "-",
        "q.size()": String(q.length),
        "seen.size()": String(dist.size),
        return: ret
      });

      steps.push({
        line: 4,
        tag: "利用對稱性",
        tagType: "default",
        inlineBadge: `x = |${x0}| = ${X}, y = |${y0}| = ${Y}`,
        explanation: `騎士的走法對 x 軸、y 軸都對稱，(${x0}, ${y0}) 與 (${X}, ${Y}) 的最少步數相同，因此只在第一象限附近搜尋。`,
        vars: vars(),
        state: snap()
      });
      q.push([0, 0]);
      dist.set(key(0, 0), 0);
      steps.push({
        line: 8,
        tag: "起點入隊",
        tagType: "tag-insert",
        inlineBadge: "q.push({0,0})",
        explanation: "把起點 (0, 0) 放入佇列並標記為已看過，它的步數是 0。",
        vars: vars(),
        state: snap({ fresh: [[0, 0]], connectors: [{ from: cellId(0, 0), to: "wb-queue-q-0", label: "push", color: "purple" }] })
      });

      for (level = 0; q.length; level++) {
        sz = q.length;
        steps.push({
          line: 10,
          tag: `處理第 ${level} 層`,
          tagType: "tag-check",
          inlineBadge: `steps = ${level}, sz = ${sz}`,
          explanation: `佇列中的 ${sz} 個格子都是走 ${level} 步可到達的位置，逐一取出並往外擴展一步。`,
          vars: vars(),
          state: snap()
        });
        for (; sz > 0; sz--) {
          cur = q.shift();
          const [cx, cy] = cur;
          processed.add(key(cx, cy));
          if (cx === X && cy === Y) {
            steps.push({
              line: 12,
              tag: "抵達目標",
              tagType: "tag-found",
              inlineBadge: `(${cx},${cy}) == (${X},${Y}) ➜ return ${level}`,
              explanation: `取出的格子正好是目標 (${X}, ${Y})。BFS 按層擴展，第一次到達時的層數就是最少步數 ${level}。`,
              vars: vars(String(level)),
              state: snap({ retVal: String(level), found: true, connectors: [{ from: cellId(cx, cy), to: "wb-var-ret", label: `${level} 步`, color: "green" }] })
            });
            return steps;
          }
          const fresh = [];
          let skipped = 0;
          DIRS.forEach(([dx, dy]) => {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < -2 || ny < -2 || nx > X + 2 || ny > Y + 2) {
              skipped++;
              return;
            }
            if (!dist.has(key(nx, ny))) {
              dist.set(key(nx, ny), level + 1);
              q.push([nx, ny]);
              fresh.push([nx, ny]);
            }
          });
          const connectors = fresh.slice(0, 3).map(([a, b]) => ({ from: cellId(cx, cy), to: cellId(a, b), label: `${level + 1}`, color: "purple" }));
          steps.push({
            line: 16,
            tag: fresh.length ? `擴展 ${fresh.length} 個新格子` : "沒有新格子",
            tagType: fresh.length ? "tag-insert" : "tag-check",
            inlineBadge: `pop (${cx},${cy}) ➜ push ${fresh.length} 格`,
            explanation:
              `取出 (${cx}, ${cy})，它不是目標。嘗試 8 個日字方向：` +
              (skipped ? `${skipped} 個超出搜尋邊界被略過，` : "") +
              (fresh.length
                ? `新加入 ${fresh.map(([a, b]) => `(${a},${b})`).join("、")}，步數記為 ${level + 1}。`
                : "其餘方向都已在 seen 中，沒有新的格子入隊。"),
            vars: vars(),
            state: snap({ fresh, connectors })
          });
        }
      }
      cur = null;
      steps.push({
        line: 20,
        tag: "佇列清空",
        tagType: "tag-found",
        inlineBadge: "return -1",
        explanation: "佇列已空仍未到達目標（理論上不會發生）。",
        vars: vars("-1"),
        state: snap({ retVal: "-1" })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #119 Subarray Sum Equals K (LC #560, Medium)
  // ==========================================================================
  window.PROBLEMS["subarray-sum-equals-k"] = {
    id: 119,
    leetcodeId: 560,
    slug: "subarray-sum-equals-k",
    title: "560. Subarray Sum Equals K (和為 K 的子陣列)",
    difficulty: "Medium",
    topic: "Array / Prefix Sum / Hash Table",
    mins: 35,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["nums", "k"],
    description:
      "給定整數陣列 nums 與整數 k，計算總和恰為 k 的連續子陣列個數。前綴和 + 雜湊表：令 sum 為目前的前綴和，子陣列 (j, i] 的和為 sum_i - sum_j，等於 k 即 sum_j = sum - k。因此掃描時先查詢雜湊表 cnt 中前綴和 sum - k 出現過幾次並累加到答案，再把目前的 sum 計數加一；cnt[0] = 1 代表空前綴。因為數字可為負，不能使用滑動視窗。時間 O(n)、空間 O(n)。",

    presets: [
      { name: "範例 1：nums = [1,1,1], k = 2", args: [[1, 1, 1], 2] },
      { name: "範例 2：nums = [1,2,3], k = 3", args: [[1, 2, 3], 3] },
      { name: "範例 3：nums = [1,-1,0], k = 0（含負數與 0）", args: [[1, -1, 0], 0] },
      { name: "範例 4：nums = [3,4,7,2,-3,1,4,2], k = 7", args: [[3, 4, 7, 2, -3, 1, 4, 2], 7] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    int subarraySum(vector<int>& nums, int k) {",
      "        unordered_map<int, int> cnt;      // 前綴和 ➜ 出現次數",
      "        cnt[0] = 1;                       // 空前綴",
      "        int sum = 0, count = 0;",
      "        for (int x : nums) {",
      "            sum += x;",
      "            auto it = cnt.find(sum - k);",
      "            if (it != cnt.end()) count += it->second;",
      "            cnt[sum]++;",
      "        }",
      "        return count;",
      "    }",
      "};"
    ]),

    generateTrace(numsIn, kIn) {
      const nums = Array.isArray(numsIn) ? numsIn.slice() : [];
      const k = Number(kIn);
      const steps = [];
      const cnt = new Map();
      const order = [];
      let sum = 0;
      let count = 0;
      let i = -1;
      let need = "-";

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hitKey = null, insKey = null, missKey = null } = opts;
        const rows = order.map((s) => ({
          id: `s${s}`,
          key: String(s),
          val: String(cnt.get(s)),
          note: s === hitKey ? "✓ 命中" : s === insKey ? "計數 +1" : "",
          status: s === hitKey ? "hit" : s === insKey ? "inserted" : ""
        }));
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
              hl: i >= 0 && i < nums.length ? [i] : [],
              done: nums.map((_, j) => j).filter((j) => j < i),
              pointers: i >= 0 && i < nums.length ? [{ idx: i, label: "x", color: "blue" }] : []
            },
            {
              id: "cnt",
              type: "dict",
              name: "cnt",
              typeLabel: "前綴和次數 (unordered_map<int,int>)",
              x: 325,
              y: 172,
              headers: ["前綴和", "次數", "狀態"],
              rows,
              slot: missKey !== null ? { key: String(missKey), val: "—", note: "✗ 未出現" } : null
            },
            varsBoard([
              V("k", "k", k),
              V("sum", "sum", sum, "hl"),
              V("need", "sum - k", need),
              V("count", "count", count, "hl"),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        x: i >= 0 && i < nums.length ? String(nums[i]) : "-",
        sum: String(sum),
        "sum - k": String(need),
        count: String(count),
        return: ret
      });

      cnt.set(0, 1);
      order.push(0);
      steps.push({
        line: 5,
        tag: "放入空前綴",
        tagType: "tag-insert",
        inlineBadge: "cnt[0] = 1",
        explanation: "先記錄前綴和 0 出現 1 次（什麼都不取的空前綴），這樣從索引 0 開始、和恰為 k 的子陣列也能被計算到。",
        vars: vars(),
        state: snap({ insKey: 0 })
      });
      steps.push({
        line: 6,
        tag: "初始化",
        tagType: "default",
        inlineBadge: "sum = 0, count = 0",
        explanation: "前綴和 sum 與答案 count 都從 0 開始。",
        vars: vars(),
        state: snap()
      });

      for (i = 0; i < nums.length; i++) {
        const x = nums[i];
        sum += x;
        need = "-";
        steps.push({
          line: 8,
          tag: "累加前綴和",
          tagType: "default",
          inlineBadge: `sum += ${x} ➜ ${sum}`,
          explanation: `讀入 x = nums[${i}] = ${x}，前綴和 sum 變成 ${sum}（nums[0..${i}] 的總和）。`,
          vars: vars(),
          state: snap({ connectors: [{ from: `wb-cw-nums-${i}`, to: "wb-var-sum", label: `+${x}`, color: "blue" }] })
        });
        need = sum - k;
        if (cnt.has(need)) {
          const c = cnt.get(need);
          steps.push({
            line: 9,
            tag: "查詢 sum - k",
            tagType: "tag-check",
            inlineBadge: `cnt.find(${sum} - ${k} = ${need}) ➜ ${c}`,
            explanation: `要讓某段以索引 ${i} 結尾的子陣列和為 ${k}，前面需要有前綴和 ${need}。雜湊表顯示 ${need} 出現過 ${c} 次。`,
            vars: vars(),
            state: snap({ hitKey: need, connectors: [{ from: "wb-var-need", to: `wb-dict-row-s${need}`, label: `查 ${need}`, color: "green" }] })
          });
          count += c;
          steps.push({
            line: 10,
            tag: "累加答案",
            tagType: "tag-found",
            inlineBadge: `count += ${c} ➜ ${count}`,
            explanation: `每個前綴和為 ${need} 的位置都對應一段和為 ${k} 的子陣列，因此 count 增加 ${c}，現在是 ${count}。`,
            vars: vars(),
            state: snap({ hitKey: need, connectors: [{ from: `wb-dict-row-s${need}`, to: "wb-var-count", label: `+${c}`, color: "green" }] })
          });
        } else {
          steps.push({
            line: 9,
            tag: "查詢 sum - k",
            tagType: "tag-check",
            inlineBadge: `cnt.find(${need}) ➜ end()`,
            explanation: `需要的前綴和 ${need} 從未出現，沒有以索引 ${i} 結尾且和為 ${k} 的子陣列。`,
            vars: vars(),
            state: snap({ missKey: need })
          });
          steps.push({
            line: 10,
            tag: "未命中，不累加",
            tagType: "tag-check",
            inlineBadge: "it == cnt.end()",
            explanation: `找不到 ${need}，count 維持 ${count}。`,
            vars: vars(),
            state: snap({ missKey: need })
          });
        }
        if (!cnt.has(sum)) {
          cnt.set(sum, 0);
          order.push(sum);
        }
        cnt.set(sum, cnt.get(sum) + 1);
        steps.push({
          line: 11,
          tag: "記錄目前前綴和",
          tagType: "tag-insert",
          inlineBadge: `cnt[${sum}] = ${cnt.get(sum)}`,
          explanation: `把前綴和 ${sum} 的出現次數加一（現在 ${cnt.get(sum)} 次），供後面的位置查詢。`,
          vars: vars(),
          state: snap({ insKey: sum, connectors: [{ from: "wb-var-sum", to: `wb-dict-row-s${sum}`, label: "cnt[sum]++", color: "purple" }] })
        });
      }
      i = nums.length;
      steps.push({
        line: 13,
        tag: "回傳子陣列數量",
        tagType: "tag-found",
        inlineBadge: `return ${count}`,
        explanation: `掃描完成，共有 ${count} 個連續子陣列的總和等於 ${k}。`,
        vars: vars(String(count)),
        state: snap({ retVal: String(count), connectors: [{ from: "wb-var-count", to: "wb-var-ret", label: "count", color: "green" }] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #120 Asteroid Collision (LC #735, Medium)
  // ==========================================================================
  window.PROBLEMS["asteroid-collision"] = {
    id: 120,
    leetcodeId: 735,
    slug: "asteroid-collision",
    title: "735. Asteroid Collision (小行星碰撞)",
    difficulty: "Medium",
    topic: "Array / Stack",
    mins: 30,
    complexity: "Time O(n) · Space O(n)",
    argNames: ["asteroids"],
    description:
      "陣列 asteroids 中每個整數代表一顆排成一列的小行星：絕對值是大小，正數向右飛、負數向左飛，速度相同。只有「左邊向右飛、右邊向左飛」的兩顆會相撞，較小的爆炸，一樣大則同歸於盡，求最後剩下的小行星。用 vector 當堆疊由左到右處理：遇到向左飛的 a 時，只要堆疊頂端是向右飛的小行星就持續碰撞——頂端較小就彈出繼續撞，一樣大就一起消失，頂端較大則 a 爆炸；a 存活才推入堆疊。每顆最多入堆疊、出堆疊各一次，時間 O(n)。",

    presets: [
      { name: "範例 1：asteroids = [5,10,-5]", args: [[5, 10, -5]] },
      { name: "範例 2：asteroids = [8,-8]（同歸於盡）", args: [[8, -8]] },
      { name: "範例 3：asteroids = [10,2,-5]", args: [[10, 2, -5]] },
      { name: "範例 4：asteroids = [-2,-1,1,2]（不會相撞）", args: [[-2, -1, 1, 2]] },
      { name: "範例 5：asteroids = [1,-2,-2,-2]（連續撞毀）", args: [[1, -2, -2, -2]] },
      { name: "範例 6：asteroids = [6,2,-3,4,-7,1,-1]（多次連鎖碰撞）", args: [[6, 2, -3, 4, -7, 1, -1]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    vector<int> asteroidCollision(vector<int>& asteroids) {",
      "        vector<int> st;                        // 當作堆疊使用",
      "        for (int a : asteroids) {",
      "            bool alive = true;",
      "            while (alive && a < 0 && !st.empty() && st.back() > 0) {",
      "                if (st.back() < -a) { st.pop_back(); continue; }",
      "                if (st.back() == -a) st.pop_back();",
      "                alive = false;",
      "            }",
      "            if (alive) st.push_back(a);",
      "        }",
      "        return st;",
      "    }",
      "};"
    ]),

    generateTrace(astIn) {
      const ast = Array.isArray(astIn) ? astIn.slice() : [];
      const steps = [];
      const st = [];
      let i = -1;
      let alive = "-";
      const boom = new Set();

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], topStatus = "", warnI = false } = opts;
        return {
          boards: [
            {
              id: "ast",
              type: "array",
              name: "asteroids",
              typeLabel: "小行星 (正→右飛, 負→左飛)",
              x: 325,
              y: 52,
              values: ast.map((v) => (v > 0 ? `${v}→` : `←${-v}`)),
              hl: i >= 0 && i < ast.length && !warnI ? [i] : [],
              warn: [...boom, ...(warnI ? [i] : [])],
              done: ast.map((_, j) => j).filter((j) => j < i && !boom.has(j)),
              pointers: i >= 0 && i < ast.length ? [{ idx: i, label: "a", color: "blue" }] : []
            },
            {
              id: "st",
              type: "stack",
              name: "st",
              typeLabel: "倖存堆疊 (vector<int>)",
              x: 325,
              y: 180,
              items: st.map((s, j) => ({ val: String(s.v), status: j === st.length - 1 ? topStatus : retVal !== "-" ? "match" : "" }))
            },
            varsBoard([
              V("a", "a", i >= 0 && i < ast.length ? ast[i] : "-", "hl"),
              V("alive", "alive", alive),
              V("top", "st.back()", st.length ? st[st.length - 1].v : "(空)"),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        a: i >= 0 && i < ast.length ? String(ast[i]) : "-",
        alive: String(alive),
        st: fmtArr(st.map((s) => s.v)),
        return: ret
      });

      steps.push({
        line: 4,
        tag: "建立空堆疊",
        tagType: "default",
        inlineBadge: "st = []",
        explanation: "準備一個堆疊 st 存放目前倖存的小行星，由左到右逐顆處理。",
        vars: vars(),
        state: snap()
      });

      for (i = 0; i < ast.length; i++) {
        const a = ast[i];
        alive = true;
        steps.push({
          line: 6,
          tag: "讀入小行星",
          tagType: "default",
          inlineBadge: `a = ${a}, alive = true`,
          explanation: `第 ${i} 顆小行星 a = ${a}（大小 ${Math.abs(a)}，向${a > 0 ? "右" : "左"}飛），先假設它會存活。`,
          vars: vars(),
          state: snap()
        });
        while (alive && a < 0 && st.length && st[st.length - 1].v > 0) {
          const top = st[st.length - 1];
          const ti = st.length - 1;
          if (top.v < -a) {
            steps.push({
              line: 8,
              tag: "頂端較小，被撞毀",
              tagType: "tag-check",
              inlineBadge: `${top.v} < ${-a} ➜ pop`,
              explanation: `堆疊頂端 ${top.v} 向右飛、a = ${a} 向左飛，兩者相撞。${top.v} 比 ${-a} 小，頂端爆炸被彈出，a 繼續往左撞。`,
              vars: vars(),
              state: snap({ topStatus: "warn", connectors: [{ from: `wb-cw-ast-${i}`, to: `wb-stack-st-${ti}`, label: "碰撞", color: "red" }] })
            });
            boom.add(top.idx);
            st.pop();
            continue;
          }
          if (top.v === -a) {
            steps.push({
              line: 9,
              tag: "大小相同，同歸於盡",
              tagType: "tag-check",
              inlineBadge: `${top.v} == ${-a} ➜ pop`,
              explanation: `頂端 ${top.v} 與 a = ${a} 一樣大，兩顆一起爆炸：先把頂端彈出。`,
              vars: vars(),
              state: snap({ topStatus: "warn", connectors: [{ from: `wb-cw-ast-${i}`, to: `wb-stack-st-${ti}`, label: "同歸於盡", color: "red" }] })
            });
            boom.add(top.idx);
            st.pop();
          }
          alive = false;
          boom.add(i);
          steps.push({
            line: 10,
            tag: "a 爆炸",
            tagType: "tag-check",
            inlineBadge: "alive = false",
            explanation: top.v === -a ? `a = ${a} 也一起消失，alive = false。` : `頂端 ${top.v} 比 ${-a} 大，a = ${a} 爆炸，alive = false。`,
            vars: vars(),
            state: snap({ warnI: true, topStatus: top.v === -a ? "" : "hl" })
          });
        }
        if (alive) {
          st.push({ v: a, idx: i });
          const why = a > 0 ? "向右飛，不會與左邊的小行星相撞" : st.length === 1 ? "堆疊中已沒有向右飛的小行星可撞" : "左邊頂端也向左飛，不會相撞";
          steps.push({
            line: 12,
            tag: "存活，推入堆疊",
            tagType: "tag-insert",
            inlineBadge: `st.push_back(${a})`,
            explanation: `a = ${a} ${why}，存活並推入堆疊。`,
            vars: vars(),
            state: snap({ topStatus: "hl", connectors: [{ from: `wb-cw-ast-${i}`, to: `wb-stack-st-${st.length - 1}`, label: "push", color: "purple" }] })
          });
        } else {
          steps.push({
            line: 12,
            tag: "已爆炸，不推入",
            tagType: "default",
            inlineBadge: "alive == false",
            explanation: `a = ${a} 已經爆炸，不放入堆疊。`,
            vars: vars(),
            state: snap({ warnI: true })
          });
        }
      }
      i = ast.length;
      const out = fmtArr(st.map((s) => s.v));
      steps.push({
        line: 14,
        tag: "回傳倖存小行星",
        tagType: "tag-found",
        inlineBadge: `return ${out}`,
        explanation: `所有小行星處理完畢，堆疊由底到頂就是最後剩下的小行星：${out}。`,
        vars: vars(out),
        state: snap({ retVal: out, connectors: [{ from: "wb-dyn-st", to: "wb-var-ret", label: "return st", color: "green" }] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #121 Random Pick with Weight (LC #528, Medium)
  // ==========================================================================
  window.PROBLEMS["random-pick-with-weight"] = {
    id: 121,
    leetcodeId: 528,
    slug: "random-pick-with-weight",
    title: "528. Random Pick with Weight (按權重隨機選擇)",
    difficulty: "Medium",
    topic: "Math / Prefix Sum / Binary Search",
    mins: 25,
    complexity: "Time O(n) 建構 · O(log n) pickIndex · Space O(n)",
    argNames: ["operations", "values"],
    description:
      "給定正整數權重陣列 w，設計 pickIndex()，使索引 i 被選中的機率為 w[i] / sum(w)。建構時計算前綴和 prefix，把 [1, total] 切成長度為 w[i] 的連續區段；pickIndex 先取 target = rand() % total + 1，再以二分搜尋找第一個 prefix[i] ≥ target 的索引，即 target 落入的區段。為了可重現，測資中 pickIndex 的參數是模擬的 rand() 回傳值。建構 O(n)，每次選取 O(log n)。",

    presets: [
      {
        name: "範例 1：w = [1,3]，rand() = [0,1,2,3]",
        args: [["Solution", "pickIndex", "pickIndex", "pickIndex", "pickIndex"], [[[1, 3]], [0], [1], [2], [3]]]
      },
      {
        name: "範例 2：w = [3,14,1,7]，rand() = [4,16,17,24,0]",
        args: [["Solution", "pickIndex", "pickIndex", "pickIndex", "pickIndex", "pickIndex"], [[[3, 14, 1, 7]], [4], [16], [17], [24], [0]]]
      },
      {
        name: "邊界情況：w = [1]（只有一個索引）",
        args: [["Solution", "pickIndex", "pickIndex"], [[[1]], [7], [42]]]
      },
      {
        name: "範例 4：w = [2,5,3,4,1]，rand() = [1234,58,9]",
        args: [["Solution", "pickIndex", "pickIndex", "pickIndex"], [[[2, 5, 3, 4, 1]], [1234], [58], [9]]]
      }
    ],

    cppLines: cpp([
      "class Solution {",
      "    vector<int> prefix;                   // 權重前綴和",
      "public:",
      "    Solution(vector<int>& w) {",
      "        for (int x : w)",
      "            prefix.push_back(prefix.empty() ? x : prefix.back() + x);",
      "    }",
      "    int pickIndex() {",
      "        int target = rand() % prefix.back() + 1;",
      "        int lo = 0, hi = (int)prefix.size() - 1;",
      "        while (lo < hi) {                // 找第一個 prefix[i] >= target",
      "            int mid = lo + (hi - lo) / 2;",
      "            if (prefix[mid] < target) lo = mid + 1;",
      "            else hi = mid;",
      "        }",
      "        return lo;",
      "    }",
      "};"
    ]),

    generateTrace(opsIn, valsIn) {
      const ops = Array.isArray(opsIn) ? opsIn.slice() : [];
      const vals = Array.isArray(valsIn) ? JSON.parse(JSON.stringify(valsIn)) : [];
      const steps = [];
      let w = [];
      const prefix = [];
      const outputs = [];
      let lo = "-";
      let hi = "-";
      let mid = "-";
      let target = "-";
      let rnd = "-";
      let opLabel = "-";
      let seed = 12345;
      const nextRand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed;
      };

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hlW = [], hlP = [], matchP = [], newOut = -1 } = opts;
        const pointers = [];
        if (lo !== "-") pointers.push({ idx: lo, label: "lo", color: "blue" });
        if (hi !== "-" && hi !== lo) pointers.push({ idx: hi, label: "hi", color: "red" });
        if (mid !== "-") pointers.push({ idx: mid, label: "mid", color: "purple" });
        return {
          boards: [
            {
              id: "w",
              type: "array",
              name: "w",
              typeLabel: "權重 (vector<int>)",
              x: 325,
              y: 52,
              values: w,
              hl: hlW
            },
            {
              id: "prefix",
              type: "array",
              name: "prefix",
              typeLabel: "前綴和 = 各區段右端點",
              x: 325,
              y: 172,
              values: prefix.map((p, i) => `${i === 0 ? 1 : prefix[i - 1] + 1}..${p}`),
              hl: hlP,
              match: matchP,
              done: lo !== "-" && hi !== "-" ? prefix.map((_, i) => i).filter((i) => i < lo || i > hi) : [],
              pointers
            },
            {
              id: "out",
              type: "array",
              name: "outputs",
              typeLabel: "每次呼叫的回傳值",
              x: 325,
              y: 292,
              values: outputs.map((o) => String(o)),
              indexLabels: outputs.map((_, i) => ops[i] === "Solution" ? "ctor" : `#${i}`),
              match: newOut >= 0 ? [newOut] : []
            },
            varsBoard([
              V("op", "呼叫", opLabel, "hl"),
              V("rand", "rand()", rnd),
              V("target", "target", target, target !== "-" ? "hl" : ""),
              V("total", "prefix.back()", prefix.length ? prefix[prefix.length - 1] : "-"),
              V("lo", "lo", lo),
              V("hi", "hi", hi),
              V("mid", "mid", mid),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        呼叫: opLabel,
        prefix: fmtArr(prefix),
        target: String(target),
        lo: String(lo),
        hi: String(hi),
        mid: String(mid),
        return: ret
      });

      ops.forEach((op, k) => {
        const arg = vals[k] || [];
        lo = "-";
        hi = "-";
        mid = "-";
        if (op === "Solution") {
          w = Array.isArray(arg[0]) ? arg[0].slice() : [];
          opLabel = `Solution(${fmtArr(w)})`;
          target = "-";
          rnd = "-";
          prefix.length = 0;
          w.forEach((x, i) => {
            prefix.push(prefix.length ? prefix[prefix.length - 1] + x : x);
            steps.push({
              line: 6,
              tag: "累加前綴和",
              tagType: "tag-insert",
              inlineBadge: i === 0 ? `prefix.push_back(${x})` : `prefix.push_back(${prefix[i - 1]} + ${x} = ${prefix[i]})`,
              explanation:
                i === 0
                  ? `w[0] = ${x}：索引 0 負責區段 1..${x}，prefix[0] = ${x}。`
                  : `w[${i}] = ${x}：索引 ${i} 負責區段 ${prefix[i - 1] + 1}..${prefix[i]}（長度 ${x}），prefix[${i}] = ${prefix[i]}。`,
              vars: vars(),
              state: snap({ hlW: [i], hlP: [i], connectors: [{ from: `wb-cw-w-${i}`, to: `wb-cw-prefix-${i}`, label: `+${x}`, color: "purple" }] })
            });
          });
          outputs.push("null");
          steps.push({
            line: 7,
            tag: "建構完成",
            tagType: "default",
            inlineBadge: `total = ${prefix[prefix.length - 1]}`,
            explanation: `前綴和建立完成，總權重 ${prefix[prefix.length - 1]}。區段長度與權重成正比，均勻抽一個 1..${prefix[prefix.length - 1]} 的數字就能按權重選索引。建構子回傳 null。`,
            vars: vars(),
            state: snap({ newOut: outputs.length - 1 })
          });
          return;
        }
        // pickIndex
        opLabel = "pickIndex()";
        rnd = arg.length ? Number(arg[0]) : nextRand();
        const total = prefix[prefix.length - 1];
        target = (rnd % total) + 1;
        steps.push({
          line: 9,
          tag: "抽出隨機目標",
          tagType: "default",
          inlineBadge: `target = ${rnd} % ${total} + 1 = ${target}`,
          explanation: `模擬 rand() 回傳 ${rnd}，取 ${rnd} % ${total} + 1 = ${target}，這是 1..${total} 之間均勻分布的數字。`,
          vars: vars(),
          state: snap()
        });
        lo = 0;
        hi = prefix.length - 1;
        steps.push({
          line: 10,
          tag: "設定二分搜尋範圍",
          tagType: "default",
          inlineBadge: `lo = 0, hi = ${hi}`,
          explanation: `在 prefix[0..${hi}] 中找第一個 ≥ ${target} 的位置，也就是 ${target} 所落入的區段。`,
          vars: vars(),
          state: snap()
        });
        while (lo < hi) {
          mid = lo + Math.floor((hi - lo) / 2);
          steps.push({
            line: 12,
            tag: "取中點",
            tagType: "tag-check",
            inlineBadge: `mid = ${mid}, prefix[mid] = ${prefix[mid]}`,
            explanation: `lo = ${lo}、hi = ${hi}，中點 mid = ${mid}，prefix[${mid}] = ${prefix[mid]}。`,
            vars: vars(),
            state: snap({ hlP: [mid], connectors: [{ from: "wb-var-target", to: `wb-cw-prefix-${mid}`, label: `${target} vs ${prefix[mid]}`, color: "blue" }] })
          });
          if (prefix[mid] < target) {
            lo = mid + 1;
            steps.push({
              line: 13,
              tag: "目標在右半",
              tagType: "tag-check",
              inlineBadge: `${prefix[mid]} < ${target} ➜ lo = ${lo}`,
              explanation: `prefix[${mid}] = ${prefix[mid]} < ${target}，索引 ${mid} 的區段太前面，答案在右側，lo = ${lo}。`,
              vars: vars(),
              state: snap({ hlP: [mid] })
            });
          } else {
            hi = mid;
            steps.push({
              line: 14,
              tag: "目標在左半（含 mid）",
              tagType: "tag-check",
              inlineBadge: `${prefix[mid]} >= ${target} ➜ hi = ${hi}`,
              explanation: `prefix[${mid}] = ${prefix[mid]} ≥ ${target}，mid 可能就是答案，往左收縮 hi = ${hi}。`,
              vars: vars(),
              state: snap({ hlP: [mid] })
            });
          }
          mid = "-";
        }
        outputs.push(lo);
        steps.push({
          line: 16,
          tag: "回傳選中的索引",
          tagType: "tag-found",
          inlineBadge: `return ${lo}`,
          explanation: `lo == hi = ${lo}：target = ${target} 落在區段 ${lo === 0 ? 1 : prefix[lo - 1] + 1}..${prefix[lo]}，所以選中索引 ${lo}（機率 ${w[lo]}/${total}）。`,
          vars: vars(String(lo)),
          state: snap({
            retVal: String(lo),
            matchP: [lo],
            newOut: outputs.length - 1,
            connectors: [{ from: `wb-cw-prefix-${lo}`, to: `wb-cw-out-${outputs.length - 1}`, label: `return ${lo}`, color: "green" }]
          })
        });
      });

      lo = "-";
      hi = "-";
      const out = fmtArr(outputs);
      opLabel = "全部呼叫完成";
      steps.push({
        line: 16,
        tag: "呼叫序列結束",
        tagType: "tag-found",
        inlineBadge: `outputs = ${out}`,
        explanation: `整個呼叫序列的輸出為 ${out}。`,
        vars: vars(out),
        state: snap({ retVal: out, connectors: outputs.length ? [{ from: "wb-dyn-out", to: "wb-var-ret", label: "outputs", color: "green" }] : [] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #122 Kth Largest Element in an Array (LC #215, Medium)
  // ==========================================================================
  window.PROBLEMS["kth-largest-element-in-an-array"] = {
    id: 122,
    leetcodeId: 215,
    slug: "kth-largest-element-in-an-array",
    title: "215. Kth Largest Element in an Array (陣列中的第 K 個最大元素)",
    difficulty: "Medium",
    topic: "Heap / Priority Queue",
    mins: 30,
    complexity: "Time O(n log k) · Space O(k)",
    argNames: ["nums", "k"],
    description:
      "給定整數陣列 nums 與整數 k，回傳排序後第 k 大的元素（重複值也各算一次）。維護一個大小最多為 k 的最小堆積：逐一推入元素，堆積超過 k 個就彈出最小的那個；掃描結束時堆積保留的正是最大的 k 個數，而堆頂（其中最小者）就是第 k 大。每次推入與彈出 O(log k)，總時間 O(n log k)、空間 O(k)。",

    presets: [
      { name: "範例 1：nums = [3,2,1,5,6,4], k = 2", args: [[3, 2, 1, 5, 6, 4], 2] },
      { name: "範例 2：nums = [3,2,3,1,2,4,5,5,6], k = 4（含重複值）", args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4] },
      { name: "邊界情況：nums = [1], k = 1", args: [[1], 1] },
      { name: "範例 4：nums = [7,-1,7,3], k = 1（含負數）", args: [[7, -1, 7, 3], 1] }
    ],

    cppLines: cpp([
      "class Solution {",
      "public:",
      "    int findKthLargest(vector<int>& nums, int k) {",
      "        priority_queue<int, vector<int>, greater<int>> minHeap;",
      "        for (int x : nums) {",
      "            minHeap.push(x);",
      "            if ((int)minHeap.size() > k) minHeap.pop();   // 丟掉最小者",
      "        }",
      "        return minHeap.top();",
      "    }",
      "};"
    ]),

    generateTrace(numsIn, kIn) {
      const nums = Array.isArray(numsIn) ? numsIn.slice() : [];
      const k = Number(kIn);
      const steps = [];
      const heap = [];
      let i = -1;
      const dropped = new Set();

      const heapNodes = (hlIdx = [], matchIdx = []) => {
        const W = 380;
        const nodes = heap.map((e, idx) => {
          const d = Math.floor(Math.log2(idx + 1));
          const pos = idx - (2 ** d - 1);
          const cnt = 2 ** d;
          return {
            id: `h${idx}`,
            val: String(e.v),
            sub: idx === 0 ? "top" : `[${idx}]`,
            x: Math.round((W * (pos + 0.5)) / cnt),
            y: 40 + d * 70,
            status: matchIdx.includes(idx) ? "match" : hlIdx.includes(idx) ? "hl" : ""
          };
        });
        const edges = [];
        for (let idx = 1; idx < heap.length; idx++) edges.push({ from: `h${Math.floor((idx - 1) / 2)}`, to: `h${idx}`, dir: true });
        return { nodes, edges, width: W + 20 };
      };

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hlIdx = [], matchIdx = [] } = opts;
        const t = heapNodes(hlIdx, matchIdx);
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
              hl: i >= 0 && i < nums.length ? [i] : [],
              warn: [...dropped],
              done: nums.map((_, j) => j).filter((j) => j < i && !dropped.has(j)),
              pointers: i >= 0 && i < nums.length ? [{ idx: i, label: "x", color: "blue" }] : []
            },
            {
              id: "heap",
              type: "tree",
              shape: "circle",
              name: "minHeap",
              typeLabel: "最小堆積 (priority_queue, greater)",
              x: 325,
              y: 175,
              width: t.width,
              height: 230,
              nodes: t.nodes,
              edges: t.edges
            },
            varsBoard([
              V("k", "k", k),
              V("x", "x", i >= 0 && i < nums.length ? nums[i] : "-", "hl"),
              V("size", "minHeap.size()", heap.length),
              V("top", "minHeap.top()", heap.length ? heap[0].v : "-", "hl"),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      // 堆積元素為 { v, src }，保留來源索引以標示被淘汰的元素
      const hv = () => heap.map((e) => e.v);
      const vars = (ret = "-") => ({
        x: i >= 0 && i < nums.length ? String(nums[i]) : "-",
        heap: fmtArr(hv()),
        "minHeap.size()": String(heap.length),
        return: ret
      });

      steps.push({
        line: 4,
        tag: "建立最小堆積",
        tagType: "default",
        inlineBadge: "minHeap = {}",
        explanation: `建立空的最小堆積，堆頂永遠是堆內最小值。目標：只保留最大的 ${k} 個數。`,
        vars: vars(),
        state: snap({})
      });

      for (i = 0; i < nums.length; i++) {
        const x = nums[i];
        heap.push({ v: x, src: i });
        let c = heap.length - 1;
        steps.push({
          line: 6,
          tag: "推入堆積",
          tagType: "tag-insert",
          inlineBadge: `minHeap.push(${x})`,
          explanation: `把 x = ${x} 放到堆積最後一個位置 [${c}]，接著與父節點比較維持最小堆積性質。`,
          vars: vars(),
          state: snap({ hlIdx: [c], connectors: [{ from: `wb-cw-nums-${i}`, to: `wb-node-heap-h${c}`, label: `push(${x})`, color: "purple" }] })
        });
        while (c > 0) {
          const p = Math.floor((c - 1) / 2);
          if (heap[p].v <= heap[c].v) break;
          [heap[p], heap[c]] = [heap[c], heap[p]];
          steps.push({
            line: 6,
            tag: "上浮 (sift up)",
            tagType: "tag-check",
            inlineBadge: `${heap[p].v} < ${heap[c].v} ➜ swap`,
            explanation: `${heap[p].v} 比父節點 ${heap[c].v} 小，兩者交換，${heap[p].v} 往上移到 [${p}]。`,
            vars: vars(),
            state: snap({ hlIdx: [p, c] })
          });
          c = p;
        }
        if (heap.length > k) {
          const removed = heap[0];
          steps.push({
            line: 7,
            tag: "超過 k 個，彈出最小",
            tagType: "tag-check",
            inlineBadge: `size ${heap.length} > ${k} ➜ pop(${removed.v})`,
            explanation: `堆積有 ${heap.length} 個元素，超過 k = ${k}。堆頂 ${removed.v} 是其中最小的，不可能是前 ${k} 大，將它彈出。`,
            vars: vars(),
            state: snap({ hlIdx: [0], connectors: [{ from: "wb-node-heap-h0", to: "wb-var-top", label: `pop ${removed.v}`, color: "red" }] })
          });
          dropped.add(removed.src);
          const last = heap.pop();
          if (heap.length) {
            heap[0] = last;
            let p = 0;
            steps.push({
              line: 7,
              tag: "末端元素移到堆頂",
              tagType: "tag-insert",
              inlineBadge: `heap[0] = ${last.v}`,
              explanation: `移除堆頂後，把最後一個元素 ${last.v} 搬到堆頂，再往下調整。`,
              vars: vars(),
              state: snap({ hlIdx: [0] })
            });
            for (;;) {
              const l = 2 * p + 1;
              const r = 2 * p + 2;
              let s = p;
              if (l < heap.length && heap[l].v < heap[s].v) s = l;
              if (r < heap.length && heap[r].v < heap[s].v) s = r;
              if (s === p) break;
              [heap[p], heap[s]] = [heap[s], heap[p]];
              steps.push({
                line: 7,
                tag: "下沉 (sift down)",
                tagType: "tag-check",
                inlineBadge: `swap [${p}] ↔ [${s}]`,
                explanation: `${heap[s].v} 比較小的子節點 ${heap[p].v} 大，兩者交換，${heap[s].v} 下沉到 [${s}]。`,
                vars: vars(),
                state: snap({ hlIdx: [p, s] })
              });
              p = s;
            }
          }
        } else {
          steps.push({
            line: 7,
            tag: "尚未超過 k",
            tagType: "tag-check",
            inlineBadge: `size ${heap.length} <= ${k}`,
            explanation: `堆積只有 ${heap.length} 個元素，未超過 k = ${k}，全部保留。`,
            vars: vars(),
            state: snap({})
          });
        }
      }
      i = nums.length;
      const ans = heap[0].v;
      steps.push({
        line: 9,
        tag: "堆頂即第 k 大",
        tagType: "tag-found",
        inlineBadge: `return ${ans}`,
        explanation: `堆積保留了最大的 ${k} 個數 ${fmtArr(hv())}，其中最小的堆頂 ${ans} 就是第 ${k} 大的元素。`,
        vars: vars(String(ans)),
        state: snap({ retVal: String(ans), matchIdx: [0], connectors: [{ from: "wb-node-heap-h0", to: "wb-var-ret", label: `第 ${k} 大`, color: "green" }] })
      });
      return steps;
    }
  };

  // ==========================================================================
  // #123 Longest Increasing Path in a Matrix (LC #329, Hard)
  // ==========================================================================
  window.PROBLEMS["longest-increasing-path-in-a-matrix"] = {
    id: 123,
    leetcodeId: 329,
    slug: "longest-increasing-path-in-a-matrix",
    title: "329. Longest Increasing Path in a Matrix (矩陣中的最長遞增路徑)",
    difficulty: "Hard",
    topic: "Graph / DFS + Memoization",
    mins: 40,
    complexity: "Time O(m · n) · Space O(m · n)",
    argNames: ["matrix"],
    description:
      "給定 m × n 整數矩陣，每一步只能往上下左右移動到數值嚴格更大的格子，求最長遞增路徑的長度。因為路徑嚴格遞增，不會走回頭形成環，可以把矩陣看成有向無環圖做 DFS + 記憶化：dfs(r, c) 回傳從 (r, c) 出發的最長路徑長度，等於 1 加上所有較大鄰居的 dfs 最大值；結果存入 memo，之後再遇到直接取用。每個格子只計算一次，時間與空間皆為 O(m · n)。",

    presets: [
      { name: "範例 1：matrix = [[9,9,4],[6,6,8],[2,1,1]]", args: [[[9, 9, 4], [6, 6, 8], [2, 1, 1]]] },
      { name: "範例 2：matrix = [[3,4,5],[3,2,6],[2,2,1]]", args: [[[3, 4, 5], [3, 2, 6], [2, 2, 1]]] },
      { name: "邊界情況：matrix = [[1]]", args: [[[1]]] },
      { name: "範例 4：matrix = [[1,2],[4,3]]（繞一圈）", args: [[[1, 2], [4, 3]]] }
    ],

    cppLines: cpp([
      "class Solution {",
      "    int m, n;",
      "    vector<vector<int>> memo;              // 0 代表尚未計算",
      "    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};",
      "    int dfs(vector<vector<int>>& mat, int r, int c) {",
      "        if (memo[r][c] != 0) return memo[r][c];",
      "        int best = 1;",
      "        for (auto& d : dirs) {",
      "            int nr = r + d[0], nc = c + d[1];",
      "            if (nr >= 0 && nr < m && nc >= 0 && nc < n && mat[nr][nc] > mat[r][c])",
      "                best = max(best, 1 + dfs(mat, nr, nc));",
      "        }",
      "        return memo[r][c] = best;",
      "    }",
      "public:",
      "    int longestIncreasingPath(vector<vector<int>>& matrix) {",
      "        m = matrix.size(); n = matrix[0].size();",
      "        memo.assign(m, vector<int>(n, 0));",
      "        int ans = 0;",
      "        for (int r = 0; r < m; ++r)",
      "            for (int c = 0; c < n; ++c)",
      "                ans = max(ans, dfs(matrix, r, c));",
      "        return ans;",
      "    }",
      "};"
    ]),

    generateTrace(matIn) {
      const mat = (Array.isArray(matIn) ? matIn : [[0]]).map((row) => row.slice());
      const m = mat.length;
      const n = m ? mat[0].length : 0;
      const memo = mat.map((row) => row.map(() => 0));
      const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      const steps = [];
      const frames = [];
      let ans = 0;
      let curR = -1;
      let curC = -1;

      const snap = (opts = {}) => {
        const { retVal = "-", connectors = [], hlM = [], warnM = [], memoHl = [], matchM = [] } = opts;
        const onStack = frames.map((f) => `${f.r},${f.c}`);
        const memoDone = [];
        memo.forEach((row, r) => row.forEach((v, c) => v && memoDone.push(`${r},${c}`)));
        const gridW = n * 46 + 60;
        return {
          boards: [
            {
              id: "mat",
              type: "grid",
              name: "matrix",
              typeLabel: "輸入矩陣",
              x: 325,
              y: 52,
              cells: mat.map((row) => row.map(String)),
              hl: [...hlM, ...onStack],
              warn: warnM,
              match: matchM,
              done: memoDone
            },
            {
              id: "memo",
              type: "grid",
              name: "memo",
              typeLabel: "從該格出發的最長長度",
              x: 325 + gridW + 40,
              y: 52,
              cells: memo.map((row) => row.map((v) => (v ? String(v) : "·"))),
              hl: memoHl,
              match: matchM,
              done: memoDone.filter((k) => !memoHl.includes(k))
            },
            {
              id: "calls",
              type: "stack",
              name: "call stack",
              typeLabel: "DFS 遞迴呼叫堆疊",
              x: 325,
              y: 52 + (m + 1) * 34 + 50,
              items: frames.map((f, i) => ({ val: `dfs(${f.r},${f.c}) best=${f.best}`, status: i === frames.length - 1 ? "hl" : "" }))
            },
            varsBoard([
              V("rc", "(r, c)", curR >= 0 ? `(${curR}, ${curC})` : "-", "hl"),
              V("val", "mat[r][c]", curR >= 0 ? mat[curR][curC] : "-"),
              V("best", "best", frames.length ? frames[frames.length - 1].best : "-", frames.length ? "hl" : ""),
              V("ans", "ans", ans, "hl"),
              V("ret", "return", retVal, retVal !== "-" ? "match" : "")
            ])
          ],
          connectors
        };
      };
      const vars = (ret = "-") => ({
        "(r,c)": curR >= 0 ? `(${curR},${curC})` : "-",
        best: frames.length ? String(frames[frames.length - 1].best) : "-",
        depth: String(frames.length),
        ans: String(ans),
        return: ret
      });

      steps.push({
        line: 18,
        tag: "初始化記憶表",
        tagType: "default",
        inlineBadge: `memo = ${m}×${n} 全 0`,
        explanation: `矩陣大小 ${m} × ${n}。memo[r][c] 記錄從 (r, c) 出發的最長遞增路徑長度，0 代表還沒算過。`,
        vars: vars(),
        state: snap()
      });

      const dfs = (r, c) => {
        curR = r;
        curC = c;
        if (memo[r][c] !== 0) {
          steps.push({
            line: 6,
            tag: "記憶化命中",
            tagType: "tag-found",
            inlineBadge: `memo[${r}][${c}] = ${memo[r][c]}`,
            explanation: `(${r}, ${c}) 已經算過，直接回傳 memo[${r}][${c}] = ${memo[r][c]}，不必重複搜尋。`,
            vars: vars(),
            state: snap({ memoHl: [`${r},${c}`], connectors: [{ from: `wb-grid-mat-${r}-${c}`, to: `wb-grid-memo-${r}-${c}`, label: "已計算", color: "green" }] })
          });
          return memo[r][c];
        }
        const f = { r, c, best: 1 };
        frames.push(f);
        steps.push({
          line: 7,
          tag: "進入 dfs",
          tagType: "tag-check",
          inlineBadge: `dfs(${r},${c}) ➜ best = 1`,
          explanation: `第一次計算 (${r}, ${c})（值 ${mat[r][c]}）。只走這一格的路徑長度為 1，先設 best = 1，再檢查四個方向的較大鄰居。`,
          vars: vars(),
          state: snap({ hlM: [`${r},${c}`] })
        });
        DIRS.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && mat[nr][nc] > mat[r][c]) {
            curR = r;
            curC = c;
            steps.push({
              line: 10,
              tag: "找到較大鄰居",
              tagType: "tag-check",
              inlineBadge: `${mat[nr][nc]} > ${mat[r][c]} ➜ dfs(${nr},${nc})`,
              explanation: `鄰居 (${nr}, ${nc}) 的值 ${mat[nr][nc]} 大於 ${mat[r][c]}，可以接在路徑後面，遞迴計算從它出發的最長長度。`,
              vars: vars(),
              state: snap({ warnM: [`${nr},${nc}`], connectors: [{ from: `wb-grid-mat-${r}-${c}`, to: `wb-grid-mat-${nr}-${nc}`, label: `${mat[r][c]} → ${mat[nr][nc]}`, color: "blue" }] })
            });
            const sub = dfs(nr, nc);
            curR = r;
            curC = c;
            const old = f.best;
            f.best = Math.max(f.best, 1 + sub);
            steps.push({
              line: 11,
              tag: "更新 best",
              tagType: f.best > old ? "tag-insert" : "tag-check",
              inlineBadge: `max(${old}, 1 + ${sub}) = ${f.best}`,
              explanation:
                f.best > old
                  ? `從 (${nr}, ${nc}) 出發最長 ${sub}，加上 (${r}, ${c}) 自己共 ${1 + sub}，best 更新為 ${f.best}。`
                  : `經由 (${nr}, ${nc}) 的長度 ${1 + sub} 沒有超過目前 best = ${old}，維持不變。`,
              vars: vars(),
              state: snap({ connectors: [{ from: `wb-grid-memo-${nr}-${nc}`, to: "wb-var-best", label: `1 + ${sub}`, color: "purple" }] })
            });
          }
        });
        memo[r][c] = f.best;
        curR = r;
        curC = c;
        steps.push({
          line: 13,
          tag: "寫入記憶表",
          tagType: "tag-insert",
          inlineBadge: `memo[${r}][${c}] = ${f.best}`,
          explanation: `四個方向都檢查完（其餘方向越界或數值不更大），從 (${r}, ${c}) 出發的最長遞增路徑長度為 ${f.best}，存入 memo 後回傳。`,
          vars: vars(),
          state: snap({ memoHl: [`${r},${c}`], connectors: [{ from: `wb-grid-mat-${r}-${c}`, to: `wb-grid-memo-${r}-${c}`, label: `= ${f.best}`, color: "purple" }] })
        });
        frames.pop();
        return f.best;
      };

      for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
          const res = dfs(r, c);
          curR = r;
          curC = c;
          const old = ans;
          ans = Math.max(ans, res);
          steps.push({
            line: 22,
            tag: "更新全域答案",
            tagType: ans > old ? "tag-insert" : "tag-check",
            inlineBadge: `ans = max(${old}, ${res}) = ${ans}`,
            explanation: ans > old ? `從 (${r}, ${c}) 出發可走 ${res} 格，刷新答案 ans = ${ans}。` : `從 (${r}, ${c}) 出發可走 ${res} 格，沒有超過 ans = ${ans}。`,
            vars: vars(),
            state: snap({ memoHl: [`${r},${c}`], connectors: [{ from: `wb-grid-memo-${r}-${c}`, to: "wb-var-ans", label: `${res}`, color: ans > old ? "purple" : "blue" }] })
          });
        }
      }
      curR = -1;
      const best = [];
      memo.forEach((row, r) => row.forEach((v, c) => v === ans && best.push(`${r},${c}`)));
      steps.push({
        line: 23,
        tag: "回傳最長長度",
        tagType: "tag-found",
        inlineBadge: `return ${ans}`,
        explanation: `所有格子都計算完畢，最長遞增路徑長度為 ${ans}（綠色格子為最長路徑的起點）。`,
        vars: vars(String(ans)),
        state: snap({ retVal: String(ans), matchM: best, connectors: [{ from: "wb-var-ans", to: "wb-var-ret", label: "ans", color: "green" }] })
      });
      return steps;
    }
  };
})();

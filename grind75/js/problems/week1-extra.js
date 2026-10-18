/**
 * Grind 75 — Week 1 (Problems #2 to #13, 12 problems total)
 * Pure Vanilla JS (ES6+) + C++17 Step-by-Step Trace Generators & Whiteboard State
 */
window.PROBLEMS = window.PROBLEMS || {};

// ============================================================================
// #2 Valid Parentheses (LC #20, Easy, Stack)
// ============================================================================
window.PROBLEMS["valid-parentheses"] = {
  id: 2,
  leetcodeId: 20,
  slug: "valid-parentheses",
  title: "20. Valid Parentheses (有效的括號)",
  difficulty: "Easy",
  topic: "Stack",
  mins: 20,
  complexity: "Time O(N) · Space O(N)",
  description:
    "給定一個只包括 '('，')'，'{'，'}'，'['，']' 的字串 s，判斷字串是否有效。有效字串需滿足：左括號必須用相同類型的右括號閉合，且左括號必須以正確的順序閉合。使用 C++ stack<char> 可在 O(N) 時間內完成括號配對檢查。",
  argNames: ["s"],
  presets: [
    { name: "範例 1：混合括號 s = \"()[]{}\"", args: ["()[]{}"] },
    { name: "範例 2：巢狀括號 s = \"{[]}()\"", args: ["{[]}()"] },
    { name: "範例 3：括號不匹配 s = \"(]\"", args: ["(]"] },
    { name: "範例 4：多餘左括號 s = \"(([\"", args: ["((["] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isValid</span>(<span class="tok-type">string</span> s) {' },
    { line: 4,  code: '        <span class="tok-type">stack</span>&lt;<span class="tok-kw">char</span>&gt; st;' },
    { line: 5,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; s.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 6,  code: '            <span class="tok-kw">char</span> c = s[i];' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (c == <span class="tok-num">\'(\'</span> || c == <span class="tok-num">\'[\'</span> || c == <span class="tok-num">\'{\'</span>) {' },
    { line: 8,  code: '                st.<span class="tok-fn">push</span>(c);' },
    { line: 9,  code: '            } <span class="tok-kw">else</span> {' },
    { line: 10, code: '                <span class="tok-kw">if</span> (st.<span class="tok-fn">empty</span>()) <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 11, code: '                <span class="tok-kw">char</span> top = st.<span class="tok-fn">top</span>();' },
    { line: 12, code: '                <span class="tok-kw">if</span> ((c == <span class="tok-num">\')\'</span> &amp;&amp; top != <span class="tok-num">\'(\'</span>) || (c == <span class="tok-num">\']\'</span> &amp;&amp; top != <span class="tok-num">\'[\'</span>) || (c == <span class="tok-num">\'}\'</span> &amp;&amp; top != <span class="tok-num">\'{\'</span>))' },
    { line: 13, code: '                    <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 14, code: '                st.<span class="tok-fn">pop</span>();' },
    { line: 15, code: '            }' },
    { line: 16, code: '        }' },
    { line: 17, code: '        <span class="tok-kw">return</span> st.<span class="tok-fn">empty</span>();' },
    { line: 18, code: '    }' },
    { line: 19, code: '};' }
  ],
  generateTrace(s) {
    const str = String(s || "");
    const chars = str.split("");
    const steps = [];
    const st = [];
    const doneIndices = [];

    const makeState = (currIdx, hlIndices, matchIndices, warnIndices, stackHlTop, stackMatchTop, stackWarnTop, retVal, connectors) => {
      const stackItems = st.map((ch, idx) => {
        let status = "";
        if (idx === st.length - 1) {
          if (stackMatchTop) status = "match";
          else if (stackWarnTop) status = "warn";
          else if (stackHlTop) status = "hl";
        }
        return { val: `'${ch}'`, status };
      });
      const cVal = currIdx >= 0 && currIdx < chars.length ? `'${chars[currIdx]}'` : "-";
      const topVal = st.length > 0 ? `'${st[st.length - 1]}'` : "empty";
      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: "字串 (string)",
            x: 325,
            y: 52,
            values: chars.map((ch) => `'${ch}'`),
            hl: hlIndices,
            match: matchIndices,
            warn: warnIndices,
            done: [...doneIndices],
            pointers: currIdx >= 0 ? [{ idx: currIdx, label: `i = ${currIdx}`, color: warnIndices.length ? "red" : matchIndices.length ? "green" : "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "區域變數與回傳值",
            x: 24,
            y: 205,
            items: [
              { id: "c", name: "c (s[i])", val: cVal, status: currIdx >= 0 ? "hl" : "" },
              { id: "top", name: "st.top()", val: topVal, status: stackWarnTop ? "warn" : stackMatchTop ? "match" : "" },
              { id: "size", name: "st.size()", val: String(st.length), status: "" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          },
          {
            id: "st",
            type: "stack",
            name: "st",
            typeLabel: "堆疊 (stack<char>)",
            x: 325,
            y: 205,
            items: stackItems
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 4,
      tag: "初始化堆疊",
      tagType: "default",
      inlineBadge: `st = [] (size = 0)`,
      explanation: `進入 isValid("${str}")，宣告空堆疊 stack<char> st 用來暫存尚未配對的左括號。`,
      vars: { i: "-", c: "-", "st.top()": "empty", "st.size()": "0", return: "-" },
      state: makeState(-1, [], [], [], false, false, false, "-", [])
    });

    const matchMap = { ")": "(", "]": "[", "}": "{" };

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const isLeft = c === "(" || c === "[" || c === "{";

      steps.push({
        line: 6,
        tag: `讀取 s[${i}]`,
        tagType: "tag-check",
        inlineBadge: `c = '${c}'`,
        explanation: `迴圈 i = ${i}，取出字元 c = s[${i}] = '${c}'，檢查它是左括號還是右括號。`,
        vars: { i: String(i), c: `'${c}'`, "st.top()": st.length ? `'${st[st.length - 1]}'` : "empty", "st.size()": String(st.length), return: "-" },
        state: makeState(i, [i], [], [], false, false, false, "-", [
          { from: `wb-cw-s-${i}`, to: "wb-var-c", label: `讀取 '${c}'`, color: "blue" }
        ])
      });

      if (isLeft) {
        st.push(c);
        steps.push({
          line: 8,
          tag: "推入左括號",
          tagType: "tag-insert",
          inlineBadge: `st.push('${c}')`,
          explanation: `'${c}' 是左括號，執行 st.push('${c}') 將其推入堆疊頂端等待後續右括號配對。`,
          vars: { i: String(i), c: `'${c}'`, "st.top()": `'${c}'`, "st.size()": String(st.length), return: "-" },
          state: makeState(i, [i], [], [], true, false, false, "-", [
            { from: `wb-cw-s-${i}`, to: `wb-stack-st-${st.length - 1}`, label: `push('${c}')`, color: "purple" }
          ])
        });
        doneIndices.push(i);
      } else {
        if (st.length === 0) {
          steps.push({
            line: 10,
            tag: "堆疊為空失敗",
            tagType: "default",
            inlineBadge: `st.empty() == true -> return false`,
            explanation: `遇到右括號 '${c}'，但目前堆疊 st 為空，沒有任何左括號可與之配對，立即回傳 false！`,
            vars: { i: String(i), c: `'${c}'`, "st.top()": "empty", "st.size()": "0", return: "false" },
            state: makeState(i, [], [], [i], false, false, false, "false", [
              { from: `wb-cw-s-${i}`, to: "wb-var-ret", label: "無左括號可配對", color: "red" }
            ])
          });
          return steps;
        }

        const top = st[st.length - 1];
        const isMatched = matchMap[c] === top;

        steps.push({
          line: 12,
          tag: isMatched ? "括號配對成功" : "括號類型不合",
          tagType: isMatched ? "tag-found" : "default",
          inlineBadge: `top = '${top}', c = '${c}' (${isMatched ? "匹配!" : "不匹配!"})`,
          explanation: isMatched
            ? `檢查堆疊頂端 top = '${top}' 與當前右括號 c = '${c}'：類型完全吻合！`
            : `檢查堆疊頂端 top = '${top}' 與當前右括號 c = '${c}'：括號類型不匹配，條件觸發準備回傳 false。`,
          vars: { i: String(i), c: `'${c}'`, "st.top()": `'${top}'`, "st.size()": String(st.length), return: "-" },
          state: makeState(i, [], isMatched ? [i] : [], isMatched ? [] : [i], false, isMatched, !isMatched, "-", [
            { from: `wb-cw-s-${i}`, to: `wb-stack-st-${st.length - 1}`, label: isMatched ? `'${top}' 配對 '${c}'` : `'${top}' != '${matchMap[c]}'`, color: isMatched ? "green" : "red" }
          ])
        });

        if (!isMatched) {
          steps.push({
            line: 13,
            tag: "配對失敗回傳",
            tagType: "default",
            inlineBadge: `return false`,
            explanation: `由於堆疊頂端 '${top}' 與 '${c}' 不匹配，違反括號閉合規則，直接回傳 false。`,
            vars: { i: String(i), c: `'${c}'`, "st.top()": `'${top}'`, "st.size()": String(st.length), return: "false" },
            state: makeState(i, [], [], [i], false, false, true, "false", [
              { from: `wb-cw-s-${i}`, to: "wb-var-ret", label: "return false", color: "red" }
            ])
          });
          return steps;
        }

        st.pop();
        doneIndices.push(i);
        steps.push({
          line: 14,
          tag: "彈出堆疊頂端",
          tagType: "tag-insert",
          inlineBadge: `st.pop() -> size = ${st.length}`,
          explanation: `配對成功後執行 st.pop() 將 '${top}' 彈出堆疊，目前堆疊剩餘 ${st.length} 個元素。`,
          vars: { i: String(i), c: `'${c}'`, "st.top()": st.length ? `'${st[st.length - 1]}'` : "empty", "st.size()": String(st.length), return: "-" },
          state: makeState(i, [], [i], [], false, false, false, "-", [])
        });
      }
    }

    const finalValid = st.length === 0;
    steps.push({
      line: 17,
      tag: finalValid ? "全部配對成功" : "剩餘未閉合括號",
      tagType: finalValid ? "tag-found" : "default",
      inlineBadge: `return st.empty() == ${finalValid}`,
      explanation: finalValid
        ? `字串走訪完畢且堆疊 st 已完全清空 (st.empty() == true)，所有括號皆正確閉合，回傳 true！`
        : `字串走訪完畢但堆疊中仍殘留 ${st.length} 個未閉合的左括號，st.empty() 為 false，回傳 false。`,
      vars: { i: String(chars.length), c: "-", "st.top()": st.length ? `'${st[st.length - 1]}'` : "empty", "st.size()": String(st.length), return: String(finalValid) },
      state: makeState(-1, [], [], [], false, false, !finalValid, String(finalValid), [])
    });

    return steps;
  }
};

// ============================================================================
// #3 Merge Two Sorted Lists (LC #21, Easy, Linked List)
// ============================================================================
window.PROBLEMS["merge-two-sorted-lists"] = {
  id: 3,
  leetcodeId: 21,
  slug: "merge-two-sorted-lists",
  title: "21. Merge Two Sorted Lists (合併兩個有序鏈結串列)",
  difficulty: "Easy",
  topic: "Linked List",
  mins: 20,
  complexity: "Time O(N + M) · Space O(1)",
  description:
    "將兩個升序鏈結串列 list1 與 list2 合併為一個新的升序鏈結串列並回傳。透過虛擬頭節點 (dummy head) 與游標指標 tail 逐步比較 l1->val 與 l2->val，在 O(N+M) 時間、O(1) 額外空間內完成串接。",
  argNames: ["list1", "list2"],
  presets: [
    { name: "範例 1：標準交錯合併 list1 = [1, 2, 4], list2 = [1, 3, 4]", args: [[1, 2, 4], [1, 3, 4]] },
    { name: "範例 2：長短不一 list1 = [2, 6], list2 = [1, 3, 5, 7]", args: [[2, 6], [1, 3, 5, 7]] },
    { name: "範例 3：其中一串列較小 list1 = [1, 2], list2 = [5, 6]", args: [[1, 2], [5, 6]] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">ListNode</span>* <span class="tok-fn">mergeTwoLists</span>(<span class="tok-type">ListNode</span>* l1, <span class="tok-type">ListNode</span>* l2) {' },
    { line: 4,  code: '        <span class="tok-type">ListNode</span> dummy(<span class="tok-num">0</span>);' },
    { line: 5,  code: '        <span class="tok-type">ListNode</span>* tail = &amp;dummy;' },
    { line: 6,  code: '        <span class="tok-kw">while</span> (l1 &amp;&amp; l2) {' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (l1-&gt;val &lt;= l2-&gt;val) {' },
    { line: 8,  code: '                tail-&gt;next = l1; l1 = l1-&gt;next;' },
    { line: 9,  code: '            } <span class="tok-kw">else</span> {' },
    { line: 10, code: '                tail-&gt;next = l2; l2 = l2-&gt;next;' },
    { line: 11, code: '            }' },
    { line: 12, code: '            tail = tail-&gt;next;' },
    { line: 13, code: '        }' },
    { line: 14, code: '        tail-&gt;next = l1 ? l1 : l2;' },
    { line: 15, code: '        <span class="tok-kw">return</span> dummy.next;' },
    { line: 16, code: '    }' },
    { line: 17, code: '};' }
  ],
  generateTrace(list1, list2) {
    const a1 = Array.isArray(list1) ? [...list1] : [1, 2, 4];
    const a2 = Array.isArray(list2) ? [...list2] : [1, 3, 4];
    const steps = [];
    let i = 0;
    let j = 0;
    const merged = [];

    const makeState = (hl1, hl2, mergedMatchAll, connectors) => {
      const done1 = Array.from({ length: i }, (_, k) => k);
      const done2 = Array.from({ length: j }, (_, k) => k);
      const listNodes = [{ id: "dummy", val: "D(0)", x: 42, y: 55, status: merged.length === 0 ? "hl" : "done", ptr: merged.length === 0 ? "tail" : "dummy" }];
      const listEdges = [];
      merged.forEach((m, idx) => {
        const nid = `m${idx}`;
        const prevId = idx === 0 ? "dummy" : `m${idx - 1}`;
        const isLast = idx === merged.length - 1;
        listNodes.push({
          id: nid,
          val: String(m.val),
          sub: m.src,
          x: 42 + (idx + 1) * 68,
          y: 55,
          status: mergedMatchAll ? "match" : isLast ? "hl" : "match",
          ptr: isLast ? "tail" : ""
        });
        listEdges.push({ from: prevId, to: nid, status: isLast ? "hl" : "match" });
      });

      const l1Val = i < a1.length ? String(a1[i]) : "nullptr";
      const l2Val = j < a2.length ? String(a2[j]) : "nullptr";
      const tailVal = merged.length ? String(merged[merged.length - 1].val) : "dummy(0)";

      return {
        boards: [
          {
            id: "l1",
            type: "array",
            name: "list1",
            typeLabel: "鏈結串列 1 (ListNode* l1)",
            x: 325,
            y: 52,
            values: a1,
            hl: hl1 ? [i] : [],
            done: done1,
            pointers: i < a1.length ? [{ idx: i, label: "l1", color: "blue" }] : []
          },
          {
            id: "l2",
            type: "array",
            name: "list2",
            typeLabel: "鏈結串列 2 (ListNode* l2)",
            x: 615,
            y: 52,
            values: a2,
            hl: hl2 ? [j] : [],
            done: done2,
            pointers: j < a2.length ? [{ idx: j, label: "l2", color: "purple" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "游標指標狀態",
            x: 24,
            y: 205,
            items: [
              { id: "v1", name: "l1->val", val: l1Val, status: hl1 ? "hl" : "" },
              { id: "v2", name: "l2->val", val: l2Val, status: hl2 ? "hl" : "" },
              { id: "vtail", name: "tail->val", val: tailVal, status: "match" }
            ]
          },
          {
            id: "merged",
            type: "list",
            shape: "list",
            name: "dummy.next (merged)",
            typeLabel: "合併後結果鏈結串列",
            x: 325,
            y: 205,
            width: Math.max(460, (merged.length + 2) * 70),
            height: 115,
            nodes: listNodes,
            edges: listEdges
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 5,
      tag: "建立虛擬頭節點",
      tagType: "default",
      inlineBadge: `dummy(0), tail = &dummy`,
      explanation: `建立虛擬頭節點 dummy(0)，並讓游標指標 tail 指向 dummy，準備依序串接 l1 與 l2 中較小的節點。`,
      vars: { "l1->val": a1.length ? String(a1[0]) : "null", "l2->val": a2.length ? String(a2[0]) : "null", "tail->val": "dummy(0)", merged_len: "0" },
      state: makeState(false, false, false, [])
    });

    while (i < a1.length && j < a2.length) {
      const v1 = a1[i];
      const v2 = a2[j];
      const pick1 = v1 <= v2;

      steps.push({
        line: 7,
        tag: "比較 l1 與 l2",
        tagType: "tag-check",
        inlineBadge: `${v1} <= ${v2} (${pick1})`,
        explanation: `比較目前兩串列頭端：l1->val (${v1}) ${pick1 ? "<=" : ">"} l2->val (${v2})，選擇較小的 ${pick1 ? `l1 (${v1})` : `l2 (${v2})`}。`,
        vars: { "l1->val": String(v1), "l2->val": String(v2), "tail->val": merged.length ? String(merged[merged.length - 1].val) : "dummy(0)", merged_len: String(merged.length) },
        state: makeState(true, true, false, [
          { from: `wb-cw-l1-${i}`, to: "wb-var-v1", label: `l1=${v1}`, color: "blue" },
          { from: `wb-cw-l2-${j}`, to: "wb-var-v2", label: `l2=${v2}`, color: "purple" }
        ])
      });

      if (pick1) {
        const srcIdx = i;
        merged.push({ val: v1, src: `l1[${srcIdx}]` });
        i++;
        steps.push({
          line: 8,
          tag: "串接 l1 節點",
          tagType: "tag-insert",
          inlineBadge: `tail->next = l1 (${v1}); l1 = l1->next`,
          explanation: `將 tail->next 指向 l1 的節點 (${v1})，並將 l1 往後推進一格，再將 tail 移至新尾端。`,
          vars: { "l1->val": i < a1.length ? String(a1[i]) : "null", "l2->val": String(v2), "tail->val": String(v1), merged_len: String(merged.length) },
          state: makeState(false, false, false, [
            { from: `wb-cw-l1-${srcIdx}`, to: `wb-node-merged-m${merged.length - 1}`, label: `接入 ${v1}`, color: "green" }
          ])
        });
      } else {
        const srcIdx = j;
        merged.push({ val: v2, src: `l2[${srcIdx}]` });
        j++;
        steps.push({
          line: 10,
          tag: "串接 l2 節點",
          tagType: "tag-insert",
          inlineBadge: `tail->next = l2 (${v2}); l2 = l2->next`,
          explanation: `將 tail->next 指向 l2 的節點 (${v2})，並將 l2 往後推進一格，再將 tail 移至新尾端。`,
          vars: { "l1->val": String(v1), "l2->val": j < a2.length ? String(a2[j]) : "null", "tail->val": String(v2), merged_len: String(merged.length) },
          state: makeState(false, false, false, [
            { from: `wb-cw-l2-${srcIdx}`, to: `wb-node-merged-m${merged.length - 1}`, label: `接入 ${v2}`, color: "green" }
          ])
        });
      }
    }

    while (i < a1.length) {
      merged.push({ val: a1[i], src: `l1[${i}]` });
      i++;
    }
    while (j < a2.length) {
      merged.push({ val: a2[j], src: `l2[${j}]` });
      j++;
    }

    steps.push({
      line: 14,
      tag: "串接剩餘尾端",
      tagType: "tag-insert",
      inlineBadge: `tail->next = l1 ? l1 : l2`,
      explanation: `其中一個串列已走訪完畢，直接將另一個非空串列的剩餘節點整段接在 tail->next 後方。`,
      vars: { "l1->val": "null", "l2->val": "null", "tail->val": merged.length ? String(merged[merged.length - 1].val) : "dummy(0)", merged_len: String(merged.length) },
      state: makeState(false, false, true, [])
    });

    const resStr = `[${merged.map((m) => m.val).join(", ")}]`;
    steps.push({
      line: 15,
      tag: "回傳合併頭節點",
      tagType: "tag-found",
      inlineBadge: `return dummy.next -> ${resStr}`,
      explanation: `合併完成！回傳 dummy.next，最終有序鏈結串列為 ${resStr}。`,
      vars: { "l1->val": "null", "l2->val": "null", "tail->val": merged.length ? String(merged[merged.length - 1].val) : "dummy(0)", return: resStr },
      state: makeState(false, false, true, [])
    });

    return steps;
  }
};

// ============================================================================
// #4 Best Time to Buy and Sell Stock (LC #121, Easy, Array)
// ============================================================================
window.PROBLEMS["best-time-to-buy-and-sell-stock"] = {
  id: 4,
  leetcodeId: 121,
  slug: "best-time-to-buy-and-sell-stock",
  title: "121. Best Time to Buy and Sell Stock (買賣股票的最佳時機)",
  difficulty: "Easy",
  topic: "Array",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  description:
    "給定陣列 prices，其中 prices[i] 表示第 i 天的股票價格。你只能選擇某一天買入並在未來的某一天賣出。設計演算法計算你能獲取的最大利潤。透過單次掃描同時維護歷史最低買價 minPrice 與最大獲利 maxProfit。",
  argNames: ["prices"],
  presets: [
    { name: "範例 1：標準波段 prices = [7, 1, 5, 3, 6, 4]", args: [[7, 1, 5, 3, 6, 4]] },
    { name: "範例 2：持續下跌無利潤 prices = [7, 6, 4, 3, 1]", args: [[7, 6, 4, 3, 1]] },
    { name: "範例 3：後段創高 prices = [2, 4, 1, 7]", args: [[2, 4, 1, 7]] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">maxProfit</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; prices) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> minPrice = prices[<span class="tok-num">0</span>];' },
    { line: 5,  code: '        <span class="tok-kw">int</span> maxProfit = <span class="tok-num">0</span>;' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">1</span>; i &lt; prices.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (prices[i] &lt; minPrice) {' },
    { line: 8,  code: '                minPrice = prices[i];' },
    { line: 9,  code: '            } <span class="tok-kw">else</span> {' },
    { line: 10, code: '                maxProfit = <span class="tok-fn">max</span>(maxProfit, prices[i] - minPrice);' },
    { line: 11, code: '            }' },
    { line: 12, code: '        }' },
    { line: 13, code: '        <span class="tok-kw">return</span> maxProfit;' },
    { line: 14, code: '    }' },
    { line: 15, code: '};' }
  ],
  generateTrace(prices) {
    const arr = Array.isArray(prices) && prices.length ? [...prices] : [7, 1, 5, 3, 6, 4];
    const steps = [];
    let minPrice = arr[0];
    let minIdx = 0;
    let maxProfit = 0;
    let bestBuyIdx = 0;
    let bestSellIdx = 0;
    const doneIndices = [];

    const makeState = (currIdx, profitStr, hlMin, hlMax, retVal, connectors) => {
      const ptrs = [{ idx: minIdx, label: `min=${minPrice}`, color: "green" }];
      if (currIdx >= 0) {
        ptrs.push({ idx: currIdx, label: `i=${currIdx}`, color: "blue" });
      }
      const matchArr = retVal !== "-" && maxProfit > 0 ? [bestBuyIdx, bestSellIdx] : [minIdx];
      return {
        boards: [
          {
            id: "prices",
            type: "array",
            name: "prices",
            typeLabel: "每日股價 (vector<int>)",
            x: 325,
            y: 52,
            values: arr,
            hl: currIdx >= 0 ? [currIdx] : [],
            match: matchArr,
            done: [...doneIndices],
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "最低買價與最大利潤追蹤",
            x: 325,
            y: 215,
            items: [
              { id: "minP", name: "minPrice", val: String(minPrice), status: hlMin ? "hl" : "match" },
              { id: "prof", name: "prices[i] - minPrice", val: profitStr, status: profitStr !== "-" ? "hl" : "" },
              { id: "maxP", name: "maxProfit", val: String(maxProfit), status: hlMax ? "match" : "" },
              { id: "ret", name: "return", val: retVal, status: retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 5,
      tag: "初始化最低價与利潤",
      tagType: "default",
      inlineBadge: `minPrice = ${minPrice}, maxProfit = 0`,
      explanation: `將歷史最低買入價初始化為第 0 天股價 minPrice = prices[0] = ${minPrice}，最大利潤 maxProfit = 0。`,
      vars: { i: "0", "prices[i]": String(arr[0]), minPrice: String(minPrice), maxProfit: "0", return: "-" },
      state: makeState(-1, "-", true, false, "-", [])
    });

    for (let i = 1; i < arr.length; i++) {
      const p = arr[i];
      if (p < minPrice) {
        minPrice = p;
        minIdx = i;
        steps.push({
          line: 8,
          tag: `發現更低買點 (${p})`,
          tagType: "tag-insert",
          inlineBadge: `minPrice = ${p} (第 ${i} 天)`,
          explanation: `第 ${i} 天股價 prices[${i}] = ${p} 低於目前最低價，更新歷史最低買入點 minPrice = ${p}。`,
          vars: { i: String(i), "prices[i]": String(p), minPrice: String(minPrice), maxProfit: String(maxProfit), return: "-" },
          state: makeState(i, "-", true, false, "-", [
            { from: `wb-cw-prices-${i}`, to: "wb-var-minP", label: `新低價 ${p}`, color: "green" }
          ])
        });
      } else {
        const profit = p - minPrice;
        const improved = profit > maxProfit;
        if (improved) {
          maxProfit = profit;
          bestBuyIdx = minIdx;
          bestSellIdx = i;
        }
        steps.push({
          line: 10,
          tag: improved ? `更新最大利潤 (+${profit})` : `計算當日賣出利潤`,
          tagType: improved ? "tag-found" : "tag-check",
          inlineBadge: `profit = ${p} - ${minPrice} = ${profit}, maxProfit = ${maxProfit}`,
          explanation: improved
            ? `若在第 ${minIdx} 天以 ${minPrice} 買入、第 ${i} 天以 ${p} 賣出，可獲利 ${profit}，創新高！更新 maxProfit = ${maxProfit}。`
            : `若今天以 ${p} 賣出，獲利為 ${p} - ${minPrice} = ${profit}，未超過目前 maxProfit (${maxProfit})。`,
          vars: { i: String(i), "prices[i]": String(p), minPrice: String(minPrice), maxProfit: String(maxProfit), return: "-" },
          state: makeState(i, `${p} - ${minPrice} = ${profit}`, false, improved, "-", [
            { from: `wb-cw-prices-${i}`, to: improved ? "wb-var-maxP" : "wb-var-prof", label: improved ? `新高利潤 +${profit}` : `利潤 ${profit}`, color: improved ? "green" : "blue" }
          ])
        });
      }
      if (i !== minIdx) doneIndices.push(i);
    }

    steps.push({
      line: 13,
      tag: "回傳最大利潤",
      tagType: "tag-found",
      inlineBadge: `return ${maxProfit}`,
      explanation: `單次掃描結束，回傳最大可獲利潤 maxProfit = ${maxProfit}。`,
      vars: { i: String(arr.length), "prices[i]": "-", minPrice: String(minPrice), maxProfit: String(maxProfit), return: String(maxProfit) },
      state: makeState(-1, "-", false, true, String(maxProfit), [])
    });

    return steps;
  }
};

// ============================================================================
// #5 Valid Palindrome (LC #125, Easy, String)
// ============================================================================
window.PROBLEMS["valid-palindrome"] = {
  id: 5,
  leetcodeId: 125,
  slug: "valid-palindrome",
  title: "125. Valid Palindrome (驗證迴文串)",
  difficulty: "Easy",
  topic: "String / Two Pointers",
  mins: 15,
  complexity: "Time O(N) · Space O(1)",
  description:
    "如果在將所有大寫字元轉換為小寫字元、並移除所有非字母數字字元之後，短語正著讀和反著讀都一樣，則可以認為該短語是一個迴文串。使用左右雙指標 left 與 right 從兩端向中間夾擠比對。",
  argNames: ["s"],
  presets: [
    { name: "範例 1：含空格與標點 s = \"A man, a plan, a canal: Panama\"", args: ["A man, a plan, a canal: Panama"] },
    { name: "範例 2：經典迴文 s = \"race a car\"", args: ["race a car"] },
    { name: "範例 3：精簡迴文 s = \"ab_a\"", args: ["ab_a"] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isPalindrome</span>(<span class="tok-type">string</span> s) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> left = <span class="tok-num">0</span>, right = (<span class="tok-kw">int</span>)s.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (left &lt; right) {' },
    { line: 6,  code: '            <span class="tok-kw">while</span> (left &lt; right &amp;&amp; !<span class="tok-fn">isalnum</span>(s[left])) ++left;' },
    { line: 7,  code: '            <span class="tok-kw">while</span> (left &lt; right &amp;&amp; !<span class="tok-fn">isalnum</span>(s[right])) --right;' },
    { line: 8,  code: '            <span class="tok-kw">if</span> (<span class="tok-fn">tolower</span>(s[left]) != <span class="tok-fn">tolower</span>(s[right]))' },
    { line: 9,  code: '                <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 10, code: '            ++left; --right;' },
    { line: 11, code: '        }' },
    { line: 12, code: '        <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 13, code: '    }' },
    { line: 14, code: '};' }
  ],
  generateTrace(s) {
    const raw = String(s || "race a car");
    // 若輸入過長，截斷至合適顯示寬度或保留完整字元陣列
    const chars = raw.length > 16 ? raw.replace(/[^a-zA-Z0-9]/g, "").split("") : raw.split("");
    const steps = [];
    let left = 0;
    let right = chars.length - 1;
    const isAlnum = (ch) => /^[a-zA-Z0-9]$/.test(ch);
    const doneIndices = [];

    const makeState = (l, r, statusMode, retVal, connectors) => {
      const hl = [];
      const match = [];
      const warn = [];
      if (l <= r && l >= 0 && r < chars.length) {
        if (statusMode === "match") match.push(l, r);
        else if (statusMode === "warn") warn.push(l, r);
        else hl.push(l, r);
      }
      const lChar = l >= 0 && l < chars.length ? `'${chars[l].toLowerCase()}'` : "-";
      const rChar = r >= 0 && r < chars.length ? `'${chars[r].toLowerCase()}'` : "-";
      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `字元陣列 (長度 ${chars.length})`,
            x: 325,
            y: 52,
            values: chars.map((c) => (c === " " ? "'␣'" : `'${c}'`)),
            hl,
            match,
            warn,
            done: [...doneIndices],
            pointers:
              l <= r
                ? [
                    { idx: l, label: `L=${l}`, color: statusMode === "warn" ? "red" : "blue" },
                    { idx: r, label: `R=${r}`, color: statusMode === "warn" ? "red" : "purple" }
                  ]
                : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "雙指標比對狀態",
            x: 325,
            y: 215,
            items: [
              { id: "lc", name: "tolower(s[L])", val: lChar, status: statusMode === "match" ? "match" : statusMode === "warn" ? "warn" : "hl" },
              { id: "rc", name: "tolower(s[R])", val: rChar, status: statusMode === "match" ? "match" : statusMode === "warn" ? "warn" : "hl" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 4,
      tag: "初始化左右雙指標",
      tagType: "default",
      inlineBadge: `left = 0, right = ${right}`,
      explanation: `設定左指標 left = 0 指向字首，右指標 right = ${right} 指向字尾，準備向中間夾擠比對。`,
      vars: { left: "0", right: String(right), "s[left]": `'${chars[0]}'`, "s[right]": `'${chars[right]}'`, return: "-" },
      state: makeState(left, right, "hl", "-", [])
    });

    while (left < right) {
      while (left < right && !isAlnum(chars[left])) {
        doneIndices.push(left);
        left++;
        steps.push({
          line: 6,
          tag: "略過左側非字母數字",
          tagType: "default",
          inlineBadge: `++left -> ${left}`,
          explanation: `左側字元非英數字元，遞增 ++left 跳至索引 ${left} ('${chars[left]}')。`,
          vars: { left: String(left), right: String(right), "s[left]": `'${chars[left]}'`, "s[right]": `'${chars[right]}'`, return: "-" },
          state: makeState(left, right, "hl", "-", [])
        });
      }
      while (left < right && !isAlnum(chars[right])) {
        doneIndices.push(right);
        right--;
        steps.push({
          line: 7,
          tag: "略過右側非字母數字",
          tagType: "default",
          inlineBadge: `--right -> ${right}`,
          explanation: `右側字元非英數字元，遞減 --right 跳至索引 ${right} ('${chars[right]}')。`,
          vars: { left: String(left), right: String(right), "s[left]": `'${chars[left]}'`, "s[right]": `'${chars[right]}'`, return: "-" },
          state: makeState(left, right, "hl", "-", [])
        });
      }

      if (left >= right) break;

      const cl = chars[left].toLowerCase();
      const cr = chars[right].toLowerCase();
      const eq = cl === cr;

      steps.push({
        line: 8,
        tag: eq ? `字元相等 ('${cl}')` : `字元不相等 ('${cl}' != '${cr}')`,
        tagType: eq ? "tag-found" : "default",
        inlineBadge: `'${cl}' ${eq ? "==" : "!="} '${cr}'`,
        explanation: eq
          ? `比較 tolower(s[${left}]) 與 tolower(s[${right}])：兩者皆為 '${cl}'，對稱相等！`
          : `比較 tolower(s[${left}]) ('${cl}') 與 tolower(s[${right}]) ('${cr}')：字元不相等，不是迴文串！`,
        vars: { left: String(left), right: String(right), "s[left]": `'${cl}'`, "s[right]": `'${cr}'`, return: "-" },
        state: makeState(left, right, eq ? "match" : "warn", "-", [
          { from: `wb-cw-s-${left}`, to: "wb-var-lc", label: `'${cl}'`, color: eq ? "green" : "red" },
          { from: `wb-cw-s-${right}`, to: "wb-var-rc", label: `'${cr}'`, color: eq ? "green" : "red" }
        ])
      });

      if (!eq) {
        steps.push({
          line: 9,
          tag: "非迴文回傳 false",
          tagType: "default",
          inlineBadge: `return false`,
          explanation: `由於左右對稱位置的字元 '${cl}' 與 '${cr}' 不同，立即回傳 false。`,
          vars: { left: String(left), right: String(right), "s[left]": `'${cl}'`, "s[right]": `'${cr}'`, return: "false" },
          state: makeState(left, right, "warn", "false", [])
        });
        return steps;
      }

      doneIndices.push(left, right);
      left++;
      right--;
    }

    steps.push({
      line: 12,
      tag: "驗證為迴文串",
      tagType: "tag-found",
      inlineBadge: `return true`,
      explanation: `雙指標 left (${left}) 與 right (${right}) 已交會，所有英數字元皆對稱吻合，回傳 true！`,
      vars: { left: String(left), right: String(right), "s[left]": "-", "s[right]": "-", return: "true" },
      state: makeState(left, right, "match", "true", [])
    });

    return steps;
  }
};

// ============================================================================
// #6 Invert Binary Tree (LC #226, Easy, Binary Tree)
// ============================================================================
window.PROBLEMS["invert-binary-tree"] = {
  id: 6,
  leetcodeId: 226,
  slug: "invert-binary-tree",
  title: "226. Invert Binary Tree (翻轉二元樹)",
  difficulty: "Easy",
  topic: "Binary Tree",
  mins: 15,
  complexity: "Time O(N) · Space O(H)",
  description:
    "給定一棵二元樹的根節點 root，翻轉這棵二元樹（鏡像對調每個節點的左右子樹），並回傳其根節點。使用前序或後序 DFS 遞迴對每個節點執行 swap(node->left, node->right) 即可在 O(N) 時間完成。",
  argNames: ["tree"],
  presets: [
    { name: "範例 1：完整三層二元樹 [4, 2, 7, 1, 3, 6, 9]", args: [[4, 2, 7, 1, 3, 6, 9]] },
    { name: "範例 2：小型二元樹 [2, 1, 3]", args: [[2, 1, 3]] },
    { name: "範例 3：不對稱二元樹 [1, 2, 3, 4, null, null, 5]", args: [[1, 2, 3, 4, null, null, 5]] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">TreeNode</span>* <span class="tok-fn">invertTree</span>(<span class="tok-type">TreeNode</span>* root) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (!root) <span class="tok-kw">return</span> <span class="tok-kw">nullptr</span>;' },
    { line: 5,  code: '        <span class="tok-fn">swap</span>(root-&gt;left, root-&gt;right);' },
    { line: 6,  code: '        <span class="tok-fn">invertTree</span>(root-&gt;left);' },
    { line: 7,  code: '        <span class="tok-fn">invertTree</span>(root-&gt;right);' },
    { line: 8,  code: '        <span class="tok-kw">return</span> root;' },
    { line: 9,  code: '    }' },
    { line: 10, code: '};' }
  ],
  generateTrace(treeArr) {
    const arr = Array.isArray(treeArr) && treeArr.length ? [...treeArr] : [4, 2, 7, 1, 3, 6, 9];
    const steps = [];

    // Build internal tree structure from level-order array
    const nodesById = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null || arr[i] === undefined) continue;
      nodesById[i] = { id: `n${i}`, idx: i, val: arr[i], left: null, right: null, swapped: false };
    }
    for (let i = 0; i < arr.length; i++) {
      if (!nodesById[i]) continue;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (nodesById[l]) nodesById[i].left = nodesById[l];
      if (nodesById[r]) nodesById[i].right = nodesById[r];
    }
    const root = nodesById[0] || null;

    const snapshotTree = (activeNodeId, justSwappedId) => {
      const visNodes = [];
      const visEdges = [];
      const traverse = (nd, depth, xCenter, xSpan) => {
        if (!nd) return;
        const y = 42 + depth * 74;
        let status = "";
        if (nd.id === justSwappedId) status = "match";
        else if (nd.id === activeNodeId) status = "hl";
        else if (nd.swapped) status = "done";

        visNodes.push({
          id: nd.id,
          val: String(nd.val),
          sub: nd.swapped ? "已對調" : "",
          x: Math.round(xCenter),
          y,
          status,
          ptr: nd.id === activeNodeId ? "root" : ""
        });

        if (nd.left) {
          const lx = xCenter - xSpan;
          visEdges.push({
            from: nd.id,
            to: nd.left.id,
            label: "L",
            status: nd.id === justSwappedId ? "match" : ""
          });
          traverse(nd.left, depth + 1, lx, xSpan * 0.52);
        }
        if (nd.right) {
          const rx = xCenter + xSpan;
          visEdges.push({
            from: nd.id,
            to: nd.right.id,
            label: "R",
            status: nd.id === justSwappedId ? "match" : ""
          });
          traverse(nd.right, depth + 1, rx, xSpan * 0.52);
        }
      };
      traverse(root, 0, 310, 140);

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "二元樹結構 (TreeNode*)",
            x: 325,
            y: 52,
            width: 620,
            height: 280,
            nodes: visNodes,
            edges: visEdges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "DFS 遞迴節點狀態",
            x: 24,
            y: 205,
            items: [
              { id: "cur", name: "root->val", val: activeNodeId ? String(visNodes.find((n) => n.id === activeNodeId)?.val ?? "-") : "nullptr", status: "hl" },
              { id: "act", name: "action", val: justSwappedId ? "swap(L, R)" : "visit", status: justSwappedId ? "match" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 3,
      tag: "開始翻轉二元樹",
      tagType: "default",
      inlineBadge: `invertTree(root = ${root ? root.val : "nullptr"})`,
      explanation: `從根節點 (${root ? root.val : "nullptr"}) 開始前序走訪，對每個節點交換其 left 與 right 子樹指標。`,
      vars: { "root->val": root ? String(root.val) : "null", "root->left": root && root.left ? String(root.left.val) : "null", "root->right": root && root.right ? String(root.right.val) : "null" },
      state: snapshotTree(root ? root.id : null, null)
    });

    const dfs = (nd) => {
      if (!nd) return;
      const oldL = nd.left ? nd.left.val : "null";
      const oldR = nd.right ? nd.right.val : "null";

      steps.push({
        line: 4,
        tag: `進入節點 ${nd.val}`,
        tagType: "tag-check",
        inlineBadge: `root = ${nd.val} (L=${oldL}, R=${oldR})`,
        explanation: `遞迴進入節點 ${nd.val}，目前左子節點為 ${oldL}，右子節點為 ${oldR}。`,
        vars: { "root->val": String(nd.val), "root->left": String(oldL), "root->right": String(oldR) },
        state: snapshotTree(nd.id, null)
      });

      const tmp = nd.left;
      nd.left = nd.right;
      nd.right = tmp;
      nd.swapped = true;

      const newL = nd.left ? nd.left.val : "null";
      const newR = nd.right ? nd.right.val : "null";

      steps.push({
        line: 5,
        tag: `對調 ${nd.val} 的左右子樹`,
        tagType: "tag-insert",
        inlineBadge: `swap -> L=${newL}, R=${newR}`,
        explanation: `執行 swap(root->left, root->right)，節點 ${nd.val} 的左右子樹完成鏡像互換（L 變為 ${newL}，R 變為 ${newR}）。`,
        vars: { "root->val": String(nd.val), "root->left": String(newL), "root->right": String(newR) },
        state: snapshotTree(nd.id, nd.id)
      });

      if (nd.left) dfs(nd.left);
      if (nd.right) dfs(nd.right);
    };

    dfs(root);

    steps.push({
      line: 8,
      tag: "翻轉完成回傳根節點",
      tagType: "tag-found",
      inlineBadge: `return root (${root ? root.val : "null"})`,
      explanation: `整棵二元樹的所有節點皆已完成左右子樹翻轉，回傳根節點 ${root ? root.val : "nullptr"}！`,
      vars: { "root->val": root ? String(root.val) : "null", "root->left": root && root.left ? String(root.left.val) : "null", "root->right": root && root.right ? String(root.right.val) : "null" },
      state: snapshotTree(root ? root.id : null, root ? root.id : null)
    });

    return steps;
  }
};

// ============================================================================
// #7 Valid Anagram (LC #242, Easy, String)
// ============================================================================
window.PROBLEMS["valid-anagram"] = {
  id: 7,
  leetcodeId: 242,
  slug: "valid-anagram",
  title: "242. Valid Anagram (有效的字母異位詞)",
  difficulty: "Easy",
  topic: "String / Hash Table",
  mins: 15,
  complexity: "Time O(N) · Space O(1)",
  description:
    "給定兩個字串 s 和 t，編寫一個函式來判斷 t 是否是 s 的字母異位詞（每個字元出現次數完全相同）。若長度不同直接回傳 false；否則統計 s 各字元頻率加一、t 各字元頻率減一，最後檢查是否全為 0。",
  argNames: ["s", "t"],
  presets: [
    { name: "範例 1：有效異位詞 s = \"anagram\", t = \"nagaram\"", args: ["anagram", "nagaram"] },
    { name: "範例 2：字元不合 s = \"rat\", t = \"car\"", args: ["rat", "car"] },
    { name: "範例 3：長度不同 s = \"ab\", t = \"a\"", args: ["ab", "a"] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isAnagram</span>(<span class="tok-type">string</span> s, <span class="tok-type">string</span> t) {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (s.<span class="tok-fn">size</span>() != t.<span class="tok-fn">size</span>()) <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 5,  code: '        <span class="tok-type">unordered_map</span>&lt;<span class="tok-kw">char</span>, <span class="tok-kw">int</span>&gt; count;' },
    { line: 6,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; s.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 7,  code: '            count[s[i]]++;' },
    { line: 8,  code: '            count[t[i]]--;' },
    { line: 9,  code: '        }' },
    { line: 10, code: '        <span class="tok-kw">for</span> (<span class="tok-kw">auto</span>&amp; [ch, cnt] : count) {' },
    { line: 11, code: '            <span class="tok-kw">if</span> (cnt != <span class="tok-num">0</span>) <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 12, code: '        }' },
    { line: 13, code: '        <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 14, code: '    }' },
    { line: 15, code: '};' }
  ],
  generateTrace(s, t) {
    const sArr = String(s || "").split("");
    const tArr = String(t || "").split("");
    const steps = [];
    const counts = {};
    const doneIdx = [];

    const makeState = (currIdx, updatedKeys, checkKey, retVal, connectors) => {
      const dictRows = Object.keys(counts)
        .sort()
        .map((k) => {
          const v = counts[k];
          let status = "";
          if (checkKey === k) status = v === 0 ? "hit" : "inserted";
          else if (updatedKeys.includes(k)) status = "inserted";
          else if (v === 0) status = "hit";
          return {
            id: k,
            key: `'${k}'`,
            val: String(v),
            note: v === 0 ? "✓ 平衡 (0)" : v > 0 ? `+${v} (s 較多)` : `${v} (t 較多)`,
            status
          };
        });

      return {
        boards: [
          {
            id: "s",
            type: "array",
            name: "s",
            typeLabel: `字串 s (len=${sArr.length})`,
            x: 325,
            y: 52,
            values: sArr.map((c) => `'${c}'`),
            hl: currIdx >= 0 ? [currIdx] : [],
            done: [...doneIdx],
            pointers: currIdx >= 0 ? [{ idx: currIdx, label: `s[${currIdx}]`, color: "blue" }] : []
          },
          {
            id: "t",
            type: "array",
            name: "t",
            typeLabel: `字串 t (len=${tArr.length})`,
            x: 640,
            y: 52,
            values: tArr.map((c) => `'${c}'`),
            hl: currIdx >= 0 ? [currIdx] : [],
            done: [...doneIdx],
            pointers: currIdx >= 0 ? [{ idx: currIdx, label: `t[${currIdx}]`, color: "purple" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "比較狀態与回傳值",
            x: 24,
            y: 205,
            items: [
              { id: "slen", name: "s.size()", val: String(sArr.length), status: "" },
              { id: "tlen", name: "t.size()", val: String(tArr.length), status: sArr.length !== tArr.length ? "warn" : "" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          },
          {
            id: "count",
            type: "dict",
            name: "count",
            typeLabel: "字元淨頻率表 (unordered_map<char, int>)",
            x: 325,
            y: 195,
            headers: ["字元 key", "淨次數 cnt", "狀態說明"],
            rows: dictRows
          }
        ],
        connectors: connectors || []
      };
    };

    if (sArr.length !== tArr.length) {
      steps.push({
        line: 4,
        tag: "長度不同直接回傳 false",
        tagType: "default",
        inlineBadge: `${sArr.length} != ${tArr.length} -> return false`,
        explanation: `s 的長度 (${sArr.length}) 與 t 的長度 (${tArr.length}) 不相等，不可能是字母異位詞，立即回傳 false。`,
        vars: { "s.size()": String(sArr.length), "t.size()": String(tArr.length), i: "-", return: "false" },
        state: makeState(-1, [], null, "false", [])
      });
      return steps;
    }

    steps.push({
      line: 5,
      tag: "初始化頻率雜湊表",
      tagType: "default",
      inlineBadge: `s.size() == t.size() == ${sArr.length}`,
      explanation: `兩字串長度皆為 ${sArr.length}，建立 unordered_map<char, int> count 同步統計 s[i] (+1) 與 t[i] (-1)。`,
      vars: { "s.size()": String(sArr.length), "t.size()": String(tArr.length), i: "-", return: "-" },
      state: makeState(-1, [], null, "-", [])
    });

    for (let i = 0; i < sArr.length; i++) {
      const cs = sArr[i];
      const ct = tArr[i];
      counts[cs] = (counts[cs] || 0) + 1;
      counts[ct] = (counts[ct] || 0) - 1;

      steps.push({
        line: 8,
        tag: `統計索引 i = ${i}`,
        tagType: "tag-insert",
        inlineBadge: `count['${cs}']++, count['${ct}']--`,
        explanation: `第 ${i} 步：s[${i}]='${cs}' 使 count['${cs}'] 加一；t[${i}]='${ct}' 使 count['${ct}'] 減一。`,
        vars: { i: String(i), "s[i]": `'${cs}'`, "t[i]": `'${ct}'`, [`count['${cs}']`]: String(counts[cs]), return: "-" },
        state: makeState(i, [cs, ct], null, "-", [
          { from: `wb-cw-s-${i}`, to: `wb-dict-row-${cs}`, label: `+1`, color: "blue" },
          { from: `wb-cw-t-${i}`, to: `wb-dict-row-${ct}`, label: `-1`, color: "purple" }
        ])
      });
      doneIdx.push(i);
    }

    for (const k of Object.keys(counts).sort()) {
      if (counts[k] !== 0) {
        steps.push({
          line: 11,
          tag: `字元 '${k}' 數量不平衡`,
          tagType: "default",
          inlineBadge: `count['${k}'] = ${counts[k]} != 0 -> return false`,
          explanation: `檢查頻率表時發現字元 '${k}' 的淨次數為 ${counts[k]} (不等於 0)，代表兩字串字元組成不同，回傳 false。`,
          vars: { ch: `'${k}'`, cnt: String(counts[k]), return: "false" },
          state: makeState(-1, [], k, "false", [
            { from: `wb-dict-row-${k}`, to: "wb-var-ret", label: "cnt != 0", color: "red" }
          ])
        });
        return steps;
      }
    }

    steps.push({
      line: 13,
      tag: "全部字元平衡回傳 true",
      tagType: "tag-found",
      inlineBadge: `return true`,
      explanation: `頻率表中所有字元的淨計數皆抵銷為 0，證實 t 是 s 的有效字母異位詞，回傳 true！`,
      vars: { i: String(sArr.length), return: "true" },
      state: makeState(-1, [], null, "true", [])
    });

    return steps;
  }
};

// ============================================================================
// #8 Binary Search (LC #704, Easy, Binary Search)
// ============================================================================
window.PROBLEMS["binary-search"] = {
  id: 8,
  leetcodeId: 704,
  slug: "binary-search",
  title: "704. Binary Search (二分搜尋)",
  difficulty: "Easy",
  topic: "Binary Search",
  mins: 15,
  complexity: "Time O(log N) · Space O(1)",
  description:
    "給定一個 n 個元素有序的（升序）整數陣列 nums 和一個目標值 target，寫一個函式搜尋 nums 中的 target，如果目標值存在回傳下標，否則回傳 -1。每次取區間中點 mid 將搜尋範圍折半。",
  argNames: ["nums", "target"],
  presets: [
    { name: "範例 1：命中目標 nums = [-1, 0, 3, 5, 9, 12], target = 9", args: [[-1, 0, 3, 5, 9, 12], 9] },
    { name: "範例 2：目標不存在 nums = [-1, 0, 3, 5, 9, 12], target = 2", args: [[-1, 0, 3, 5, 9, 12], 2] },
    { name: "範例 3：命中首元素 nums = [2, 5, 8, 12, 16, 23, 38], target = 2", args: [[2, 5, 8, 12, 16, 23, 38], 2] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">search</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums, <span class="tok-kw">int</span> target) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> left = <span class="tok-num">0</span>, right = (<span class="tok-kw">int</span>)nums.<span class="tok-fn">size</span>() - <span class="tok-num">1</span>;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (left &lt;= right) {' },
    { line: 6,  code: '            <span class="tok-kw">int</span> mid = left + (right - left) / <span class="tok-num">2</span>;' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (nums[mid] == target) <span class="tok-kw">return</span> mid;' },
    { line: 8,  code: '            <span class="tok-kw">if</span> (nums[mid] &lt; target) left = mid + <span class="tok-num">1</span>;' },
    { line: 9,  code: '            <span class="tok-kw">else</span> right = mid - <span class="tok-num">1</span>;' },
    { line: 10, code: '        }' },
    { line: 11, code: '        <span class="tok-kw">return</span> <span class="tok-num">-1</span>;' },
    { line: 12, code: '    }' },
    { line: 13, code: '};' }
  ],
  generateTrace(nums, target) {
    const arr = Array.isArray(nums) && nums.length ? [...nums] : [-1, 0, 3, 5, 9, 12];
    const tgt = Number(target ?? 9);
    const steps = [];
    let left = 0;
    let right = arr.length - 1;

    const makeState = (l, r, mid, foundIdx, retVal, connectors) => {
      const done = [];
      for (let k = 0; k < arr.length; k++) {
        if (k < l || k > r) done.push(k);
      }
      const ptrs = [];
      if (l >= 0 && l < arr.length && l <= r) ptrs.push({ idx: l, label: `L=${l}`, color: "blue" });
      if (mid >= 0 && mid < arr.length) ptrs.push({ idx: mid, label: `mid=${mid}`, color: foundIdx >= 0 ? "green" : "red" });
      if (r >= 0 && r < arr.length && l <= r) ptrs.push({ idx: r, label: `R=${r}`, color: "purple" });

      return {
        boards: [
          {
            id: "nums",
            type: "array",
            name: "nums",
            typeLabel: "升序整數陣列 (vector<int>)",
            x: 325,
            y: 52,
            values: arr,
            hl: mid >= 0 && foundIdx < 0 ? [mid] : [],
            match: foundIdx >= 0 ? [foundIdx] : [],
            done,
            pointers: ptrs
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "二分搜尋邊界與中點",
            x: 325,
            y: 215,
            items: [
              { id: "tgt", name: "target", val: String(tgt), status: "" },
              { id: "rng", name: "[left, right]", val: `[${l}, ${r}]`, status: l > r ? "warn" : "" },
              { id: "midv", name: "mid (nums[mid])", val: mid >= 0 ? `${mid} (${arr[mid]})` : "-", status: foundIdx >= 0 ? "match" : mid >= 0 ? "hl" : "" },
              { id: "ret", name: "return", val: retVal, status: retVal === "-1" ? "warn" : retVal !== "-" ? "match" : "" }
            ]
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 4,
      tag: "初始化搜尋區間",
      tagType: "default",
      inlineBadge: `left = 0, right = ${right}, target = ${tgt}`,
      explanation: `設定初始搜尋閉區間 [left, right] = [0, ${right}]，目標值 target = ${tgt}。`,
      vars: { left: "0", right: String(right), mid: "-", "nums[mid]": "-", target: String(tgt), return: "-" },
      state: makeState(left, right, -1, -1, "-", [])
    });

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const midVal = arr[mid];

      steps.push({
        line: 6,
        tag: `計算中點 mid = ${mid}`,
        tagType: "tag-check",
        inlineBadge: `mid = ${left} + (${right} - ${left}) / 2 = ${mid}, nums[${mid}] = ${midVal}`,
        explanation: `計算區間 [${left}, ${right}] 的中點索引 mid = ${mid}，對應元素值 nums[${mid}] = ${midVal}。`,
        vars: { left: String(left), right: String(right), mid: String(mid), "nums[mid]": String(midVal), target: String(tgt), return: "-" },
        state: makeState(left, right, mid, -1, "-", [
          { from: `wb-cw-nums-${mid}`, to: "wb-var-midv", label: `nums[${mid}]=${midVal}`, color: "blue" }
        ])
      });

      if (midVal === tgt) {
        steps.push({
          line: 7,
          tag: `命中目標！回傳 ${mid}`,
          tagType: "tag-found",
          inlineBadge: `nums[${mid}] == ${tgt} -> return ${mid}`,
          explanation: `中點元素 nums[${mid}] (${midVal}) 恰好等於 target (${tgt})，找到目標！立即回傳索引 ${mid}。`,
          vars: { left: String(left), right: String(right), mid: String(mid), "nums[mid]": String(midVal), target: String(tgt), return: String(mid) },
          state: makeState(left, right, mid, mid, String(mid), [
            { from: `wb-cw-nums-${mid}`, to: "wb-var-ret", label: `命中索引 ${mid}`, color: "green" }
          ])
        });
        return steps;
      }

      if (midVal < tgt) {
        left = mid + 1;
        steps.push({
          line: 8,
          tag: "目標在右半部",
          tagType: "tag-insert",
          inlineBadge: `${midVal} < ${tgt} -> left = ${left}`,
          explanation: `因為 nums[${mid}] (${midVal}) < target (${tgt})，排除左半部與 mid，將左邊界更新為 left = mid + 1 = ${left}。`,
          vars: { left: String(left), right: String(right), mid: String(mid), "nums[mid]": String(midVal), target: String(tgt), return: "-" },
          state: makeState(left, right, -1, -1, "-", [])
        });
      } else {
        right = mid - 1;
        steps.push({
          line: 9,
          tag: "目標在左半部",
          tagType: "tag-insert",
          inlineBadge: `${midVal} > ${tgt} -> right = ${right}`,
          explanation: `因為 nums[${mid}] (${midVal}) > target (${tgt})，排除右半部與 mid，將右邊界更新為 right = mid - 1 = ${right}。`,
          vars: { left: String(left), right: String(right), mid: String(mid), "nums[mid]": String(midVal), target: String(tgt), return: "-" },
          state: makeState(left, right, -1, -1, "-", [])
        });
      }
    }

    steps.push({
      line: 11,
      tag: "區間交錯未找到目標",
      tagType: "default",
      inlineBadge: `left (${left}) > right (${right}) -> return -1`,
      explanation: `搜尋區間已縮小至空集 (left = ${left} > right = ${right})，確認陣列中不存在 ${tgt}，回傳 -1。`,
      vars: { left: String(left), right: String(right), mid: "-", "nums[mid]": "-", target: String(tgt), return: "-1" },
      state: makeState(left, right, -1, -1, "-1", [])
    });

    return steps;
  }
};

// ============================================================================
// #9 Flood Fill (LC #733, Easy, Graph / Matrix BFS)
// ============================================================================
window.PROBLEMS["flood-fill"] = {
  id: 9,
  leetcodeId: 733,
  slug: "flood-fill",
  title: "733. Flood Fill (圖像渲染)",
  difficulty: "Easy",
  topic: "Graph / Matrix",
  mins: 20,
  complexity: "Time O(R × C) · Space O(R × C)",
  description:
    "給定二維整數網格 image、起始座標 (sr, sc) 與新顏色 color。從起點開始，將所有四方向相連且顏色與起點原始顏色相同的像素全部染成新顏色 color。可透過佇列 BFS 或遞迴 DFS 完成。",
  argNames: ["image", "sr", "sc", "color"],
  presets: [
    { name: "範例 1：標準連通染色 image = [[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2", args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2] },
    { name: "範例 2：顏色相同無需變更 image = [[0,0,0],[0,0,0]], sr=0, sc=0, color=0", args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0] },
    { name: "範例 3：L 型區塊染色 image = [[0,1,0],[1,1,0],[0,1,1]], sr=1, sc=1, color=3", args: [[[0, 1, 0], [1, 1, 0], [0, 1, 1]], 1, 1, 3] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt; <span class="tok-fn">floodFill</span>(<span class="tok-type">vector</span>&lt;<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&gt;&amp; img, <span class="tok-kw">int</span> sr, <span class="tok-kw">int</span> sc, <span class="tok-kw">int</span> color) {' },
    { line: 4,  code: '        <span class="tok-kw">int</span> orig = img[sr][sc];' },
    { line: 5,  code: '        <span class="tok-kw">if</span> (orig == color) <span class="tok-kw">return</span> img;' },
    { line: 6,  code: '        <span class="tok-type">queue</span>&lt;<span class="tok-type">pair</span>&lt;<span class="tok-kw">int</span>, <span class="tok-kw">int</span>&gt;&gt; q;' },
    { line: 7,  code: '        img[sr][sc] = color; q.<span class="tok-fn">push</span>({sr, sc});' },
    { line: 8,  code: '        <span class="tok-kw">int</span> dr[<span class="tok-num">4</span>] = {<span class="tok-num">-1</span>, <span class="tok-num">1</span>, <span class="tok-num">0</span>, <span class="tok-num">0</span>}, dc[<span class="tok-num">4</span>] = {<span class="tok-num">0</span>, <span class="tok-num">0</span>, <span class="tok-num">-1</span>, <span class="tok-num">1</span>};' },
    { line: 9,  code: '        <span class="tok-kw">while</span> (!q.<span class="tok-fn">empty</span>()) {' },
    { line: 10, code: '            <span class="tok-kw">auto</span> [r, c] = q.<span class="tok-fn">front</span>(); q.<span class="tok-fn">pop</span>();' },
    { line: 11, code: '            <span class="tok-kw">for</span> (<span class="tok-kw">int</span> d = <span class="tok-num">0</span>; d &lt; <span class="tok-num">4</span>; ++d) {' },
    { line: 12, code: '                <span class="tok-kw">int</span> nr = r + dr[d], nc = c + dc[d];' },
    { line: 13, code: '                <span class="tok-kw">if</span> (nr &gt;= <span class="tok-num">0</span> &amp;&amp; nr &lt; img.<span class="tok-fn">size</span>() &amp;&amp; nc &gt;= <span class="tok-num">0</span> &amp;&amp; nc &lt; img[<span class="tok-num">0</span>].<span class="tok-fn">size</span>() &amp;&amp; img[nr][nc] == orig) {' },
    { line: 14, code: '                    img[nr][nc] = color; q.<span class="tok-fn">push</span>({nr, nc});' },
    { line: 15, code: '                }' },
    { line: 16, code: '            }' },
    { line: 17, code: '        }' },
    { line: 18, code: '        <span class="tok-kw">return</span> img;' },
    { line: 19, code: '    }' },
    { line: 20, code: '};' }
  ],
  generateTrace(image, sr, sc, color) {
    const grid = Array.isArray(image) && image.length ? image.map((r) => [...r]) : [[1, 1, 1], [1, 1, 0], [1, 0, 1]];
    const R = grid.length;
    const C = grid[0].length;
    const startR = Math.min(Math.max(0, Number(sr ?? 1)), R - 1);
    const startC = Math.min(Math.max(0, Number(sc ?? 1)), C - 1);
    const newCol = Number(color ?? 2);
    const orig = grid[startR][startC];

    const steps = [];
    const q = [];
    const filledKeys = [];

    const makeState = (hlKey, curCoordStr) => {
      return {
        boards: [
          {
            id: "img",
            type: "grid",
            name: "image",
            typeLabel: `2D 像素矩陣 (${R}×${C})`,
            x: 325,
            y: 52,
            cells: grid.map((r) => [...r]),
            hl: hlKey ? [hlKey] : [],
            match: [...filledKeys],
            done: []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "BFS 染色參數",
            x: 24,
            y: 205,
            items: [
              { id: "orig", name: "origColor", val: String(orig), status: "" },
              { id: "ncol", name: "newColor", val: String(newCol), status: "match" },
              { id: "cur", name: "(r, c)", val: curCoordStr, status: hlKey ? "hl" : "" }
            ]
          },
          {
            id: "q",
            type: "queue",
            name: "q",
            typeLabel: "待擴展像素佇列 (queue<pair<int,int>>)",
            x: 565,
            y: 52,
            items: q.map((pt, idx) => ({ val: `(${pt[0]},${pt[1]})`, status: idx === q.length - 1 ? "hl" : "" }))
          }
        ],
        connectors: []
      };
    };

    steps.push({
      line: 4,
      tag: "記錄起點原始顏色",
      tagType: "default",
      inlineBadge: `orig = img[${startR}][${startC}] = ${orig}, color = ${newCol}`,
      explanation: `取得起點 (${startR}, ${startC}) 的原始顏色 orig = ${orig}，目標新顏色為 ${newCol}。`,
      vars: { sr: String(startR), sc: String(startC), orig: String(orig), color: String(newCol), "q.size()": "0" },
      state: makeState(`${startR},${startC}`, `(${startR}, ${startC})`)
    });

    if (orig === newCol) {
      steps.push({
        line: 5,
        tag: "顏色相同直接回傳",
        tagType: "tag-found",
        inlineBadge: `orig == color (${orig}) -> return img`,
        explanation: `起點原始顏色 (${orig}) 已經等於目標顏色 (${newCol})，無需任何染色，直接回傳原圖以防無限迴圈。`,
        vars: { sr: String(startR), sc: String(startC), orig: String(orig), color: String(newCol), "q.size()": "0" },
        state: makeState(null, "-")
      });
      return steps;
    }

    grid[startR][startC] = newCol;
    filledKeys.push(`${startR},${startC}`);
    q.push([startR, startC]);

    steps.push({
      line: 7,
      tag: `起點染色並入列`,
      tagType: "tag-insert",
      inlineBadge: `img[${startR}][${startC}] = ${newCol}, q.push({${startR},${startC}})`,
      explanation: `將起點 (${startR}, ${startC}) 染成新顏色 ${newCol}，並推入 BFS 佇列 q。`,
      vars: { r: String(startR), c: String(startC), orig: String(orig), color: String(newCol), "q.size()": String(q.length) },
      state: makeState(`${startR},${startC}`, `(${startR}, ${startC})`)
    });

    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    while (q.length > 0) {
      const [r, c] = q.shift();
      steps.push({
        line: 10,
        tag: `取出佇列前端 (${r}, ${c})`,
        tagType: "tag-check",
        inlineBadge: `pop (${r}, ${c}) -> 檢查上下左右鄰格`,
        explanation: `從佇列取出座標 (${r}, ${c})，掃描其上、下、左、右四個相鄰像素是否為原始顏色 ${orig}。`,
        vars: { r: String(r), c: String(c), orig: String(orig), color: String(newCol), "q.size()": String(q.length) },
        state: makeState(`${r},${c}`, `(${r}, ${c})`)
      });

      for (let d = 0; d < 4; d++) {
        const nr = r + dr[d];
        const nc = c + dc[d];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === orig) {
          grid[nr][nc] = newCol;
          filledKeys.push(`${nr},${nc}`);
          q.push([nr, nc]);

          steps.push({
            line: 14,
            tag: `渲染鄰格 (${nr}, ${nc})`,
            tagType: "tag-insert",
            inlineBadge: `img[${nr}][${nc}] = ${newCol}, q.push({${nr},${nc}})`,
            explanation: `相鄰座標 (${nr}, ${nc}) 顏色為 ${orig}，將其染為新顏色 ${newCol} 並加入佇列等待繼續向外擴散。`,
            vars: { r: String(r), c: String(c), nr: String(nr), nc: String(nc), "q.size()": String(q.length) },
            state: makeState(`${nr},${nc}`, `(${nr}, ${nc})`)
          });
        }
      }
    }

    steps.push({
      line: 18,
      tag: "渲染完成回傳影像",
      tagType: "tag-found",
      inlineBadge: `q.empty() == true -> return img`,
      explanation: `BFS 佇列已清空，所有與起點四連通的同色區塊共 ${filledKeys.length} 格皆已染成 ${newCol}！`,
      vars: { r: "-", c: "-", orig: String(orig), color: String(newCol), "q.size()": "0" },
      state: makeState(null, "完成")
    });

    return steps;
  }
};

// ============================================================================
// #10 Lowest Common Ancestor of a BST (LC #235, Easy, Binary Search Tree)
// ============================================================================
window.PROBLEMS["lowest-common-ancestor-of-a-binary-search-tree"] = {
  id: 10,
  leetcodeId: 235,
  slug: "lowest-common-ancestor-of-a-binary-search-tree",
  title: "235. Lowest Common Ancestor of a BST (二元搜尋樹的最近公共祖先)",
  difficulty: "Easy",
  topic: "Binary Search Tree",
  mins: 20,
  complexity: "Time O(H) · Space O(1)",
  description:
    "給定一棵二元搜尋樹 (BST) 與兩個節點 p、q，找出它們的最近公共祖先 (LCA)。利用 BST 左小右大的性質：若 p、q 都小於 curr 則往左子樹找；若都大於 curr 則往右子樹找；否則一旦分岔（或遇見其中一點），curr 即為 LCA。",
  argNames: ["tree", "p", "q"],
  presets: [
    { name: "範例 1：根節點分岔 tree=[6,2,8,0,4,7,9], p=2, q=8", args: [[6, 2, 8, 0, 4, 7, 9], 2, 8] },
    { name: "範例 2：左子樹內部祖先 tree=[6,2,8,0,4,7,9], p=2, q=4", args: [[6, 2, 8, 0, 4, 7, 9], 2, 4] },
    { name: "範例 3：深層葉節點分岔 tree=[6,2,8,0,4,7,9], p=0, q=4", args: [[6, 2, 8, 0, 4, 7, 9], 0, 4] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">TreeNode</span>* <span class="tok-fn">lowestCommonAncestor</span>(<span class="tok-type">TreeNode</span>* root, <span class="tok-type">TreeNode</span>* p, <span class="tok-type">TreeNode</span>* q) {' },
    { line: 4,  code: '        <span class="tok-type">TreeNode</span>* curr = root;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (curr) {' },
    { line: 6,  code: '            <span class="tok-kw">if</span> (p-&gt;val &lt; curr-&gt;val &amp;&amp; q-&gt;val &lt; curr-&gt;val) {' },
    { line: 7,  code: '                curr = curr-&gt;left;' },
    { line: 8,  code: '            } <span class="tok-kw">else</span> <span class="tok-kw">if</span> (p-&gt;val &gt; curr-&gt;val &amp;&amp; q-&gt;val &gt; curr-&gt;val) {' },
    { line: 9,  code: '                curr = curr-&gt;right;' },
    { line: 10, code: '            } <span class="tok-kw">else</span> {' },
    { line: 11, code: '                <span class="tok-kw">return</span> curr;' },
    { line: 12, code: '            }' },
    { line: 13, code: '        }' },
    { line: 14, code: '        <span class="tok-kw">return</span> <span class="tok-kw">nullptr</span>;' },
    { line: 15, code: '    }' },
    { line: 16, code: '};' }
  ],
  generateTrace(treeArr, pValInput, qValInput) {
    const arr = Array.isArray(treeArr) && treeArr.length ? [...treeArr] : [6, 2, 8, 0, 4, 7, 9];
    const pVal = Number(pValInput ?? 2);
    const qVal = Number(qValInput ?? 8);
    const steps = [];

    const nodesById = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null || arr[i] === undefined) continue;
      nodesById[i] = { id: `n${i}`, val: arr[i], left: null, right: null };
    }
    for (let i = 0; i < arr.length; i++) {
      if (!nodesById[i]) continue;
      if (nodesById[2 * i + 1]) nodesById[i].left = nodesById[2 * i + 1];
      if (nodesById[2 * i + 2]) nodesById[i].right = nodesById[2 * i + 2];
    }
    const root = nodesById[0] || null;
    const visitedIds = [];

    const makeState = (currId, lcaId) => {
      const visNodes = [];
      const visEdges = [];
      const traverse = (nd, depth, xCenter, xSpan) => {
        if (!nd) return;
        const y = 42 + depth * 74;
        let status = "";
        if (nd.id === lcaId) status = "match";
        else if (nd.id === currId) status = "hl";
        else if (visitedIds.includes(nd.id)) status = "done";

        const tags = [];
        if (nd.val === pVal) tags.push("p");
        if (nd.val === qVal) tags.push("q");

        visNodes.push({
          id: nd.id,
          val: String(nd.val),
          sub: tags.join(","),
          x: Math.round(xCenter),
          y,
          status,
          ptr: nd.id === lcaId ? "LCA!" : nd.id === currId ? "curr" : ""
        });

        if (nd.left) {
          visEdges.push({ from: nd.id, to: nd.left.id, label: "L", status: nd.id === currId ? "hl" : "" });
          traverse(nd.left, depth + 1, xCenter - xSpan, xSpan * 0.52);
        }
        if (nd.right) {
          visEdges.push({ from: nd.id, to: nd.right.id, label: "R", status: nd.id === currId ? "hl" : "" });
          traverse(nd.right, depth + 1, xCenter + xSpan, xSpan * 0.52);
        }
      };
      traverse(root, 0, 310, 140);

      return {
        boards: [
          {
            id: "bst",
            type: "tree",
            shape: "circle",
            name: "root (BST)",
            typeLabel: "二元搜尋樹 (左小右大)",
            x: 325,
            y: 52,
            width: 620,
            height: 280,
            nodes: visNodes,
            edges: visEdges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "BST 祖先搜尋狀態",
            x: 24,
            y: 205,
            items: [
              { id: "p", name: "p->val", val: String(pVal), status: "" },
              { id: "q", name: "q->val", val: String(qVal), status: "" },
              { id: "cur", name: "curr->val", val: currId ? String(visNodes.find((n) => n.id === currId)?.val ?? "-") : "-", status: lcaId ? "match" : "hl" }
            ]
          }
        ],
        connectors: []
      };
    };

    let curr = root;
    steps.push({
      line: 4,
      tag: "從根節點開始搜尋",
      tagType: "default",
      inlineBadge: `curr = ${curr ? curr.val : "null"}, p = ${pVal}, q = ${qVal}`,
      explanation: `初始化游標 curr 指向 BST 根節點 (${curr ? curr.val : "null"})，尋找 p (${pVal}) 與 q (${qVal}) 的最近公共祖先。`,
      vars: { "curr->val": curr ? String(curr.val) : "null", "p->val": String(pVal), "q->val": String(qVal), return: "-" },
      state: makeState(curr ? curr.id : null, null)
    });

    while (curr) {
      const cVal = curr.val;
      if (pVal < cVal && qVal < cVal) {
        visitedIds.push(curr.id);
        curr = curr.left;
        steps.push({
          line: 7,
          tag: `皆小於 ${cVal}，往左子樹走`,
          tagType: "tag-check",
          inlineBadge: `${pVal} < ${cVal} && ${qVal} < ${cVal} -> curr = curr->left`,
          explanation: `因為 p (${pVal}) 與 q (${qVal}) 皆小於 curr->val (${cVal})，兩者必定都在左子樹中，更新 curr = curr->left (${curr ? curr.val : "null"})。`,
          vars: { "curr->val": curr ? String(curr.val) : "null", "p->val": String(pVal), "q->val": String(qVal), return: "-" },
          state: makeState(curr ? curr.id : null, null)
        });
      } else if (pVal > cVal && qVal > cVal) {
        visitedIds.push(curr.id);
        curr = curr.right;
        steps.push({
          line: 9,
          tag: `皆大於 ${cVal}，往右子樹走`,
          tagType: "tag-check",
          inlineBadge: `${pVal} > ${cVal} && ${qVal} > ${cVal} -> curr = curr->right`,
          explanation: `因為 p (${pVal}) 與 q (${qVal}) 皆大於 curr->val (${cVal})，兩者必定都在右子樹中，更新 curr = curr->right (${curr ? curr.val : "null"})。`,
          vars: { "curr->val": curr ? String(curr.val) : "null", "p->val": String(pVal), "q->val": String(qVal), return: "-" },
          state: makeState(curr ? curr.id : null, null)
        });
      } else {
        steps.push({
          line: 11,
          tag: `找到分岔點 LCA (${cVal})`,
          tagType: "tag-found",
          inlineBadge: `return curr (${cVal})`,
          explanation: `節點 p (${pVal}) 與 q (${qVal}) 在節點 ${cVal} 處分居左右兩側（或其中之一即為 ${cVal}），因此 ${cVal} 就是最近公共祖先！`,
          vars: { "curr->val": String(cVal), "p->val": String(pVal), "q->val": String(qVal), return: `Node(${cVal})` },
          state: makeState(curr.id, curr.id)
        });
        return steps;
      }
    }

    return steps;
  }
};

// ============================================================================
// #11 Balanced Binary Tree (LC #110, Easy, Binary Tree)
// ============================================================================
window.PROBLEMS["balanced-binary-tree"] = {
  id: 11,
  leetcodeId: 110,
  slug: "balanced-binary-tree",
  title: "110. Balanced Binary Tree (平衡二元樹)",
  difficulty: "Easy",
  topic: "Binary Tree",
  mins: 15,
  complexity: "Time O(N) · Space O(H)",
  description:
    "給定一個二元樹，判斷它是否是高度平衡的二元樹（每個節點的左右兩個子樹的高度差的絕對值不超過 1）。使用由底向上 (Bottom-Up) 的後序 DFS：若子樹不平衡立刻回傳 -1 剪枝，否則回傳 1 + max(leftH, rightH)。",
  argNames: ["tree"],
  presets: [
    { name: "範例 1：平衡二元樹 [3, 9, 20, null, null, 15, 7]", args: [[3, 9, 20, null, null, 15, 7]] },
    { name: "範例 2：失衡二元樹 [1, 2, 2, 3, 3, null, null, 4, 4]", args: [[1, 2, 2, 3, 3, null, null, 4, 4]] },
    { name: "範例 3：小型平衡樹 [1, 2, 3]", args: [[1, 2, 3]] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '    <span class="tok-kw">int</span> <span class="tok-fn">dfsHeight</span>(<span class="tok-type">TreeNode</span>* node) {' },
    { line: 3,  code: '        <span class="tok-kw">if</span> (!node) <span class="tok-kw">return</span> <span class="tok-num">0</span>;' },
    { line: 4,  code: '        <span class="tok-kw">int</span> leftH = <span class="tok-fn">dfsHeight</span>(node-&gt;left);' },
    { line: 5,  code: '        <span class="tok-kw">if</span> (leftH == <span class="tok-num">-1</span>) <span class="tok-kw">return</span> <span class="tok-num">-1</span>;' },
    { line: 6,  code: '        <span class="tok-kw">int</span> rightH = <span class="tok-fn">dfsHeight</span>(node-&gt;right);' },
    { line: 7,  code: '        <span class="tok-kw">if</span> (rightH == <span class="tok-num">-1</span> || <span class="tok-fn">abs</span>(leftH - rightH) &gt; <span class="tok-num">1</span>) <span class="tok-kw">return</span> <span class="tok-num">-1</span>;' },
    { line: 8,  code: '        <span class="tok-kw">return</span> <span class="tok-num">1</span> + <span class="tok-fn">max</span>(leftH, rightH);' },
    { line: 9,  code: '    }' },
    { line: 10, code: '<span class="tok-kw">public</span>:' },
    { line: 11, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">isBalanced</span>(<span class="tok-type">TreeNode</span>* root) {' },
    { line: 12, code: '        <span class="tok-kw">return</span> <span class="tok-fn">dfsHeight</span>(root) != <span class="tok-num">-1</span>;' },
    { line: 13, code: '    }' },
    { line: 14, code: '};' }
  ],
  generateTrace(treeArr) {
    const arr = Array.isArray(treeArr) && treeArr.length ? [...treeArr] : [3, 9, 20, null, null, 15, 7];
    const steps = [];

    const nodesById = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === null || arr[i] === undefined) continue;
      nodesById[i] = { id: `n${i}`, val: arr[i], left: null, right: null, h: null };
    }
    for (let i = 0; i < arr.length; i++) {
      if (!nodesById[i]) continue;
      if (nodesById[2 * i + 1]) nodesById[i].left = nodesById[2 * i + 1];
      if (nodesById[2 * i + 2]) nodesById[i].right = nodesById[2 * i + 2];
    }
    const root = nodesById[0] || null;

    const makeState = (currId, badId, retVal) => {
      const visNodes = [];
      const visEdges = [];
      const traverse = (nd, depth, xCenter, xSpan) => {
        if (!nd) return;
        const y = 42 + depth * 66;
        let status = "";
        if (nd.id === badId || nd.h === -1) status = "warn";
        else if (nd.id === currId) status = "hl";
        else if (nd.h !== null) status = "match";

        visNodes.push({
          id: nd.id,
          val: String(nd.val),
          sub: nd.h !== null ? `h=${nd.h}` : "",
          x: Math.round(xCenter),
          y,
          status,
          ptr: nd.id === currId ? "node" : ""
        });

        if (nd.left) {
          visEdges.push({ from: nd.id, to: nd.left.id, label: "L", status: "" });
          traverse(nd.left, depth + 1, xCenter - xSpan, xSpan * 0.52);
        }
        if (nd.right) {
          visEdges.push({ from: nd.id, to: nd.right.id, label: "R", status: "" });
          traverse(nd.right, depth + 1, xCenter + xSpan, xSpan * 0.52);
        }
      };
      traverse(root, 0, 310, 140);

      return {
        boards: [
          {
            id: "tree",
            type: "tree",
            shape: "circle",
            name: "root",
            typeLabel: "後序高度計算 (sub 標示子樹高度 h)",
            x: 325,
            y: 52,
            width: 620,
            height: 310,
            nodes: visNodes,
            edges: visEdges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "平衡檢查狀態",
            x: 24,
            y: 205,
            items: [
              { id: "cur", name: "node->val", val: currId ? String(visNodes.find((n) => n.id === currId)?.val ?? "-") : "-", status: "hl" },
              { id: "ret", name: "isBalanced", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    const dfs = (nd) => {
      if (!nd) return 0;
      const lh = dfs(nd.left);
      if (lh === -1) {
        nd.h = -1;
        return -1;
      }
      const rh = dfs(nd.right);
      const diff = Math.abs(lh - rh);

      if (rh === -1 || diff > 1) {
        nd.h = -1;
        steps.push({
          line: 7,
          tag: `節點 ${nd.val} 子樹失衡！`,
          tagType: "default",
          inlineBadge: `leftH=${lh}, rightH=${rh}, |${lh}-${rh}|=${diff} > 1 -> return -1`,
          explanation: `在節點 ${nd.val} 處，左子樹高度 ${lh} 與右子樹高度 ${rh} 相差 ${diff} (> 1)，違反平衡條件，回傳 -1！`,
          vars: { "node->val": String(nd.val), leftH: String(lh), rightH: String(rh), diff: String(diff), return: "-" },
          state: makeState(nd.id, nd.id, "-")
        });
        return -1;
      }

      nd.h = 1 + Math.max(lh, rh);
      steps.push({
        line: 8,
        tag: `計算節點 ${nd.val} 高度 h=${nd.h}`,
        tagType: "tag-check",
        inlineBadge: `leftH=${lh}, rightH=${rh} -> return 1 + max(${lh},${rh}) = ${nd.h}`,
        explanation: `節點 ${nd.val} 的左右子樹高度分別為 ${lh} 與 ${rh} (差值 ${diff} <= 1)，回傳該子樹高度 h = ${nd.h}。`,
        vars: { "node->val": String(nd.val), leftH: String(lh), rightH: String(rh), height: String(nd.h), return: "-" },
        state: makeState(nd.id, null, "-")
      });
      return nd.h;
    };

    const finalH = dfs(root);
    const balanced = finalH !== -1;

    steps.push({
      line: 12,
      tag: balanced ? "確認為平衡二元樹" : "確認為非平衡二元樹",
      tagType: balanced ? "tag-found" : "default",
      inlineBadge: `dfsHeight(root) = ${finalH} -> return ${balanced}`,
      explanation: balanced
        ? `根節點回傳高度 ${finalH} (!= -1)，所有節點左右子樹高度差皆不超過 1，回傳 true！`
        : `根節點收到失衡信號 -1，回傳 false。`,
      vars: { "node->val": root ? String(root.val) : "null", rootH: String(finalH), return: String(balanced) },
      state: makeState(root ? root.id : null, balanced ? null : (root ? root.id : null), String(balanced))
    });

    return steps;
  }
};

// ============================================================================
// #12 Linked List Cycle (LC #141, Easy, Linked List)
// ============================================================================
window.PROBLEMS["linked-list-cycle"] = {
  id: 12,
  leetcodeId: 141,
  slug: "linked-list-cycle",
  title: "141. Linked List Cycle (環形鏈結串列)",
  difficulty: "Easy",
  topic: "Linked List / Two Pointers",
  mins: 20,
  complexity: "Time O(N) · Space O(1)",
  description:
    "給定一個鏈結串列的頭節點 head，判斷鏈結串列中是否有環。使用 Floyd 龜兔賽跑演算法（快慢雙指標）：慢指標 slow 每次走 1 步，快指標 fast 每次走 2 步；若兩者相遇則必有環，若 fast 抵達 nullptr 則無環。",
  argNames: ["head", "pos"],
  presets: [
    { name: "範例 1：尾端連回索引 1 (有環) head = [3, 2, 0, -4], pos = 1", args: [[3, 2, 0, -4], 1] },
    { name: "範例 2：雙節點成環 head = [1, 2], pos = 0", args: [[1, 2], 0] },
    { name: "範例 3：無環單向串列 head = [1, 2, 3, 4], pos = -1", args: [[1, 2, 3, 4], -1] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-kw">bool</span> <span class="tok-fn">hasCycle</span>(<span class="tok-type">ListNode</span>* head) {' },
    { line: 4,  code: '        <span class="tok-type">ListNode</span> *slow = head, *fast = head;' },
    { line: 5,  code: '        <span class="tok-kw">while</span> (fast &amp;&amp; fast-&gt;next) {' },
    { line: 6,  code: '            slow = slow-&gt;next;' },
    { line: 7,  code: '            fast = fast-&gt;next-&gt;next;' },
    { line: 8,  code: '            <span class="tok-kw">if</span> (slow == fast) <span class="tok-kw">return</span> <span class="tok-kw">true</span>;' },
    { line: 9,  code: '        }' },
    { line: 10, code: '        <span class="tok-kw">return</span> <span class="tok-kw">false</span>;' },
    { line: 11, code: '    }' },
    { line: 12, code: '};' }
  ],
  generateTrace(headArr, posInput) {
    const vals = Array.isArray(headArr) && headArr.length ? [...headArr] : [3, 2, 0, -4];
    const pos = Number(posInput ?? 1);
    const n = vals.length;
    const steps = [];

    const nextIdx = (idx) => {
      if (idx === null || idx < 0 || idx >= n) return null;
      if (idx + 1 < n) return idx + 1;
      return pos >= 0 && pos < n ? pos : null;
    };

    const makeState = (slowIdx, fastIdx, met, retVal) => {
      const nodes = vals.map((v, i) => {
        const ptrLabels = [];
        if (i === slowIdx) ptrLabels.push("slow");
        if (i === fastIdx) ptrLabels.push("fast");
        let status = "";
        if (met && i === slowIdx) status = "match";
        else if (i === slowIdx || i === fastIdx) status = "hl";

        // 稍微錯開環回節點的 Y 座標讓回指邊清晰不重疊
        const y = pos >= 0 && i === n - 1 && n > 2 ? 115 : 52;
        return {
          id: `n${i}`,
          val: String(v),
          sub: `idx=${i}`,
          x: 52 + i * 95,
          y,
          status,
          ptr: ptrLabels.join(" & ")
        };
      });

      const edges = [];
      for (let i = 0; i < n; i++) {
        const nxt = nextIdx(i);
        if (nxt !== null) {
          edges.push({
            from: `n${i}`,
            to: `n${nxt}`,
            label: i === n - 1 && pos >= 0 ? "cycle" : "",
            status: i === n - 1 && pos >= 0 ? "hl" : ""
          });
        }
      }

      return {
        boards: [
          {
            id: "list",
            type: "list",
            shape: "list",
            name: "head",
            typeLabel: pos >= 0 ? `環形鏈結串列 (尾端連回索引 ${pos})` : "無環單向鏈結串列 (pos = -1)",
            x: 325,
            y: 52,
            width: Math.max(460, n * 105 + 40),
            height: 175,
            nodes,
            edges
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "快慢指標追蹤",
            x: 24,
            y: 205,
            items: [
              { id: "sl", name: "slow", val: slowIdx !== null ? `Node(${vals[slowIdx]}) [@${slowIdx}]` : "nullptr", status: met ? "match" : "hl" },
              { id: "fs", name: "fast", val: fastIdx !== null ? `Node(${vals[fastIdx]}) [@${fastIdx}]` : "nullptr", status: met ? "match" : "hl" },
              { id: "ret", name: "return", val: retVal, status: retVal === "true" ? "match" : retVal === "false" ? "warn" : "" }
            ]
          }
        ],
        connectors: []
      };
    };

    let slow = 0;
    let fast = 0;

    steps.push({
      line: 4,
      tag: "初始化快慢雙指標",
      tagType: "default",
      inlineBadge: `slow = head (${vals[0]}), fast = head (${vals[0]})`,
      explanation: `將慢指標 slow 與快指標 fast 同時初始化於頭節點索引 0 (數值 ${vals[0]})。`,
      vars: { slow: `@0 (${vals[0]})`, fast: `@0 (${vals[0]})`, return: "-" },
      state: makeState(slow, fast, false, "-")
    });

    let guard = 0;
    while (fast !== null && nextIdx(fast) !== null && guard < 24) {
      guard++;
      slow = nextIdx(slow);
      fast = nextIdx(nextIdx(fast));
      const met = slow !== null && slow === fast;

      steps.push({
        line: 7,
        tag: `slow 走 1 步，fast 走 2 步`,
        tagType: "tag-check",
        inlineBadge: `slow -> @${slow}, fast -> ${fast !== null ? `@${fast}` : "nullptr"}`,
        explanation: `慢指標前進一步至索引 ${slow} (${vals[slow]})；快指標前進兩步至 ${fast !== null ? `索引 ${fast} (${vals[fast]})` : "nullptr (尾端)"}。`,
        vars: { slow: `@${slow} (${vals[slow]})`, fast: fast !== null ? `@${fast} (${vals[fast]})` : "null", return: "-" },
        state: makeState(slow, fast, met, "-")
      });

      if (met) {
        steps.push({
          line: 8,
          tag: `快慢指標於 @${slow} 相遇！`,
          tagType: "tag-found",
          inlineBadge: `slow == fast (@${slow}) -> return true`,
          explanation: `快指標 fast 在環中追上慢指標 slow（兩者皆指向索引 ${slow}，數值 ${vals[slow]}），證實鏈結串列存在環，回傳 true！`,
          vars: { slow: `@${slow} (${vals[slow]})`, fast: `@${fast} (${vals[fast]})`, return: "true" },
          state: makeState(slow, fast, true, "true")
        });
        return steps;
      }
    }

    steps.push({
      line: 10,
      tag: "快指標抵達尾端 (無環)",
      tagType: "default",
      inlineBadge: `fast == nullptr -> return false`,
      explanation: `快指標 fast 已抵達串列盡頭 (nullptr)，代表串列中沒有環，回傳 false。`,
      vars: { slow: `@${slow} (${vals[slow]})`, fast: "nullptr", return: "false" },
      state: makeState(slow, fast, false, "false")
    });

    return steps;
  }
};

// ============================================================================
// #13 Implement Queue using Stacks (LC #232, Easy, Stack)
// ============================================================================
window.PROBLEMS["implement-queue-using-stacks"] = {
  id: 13,
  leetcodeId: 232,
  slug: "implement-queue-using-stacks",
  title: "232. Implement Queue using Stacks (用堆疊實作佇列)",
  difficulty: "Easy",
  topic: "Stack / Queue",
  mins: 20,
  complexity: "Amortized Time O(1) · Space O(N)",
  description:
    "僅使用兩個堆疊 inStack 與 outStack 實作先進先出佇列 (FIFO Queue)。push 時直接推入 inStack；當呼叫 peek 或 pop 且 outStack 為空時，將 inStack 所有元素逐一彈出並倒入 outStack，使順序反轉為先進先出，達成攤銷 O(1) 時間複雜度。",
  argNames: ["ops"],
  presets: [
    { name: "範例 1：標準佇列操作 [\"push(1)\", \"push(2)\", \"peek()\", \"pop()\", \"empty()\"]", args: [["push(1)", "push(2)", "peek()", "pop()", "empty()"]] },
    { name: "範例 2：多次推入與傾倒 [\"push(10)\", \"push(20)\", \"push(30)\", \"pop()\", \"push(40)\", \"pop()\"]", args: [["push(10)", "push(20)", "push(30)", "pop()", "push(40)", "pop()"]] },
    { name: "範例 3：清空測試 [\"push(5)\", \"pop()\", \"empty()\"]", args: [["push(5)", "pop()", "empty()"]] }
  ],
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">MyQueue</span> {' },
    { line: 2,  code: '    <span class="tok-type">stack</span>&lt;<span class="tok-kw">int</span>&gt; inStack, outStack;' },
    { line: 3,  code: '    <span class="tok-kw">void</span> <span class="tok-fn">transferIfNeeded</span>() {' },
    { line: 4,  code: '        <span class="tok-kw">if</span> (outStack.<span class="tok-fn">empty</span>()) {' },
    { line: 5,  code: '            <span class="tok-kw">while</span> (!inStack.<span class="tok-fn">empty</span>()) {' },
    { line: 6,  code: '                outStack.<span class="tok-fn">push</span>(inStack.<span class="tok-fn">top</span>()); inStack.<span class="tok-fn">pop</span>();' },
    { line: 7,  code: '            }' },
    { line: 8,  code: '        }' },
    { line: 9,  code: '    }' },
    { line: 10, code: '<span class="tok-kw">public</span>:' },
    { line: 11, code: '    <span class="tok-kw">void</span> <span class="tok-fn">push</span>(<span class="tok-kw">int</span> x) { inStack.<span class="tok-fn">push</span>(x); }' },
    { line: 12, code: '    <span class="tok-kw">int</span> <span class="tok-fn">pop</span>() { <span class="tok-fn">transferIfNeeded</span>(); <span class="tok-kw">int</span> v = outStack.<span class="tok-fn">top</span>(); outStack.<span class="tok-fn">pop</span>(); <span class="tok-kw">return</span> v; }' },
    { line: 13, code: '    <span class="tok-kw">int</span> <span class="tok-fn">peek</span>() { <span class="tok-fn">transferIfNeeded</span>(); <span class="tok-kw">return</span> outStack.<span class="tok-fn">top</span>(); }' },
    { line: 14, code: '    <span class="tok-kw">bool</span> <span class="tok-fn">empty</span>() { <span class="tok-kw">return</span> inStack.<span class="tok-fn">empty</span>() &amp;&amp; outStack.<span class="tok-fn">empty</span>(); }' },
    { line: 15, code: '};' }
  ],
  generateTrace(opsInput) {
    const ops = Array.isArray(opsInput) && opsInput.length ? [...opsInput] : ["push(1)", "push(2)", "peek()", "pop()", "empty()"];
    const steps = [];
    const inStack = [];
    const outStack = [];
    const doneOps = [];

    const makeState = (opIdx, hlInTop, hlOutTop, retVal, connectors) => {
      return {
        boards: [
          {
            id: "ops",
            type: "array",
            name: "operations",
            typeLabel: "佇列操作序列",
            x: 325,
            y: 52,
            values: ops,
            hl: opIdx >= 0 ? [opIdx] : [],
            done: [...doneOps],
            pointers: opIdx >= 0 ? [{ idx: opIdx, label: `op #${opIdx}`, color: "blue" }] : []
          },
          {
            id: "vars",
            type: "vars",
            name: "state_vars",
            typeLabel: "當前回傳值與雙堆疊大小",
            x: 24,
            y: 205,
            items: [
              { id: "inSz", name: "inStack.size()", val: String(inStack.length), status: hlInTop ? "hl" : "" },
              { id: "outSz", name: "outStack.size()", val: String(outStack.length), status: hlOutTop ? "match" : "" },
              { id: "ret", name: "return", val: retVal, status: retVal !== "-" ? "match" : "" }
            ]
          },
          {
            id: "inSt",
            type: "stack",
            name: "inStack",
            typeLabel: "輸入堆疊 (負責 push)",
            x: 325,
            y: 200,
            items: inStack.map((v, i) => ({ val: String(v), status: hlInTop && i === inStack.length - 1 ? "hl" : "" }))
          },
          {
            id: "outSt",
            type: "stack",
            name: "outStack",
            typeLabel: "輸出堆疊 (負責 pop / peek)",
            x: 540,
            y: 200,
            items: outStack.map((v, i) => ({ val: String(v), status: hlOutTop && i === outStack.length - 1 ? "match" : "" }))
          }
        ],
        connectors: connectors || []
      };
    };

    steps.push({
      line: 2,
      tag: "初始化雙堆疊 MyQueue",
      tagType: "default",
      inlineBadge: `inStack = [], outStack = []`,
      explanation: `建立 MyQueue 物件，內部包含空的輸入堆疊 inStack 與空的輸出堆疊 outStack。`,
      vars: { op: "MyQueue()", "inStack.size()": "0", "outStack.size()": "0", return: "-" },
      state: makeState(-1, false, false, "-", [])
    });

    const transfer = (opIdx, opStr) => {
      if (outStack.length === 0 && inStack.length > 0) {
        while (inStack.length > 0) {
          const moved = inStack.pop();
          outStack.push(moved);
          steps.push({
            line: 6,
            tag: `傾倒元素 ${moved} 至 outStack`,
            tagType: "tag-insert",
            inlineBadge: `outStack.push(${moved}); inStack.pop()`,
            explanation: `因 outStack 為空，將 inStack 頂端元素 ${moved} 彈出並推入 outStack，完成順序反轉。`,
            vars: { op: opStr, "inStack.size()": String(inStack.length), "outStack.size()": String(outStack.length), return: "-" },
            state: makeState(opIdx, false, true, "-", [
              { from: "wb-var-inSz", to: `wb-stack-outSt-${outStack.length - 1}`, label: `傾倒 ${moved}`, color: "purple" }
            ])
          });
        }
      }
    };

    ops.forEach((opStr, idx) => {
      const pushMatch = opStr.match(/push\((-?\d+)\)/i);
      if (pushMatch) {
        const val = Number(pushMatch[1]);
        inStack.push(val);
        steps.push({
          line: 11,
          tag: `執行 ${opStr}`,
          tagType: "tag-insert",
          inlineBadge: `inStack.push(${val})`,
          explanation: `呼叫 ${opStr}：直接將元素 ${val} 推入輸入堆疊 inStack 頂端 (O(1) 操作)。`,
          vars: { op: opStr, "inStack.size()": String(inStack.length), "outStack.size()": String(outStack.length), return: "void" },
          state: makeState(idx, true, false, "void", [
            { from: `wb-cw-ops-${idx}`, to: `wb-stack-inSt-${inStack.length - 1}`, label: `push(${val})`, color: "blue" }
          ])
        });
      } else if (/peek/i.test(opStr)) {
        transfer(idx, opStr);
        const topVal = outStack.length ? outStack[outStack.length - 1] : "empty";
        steps.push({
          line: 13,
          tag: `執行 peek() -> ${topVal}`,
          tagType: "tag-found",
          inlineBadge: `return outStack.top() = ${topVal}`,
          explanation: `呼叫 peek()：outStack 的頂端元素 ${topVal} 即為最早進入佇列的前端元素 (front)，回傳 ${topVal}。`,
          vars: { op: opStr, "inStack.size()": String(inStack.length), "outStack.size()": String(outStack.length), return: String(topVal) },
          state: makeState(idx, false, true, String(topVal), [
            { from: `wb-stack-outSt-${outStack.length - 1}`, to: "wb-var-ret", label: `peek=${topVal}`, color: "green" }
          ])
        });
      } else if (/pop/i.test(opStr)) {
        transfer(idx, opStr);
        const popVal = outStack.length ? outStack.pop() : "empty";
        steps.push({
          line: 12,
          tag: `執行 pop() -> ${popVal}`,
          tagType: "tag-found",
          inlineBadge: `outStack.pop() -> return ${popVal}`,
          explanation: `呼叫 pop()：將 outStack 頂端元素 ${popVal} 彈出並回傳，完成佇列前端出列。`,
          vars: { op: opStr, "inStack.size()": String(inStack.length), "outStack.size()": String(outStack.length), return: String(popVal) },
          state: makeState(idx, false, true, String(popVal), [])
        });
      } else if (/empty/i.test(opStr)) {
        const isEmp = inStack.length === 0 && outStack.length === 0;
        steps.push({
          line: 14,
          tag: `執行 empty() -> ${isEmp}`,
          tagType: "tag-check",
          inlineBadge: `return ${isEmp}`,
          explanation: `檢查 inStack 與 outStack 是否同時為空：回傳 ${isEmp}。`,
          vars: { op: opStr, "inStack.size()": String(inStack.length), "outStack.size()": String(outStack.length), return: String(isEmp) },
          state: makeState(idx, false, false, String(isEmp), [])
        });
      }
      doneOps.push(idx);
    });

    return steps;
  }
};

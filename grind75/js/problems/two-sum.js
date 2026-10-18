/**
 * Grind 75 #1 - LeetCode #1: Two Sum (兩數之和)
 * C++17 程式碼與單步執行狀態產生器
 */
window.PROBLEMS = window.PROBLEMS || {};

window.PROBLEMS["two-sum"] = {
  id: 1,
  leetcodeId: 1,
  slug: "two-sum",
  title: "1. Two Sum (兩數之和)",
  difficulty: "Easy",
  topic: "Array / Hash Table",
  mins: 15,
  complexity: "Time: O(N) | Space: O(N)",
  argNames: ["nums", "target"],
  description:
    "給定一個整數陣列 nums 和一個整數目標值 target，請你在該陣列中找出和為目標值 target 的那兩個整數，並回傳它們的陣列索引。使用 C++ unordered_map 雜湊表可在 O(N) 時間複雜度內完成單次掃描查找。",

  presets: [
    {
      name: "範例 1：標準情況 nums = [2, 7, 11, 15], target = 9",
      nums: [2, 7, 11, 15],
      target: 9,
      args: [[2, 7, 11, 15], 9]
    },
    {
      name: "範例 2：答案在中後段 nums = [3, 2, 4], target = 6",
      nums: [3, 2, 4],
      target: 6,
      args: [[3, 2, 4], 6]
    },
    {
      name: "範例 3：包含重複數字 nums = [3, 3], target = 6",
      nums: [3, 3],
      target: 6,
      args: [[3, 3], 6]
    },
    {
      name: "範例 4：包含負數與較長陣列 nums = [-3, 4, 3, 90, 1, 8], target = 5",
      nums: [-3, 4, 3, 90, 1, 8],
      target: 5,
      args: [[-3, 4, 3, 90, 1, 8], 5]
    }
  ],

  // C++17 原始碼 (1-indexed 行號對應單步反白)
  cppLines: [
    { line: 1,  code: '<span class="tok-kw">class</span> <span class="tok-type">Solution</span> {' },
    { line: 2,  code: '<span class="tok-kw">public</span>:' },
    { line: 3,  code: '    <span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt; <span class="tok-fn">twoSum</span>(<span class="tok-type">vector</span>&lt;<span class="tok-kw">int</span>&gt;&amp; nums, <span class="tok-kw">int</span> target) {' },
    { line: 4,  code: '        <span class="tok-type">unordered_map</span>&lt;<span class="tok-kw">int</span>, <span class="tok-kw">int</span>&gt; seen; <span class="tok-cmt">// 數值 -&gt; 陣列索引</span>' },
    { line: 5,  code: '        <span class="tok-kw">for</span> (<span class="tok-kw">int</span> i = <span class="tok-num">0</span>; i &lt; nums.<span class="tok-fn">size</span>(); ++i) {' },
    { line: 6,  code: '            <span class="tok-kw">int</span> complement = target - nums[i];' },
    { line: 7,  code: '            <span class="tok-kw">if</span> (seen.<span class="tok-fn">count</span>(complement)) {' },
    { line: 8,  code: '                <span class="tok-kw">return</span> {seen[complement], i};' },
    { line: 9,  code: '            }' },
    { line: 10, code: '            seen[nums[i]] = i;' },
    { line: 11, code: '        }' },
    { line: 12, code: '        <span class="tok-kw">return</span> {};' },
    { line: 13, code: '    }' },
    { line: 14, code: '};' }
  ],

  /**
   * 根據輸入 nums 與 target 產生完整的單步執行追蹤步驟 (Trace Steps)
   */
  generateTrace(nums, target) {
    const steps = [];
    const seen = {}; // key: number -> value: index
    const visitedIndices = [];

    const cloneSeen = () => {
      const entries = [];
      for (const k of Object.keys(seen)) {
        entries.push({ key: Number(k), val: seen[k] });
      }
      return entries;
    };

    // Step 0: 進入函式 twoSum (Line 3)
    steps.push({
      line: 3,
      tag: "進入函式",
      tagType: "default",
      inlineBadge: `nums.size() = ${nums.length}, target = ${target}`,
      explanation: `呼叫 twoSum(nums, ${target})，準備在長度為 ${nums.length} 的陣列中尋找相加為 ${target} 的兩個索引。`,
      vars: {
        target: String(target),
        "nums.size()": String(nums.length),
        i: "未宣告",
        "nums[i]": "-",
        complement: "-",
        "seen.size()": "0",
        return: "-"
      },
      state: {
        nums: [...nums],
        target,
        currentIndex: -1,
        visitedIndices: [],
        matchedIndices: [],
        complement: null,
        seenEntries: [],
        justInsertedKey: null,
        hitKey: null,
        lookupKey: null
      }
    });

    // Step 1: 初始化 unordered_map<int, int> seen (Line 4)
    steps.push({
      line: 4,
      tag: "初始化雜湊表",
      tagType: "default",
      inlineBadge: `seen = {} (空雜湊表)`,
      explanation: `建立空的 C++ unordered_map<int, int> seen，用來記錄「已經看過的數值 → 該數值所在的陣列索引」。`,
      vars: {
        target: String(target),
        "nums.size()": String(nums.length),
        i: "未宣告",
        "nums[i]": "-",
        complement: "-",
        "seen.size()": "0",
        return: "-"
      },
      state: {
        nums: [...nums],
        target,
        currentIndex: -1,
        visitedIndices: [],
        matchedIndices: [],
        complement: null,
        seenEntries: [],
        justInsertedKey: null,
        hitKey: null,
        lookupKey: null
      }
    });

    for (let i = 0; i < nums.length; i++) {
      const curVal = nums[i];
      const complement = target - curVal;

      // Line 5: for 迴圈條件檢查
      steps.push({
        line: 5,
        tag: `迴圈迭代 i = ${i}`,
        tagType: "default",
        inlineBadge: `i = ${i} < ${nums.length} (true)`,
        explanation:
          i === 0
            ? `初始化迴圈變數 i = 0，檢查 0 < ${nums.length} 成立，進入第 1 次迭代（處理 nums[0] = ${curVal}）。`
            : `遞增 ++i 後 i = ${i}，檢查 ${i} < ${nums.length} 成立，進入下一輪迭代（處理 nums[${i}] = ${curVal}）。`,
        vars: {
          target: String(target),
          "nums.size()": String(nums.length),
          i: String(i),
          "nums[i]": String(curVal),
          complement: "-",
          "seen.size()": String(Object.keys(seen).length),
          return: "-"
        },
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          visitedIndices: [...visitedIndices],
          matchedIndices: [],
          complement: null,
          seenEntries: cloneSeen(),
          justInsertedKey: null,
          hitKey: null,
          lookupKey: null
        }
      });

      // Line 6: 計算補數 int complement = target - nums[i]
      steps.push({
        line: 6,
        tag: "計算補數",
        tagType: "tag-check",
        inlineBadge: `complement = ${target} - (${curVal}) = ${complement}`,
        explanation: `計算目前元素 nums[${i}] = ${curVal} 所需的補數：complement = ${target} - (${curVal}) = ${complement}。`,
        vars: {
          target: String(target),
          "nums.size()": String(nums.length),
          i: String(i),
          "nums[i]": String(curVal),
          complement: String(complement),
          "seen.size()": String(Object.keys(seen).length),
          return: "-"
        },
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          visitedIndices: [...visitedIndices],
          matchedIndices: [],
          complement,
          seenEntries: cloneSeen(),
          justInsertedKey: null,
          hitKey: null,
          lookupKey: null
        }
      });

      // Line 7: if (seen.count(complement))
      const found = Object.prototype.hasOwnProperty.call(seen, complement);
      steps.push({
        line: 7,
        tag: "查找雜湊表",
        tagType: found ? "tag-found" : "tag-check",
        inlineBadge: `seen.count(${complement}) == ${found ? "1 (找到!)" : "0 (不存在)"}`,
        explanation: found
          ? `在雜湊表 seen 中查找補數 ${complement}：命中！發現先前在索引 ${seen[complement]} 處已出現過數值 ${complement}。`
          : `在雜湊表 seen 中查找補數 ${complement}：目前雜湊表中尚未出現過 ${complement}，條件為 false。`,
        vars: {
          target: String(target),
          "nums.size()": String(nums.length),
          i: String(i),
          "nums[i]": String(curVal),
          complement: String(complement),
          "seen.size()": String(Object.keys(seen).length),
          return: "-"
        },
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          visitedIndices: [...visitedIndices],
          matchedIndices: found ? [seen[complement], i] : [],
          complement,
          seenEntries: cloneSeen(),
          justInsertedKey: null,
          hitKey: found ? complement : null,
          lookupKey: complement
        }
      });

      if (found) {
        const matchIdx = seen[complement];
        // Line 8: return {seen[complement], i};
        steps.push({
          line: 8,
          tag: "找到答案並回傳",
          tagType: "tag-found",
          inlineBadge: `return {${matchIdx}, ${i}}`,
          explanation: `成功找到兩數之和！nums[${matchIdx}] (${complement}) + nums[${i}] (${curVal}) == ${target}，立即回傳索引陣列 {${matchIdx}, ${i}}。`,
          vars: {
            target: String(target),
            "nums.size()": String(nums.length),
            i: String(i),
            "nums[i]": String(curVal),
            complement: String(complement),
            "seen.size()": String(Object.keys(seen).length),
            return: `{${matchIdx}, ${i}}`
          },
          state: {
            nums: [...nums],
            target,
            currentIndex: i,
            visitedIndices: [...visitedIndices],
            matchedIndices: [matchIdx, i],
            complement,
            seenEntries: cloneSeen(),
            justInsertedKey: null,
            hitKey: complement,
            lookupKey: complement
          }
        });
        return steps;
      }

      // Line 10: seen[nums[i]] = i;
      seen[curVal] = i;
      visitedIndices.push(i);
      steps.push({
        line: 10,
        tag: "寫入雜湊表",
        tagType: "tag-insert",
        inlineBadge: `seen[${curVal}] = ${i}`,
        explanation: `將目前數值與索引存入雜湊表：seen[${curVal}] = ${i}，供後續元素快速配對查找。`,
        vars: {
          target: String(target),
          "nums.size()": String(nums.length),
          i: String(i),
          "nums[i]": String(curVal),
          complement: String(complement),
          "seen.size()": String(Object.keys(seen).length),
          return: "-"
        },
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          visitedIndices: [...visitedIndices],
          matchedIndices: [],
          complement,
          seenEntries: cloneSeen(),
          justInsertedKey: curVal,
          hitKey: null,
          lookupKey: null
        }
      });
    }

    // 若整個迴圈結束仍未找到配對
    steps.push({
      line: 12,
      tag: "無解回傳空陣列",
      tagType: "default",
      inlineBadge: `return {}`,
      explanation: `迴圈走訪完畢，未找到任何兩數之和等於 ${target} 的組合，執行 return {}。`,
      vars: {
        target: String(target),
        "nums.size()": String(nums.length),
        i: String(nums.length),
        "nums[i]": "-",
        complement: "-",
        "seen.size()": String(Object.keys(seen).length),
        return: "{}"
      },
      state: {
        nums: [...nums],
        target,
        currentIndex: -1,
        visitedIndices: [...visitedIndices],
        matchedIndices: [],
        complement: null,
        seenEntries: cloneSeen(),
        justInsertedKey: null,
        hitKey: null,
        lookupKey: null
      }
    });

    return steps;
  }
};

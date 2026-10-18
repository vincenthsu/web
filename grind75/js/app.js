/**
 * Grind 75 C++ 手動跑題白板視覺化主應用程式控制器 (Main App Controller)
 */
document.addEventListener("DOMContentLoaded", () => {
  const allQuestions = window.GRIND75_CATALOG || [];
  let catalog = [];
  const player = new window.VisualizerPlayer();

  // 自動同步 window.PROBLEMS 實作狀態至 catalog
  allQuestions.forEach((item) => {
    item.implemented = Boolean(window.PROBLEMS?.[item.slug]);
  });

  // DOM 參考
  const sidebar = document.getElementById("sidebar");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const compactViewport = window.matchMedia("(max-width: 1440px)");
  function setSidebarOpen(open) {
    sidebar.classList.toggle("collapsed", !open);
    btnToggleSidebar.setAttribute("aria-expanded", String(open));
    sidebar.inert = !open;
    sidebarBackdrop.classList.toggle("hidden", !open || !compactViewport.matches);
  }
  setSidebarOpen(!compactViewport.matches);
  compactViewport.addEventListener("change", () => setSidebarOpen(!compactViewport.matches));
  sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && compactViewport.matches && !sidebar.classList.contains("collapsed")) {
      setSidebarOpen(false);
      btnToggleSidebar.focus();
    }
  });
  const brandHome = document.getElementById("brand-home");
  const navCatalogBtn = document.getElementById("nav-catalog-btn");
  const navVisualizerBtn = document.getElementById("nav-visualizer-btn");
  const implementedCountEl = document.getElementById("implemented-count");
  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const viewCatalog = document.getElementById("view-catalog");
  const viewVisualizer = document.getElementById("view-visualizer");

  // Sidebar DOM
  const sidebarSearch = document.getElementById("sidebar-search");
  const sidebarFilterChips = document.querySelectorAll(".sidebar-filters .filter-chip");
  const sidebarList = document.getElementById("sidebar-list");

  // Catalog DOM
  const catalogStats = document.getElementById("catalog-stats");
  const studyWeeks = document.getElementById("study-weeks");
  const studyHours = document.getElementById("study-hours");
  const curriculumSummary = document.getElementById("curriculum-summary");
  const catalogWeekFilter = document.getElementById("catalog-week-filter");
  const catalogTopicFilter = document.getElementById("catalog-topic-filter");
  const catalogDiffFilter = document.getElementById("catalog-diff-filter");
  const catalogSearch = document.getElementById("catalog-search");
  const catalogWeeksContainer = document.getElementById("catalog-weeks-container");

  // Visualizer Header DOM
  const visOrder = document.getElementById("vis-problem-order");
  const visDiff = document.getElementById("vis-problem-diff");
  const visTopic = document.getElementById("vis-problem-topic");
  const visTime = document.getElementById("vis-problem-time");
  const visTitle = document.getElementById("vis-problem-title");
  const visDesc = document.getElementById("vis-problem-desc");

  const presetSelect = document.getElementById("preset-select");
  const customInputsFields = document.getElementById("custom-inputs-fields");
  const btnApplyInput = document.getElementById("btn-apply-input");
  const inputError = document.getElementById("input-error");

  let activeSidebarFilter = "all";
  let currentProblemSlug = "two-sum";

  function getPresetArgs(preset) {
    if (Array.isArray(preset.args)) return preset.args;
    if (preset.nums !== undefined && preset.target !== undefined) return [preset.nums, preset.target];
    return [];
  }

  function formatDescription(rawDesc) {
    if (!rawDesc) return "";
    return rawDesc
      .replace(/<\/?(?:code|strong|b|i|em|span|p|div|br)[^>]*>/gi, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function renderCustomInputsForPreset(problemModule, preset) {
    const args = getPresetArgs(preset);
    const argNames = problemModule.argNames || (problemModule.slug === "two-sum" ? ["nums", "target"] : args.map((_, i) => `arg${i + 1}`));

    customInputsFields.innerHTML = "";
    args.forEach((argVal, idx) => {
      const label = argNames[idx] || `參數${idx + 1}`;
      const grp = document.createElement("div");
      grp.className = "input-group";
      const serialized = typeof argVal === "string" ? argVal : JSON.stringify(argVal);
      const widthPx = serialized.length > 14 ? 175 : serialized.length > 6 ? 120 : 75;
      grp.innerHTML = `
        <label><code>${label}</code></label>
        <input type="text" class="tb-input mono dyn-arg-input" data-arg-idx="${idx}" style="width:${widthPx}px" value='${serialized.replace(/'/g, "&#39;")}' />
      `;
      customInputsFields.appendChild(grp);
    });
  }

  function parseCustomInputArgs(problemModule, fallbackPreset) {
    const inputs = customInputsFields.querySelectorAll(".dyn-arg-input");
    const fallbackArgs = getPresetArgs(fallbackPreset);
    const parsed = [];

    for (let i = 0; i < inputs.length; i++) {
      const raw = inputs[i].value.trim();
      const orig = fallbackArgs[i];

      if (typeof orig === "string") {
        // Strip surrounding quotes if user typed them
        const clean = raw.replace(/^["'](.*)["']$/, "$1");
        parsed.push(clean);
      } else if (typeof orig === "number") {
        const n = Number(raw);
        if (Number.isNaN(n)) throw new Error(`參數 ${i + 1} 必須為有效數字`);
        parsed.push(n);
      } else {
        try {
          parsed.push(JSON.parse(raw));
        } catch (_) {
          // Allow comma-separated numbers for 1D number array
          if (Array.isArray(orig) && orig.every((x) => typeof x === "number")) {
            const arr = raw
              .replace(/^\[|\]$/g, "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map(Number);
            if (arr.length === 0 || arr.some(Number.isNaN)) {
              throw new Error(`請輸入有效的整數陣列格式（例如：[2, 7, 11, 15]）`);
            }
            parsed.push(arr);
          } else {
            throw new Error(`請輸入有效的 JSON 格式：${JSON.stringify(orig)}`);
          }
        }
      }
    }
    return parsed;
  }

  // 1. 初始化統計與主題選單
  function initCatalogStatsAndFilters() {
    const implCount = catalog.filter((p) => p.implemented).length;
    implementedCountEl.textContent = `${allQuestions.filter((p) => p.implemented).length} / ${allQuestions.length}`;
    document.getElementById("catalog-nav-label").textContent = `01 · 題庫總目錄 (${catalog.length} / ${allQuestions.length})`;
    document.getElementById("curriculum-index-label").textContent = `CURRICULUM INDEX · ${catalog.length} 題`;
    const totalHours = Math.ceil(catalog.reduce((sum, p) => sum + p.mins * 1.96, 0) / 60);
    curriculumSummary.textContent = `${studyWeeks.value} 週 × ${studyHours.value} 小時 · 已安排 ${catalog.length} / ${allQuestions.length} 題 · 含複習約 ${totalHours} 小時`;

    const easyCount = catalog.filter((p) => p.difficulty === "Easy").length;
    const medCount = catalog.filter((p) => p.difficulty === "Medium").length;
    const hardCount = catalog.filter((p) => p.difficulty === "Hard").length;

    catalogStats.innerHTML = `
      <div class="stat-box">
        <div class="stat-num" style="color: var(--green);">${implCount} / ${catalog.length}</div>
        <div class="stat-label">已實作白板</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${easyCount}</div>
        <div class="stat-label">Easy 基礎</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${medCount}</div>
        <div class="stat-label">Medium 進階</div>
      </div>
      <div class="stat-box">
        <div class="stat-num">${hardCount}</div>
        <div class="stat-label">Hard 挑戰</div>
      </div>
    `;

    const previousTopic = catalogTopicFilter.value;
    const topics = Array.from(new Set(catalog.map((p) => p.topic))).sort();
    catalogTopicFilter.innerHTML = '<option value="all">全部主題</option>';
    topics.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      catalogTopicFilter.appendChild(opt);
    });
    if (topics.includes(previousTopic)) catalogTopicFilter.value = previousTopic;
    const previousWeek = catalogWeekFilter.value;
    const weeks = [...new Set(catalog.map((p) => p.week))];
    catalogWeekFilter.replaceChildren(new Option("全部週次", "all"));
    weeks.forEach((week) => catalogWeekFilter.add(new Option(`Week ${week}`, String(week))));
    if (weeks.includes(Number(previousWeek))) catalogWeekFilter.value = previousWeek;
  }

  function updateCurriculum() {
    catalog = window.buildGrind75Curriculum(allQuestions, Number(studyWeeks.value), Number(studyHours.value));
    initCatalogStatsAndFilters();
    renderCatalog();
    renderSidebar();
  }

  function initSchedule() {
    const params = new URLSearchParams(window.location.search);
    for (const [select, key, max] of [[studyWeeks, "weeks", 26], [studyHours, "hours", 40]]) {
      for (let value = 1; value <= max; value++) {
        select.add(new Option(String(value), String(value)));
      }
      const value = Number(params.get(key) ?? 8);
      select.value = String(Number.isInteger(value) && value >= 1 && value <= max ? value : 8);
      select.addEventListener("change", () => {
        const url = new URL(window.location.href);
        url.searchParams.set("weeks", studyWeeks.value);
        url.searchParams.set("hours", studyHours.value);
        window.history.replaceState(null, "", url);
        updateCurriculum();
      });
    }
    updateCurriculum();
  }

  // 2. 渲染側邊欄快速目錄
  function renderSidebar() {
    const query = sidebarSearch.value.trim().toLowerCase();
    sidebarList.innerHTML = "";

    const filtered = catalog.filter((item) => {
      if (activeSidebarFilter === "implemented" && !item.implemented) return false;
      if (["Easy", "Medium", "Hard"].includes(activeSidebarFilter) && item.difficulty !== activeSidebarFilter) {
        return false;
      }
      if (query) {
        const hay = `${item.id} ${item.leetcodeId} ${item.title} ${item.titleZh} ${item.topic}`.toLowerCase();
        return hay.includes(query);
      }
      return true;
    });

    let currentWeek = null;
    filtered.forEach((item) => {
      if (item.week !== currentWeek) {
        currentWeek = item.week;
        const wkHeader = document.createElement("div");
        wkHeader.className = "sidebar-week-title";
        wkHeader.textContent = `WEEK ${String(currentWeek).padStart(2, "0")}`;
        sidebarList.appendChild(wkHeader);
      }

      const row = document.createElement(item.implemented ? "div" : "a");
      if (!item.implemented) {
        row.href = `https://leetcode.com/problems/${item.slug}/`;
        row.target = "_blank";
        row.rel = "noopener noreferrer";
      }
      const isAct = item.slug === currentProblemSlug && viewVisualizer.classList.contains("active");
      row.className = `sidebar-item ${isAct ? "active" : ""} ${!item.implemented ? "unimplemented" : ""}`;
      row.innerHTML = `
        <div class="sidebar-item-left">
          <span class="sidebar-num">#${String(item.id).padStart(2, "0")}</span>
          <span class="sidebar-title" title="${item.title} (${item.titleZh})">${item.title}</span>
        </div>
        <div class="sidebar-item-right">
          <span class="difficulty-badge ${item.difficulty}">${item.difficulty[0]}</span>
          <span class="status-dot ${item.implemented ? "live" : "pending"}" title="${item.implemented ? "已實作白板視覺化" : "開啟 LeetCode 原題"}"></span>
        </div>
      `;

      row.addEventListener("click", () => {
        handleSelectProblem(item);
      });

      sidebarList.appendChild(row);
    });
  }

  // 3. 渲染目前學習排程總目錄 (依 Week 分組)
  function renderCatalog() {
    const weekVal = catalogWeekFilter.value;
    const topicVal = catalogTopicFilter.value;
    const diffVal = catalogDiffFilter.value;
    const q = catalogSearch.value.trim().toLowerCase();

    const filtered = catalog.filter((item) => {
      if (weekVal !== "all" && String(item.week) !== weekVal) return false;
      if (topicVal !== "all" && item.topic !== topicVal) return false;
      if (diffVal !== "all" && item.difficulty !== diffVal) return false;
      if (q) {
        const hay = `${item.id} ${item.leetcodeId} ${item.title} ${item.titleZh} ${item.topic}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });

    catalogWeeksContainer.innerHTML = "";

    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "curriculum-summary";
      empty.textContent = "目前沒有符合條件的題目，請調整篩選或增加學習時間。";
      catalogWeeksContainer.appendChild(empty);
    }
    for (const w of [...new Set(filtered.map((item) => item.week))]) {
      const weekItems = filtered.filter((item) => item.week === w);
      if (weekItems.length === 0) continue;

      const totalMins = weekItems.reduce((acc, cur) => acc + cur.mins, 0);
      const section = document.createElement("div");
      section.className = "week-section";

      const rowsHtml = weekItems
        .map((item) => {
          const lcUrl = `https://leetcode.com/problems/${item.slug}/`;
          const statusBtn = item.implemented
            ? `<button class="action-badge-live" data-slug="${item.slug}">▶ 開啟跑題白板</button>`
            : `<a class="editorial-link" href="${lcUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">開啟原題練習 ↗</a>`;

          return `
            <tr class="${item.implemented ? "row-implemented" : ""}" data-id="${item.id}">
              <td class="mono"><strong>#${String(item.id).padStart(2, "0")}</strong></td>
              <td>
                <div><strong>${item.title}</strong> <span style="color: var(--ink-2);">· ${item.titleZh}</span></div>
              </td>
              <td><span class="difficulty-badge ${item.difficulty}">${item.difficulty}</span></td>
              <td><span class="topic-badge">${item.topic}</span></td>
              <td><span class="time-badge">${item.mins} mins</span></td>
              <td class="mono"><a href="${lcUrl}" target="_blank" rel="noopener" class="editorial-link" onclick="event.stopPropagation()">LC #${item.leetcodeId} ↗</a></td>
              <td>${statusBtn}</td>
            </tr>
          `;
        })
        .join("");

      section.innerHTML = `
        <div class="week-header">
          <h3>WEEK ${String(w).padStart(2, "0")} · 學習清單</h3>
          <span class="week-meta">${weekItems.length} 題 · 預估 ${totalMins} mins</span>
        </div>
        <table class="catalog-table">
          <thead>
            <tr>
              <th style="width: 72px;">編號</th>
              <th>題目名稱 (English / 繁體中文)</th>
              <th style="width: 96px;">難度</th>
              <th style="width: 170px;">資料結構 / 主題</th>
              <th style="width: 105px;">建議時間</th>
              <th style="width: 105px;">LeetCode</th>
              <th style="width: 155px;">白板狀態</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;

      section.querySelectorAll("tbody tr").forEach((tr) => {
        tr.addEventListener("click", () => {
          const id = Number(tr.dataset.id);
          const item = catalog.find((p) => p.id === id);
          if (item) handleSelectProblem(item);
        });
      });

      catalogWeeksContainer.appendChild(section);
    }
  }

  // 4. 處理選擇題目
  function handleSelectProblem(item) {
    const problemModule = window.PROBLEMS && window.PROBLEMS[item.slug];
    if (!problemModule) return;
    if (compactViewport.matches) setSidebarOpen(false);

    currentProblemSlug = item.slug;

    visOrder.textContent = `GRIND #${item.id} · LC #${item.leetcodeId}`;
    visDiff.textContent = item.difficulty;
    visDiff.className = `difficulty-badge ${item.difficulty}`;
    visTopic.textContent = problemModule.topic || item.topic;
    visTime.textContent = `${item.mins}m`;
    visTitle.textContent = `${item.id}. ${item.title} · ${item.titleZh}`;
    const descText = formatDescription(problemModule.description);
    visDesc.textContent = descText;
    visDesc.title = descText;
    navVisualizerBtn.innerHTML = `<span class="led-dot"></span><span>02 · 單步跑題白板 (#${item.id} ${item.title})</span>`;

    presetSelect.innerHTML = "";
    problemModule.presets.forEach((preset, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = preset.name;
      presetSelect.appendChild(opt);
    });

    const firstPreset = problemModule.presets[0];
    renderCustomInputsForPreset(problemModule, firstPreset);
    inputError.classList.add("hidden");

    const args = getPresetArgs(firstPreset);
    player.loadProblem(problemModule, ...args);
    switchView("visualizer");
  }

  // 5. 切換總目錄與單步視覺化視圖
  function switchView(viewName) {
    if (viewName === "catalog") {
      player.pause();
      viewCatalog.classList.add("active");
      viewVisualizer.classList.remove("active");
      navCatalogBtn.classList.add("active");
      navCatalogBtn.setAttribute("aria-selected", "true");
      navVisualizerBtn.classList.remove("active");
      navVisualizerBtn.setAttribute("aria-selected", "false");
    } else {
      viewCatalog.classList.remove("active");
      viewVisualizer.classList.add("active");
      navCatalogBtn.classList.remove("active");
      navCatalogBtn.setAttribute("aria-selected", "false");
      navVisualizerBtn.classList.add("active");
      navVisualizerBtn.setAttribute("aria-selected", "true");
      requestAnimationFrame(() => player.renderCurrentStep());
    }
    renderSidebar();
  }

  // 6. 亮暗主題切換 (紙張白板 / 暗色白板)
  btnThemeToggle.addEventListener("click", () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    themeIcon.textContent = nextTheme === "dark" ? "☾ 暗色白板" : "☀ 紙張白板";
    requestAnimationFrame(() => player.renderCurrentConnector());
  });

  // 7. 綁定事件
  btnToggleSidebar.addEventListener("click", () => {
    setSidebarOpen(sidebar.classList.contains("collapsed"));
    setTimeout(() => player.renderCurrentConnector(), 200);
  });

  brandHome.addEventListener("click", () => {
    switchView("catalog");
  });

  navCatalogBtn.addEventListener("click", () => {
    switchView("catalog");
  });

  navVisualizerBtn.addEventListener("click", () => {
    switchView("visualizer");
  });

  sidebarSearch.addEventListener("input", renderSidebar);

  sidebarFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      sidebarFilterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeSidebarFilter = chip.dataset.filter;
      renderSidebar();
    });
  });

  catalogWeekFilter.addEventListener("change", renderCatalog);
  catalogTopicFilter.addEventListener("change", renderCatalog);
  catalogDiffFilter.addEventListener("change", renderCatalog);
  catalogSearch.addEventListener("input", renderCatalog);

  presetSelect.addEventListener("change", () => {
    const problemModule = window.PROBLEMS[currentProblemSlug];
    const preset = problemModule.presets[Number(presetSelect.value)];
    if (!preset) return;
    renderCustomInputsForPreset(problemModule, preset);
    inputError.classList.add("hidden");
    const args = getPresetArgs(preset);
    player.loadProblem(problemModule, ...args);
  });

  btnApplyInput.addEventListener("click", () => {
    const problemModule = window.PROBLEMS[currentProblemSlug];
    const preset = problemModule.presets[Number(presetSelect.value)] || problemModule.presets[0];
    try {
      const parsedArgs = parseCustomInputArgs(problemModule, preset);
      inputError.classList.add("hidden");
      player.loadProblem(problemModule, ...parsedArgs);
    } catch (err) {
      inputError.textContent = err.message || "輸入格式錯誤";
      inputError.classList.remove("hidden");
    }
  });

  window.addEventListener("resize", () => {
    if (viewVisualizer.classList.contains("active")) {
      player.renderCurrentConnector();
    }
  });

  // 啟動初始化
  initSchedule();

  // 預先載入第 1 題 Two Sum 的視覺化資料
  const twoSumModule = window.PROBLEMS["two-sum"];
  if (twoSumModule) {
    const firstPreset = twoSumModule.presets[0];
    renderCustomInputsForPreset(twoSumModule, firstPreset);
    player.loadProblem(twoSumModule, ...getPresetArgs(firstPreset));
    const twoSumDesc = formatDescription(twoSumModule.description);
    visDesc.textContent = twoSumDesc;
    visDesc.title = twoSumDesc;
    twoSumModule.presets.forEach((preset, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = preset.name;
      presetSelect.appendChild(opt);
    });
  }
});

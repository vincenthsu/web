/**
 * C++ 單步執行與自動執行播放器引擎 + 通用 Trace-by-Hand 手動跑題白板渲染器
 * 支援全部 75 題 (Array, String, Stack, Queue, Dict, Set, 2D Grid, Linked List, Binary Tree, BST, Graph, Trie, Heap, DP)
 * Style Reference: pbakaus/impeccable
 * Component Reference: pjwang2022/trace-by-hand-whiteboard
 */
class VisualizerPlayer {
  constructor() {
    this.problem = null;
    this.steps = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.timerId = null;
    this.speedMs = 1000;
    this.workspaceTab = "english";

    // Whiteboard Canvas State (Pan, Zoom, Tool, Freehand Strokes)
    this.wbView = { x: 0, y: 0, z: 1 };
    this.wbTool = "select"; // 'select' | 'hand' | 'pen'
    this.customPositions = {}; // 紀錄使用者手動拖曳後的元件位置
    this.defaultLayout = {
      "wb-item-note":  { x: 24,  y: 52 },
      "wb-item-array": { x: 340, y: 52 },
      "wb-item-vars":  { x: 24,  y: 220 },
      "wb-item-dict":  { x: 340, y: 220 },
      "wb-item-steps": { x: 24,  y: 480 }
    };

    this.bindDOM();
    this.bindEvents();
    this.initWhiteboardInteractions();
    this.initWorkbenchResize();
  }

  bindDOM() {
    this.btnReset = document.getElementById("btn-reset");
    this.btnPrev = document.getElementById("btn-prev");
    this.btnPlay = document.getElementById("btn-play");
    this.playBtnLabel = document.getElementById("play-btn-label");
    this.btnNext = document.getElementById("btn-next");
    this.stepCounter = document.getElementById("step-counter");
    this.stepSlider = document.getElementById("step-slider");
    this.speedSelect = document.getElementById("speed-select");

    this.codeContainer = document.getElementById("cpp-code-container");
    this.activeLineBadge = document.getElementById("active-line-badge");
    this.variableWatchGrid = document.getElementById("variable-watch-grid");
    this.workspaceTabs = Array.from(document.querySelectorAll(".workspace-tab"));
    this.statementArticle = document.getElementById("problem-statement");
    this.englishStatementArticle = document.getElementById("problem-statement-en");

    this.stepActionTag = document.getElementById("step-action-tag");
    this.stepExplanationText = document.getElementById("step-explanation-text");

    this.legacyItemArray = document.getElementById("wb-item-array");
    this.legacyItemVars = document.getElementById("wb-item-vars");
    this.legacyItemDict = document.getElementById("wb-item-dict");
    this.arrayContainer = document.getElementById("array-visual-container");
    this.formulaContainer = document.getElementById("formula-visual-container");
    this.hashmapContainer = document.getElementById("hashmap-visual-container");

    this.dynamicItemsContainer = document.getElementById("wb-dynamic-items");
    this.stepsHeadRow = document.getElementById("wb-steps-head-row");
    this.executionLogList = document.getElementById("execution-log-list");

    // Whiteboard DOM
    this.wbBoard = document.getElementById("whiteboard-board");
    this.wbWorld = document.getElementById("wb-world");
    this.wbConnectors = document.getElementById("wb-Connectors");
    this.wbStrokes = document.getElementById("wb-strokes");
    this.wbZv = document.getElementById("wb-zv");
  }

  bindEvents() {
    this.workspaceTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.selectWorkspaceTab(tab.id.slice(4)));
      tab.addEventListener("keydown", (event) => {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? this.workspaceTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + this.workspaceTabs.length) % this.workspaceTabs.length;
        this.workspaceTabs[next].click();
        this.workspaceTabs[next].focus();
      });
    });

    this.btnReset.addEventListener("click", () => {
      this.pause();
      this.goToStep(0);
    });

    this.btnPrev.addEventListener("click", () => {
      this.pause();
      this.prev();
    });

    this.btnNext.addEventListener("click", () => {
      this.pause();
      this.next();
    });

    this.btnPlay.addEventListener("click", () => {
      this.togglePlay();
    });

    this.stepSlider.addEventListener("input", (e) => {
      this.pause();
      this.goToStep(Number(e.target.value));
    });

    this.speedSelect.addEventListener("change", (e) => {
      this.speedMs = Number(e.target.value);
      if (this.isPlaying) {
        this.restartTimer();
      }
    });

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      const visView = document.getElementById("view-visualizer");
      if (!visView || !visView.classList.contains("active")) return;
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      if (e.target.closest('[role="tablist"]')) return;
      if (e.target.closest('[role="separator"]')) return;
      if (e.code === "Space" && e.target.closest("button, a, summary")) return;

      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        this.pause();
        this.next();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        this.pause();
        this.prev();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        this.pause();
        this.goToStep(0);
      } else if (e.key === "v" || e.key === "V") {
        this.setWhiteboardTool("select");
      } else if (e.key === "h" || e.key === "H") {
        this.setWhiteboardTool("hand");
      } else if (e.key === "p" || e.key === "P") {
        this.setWhiteboardTool("pen");
      }
    });
  }

  initWorkbenchResize() {
    const split = document.querySelector(".workbench-split");
    const divider = document.getElementById("workbench-divider");
    const panel = document.getElementById("workspace-panel");
    const stacked = window.matchMedia("(max-width: 900px)");
    // Keep separate preferences when switching between side-by-side and stacked views.
    const ratios = { vertical: null, horizontal: null };
    let drag = null;
    const metrics = () => {
      const horizontal = stacked.matches;
      const total = horizontal ? Math.max(890, split.clientHeight) : split.clientWidth;
      const available = total - 10;
      return {
        horizontal, available, axis: horizontal ? "horizontal" : "vertical",
        min: horizontal ? 240 : 320,
        max: available - (horizontal ? 320 : 440),
        initial: horizontal ? 360 : Math.min(500, Math.max(380, split.clientWidth * 0.35))
      };
    };
    const apply = (requested, remember = false) => {
      if (!split.clientWidth) return;
      const m = metrics();
      const preferred = ratios[m.axis];
      const size = Math.round(Math.max(m.min, Math.min(m.max,
        requested ?? (preferred === null ? m.initial : preferred * m.available))));
      if (remember) ratios[m.axis] = size / m.available;
      if (m.horizontal) {
        split.style.setProperty("--workspace-height", `${size}px`);
        split.style.setProperty("--whiteboard-height", `${m.available - size}px`);
      } else {
        split.style.setProperty("--workspace-width", `${size}px`);
      }
      divider.setAttribute("aria-orientation", m.axis);
      divider.setAttribute("aria-valuemin", String(m.min));
      divider.setAttribute("aria-valuemax", String(m.max));
      divider.setAttribute("aria-valuenow", String(size));
      divider.setAttribute("aria-valuetext", `${m.horizontal ? "上方" : "左側"} ${size} 像素`);
    };
    const finish = () => {
      if (!drag) return;
      const pointerId = drag.pointerId;
      drag = null;
      split.classList.remove("resizing");
      if (divider.hasPointerCapture(pointerId)) divider.releasePointerCapture(pointerId);
    };
    divider.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || drag) return;
      event.preventDefault();
      divider.focus({ preventScroll: true });
      const m = metrics();
      const bounds = panel.getBoundingClientRect();
      drag = { pointerId: event.pointerId, horizontal: m.horizontal,
        start: m.horizontal ? event.clientY : event.clientX,
        size: m.horizontal ? bounds.height : bounds.width };
      divider.setPointerCapture(event.pointerId);
      split.classList.add("resizing");
    });
    divider.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const position = drag.horizontal ? event.clientY : event.clientX;
      apply(drag.size + position - drag.start, true);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((name) => divider.addEventListener(name, finish));
    divider.addEventListener("dblclick", () => {
      ratios[metrics().axis] = null;
      apply();
    });
    divider.addEventListener("keydown", (event) => {
      const m = metrics();
      const decrease = m.horizontal ? "ArrowUp" : "ArrowLeft";
      const increase = m.horizontal ? "ArrowDown" : "ArrowRight";
      if (![decrease, increase, "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const bounds = panel.getBoundingClientRect();
      const current = m.horizontal ? bounds.height : bounds.width;
      const size = event.key === "Home" ? m.min : event.key === "End" ? m.max
        : current + (event.key === increase ? 1 : -1) * (event.shiftKey ? 50 : 10);
      apply(size, true);
    });
    stacked.addEventListener("change", () => { finish(); apply(); });
    const observer = new ResizeObserver(() => {
      apply();
      this.renderCurrentConnector();
    });
    observer.observe(split);
    observer.observe(this.wbBoard);
  }

  initWhiteboardInteractions() {
    // 1. Tool buttons in floating dock
    const toolBtns = document.querySelectorAll("[data-wb-tool]");
    toolBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setWhiteboardTool(btn.dataset.wbTool);
      });
    });

    document.getElementById("btn-clear-strokes")?.addEventListener("click", () => {
      this.wbStrokes.innerHTML = "";
    });

    document.getElementById("btn-reset-layout")?.addEventListener("click", () => {
      this.resetWhiteboardLayout();
    });

    document.getElementById("wb-zin")?.addEventListener("click", () => this.zoomBy(1.15));
    document.getElementById("wb-zout")?.addEventListener("click", () => this.zoomBy(1 / 1.15));
    document.getElementById("wb-fit")?.addEventListener("click", () => this.fitWhiteboard());
    document.getElementById("wb-zv")?.addEventListener("click", () => {
      this.wbView = { x: 0, y: 0, z: 1 };
      this.applyWhiteboardTransform();
    });

    // 2. Event Delegation for Dragging ANY .wb-item (static or dynamic) by its .grip
    let dragItem = null;
    let dragStart = { mx: 0, my: 0, ix: 0, iy: 0 };

    this.wbWorld.addEventListener("pointerdown", (e) => {
      if (this.wbTool !== "select") return;
      const grip = e.target.closest(".grip");
      if (!grip) return;
      const itemEl = grip.closest(".wb-item");
      if (!itemEl) return;

      e.stopPropagation();
      dragItem = itemEl;
      dragItem.classList.add("dragging");
      dragItem.setPointerCapture(e.pointerId);
      dragStart = {
        mx: e.clientX,
        my: e.clientY,
        ix: parseFloat(itemEl.style.left) || 0,
        iy: parseFloat(itemEl.style.top) || 0
      };
    });

    this.wbWorld.addEventListener("pointermove", (e) => {
      if (!dragItem) return;
      const dx = (e.clientX - dragStart.mx) / this.wbView.z;
      const dy = (e.clientY - dragStart.my) / this.wbView.z;
      const nx = Math.round(dragStart.ix + dx);
      const ny = Math.round(dragStart.iy + dy);
      dragItem.style.left = `${nx}px`;
      dragItem.style.top = `${ny}px`;
      if (dragItem.id) {
        this.customPositions[dragItem.id] = { x: nx, y: ny };
      }
      this.renderCurrentConnector();
    });

    this.wbWorld.addEventListener("pointerup", () => {
      if (dragItem) {
        dragItem.classList.remove("dragging");
        dragItem = null;
      }
    });

    // 3. Canvas Panning ('hand' mode) & Freehand Pen Drawing ('pen' mode)
    let isPanning = false;
    let panStart = { mx: 0, my: 0, vx: 0, vy: 0 };
    let activePolyline = null;
    let penPoints = [];

    this.wbBoard.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".wb-dock, .wb-navi")) return;

      if (this.wbTool === "hand") {
        isPanning = true;
        this.wbBoard.classList.add("panning");
        this.wbBoard.setPointerCapture(e.pointerId);
        panStart = {
          mx: e.clientX,
          my: e.clientY,
          vx: this.wbView.x,
          vy: this.wbView.y
        };
      } else if (this.wbTool === "pen") {
        this.wbBoard.setPointerCapture(e.pointerId);
        const pt = this.clientToWorld(e.clientX, e.clientY);
        penPoints = [`${pt.x},${pt.y}`];
        activePolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        activePolyline.setAttribute("fill", "none");
        activePolyline.setAttribute("stroke", "var(--red)");
        activePolyline.setAttribute("stroke-width", "2.6");
        activePolyline.setAttribute("stroke-linecap", "round");
        activePolyline.setAttribute("stroke-linejoin", "round");
        activePolyline.setAttribute("points", penPoints.join(" "));
        this.wbStrokes.appendChild(activePolyline);
      }
    });

    this.wbBoard.addEventListener("pointermove", (e) => {
      if (isPanning) {
        this.wbView.x = Math.round(panStart.vx + (e.clientX - panStart.mx));
        this.wbView.y = Math.round(panStart.vy + (e.clientY - panStart.my));
        this.applyWhiteboardTransform();
      } else if (activePolyline) {
        const pt = this.clientToWorld(e.clientX, e.clientY);
        penPoints.push(`${pt.x},${pt.y}`);
        activePolyline.setAttribute("points", penPoints.join(" "));
      }
    });

    this.wbBoard.addEventListener("pointerup", () => {
      isPanning = false;
      this.wbBoard.classList.remove("panning");
      activePolyline = null;
      penPoints = [];
    });
  }

  setWhiteboardTool(toolName) {
    this.wbTool = toolName;
    document.querySelectorAll("[data-wb-tool]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.wbTool === toolName);
    });
    this.wbBoard.classList.toggle("hand-mode", toolName === "hand");
    this.wbBoard.classList.toggle("pen-mode", toolName === "pen");
  }

  clientToWorld(cx, cy) {
    const rect = this.wbBoard.getBoundingClientRect();
    return {
      x: Math.round((cx - rect.left - this.wbView.x) / this.wbView.z),
      y: Math.round((cy - rect.top - this.wbView.y) / this.wbView.z)
    };
  }

  zoomBy(factor) {
    const nextZ = Math.max(0.1, Math.min(2.0, this.wbView.z * factor));
    const { width, height } = this.wbBoard.getBoundingClientRect();
    const ratio = nextZ / this.wbView.z;
    this.wbView.x = width / 2 - (width / 2 - this.wbView.x) * ratio;
    this.wbView.y = height / 2 - (height / 2 - this.wbView.y) * ratio;
    this.wbView.z = nextZ;
    this.applyWhiteboardTransform();
  }

  fitWhiteboard(minZoom = 0) {
    const { width, height } = this.wbBoard.getBoundingClientRect();
    const items = Array.from(this.wbWorld.querySelectorAll(".wb-item"))
      .filter((el) => el.offsetParent !== null);
    if (!items.length || width <= 0 || height <= 128) return;
    // Measure in world coordinates, independent of the current pan/zoom.
    const origin = this.wbWorld.getBoundingClientRect();
    const rects = items.map((el) => el.getBoundingClientRect());
    const left = (Math.min(...rects.map((r) => r.left)) - origin.left) / this.wbView.z;
    const top = (Math.min(...rects.map((r) => r.top)) - origin.top) / this.wbView.z;
    const right = (Math.max(...rects.map((r) => r.right)) - origin.left) / this.wbView.z;
    const bottom = (Math.max(...rects.map((r) => r.bottom)) - origin.top) / this.wbView.z;
    // Leave room for the status label above and both toolbars below.
    const z = Math.max(minZoom, Math.min(1, (width - 32) / (right - left), (height - 128) / (bottom - top)));
    this.wbView = {
      x: (width - (right - left) * z) / 2 - left * z,
      y: 52 - top * z,
      z
    };
    this.applyWhiteboardTransform();
  }

  applyWhiteboardTransform() {
    this.wbWorld.style.transform = `translate(${this.wbView.x}px, ${this.wbView.y}px) scale(${this.wbView.z})`;
    if (this.wbZv) {
      this.wbZv.textContent = `${Math.round(this.wbView.z * 100)}%`;
    }
  }

  resetWhiteboardLayout() {
    this.wbView = { x: 0, y: 0, z: 1 };
    this.customPositions = {};
    this.applyWhiteboardTransform();
    Object.entries(this.defaultLayout).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
      }
    });
    this.renderCurrentStep();
  }

  /**
   * 智慧白板防重疊與自動排版演算法 (Smart Whiteboard Non-Overlapping Layout Resolver)
   * 自動確保左側解說/變數欄、右側演算法資料結構、以及底部步驟表格皆無重疊並具備呼吸間距。
   * 若使用者曾手動拖曳過該元件 (this.customPositions[id])，則優先保留使用者手動座標。
   */
  resolveWhiteboardOverlaps() {
    const domItems = Array.from(this.wbWorld.querySelectorAll(".wb-item")).filter((el) => {
      return !el.classList.contains("hidden") && el.offsetParent !== null;
    });
    if (domItems.length === 0) return;

    const items = domItems.map((el) => {
      const r = el.getBoundingClientRect();
      const isCustom = Boolean(this.customPositions[el.id]);
      return {
        el,
        id: el.id,
        isCustom,
        left: parseInt(el.style.left) || 24,
        top: parseInt(el.style.top) || 52,
        w: Math.ceil(r.width / this.wbView.z),
        h: Math.ceil(r.height / this.wbView.z)
      };
    });

    const note = items.find((it) => it.id === "wb-item-note");
    const steps = items.find((it) => it.id === "wb-item-steps");
    const middle = items.filter((it) => it.id !== "wb-item-note" && it.id !== "wb-item-steps");

    // 1. 左欄元件縱向排列 (left < 300px)
    let leftY = note ? note.top + note.h + 16 : 220;
    middle
      .filter((it) => it.left < 300)
      .sort((a, b) => a.top - b.top)
      .forEach((it) => {
        if (!it.isCustom && it.top < leftY) {
          it.top = leftY;
          it.el.style.top = `${it.top}px`;
        }
        leftY = Math.max(leftY, it.top + it.h + 16);
      });

    // 2. 右欄元件防重疊 (left >= 300px)
    const rightItems = middle.filter((it) => it.left >= 300);

    // 確保右欄元件不侵犯左欄安全邊界 (335px)
    rightItems.forEach((r) => {
      if (!r.isCustom && r.left < 335) {
        r.left = 340;
        r.el.style.left = "340px";
      }
    });

    // 多輪邊界框衝突推移 (Multi-pass Collision Resolver)
    for (let pass = 0; pass < 6; pass++) {
      let shifted = false;
      for (let i = 0; i < rightItems.length; i++) {
        for (let j = 0; j < rightItems.length; j++) {
          if (i === j) continue;
          const a = rightItems[i];
          const b = rightItems[j];

          // 水平交集與垂直交集
          const ox = Math.max(0, Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top));

          if (ox > 4 && oy > 4) {
            if (b.isCustom) continue; // 使用者手動設定的位置不自動推移
            if (Math.abs(a.top - b.top) <= 45) {
              // 水平並排衝突 -> 往右推移
              if (a.left <= b.left) {
                b.left = a.left + a.w + 18;
                b.el.style.left = `${b.left}px`;
                shifted = true;
              }
            } else {
              // 垂直堆疊衝突 -> 往下推移
              if (a.top < b.top) {
                b.top = a.top + a.h + 18;
                b.el.style.top = `${b.top}px`;
                shifted = true;
              }
            }
          }
        }
      }
      if (!shifted) break;
    }

    // 3. 步驟紀錄表格 (wb-item-steps) 永遠定位在所有上方白板元件的最低邊緣之下
    if (steps && !steps.isCustom) {
      let maxBottom = 0;
      if (note) maxBottom = Math.max(maxBottom, note.top + note.h);
      middle.forEach((it) => {
        maxBottom = Math.max(maxBottom, it.top + it.h);
      });
      const desiredTop = Math.max(460, maxBottom + 26);
      if (steps.top < desiredTop) {
        steps.top = desiredTop;
        steps.el.style.top = `${desiredTop}px`;
      }
    }
  }

  // ==================== Playback Control ====================

  selectWorkspaceTab(name) {
    this.workspaceTab = name;
    this.workspaceTabs.forEach((tab) => {
      const selected = tab.id === `tab-${name}`;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
    });
    // Reveal the current line after opening code, without reloading the trace.
    if (name === "code") {
      const row = this.codeContainer.querySelector(".active-line");
      if (row) this.revealRow(row, this.codeContainer);
    }
  }

  renderProblemStatement() {
    const problem = this.problem;
    const statement = problem.statement || window.PROBLEM_STATEMENTS?.[problem.slug];
    const item = window.GRIND75_CATALOG?.find((entry) => entry.slug === problem.slug);
    const article = this.statementArticle;
    article.replaceChildren();
    // All authored statement fields are plain text; never interpret them as HTML.
    const text = (parent, tag, value, className) => {
      const el = document.createElement(tag);
      if (className) el.className = className;
      el.textContent = value;
      parent.appendChild(el);
      return el;
    };
    const heading = document.createElement("header");
    heading.className = "statement-heading";
    article.appendChild(heading);
    text(heading, "div", `GRIND #${item?.id || problem.id} · LC #${problem.leetcodeId}`, "statement-kicker mono");
    text(heading, "h3", item ? `${item.title} · ${item.titleZh}` : problem.title);
    const source = text(heading, "a", "LeetCode 原題與評測限制 ↗", "statement-source");
    source.href = `https://leetcode.com/problems/${problem.slug}/`;
    source.target = "_blank";
    source.rel = "noopener noreferrer";

    if (statement) {
      statement.paragraphs.forEach((paragraph) => text(article, "p", paragraph));
      text(article, "h4", "輸入與輸出");
      const io = document.createElement("dl");
      io.className = "statement-io";
      article.appendChild(io);
      text(io, "dt", "輸入");
      text(io, "dd", statement.input);
      text(io, "dt", "輸出");
      text(io, "dd", statement.output);
      text(article, "h4", "範例");
      statement.examples.forEach((example, index) => {
        const block = document.createElement("section");
        block.className = "statement-example";
        article.appendChild(block);
        text(block, "div", `範例 ${index + 1}`, "statement-caption");
        text(block, "pre", `輸入：${example.input}\n輸出：${example.output}`);
        text(block, "p", example.explanation);
      });
      text(article, "h4", "輸入條件與邊界");
      const rules = document.createElement("ul");
      rules.className = "statement-rules";
      statement.rules.forEach((rule) => text(rules, "li", rule));
      article.appendChild(rules);
    } else {
      text(article, "p", problem.description);
      text(article, "p", "完整題意請參閱上方原題連結。");
    }
    const hint = document.createElement("details");
    hint.className = "statement-hint";
    text(hint, "summary", "展開本題解法提示");
    text(hint, "p", problem.description);
    text(hint, "p", problem.complexity || "");
    article.appendChild(hint);
    article.parentElement.scrollTop = 0;
    this.renderEnglishStatement(item);
  }

  renderEnglishStatement(item) {
    const problem = this.problem;
    const statement = window.PROBLEM_STATEMENTS_EN?.[problem.slug];
    const article = this.englishStatementArticle;
    article.replaceChildren();
    const heading = document.createElement("header");
    heading.className = "statement-heading";
    const kicker = document.createElement("div");
    kicker.className = "statement-kicker mono";
    kicker.textContent = `GRIND #${item?.id || problem.id} · LC #${problem.leetcodeId}`;
    const title = document.createElement("h3");
    title.textContent = statement?.title || item?.title || problem.title;
    const source = document.createElement("a");
    source.className = "statement-source";
    source.href = `https://leetcode.com/problems/${problem.slug}/`;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Read on LeetCode ↗";
    heading.append(kicker, title, source);
    article.appendChild(heading);

    if (statement) {
      // Rebuild inert snapshot nodes with a tag/attribute allowlist, never innerHTML.
      const tags = new Set(["p", "strong", "em", "code", "pre", "ul", "ol", "li", "br",
        "sup", "sub", "img", "a", "span", "div", "u", "b", "i",
        "table", "thead", "tbody", "tr", "th", "td"]);
      const append = (parent, nodes) => {
        for (const node of nodes) {
          if (typeof node === "string") {
            parent.appendChild(document.createTextNode(node));
            continue;
          }
          if (!tags.has(node.tag)) continue;
          const el = document.createElement(node.tag);
          if (node.tag === "img") {
            if (!/^assets\/problem-statements\/[a-f0-9]+\.(png|jpe?g|gif|webp)$/.test(node.src)) continue;
            el.src = node.src;
            el.alt = node.alt || "Example illustration";
            el.loading = "lazy";
            if (Number.isInteger(node.width) && node.width > 0) el.width = node.width;
          }
          if (node.tag === "a" && /^https?:\/\//.test(node.href)) {
            el.href = node.href;
            el.target = "_blank";
            el.rel = "noopener noreferrer";
          }
          append(el, node.children || []);
          parent.appendChild(el);
        }
      };
      append(article, statement.content);
      const credit = document.createElement("footer");
      credit.className = "statement-attribution";
      const mirror = document.createElement("a");
      mirror.href = statement.mirrorUrl;
      mirror.target = "_blank";
      mirror.rel = "noopener noreferrer";
      mirror.textContent = "doocs/leetcode";
      const license = document.createElement("a");
      license.href = "https://creativecommons.org/licenses/by-sa/4.0/";
      license.target = "_blank";
      license.rel = "noopener noreferrer";
      license.textContent = "CC BY-SA 4.0";
      credit.append("LeetCode statement · Mirrored by ", mirror, " · ", license);
      article.appendChild(credit);
    } else {
      const message = document.createElement("p");
      message.textContent = "The English statement is not available locally. Please use the LeetCode link above.";
      article.appendChild(message);
    }
    article.parentElement.scrollTop = 0;
  }

  loadProblem(problem, ...args) {
    this.pause();
    const problemChanged = this.problem?.slug !== problem.slug;
    this.problem = problem;
    if (problemChanged) this.renderProblemStatement();
    this.customPositions = {};
    this.wbView = { x: 0, y: 0, z: 1 };
    this.applyWhiteboardTransform();
    Object.entries(this.defaultLayout).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      if (el) {
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;
      }
    });
    this.initialViewportPending = true;
    this.steps = problem.generateTrace(...args);
    this.currentStepIndex = 0;

    this.stepSlider.max = Math.max(0, this.steps.length - 1);
    this.stepSlider.value = 0;

    const compBadge = document.getElementById("vis-complexity-badge");
    if (compBadge) {
      compBadge.textContent = problem.complexity || "Time O(N) · Space O(N)";
    }

    this.renderCodeStatic();
    this.renderExecutionLogStatic();
    this.renderCurrentStep();
  }

  play() {
    if (this.steps.length === 0) return;
    if (this.currentStepIndex >= this.steps.length - 1) {
      this.currentStepIndex = 0;
      this.renderCurrentStep();
    }
    this.isPlaying = true;
    this.btnPlay.classList.add("playing");
    this.playBtnLabel.textContent = "⏸ 暫停執行";
    this.restartTimer();
  }

  pause() {
    this.isPlaying = false;
    this.btnPlay.classList.remove("playing");
    this.playBtnLabel.textContent = "▶ 自動執行";
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  restartTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
        this.renderCurrentStep();
      } else {
        this.pause();
      }
    }, this.speedMs);
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.renderCurrentStep();
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderCurrentStep();
    }
  }

  goToStep(index) {
    if (index < 0 || index >= this.steps.length) return;
    this.currentStepIndex = index;
    this.renderCurrentStep();
  }

  // ==================== Rendering ====================

  renderCodeStatic() {
    this.codeContainer.innerHTML = "";
    this.problem.cppLines.forEach((lineObj) => {
      const row = document.createElement("div");
      row.className = "code-line";
      row.dataset.line = lineObj.line;
      row.innerHTML = `
        <div class="code-line-gutter">
          <span class="exec-arrow">➜</span>
          <span>${lineObj.line}</span>
        </div>
        <div class="code-line-text">${lineObj.code}</div>
        <span class="inline-debug-badge hidden" id="badge-line-${lineObj.line}"></span>
      `;
      this.codeContainer.appendChild(row);
    });
  }

  renderExecutionLogStatic() {
    this.executionLogList.innerHTML = "";
    if (!this.steps.length) return;

    // Collect up to 4 dynamic variable keys from step.vars
    const sampleVars = this.steps[0].vars || {};
    const varKeys = Object.keys(sampleVars).slice(0, 4);
    this.traceVarKeys = varKeys;

    // tag、inlineBadge 與 vars 為純文字（可含 <、-> 等算式），一律以 textContent 寫入。
    const cell = (tag, value) => {
      const el = document.createElement(tag);
      el.textContent = value;
      return el;
    };
    if (this.stepsHeadRow) {
      const summaryHead = cell("th", "動作摘要");
      summaryHead.style.textAlign = "left";
      this.stepsHeadRow.replaceChildren(cell("th", "步驟"), cell("th", "C++ 行號"),
        ...varKeys.map((k) => cell("th", k)), summaryHead);
    }

    this.steps.forEach((st, idx) => {
      const tr = document.createElement("tr");
      tr.dataset.step = idx;
      const summary = cell("td", `${st.tag}${st.inlineBadge ? `：${st.inlineBadge}` : ""}`);
      summary.style.textAlign = "left";
      summary.style.fontFamily = "var(--font-sans)";
      tr.append(cell("td", `#${idx + 1}`), cell("td", `Line ${st.line}`),
        ...varKeys.map((k) => cell("td", st.vars && st.vars[k] !== undefined ? st.vars[k] : "-")), summary);
      tr.addEventListener("click", () => {
        this.pause();
        this.goToStep(idx);
      });
      this.executionLogList.appendChild(tr);
    });
  }

  renderCurrentStep() {
    const step = this.steps[this.currentStepIndex];
    const prevStep = this.currentStepIndex > 0 ? this.steps[this.currentStepIndex - 1] : null;
    if (!step) return;

    // 1. Update Transport Deck Readout
    const curPad = String(this.currentStepIndex + 1).padStart(2, "0");
    const totPad = String(this.steps.length).padStart(2, "0");
    this.stepCounter.textContent = `STEP ${curPad} / ${totPad}`;
    this.stepSlider.value = this.currentStepIndex;
    this.btnPrev.disabled = this.currentStepIndex === 0;
    this.btnReset.disabled = this.currentStepIndex === 0;
    this.btnNext.disabled = this.currentStepIndex === this.steps.length - 1;

    // 2. Highlight Active C++ Line (反白顯示正在執行的C++行)
    this.activeLineBadge.textContent = `LINE ${String(step.line).padStart(2, "0")}`;
    const allLines = this.codeContainer.querySelectorAll(".code-line");
    allLines.forEach((row) => {
      const lineNum = Number(row.dataset.line);
      const badge = row.querySelector(".inline-debug-badge");
      if (lineNum === step.line) {
        row.classList.add("active-line");
        this.revealRow(row, this.codeContainer);
        if (step.inlineBadge) {
          badge.textContent = step.inlineBadge;
          badge.classList.remove("hidden");
        } else {
          badge.classList.add("hidden");
        }
      } else {
        row.classList.remove("active-line");
        badge.classList.add("hidden");
      }
    });

    // 3. Update Local Variables Watch Grid
    this.variableWatchGrid.innerHTML = "";
    Object.entries(step.vars || {}).forEach(([k, v]) => {
      const changed = prevStep && prevStep.vars && prevStep.vars[k] !== v;
      const div = document.createElement("div");
      div.className = `watch-item ${changed ? "changed" : ""}`;
      const name = document.createElement("div");
      name.className = "watch-name";
      name.textContent = k;
      const val = document.createElement("div");
      val.className = "watch-val";
      val.textContent = v;
      div.append(name, val);
      this.variableWatchGrid.appendChild(div);
    });

    // 4. Whiteboard Component 1: Sticky Note (.note)
    this.stepActionTag.textContent = `Step ${this.currentStepIndex + 1} · ${step.tag}`;
    this.stepActionTag.className = `note-tag ${step.tagType && step.tagType !== "default" ? step.tagType : ""}`;
    this.stepExplanationText.textContent = step.explanation;

    // 5. Render Either Declarative Multi-Board State OR Legacy Two-Sum State
    const st = step.state || {};
    if (Array.isArray(st.boards)) {
      this.legacyItemArray.classList.add("hidden");
      this.legacyItemVars.classList.add("hidden");
      this.legacyItemDict.classList.add("hidden");
      this.dynamicItemsContainer.classList.remove("hidden");
      this.renderDeclarativeBoards(st.boards);
    } else {
      this.legacyItemArray.classList.remove("hidden");
      this.legacyItemVars.classList.remove("hidden");
      this.legacyItemDict.classList.remove("hidden");
      this.dynamicItemsContainer.classList.add("hidden");
      this.renderWhiteboardArray(st);
      this.renderWhiteboardVars(st, step.vars || {});
      this.renderWhiteboardDict(st);
    }

    // 6. Highlight Active Row in Step Trace Table (table.steps)
    const rows = this.executionLogList.querySelectorAll("tr");
    rows.forEach((tr, idx) => {
      if (idx === this.currentStepIndex) {
        tr.classList.add("active-step-row");
        this.revealRow(tr, tr.closest(".wb-steps-wrap"));
      } else {
        tr.classList.remove("active-step-row");
      }
    });

    // 7. Auto-Resolve Whiteboard Item Overlaps
    this.resolveWhiteboardOverlaps();

    // 8. Render Whiteboard SVG Connector Arrows
    requestAnimationFrame(() => {
      if (this.initialViewportPending && this.wbBoard.clientWidth && this.wbBoard.clientHeight) {
        this.fitWhiteboard(0.75);
        this.initialViewportPending = false;
      }
      this.renderCurrentConnector();
    });
  }

  // ==================== Declarative Multi-Component Renderer ====================

  revealRow(row, container) {
    if (!container || !container.offsetHeight) return;
    const bounds = container.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    const scale = bounds.height / container.offsetHeight;
    if (!scale) return;
    const header = container.querySelector("thead");
    const top = bounds.top + (header ? header.getBoundingClientRect().height : 0);
    const delta = rect.top < top ? rect.top - top
      : rect.bottom > bounds.bottom ? rect.bottom - bounds.bottom : 0;
    if (delta) container.scrollBy({ top: delta / scale, behavior: "smooth" });
  }

  renderDeclarativeBoards(boards) {
    this.dynamicItemsContainer.innerHTML = "";

    boards.forEach((b, bIdx) => {
      const domId = `wb-dyn-${b.id || bIdx}`;
      const savedPos = this.customPositions[domId];
      const x = savedPos ? savedPos.x : (b.x !== undefined ? b.x : 325);
      const y = savedPos ? savedPos.y : (b.y !== undefined ? b.y : 52 + bIdx * 155);

      const wrapper = document.createElement("div");
      wrapper.className = "wb-item";
      wrapper.id = domId;
      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;

      let contentHtml = "";
      switch (b.type) {
        case "array":
          contentHtml = this.buildBoardArray(b);
          break;
        case "vars":
          contentHtml = this.buildBoardVars(b);
          break;
        case "dict":
          contentHtml = this.buildBoardDict(b);
          break;
        case "stack":
          contentHtml = this.buildBoardStack(b);
          break;
        case "queue":
          contentHtml = this.buildBoardQueue(b);
          break;
        case "set":
          contentHtml = this.buildBoardSet(b);
          break;
        case "grid":
          contentHtml = this.buildBoardGrid(b);
          break;
        case "graph":
        case "tree":
        case "list":
          contentHtml = this.buildBoardGraph(b);
          break;
      }

      wrapper.innerHTML = `
        <div class="grip">⠿ <span class="nm">${b.name || b.id}</span><span>${b.typeLabel || ""}</span></div>
        ${contentHtml}
      `;
      this.dynamicItemsContainer.appendChild(wrapper);
    });
  }

  buildBoardArray(b) {
    const bid = b.id || "arr";
    const values = b.values || [];
    const hl = b.hl || [];
    const match = b.match || [];
    const done = b.done || [];
    const warn = b.warn || [];
    const pointers = b.pointers || [];

    if (values.length === 0) {
      return `<div class="wb-empty">（空陣列 []）</div>`;
    }

    const cellsHtml = values
      .map((val, idx) => {
        let cls = "cell";
        if (match.includes(idx)) cls += " match";
        else if (warn.includes(idx)) cls += " warn";
        else if (hl.includes(idx)) cls += " hl";
        else if (done.includes(idx)) cls += " done";

        const cellPtrs = pointers.filter((p) => p.idx === idx);
        const ptrHtml = cellPtrs
          .map((p) => {
            const pCls =
              p.color === "green"
                ? "match-ptr"
                : p.color === "red"
                ? "red-ptr"
                : p.color === "purple"
                ? "purple-ptr"
                : "";
            return `<div class="ptr up ${pCls}"><span class="ar">↑</span><span class="pn">${p.label}</span></div>`;
          })
          .join("");

        const idxText = b.indexLabels && b.indexLabels[idx] !== undefined ? b.indexLabels[idx] : idx;

        return `
          <div class="cw" id="wb-cw-${bid}-${idx}">
            <span class="ix">${idxText}</span>
            <div class="${cls}" id="wb-cell-${bid}-${idx}">${val}</div>
            <div class="ptr-slot">${ptrHtml}</div>
          </div>
        `;
      })
      .join("");

    return `<div class="wb-array-stage"><div class="cells">${cellsHtml}</div></div>`;
  }

  buildBoardVars(b) {
    const items = b.items || [];
    const isLeftCol = (b.x !== undefined ? b.x : 24) < 300;

    let rowsHtml = "";
    let currentPair = [];

    const flushPair = () => {
      if (currentPair.length === 0) return;
      if (currentPair.length === 1) {
        rowsHtml += `<div class="varbox-row single">${currentPair[0]}</div>`;
      } else {
        rowsHtml += `<div class="varbox-row pair">${currentPair.join("")}</div>`;
      }
      currentPair = [];
    };

    items.forEach((it) => {
      const cls =
        it.status === "match"
          ? "match-box"
          : it.status === "warn"
          ? "warn-box"
          : it.status === "hl"
          ? "hl-box"
          : "";
      const idAttr = `id="wb-var-${it.id || it.name}"`;
      const valStr = String(it.val !== undefined ? it.val : "-");
      const nameStr = String(it.name || "");
      const isLong = nameStr.length + valStr.length > 13 || valStr.length > 9 || valStr.includes("=") || valStr.includes("- (");

      const boxHtml = `
        <div class="varbox ${cls} ${isLong ? "long-box" : "short-box"}" ${idAttr}>
          <span class="vn">${nameStr}</span>=
          <span class="vv">${valStr}</span>
        </div>
      `;

      if (isLong) {
        flushPair();
        rowsHtml += `<div class="varbox-row single">${boxHtml}</div>`;
      } else {
        currentPair.push(boxHtml);
        if (currentPair.length === 2) {
          flushPair();
        }
      }
    });
    flushPair();

    return `<div class="wb-vars-stage ${isLeftCol ? "wb-vars-col" : ""}">${rowsHtml}</div>`;
  }

  buildBoardDict(b) {
    const headers = b.headers || ["key", "value", "狀態"];
    const rows = b.rows || [];
    const rowsHtml = rows
      .map((r) => {
        const cls =
          r.status === "hit" || r.status === "match"
            ? "kv-hit"
            : r.status === "inserted" || r.status === "hl"
            ? "kv-inserted"
            : "";
        const rid = r.id !== undefined ? r.id : r.key;
        return `
          <tr class="${cls}" id="wb-dict-row-${rid}">
            <td>${r.key}</td>
            <td>${r.val}</td>
            ${headers.length > 2 ? `<td style="font-family: var(--font-sans); font-size: 11.5px;">${r.note || ""}</td>` : ""}
          </tr>
        `;
      })
      .join("");

    const emptyRow =
      rows.length === 0
        ? `<tr><td colspan="${headers.length}" style="color: var(--ink-3); font-family: var(--font-sans); font-size: 12px;">（空的雜湊表 {}）</td></tr>`
        : "";

    const slotHtml = b.slot
      ? `<tr><td class="slot">${b.slot.key || "＋ key"}</td><td class="slot">${b.slot.val || "value"}</td>${
          headers.length > 2 ? `<td class="slot">${b.slot.note || ""}</td>` : ""
        }</tr>`
      : "";

    return `
      <table class="kv">
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
          ${emptyRow}
          ${slotHtml}
        </tbody>
      </table>
    `;
  }

  buildBoardStack(b) {
    const bid = b.id || "st";
    const items = b.items || [];
    const cellsHtml = items
      .map((it, idx) => {
        const val = typeof it === "object" ? it.val : it;
        const st = typeof it === "object" ? it.status : "";
        let cls = "cell";
        if (st === "match") cls += " match";
        else if (st === "warn") cls += " warn";
        else if (st === "hl") cls += " hl";
        else if (st === "done") cls += " done";
        return `<div class="${cls}" id="wb-stack-${bid}-${idx}">${val}</div>`;
      })
      .join("");

    return `
      <div class="wb-stack-wrap">
        <div class="toplab">${items.length ? (b.topText || "↓ top (頂端)") : ""}</div>
        <div class="stackbox">
          ${cellsHtml || `<span class="wb-empty">（空堆疊）</span>`}
        </div>
      </div>
    `;
  }

  buildBoardQueue(b) {
    const bid = b.id || "q";
    const items = b.items || [];
    const cellsHtml = items
      .map((it, idx) => {
        const val = typeof it === "object" ? it.val : it;
        const st = typeof it === "object" ? it.status : "";
        let cls = "cell";
        if (st === "match") cls += " match";
        else if (st === "warn") cls += " warn";
        else if (st === "hl") cls += " hl";
        else if (st === "done") cls += " done";
        return `<div class="${cls}" id="wb-queue-${bid}-${idx}">${val}</div>`;
      })
      .join("");

    return `
      <div class="wb-queue-wrap">
        <div class="qlab">
          <span>${b.leftLabel || "front ←"}</span>
          <span>${b.rightLabel || "← back"}</span>
        </div>
        <div class="queuebox">
          ${cellsHtml || `<span class="wb-empty">（空佇列）</span>`}
        </div>
      </div>
    `;
  }

  buildBoardSet(b) {
    const bid = b.id || "set";
    const items = b.items || [];
    const chipsHtml = items
      .map((it, idx) => {
        const val = typeof it === "object" ? it.val : it;
        const st = typeof it === "object" ? it.status : "";
        return `<span class="chip ${st || ""}" id="wb-chip-${bid}-${idx}">${val}</span>`;
      })
      .join("");

    return `<div class="chips">${chipsHtml || `<span class="wb-empty">（空集合 {}）</span>`}</div>`;
  }

  buildBoardGrid(b) {
    const bid = b.id || "grid";
    const cells = b.cells || [];
    const hl = b.hl || [];
    const match = b.match || [];
    const done = b.done || [];
    const warn = b.warn || [];
    const cols = cells[0] ? cells[0].length : 0;

    const colHeaderHtml =
      cols > 0
        ? `<tr><th></th>${Array.from({ length: cols }, (_, c) => `<th>${b.colLabels ? b.colLabels[c] : c}</th>`).join("")}</tr>`
        : "";

    const rowsHtml = cells
      .map((row, r) => {
        const rLab = b.rowLabels ? b.rowLabels[r] : r;
        const tds = row
          .map((val, c) => {
            const key = `${r},${c}`;
            let cls = "";
            if (match.includes(key)) cls = "match";
            else if (warn.includes(key)) cls = "warn";
            else if (hl.includes(key)) cls = "hl";
            else if (done.includes(key)) cls = "done";
            return `<td class="${cls}" id="wb-grid-${bid}-${r}-${c}">${val}</td>`;
          })
          .join("");
        return `<tr><th>${rLab}</th>${tds}</tr>`;
      })
      .join("");

    return `<table class="grid">${colHeaderHtml}${rowsHtml}</table>`;
  }

  buildBoardGraph(b) {
    const bid = b.id || "graph";
    const shapeCls = b.shape === "list" || b.type === "list" ? "list" : b.shape === "graph" || b.type === "graph" ? "graph" : "";
    const nodes = b.nodes || [];
    const edges = b.edges || [];

    // 自動依據所有節點幾何範圍外擴計算足夠的畫布尺寸，確保同一 level 節點充裕展開不裁切
    let maxNodeX = 0;
    let maxNodeY = 0;
    nodes.forEach((n) => {
      if (n.x > maxNodeX) maxNodeX = n.x;
      if (n.y > maxNodeY) maxNodeY = n.y;
    });

    const isTree = b.type === "tree";
    const defaultW = isTree ? 620 : 440;
    const defaultH = isTree ? 270 : 210;
    const w = Math.max(b.width || defaultW, maxNodeX ? maxNodeX + 48 : defaultW);
    const h = Math.max(b.height || defaultH, maxNodeY ? maxNodeY + 54 : defaultH);

    const nodeMap = {};
    nodes.forEach((n) => {
      nodeMap[n.id] = n;
    });

    // Trim edges cleanly at node boundary radius (24px) so arrows never cross node centers
    const edgesSvg = edges
      .map((e) => {
        const na = nodeMap[e.from];
        const nb = nodeMap[e.to];
        if (!na || !nb) return "";
        const dx = nb.x - na.x;
        const dy = nb.y - na.y;
        const dist = Math.hypot(dx, dy) || 1;
        const rA = shapeCls === "list" ? 28 : 24;
        const rB = shapeCls === "list" ? 30 : 25;
        const x1 = Math.round(na.x + (dx / dist) * rA);
        const y1 = Math.round(na.y + (dy / dist) * rA);
        const x2 = Math.round(nb.x - (dx / dist) * rB);
        const y2 = Math.round(nb.y - (dy / dist) * rB);

        const stroke =
          e.status === "match"
            ? "var(--green)"
            : e.status === "hl"
            ? "var(--marker)"
            : "var(--ink-2)";
        const marker =
          e.dir === false
            ? ""
            : e.status === "match"
            ? 'marker-end="url(#wb-arrow-green)"'
            : e.status === "hl"
            ? 'marker-end="url(#wb-arrow-blue)"'
            : 'marker-end="url(#wb-arrow-blue)"';
        const sw = e.status ? "2.6" : "2";
        const mx = Math.round((x1 + x2) / 2);
        const my = Math.round((y1 + y2) / 2 - 5);

        return `
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" ${marker} />
          ${e.label ? `<text x="${mx}" y="${my}" text-anchor="middle" fill="${stroke}" font-family="var(--font-mono)" font-size="10.5" font-weight="700">${e.label}</text>` : ""}
        `;
      })
      .join("");

    const nodesHtml = nodes
      .map((n) => {
        const baseShape = shapeCls || "circle";
        const st = n.status || "";
        return `
          <div class="wb-node-wrap" style="left: ${n.x}px; top: ${n.y}px;">
            ${n.ptr ? `<div class="node-ptr">↓ ${n.ptr}</div>` : ""}
            <div class="node ${baseShape} ${st}" id="wb-node-${bid}-${n.id}">${n.val}</div>
            ${n.sub ? `<div class="node-sub">${n.sub}</div>` : ""}
          </div>
        `;
      })
      .join("");

    return `
      <div class="wb-graph-stage" style="width: ${w}px; height: ${h}px;">
        <svg class="wb-graph-svg" viewBox="0 0 ${w} ${h}">
          ${edgesSvg}
        </svg>
        ${nodesHtml}
      </div>
    `;
  }

  // ==================== Legacy #1 Two-Sum Renderer ====================

  renderWhiteboardArray(state) {
    const cellsHtml = (state.nums || [])
      .map((val, idx) => {
        const isCurrent = idx === state.currentIndex;
        const isMatched = (state.matchedIndices || []).includes(idx);
        const isVisited = (state.visitedIndices || []).includes(idx) && !isCurrent && !isMatched;

        let cellCls = "cell";
        if (isMatched) cellCls += " match";
        else if (isCurrent) cellCls += " hl";
        else if (isVisited) cellCls += " done";

        let ptrHtml = "";
        if (isMatched && idx !== state.currentIndex) {
          ptrHtml = `<div class="ptr up match-ptr"><span class="ar">↑</span><span class="pn">seen[${val}]=${idx}</span></div>`;
        } else if (isMatched && idx === state.currentIndex) {
          ptrHtml = `<div class="ptr up match-ptr"><span class="ar">↑</span><span class="pn">i = ${idx} (配對!)</span></div>`;
        } else if (isCurrent) {
          ptrHtml = `<div class="ptr up"><span class="ar">↑</span><span class="pn">i = ${idx}</span></div>`;
        }

        return `
          <div class="cw" data-cell-idx="${idx}">
            <span class="ix">${idx}</span>
            <div class="${cellCls}" id="wb-array-cell-${idx}">${val}</div>
            <div class="ptr-slot">${ptrHtml}</div>
          </div>
        `;
      })
      .join("");

    this.arrayContainer.innerHTML = `<div class="cells">${cellsHtml}</div>`;
  }

  renderWhiteboardVars(state, vars) {
    const curVal = state.currentIndex >= 0 ? state.nums[state.currentIndex] : "-";
    const compVal = state.complement !== null ? state.complement : "-";
    const hasComp = state.complement !== null && state.complement !== undefined;
    const hasReturn = vars.return && vars.return !== "-";

    this.formulaContainer.innerHTML = `
      <div class="varbox-row pair">
        <div class="varbox short-box">
          <span class="vn">target</span>=
          <span class="vv">${state.target}</span>
        </div>
        <div class="varbox short-box ${state.currentIndex >= 0 ? "hl-box" : ""}">
          <span class="vn">nums[i]</span>=
          <span class="vv">${curVal}</span>
        </div>
      </div>
      <div class="varbox-row single">
        <div class="varbox long-box ${hasComp ? "hl-box" : ""}" id="wb-complement-box">
          <span class="vn">complement</span>=
          <span class="vv">${hasComp ? `${state.target} - (${curVal}) = ${compVal}` : "-"}</span>
        </div>
      </div>
      <div class="varbox-row single">
        <div class="varbox long-box ${hasReturn ? "match-box" : ""}">
          <span class="vn">return</span>=
          <span class="vv">${vars.return}</span>
        </div>
      </div>
    `;
  }

  renderWhiteboardDict(state) {
    const entries = state.seenEntries || [];
    const rowsHtml = entries
      .map((entry) => {
        const isHit = state.hitKey !== null && entry.key === state.hitKey;
        const isInserted = state.justInsertedKey !== null && entry.key === state.justInsertedKey;
        const rowCls = isHit ? "kv-hit" : isInserted ? "kv-inserted" : "";
        const statusText = isHit
          ? "✓ 命中 seen[complement]"
          : isInserted
          ? "＋ 本步新增"
          : "已記錄";

        return `
          <tr class="${rowCls}" id="wb-dict-row-${entry.key}">
            <td>${entry.key}</td>
            <td>${entry.val}</td>
            <td style="font-family: var(--font-sans); font-size: 11.5px;">${statusText}</td>
          </tr>
        `;
      })
      .join("");

    const emptyRow =
      entries.length === 0
        ? `<tr><td colspan="3" style="color: var(--ink-3); font-family: var(--font-sans); font-size: 12px;">（空的 unordered_map）</td></tr>`
        : "";

    const pendingSlot =
      state.lookupKey !== null && state.lookupKey !== undefined && state.hitKey === null
        ? `<tr><td class="slot">? 查找 ${state.lookupKey}</td><td class="slot">不存在 (0)</td><td class="slot">未命中</td></tr>`
        : `<tr><td class="slot">＋ key</td><td class="slot">value</td><td class="slot">待寫入</td></tr>`;

    this.hashmapContainer.innerHTML = `
      <table class="kv" id="wb-dict-table">
        <thead>
          <tr>
            <th>key (數值)</th>
            <th>value (索引)</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          ${emptyRow}
          ${pendingSlot}
        </tbody>
      </table>
    `;
  }

  // ==================== Edge-Anchored SVG Connector Router ====================

  /**
   * 在白板上繪製動態 SVG 連線箭頭（從來源外緣出發，終止於目標物件的外側邊緣，絕不穿過物件中間造成遮擋）
   */
  renderCurrentConnector() {
    if (!this.wbConnectors) return;
    this.wbConnectors.innerHTML = "";

    const step = this.steps[this.currentStepIndex];
    if (!step || !step.state) return;
    const state = step.state;

    const connectorSpecs = [];

    // 1. Declarative connectors array
    if (Array.isArray(state.connectors)) {
      state.connectors.forEach((c) => {
        const fromEl = document.getElementById(c.from);
        const toEl = document.getElementById(c.to);
        if (fromEl && toEl) {
          const sourceEl = fromEl.closest(".cw") || fromEl;
          const colorMap = {
            blue: { stroke: "var(--marker)", marker: "wb-arrow-blue" },
            green: { stroke: "var(--green)", marker: "wb-arrow-green" },
            purple: { stroke: "var(--purple)", marker: "wb-arrow-purple" },
            red: { stroke: "var(--red)", marker: "wb-arrow-red" }
          };
          const theme = colorMap[c.color] || colorMap.blue;
          connectorSpecs.push({
            sourceEl,
            targetEl: toEl,
            strokeColor: theme.stroke,
            markerId: theme.marker,
            labelText: c.label || ""
          });
        }
      });
    } else if (state.currentIndex !== undefined && state.currentIndex >= 0) {
      // 2. Legacy Two-Sum connector
      const cellEl = document.getElementById(`wb-array-cell-${state.currentIndex}`);
      if (cellEl) {
        const sourceEl = cellEl.closest(".cw") || cellEl;
        let targetEl = null;
        let strokeColor = "var(--marker)";
        let markerId = "wb-arrow-blue";
        let labelText = "";

        if (state.hitKey !== null) {
          targetEl = document.getElementById(`wb-dict-row-${state.hitKey}`);
          strokeColor = "var(--green)";
          markerId = "wb-arrow-green";
          labelText = `命中 seen[${state.hitKey}]`;
        } else if (state.justInsertedKey !== null) {
          targetEl = document.getElementById(`wb-dict-row-${state.justInsertedKey}`);
          strokeColor = "var(--purple)";
          markerId = "wb-arrow-purple";
          labelText = `寫入 seen[${state.justInsertedKey}] = ${state.currentIndex}`;
        } else if (state.complement !== null) {
          targetEl = document.getElementById("wb-complement-box");
          strokeColor = "var(--marker)";
          markerId = "wb-arrow-blue";
          labelText = `計算補數 ${state.complement}`;
        }

        if (targetEl) {
          connectorSpecs.push({ sourceEl, targetEl, strokeColor, markerId, labelText });
        }
      }
    }

    if (connectorSpecs.length === 0) return;

    const worldRect = this.wbWorld.getBoundingClientRect();
    const z = this.wbView.z || 1;
    const toBox = (el) => {
      const r = el.getBoundingClientRect();
      const left = (r.left - worldRect.left) / z;
      const top = (r.top - worldRect.top) / z;
      const width = r.width / z;
      const height = r.height / z;
      return {
        left,
        top,
        right: left + width,
        bottom: top + height,
        cx: left + width / 2,
        cy: top + height / 2,
        width,
        height
      };
    };

    const svgFrag = connectorSpecs
      .map(({ sourceEl, targetEl, strokeColor, markerId, labelText }) => {
        const src = toBox(sourceEl);
        const dst = toBox(targetEl);

        const x1 = Math.round(src.cx);
        const y1 = Math.round(src.bottom + 4);
        let cx1 = x1;
        let cy1 = y1 + 42;

        const pad = 7;
        let x2, y2, cx2, cy2;

        if (dst.right < src.left) {
          x2 = Math.round(dst.right + pad);
          y2 = Math.round(dst.cy);
          cx2 = x2 + 54;
          cy2 = y2;
        } else if (dst.left > src.right) {
          x2 = Math.round(dst.left - pad);
          y2 = Math.round(dst.cy);
          cx2 = x2 - 54;
          cy2 = y2;
        } else {
          const attachLeft = src.cx <= dst.cx;
          x2 = Math.round(attachLeft ? dst.left - pad : dst.right + pad);
          y2 = Math.round(dst.cy);
          cx2 = x2 + (attachLeft ? -48 : 48);
          cy2 = y2;
          cx1 = x1 + (attachLeft ? -24 : 24);
        }

        const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
        const mx = Math.round(0.125 * x1 + 0.375 * cx1 + 0.375 * cx2 + 0.125 * x2);
        const my = Math.round(0.125 * y1 + 0.375 * cy1 + 0.375 * cy2 + 0.125 * y2 - 6);

        return `
          <path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-dasharray="5,4" marker-end="url(#${markerId})" />
          ${
            labelText
              ? `<text x="${mx}" y="${my}" text-anchor="middle" fill="${strokeColor}" font-family="var(--font-mono)" font-size="11.5" font-weight="700" style="paint-order: stroke; stroke: var(--paper); stroke-width: 6px;">${labelText}</text>`
              : ""
          }
        `;
      })
      .join("");

    this.wbConnectors.innerHTML = svgFrag;
  }
}

window.VisualizerPlayer = VisualizerPlayer;

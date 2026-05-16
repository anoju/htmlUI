const sampleMarkdown = `# 나의 첫 Markdown 문서

Markdown은 **간단한 기호**로 문서를 꾸미는 방법입니다.

## 오늘 배운 것

- 제목은 \`#\`으로 작성합니다.
- 목록은 \`-\` 또는 \`1.\`을 사용합니다.
- 코드는 백틱으로 감쌉니다.

\`\`\`javascript
const message = "Hello Markdown";
console.log(message);
\`\`\`

> 중요한 내용은 인용문으로 강조할 수 있습니다.

| 문법 | 의미 |
| --- | --- |
| \`**굵게**\` | 중요한 단어 |
| \`[링크](url)\` | 다른 페이지 연결 |

- [x] 기본 문법 익히기
- [ ] README 작성해보기`;

const copyButtons = document.querySelectorAll("[data-copy]");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    const text = target ? target.innerText : "";
    const original = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "완료";
    } catch (error) {
      button.textContent = "실패";
    }

    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  });
});

const markdownInput = document.getElementById("markdown-input");
const markdownPreview = document.getElementById("markdown-preview");
const resetSampleButton = document.getElementById("reset-sample");
const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");
const guideLinks = document.querySelectorAll(".guide-tabs a");
const practicePanel = document.querySelector(".practice-panel");
const practiceDockToggle = document.querySelector(".practice-dock-toggle");
const practiceToggleText = document.querySelector(".practice-dock-toggle .toggle-text");
const practiceDim = document.querySelector(".practice-dim");

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(text) {
  let value = escapeHtml(text);

  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  value = value.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  value = value.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  value = value.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return value;
}

function isTableStart(lines, index) {
  return (
    lines[index] &&
    lines[index + 1] &&
    lines[index].includes("|") &&
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
  );
}

function parseTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;

  while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
    rows.push(lines[index]);
    index += 1;
  }

  const headers = splitTableRow(rows[0]);
  const alignments = splitTableRow(rows[1]).map((cell) => {
    const trimmed = cell.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
    if (trimmed.endsWith(":")) return "right";
    return "left";
  });
  const bodyRows = rows.slice(2).map(splitTableRow);

  const thead = headers
    .map((header, columnIndex) => `<th style="text-align:${alignments[columnIndex] || "left"}">${renderInline(header.trim())}</th>`)
    .join("");

  const tbody = bodyRows
    .map((row) => {
      const cells = row
        .map((cell, columnIndex) => `<td style="text-align:${alignments[columnIndex] || "left"}">${renderInline(cell.trim())}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return {
    html: `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`,
    nextIndex: index,
  };
}

function splitTableRow(row) {
  return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|");
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listStack = [];
  let inCode = false;
  let codeLanguage = "";
  let codeLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeListsTo = (level) => {
    while (listStack.length > level) {
      html.push(`</${listStack.pop()}>`);
    }
  };

  const closeAllLists = () => closeListsTo(0);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        html.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        inCode = false;
        codeLanguage = "";
        codeLines = [];
      } else {
        flushParagraph();
        closeAllLists();
        inCode = true;
        codeLanguage = trimmed.replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      closeAllLists();
      continue;
    }

    if (isTableStart(lines, index)) {
      flushParagraph();
      closeAllLists();
      const table = parseTable(lines, index);
      html.push(table.html);
      index = table.nextIndex - 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeAllLists();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      closeAllLists();
      html.push("<hr>");
      continue;
    }

    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      closeAllLists();
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      continue;
    }

    const list = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (list) {
      flushParagraph();
      const level = Math.floor(list[1].length / 2);
      const marker = list[2];
      const listType = /\d+\./.test(marker) ? "ol" : "ul";
      let content = list[3];
      const task = content.match(/^\[( |x|X)\]\s+(.+)$/);

      closeListsTo(level);

      if (listStack.length === level || listStack[listStack.length - 1] !== listType) {
        if (listStack.length > level) closeListsTo(level);
        html.push(`<${listType}>`);
        listStack.push(listType);
      }

      if (task) {
        const checked = task[1].toLowerCase() === "x" ? " checked" : "";
        content = `<input type="checkbox"${checked} disabled> ${renderInline(task[2])}`;
      } else {
        content = renderInline(content);
      }

      html.push(`<li>${content}</li>`);
      continue;
    }

    closeAllLists();
    paragraph.push(line);
  }

  if (inCode) {
    html.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  flushParagraph();
  closeAllLists();

  return html.join("\n");
}

function updatePreview() {
  if (!markdownInput || !markdownPreview) return;
  markdownPreview.innerHTML = parseMarkdown(markdownInput.value);
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.tab;

    tabButtons.forEach((tabButton) => {
      const isActive = tabButton === button;
      tabButton.classList.toggle("active", isActive);
      tabButton.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });

    updatePreview();
  });
});

if (markdownInput) {
  markdownInput.addEventListener("input", updatePreview);
}

if (resetSampleButton && markdownInput) {
  resetSampleButton.addEventListener("click", () => {
    markdownInput.value = sampleMarkdown;
    updatePreview();
  });
}

updatePreview();

if (guideLinks.length) {
  const guideTargets = [...guideLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const activateGuideLink = () => {
    const current = guideTargets
      .filter((section) => section.getBoundingClientRect().top <= 130)
      .pop() || guideTargets[0];

    guideLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
    });
  };

  document.addEventListener("scroll", activateGuideLink, { passive: true });
  activateGuideLink();
}

if (practicePanel && practiceDockToggle && practiceToggleText) {
  const setPracticeOpen = (isOpen) => {
    practicePanel.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("practice-open", isOpen);
    practiceDockToggle.setAttribute("aria-expanded", String(isOpen));
    practiceToggleText.textContent = isOpen ? "Markdown 실습 접기" : "Markdown 실습 열기";
    if (isOpen) updatePreview();
  };

  practiceDockToggle.addEventListener("click", () => {
    setPracticeOpen(!practicePanel.classList.contains("is-open"));
  });

  if (practiceDim) {
    practiceDim.addEventListener("click", () => {
      setPracticeOpen(false);
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      setPracticeOpen(false);
      document.body.classList.remove("practice-open");
    }
  });
}

// Cbox.js (updated dragging everywhere)
// Single-file module: injects CSS, HTML scaffolding and CBOX logic

// ===== Inject Global Styles =====
const styles = `
/* ===== Global & CBOX Styles ===== */
body {
  margin: 0;
  padding-top: 50px;
  background: black;
  color: white;
  font-family: sans-serif;
  user-select: none;
}
#top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
#top-bar a {
  text-decoration: none;
  font-weight: bold;
  font-family: sans-serif;
  font-size: 1rem;
  color: #2196F3;
}
#top-bar a:visited {
  color: purple;
}

/* CBOX */
CBOX {
  position: fixed;
  top: 0;
  left: 50px;
  width: 300px;
  background: black;
  border: 2px solid white;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  cursor: grab;
  z-index: 1001;
  transition: height 0.2s ease;
  height: 50px;
}
CBOX.expanded {
  height: auto;
  border-radius: 8px;
}
CBOX:active {
  cursor: grabbing;
}
CBOX h3 {
  margin: 0;
  padding: 0.75rem 1rem;
  background: #111;
  color: white;
  font-size: 1rem;
  user-select: none;
}
CBOX h3:hover {
  background: #222;
}
CBOX #box-content {
  padding: 1rem;
  display: none;
}
CBOX.expanded #box-content {
  display: block;
}
CBOX table {
  width: 100%;
  border-collapse: collapse;
  margin-top: .5rem;
  table-layout: fixed;
  word-wrap: break-word;
}
CBOX th, CBOX td {
  border: 1px solid white;
  padding: 6px 8px;
  text-align: left;
}
CBOX th {
  background: #222;
  width: 30%;
  white-space: nowrap;
  font-weight: bold;
}
CBOX td {
  width: 70%;
}
.ref-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: .75em;
  flex-shrink: 0;
}
.green {
  background: #4CAF50;
}
.blue {
  background: #2196F3;
}
.orange {
  background: #FF9800;
}

/* Hand-Account & Highlight Tags */
FirstHandAccount, SecondHandAccount, ThirdHandAccount {
  display: block;
  margin: 1rem 2rem;
  font-weight: bold;
}
FirstHandAccount { color: #4CAF50; }
SecondHandAccount { color: #2196F3; }
ThirdHandAccount { color: #FF9800; }
FirstHandAccount a,
SecondHandAccount a,
ThirdHandAccount a,
#references a {
  position: relative;
  text-decoration: underline;
  color: #2196F3;
}
FirstHandAccount a:visited,
SecondHandAccount a:visited,
ThirdHandAccount a:visited,
#references a:visited {
  color: purple;
}
FirstHandAccount a::after,
SecondHandAccount a::after,
ThirdHandAccount a::after {
  content: "↗";
  position: absolute;
  top: -0.4em;
  right: -0.8em;
  font-size: 0.8em;
  pointer-events: auto;
}

/* Content-Validation Highlight Tags */
red-flag, potential-illegality {
  display: inline-block;
  background-color: rgba(255, 0, 0, 0.2);
  color: white;
  border-radius: 4px;
  padding: 0.1em 0.3em;
  margin: 0 0.1em;
}

/* References Section */
#references {
  margin: 2rem;
  border-top: 1px solid #444;
  padding-top: 1rem;
}
#references h2 {
  margin-bottom: .5em;
}
#references ul {
  list-style: none;
  padding: 0 2rem;
}
#references li {
  display: flex;
  align-items: center;
  margin-bottom: .5em;
  font-size: .9em;
}
`;
// Append styles
document.head.appendChild(Object.assign(document.createElement('style'), { textContent: styles }));
console.log('Cbox styles injected');

// ===== Inject Scaffolding =====
function injectScaffold() {
  if (!document.getElementById('top-bar')) {
    const topBar = document.createElement('div');
    topBar.id = 'top-bar';
    topBar.innerHTML = `<a href="index.html" target="_blank" rel="noopener noreferrer">INDEX</a>`;
    document.body.prepend(topBar);
  }
  if (!document.getElementById('references')) {
    const section = document.createElement('section');
    section.id = 'references';
    section.innerHTML = `<h2>References</h2><ul></ul>`;
    document.body.append(section);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  injectScaffold();
  document.querySelectorAll('CBOX').forEach(box => {
    // Header and content container
    const header = document.createElement('h3');
    header.textContent = 'Info Box ▼';
    const content = document.createElement('div');
    content.id = 'box-content';

    // Move original children
    Array.from(box.children).forEach(child => content.appendChild(child));
    box.append(header, content);

    // Build table
    const tbody = document.createElement('tbody');
    const table = document.createElement('table');
    table.appendChild(tbody);
    const seen = new Set();
    const refsList = document.querySelector('#references ul');

    function buildLink(el, color) {
      const url = el.getAttribute('href');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td style=\"font-weight:bold\">${el.getAttribute('DB')}</td><td><a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${url}</a></td>`;
      tbody.appendChild(tr);
      if (!seen.has(url)) {
        seen.add(url);
        const li = document.createElement('li');
        li.innerHTML = `<span class=\"ref-circle ${color}\"></span><a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${url}</a>`;
        refsList.appendChild(li);
      }
    }

    const handlers = [
      { tag: 'MainHeader', cb: el => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td style=\"font-weight:bold\">${el.getAttribute('DB')}</td><td>${el.textContent}</td>`;
          tbody.appendChild(tr);
      }},
      { tag: 'DBLF', cb: el => buildLink(el, 'green') },
      { tag: 'DBLS', cb: el => buildLink(el, 'blue')  },
      { tag: 'DBLT', cb: el => buildLink(el, 'orange') }
    ];

    handlers.forEach(({tag, cb}) => {
      box.querySelectorAll(tag).forEach(cb);
      box.querySelectorAll(tag).forEach(el => el.remove());
    });

    content.insertBefore(table, content.firstChild);

    // Toggle expand/collapse
    let expanded = false;
    header.addEventListener('click', () => {
      expanded = !expanded;
      box.classList.toggle('expanded', expanded);
      header.textContent = expanded ? 'Info Box ▲' : 'Info Box ▼';
    });

    // ===== Draggable Anywhere =====
    let dragging = false;
    let ox = 0, oy = 0;
    box.addEventListener('mousedown', e => {
      // prevent drag on links
      if (e.target.tagName === 'A') return;
      dragging = true;
      const rect = box.getBoundingClientRect();
      ox = e.clientX - rect.left;
      oy = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
      box.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        document.body.style.userSelect = '';
        box.style.cursor = 'grab';
      }
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      let left = e.clientX - ox;
      let top = e.clientY - oy;
      left = Math.min(Math.max(0, left), window.innerWidth - box.offsetWidth);
      top = Math.min(Math.max(0, top), window.innerHeight - box.offsetHeight);
      box.style.left = `${left}px`;
      box.style.top = `${top}px`;
    });
  });
});

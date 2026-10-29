/* Coloration syntaxique minimale (YAML, Markdown, shell, JSON, politiques) — hors ligne, sans dépendance */
(function () {
  var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var wrap = function (cls, s) { return '<span class="t-' + cls + '">' + esc(s) + '</span>'; };

  function tokenize(line, re, pick) {
    var out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(line)) !== null) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(line.slice(last, m.index)) + pick(m);
      last = m.index + m[0].length;
    }
    return out + esc(line.slice(last));
  }

  var YAML = /(\(Missing value \d+\))|(#.*$)|("[^"]*"|'[^']*')|(\$\{\{.*?\}\})|(^\s*(?:-\s+)?[\w.\-\/@\[\]*]+(?=:(?:\s|$)))|(\b(?:true|false|null)\b)|(\b\d+\b)|(@[\w\-\/]+)/g;
  function yaml(line) {
    return tokenize(line, YAML, function (m) {
      if (m[1]) return wrap('m', m[1]);
      if (m[2]) return wrap('c', m[2]);
      if (m[3]) return wrap('s', m[3]);
      if (m[4]) return wrap('v', m[4]);
      if (m[5]) return wrap('k', m[5]);
      if (m[6]) return wrap('b', m[6]);
      if (m[7]) return wrap('n', m[7]);
      return wrap('v', m[8]);
    });
  }

  var SH = /(#.*$)|("[^"]*"|'[^']*')|(\s--?[\w-]+)|(\$[\w{}]+)|(@[\w\-\/]+)/g;
  function sh(line) {
    return tokenize(line, SH, function (m) {
      if (m[1]) return wrap('c', m[1]);
      if (m[2]) return wrap('s', m[2]);
      if (m[3]) return esc(m[3].charAt(0)) + wrap('k', m[3].slice(1));
      if (m[4]) return wrap('v', m[4]);
      return wrap('v', m[5]);
    });
  }

  var JSON_RE = /("(?:[^"\\]|\\.)*")(\s*:)?|(\b(?:true|false|null)\b)|(-?\b\d+(?:\.\d+)?\b)/g;
  function json(line) {
    return tokenize(line, JSON_RE, function (m) {
      if (m[1] && m[2]) return wrap('k', m[1]) + esc(m[2]);
      if (m[1]) return wrap('s', m[1]);
      if (m[3]) return wrap('b', m[3]);
      return wrap('n', m[4]);
    });
  }

  var POLICY = /(#.*$)|(@[\w\-\/]+)|(\benabled\b)|(\bdisabled\b)|(^\s*(?:-\s+)?[\w .\-\/]+?(?=:\s))|(^[\/.][\w.\-\/*]*)/g;
  function policy(line) {
    return tokenize(line, POLICY, function (m) {
      if (m[1]) return wrap('c', m[1]);
      if (m[2]) return wrap('v', m[2]);
      if (m[3]) return wrap('s', m[3]);
      if (m[4]) return wrap('m', m[4]);
      if (m[5]) return wrap('k', m[5]);
      return wrap('n', m[6]);
    });
  }

  function md(lines) {
    var inFront = false, inFence = false;
    return lines.map(function (line, i) {
      if (/^```/.test(line)) { inFence = !inFence; return wrap('c', line); }
      if (inFence) return esc(line);
      if (line.trim() === '---' && (i === 0 || inFront)) { inFront = !inFront; return wrap('c', line); }
      if (inFront) return yaml(line);
      if (/^#{1,6}\s/.test(line)) return wrap('h', line);
      var m = /^(\s*(?:[-*]|\d+\.)\s)(.*)$/.exec(line);
      var head = '', body = line;
      if (m) { head = wrap('k', m[1]); body = m[2]; }
      body = tokenize(body, /(`[^`]*`)|(\*\*[^*]+\*\*)/g, function (x) {
        return x[1] ? wrap('s', x[1]) : wrap('h', x[2]);
      });
      return head + body;
    });
  }

  var langs = { yaml: yaml, sh: sh, json: json, policy: policy };

  document.querySelectorAll('pre.code[data-lang]').forEach(function (pre) {
    var code = pre.querySelector('code') || pre;
    var lines = code.textContent.replace(/\n$/, '').split('\n');
    var lang = pre.getAttribute('data-lang');
    var out = lang === 'md' ? md(lines) : lines.map(langs[lang] || esc);
    code.innerHTML = out.join('\n');
  });
})();

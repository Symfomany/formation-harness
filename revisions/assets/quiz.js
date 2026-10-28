/* Moteur de quiz statique : lit window.QUIZ et l'affiche dans #quiz.
   Format d'une question : { d: "D2", q: "texte", o: ["A", "B"], r: [1] , e: "explication" }
   r contient les indices des bonnes réponses (plusieurs = question à choix multiples). */
(function () {
  'use strict';
  var zone = document.getElementById('quiz');
  if (!zone || !window.QUIZ) return;
  var DOMAINES = window.QUIZ_DOMAINES || {};
  var questions = window.QUIZ.slice();

  var barre = document.createElement('div');
  barre.className = 'quiz-bar';
  var filtre = document.createElement('select');
  var tous = document.createElement('option');
  tous.value = ''; tous.textContent = 'Tous les domaines (' + questions.length + ')';
  filtre.appendChild(tous);
  Object.keys(DOMAINES).forEach(function (k) {
    var n = questions.filter(function (q) { return q.d === k; }).length;
    if (!n) return;
    var o = document.createElement('option');
    o.value = k; o.textContent = DOMAINES[k] + ' (' + n + ')';
    filtre.appendChild(o);
  });
  var bMelanger = bouton('Mélanger');
  var bCorriger = bouton('Corriger', 'prim');
  var bRecommencer = bouton('Recommencer');
  if (filtre.options.length > 2) barre.appendChild(filtre);
  barre.appendChild(bMelanger); barre.appendChild(bCorriger); barre.appendChild(bRecommencer);
  var score = document.createElement('div');
  score.className = 'score';
  var liste = document.createElement('div');
  zone.appendChild(barre); zone.appendChild(score); zone.appendChild(liste);

  function bouton(t, c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; if (c) b.className = c; return b; }

  function afficher() {
    liste.innerHTML = '';
    score.className = 'score';
    var sel = filtre.value;
    questions.filter(function (q) { return !sel || q.d === sel; }).forEach(function (q, i) {
      var multi = q.r.length > 1;
      var bloc = document.createElement('div');
      bloc.className = 'q';
      bloc._q = q;
      var h = document.createElement('h4');
      h.innerHTML = '<span class="tag">' + (DOMAINES[q.d] ? q.d : 'Q') + '</span>' + (i + 1) + '. ' + q.q;
      bloc.appendChild(h);
      if (multi) { var m = document.createElement('div'); m.className = 'multi'; m.textContent = 'Plusieurs réponses (' + q.r.length + ')'; bloc.appendChild(m); }
      q.o.forEach(function (opt, j) {
        var l = document.createElement('label');
        var inp = document.createElement('input');
        inp.type = multi ? 'checkbox' : 'radio';
        inp.name = 'q' + i; inp.value = j;
        var s = document.createElement('span'); s.innerHTML = opt;
        l.appendChild(inp); l.appendChild(s);
        bloc.appendChild(l);
      });
      var ex = document.createElement('div');
      ex.className = 'expl'; ex.innerHTML = '<b>Explication.</b> ' + q.e;
      bloc.appendChild(ex);
      liste.appendChild(bloc);
    });
  }

  function corriger() {
    var blocs = liste.querySelectorAll('.q'); var bons = 0;
    blocs.forEach(function (b) {
      var q = b._q; var choisis = [];
      b.querySelectorAll('input').forEach(function (inp, j) {
        var lab = inp.parentElement;
        lab.classList.remove('bon', 'faux');
        if (inp.checked) choisis.push(j);
        if (q.r.indexOf(j) >= 0) lab.classList.add('bon');
        else if (inp.checked) lab.classList.add('faux');
      });
      var ok = choisis.length === q.r.length && choisis.every(function (c) { return q.r.indexOf(c) >= 0; });
      if (ok) bons++;
      b.classList.add('corrigee');
    });
    var pct = blocs.length ? Math.round((bons / blocs.length) * 100) : 0;
    score.textContent = 'Score : ' + bons + ' / ' + blocs.length + ' (' + pct + ' %) — ' +
      (pct >= 70 ? 'au-dessus du seuil indicatif de 70 %.' : 'en dessous du seuil indicatif de 70 % : relisez les explications.');
    score.className = 'score visible';
    score.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  bMelanger.addEventListener('click', function () {
    for (var i = questions.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = questions[i]; questions[i] = questions[j]; questions[j] = t; }
    afficher();
  });
  bCorriger.addEventListener('click', corriger);
  bRecommencer.addEventListener('click', afficher);
  filtre.addEventListener('change', afficher);
  var ancre = decodeURIComponent((location.hash || '').slice(1));
  if (DOMAINES[ancre]) filtre.value = ancre;
  afficher();
})();

"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* ===== UTIL ===== */
var $ = function $(q) {
  return document.querySelector(q);
};

var $$ = function $$(q) {
  return document.querySelectorAll(q);
};

var byId = function byId(id) {
  return document.getElementById(id);
};
/* ===== מצב ===== */


var S = {
  weight: 70,
  age: 26,
  height: 169,
  activity: 30,
  sex: 'female',
  hot: false,
  pregnant: false,
  lactating: false,
  altitudeBand: 0,
  // 0, +250, +500
  coffeeCups: 0,
  // כוסות
  coffeeMl: 0,
  // מ״ל ידני
  targetMl: 0,
  drankMl: 0,
  remTimer: null,
  oneTimer: null
};
/* ===== גלים בהירו ===== */

(function heroWaves() {
  var c = byId('heroWave');
  var dpr = window.devicePixelRatio || 1;

  function size() {
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
  }

  size();
  window.addEventListener('resize', size);
  var ctx = c.getContext('2d');
  var t = 0;

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    var H = c.height,
        W = c.width;

    function wave(color, amp, freq, speed, yOff) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, H);

      for (var x = 0; x <= W; x += 4) {
        var y = H * 0.45 + Math.sin(x / freq + t * speed) * amp + yOff;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }

    wave('#7dd3fc', 12 * dpr, 30 * dpr, 0.9, 8 * dpr);
    wave('#4fb6ff', 10 * dpr, 26 * dpr, 1.2, -2 * dpr);
    wave('#38a8ff', 8 * dpr, 22 * dpr, 1.6, -6 * dpr);
    t += 0.02;
    requestAnimationFrame(draw);
  }

  draw();
})();
/* ===== נהר/בר התקדמות (Canvas) ===== */


(function river() {
  var c = byId('riverCanvas');
  var dpr = window.devicePixelRatio || 1;

  function size() {
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
  }

  size();
  window.addEventListener('resize', size);
  var ctx = c.getContext('2d');
  var t = 0,
      pulse = 0;

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    var W = c.width,
        H = c.height;
    var pct = S.targetMl ? Math.min(1, S.drankMl / S.targetMl) : 0;
    var fillW = W * pct; // רקע

    ctx.fillStyle = '#e9f3ff';
    ctx.fillRect(0, 0, W, H); // גל צבעוני שמתעדכן לפי אחוזים (גוונים משתנים)

    var hue = 190 + Math.round(150 * pct);
    ctx.fillStyle = "hsl(".concat(hue, " 90% 52%)");
    ctx.beginPath();
    ctx.moveTo(0, H);

    for (var x = 0; x <= fillW; x += 2) {
      var y = H / 2 + Math.sin(x / 14 + t) * (3 + pulse);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(fillW, H);
    ctx.closePath();
    ctx.fill(); // קצה (כדור מים קטן)

    ctx.beginPath();
    ctx.arc(fillW, H / 2, 7 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(".concat(hue, " 95% 45%)");
    ctx.fill();
    t += 0.05;
    pulse = Math.max(0, pulse - 0.1);
    requestAnimationFrame(draw);
  } // API פנימי לגל גדול/קטן בעת הוספה


  window._wavePulse = function (amount) {
    pulse = Math.min(12, pulse + (amount >= 1000 ? 10 : amount >= 500 ? 7 : 4));
  };

  draw();
})();
/* ===== ספינרים ===== */


function updateSpinOutputs() {
  byId('weight').textContent = S.weight;
  byId('age').textContent = S.age;
  byId('height').textContent = S.height;
}

$$('.spin-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var t = btn.dataset["for"];
    var inc = btn.classList.contains('plus') ? 1 : -1;

    if (t === 'w') {
      S.weight = Math.min(200, Math.max(30, S.weight + inc));
    }

    if (t === 'a') {
      S.age = Math.min(110, Math.max(5, S.age + inc));
    }

    if (t === 'h') {
      S.height = Math.min(230, Math.max(90, S.height + inc));
    }

    updateSpinOutputs();
    calcTarget();
  });
});
/* מין/פעילות */

byId('sex').addEventListener('change', function (e) {
  S.sex = e.target.value; // הצג/הסתר בהריון/מניקה

  $$('.female-only').forEach(function (el) {
    return el.style.display = S.sex === 'female' ? '' : 'none';
  });
});
byId('activity').addEventListener('change', function (e) {
  S.activity = +e.target.value;
  calcTarget();
});
/* טוגל אייקונים */

function toggleBtn(btn, key, openModal) {
  btn.addEventListener('click', function () {
    var on = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!on));
    if (key === 'hot') S.hot = !on;
    if (key === 'pregnant') S.pregnant = !on;
    if (key === 'lactating') S.lactating = !on;
    if (openModal) openModal();
    calcTarget();
  });
}

toggleBtn(byId('hotToggle'), 'hot');
toggleBtn(byId('pregToggle'), 'pregnant');
toggleBtn(byId('lactToggle'), 'lactating');
toggleBtn(byId('coffeeToggle'), 'coffee', openCoffeeModal);
toggleBtn(byId('altToggle'), 'altitude', openAltitudeModal);
/* ===== נוסחת יעד =====
   בסיס: 35 מ״ל/ק״ג
   פעילות: ~12 מ״ל לדקה פעילה
   קפה: כוס*120 + קיזוז חצי מהמ״ל הידני
   אקלים חם: +10%
   בהריון: +300 מ״ל ; מניקה: +700 מ״ל
   גובה מקום: 0 / +250 / +500 מ״ל
*/

function calcTarget() {
  var base = S.weight * 35;
  var act = S.activity * 12;
  var caffe = S.coffeeCups * 120 + S.coffeeMl * 0.5;
  var ml = Math.round(base + act + caffe);
  if (S.hot) ml *= 1.10;

  if (S.sex === 'female') {
    if (S.pregnant) ml += 300;
    if (S.lactating) ml += 700;
  }

  ml += S.altitudeBand; // 0 / 250 / 500

  S.targetMl = Math.round(ml);
  byId('targetLiters').textContent = (S.targetMl / 1000).toFixed(1);
  byId('targetNote').textContent = "".concat((S.targetMl / 1000).toFixed(2), " \u05DC\u05D9\u05D8\u05E8 \xB7 ").concat((S.targetMl / 240).toFixed(1), " \u05DB\u05D5\u05E1\u05D5\u05EA");
  updateGauge();
}
/* ===== מד עגול ===== */


function updateGauge() {
  var pct = S.targetMl ? Math.min(100, S.drankMl / S.targetMl * 100) : 0;
  var deg = pct / 100 * 360;
  byId('gaugeFill').style.background = "conic-gradient(#22d3ee ".concat(deg, "deg,#e9f2ff ").concat(deg, "deg 360deg)");
  byId('gaugePct').textContent = "".concat(Math.round(pct), "%");
  byId('drankLiters').textContent = (S.drankMl / 1000).toFixed(1);
  byId('intakeMl').textContent = S.drankMl;
  byId('intakeCups').textContent = (S.drankMl / 240).toFixed(1);
  if (pct >= 100) celebrate();
}
/* ===== הוספה מהירה ===== */


function addWater(amount) {
  S.drankMl = Math.min(60000, S.drankMl + amount);

  window._wavePulse(amount);

  updateGauge();
  rotateQuote();
}

byId('add250').onclick = function () {
  return addWater(250);
};

byId('add500').onclick = function () {
  return addWater(500);
};

byId('add1000').onclick = function () {
  return addWater(1000);
};

byId('reset').onclick = function () {
  S.drankMl = 0;
  updateGauge();
};
/* ===== קונפטי ===== */


function celebrate() {
  var c = byId('confettiTop');
  var dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  var ctx = c.getContext('2d');
  var N = 160; // הרבה יותר מהיר + נעלם אחרי 3 שניות

  var pieces = Array.from({
    length: N
  }).map(function () {
    return {
      x: Math.random() * c.width,
      y: -10 * dpr,
      r: 4 * dpr + Math.random() * 6 * dpr,
      col: "hsl(".concat(Math.random() * 360, " 90% 60%)"),
      vy: 2 * dpr + Math.random() * 5 * dpr,
      vx: (Math.random() - .5) * 2 * dpr,
      spin: Math.random() * 6.28
    };
  });
  var t = 0;

  function step() {
    ctx.clearRect(0, 0, c.width, c.height);
    pieces.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.spin += .1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
      ctx.restore();
    });
    t += 16;
    if (t < 3000) requestAnimationFrame(step);else {
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }

  step(); // לאחר הצלחה – איפוס ספירה ליום הבא/מיד
  // (כאן רק הודעה קטנה; לא מאפס אוטומטית כדי לא לאבד נתונים בטעות)
}
/* ===== ציטוטים (תנ״ך + מחקר בעברית) ===== */


var quotes = ['“כל צמא לכו למים” — ישעיהו נה׳', '“יושבני על מי מנוחות” — תהילים כג׳', 'מחקרים מצביעים כי שמירה על הידרציה תומכת בקשב וזיכרון (Popkin ואחרים, Nutrition Reviews).', 'הידרציה נאותה משפרת מצב רוח ורמות אנרגיה (Pross, European Journal of Nutrition).', 'הידרציה תורמת לביצועים גופניים (Sawka ואחרים, JACN).', '“ותשאב לו ותשקהו” — בראשית כד׳', '“תערוך לפני שולחן... כוסי רויה” — תהילים כג׳', 'שתיית מים מסייעת בוויסות חום הגוף ועומס חום (WHO Guidelines).'];

function rotateQuote() {
  var i = Math.floor(Math.random() * quotes.length);
  byId('quote').textContent = quotes[i];
}
/* ===== תזכורות והתראות ===== */


function notify(txt) {
  var ch;
  return regeneratorRuntime.async(function notify$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!(window.Notification && Notification.permission !== "granted")) {
            _context.next = 4;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(Notification.requestPermission());

        case 4:
          if (window.Notification && Notification.permission === "granted") {
            new Notification("דרינק! 💧", {
              body: txt
            });
          }

          _context.next = 9;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);

        case 9:
          ch = byId('chime');
          ch.currentTime = 0;
          ch.play();
          if (navigator.vibrate) navigator.vibrate([60, 30, 60]);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

byId('startRem').onclick = function () {
  var mins = +byId('interval').value;
  if (S.remTimer) clearInterval(S.remTimer);
  S.remTimer = setInterval(function () {
    return notify('זמן ללגימה!');
  }, mins * 60 * 1000);
  notify('מתחילים להזכיר לך לשתות 💙');
};

byId('stopRem').onclick = function () {
  if (S.remTimer) clearInterval(S.remTimer);
  S.remTimer = null;
  notify('עצירת תזכורות');
};

byId('testPing').onclick = function () {
  return notify('בדיקת צליל/רטט');
};

(function fillOneShot() {
  var s = byId('oneShot');

  for (var i = 1; i <= 180; i++) {
    var o = document.createElement('option');
    o.value = i;
    o.textContent = i;
    s.appendChild(o);
  }
})();

byId('fireOne').onclick = function () {
  var mins = +byId('oneShot').value;
  if (S.oneTimer) clearTimeout(S.oneTimer);
  S.oneTimer = setTimeout(function () {
    return notify("\u05D4\u05EA\u05E8\u05D0\u05D4 \u05D7\u05D3\u05BE\u05E4\u05E2\u05DE\u05D9\u05EA \u2014 ".concat(mins, " \u05D3\u05E7\u05D5\u05EA"));
  }, mins * 60 * 1000);
  notify("\u05D0\u05E7\u05E8\u05D0 \u05D1\u05E2\u05D5\u05D3 ".concat(mins, " \u05D3\u05E7\u05D5\u05EA"));
};
/* ===== מודלי קפה/גובה ===== */


function openCoffeeModal() {
  var m = byId('coffeeModal');
  m.hidden = false;
  var chips = byId('coffeeChips');
  chips.innerHTML = '';
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(function (n) {
    var b = document.createElement('button');
    b.textContent = "".concat(n, " \u05DB\u05D5\u05E1\u05D5\u05EA");

    b.onclick = function () {
      S.coffeeCups = n;
      m.hidden = true;
      calcTarget();
    };

    chips.appendChild(b);
  });
}

byId('setCoffeeMl').onclick = function () {
  S.coffeeMl = +byId('coffeeMl').value || 0;
  byId('coffeeModal').hidden = true;
  calcTarget();
};

byId('closeCoffee').onclick = function () {
  byId('coffeeModal').hidden = true;
};

function openAltitudeModal() {
  var m = byId('altitudeModal');
  m.hidden = false;
  var chips = byId('altitudeChips');
  chips.innerHTML = '';
  [[0, 'רגיל'], [250, '+250 מ׳'], [500, '+500 מ׳']].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        v = _ref2[0],
        txt = _ref2[1];

    var b = document.createElement('button');
    b.textContent = txt;

    b.onclick = function () {
      S.altitudeBand = v;
      m.hidden = true;
      calcTarget();
    };

    chips.appendChild(b);
  });
}

byId('closeAltitude').onclick = function () {
  byId('altitudeModal').hidden = true;
};
/* ===== תאריך + INIT ===== */


(function dateInit() {
  var d = new Date();
  var s = d.toLocaleDateString('he-IL', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });
  var el = document.getElementById('today');
  if (el) el.textContent = s;
})();

updateSpinOutputs();
calcTarget();
rotateQuote();
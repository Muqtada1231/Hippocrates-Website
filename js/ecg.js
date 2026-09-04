/* HIPPOCRATES — signature ECG line.
   Realistic normal-sinus-rhythm waveform, drawn as a live SVG path.
   Resting: static, low-amplitude wave. Pointer: the beat wakes up under the
   cursor and a pulse travels along the line. Idle frames cost nothing. */
(function () {
  var EASE_FOLLOW = 0.14;      // cursor smoothing
  var EASE_STRENGTH = 0.09;    // hover fade in/out
  var BEAT = 196;              // px between beats
  var REST = 0.40;             // resting amplitude factor
  var SIGMA = 150;             // px radius of the active zone
  var PULSE_SPEED = 230;       // px/s of the travelling pulse
  var PULSE_LIFE = 2100;       // ms
  var PULSE_EVERY = 1400;      // ms between spawns while hovering

  // amplitudes in px, measured from the baseline
  var A = { p: 4.2, q: -3, r: 29, s: -8.5, t: 9.5 };
  var H = 68, BASE = 42;

  function gauss(x, c, s) { var d = (x - c) / s; return Math.exp(-d * d); }

  // y offset (up = positive) for one point of the rhythm, phase 0..1
  function beat(ph) {
    var y = 0;
    y += A.p * gauss(ph, 0.160, 0.030);
    y += A.t * gauss(ph, 0.560, 0.058);
    if (ph > 0.298 && ph < 0.372) {
      var seg = [[0.298, 0], [0.316, A.q], [0.330, A.r], [0.348, A.s], [0.372, 0]];
      for (var i = 0; i < seg.length - 1; i++) {
        var a = seg[i], b = seg[i + 1];
        if (ph >= a[0] && ph <= b[0]) {
          var k = (ph - a[0]) / (b[0] - a[0]);
          y += a[1] + (b[1] - a[1]) * k;
          break;
        }
      }
    }
    return y;
  }

  function Line(host) {
    this.host = host;
    this.svg = host.querySelector('[data-svg]');
    this.rest = host.querySelector('[data-base]');
    this.live = host.querySelector('[data-line]');
    this.dot = host.querySelector('[data-dot]');
    if (!this.svg || !this.live) return;
    this.calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.rtl = (getComputedStyle(host).direction || 'rtl') === 'rtl';
    this.w = 0;
    this.mx = -9999; this.tx = -9999;
    this.strength = 0; this.target = 0;
    this.progress = this.calm ? 1 : 0;
    this.revealing = false;
    this.pulses = [];
    this.last = 0; this.spawned = 0;
    this.raf = null;

    var self = this;
    this.measure();
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { self.measure(); self.draw(); }).observe(host);
    } else {
      window.addEventListener('resize', function () { self.measure(); self.draw(); });
    }

    host.style.cursor = 'default';
    if (!this.calm) {
      host.addEventListener('pointermove', function (e) {
        var r = self.svg.getBoundingClientRect();
        self.tx = e.clientX - r.left;
        if (self.mx < -1000) self.mx = self.tx;
        self.target = 1;
        self.run();
      });
      host.addEventListener('pointerenter', function () { self.target = 1; self.run(); });
      host.addEventListener('pointerleave', function () { self.target = 0; self.run(); });
    }

    if (this.calm) { this.draw(); return; }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          self.revealing = true;
          self.run();
        });
      }, { rootMargin: '0px 0px -6% 0px' });
      io.observe(host);
      this.draw();
    } else {
      this.progress = 1;
      this.draw();
    }
  }

  Line.prototype.measure = function () {
    this.w = Math.max(240, Math.round(this.svg.getBoundingClientRect().width));
    this.svg.setAttribute('viewBox', '0 0 ' + this.w + ' ' + H);
    this.off = this.rtl ? this.w % BEAT : 0;
  };

  Line.prototype.amp = function (x) {
    var a = REST;
    if (this.strength > 0.001) {
      a += (1 - REST) * this.strength * gauss(x, this.mx, SIGMA);
    }
    for (var i = 0; i < this.pulses.length; i++) {
      var p = this.pulses[i];
      a += (1 - REST) * p.amp * gauss(x, p.x, 74);
    }
    return a > 1.35 ? 1.35 : a;
  };

  Line.prototype.path = function (from, to) {
    var d = '', step = 2.2;
    for (var x = from; x <= to; x += step) {
      var ph = (((x - this.off) % BEAT) + BEAT) % BEAT / BEAT;
      var y = BASE - beat(ph) * this.amp(x);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(2);
    }
    return d;
  };

  Line.prototype.draw = function () {
    if (!this.w) return;
    if (this.rest && !this.rest.getAttribute('d')) {
      this.rest.setAttribute('d', 'M0 ' + BASE + 'L' + this.w + ' ' + BASE);
    }
    var span = this.w * this.progress;
    var from = this.rtl ? this.w - span : 0;
    var to = this.rtl ? this.w : span;
    this.live.setAttribute('d', this.path(from, to));

    if (!this.dot) return;
    if (this.strength < 0.02 || this.mx < -1000) {
      this.dot.setAttribute('opacity', '0');
      return;
    }
    var k = Math.round((this.mx - this.off) / BEAT - 0.330);
    var xr = this.off + (k + 0.330) * BEAT;
    if (xr < 6 || xr > this.w - 6) { this.dot.setAttribute('opacity', '0'); return; }
    this.dot.setAttribute('cx', xr.toFixed(1));
    this.dot.setAttribute('cy', (BASE - A.r * this.amp(xr)).toFixed(2));
    this.dot.setAttribute('opacity', (this.strength * 0.95).toFixed(3));
    this.dot.setAttribute('r', (2.9 + this.strength * 1).toFixed(2));
  };

  Line.prototype.run = function () {
    if (this.raf || this.calm) return;
    var self = this;
    this.last = performance.now();
    var tick = function (now) {
      var dt = Math.min(48, now - self.last);
      self.last = now;

      if (self.revealing && self.progress < 1) {
        self.progress += (1 - self.progress) * 0.055 + 0.004;
        if (self.progress > 0.998) { self.progress = 1; self.revealing = false; }
      }
      self.mx += (self.tx - self.mx) * EASE_FOLLOW;
      self.strength += (self.target - self.strength) * EASE_STRENGTH;

      if (self.target > 0.5 && now - self.spawned > PULSE_EVERY) {
        self.spawned = now;
        self.pulses.push({ x: self.mx, born: now, amp: 0 });
      }
      var live = [];
      for (var i = 0; i < self.pulses.length; i++) {
        var p = self.pulses[i];
        var age = now - p.born;
        if (age > PULSE_LIFE) continue;
        var k = age / PULSE_LIFE;
        p.x += (self.rtl ? -1 : 1) * PULSE_SPEED * dt / 1000;
        p.amp = Math.sin(Math.min(1, k * 1.6) * Math.PI) * 0.75 * (1 - k);
        live.push(p);
      }
      self.pulses = live;

      self.draw();

      var busy = self.revealing || self.strength > 0.004 || self.pulses.length ||
        Math.abs(self.tx - self.mx) > 0.5;
      if (busy) { self.raf = requestAnimationFrame(tick); }
      else { self.raf = null; self.strength = 0; self.draw(); }
    };
    this.raf = requestAnimationFrame(tick);
  };

  function scan() {
    var nodes = document.querySelectorAll('[data-ecg]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].__ecg) continue;
      nodes[i].__ecg = true;
      new Line(nodes[i]);
    }
  }

  var t = null;
  function schedule() { clearTimeout(t); t = setTimeout(scan, 60); }

  window.HipECG = { scan: scan, height: H, baseline: BASE };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else { schedule(); }
  if ('MutationObserver' in window) {
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  }
})();

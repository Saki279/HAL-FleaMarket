// カレンダーと時計出す　　後藤早輝
/*!
 * ClockPicker v0.0.7 (http://weareoutman.github.io/clockpicker/)
 * Copyright 2014 Wang Shenwei.
 * Licensed under MIT (https://github.com/weareoutman/clockpicker/blob/gh-pages/LICENSE)
 */
!(function () {
  function t(t) {
    return document.createElementNS(p, t);
  }
  function i(t) {
    return (10 > t ? "0" : "") + t;
  }
  function e(t) {
    var i = ++m + "";
    return t ? t + i : i;
  }
  function s(s, r) {
    function p(t, i) {
      var e = u.offset(),
        s = /^touch/.test(t.type),
        o = e.left + b,
        n = e.top + b,
        p = (s ? t.originalEvent.touches[0] : t).pageX - o,
        h = (s ? t.originalEvent.touches[0] : t).pageY - n,
        k = Math.sqrt(p * p + h * h),
        v = !1;
      if (!i || !(g - y > k || k > g + y)) {
        t.preventDefault();
        var m = setTimeout(function () {
          c.addClass("clockpicker-moving");
        }, 200);
        l && u.append(x.canvas),
          x.setHand(p, h, !i, !0),
          a.off(d).on(d, function (t) {
            t.preventDefault();
            var i = /^touch/.test(t.type),
              e = (i ? t.originalEvent.touches[0] : t).pageX - o,
              s = (i ? t.originalEvent.touches[0] : t).pageY - n;
            (v || e !== p || s !== h) && ((v = !0), x.setHand(e, s, !1, !0));
          }),
          a.off(f).on(f, function (t) {
            a.off(f), t.preventDefault();
            var e = /^touch/.test(t.type),
              s = (e ? t.originalEvent.changedTouches[0] : t).pageX - o,
              l = (e ? t.originalEvent.changedTouches[0] : t).pageY - n;
            (i || v) && s === p && l === h && x.setHand(s, l),
              "hours" === x.currentView
                ? x.toggleView("minutes", A / 2)
                : r.autoclose &&
                  (x.minutesView.addClass("clockpicker-dial-out"),
                  setTimeout(function () {
                    x.done();
                  }, A / 2)),
              u.prepend(j),
              clearTimeout(m),
              c.removeClass("clockpicker-moving"),
              a.off(d);
          });
      }
    }
    var h = n(V),
      u = h.find(".clockpicker-plate"),
      v = h.find(".clockpicker-hours"),
      m = h.find(".clockpicker-minutes"),
      T = h.find(".clockpicker-am-pm-block"),
      C = "INPUT" === s.prop("tagName"),
      H = C ? s : s.find("input"),
      P = s.find(".input-group-addon"),
      x = this;
    if (
      ((this.id = e("cp")),
      (this.element = s),
      (this.options = r),
      (this.isAppended = !1),
      (this.isShown = !1),
      (this.currentView = "hours"),
      (this.isInput = C),
      (this.input = H),
      (this.addon = P),
      (this.popover = h),
      (this.plate = u),
      (this.hoursView = v),
      (this.minutesView = m),
      (this.amPmBlock = T),
      (this.spanHours = h.find(".clockpicker-span-hours")),
      (this.spanMinutes = h.find(".clockpicker-span-minutes")),
      (this.spanAmPm = h.find(".clockpicker-span-am-pm")),
      (this.amOrPm = "PM"),
      r.twelvehour)
    ) {
      {
        var S = [
          '<div class="clockpicker-am-pm-block">',
          '<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">',
          "AM</button>",
          '<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">',
          "PM</button>",
          "</div>",
        ].join("");
        n(S);
      }
      n(
        '<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">AM</button>'
      )
        .on("click", function () {
          (x.amOrPm = "AM"), n(".clockpicker-span-am-pm").empty().append("AM");
        })
        .appendTo(this.amPmBlock),
        n(
          '<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">PM</button>'
        )
          .on("click", function () {
            (x.amOrPm = "PM"),
              n(".clockpicker-span-am-pm").empty().append("PM");
          })
          .appendTo(this.amPmBlock);
    }
    r.autoclose ||
      n(
        '<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button">' +
          r.donetext +
          "</button>"
      )
        .click(n.proxy(this.done, this))
        .appendTo(h),
      ("top" !== r.placement && "bottom" !== r.placement) ||
        ("top" !== r.align && "bottom" !== r.align) ||
        (r.align = "left"),
      ("left" !== r.placement && "right" !== r.placement) ||
        ("left" !== r.align && "right" !== r.align) ||
        (r.align = "top"),
      h.addClass(r.placement),
      h.addClass("clockpicker-align-" + r.align),
      this.spanHours.click(n.proxy(this.toggleView, this, "hours")),
      this.spanMinutes.click(n.proxy(this.toggleView, this, "minutes")),
      H.on("focus.clockpicker click.clockpicker", n.proxy(this.show, this)),
      P.on("click.clockpicker", n.proxy(this.toggle, this));
    var E,
      D,
      I,
      B,
      z = n('<div class="clockpicker-tick"></div>');
    if (r.twelvehour)
      for (E = 1; 13 > E; E += 1)
        (D = z.clone()),
          (I = (E / 6) * Math.PI),
          (B = g),
          D.css("font-size", "120%"),
          D.css({
            left: b + Math.sin(I) * B - y,
            top: b - Math.cos(I) * B - y,
          }),
          D.html(0 === E ? "00" : E),
          v.append(D),
          D.on(k, p);
    else
      for (E = 0; 24 > E; E += 1) {
        (D = z.clone()), (I = (E / 6) * Math.PI);
        var O = E > 0 && 13 > E;
        (B = O ? w : g),
          D.css({
            left: b + Math.sin(I) * B - y,
            top: b - Math.cos(I) * B - y,
          }),
          O && D.css("font-size", "120%"),
          D.html(0 === E ? "00" : E),
          v.append(D),
          D.on(k, p);
      }
    for (E = 0; 60 > E; E += 5)
      (D = z.clone()),
        (I = (E / 30) * Math.PI),
        D.css({ left: b + Math.sin(I) * g - y, top: b - Math.cos(I) * g - y }),
        D.css("font-size", "120%"),
        D.html(i(E)),
        m.append(D),
        D.on(k, p);
    if (
      (u.on(k, function (t) {
        0 === n(t.target).closest(".clockpicker-tick").length && p(t, !0);
      }),
      l)
    ) {
      var j = h.find(".clockpicker-canvas"),
        L = t("svg");
      L.setAttribute("class", "clockpicker-svg"),
        L.setAttribute("width", M),
        L.setAttribute("height", M);
      var U = t("g");
      U.setAttribute("transform", "translate(" + b + "," + b + ")");
      var W = t("circle");
      W.setAttribute("class", "clockpicker-canvas-bearing"),
        W.setAttribute("cx", 0),
        W.setAttribute("cy", 0),
        W.setAttribute("r", 2);
      var N = t("line");
      N.setAttribute("x1", 0), N.setAttribute("y1", 0);
      var X = t("circle");
      X.setAttribute("class", "clockpicker-canvas-bg"), X.setAttribute("r", y);
      var Y = t("circle");
      Y.setAttribute("class", "clockpicker-canvas-fg"),
        Y.setAttribute("r", 3.5),
        U.appendChild(N),
        U.appendChild(X),
        U.appendChild(Y),
        U.appendChild(W),
        L.appendChild(U),
        j.append(L),
        (this.hand = N),
        (this.bg = X),
        (this.fg = Y),
        (this.bearing = W),
        (this.g = U),
        (this.canvas = j);
    }
    o(this.options.init);
  }
  function o(t) {
    t && "function" == typeof t && t();
  }
  var c,
    n = window.jQuery,
    r = n(window),
    a = n(document),
    p = "http://www.w3.org/2000/svg",
    l =
      "SVGAngle" in window &&
      (function () {
        var t,
          i = document.createElement("div");
        return (
          (i.innerHTML = "<svg/>"),
          (t = (i.firstChild && i.firstChild.namespaceURI) == p),
          (i.innerHTML = ""),
          t
        );
      })(),
    h = (function () {
      var t = document.createElement("div").style;
      return (
        "transition" in t ||
        "WebkitTransition" in t ||
        "MozTransition" in t ||
        "msTransition" in t ||
        "OTransition" in t
      );
    })(),
    u = "ontouchstart" in window,
    k = "mousedown" + (u ? " touchstart" : ""),
    d = "mousemove.clockpicker" + (u ? " touchmove.clockpicker" : ""),
    f = "mouseup.clockpicker" + (u ? " touchend.clockpicker" : ""),
    v = navigator.vibrate
      ? "vibrate"
      : navigator.webkitVibrate
      ? "webkitVibrate"
      : null,
    m = 0,
    b = 100,
    g = 80,
    w = 54,
    y = 13,
    M = 2 * b,
    A = h ? 350 : 1,
    V = [
      '<div class="popover clockpicker-popover">',
      '<div class="arrow"></div>',
      '<div class="popover-title">',
      '<span class="clockpicker-span-hours text-primary"></span>',
      " : ",
      '<span class="clockpicker-span-minutes"></span>',
      '<span class="clockpicker-span-am-pm"></span>',
      "</div>",
      '<div class="popover-content">',
      '<div class="clockpicker-plate">',
      '<div class="clockpicker-canvas"></div>',
      '<div class="clockpicker-dial clockpicker-hours"></div>',
      '<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>',
      "</div>",
      '<span class="clockpicker-am-pm-block">',
      "</span>",
      "</div>",
      "</div>",
    ].join("");
  (s.DEFAULTS = {
    default: "",
    fromnow: 0,
    placement: "bottom",
    align: "left",
    donetext: "完成",
    autoclose: !1,
    twelvehour: !1,
    vibrate: !0,
  }),
    (s.prototype.toggle = function () {
      this[this.isShown ? "hide" : "show"]();
    }),
    (s.prototype.locate = function () {
      var t = this.element,
        i = this.popover,
        e = t.offset(),
        s = t.outerWidth(),
        o = t.outerHeight(),
        c = this.options.placement,
        n = this.options.align,
        r = {};
      switch ((i.show(), c)) {
        case "bottom":
          r.top = e.top + o;
          break;
        case "right":
          r.left = e.left + s;
          break;
        case "top":
          r.top = e.top - i.outerHeight();
          break;
        case "left":
          r.left = e.left - i.outerWidth();
      }
      switch (n) {
        case "left":
          r.left = e.left;
          break;
        case "right":
          r.left = e.left + s - i.outerWidth();
          break;
        case "top":
          r.top = e.top;
          break;
        case "bottom":
          r.top = e.top + o - i.outerHeight();
      }
      i.css(r);
    }),
    (s.prototype.show = function () {
      if (!this.isShown) {
        o(this.options.beforeShow);
        var t = this;
        this.isAppended ||
          ((c = n(document.body).append(this.popover)),
          r.on("resize.clockpicker" + this.id, function () {
            t.isShown && t.locate();
          }),
          (this.isAppended = !0));
        var e = (
          (this.input.prop("value") || this.options["default"] || "") + ""
        ).split(":");
        if ("now" === e[0]) {
          var s = new Date(+new Date() + this.options.fromnow);
          e = [s.getHours(), s.getMinutes()];
        }
        (this.hours = +e[0] || 0),
          (this.minutes = +e[1] || 0),
          this.spanHours.html(i(this.hours)),
          this.spanMinutes.html(i(this.minutes)),
          this.toggleView("hours"),
          this.locate(),
          (this.isShown = !0),
          a.on(
            "click.clockpicker." + this.id + " focusin.clockpicker." + this.id,
            function (i) {
              var e = n(i.target);
              0 === e.closest(t.popover).length &&
                0 === e.closest(t.addon).length &&
                0 === e.closest(t.input).length &&
                t.hide();
            }
          ),
          a.on("keyup.clockpicker." + this.id, function (i) {
            27 === i.keyCode && t.hide();
          }),
          o(this.options.afterShow);
      }
    }),
    (s.prototype.hide = function () {
      o(this.options.beforeHide),
        (this.isShown = !1),
        a.off(
          "click.clockpicker." + this.id + " focusin.clockpicker." + this.id
        ),
        a.off("keyup.clockpicker." + this.id),
        this.popover.hide(),
        o(this.options.afterHide);
    }),
    (s.prototype.toggleView = function (t, i) {
      var e = !1;
      "minutes" === t &&
        "visible" === n(this.hoursView).css("visibility") &&
        (o(this.options.beforeHourSelect), (e = !0));
      var s = "hours" === t,
        c = s ? this.hoursView : this.minutesView,
        r = s ? this.minutesView : this.hoursView;
      (this.currentView = t),
        this.spanHours.toggleClass("text-primary", s),
        this.spanMinutes.toggleClass("text-primary", !s),
        r.addClass("clockpicker-dial-out"),
        c.css("visibility", "visible").removeClass("clockpicker-dial-out"),
        this.resetClock(i),
        clearTimeout(this.toggleViewTimer),
        (this.toggleViewTimer = setTimeout(function () {
          r.css("visibility", "hidden");
        }, A)),
        e && o(this.options.afterHourSelect);
    }),
    (s.prototype.resetClock = function (t) {
      var i = this.currentView,
        e = this[i],
        s = "hours" === i,
        o = Math.PI / (s ? 6 : 30),
        c = e * o,
        n = s && e > 0 && 13 > e ? w : g,
        r = Math.sin(c) * n,
        a = -Math.cos(c) * n,
        p = this;
      l && t
        ? (p.canvas.addClass("clockpicker-canvas-out"),
          setTimeout(function () {
            p.canvas.removeClass("clockpicker-canvas-out"), p.setHand(r, a);
          }, t))
        : this.setHand(r, a);
    }),
    (s.prototype.setHand = function (t, e, s, o) {
      var c,
        r = Math.atan2(t, -e),
        a = "hours" === this.currentView,
        p = Math.PI / (a || s ? 6 : 30),
        h = Math.sqrt(t * t + e * e),
        u = this.options,
        k = a && (g + w) / 2 > h,
        d = k ? w : g;
      if (
        (u.twelvehour && (d = g),
        0 > r && (r = 2 * Math.PI + r),
        (c = Math.round(r / p)),
        (r = c * p),
        u.twelvehour
          ? a
            ? 0 === c && (c = 12)
            : (s && (c *= 5), 60 === c && (c = 0))
          : a
          ? (12 === c && (c = 0),
            (c = k ? (0 === c ? 12 : c) : 0 === c ? 0 : c + 12))
          : (s && (c *= 5), 60 === c && (c = 0)),
        this[this.currentView] !== c &&
          v &&
          this.options.vibrate &&
          (this.vibrateTimer ||
            (navigator[v](10),
            (this.vibrateTimer = setTimeout(
              n.proxy(function () {
                this.vibrateTimer = null;
              }, this),
              100
            )))),
        (this[this.currentView] = c),
        this[a ? "spanHours" : "spanMinutes"].html(i(c)),
        !l)
      )
        return void this[a ? "hoursView" : "minutesView"]
          .find(".clockpicker-tick")
          .each(function () {
            var t = n(this);
            t.toggleClass("active", c === +t.html());
          });
      o || (!a && c % 5)
        ? (this.g.insertBefore(this.hand, this.bearing),
          this.g.insertBefore(this.bg, this.fg),
          this.bg.setAttribute(
            "class",
            "clockpicker-canvas-bg clockpicker-canvas-bg-trans"
          ))
        : (this.g.insertBefore(this.hand, this.bg),
          this.g.insertBefore(this.fg, this.bg),
          this.bg.setAttribute("class", "clockpicker-canvas-bg"));
      var f = Math.sin(r) * d,
        m = -Math.cos(r) * d;
      this.hand.setAttribute("x2", f),
        this.hand.setAttribute("y2", m),
        this.bg.setAttribute("cx", f),
        this.bg.setAttribute("cy", m),
        this.fg.setAttribute("cx", f),
        this.fg.setAttribute("cy", m);
    }),
    (s.prototype.done = function () {
      o(this.options.beforeDone), this.hide();
      var t = this.input.prop("value"),
        e = i(this.hours) + ":" + i(this.minutes);
      this.options.twelvehour && (e += this.amOrPm),
        this.input.prop("value", e),
        e !== t &&
          (this.input.triggerHandler("change"),
          this.isInput || this.element.trigger("change")),
        this.options.autoclose && this.input.trigger("blur"),
        o(this.options.afterDone);
    }),
    (s.prototype.remove = function () {
      this.element.removeData("clockpicker"),
        this.input.off("focus.clockpicker click.clockpicker"),
        this.addon.off("click.clockpicker"),
        this.isShown && this.hide(),
        this.isAppended &&
          (r.off("resize.clockpicker" + this.id), this.popover.remove());
    }),
    (n.fn.clockpicker = function (t) {
      var i = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var e = n(this),
          o = e.data("clockpicker");
        if (o) "function" == typeof o[t] && o[t].apply(o, i);
        else {
          var c = n.extend({}, s.DEFAULTS, e.data(), "object" == typeof t && t);
          e.data("clockpicker", new s(e, c));
        }
      });
    });
})();

// カレンダー　　後藤早輝
/*!
 * @authors yusen
 * @date    2017-01-04 21:34:19
 * @github  https://github.com/yscoder/Calendar
 */
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define("calendar", ["jquery"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(root.jQuery);
  }
})(this, function ($) {
  // default config

  var defaults = {
      width: 280,
      height: 280,

      zIndex: 1,

      // selector
      trigger: null,

      // trigger
      offset: [0, 1],

      customClass: "",

      // date, month
      view: "date",

      date: new Date(),
      format: "yyyy/mm/dd",

      startWeek: 0,

      weekArray: ["日", "一", "二", "三", "四", "五", "六"],

      monthArray: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],

      selectedRang: null,

      data: null,

      label: "{d}\n{v}",

      prev: "&lt;",
      next: "&gt;",

      viewChange: $.noop,

      onSelected: function (view, date, value) {
        // body...
      },

      onMouseenter: $.noop,

      onClose: $.noop,
    },
    // static variable

    ACTION_NAMESPACE = "data-calendar-",
    DISPLAY_VD = "[" + ACTION_NAMESPACE + "display-date]",
    DISPLAY_VM = "[" + ACTION_NAMESPACE + "display-month]",
    ARROW_DATE = "[" + ACTION_NAMESPACE + "arrow-date]",
    ARROW_MONTH = "[" + ACTION_NAMESPACE + "arrow-month]",
    ITEM_DAY = ACTION_NAMESPACE + "day",
    ITEM_MONTH = ACTION_NAMESPACE + "month",
    DISABLED = "disabled",
    MARK_DATA = "markData",
    VIEW_CLASS = {
      date: "calendar-d",
      month: "calendar-m",
    },
    OLD_DAY_CLASS = "old",
    NEW_DAY_CLASS = "new",
    TODAY_CLASS = "now",
    SELECT_CLASS = "selected",
    MARK_DAY_HTML = '<i class="dot"></i>',
    DATE_DIS_TPL = '{year}/<span class="m">{month}</span>',
    ITEM_STYLE = 'style="width:{w}px;height:{h}px;line-height:{h}px"',
    WEEK_ITEM_TPL = "<li " + ITEM_STYLE + ">{wk}</li>",
    DAY_ITEM_TPL =
      "<li " + ITEM_STYLE + ' class="{class}" {action}="{date}">{value}</li>',
    MONTH_ITEM_TPL = "<li " + ITEM_STYLE + " " + ITEM_MONTH + ">{m}</li>",
    TEMPLATE = [
      '<div class="calendar-inner">',
      '<div class="calendar-views">',
      '<div class="view view-date">',
      '<div class="calendar-hd">',
      '<a href="javascript:;" data-calendar-display-date class="calendar-display">',
      '{yyyy}/<span class="m">{mm}</span>',
      "</a>",
      '<div class="calendar-arrow">',
      '<span class="prev" data-calendar-arrow-date>{prev}</span>',
      '<span class="next" data-calendar-arrow-date>{next}</span>',
      "</div>",
      "</div>",
      '<div class="calendar-ct">',
      '<ol class="week">{week}</ol>',
      '<ul class="date-items"></ul>',
      "</div>",
      "</div>",
      '<div class="view view-month">',
      '<div class="calendar-hd">',
      '<a href="javascript:;" data-calendar-display-month class="calendar-display">{yyyy}</a>',
      '<div class="calendar-arrow">',
      '<span class="prev" data-calendar-arrow-month>{prev}</span>',
      '<span class="next" data-calendar-arrow-month>{next}</span>',
      "</div>",
      "</div>",
      '<ol class="calendar-ct month-items">{month}</ol>',
      "</div>",
      "</div>",
      "</div>",
      '<div class="calendar-label"><p>HelloWorld</p><i></i></div>',
    ],
    OS = Object.prototype.toString;

  // utils

  function isDate(obj) {
    return OS.call(obj) === "[object Date]";
  }

  function isString(obj) {
    return OS.call(obj) === "[object String]";
  }

  function getClass(el) {
    return el.getAttribute("class") || el.getAttribute("className");
  }

  // extension methods

  String.prototype.repeat = function (data) {
    return this.replace(/\{\w+\}/g, function (str) {
      var prop = str.replace(/\{|\}/g, "");
      return data[prop] || "";
    });
  };

  String.prototype.toDate = function () {
    var dt = new Date(),
      dot = this.replace(/\d/g, "").charAt(0),
      arr = this.split(dot);

    return new Date(parseInt(arr[0]), parseInt(arr[1]) - 1, parseInt(arr[2]));
  };

  Date.prototype.format = function (exp) {
    var y = this.getFullYear(),
      m = this.getMonth() + 1,
      d = this.getDate();

    return exp.replace("yyyy", y).replace("mm", m).replace("dd", d);
  };

  Date.prototype.isSame = function (y, m, d) {
    if (isDate(y)) {
      var dt = y;
      y = dt.getFullYear();
      m = dt.getMonth() + 1;
      d = dt.getDate();
    }
    return (
      this.getFullYear() === y &&
      this.getMonth() + 1 === m &&
      this.getDate() === d
    );
  };

  Date.prototype.add = function (n) {
    this.setDate(this.getDate() + n);
  };

  Date.prototype.minus = function (n) {
    this.setDate(this.getDate() - n);
  };

  Date.prototype.clearTime = function (n) {
    this.setHours(0);
    this.setSeconds(0);
    this.setMinutes(0);
    this.setMilliseconds(0);
    return this;
  };

  Date.isLeap = function (y) {
    return (y % 100 !== 0 && y % 4 === 0) || y % 400 === 0;
  };

  Date.getDaysNum = function (y, m) {
    var num = 31;

    switch (m) {
      case 2:
        num = this.isLeap(y) ? 29 : 28;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        num = 30;
        break;
    }
    return num;
  };

  Date.getSiblingsMonth = function (y, m, n) {
    var d = new Date(y, m - 1);
    d.setMonth(m - 1 + n);
    return {
      y: d.getFullYear(),
      m: d.getMonth() + 1,
    };
  };

  Date.getPrevMonth = function (y, m, n) {
    return this.getSiblingsMonth(y, m, 0 - (n || 1));
  };

  Date.getNextMonth = function (y, m, n) {
    return this.getSiblingsMonth(y, m, n || 1);
  };

  Date.tryParse = function (obj) {
    if (!obj) {
      return obj;
    }
    return isDate(obj) ? obj : obj.toDate();
  };

  // Calendar class

  function Calendar(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.calendar.defaults, options);
    this.$element.addClass("calendar " + this.options.customClass);
    this.width = this.options.width;
    this.height = this.options.height;
    this.date = this.options.date;
    this.selectedRang = this.options.selectedRang;
    this.data = this.options.data;
    this.init();
  }

  Calendar.prototype = {
    constructor: Calendar,
    getDayAction: function (day) {
      var action = ITEM_DAY;
      if (this.selectedRang) {
        var start = Date.tryParse(this.selectedRang[0]),
          end = Date.tryParse(this.selectedRang[1]);

        if (
          (start && day < start.clearTime()) ||
          (end && day > end.clearTime())
        ) {
          action = DISABLED;
        }
      }

      return action;
    },
    getDayData: function (day) {
      var ret,
        data = this.data;

      if (data) {
        for (var i = 0, len = data.length; i < len; i++) {
          var item = data[i];

          if (day.isSame(Date.tryParse(item.date))) {
            ret = item.value;
          }
        }
      }

      return ret;
    },
    getDayItem: function (y, m, d, f) {
      var dt = this.date,
        idt = new Date(y, m - 1, d),
        data = {
          w: this.width / 7,
          h: this.height / 7,
          value: d,
        },
        markData,
        $item;

      var selected = dt.isSame(y, m, d) ? SELECT_CLASS : "";
      if (f === 1) {
        data["class"] = OLD_DAY_CLASS;
      } else if (f === 3) {
        data["class"] = NEW_DAY_CLASS;
      } else {
        data["class"] = "";
      }

      if (dt.isSame(y, m, d)) {
        data["class"] += " " + TODAY_CLASS;
      }

      data.date = idt.format(this.options.format);
      data.action = this.getDayAction(idt);
      markData = this.getDayData(idt);

      $item = $(DAY_ITEM_TPL.repeat(data));

      if (markData) {
        $item.data(MARK_DATA, markData);
        $item.html(d + MARK_DAY_HTML);
      }

      return $item;
    },
    getDaysHtml: function (y, m) {
      var year,
        month,
        firstWeek,
        daysNum,
        prevM,
        prevDiff,
        dt = this.date,
        $days = $('<ol class="days"></ol>');

      if (isDate(y)) {
        year = y.getFullYear();
        month = y.getMonth() + 1;
      } else {
        year = Number(y);
        month = Number(m);
      }

      firstWeek = new Date(year, month - 1, 1).getDay() || 7;
      prevDiff = firstWeek - this.options.startWeek;
      daysNum = Date.getDaysNum(year, month);
      prevM = Date.getPrevMonth(year, month);
      prevDaysNum = Date.getDaysNum(year, prevM.m);
      nextM = Date.getNextMonth(year, month);
      // month flag
      var PREV_FLAG = 1,
        CURR_FLAG = 2,
        NEXT_FLAG = 3,
        count = 0;

      for (var p = prevDaysNum - prevDiff + 1; p <= prevDaysNum; p++, count++) {
        $days.append(this.getDayItem(prevM.y, prevM.m, p, PREV_FLAG));
      }

      for (var c = 1; c <= daysNum; c++, count++) {
        $days.append(this.getDayItem(year, month, c, CURR_FLAG));
      }

      for (var n = 1, nl = 42 - count; n <= nl; n++) {
        $days.append(this.getDayItem(nextM.y, nextM.m, n, NEXT_FLAG));
      }

      return $("<li></li>").width(this.options.width).append($days);
    },
    getWeekHtml: function () {
      var week = [],
        weekArray = this.options.weekArray,
        start = this.options.startWeek,
        len = weekArray.length,
        w = this.width / 7,
        h = this.height / 7;

      for (var i = start; i < len; i++) {
        week.push(
          WEEK_ITEM_TPL.repeat({
            w: w,
            h: h,
            wk: weekArray[i],
          })
        );
      }

      for (var j = 0; j < start; j++) {
        week.push(
          WEEK_ITEM_TPL.repeat({
            w: w,
            h: h,
            wk: weekArray[j],
          })
        );
      }

      return week.join("");
    },
    getMonthHtml: function () {
      var monthArray = this.options.monthArray,
        month = [],
        w = this.width / 4,
        h = this.height / 4,
        i = 0;

      for (; i < 12; i++) {
        month.push(
          MONTH_ITEM_TPL.repeat({
            w: w,
            h: h,
            m: monthArray[i],
          })
        );
      }

      return month.join("");
    },
    setMonthAction: function (y) {
      var m = this.date.getMonth() + 1;

      this.$monthItems.children().removeClass(TODAY_CLASS);
      if (y === this.date.getFullYear()) {
        this.$monthItems
          .children()
          .eq(m - 1)
          .addClass(TODAY_CLASS);
      }
    },
    fillStatic: function () {
      var staticData = {
        prev: this.options.prev,
        next: this.options.next,
        week: this.getWeekHtml(),
        month: this.getMonthHtml(),
      };

      this.$element.html(TEMPLATE.join("").repeat(staticData));
    },
    updateDisDate: function (y, m) {
      this.$disDate.html(
        DATE_DIS_TPL.repeat({
          year: y,
          month: m,
        })
      );
    },
    updateDisMonth: function (y) {
      this.$disMonth.html(y);
    },
    fillDateItems: function (y, m) {
      var ma = [
        Date.getPrevMonth(y, m),
        {
          y: y,
          m: m,
        },
        Date.getNextMonth(y, m),
      ];

      this.$dateItems.html("");
      for (var i = 0; i < 3; i++) {
        var $item = this.getDaysHtml(ma[i].y, ma[i].m);
        this.$dateItems.append($item);
      }
    },
    hide: function (view, date, data) {
      this.$trigger.val(date.format(this.options.format));
      this.options.onClose.call(this, view, date, data);
      this.$element.hide();
    },
    setPosition: function () {
      var post = this.$trigger.offset();
      var offs = this.options.offset;

      this.$element.css({
        left: post.left + offs[0] + "px",
        top: post.top + this.$trigger.outerHeight() + offs[1] + "px",
      });
    },
    trigger: function () {
      this.$trigger = $(this.options.trigger);

      var _this = this,
        $this = _this.$element;

      $this.addClass("calendar-modal").css("zIndex", _this.options.zIndex);

      $(document)
        .click(function (e) {
          if (
            _this.$trigger[0] != e.target &&
            !$.contains($this[0], e.target)
          ) {
            $this.hide();
          }
        })
        .on("click", this.options.trigger, function () {
          this.$trigger = $(this);
          _this.setPosition();
          $this.show();
        });

      $(window).resize(function () {
        _this.setPosition();
      });
    },
    render: function () {
      this.$week = this.$element.find(".week");
      this.$dateItems = this.$element.find(".date-items");
      this.$monthItems = this.$element.find(".month-items");
      this.$label = this.$element.find(".calendar-label");
      this.$disDate = this.$element.find(DISPLAY_VD);
      this.$disMonth = this.$element.find(DISPLAY_VM);

      var y = this.date.getFullYear(),
        m = this.date.getMonth() + 1;

      this.updateDisDate(y, m);
      this.updateMonthView(y);

      this.fillDateItems(y, m);

      this.options.trigger && this.trigger();
    },
    setView: function (view) {
      this.$element
        .removeClass(VIEW_CLASS.date + " " + VIEW_CLASS.month)
        .addClass(VIEW_CLASS[view]);
      this.view = view;
    },
    updateDateView: function (y, m, dirc, cb) {
      m = m || this.date.getMonth() + 1;

      var _this = this,
        $dis = this.$dateItems,
        exec = {
          prev: function () {
            var pm = Date.getPrevMonth(y, m),
              ppm = Date.getPrevMonth(y, m, 2),
              $prevItem = _this.getDaysHtml(ppm.y, ppm.m);

            m = pm.m;
            y = pm.y;

            $dis.animate(
              {
                marginLeft: 0,
              },
              300,
              "swing",
              function () {
                $dis.children(":last").remove();
                $dis.prepend($prevItem).css("margin-left", "-100%");

                $.isFunction(cb) && cb.call(_this);
              }
            );
          },
          next: function () {
            var nm = Date.getNextMonth(y, m),
              nnm = Date.getNextMonth(y, m, 2),
              $nextItem = _this.getDaysHtml(nnm.y, nnm.m);

            m = nm.m;
            y = nm.y;

            $dis.animate(
              {
                marginLeft: "-200%",
              },
              300,
              "swing",
              function () {
                $dis.children(":first").remove();
                $dis.append($nextItem).css("margin-left", "-100%");

                $.isFunction(cb) && cb.call(_this);
              }
            );
          },
        };

      if (dirc) {
        exec[dirc]();
      } else {
        this.fillDateItems(y, m);
      }

      this.updateDisDate(y, m);

      this.setView("date");

      return {
        y: y,
        m: m,
      };
    },
    updateMonthView: function (y) {
      this.updateDisMonth(y);
      this.setMonthAction(y);
      this.setView("month");
    },
    getDisDateValue: function () {
      var arr = this.$disDate.html().split("/"),
        y = Number(arr[0]),
        m = Number(arr[1].match(/\d{1,2}/)[0]);

      return [y, m];
    },
    selectedDay: function (d, type) {
      var arr = this.getDisDateValue(),
        y = arr[0],
        m = arr[1],
        toggleClass = function () {
          this.$dateItems
            .children(":eq(1)")
            .find(
              "[" +
                ITEM_DAY +
                "]:not(." +
                NEW_DAY_CLASS +
                ", ." +
                OLD_DAY_CLASS +
                ")"
            )
            .removeClass(SELECT_CLASS)
            .filter(function (index) {
              return parseInt(this.innerHTML) === d;
            })
            .addClass(SELECT_CLASS);
        };

      if (type) {
        var ret = this.updateDateView(
          y,
          m,
          {
            old: "prev",
            new: "next",
          }[type],
          toggleClass
        );
        y = ret.y;
        m = ret.m;
        this.options.viewChange("date", y, m);
      } else {
        toggleClass.call(this);
      }

      return new Date(y, m - 1, d);
    },
    showLabel: function (event, view, date, data) {
      var $lbl = this.$label;

      $lbl.find("p").html(
        this.options.label
          .repeat({
            m: view,
            d: date.format(this.options.format),
            v: data,
          })
          .replace(/\n/g, "<br>")
      );

      var w = $lbl.outerWidth(),
        h = $lbl.outerHeight();

      $lbl
        .css({
          left: event.pageX - w / 2 + "px",
          top: event.pageY - h - 20 + "px",
          zIndex: this.options.zIndex + 1,
        })
        .show();
    },
    hasLabel: function () {
      if (this.options.label) {
        $("body").append(this.$label);
        return true;
      }
      return false;
    },
    event: function () {
      var _this = this,
        vc = _this.options.viewChange;

      // view change
      _this.$element
        .on("click", DISPLAY_VD, function () {
          var arr = _this.getDisDateValue();
          _this.updateMonthView(arr[0], arr[1]);

          vc("month", arr[0], arr[1]);
        })
        .on("click", DISPLAY_VM, function () {
          var y = this.innerHTML;

          _this.updateDateView(y);
          vc("date", y);
        });

      // arrow
      _this.$element
        .on("click", ARROW_DATE, function () {
          var arr = _this.getDisDateValue(),
            type = getClass(this),
            y = arr[0],
            m = arr[1];

          var d = _this.updateDateView(y, m, type, function () {
            vc("date", d.y, d.m);
          });
        })
        .on("click", ARROW_MONTH, function () {
          var y = Number(_this.$disMonth.html()),
            type = getClass(this);

          y = type === "prev" ? y - 1 : y + 1;
          _this.updateMonthView(y);
          vc("month", y);
        });

      // selected
      _this.$element
        .on("click", "[" + ITEM_DAY + "]", function () {
          var d = parseInt(this.innerHTML),
            cls = getClass(this),
            type = /new|old/.test(cls) ? cls.match(/new|old/)[0] : "";

          var day = _this.selectedDay(d, type);

          _this.options.onSelected.call(
            this,
            "date",
            day,
            $(this).data(MARK_DATA)
          );

          _this.$trigger && _this.hide("date", day, $(this).data(MARK_DATA));
        })
        .on("click", "[" + ITEM_MONTH + "]", function () {
          var y = Number(_this.$disMonth.html()),
            m = $(this).index() + 1;

          _this.updateDateView(y, m);
          vc("date", y, m);
          _this.options.onSelected.call(this, "month", new Date(y, m - 1));
        });

      // hover
      _this.$element
        .on("mouseenter", "[" + ITEM_DAY + "]", function (e) {
          var $this = $(this),
            day = $this.attr(ITEM_DAY).toDate();

          if (_this.hasLabel() && $this.data(MARK_DATA)) {
            _this.showLabel(e, "date", day, $this.data(MARK_DATA));
          }

          _this.options.onMouseenter.call(
            this,
            "date",
            day,
            $this.data(MARK_DATA)
          );
        })
        .on("mouseleave", "[" + ITEM_DAY + "]", function () {
          _this.$label.hide();
        });
    },
    resize: function () {
      var w = this.width,
        h = this.height,
        hdH = this.$element.find(".calendar-hd").outerHeight();

      this.$element
        .width(w)
        .height(h + hdH)
        .find(".calendar-inner, .view")
        .css("width", w + "px");

      this.$element.find(".calendar-ct").width(w).height(h);
    },
    init: function () {
      this.fillStatic();
      this.resize();
      this.render();
      this.view = this.options.view;
      this.setView(this.view);
      this.event();
    },
    setData: function (data) {
      this.data = data;

      if (this.view === "date") {
        var d = this.getDisDateValue();
        this.fillDateItems(d[0], d[1]);
      } else if (this.view === "month") {
        this.updateMonthView(this.$disMonth.html());
      }
    },
    setDate: function (date) {
      var dateObj = Date.tryParse(date);
      this.updateDateView(dateObj.getFullYear(), dateObj.getMonth() + 1);
      this.selectedDay(dateObj.getDate());
    },
    methods: function (name, args) {
      if (OS.call(this[name]) === "[object Function]") {
        return this[name].apply(this, args);
      }
    },
  };

  $.fn.calendar = function (options) {
    var calendar = this.data("calendar"),
      fn,
      args = [].slice.call(arguments);

    if (!calendar) {
      return this.each(function () {
        return $(this).data("calendar", new Calendar(this, options));
      });
    }
    if (isString(options)) {
      fn = options;
      args.shift();
      return calendar.methods(fn, args);
    }

    return this;
  };

  $.fn.calendar.defaults = defaults;
});


// zoomログイン　後藤早輝
//Problem: Hints are shown even when form is valid
//Solution: Hide and show them at appropriate times
var $password = $("#password");
var $confirmPassword = $("#confirm_password");

//Hide hints
$("form span").hide();

function isPasswordValid() {
  return $password.val().length > 8;
}

function arePasswordsMatching() {
  return $password.val() === $confirmPassword.val();
}

function canSubmit() {
  return isPasswordValid() && arePasswordsMatching();
}

function passwordEvent() {
  //Find out if password is valid
  if (isPasswordValid()) {
    //Hide hint if valid
    $password.next().hide();
  } else {
    //else show hint
    $password.next().show();
  }
}

function confirmPasswordEvent() {
  //Find out if password and confirmation match
  if (arePasswordsMatching()) {
    //Hide hint if match
    $confirmPassword.next().hide();
  } else {
    //else show hint
    $confirmPassword.next().show();
  }
}

function enableSubmitEvent() {
  $("#submit").prop("disabled", !canSubmit());
}

//When event happens on password input
$password
  .focus(passwordEvent)
  .keyup(passwordEvent)
  .keyup(confirmPasswordEvent)
  .keyup(enableSubmitEvent);

//When event happens on confirmation input
$confirmPassword
  .focus(confirmPasswordEvent)
  .keyup(confirmPasswordEvent)
  .keyup(enableSubmitEvent);

enableSubmitEvent();

// 時間入力　　後藤早輝
/*!
 * ClockPicker v0.0.7 (http://weareoutman.github.io/clockpicker/)
 * Copyright 2014 Wang Shenwei.
 * Licensed under MIT (https://github.com/weareoutman/clockpicker/blob/master/LICENSE)
 */
!(function () {
  function t(t) {
    return document.createElementNS(a, t);
  }
  function i(t) {
    return (10 > t ? "0" : "") + t;
  }
  function e(t) {
    var i = ++v + "";
    return t ? t + i : i;
  }
  function s(s, n) {
    function a(t, i) {
      var e = h.offset(),
        s = /^touch/.test(t.type),
        c = e.left + m,
        a = e.top + m,
        l = (s ? t.originalEvent.touches[0] : t).pageX - c,
        u = (s ? t.originalEvent.touches[0] : t).pageY - a,
        f = Math.sqrt(l * l + u * u),
        v = !1;
      if (!i || !(g - w > f || f > g + w)) {
        t.preventDefault();
        var b = setTimeout(function () {
          o.addClass("clockpicker-moving");
        }, 200);
        p && h.append(H.canvas),
          H.setHand(l, u, !i, !0),
          r.off(k).on(k, function (t) {
            t.preventDefault();
            var i = /^touch/.test(t.type),
              e = (i ? t.originalEvent.touches[0] : t).pageX - c,
              s = (i ? t.originalEvent.touches[0] : t).pageY - a;
            (v || e !== l || s !== u) && ((v = !0), H.setHand(e, s, !1, !0));
          }),
          r.off(d).on(d, function (t) {
            r.off(d), t.preventDefault();
            var e = /^touch/.test(t.type),
              s = (e ? t.originalEvent.changedTouches[0] : t).pageX - c,
              p = (e ? t.originalEvent.changedTouches[0] : t).pageY - a;
            (i || v) && s === l && p === u && H.setHand(s, p),
              "hours" === H.currentView
                ? H.toggleView("minutes", M / 2)
                : n.autoclose &&
                  (H.minutesView.addClass("clockpicker-dial-out"),
                  setTimeout(function () {
                    H.done();
                  }, M / 2)),
              h.prepend(O),
              clearTimeout(b),
              o.removeClass("clockpicker-moving"),
              r.off(k);
          });
      }
    }
    var l = c(A),
      h = l.find(".clockpicker-plate"),
      f = l.find(".clockpicker-hours"),
      v = l.find(".clockpicker-minutes"),
      T = l.find(".clockpicker-am-pm-block"),
      V = "INPUT" === s.prop("tagName"),
      C = V ? s : s.find("input"),
      P = s.find(".input-group-addon"),
      H = this;
    if (
      ((this.id = e("cp")),
      (this.element = s),
      (this.options = n),
      (this.isAppended = !1),
      (this.isShown = !1),
      (this.currentView = "hours"),
      (this.isInput = V),
      (this.input = C),
      (this.addon = P),
      (this.popover = l),
      (this.plate = h),
      (this.hoursView = f),
      (this.minutesView = v),
      (this.amPmBlock = T),
      (this.spanHours = l.find(".clockpicker-span-hours")),
      (this.spanMinutes = l.find(".clockpicker-span-minutes")),
      (this.spanAmPm = l.find(".clockpicker-span-am-pm")),
      (this.amOrPm = "PM"),
      n.twelvehour)
    ) {
      {
        var x = [
          '<div class="clockpicker-am-pm-block">',
          '<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">',
          "AM</button>",
          '<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">',
          "PM</button>",
          "</div>",
        ].join("");
        c(x);
      }
      c(
        '<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">AM</button>'
      )
        .on("click", function () {
          (H.amOrPm = "AM"), c(".clockpicker-span-am-pm").empty().append("AM");
        })
        .appendTo(this.amPmBlock),
        c(
          '<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">PM</button>'
        )
          .on("click", function () {
            (H.amOrPm = "PM"),
              c(".clockpicker-span-am-pm").empty().append("PM");
          })
          .appendTo(this.amPmBlock);
    }
    n.autoclose ||
      c(
        '<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button">' +
          n.donetext +
          "</button>"
      )
        .click(c.proxy(this.done, this))
        .appendTo(l),
      ("top" !== n.placement && "bottom" !== n.placement) ||
        ("top" !== n.align && "bottom" !== n.align) ||
        (n.align = "left"),
      ("left" !== n.placement && "right" !== n.placement) ||
        ("left" !== n.align && "right" !== n.align) ||
        (n.align = "top"),
      l.addClass(n.placement),
      l.addClass("clockpicker-align-" + n.align),
      this.spanHours.click(c.proxy(this.toggleView, this, "hours")),
      this.spanMinutes.click(c.proxy(this.toggleView, this, "minutes")),
      C.on("focus.clockpicker click.clockpicker", c.proxy(this.show, this)),
      P.on("click.clockpicker", c.proxy(this.toggle, this));
    var E,
      S,
      I,
      D = c('<div class="clockpicker-tick"></div>');
    if (n.twelvehour)
      for (E = 1; 13 > E; E += 1) {
        (S = D.clone()), (I = (E / 6) * Math.PI);
        var B = g;
        S.css("font-size", "120%"),
          S.css({
            left: m + Math.sin(I) * B - w,
            top: m - Math.cos(I) * B - w,
          }),
          S.html(0 === E ? "00" : E),
          f.append(S),
          S.on(u, a);
      }
    else
      for (E = 0; 24 > E; E += 1) {
        (S = D.clone()), (I = (E / 6) * Math.PI);
        var z = E > 0 && 13 > E,
          B = z ? b : g;
        S.css({ left: m + Math.sin(I) * B - w, top: m - Math.cos(I) * B - w }),
          z && S.css("font-size", "120%"),
          S.html(0 === E ? "00" : E),
          f.append(S),
          S.on(u, a);
      }
    for (E = 0; 60 > E; E += 5)
      (S = D.clone()),
        (I = (E / 30) * Math.PI),
        S.css({ left: m + Math.sin(I) * g - w, top: m - Math.cos(I) * g - w }),
        S.css("font-size", "120%"),
        S.html(i(E)),
        v.append(S),
        S.on(u, a);
    if (
      (h.on(u, function (t) {
        0 === c(t.target).closest(".clockpicker-tick").length && a(t, !0);
      }),
      p)
    ) {
      var O = l.find(".clockpicker-canvas"),
        j = t("svg");
      j.setAttribute("class", "clockpicker-svg"),
        j.setAttribute("width", y),
        j.setAttribute("height", y);
      var L = t("g");
      L.setAttribute("transform", "translate(" + m + "," + m + ")");
      var U = t("circle");
      U.setAttribute("class", "clockpicker-canvas-bearing"),
        U.setAttribute("cx", 0),
        U.setAttribute("cy", 0),
        U.setAttribute("r", 2);
      var W = t("line");
      W.setAttribute("x1", 0), W.setAttribute("y1", 0);
      var N = t("circle");
      N.setAttribute("class", "clockpicker-canvas-bg"), N.setAttribute("r", w);
      var X = t("circle");
      X.setAttribute("class", "clockpicker-canvas-fg"),
        X.setAttribute("r", 3.5),
        L.appendChild(W),
        L.appendChild(N),
        L.appendChild(X),
        L.appendChild(U),
        j.appendChild(L),
        O.append(j),
        (this.hand = W),
        (this.bg = N),
        (this.fg = X),
        (this.bearing = U),
        (this.g = L),
        (this.canvas = O);
    }
  }
  var o,
    c = window.jQuery,
    n = c(window),
    r = c(document),
    a = "http://www.w3.org/2000/svg",
    p =
      "SVGAngle" in window &&
      (function () {
        var t,
          i = document.createElement("div");
        return (
          (i.innerHTML = "<svg/>"),
          (t = (i.firstChild && i.firstChild.namespaceURI) == a),
          (i.innerHTML = ""),
          t
        );
      })(),
    l = (function () {
      var t = document.createElement("div").style;
      return (
        "transition" in t ||
        "WebkitTransition" in t ||
        "MozTransition" in t ||
        "msTransition" in t ||
        "OTransition" in t
      );
    })(),
    h = "ontouchstart" in window,
    u = "mousedown" + (h ? " touchstart" : ""),
    k = "mousemove.clockpicker" + (h ? " touchmove.clockpicker" : ""),
    d = "mouseup.clockpicker" + (h ? " touchend.clockpicker" : ""),
    f = navigator.vibrate
      ? "vibrate"
      : navigator.webkitVibrate
      ? "webkitVibrate"
      : null,
    v = 0,
    m = 100,
    g = 80,
    b = 54,
    w = 13,
    y = 2 * m,
    M = l ? 350 : 1,
    A = [
      '<div class="popover clockpicker-popover">',
      '<div class="arrow"></div>',
      '<div class="popover-title">',
      '<span class="clockpicker-span-hours text-primary"></span>',
      " : ",
      '<span class="clockpicker-span-minutes"></span>',
      '<span class="clockpicker-span-am-pm"></span>',
      "</div>",
      '<div class="popover-content">',
      '<div class="clockpicker-plate">',
      '<div class="clockpicker-canvas"></div>',
      '<div class="clockpicker-dial clockpicker-hours"></div>',
      '<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>',
      "</div>",
      '<span class="clockpicker-am-pm-block">',
      "</span>",
      "</div>",
      "</div>",
    ].join("");
  (s.DEFAULTS = {
    default: "",
    fromnow: 0,
    placement: "bottom",
    align: "left",
    donetext: "完成",
    autoclose: !1,
    twelvehour: !1,
    vibrate: !0,
  }),
    (s.prototype.toggle = function () {
      this[this.isShown ? "hide" : "show"]();
    }),
    (s.prototype.locate = function () {
      var t = this.element,
        i = this.popover,
        e = t.offset(),
        s = t.outerWidth(),
        o = t.outerHeight(),
        c = this.options.placement,
        n = this.options.align,
        r = {};
      switch ((i.show(), c)) {
        case "bottom":
          r.top = e.top + o;
          break;
        case "right":
          r.left = e.left + s;
          break;
        case "top":
          r.top = e.top - i.outerHeight();
          break;
        case "left":
          r.left = e.left - i.outerWidth();
      }
      switch (n) {
        case "left":
          r.left = e.left;
          break;
        case "right":
          r.left = e.left + s - i.outerWidth();
          break;
        case "top":
          r.top = e.top;
          break;
        case "bottom":
          r.top = e.top + o - i.outerHeight();
      }
      i.css(r);
    }),
    (s.prototype.show = function () {
      if (!this.isShown) {
        var t = this;
        this.isAppended ||
          ((o = c(document.body).append(this.popover)),
          n.on("resize.clockpicker" + this.id, function () {
            t.isShown && t.locate();
          }),
          (this.isAppended = !0));
        var e = (
          (this.input.prop("value") || this.options["default"] || "") + ""
        ).split(":");
        if ("now" === e[0]) {
          var s = new Date(+new Date() + this.options.fromnow);
          e = [s.getHours(), s.getMinutes()];
        }
        (this.hours = +e[0] || 0),
          (this.minutes = +e[1] || 0),
          this.spanHours.html(i(this.hours)),
          this.spanMinutes.html(i(this.minutes)),
          this.toggleView("hours"),
          this.locate(),
          (this.isShown = !0),
          r.on(
            "click.clockpicker." + this.id + " focusin.clockpicker." + this.id,
            function (i) {
              var e = c(i.target);
              0 === e.closest(t.popover).length &&
                0 === e.closest(t.addon).length &&
                0 === e.closest(t.input).length &&
                t.hide();
            }
          ),
          r.on("keyup.clockpicker." + this.id, function (i) {
            27 === i.keyCode && t.hide();
          });
      }
    }),
    (s.prototype.hide = function () {
      (this.isShown = !1),
        r.off(
          "click.clockpicker." + this.id + " focusin.clockpicker." + this.id
        ),
        r.off("keyup.clockpicker." + this.id),
        this.popover.hide();
    }),
    (s.prototype.toggleView = function (t, i) {
      var e = "hours" === t,
        s = e ? this.hoursView : this.minutesView,
        o = e ? this.minutesView : this.hoursView;
      (this.currentView = t),
        this.spanHours.toggleClass("text-primary", e),
        this.spanMinutes.toggleClass("text-primary", !e),
        o.addClass("clockpicker-dial-out"),
        s.css("visibility", "visible").removeClass("clockpicker-dial-out"),
        this.resetClock(i),
        clearTimeout(this.toggleViewTimer),
        (this.toggleViewTimer = setTimeout(function () {
          o.css("visibility", "hidden");
        }, M));
    }),
    (s.prototype.resetClock = function (t) {
      var i = this.currentView,
        e = this[i],
        s = "hours" === i,
        o = Math.PI / (s ? 6 : 30),
        c = e * o,
        n = s && e > 0 && 13 > e ? b : g,
        r = Math.sin(c) * n,
        a = -Math.cos(c) * n,
        l = this;
      p && t
        ? (l.canvas.addClass("clockpicker-canvas-out"),
          setTimeout(function () {
            l.canvas.removeClass("clockpicker-canvas-out"), l.setHand(r, a);
          }, t))
        : this.setHand(r, a);
    }),
    (s.prototype.setHand = function (t, e, s, o) {
      var n,
        r = Math.atan2(t, -e),
        a = "hours" === this.currentView,
        l = Math.PI / (a || s ? 6 : 30),
        h = Math.sqrt(t * t + e * e),
        u = this.options,
        k = a && (g + b) / 2 > h,
        d = k ? b : g;
      if (
        (u.twelvehour && (d = g),
        0 > r && (r = 2 * Math.PI + r),
        (n = Math.round(r / l)),
        (r = n * l),
        u.twelvehour
          ? a
            ? 0 === n && (n = 12)
            : (s && (n *= 5), 60 === n && (n = 0))
          : a
          ? (12 === n && (n = 0),
            (n = k ? (0 === n ? 12 : n) : 0 === n ? 0 : n + 12))
          : (s && (n *= 5), 60 === n && (n = 0)),
        this[this.currentView] !== n &&
          f &&
          this.options.vibrate &&
          (this.vibrateTimer ||
            (navigator[f](10),
            (this.vibrateTimer = setTimeout(
              c.proxy(function () {
                this.vibrateTimer = null;
              }, this),
              100
            )))),
        (this[this.currentView] = n),
        this[a ? "spanHours" : "spanMinutes"].html(i(n)),
        !p)
      )
        return void this[a ? "hoursView" : "minutesView"]
          .find(".clockpicker-tick")
          .each(function () {
            var t = c(this);
            t.toggleClass("active", n === +t.html());
          });
      o || (!a && n % 5)
        ? (this.g.insertBefore(this.hand, this.bearing),
          this.g.insertBefore(this.bg, this.fg),
          this.bg.setAttribute(
            "class",
            "clockpicker-canvas-bg clockpicker-canvas-bg-trans"
          ))
        : (this.g.insertBefore(this.hand, this.bg),
          this.g.insertBefore(this.fg, this.bg),
          this.bg.setAttribute("class", "clockpicker-canvas-bg"));
      var v = Math.sin(r) * d,
        m = -Math.cos(r) * d;
      this.hand.setAttribute("x2", v),
        this.hand.setAttribute("y2", m),
        this.bg.setAttribute("cx", v),
        this.bg.setAttribute("cy", m),
        this.fg.setAttribute("cx", v),
        this.fg.setAttribute("cy", m);
    }),
    (s.prototype.done = function () {
      this.hide();
      var t = this.input.prop("value"),
        e = i(this.hours) + ":" + i(this.minutes);
      this.options.twelvehour && (e += this.amOrPm),
        this.input.prop("value", e),
        e !== t &&
          (this.input.triggerHandler("change"),
          this.isInput || this.element.trigger("change")),
        this.options.autoclose && this.input.trigger("blur");
    }),
    (s.prototype.remove = function () {
      this.element.removeData("clockpicker"),
        this.input.off("focus.clockpicker click.clockpicker"),
        this.addon.off("click.clockpicker"),
        this.isShown && this.hide(),
        this.isAppended &&
          (n.off("resize.clockpicker" + this.id), this.popover.remove());
    }),
    (c.fn.clockpicker = function (t) {
      var i = Array.prototype.slice.call(arguments, 1);
      return this.each(function () {
        var e = c(this),
          o = e.data("clockpicker");
        if (o) "function" == typeof o[t] && o[t].apply(o, i);
        else {
          var n = c.extend({}, s.DEFAULTS, e.data(), "object" == typeof t && t);
          e.data("clockpicker", new s(e, n));
        }
      });
    });
})();

// 文字数カウント
function ShowLength(str) {
  document.getElementById("inputlength").innerHTML = str.length + "文字";
}

// 出品のバリデーション     松永暖月
function validateForm() {
  // 画像の選択
  var fileInput = document.getElementById("file");
  if (!fileInput.files.length) {
    alert("画像を選択してください");
    return false;
  }

  // 拡張子を取得
  var fileName = fileInput.value;
  var fileExtension = fileName.split(".").pop().toLowerCase();

  // 許可する画像形式のリスト
  var allowedExtensions = ["jpg", "jpeg", "png", "gif"];

  // 拡張子が許可されたものかどうかを確認
  if (allowedExtensions.indexOf(fileExtension) === -1) {
    alert("有効な画像形式（jpg, jpeg, png, gif）を選択してください");
    return false;
  }

  // 日付と時間の入力部分
  var meetingDateInput = document.getElementsByName("meeting_date_date")[0];
  var meetingDateValue = meetingDateInput.value.trim();
  if (!isValidDate(meetingDateValue)) {
    alert("有効な日付を入力してください");
    return false;
  }

  var meetingTimeInput = document.getElementsByName("meeting_date_time")[0];
  var meetingTimeValue = meetingTimeInput.value.trim();
  if (!isValidTime(meetingTimeValue)) {
    alert("有効な時間を入力してください");
    return false;
  }

  // 商品名の入力部分
  var itemNameInput = document.getElementsByName("name")[0];
  var itemNameValue = itemNameInput.value.trim();
  if (itemNameValue.length === 0 || itemNameValue.length > 20) {
    alert("商品名は1文字以上20文字以内で入力してください");
    return false;
  }

  // 商品の説明の入力部分
  var descriptionInput = document.getElementsByName("description")[0];
  var descriptionValue = descriptionInput.value.trim();
  if (descriptionValue.length < 2 || descriptionValue.length > 300) {
    alert("商品の説明は2文字以上300文字以下で入力してください");
    return false;
  }
  // 商品価格
  // var priceInput = document.getElementsByName('price')[0];
  // var priceValue = priceInput.value.trim();
  // var priceFloat = parseFloat(priceValue);

  // var regex = /^[0-9]+$/;

  // var startsWithYenSymbol = priceValue.startsWith('￥');

  // if (priceValue === '' || !regex.test(priceValue) || isNaN(priceFloat) || priceFloat < 1 || priceFloat > 99999999 ||
  // !startsWithYenSymbol) {
  //     alert('販売価格は1以上99999999以内の半角数字を入力してください');
  //     return false;
  // }

  // バリデーションがすべて通過した場合はtrueを返す
  return true;
}

// 日付のバリデーション
function isValidDate(dateString) {
  // 正規表現を使用して日付の形式を検証
  if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) {
    return false;
  }

  // 年、月、日を取得
  var dateParts = dateString.split("/");
  var year = parseInt(dateParts[0], 10);
  var month = parseInt(dateParts[1], 10) - 1; // 月は0から始まるため1を引く
  var day = parseInt(dateParts[2], 10);

  // 日付の妥当性を検証
  var dateObject = new Date(year, month, day);

  return (
    !isNaN(dateObject.getTime()) &&
    dateObject.getFullYear() === year &&
    dateObject.getMonth() === month &&
    dateObject.getDate() === day
  );
}

// 時間のバリデーション
function isValidTime(timeString) {
  // 正規表現を使用して時間の形式を検証
  if (!/^\d{2}:\d{2}$/.test(timeString)) {
    return false;
  }

  // 時間の範囲をチェック
  var timeParts = timeString.split(":");
  var hours = parseInt(timeParts[0], 10);
  var minutes = parseInt(timeParts[1], 10);

  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

// 購入のバリデーション     後藤早輝
function purchase_validateForm() {
  // ラジオボタン
  // チェックされている要素の個数を取る
  var radioOptions = document.getElementsByName("choice");
  var selectedOption = null;
  for (var i = 0; i < radioOptions.length; i++) {
    if (radioOptions[i].checked) {
      selectedOption = radioOptions[i].value;
      break;
    }
  }
  if (selectedOption === null) {
    alert("支払方法を選択してください。");
    return false;
  }

  // クレジットカードが選択されているか確認
  var credit = document.getElementById("radio_2");

  // カードの名義の入力部分
  var cardNameInput = document.getElementsByName("card_Nominee")[0];
  var cardNameValue = cardNameInput.value.trim();

  // カード番号
  var numberInput = document.getElementsByName("card_number")[0];
  var numberValue = numberInput.value.trim();
  var numberFloat = parseFloat(numberValue);

  // セキュリティコード
  var securityInput = document.getElementsByName("security")[0];
  var securityValue = securityInput.value.trim();
  var securityFloat = parseFloat(securityValue);

  // 全角を含まない半角数字の正規表現
  var regex = /^[0-9]+$/;

  if (credit.checked) {
    // 名義が入力されているか
    if (cardNameValue.length === 0) {
      alert("カードの名義を入力してください");
      return false;
    }

    // カード番号の入力形式
    else if (
      numberValue === "" ||
      !regex.test(numberValue) ||
      isNaN(numberFloat) ||
      numberValue.length !== 16
    ) {
      alert("カード番号を正しい形式で入力してください");
      return false;
    }

    // 有効期限のチェック
    else if (
      document.forms.select.month.value == "" ||
      document.forms.select.year.value == ""
    ) {
      alert("有効期限を選択してください");
      return false;
    }

    // セキュリティコードの入力形式
    else if (
      securityValue === "" ||
      !regex.test(securityValue) ||
      isNaN(securityFloat) ||
      securityValue.length !== 3
    ) {
      alert("セキュリティコードを正しい形式で入力してください");
      return false;
    }
  }

  // 0番目を選択した場合
  // if(selectBox.options[0].selected === true) {
  //     alert('選択は必須です');
  //     return false;
  // }

  // バリデーションがすべて通過した場合はtrueを返す
  return true;
}

function address_validateForm() {
  // 郵便番号
  var postalInput = document.getElementsByName("postal_code")[0];
  var postalValue = postalInput.value.trim();

  // 郵便番号の正規表現
  var postcode = /^\d{3}-?\d{4}$/g;

  if (postalValue === "" || !postcode.test(postalValue)) {
    alert("郵便番号を正しい形式で入力してください");
    return false;
  }

  // 都道府県
  var regionInput = document.getElementsByName("region")[0];
  var regionValue = regionInput.value.trim();

  // 都道府県の正規表現
  var prefectures = /^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)$/;

  if (regionValue.length === 0) {
    alert("都道府県を入力してください");
    return false;
  } else if (!prefectures.test(regionValue)) {
    alert("正しい都道府県名を入力してください");
    return false;
  }

  // 市区町村
  var localityInput = document.getElementsByName("locality")[0];
  var localityValue = localityInput.value.trim();

  if (localityValue.length === 0) {
    alert("市区町村を入力してください");
    return false;
  }

  // 番地
  var streetInput = document.getElementsByName("street_address")[0];
  var streetValue = streetInput.value.trim();

  if (streetValue.length === 0) {
    alert("番地を入力してください");
    return false;
  }

  // バリデーションがすべて通過した場合はtrueを返す
  return true;
}

// 管理者トップページ　川上奏大

// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById("sidebar");

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add("sidebar-responsive");
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove("sidebar-responsive");
    sidebarOpen = false;
  }
}

//　マスターテーブルメンテナンスページ　川上奏大
// BAR CHART

const barChartOptions = {
  series: [
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Free Cash Flow",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ],
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: ["#2e7d32", "#2962ff", "#d50000"],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    labels: {
      style: {
        colors: "#f5f7ff",
      },
    },
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
      style: {
        color: "#f5f7ff",
      },
    },
    labels: {
      style: {
        colors: "#f5f7ff",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    labels: {
      colors: "#f5f7ff",
    },
    show: true,
    position: "bottom",
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
};

const barChart = new ApexCharts(
  document.querySelector("#bar-chart"),
  barChartOptions
);
barChart.render();

// AREA CHART

const areaChartOptions = {
  series: [
    {
      name: "Purchase Orders",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Sales Orders",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ],
  chart: {
    type: "area",
    background: "transparent",
    height: 350,
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  colors: ["#00ab57", "#d50000"],
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  dataLabels: {
    enabled: false,
  },
  fill: {
    gradient: {
      opacityFrom: 0.4,
      opacityTo: 0.1,
      shadeIntensity: 1,
      stops: [0, 100],
      type: "vertical",
    },
    type: "gradient",
  },
  grid: {
    borderColor: "#55596e",
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  legend: {
    labels: {
      colors: "#f5f7ff",
    },
    show: true,
    position: "bottom",
  },
  markers: {
    size: 6,
    strokeColors: "#1b2635",
    strokeWidth: 3,
  },
  stroke: {
    curve: "smooth",
  },
  xaxis: {
    axisBorder: {
      color: "#55596e",
      show: true,
    },
    axisTicks: {
      color: "#55596e",
      show: true,
    },
    labels: {
      offsetY: 5,
      style: {
        colors: "#f5f7ff",
      },
    },
  },
  yaxis: [
    {
      title: {
        text: "Purchase Orders",
        style: {
          color: "#f5f7ff",
        },
      },
      labels: {
        style: {
          colors: ["#f5f7ff"],
        },
      },
    },
    {
      opposite: true,
      title: {
        text: "Sales Orders",
        style: {
          color: "#f5f7ff",
        },
      },
      labels: {
        style: {
          colors: ["#f5f7ff"],
        },
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    theme: "dark",
  },
};

const areaChart = new ApexCharts(
  document.querySelector("#area-chart"),
  areaChartOptions
);
areaChart.render();

//   index(トップページ) 川越謙臣
// Kawagoe
$(function () {
  $("#nav-search-select").change(function () {
    var selectedText = $(this).find("option:selected").text();
    $("#nav-search").find(".nav-search-label").html(selectedText);
  });
});

$(".slider").slick({
  autoplay: true, //自動的に動き出すか。初期値はfalse。
  infinite: true, //スライドをループさせるかどうか。初期値はtrue。
  speed: 30, //スライドのスピード。初期値は300。
  slidesToShow: 3, //スライドを画面に3枚見せる
  slidesToScroll: 1, //1回のスクロールで1枚の写真を移動して見せる
  prevArrow: '<div class="slick-prev"></div>', //矢印部分PreviewのHTMLを変更
  nextArrow: '<div class="slick-next"></div>', //矢印部分NextのHTMLを変更
  centerMode: true, //要素を中央ぞろえにする
  variableWidth: true, //幅の違う画像の高さを揃えて表示
  dots: true, //下部ドットナビゲーションの表示
});

// 動きのきっかけの起点となるアニメーションの名前を定義
function fadeAnime() {
  //4-1 ふわっ（下から）

  $(".fadeUpTrigger").each(function () {
    //fadeUpTriggerというクラス名が
    var elemPos = $(this).offset().top - 50; //要素より、50px上の
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      $(this).addClass("fadeUp"); // 画面内に入ったらfadeUpというクラス名を追記
    } else {
      $(this).removeClass("fadeUp"); // 画面外に出たらfadeUpというクラス名を外す
    }
  });
  // ふわっ

  $(".fadeInTrigger").each(function () {
    //fadeInTriggerというクラス名が
    var elemPos = $(this).offset().top - 50; //要素より、50px上の
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      $(this).addClass("fadeIn"); // 画面内に入ったらfadeInというクラス名を追記
    } else {
      $(this).removeClass("fadeIn"); // 画面外に出たらfadeInというクラス名を外す
    }
  });
}

// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function () {
  fadeAnime(); /* アニメーション用の関数を呼ぶ*/
}); // ここまで画面をスクロールをしたら動かしたい場合の記述

// 画面が読み込まれたらすぐに動かしたい場合の記述
$(window).on("load", function () {
  fadeAnime(); /* アニメーション用の関数を呼ぶ*/
}); // ここまで画面が読み込まれたらすぐに動かしたい場合の記述

// #page-topをクリックした際の設定
$(".page-top").click(function () {
  $("body,html").animate(
    {
      scrollTop: 0, //ページトップまでスクロール
    },
    500
  ); //ページトップスクロールの速さ。数字が大きいほど遅くなる
  return false; //リンク自体の無効化
});

function slideAnime() {
  $(".leftAnime").each(function () {
    var elemPos = $(this).offset().top - 50;
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      $(this).addClass("slideAnimeLeftRight");
      $(this).children(".leftAnimeInner").addClass("slideAnimeRightLeft");
    } else {
      $(this).removeClass("slideAnimeLeftRight");
      $(this).children(".leftAnimeInner").removeClass("slideAnimeRightLeft");
    }
  });
}

// ーーーーーーーーーーーーーーーーーーーー
function GlowAnimeControl() {
  $(".glowAnime").each(function () {
    var elemPos = $(this).offset().top - 50;
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight) {
      $(this).addClass("glow");
    } else {
      $(this).removeClass("glow");
    }
  });
}

$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  $("#header-img").css({
    transform: "scale(" + (100 + scroll / 10) / 100 + ")",
    top: -(scroll / 50) + "%",
  });
});

$(window).scroll(function () {
  setFadeElement();
  fadeAnime();
  slideAnime();
  GlowAnimeControl();
  BlurTextAnimeControl();
});

$(window).on("load", function () {
  $("#splash-logo").delay(1200).fadeOut("slow");

  $("#splash")
    .delay(1500)
    .fadeOut("slow", function () {
      $("body").addClass("appear");

      var element = $(".glowAnime");
      element.each(function () {
        var text = $(this).text();
        var textbox = "";
        text.split("").forEach(function (t, i) {
          if (t !== " ") {
            if (i < 10) {
              textbox +=
                '<span style="animation-delay:.' + i + 's;">' + t + "</span>";
            } else {
              var n = i / 10;
              textbox +=
                '<span style="animation-delay:' + n + 's;">' + t + "</span>";
            }
          } else {
            textbox += t;
          }
        });
        $(this).html(textbox);
      });
      GlowAnimeControl();
    });

  $(".splashbg1").on("animationend", function () {
    setFadeElement();
    fadeAnime();
    slideAnime();
    BlurTextAnimeControl();
  });
});

//アコーディオンをクリックした時の動作
$(".title").on("click", function () {
  //タイトル要素をクリックしたら
  var findElm = $(this).next(".box"); //直後のアコーディオンを行うエリアを取得し
  $(findElm).slideToggle(); //アコーディオンの上下動作
  if ($(this).hasClass("close")) {
    //タイトル要素にクラス名closeがあれば
    $(this).removeClass("close"); //クラス名を除去し
  } else {
    //それ以外は
    $(this).addClass("close"); //クラス名closeを付与
  }
});
// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on("load", function () {
  mediaQueriesWin(); /*機能編  5-1-3 ドロップダウンメニュー（写真付 上ナビ）の関数を呼ぶ*/
  PageTopAnime(); /*機能編  8-1-2 ページの指定の高さを超えたら下から出現の関数を呼ぶ*/
  fadeAnime(); /* 印象編 4 最低限おぼえておきたい動き*/
  delayScrollAnime(); /* 印象編 4-12 順番に現れる（CSS x jQuery）関数を呼ぶ*/

  /*機能編 9-2-1 任意の場所をクリックすると隠れていた内容が開くの読み込み*/
  $(".open").each(function (index, element) {
    //openクラスを取得
    var Title = $(element).children(".title"); //openクラスの子要素のtitleクラスを取得
    $(Title).addClass("close"); //タイトルにクラス名closeを付与し
    var Box = $(element).children(".box"); //openクラスの子要素boxクラスを取得
    $(Box).slideDown(500); //アコーディオンを開く
  });

  /*機能編 5-4-1 タブメニューの読み込み*/
  var hashName = location.hash; //リンク元の指定されたURLのハッシュタグを取得
  GethashID(hashName); //設定したタブの読み込み
});

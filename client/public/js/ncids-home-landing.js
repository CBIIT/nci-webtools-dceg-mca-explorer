!(function () {
  "use strict";
  var e;
  !(function (e) {
    (e.PageLoad = "PageLoad"), (e.Other = "Other");
  })(e || (e = {}));
  const t = (t, n, o) => {
      var a;
      (a = {
        type: e.Other,
        event: t,
        linkName: n,
        data: o,
      }),
        (window.NCIDataLayer = window.NCIDataLayer || []),
        window.NCIDataLayer.push(a);
    },
    n = (e) => {
      const t = Array.from(document.querySelectorAll("[data-eddl-landing-row]")),
        n = Array.from(document.querySelectorAll("[data-eddl-landing-row] [data-eddl-landing-row]")),
        o = t.filter((e) => -1 === n.indexOf(e)),
        a = e.closest("[data-eddl-landing-row-col]"),
        l = null !== a ? a.closest("[data-eddl-landing-row]") : e.closest("[data-eddl-landing-row]");
      if (null === l)
        return {
          pageRows: o.length,
          pageRowIndex: "_ERROR_",
          pageRowCols: 0,
          pageRowColIndex: 0,
        };
      const r = o.indexOf(l) + 1,
        d = Array.from(l.querySelectorAll("[data-eddl-landing-row-col]"));
      return 0 === d.length
        ? {
            pageRows: o.length,
            pageRowIndex: r,
            pageRowCols: 0,
            pageRowColIndex: 0,
          }
        : null === a
        ? {
            pageRows: o.length,
            pageRowIndex: r,
            pageRowCols: d.length,
            pageRowColIndex: "_ERROR_",
          }
        : {
            pageRows: o.length,
            pageRowIndex: r,
            pageRowCols: d.length,
            pageRowColIndex: d.indexOf(a) + 1,
          };
    },
    o = (e) => {
      const t = e.closest("[data-eddl-landing-row-col]");
      if (null !== t) {
        const n = e.closest("[data-eddl-landing-row]"),
          o = Array.from(t.querySelectorAll("[data-eddl-landing-row]")),
          a = n ? o.indexOf(n) + 1 : "_ERROR_";
        return {
          containerItems: o.length,
          containerItemIndex: a,
        };
      }
      return {
        containerItems: 1,
        containerItemIndex: 1,
      };
    },
    a = (e, o, a, l, r, d, i, c, s, g, u, R, m) => {
      const { pageRows: w, pageRowIndex: _, pageRowCols: h, pageRowColIndex: p } = n(e);
      t(`LP:${o}:LinkClick`, `LP:${o}:LinkClick`, {
        location: "Body",
        pageRows: w,
        pageRowIndex: _,
        pageRowCols: h,
        pageRowColIndex: p,
        containerItems: a,
        containerItemIndex: l,
        componentType: r,
        componentTheme: d,
        componentVariant: i,
        title: c.slice(0, 50),
        linkType: s,
        linkText: g.slice(0, 50),
        linkArea: u,
        totalLinks: R,
        linkPosition: m,
      });
    },
    l = (e, t) => {
      var n;
      const o = e.querySelector(t);
      return (null == o || null === (n = o.textContent) || void 0 === n ? void 0 : n.trim()) || "_ERROR_";
    },
    r = (e) =>
      ({
        IMG: "Image",
        P: "Description",
        SPAN: "Title",
      }[e.target.tagName] || "Not Defined");
  var d = () => {
    const e = document.querySelectorAll('[data-eddl-landing-item="feature_card"]');
    e.length &&
      e.forEach((e) => {
        ((e) => {
          const t = e.closest("[data-eddl-landing-row]"),
            n = t ? Array.from(t.querySelectorAll("[data-eddl-landing-item]")) : [],
            o = n.indexOf(e) + 1,
            d = n.length;
          e.addEventListener(
            "click",
            ((e, t) => (n) => {
              const o = n.currentTarget;
              a(
                o,
                "FeatureCard",
                e,
                t,
                "Feature Card",
                "Light",
                "Standard Single Link",
                l(o, ".nci-card__title"),
                o.dataset.eddlLandingItemLinkType || "_ERROR_",
                ((e) => {
                  const t = e.currentTarget,
                    n = r(e);
                  return (
                    {
                      Image: "Image",
                      Description: l(t, ".nci-card__description"),
                      Title: l(t, ".nci-card__title"),
                    }[n] || "Not Defined"
                  );
                })(n),
                r(n),
                1,
                1
              );
            })(d, o)
          );
        })(e);
      });
  };
  var i = () => {
    const e = document.querySelectorAll('[data-eddl-landing-item="guide_card"]');
    e.length &&
      e.forEach((e) => {
        ((e) => {
          const t = e.closest("[data-eddl-landing-row]"),
            n = t ? Array.from(t.querySelectorAll("[data-eddl-landing-item]")) : [],
            o = n.indexOf(e) + 1,
            l = n.length,
            r = t && t.dataset.eddlLandingRow ? "Standard" : "Image and Description",
            d = Array.from(e.querySelectorAll("a"));
          d.forEach((t) => {
            t.addEventListener(
              "click",
              ((e, t, n, o, l) => (r) => {
                const d = r.currentTarget;
                a(
                  d,
                  "GuideCard",
                  e,
                  t,
                  "Guide Card",
                  "Light",
                  l,
                  ((e) => {
                    var t, n, o;
                    const a = e.querySelector("ul"),
                      l = null == a ? void 0 : a.getAttribute("aria-labelledby"),
                      r = l
                        ? null === (t = document.getElementById(l)) ||
                          void 0 === t ||
                          null === (n = t.textContent) ||
                          void 0 === n
                          ? void 0
                          : n.trim()
                        : null,
                      d =
                        null === (o = e.querySelector(".nci-guide-card__description")) || void 0 === o
                          ? void 0
                          : o.textContent;
                    return r || d || "_ERROR_";
                  })(o),
                  d.dataset.eddlLandingItemLinkType || "_ERROR_",
                  d.textContent ? d.textContent.trim() : "_ERROR_",
                  "Button",
                  n.length,
                  n.indexOf(d) + 1
                );
              })(l, o, d, e, r)
            );
          });
        })(e);
      });
  };
  const c = (e) => {
    ((e) => {
      const { pageRows: a, pageRowIndex: l, pageRowCols: r, pageRowColIndex: d } = n(e),
        { containerItems: i, containerItemIndex: c } = o(e),
        s = {
          location: "Body",
          componentType: "Raw HTML",
          pageRows: a,
          pageRowIndex: l,
          pageRowCols: r,
          pageRowColIndex: d,
          containerItems: i,
          containerItemIndex: c,
        },
        g = e.dataset.eddlLandingRawhtmlTitle || "Not Defined",
        u = e.textContent ? e.textContent.trim() : "_ERROR_",
        R =
          null !== e.closest("[data-eddl-landing-row-col]")
            ? e.closest("[data-eddl-landing-row-col] [data-eddl-landing-row]")
            : e.closest("[data-eddl-landing-row]"),
        m = null !== R ? Array.from(R.querySelectorAll("[data-eddl-landing-rawhtml]")) : [],
        w = m.indexOf(e) + 1,
        _ = {
          componentTheme: "Not Defined",
          componentVariant: "Not Defined",
          title: g.slice(0, 50),
          linkArea: "Raw HTML",
          linkText: u.slice(0, 50),
          linkType: "Not Defined",
          totalLinks: m.length,
          linkPosition: w,
        },
        h = Object.entries(e.dataset).reduce((e, t) => {
          let [n, o] = t;
          if (!n.match(/^eddlLandingRawhtml.+/)) return e;
          const a = n.replace(/^eddlLandingRawhtml/, "");
          return {
            ...e,
            [a[0].toLowerCase() + a.slice(1)]: o,
          };
        }, {});
      t("LP:RawHTML:LinkClick", "LP:RawHTML:LinkClick", {
        ..._,
        ...h,
        ...s,
      });
    })(e.currentTarget);
  };
  const s = (e) => {
    const t = e.closest("[data-eddl-landing-row]");
    return t ? Array.from(t.querySelectorAll("a")) : [];
  };
  var g = () => {
    const e = document.querySelectorAll('[data-eddl-landing-item="hero"]');
    e.length &&
      e.forEach((e) => {
        const t = e.querySelectorAll("a");
        t.length &&
          t.forEach((n) =>
            n.addEventListener(
              "click",
              ((e, t) => (n) => {
                const o = n.currentTarget;
                var l, r, d, i;
                a(
                  o,
                  "Hero",
                  1,
                  1,
                  "Hero",
                  Boolean(
                    null === (l = e.querySelector(".nci-hero__cta-container")) || void 0 === l
                      ? void 0
                      : l.querySelector(".nci-hero__cta--dark")
                  )
                    ? "Dark"
                    : "Light",
                  ((e) => {
                    var t;
                    const n = Boolean(
                        null === (t = e.querySelector(".nci-hero__cta-container")) || void 0 === t
                          ? void 0
                          : t.querySelector(".nci-hero__cta--with-button")
                      ),
                      o = Boolean(e.classList.contains("nci-hero--with-cta-strip"));
                    return n && o
                      ? "Button with CTA Strip"
                      : n
                      ? "Button with no CTA Strip"
                      : o
                      ? "No Button with CTA Strip"
                      : "_ERROR_";
                  })(e),
                  (null === (r = e.querySelector(".nci-hero__cta-container")) ||
                  void 0 === r ||
                  null === (d = r.querySelector(".nci-hero__cta")) ||
                  void 0 === d ||
                  null === (i = d.querySelector(".nci-hero__cta-tagline")) ||
                  void 0 === i
                    ? void 0
                    : i.textContent) || "_ERROR_",
                  o.dataset.eddlLandingItemLinkType || "_ERROR_",
                  o.textContent ? o.textContent.trim() : "_ERROR_",
                  Boolean(o.closest(".nci-hero__cta")) ? "Primary Button" : "Secondary Button",
                  t,
                  ((e) => {
                    const t = e.closest(".nci-cta-strip"),
                      n = e.closest("li"),
                      o = Array.from((null == t ? void 0 : t.children) || []);
                    return o.length < 1 ? "1-1" : n ? `2-${o.indexOf(n) + 1}` : "_ERROR_";
                  })(o)
                );
              })(e, t.length)
            )
          );
      });
  };
  var u = () => {
    const e = document.querySelectorAll(".cgdp-dynamic-list");
    e.length &&
      e.forEach((e) => {
        ((e) => {
          const t = Array.from(e.querySelectorAll("a")),
            n = e.querySelector(".usa-collection");
          t.forEach((l) => {
            var r, d, i, c;
            l.addEventListener(
              "click",
              ((r = e),
              (d = t),
              (i = n.dataset.dynamicListDisplay || "_ERROR_"),
              (c = n.dataset.dynamicListView || "_ERROR_"),
              (e) => {
                const t = e.currentTarget,
                  { containerItems: n, containerItemIndex: l } = o(t);
                a(
                  t,
                  "Collection",
                  n,
                  l,
                  "Dynamic List",
                  i,
                  c,
                  ((e) => {
                    var t;
                    return (
                      (null === (t = e.querySelector(".nci-heading--label")) || void 0 === t
                        ? void 0
                        : t.textContent) || "_ERROR_"
                    );
                  })(r),
                  "Internal",
                  t.textContent ? t.textContent.trim() : "_ERROR_",
                  "usa-link" === t.getAttribute("class") ? "Collection Item" : "View All Button",
                  d.length,
                  d.indexOf(t) + 1
                );
              })
            );
          });
        })(e);
      });
  };
  window.addEventListener("DOMContentLoaded", () => {
    d(),
      i(),
      (() => {
        const e = document.querySelectorAll('[data-eddl-landing-item="promo_block"]');
        e.length &&
          e.forEach((e) => {
            const t = e.querySelector("a");
            var n;
            t &&
              t.addEventListener(
                "click",
                ((n = e),
                (e) => {
                  const t = e.currentTarget;
                  a(
                    t,
                    "PromoBlock",
                    1,
                    1,
                    "Promo Block",
                    ((e) => (e.classList.contains("nci-promo-block--dark") ? "Dark" : "Light"))(n),
                    ((e) =>
                      e.classList.contains("nci-alternating-right")
                        ? "Image Right"
                        : e.classList.contains("nci-promo-block--with-image")
                        ? "Image Left"
                        : "No Image")(n),
                    ((e) => {
                      var t;
                      return (
                        (null === (t = e.querySelector(".nci-promo-block__heading")) || void 0 === t
                          ? void 0
                          : t.textContent) || "_ERROR_"
                      );
                    })(n),
                    t.dataset.eddlLandingItemLinkType || "_ERROR_",
                    t.textContent ? t.textContent.trim() : "_ERROR_",
                    "Button",
                    1,
                    1
                  );
                })
              );
          });
      })(),
      document.querySelectorAll("[data-eddl-landing-rawhtml]").forEach((e) => {
        e.addEventListener("click", c);
      }),
      (() => {
        const e = document.querySelectorAll('[data-eddl-landing-item="cta_strip"] a');
        e.length &&
          Array.from(e).forEach((e) => {
            e.addEventListener("click", (e) => {
              const t = e.currentTarget;
              a(
                t,
                "CTAStrip",
                1,
                1,
                "CTA Strip",
                "Dark",
                "Standard",
                "Call to Action Strip",
                t.dataset.eddlLandingItemLinkType || "_ERROR_",
                t.textContent ? t.textContent.trim() : "_ERROR_",
                "Button",
                s(t).length,
                s(t).indexOf(t) + 1
              );
            });
          });
      })(),
      g(),
      u();
  });
})();

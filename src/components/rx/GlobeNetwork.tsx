"use client";

import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const KOCHI = { lat: 9.9312, lng: 76.2673 };
const CITIES = [
  { lat: 37.77, lng: -122.42 }, { lat: 40.71, lng: -74.0 }, { lat: 43.65, lng: -79.38 },
  { lat: 51.51, lng: -0.13 }, { lat: 52.52, lng: 13.4 }, { lat: 52.37, lng: 4.9 },
  { lat: 25.2, lng: 55.27 }, { lat: 1.35, lng: 103.82 }, { lat: 35.68, lng: 139.69 },
  { lat: -33.87, lng: 151.21 }, { lat: -23.55, lng: -46.63 }, { lat: 12.97, lng: 77.59 }, { lat: 32.08, lng: 34.78 },
  { lat: 28.61, lng: 77.21 }, { lat: 19.08, lng: 72.88 }, { lat: 13.08, lng: 80.27 },
  { lat: -1.29, lng: 36.82 }, { lat: 6.52, lng: 3.38 }, { lat: -33.92, lng: 18.42 }, { lat: 37.57, lng: 126.98 }, { lat: 19.43, lng: -99.13 },
];

export function GlobeNetwork() {
  const elRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let world: any = null;
    let rafId = 0;
    let resizeHandler: (() => void) | null = null;
    let cancelled = false;

    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    import("globe.gl")
      .then(({ default: Globe }) => {
        if (cancelled || !elRef.current) return;
        const arcs = CITIES.map((c) => ({
          startLat: KOCHI.lat,
          startLng: KOCHI.lng,
          endLat: c.lat,
          endLng: c.lng,
        }));
        const pts = CITIES.map((c) => ({ lat: c.lat, lng: c.lng }));
        const rings = [{ lat: KOCHI.lat, lng: KOCHI.lng }];
        const w = el.clientWidth || 700;
        const h = el.clientHeight || 480;

        world = new Globe(el)
          .width(w)
          .height(h)
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor("#FFFFFF")
          .atmosphereAltitude(0.14)
          .arcsData(arcs)
          .arcColor(() => ["rgba(251,106,46,0)", "rgba(251,106,46,0.95)"])
          .arcAltitudeAutoScale(0.5)
          .arcStroke(1.2)
          .arcDashLength(0.5)
          .arcDashGap(0.32)
          .arcDashInitialGap(() => Math.random())
          .arcDashAnimateTime(reduce ? 0 : 2200)
          .pointsData(pts)
          .pointColor(() => "rgba(28,26,24,0.95)")
          .pointAltitude(0.013)
          .pointRadius(0.28)
          .ringsData(rings)
          .ringColor(() => (t: number) => "rgba(251,106,46," + (1 - t) + ")")
          .ringMaxRadius(6.5)
          .ringPropagationSpeed(3.5)
          .ringRepeatPeriod(reduce ? 1e9 : 900);

        try {
          world.pointOfView({ lat: 16, lng: 74, altitude: 2.3 }, 0);
        } catch {}
        try {
          const ctr = world.controls();
          ctr.enableZoom = false;
          ctr.autoRotate = !reduce;
          ctr.autoRotateSpeed = 0.5;
        } catch {}

        // Track the Kochi map pin against the globe surface.
        const pinEl = pinRef.current;
        if (pinEl) {
          const trackPin = () => {
            if (cancelled || !pinEl.isConnected) return;
            try {
              const sc = world.getScreenCoords(KOCHI.lat, KOCHI.lng, 0.01);
              const P = world.getCoords(KOCHI.lat, KOCHI.lng, 0.01);
              const C = world.camera().position;
              const nl = Math.hypot(P.x, P.y, P.z) || 1;
              const tx = C.x - P.x;
              const ty = C.y - P.y;
              const tz = C.z - P.z;
              const tl = Math.hypot(tx, ty, tz) || 1;
              const facing =
                (P.x / nl) * (tx / tl) + (P.y / nl) * (ty / tl) + (P.z / nl) * (tz / tl);
              if (sc) {
                pinEl.style.left = sc.x + "px";
                pinEl.style.top = sc.y + "px";
                pinEl.style.display = facing > 0.04 ? "block" : "none";
              }
            } catch {}
            rafId = requestAnimationFrame(trackPin);
          };
          rafId = requestAnimationFrame(trackPin);
        }

        try {
          const gm = world.globeMaterial();
          if (gm && gm.color) {
            gm.color.set("#DAD5CC");
            if (gm.emissive) gm.emissive.set("#454545");
            if ("shininess" in gm) gm.shininess = 4;
          }
        } catch {}
        try {
          world.showGraticules(false);
        } catch {}
        try {
          world
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.18)
            .hexPolygonUseDots(false)
            .hexPolygonAltitude((d: any) => {
              const n = d?.properties && (d.properties.ADMIN || d.properties.NAME || d.properties.name);
              return n === "India" ? 0.025 : 0.008;
            })
            .hexPolygonColor((d: any) => {
              const n = d?.properties && (d.properties.ADMIN || d.properties.NAME || d.properties.name);
              return n === "India" ? "rgba(0,0,0,0)" : "rgba(232,72,8,0.9)";
            });
          fetch("/geo/ne_110m_admin_0_countries.geojson")
            .then((r) => r.json())
            .then((geo) => {
              if (cancelled || !world || !geo?.features) return;
              world.hexPolygonsData(geo.features);
              try {
                const ind = geo.features.filter((f: any) => {
                  const n = f.properties && (f.properties.ADMIN || f.properties.NAME);
                  return n === "India";
                });
                world
                  .polygonsData(ind)
                  .polygonCapColor(() => "rgba(232,72,8,0.95)")
                  .polygonSideColor(() => "rgba(232,72,8,0.3)")
                  .polygonStrokeColor(() => "#FB6A2E")
                  .polygonAltitude(0.016);
              } catch {}
            })
            .catch(() => {});
        } catch {}

        resizeHandler = () => {
          const ww = el.clientWidth || 700;
          const hh = el.clientHeight || 480;
          try {
            world.width(ww);
            world.height(hh);
          } catch {}
        };
        window.addEventListener("resize", resizeHandler);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      try {
        world?._destructor?.();
      } catch {}
      if (el) el.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="rx-rise"
      style={{
        gridColumn: "1 / -1",
        marginTop: 8,
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(125% 95% at 50% 34%, #191920 0%, #0A0A0B 64%)",
        border: "1px solid #232323",
        borderRadius: 20,
        height: "clamp(320px, 62vw, 480px)",
      }}
    >
      <div ref={elRef} style={{ position: "absolute", inset: 0 }} />
      <div
        ref={pinRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "translate(-50%,-100%)",
          zIndex: 3,
          pointerEvents: "none",
          display: "none",
          willChange: "left,top",
        }}
      >
        <svg width="15" height="20" viewBox="0 0 24 32">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#E84808" />
          <circle cx="12" cy="11.5" r="4.2" fill="#0A0A0B" />
        </svg>
      </div>
      <div
        className="rx-mono"
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--rx-orange-400)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <span className="rx-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rx-orange-400)" }} />
        LIVE NETWORK · KOCHI → WORLD
      </div>
    </div>
  );
}

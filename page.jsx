"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/*
  REAL DATA — StarPets prices scraped LIVE 1 Apr 2026 + AMTV/Beebom community values
  Frost Dragon = 1.0 scale. Variants: NP (no potion), R, FR, Neon, Neon FR, Mega, Mega FR
  StarPets prices are cheapest listing at time of scrape
*/

const PETS = [
  // { name, variants: { variantKey: { sp, v } }, demand, tier, rarity, img }
  // sp = StarPets cheapest EUR, v = AMTV value in Frosts
  // Some variants don't have sp if not listed at scrape time
  
  { name: "Shadow Dragon", demand: 10, tier: "S+", rarity: "Legendary", img: "🐉", variants: {
    "NP": { sp: null, v: 2.45 }, "FR": { sp: 159.82, v: 2.45 }, "Neon FR": { sp: 400, v: 6.95 }, "Mega FR": { sp: null, v: 22 }
  }},
  { name: "Bat Dragon", demand: 10, tier: "S+", rarity: "Legendary", img: "🦇", variants: {
    "NP": { sp: null, v: 2.25 }, "FR": { sp: 230, v: 2.25 }, "Neon FR": { sp: 456.81, v: 6.4 }, "Mega FR": { sp: null, v: 24.6 }
  }},
  { name: "Frost Dragon", demand: 9.5, tier: "S+", rarity: "Legendary", img: "❄️", variants: {
    "NP": { sp: null, v: 1.0 }, "FR": { sp: 83.3, v: 1.0 }, "Neon FR": { sp: 233.87, v: 2.8 }, "Mega FR": { sp: null, v: 9.25 }
  }},
  { name: "Blue Dog", demand: 8, tier: "A", rarity: "Uncommon", img: "🐕", variants: {
    "NP": { sp: 3.27, v: 1.325 }, "R": { sp: 4.37, v: 1.35 }, "FR": { sp: 5.8, v: 1.4 }
  }},
  { name: "Elephant", demand: 7, tier: "B", rarity: "Rare", img: "🐘", variants: {
    "NP": { sp: 5.2, v: 0.9 }, "R": { sp: 6.3, v: 0.92 }, "FR": { sp: 7.5, v: 0.95 }
  }},
  { name: "Cow", demand: 8, tier: "B", rarity: "Rare", img: "🐄", variants: {
    "NP": { sp: 9.5, v: 0.825 }, "R": { sp: 11.08, v: 0.85 }, "FR": { sp: 13, v: 0.88 }
  }},
  { name: "Owl", demand: 9, tier: "S", rarity: "Legendary", img: "🦉", variants: {
    "FR": { sp: 77.44, v: 0.75 }, "Neon FR": { sp: null, v: 2.1 }, "Mega FR": { sp: null, v: 8.3 }
  }},
  { name: "Parrot", demand: 9, tier: "S", rarity: "Legendary", img: "🦜", variants: {
    "FR": { sp: 56, v: 0.625 }, "Neon FR": { sp: 178.16, v: 1.67 }, "Mega FR": { sp: null, v: 5.9 }
  }},
  { name: "Hyena", demand: 6.5, tier: "C", rarity: "Rare", img: "🐺", variants: {
    "NP": { sp: 1.35, v: 0.6 }, "R": { sp: 1.75, v: 0.62 }, "FR": { sp: 2.2, v: 0.65 }
  }},
  { name: "Pink Cat", demand: 7.5, tier: "A", rarity: "Uncommon", img: "🐱", variants: {
    "NP": { sp: 3.27, v: 0.525 }, "R": { sp: 4.37, v: 0.55 }, "FR": { sp: 7.43, v: 0.58 },
    "Neon": { sp: 10.49, v: 1.6 }, "Neon FR": { sp: 16.84, v: 1.75 }, "Mega FR": { sp: 37.35, v: 5.5 }
  }},
  { name: "Crow", demand: 8.5, tier: "S", rarity: "Legendary", img: "🐦‍⬛", variants: {
    "FR": { sp: 51, v: 0.5 }, "Neon FR": { sp: 133.53, v: 1.325 }, "Mega FR": { sp: null, v: 4.85 }
  }},
  { name: "Evil Unicorn", demand: 8.5, tier: "S", rarity: "Legendary", img: "🦄", variants: {
    "FR": { sp: 36.6, v: 0.5 }, "Neon FR": { sp: 118.67, v: 1.375 }, "Mega FR": { sp: null, v: 4.8 }
  }},
  { name: "Pig", demand: 7, tier: "B", rarity: "Rare", img: "🐷", variants: {
    "NP": { sp: 2.2, v: 0.425 }, "R": { sp: 2.79, v: 0.44 }, "FR": { sp: 3.5, v: 0.46 }
  }},
  { name: "Brown Bear", demand: 6, tier: "C", rarity: "Rare", img: "🐻", variants: {
    "NP": { sp: 1.2, v: 0.4 }, "R": { sp: 1.59, v: 0.42 }, "FR": { sp: 2.0, v: 0.44 }
  }},
  { name: "Rhino", demand: 6, tier: "C", rarity: "Rare", img: "🦏", variants: {
    "NP": { sp: 0.33, v: 0.385 }, "R": { sp: 0.5, v: 0.4 }
  }},
  { name: "Polar Bear", demand: 6, tier: "C", rarity: "Rare", img: "🐻‍❄️", variants: {
    "NP": { sp: 0.9, v: 0.35 }, "R": { sp: 1.21, v: 0.37 }
  }},
  { name: "Swan", demand: 6, tier: "C", rarity: "Rare", img: "🦢", variants: {
    "NP": { sp: 0.7, v: 0.3 }, "R": { sp: 0.9, v: 0.32 }
  }},
  { name: "Silly Duck", demand: 7, tier: "C", rarity: "Uncommon", img: "🦆", variants: {
    "NP": { sp: 0.55, v: 0.25 }, "R": { sp: 0.74, v: 0.27 }, "FR": { sp: 1.0, v: 0.29 }
  }},
  { name: "Hedgehog", demand: 8, tier: "A", rarity: "Ultra-Rare", img: "🦔", variants: {
    "NP": { sp: 18, v: 0.25 }, "R": { sp: 20, v: 0.27 }, "FR": { sp: 22, v: 0.29 },
    "Neon FR": { sp: 62, v: 0.85 }, "Mega FR": { sp: null, v: 3.6 }
  }},
  { name: "Arctic Reindeer", demand: 8, tier: "A", rarity: "Legendary", img: "🦌", variants: {
    "FR": { sp: 17.35, v: 0.2 }, "Neon FR": { sp: 55, v: 0.525 }, "Mega FR": { sp: null, v: 1.725 }
  }},
  { name: "Dalmatian", demand: 8, tier: "A", rarity: "Ultra-Rare", img: "🐾", variants: {
    "FR": { sp: 18, v: 0.13 }, "Neon FR": { sp: 55, v: 0.5 }, "Mega FR": { sp: null, v: 1.9 }
  }},
  { name: "Albino Monkey", demand: 7.5, tier: "A", rarity: "Legendary", img: "🐒", variants: {
    "FR": { sp: 6.02, v: 0.12 }, "Neon FR": { sp: 20, v: 0.425 }, "Mega FR": { sp: null, v: 1.5 }
  }},
  { name: "Turtle", demand: 7, tier: "B", rarity: "Legendary", img: "🐢", variants: {
    "FR": { sp: 9.41, v: 0.11 }, "Neon FR": { sp: 30, v: 0.31 }, "Mega FR": { sp: null, v: 0.9 }
  }},
  { name: "Flamingo", demand: 7.5, tier: "B", rarity: "Ultra-Rare", img: "🦩", variants: {
    "FR": { sp: 7.94, v: 0.1 }, "Neon FR": { sp: 28, v: 0.37 }, "Mega FR": { sp: null, v: 1.35 }
  }},
  { name: "Lion", demand: 7, tier: "B", rarity: "Ultra-Rare", img: "🦁", variants: {
    "R": { sp: 4.26, v: 0.09 }, "FR": { sp: 5.5, v: 0.095 }, "Neon FR": { sp: 18, v: 0.325 }
  }},
  { name: "Monkey King", demand: 7, tier: "B", rarity: "Legendary", img: "🐵", variants: {
    "FR": { sp: 6.99, v: 0.19 }, "Neon FR": { sp: 22, v: 0.65 }
  }},
  { name: "Kangaroo", demand: 7, tier: "B", rarity: "Legendary", img: "🦘", variants: {
    "FR": { sp: 6.7, v: 0.08 }, "Neon FR": { sp: 22, v: 0.25 }, "Mega FR": { sp: null, v: 0.7 }
  }},
  { name: "Crocodile", demand: 6.5, tier: "B", rarity: "Ultra-Rare", img: "🐊", variants: {
    "R": { sp: 4.62, v: 0.075 }, "FR": { sp: 5.5, v: 0.08 }, "Neon FR": { sp: 16, v: 0.24 }
  }},
  { name: "Chicken", demand: 6, tier: "C", rarity: "Common", img: "🐔", variants: {
    "NP": { sp: 0.5, v: 0.18 }, "R": { sp: 0.72, v: 0.19 }
  }},
  { name: "Frost Fury", demand: 6.5, tier: "C", rarity: "Legendary", img: "🧊", variants: {
    "FR": { sp: 2.55, v: 0.04 }, "Neon FR": { sp: 8, v: 0.165 }, "Mega FR": { sp: null, v: 0.575 }
  }},
  { name: "Unicorn", demand: 6, tier: "C", rarity: "Legendary", img: "🦄", variants: {
    "FR": { sp: 0.8, v: 0.01 }, "Neon FR": { sp: 2.5, v: 0.07 }, "Mega FR": { sp: 8, v: 0.27 }
  }},
  { name: "T-Rex", demand: 6, tier: "C", rarity: "Legendary", img: "🦖", variants: {
    "FR": { sp: 0.65, v: 0.015 }, "Neon FR": { sp: 2.2, v: 0.085 }, "Mega FR": { sp: 7, v: 0.4 }
  }},
  { name: "Dodo", demand: 5.5, tier: "C", rarity: "Legendary", img: "🦤", variants: {
    "FR": { sp: 0.55, v: 0.015 }, "Neon FR": { sp: 2, v: 0.09 }
  }},
  { name: "Phoenix", demand: 5.5, tier: "C", rarity: "Legendary", img: "🔥", variants: {
    "FR": { sp: 0.72, v: 0.015 }, "Neon FR": { sp: 2.2, v: 0.09 }, "Mega FR": { sp: 7, v: 0.425 }
  }},
  { name: "Skele-Rex", demand: 5.5, tier: "C", rarity: "Legendary", img: "💀", variants: {
    "FR": { sp: 1.58, v: 0.02 }, "Neon FR": { sp: 5, v: 0.1 }, "Mega FR": { sp: 15, v: 0.45 }
  }},
  { name: "Ride Potion", demand: 10, tier: "L", rarity: "Item", img: "🧪", variants: { "—": { sp: 0.51, v: 0.01 } }},
  { name: "Fly Potion", demand: 10, tier: "L", rarity: "Item", img: "💊", variants: { "—": { sp: 1.0, v: 0.02 } }},
];

// Flatten pets into variant rows for the trade checker
const ALL_VARIANTS = [];
PETS.forEach(pet => {
  Object.entries(pet.variants).forEach(([vk, vd]) => {
    ALL_VARIANTS.push({ name: pet.name, variant: vk, label: vk === "—" ? pet.name : `${pet.name} (${vk})`, sp: vd.sp, v: vd.v, demand: pet.demand, tier: pet.tier, rarity: pet.rarity, img: pet.img });
  });
});

const TC = { "S+": { bg: "#FFD700", t: "#6B5A00" }, "S": { bg: "#F9A8D4", t: "#9D174D" }, "A": { bg: "#C4B5FD", t: "#5B21B6" }, "B": { bg: "#99F6E4", t: "#0F766E" }, "C": { bg: "#E2E8F0", t: "#475569" }, "L": { bg: "#BFDBFE", t: "#1E40AF" } };
const DL = d => d >= 9 ? "Insane" : d >= 7 ? "High" : d >= 5 ? "Medium" : "Low";
const FROST_SP = 83.3;

function Picker({ side, items, onAdd, onRemove, onQty }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const filtered = q.length >= 2 ? ALL_VARIANTS.filter(p => p.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12) : [];
  const total = items.reduce((s, i) => s + i.v * i.qty, 0);
  const isGive = side === "give";

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: isGive ? "#E53E3E" : "#38A169", marginBottom: 8 }}>
        {isGive ? "You're giving" : "You're getting"}
      </div>
      <div style={{ position: "relative", marginBottom: 8 }} ref={ref}>
        <input type="text" placeholder="Type pet name (e.g. Frost Dragon)..." value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          style={{ width: "100%", background: "#fff", border: `2px solid ${isGive ? "#FED7E2" : "#C6F6D5"}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#4a3f5c", boxSizing: "border-box" }} />
        {open && filtered.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, zIndex: 50, maxHeight: 260, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            {filtered.map((p, i) => (
              <div key={i} onClick={() => { onAdd(p); setQ(""); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #F9F1FE" }}
                onMouseOver={e => e.currentTarget.style.background = "#FAF5FF"}
                onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                <span style={{ fontSize: 18 }}>{p.img}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.name} <span style={{ color: "#9F7AEA", fontWeight: 600, fontSize: 11 }}>{p.variant !== "—" ? p.variant : ""}</span></div>
                  <div style={{ fontSize: 10, color: "#A0AEC0" }}>{p.v} Frosts · {p.rarity}</div>
                </div>
                {p.sp && <div style={{ fontSize: 11, color: "#EC4899", fontWeight: 700 }}>€{p.sp.toFixed(2)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "#B794F4", fontSize: 12, background: "#FDFAFF", borderRadius: 10, border: "1.5px dashed #E9D8FD" }}>
          Search and add pets above
        </div>
      ) : items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#fff", borderRadius: 8, marginBottom: 4, border: "1.5px solid #F3E8FF" }}>
          <span style={{ fontSize: 16 }}>{item.img}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{item.name} <span style={{ color: "#9F7AEA", fontSize: 10 }}>{item.variant !== "—" ? item.variant : ""}</span></div>
            <div style={{ fontSize: 10, color: "#A0AEC0" }}>{item.v} Frosts{item.sp ? ` · €${item.sp.toFixed(2)}` : ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button onClick={() => onQty(i, -1)} style={qb}>−</button>
            <span style={{ fontWeight: 800, fontSize: 13, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
            <button onClick={() => onQty(i, 1)} style={qb}>+</button>
          </div>
          <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: "#E53E3E", cursor: "pointer", fontSize: 16, padding: "0 2px" }}>×</button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: 8, padding: "8px 12px", background: isGive ? "#FFF5F5" : "#F0FFF4", borderRadius: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}>
          <span style={{ color: "#6B46C1" }}>Total</span>
          <span style={{ color: isGive ? "#E53E3E" : "#38A169" }}>{total.toFixed(3)} Frosts</span>
        </div>
      )}
    </div>
  );
}

const qb = { background: "#F3E8FF", border: "1.5px solid #D8B4FE", borderRadius: 6, width: 22, height: 22, cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#6B46C1", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontFamily: "inherit", lineHeight: 1 };

export default function App() {
  const [tab, setTab] = useState("trade");
  const [giveItems, setGiveItems] = useState([]);
  const [getItems, setGetItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortDeals, setSortDeals] = useState("bargain");

  const addTrade = (side, pet) => {
    const setter = side === "give" ? setGiveItems : setGetItems;
    const items = side === "give" ? giveItems : getItems;
    const key = pet.label;
    const ex = items.find(i => i.label === key);
    if (ex) setter(items.map(i => i.label === key ? { ...i, qty: i.qty + 1 } : i));
    else setter([...items, { ...pet, qty: 1 }]);
  };
  const removeTrade = (side, idx) => { const s = side === "give" ? setGiveItems : setGetItems; const i = side === "give" ? giveItems : getItems; s(i.filter((_, j) => j !== idx)); };
  const qtyChange = (side, idx, d) => { const s = side === "give" ? setGiveItems : setGetItems; const i = side === "give" ? giveItems : getItems; s(i.map((item, j) => j === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)); };

  const gT = giveItems.reduce((s, i) => s + i.v * i.qty, 0);
  const rT = getItems.reduce((s, i) => s + i.v * i.qty, 0);
  const diff = rT - gT;
  const verdict = !giveItems.length || !getItems.length ? null : diff > 0.005 ? "WIN" : diff < -0.005 ? "LOSE" : "FAIR";
  const vc = verdict === "WIN" ? "#38A169" : verdict === "LOSE" ? "#E53E3E" : "#D69E2E";

  const deals = useMemo(() => {
    let list = ALL_VARIANTS.filter(p => p.sp && p.v).filter(p => !search || p.label.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      const va = a.v / a.sp, vb = b.v / b.sp;
      if (sortDeals === "bargain") return vb - va;
      if (sortDeals === "price") return a.sp - b.sp;
      if (sortDeals === "value") return b.v - a.v;
      if (sortDeals === "demand") return b.demand - a.demand;
      return 0;
    });
    return list;
  }, [search, sortDeals]);

  const ss = { background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 12px", color: "#6B46C1", fontSize: 13, fontFamily: "inherit", fontWeight: 600 };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #FFF5F7 0%, #FDF2F8 30%, #FAF5FF 60%, #F0F9FF 100%)", color: "#4a3f5c" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div style={{ background: "linear-gradient(135deg, #FDF2F8, #FCE7F3, #FAE8FF)", borderBottom: "2px solid #F9A8D4", padding: "18px 20px 12px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, margin: 0, background: "linear-gradient(90deg, #EC4899, #A855F7, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dottie's Adopt Me! Trading Tool</h1>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9F7AEA" }}>LIVE StarPets prices + AMTV values · NP / R / FR / Neon / Mega variants</p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 40px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#fff", borderRadius: 12, padding: 4, border: "2px solid #F3E8FF" }}>
          {[["trade", "Trade Checker"], ["deals", "Deal Finder"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", background: tab === k ? "linear-gradient(135deg, #EC4899, #A855F7)" : "transparent", color: tab === k ? "#fff" : "#9F7AEA", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </div>

        {/* TRADE CHECKER */}
        {tab === "trade" && (
          <div>
            <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "10px 14px", marginBottom: 14, border: "1.5px solid #FDE68A", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              Search for pets by name — you'll see all variants (NP, Ride, FR, Neon, Mega). Pick the exact version being traded on each side.
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <Picker side="give" items={giveItems} onAdd={p => addTrade("give", p)} onRemove={i => removeTrade("give", i)} onQty={(i, d) => qtyChange("give", i, d)} />
              <Picker side="get" items={getItems} onAdd={p => addTrade("get", p)} onRemove={i => removeTrade("get", i)} onQty={(i, d) => qtyChange("get", i, d)} />
            </div>

            {verdict && (
              <div style={{
                background: verdict === "WIN" ? "linear-gradient(135deg, #F0FFF4, #E6FFFA)" : verdict === "LOSE" ? "linear-gradient(135deg, #FFF5F5, #FED7E2)" : "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                borderRadius: 16, padding: "20px 24px", textAlign: "center",
                border: `2px solid ${verdict === "WIN" ? "#9AE6B4" : verdict === "LOSE" ? "#FEB2B2" : "#FDE68A"}`,
              }}>
                <div style={{ fontSize: 48 }}>{verdict === "WIN" ? "🎉" : verdict === "LOSE" ? "🚫" : "🤝"}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: vc }}>{verdict}!</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  Giving: <strong>{gT.toFixed(3)} Frosts</strong> → Getting: <strong>{rT.toFixed(3)} Frosts</strong>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: vc, marginTop: 4 }}>
                  {verdict === "WIN" && `You gain +${diff.toFixed(3)} Frosts (≈ €${(diff * FROST_SP).toFixed(2)} value)`}
                  {verdict === "LOSE" && `You lose ${Math.abs(diff).toFixed(3)} Frosts (≈ €${(Math.abs(diff) * FROST_SP).toFixed(2)} value) — don't do it!`}
                  {verdict === "FAIR" && "Both sides are roughly equal — take it if you want those pets!"}
                </div>
              </div>
            )}

            {(giveItems.length > 0 || getItems.length > 0) && (
              <button onClick={() => { setGiveItems([]); setGetItems([]); }} style={{ marginTop: 12, background: "none", border: "1.5px solid #E9D8FD", borderRadius: 8, padding: "8px 16px", color: "#9F7AEA", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Clear trade</button>
            )}
          </div>
        )}

        {/* DEAL FINDER */}
        {tab === "deals" && (<>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <input type="text" placeholder="Search (e.g. Neon Frost, Hyena NP)..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 200px", background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 14px", color: "#4a3f5c", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <select value={sortDeals} onChange={e => setSortDeals(e.target.value)} style={ss}>
              <option value="bargain">Best value/€</option>
              <option value="price">Cheapest</option>
              <option value="value">Highest value</option>
              <option value="demand">Highest demand</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {deals.map((pet, idx) => {
              const bvf = (pet.v / pet.sp) / (1 / FROST_SP);
              const isBargain = bvf > 1.5;
              return (
                <div key={idx} style={{ background: "#fff", border: `2px solid ${isBargain ? "#9AE6B4" : "#F3E8FF"}`, borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 22 }}>{pet.img}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{pet.name}</div>
                        <div style={{ fontSize: 10, color: "#A0AEC0" }}>{pet.rarity} · {DL(pet.demand)} demand</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ background: "#F3E8FF", color: "#6B46C1", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{pet.variant}</span>
                      <span style={{ background: TC[pet.tier]?.bg, color: TC[pet.tier]?.t, padding: "2px 6px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{pet.tier}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, background: "#FDF2F8", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#EC4899" }}>€{pet.sp.toFixed(2)}</div>
                      <div style={{ fontSize: 8, color: "#F9A8D4", fontWeight: 700 }}>STARPETS</div>
                    </div>
                    <div style={{ flex: 1, background: "#FAF5FF", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#6B46C1" }}>{pet.v}</div>
                      <div style={{ fontSize: 8, color: "#B794F4", fontWeight: 700 }}>FROSTS</div>
                    </div>
                    <div style={{ flex: 1, background: bvf > 1.5 ? "#F0FFF4" : "#FFFBEB", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: bvf > 1.5 ? "#38A169" : "#D69E2E" }}>{bvf.toFixed(1)}x</div>
                      <div style={{ fontSize: 8, color: "#A0AEC0", fontWeight: 700 }}>VS FROST</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#fff", borderRadius: 12, fontSize: 11, color: "#A0AEC0", lineHeight: 1.7, border: "2px solid #F3E8FF" }}>
          <strong style={{ color: "#6B46C1" }}>Real data!</strong> StarPets prices scraped live 1 Apr 2026. AMTV community values (Frost = 1.0). NP = No Potion, R = Ride, FR = Fly Ride. Always verify before trading! Built by Ian + Dottie 🐾
        </div>
      </div>
    </div>
  );
}


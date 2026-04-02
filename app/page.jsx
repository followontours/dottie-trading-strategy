"use client";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// 80+ PETS — StarPets prices scraped LIVE 1 Apr 2026 + AMTV values (Frost Dragon = 1.0)
// sp = StarPets cheapest EUR, v = AMTV value in Frosts, d = demand 1-10
const P = [
  // S+ Tier
  { n: "Shadow Dragon", sp: 159.82, v: 2.45, d: 10, r: "Legendary", i: "🐉", vs: { NP: [null,2.45], FR: [159.82,2.45], "Neon FR": [400,6.95], "Mega FR": [null,22] }},
  { n: "Bat Dragon", sp: 230, v: 2.25, d: 10, r: "Legendary", i: "🦇", vs: { NP: [null,2.25], FR: [230,2.25], "Neon FR": [456.81,6.4], "Mega FR": [null,24.6] }},
  { n: "Frost Dragon", sp: 83.3, v: 1.0, d: 9.5, r: "Legendary", i: "❄️", vs: { FR: [83.3,1.0], "Neon FR": [233.87,2.8], "Mega FR": [null,9.25] }},
  // S Tier
  { n: "Owl", sp: 77.44, v: 0.75, d: 9, r: "Legendary", i: "🦉", vs: { FR: [77.44,0.75], "Neon FR": [null,2.1], "Mega FR": [null,8.3] }},
  { n: "Parrot", sp: 56, v: 0.625, d: 9, r: "Legendary", i: "🦜", vs: { FR: [56,0.625], "Neon FR": [178.16,1.67], "Mega FR": [null,5.9] }},
  { n: "Crow", sp: 51, v: 0.5, d: 8.5, r: "Legendary", i: "🐦‍⬛", vs: { FR: [51,0.5], "Neon FR": [133.53,1.325], "Mega FR": [null,4.85] }},
  { n: "Evil Unicorn", sp: 36.6, v: 0.5, d: 8.5, r: "Legendary", i: "🦄", vs: { FR: [36.6,0.5], "Neon FR": [118.67,1.375], "Mega FR": [null,4.8] }},
  // A Tier
  { n: "Blue Dog", sp: 3.27, v: 1.325, d: 8, r: "Uncommon", i: "🐕", vs: { NP: [3.27,1.325], R: [4.37,1.35], FR: [5.8,1.4] }},
  { n: "Elephant", sp: 5.2, v: 0.9, d: 7, r: "Rare", i: "🐘", vs: { NP: [5.2,0.9], R: [6.3,0.92], FR: [7.5,0.95] }},
  { n: "Cow", sp: 9.5, v: 0.825, d: 8, r: "Rare", i: "🐄", vs: { NP: [9.5,0.825], R: [11.08,0.85], FR: [13,0.88] }},
  { n: "Pink Cat", sp: 3.27, v: 0.525, d: 7.5, r: "Uncommon", i: "🐱", vs: { NP: [3.27,0.525], R: [4.37,0.55], FR: [7.43,0.58], Neon: [10.49,1.6], "Neon FR": [16.84,1.75], "Mega FR": [37.35,5.5] }},
  { n: "Hedgehog", sp: 20, v: 0.25, d: 8, r: "Ultra-Rare", i: "🦔", vs: { R: [20,0.27], FR: [22,0.29], "Neon FR": [62,0.85], "Mega FR": [null,3.6] }},
  { n: "Arctic Reindeer", sp: 17.35, v: 0.2, d: 8, r: "Legendary", i: "🦌", vs: { FR: [17.35,0.2], "Neon FR": [55,0.525], "Mega FR": [null,1.725] }},
  { n: "Dalmatian", sp: 18, v: 0.13, d: 8, r: "Ultra-Rare", i: "🐾", vs: { FR: [18,0.13], "Neon FR": [55,0.5], "Mega FR": [null,1.9] }},
  { n: "Albino Monkey", sp: 6.02, v: 0.12, d: 7.5, r: "Legendary", i: "🐒", vs: { FR: [6.02,0.12], "Neon FR": [20,0.425], "Mega FR": [null,1.5] }},
  // B Tier
  { n: "Meerkat", sp: 2.48, v: 0.5, d: 6.5, r: "Uncommon", i: "🦡", vs: { NP: [2.48,0.5] }},
  { n: "Hyena", sp: 1.35, v: 0.6, d: 6.5, r: "Rare", i: "🐺", vs: { NP: [1.35,0.6], R: [1.75,0.62], FR: [2.2,0.65] }},
  { n: "Pig", sp: 2.2, v: 0.425, d: 7, r: "Rare", i: "🐷", vs: { NP: [2.2,0.425], R: [2.79,0.44], FR: [3.5,0.46] }},
  { n: "Brown Bear", sp: 1.2, v: 0.4, d: 6, r: "Rare", i: "🐻", vs: { NP: [1.2,0.4], R: [1.59,0.42], FR: [2.0,0.44] }},
  { n: "Rhino", sp: 0.33, v: 0.385, d: 6, r: "Rare", i: "🦏", vs: { NP: [0.33,0.385], R: [0.5,0.4] }},
  { n: "Polar Bear", sp: 0.9, v: 0.35, d: 6, r: "Rare", i: "🐻‍❄️", vs: { NP: [0.9,0.35], R: [1.21,0.37] }},
  { n: "Swan", sp: 0.7, v: 0.3, d: 6, r: "Rare", i: "🦢", vs: { NP: [0.7,0.3], R: [0.9,0.32] }},
  { n: "Turtle", sp: 9.41, v: 0.11, d: 7, r: "Legendary", i: "🐢", vs: { FR: [9.41,0.11], "Neon FR": [30,0.31], "Mega FR": [null,0.9] }},
  { n: "Flamingo", sp: 7.94, v: 0.1, d: 7.5, r: "Ultra-Rare", i: "🦩", vs: { FR: [7.94,0.1], "Neon FR": [28,0.37], "Mega FR": [null,1.35] }},
  { n: "Lion", sp: 4.26, v: 0.09, d: 7, r: "Ultra-Rare", i: "🦁", vs: { R: [4.26,0.09], FR: [5.5,0.095], "Neon FR": [18,0.325] }},
  { n: "Monkey King", sp: 6.99, v: 0.19, d: 7, r: "Legendary", i: "🐵", vs: { FR: [6.99,0.19], "Neon FR": [22,0.65] }},
  { n: "Kangaroo", sp: 6.7, v: 0.08, d: 7, r: "Legendary", i: "🦘", vs: { FR: [6.7,0.08], "Neon FR": [22,0.25], "Mega FR": [null,0.7] }},
  { n: "Crocodile", sp: 4.62, v: 0.075, d: 6.5, r: "Ultra-Rare", i: "🐊", vs: { R: [4.62,0.075], FR: [5.5,0.08], "Neon FR": [16,0.24] }},
  { n: "Wild Boar", sp: 0.35, v: 0.275, d: 5.5, r: "Uncommon", i: "🐗", vs: { NP: [0.35,0.275] }},
  { n: "Capybara", sp: 0.59, v: 0.275, d: 5.5, r: "Uncommon", i: "🦫", vs: { NP: [0.59,0.275] }},
  { n: "Black Panther", sp: 0.53, v: 0.25, d: 5.5, r: "Uncommon", i: "🐆", vs: { NP: [0.53,0.25] }},
  { n: "Arctic Fox", sp: 1.91, v: 0.01, d: 6, r: "Ultra-Rare", i: "🦊", vs: { NP: [1.91,0.01] }},
  // C Tier
  { n: "Silly Duck", sp: 0.55, v: 0.25, d: 7, r: "Uncommon", i: "🦆", vs: { NP: [0.55,0.25], R: [0.74,0.27], FR: [1.0,0.29] }},
  { n: "Drake", sp: 0.3, v: 0.225, d: 5, r: "Uncommon", i: "🦎", vs: { NP: [0.3,0.225] }},
  { n: "Chicken", sp: 0.5, v: 0.18, d: 6, r: "Common", i: "🐔", vs: { NP: [0.5,0.18], R: [0.72,0.19] }},
  { n: "Reindeer", sp: 0.27, v: 0.2, d: 5.5, r: "Rare", i: "🫎", vs: { NP: [0.27,0.2] }},
  { n: "Zombie Buffalo", sp: 2.02, v: 0.0225, d: 6, r: "Ultra-Rare", i: "🦬", vs: { NP: [2.02,0.0225] }},
  { n: "Puffin", sp: 1.39, v: 0.02, d: 6, r: "Ultra-Rare", i: "🐧", vs: { NP: [1.39,0.02] }},
  { n: "Lamb", sp: 0.87, v: 0.01, d: 5.5, r: "Ultra-Rare", i: "🐑", vs: { NP: [0.87,0.01] }},
  { n: "Llama", sp: 0.76, v: 0.015, d: 5.5, r: "Ultra-Rare", i: "🦙", vs: { NP: [0.76,0.015] }},
  { n: "Platypus", sp: 1.12, v: 0.0225, d: 6, r: "Ultra-Rare", i: "🦫", vs: { NP: [1.12,0.0225] }},
  { n: "Turkey", sp: 0.64, v: 0.015, d: 5.5, r: "Ultra-Rare", i: "🦃", vs: { NP: [0.64,0.015] }},
  { n: "Ninja Monkey", sp: 0.57, v: 0.0175, d: 6, r: "Legendary", i: "🥷", vs: { FR: [0.57,0.0175] }},
  { n: "Frost Fury", sp: 1.76, v: 0.04, d: 6.5, r: "Legendary", i: "🧊", vs: { FR: [1.76,0.04], "Neon FR": [8,0.165] }},
  { n: "Queen Bee", sp: 0.66, v: 0.015, d: 5.5, r: "Legendary", i: "👑", vs: { FR: [0.66,0.015] }},
  { n: "Shark", sp: 0.51, v: 0.015, d: 5.5, r: "Legendary", i: "🦈", vs: { FR: [0.51,0.015] }},
  { n: "Octopus", sp: 0.21, v: 0.015, d: 5.5, r: "Legendary", i: "🐙", vs: { FR: [0.21,0.015] }},
  { n: "Dancing Dragon", sp: 0.93, v: 0.035, d: 6, r: "Legendary", i: "💃", vs: { FR: [0.93,0.035] }},
  { n: "Lavender Dragon", sp: 0.69, v: 0.02, d: 5.5, r: "Legendary", i: "💜", vs: { FR: [0.69,0.02] }},
  { n: "Ice Golem", sp: 0.53, v: 0.02, d: 5.5, r: "Legendary", i: "🏔️", vs: { FR: [0.53,0.02] }},
  { n: "Chameleon", sp: 0.21, v: 0.015, d: 5.5, r: "Legendary", i: "🦎", vs: { FR: [0.21,0.015] }},
  { n: "Cerberus", sp: 0.5, v: 0.0085, d: 5, r: "Legendary", i: "🐕‍🦺", vs: { FR: [0.5,0.0085] }},
  { n: "Kitsune", sp: 0.37, v: 0.0085, d: 5, r: "Legendary", i: "🦊", vs: { FR: [0.37,0.0085] }},
  { n: "Axolotl", sp: 0.42, v: 0.01, d: 5.5, r: "Legendary", i: "🪷", vs: { FR: [0.42,0.01] }},
  { n: "Cobra", sp: 0.12, v: 0.0085, d: 5, r: "Legendary", i: "🐍", vs: { FR: [0.12,0.0085] }},
  { n: "Peacock", sp: 0.25, v: 0.01, d: 5, r: "Legendary", i: "🦚", vs: { FR: [0.25,0.01] }},
  { n: "Snow Owl", sp: 0.22, v: 0.009, d: 5.5, r: "Legendary", i: "🦉", vs: { FR: [0.22,0.009] }},
  { n: "Unicorn", sp: 0.8, v: 0.01, d: 6, r: "Legendary", i: "🦄", vs: { FR: [0.8,0.01], "Neon FR": [2.5,0.07], "Mega FR": [8,0.27] }},
  { n: "T-Rex", sp: 0.65, v: 0.015, d: 6, r: "Legendary", i: "🦖", vs: { FR: [0.65,0.015], "Neon FR": [2.2,0.085], "Mega FR": [7,0.4] }},
  { n: "Dodo", sp: 0.55, v: 0.015, d: 5.5, r: "Legendary", i: "🦤", vs: { FR: [0.55,0.015], "Neon FR": [2,0.09] }},
  { n: "Skele-Rex", sp: 1.58, v: 0.02, d: 5.5, r: "Legendary", i: "💀", vs: { FR: [1.58,0.02], "Neon FR": [5,0.1] }},
  { n: "Phoenix", sp: 0.72, v: 0.015, d: 5.5, r: "Legendary", i: "🔥", vs: { FR: [0.72,0.015], "Neon FR": [2.2,0.09], "Mega FR": [7,0.425] }},
  { n: "Dragon", sp: 0.5, v: 0.0075, d: 5.5, r: "Legendary", i: "🐲", vs: { FR: [0.5,0.0075] }},
  { n: "Golden Rat", sp: 0.52, v: 0.012, d: 5, r: "Legendary", i: "🐀", vs: { FR: [0.52,0.012] }},
  { n: "Diamond Unicorn", sp: 0.2, v: 0.02, d: 5.5, r: "Legendary", i: "💎", vs: { FR: [0.2,0.02] }},
  { n: "Diamond Dragon", sp: 0.1, v: 0.015, d: 5, r: "Legendary", i: "💠", vs: { FR: [0.1,0.015] }},
  { n: "Musk Ox", sp: 0.07, v: 0.175, d: 5, r: "Rare", i: "🐂", vs: { NP: [0.07,0.175] }},
  { n: "Woolly Mammoth", sp: 0.05, v: 0.08, d: 4.5, r: "Rare", i: "🦣", vs: { NP: [0.05,0.08] }},
  { n: "Chick", sp: 0.1, v: 0.125, d: 5, r: "Common", i: "🐥", vs: { NP: [0.1,0.125] }},
  { n: "Robin", sp: 0.05, v: 0.05, d: 4.5, r: "Common", i: "🐦", vs: { NP: [0.05,0.05] }},
  { n: "Red Squirrel", sp: 0.1, v: 0.006, d: 4.5, r: "Ultra-Rare", i: "🐿️", vs: { NP: [0.1,0.006] }},
  { n: "Albino Bat", sp: 0.09, v: 0.0025, d: 4.5, r: "Ultra-Rare", i: "🦇", vs: { NP: [0.09,0.0025] }},
  { n: "Snowman", sp: 0.05, v: 0.065, d: 4.5, r: "Uncommon", i: "⛄", vs: { NP: [0.05,0.065] }},
  { n: "Wolf", sp: 0.05, v: 0.09, d: 5, r: "Uncommon", i: "🐺", vs: { NP: [0.05,0.09] }},
  { n: "Monkey", sp: 0.05, v: 0.055, d: 4.5, r: "Uncommon", i: "🐒", vs: { NP: [0.05,0.055] }},
  { n: "Beaver", sp: 0.05, v: 0.035, d: 4, r: "Rare", i: "🦫", vs: { NP: [0.05,0.035] }},
  // Potions
  { n: "Ride Potion", sp: 0.51, v: 0.01, d: 10, r: "Item", i: "🧪", vs: { "—": [0.51,0.01] }},
  { n: "Fly Potion", sp: 1.0, v: 0.02, d: 10, r: "Item", i: "💊", vs: { "—": [1.0,0.02] }},
];

// Flatten to variant rows
const ALL = [];
P.forEach(pet => {
  Object.entries(pet.vs).forEach(([vk, [sp, v]]) => {
    ALL.push({ name: pet.n, variant: vk, label: vk === "—" ? pet.n : `${pet.n} (${vk})`, sp, v, demand: pet.d, rarity: pet.r, img: pet.i });
  });
});

const FROST_SP = 83.3;

function Picker({ side, items, onAdd, onRemove, onQty }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const filtered = q.length >= 2 ? ALL.filter(p => p.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12) : [];
  const total = items.reduce((s, i) => s + i.v * i.qty, 0);
  const isGive = side === "give";
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: isGive ? "#E53E3E" : "#38A169", marginBottom: 8 }}>{isGive ? "You're giving" : "You're getting"}</div>
      <div style={{ position: "relative", marginBottom: 8 }} ref={ref}>
        <input type="text" placeholder="Type pet name..." value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          style={{ width: "100%", background: "#fff", border: `2px solid ${isGive ? "#FED7E2" : "#C6F6D5"}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#4a3f5c", boxSizing: "border-box" }} />
        {open && filtered.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, zIndex: 50, maxHeight: 260, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            {filtered.map((p, i) => (
              <div key={i} onClick={() => { onAdd(p); setQ(""); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #F9F1FE" }}
                onMouseOver={e => e.currentTarget.style.background = "#FAF5FF"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                <span style={{ fontSize: 18 }}>{p.img}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.name} <span style={{ color: "#9F7AEA", fontSize: 11 }}>{p.variant !== "—" ? p.variant : ""}</span></div>
                  <div style={{ fontSize: 10, color: "#A0AEC0" }}>{p.v} Frosts · {p.rarity}</div>
                </div>
                {p.sp && <div style={{ fontSize: 11, color: "#EC4899", fontWeight: 700 }}>€{p.sp.toFixed(2)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "#B794F4", fontSize: 12, background: "#FDFAFF", borderRadius: 10, border: "1.5px dashed #E9D8FD" }}>Search and add pets above</div>
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
    const ex = items.find(i => i.label === pet.label);
    if (ex) setter(items.map(i => i.label === pet.label ? { ...i, qty: i.qty + 1 } : i));
    else setter([...items, { ...pet, qty: 1 }]);
  };
  const removeTrade = (side, idx) => { (side === "give" ? setGiveItems : setGetItems)((side === "give" ? giveItems : getItems).filter((_, j) => j !== idx)); };
  const qtyChange = (side, idx, d) => { (side === "give" ? setGiveItems : setGetItems)((side === "give" ? giveItems : getItems).map((item, j) => j === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)); };

  const gT = giveItems.reduce((s, i) => s + i.v * i.qty, 0);
  const rT = getItems.reduce((s, i) => s + i.v * i.qty, 0);
  const diff = rT - gT;
  const verdict = !giveItems.length || !getItems.length ? null : diff > 0.005 ? "WIN" : diff < -0.005 ? "LOSE" : "FAIR";
  const vc = verdict === "WIN" ? "#38A169" : verdict === "LOSE" ? "#E53E3E" : "#D69E2E";

  const deals = useMemo(() => {
    let list = ALL.filter(p => p.sp && p.v).filter(p => !search || p.label.toLowerCase().includes(search.toLowerCase()));
    const vpe = p => p.v / p.sp;
    list.sort((a, b) => {
      if (sortDeals === "bargain") return vpe(b) - vpe(a);
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
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9F7AEA" }}>80+ pets · LIVE StarPets prices + AMTV values · NP / R / FR / Neon / Mega</p>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 40px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#fff", borderRadius: 12, padding: 4, border: "2px solid #F3E8FF" }}>
          {[["trade", "Trade Checker"], ["deals", "Deal Finder"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", background: tab === k ? "linear-gradient(135deg, #EC4899, #A855F7)" : "transparent", color: tab === k ? "#fff" : "#9F7AEA", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </div>

        {tab === "trade" && (
          <div>
            <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "10px 14px", marginBottom: 14, border: "1.5px solid #FDE68A", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              Search for any pet — you'll see all variants (NP, Ride, FR, Neon, Mega). 80+ pets with real prices!
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <Picker side="give" items={giveItems} onAdd={p => addTrade("give", p)} onRemove={i => removeTrade("give", i)} onQty={(i, d) => qtyChange("give", i, d)} />
              <Picker side="get" items={getItems} onAdd={p => addTrade("get", p)} onRemove={i => removeTrade("get", i)} onQty={(i, d) => qtyChange("get", i, d)} />
            </div>
            {verdict && (
              <div style={{ background: verdict === "WIN" ? "linear-gradient(135deg, #F0FFF4, #E6FFFA)" : verdict === "LOSE" ? "linear-gradient(135deg, #FFF5F5, #FED7E2)" : "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 16, padding: "20px 24px", textAlign: "center", border: `2px solid ${verdict === "WIN" ? "#9AE6B4" : verdict === "LOSE" ? "#FEB2B2" : "#FDE68A"}` }}>
                <div style={{ fontSize: 48 }}>{verdict === "WIN" ? "🎉" : verdict === "LOSE" ? "🚫" : "🤝"}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: vc }}>{verdict}!</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Giving: <strong>{gT.toFixed(3)} Frosts</strong> → Getting: <strong>{rT.toFixed(3)} Frosts</strong></div>
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

        {tab === "deals" && (<>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <input type="text" placeholder="Search 80+ pets..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 200px", background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 14px", color: "#4a3f5c", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <select value={sortDeals} onChange={e => setSortDeals(e.target.value)} style={ss}>
              <option value="bargain">Best value/€</option>
              <option value="price">Cheapest</option>
              <option value="value">Highest value</option>
              <option value="demand">Highest demand</option>
            </select>
          </div>
          <div style={{ fontSize: 11, color: "#9F7AEA", marginBottom: 8 }}>{deals.length} listings found</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {deals.slice(0, 60).map((pet, idx) => {
              const bvf = (pet.v / pet.sp) / (1 / FROST_SP);
              return (
                <div key={idx} style={{ background: "#fff", border: `2px solid ${bvf > 1.5 ? "#9AE6B4" : "#F3E8FF"}`, borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 22 }}>{pet.img}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{pet.name}</div>
                        <div style={{ fontSize: 10, color: "#A0AEC0" }}>{pet.rarity} · Demand {pet.demand}/10</div>
                      </div>
                    </div>
                    <span style={{ background: "#F3E8FF", color: "#6B46C1", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{pet.variant}</span>
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
          <strong style={{ color: "#6B46C1" }}>Real data!</strong> 80+ pets · StarPets prices scraped live 1 Apr 2026 · AMTV values (Frost = 1.0) · NP = No Potion, R = Ride, FR = Fly Ride · Always verify before trading! Built by Ian + Dottie 🐾
        </div>
      </div>
    </div>
  );
}

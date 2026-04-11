"use client";
import { useState, useMemo, useRef, useEffect } from "react";

/*
  DOTTIE'S ADOPT ME TRADING TOOL v3
  Values verified by Dottie on her phone 11 Apr 2026
  All values in FROST DRAGON scale (Frost = 1.0)
  AMVGG values from amvgg.com | Elvebredd values from elvebredd.com
  StarPets prices from scanner where available
*/

// amv = AMVGG frost value, elv = Elvebredd frost value, sp = StarPets EUR price
const P = [
  { n:"Bat Dragon", amv:2.964, elv:2.888, sp:230, d:10, r:"Legendary", i:"🦇" },
  { n:"Shadow Dragon", amv:1.904, elv:1.871, sp:159.82, d:10, r:"Legendary", i:"🐉" },
  { n:"Giraffe", amv:1.313, elv:1.268, sp:null, d:9.5, r:"Legendary", i:"🦒" },
  { n:"Frost Dragon", amv:1.05, elv:1.06, sp:83.3, d:9.5, r:"Legendary", i:"❄️" },
  { n:"Owl", amv:0.855, elv:0.835, sp:77.44, d:9, r:"Legendary", i:"🦉" },
  { n:"Parrot", amv:0.687, elv:0.665, sp:56, d:9, r:"Legendary", i:"🦜" },
  { n:"Crow", amv:0.59, elv:0.576, sp:51, d:8.5, r:"Legendary", i:"🐦‍⬛" },
  { n:"African Wild Dog", amv:0.554, elv:0.545, sp:null, d:7.5, r:"Ultra-Rare", i:"🐕" },
  { n:"Balloon Unicorn", amv:0.506, elv:0.473, sp:null, d:7, r:"Legendary", i:"🎈" },
  { n:"Evil Unicorn", amv:0.446, elv:0.42, sp:36.6, d:8.5, r:"Legendary", i:"🦄" },
  { n:"Giant Panda", amv:0.434, elv:0.42, sp:null, d:7, r:"Legendary", i:"🐼" },
  { n:"Cryptid", amv:0.373, elv:0.353, sp:null, d:7, r:"Legendary", i:"🦕" },
  { n:"Haetae", amv:0.301, elv:0.277, sp:null, d:7, r:"Legendary", i:"🐲" },
  { n:"Hedgehog", amv:0.265, elv:0.252, sp:20, d:8, r:"Ultra-Rare", i:"🦔" },
  { n:"Blazing Lion", amv:0.241, elv:0.234, sp:null, d:7, r:"Legendary", i:"🔥" },
  { n:"Dalmatian", amv:0.223, elv:0.212, sp:18, d:8, r:"Ultra-Rare", i:"🐾" },
  { n:"Arctic Reindeer", amv:0.187, elv:0.185, sp:17.35, d:8, r:"Legendary", i:"🦌" },
  { n:"Cow", amv:0.126, elv:0.12, sp:9.5, d:8, r:"Rare", i:"🐄" },
  { n:"Pelican", amv:0.133, elv:0.116, sp:null, d:6.5, r:"Ultra-Rare", i:"🐦" },
  { n:"Turtle", amv:0.0978, elv:0.10, sp:9.41, d:7, r:"Legendary", i:"🐢" },
  { n:"Mini Pig", amv:0.116, elv:0.103, sp:null, d:6.5, r:"Ultra-Rare", i:"🐷" },
  { n:"Monkey King", amv:0.101, elv:0.095, sp:7.69, d:7, r:"Legendary", i:"🐵" },
  { n:"Flamingo", amv:0.092, elv:0.089, sp:7.94, d:7.5, r:"Ultra-Rare", i:"🦩" },
  { n:"Kangaroo", amv:0.084, elv:0.083, sp:6.7, d:7, r:"Legendary", i:"🦘" },
  { n:"Elephant", amv:0.0722, elv:0.07, sp:5.2, d:7, r:"Rare", i:"🐘" },
  { n:"Albino Monkey", amv:0.075, elv:0.074, sp:6.02, d:7.5, r:"Legendary", i:"🐒" },
  { n:"Crocodile", amv:0.0591, elv:0.06, sp:4.9, d:6.5, r:"Ultra-Rare", i:"🐊" },
  { n:"Lion", amv:0.06, elv:0.058, sp:4.26, d:7, r:"Ultra-Rare", i:"🦁" },
  { n:"Blue Dog", amv:0.0565, elv:0.05, sp:3.27, d:7, r:"Uncommon", i:"🐕" },
  { n:"Silverback Gorilla", amv:0.053, elv:0.049, sp:3.0, d:6, r:"Legendary", i:"🦍" },
  { n:"Pig", amv:0.0313, elv:0.03, sp:2.2, d:7, r:"Rare", i:"🐷" },
  { n:"Pink Cat", amv:0.0313, elv:0.03, sp:3.27, d:7, r:"Uncommon", i:"🐱" },
  { n:"Frost Fury", amv:0.034, elv:0.026, sp:1.76, d:6.5, r:"Legendary", i:"🧊" },
  { n:"Meerkat", amv:0.031, elv:0.023, sp:2.48, d:6.5, r:"Uncommon", i:"🦡" },
  { n:"Papa Moose", amv:0.037, elv:0.031, sp:1.78, d:6, r:"Legendary", i:"🫎" },
  { n:"Latte Kitsune", amv:0.03, elv:0.025, sp:1.56, d:6, r:"Legendary", i:"☕" },
  { n:"Dango Penguins", amv:0.036, elv:0.026, sp:2.0, d:6, r:"Legendary", i:"🐧" },
  { n:"Arctic Fox", amv:0.031, elv:0.032, sp:1.76, d:6, r:"Ultra-Rare", i:"🦊" },
  { n:"Silly Duck", amv:0.0079, elv:0.01, sp:0.55, d:7, r:"Uncommon", i:"🦆" },
  { n:"Rhino", amv:0.0077, elv:0.01, sp:0.33, d:6, r:"Rare", i:"🦏" },
  { n:"Hyena", amv:0.023, elv:0.022, sp:1.35, d:6.5, r:"Rare", i:"🐺" },
  { n:"Brown Bear", amv:0.022, elv:0.019, sp:1.2, d:6, r:"Rare", i:"🐻" },
  { n:"Polar Bear", amv:0.025, elv:0.019, sp:0.9, d:6, r:"Rare", i:"🐻‍❄️" },
  { n:"Swan", amv:0.024, elv:0.008, sp:0.7, d:6, r:"Rare", i:"🦢" },
  { n:"Dancing Dragon", amv:0.018, elv:0.013, sp:0.93, d:6, r:"Legendary", i:"💃" },
  { n:"Zombie Buffalo", amv:0.03, elv:0.022, sp:2.02, d:6, r:"Ultra-Rare", i:"🦬" },
  { n:"Skele-Rex", amv:0.029, elv:0.02, sp:1.58, d:5.5, r:"Legendary", i:"💀" },
  { n:"Irish Water Spaniel", amv:0.048, elv:0.032, sp:2.57, d:6, r:"Ultra-Rare", i:"🐕" },
  { n:"Frostbite Bear", amv:0.046, elv:0.044, sp:2.87, d:6, r:"Legendary", i:"🐻‍❄️" },
  { n:"Dragonfruit Fox", amv:0.045, elv:0.041, sp:2.54, d:6, r:"Legendary", i:"🦊" },
  { n:"Tortoiseshell Guinea Pig", amv:0.12, elv:0.1, sp:null, d:6.5, r:"Legendary", i:"🐹" },
  { n:"Sugar Glider", amv:0.065, elv:0.055, sp:null, d:6, r:"Legendary", i:"🐿️" },
  { n:"Ride Potion", amv:0.01, elv:0.01, sp:0.51, d:10, r:"Item", i:"🧪" },
  { n:"Fly Potion", amv:0.02, elv:0.02, sp:1.0, d:10, r:"Item", i:"💊" },
];

const FROST_SP = 83.3;

function Picker({ side, items, onAdd, onRemove, onQty }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("amv");
  const ref = useRef(null);
  const filtered = q.length >= 2 ? P.filter(p => p.n.toLowerCase().includes(q.toLowerCase())).slice(0, 12) : [];
  const total = items.reduce((s, i) => s + (src === "amv" ? i.amv : i.elv) * i.qty, 0);
  const isGive = side === "give";
  useEffect(() => { const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  return (
    <div style={{ flex: 1, minWidth: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: isGive ? "#E53E3E" : "#38A169" }}>{isGive ? "You're giving" : "You're getting"}</div>
        <div style={{ display: "flex", gap: 2, background: "#F3E8FF", borderRadius: 6, padding: 2 }}>
          {[["amv","AMVGG"],["elv","Elve"]].map(([k,l]) => (
            <button key={k} onClick={() => setSrc(k)} style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: src === k ? "#7C3AED" : "transparent", color: src === k ? "#fff" : "#9F7AEA", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: 8 }} ref={ref}>
        <input type="text" placeholder="Type pet name..." value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          style={{ width: "100%", background: "#fff", border: `2px solid ${isGive ? "#FED7E2" : "#C6F6D5"}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#4a3f5c", boxSizing: "border-box" }} />
        {open && filtered.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, zIndex: 50, maxHeight: 260, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            {filtered.map((p, i) => (
              <div key={i} onClick={() => { onAdd({...p, useSrc: src}); setQ(""); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #F9F1FE" }}
                onMouseOver={e => e.currentTarget.style.background = "#FAF5FF"} onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                <span style={{ fontSize: 18 }}>{p.i}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.n}</div>
                  <div style={{ fontSize: 10, color: "#A0AEC0" }}>{src === "amv" ? p.amv : p.elv} Frosts ({src === "amv" ? "AMVGG" : "Elve"}) · {p.r}</div>
                </div>
                {p.sp && <div style={{ fontSize: 11, color: "#EC4899", fontWeight: 700 }}>€{p.sp.toFixed(2)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {items.length === 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "#B794F4", fontSize: 12, background: "#FDFAFF", borderRadius: 10, border: "1.5px dashed #E9D8FD" }}>Search and add pets above</div>
      ) : items.map((item, i) => {
        const val = src === "amv" ? item.amv : item.elv;
        return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#fff", borderRadius: 8, marginBottom: 4, border: "1.5px solid #F3E8FF" }}>
          <span style={{ fontSize: 16 }}>{item.i}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{item.n}</div>
            <div style={{ fontSize: 10, color: "#A0AEC0" }}>{val} Frosts</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <button onClick={() => onQty(i, -1)} style={qb}>−</button>
            <span style={{ fontWeight: 800, fontSize: 13, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
            <button onClick={() => onQty(i, 1)} style={qb}>+</button>
          </div>
          <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: "#E53E3E", cursor: "pointer", fontSize: 16, padding: "0 2px" }}>×</button>
        </div>);
      })}
      {items.length > 0 && (
        <div style={{ marginTop: 8, padding: "8px 12px", background: isGive ? "#FFF5F5" : "#F0FFF4", borderRadius: 8, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 14 }}>
          <span style={{ color: "#6B46C1" }}>Total ({src === "amv" ? "AMVGG" : "Elve"})</span>
          <span style={{ color: isGive ? "#E53E3E" : "#38A169" }}>{total.toFixed(4)} Frosts</span>
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
  const [sortDeals, setSortDeals] = useState("buying");
  const [compSort, setCompSort] = useState("diff");

  const addTrade = (side, pet) => {
    const setter = side === "give" ? setGiveItems : setGetItems;
    const items = side === "give" ? giveItems : getItems;
    const ex = items.find(i => i.n === pet.n);
    if (ex) setter(items.map(i => i.n === pet.n ? { ...i, qty: i.qty + 1 } : i));
    else setter([...items, { ...pet, qty: 1 }]);
  };
  const removeTrade = (side, idx) => { (side === "give" ? setGiveItems : setGetItems)((side === "give" ? giveItems : getItems).filter((_, j) => j !== idx)); };
  const qtyChange = (side, idx, d) => { (side === "give" ? setGiveItems : setGetItems)((side === "give" ? giveItems : getItems).map((item, j) => j === idx ? { ...item, qty: Math.max(1, item.qty + d) } : item)); };

  const gT = giveItems.reduce((s, i) => s + i.amv * i.qty, 0);
  const rT = getItems.reduce((s, i) => s + i.amv * i.qty, 0);
  const diff = rT - gT;
  const verdict = !giveItems.length || !getItems.length ? null : diff > 0.002 ? "WIN" : diff < -0.002 ? "LOSE" : "FAIR";
  const vc = verdict === "WIN" ? "#38A169" : verdict === "LOSE" ? "#E53E3E" : "#D69E2E";

  // Deal Finder — StarPets buying power (value per EUR)
  const deals = useMemo(() => {
    let list = P.filter(p => p.sp && p.amv > 0).filter(p => !search || p.n.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      if (sortDeals === "buying") return (b.amv / b.sp) - (a.amv / a.sp);
      if (sortDeals === "price") return a.sp - b.sp;
      if (sortDeals === "value") return b.amv - a.amv;
      if (sortDeals === "demand") return b.d - a.d;
      return 0;
    });
    return list;
  }, [search, sortDeals]);

  // Value Compare — AMVGG vs Elvebredd side by side
  const compared = useMemo(() => {
    let list = P.filter(p => p.amv > 0 && p.elv > 0).filter(p => !search || p.n.toLowerCase().includes(search.toLowerCase()));
    list = list.map(p => {
      const diffPct = Math.round(((p.elv - p.amv) / p.amv) * 100);
      return { ...p, diffPct };
    });
    if (compSort === "diff") list.sort((a, b) => Math.abs(b.diffPct) - Math.abs(a.diffPct));
    else if (compSort === "elveUp") list.sort((a, b) => b.diffPct - a.diffPct);
    else if (compSort === "amvUp") list.sort((a, b) => a.diffPct - b.diffPct);
    else if (compSort === "value") list.sort((a, b) => b.amv - a.amv);
    return list;
  }, [search, compSort]);

  const tabs = [["trade","Trade Checker"],["deals","Deal Finder"],["compare","Value Compare"]];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #FFF5F7 0%, #FDF2F8 30%, #FAF5FF 60%, #F0F9FF 100%)", color: "#4a3f5c" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div style={{ background: "linear-gradient(135deg, #FDF2F8, #FCE7F3, #FAE8FF)", borderBottom: "2px solid #F9A8D4", padding: "18px 20px 12px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, margin: 0, background: "linear-gradient(90deg, #EC4899, #A855F7, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dottie's Adopt Me! Trading Tool</h1>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9F7AEA" }}>AMVGG + Elvebredd values side by side · StarPets prices · v3</p>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 20px 40px" }}>
        <div style={{ display: "flex", gap: 3, marginBottom: 16, background: "#fff", borderRadius: 12, padding: 3, border: "2px solid #F3E8FF", overflowX: "auto" }}>
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, border: "none", background: tab === k ? "linear-gradient(135deg, #EC4899, #A855F7)" : "transparent", color: tab === k ? "#fff" : "#9F7AEA", fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{l}</button>
          ))}
        </div>

        {/* TRADE CHECKER */}
        {tab === "trade" && (
          <div>
            <div style={{ background: "#FFFBEB", borderRadius: 10, padding: "10px 14px", marginBottom: 14, border: "1.5px solid #FDE68A", fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              Toggle between AMVGG and Elvebredd values using the buttons on each side. See the trade from both perspectives!
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <Picker side="give" items={giveItems} onAdd={p => addTrade("give", p)} onRemove={i => removeTrade("give", i)} onQty={(i, d) => qtyChange("give", i, d)} />
              <Picker side="get" items={getItems} onAdd={p => addTrade("get", p)} onRemove={i => removeTrade("get", i)} onQty={(i, d) => qtyChange("get", i, d)} />
            </div>
            {verdict && (
              <div style={{ background: verdict === "WIN" ? "linear-gradient(135deg, #F0FFF4, #E6FFFA)" : verdict === "LOSE" ? "linear-gradient(135deg, #FFF5F5, #FED7E2)" : "linear-gradient(135deg, #FFFBEB, #FEF3C7)", borderRadius: 16, padding: "20px 24px", textAlign: "center", border: `2px solid ${verdict === "WIN" ? "#9AE6B4" : verdict === "LOSE" ? "#FEB2B2" : "#FDE68A"}` }}>
                <div style={{ fontSize: 48 }}>{verdict === "WIN" ? "🎉" : verdict === "LOSE" ? "🚫" : "🤝"}</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 36, color: vc }}>{verdict}!</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>
                  <strong>AMVGG:</strong> Giving {gT.toFixed(4)} → Getting {rT.toFixed(4)} Frosts
                </div>
                <div style={{ fontSize: 12, marginTop: 4, color: "#9F7AEA" }}>
                  <strong>Elvebredd:</strong> Giving {giveItems.reduce((s,i) => s+i.elv*i.qty, 0).toFixed(4)} → Getting {getItems.reduce((s,i) => s+i.elv*i.qty, 0).toFixed(4)} Frosts
                </div>
              </div>
            )}
            {(giveItems.length > 0 || getItems.length > 0) && (
              <button onClick={() => { setGiveItems([]); setGetItems([]); }} style={{ marginTop: 12, background: "none", border: "1.5px solid #E9D8FD", borderRadius: 8, padding: "8px 16px", color: "#9F7AEA", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Clear trade</button>
            )}
          </div>
        )}

        {/* DEAL FINDER — StarPets buying power */}
        {tab === "deals" && (<>
          <div style={{ background: "#F0FFF4", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: "1.5px solid #9AE6B4", fontSize: 12, color: "#276749", lineHeight: 1.5 }}>
            💰 Which pets give you the most trade value per euro on StarPets?
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <input type="text" placeholder="Search pets..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 180px", background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 14px", color: "#4a3f5c", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <select value={sortDeals} onChange={e => setSortDeals(e.target.value)} style={{ background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 12px", color: "#6B46C1", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
              <option value="buying">Best buying power</option>
              <option value="price">Cheapest first</option>
              <option value="value">Highest value</option>
              <option value="demand">Highest demand</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {deals.slice(0, 50).map((pet, idx) => {
              const valuePerEur = pet.amv / pet.sp;
              const frostPerEur = 1.0 / FROST_SP;
              const bvf = valuePerEur / frostPerEur;
              return (
                <div key={idx} style={{ background: "#fff", border: `2px solid ${bvf > 1.3 ? "#9AE6B4" : "#F3E8FF"}`, borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{pet.i}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{pet.n}</div>
                      <div style={{ fontSize: 10, color: "#A0AEC0" }}>{pet.r} · Demand {pet.d}/10</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, background: "#FDF2F8", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#EC4899" }}>€{pet.sp.toFixed(2)}</div>
                      <div style={{ fontSize: 8, color: "#F9A8D4", fontWeight: 700 }}>STARPETS</div>
                    </div>
                    <div style={{ flex: 1, background: "#FAF5FF", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: "#6B46C1" }}>{pet.amv}</div>
                      <div style={{ fontSize: 8, color: "#B794F4", fontWeight: 700 }}>AMVGG</div>
                    </div>
                    <div style={{ flex: 1, background: bvf > 1.3 ? "#F0FFF4" : "#FFFBEB", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: bvf > 1.3 ? "#38A169" : "#D69E2E" }}>{bvf.toFixed(1)}x</div>
                      <div style={{ fontSize: 8, color: "#A0AEC0", fontWeight: 700 }}>VS FROST</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* VALUE COMPARE — AMVGG vs Elvebredd side by side */}
        {tab === "compare" && (<>
          <div style={{ background: "#EBF8FF", borderRadius: 10, padding: "10px 14px", marginBottom: 12, border: "1.5px solid #90CDF4", fontSize: 12, color: "#2A4365", lineHeight: 1.5 }}>
            🔍 Where AMVGG and Elvebredd disagree. Green = Elve values higher. Red = AMVGG values higher. Use this to find edges!
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <input type="text" placeholder="Search pets..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 180px", background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 14px", color: "#4a3f5c", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <select value={compSort} onChange={e => setCompSort(e.target.value)} style={{ background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 12px", color: "#6B46C1", fontSize: 12, fontFamily: "inherit", fontWeight: 600 }}>
              <option value="diff">Biggest difference</option>
              <option value="elveUp">Elve values higher</option>
              <option value="amvUp">AMVGG values higher</option>
              <option value="value">Highest value</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 8 }}>
            {compared.slice(0, 50).map((pet, idx) => {
              const isElveHigher = pet.diffPct > 0;
              const absDiff = Math.abs(pet.diffPct);
              const barColor = isElveHigher ? "#48BB78" : "#FC8181";
              return (
                <div key={idx} style={{ background: "#fff", borderRadius: 12, padding: 12, border: `2px solid ${absDiff >= 10 ? barColor : "#F3E8FF"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{pet.i}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 13 }}>{pet.n}</div>
                      <div style={{ fontSize: 10, color: "#A0AEC0" }}>{pet.r}</div>
                    </div>
                    <div style={{ padding: "3px 10px", borderRadius: 8, fontSize: 12, fontWeight: 900, color: "#fff", background: absDiff < 5 ? "#CBD5E0" : barColor }}>
                      {pet.diffPct > 0 ? "+" : ""}{pet.diffPct}%
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ flex: 1, background: "#FFFBEB", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#D69E2E" }}>{pet.amv}</div>
                      <div style={{ fontSize: 9, color: "#ECC94B", fontWeight: 700 }}>AMVGG</div>
                    </div>
                    <div style={{ flex: 1, background: "#EBF8FF", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#3182CE" }}>{pet.elv}</div>
                      <div style={{ fontSize: 9, color: "#63B3ED", fontWeight: 700 }}>ELVEBREDD</div>
                    </div>
                    {pet.sp && (
                      <div style={{ flex: 1, background: "#FDF2F8", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#EC4899" }}>€{pet.sp.toFixed(2)}</div>
                        <div style={{ fontSize: 9, color: "#F9A8D4", fontWeight: 700 }}>STARPETS</div>
                      </div>
                    )}
                  </div>
                  {absDiff >= 10 && (
                    <div style={{ marginTop: 6, fontSize: 10, color: "#718096", fontStyle: "italic" }}>
                      {isElveHigher
                        ? `Elve users value this ${absDiff}% more — buy from AMVGG traders`
                        : `AMVGG users value this ${absDiff}% more — buy from Elve traders`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>)}

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#fff", borderRadius: 12, fontSize: 11, color: "#A0AEC0", lineHeight: 1.7, border: "2px solid #F3E8FF" }}>
          <strong style={{ color: "#6B46C1" }}>v3 — Verified values!</strong> AMVGG + Elvebredd values checked by Dottie. StarPets prices from scanner. Always double-check before trading! Built by Ian + Dottie 🐾
        </div>
      </div>
    </div>
  );
}

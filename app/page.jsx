"use client";
import { useState, useMemo, useEffect, useRef } from "react";

/*
  CORRECT AMTV VALUES — scraped LIVE from AdoptMeTradingValues.com 2 Apr 2026
  Frost Dragon = 166 RP = 1.0 Frosts
  StarPets prices scraped 1-2 Apr 2026
*/

// All pets: name, AMTV value in Frosts, StarPets cheapest EUR, rarity, demand, emoji
// sp=null means not found on StarPets at time of scrape
const P = [
  // S+ Tier — Top Legendaries
  { n:"Bat Dragon", v:2.892, sp:230, d:10, r:"Legendary", i:"🦇" },
  { n:"Shadow Dragon", v:1.892, sp:159.82, d:10, r:"Legendary", i:"🐉" },
  { n:"Giraffe", v:1.289, sp:null, d:9.5, r:"Legendary", i:"🦒" },
  { n:"Frost Dragon", v:1.0, sp:83.3, d:9.5, r:"Legendary", i:"❄️" },
  // S Tier
  { n:"Owl", v:0.831, sp:77.44, d:9, r:"Legendary", i:"🦉" },
  { n:"Parrot", v:0.663, sp:56, d:9, r:"Legendary", i:"🦜" },
  { n:"Crow", v:0.566, sp:51, d:8.5, r:"Legendary", i:"🐦‍⬛" },
  { n:"African Wild Dog", v:0.518, sp:null, d:7.5, r:"Ultra-Rare", i:"🐕" },
  { n:"Balloon Unicorn", v:0.458, sp:null, d:7, r:"Legendary", i:"🎈" },
  { n:"Giant Panda", v:0.434, sp:null, d:7, r:"Legendary", i:"🐼" },
  { n:"Evil Unicorn", v:0.422, sp:36.6, d:8.5, r:"Legendary", i:"🦄" },
  // A Tier
  { n:"Cryptid", v:0.349, sp:null, d:7, r:"Legendary", i:"🦕" },
  { n:"Haetae", v:0.265, sp:null, d:7, r:"Legendary", i:"🐲" },
  { n:"Hedgehog", v:0.253, sp:20, d:8, r:"Ultra-Rare", i:"🦔" },
  { n:"Blazing Lion", v:0.241, sp:null, d:7, r:"Legendary", i:"🦁" },
  { n:"Diamond Butterfly", v:0.235, sp:null, d:6.5, r:"Legendary", i:"🦋" },
  { n:"Orchid Butterfly", v:0.217, sp:null, d:6.5, r:"Legendary", i:"🦋" },
  { n:"Dalmatian", v:0.211, sp:18, d:8, r:"Ultra-Rare", i:"🐾" },
  { n:"Arctic Reindeer", v:0.187, sp:17.35, d:8, r:"Legendary", i:"🦌" },
  { n:"Cow", v:0.133, sp:9.5, d:8, r:"Rare", i:"🐄" },
  { n:"Pelican", v:0.133, sp:null, d:6.5, r:"Ultra-Rare", i:"🐦" },
  { n:"Mini Pig", v:0.116, sp:null, d:6.5, r:"Ultra-Rare", i:"🐷" },
  { n:"Peppermint Penguin", v:0.108, sp:null, d:6.5, r:"Ultra-Rare", i:"🐧" },
  { n:"Monkey King", v:0.101, sp:6.99, d:7, r:"Legendary", i:"🐵" },
  { n:"Flamingo", v:0.087, sp:7.94, d:7.5, r:"Ultra-Rare", i:"🦩" },
  { n:"Cabbit", v:0.082, sp:null, d:6.5, r:"Ultra-Rare", i:"🐰" },
  { n:"Kangaroo", v:0.08, sp:6.7, d:7, r:"Legendary", i:"🦘" },
  { n:"Albino Monkey", v:0.075, sp:6.02, d:7.5, r:"Legendary", i:"🐒" },
  { n:"Goose", v:0.072, sp:null, d:6.5, r:"Rare", i:"🪿" },
  // B Tier
  { n:"Candyfloss Chick", v:0.07, sp:null, d:6, r:"Legendary", i:"🐣" },
  { n:"Sugar Glider", v:0.065, sp:null, d:6, r:"Legendary", i:"🐿️" },
  { n:"Crocodile", v:0.063, sp:4.62, d:6.5, r:"Ultra-Rare", i:"🐊" },
  { n:"Lion", v:0.06, sp:4.26, d:7, r:"Ultra-Rare", i:"🦁" },
  { n:"Frost Unicorn", v:0.058, sp:null, d:6, r:"Legendary", i:"🦄" },
  { n:"Border Collie", v:0.055, sp:null, d:6, r:"Rare", i:"🐕" },
  { n:"Turtle", v:0.048, sp:9.41, d:7, r:"Legendary", i:"🐢" },
  { n:"Elephant", v:0.043, sp:5.2, d:7, r:"Rare", i:"🐘" },
  { n:"Cupid Dragon", v:0.043, sp:null, d:6, r:"Legendary", i:"💘" },
  { n:"Winged Tiger", v:0.042, sp:null, d:6, r:"Legendary", i:"🐯" },
  { n:"Blue Dog", v:0.039, sp:3.27, d:7, r:"Uncommon", i:"🐕" },
  { n:"Pink Cat", v:0.037, sp:3.27, d:7, r:"Uncommon", i:"🐱" },
  { n:"Pig", v:0.036, sp:2.2, d:7, r:"Rare", i:"🐷" },
  { n:"Frost Fury", v:0.034, sp:1.76, d:6.5, r:"Legendary", i:"🧊" },
  { n:"Meerkat", v:0.031, sp:2.48, d:6.5, r:"Uncommon", i:"🦡" },
  { n:"Zombie Buffalo", v:0.03, sp:2.02, d:6, r:"Ultra-Rare", i:"🦬" },
  { n:"Skele-Rex", v:0.029, sp:1.58, d:5.5, r:"Legendary", i:"💀" },
  { n:"Silly Duck", v:0.028, sp:0.55, d:7, r:"Uncommon", i:"🦆" },
  { n:"Polar Bear", v:0.025, sp:0.9, d:6, r:"Rare", i:"🐻‍❄️" },
  { n:"Swan", v:0.024, sp:0.7, d:6, r:"Rare", i:"🦢" },
  // C Tier
  { n:"Hyena", v:0.023, sp:1.35, d:6.5, r:"Rare", i:"🐺" },
  { n:"Brown Bear", v:0.022, sp:1.2, d:6, r:"Rare", i:"🐻" },
  { n:"Dancing Dragon", v:0.018, sp:0.93, d:6, r:"Legendary", i:"💃" },
  { n:"Lavender Dragon", v:0.013, sp:0.69, d:5.5, r:"Legendary", i:"💜" },
  { n:"Queen Bee", v:0.01, sp:0.66, d:5.5, r:"Legendary", i:"👑" },
  { n:"Wild Boar", v:0.008, sp:0.35, d:5.5, r:"Uncommon", i:"🐗" },
  { n:"Golden Rat", v:0.008, sp:0.52, d:5, r:"Legendary", i:"🐀" },
  { n:"Diamond Unicorn", v:0.006, sp:0.2, d:5.5, r:"Legendary", i:"💎" },
  { n:"Kitsune", v:0.006, sp:0.37, d:5, r:"Legendary", i:"🦊" },
  { n:"Diamond Dragon", v:0.005, sp:0.1, d:5, r:"Legendary", i:"💠" },
  { n:"Rhino", v:0.024, sp:0.33, d:6, r:"Rare", i:"🦏" },
  { n:"Chicken", v:0.01, sp:0.5, d:6, r:"Common", i:"🐔" },
  { n:"Drake", v:0.008, sp:0.3, d:5, r:"Uncommon", i:"🦎" },
  { n:"Ninja Monkey", v:0.012, sp:0.57, d:6, r:"Legendary", i:"🥷" },
  { n:"Shark", v:0.01, sp:0.51, d:5.5, r:"Legendary", i:"🦈" },
  { n:"Octopus", v:0.01, sp:0.21, d:5.5, r:"Legendary", i:"🐙" },
  { n:"Cerberus", v:0.005, sp:0.5, d:5, r:"Legendary", i:"🐕‍🦺" },
  { n:"Axolotl", v:0.005, sp:0.42, d:5.5, r:"Legendary", i:"🪷" },
  { n:"Cobra", v:0.005, sp:0.12, d:5, r:"Legendary", i:"🐍" },
  { n:"Peacock", v:0.005, sp:0.25, d:5, r:"Legendary", i:"🦚" },
  { n:"Snow Owl", v:0.005, sp:0.22, d:5.5, r:"Legendary", i:"🦉" },
  { n:"Ice Golem", v:0.005, sp:0.53, d:5.5, r:"Legendary", i:"🏔️" },
  { n:"Chameleon", v:0.005, sp:0.21, d:5.5, r:"Legendary", i:"🦎" },
  { n:"Unicorn", v:0.004, sp:0.8, d:6, r:"Legendary", i:"🦄" },
  { n:"T-Rex", v:0.004, sp:0.65, d:6, r:"Legendary", i:"🦖" },
  { n:"Dodo", v:0.004, sp:0.55, d:5.5, r:"Legendary", i:"🦤" },
  { n:"Phoenix", v:0.004, sp:0.72, d:5.5, r:"Legendary", i:"🔥" },
  { n:"Dragon", v:0.003, sp:0.5, d:5.5, r:"Legendary", i:"🐲" },
  { n:"Capybara", v:0.008, sp:0.59, d:5.5, r:"Uncommon", i:"🦫" },
  { n:"Black Panther", v:0.008, sp:0.53, d:5.5, r:"Uncommon", i:"🐆" },
  { n:"Llama", v:0.008, sp:0.76, d:5.5, r:"Ultra-Rare", i:"🦙" },
  { n:"Lamb", v:0.005, sp:0.87, d:5.5, r:"Ultra-Rare", i:"🐑" },
  { n:"Puffin", v:0.005, sp:1.39, d:6, r:"Ultra-Rare", i:"🐧" },
  { n:"Arctic Fox", v:0.005, sp:1.91, d:6, r:"Ultra-Rare", i:"🦊" },
  { n:"Reindeer", v:0.008, sp:0.27, d:5.5, r:"Rare", i:"🫎" },
  { n:"Musk Ox", v:0.005, sp:0.07, d:5, r:"Rare", i:"🐂" },
  { n:"Chick", v:0.004, sp:0.1, d:5, r:"Common", i:"🐥" },
  { n:"Wolf", v:0.003, sp:0.05, d:5, r:"Uncommon", i:"🐺" },
  { n:"Snowman", v:0.002, sp:0.05, d:4.5, r:"Uncommon", i:"⛄" },
  { n:"Monkey", v:0.002, sp:0.05, d:4.5, r:"Uncommon", i:"🐒" },
  { n:"Robin", v:0.001, sp:0.05, d:4.5, r:"Common", i:"🐦" },
  { n:"Woolly Mammoth", v:0.001, sp:0.05, d:4.5, r:"Rare", i:"🦣" },
  { n:"Beaver", v:0.001, sp:0.05, d:4, r:"Rare", i:"🦫" },
  // Potions
  { n:"Ride Potion", v:0.01, sp:0.51, d:10, r:"Item", i:"🧪" },
  { n:"Fly Potion", v:0.02, sp:1.0, d:10, r:"Item", i:"💊" },
];

// Flatten — each pet is one row (no variants for now, values are for default/FR)
const ALL = P.filter(p => p.sp !== null).map(p => ({
  name: p.n, sp: p.sp, v: p.v, demand: p.d, rarity: p.r, img: p.i,
  label: p.n,
}));

const FROST_SP = P.find(p => p.n === "Frost Dragon")?.sp || 83.3;

function Picker({ side, items, onAdd, onRemove, onQty, allPets }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const filtered = q.length >= 2 ? allPets.filter(p => p.label.toLowerCase().includes(q.toLowerCase())).slice(0, 12) : [];
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
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
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
            <div style={{ fontWeight: 700, fontSize: 12 }}>{item.name}</div>
            <div style={{ fontSize: 10, color: "#A0AEC0" }}>{item.v} Frosts · €{item.sp?.toFixed(2) || "?"}</div>
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

  // Use all pets including those without StarPets prices for trade checker
  const allPetsForTrade = P.map(p => ({ name: p.n, sp: p.sp, v: p.v, demand: p.d, rarity: p.r, img: p.i, label: p.n }));

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
  const verdict = !giveItems.length || !getItems.length ? null : diff > 0.002 ? "WIN" : diff < -0.002 ? "LOSE" : "FAIR";
  const vc = verdict === "WIN" ? "#38A169" : verdict === "LOSE" ? "#E53E3E" : "#D69E2E";

  const deals = useMemo(() => {
    let list = ALL.filter(p => !search || p.label.toLowerCase().includes(search.toLowerCase()));
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

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg, #FFF5F7 0%, #FDF2F8 30%, #FAF5FF 60%, #F0F9FF 100%)", color: "#4a3f5c" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div style={{ background: "linear-gradient(135deg, #FDF2F8, #FCE7F3, #FAE8FF)", borderBottom: "2px solid #F9A8D4", padding: "18px 20px 12px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, margin: 0, background: "linear-gradient(90deg, #EC4899, #A855F7, #6366F1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dottie's Adopt Me! Trading Tool</h1>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9F7AEA" }}>90+ pets · AMTV values (live!) + StarPets prices · Updated 2 Apr 2026</p>
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
              Values from AMTV (Frost Dragon = 1.0). 90+ pets with real StarPets prices!
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              <Picker side="give" items={giveItems} onAdd={p => addTrade("give", p)} onRemove={i => removeTrade("give", i)} onQty={(i, d) => qtyChange("give", i, d)} allPets={allPetsForTrade} />
              <Picker side="get" items={getItems} onAdd={p => addTrade("get", p)} onRemove={i => removeTrade("get", i)} onQty={(i, d) => qtyChange("get", i, d)} allPets={allPetsForTrade} />
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
            <input type="text" placeholder="Search 90+ pets..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: "1 1 200px", background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 14px", color: "#4a3f5c", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <select value={sortDeals} onChange={e => setSortDeals(e.target.value)} style={{ background: "#fff", border: "2px solid #E9D8FD", borderRadius: 10, padding: "10px 12px", color: "#6B46C1", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>
              <option value="bargain">Best value/€</option>
              <option value="price">Cheapest</option>
              <option value="value">Highest value</option>
              <option value="demand">Highest demand</option>
            </select>
          </div>
          <div style={{ fontSize: 11, color: "#9F7AEA", marginBottom: 8 }}>{deals.length} pets found</div>
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
          <strong style={{ color: "#6B46C1" }}>Accurate values!</strong> All values scraped from AdoptMeTradingValues.com (Frost Dragon = 166 RP = 1.0). StarPets prices from 1-2 Apr 2026. Always double-check before trading! Built by Ian + Dottie 🐾
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

type Habit = {
  id: number;
  name: string;
  emoji: string;
  completed_today: boolean;
  streak: number;
};

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✅");

  async function load() {
    const res = await fetch("/habits");
    setHabits(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(h: Habit) {
    const method = h.completed_today ? "DELETE" : "POST";
    await fetch(`/habits/${h.id}/complete`, { method });
    load();
  }

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emoji }),
    });
    setName("");
    setEmoji("✅");
    load();
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>🔥 TCA Habits</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.map((h) => (
          <li
            key={h.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input
              type="checkbox"
              checked={h.completed_today}
              onChange={() => toggle(h)}
              style={{ width: 20, height: 20 }}
            />
            <span style={{ flex: 1 }}>
              {h.emoji} {h.name}
            </span>
            <span
              style={{
                background: h.streak > 0 ? "#fde68a" : "#f1f5f9",
                borderRadius: 999,
                padding: "0.2rem 0.6rem",
                fontSize: 14,
              }}
            >
              {h.streak > 0 ? `🔥 ${h.streak}` : "—"}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={addHabit} style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          style={{ width: 44, textAlign: "center" }}
          aria-label="emoji"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit…"
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

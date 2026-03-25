"use client";

import { useEffect, useState, useRef } from "react";

/* =========================
   型定義
========================= */

type RecordType = {
  id: number;
  type: string;
  time: string;
};

type TaskType = {
  id: number;
  title: string;
  memo: string;
  dueDate: string;
  status: "none" | "promise" | "urgent";
  completed: boolean;
  createdAt: string;
};

/* =========================
   Home
========================= */

export default function Home() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [records, setRecords] = useState<RecordType[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState("");
  const [screen, setScreen] = useState<"shop" | "register">("shop");
  const steps = ["出勤", "休憩開始", "休憩終了", "退勤"];
  const [stepIndex, setStepIndex] = useState(0);
  const [lastPunch, setLastPunch] = useState<RecordType | null>(null);

  function handleRegisterClick() {
    new Audio("/congrats.mp3").play().catch(e => console.log("Audio play failed:", e));
    setScreen("register");
  }

  function handleClockClick() {
    const action = steps[stepIndex];
    const newRecord = save(action);
    setLastPunch(newRecord);

    setStepIndex((prev) => (prev + 1) % steps.length);

    alert(action + "しました");
  }


  /* 時計 */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDate(now.toLocaleDateString());
      setTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* 勤怠ロード */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("records") || "[]");
    setRecords(saved);
  }, []);

  /* 保存 */
  function save(type: string) {
    const newRecord: RecordType = {
      id: Date.now(),
      type,
      time: new Date().toLocaleString(),
    };
    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    return newRecord;
  }

  function toggleView(menu: string) {
    setView(view === menu ? "" : menu);
    setMenuOpen(false);
  }

  return (
    <div>

      {/* ================= 店内 ================= */}
      {screen === "shop" && (
  <div style={{ textAlign: "center", marginTop: 50 }}>

    {/* 👇ここにアナログ時計 */}
    <div
  style={{
    position: "absolute",
    top: 155,
    left: "7%",
    transform: "translateX(-50%)",
    zIndex: 5,
  }}
>
  {lastPunch && (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "rgba(0,0,0,0.1)",
      fontSize: "24px",
      fontWeight: "bold",
      zIndex: -1,
      whiteSpace: "nowrap"
    }}>
      {lastPunch.type}<br/>
      {lastPunch.time.split(" ")[1]}
    </div>
  )}
  <AnalogClock onClick={handleClockClick} />
</div>

    {/* レジクリックエリア */}
    <div
      onClick={handleRegisterClick}
      style={{
  position: "absolute",
  top: 350,
  left: "50%",
  transform: "translateX(-50%)",
  width: "400px",
  height: "250px",
  cursor: "pointer",
  zIndex: 1
}}
    >
    </div>

  </div>
)}

      {/* ================= レジ ================= */}
      {screen === "register" && (
        <div style={{ 
          textAlign: "center", 
          marginTop: 50, 
          background: "rgba(255,255,255,0.9)", 
          padding: "40px",
          borderRadius: "10px",
          display: "inline-block",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}>

          <h2 style={{ color: "#333", marginBottom: "20px" }}>POS TERMINAL</h2>

          <div style={{ fontSize: 32, fontWeight: "bold", color: "#444" }}>
            {date}
            <br />
            {time}
          </div>

          <div style={{ marginTop: "30px", marginBottom: "30px" }}>
            <button onClick={() => toggleView("attendance")} style={{ margin: "5px", padding: "10px 20px" }}>📜 履歴</button>
            <button onClick={() => toggleView("memo")} style={{ margin: "5px", padding: "10px 20px" }}>📝 メモ</button>
            <button onClick={() => toggleView("tasks")} style={{ margin: "5px", padding: "10px 20px" }}>✅ タスク</button>
            <button onClick={() => toggleView("calendar")} style={{ margin: "5px", padding: "10px 20px" }}>📅 予定</button>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #ccc", margin: "20px 0" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={() => save("出勤")} style={{ padding: "15px" }}>出勤</button>
            <button onClick={() => save("休憩開始")} style={{ padding: "15px" }}>休憩開始</button>
            <button onClick={() => save("休憩終了")} style={{ padding: "15px" }}>休憩終了</button>
            <button onClick={() => save("退勤")} style={{ padding: "15px" }}>退勤</button>
          </div>

          <br />

          <button 
            onClick={() => setScreen("shop")}
            style={{ 
              marginTop: "20px", 
              padding: "10px 30px", 
              background: "#666", 
              color: "white", 
              border: "none", 
              borderRadius: "5px" 
            }}
          >
            店内に戻る
          </button>
        </div>
      )}

      {/* ================= 共通表示 ================= */}
      {view === "attendance" && (
  <div
    style={{
      position: "absolute",
      top: 80,
      right: 20,
      background: "#fff",
      padding: 20,
      width: 260,
      fontFamily: "monospace",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      border: "1px dashed #999",
    }}
  >
    {/* タイトル */}
    <div style={{ textAlign: "center", marginBottom: 10 }}>
      🧾 PIZZA SHOP RECEIPT
    </div>

    <div style={{ fontSize: 12, marginBottom: 10 }}>
      DATE: {new Date().toLocaleDateString()}
      <br />
      TIME: {new Date().toLocaleTimeString()}
    </div>

    <hr />

    {/* 履歴 */}
    <div style={{ maxHeight: 200, overflowY: "auto" }}>
      {records.map((r, i) => (
        <div key={r.id} style={{ margin: "5px 0" }}>
          {i + 1}. {r.type}
          <br />
          <span style={{ fontSize: 10 }}>{r.time}</span>
        </div>
      ))}
    </div>

    <hr />

    {/* 合計 */}
    <div style={{ marginTop: 10 }}>
      TOTAL RECORDS: {records.length}
    </div>

    {/* ボタン */}
    <div style={{ textAlign: "center", marginTop: 10 }}>
      <button onClick={() => setView("")}>閉じる</button>
    </div>
  </div>
)}

      {view === "memo" && <Memo />}
      {view === "tasks" && <Tasks />}
      {view === "calendar" && <Calendar />}

    </div>
  );
}

/* =========================
   メモ
========================= */

type MemoType = {
  id: number;
  text: string;
  date: string;
  color: string;
};

function Memo() {
  const [text, setText] = useState("");
  const [memos, setMemos] = useState<MemoType[]>([]);
  const [color, setColor] = useState("#fff9a8");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("memos") || "[]");
    setMemos(saved);
  }, []);

  function saveMemo() {
    if (!text) return;

    const newMemo = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString(),
      color,
    };

    const updated = [...memos, newMemo];
    setMemos(updated);
    localStorage.setItem("memos", JSON.stringify(updated));
    setText("");
  }

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>メモ</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button onClick={saveMemo}>保存</button>

      {memos.map((m) => (
        <div key={m.id} style={{ background: m.color, margin: 10 }}>
          {m.date}
          <br />
          {m.text}
        </div>
      ))}
    </div>
  );
}

/* =========================
   タスク
========================= */

function Tasks() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [title, setTitle] = useState("");

  function addTask() {
    if (!title) return;

    const newTask: TaskType = {
      id: Date.now(),
      title,
      memo: "",
      dueDate: "",
      status: "none",
      completed: false,
      createdAt: "",
    };

    setTasks([...tasks, newTask]);
    setTitle("");
  }

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>タスク</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTask}>追加</button>

      {tasks.map((t) => (
        <div key={t.id}>{t.title}</div>
      ))}
    </div>
  );
}

/* =========================
   カレンダー
========================= */

function Calendar() {
  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2>カレンダー</h2>
      カレンダー表示
    </div>
  );
}


function AnalogClock({ onClick }: { onClick: () => void }) {
  const [now, setNow] = useState(new Date());
  const [pressed, setPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/click.mp3");
  }, []);

  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  const secDeg = seconds * 6;
  const minDeg = minutes * 6;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  function handleClick() {
    setPressed(true);

    // 🔊 音
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    onClick();

    setTimeout(() => {
      setPressed(false);
    }, 150);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        border: "6px solid black",
        position: "relative",
        background: "white",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: "0.1s",
      }}
    >
      {[...Array(12)].map((_, i) => {
        const angle = (i + 1) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "45%",
              left: "47%",
              transform: `
                rotate(${angle}deg)
                translate(0, -55px)
                rotate(-${angle}deg)
              `,
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            {i + 1}
          </div>
        );
      })}

      <div
        style={{
          width: 8,
          height: 8,
          background: "black",
          borderRadius: "50%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 3,
          height: 35,
          background: "black",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          transformOrigin: "bottom",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 2,
          height: 50,
          background: "black",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -100%) rotate(${minDeg}deg)`,
          transformOrigin: "bottom",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 1,
          height: 60,
          background: "red",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -100%) rotate(${secDeg}deg)`,
          transformOrigin: "bottom",
        }}
      />
    </div>
  );
}
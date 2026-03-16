import { db } from "../services/firebase.js";

const today = () => new Date().toISOString().split("T")[0];

export async function getStudyTime(req, res) {
  try {
    console.log("getStudyTime chamado para:", req.params.userId);
    const { userId } = req.params;
    const ref = db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .doc(today());
    console.log("ref criado, buscando...");
    const snap = await ref.get();
    console.log("snap obtido:", snap.exists);

    if (!snap.exists) return res.json({ seconds: 0 });
    const data = snap.data();
    if (data.date !== today()) return res.json({ seconds: 0 });
    res.json({ seconds: data.seconds ?? 0 });
  } catch (err) {
    console.error("ERRO no getStudyTime:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function saveStudyTime(req, res) {
  try {
    const { userId } = req.params;
    const { seconds } = req.body;
    const ref = db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .doc(today());
    await ref.set({ date: today(), seconds });
    res.json({ success: true, seconds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function resetStudyTime(req, res) {
  try {
    const { userId } = req.params;
    const ref = db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .doc(today());
    await ref.set({ date: today(), seconds: 0 });
    res.json({ success: true, seconds: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deduceStudyTime(req, res) {
  try {
    const { userId } = req.params;
    const { minutes } = req.body;
    const ref = db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .doc(today());
    const snap = await ref.get();

    const current = snap.exists ? (snap.data().seconds ?? 0) : 0;
    const deduced = Math.max(0, current - minutes * 60);

    await ref.set({ date: today(), seconds: deduced });
    res.json({ success: true, seconds: deduced });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getSettings(req, res) {
  try {
    const { userId } = req.params;
    const ref = db.collection("settings").doc(userId);
    const snap = await ref.get();
    if (!snap.exists) return res.json({ times: null });
    res.json({ times: snap.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function saveSettings(req, res) {
  try {
    const { userId } = req.params;
    const { pomodoro, shortBreak, longBreak } = req.body;
    const ref = db.collection("settings").doc(userId);
    await ref.set({ pomodoro, shortBreak, longBreak });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getTotalTime(req, res) {
  try {
    const { userId } = req.params;
    const snap = await db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .get();

    const total = snap.docs.reduce(
      (acc, doc) => acc + (doc.data().seconds ?? 0),
      0,
    );
    res.json({ seconds: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getWeekData(req, res) {
  try {
    const { userId } = req.params;
    const snap = await db
      .collection("studyTime")
      .doc(userId)
      .collection("history")
      .get();

    const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    const stored = snap.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().seconds ?? 0;
      return acc;
    }, {});

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const key = date.toISOString().split("T")[0];
      return {
        day: labels[date.getDay()],
        minutes: Math.floor((stored[key] ?? 0) / 60),
      };
    });

    res.json({ days });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

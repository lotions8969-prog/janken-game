"use client";

import { useState } from "react";

type Choice = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;

const CHOICES: { value: Choice; label: string; emoji: string }[] = [
  { value: "rock", label: "グー", emoji: "✊" },
  { value: "paper", label: "パー", emoji: "✋" },
  { value: "scissors", label: "チョキ", emoji: "✌️" },
];

function getResult(player: Choice, cpu: Choice): Result {
  if (player === cpu) return "draw";
  if (
    (player === "rock" && cpu === "scissors") ||
    (player === "paper" && cpu === "rock") ||
    (player === "scissors" && cpu === "paper")
  )
    return "win";
  return "lose";
}

function getCpuChoice(): Choice {
  const choices: Choice[] = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * 3)];
}

const RESULT_TEXT: Record<NonNullable<Result>, string> = {
  win: "あなたの勝ち！🎉",
  lose: "CPUの勝ち...😢",
  draw: "引き分け！🤝",
};

const RESULT_COLOR: Record<NonNullable<Result>, string> = {
  win: "text-green-400",
  lose: "text-red-400",
  draw: "text-yellow-400",
};

export default function Home() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const play = (choice: Choice) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPlayerChoice(choice);
    setCpuChoice(null);
    setResult(null);

    setTimeout(() => {
      const cpu = getCpuChoice();
      const res = getResult(choice, cpu);
      setCpuChoice(cpu);
      setResult(res);
      setScore((prev) => ({ ...prev, [res]: prev[res] + 1 }));
      setIsAnimating(false);
    }, 600);
  };

  const reset = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
    setScore({ win: 0, lose: 0, draw: 0 });
  };

  const choiceEmoji = (c: Choice | null) =>
    c ? CHOICES.find((x) => x.value === c)?.emoji : "❓";

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-2">✂️ じゃんけん</h1>
      <p className="text-purple-300 mb-8 text-sm">CPUと勝負しよう！</p>

      {/* スコア */}
      <div className="flex gap-6 mb-10">
        {[
          { label: "勝ち", key: "win", color: "text-green-400" },
          { label: "負け", key: "lose", color: "text-red-400" },
          { label: "引分", key: "draw", color: "text-yellow-400" },
        ].map(({ label, key, color }) => (
          <div key={key} className="text-center">
            <div className={`text-2xl font-bold ${color}`}>
              {score[key as keyof typeof score]}
            </div>
            <div className="text-xs text-purple-300">{label}</div>
          </div>
        ))}
      </div>

      {/* バトルエリア */}
      <div className="flex items-center gap-8 mb-10">
        <div className="text-center">
          <div
            className={`text-6xl mb-2 transition-all duration-300 ${
              isAnimating ? "animate-bounce" : ""
            }`}
          >
            {playerChoice ? choiceEmoji(playerChoice) : "🤔"}
          </div>
          <div className="text-purple-300 text-sm">あなた</div>
        </div>

        <div className="text-white text-2xl font-bold">VS</div>

        <div className="text-center">
          <div
            className={`text-6xl mb-2 transition-all duration-300 ${
              isAnimating ? "animate-bounce" : ""
            }`}
          >
            {isAnimating ? "🔄" : cpuChoice ? choiceEmoji(cpuChoice) : "🤖"}
          </div>
          <div className="text-purple-300 text-sm">CPU</div>
        </div>
      </div>

      {/* 結果 */}
      <div className="h-10 mb-8 flex items-center">
        {result && !isAnimating && (
          <p
            className={`text-2xl font-bold ${RESULT_COLOR[result]} animate-pulse`}
          >
            {RESULT_TEXT[result]}
          </p>
        )}
        {isAnimating && (
          <p className="text-white text-xl">じゃーんけーん...</p>
        )}
      </div>

      {/* 選択ボタン */}
      <div className="flex gap-4 mb-6">
        {CHOICES.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => play(value)}
            disabled={isAnimating}
            className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-4 transition-all duration-150 border border-white/20 hover:border-white/40 cursor-pointer"
          >
            <span className="text-4xl">{emoji}</span>
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* リセット */}
      <button
        onClick={reset}
        className="text-purple-400 hover:text-white text-sm underline transition-colors cursor-pointer"
      >
        スコアをリセット
      </button>
    </main>
  );
}

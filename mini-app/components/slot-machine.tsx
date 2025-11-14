import { useEffect, useState } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "orange", "lemon"] as const;
type Fruit = typeof fruits[number];

function getRandomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [columns, setColumns] = useState<Fruit[][]>([
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
    [getRandomFruit(), getRandomFruit(), getRandomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState<string | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(null);
    const interval = setInterval(() => {
      setColumns((prev) => {
        const newCols = prev.map((col) => [
          getRandomFruit(),
          ...col.slice(0, 2),
        ]);
        return newCols;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // Check center row
      const centerRow = columns.map((col) => col[1]);
      if (
        centerRow[0] === centerRow[1] &&
        centerRow[1] === centerRow[2]
      ) {
        setWin(`You won with ${centerRow[0]}!`);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col items-center">
            {col.map((fruit, j) => (
              <img
                key={j}
                src={`/${fruit}.png`}
                alt={fruit}
                width={80}
                height={80}
                className="border rounded"
              />
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600 font-bold">{win}</span>
          <Share text={`${win} ${url}`} />
        </div>
      )}
    </div>
  );
}

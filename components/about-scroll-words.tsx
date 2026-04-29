"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const CHALK_PALETTE = ["#9877a2", "#8499c1", "#d990a3", "#96c8c5", "#f2dede"];

function pickBalancedPaletteColors(total: number) {
  const counts = new Map<string, number>(
    CHALK_PALETTE.map((color) => [color, 0])
  );
  const selected: string[] = [];

  for (let index = 0; index < total; index += 1) {
    const previousColor = selected[index - 1];
    const minimumCount = Math.min(...Array.from(counts.values()));
    const eligibleColors = CHALK_PALETTE.filter(
      (color) => counts.get(color) === minimumCount && color !== previousColor
    );
    const fallbackColors = CHALK_PALETTE.filter((color) => color !== previousColor);
    const pool =
      eligibleColors.length > 0
        ? eligibleColors
        : fallbackColors.length > 0
          ? fallbackColors
          : CHALK_PALETTE;
    const chosenColor =
      pool[Math.floor(Math.random() * pool.length)] ?? CHALK_PALETTE[0];

    selected.push(chosenColor);
    counts.set(chosenColor, (counts.get(chosenColor) ?? 0) + 1);
  }

  return selected;
}

export function AboutScrollWords({ words }: { words: string[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [wordColors, setWordColors] = useState<string[]>([]);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 52,
    damping: 20,
    mass: 1,
  });

  const safeWords = words.filter((word) => word.trim().length > 0);
  const wordSignature = safeWords.join("|");

  useEffect(() => {
    setWordColors(pickBalancedPaletteColors(safeWords.length));
  }, [wordSignature]);

  if (!safeWords.length) return null;

  const segmentWeights = safeWords.map((_, index) =>
    index === safeWords.length - 1 ? 3 : 1
  );
  const totalWeight = segmentWeights.reduce((sum, weight) => sum + weight, 0);
  const longestWordLength = Math.max(...safeWords.map((word) => word.length), 1);
  const sharedViewportFontSize = `${Math.max(18, 138 / longestWordLength)}vw`;

  return (
    <div ref={sectionRef} className="relative h-[520svh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          {safeWords.map((word, index) => {
            const accumulatedWeight = segmentWeights
              .slice(0, index)
              .reduce((sum, weight) => sum + weight, 0);
            const segment = segmentWeights[index] / totalWeight;
            const start = accumulatedWeight / totalWeight;
            const isLastWord = index === safeWords.length - 1;
            const holdStart = start + segment * 0.2;
            const holdEnd = isLastWord
              ? start + segment * 0.995
              : start + segment * 0.82;
            const end = start + segment;
            const characters = [...word];
            const horizontalFit = Math.max(
              0.62,
              Math.min(1.26, longestWordLength / Math.max(word.length, 1))
            );

            return (
              <motion.div
                key={`${word}-${index}`}
                className="absolute inset-0 flex items-center justify-center px-4 text-center [transform-style:preserve-3d]"
              >
                <span
                  className="inline-flex max-w-full flex-nowrap justify-center whitespace-nowrap font-black uppercase leading-[0.88] tracking-[-0.03em] [font-family:var(--font-display-rounded)]"
                  style={{
                    fontSize: `clamp(4.4rem, ${sharedViewportFontSize}, 16rem)`,
                    color: wordColors[index] ?? "rgba(255,255,255,0.95)",
                    transform: `scaleX(${0.92 * horizontalFit})`,
                    transformOrigin: "center center",
                    WebkitTextStroke: "0.45px currentColor",
                  }}
                >
                  {characters.map((character, characterIndex) => {
                    const delay =
                      characters.length > 1
                        ? (characterIndex / (characters.length - 1)) *
                          segment *
                          0.06
                        : 0;
                    const delayedStart = Math.min(start + delay, 1);
                    const delayedHoldStart = Math.min(holdStart + delay, 1);
                    const delayedHoldEnd = Math.min(holdEnd + delay, 1);
                    const delayedEnd = Math.min(end + delay, 1);

                    const opacity = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [0, 1, 1, 0]
                    );
                    const rotateX = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [96, 0, 0, -96]
                    );
                    const z = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [-88, 0, 0, -88]
                    );
                    const y = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [22, 0, 0, -22]
                    );
                    const blur = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [4, 0, 0, 4]
                    );
                    const scale = useTransform(
                      smoothProgress,
                      [delayedStart, delayedHoldStart, delayedHoldEnd, delayedEnd],
                      [0.975, 1, 1, 0.992]
                    );

                    return (
                      <motion.span
                        key={`${word}-${character}-${characterIndex}`}
                        style={{
                          opacity,
                          rotateX,
                          z,
                          y,
                          scale,
                          filter: useTransform(blur, (value) => `blur(${value}px)`),
                          transformStyle: "preserve-3d",
                        }}
                        className="inline-block will-change-transform [backface-visibility:hidden]"
                      >
                        {character === " " ? "\u00A0" : character}
                      </motion.span>
                    );
                  })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

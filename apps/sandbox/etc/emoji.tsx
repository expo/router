import "emoji-mart/css/emoji-mart.css";

import { EmojiData, Picker } from "emoji-mart";
import React from "react";

const defaultEmojis = [
  {
    id: "bacon",
    unified: "1f953",
  },
  { id: "avocado", unified: "1f951" },
  { id: "beers", unified: "1f37b" },
  { id: "microbe", unified: "1f9a0" },
  {
    id: "i_love_you_hand_sign",
    unified: "1f91f",
  },
  {
    id: "mechanical_arm",
    unified: "1f9be",
  },
  {
    id: "revolving_hearts",

    unified: "1f49e",
  },
  {
    id: "thought_balloon",
    unified: "1f4ad",
  },
  {
    id: "dog",
    unified: "1f436",
  },
  {
    id: "thermometer",
    unified: "1f321-fe0f",
  },
  {
    id: "fire",
    unified: "1f525",
  },
  {
    id: "compass",
    unified: "1f9ed",
  },
  {
    id: "rolled_up_newspaper",
    unified: "1f5de-fe0f",
  },
];

export const randomEmoji = (): EmojiData =>
  defaultEmojis[Math.floor(Math.random() * defaultEmojis.length)] as any;

const mapping: Record<string, string> = {
  copyright: "a9",
  registered: "ae",
  trademark: "2122",
  waving_white_flag: "1f3f3",
};

export function transformId(id = "", name = ""): string {
  if (!id || !name) return;
  if (name in mapping) {
    return mapping[name];
  }

  if (!id.includes("-")) return id;

  if (
    // blacklist
    !["man_in_business_suit_levitating"].includes(name) &&
    (name.startsWith("flag-") ||
      name.startsWith("man-") ||
      name.startsWith("woman-") ||
      name.startsWith("man_") ||
      name.startsWith("woman_") ||
      name.startsWith("male_") ||
      name.startsWith("female_") ||
      name.startsWith("male-") ||
      name.startsWith("female-") ||
      name.endsWith("_man") ||
      name.endsWith("_woman") ||
      name.endsWith("-flag") ||
      name.endsWith("_flag") ||
      // whitelist
      [
        "merman",
        "mermaid",
        "es",
        "cn",
        "de",
        "gb",
        "us",
        "ru",
        "kr",
        "jp",
        "it",
        "fr",
        "people_holding_hands",
      ].includes(name))
  ) {
    return id;
  }

  return id.split("-")[0] || "";
}

export function EmojiPicker({
  onSelect,
  isMobile,
}: {
  isMobile?: boolean;
  onSelect: (data: EmojiData) => void;
}) {
  return (
    <Picker
      style={isMobile ? { flex: 1, borderRadius: 0 } : {}}
      set="twitter"
      notFoundEmoji="mag"
      title=""
      showPreview={false}
      emoji="bacon"
      onSelect={onSelect}
      showSkinTones={false}
    />
  );
}

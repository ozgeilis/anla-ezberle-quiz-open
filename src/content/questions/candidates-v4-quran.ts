import { makeCandidates, type Candidate } from "./candidate-builder";

// Diyanet Kur'an Portalı sûre tanıtımlarında (mushaf sırası ve âyet sayısı)
// 3–22. sûreler tek tek incelendi. Bu olgusal kaynak kontrolüdür, uzman onayı değildir.
// Aynı sûre hakkında iki soru aynı turda conceptGroup ile ayrılır.
const rows: readonly Candidate[] = [
  [
    "Âl-i İmrân suresi kaç âyetten oluşur?",
    "200",
    [
      "207",
      "213",
      "221"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/3",
    "Sûre tanıtımı: 3. sûre / 200 âyet",
    "Âl-i İmrân suresi Diyanet'in sûre fihristine göre 200 âyettir.",
    "sure-metadata-3",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 3. sûre hangisidir?",
    "Âl-i İmrân",
    [
      "Nisâ",
      "Mâide",
      "En'âm"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/3",
    "Sûre tanıtımı: mushaf sırası 3",
    "Mushafın 3. sırasında Âl-i İmrân suresi bulunur.",
    "sure-metadata-3",
    "medium",
    "supported"
  ],
  [
    "Nisâ suresi kaç âyetten oluşur?",
    "176",
    [
      "183",
      "189",
      "197"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/4",
    "Sûre tanıtımı: 4. sûre / 176 âyet",
    "Nisâ suresi Diyanet'in sûre fihristine göre 176 âyettir.",
    "sure-metadata-4",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 4. sûre hangisidir?",
    "Nisâ",
    [
      "Mâide",
      "En'âm",
      "A'râf"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/4",
    "Sûre tanıtımı: mushaf sırası 4",
    "Mushafın 4. sırasında Nisâ suresi bulunur.",
    "sure-metadata-4",
    "medium",
    "supported"
  ],
  [
    "Mâide suresi kaç âyetten oluşur?",
    "120",
    [
      "127",
      "133",
      "141"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/5",
    "Sûre tanıtımı: 5. sûre / 120 âyet",
    "Mâide suresi Diyanet'in sûre fihristine göre 120 âyettir.",
    "sure-metadata-5",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 5. sûre hangisidir?",
    "Mâide",
    [
      "En'âm",
      "A'râf",
      "Enfâl"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/5",
    "Sûre tanıtımı: mushaf sırası 5",
    "Mushafın 5. sırasında Mâide suresi bulunur.",
    "sure-metadata-5",
    "medium",
    "supported"
  ],
  [
    "En'âm suresi kaç âyetten oluşur?",
    "165",
    [
      "172",
      "178",
      "186"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/6",
    "Sûre tanıtımı: 6. sûre / 165 âyet",
    "En'âm suresi Diyanet'in sûre fihristine göre 165 âyettir.",
    "sure-metadata-6",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 6. sûre hangisidir?",
    "En'âm",
    [
      "A'râf",
      "Enfâl",
      "Tevbe"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/6",
    "Sûre tanıtımı: mushaf sırası 6",
    "Mushafın 6. sırasında En'âm suresi bulunur.",
    "sure-metadata-6",
    "medium",
    "supported"
  ],
  [
    "A'râf suresi kaç âyetten oluşur?",
    "206",
    [
      "213",
      "219",
      "227"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "Sûre tanıtımı: 7. sûre / 206 âyet",
    "A'râf suresi Diyanet'in sûre fihristine göre 206 âyettir.",
    "sure-metadata-7",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 7. sûre hangisidir?",
    "A'râf",
    [
      "Enfâl",
      "Tevbe",
      "Yûnus"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/7",
    "Sûre tanıtımı: mushaf sırası 7",
    "Mushafın 7. sırasında A'râf suresi bulunur.",
    "sure-metadata-7",
    "medium",
    "supported"
  ],
  [
    "Enfâl suresi kaç âyetten oluşur?",
    "75",
    [
      "82",
      "88",
      "96"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/8",
    "Sûre tanıtımı: 8. sûre / 75 âyet",
    "Enfâl suresi Diyanet'in sûre fihristine göre 75 âyettir.",
    "sure-metadata-8",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 8. sûre hangisidir?",
    "Enfâl",
    [
      "Tevbe",
      "Yûnus",
      "Hûd"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/8",
    "Sûre tanıtımı: mushaf sırası 8",
    "Mushafın 8. sırasında Enfâl suresi bulunur.",
    "sure-metadata-8",
    "medium",
    "supported"
  ],
  [
    "Tevbe suresi kaç âyetten oluşur?",
    "129",
    [
      "136",
      "142",
      "150"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/9",
    "Sûre tanıtımı: 9. sûre / 129 âyet",
    "Tevbe suresi Diyanet'in sûre fihristine göre 129 âyettir.",
    "sure-metadata-9",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 9. sûre hangisidir?",
    "Tevbe",
    [
      "Yûnus",
      "Hûd",
      "Yûsuf"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/9",
    "Sûre tanıtımı: mushaf sırası 9",
    "Mushafın 9. sırasında Tevbe suresi bulunur.",
    "sure-metadata-9",
    "medium",
    "supported"
  ],
  [
    "Yûnus suresi kaç âyetten oluşur?",
    "109",
    [
      "116",
      "122",
      "130"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/10",
    "Sûre tanıtımı: 10. sûre / 109 âyet",
    "Yûnus suresi Diyanet'in sûre fihristine göre 109 âyettir.",
    "sure-metadata-10",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 10. sûre hangisidir?",
    "Yûnus",
    [
      "Hûd",
      "Yûsuf",
      "Ra'd"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/10",
    "Sûre tanıtımı: mushaf sırası 10",
    "Mushafın 10. sırasında Yûnus suresi bulunur.",
    "sure-metadata-10",
    "medium",
    "supported"
  ],
  [
    "Hûd suresi kaç âyetten oluşur?",
    "123",
    [
      "130",
      "136",
      "144"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Sûre tanıtımı: 11. sûre / 123 âyet",
    "Hûd suresi Diyanet'in sûre fihristine göre 123 âyettir.",
    "sure-metadata-11",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 11. sûre hangisidir?",
    "Hûd",
    [
      "Yûsuf",
      "Ra'd",
      "İbrâhîm"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/11",
    "Sûre tanıtımı: mushaf sırası 11",
    "Mushafın 11. sırasında Hûd suresi bulunur.",
    "sure-metadata-11",
    "medium",
    "supported"
  ],
  [
    "Yûsuf suresi kaç âyetten oluşur?",
    "111",
    [
      "118",
      "124",
      "132"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Sûre tanıtımı: 12. sûre / 111 âyet",
    "Yûsuf suresi Diyanet'in sûre fihristine göre 111 âyettir.",
    "sure-metadata-12",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 12. sûre hangisidir?",
    "Yûsuf",
    [
      "Ra'd",
      "İbrâhîm",
      "Hicr"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/12",
    "Sûre tanıtımı: mushaf sırası 12",
    "Mushafın 12. sırasında Yûsuf suresi bulunur.",
    "sure-metadata-12",
    "medium",
    "supported"
  ],
  [
    "Ra'd suresi kaç âyetten oluşur?",
    "43",
    [
      "50",
      "56",
      "64"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/13",
    "Sûre tanıtımı: 13. sûre / 43 âyet",
    "Ra'd suresi Diyanet'in sûre fihristine göre 43 âyettir.",
    "sure-metadata-13",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 13. sûre hangisidir?",
    "Ra'd",
    [
      "İbrâhîm",
      "Hicr",
      "Nahl"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/13",
    "Sûre tanıtımı: mushaf sırası 13",
    "Mushafın 13. sırasında Ra'd suresi bulunur.",
    "sure-metadata-13",
    "medium",
    "supported"
  ],
  [
    "İbrâhîm suresi kaç âyetten oluşur?",
    "52",
    [
      "59",
      "65",
      "73"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/14",
    "Sûre tanıtımı: 14. sûre / 52 âyet",
    "İbrâhîm suresi Diyanet'in sûre fihristine göre 52 âyettir.",
    "sure-metadata-14",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 14. sûre hangisidir?",
    "İbrâhîm",
    [
      "Hicr",
      "Nahl",
      "İsrâ"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/14",
    "Sûre tanıtımı: mushaf sırası 14",
    "Mushafın 14. sırasında İbrâhîm suresi bulunur.",
    "sure-metadata-14",
    "medium",
    "supported"
  ],
  [
    "Hicr suresi kaç âyetten oluşur?",
    "99",
    [
      "106",
      "112",
      "120"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/15",
    "Sûre tanıtımı: 15. sûre / 99 âyet",
    "Hicr suresi Diyanet'in sûre fihristine göre 99 âyettir.",
    "sure-metadata-15",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 15. sûre hangisidir?",
    "Hicr",
    [
      "Nahl",
      "İsrâ",
      "Kehf"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/15",
    "Sûre tanıtımı: mushaf sırası 15",
    "Mushafın 15. sırasında Hicr suresi bulunur.",
    "sure-metadata-15",
    "medium",
    "supported"
  ],
  [
    "Nahl suresi kaç âyetten oluşur?",
    "128",
    [
      "135",
      "141",
      "149"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/16",
    "Sûre tanıtımı: 16. sûre / 128 âyet",
    "Nahl suresi Diyanet'in sûre fihristine göre 128 âyettir.",
    "sure-metadata-16",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 16. sûre hangisidir?",
    "Nahl",
    [
      "İsrâ",
      "Kehf",
      "Meryem"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/16",
    "Sûre tanıtımı: mushaf sırası 16",
    "Mushafın 16. sırasında Nahl suresi bulunur.",
    "sure-metadata-16",
    "medium",
    "supported"
  ],
  [
    "İsrâ suresi kaç âyetten oluşur?",
    "111",
    [
      "118",
      "124",
      "132"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/17",
    "Sûre tanıtımı: 17. sûre / 111 âyet",
    "İsrâ suresi Diyanet'in sûre fihristine göre 111 âyettir.",
    "sure-metadata-17",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 17. sûre hangisidir?",
    "İsrâ",
    [
      "Kehf",
      "Meryem",
      "Tâhâ"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/17",
    "Sûre tanıtımı: mushaf sırası 17",
    "Mushafın 17. sırasında İsrâ suresi bulunur.",
    "sure-metadata-17",
    "medium",
    "supported"
  ],
  [
    "Kehf suresi kaç âyetten oluşur?",
    "110",
    [
      "117",
      "123",
      "131"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Sûre tanıtımı: 18. sûre / 110 âyet",
    "Kehf suresi Diyanet'in sûre fihristine göre 110 âyettir.",
    "sure-metadata-18",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 18. sûre hangisidir?",
    "Kehf",
    [
      "Meryem",
      "Tâhâ",
      "Enbiyâ"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/18",
    "Sûre tanıtımı: mushaf sırası 18",
    "Mushafın 18. sırasında Kehf suresi bulunur.",
    "sure-metadata-18",
    "medium",
    "supported"
  ],
  [
    "Meryem suresi kaç âyetten oluşur?",
    "98",
    [
      "105",
      "111",
      "119"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Sûre tanıtımı: 19. sûre / 98 âyet",
    "Meryem suresi Diyanet'in sûre fihristine göre 98 âyettir.",
    "sure-metadata-19",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 19. sûre hangisidir?",
    "Meryem",
    [
      "Tâhâ",
      "Enbiyâ",
      "Hac"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/19",
    "Sûre tanıtımı: mushaf sırası 19",
    "Mushafın 19. sırasında Meryem suresi bulunur.",
    "sure-metadata-19",
    "medium",
    "supported"
  ],
  [
    "Tâhâ suresi kaç âyetten oluşur?",
    "135",
    [
      "142",
      "148",
      "156"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Sûre tanıtımı: 20. sûre / 135 âyet",
    "Tâhâ suresi Diyanet'in sûre fihristine göre 135 âyettir.",
    "sure-metadata-20",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 20. sûre hangisidir?",
    "Tâhâ",
    [
      "Enbiyâ",
      "Hac",
      "Mü'minûn"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/20",
    "Sûre tanıtımı: mushaf sırası 20",
    "Mushafın 20. sırasında Tâhâ suresi bulunur.",
    "sure-metadata-20",
    "medium",
    "supported"
  ],
  [
    "Enbiyâ suresi kaç âyetten oluşur?",
    "112",
    [
      "119",
      "125",
      "133"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Sûre tanıtımı: 21. sûre / 112 âyet",
    "Enbiyâ suresi Diyanet'in sûre fihristine göre 112 âyettir.",
    "sure-metadata-21",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 21. sûre hangisidir?",
    "Enbiyâ",
    [
      "Hac",
      "Mü'minûn",
      "Nûr"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/21",
    "Sûre tanıtımı: mushaf sırası 21",
    "Mushafın 21. sırasında Enbiyâ suresi bulunur.",
    "sure-metadata-21",
    "medium",
    "supported"
  ],
  [
    "Hac suresi kaç âyetten oluşur?",
    "78",
    [
      "85",
      "91",
      "99"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/22",
    "Sûre tanıtımı: 22. sûre / 78 âyet",
    "Hac suresi Diyanet'in sûre fihristine göre 78 âyettir.",
    "sure-metadata-22",
    "medium",
    "supported"
  ],
  [
    "Mushaf sıralamasında 22. sûre hangisidir?",
    "Hac",
    [
      "Mü'minûn",
      "Nûr",
      "Fâtiha"
    ],
    "https://kuran.diyanet.gov.tr/tefsir/sure/22",
    "Sûre tanıtımı: mushaf sırası 22",
    "Mushafın 22. sırasında Hac suresi bulunur.",
    "sure-metadata-22",
    "medium",
    "supported"
  ]
];
export const quranV4 = makeCandidates("quran", rows);

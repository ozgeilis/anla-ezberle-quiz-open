import type { Question } from "./model";
/** Source and distractor refinements; previous banks remain frozen. */
export const publishedCorrectionsV41: readonly Question[] = [
  {
    "id": "quran-003",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Kur’an kaç cüze ayrılmıştır?",
    "options": [
      {
        "id": "o1",
        "text": "20"
      },
      {
        "id": "o2",
        "text": "60"
      },
      {
        "id": "o3",
        "text": "114"
      },
      {
        "id": "o4",
        "text": "30"
      }
    ],
    "correctOptionId": "o4",
    "explanation": "Kur’an 30 cüze ayrılır. Cüz, okumayı bölümlere ayırmaya yardımcı olan bir birimdir.",
    "sources": [
      {
        "title": "TÜBİTAK Ansiklopedi · Kur’ân-ı Kerîm",
        "url": "https://ansiklopedi.tubitak.gov.tr/ansiklopedi/kuran_i_kerim",
        "locator": "Mushafın otuz cüze ayrılması",
        "publisher": "TÜBİTAK",
        "supports": "Kur’an 30 cüze ayrılır. Cüz, okumayı bölümlere ayırmaya yardımcı olan bir birimdir.",
        "checkedAt": "2026-10-18",
        "checkStatus": "supported"
      },
      {
        "title": "TDV İslâm Ansiklopedisi — Mushaf",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/mushaf",
        "locator": "Mushafın bölümlenmesi, otuz cüz",
        "supports": "Yaygın mushaf bölümlemesi otuz cüzdür.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kapanış kaynak/seçenek düzeltmesi; ürün sahibi yayın talimatı. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "quran-003"
  },
  {
    "id": "general-012",
    "version": 3,
    "categoryId": "general",
    "difficulty": "easy",
    "question": "Ramazan’da iki minare arasına kurulan ışıklı yazı düzenine ne denir?",
    "options": [
      {
        "id": "o1",
        "text": "Mahya"
      },
      {
        "id": "o2",
        "text": "Alem"
      },
      {
        "id": "o3",
        "text": "Şerefe"
      },
      {
        "id": "o4",
        "text": "Minber"
      }
    ],
    "correctOptionId": "o1",
    "explanation": "Mahya, minareler arasında ışıklarla oluşturulan yazı veya resim düzenidir. Özellikle Ramazan geleneğiyle tanınır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi · Mahya",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/mahya--ramazan",
        "locator": "Madde tanımı",
        "supports": "Mahya, minareler arasında ışıklarla oluşturulan yazı veya resim düzenidir. Özellikle Ramazan geleneğiyle tanınır.",
        "checkedAt": "2026-10-18",
        "checkStatus": "supported"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kapanış kaynak/seçenek düzeltmesi; ürün sahibi yayın talimatı. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "general-012"
  },
  {
    "id": "e150-general-035",
    "version": 2,
    "categoryId": "general",
    "difficulty": "medium",
    "question": "Mahya geleneği özellikle hangi kültürde gelişmiştir?",
    "options": [
      {
        "id": "o1",
        "text": "Endülüs saray kültürü"
      },
      {
        "id": "o2",
        "text": "Osmanlı cami kültürü"
      },
      {
        "id": "o3",
        "text": "Pers saray mimarisi"
      },
      {
        "id": "o4",
        "text": "Roma tapınak kültürü"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Mahya Osmanlı cami ve ramazan kültürünün belirgin uygulamalarındandır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/mahya--ramazan",
        "locator": "Mahyanın tarihî gelişimi",
        "supports": "Mahya Osmanlı cami ve ramazan kültürünün belirgin uygulamalarındandır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kapanış kaynak/seçenek düzeltmesi; ürün sahibi yayın talimatı. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "mahya-ottoman"
  },
  {
    "id": "v11-general-012",
    "version": 3,
    "categoryId": "general",
    "difficulty": "easy",
    "question": "Kur’an’ın başından sonuna kadar okunup tamamlanmasına ne denir?",
    "options": [
      {
        "id": "o1",
        "text": "Mahya"
      },
      {
        "id": "o2",
        "text": "Hatim"
      },
      {
        "id": "o3",
        "text": "Tevbe"
      },
      {
        "id": "o4",
        "text": "Mihrap"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Kur'an'ın başından sonuna okunup tamamlanmasına hatim denir; mukabele geleneğinde de hatim yapılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi — Hatim",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/hatim--kuran",
        "locator": "HATİM, tanım paragrafı",
        "supports": "Kur'an'ın başından sonuna okunup tamamlanmasına hatim denir; mukabele geleneğinde de hatim yapılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kapanış kaynak/seçenek düzeltmesi; ürün sahibi yayın talimatı. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "hatim-complete"
  },
  {
    "id": "v12-quran-001",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Bakara 2/183'te orucun farz kılınması hangi amaçla ilişkilendirilir?",
    "options": [
      {
        "id": "o1",
        "text": "Ticaret yollarını genişletmek"
      },
      {
        "id": "o2",
        "text": "Takvâ bilincine ulaşmak"
      },
      {
        "id": "o3",
        "text": "Sadece beden gücünü artırmak"
      },
      {
        "id": "o4",
        "text": "Yalnızca seyahat etmek"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Bakara 2/183 mealinde oruç, korunma ve sakınmayla ilişkilendirilir. Tefsir bunu takvâ, yani Allah’a karşı sorumluluk bilinciyle açıklar; “takvâ bilinci” bu anlamın açıklamasıdır.",
    "sources": [
      {
        "title": "Diyanet Kur'an Yolu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?ayet=183&mode=tefsir&sure=2",
        "locator": "Bakara 2/183",
        "supports": "Bakara 2/183 mealinde oruç, korunma ve sakınmayla ilişkilendirilir. Tefsir bunu takvâ, yani Allah’a karşı sorumluluk bilinciyle açıklar; “takvâ bilinci” bu anlamın açıklamasıdır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kapanış kaynak/seçenek düzeltmesi; ürün sahibi yayın talimatı. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "fasting-purpose"
  }
];

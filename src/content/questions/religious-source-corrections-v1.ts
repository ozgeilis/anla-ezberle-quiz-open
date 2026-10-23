/** Immutable correction proposals, explicitly published by the v32 release manifest. */
export const religiousSourceCorrectionsV1 = [
  {
    questionId: "v11-quran-005",
    baseBankVersion: 31,
    baseQuestionVersion: 1,
    proposedQuestionVersion: 2,
    question:
      "Kadr sûresinin ilk âyetinde Kur'an'ın hangi gecede indirildiği bildirilir?",
    explanation:
      "Kadr 97/1, Kur'an'ın Kadir gecesinde indirildiğini bildirir. Vahyin bu gecede indirilmeye başlaması, kronolojik tefsir açıklamasıdır; mealin doğrudan ifadesiyle ayrı tutulur.",
    sourceRecommendations: [
      {
        url: "https://kuran.diyanet.gov.tr/kuran?sure=97&ayet=1&mode=kuran-meal",
        locator: "Kadr 97/1, MEAL; kronoloji için TEFSİR ayrı",
      },
    ],
    publicationStatus: "proposal",
  },
  {
    questionId: "e150-general-006",
    baseBankVersion: 31,
    baseQuestionVersion: 1,
    proposedQuestionVersion: 2,
    sourceRecommendations: [
      {
        url: "https://kuran.diyanet.gov.tr/kuran?ayet=183&mode=tefsir&sure=2",
        locator: "Bakara 2/183–185; 183–184 ve 185. Ayetler, MEAL/TEFSİR",
      },
    ],
    publicationStatus: "proposal",
  },
  {
    questionId: "v7-quran-005",
    baseBankVersion: 31,
    baseQuestionVersion: 1,
    proposedQuestionVersion: 2,
    question:
      "Kadr sûresi 97/4'te bu gecede Allah'ın izniyle indikleri bildirilenler kimlerdir?",
    explanation:
      "Âyette melekler ve Ruh anılır. Ruh'un Cebrâil olarak açıklanması, meal ve tefsirlerdeki anlamlandırmadır; Arapça metindeki kavram Ruh'tur.",
    sourceRecommendations: [
      {
        url: "https://kuran.diyanet.gov.tr/kuran?sure=97&ayet=4&mode=kuran-meal",
        locator:
          "Kadr sûresi 97/4; doğrudan ayet hedefi; Ruh ve Cebrâil parantezi",
      },
    ],
    publicationStatus: "proposal",
  },
  {
    questionId: "v12-general-009",
    baseBankVersion: 31,
    baseQuestionVersion: 1,
    proposedQuestionVersion: 2,
    explanation:
      "İmsaktan önce, oruca hazırlanmak için yenen öğüne sahur denir. Bu terimin tanımı TDV SAHUR maddesinde açıkça yer alır. Bakara 2/187'deki yeme-içme sınırı ve tefsirdeki sahur açıklaması, terim tanımından ayrı konumlardır.",
    sourceRecommendations: [
      {
        url: "https://islamansiklopedisi.org.tr/sahur",
        locator: "Madde tanımı ve ilk paragraf",
      },
    ],
    publicationStatus: "proposal",
  },
  {
    questionId: "v7-general-003",
    baseBankVersion: 31,
    baseQuestionVersion: 1,
    proposedQuestionVersion: 2,
    explanation:
      "İ‘tikâfın genel fıkıh tanımı, ibadet niyetiyle belirli şartlar içinde camide kalmaktır. Ramazanın son on gününde Hz. Peygamber'in uygulamasıyla öne çıkar. Yer ve süre şartları mezheplere göre farklılaşır; Hanefîler kadınların evin uygun bir yerinde i‘tikâfa girmesini tercih eder.",
    sourceRecommendations: [
      {
        url: "https://islamansiklopedisi.org.tr/itikaf",
        locator: "Madde tanımı; ilk iki paragraf",
      },
    ],
    publicationStatus: "proposal",
  },
  {
    questionId: "e150-general-021",
    baseBankVersion: 31,
    baseQuestionVersion: 2,
    proposedQuestionVersion: 3,
    question:
      "Hac ibadeti hangi şehir ve çevresindeki belirli mekânlarda yerine getirilir?",
    sourceRecommendations: [
      {
        url: "https://islamansiklopedisi.org.tr/hac",
        locator: "İslâm’da Hac; Mekke ve çevresindeki menâsik mekânları",
      },
    ],
    publicationStatus: "proposal",
  },
] as const;

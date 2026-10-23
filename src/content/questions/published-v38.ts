import type { Question } from "./model";
/** Frozen official source corrections; historical question IDs stay intact. */
export const publishedCorrectionsV38: readonly Question[] = [
  {
    "id": "v11-quran-001",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Fâtiha sûresi kaç âyetten oluşur?",
    "options": [
      {
        "id": "o1",
        "text": "Beş"
      },
      {
        "id": "o2",
        "text": "Yedi"
      },
      {
        "id": "o3",
        "text": "Dokuz"
      },
      {
        "id": "o4",
        "text": "On bir"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Fâtiha sûresi yedi âyetten oluşur ve Kur'an'ın ilk sûresidir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/fatiha-suresi",
        "locator": "FÂTİHA, ayet sayısı paragrafı",
        "supports": "Fâtiha sûresi yedi âyetten oluşur ve Kur'an'ın ilk sûresidir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "fatiha-structure"
  },
  {
    "id": "v11-quran-002",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Fîl sûresinde hangi tarihî olay hatırlatılır?",
    "options": [
      {
        "id": "o1",
        "text": "Hicret yolculuğu"
      },
      {
        "id": "o2",
        "text": "Fil ordusunun Kâbe'ye saldırı girişimi"
      },
      {
        "id": "o3",
        "text": "Hendek Savaşı"
      },
      {
        "id": "o4",
        "text": "Bedir Savaşı"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Fîl sûresi, Kâbe'ye yönelen fil ordusunun uğradığı akıbeti hatırlatır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/fil-suresi",
        "locator": "FÎL, ilk ve içerik paragrafları",
        "supports": "Fîl sûresi, Kâbe'ye yönelen fil ordusunun uğradığı akıbeti hatırlatır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "surah-fil-story"
  },
  {
    "id": "v11-quran-003",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Tebbet veya Mesed sûresinde adı anılan kişi kimdir?",
    "options": [
      {
        "id": "o1",
        "text": "Ebû Eyyûb"
      },
      {
        "id": "o2",
        "text": "Ebû Leheb"
      },
      {
        "id": "o3",
        "text": "Ebû Hüreyre"
      },
      {
        "id": "o4",
        "text": "Ebû Tâlib"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Mesed sûresinin ilk âyetinde Ebû Leheb anılır; sûre onun tutumunu eleştirir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/tebbet-suresi",
        "locator": "TEBBET, ilk ve muhteva paragrafları",
        "supports": "Mesed sûresinin ilk âyetinde Ebû Leheb anılır; sûre onun tutumunu eleştirir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "surah-masad-person"
  },
  {
    "id": "v11-quran-004",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Zilzâl sûresinin ilk âyetinde neyin sarsılmasından söz edilir?",
    "options": [
      {
        "id": "o1",
        "text": "Denizin"
      },
      {
        "id": "o2",
        "text": "Yerin"
      },
      {
        "id": "o3",
        "text": "Ayın"
      },
      {
        "id": "o4",
        "text": "Rüzgârın"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Zilzâl sûresi, kıyametle ilgili olarak yerin şiddetle sarsılmasından söz ederek başlar.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/zilzal-suresi",
        "locator": "ZİLZÂL, muhteva",
        "supports": "Zilzâl sûresi, kıyametle ilgili olarak yerin şiddetle sarsılmasından söz ederek başlar.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "surah-zilzal-earth"
  },
  {
    "id": "v11-quran-006",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "İhlâs sûresinde özellikle hangi inanç vurgulanır?",
    "options": [
      {
        "id": "o1",
        "text": "Kabile üstünlüğü"
      },
      {
        "id": "o2",
        "text": "Allah'ın birliği"
      },
      {
        "id": "o3",
        "text": "Mal biriktirme"
      },
      {
        "id": "o4",
        "text": "Savaş hazırlığı"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "İhlâs sûresi Allah'ın birliğini ve eşsizliğini özlü biçimde anlatır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/ihlas-suresi",
        "locator": "İHLÂS, ilk paragraflar",
        "supports": "İhlâs sûresi Allah'ın birliğini ve eşsizliğini özlü biçimde anlatır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "ikhlas-oneness"
  },
  {
    "id": "v11-quran-007",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Nâs sûresinde insan hangi kötülükten korunmak için Allah'a sığınır?",
    "options": [
      {
        "id": "o1",
        "text": "Sıcak havadan"
      },
      {
        "id": "o2",
        "text": "Sinsi vesvesecinin kötülüğünden"
      },
      {
        "id": "o3",
        "text": "Uzun yolculuktan"
      },
      {
        "id": "o4",
        "text": "Ticarî rekabetten"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Nâs sûresi, insanın gönlüne vesvese veren sinsi kötülükten Allah'a sığınmayı öğretir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/nas-suresi",
        "locator": "NÂS, muhteva",
        "supports": "Nâs sûresi, insanın gönlüne vesvese veren sinsi kötülükten Allah'a sığınmayı öğretir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "nas-whisper"
  },
  {
    "id": "v11-quran-008",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Felak sûresinin başlangıcında hangi varlığın Rabbine sığınılır?",
    "options": [
      {
        "id": "o1",
        "text": "Denizlerin"
      },
      {
        "id": "o2",
        "text": "Sabah aydınlığının"
      },
      {
        "id": "o3",
        "text": "Dağların"
      },
      {
        "id": "o4",
        "text": "Rüzgârların"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Felak kelimesi sabah aydınlığıyla ilişkilendirilir; sûrede onun Rabbine sığınma ifadesi geçer.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=113&ayet=1&mode=meal",
        "locator": "Felak 113/1, resmî indekslenmiş Kur’an Yolu meal",
        "supports": "Felak kelimesi sabah aydınlığıyla ilişkilendirilir; sûrede onun Rabbine sığınma ifadesi geçer.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "falaq-daybreak"
  },
  {
    "id": "v11-quran-009",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Saf sûresinin adındaki 'saf' sözcüğü hangi kavrama işaret eder?",
    "options": [
      {
        "id": "o1",
        "text": "Hac yolculuğuna"
      },
      {
        "id": "o2",
        "text": "Sıra hâlinde dizilmeye"
      },
      {
        "id": "o3",
        "text": "Bir kuş türüne"
      },
      {
        "id": "o4",
        "text": "Bir şehir kapısına"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Saf sûresi adını Allah yolunda kenetlenmiş bir yapı gibi saf tutanlardan söz eden âyetten alır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/saf-suresi",
        "locator": "SAF, ilk paragraf",
        "supports": "Saf sûresi adını Allah yolunda kenetlenmiş bir yapı gibi saf tutanlardan söz eden âyetten alır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "saff-name"
  },
  {
    "id": "v11-quran-010",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Cum'a sûresi adını haftanın hangi gününden alır?",
    "options": [
      {
        "id": "o1",
        "text": "Pazar"
      },
      {
        "id": "o2",
        "text": "Cuma"
      },
      {
        "id": "o3",
        "text": "Salı"
      },
      {
        "id": "o4",
        "text": "Perşembe"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Cum'a sûresinde cuma namazı için çağrı yapıldığında alışverişin bırakılması öğütlenir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/cuma-suresi",
        "locator": "CUM‘A, ilk paragraf",
        "supports": "Cum'a sûresinde cuma namazı için çağrı yapıldığında alışverişin bırakılması öğütlenir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "jumuah-name"
  },
  {
    "id": "v11-quran-011",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Münâfikūn sûresinin ana konularından biri nedir?",
    "options": [
      {
        "id": "o1",
        "text": "Gemicilik kuralları"
      },
      {
        "id": "o2",
        "text": "İkiyüzlü davranışların eleştirisi"
      },
      {
        "id": "o3",
        "text": "Ticaret yolları"
      },
      {
        "id": "o4",
        "text": "Ziraat teknikleri"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Münâfikūn sûresi münafıklık ve onun toplumsal sonuçları konusunda uyarılar içerir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/munafikun-suresi",
        "locator": "MÜNÂFİKŪN, muhteva",
        "supports": "Münâfikūn sûresi münafıklık ve onun toplumsal sonuçları konusunda uyarılar içerir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "munafiqun-message"
  },
  {
    "id": "v11-quran-012",
    "version": 2,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Tîn sûresi 95/4'te insanın yaratılışı hangi ifadeyle nitelenir?",
    "options": [
      {
        "id": "o1",
        "text": "En zayıf şekilde"
      },
      {
        "id": "o2",
        "text": "En güzel biçimde"
      },
      {
        "id": "o3",
        "text": "En sessiz varlık olarak"
      },
      {
        "id": "o4",
        "text": "Denizin içinde"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Tîn sûresi 4. âyette insanın en güzel biçimde yaratıldığını bildirir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/tin-suresi",
        "locator": "TÎN, muhteva 4. ayet",
        "supports": "Tîn sûresi 4. âyette insanın en güzel biçimde yaratıldığını bildirir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "tin-human-creation"
  },
  {
    "id": "v11-quran-013",
    "version": 3,
    "categoryId": "quran",
    "difficulty": "medium",
    "question": "Nebe' sûresinin adındaki 'nebe' sözcüğü ne anlama gelir?",
    "options": [
      {
        "id": "o1",
        "text": "Işık"
      },
      {
        "id": "o2",
        "text": "Haber"
      },
      {
        "id": "o3",
        "text": "Deniz"
      },
      {
        "id": "o4",
        "text": "Kapı"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Nebe' kelimesi haber anlamına gelir; sûrede 'büyük haber' ifadesi yer alır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/nebe-suresi",
        "locator": "NEBE’, ilk paragraf",
        "supports": "Nebe' kelimesi haber anlamına gelir; sûrede 'büyük haber' ifadesi yer alır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "naba-name"
  },
  {
    "id": "v11-prophets-001",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Yûsuf 12/18'e göre kardeşleri babalarına Hz. Yûsuf'un gömleğini nasıl getirir?",
    "options": [
      {
        "id": "o1",
        "text": "Kuru ve temiz olarak"
      },
      {
        "id": "o2",
        "text": "Üzerinde sahte kanla"
      },
      {
        "id": "o3",
        "text": "İkiye kesilmiş hâlde"
      },
      {
        "id": "o4",
        "text": "Altınla süslenmiş olarak"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Yûsuf sûresine göre kardeşler Hz. Yûsuf'un gömleğini üzerinde uydurma bir kan iziyle babalarına getirir.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=12&ayet=18&mode=meal",
        "locator": "Yûsuf 12/18, önceki canlı Kur’an Yolu okuması",
        "supports": "Yûsuf sûresine göre kardeşler Hz. Yûsuf'un gömleğini üzerinde uydurma bir kan iziyle babalarına getirir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "yusuf-shirt-blood"
  },
  {
    "id": "v11-prophets-002",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Yûsuf 12/21’de Hz. Yûsuf’u satın alan kişi hangi ülkedendir?",
    "options": [
      {
        "id": "o1",
        "text": "Yemen'e"
      },
      {
        "id": "o2",
        "text": "Mısır'a"
      },
      {
        "id": "o3",
        "text": "Habeşistan'a"
      },
      {
        "id": "o4",
        "text": "Şam'a"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Yûsuf sûresinde onu Mısır'da satın alan kişinin eşine kendisine iyi bakmasını söylediği anlatılır.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=12&ayet=21&mode=meal",
        "locator": "Yûsuf 12/21, önceki canlı Kur’an Yolu okuması",
        "supports": "Yûsuf sûresinde onu Mısır'da satın alan kişinin eşine kendisine iyi bakmasını söylediği anlatılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "yusuf-egypt"
  },
  {
    "id": "v11-prophets-003",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Hz. Yûsuf hükümdarın rüyasını yorumlamadan önce hangi yerde bulunuyordu?",
    "options": [
      {
        "id": "o1",
        "text": "Bir gemide"
      },
      {
        "id": "o2",
        "text": "Hapishanede"
      },
      {
        "id": "o3",
        "text": "Bir medresede"
      },
      {
        "id": "o4",
        "text": "Bir çadırda"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hz. Yûsuf, zindanda bulunduğu sırada rüya yorumlarıyla tanınmış ve hükümdarın rüyası hakkında da görüş bildirmiştir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/yusuf-suresi",
        "locator": "YÛSUF SÛRESİ, zindan ve hükümdarın rüyası",
        "supports": "Hz. Yûsuf, zindanda bulunduğu sırada rüya yorumlarıyla tanınmış ve hükümdarın rüyası hakkında da görüş bildirmiştir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "yusuf-prison"
  },
  {
    "id": "v11-prophets-004",
    "version": 3,
    "categoryId": "prophets",
    "difficulty": "hard",
    "question": "Yûsuf 12/47'de ürünlerin büyük kısmının nasıl saklanması öğütlenir?",
    "options": [
      {
        "id": "o1",
        "text": "Tuzlu suya yatırılarak"
      },
      {
        "id": "o2",
        "text": "Başaklarında bırakılarak"
      },
      {
        "id": "o3",
        "text": "Taze tüketilerek"
      },
      {
        "id": "o4",
        "text": "Nehirde bekletilerek"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hz. Yûsuf bolluk yıllarında biçilen ürünlerin yalnızca az bir kısmının yenmesini, kalanının başağında korunmasını öğütler.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=12&ayet=47&mode=meal",
        "locator": "Yûsuf 12/47, önceki canlı Kur’an Yolu okuması",
        "supports": "Hz. Yûsuf bolluk yıllarında biçilen ürünlerin yalnızca az bir kısmının yenmesini, kalanının başağında korunmasını öğütler.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "yusuf-storing-harvest"
  },
  {
    "id": "v11-prophets-005",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Tâhâ 20/20'de Hz. Mûsâ'nın yere attığı asa neye dönüşür?",
    "options": [
      {
        "id": "o1",
        "text": "Bir kuşa"
      },
      {
        "id": "o2",
        "text": "Bir yılana"
      },
      {
        "id": "o3",
        "text": "Bir balığa"
      },
      {
        "id": "o4",
        "text": "Bir ağaca"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Tâhâ sûresinde Hz. Mûsâ'nın asası yere atıldığında hareket eden bir yılana dönüşür.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=20&ayet=20&mode=meal",
        "locator": "Tâhâ 20/20, resmî indekslenmiş meal",
        "supports": "Tâhâ sûresinde Hz. Mûsâ'nın asası yere atıldığında hareket eden bir yılana dönüşür.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "musa-staff"
  },
  {
    "id": "v11-prophets-006",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Şuarâ 26/63'e göre Hz. Mûsâ'nın asasıyla vurması üzerine ne yarılır?",
    "options": [
      {
        "id": "o1",
        "text": "Dağ"
      },
      {
        "id": "o2",
        "text": "Deniz"
      },
      {
        "id": "o3",
        "text": "Ağaç"
      },
      {
        "id": "o4",
        "text": "Kale"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Şuarâ sûresinde Hz. Mûsâ'ya asasıyla denize vurması emredilir ve deniz ikiye ayrılır.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=26&ayet=63&mode=meal",
        "locator": "Şuarâ 26/63, önceki canlı Kur’an Yolu okuması",
        "supports": "Şuarâ sûresinde Hz. Mûsâ'ya asasıyla denize vurması emredilir ve deniz ikiye ayrılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "musa-sea"
  },
  {
    "id": "v11-prophets-007",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Kasas 28/7'de Hz. Mûsâ'nın annesine bebeği tehlike karşısında nereye bırakması bildirilir?",
    "options": [
      {
        "id": "o1",
        "text": "Bir kuyuya"
      },
      {
        "id": "o2",
        "text": "Nehre"
      },
      {
        "id": "o3",
        "text": "Bir mağaraya"
      },
      {
        "id": "o4",
        "text": "Bir dağa"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Kasas sûresinde Hz. Mûsâ'nın annesine onu emzirmesi, korktuğunda ise suya bırakması bildirilir.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=28&ayet=7&mode=meal",
        "locator": "Kasas 28/7, resmî indekslenmiş meal",
        "supports": "Kasas sûresinde Hz. Mûsâ'nın annesine onu emzirmesi, korktuğunda ise suya bırakması bildirilir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "musa-baby-river"
  },
  {
    "id": "v11-prophets-008",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Bakara 2/127'de Hz. İbrâhim ve Hz. İsmâil Kâbe'nin temellerini yükseltirken ne için dua eder?",
    "options": [
      {
        "id": "o1",
        "text": "Yağmur yağmaması için"
      },
      {
        "id": "o2",
        "text": "Yaptıklarının Allah tarafından kabulü için"
      },
      {
        "id": "o3",
        "text": "Yolculuğun bitmesi için"
      },
      {
        "id": "o4",
        "text": "Altın bulunması için"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Bakara 2/127'de Hz. İbrâhim ve Hz. İsmâil Kâbe'nin temellerini yükseltirken yaptıkları işi Allah'ın kabul etmesini dilerler.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=2&ayet=127&mode=meal",
        "locator": "Bakara 2/127, önceki canlı Kur’an Yolu okuması",
        "supports": "Bakara 2/127'de Hz. İbrâhim ve Hz. İsmâil Kâbe'nin temellerini yükseltirken yaptıkları işi Allah'ın kabul etmesini dilerler.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "ibrahim-ismail-dua"
  },
  {
    "id": "v11-prophets-009",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Bakara 2/258'de Hz. İbrâhim güneşin hangi yönden doğduğunu hatırlatır?",
    "options": [
      {
        "id": "o1",
        "text": "Batıdan"
      },
      {
        "id": "o2",
        "text": "Doğudan"
      },
      {
        "id": "o3",
        "text": "Kuzeyden"
      },
      {
        "id": "o4",
        "text": "Güneyden"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hz. İbrâhim karşısındaki kişiye Allah'ın güneşi doğudan getirdiğini söyleyerek onu batıdan getirmesini ister.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=2&ayet=258&mode=meal",
        "locator": "Bakara 2/258, önceki canlı Kur’an Yolu okuması",
        "supports": "Hz. İbrâhim karşısındaki kişiye Allah'ın güneşi doğudan getirdiğini söyleyerek onu batıdan getirmesini ister.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "ibrahim-sun-direction"
  },
  {
    "id": "v11-prophets-010",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Sâffât 37/142'ye göre Hz. Yûnus'u hangi canlı yutar?",
    "options": [
      {
        "id": "o1",
        "text": "Bir aslan"
      },
      {
        "id": "o2",
        "text": "Büyük bir balık"
      },
      {
        "id": "o3",
        "text": "Bir deve"
      },
      {
        "id": "o4",
        "text": "Bir yılan"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Sâffât sûresinde Hz. Yûnus'un bir balık tarafından yutulduğu anlatılır.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=37&ayet=142&mode=meal",
        "locator": "Sâffât 37/142, resmî indekslenmiş meal",
        "supports": "Sâffât sûresinde Hz. Yûnus'un bir balık tarafından yutulduğu anlatılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "yunus-fish"
  },
  {
    "id": "v11-prophets-011",
    "version": 3,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Meryem sûresinde Hz. Zekeriyyâ'ya müjdelenen oğlunun adı nedir?",
    "options": [
      {
        "id": "o1",
        "text": "İlyâs"
      },
      {
        "id": "o2",
        "text": "Yahyâ"
      },
      {
        "id": "o3",
        "text": "İdrîs"
      },
      {
        "id": "o4",
        "text": "Hârûn"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Meryem sûresinin 7. âyetinde Hz. Zekeriyyâ'ya Yahyâ adında bir oğul müjdelenir.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=19&ayet=7&mode=meal",
        "locator": "Meryem 19/7, önceki canlı Kur’an Yolu okuması",
        "supports": "Meryem sûresinin 7. âyetinde Hz. Zekeriyyâ'ya Yahyâ adında bir oğul müjdelenir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "zakariya-yahya"
  },
  {
    "id": "v11-prophets-012",
    "version": 3,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Meryem 19/30'da beşikte konuşarak Allah'ın kulu olduğunu söyleyen kişi kimdir?",
    "options": [
      {
        "id": "o1",
        "text": "Hz. Yûsuf"
      },
      {
        "id": "o2",
        "text": "Hz. Îsâ"
      },
      {
        "id": "o3",
        "text": "Hz. Mûsâ"
      },
      {
        "id": "o4",
        "text": "Hz. Süleyman"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Meryem sûresinde beşikteki Hz. Îsâ'nın konuşarak Allah'ın kulu olduğunu söylediği anlatılır.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=19&ayet=30&mode=meal",
        "locator": "Meryem 19/29–30, önceki canlı Kur’an Yolu okuması",
        "supports": "Meryem sûresinde beşikteki Hz. Îsâ'nın konuşarak Allah'ın kulu olduğunu söylediği anlatılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "isa-cradle"
  },
  {
    "id": "v11-prophets-013",
    "version": 2,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "Hûd 11/64'te Hz. Sâlih'in kavmine Allah'ın işareti olarak gösterdiği hayvan hangisidir?",
    "options": [
      {
        "id": "o1",
        "text": "At"
      },
      {
        "id": "o2",
        "text": "Dişi deve"
      },
      {
        "id": "o3",
        "text": "Koç"
      },
      {
        "id": "o4",
        "text": "Geyik"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hz. Sâlih kavmine Allah'ın devesini bir işaret olarak gösterir ve ona zarar vermemelerini ister.",
    "sources": [
      {
        "title": "Diyanet Kur’an Platformu",
        "publisher": "Diyanet İşleri Başkanlığı",
        "url": "https://kuran.diyanet.gov.tr/kuran?sure=11&ayet=64&mode=meal",
        "locator": "Hûd 11/64–65, resmî indekslenmiş meal",
        "supports": "Hz. Sâlih kavmine Allah'ın devesini bir işaret olarak gösterir ve ona zarar vermemelerini ister.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-21"
      }
    ],
    "reviewStatus": "approved",
    "reviewNotes": "21.10.2026: Issue #58 kaynak ve dört seçenek denetimi; genel sûre rotası düzeltildi. İnsan uzman onayı değildir.",
    "updatedAt": "2026-10-21",
    "conceptGroup": "salih-shecamel"
  }
];

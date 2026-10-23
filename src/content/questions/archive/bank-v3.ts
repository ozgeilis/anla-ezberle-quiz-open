import type { Question } from "../model";
import { bankV2 } from "./bank-v2";

// Banka v2 değişmez. Önceki tamamlanmış sonuçlar bankVersion: 2 ile
// bankV2 üzerinden çözülmeye devam eder. Bu ekler sadece geliştirme taslağıdır.
// İnsan editör/dinî uzman onayı olmadığı için üretimde oynatılamaz.
const pilotQuestions: Question[] = [
  {
    "id": "pilot-quran-001",
    "version": 1,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Âyetü’l-kürsî, Kur’an’da hangi surenin 255. âyetidir?",
    "options": [
      {
        "id": "o1",
        "text": "Âl-i İmrân"
      },
      {
        "id": "o2",
        "text": "Bakara"
      },
      {
        "id": "o3",
        "text": "Yâsîn"
      },
      {
        "id": "o4",
        "text": "Nisâ"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Âyetü’l-kürsî, Bakara suresinin 255. âyetinin yaygın adıdır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/ayetul-kursi",
        "locator": "Madde tanımı, 255. ayet",
        "supports": "Âyetü’l-kürsî, Bakara suresinin 255. âyetinin yaygın adıdır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Bakara hakkındaki mevcut soruyla aynı bölümden, fakat farklı olgu. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "bakara-ayetul-kursi"
  },
  {
    "id": "pilot-quran-002",
    "version": 1,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "İhlâs suresi kaç âyetten oluşur?",
    "options": [
      {
        "id": "o1",
        "text": "3"
      },
      {
        "id": "o2",
        "text": "4"
      },
      {
        "id": "o3",
        "text": "5"
      },
      {
        "id": "o4",
        "text": "6"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "İhlâs suresi dört âyettir ve Allah’ın birliği konusunu özlü biçimde işler.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/ihlas-suresi",
        "locator": "Madde, sûre tanıtımı",
        "supports": "İhlâs suresi dört âyettir ve Allah’ın birliği konusunu özlü biçimde işler.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Mevcut Kevser ayet sayısı sorusuyla biçimsel benzerlik var; aynı turda iki adet yalnız ayet sayısı sorusu seçilmesin. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "quran-011"
  },
  {
    "id": "pilot-quran-003",
    "version": 1,
    "categoryId": "quran",
    "difficulty": "easy",
    "question": "Kur’an’da Fil Vak‘ası’na yer veren sure hangisidir?",
    "options": [
      {
        "id": "o1",
        "text": "Kadr"
      },
      {
        "id": "o2",
        "text": "Fil"
      },
      {
        "id": "o3",
        "text": "Kâfirûn"
      },
      {
        "id": "o4",
        "text": "Asr"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Fil suresi, Fil Vak‘ası diye bilinen Kâbe’ye saldırı olayını hatırlatır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/fil-suresi",
        "locator": "Giriş, sûre adı ve konusu",
        "supports": "Fil suresi, Fil Vak‘ası diye bilinen Kâbe’ye saldırı olayını hatırlatır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Tarihsel olayın kesin tarihi veya ayrıntılı rivayetler sorulmadı. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "fil-vakasi"
  },
  {
    "id": "pilot-quran-004",
    "version": 1,
    "categoryId": "quran",
    "difficulty": "hard",
    "question": "Felak ve Nâs surelerinin birlikte anıldığı ad hangisidir?",
    "options": [
      {
        "id": "o1",
        "text": "Zehrâvân"
      },
      {
        "id": "o2",
        "text": "Muavvizeteyn"
      },
      {
        "id": "o3",
        "text": "Muâhât"
      },
      {
        "id": "o4",
        "text": "Mukabele"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Felak ile Nâs sureleri birlikte Muavvizeteyn adıyla anılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/felak-suresi",
        "locator": "İlk bölüm, surelerin birlikte adlandırılması",
        "supports": "Felak ile Nâs sureleri birlikte Muavvizeteyn adıyla anılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Terim gündelik kullanımda az bilinir; zorluk derecesi pilotta ölçülmeli. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "felak-nas-adlandirma"
  },
  {
    "id": "pilot-prophets-001",
    "version": 1,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Kur’an’da Medyen halkına gönderildiği bildirilen peygamber kimdir?",
    "options": [
      {
        "id": "o1",
        "text": "Hz. Lût"
      },
      {
        "id": "o2",
        "text": "Hz. Şuayb"
      },
      {
        "id": "o3",
        "text": "Hz. Sâlih"
      },
      {
        "id": "o4",
        "text": "Hz. Hûd"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Kur’an’da Hz. Şuayb’ın Medyen halkına gönderildiği anlatılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/suayb",
        "locator": "Giriş, Medyen toplumu",
        "supports": "Kur’an’da Hz. Şuayb’ın Medyen halkına gönderildiği anlatılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Şuayb’ın soyu veya Hz. Mûsâ ile akrabalığı gibi ihtilaflı rivayetlere girilmez. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "suayb-medyen"
  },
  {
    "id": "pilot-prophets-002",
    "version": 1,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Kur’an’da Hz. Dâvûd’a verildiği bildirilen kitabın adı nedir?",
    "options": [
      {
        "id": "o1",
        "text": "Tevrat"
      },
      {
        "id": "o2",
        "text": "İncil"
      },
      {
        "id": "o3",
        "text": "Zebûr"
      },
      {
        "id": "o4",
        "text": "Suhuf-u İbrâhim"
      }
    ],
    "correctOptionId": "o3",
    "explanation": "Kur’an’da Hz. Dâvûd’a Zebûr verildiği belirtilir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/zebur",
        "locator": "Madde tanımı ve Nisâ 4/163; İsrâ 17/55 göndermesi",
        "supports": "Kur’an’da Hz. Dâvûd’a Zebûr verildiği belirtilir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "İncil eşleştirme sorusuyla aynı turda bulunmamalı. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "ilahi-kitaplar"
  },
  {
    "id": "pilot-prophets-003",
    "version": 1,
    "categoryId": "prophets",
    "difficulty": "easy",
    "question": "Kur’an’da Hz. Îsâ’ya verilen kitap hangi adla anılır?",
    "options": [
      {
        "id": "o1",
        "text": "Zebûr"
      },
      {
        "id": "o2",
        "text": "Tevrat"
      },
      {
        "id": "o3",
        "text": "İncil"
      },
      {
        "id": "o4",
        "text": "Mushaf"
      }
    ],
    "correctOptionId": "o3",
    "explanation": "Kur’an’da Hz. Îsâ’ya verilen ilâhî kitap İncil adıyla anılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/incil",
        "locator": "Madde tanımı, Kur’an’daki isim",
        "supports": "Kur’an’da Hz. Îsâ’ya verilen ilâhî kitap İncil adıyla anılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Zebûr eşleştirme sorusuyla aynı turda bulunmamalı. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "ilahi-kitaplar"
  },
  {
    "id": "pilot-prophets-004",
    "version": 1,
    "categoryId": "prophets",
    "difficulty": "medium",
    "question": "İslâm kültüründe sabır ve tahammülün örnek şahsiyeti olarak özellikle anılan peygamber kimdir?",
    "options": [
      {
        "id": "o1",
        "text": "Hz. İdrîs"
      },
      {
        "id": "o2",
        "text": "Hz. Eyyûb"
      },
      {
        "id": "o3",
        "text": "Hz. Süleyman"
      },
      {
        "id": "o4",
        "text": "Hz. İlyâs"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hz. Eyyûb, İslâmî anlatılarda ve edebiyatta sabır örneği olarak tanınır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/eyyub#2-edebiyat",
        "locator": "Edebiyat bölümü, sabır temsili",
        "supports": "Hz. Eyyûb, İslâmî anlatılarda ve edebiyatta sabır örneği olarak tanınır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "‘Yalnızca sabreden peygamber’ anlamına gelen mutlak bir hüküm kurulmamalı. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "eyyub-sabir"
  },
  {
    "id": "pilot-history-001",
    "version": 1,
    "categoryId": "history",
    "difficulty": "medium",
    "question": "Bedir Gazvesi, hicretin kaçıncı yılında gerçekleşmiştir?",
    "options": [
      {
        "id": "o1",
        "text": "1."
      },
      {
        "id": "o2",
        "text": "2."
      },
      {
        "id": "o3",
        "text": "3."
      },
      {
        "id": "o4",
        "text": "5."
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Bedir Gazvesi hicretin ikinci yılında, milâdî 624’te gerçekleşti.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/bedir-gazvesi",
        "locator": "Gazvenin tarihî anlatımı, 2/624",
        "supports": "Bedir Gazvesi hicretin ikinci yılında, milâdî 624’te gerçekleşti.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Kesin gün/ay takvim dönüşümü sorulmuyor. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "bedir-tarihi"
  },
  {
    "id": "pilot-history-002",
    "version": 1,
    "categoryId": "history",
    "difficulty": "easy",
    "question": "Uhud Gazvesi hangi şehrin yakınlarında gerçekleşmiştir?",
    "options": [
      {
        "id": "o1",
        "text": "Mekke"
      },
      {
        "id": "o2",
        "text": "Kûfe"
      },
      {
        "id": "o3",
        "text": "Medine"
      },
      {
        "id": "o4",
        "text": "Bağdat"
      }
    ],
    "correctOptionId": "o3",
    "explanation": "Uhud dağı Medine’nin kuzeyindedir; gazve bu bölgeyle anılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/uhud-gazvesi",
        "locator": "Giriş ve Uhud dağının konumu",
        "supports": "Uhud dağı Medine’nin kuzeyindedir; gazve bu bölgeyle anılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Mevcut Mescid-i Nebevî/Medine sorusuyla aynı doğru cevap ancak farklı olgu. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "uhud-konum"
  },
  {
    "id": "pilot-history-003",
    "version": 1,
    "categoryId": "history",
    "difficulty": "medium",
    "question": "Hudeybiye Antlaşması, Medineli Müslümanlarla hangi topluluk arasında yapılmıştır?",
    "options": [
      {
        "id": "o1",
        "text": "Abbâsîler"
      },
      {
        "id": "o2",
        "text": "Mekkeli Kureyşliler"
      },
      {
        "id": "o3",
        "text": "Bizanslılar"
      },
      {
        "id": "o4",
        "text": "Selçuklular"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Hudeybiye Antlaşması Hz. Peygamber’in temsil ettiği Medine tarafıyla Mekke’deki Kureyş temsilcileri arasında yapıldı.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/hudeybiye-antlasmasi",
        "locator": "Giriş, taraflar ve antlaşma",
        "supports": "Hudeybiye Antlaşması Hz. Peygamber’in temsil ettiği Medine tarafıyla Mekke’deki Kureyş temsilcileri arasında yapıldı.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Antlaşmanın bütün hükümleri veya tarihî yorumları tek yanıt olarak sorulmuyor. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "hudeybiye"
  },
  {
    "id": "pilot-history-004",
    "version": 1,
    "categoryId": "history",
    "difficulty": "medium",
    "question": "Mekke’nin fethi hicretin kaçıncı yılında gerçekleşmiştir?",
    "options": [
      {
        "id": "o1",
        "text": "2."
      },
      {
        "id": "o2",
        "text": "5."
      },
      {
        "id": "o3",
        "text": "8."
      },
      {
        "id": "o4",
        "text": "10."
      }
    ],
    "correctOptionId": "o3",
    "explanation": "Mekke’nin fethi hicretin sekizinci yılına, milâdî 630’a tarihlenir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/mekke",
        "locator": "Fetih bölümü, 8/630",
        "supports": "Mekke’nin fethi hicretin sekizinci yılına, milâdî 630’a tarihlenir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Kesin gün konusunda farklı rivayetler bulunduğundan yalnız yıl soruluyor. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "mekke-fethi-tarihi"
  },
  {
    "id": "pilot-general-001",
    "version": 1,
    "categoryId": "general",
    "difficulty": "easy",
    "question": "Camide ezanı okuyan görevli hangi adla anılır?",
    "options": [
      {
        "id": "o1",
        "text": "Hatip"
      },
      {
        "id": "o2",
        "text": "Müezzin"
      },
      {
        "id": "o3",
        "text": "Müfessir"
      },
      {
        "id": "o4",
        "text": "Kâtip"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Müezzin, ezan okuyup namaza çağrıda bulunan kişiye verilen addır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/muezzin",
        "locator": "Madde tanımı",
        "supports": "Müezzin, ezan okuyup namaza çağrıda bulunan kişiye verilen addır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Mevcut ezan tanımı sorusuyla aynı turda sorulursa cevap çağrışımı yaratabilir. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "general-001"
  },
  {
    "id": "pilot-general-002",
    "version": 1,
    "categoryId": "general",
    "difficulty": "easy",
    "question": "Hac ve umrede Kâbe’nin etrafında usulüne uygun biçimde dönmeye ne denir?",
    "options": [
      {
        "id": "o1",
        "text": "Sa‘y"
      },
      {
        "id": "o2",
        "text": "Tavaf"
      },
      {
        "id": "o3",
        "text": "İtikâf"
      },
      {
        "id": "o4",
        "text": "Hutbe"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Kâbe çevresinde yapılan bu ibadet tavaf adıyla anılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/tavaf",
        "locator": "Madde tanımı, tavaf",
        "supports": "Kâbe çevresinde yapılan bu ibadet tavaf adıyla anılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Sa‘y ve şavt sorularıyla konu ilişkisi var; yakın kavramlar dengelenmeli. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "hac-rituals"
  },
  {
    "id": "pilot-general-003",
    "version": 1,
    "categoryId": "general",
    "difficulty": "medium",
    "question": "Hac ve umrede Safâ ile Merve arasında gidip gelmeye ne denir?",
    "options": [
      {
        "id": "o1",
        "text": "Tavaf"
      },
      {
        "id": "o2",
        "text": "Sa‘y"
      },
      {
        "id": "o3",
        "text": "İhram"
      },
      {
        "id": "o4",
        "text": "Kıraat"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Safâ ile Merve arasında gerçekleştirilen gidiş geliş ibadeti sa‘y olarak adlandırılır.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/say",
        "locator": "Madde tanımı; Safâ ve Merve",
        "supports": "Safâ ile Merve arasında gerçekleştirilen gidiş geliş ibadeti sa‘y olarak adlandırılır.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Tavaf ile aynı turda sorulursa karşılıklı öğretme etkisi oluşabilir. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "hac-rituals"
  },
  {
    "id": "pilot-general-004",
    "version": 1,
    "categoryId": "general",
    "difficulty": "medium",
    "question": "Kâbe çevresindeki tavafta bir tam dönüşe ne ad verilir?",
    "options": [
      {
        "id": "o1",
        "text": "Hatim"
      },
      {
        "id": "o2",
        "text": "Şavt"
      },
      {
        "id": "o3",
        "text": "Hizip"
      },
      {
        "id": "o4",
        "text": "Sahur"
      }
    ],
    "correctOptionId": "o2",
    "explanation": "Tavaf sırasında Kâbe çevresindeki her tam dönüşe bir şavt denir.",
    "sources": [
      {
        "title": "TDV İslâm Ansiklopedisi",
        "publisher": "TDV İslâm Araştırmaları Merkezi",
        "url": "https://islamansiklopedisi.org.tr/savt",
        "locator": "Madde tanımı, tavaftaki tek dönüş",
        "supports": "Tavaf sırasında Kâbe çevresindeki her tam dönüşe bir şavt denir.",
        "checkStatus": "supported",
        "checkedAt": "2026-10-19"
      }
    ],
    "reviewStatus": "draft",
    "reviewNotes": "Tavaf sorusuyla aynı turda sorulmasın; mevcut şavt/sa‘y tanımlarındaki bağlam editörce karşılaştırılmalı. Kaynak ön kontrolü yapılmıştır; bağımsız insan editör ve dinî uzman onayı bekleniyor.",
    "updatedAt": "2026-10-19",
    "conceptGroup": "hac-rituals"
  }
];

export const bankV3: readonly Question[] = [...bankV2, ...pilotQuestions];

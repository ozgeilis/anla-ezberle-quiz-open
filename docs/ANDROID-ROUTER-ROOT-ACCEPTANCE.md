# Android Activity yenilenmesi ve gezinme

Release emülatör testinde sistem yazı ölçeği/tema değişimi ve dış `prepare` bağlantısından sonra **Oyuna Başla** işlemi `The imperative router is unavailable before the first render has finished` hatasıyla çökebildi. Aynı hata önceki release APK'nın crash buffer'ında da bulundu; yalnız SDK yama yükseltmesine atfedilmedi.

Expo SDK 58'in [resmî geçiş rehberi](https://docs.expo.dev/router/migrate/sdk-57-to-58/#prefer-userouter-in-components) bileşenlerde modül düzeyindeki ortak `router` yerine, render eden Router köküne bağlı `useRouter()` kullanılmasını önerir. Eski kökün imperative köprüsü kapanınca paylaşılan modül nesnesi bağlı olmayan duruma dönebilir; görünen bileşenin callback'i yanlış köprüye gider.

Değişiklik: mevcut tüm React bileşenleri ve push yönlendirme hook'u kendi `useRouter()` sonucunu kullanır. URL'ler, gezinme eylemleri, arayüz, oyun kuralları ve backend değişmez. Ayarlar'ın modül düzeyindeki geri callback'i de bileşenin içine taşınır. Etki bağımlılıkları hook sonucunu içerir. İkinci bir yönlendirme katmanı veya hatayı yutan try/catch eklenmedi.

Regresyon kabulü: temiz açılış → tema/font ölçeğiyle Activity yenilenmesi → dış `prepare?category=mixed&difficulty=medium` bağlantısı → Oyuna Başla → çift yanıt/yanlış/süre sonu → sonuç → geçmiş. Aynı callback'lerin ana sayfa, ayarlar, gizlilik, profil, bildirim ve oda giriş kapılarında çalışması ve crash buffer'ında yeni hata olmaması ayrıca kontrol edilir. Gerçek APK sonucu kapalı test raporunda SHA ile kaydedilir; birim testlerinin geçmesi bu native kabul yerine geçmez.

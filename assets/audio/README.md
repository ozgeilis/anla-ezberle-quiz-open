# Anla & Ezberle — özgün ses koleksiyonu

Bu 11 kısa efekt, bu proje için `scripts/generate-game-audio.py` ile sıfırdan sentezlenmiştir. Hazır kayıt, sample, üçüncü taraf beste, Kur’an tilaveti, ezan veya başka dinî ses kullanılmaz. Üretim kaynağı ve SHA-256 özetleri bu depoda tutulur. Bilinen yarışma programlarının sesleri veya melodileri taklit edilmez. Arka plan veya menü müziği yoktur.

27 Ekim 2026 Samsung A04 geri bildirimi sonrası efektler yeniden üretildi. Elektronik bip yerine kısa, tok, ahşap rezonanslı onaylar; yanlış/süre sonunda yumuşak düşük tonlu vuruşlar kullanılır. 120 ms saat tıkı mekanik çift darbe içerir. Önceki düşük seviyeli tik dosyası ve tik için ek ses kısması kaldırıldı; kayıtlı ses tercihi değişmez. Mono 24 kHz PCM16 WAV, toplam 301.444 bayt; efektler 0,08–1,55 saniye arasıdır. `manifest.json` süre, tepe, RMS ve içerik özetlerini içerir. Tepe seviyesi en fazla 0,56; tik 0,50. Teknik ölçümler Android hoparlöründe duyulabilirlik veya öznel dinleme kabulünün yerine geçmez.

| Dosya         | Olay                                                                 |
| ------------- | -------------------------------------------------------------------- |
| tap.wav       | Hafif düğme tıklaması                                                |
| select.wav    | Kategori/seçenek seçimi veya sonucu henüz açıklanmayan sunucu yanıtı |
| correct.wav   | Kabul edilmiş ve doğruluğu açıklanmış yanıt                          |
| wrong.wav     | Kabul edilmiş ve yanlışlığı açıklanmış yanıt                         |
| next.wav      | Gerçek soru geçişi                                                   |
| timeout.wav   | Sunucunun açıkladığı cevapsız süre sonu                              |
| completed.wav | Yarışma bitişi                                                       |
| perfect.wav   | Açıklanmış tam doğru sonuç                                           |
| badge.wav     | Yeni rozet grubu                                                     |
| levelUp.wav   | Gerçek seviye artışı                                                 |
| tick.wav      | 10 saniyelik soru süresi, efektlerle aynı sessiz/ses düzeyi tercihi  |

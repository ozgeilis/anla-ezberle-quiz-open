# PUBLIC depoda GitHub Actions

`ozgeilis/anla-ezberle-quiz-open` PUBLIC olarak doğrulandıktan sonra Actions etkinleştirilmiştir. Önceki beş `.yml.disabled` şablonu `.github/workflows/` altına taşındı; altıncı workflow PR #89'dan taşınan ses kabulüdür. Eski PRIVATE depoda Actions veya PR durumu değiştirilmez.

## Kapsam ve güvenlik

- Her job `github.event.repository.private == false` koşulunu korur ve yalnız standart `ubuntu-latest` GitHub-hosted runner kullanır. Self-hosted, GPU veya larger runner yoktur.
- Node.js 24 ve projeyle sabit pnpm 11.25.0 kullanılır. Action'lar incelenen resmî release commit SHA'larına sabitlenmiştir. Repo allowlist'i GitHub'a ait Action'lar ile sabitlenmiş pnpm, Supabase CLI ve Deno kurucularını kapsar.
- `contents: read`, checkout `persist-credentials: false`, varsayılan read-only token ve PR onaylama yetkisinin kapalı olması korunur. `pull_request_target`, üretim sırları, Vercel veya Supabase yönetici anahtarı yoktur.
- UI testleri yapılandırılmamış veya `127.0.0.1` sentetik bağlantı kullanır; dış HTTPS isteklerini tarayıcı bağlamında engeller. Sunucu kabulü yalnız runner'da sıfırdan açılan geçici yerel Supabase ve sentetik hesaplarla yapılır.
- Yerel geçici Supabase, kendi geçici yönetici/anon anahtarlarını üretir. Bunlar üretim anahtarı değildir; status ve oturum fixture'ları `$RUNNER_TEMP`/özel `/tmp` dosyalarında tutulur, Git'e/loglara/artifact'lara yazılmaz.
- Artifact yolları test çıktılarıyla sınırlı; saklama süresi bir gün. Üretim logları, `.env`, local-status veya tester dosyaları yüklenmez. Aynı PR/daldaki eski koşular concurrency ile durdurulur.

## Çalışan kontroller

| Workflow                  | Kabul                                                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| content-main-check        | Soru bütünlüğü, TypeScript, lint, tüm testler, içerik denetimi                                            |
| category-ui-smoke         | Referans ana sayfayla karşılaştırma, kategoriler, gerçek tur, profil/rozet/tema                           |
| settings-account-ui       | İzole bildirim, profil ve hesap arayüzü                                                                   |
| leaderboard               | İzole sıralama UI; geçici Auth/Edge/PostgreSQL, sosyal/düello ve kullanıcı verisi izolasyonu              |
| special-collections-audit | Hazırlık durumundaki özel setlerin kaynak/tekrar/uygunluk kontrolleri; yayın açmaz                        |
| game-audio                | Chromium + WebKit gerçek AudioContext, ses dosyaları, oyun olayları, tercihler ve üretilen native izinler |

Hepsi PR ve manuel tetiklemeyi destekler. İçerik ve ses kontrolleri main push'unda da çalışır; diğerleri ilgili PR dosya yollarına göre çalışır. Başarılı bir PR kontrolü, fiziksel iPhone/Android dinleme veya canlı Supabase kabulü olarak sunulmaz.

Standart GitHub-hosted runner kullanımı PUBLIC depolarda ücretsizdir; larger runner ve artifact saklama ayrı ücret kurallarına tabidir. [GitHub resmî açıklaması](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

Vercel dağıtımı bu workflow'ların parçası değildir. Bağlantı veya canlı yayın değişikliği ayrıca depo sahibinin onayını gerektirir.

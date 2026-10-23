# Anla & Ezberle

Türkçe İslami bilgi yarışması. Tek kişilik ve günlük turlar, kategori/zorluk seçimi, kaynak ve açıklamalar, yerel ilerleme, XP, rozetler, profil/tema ayarları ve isteğe bağlı Supabase çevrimiçi oyun altyapısı içerir.

Bu depo yalnız güncel uygulama dosyalarının temiz başlangıç kopyasıdır. Önceki deponun Git geçmişi, dalları, PR'ları, kullanıcı kayıtları, gizli ayarları ve test hesapları taşınmaz. Bir sunucu veya mağaza yayını değildir.

## Yerel kurulum

- Node.js 22.13 veya üstü; `package.json` içinde belirtilen pnpm 11.25.0.
- Expo SDK 58, React Native ve TypeScript.
- Araçlar zaten kuruluysa yeniden kurulum gerekmez.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm web
```

Web önizlemesi:

```sh
pnpm export:web
pnpm preview
```

Çevrimiçi bağlantı isteğe bağlıdır. Gerektiğinde boş `.env.example` dosyasını yerel ve gitignore kapsamındaki `.env.local` dosyasına kopyalayıp yalnız kendi Supabase URL'nizi ve publishable istemci anahtarınızı girin. Yönetici/service-role, SMTP ve dağıtım anahtarları hiçbir `EXPO_PUBLIC_*` değişkenine konmaz. Gerçek bir sunucu bağlantısı olmadan çevrimiçi özellikler çalışıyormuş gibi kabul edilmemelidir.

## İçerik ve kayıt uyumluluğu

Güncel banka v72 ve 1.500 soru, cevaplar, açıklamalar, kaynaklar ve eski banka sürümleri korunur. Geçmiş oyun uyumluluğu için gereken arşiv ve sentetik test fixture'ları yerindedir; gerçek kullanıcı veritabanları burada bulunmaz. Kodda `approved` etiketi bulunması bütün dinî ifadeler için bağımsız uzman doğrulaması anlamına gelmez. Hazırlık aşamasındaki çocuk/özel dönem setleri otomatik olarak açılmaz.

İstenen kaynak kopyasında çevrimdışı soru cevap anahtarları da vardır. Bunlar özel sunucu kimlik bilgisi değildir. Sunucu rekabetçi yanıtları kendi yetkilendirme ve puanlama kurallarıyla doğrular; depo görünürlüğü hileye dayanıklılık garantisi vermez.

## Supabase ve güvenlik

`supabase/migrations`, Edge Function, RLS ve SQL testleri korunur. Bu dosyaların depoda bulunması uzaktaki bir projeye uygulandıkları anlamına gelmez. Üretim ayarları, bağlı proje bilgileri ve yerel credential dosyaları taşınmamıştır. Yerel SQL testleri yalnız izole yerel Supabase üzerinde çalıştırılmalıdır; uzaktaki sunucuya otomatik migration, seed veya test hesabı yazmayın.

## GitHub Actions

Bu yeni ana depo PUBLIC olarak doğrulandıktan sonra Actions etkinleştirildi. Altı workflow yalnız standart GitHub-hosted Ubuntu runner, read-only token ve sentetik yerel test verisi kullanır. Üretim sırları veya dağıtım adımı bulunmaz. Kapsam ve güvenlik kuralları [ci/README.md](ci/README.md) içindedir. Eski PRIVATE depo ve Vercel bağlantısı değiştirilmez.

## Görseller ve kullanım hakları

Gereken yerel görseller korunmuştur; kullanıcı tarafından sağlanan tasarım referansı PNG ve eski ekran görüntüleri taşınmamıştır. Görsel üretim/provenans ve açık kalan yeniden dağıtım incelemesi [docs/ASSET-PROVENANCE.md](docs/ASSET-PROVENANCE.md) içinde açıklanır. Font/ikon lisansları `docs/licenses/` altındadır. Bu kopya yeni bir açık kaynak lisansı vermemektedir.

# PUBLIC sonrası CI etkinleştirme

Şimdiki durum: repo PRIVATE; GitHub Actions depo ayarında kapalı; çalışabilir workflow dosyası yok. `workflows/*.yml.disabled` yalnız incelenebilir şablonlardır. Her işin `github.event.repository.private == false` koşulu, şablon yanlışlıkla PRIVATE depoda etkinleştirilse bile runner ayırmasını engeller.

Şablonlar standart `ubuntu-latest` kullanır. `contents: read` izinleri, süre sınırları, yerel test/fixture yaklaşımı ve Supabase'in yalnız geçici yerel örneğini kullanma kuralları korunur. Üretim gizli değerlerine, eski deponun secrets/env/loglarına veya deploy izinlerine ihtiyaç duymazlar. Tarihsel dal filtreleri kaldırılmıştır.

Güvenlik ve görsel yeniden dağıtım denetimi onaylanmadan görünürlüğü değiştirmeyin. Aşağıdaki adımlar bu taşıma sırasında çalıştırılmamıştır:

1. Hak/güvenlik denetimini tamamlayın ve bu yeni deponun PUBLIC geçişini ayrıca gerçekleştirin; eski depoya dokunmayın.
2. Şu kontrol `PUBLIC` döndürmelidir:
   `gh repo view ozgeilis/anla-ezberle-quiz-open --json visibility --jq .visibility`
3. Yalnız bu yeni deponun çalışma klasöründe `.github/workflows/` oluşturup `.disabled` uzantısını kaldırarak şablonları oraya kopyalayın. Bu değişiklik PUBLIC geçişinden sonra yeni bir commit olur.
4. Yalnız bu yeni depoda Actions'ı etkinleştirin. Dış katkılar için workflow onayını koruyun; Secrets, write token, `pull_request_target`, ücretli larger runner veya self-hosted runner eklemeyin.
5. Yeni bir PR üzerinden standart runner testlerini gözlemleyin. Başarıyla çalışmamış testleri geçmiş saymayın.

Standart GitHub-hosted runner kullanımı PUBLIC depolarda ücretsizdir; larger runner ve depolama ücretleri ayrı kurallara tabidir. [GitHub'ın resmî faturalama açıklaması](https://docs.github.com/en/billing/concepts/product-billing/github-actions).

# CHORUS PROTOCOL
### Doğrulanabilir, Ödüllendirilen ve Gizliliği Korunan Sağlık AI İşbirliği Ağı
**Midnight Night Sky Accelerator — Strateji ve Konsept Dokümanı**

---

## YÖNETİCİ ÖZETİ

Sağlık AI'sının en büyük darboğazı artık algoritma değil, **veri**. Nadir hastalıklar, onkoloji alt tipleri ve hassas tıp (precision medicine) için gereken veri hiçbir tek hastanede yeterli hacimde bulunmuyor. Federated learning (FL) bu sorunu teorik olarak çözüyor — veriyi taşımadan modeli hastaneye götürüyor — ama pratikte hâlâ üç temel güven sorunu var:

1. **Doğrulanamazlık:** Bir hastanenin gerçekten doğru veri üzerinde, dürüstçe eğitim yaptığını hiç kimse kanıtlayamıyor (model zehirleme / poisoning riski).
2. **Ödeme mekanizması yok:** Hastaneler ve biyobankalar, kritik veri katkısı sağladıkları halde bunun karşılığını şeffaf ve otomatik biçimde alamıyor — bu da katılım motivasyonunu öldürüyor.
3. **Uyumluluk/denetim boşluğu:** Regülatörlerin (EHDS, HIPAA, GDPR) talep ettiği "gerekirse denetlenebilirlik" ile hastaların "asla ifşa edilmeme" beklentisi bugünkü mimarilerde bir arada çözülemiyor.

**Chorus**, Midnight'ın üç bileşenini (gizli hesaplama/private state, programlanabilir seçici ifşa, ve zincir-üstü ödeme/itibar katmanı) tek bir sistemde birleştirerek şunu sağlıyor: hastaneler ve araştırma merkezleri, ham veriyi hiç paylaşmadan, katkılarının **doğruluğunu kriptografik olarak kanıtlayıp**, bu kanıt karşılığında **otomatik ve şeffaf ödeme** alıyor; regülatörler ise gerektiğinde **açıkça tanımlanmış disclosure noktalarından** denetim yapabiliyor.

Bu, akademik literatürde (2023-2026) "ZK-FL" adıyla onlarca makalede ayrı ayrı çözülmüş parçaların (Federify, TrustDFL, FLARE, VPFL, martFL) — **hiçbirinin** hastane-sınıfı uyumluluk, gerçek ödeme rayı ve regülatör-dostu seçici ifşa ile birlikte ürünleştirilmediği bir boşluk. Bu boşluk yalnızca Midnight'ın mimarisiyle (gizlilik varsayılan + açık ifşa + programlanabilir zincir-üstü ekonomi) tek bir katmanda kapatılabiliyor.

---

## FAZ 1-2 — SAĞLIK GİZLİLİĞİNDE EN BÜYÜK SORUNLAR (ÖNCELİKLENDİRİLMİŞ)

Aşağıdaki liste, araştırma sırasında tekrar tekrar öne çıkan ve gerçek ekonomik/regülatif ağırlığı olan sorunları önceliklendiriyor. Her biri için "neden var", "kim para kaybediyor", "AI neden kötüleştiriyor" özetlendi.

| # | Sorun | Neden var | Kim kaybediyor | AI neden kötüleştiriyor |
|---|---|---|---|---|
| 1 | **Çok-merkezli AI eğitiminde veri siloları** — hastaneler veri paylaşamıyor | HIPAA/GDPR/EHDS, rekabet kaygısı, format uyumsuzluğu | Hastaneler (daha kötü modeller), hastalar (daha yavaş tanı) | Foundation modeller devasa, çeşitli veri istiyor; tek hastane asla yeterli değil |
| 2 | **Federated learning'de güven eksikliği** — kimse diğerinin dürüst eğitim yaptığını doğrulayamıyor | Merkezi sunucu tek arıza noktası, gradyan paylaşımı denetlenemez | Konsorsiyum kalitesi, tüm katılımcılar | Model zehirleme saldırıları AI ile daha sofistike hale geliyor |
| 3 | **Katkı ödemesi/teşvik mekanizması yokluğu** — hastaneler veri verir ama karşılığını alamaz | Zincir-üstü şeffaf muhasebe yok, katkı ölçümü güvenilmez | Veri sahibi kurumlar (fırsat maliyeti) | Değerli veri (nadir vaka) ile sıradan veri aynı muamele görüyor |
| 4 | **Nadir hastalık kohort eşleştirme** — küçük popülasyonlar ülkeler arası dağınık | Düşük prevalans, kayıt sistemleri parçalı | Hastalar (tanı gecikmesi), ilaç şirketleri (deneme maliyeti) | AI eşleştirme motorları merkezi veri ister, ama merkezi veri yasal değil |
| 5 | **Genomik veri paylaşımı** — EHDS'nin bile ek ulusal koruma istediği en hassas kategori | Kalıtsal, geri döndürülemez, aile üyelerini de etkiliyor | Genomik araştırma, hassas tıp | AI genomdan yeniden-tanımlama (re-identification) riskini artırıyor |
| 6 | **AI tanı çıktılarının doğrulanabilirliği** — bir modelin gerçekten iddia ettiği veri/performansla eğitildiğinin kanıtı yok | Model kartları güvene dayalı, denetlenemez | Hastaneler (yanlış AI satın alma riski), FDA/düzenleyiciler | Modeller kapalı kutu, "black box" |
| 7 | **Çapraz-sınır (EHDS) uyumluluk karmaşıklığı** — 27 üye devlette farklı ek güvenlik önlemleri | Article 51(4) gibi ulusal istisnalar, hukuki parçalanma | Araştırmacılar, çok uluslu klinik denemeler | AI araçları tek bir uyumluluk modeline göre tasarlanmıyor |
| 8 | **Gradyan sızıntısı / membership inference** — "federated" bile tam gizli değil | Gradyanlardan orijinal veri kısmen geri çıkarılabiliyor | Hastalar, FL'ye güven | AI saldırı modelleri gradyan tersine mühendisliğini kolaylaştırıyor |
| 9 | **Klinik deneme hasta bulma maliyeti** — kritere uyan hastayı bulmak milyonlarca dolar | Uygunluk verisi hastanelerde kilitli, ifşa riski | İlaç şirketleri, hastalar (deneme erişimi) | AI eşleştirme motoru, veri paylaşılmadan çalışamıyor |
| 10 | **AI model sağlayıcı — hastane güven asimetrisi** — hastane "black box" bir modele hastasının verisini emanet ediyor | Sözleşmesel güven, teknik doğrulama yok | Hastaneler, hasta güvenliği | Büyük dil/görüntü modelleri şeffaf değil |

*(Tam 30 maddelik liste — dijital patoloji, giyilebilir cihaz verisi, sigorta underwriting, ilaç keşfinde sentetik veri kalitesi, longevity/wellness verisi ticarileşmesi vb. — talep edilirse ayrı ek olarak genişletilebilir; burada venture-scale ve Midnight-özgün olanlara odaklanıldı.)*

---

## FAZ 3 — 20 KONSEPT (ELENENLER DAHİL)

**Reddedilenler ve neden venture-scale değiller:**

1. ~~Hasta cüzdanı / kişisel sağlık kaydı dApp'i~~ — talep zaten "yasak liste"de, ayrıca kullanıcı edinme maliyeti sağlık sektöründe çok yüksek, tekil kullanıcı bunu yönetmek istemiyor.
2. ~~Sağlık verisi pazaryeri (veri satışı)~~ — yasak liste + etik/regülatif risk (GDPR "veri satışı" kavramına çok yakın).
3. ~~Sigorta talep (claim) doğrulama dApp'i~~ — yasak liste + sigorta şirketleri zaten kapalı sistemlerde bunu çözüyor.
4. ~~Reçete/ilaç etkileşim kontrolü~~ — gerçek ama küçük TAM, mevcut eczane yazılımları (Surescripts vb.) zaten çözüyor, Midnight'a özgü moat yok.
5. ~~Genel amaçlı "gizli EHR" zinciri~~ — Epic/Oracle Health'in kilidini kırmak imkânsıza yakın, satış döngüsü 3-5 yıl, tek başına şirket batırır.
6. ~~Wearable veri "her şeyi kanıtla" platformu~~ — talep belirsiz, Apple Health zaten ekosistemi kilitliyor.
7. ~~ZK tabanlı "yaş doğrulama" sağlık kapıları~~ — çok dar, tek özellik, savunulabilirlik yok.
8. ~~AI radyoloji ikinci görüş dApp'i (tek model)~~ — AI kısmı Midnight'a bağlı değil, herhangi bir bulutta yapılabilir.
9. ~~DID tabanlı doktor kimlik doğrulama~~ — gerçek sorun ama küçük, kar marjı düşük, network etkisi zayıf.
10. ~~Hasta rızası (consent) yönetim platformu~~ — mevcut consent management araçları (OneTrust vb.) zaten var, Midnight farkı marjinal.
11. ~~Genomik veri "kasa" (vault) ürünü~~ — depolama sorunu değil, kullanım/işbirliği sorunu asıl acı nokta.
12. ~~AI ilaç keşfi için sentetik veri üretici~~ — güçlü fikir ama gizlilik değil, veri kıtlığı sorunu; Midnight moat'ı zayıf.
13. ~~Hastane-sigorta gizli fatura uzlaşması~~ — finansal, ilginç ama "insurance dApp" yasak listesine çok yakın.
14. ~~Uzaktan hasta izleme (RPM) gizli veri akışı~~ — cihaz entegrasyon karmaşıklığı devasa, blockchain gereksiz.
15. ~~AI klinik kopilotu (hastane içi asistan)~~ — güçlü AI ürünü ama gizlilik/blockchain katmanına gerçek ihtiyaç yok, herhangi bir TEE ile çözülür.
16. ~~Longevity/kişiselleştirilmiş sağlık DAO'su~~ — tüketici odaklı, düzenleyici risk düşük ama TAM spekülatif, "crypto sağlık" algısı riskli.
17. **✅ Doğrulanabilir Federated Learning + Kohort Eşleştirme Ağı (nadir hastalık/hassas tıp odaklı)** — güçlü aday.
18. **✅ ZK-doğrulanmış AI model "sertifikasyon" katmanı (bir modelin iddia ettiği veriyle eğitildiğinin kanıtı)** — güçlü aday, #17 ile birleşebilir.
19. **✅ EHDS-uyumlu çapraz-sınır klinik deneme kohort eşleştirme protokolü** — güçlü aday, #17'nin bir uygulama alanı.
20. **✅ Genomik araştırma için "katkı-kanıtlı" federe eğitim ağı** — güçlü aday, #17'nin dikey pazarı.

17-20 numaralı fikirler aslında **tek bir platformun farklı yüzleri** — bu da Faz 5'teki kazananı işaret ediyor.

---

## FAZ 4 — YATIRIM KOMİTESİ STRES TESTİ (İLK 5)

### A) Doğrulanabilir Federe Öğrenme Protokolü (genel altyapı)
- **Güç:** Akademik temel sağlam (VPFL, TrustDFL, FLARE, martFL — 2023-2026 arası aktif literatür), gerçek bir "hiç kimse ürünleştirmedi" boşluğu var.
- **Zayıflık:** Genel altyapı olarak satmak zor — "kime satıyorsun" sorusu. Dikey bir kullanım alanı (nadir hastalık) olmadan hikaye soyut kalır.
- **Rakip kopyalama riski:** Akademik kod açık kaynak; ama hastane-sınıfı uyumluluk + ödeme rayı + regülatör arayüzü inşa etmek 12-18 ay sürer — bu gerçek bir hendek.

### B) Nadir Hastalık Kohort Eşleştirme + Federe Tanı Modeli
- **Güç:** EHDS tam da şimdi (26 Mart 2026) yürürlüğe girdi — "why now" çok güçlü. Nadir hastalık ailesi/hasta grupları (EURORDIS gibi) doğal ilk müşteri/ortak. TAM: küresel nadir hastalık tanı pazarı + klinik deneme hasta bulma pazarı (~yüz milyonlarca dolar/yıl harcama).
- **Zayıflık:** Satış döngüsü hastane/biyobanka ortaklıklarına bağlı — yavaş olabilir. Çözüm: ilk müşteri ilaç şirketleri/CRO'lar (daha hızlı satın alma).
- **Rakip kopyalama riski:** Federated learning şirketleri (Owkin, Rhino Health vb.) var ama hiçbiri kriptografik doğrulama + tokenize ödeme + Midnight'ın explicit-disclosure uyumluluk modelini birleştirmiyor.

### C) AI Model Sertifikasyon Katmanı ("bu model gerçekten iddia ettiği veriyle eğitildi" kanıtı)
- **Güç:** FDA/EMA AI onay süreçlerinde şeffaflık talebi artıyor; regülatör-dostu bir "kanıt katmanı" güçlü bir B2B2G hikaye.
- **Zayıflık:** Tek başına bir "audit" ürünü — tekrarlayan gelir modeli B'den daha zayıf, platform değil nokta çözüm.
- **Karar:** B'ye entegre bir özellik olarak dahil edilmeli, ayrı şirket değil.

### D) Genomik Araştırma Federe Ağı
- **Güç:** En yüksek gizlilik hassasiyeti = en yüksek Midnight moat'ı (genomik veri asla merkezi sunucuya değmemeli).
- **Zayıflık:** EHDS'nin genomik veri kuralları 2031'e kadar aşamalı devreye giriyor — düzenleyici zamanlama MVP için erken. Uzun vadeli roadmap unsuru olmalı, gün-1 odak değil.

### E) Çapraz-sınır Klinik Deneme Eşleştirme Protokolü
- **Güç:** En somut, en hızlı gelir potansiyeli (CRO'lar/ilaç şirketleri hasta bulma için zaten milyonlar harcıyor).
- **Zayıflık:** Tek başına "kohort eşleştirme" AI'sız da yapılabilir görünebilir — AI'nın gerçek katkısı net anlatılmalı (aşağıda çözülüyor).

**Sonuç:** B, C ve E aslında aynı platformun farklı katmanları/go-to-market kapılarıdır. D uzun vadeli roadmap. Kazanan: **B'yi çekirdek altyapı, E'yi ilk gelir kapısı, C'yi farklılaştırıcı özellik olarak birleştiren tek şirket.**

---

## FAZ 5 — KAZANAN

# CHORUS: Doğrulanabilir Federe Sağlık Zekası Ağı

**Tek cümlelik konum:** Chorus, hastanelerin ve araştırma merkezlerinin ham hasta verisini hiç paylaşmadan nadir hastalık ve hassas tıp modelleri için işbirliği yapmasını, katkılarını kriptografik olarak kanıtlamasını, karşılığında otomatik ödeme almasını ve regülatörlerin gerektiğinde denetlemesini tek bir protokolde birleştiren altyapıdır.

**"Bu sadece Midnight'ta var olabilir" testi:** Diğer zincirler ya tam şeffaf (denetlenebilir ama gizli değil — Ethereum, Solana), ya tam gizli (Zcash/Monero — ama programlanabilir uyumluluk yok), ya da tamamen zincir-dışı (geleneksel FL şirketleri — ama şeffaf ödeme/itibar rayı yok). Chorus'un üç bileşeni de aynı anda gerekli: **(1)** private state'te ham veri hiç çıkmadan eğitim, **(2)** `disclose()` ile açıkça tanımlanmış denetim noktaları (regülatör talebinde sadece gerekli metrik ifşa edilir, veri değil), **(3)** public ledger'da şeffaf, otomatik NIGHT-denominasyonlu katkı ödemesi. Bu üçünü aynı anda, aynı Compact kontratında ifade edebilen başka bir platform yok.

---

### VİZYON
Nadir hastalık teşhisinin ortalama süresi bugün 5-7 yıl. Bunun temel nedeni veri kıtlığı değil, **veri erişim güvensizliği**. Chorus'un 10 yıllık vizyonu: dünya çapında hiçbir hastanenin "verimi paylaşırsam ne olur" korkusu yaşamadan, her nadir hastalık vakasının küresel bilgiye katkıda bulunduğu bir sinir sistemi kurmak.

### ÜRÜN (MVP → Platform)
**MVP (10 haftalık program içinde inşa edilebilir):**
- 3-5 ortak kuruluş (hastane/biyobanka/hasta derneği) ile tek bir nadir hastalık dikey alanı (örn. bir onkoloji alt tipi veya metabolik hastalık ailesi).
- Compact ile yazılmış "eligibility circuit": her kurum, belirlenen kohort kriterine (yaş, tanı kodu, biyobelirteç aralığı) uyan hasta sayısını/özet istatistiğini ham veriyi ifşa etmeden ZK-proof ile bildirir.
- Basit bir federe model güncelleme döngüsü: her kurum yerel gradyanını hesaplar, gradyanın "gerçek yerel veri üzerinde, taahhüt edilen parametrelerle" hesaplandığına dair bir zk-proof üretir (VPFL/TrustDFL literatüründeki yaklaşımların Compact'e uyarlanması).
- Zincir-üstü, kanıta bağlı otomatik ödeme: doğrulanan katkı → akıllı kontrat → NIGHT/stablecoin ödemesi.
- Regülatör paneli: `disclose()` ile tanımlı, önceden onaylanmış denetim sorguları (örn. "kaç kurum katıldı, toplam kohort büyüklüğü neydi" — bireysel hasta verisi asla değil).

**Platforma genişleme (12-24 ay):**
- Çoklu hastalık dikey alanları, klinik deneme sponsorları için self-servis kohort keşif arayüzü.
- AI model "sertifikasyon" pasaportu: bir modelin hangi doğrulanmış kohortlarla eğitildiğinin taşınabilir kanıtı (FDA/EMA sunumlarında kullanılabilir).
- Genomik veri dikey alanı (EHDS zaman çizelgesiyle uyumlu, 2028-2031 arası olgunlaşma).
- Çapraz-zincir/çapraz-kurum itibar sistemi: yüksek kaliteli katkı sağlayan kurumlar öncelikli erişim ve daha yüksek ödeme oranı kazanır.

### MİMARİ

```
┌─────────────────────────────────────────────────────────┐
│  Hastane / Biyobanka (yerel altyapı)                     │
│  - Ham hasta verisi (asla ayrılmaz)                       │
│  - Yerel model eğitimi + gradyan hesaplama                │
│  - Proof server: eğitim + kohort uygunluk kanıtı üretimi  │
└───────────────────────┬───────────────────────────────────┘
                         │  zk-proof (Groth16/PLONK türevi)
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Midnight — Compact Kontratları                           │
│  - Private state: proof witness'ları                      │
│  - Public state: doğrulanmış katkı kayıtları, ödeme       │
│    kayıtları, agregatör model checkpoint hash'leri         │
│  - disclose() noktaları: önceden tanımlı denetim sorguları│
└───────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Agregatör / AI Katmanı                                   │
│  - Doğrulanmış gradyanları birleştirir (FedAvg türevi)     │
│  - Foundation model checkpoint'i günceller                │
│  - Model performans kanıtını (accuracy/fairness) zk ile    │
│    kanıtlar, ham test verisi ifşa etmez                   │
└─────────────────────────────────────────────────────────┘
```

### AI YIĞINI
- **Federe öğrenme çekirdeği:** görüntü (dijital patoloji/radyoloji) ve tablo/EHR verisi için ayrı model aileleri.
- **ZK-doğrulanmış eğitim:** literatürdeki VPFL/TrustDFL/FLARE yaklaşımlarının Compact'e taşınması — yerel eğitim adımının (ileri/geri yayılım) doğruluğunu kanıtlayan devreler.
- **Kohort eşleştirme motoru:** doğal dil/kod tabanlı kriter tanımından ZK-uygunluk devresi otomatik üretimi (geliştirici deneyimini kolaylaştırmak için).
- **Model sertifikasyon:** eğitilen modelin hangi doğrulanmış veri kümeleriyle, hangi fairness/performans eşiğiyle eğitildiğinin taşınabilir, doğrulanabilir "model pasaportu"su.

### GİZLİLİK MODELİ
- Ham veri **hiçbir zaman** kurum dışına çıkmaz (federe mimari).
- Gradyanlar bile çıplak paylaşılmaz — sadece "bu gradyan, taahhüt edilen yerel veri üzerinde doğru hesaplandı" kanıtı paylaşılır (gradyan ters mühendisliği/membership inference riskini literatürdeki saf FL'den çok daha aşağı çeker).
- Denetim, varsayılan değil **istisnadır**: Compact'in explicit disclosure zorunluluğu sayesinde hangi verinin, hangi koşulda, kime ifşa edileceği kontrat seviyesinde önceden tanımlanır — kazara ifşa riski mimari olarak elenir.

### REGÜLASYON STRATEJİSİ
- **EHDS (yürürlükte, 26 Mart 2026):** "algoritma geliştirme için ikincil kullanım" maddesiyle doğrudan uyumlu; federe mimari, verinin ülke sınırını hiç geçmemesi sayesinde EHDS'nin çapraz-sınır veri taşıma sürtünmesini bypass eder.
- **HIPAA:** Business Associate Agreement modeline uygun — Chorus hiçbir zaman PHI'ye erişmez, sadece kanıtları işler.
- **GDPR:** "veri minimizasyonu" ilkesiyle mimari düzeyde uyumlu; kişisel veri işleme değil, kanıt doğrulama yapılır.
- **AI Act:** yüksek riskli sağlık AI sistemleri için istenen "veri yönetişimi ve şeffaflık" gerekliliklerini model sertifikasyon katmanıyla doğrudan karşılar.
- Genomik veri gibi ek ulusal koruma gerektiren kategoriler (EHDS Art. 51(4)) roadmap'te bilinçli olarak faz 2'ye bırakılır — MVP'de düzenleyici risk asgariye indirilir.

### MONETİZASYON
- **Kurum aboneliği:** hastane/biyobanka başına platform erişim ücreti.
- **Sponsor/CRO işlem ücreti:** kohort keşif ve deneme eşleştirme başına ücret (en hızlı gelir kapısı).
- **Model lisanslama:** ortaklaşa eğitilen foundation modellerin lisans geliri, katkı oranına göre kurumlarla paylaşılır (bu da Chorus'u sadece altyapı değil, değer paylaşan bir konsorsiyum yapar — network etkisini güçlendirir).
- **Sertifikasyon ücreti:** AI şirketlerinin modellerini "Chorus-doğrulanmış" olarak etiketletmesi.

### REKABET HENDEĞİ (MOAT)
1. **Kriptografik + kurumsal güven ikili hendeği:** akademik ZK-FL kodu kopyalanabilir ama hastane onayları, BAA'lar, regülatör ilişkileri kopyalanamaz — 12-18 aylık gerçek başlangıç avantajı.
2. **Veri ağı etkisi:** her yeni kurum, kohort kapsamını büyütür → daha değerli model → daha fazla kurum ilgisi (klasik iki taraflı pazar dinamiği).
3. **Midnight-özgü teknik hendek:** explicit disclosure + programlanabilir ödeme + gizli hesaplamanın **tek zincirde** birleşmesi — rakiplerin bunu Ethereum L2 + ayrı bir FL şirketi + ayrı bir ödeme rayı ile "birleştirmesi" gerekir, bu da güven modelini parçalar (Midnight'ın tam çözdüğü şey).

### NEDEN ŞİMDİ
- EHDS 26 Mart 2026'da yürürlüğe girdi — ikincil veri kullanımı için düzenleyici çerçeve **şu anda** somutlaşıyor.
- ZK-FL akademik literatürü 2023-2026 arasında olgunlaştı (VPFL, TrustDFL, FLARE, martFL) — teknik risk azaldı, ürünleştirme fırsatı açık.
- Foundation modellerin veri açlığı zirvede; hastaneler AI ortaklıklarına daha önce hiç olmadığı kadar açık, ama güven mekanizması eksik.
- Midnight'ın mainnet olgunlaşması ve Night Sky Accelerator'ın kendisi, hem teknik hem sermaye desteği için doğru zamanlama penceresi sunuyor.

### FON TOPLAMA HİKÂYESİ
- **Accelerator:** MVP + 2-3 pilot kurum ortaklığı + Midnight Foundation sermayesi/Investor Club erişimi.
- **Seed (accelerator sonrası 6 ay):** EHDS uyumluluğu kanıtlanmış, 1 dikey alanda çalışan canlı ağ, ilk CRO/sponsor müşterisi → "regülasyon-hazır, kanıtlanmış talep" hikayesiyle 2-3M$ aralığı.
- **Series A:** çoklu dikey alan, ölçülebilir tanı hızlanması metrikleri, tekrarlayan lisans geliri → kategori tanımlayıcı altyapı şirketi konumlandırması.

---

## SONUÇ

Chorus, "elektronik sağlık kaydı" veya "hasta cüzdanı" gibi jüri tarafından defalarca görülmüş fikirlerden kasıtlı olarak uzaklaşıyor. Bunun yerine, akademik olarak kanıtlanmış ama hiç ürünleştirilmemiş bir teknik boşluğu (doğrulanabilir + ödüllendirilen + uyumlu federe öğrenme), tam da düzenleyici çerçevenin (EHDS) devreye girdiği anda, yalnızca Midnight'ın mimarisinin tek başına çözebileceği bir şekilde birleştiriyor.

# CHORUS PROTOCOL — GitHub Project Backlog

Bu doküman, GitHub Projects'e (veya Linear/Jira'ya) doğrudan aktarılabilecek şekilde yapılandırılmıştır. Kırılım derinliği versiyona göre kasıtlı olarak değişir — bkz. üst mesajdaki kapsam kararı.

---

## Etiketler (Labels)

**Tip:** `type:epic` `type:feature` `type:story` `type:task` `type:subtask`
**Alan:** `area:frontend` `area:backend` `area:ai` `area:blockchain` `area:infra` `area:design` `area:docs` `area:compliance`
**Öncelik:** `P0` `P1` `P2` `P3`
**Özel:** `security` `needs-audit` `blocked` `needs-zk-signoff`

## Öncelik şeması

| Öncelik | Anlamı |
|---|---|
| P0 | Bir sonraki milestone'a giden kritik yolu bloke ediyor — başka hiçbir şey bundan önce alınmaz |
| P1 | Milestone'un başarı kriteri için gerekli ama başka P0 işini bloke etmiyor |
| P2 | Milestone'u güçlendirir ama bir sonraki versiyona kayabilir, roadmap'i kırmaz |
| P3 | Olursa iyi olur, fırsatçı |

## Definition of Done (her Story için geçerli global şablon)

- [ ] Kod, en az 1 onaylı PR ile `main`'e merge edildi
- [ ] Kabul kriterlerini kapsayan otomatik testler CI'da geçiyor
- [ ] Statik analizden yeni P0/P1 güvenlik bulgusu çıkmadı
- [ ] Davranış kullanıcıya veya geliştiriciye açıksa dokümantasyon güncellendi
- [ ] Üretim verisine dokunuyorsa feature flag veya açık rollout notu var
- [ ] `contracts/` veya `packages/node` dokunulmuşsa: uygulayıcıdan bağımsız bir ZK/Midnight mühendisi onayı var (`needs-zk-signoff` etiketi kapatılmadan merge yok)

## Milestone'lar

| Milestone | Odak | Başarı kriteri (özet) |
|---|---|---|
| v0.1 | Foundation | Temiz clone → tek komut → tüm app'ler lokal çalışıyor |
| v0.2 | Landing (placeholder) | Sayfa canlı, waitlist kayıt alıyor |
| v0.3 | Authentication | SSO ile giriş + davet çalışıyor, her girişi audit logu var |
| v0.4 | Dashboard | Hastane blockchain'e dokunmadan kohort taslağı + ekip yönetebiliyor |
| v0.5 | AI Copilot | Doğal dil promptu, onay gerektiren yapılandırılmış taslak üretiyor |
| v0.6 | Research Platform | Sponsor arama yapıp erişim talep edebiliyor, hastane onaylayabiliyor |
| v0.7 | Midnight Integration | Elle hazırlanmış proof, testnet'te doğrulanabilir katkı+ödeme üretiyor |
| v0.8 | Zero-Knowledge Engine | Sentetik veri üzerinde uçtan uca proof üretim+doğrulama; dış ZK denetimi geçti |
| v0.9 | Clinical Trial Matching | Sponsor kriteri, en az 1 pilot hastaneyle kanıt destekli eşleşme üretiyor |
| v1.0 | Production Release | Demo günü: canlı mainnet katkı+ödeme, gerçek pilot hastaneyle |
| v1.5 | AI Marketplace | Bir model lisanslanıyor, telifler otomatik/doğru dağıtılıyor |
| v2.0 | Global Network | Ağ, hastanelerin kendi talebiyle büyüyor (satış çabası olmadan) |

---

## v0.1 — FOUNDATION (tam detay)

### Epic: Monorepo scaffold `type:epic` `area:infra` `P0`

**Feature: Turborepo + pnpm workspace kurulumu** `type:feature`
- Story: Geliştirici olarak, tek `pnpm install` ile tüm workspace'lerin kurulmasını istiyorum
  - Task: `pnpm-workspace.yaml` yapılandırması
  - Task: `turbo.json` pipeline'ı (build, dev, lint, test)
  - Subtask: Remote cache yapılandırması
  - **AC:** Temiz clone + `pnpm install` + `pnpm dev` manuel adım olmadan tüm app'leri başlatıyor
- Story: Geliştirici olarak, tüm paketlerin aynı standartları takip etmesi için paylaşılan lint/tsconfig istiyorum
  - Task: `packages/config` — eslint-config, tsconfig.base.json, tailwind preset
  - **AC:** Tüm app'ler paylaşılan config'i extend ediyor; `pnpm lint` repo genelinde ihlalleri yakalıyor

**Feature: CI/CD pipeline temeli** `type:feature` `area:infra`
- Story: Ekip olarak, PR'ların otomatik lint/typecheck/test çalıştırmasını istiyorum
  - Task: GitHub Actions workflow — install, lint, typecheck, test matrix
  - Task: Turborepo remote cache CI'a bağlanması
  - **AC:** Lint/typecheck/test başarısızsa PR merge'e kapalı; cache hit'te CI süresi <5 dk

**Feature: Python servis iskeleti (services/ai)** `type:feature` `area:ai`
- Story: Geliştirici olarak, Python AI servisinin kendi CI hattı olmasını istiyorum
  - Task: uv/poetry kurulumu, ruff+mypy config
  - Task: Ayrı GH Actions job'u (Python)
  - **AC:** Python servis değişiklikleri ilgisiz Node build'lerini tetiklemiyor, tersi de geçerli

**Feature: Docker base image'ları** `type:feature` `area:infra`
- Story: DevOps olarak, tüm servisler için tutarlı base image istiyorum
  - Task: Node servisleri için Dockerfile şablonu
  - Task: Python servis Dockerfile'ı
  - **AC:** `docker compose up` lokal olarak api+ai+postgres+redis'i ayağa kaldırıyor

---

## v0.2 — LANDING PLACEHOLDER (tam detay)

### Epic: Yer tutucu pazarlama sitesi `type:epic` `area:frontend` `P1`

**Feature: Marka kabuğu**
- Story: Ziyaretçi olarak, Chorus markasını görüp waitlist'e katılmak istiyorum
  - Task: Statik hero + waitlist formu (`apps/web`)
  - Task: E-posta yakalama → basit API route + Postgres tablosu
  - **AC:** Form kaydı DB'de saklanıyor, onay e-postası gidiyor, tasarım sistemine bağımlılık yok

**Feature: Docs kabuğu**
- Story: Erken teknik değerlendirici olarak, boş bile olsa bir docs giriş noktası istiyorum
  - Task: `apps/docs` iskeleti + placeholder mimari sayfası
  - **AC:** docs sitesi canlı, tek sayfa, web'den linkli

---

## v0.3 — AUTHENTICATION (tam detay)

### Epic: Çok-kiracılı kimlik `type:epic` `area:backend` `P0` `security`

**Feature: WorkOS SSO entegrasyonu**
- Story: Hastane admini olarak, kendi SAML IdP'imle giriş yapmak istiyorum
  - Task: WorkOS SSO bağlantısı + `services/api`'de callback işleme
  - Task: Postgres org modeli (organizations, memberships, roles)
  - Subtask: Prisma migration script'leri
  - **AC:** Test SAML IdP ile giriş tamamlanıp oturum oluşturuluyor
- Story: Hastane admini olarak, belirli rollerle ekip arkadaşı davet etmek istiyorum
  - Task: Davet akışı (e-posta + SSO'suz pilotlar için magic-link fallback)
  - Task: NestJS'te rol bazlı erişim guard'ı
  - **AC:** "Klinisyen" rolüyle davet edilen kullanıcı, uyum-sadece rotalarına erişemiyor

**Feature: Audit log temeli** `security`
- Story: Uyum sorumlusu olarak, her girişin loglanmasını istiyorum
  - Task: Audit log tablosu + ekle-sadece (append-only) yazma yolu
  - **AC:** Her auth olayı (giriş, davet, rol değişikliği) değiştirilemez bir log satırı üretiyor

---

## v0.4 — DASHBOARD (tam detay)

### Epic: Hastane operatör paneli `type:epic` `area:frontend` `P0`

**Feature: Org ve üye yönetimi UI'ı**
- Story: Hastane admini olarak, org ayarlarımı ve üyelerimi yönetmek istiyorum
  - Task: Org ayarları sayfası, üye listesi/davet UI'ı
  - **AC:** Admin org profilini görüntüleyip düzenleyebiliyor, üye rollerini uçtan uca yönetebiliyor

**Feature: Kohort kriteri oluşturucu (devre-öncesi)** `needs-zk-signoff`
- Story: Klinisyen/uyum sorumlusu olarak, bir kohort kriterini yapılandırılmış bir formda tanımlamak istiyorum
  - Task: Kriter oluşturucu UI (gelecekteki devre şemasıyla eşleşen alan/operatör/değer satırları)
  - Task: Taslak kalıcılığı (Postgres, henüz zincir-üstü değil)
  - **AC:** Kaydedilen taslak kriter, v0.8'in devre üreticisinin tüketeceği şemayla eşleşiyor (şema ZK mühendisiyle gözden geçirilip donduruldu)

**Feature: Developer portal bölümü**
- Story: Teknik admin olarak, API anahtarı üretmek ve webhook yapılandırmak istiyorum
  - Task: API anahtarı üretim/rotasyon UI'ı + backend
  - Task: Webhook config UI'ı + teslimat logu
  - **AC:** Üretilen bir API anahtarı test çağrısını doğruluyor; yapılandırılan webhook test olayını alıyor

**Feature: Yer tutucu katkı/kazanç görünümleri**
- Story: Hastane admini olarak, katkı/ödeme verisinin nerede görüneceğini görmek istiyorum
  - Task: "Proof motoru yakında" bandırolüyle statik/mock katkı tablosu
  - **AC:** UI mock veriyle hatasız render oluyor, v0.7'de gerçek veri kaynağına geçmeye hazır

---

## v0.5 — AI COPILOT (Epic/Feature/Story seviyesi)

### Epic: Doğal dil kohort kopilotu `type:epic` `area:ai` `P1`

- **Feature: NL-den-kritere asistanı**
  - Story: Uyum sorumlusu olarak, kohortu düz metinle tanımlayıp yapılandırılmış taslak almak istiyorum
    - **AC:** Düz metin promptu, kaydedilmeden önce açık insan onayı gerektiren yapılandırılmış taslak üretiyor; hiçbir taslak otomatik kaydedilmiyor
- **Feature: Uyum işaretleme**
  - Story: Uyum sorumlusu olarak, kopilotun taslağımdaki olası HIPAA/GDPR/EHDS sorunlarını işaretlemesini istiyorum
    - **AC:** Bilinen riskli kriterler (örn. genomik + ek koruma yok) gerekçesiyle birlikte işaretleniyor

---

## v0.6 — RESEARCH PLATFORM (Epic/Feature/Story seviyesi)

### Epic: Sponsor-yönelimli kohort keşfi `type:epic` `area:frontend` `P1`

- **Feature: Kohort arama (toplu/mock)**
  - Story: CRO olarak, kritere göre kohort aramak ve anonimleştirilmiş büyüklük tahmini görmek istiyorum
    - **AC:** k-anonimlik eşiğinin altındaki sorgular ham sayı yerine "kohort yetersiz" döndürüyor
- **Feature: Erişim talebi akışı**
  - Story: CRO olarak, eşleşen bir kohorta erişim talep edip onay sürecini takip etmek istiyorum
    - **AC:** Talep, denetim izi bırakarak beklemede→onaylandı/reddedildi arasında geçiş yapıyor

---

## v0.7 — MIDNIGHT INTEGRATION (Epic/Feature/Story seviyesi)

### Epic: Zincir-üstü katkı ve ödeme temeli `type:epic` `area:blockchain` `P0` `needs-zk-signoff`

- **Feature: Compact kontratları v1**
  - Story: Protokol olarak, bir uygunluk kaydı kontratına ihtiyacım var
    - **AC:** Kontrat testnet'e deploy edilmeden önce gözden geçirilmiş bir disclosure sınırı dokümanı var
  - Story: Protokol olarak, bir katkı defteri kontratına ihtiyacım var
    - **AC:** Elle gönderilen geçerli bir proof, testnet'te katkı kaydı üretip ödemeyi tetikliyor
- **Feature: contracts-client kod üretimi**
  - Story: Geliştirici olarak, Compact kontratlarından üretilen tipli bindings istiyorum
    - **AC:** Kontrat şema değişikliği, elle düzenleme olmadan client tiplerini yeniden üretiyor

---

## v0.8 — ZERO-KNOWLEDGE ENGINE (Epic/Feature/Story seviyesi — en yüksek risk)

### Epic: Doğrulanabilir yerel eğitim `type:epic` `area:blockchain` `P0` `needs-audit` `needs-zk-signoff`

- **Feature: Chorus Node MVP**
  - Story: Hastane olarak, lokal eğitim yapıp proof üreten bir Docker agent istiyorum
    - **AC:** Sentetik veriyle çalıştırılan node, kabul edilen zaman bütçesi içinde proof-worker tarafından doğrulanabilir bir proof üretiyor
- **Feature: Proof doğrulama hattı**
  - Story: Protokol olarak, agregasyondan önce gönderilen proof'ların doğrulanmasını istiyorum
    - **AC:** Geçersiz/kurcalanmış proof, loglanmış bir nedenle reddediliyor; geçerli proof kabul edilip agregasyon kuyruğuna giriyor
- **Feature: Dış ZK denetimi**
  - Story: Şirket olarak, gerçek hasta verisine dokunmadan önce bağımsız incelemeye ihtiyacımız var
    - **AC:** Denetim raporu, çözülmemiş kritik bulgu olmadan alınıyor

---

## v0.9 — CLINICAL TRIAL MATCHING (Epic/Feature/Story seviyesi)

### Epic: Sponsor kriterinin proof hattından geçmesi `type:epic` `area:backend` `P1`

- **Feature: Birleşik kriter şeması**
  - Story: Geliştirici olarak, sponsor ve hastane kriterlerinin tek şemayı paylaşmasını istiyorum
    - **AC:** Her iki köken de özel durum dalları olmadan aynı devre üreticisinden geçiyor
- **Feature: İtibar puanlaması v1**
  - Story: Admin olarak, kurum başına temel bir katkı kalite puanı istiyorum
    - **AC:** Puan, her doğrulanmış katkıdan sonra otomatik güncelleniyor, `apps/admin`'de görünüyor

---

## v1.0 — v2.0 (sadece Epic seviyesi — task kırılımı milestone yaklaştıkça yapılacak)

- **v1.0 — Production Release:** Güvenlik sertleştirme · HIPAA BAA süreci · mainnet geçişi + yeniden denetim · faturalama · olay müdahale hazırlığı
- **v1.5 — AI Marketplace:** Model pasaportu · pazar listeleme/lisanslama · kullanım-bazlı telif dağıtımı · itibar sisteminin ağırlıklandırma formülüne olgunlaşması
- **v2.0 — Global Network:** Çoklu yargı alanı uyum motoru · genomik uygunluk devreleri · sınır ötesi proof agregasyonu · self-servis onboarding


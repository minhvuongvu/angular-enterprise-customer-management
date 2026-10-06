# Lộ trình học Angular — từ Backend Engineer sang Fullstack

Tài liệu định hướng cho người dùng repo này để **học Angular**, không phải để phát
triển nó. Đọc lại thường xuyên: nó giữ lộ trình, cách học, và những cái bẫy sẽ
quay lại nhiều lần.

Bộ bài học nằm cạnh file này, dạng HTML, mở trực tiếp bằng trình duyệt.
`index.html` là trang chỉ mục.

## 1. Mục tiêu, và "xong" nghĩa là gì

Nền sẵn có: HTML, CSS, JS, TS — vững. Thiếu: Angular, và cách tư duy frontend
của một ứng dụng sống lâu trong trình duyệt.

Đích đến không phải "đọc hết tài liệu". Đích đến là **làm được bốn việc ở §4**.
Nếu bốn việc đó làm được mà chưa đọc hết, thế là xong. Nếu đọc hết mà chưa làm
được, thế là chưa bắt đầu.

## 2. Đọc lại file này khi nào

- **Đầu mỗi chặng** — để biết chặng này đang nhằm vào năng lực nào.
- **Khi mất phương hướng**, cảm giác "học nhiều mà không chắc mình tiến tới đâu":
  đọc §4, tự hỏi mốc nào đã qua. Cảm giác đó hầu như luôn là dấu hiệu của §11.
- **Khi muốn nhảy bài**, bỏ qua một chặng để tới thứ nghe hấp dẫn hơn: đọc §8.
- **Khi tra Google ra kết quả lạ** so với code trong repo: đọc §9 trước khi tin.

## 3. Năm quy tắc học

**Quy tắc 1 — Không đọc hai bài liền nhau mà không gõ code.**
Đây là quy tắc quan trọng nhất và dễ phá nhất. Đọc sáu bài một buổi cho cảm giác
tiến bộ mà không để lại gì dùng được.

**Quy tắc 2 — Che đáp án.**
Mỗi bài có mục Bài tập. Làm trước, rồi mới mở mục "Trong repo này" xem repo làm
thế nào. Chênh lệch giữa hai cách chính là bài học, và nó chỉ xuất hiện nếu đã
thử trước.

**Quy tắc 3 — `npm run verify` là người chấm.**
Thứ người tự học luôn thiếu là một người chấm khách quan. Repo có sẵn: format,
lint, typecheck, test, build, budget, e2e. Bài tập qua được là xong — không cần
ai xác nhận, và cũng không tự nhận là xong khi chưa qua.

**Quy tắc 4 — Bài tập commit trên branch `learning/*`.**
Không đụng `master`, không đụng các branch `phase-*`. Giữ được dấu vết đã viết
gì, và xoá sạch được khi muốn làm lại từ đầu.

**Quy tắc 5 — Ba dòng mỗi ngày vào `journal.md`.**
Hôm nay cái gì làm tôi bất ngờ; cái gì tôi vẫn chưa hiểu. Phần "chưa hiểu" là
chỗ cần đào sâu thêm tài liệu — nó chỉ ra bài nào viết còn mỏng.

## 4. Bốn mốc năng lực — thước đo thật

- [ ] **Mốc 1.** Thêm một trang read-only mới, hiện dữ liệu có thật từ API.
- [ ] **Mốc 2.** Thêm một lời gọi API mới end-to-end, có test.
- [ ] **Mốc 3.** Thêm một field mới xuyên suốt: contract → API → form → danh
      sách → test.
- [ ] **Mốc 4.** Ship một feature nhỏ trên branch, qua toàn bộ `npm run verify`.

**Qua mốc 3 là đủ tự tin nhận việc Angular thật.** Mốc 4 là làm được trong một
team có CI. Nếu chỉ học được cuối tuần: dừng ở mốc 3 rồi đi làm thật — chặng 4
học trong công việc hiệu quả hơn học trước.

## 5. Lộ trình: 25 bài học + 11 brief

### Chặng 0 — Định hướng (nửa ngày)

| #   | Bài                               | Trả lời được                                                                                            |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 00  | Angular dưới mắt backend engineer | Vì sao không còn request → response → view; cây component là runtime; dev-server/build/SSR là gì; và §9 |
| 01  | Từ URL tới pixel trong repo này   | Một sequence diagram xuyên suốt: bootstrap → router → shell → page → store → HTTP → mock API → quay lại |

### Chặng 1 — Viết được UI (tuần 1)

| #   | Bài                           | Trả lời được                                                                                                  |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 02  | Component & template          | standalone, binding, `@if/@for/@switch/@defer`, khi nào tách component                                        |
| 03  | Signals & zoneless            | `signal/computed/effect`, vì sao `effect` là lựa chọn cuối, Angular biết vẽ lại nhờ đâu khi không còn zone.js |
| 04  | Component nói chuyện với nhau | `input()`, `input.required()`, `output()`, content projection, page thông minh vs component ngờ nghệch        |
| 05  | DI, config & feature flag     | `inject()`, provider, `InjectionToken`, scope; config build-time vs runtime                                   |
| 06  | CSS trong Angular             | view encapsulation, semantic token, theming sáng/tối, vì sao `margin-left` bị lint chặn                       |

→ **Mốc 1**

### Chặng 2 — Nói chuyện với server (tuần 2)

| #   | Bài                        | Trả lời được                                                                             |
| --- | -------------------------- | ---------------------------------------------------------------------------------------- |
| 07  | RxJS tối thiểu             | Observable vs Promise vs signal; đúng 6 operator cần dùng; vì sao HTTP vẫn là Observable |
| 08  | HttpClient + contract Zod  | DTO có type thật, branded type, validate ở biên, một schema cho cả app và server         |
| 09  | Interceptor                | chuỗi 5 cái trong repo, vì sao thứ tự quan trọng, chỗ khác servlet filter                |
| 10  | Lỗi                        | taxonomy, mapper, global handler, vì sao người dùng không bao giờ thấy lỗi thô           |
| 11  | Server state ◆             | store, `RemoteData` 5 nhánh, vì sao "rỗng" không phải một state                          |
| 12  | Cache, huỷ request, race ◆ | `switchMap`, key theo tiêu chí truy vấn, LRU, xoá cache sau khi ghi                      |

→ **Mốc 2**

### Chặng 3 — Form & routing: 80% việc thật (tuần 3)

| #   | Bài                     | Trả lời được                                                                         |
| --- | ----------------------- | ------------------------------------------------------------------------------------ |
| 13  | Reactive form có type ◆ | form model, giá trị vs trạng thái, pristine/dirty/pending                            |
| 14  | Validation              | sync, cross-field, async (email trùng), message sinh từ lý do máy đọc được           |
| 15  | Router                  | route tree, lazy `loadChildren` theo feature, title là key dịch, breadcrumb          |
| 16  | Guard                   | 4 loại trong repo, `CanDeactivate` khi người dùng bỏ đi giữa lúc sửa                 |
| 17  | URL là state            | filter/sort/page trong query param, debounce đặt cạnh bàn phím chứ không trong store |
| 18  | Ghi dữ liệu an toàn ◆   | PATCH diff, version, 409, `baseline` vs `latest`, bulk báo theo từng item            |

→ **Mốc 3**

### Chặng 4 — Làm việc như trong team enterprise (tuần 4–5)

| #   | Bài                        | Trả lời được                                                                                              |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| 19  | Auth ◆                     | session cookie HttpOnly, refresh single-flight, hết hạn giữa lúc đang làm                                 |
| 20  | Phân quyền nhiều lớp       | guard + directive + API tự kiểm tra; vì sao frontend không phải biên bảo mật                              |
| 21  | i18n như một quy tắc build | không string cứng, `Intl`, plural                                                                         |
| 22  | Accessibility              | focus, dùng được bằng bàn phím, axe                                                                       |
| 23  | Test                       | cái gì test ở đâu, component test với Vitest, `RouterTestingHarness`, `HttpTestingController`, Playwright |
| 24  | Biên kiến trúc & CI        | lint architecture, bundle budget, `npm run verify`                                                        |

→ **Mốc 4**

### Chặng 5 — Brief tra cứu (đọc khi gặp việc, không theo thứ tự)

SSE realtime ◆ · đa tab & leader election ◆ · upload và kiểm tra file ◆ ·
import CSV hai pha ◆ · offline & service worker ◆ · render mode & hydration ·
performance và bundle budget · browser API & Web Worker · observability (log,
correlation id, redaction) · mock backend & fault injection · notification &
confirmation dialog

◆ = bài có máy trạng thái thật, nên có State Machine Diagram. Chín bài. Các bài
còn lại không vẽ, vì vẽ ra sẽ là sơ đồ rỗng.

## 6. Nhịp

Với 1,5–2h/ngày: tuần 1 chặng 0+1 · tuần 2 chặng 2 · tuần 3 chặng 3 ·
tuần 4–5 chặng 4 · chặng 5 rải rác sau đó. **Sáu tuần tới mốc 4.**

Chỉ học cuối tuần: khoảng ba tháng tới mốc 3 — xem lại §4 về việc nên dừng ở đâu.

**Đầu mỗi chặng, 10 phút viết lại từ giấy trắng** một thứ của chặng trước, không
nhìn tài liệu: một component có input/output, một interceptor, một form control.
Đây là chỗ phát hiện mình "hiểu khi đọc" nhưng chưa "viết được" — hai việc khác
nhau, và chỉ việc thứ hai được trả lương.

## 7. Khuôn mỗi bài — 10 mục

0. **Từ vựng**: mọi thuật ngữ và cú pháp Angular mới của bài, giải thích trước
   khi dùng
1. Sau bài này bạn làm được gì
2. Dịch từ backend sang Angular — **và chỗ phép so sánh sai**
3. Cơ chế: Angular làm việc đó ra sao
4. Trong repo này: **bản rút gọn trước, bản thật sau**; file nào, đọc từng dòng
   (trích tên hàm, không trích số dòng — số dòng lệch ngay khi code đổi)
5. Sơ đồ: Sequence luôn có; Component/Class/Call graph khi có cấu trúc để vẽ;
   State Machine chỉ ở bài ◆
6. Đánh đổi & phương án bị loại (rút từ ADR)
7. Làm kiểu ngây thơ thì vỡ thế nào
8. Test ở đâu, khẳng định điều gì
9. **Sơ đồ tổng hợp**: một hình nối lại mọi thành phần vừa học, đặt ngay trước
   bài tập — để thứ rời rạc trong bài khép lại thành một hình nhớ được
10. Bài tập
11. Tự kiểm tra: 5–8 câu, đáp án gập lại

Mỗi bài có một nhãn ở đầu: **chuyển được sang dự án thật** hay **chỉ hợp trong
repo học này** — căn cứ `docs/enterprise-review.md` §1.5.

Thiếu mục nào trong một bài thì đó là lỗi của bài đó, không phải của bạn.

### Chuẩn độ sâu

Bản đầu của bài 00 và 01 bị trả lại vì **quá nông**: nó nhắc tên `signal`,
`inject()`, `Observable`, `switchMap` rồi đi tiếp, trong khi người đọc chưa từng
viết một dòng Angular nào. Giải thích "vì sao chọn thế này" là vô nghĩa khi người
đọc còn chưa đọc nổi "thế này" là gì. Bốn luật rút ra, áp cho cả 36 file:

1. **Không hoãn.** Khái niệm hay cú pháp nào xuất hiện lần đầu thì giải thích
   ngay tại chỗ. Hoãn sang bài sau nghĩa là đoạn code bên dưới không đọc được.
2. **Đọc từng dòng, không tóm tắt.** Một đoạn code mẫu đi kèm bảng hoặc danh
   sách giải nghĩa từng dòng đáng chú ý, chứ không phải một câu tổng kết.
3. **Rút gọn trước, thật sau.** Đưa bản nhỏ nhất của một ý trước — `HealthApi`
   16 dòng trước `CustomerApi` 200 dòng — rồi nói bản thật thêm gì và vì sao.
4. **Dài không phải là lỗi.** Lỗi là phải tra chỗ khác mới đọc tiếp được.

## 8. Vì sao thứ tự này, không theo thứ tự phase

**Repo này là bài giải mẫu, không phải giáo trình.** Nó đang ở phase 8: SSE,
leader election, service worker, bundle budget. Không ai cần những thứ đó để tự
tin code Angular. Cần trước là component, signal, DI, form, router, HttpClient.

Hệ quả: 11 kỹ thuật nâng cao bị đẩy xuống chặng 5 dạng tra cứu, và 23 file trong
`docs/` bị đọc theo thứ tự khác với thứ tự chúng được viết ra.

**Khoảng trống lớn nhất không nằm trong `docs/`.** Tài liệu của repo đều giả định
người đọc đã biết Angular — chúng giải thích _vì sao chọn thế này_, không giải
thích _Angular hoạt động ra sao_. Signals, zoneless change detection, DI,
template syntax, RxJS tối thiểu: không có trong repo, được viết riêng cho bộ bài
học này. Đó cũng là phần cần kiểm chứng kỹ nhất, vì nó không có nguồn trong repo
để đối chiếu.

## 9. Những gì internet sẽ trả về sai

Angular 22 mới hơn phần lớn tutorial đang nằm trên mạng. Gặp những thứ này trong
kết quả tìm kiếm thì đang đọc tài liệu của thời khác:

| Thấy cái này                                             | Thực tế trong repo                        |
| -------------------------------------------------------- | ----------------------------------------- |
| `NgModule`, `@NgModule`, `declarations`                  | standalone component, không có module     |
| `*ngIf`, `*ngFor`, `ng-template` cho điều kiện           | `@if`, `@for`, `@switch`                  |
| `constructor(private http: HttpClient)`                  | `inject(HttpClient)`                      |
| `zone.js`, `NgZone`, `ChangeDetectorRef.detectChanges()` | zoneless; signal quyết định việc vẽ lại   |
| `BehaviorSubject` làm state cho component                | `signal()` / `computed()`                 |
| `@Input()` / `@Output()` dạng decorator                  | `input()`, `input.required()`, `output()` |
| `ngOnChanges` để phản ứng với input đổi                  | `computed()` trên input signal            |
| `TestBed` + Karma + Jasmine                              | Vitest qua `@angular/build:unit-test`     |

Nguồn đáng tin: `angular.dev`, và chính code trong repo này. Phiên bản khoá trong
`package.json` — Angular 22, TypeScript 6.0, Vitest 4 — và **TypeScript 7 cùng
Vitest 5 đều không tương thích**, đừng nâng.

## 10. Những gì repo này không dùng

Để khỏi đi tìm thứ không có: không NgRx và không thư viện signal-store nào (store
viết tay, có chủ ý — bài 11 nói vì sao); không `resource()` / `httpResource`;
virtual scroll chỉ có trong lab chứ không có trong danh sách khách hàng thật;
không micro-frontend, không Nx; RTL ở trạng thái sẵn sàng nhưng chưa bật ngôn ngữ
nào.

## 11. Bốn cách người tự học tự lừa mình

1. **Đọc thay cho viết.** Đọc hiểu được 90%, viết lại được 20%. Chỉ con số thứ
   hai đi làm được. Phòng bằng quy tắc 1 và bài tập 10 phút giấy trắng ở §6.
2. **Chép pattern nâng cao quá sớm.** Repo này có những thứ một dev Angular mới
   không nên bắt chước; nhãn ở đầu mỗi bài nói rõ cái nào. Viết store tay khi
   chưa hiểu signal là tự tạo ra bug mình không đọc nổi.
3. **Sửa tutorial cho chạy được rồi coi là hiểu.** Chạy được không phải hiểu.
   Phép thử: xoá đi viết lại từ đầu, không nhìn.
4. **Học theo chiều rộng vì nó dễ chịu hơn.** Đọc brief chặng 5 nhẹ đầu hơn làm
   mốc 3. Mốc mới là cái tính.

## 12. Nhật ký và cách đo tiến độ

`journal.md` cạnh file này: ba dòng mỗi ngày (quy tắc 5). Checkbox ở §4 là thước
đo duy nhất — không phải số bài đã đọc, không phải số ngày đã học.

Mỗi lần qua một mốc: ghi ngày vào §4, và commit. Dấu vết đó về sau trả lời được
câu "tôi học Angular bao lâu rồi" bằng bằng chứng thay vì cảm giác.

## 13. Tài liệu này không phải thẩm quyền

Thứ tự thẩm quyền của repo không đổi: `ANGULAR_PROJECT_CONTEXT.md` →
`ANGULAR_PROJECT_CONTEXT.md` §5 → `docs/PROGRESS.md` → `docs/decisions/` →
`CLAUDE.md`. File này và bộ bài học là **tài liệu học**: khi nó nói khác code
hoặc khác `docs/`, code và `docs/` đúng, còn bài học thì sai và cần sửa.

Mọi "sự thật" về kiến trúc đều link về `docs/` và ADR chứ không chép lại, vì bản
sao thứ hai của một tài liệu luôn lệch khỏi bản thứ nhất.

## 14. Cập nhật file này khi nào

- Qua một mốc: tick §4, ghi ngày.
- `journal.md` lặp lại một câu hỏi ba lần: bài tương ứng viết còn mỏng, ghi vào
  đây để sửa bài đó.
- Đổi nhịp học: sửa §6 cho khớp thực tế, đừng để một kế hoạch sai nằm đó.
- Repo thêm phase mới: chặng 5 có thêm brief; §5 cập nhật.

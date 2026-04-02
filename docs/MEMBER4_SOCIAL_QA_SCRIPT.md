# Member 4 Social Features - Script Thuyet Trinh Kieu Van Dap

## 1. Chuan bi demo

- Tai khoan nen dung de demo: `user1@example.com` / `user123`
- Khong nen dang nhap bang `user5@example.com` vi account nay dang duoc seed voi `is_active = false`
- Thu tu demo an toan va de noi nhat:
  1. `Friends`
  2. `Messages`
  3. `Achievements`
- Neu can reset lai du lieu sau khi demo, chay:
  - `npx knex migrate:latest`
  - `npx knex seed:run`

## 2. Tinh trang seed truoc khi demo

Ban co the mo dau bang doan sau:

> Thua thay, phan em phu trach la social features cua he thong, gom Friends, Messages, Achievements va phan seed data de tao san du lieu demo. Em thiet ke de sau khi chay seed, he thong co san quan he ban be, loi moi ket ban, tin nhan va tien do achievement, nhung van dam bao du lieu nay co tinh xac dinh de moi lan demo se ra ket qua giong nhau.

Nhung du lieu duoc seed san cho toan he thong:

- 6 users
- 6 profiles
- 3 friendships
- 3 pending friend requests
- 10 messages
- 4 achievements
- 24 `user_achievements` rows, vi moi user co 4 achievement

Trang thai seed cua `user1` rat phu hop de demo:

- Da la ban voi `user2` va `user3`
- Da gui 1 loi moi ket ban den `user4`
- Dang nhan 1 loi moi ket ban tu `user5`
- Da co 2 conversation la `user2` va `user3`
- Da gui 4 tin nhan
- Da mo khoa 3/4 achievements, con thieu `SOCIAL_BUTTERFLY`

Ban co the noi them:

> Cach em seed nhu vay la co y. Em muon khi dang nhap bang user1, giang vien thay ngay duoc du lieu that de demo: co friend list, co incoming va outgoing request, co conversation san, va co mot achievement chua mo khoa de em co the mo khoa truc tiep trong luc thuyet trinh.

## 3. Script demo chi tiet theo kieu van dap

## 3.1. Gioi thieu tong quan

Ban noi:

> Trong social slice, em tach thanh 4 phan. Thu nhat la Friends de quan ly quan he giua nguoi choi. Thu hai la Messages de gui tin nhan khong realtime giua nhung nguoi da la ban. Thu ba la Achievements de theo doi tien do social. Thu tu la Seed data de tao san bo du lieu minh hoa, giup demo khong bi trang.

Neu thay hoi "tai sao em tach thanh 4 phan nay?" thi tra loi:

> Vi day la 4 lop tra loi cho 4 nhu cau khac nhau. Friends quan ly quan he. Messages dua tren quan he do. Achievements tong hop lai thanh ket qua gamification. Seed data giup tai hien duoc toan bo he thong do ngay sau khi khoi tao database.

## 3.2. Friends

Ban mo trang `Friends` va noi:

> Dau tien la Friends page. O day em chia thanh 3 khu vuc: search de tim nguoi choi, danh sach ban be hien tai co phan trang, va khu vuc request gom incoming va outgoing.

### 3.2.1. Search user va gui loi moi

Ban thao tac:

1. Tim `admin1` trong o search
2. Bam `Send Request`

Ban noi:

> Phan search nay khong chi tim theo username, ma con tim theo email, display name, location va favorite game. Nhu vay nguoi dung co nhieu cach de tim nhau hon.

Neu thay hoi "search duoc thuc hien nhu the nao?" thi tra loi:

> Backend join bang `users` voi `profiles`, sau do filter theo nhieu truong bang `ILIKE`. Dong thoi em loai tru current user ra khoi ket qua de nguoi dung khong the tu ket ban voi chinh minh.

Neu thay hoi "he thong chan loi moi trung lap nhu the nao?" thi tra loi:

> Khi gui request, service kiem tra 4 truong hop: thieu receiver, gui cho chinh minh, da ton tai friendship, hoac da ton tai pending request hai chieu. Neu co roi thi tra ve loi nghiep vu thay vi tao ban ghi moi.

### 3.2.2. Giai thich incoming va outgoing

Ban cuon xuong khu vuc Requests va noi:

> O day em tach ro incoming va outgoing. Incoming la nguoi khac gui cho minh, con outgoing la minh gui cho nguoi khac va dang cho phan hoi.

Ban co the chi vao du lieu seed va noi:

> Voi user1, du lieu seed ban dau co 1 outgoing request toi user4 va 1 incoming request tu user5. Nhu vay em co san ca 2 tinh huong de demo.

### 3.2.3. Chap nhan loi moi ket ban

Ban thao tac:

1. Tai incoming request cua `user5`, bam `Accept`

Ban noi:

> Khi chap nhan request, he thong khong chi doi status cua request sang `accepted`, ma con tao ban ghi moi trong bang `friendships`. Sau do danh sach friends duoc refresh ngay, nen tren giao dien minh se thay tong so ban tang len.

Neu thay hoi "tai sao can 2 bang `friend_requests` va `friendships`?" thi tra loi:

> Em tach 2 bang vi y nghia nghiep vu khac nhau. `friend_requests` luu qua trinh cho, chap nhan, tu choi, huy. `friendships` chi luu quan he da duoc xac nhan. Neu gom chung 1 bang thi viec query va quan ly trang thai se roi hon.

Neu thay hoi "lam sao tranh trung lap friendship A-B va B-A?" thi tra loi:

> Em normalize cap user bang cach sort 2 ID truoc khi luu. Trong database em dat unique key tren cap `user_one_id`, `user_two_id`, nen du nguoi nao bam truoc thi database van chi co 1 quan he duy nhat.

### 3.2.4. Phan trang danh sach ban be

Ban chi vao khu Current Friends va noi:

> Danh sach friend duoc phan trang. Backend nhan `page` va `pageSize`, sau do tra ve ca `items` va metadata gom `totalItems`, `totalPages`, `page`, `pageSize`. Frontend dung metadata nay de hien nut Previous va Next.

Neu thay hoi "tai sao phai phan trang du lieu nho nhu nay?" thi tra loi:

> Vi em muon thiet ke dung cach lam cho du lieu lon. Hien tai seed it du lieu de demo, nhung neu he thong co nhieu ban be va nhieu tin nhan thi phan trang giup response nhe hon va UI on dinh hon.

### 3.2.5. Chot Friends

Ban noi:

> Tom lai, phan Friends cua em ho tro tim nguoi choi, gui loi moi, nhan va xu ly request, tao friendship sau khi accept, va hien thi danh sach ban be co phan trang. Toan bo route nay deu la route bao ve, nguoi dung phai dang nhap moi truy cap duoc.

## 3.3. Messages

Ban mo trang `Messages` va noi:

> Sau khi co quan he ban be, nguoi dung co the nhan tin. Em co y lam messaging theo kieu non-realtime, tuc la khong dung WebSocket. He thong lay du lieu qua REST API, phu hop voi muc tieu mon hoc va de on dinh khi demo.

### 3.3.1. Conversation list

Ban noi khi mo trang:

> Cot ben trai la danh sach conversation. Em khong tao bang `conversations` rieng, ma gom nhom truc tiep tu bang `messages`. Voi moi doi tac, he thong lay tin nhan moi nhat lam `lastMessage`, `lastMessageAt`, dong thoi dem so tin chua doc thanh `unreadCount`.

Neu thay hoi "tai sao khong tao bang conversation rieng?" thi tra loi:

> Vi scope bai nay chua can toi muc do phuc tap do. Em dang co 1-1 messaging, nen co the suy ra conversation tu cap sender-recipient. Cach nay don gian schema va van du de demo nghiep vu.

### 3.3.2. Chi nhan tin voi nguoi da la ban

Ban noi:

> Mot rang buoc quan trong la chi nhan tin voi nguoi da la ban. Neu chua co friendship thi backend se chan.

Neu thay hoi "rang buoc nay nam o dau?" thi tra loi:

> No nam trong message service. Truoc khi lay message hoac gui message, service goi ham kiem tra friendship. Neu khong co quan he thi tra ve loi `403`.

### 3.3.3. Demo doc conversation cu va danh dau da doc

Ban thao tac:

1. Mo conversation voi `user2`

Ban noi:

> Khi em mo 1 conversation, backend khong chi tra ve lich su tin nhan theo phan trang, ma con cap nhat cac tin nhan chua doc tu doi phuong thanh da doc bang cach set `read_at`.

Neu thay hoi "lam sao biet tin nao la cua minh?" thi tra loi:

> Backend tra ve truong `isMine`, frontend dua vao do de can le bong chat sang 2 ben.

### 3.3.4. Demo mo chat moi voi friend vua ket ban

Neu ban da accept `user5` o trang Friends, day la doan demo dep nhat:

1. Trong dropdown `Select a friend`, chon `user5`
2. Bam `Open Chat`
3. Gui 1 tin nhan bat ky, vi du: `Chao ban, minh vua tao conversation moi de demo social features.`

Ban noi:

> O day em dang demo truong hop conversation moi. `user5` vua tro thanh friend sau thao tac accept request o trang truoc, nen bay gio em mo chat va gui tin nhan dau tien. He thong se insert them 1 dong vao bang `messages`, cap nhat danh sach conversation, va dong thoi sync achievement.

Neu thay hoi "co gioi han noi dung tin nhan khong?" thi tra loi:

> Co. Backend trim noi dung, bat buoc khong rong, va gioi han toi da 1000 ky tu. Dong thoi nguoi dung khong duoc nhan tin cho chinh minh.

### 3.3.5. Phan trang messages

Ban noi:

> Lich su tin nhan cung duoc phan trang. Backend query theo cap hai nguoi dung, sap xep giam dan theo thoi gian de lay nhanh trang can xem, sau do frontend dao nguoc lai de hien thi tu cu den moi trong khung chat.

Neu thay hoi "tai sao query desc roi moi reverse?" thi tra loi:

> Query desc de ket hop tot voi pagination trong database. Sau khi lay xong 1 page, em reverse o frontend response de nguoi dung doc theo thu tu tu nhien hon trong khung chat.

### 3.3.6. Chot Messages

Ban noi:

> Tom lai, Messages cua em la messaging 1-1, non-realtime, chi cho phep giua friends, co unread count, co danh dau da doc, co conversation list, va co phan trang cho ca conversation va message thread.

## 3.4. Achievements

Ban mo trang `Achievements` va noi:

> Sau cung la Achievements. Em khong lam achievement theo kieu hard-code tren frontend, ma tach thanh catalog trong database va bang tien do theo tung user. Nhu vay giao dien chi can render theo du lieu tra ve tu backend.

### 3.4.1. Giai thich 4 achievement hien co

Ban noi:

> Hien tai em seed 4 social achievements:
> `SOCIAL_SPARK` cho lan gui loi moi ket ban dau tien.
> `FIRST_PING` cho tin nhan dau tien.
> `TRUST_CIRCLE` khi dat 2 friendships.
> `SOCIAL_BUTTERFLY` khi co 3 conversation rieng biet.

Neu thay hoi "achievement do dua tren cai gi?" thi tra loi:

> Moi achievement co `metric_key` va `goal_value`. Backend tinh metric thuc te cua user, vi du `friends_count`, `friend_requests_sent`, `messages_sent`, `conversations_count`, roi doi chieu voi `goal_value` de cap nhat progress va trang thai mo khoa.

### 3.4.2. Demo mo khoa achievement truc tiep

Neu ban vua accept `user5` va gui tin nhan dau tien cho `user5`, luc nay ban co the noi:

> Luc dau user1 moi co 2 conversation, nen achievement `SOCIAL_BUTTERFLY` chua mo khoa. Sau khi em tao them conversation voi user5, so conversation tang len 3. Bay gio khi vao Achievements, he thong se sync lai va achievement nay duoc mo khoa.

Ban chi vao giao dien va noi:

> O moi the achievement, em hien progress bar, gia tri hien tai tren muc tieu, va summary phia tren gom tong so achievement, so da mo khoa, so chua mo khoa, va completion percent.

### 3.4.3. Co che sync achievement

Neu thay hoi "khi nao achievement cap nhat?" thi tra loi:

> Achievement duoc sync o 2 thoi diem. Mot la ngay sau cac thao tac social nhu gui request, accept request, remove friend, gui tin nhan. Hai la khi nguoi dung vao route `/api/achievements/me`, backend sync lai 1 lan nua truoc khi tra du lieu. Cach nay giup du lieu luon moi ma van giu duoc logic o server.

Neu thay hoi "tai sao remove friend ma achievement van co the giu nguyen?" thi tra loi:

> Day la chu dich thiet ke. Khi da mo khoa roi thi em giu `unlocked_at`, nghia la achievement la lich su da dat duoc, khong bi thu hoi. Tuy nhien progress hien tai van duoc cap nhat de phan anh trang thai thuc te.

### 3.4.4. Chot Achievements

Ban noi:

> Em muon achievement dong vai tro gamification nhe. No khuyen khich nguoi dung tuong tac voi he thong social, nhung logic tinh toan van nam o backend de tranh viec frontend tu y thay doi ket qua.

## 3.5. Seed data

Day la phan rat de bi hoi, ban nen noi ro:

> Ve seed data, em khong chi seed user va game, ma con seed luon social graph. Trong file seed social, em xoa du lieu cu roi insert friendships, friend requests va messages theo kich ban co dinh. Sau do file seed achievement moi duyet qua tung user, tinh metric thuc te va tao `user_achievements`. Nhu vay achievement khong phai duoc gan tay, ma duoc sinh ra tu du lieu nghiep vu.

Neu thay hoi "vi sao phai seed theo thu tu?" thi tra loi:

> Vi achievement phu thuoc vao friendship, request va message. Nen em phai seed social graph truoc, roi moi seed achievements. Neu dao thu tu thi progress se sai hoac bang 0.

Neu thay hoi "seed data nay giup gi cho demo?" thi tra loi:

> Seed data giup em demo ngay lap tuc sau `seed:run`, khong can tao tay tung moi quan he hay tung tin nhan. Ngoai ra vi du lieu co tinh xac dinh, nen moi lan demo se ra cung mot bo so lieu, de doi chieu va cham bai de hon.

## 4. Cau hoi phan bien ngan va cau tra loi mau

### Cau hoi 1

> Tai sao khong cho nguoi la nhan tin truc tiep?

Tra loi:

> Em gioi han nhu vay de dam bao social graph co su cho phep hai chieu toi thieu. Ve nghiep vu, nhan tin voi friend giup tranh spam va phu hop voi mo hinh cong dong nho cua nen tang nay.

### Cau hoi 2

> Tai sao message khong realtime?

Tra loi:

> Muc tieu bai nay la thiet ke luong CRUD, auth, validation, pagination va state management on dinh. Realtime se keo them WebSocket, event sync va phuc tap hon rat nhieu. O day em chu dong chon asynchronous messaging de vua du nghiep vu vua hop scope mon hoc.

### Cau hoi 3

> Tai sao achievement khong tinh o frontend?

Tra loi:

> Neu tinh o frontend thi ket qua co the bi sai hoac bi gian lan. Em de backend tinh metric va luu `user_achievements`, frontend chi hien thi. Nhu vay mot logic dung cho moi client va dam bao tinh nhat quan.

### Cau hoi 4

> Tai sao can bang `user_achievements`, sao khong moi lan vao trang moi dem lai?

Tra loi:

> Em van co sync lai khi can, nhung bang `user_achievements` giup luu lai tien do va thoi diem mo khoa. Dieu nay quan trong neu sau nay muon hien lich su nhan badge, thong bao, hoac thong ke qua thoi gian.

### Cau hoi 5

> He thong tranh duplicate friendship nhu the nao?

Tra loi:

> Em vua chan o tang service bang normalize pair, vua chan o tang database bang unique key tren cap user. Nghia la co ca business validation lan database constraint.

### Cau hoi 6

> Em da dung transaction o dau va vi sao?

Tra loi:

> Em dung transaction cho cac thao tac co nhieu buoc lien quan, vi du gui friend request, chap nhan request, xoa request va gui message. Nhung thao tac nay can insert hoac update nhieu bang roi moi sync achievement, nen transaction giup du lieu khong bi nua chung.

### Cau hoi 7

> Vi sao user1 la account demo tot nhat?

Tra loi:

> Vi user1 da co du lieu trung gian rat dep de demo: co friend san, co request incoming va outgoing, co conversation san, da mo khoa 3/4 achievements, va co the mo khoa achievement cuoi ngay trong luc demo bang 2 thao tac nho.

## 5. Loi ket 20-30 giay

Ban co the ket bang doan sau:

> Tong ket lai, phan em phu trach khong chi la hien thi giao dien social, ma la mot chuoi logic lien ket tu database, seed data, API, business validation den frontend. Friends tao ra quan he, Messages su dung quan he do de giao tiep, Achievements tong hop thanh ket qua gamification, va Seed data dam bao tat ca co the demo duoc ngay lap tuc va lap lai on dinh.

## 6. Moc code nen doc lai truoc buoi bao ve

Neu truoc khi vao phong ban muon doc nhanh lai code, hay xem cac file nay:

- `src/services/friendService.js`
- `src/services/messageService.js`
- `src/services/achievementService.js`
- `src/services/userSearchService.js`
- `src/db/seeds/04_social_graph.js`
- `src/db/seeds/05_achievements.js`
- `src/db/migrations/20260327100000_create_friend_requests_table.js`
- `src/db/migrations/20260327100001_create_friendships_table.js`
- `src/db/migrations/20260327100002_create_messages_table.js`
- `src/db/migrations/20260327100003_create_achievements_table.js`
- `src/db/migrations/20260327100004_create_user_achievements_table.js`
- `frontend/src/pages/client/FriendsPage.jsx`
- `frontend/src/pages/client/MessagesPage.jsx`
- `frontend/src/pages/client/AchievementsPage.jsx`

## 7. Ban tom tat rat ngan neu thay hoi gap

Neu can tra loi trong 20 giay, ban co the noi:

> Em phu trach social slice gom Friends, Messages, Achievements va social seed data. Em tach request va friendship thanh 2 bang rieng, chi cho nhan tin giua friends, co phan trang cho danh sach va tin nhan, va achievement duoc backend tinh tu metric social thuc te. Seed data duoc lam co tinh xac dinh de user1 co san du lieu demo va co the mo khoa achievement cuoi ngay khi thuyet trinh.

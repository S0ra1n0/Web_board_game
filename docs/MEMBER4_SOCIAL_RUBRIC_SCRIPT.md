# Member 4 Social Features - Script Theo Rubric Toan He Thong

## 1. Muc tieu cua script nay

Script nay duoc viet theo cach trinh bay "theo rubric", tuc la khong chi mo ta Friends, Messages, Achievements, Seed data dang lam gi, ma con chi ro cac phan nay dong gop vao tieu chi cham diem nao cua toan he thong.

Neu muon noi 1 cau mo dau gon, ban co the noi:

> Phan em phu trach la social slice cua he thong, gom Friends, Messages, Achievements va social seed data. Em se trinh bay theo rubric toan he thong, nghia la voi moi chuc nang em se chi ro giao dien, API, database, du lieu seed va ly do no dap ung tieu chi cham diem.

## 2. Cac muc rubric ma social slice dong gop truc tiep

Ban nen noi ro ngay tu dau:

> Trong rubric toan he thong, phan social cua em dong gop truc tiep vao 5 nhom tieu chi.

### 2.1. General Data and Delivery

- He thong co it nhat 5 users voi du lieu co y nghia
- Co seed data demo-ready
- Backend tach rieng frontend va expose RESTful APIs
- Backend dung Express
- Frontend la React SPA

### 2.2. User Features

- User search exists
- Friend management exists
- Messaging exists without requiring real-time transport
- Achievements exist
- Friends list has pagination
- Messages have pagination

### 2.3. Backend Quality

- Knex is used
- MVC structure is clear and defensible
- Route protection exists

### 2.4. Seeded Demo Scenarios

- Seeded users have friend relationships
- Seeded users have pending friend requests
- Seeded users have messages
- Seeded users have achievements
- Seeded users have profile data

### 2.5. Final Demo Flow

- User can log in and navigate the client app
- User can search another user
- User can send a friend request
- User can send a message

## 3. Tai khoan va du lieu nen dung khi demo

- Tai khoan nen dung: `user1@example.com` / `user123`
- Khong nen dung `user5@example.com` vi user nay duoc seed voi `is_active = false`

Ban co the noi:

> Em chon user1 de demo vi day la tai khoan co du lieu seed dep nhat cho social. User1 da co ban san, co incoming request, co outgoing request, co conversation san, va dang o trang thai rat hop ly de em mo khoa them achievement ngay trong buoi demo.

Trang thai seed cua `user1`:

- Da la ban voi `user2`
- Da la ban voi `user3`
- Da gui request toi `user4`
- Dang nhan request tu `user5`
- Da co 2 conversation
- Da gui 4 messages
- Da mo khoa 3/4 achievements

## 4. Mo dau theo goc nhin he thong

Ban co the noi:

> Neu nhin theo kien truc he thong, phan social cua em duoc tach thanh day du cac lop. O frontend em co page, component va service rieng cho Friends, Messages, Achievements. O backend em tach route, controller, service theo MVC. O database em tach bang cho request, friendship, message, achievement va user_achievement. Cuoi cung, seed data duoc tao co chu dich de ngay sau khi chay seed, giang vien co the demo duoc het luong social ma khong can tu tao du lieu tay.

Neu thay hoi "vi sao day la MVC ro rang?" thi tra loi:

> Vi route chi dinh nghia endpoint, controller xu ly request-response, con service moi chua business logic. Vi du friend logic nam trong `friendService`, message logic nam trong `messageService`, achievement logic nam trong `achievementService`.

## 5. Friends theo rubric

### 5.1. Rubric ma Friends dap ung

Ban noi:

> Dau tien la Friends. Module nay dap ung truc tiep cac muc `User search exists`, `Friend management exists`, `Friends list has pagination`, dong thoi ho tro `Final Demo Flow` la user co the search nguoi khac va gui friend request.

### 5.2. Trinh bay giao dien

Khi mo trang `Friends`, ban noi:

> Trang Friends duoc chia thanh 3 khu vuc. Khu vuc thu nhat la search user. Khu vuc thu hai la danh sach ban be hien tai co phan trang. Khu vuc thu ba la request management, tach incoming va outgoing.

### 5.3. Trinh bay user search

Ban thao tac:

1. Tim `admin1`
2. Bam `Send Request`

Ban noi:

> Search nay khong chi tim theo username, ma con tim theo email, display name, location va favorite game. Nhu vay user search khong bi gioi han vao 1 truong duy nhat, nen dap ung tot hon muc user feature trong rubric.

Neu thay hoi "lam sao chung minh search ton tai o muc he thong?" thi tra loi:

> Frontend co form tim kiem, backend co route REST rieng, va service search join bang `users` voi `profiles` de tra ket qua co nghia. Day khong phai tim kiem gia lap tren UI, ma la luong day du tu database len giao dien.

### 5.4. Trinh bay friend request flow

Ban chi vao khu `Incoming` va `Outgoing` va noi:

> Em tach friend request thanh 2 huong. Incoming la loi moi nguoi khac gui cho minh. Outgoing la loi moi minh gui cho nguoi khac va dang pending. Cach tach nay giup UX ro rang hon va cung phan anh dung model du lieu trong database.

Ban thao tac:

1. Accept request cua `user5`

Ban noi:

> Khi em accept, backend update request sang `accepted`, dong thoi tao 1 friendship moi. Nghia la 1 thao tac tren giao dien se dong bo 2 lop nghiep vu: request lifecycle va friend relationship.

Neu thay hoi "vi sao khong dung chung 1 bang?" thi tra loi:

> Vi `friend_requests` luu qua trinh pending, accepted, rejected, cancelled. Con `friendships` chi luu ket qua sau khi duoc xac nhan. Tach nhu vay query de hon, validation ro hon, va phu hop hon voi mo hinh nghiep vu.

### 5.5. Validation va rang buoc

Ban noi:

> Friends khong chi la CRUD don thuan. Em co validation nghiep vu nhu sau: khong duoc gui request cho chinh minh, khong duoc gui neu da la ban, khong duoc tao request pending trung lap hai chieu, va khi luu friendship thi em normalize cap user de tranh trung lap A-B va B-A.

Neu thay hoi "do la validation o frontend hay backend?" thi tra loi:

> Validation chinh nam o backend service. Frontend chi goi API. Cach nay chat che hon vi du request co den tu bat ky client nao thi business rule van duoc giu nguyen.

### 5.6. Pagination

Ban chi vao nut `Previous` va `Next` o friend list:

> Day la tieu chi `Friends list has pagination`. Backend nhan `page` va `pageSize`, tra ve `items` cung metadata pagination. Frontend dung metadata do de dieu huong trang hien tai.

Neu thay hoi "tai sao du lieu it van phai phan trang?" thi tra loi:

> Vi rubric yeu cau ro phan trang, va ve mat he thong day la cach lam dung cho du lieu lon. Seed hien tai it de demo, nhung co che nay san sang cho quy mo lon hon.

### 5.7. Ket Friends bang ngon ngu rubric

Ban ket:

> Nhu vay, Friends khong chi la 1 trang UI, ma la bang chung cho thay he thong dap ung user search, friend management, pagination, route protection, REST API va business validation o backend.

## 6. Messages theo rubric

### 6.1. Rubric ma Messages dap ung

Ban noi:

> Tiep theo la Messages. Module nay dap ung 2 muc rubric rat ro: `Messaging exists without requiring real-time transport` va `Messages have pagination`. Ngoai ra no cung mo rong final demo flow khi user co the gui tin nhan cho nguoi khac.

### 6.2. Trinh bay kien truc nghiep vu

Ban noi:

> Em chu dong thiet ke messaging theo huong non-realtime. Nghia la em khong dung WebSocket, ma su dung REST API de tai conversation list, tai message thread, gui message, va cap nhat trang thai da doc.

Neu thay hoi "tai sao lai chon non-realtime?" thi tra loi:

> Vi rubric chi yeu cau messaging ma khong bat buoc realtime. Em uu tien CRUD, validation, pagination va seed demo on dinh. Nhu vay dung muc tieu mon hoc hon, dong thoi de kiem chung hon.

### 6.3. Conversation list

Khi mo trang `Messages`, ban noi:

> Cot ben trai la conversation list. Backend khong can bang conversation rieng, ma suy ra conversation tu bang `messages`. Voi moi doi tac, he thong lay tin nhan moi nhat, thoi diem moi nhat, va dem so tin chua doc.

Neu thay hoi "conversation list chung minh dieu gi cho rubric?" thi tra loi:

> No chung minh module message khong phai chi co 1 form gui tin nhan, ma da dat muc user feature hoan chinh: co danh sach hoi thoai, co trang thai unread, co lich su chat, co pagination.

### 6.4. Rang buoc chi nhan tin giua friends

Ban noi:

> Rang buoc nghiep vu quan trong nhat o day la chi nhan tin duoc voi nguoi da la ban. Truoc khi mo thread hoac gui tin nhan, backend kiem tra friendship. Neu chua la ban thi tra ve `403`.

Neu thay hoi "tai sao rang buoc nay co y nghia?" thi tra loi:

> Vi no lien ket chat che giua Friends va Messages. Friends la precondition cua Messages. Cach thiet ke nay lam cho social slice co tinh he thong, khong phai cac chuc nang roi rac.

### 6.5. Demo message flow

Ban thao tac:

1. Mo conversation voi `user2` de cho thay tin nhan seed san co
2. Mo chat voi `user5` sau khi da accept request
3. Gui 1 tin nhan moi

Ban noi:

> O day em demo duoc ca 2 tinh huong. Tinh huong thu nhat la doc 1 conversation seed san. Tinh huong thu hai la tao conversation moi sau khi quan he friend duoc xac nhan. Nhung thao tac nay chung minh du lieu seed, luong business, va giao dien dang noi voi nhau dung cach.

### 6.6. Read state va pagination

Ban noi:

> Khi nguoi dung mo conversation, backend danh dau cac tin nhan chua doc tu doi phuong bang `read_at`. Message thread duoc phan trang rieng, conversation list cung duoc phan trang rieng. Day la diem cho thay module message khong chi co chuc nang gui, ma con co quan ly trang thai va quy mo du lieu.

Neu thay hoi "tai sao query message theo thu tu giam dan roi lai reverse?" thi tra loi:

> Vi query desc thuan tien cho pagination o database. Sau khi lay xong 1 trang, em dao lai de nguoi dung doc theo thu tu tu nhien trong khung chat.

### 6.7. Validation

Ban noi:

> O tang backend, em validate noi dung tin nhan phai co text, khong rong sau khi trim, va gioi han 1000 ky tu. User cung khong duoc nhan tin cho chinh minh.

### 6.8. Ket Messages bang ngon ngu rubric

Ban ket:

> Vi vay, Messages dap ung dung yeu cau rubric ve messaging khong realtime, co pagination, co route bao ve, co validation backend, va co tinh ket noi ro rang voi module Friends.

## 7. Achievements theo rubric

### 7.1. Rubric ma Achievements dap ung

Ban noi:

> Phan thu ba la Achievements. Module nay dap ung truc tiep muc `Achievements exist`, dong thoi dong vai tro chung minh he thong co gamification va co the tong hop du lieu tu cac social actions thanh ket qua co y nghia.

### 7.2. Trinh bay mo hinh du lieu

Ban noi:

> Em tach `achievements` va `user_achievements` thanh 2 bang. Bang `achievements` la catalog, dinh nghia badge, code, metric, goal. Bang `user_achievements` luu progress cua tung user va thoi diem mo khoa.

Neu thay hoi "tai sao khong tinh het tren frontend?" thi tra loi:

> Vi achievement la logic nghiep vu, nen em de backend tinh va dong bo. Frontend chi nhan data va render progress bar, unlocked state, summary. Cach nay tranh sai lech va tranh gian lan.

### 7.3. 4 achievement hien co

Ban noi:

> Hien tai social slice duoc seed 4 achievement:
- `SOCIAL_SPARK`: gui friend request dau tien
- `FIRST_PING`: gui message dau tien
- `TRUST_CIRCLE`: dat 2 friendships
- `SOCIAL_BUTTERFLY`: co 3 conversations rieng biet

### 7.4. Co che sync

Ban noi:

> Achievement duoc sync o backend sau nhung thao tac social quan trong nhu gui request, accept request, remove friend, gui message. Ngoai ra, khi vao trang achievements, backend sync lai them 1 lan truoc khi tra ve ket qua. Vi vay progress luon bam sat du lieu that.

Neu thay hoi "mo khoa roi co bi mat di khong?" thi tra loi:

> Khong. Khi da mo khoa, he thong giu `unlocked_at`. Progress hien tai co the thay doi, nhung dau moc da dat duoc van duoc bao luu nhu 1 lich su thanh tich.

### 7.5. Demo achievement live

Ban noi:

> Day la diem demo dep nhat cua social slice. Luc seed ban dau, user1 moi co 2 conversations nen chua dat `SOCIAL_BUTTERFLY`. Sau khi em accept request cua user5 va gui tin nhan dau tien cho user5, so conversation tang len 3. Luc mo trang Achievements, he thong sync va mo khoa badge nay ngay truoc mat giang vien.

Ban chi vao summary phia tren va noi:

> O day em hien tong so achievements, so da mo khoa, so chua mo khoa va ty le hoan thanh. O tung the achievement, em hien progress value, goal value, progress bar va unlocked state.

### 7.6. Ket Achievements bang ngon ngu rubric

Ban ket:

> Nhu vay, Achievements chung minh he thong khong chi co thao tac xa hoi, ma con co co che tong hop, theo doi tien do, luu lich su mo khoa va render duoc thanh ket qua co y nghia cho nguoi dung.

## 8. Seed data theo rubric

### 8.1. Rubric ma Seed data dap ung

Ban noi:

> Phan thu tu la Seed data. Day la phan rat quan trong trong rubric toan he thong vi no lien quan truc tiep den `Seeds populate demo-ready data` va toan bo nhom `Seeded Demo Scenarios`.

### 8.2. So lieu seed lien quan den social

Ban noi:

> Sau khi chay seed, he thong co san:
- 6 users
- 6 profiles
- 3 friendships
- 3 pending friend requests
- 10 messages
- 4 achievements
- 24 dong `user_achievements`

Neu thay hoi "vi sao seed nay duoc xem la meaningful?" thi tra loi:

> Vi day khong phai du lieu ngau nhien. Moi user deu co profile, co vai tro, co location, co favorite game. Trong social graph co san quan he ban be, loi moi ket ban hai chieu, conversation co noi dung thuc te, va progress achievement duoc tinh tu du lieu do. Nghia la seed vua de demo, vua de kiem chung logic.

### 8.3. Thu tu seed va ly do

Ban noi:

> Em seed users va profiles truoc. Sau do em seed social graph, gom friendships, friend requests va messages. Cuoi cung em seed achievements va user achievements. Thu tu nay la co y vi progress achievement phu thuoc truc tiep vao du lieu social da duoc tao truoc do.

Neu thay hoi "neu dao thu tu thi sao?" thi tra loi:

> Neu seed achievement truoc social graph thi progress se sai, co the bang 0 hoac mo khoa sai. Nen thu tu seed la mot phan cua tinh dung dan he thong, khong chi la van de ky thuat nho.

### 8.4. Seed data va final demo flow

Ban noi:

> Chinh nho seed data ma em co the di demo lien mach. Vao Friends la da co request de accept. Sang Messages la da co conversation de doc. Vao Achievements la da co 3/4 badge mo khoa va con 1 badge co the mo khoa live. Day la ly do em goi seed nay la demo-ready seed.

### 8.5. Ket Seed data bang ngon ngu rubric

Ban ket:

> Nhu vay, seed data khong chi de "cho co du lieu", ma la mot phan cua rubric. No chung minh he thong co meaningful records, co demo scenarios, va co the trinh bay on dinh sau moi lan reset database.

## 9. Luong demo de chung minh nhieu muc rubric cung luc

Ban co the demo theo thu tu nay:

1. Dang nhap bang `user1@example.com`
2. Mo `Friends`, search `admin1`, gui 1 request moi
3. O khu `Incoming`, accept request cua `user5`
4. Chi vao friend list va pagination
5. Mo `Messages`, doc conversation voi `user2`
6. Chon `user5`, mo chat moi va gui 1 tin nhan
7. Mo `Achievements`, chi ra `SOCIAL_BUTTERFLY` vua duoc mo khoa

Ban co the noi:

> Voi 1 luong demo ngan, em chung minh duoc rat nhieu muc rubric cung luc: user search, friend management, messaging khong realtime, pagination, achievements, seed demo scenarios, route protection va backend business logic.

## 10. Giai thich ky thuat neu giang vien hoi sau

### 10.1. Frontend organization

> O frontend, em tach `FriendsPage`, `MessagesPage`, `AchievementsPage`; tach them component nhu `PlayerCard`, `ConversationList`, `AchievementCard`; va tach service de goi API. Cach nay giup UI, data fetching va reusable component ro rang.

### 10.2. Backend organization

> O backend, em tach route, controller, service theo module. Route dinh nghia endpoint. Controller xu ly request-response. Service chua business logic nhu validation, transaction, pagination va achievement sync.

### 10.3. Database organization

> O database, em co 5 bang chinh cho social slice: `friend_requests`, `friendships`, `messages`, `achievements`, `user_achievements`. Moi bang co vai tro rieng, tranh viec nhieu nghiep vu bi nhot vao 1 bang duy nhat.

### 10.4. Security va route protection

> Cac route social deu di qua middleware `protect`, nen nguoi dung phai dang nhap moi truy cap duoc. Day cung la mot phan cho thay he thong tuan thu logic auth chung cua toan app.

### 10.5. RESTful API

> Friends, Messages va Achievements deu duoc expose thanh REST API rieng. Frontend khong truy cap database truc tiep, ma thong qua API layer ro rang. Day la diem phu hop voi rubric backend tach rieng frontend.

## 11. Cau hoi phan bien mau theo kieu rubric

### Cau hoi 1

> Neu chi nhin giao dien thi lam sao biet day la he thong hoan chinh chu khong phai mock?

Tra loi:

> Vi moi thao tac deu co backend route, service validation, bang database va du lieu seed tuong ung. Vi du accept request se thay doi ca `friend_requests`, `friendships` va sync `user_achievements`, khong phai chi doi state tren frontend.

### Cau hoi 2

> Tai sao social slice lai quan trong trong rubric toan he thong?

Tra loi:

> Vi no phu trach mot cum tieu chi user feature rat ro: search, friends, messaging, achievements, pagination va seeded demo scenarios. Day la nhom tieu chi co tinh he thong, khong phai mot trang le.

### Cau hoi 3

> Diem nao trong social slice cho thay backend quality?

Tra loi:

> Do la MVC ro rang, dung Knex, co transaction cho thao tac nhieu buoc, co business validation o backend, co route protection, va co pagination metadata tra ve tu server.

### Cau hoi 4

> Tai sao seed data duoc xem la mot phan cua cham diem chứ khong chi de cho de demo?

Tra loi:

> Vi rubric yeu cau explicit ve seeded demo scenarios. Nghia la he thong phai co du lieu seed co nghia, co tinh lap lai, va ho tro trinh bay chuc nang ngay sau khi khoi tao database.

### Cau hoi 5

> Neu bo achievement di thi co anh huong rubric khong?

Tra loi:

> Co. Khi do he thong mat 1 muc user feature trong rubric, dong thoi mat di phan gamification va phan chung minh kha nang tong hop du lieu tu nhieu thao tac social.

## 12. Loi ket theo phong cach rubric

Ban co the ket nhu sau:

> Tom lai, neu doi chieu voi rubric toan he thong, social slice cua em khong chi co giao dien dep hay thao tac duoc, ma con dap ung duoc nhieu tieu chi chinh: user search, friend management, messaging khong realtime, achievements, pagination, REST API, MVC, route protection va seeded demo scenarios. Em chu dong thiet ke luong demo de trong vai phut co the chung minh duoc tat ca cac diem do mot cach lien mach.

## 13. Tai lieu ban nen mo lai truoc luc bao ve

- `docs/RUBRIC_CHECKLIST.md`
- `docs/MEMBER4_SOCIAL_QA_SCRIPT.md`
- `src/services/friendService.js`
- `src/services/messageService.js`
- `src/services/achievementService.js`
- `src/services/userSearchService.js`
- `src/db/seeds/04_social_graph.js`
- `src/db/seeds/05_achievements.js`
- `frontend/src/pages/client/FriendsPage.jsx`
- `frontend/src/pages/client/MessagesPage.jsx`
- `frontend/src/pages/client/AchievementsPage.jsx`

## 14. Ban rut gon 30 giay

Neu thay chi cho 30 giay, ban co the noi:

> Social slice cua em gom Friends, Messages, Achievements va Seed data. Theo rubric toan he thong, no dap ung user search, friend management, messaging khong realtime, achievements, pagination, REST API, MVC va seeded demo scenarios. Em dung user1 de demo vi tai khoan nay co san friend, request, message va co the mo khoa them 1 achievement ngay trong luc thuyet trinh.

"""Render the handout's exact diagrams. Run from this directory; requires CairoSVG."""
from pathlib import Path
from html import escape
import cairosvg

ROOT = Path(__file__).parent
NAVY, TEAL, CREAM, GOLD = '#102c46', '#167184', '#f6f8fb', '#bd7b32'

def text(x, y, value, size=23, color=NAVY, bold=False):
    return f'<text x="{x}" y="{y}" font-family="Waree, sans-serif" font-size="{size}" fill="{color}" font-weight="{700 if bold else 400}">{escape(value)}</text>'

def box(x, y, w, h, title, lines, color=TEAL):
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="white" stroke="{color}" stroke-width="2"/>'
    out += f'<rect x="{x}" y="{y}" width="{w}" height="51" rx="10" fill="{color}"/>'
    out += text(x+18,y+34,title,24,'white',True)
    for i,line in enumerate(lines):out += text(x+18,y+88+i*38,line,21)
    return out

def arrow(x1,y1,x2,y2):
    return f'<path d="M{x1},{y1} L{x2},{y2}" stroke="{GOLD}" stroke-width="4" fill="none" marker-end="url(#arrow)"/>'

def render(name, title, subtitle, content, height=600):
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="{height}" viewBox="0 0 1440 {height}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="{GOLD}"/></marker></defs><rect width="1440" height="{height}" fill="{CREAM}"/>{text(40,55,title,32,bold=True)}{text(40,100,subtitle,22)}{content}</svg>'
    ROOT.joinpath(name+'.svg').write_text(svg)
    cairosvg.svg2png(bytestring=svg.encode(),write_to=str(ROOT/(name+'.png')))

render('atlas-tree','Cluster0 ไม่ใช่ชื่อ database','หนึ่ง cluster มีได้หลาย database — คู่มือนี้แยกข้อมูลสาธิตจากแอปหลัก',
 box(45,155,340,180,'Cluster0',['hostname ของแต่ละคนต่างกัน','บริการ MongoDB บน Atlas'])+
 arrow(385,245,500,245)+box(505,145,385,215,'course_books_demo',['drinks / customers / books','categories / authors','carts / orders'])+
 arrow(385,335,500,435)+box(505,395,385,150,'course_books',['books: metadata 200 เล่ม'])+
 box(970,180,420,270,'สิ่งที่เห็นใน Data Explorer',['database = กลุ่มข้อมูลของแอป','collection = กลุ่ม document','document = ข้อมูลหนึ่งรายการ','field = ชื่อค่าภายใน document']))
render('drink-document','อ่าน document เครื่องดื่มหนึ่งรายการ','หนึ่ง document คือข้อมูลเครื่องดื่มหนึ่งชนิด ไม่ใช่หนึ่งแก้วที่ขาย',
 box(45,150,620,280,'drinks: Iced Cocoa',['_id: ObjectId(...00d1)','name: "Iced Cocoa"','priceSatang: 4500','available: true'])+
 arrow(665,290,765,290)+box(785,150,605,280,'field → ความหมาย',['_id → รหัสระบุรายการ','name → ข้อความ (String)','priceSatang → 4,500 สตางค์ = 45 บาท','available → ค่าจริง/เท็จ (Boolean)'])+
 text(55,505,'ObjectId เป็นชนิดข้อมูลของ MongoDB; เมื่อส่ง JSON ให้ React เราแปลงเป็น id แบบ string',23))
render('request-path','ใครทำหน้าที่อะไร เมื่อเปิดรายการหนังสือ','อ่านซ้ายไปขวาตอนส่งคำขอ แล้วอ่านขวาไปซ้ายตอนรับข้อมูล',
 box(35,160,240,235,'React',['แสดงผล / รับ input','fetch /api/books','state / render'])+
 arrow(275,270,320,270)+box(325,160,240,235,'Express route',['ตรวจ query / body','เลือก HTTP status','await store.list'])+
 arrow(565,270,610,270)+box(615,160,240,235,'store + model',['Book.find()','await ผล query','document → API'])+
 arrow(855,270,900,270)+box(905,160,490,235,'MongoDB Atlas',['course_books.books','อ่าน document ที่เก็บไว้','คืนผลกลับผ่าน connection'])+
 text(50,485,'Browser รู้เพียง URL ของ API; MONGODB_URI อยู่ใน .env ของ backend เท่านั้น',24))
render('book-shapes','หนังสือเล่มเดียวกัน แต่รูปแบบต่างกันตามชั้น','ใช้ตัวอย่าง Database Practice เพื่อเห็น field ที่เพิ่มขึ้นและ field ที่ส่งออก',
 box(35,160,390,290,'POST body',['title / author','sourceType / summary','ยังไม่มี id','ผู้ใช้ไม่ส่ง titleKey'])+
 arrow(425,300,490,300)+box(495,160,440,290,'MongoDB document',['_id: ObjectId(...)','title / author / ...','titleKey: database practice','createdAt / updatedAt'])+
 arrow(935,300,1000,300)+box(1005,160,400,290,'API response',['{ data: { id: "...", ... } }','id เป็น string','ไม่ส่ง titleKey หรือ __v','React อ่าน response.data']))
render('embed-reference','แปลง ER เป็น MongoDB ด้วยการตัดสินใจสองแบบ','อ้างรหัสเมื่อใช้ข้อมูลร่วมกัน — ฝังรายการที่อ่านพร้อมกับเจ้าของ',
 box(40,155,420,230,'books',['_id: ...00b1','categoryId: ...0ca1','authorIds: [...00a1, ...00a2]'])+
 arrow(460,220,545,220)+box(550,155,370,140,'categories',['_id: ...0ca1','name: Computing'])+
 arrow(460,335,545,395)+box(550,330,370,155,'authors',['...00a1: Nida Demo','...00a2: Arun Demo'])+
 box(970,155,425,330,'orders',['customerId: ...00c1','items: [','  { bookId: ...00b1,','    quantity: 2,','    unitPriceSatang: 1600 }',']'])+
 text(45,550,'ObjectId reference ไม่ใช่ foreign key constraint; แอปต้องตรวจว่าปลายทางมีอยู่จริง',23),620)
render('cart-order','ตะกร้าปัจจุบัน กับประวัติซื้อคนละช่วงเวลา','ข้อมูลตัวอย่าง: ซื้อ Web Basics ไปแล้ว 2 เล่ม ก่อนกลับมาเลือก Database Basics',
 box(40,155,420,240,'books: ราคาปัจจุบัน',['Web Basics','salePriceSatang: 1800','ราคาตอนนี้ = 18 บาท','stockQty: 8'])+
 box(510,155,420,240,'orders: ประวัติที่ยืนยันแล้ว',['Web Basics จำนวน 2 เล่ม','unitPriceSatang: 1600','2 × 1600 = 3200 สตางค์','ยอดเดิม = 32 บาท'])+
 box(980,155,420,240,'carts: สิ่งที่ยังเลือกอยู่',['Database Basics จำนวน 1','ยังไม่มีคำสั่งซื้อใหม่','อ่านราคาปัจจุบันจาก books','ล้างตะกร้าไม่ลบ orders'])+
 text(45,475,'เก็บราคาตอนซื้อไว้ใน order item เพื่อไม่ให้ประวัติเปลี่ยนตามราคาปัจจุบัน',24))
render('restart-proof','พิสูจน์ว่าข้อมูลอยู่ใน DB ไม่ใช่อยู่แค่ state','ติดตาม id เดียวกันตลอดทั้งสี่ขั้นตอน',
 box(35,170,295,230,'1. POST',['เพิ่มหนังสือทดลอง','ได้ 201 + Location','จด id จาก response'])+
 arrow(330,280,390,280)+box(395,170,295,230,'2. ตรวจ Atlas',['ค้นหา title เดียวกัน','เห็น _id ของ document','เก็บใน course_books'])+
 arrow(690,280,750,280)+box(755,170,295,230,'3. Restart Express',['Ctrl+C ที่ server','npm run dev ใหม่','ไม่ลบ database'])+
 arrow(1050,280,1110,280)+box(1115,170,290,230,'4. GET id เดิม',['ตอบ 200','ชื่อและ id ตรงเดิม','โหลด React ใหม่ด้วย']))
render('env-loading','จาก .env ผ่าน Node.js ไปเชื่อม MongoDB','ค่าของเครื่องอยู่ในไฟล์ตั้งค่า ส่วนคำสั่ง query อยู่ในโค้ด',
 box(35,155,340,230,'.env ที่ backend',['MONGODB_URI=...','PORT=3001','ไม่เก็บรหัสจริงใน Git'])+
 arrow(375,265,440,265)+box(445,155,480,230,'node --env-file=.env',['อ่านไฟล์ก่อนเริ่ม JavaScript','process.env.MONGODB_URI','process.env.PORT'])+
 arrow(925,265,990,265)+box(995,155,410,230,'src/db.js เชื่อม MongoDB',['mongoose.connect(uri)','ใช้ URI ติดต่อฐานข้อมูล','Book model อ่าน/เขียนข้อมูล'])+
 text(45,475,'.env.example แสดงชื่อค่าที่ต้องตั้ง; คำสั่งในแลบอ่านค่าจริงจาก .env',24))
render('developer-workflow','สร้างและบันทึกงานใน GitHub repository ของเรา','แต่ละช่วงสร้างไฟล์ที่ต้องใช้ ตรวจผล แล้วส่งประวัติงานกลับไปยัง repo ของตน',
 box(35,165,310,240,'1. Repo ของเรา',['GitHub: New repository','clone URL บัญชีเรา','origin ชี้ repo ของเรา'])+
 arrow(345,280,390,280)+box(395,165,310,240,'2. สร้างไฟล์',['VS Code: New File','คัดลอกเนื้อหาตามลิงก์','รันคำสั่งและตรวจผล'])+
 arrow(705,280,750,280)+box(755,165,310,240,'3. บันทึกบนเครื่อง',['git status / git diff','git add ชื่อไฟล์','git commit -m "..."'])+
 arrow(1065,280,1110,280)+box(1115,165,290,240,'4. ส่งขึ้น GitHub',['git push','refresh repo ของเรา','ดูไฟล์และ commit ใหม่']))
render('copy-file-content','คัดลอกเนื้อหาไฟล์ ไม่ย้ายทั้งโปรเจกต์','เปิด GitHub แลบใน browser แล้วสร้างไฟล์ปลายทางใน VS Code',
 box(45,165,620,245,'GitHub แลบ: ไฟล์อ้างอิง',['examples/10-mongodb-book-api/','src/db.js','Copy raw contents'])+
 arrow(665,285,765,285)+box(785,165,610,245,'Repo ของเรา: ไฟล์ที่สร้าง',['dti201-bookstore/backend/','src/db.js','New File, วางเนื้อหา, Save'])+
 text(45,490,'package.json สร้างด้วย npm init; package-lock.json สร้างจาก npm install ของงานเรา',23))

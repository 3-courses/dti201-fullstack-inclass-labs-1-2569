# Lab 01 — เริ่มต้น Course Book Explorer: เว็บทำงานอย่างไร และ repo ต้องสะอาดอย่างไร

## เป้าหมายของคาบนี้

ในคาบแรก เราจะยังไม่รีบเขียน React และยังไม่รีบทำระบบใหญ่ เป้าหมายคือให้ทุกคนเห็นภาพว่าเว็บแอปทำงานเป็นชั้น ๆ และเริ่ม repo สำหรับโปรเจกต์ฝึกชื่อ **Course Book Explorer**

โปรเจกต์นี้จะโตไปทั้งภาค จากหน้าเว็บหนังสือธรรมดา ไปเป็น full-stack app ที่มี API, database, deployment และ learning dataset

## ภาพรวมจาก SCORM

เนื้อหานี้ต่อจาก DTI-SCORM:

- พื้นฐานเว็บ
- client-server architecture
- request-response
- URL และ DNS
- developer tools
- Git workflow

ให้จำภาพนี้ไว้ก่อน:

```text
ผู้ใช้
  -> browser
  -> HTML/CSS/JavaScript
  -> request
  -> server/API
  -> database
  -> response
  -> browser แสดงผลใหม่
```

## งานในคาบ

สร้าง repo ฝึกของตัวเองชื่อประมาณนี้:

```text
course-book-explorer-ชื่อเล่น
```

โครงสร้างเริ่มต้น:

```text
course-book-explorer/
  docs/
    LearningJourneyDataset.md
    ReasoningTrace.md
  index.html
  README.md
  .gitignore
```

## ขั้นตอน

### 1. สร้างโฟลเดอร์และไฟล์

```bash
mkdir course-book-explorer
cd course-book-explorer
mkdir docs
touch index.html README.md .gitignore
touch docs/LearningJourneyDataset.md docs/ReasoningTrace.md
```

### 2. เขียน `.gitignore`

เริ่มจากกติกาความสะอาดก่อนเขียนโค้ด:

```gitignore
node_modules/
.env
.env.*
dist/
build/
.DS_Store
*.log
*.zip
```

### 3. เขียน README แรก

```md
# Course Book Explorer

เว็บแอปฝึกสำหรับรายวิชา DTI201 ใช้สำรวจหนังสือและแหล่งเรียนรู้ของรายวิชา

## เป้าหมาย

- แสดงรายการหนังสือ/แหล่งเรียนรู้จริงของรายวิชา
- ฝึก HTML, CSS, JavaScript, React, API และ database ทีละขั้น
- เก็บ Learning Journey Dataset ของผู้เรียน

## วิธีเปิดตอนนี้

เปิด `index.html` ใน browser
```

### 4. เริ่ม Git

```bash
git init
git branch -M main
git status
git add .
git commit -m "Initialize course book explorer"
```

ถ้า commit ไม่ได้เพราะ Git ยังไม่รู้ชื่อผู้เขียน ให้ตั้งค่าตามที่ผู้สอนแนะนำ

## หลักฐานท้ายคาบ

- มี repo หรือ folder ที่มีไฟล์ครบ
- มี `.gitignore`
- มี README แรก
- มี commit แรก
- มี Learning Journey entry แรก

## Learning Journey entry

เพิ่มใน `docs/LearningJourneyDataset.md`:

```md
## LJ-001: เริ่มต้น repo

- Week: 1
- Topic: git, web foundation
- Problem: ยังไม่เห็นภาพว่าเว็บแอปมีชั้นอะไรบ้าง
- Evidence: วาด flow browser -> request -> server -> response ได้
- Verification: เปิด index.html และใช้ git status ตรวจ repo
- Lesson: เริ่ม project จากโครงสร้างและ repo hygiene ก่อน
- Tags: git, web-basics, repo-hygiene
- RAG ready: true
```

## คำถามเช็กความเข้าใจ

- browser คือ client หรือ server
- request กับ response ต่างกันอย่างไร
- ทำไมต้องมี `.gitignore` ตั้งแต่ต้น
- ทำไม repo public ห้ามมี `.env`

## Exit ticket

เขียน 3 บรรทัด:

1. วันนี้ฉันเข้าใจเว็บแอปเพิ่มขึ้นตรงไหน
2. คำสั่ง Git ที่ยังไม่มั่นใจคืออะไร
3. ก่อน push ต้องตรวจอะไร

# DTI201 Full-Stack In-Class Labs 1/2569

คลัง lab สาธารณะสำหรับรายวิชา **DTI 201: ทักษะการพัฒนาซอฟต์แวร์แบบฟุลสแตก** ภาคการศึกษา **1/2569**

lab ชุดนี้จัดใหม่ให้เดินตามแผนบรรยายของรายวิชา และใช้โปรเจกต์เดียวต่อเนื่องทั้งภาคชื่อ **Course Book Explorer** เริ่มจากการทำหน้าเว็บของ “หนังสือจริงที่ใช้ในรายวิชา” ด้วย HTML/CSS แล้วค่อยต่อยอดเป็นเว็บแอปที่มี JavaScript, React, API, database, security, Docker, testing, learning dataset และ final demo

> แนวคิดสำคัญ: นักศึกษาควรเข้าใจการเดินทางของข้อมูลตั้งแต่เนื้อหาในหนังสือ → โครงสร้าง HTML → หน้าตา CSS → interaction → API → database → deployment ไม่ใช่กระโดดไป React ตั้งแต่ยังไม่เข้าใจเว็บพื้นฐาน

## ใช้คู่กับ repo หลักของรายวิชา

- Course hub: https://github.com/3-courses/dti-fullstack
- Public lab repo นี้: https://github.com/3-courses/dti201-fullstack-inclass-labs-1-2569

## แหล่งเนื้อหาที่ใช้จัด lab

สรุปแหล่งที่ใช้ไว้ใน [docs/source-inventory.md](docs/source-inventory.md)

แหล่งหลัก:

- DTI-SCORM: `https://github.com/wdiazcarballo/DTI-SCORM.git`
- prior public labs: `https://github.com/wdiazcarballo/DTI201-FullStack-Course.git`
- prior course materials and aggregate notes: `https://github.com/wdiazcarballo/fullstack-168`
- current course plan and rubrics: `https://github.com/3-courses/dti-fullstack`

เนื้อหา private/admin เช่นรายชื่อ คะแนน individual reports และ raw assessment files ไม่ถูกนำเข้ามาใน repo สาธารณะนี้

## Lab Sequence ใหม่

| สัปดาห์ | Lab | หัวข้อ | ไฟล์ |
|---:|---:|---|---|
| 1 | 01 | ภาพรวมเว็บ, Git, repo hygiene และ Course Book Explorer | [labs/01-course-book-web-foundation.md](labs/01-course-book-web-foundation.md) |
| 2 | 02 | จากหนังสือจริงสู่ semantic HTML | [labs/02-real-book-semantic-html.md](labs/02-real-book-semantic-html.md) |
| 3 | 03 | CSS layout, responsive design และ accessibility | [labs/03-book-page-css-responsive.md](labs/03-book-page-css-responsive.md) |
| 4 | 04 | JavaScript, DOM, event และ form validation | [labs/04-book-form-javascript-validation.md](labs/04-book-form-javascript-validation.md) |
| 5 | 05 | HTTP, JSON, fetch และ curl | [labs/05-book-json-fetch-curl.md](labs/05-book-json-fetch-curl.md) |
| 6 | 06 | React/Vite: เปลี่ยนหน้า book page เป็น app | [labs/06-react-book-explorer.md](labs/06-react-book-explorer.md) |
| 7 | 07 | React forms, effects และ API service layer | [labs/07-react-forms-api-service.md](labs/07-react-forms-api-service.md) |
| 8 | 08 | Midterm practical แบบ AI-off | [labs/08-midterm-ai-off-practical.md](labs/08-midterm-ai-off-practical.md) |
| 9 | 09 | Express API, routing, middleware และ validation | [labs/09-express-book-api.md](labs/09-express-book-api.md) |
| 10 | 10 | Database, seed data, CRUD และ data dictionary | [labs/10-book-database-crud.md](labs/10-book-database-crud.md) |
| 11 | 11 | Authentication, authorization และ OWASP habit | [labs/11-auth-security-book-app.md](labs/11-auth-security-book-app.md) |
| 12 | 12 | Automation, smoke test, Git PR และ CI concept | [labs/12-automation-testing-git-ci.md](labs/12-automation-testing-git-ci.md) |
| 13 | 13 | Docker/Compose, environment และ deployment rehearsal | [labs/13-docker-deploy-rehearsal.md](labs/13-docker-deploy-rehearsal.md) |
| 14 | 14 | Learning Journey Dataset และ RAG readiness | [labs/14-learning-journey-rag-dataset.md](labs/14-learning-journey-rag-dataset.md) |
| 15 | 15 | Performance, resource use, sustainability และ polish | [labs/15-performance-sustainability-polish.md](labs/15-performance-sustainability-polish.md) |
| 16 | 16 | Final demo, oral defense และ handoff | [labs/16-final-demo-oral-defense.md](labs/16-final-demo-oral-defense.md) |

ดู mapping กับแผนบรรยายได้ที่ [docs/lecture-alignment.md](docs/lecture-alignment.md)

## Legacy labs จากปี 2568

lab เดิมจากปีที่แล้วถูกเก็บไว้ที่ [labs/legacy-2568/](labs/legacy-2568/) เพื่อใช้อ้างอิงหรือดึงบางช่วงกลับมาใช้ แต่ sequence หลักของปี 1/2569 ให้ใช้ lab ใหม่ด้านบนก่อน

## Routine ในคาบ

ทุก lab ใช้รูปแบบใกล้กัน:

1. concept check สั้น ๆ
2. live demo จากผู้สอน
3. studio task ที่ต้องลงมือทำ
4. evidence checklist
5. Learning Journey entry
6. oral-defense question สั้น ๆ

## กติกาความปลอดภัย

ห้าม commit สิ่งต่อไปนี้:

- `.env`
- token, API key, password, private key
- `node_modules/`
- build output เช่น `dist/`, `build/`
- รายชื่อนักศึกษา คะแนน private feedback หรือ individual reports
- ข้อความจากหนังสือที่มีลิขสิทธิ์แบบคัดลอกยาว ๆ

lab นี้ใช้ **metadata ของหนังสือ** เช่น ชื่อหนังสือ ผู้แต่ง ปี สำนักพิมพ์ ISBN และ summary ที่นักศึกษาเขียนเอง ไม่ให้คัดลอกเนื้อหาหนังสือจริงลง repo

## ตรวจ repo ก่อน push

```bash
git status --short
```

ถ้าเห็น `.env`, `node_modules`, zip, video หรือไฟล์ส่วนตัว ให้หยุดก่อน push แล้วแก้ `.gitignore`

## License

ยังไม่ได้ประกาศ license อย่างเป็นทางการ ให้ถือว่าเป็น public course material สำหรับการเรียนในรายวิชาและการใช้งานตามที่เจ้าของ repo อนุญาต

# Course Book Explorer: Safe Starter Data

ใช้ข้อมูลนี้เป็น metadata ตั้งต้นสำหรับ lab 02-10 ได้ ข้อมูลนี้เป็นรายการหนังสือและแหล่งเรียนรู้ ไม่ใช่การคัดลอกเนื้อหาจากหนังสือ

## Markdown Table

| id | title | author | sourceType | topics |
|---|---|---|---|---|
| `book-fullstack-react-ts` | Fullstack React with TypeScript | Juha-Matti Santala | book | React, TypeScript, Frontend |
| `book-nodejs-web-development` | Node.js Web Development | David Herron | book | Node.js, Express, Backend |
| `book-docker-for-developers` | Docker for Developers | Richard Bullington-McGuire | book | Docker, DevOps, Deployment |
| `book-ddia` | Designing Data-Intensive Applications | Martin Kleppmann | book | Database, Architecture, Data |
| `book-ydkjs` | You Don’t Know JS Yet | Kyle Simpson | book/documentation | JavaScript |
| `docs-mdn` | MDN Web Docs | Mozilla | documentation | HTML, CSS, JavaScript |
| `docs-react` | React Documentation | React team | documentation | React, UI |
| `docs-node` | Node.js Documentation | Node.js project | documentation | Node.js, Backend |
| `docs-docker` | Docker Documentation | Docker | documentation | Docker |

## JSON Starter

```json
[
  {
    "id": "book-fullstack-react-ts",
    "title": "Fullstack React with TypeScript",
    "author": "Juha-Matti Santala",
    "sourceType": "book",
    "topics": ["React", "TypeScript", "Frontend"],
    "summary": "แหล่งเรียนรู้สำหรับการสร้าง frontend app ด้วย React และ TypeScript"
  },
  {
    "id": "book-nodejs-web-development",
    "title": "Node.js Web Development",
    "author": "David Herron",
    "sourceType": "book",
    "topics": ["Node.js", "Express", "Backend"],
    "summary": "แหล่งเรียนรู้สำหรับการพัฒนา backend และ web server ด้วย Node.js"
  },
  {
    "id": "book-docker-for-developers",
    "title": "Docker for Developers",
    "author": "Richard Bullington-McGuire",
    "sourceType": "book",
    "topics": ["Docker", "DevOps", "Deployment"],
    "summary": "แหล่งเรียนรู้สำหรับการใช้ container ในงานพัฒนาซอฟต์แวร์"
  },
  {
    "id": "book-ddia",
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "sourceType": "book",
    "topics": ["Database", "Architecture", "Data"],
    "summary": "แหล่งเรียนรู้สำหรับคิดเรื่องข้อมูล ระบบ และข้อแลกเปลี่ยนทางสถาปัตยกรรม"
  },
  {
    "id": "docs-mdn",
    "title": "MDN Web Docs",
    "author": "Mozilla",
    "sourceType": "documentation",
    "topics": ["HTML", "CSS", "JavaScript"],
    "summary": "เอกสารอ้างอิงหลักสำหรับเทคโนโลยีเว็บ"
  }
]
```

## Copyright Boundary

นักศึกษาสามารถใช้ metadata และ summary ที่เขียนเองได้ แต่ไม่ควรคัดลอกเนื้อหา หนังสือ บทเรียน หรือ PDF ที่มีลิขสิทธิ์ลง repository

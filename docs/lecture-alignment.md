# Lecture Alignment 1/2569

ตารางนี้ mapping lab ใหม่กับแผนรายวิชา DTI201 1/2569 และแหล่ง SCORM/notes ที่เกี่ยวข้อง

| สัปดาห์ | แผนบรรยาย | Lab | SCORM/source ที่ใช้ |
|---:|---|---|---|
| 1 | Course setup, web stack, GitHub, command line, repo hygiene | 01 | DTI-SCORM Module 1, TOOL-Git, course report เรื่อง `.env` และ repo structure |
| 2 | HTML semantic structure, forms, DevTools | 02 | DTI-SCORM Module 2 lesson HTML, current course book list |
| 3 | CSS layout, responsive design, viewport, accessibility | 03 | DTI-SCORM Module 2 lesson CSS, Module 5 DevTools |
| 4 | JavaScript/TypeScript, DOM, event, validation | 04 | DTI-202 JS Standalone modules 1, 4, 5 |
| 5 | HTTP, JSON, fetch API, loading/error state, curl | 05 | DTI-SCORM Module 1 request-response, DTI-202 JSON, legacy curl lab |
| 6 | React + Vite: component, props, state, routing | 06 | legacy Vite/React lab, SCORM static/dynamic web |
| 7 | React forms, effects, API service layer | 07 | DTI-202 events/form ideas, course plan frontend checkpoint |
| 8 | Midterm practical AI-off | 08 | course plan AI-off drill |
| 9 | Express backend, routing, middleware, validation | 09 | prior fullstack-168 API/rubric patterns |
| 10 | Database, schema/model, seed data, query/filter | 10 | course plan data dictionary + prior project lessons |
| 11 | Authentication/authorization, OWASP habit | 11 | course report security issues, rubric security checks |
| 12 | Bash automation, testing, debugging, PR workflow, CI concept | 12 | TOOL-Git, legacy Git workflow, course report PR/retrospective findings |
| 13 | Docker/Compose, `.env.example`, deployment rehearsal | 13 | legacy Docker/deploy labs, course report AWS limitations |
| 14 | Learning Journey Dataset, RAG readiness | 14 | current `learning-journey-rag-dataset.md` |
| 15 | Performance/resource/sustainability review, final polish | 15 | current course plan resource note, prior testing report |
| 16 | Final demo and oral defense | 16 | current rubric + oral defense policy |

## การปรับจากปี 2568

ปี 2568 เริ่มเร็วไปที่ SPA/React และ deployment ค่อนข้างเร็ว สำหรับปี 1/2569 lab ชุดนี้จึงปรับเป็น:

- สัปดาห์ 1-3: เว็บพื้นฐาน, HTML, CSS, DevTools
- สัปดาห์ 4-5: JavaScript, DOM, JSON, HTTP
- สัปดาห์ 6-7: React หลังจากเข้าใจ HTML/CSS/JS แล้ว
- สัปดาห์ 9-10: API และ database
- สัปดาห์ 11-13: security, automation, Docker/deploy
- สัปดาห์ 14-16: dataset, polish, demo, defense

## Running Project

ทุก lab ใช้โปรเจกต์เดียวชื่อ **Course Book Explorer**

ข้อมูลตั้งต้นคือ metadata ของหนังสือ/แหล่งเรียนรู้ในรายวิชา เช่น:

- Fullstack React with TypeScript — Juha-Matti Santala
- Node.js Web Development — David Herron
- Docker for Developers — Richard Bullington-McGuire
- Designing Data-Intensive Applications — Martin Kleppmann
- You Don’t Know JS Yet — Kyle Simpson
- MDN Web Docs, React Docs, Node.js Docs, Docker Docs

นักศึกษาเขียน summary/reading note ด้วยคำของตนเอง ไม่คัดลอกเนื้อหาจากหนังสือจริงลง repository

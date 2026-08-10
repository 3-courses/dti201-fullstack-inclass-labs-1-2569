# Source Inventory

เอกสารนี้บันทึกว่า lab ปี 1/2569 ใช้แหล่งเนื้อหาใดบ้าง และใช้ในระดับใด เพื่อให้ repo สาธารณะตรวจสอบที่มาได้โดยไม่ดึงข้อมูล private/admin เข้ามาปน

## 1. DTI-SCORM

Source:

- `https://github.com/wdiazcarballo/DTI-SCORM.git`
- local study clone: `/home/ubuntu/ghq/github.com/wdiazcarballo/DTI-SCORM`

ใช้เป็นแหล่งหลักสำหรับหัวข้อพื้นฐาน:

- Module 1: พื้นฐานเว็บ, client-server, request-response, URL, DNS
- Module 2: HTML, CSS, JavaScript เป็นสามภาษาหลักของเว็บ
- Module 3: static vs dynamic web
- Module 4: software stack และ full-stack developer
- Module 5: developer tools และ browser DevTools
- Module 6: review, learning path, portfolio
- DTI-202 JavaScript Standalone: HTML integration, variables, operators, functions, arrays/objects, JSON, DOM, events
- TOOL-Git: Git workflow concepts

ข้อจำกัด:

- ไม่ copy SCORM package ทั้งชุดเข้ามาใน lab repo
- ไม่ copy ข้อสอบ/quiz แบบยาว ๆ
- สรุปเป็นกิจกรรม lab ใหม่ในภาษาไทยธรรมชาติแทน

## 2. fullstack-168

Source:

- `https://github.com/wdiazcarballo/fullstack-168`
- local study clone: `/home/ubuntu/ghq/github.com/wdiazcarballo/fullstack-168`

ใช้เฉพาะเนื้อหาที่ปลอดภัยและเป็น aggregate/course-level:

- course outline 2568/1 เพื่อดู sequence เดิม
- course report 2568/1 เพื่อดู pain points เช่น สอนเร็วเกินไป, commit `.env`, nested structure, ต้องเพิ่ม checkpoint
- aggregate analysis notes เรื่อง Git workflow, code quality, AI usage, communication
- rubric concepts เช่น repo hygiene, frontend/backend/database/deployment/docs

ไม่ใช้/ไม่นำเข้า:

- class lists
- grades
- raw score sheets
- individual reports
- private assessment matrices ที่ระบุตัวบุคคล
- credentials หรือข้อมูล deploy จริง

## 3. Current DTI201 course hub

Source:

- `https://github.com/3-courses/dti-fullstack`
- local repo: `/home/ubuntu/ghq/github.com/3-courses/dti-fullstack`

ใช้เป็น authoritative direction สำหรับ 1/2569:

- `docs/course-plan.md`
- `docs/final-project-rubric.md`
- `docs/ai-use-policy.md`
- `docs/learning-journey-rag-dataset.md`
- `templates/student-project/`

แนวที่นำมาใช้:

- เริ่มจาก HTML/CSS/JS ก่อน React
- project scope เล็กพอทำเสร็จ
- Learning Journey Dataset ทุกสัปดาห์
- AI ใช้ได้แต่ต้อง verify
- secret hygiene ตั้งแต่สัปดาห์แรก
- oral defense และ evidence-based assessment

## 4. Prior public in-class labs

Source:

- `https://github.com/wdiazcarballo/DTI201-FullStack-Course.git`

ใช้เป็น reference สำหรับ:

- GitHub workflow
- Vite/React
- API testing with curl
- Docker
- deployment/troubleshooting

ไฟล์เดิมถูกย้ายไปที่:

- `labs/legacy-2568/`

## Design Decision

lab ใหม่ไม่ใช่การ copy SCORM หรือ copy lab เดิมทีละบรรทัด แต่เป็นการจัดกิจกรรมใหม่ให้เข้ากับแผน 1/2569 โดยใช้โปรเจกต์เดียวคือ **Course Book Explorer** เพื่อให้ทุกสัปดาห์ต่อกันเป็นระบบเดียว

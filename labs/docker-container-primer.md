# ใบงานเสริม — จาก Container สู่ Docker และ Docker Compose

ทำใบงานนี้ก่อนเริ่มส่วน Docker ของ Lab 10. เราจะเริ่มจากความหมายของ container แล้วใช้ Docker เปิดเว็บ ก่อนเขียนไฟล์ Compose ด้วยตนเอง

## เป้าหมาย

เมื่อจบ คุณจะอธิบายได้ว่า image กับ container ต่างกันอย่างไร เปิดเว็บใน container และเข้าผ่าน port บนเครื่องตนเองได้ ทดลองเก็บข้อมูลใน volume และอ่านไฟล์ Compose ของ MongoDB ใน Lab 10 ได้

**เวลา:** ประมาณ 90–120 นาที. **อุปกรณ์:** เครื่องที่ติดตั้ง Docker และ Docker Compose แล้ว, terminal และอินเทอร์เน็ตสำหรับดาวน์โหลด image. คำสั่งด้านล่างใช้ terminal แบบ Bash เช่น macOS Terminal, Linux หรือ Git Bash บน Windows. หากยังไม่มี Docker ให้ผู้สอนช่วยเตรียมเครื่องหรือจับคู่กับเพื่อน

## 1. คิดก่อนใช้เครื่องมือ: Container คืออะไร? (10 นาที)

โปรแกรมเว็บต้องมีตัวโปรแกรมและสิ่งที่ใช้รัน เช่น Node.js กับแพ็กเกจ. Container เป็นพื้นที่แยกสำหรับกระบวนการที่กำลังรัน พร้อมมุมมองไฟล์และเครือข่ายตามที่ตั้งค่าไว้. หลาย container ใช้ kernel ของระบบที่รัน container ร่วมกันได้

**Image** เป็นชุดตั้งต้นที่ใช้สร้าง container; **container** เป็นสิ่งที่สร้างจาก image และอาจกำลังรันหรือหยุดอยู่

วาดภาพเครื่องหนึ่งเครื่องที่มี container เว็บและ container ฐานข้อมูล แล้วตอบ: ถ้าเว็บหยุด ฐานข้อมูลในอีก container จำเป็นต้องหยุดด้วยหรือไม่?

## 2. รู้จัก Docker และตรวจเครื่อง (10 นาที)

Docker CLI รับคำสั่งใน terminal แล้วติดต่อ Docker Engine เพื่อจัดการ image และ container. เปิด Docker Desktop หรือ Engine ตามระบบของเครื่อง แล้วลอง:

```bash
docker version
docker info
docker compose version
```

ควรเห็นข้อมูลทั้ง client และ server ใน `docker version`. ถ้าติดต่อ Engine ไม่ได้ ให้ตรวจว่าเปิด Docker แล้ว; หากไม่มีสิทธิ์ใช้งานให้แจ้งผู้สอนก่อนทำขั้นถัดไป

## 3. สร้าง container แรก (10 นาที)

```bash
docker run hello-world
docker ps
docker ps -a
```

ครั้งแรก Docker อาจดาวน์โหลด image. โปรแกรมจะแสดงข้อความแล้วจบ จึงอาจไม่อยู่ใน `docker ps` ซึ่งแสดงเฉพาะ container ที่กำลังรัน. หา hello-world ใน `docker ps -a` แล้วบันทึกสถานะ

**อธิบาย:** image กับ container ในการทดลองนี้คืออะไร?

## 4. เปิดเว็บใน container และดู port (20 นาที)

ก่อนรัน ทำนายว่า port 18080 อยู่บนเครื่องหรืออยู่ใน container:

```bash
docker run -d --name dti201-web -p 127.0.0.1:18080:80 nginx:alpine
docker ps
curl -i http://localhost:18080
docker logs dti201-web
```

เปิด `http://localhost:18080` ในเบราว์เซอร์ด้วย ควรเห็นหน้า “Welcome to nginx!”. หากเพิ่งเริ่ม container แล้วพบว่าเชื่อมต่อไม่ได้หรือได้ empty reply ให้รอสักครู่แล้วลอง curl อีกครั้ง เพราะเว็บอาจยังเริ่มทำงานไม่เสร็จ. `18080` เป็น port บนเครื่อง; `80` เป็น port ที่ nginx ฟังภายใน container. `127.0.0.1` ให้เข้าถึงจากเครื่องตนเอง

ลองหยุดและเปิด container **เดิม**:

```bash
docker stop dti201-web
docker ps -a
docker start dti201-web
curl -i http://localhost:18080
```

ถ้า Docker บอกว่าชื่อ `dti201-web` ถูกใช้แล้ว ให้ตรวจ `docker ps -a` และใช้ชื่ออื่นเฉพาะงานของคุณ. ถ้า port 18080 ถูกใช้ ให้เลือก port บนเครื่องที่ว่าง เช่น 18082 แล้วเปลี่ยนทั้งคำสั่ง `-p` และ URL. ถ้าเว็บไม่ตอบ ให้ดู `docker logs dti201-web`

## 5. ทดลอง volume ด้วยข้อมูลของเราเอง (20 นาที)

Volume เป็นพื้นที่ที่ Docker จัดการแยกจาก container. ทดลองสร้าง volume สำหรับใบงานนี้ เขียนข้อความด้วย container ตัวแรก แล้วอ่านด้วย container ตัวใหม่:

```bash
docker volume create dti201-docker-primer-data
docker run --rm -v dti201-docker-primer-data:/data alpine:3.20 sh -c 'echo "Hello DTI201" > /data/note.txt'
docker run --rm -v dti201-docker-primer-data:/data alpine:3.20 cat /data/note.txt
```

ควรเห็น `Hello DTI201` แม้ container ตัวแรกจบไปแล้ว. `--rm` ลบ container ชั่วคราวเมื่อคำสั่งจบ; volume ยังอยู่. ระบุว่า `dti201-docker-primer-data` เป็นชื่อ volume และ `/data` เป็นตำแหน่งที่ container เห็น

**ลองอธิบาย:** ถ้าลบ container ตัวเขียน เหตุใดตัวอ่านยังเห็นข้อความ?

## 6. เขียน Compose ไฟล์แรก (20 นาที)

Docker Compose อ่านไฟล์ที่อธิบายบริการและการตั้งค่า แล้วสั่ง Docker Engine สร้างและเปิดบริการ. สร้างโฟลเดอร์ทำงานใหม่ชื่อ `dti201-docker-primer` แล้วสร้างไฟล์ `compose.yaml` ในโฟลเดอร์นั้น:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "127.0.0.1:18081:80"
```

ใน terminal ที่อยู่ในโฟลเดอร์เดียวกับไฟล์:

```bash
docker compose config
docker compose up -d
docker compose ps
curl -i http://localhost:18081
docker compose logs web
```

ควรเห็นหน้า nginx อีกชุด; หากเพิ่งเปิดบริการให้รอสักครู่แล้วลองใหม่. ชี้ในไฟล์ว่า `web` เป็นชื่อบริการ, `image` เป็นชุดตั้งต้น และ `18081:80` เชื่อม port สองฝั่ง. ถ้า 18081 ถูกใช้ ให้เปลี่ยน port ฝั่งเครื่องในไฟล์และ URL

```bash
docker compose stop
docker compose ps -a
docker compose start
curl -i http://localhost:18081
docker compose down
```

`stop` หยุด container เดิม; `start` เปิด container ที่เคยสร้างและหยุดไว้; `down` หยุดและลบ container กับ network ของ Compose. Named volume ไม่ถูกลบโดย `down` ตามค่าเริ่มต้น

## 7. อ่านไฟล์ MongoDB ของ Lab 10 (10 นาที)

เปิด [compose.yaml ของ Lab 10](../examples/10-mongodb-book-api/compose.yaml) แล้ววง:

1. ชื่อบริการ `db` และ image `mongo:7.0`
2. port `27018` บนเครื่องและ `27017` ใน container
3. named volume `book_mongodata` และตำแหน่ง `/data/db` ใน container

วาดเส้นทาง Express บนเครื่อง → port 27018 → MongoDB container → volume. ใน Lab 10 เราจะเขียน API และนำหนังสือเข้าสู่ MongoDB ต่อ

## ส่งหลักฐานและเก็บงาน

- ภาพหรือข้อความจาก `docker ps -a` พร้อมคำอธิบาย image/container
- ผลเปิด nginx ที่ port 18080 และภาพแผนที่ port สองฝั่ง
- ผลอ่าน `Hello DTI201` จาก container ตัวที่สอง พร้อมอธิบาย volume
- ไฟล์ `compose.yaml` ที่เขียนเอง, ผล `docker compose ps` และภาพแผนที่ MongoDB ของ Lab 10

หยุดและลบเฉพาะ container เว็บที่สร้างในข้อ 4:

```bash
docker stop dti201-web
docker rm dti201-web
```

volume ฝึก `dti201-docker-primer-data` ยังอยู่. ถ้าตรวจแล้วว่าไม่ต้องการข้อความทดลองนี้อีก ให้ลบเฉพาะ volume นี้ด้วย `docker volume rm dti201-docker-primer-data`. อย่าใช้คำสั่งลบทุก container หรือทุก volume ของเครื่อง

อ่านเพิ่ม: [Docker: What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/), [Run your first container](https://docs.docker.com/learn/content/run-your-first-container/), [Compose Quickstart](https://docs.docker.com/compose/gettingstarted/).

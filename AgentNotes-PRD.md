# PRD: Agent-Controlled Note Database

**Versi:** 1.0  
**Tanggal:** 7 Juni 2026  
**Status:** Draft Produk  
**Pemilik Produk:** Haris Firdaus  

---

## 1. Ringkasan Produk

Aplikasi ini adalah **note taking app berbasis web/PWA** yang dirancang agar nyaman digunakan manusia, tetapi juga dapat dikontrol penuh oleh agen AI eksternal melalui API.

Produk ini **bukan aplikasi AI**. Tidak ada chatbot, AI search, auto-summary, auto-tagging, atau fitur AI bawaan di dalam UI. Semua kecerdasan berada di agen eksternal seperti OpenClaw, Claude Code, Codex, Cursor agent, atau agen pribadi lain.

Aplikasi berperan sebagai:

1. Tempat user membuat, membaca, mengedit, menghapus, dan mengelola catatan.
2. Database memori yang rapi dan bisa diakses agen AI melalui API.
3. Lapisan kontrol akses, permission, audit log, dan pengelolaan agent key.

Tagline sementara:

> Your notes. Your agents. One memory database.

Atau versi Indonesia:

> Catatanmu, dikendalikan agenmu.

---

## 2. Latar Belakang

Banyak pengguna AI sudah memakai agen eksternal untuk membantu kerja sehari-hari. Namun, catatan dan pengetahuan pribadi mereka sering tersebar di banyak tempat:

- Notion
- Standard Notes
- Google Docs
- Telegram
- WhatsApp
- GitHub
- Bookmark browser
- File Markdown lokal

Agen AI sering tidak punya akses langsung ke sumber-sumber itu, atau aksesnya terlalu rumit. Di sisi lain, aplikasi note taking yang sudah ada biasanya berfokus pada manusia, bukan pada kebutuhan agen untuk melakukan CRUD penuh secara aman.

Aplikasi ini dibuat untuk menjembatani kebutuhan tersebut: manusia tetap punya UI yang nyaman, sementara agen AI punya API yang jelas, aman, dan lengkap untuk mengelola catatan.

---

## 3. Masalah yang Diselesaikan

### 3.1 Masalah User

User membutuhkan tempat mencatat yang:

- cepat dipakai dari HP maupun desktop;
- bisa menyimpan catatan cepat dan catatan panjang;
- mendukung tag dan ruang/space;
- bisa diakses oleh agen AI eksternal;
- punya kontrol akses yang jelas;
- tidak mengandung fitur AI internal yang menambah kompleksitas dan biaya.

### 3.2 Masalah Agen AI

Agen AI membutuhkan backend memori yang:

- mudah ditulis;
- mudah dibaca;
- mudah dicari;
- punya API stabil;
- mendukung token khusus agen;
- mendukung permission dan scope;
- mengembalikan data dalam format yang mudah diproses.

### 3.3 Masalah Produk Existing

Banyak note taking app fokus pada UI manusia, bukan agent control. Sementara database seperti Supabase terlalu mentah untuk user biasa. Produk ini berada di tengah:

> UI note taking sederhana + database terstruktur + API untuk agen.

---

## 4. Tujuan Produk

### 4.1 Tujuan Utama

Membuat aplikasi catatan yang bisa menjadi **memory backend** untuk agen AI eksternal.

### 4.2 Tujuan Spesifik

1. User bisa membuat dan mengelola catatan lewat UI web/PWA.
2. User bisa membuat agent key untuk agen eksternal.
3. Agen bisa melakukan CRUD penuh terhadap catatan sesuai izin.
4. User bisa melihat aktivitas agen melalui audit log.
5. Aplikasi tetap nyaman diakses di layar sempit HP.
6. Aplikasi tidak memiliki fitur AI internal.

---

## 5. Non-Goals

Produk ini tidak bertujuan menjadi:

- Notion clone;
- Obsidian clone;
- Standard Notes clone terenkripsi penuh;
- chatbot AI;
- aplikasi RAG internal;
- aplikasi kolaborasi tim;
- database spreadsheet seperti Airtable;
- project management app;
- native mobile app.

Fitur berikut **tidak masuk MVP**:

- AI search internal;
- auto-summary;
- auto-tagging;
- built-in chatbot;
- Telegram integration bawaan;
- end-to-end encryption;
- collaboration multi-user;
- attachment/file upload;
- full offline sync;
- kanban;
- calendar;
- reminder.

---

## 6. Target User

### 6.1 Primary User

Power user AI yang menggunakan agen eksternal, misalnya:

- pengguna OpenClaw;
- pengguna Claude Code;
- pengguna Codex;
- pengguna Cursor Agent;
- developer yang membangun agen pribadi;
- knowledge worker yang ingin catatannya bisa dikontrol agen.

### 6.2 Secondary User

Pengguna umum yang ingin note taking app sederhana dan cepat, meski tidak langsung memakai agen AI.

---

## 7. Positioning Produk

Produk ini diposisikan sebagai:

> Agent-controlled note database with a human-friendly PWA interface.

Bukan:

> AI note taking app.

Perbedaan utamanya:

| Produk | Fokus |
|---|---|
| Notion | Workspace dan database visual |
| Standard Notes | Catatan privat terenkripsi |
| Obsidian | Markdown lokal dan knowledge graph |
| Blinko | Note taking dengan AI bawaan |
| Produk ini | Database catatan yang bisa dikontrol agen eksternal |

---

## 8. Prinsip Desain Produk

1. **Agent-first API, human-friendly UI**  
   API untuk agen harus dianggap fitur inti, bukan tambahan.

2. **No built-in AI**  
   Aplikasi tidak melakukan reasoning, summarization, embedding, atau auto-tagging.

3. **Mobile-first PWA**  
   User harus nyaman membuat dan mengedit catatan dari HP.

4. **Markdown-friendly**  
   Format utama catatan panjang adalah Markdown karena mudah dibaca manusia dan agen.

5. **Full control, but auditable**  
   Agen boleh diberi kontrol penuh, tetapi semua aksinya harus tercatat.

6. **Simple data model**  
   Jangan membangun struktur rumit seperti Notion database.

7. **Secure by default**  
   Agent key harus aman, dapat dicabut, dan tidak disimpan dalam bentuk plaintext.

---

## 9. Tipe Catatan

Aplikasi mendukung dua tipe catatan utama dalam satu tabel `notes`.

### 9.1 Capture

Capture adalah catatan cepat atau raw memory.

Contoh:

> Cek lagi Cloudflare Worker buat proxy Apps Script.

Karakteristik:

- cepat dibuat;
- judul opsional;
- konten bisa pendek;
- default masuk Inbox;
- bisa dibuat user atau agen;
- bisa diproses menjadi Note.

Default value:

```sql
type = 'capture'
status = 'inbox'
content_format = 'plain'
```

### 9.2 Note

Note adalah catatan panjang atau organized knowledge.

Contoh:

> Dokumentasi Setup OpenClaw di VPS Helsinki

Karakteristik:

- punya judul;
- konten panjang;
- memakai Markdown;
- bisa punya tag dan space;
- cocok untuk dokumentasi, hasil rapat, SOP, draft, atau knowledge base.

Default value:

```sql
type = 'note'
status = 'active'
content_format = 'markdown'
```

### 9.3 Konversi Capture ke Note

Agen atau user dapat mengubah Capture menjadi Note.

Contoh request:

```http
PATCH /api/v1/notes/:id
Authorization: Bearer mem_live_xxx
Content-Type: application/json
```

```json
{
  "type": "note",
  "title": "Rencana Cloudflare Worker untuk Apps Script",
  "content": "# Rencana Cloudflare Worker\n\n...",
  "status": "active",
  "tags": ["cloudflare", "apps-script", "proxy"]
}
```

Prinsip:

> Capture = raw memory.  
> Note = organized knowledge.

---

## 10. Fitur MVP

### 10.1 Authentication

User login ke aplikasi menggunakan Supabase Auth.

MVP auth method:

- email magic link; atau
- Google OAuth.

Requirement:

- user hanya bisa melihat data miliknya sendiri;
- semua data harus memiliki `user_id`;
- akses web UI memakai session Supabase;
- akses agen memakai agent key, bukan session Supabase user.

---

### 10.2 Notes CRUD

User dapat:

- membuat Capture;
- membuat Note;
- membaca detail catatan;
- mengedit catatan;
- menghapus catatan;
- mengarsipkan catatan;
- memfilter berdasarkan type, status, tag, dan space.

Agen juga dapat melakukan operasi yang sama melalui API jika permission mengizinkan.

---

### 10.3 Inbox

Inbox adalah tempat default untuk Capture.

Fitur Inbox:

- daftar Capture berstatus `inbox`;
- search;
- filter by tag;
- convert to Note;
- archive;
- delete.

Agen dapat mengambil daftar item Inbox melalui API untuk diproses.

---

### 10.4 Notes List

Halaman Notes menampilkan catatan panjang berstatus `active`.

Fitur:

- list catatan;
- search keyword;
- filter tag;
- filter space;
- pagination;
- sort by updated_at;
- indikator dibuat oleh user atau agen.

---

### 10.5 Markdown Editor

Untuk MVP, editor utama adalah Markdown editor sederhana.

Komponen:

- title input;
- Markdown textarea;
- preview toggle;
- tag selector;
- space selector;
- save status.

Di desktop, bisa mendukung split view:

```text
Editor | Preview
```

Di mobile, gunakan toggle:

```text
Edit / Preview
```

Alasan memilih Markdown:

- mudah dibaca agen;
- mudah diekspor;
- tidak serumit rich text;
- cocok untuk dokumentasi dan catatan teknis.

---

### 10.6 Tags

User dapat mengelola tag.

Fitur:

- create tag;
- rename tag;
- delete tag;
- assign tag ke catatan;
- filter catatan berdasarkan tag.

Tag memiliki:

- name;
- color opsional;
- slug opsional.

Agen juga dapat mengelola tag melalui API jika permission mengizinkan.

---

### 10.7 Spaces

Space adalah ruang pengelompokan catatan yang lebih besar dari tag.

Contoh:

- Personal;
- Work;
- OpenClaw;
- Petanusa;
- Jurnalistik;
- Finance.

Fitur:

- create space;
- edit space;
- delete space jika kosong;
- assign note ke space;
- filter berdasarkan space.

Untuk MVP, satu catatan hanya berada di satu space.

---

### 10.8 Search Keyword

Aplikasi menyediakan search keyword biasa, bukan semantic search.

Fitur:

- search by title;
- search by content;
- filter by type;
- filter by tag;
- filter by space;
- filter by status.

Implementation:

- PostgreSQL full-text search; atau
- `ilike` untuk MVP awal.

Tidak ada embedding/pgvector di MVP karena aplikasi tidak memiliki fitur AI internal.

---

### 10.9 Agent Access Management

User dapat membuat akses untuk agen eksternal.

Lokasi UI:

```text
Settings -> Agent Access
```

Fitur:

- create agent key;
- lihat daftar agent key;
- lihat last used;
- revoke key;
- rotate key;
- atur permission;
- atur scope;
- lihat contoh penggunaan API.

Preset permission:

1. Read Only
2. Read + Write
3. Full Control
4. Custom

---

### 10.10 Agent API

Agen mengakses aplikasi melalui API dengan header:

```http
Authorization: Bearer mem_live_xxxxxxxxx
```

Agen tidak login ke Supabase langsung.

Semua request agen masuk lewat Next.js API route:

```text
Agent -> Next.js API -> permission check -> Supabase
```

---

### 10.11 Audit Log

Semua aksi agen harus dicatat.

Contoh log:

- Sisu created note "OpenClaw VPS".
- Sisu updated tag `#github`.
- Sisu searched notes with query "cloudflare worker".
- Sisu deleted note "Draft lama".

Audit log minimal mencatat:

- agent key;
- action;
- resource type;
- resource id;
- metadata;
- timestamp;
- IP address opsional;
- user agent opsional.

---

### 10.12 PWA

Aplikasi harus bisa dipasang ke home screen HP.

Requirement:

- manifest;
- icons;
- theme color;
- service worker;
- offline shell;
- draft local untuk capture baru.

Untuk MVP, offline support dibatasi:

- user bisa membuat draft capture saat offline;
- draft disimpan lokal;
- user bisa submit saat online kembali.

Full offline sync tidak masuk MVP.

---

## 11. Agent Integration Flow

### 11.1 Membuat Agent Key

Flow:

1. User buka Settings.
2. User pilih Agent Access.
3. User klik Create Agent Key.
4. User mengisi nama agen.
5. User memilih permission preset.
6. User memilih scope.
7. Aplikasi membuat token.
8. Token ditampilkan sekali.
9. User memasukkan token ke agen eksternal.

Contoh output:

```text
API URL:
https://notes.example.com/api/v1

API Key:
mem_live_xxxxxxxxxxxxxxxxx
```

Token hanya ditampilkan sekali.

---

### 11.2 Menyimpan Token

Token plaintext tidak disimpan di database.

Database hanya menyimpan:

- key prefix;
- key hash;
- created_at;
- last_used_at;
- revoked_at.

Contoh:

```text
plaintext: mem_live_abc123...
prefix: mem_live_abc1
hash: sha256(token + server_secret)
```

---

### 11.3 Agen Menggunakan API

Contoh membuat Capture:

```http
POST /api/v1/notes
Authorization: Bearer mem_live_xxx
Content-Type: application/json
```

```json
{
  "type": "capture",
  "content": "Cek lagi Cloudflare Worker buat proxy Apps Script.",
  "tags": ["cloudflare", "apps-script"],
  "status": "inbox"
}
```

Contoh membuat Note:

```json
{
  "type": "note",
  "title": "Dokumentasi OpenClaw di VPS",
  "content": "# Dokumentasi OpenClaw di VPS\n\nOpenClaw berjalan di VPS Helsinki...",
  "content_format": "markdown",
  "tags": ["openclaw", "vps"],
  "space_id": "space_123",
  "status": "active"
}
```

---

### 11.4 Scope Agen

Agen dapat dibatasi berdasarkan:

- semua catatan;
- space tertentu;
- tag tertentu;
- status tertentu;
- type tertentu.

Contoh scope:

```json
{
  "spaces": ["openclaw", "petanusa"],
  "tags": ["ai", "github", "vps"],
  "allow_private": false
}
```

Untuk MVP, karena tidak ada enkripsi/private note kompleks, field `allow_private` bisa ditunda.

---

## 12. Permission Model

### 12.1 Permission Object

Contoh permission:

```json
{
  "notes": {
    "create": true,
    "read": true,
    "update": true,
    "delete": true,
    "archive": true
  },
  "tags": {
    "create": true,
    "read": true,
    "update": true,
    "delete": true
  },
  "spaces": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false
  }
}
```

### 12.2 Preset Permission

#### Read Only

```json
{
  "notes": { "read": true },
  "tags": { "read": true },
  "spaces": { "read": true }
}
```

#### Read + Write

```json
{
  "notes": { "create": true, "read": true, "update": true },
  "tags": { "read": true },
  "spaces": { "read": true }
}
```

#### Full Control

```json
{
  "notes": { "create": true, "read": true, "update": true, "delete": true, "archive": true },
  "tags": { "create": true, "read": true, "update": true, "delete": true },
  "spaces": { "create": true, "read": true, "update": true, "delete": true }
}
```

---

## 13. API Specification

Base URL:

```text
/api/v1
```

Authentication:

```http
Authorization: Bearer mem_live_xxx
```

### 13.1 Notes

#### List Notes

```http
GET /api/v1/notes
```

Query params:

```text
type=capture|note
status=inbox|active|archived|deleted
space_id=uuid
tag=slug
q=keyword
limit=50
offset=0
```

Response:

```json
{
  "data": [
    {
      "id": "note_123",
      "type": "capture",
      "title": null,
      "content": "Cek Cloudflare Worker...",
      "content_format": "plain",
      "status": "inbox",
      "tags": ["cloudflare"],
      "space": null,
      "created_at": "2026-06-07T08:00:00Z",
      "updated_at": "2026-06-07T08:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

#### Create Note

```http
POST /api/v1/notes
```

Body:

```json
{
  "type": "note",
  "title": "Judul Catatan",
  "content": "# Isi catatan",
  "content_format": "markdown",
  "status": "active",
  "space_id": "uuid",
  "tags": ["openclaw", "vps"]
}
```

#### Get Note

```http
GET /api/v1/notes/:id
```

#### Update Note

```http
PATCH /api/v1/notes/:id
```

#### Delete Note

```http
DELETE /api/v1/notes/:id
```

Default delete behavior untuk MVP:

- soft delete dengan `status = deleted`.

Hard delete bisa ditambahkan kemudian.

---

### 13.2 Tags

```http
GET /api/v1/tags
POST /api/v1/tags
PATCH /api/v1/tags/:id
DELETE /api/v1/tags/:id
```

Create tag body:

```json
{
  "name": "openclaw",
  "color": "#00599A"
}
```

---

### 13.3 Spaces

```http
GET /api/v1/spaces
POST /api/v1/spaces
PATCH /api/v1/spaces/:id
DELETE /api/v1/spaces/:id
```

Create space body:

```json
{
  "name": "OpenClaw",
  "description": "Catatan tentang OpenClaw dan agent workflow."
}
```

---

### 13.4 Search

```http
GET /api/v1/search?q=openclaw&type=note&limit=20
```

Search adalah keyword search, bukan semantic search.

Response:

```json
{
  "data": [
    {
      "id": "note_123",
      "title": "OpenClaw VPS",
      "excerpt": "OpenClaw berjalan di VPS Helsinki...",
      "type": "note",
      "tags": ["openclaw", "vps"],
      "updated_at": "2026-06-07T08:00:00Z"
    }
  ]
}
```

---

### 13.5 Export

Endpoint export untuk agen.

```http
GET /api/v1/export
```

Query params:

```text
format=json|markdown
space_id=uuid
tag=slug
status=active
```

Kegunaan:

- agen menarik seluruh catatan yang boleh diakses;
- agen membuat embedding di sisinya sendiri;
- agen melakukan backup atau analisis eksternal.

---

### 13.6 Activity

```http
GET /api/v1/activity
```

Response:

```json
{
  "data": [
    {
      "id": "log_123",
      "agent_name": "Sisu",
      "action": "notes.create",
      "resource_type": "note",
      "resource_id": "note_123",
      "metadata": {
        "title": "OpenClaw VPS"
      },
      "created_at": "2026-06-07T08:00:00Z"
    }
  ]
}
```

---

## 14. Web UI Information Architecture

### 14.1 Desktop Layout

Desktop menggunakan sidebar kiri.

```text
Sidebar
- Inbox
- Notes
- Tags
- Spaces
- Archive
- Settings
  - Agent Access
  - Activity Log

Main Content
- List / Detail / Editor
```

### 14.2 Mobile Layout

Mobile menggunakan bottom navigation.

```text
Inbox | Notes | Capture | Tags | Settings
```

Tombol Capture harus paling mudah dijangkau.

Mobile tidak menggunakan layout dua kolom. Flow:

```text
List screen -> Detail screen -> Edit screen
```

---

## 15. Mobile-First PWA Requirements

Aplikasi harus nyaman digunakan di layar sempit HP meski hanya berupa PWA.

### 15.1 Prinsip Mobile

1. Mobile bukan versi sekunder.
2. Quick Capture harus bisa dibuat sangat cepat.
3. Jangan memaksa layout desktop ke mobile.
4. Tombol utama harus mudah dijangkau ibu jari.
5. Editor mobile harus sederhana.
6. Agent settings tetap bisa diakses, tetapi tidak perlu dominan.

### 15.2 Mobile Acceptance Criteria

1. User bisa membuat Capture baru dalam maksimal 2 tap dari halaman utama.
2. User bisa membaca, mengedit, menghapus, dan memberi tag catatan dari HP.
3. User bisa membuka aplikasi dari home screen sebagai PWA.
4. User bisa membuat draft Capture saat offline.
5. User bisa melihat agent aktif dari HP.
6. User bisa revoke agent key dari HP.
7. User bisa melihat activity log dari HP.

---

## 16. Screen Requirements

### 16.1 Inbox Screen

Menampilkan Capture berstatus `inbox`.

Komponen:

- search input;
- filter type/status;
- list capture;
- action: convert to note;
- action: archive;
- action: delete;
- indicator created by user/agent.

Mobile:

- list card sederhana;
- satu kolom;
- FAB Capture.

---

### 16.2 Notes Screen

Menampilkan Note berstatus `active`.

Komponen:

- search;
- filter tag;
- filter space;
- sort;
- pagination;
- create note button.

---

### 16.3 Capture Screen

Form cepat untuk membuat Capture.

Field:

- content;
- tags opsional;
- space opsional;
- save.

Tidak perlu title wajib.

---

### 16.4 Note Detail Screen

Mode baca catatan.

Komponen:

- title;
- rendered Markdown;
- tags;
- space;
- metadata;
- edit button;
- more menu.

---

### 16.5 Note Editor Screen

Form edit Note.

Field:

- title;
- Markdown content;
- tags;
- space;
- status;
- save button;
- save indicator.

Mobile:

- tab Edit / Preview.

Desktop:

- optional split view Editor / Preview.

---

### 16.6 Tags Screen

Fitur:

- list tags;
- create tag;
- rename tag;
- delete tag;
- lihat jumlah catatan per tag.

---

### 16.7 Spaces Screen

Fitur:

- list spaces;
- create space;
- edit space;
- delete space jika kosong;
- lihat jumlah catatan per space.

---

### 16.8 Agent Access Screen

Fitur:

- list agent keys;
- create agent key;
- permission preset;
- scope setting;
- last used;
- revoke;
- rotate;
- example API request.

Setelah token dibuat, tampilkan hanya sekali.

---

### 16.9 Activity Log Screen

Fitur:

- list aktivitas agen;
- filter by agent;
- filter by action;
- filter by resource;
- timestamp;
- metadata ringkas.

---

## 17. Database Schema

### 17.1 users

Supabase Auth menyediakan tabel auth. Untuk profile tambahan:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 17.2 spaces

```sql
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, slug)
);
```

### 17.3 notes

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid references public.spaces(id) on delete set null,

  type text not null default 'capture' check (type in ('capture', 'note')),
  title text,
  content text not null default '',
  content_format text not null default 'plain' check (content_format in ('plain', 'markdown')),
  status text not null default 'inbox' check (status in ('inbox', 'active', 'archived', 'deleted')),

  created_by text not null default 'user' check (created_by in ('user', 'agent')),
  updated_by text not null default 'user' check (updated_by in ('user', 'agent')),
  created_by_agent_key_id uuid,
  updated_by_agent_key_id uuid,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);
```

### 17.4 tags

```sql
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, slug)
);
```

### 17.5 note_tags

```sql
create table public.note_tags (
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (note_id, tag_id)
);
```

### 17.6 agent_keys

```sql
create table public.agent_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  permissions jsonb not null,
  scope jsonb,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(key_hash)
);
```

### 17.7 agent_activity_logs

```sql
create table public.agent_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agent_key_id uuid references public.agent_keys(id) on delete set null,
  action text not null,
  resource_type text,
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);
```

---

## 18. Row-Level Security

RLS harus aktif untuk tabel:

- profiles;
- notes;
- tags;
- note_tags;
- spaces;
- agent_keys;
- agent_activity_logs.

Prinsip RLS untuk web UI:

```sql
user_id = auth.uid()
```

Agent API tidak mengandalkan Supabase client anon langsung dari agen. Agen masuk lewat Next.js API route. Server menggunakan service role atau server client, lalu melakukan permission check manual.

Penting:

- Service role key tidak pernah terekspos ke browser.
- Agent key tidak pernah memberi akses langsung ke Supabase.
- Semua permission agen dicek di server.

---

## 19. Stack Teknis

### 19.1 Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Markdown editor sederhana

### 19.2 Backend

- Next.js Route Handlers
- Supabase Postgres
- Supabase Auth
- Supabase RLS

### 19.3 Hosting

- Vercel untuk Next.js
- Supabase untuk database/auth

### 19.4 PWA

- next-pwa atau konfigurasi custom service worker
- manifest web app
- local draft storage

---

## 20. Struktur Folder Next.js

```text
app/
  (app)/
    inbox/
      page.tsx
    notes/
      page.tsx
      [id]/
        page.tsx
        edit/
          page.tsx
    capture/
      page.tsx
    tags/
      page.tsx
    spaces/
      page.tsx
    settings/
      page.tsx
      agent-access/
        page.tsx
      activity/
        page.tsx

  api/
    v1/
      notes/
        route.ts
        [id]/
          route.ts
      tags/
        route.ts
        [id]/
          route.ts
      spaces/
        route.ts
        [id]/
          route.ts
      search/
        route.ts
      export/
        route.ts
      activity/
        route.ts

components/
  layout/
  notes/
  capture/
  tags/
  spaces/
  agent-access/
  activity/
  editor/
  ui/

lib/
  supabase/
  auth/
  agent-auth.ts
  permissions.ts
  audit-log.ts
  validators/
  markdown/
```

---

## 21. Security Requirements

### 21.1 Agent Key Security

- Token ditampilkan sekali.
- Token disimpan sebagai hash.
- Token bisa dicabut.
- Token bisa dirotasi.
- Token punya prefix untuk identifikasi.
- Token punya permission dan scope.

### 21.2 API Security

- Semua endpoint API agen wajib cek token.
- Semua endpoint wajib cek permission.
- Semua endpoint wajib cek ownership user.
- Rate limit per agent key.
- Audit log untuk semua write operation.
- Audit log untuk search/read operation minimal metadata.

### 21.3 Data Safety

- Soft delete default.
- Delete permanen bisa ditunda.
- Activity log tidak boleh mudah dihapus oleh agen.
- Agent tidak boleh membuat agent key baru.
- Agent tidak boleh revoke key lain.

---

## 22. Rate Limiting

MVP rate limit:

- 60 request/minute per agent key;
- 1.000 request/day per agent key default;
- konfigurasi limit bisa ditambahkan di V2.

Jika limit terlampaui:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Agent key exceeded request limit."
}
```

---

## 23. Error Response Standard

Gunakan format error konsisten.

```json
{
  "error": "permission_denied",
  "message": "This agent key does not have permission to delete notes.",
  "details": {}
}
```

Contoh error code:

- `invalid_token`
- `revoked_token`
- `permission_denied`
- `scope_denied`
- `not_found`
- `validation_error`
- `rate_limit_exceeded`
- `internal_error`

---

## 24. Acceptance Criteria MVP

### 24.1 User CRUD

- User bisa login.
- User bisa membuat Capture.
- User bisa membuat Note.
- User bisa mengedit Note.
- User bisa menghapus atau mengarsipkan catatan.
- User bisa memberi tag.
- User bisa membuat space.

### 24.2 Agent Access

- User bisa membuat agent key.
- Token hanya ditampilkan sekali.
- User bisa revoke token.
- User bisa melihat last used.
- User bisa melihat log aktivitas.

### 24.3 Agent API

- Agen bisa create note.
- Agen bisa read note.
- Agen bisa update note.
- Agen bisa delete note jika punya izin.
- Agen bisa search keyword.
- Agen bisa list tags dan spaces.
- Semua aksi agen tercatat.

### 24.4 Mobile PWA

- User bisa install PWA.
- User bisa membuat Capture dalam maksimal 2 tap.
- User bisa mengedit Note dari HP.
- User bisa revoke agent key dari HP.
- User bisa membuat draft Capture saat offline.

---

## 25. Roadmap

### MVP

- Auth
- Capture
- Notes
- Tags
- Spaces
- Markdown editor
- Agent key
- Agent API CRUD
- Audit log
- Mobile-first PWA

### V1.1

- Better search dengan PostgreSQL full-text search
- Export Markdown/JSON
- Bulk actions
- Import Markdown
- Improved audit filters
- Rate limit dashboard

### V1.2

- Webhook untuk agent events
- Agent-specific scopes lebih granular
- API docs page
- OpenAPI spec
- Personal access token management lebih lengkap

### V2

- Attachments
- Full offline sync
- Version history
- Note backlinks manual
- Public share optional
- Multi-workspace

### Tidak Direncanakan Saat Ini

- Built-in AI
- Semantic search internal
- Telegram bot bawaan
- End-to-end encryption
- Team collaboration

---

## 26. Open Questions

1. Apakah MVP memakai Google OAuth, magic link, atau keduanya?
2. Apakah Capture boleh punya title opsional atau sepenuhnya tanpa title?
3. Apakah delete oleh agen default soft delete atau archive?
4. Apakah user perlu private note yang tidak bisa diakses agen?
5. Apakah Markdown editor cukup, atau perlu rich text di V2?
6. Apakah agent key dibuat hanya dari desktop, atau mobile creation juga wajib nyaman?
7. Apakah aplikasi perlu public API docs sejak MVP?

---

## 27. Kesimpulan

Aplikasi ini adalah note taking app yang sengaja dibuat sederhana di sisi UI, tetapi kuat di sisi API. Fokusnya bukan menambahkan AI ke dalam aplikasi, melainkan membuat catatan mudah dikontrol oleh agen AI eksternal.

Formula produk:

```text
Mobile-first notes UI
+
Structured Supabase database
+
Secure agent API
+
Permission and audit layer
=
Agent-controlled note database
```

Produk ini cocok untuk pengguna yang sudah memiliki agen AI sendiri dan membutuhkan satu tempat yang rapi untuk menyimpan, membaca, mengubah, dan mengelola memori kerja mereka.

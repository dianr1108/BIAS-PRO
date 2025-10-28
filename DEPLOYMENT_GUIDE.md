# 🚀 BIAS Deployment Guide
## Panduan Lengkap Download & Setup di Server Sendiri

**Untuk:** Pemula yang baru pertama kali deploy aplikasi  
**Waktu Setup:** ~30-60 menit  
**Tingkat Kesulitan:** ⭐⭐☆☆☆ (Mudah-Sedang)

---

## 📋 YANG LO BUTUHIN

### Hardware/Server:
- [ ] **Komputer/VPS dengan minimal:**
  - RAM: 2GB+ (recommended 4GB)
  - CPU: 2 Core
  - Storage: 10GB free space
  - OS: Ubuntu 20.04+ / Debian 11+ / CentOS 8+

### Software yang Harus Diinstall:
- [ ] Node.js v18+ (LTS)
- [ ] npm v9+
- [ ] (Optional) PostgreSQL 14+ untuk database

### Akses:
- [ ] SSH access ke server
- [ ] Google Gemini API Key (untuk AI features - FREE tier available!)
- [ ] Domain/subdomain (optional, bisa pakai IP dulu)

---

## 🎯 OVERVIEW: 3 LANGKAH UTAMA

```
1. DOWNLOAD SOURCE CODE dari Replit
   ↓
2. UPLOAD & SETUP di Server
   ↓
3. RUNNING & MONITORING
```

Mari kita mulai! 👇

---

## 📥 STEP 1: DOWNLOAD SOURCE CODE DARI REPLIT

### **Cara 1: Via Replit UI (PALING GAMPANG)**

1. **Buka Replit Project BIAS** (bias23.replit.app)

2. **Klik Menu Files** di sidebar kiri

3. **Klik 3 dots (⋮)** di header "Files"

4. **Pilih "Download as ZIP"**
   ```
   ⋮ Menu
   └── Download as ZIP  ← KLIK INI
   ```

5. **File akan ke-download** ke komputer lo
   - Nama file: `bias23.zip` atau `BIAS.zip`
   - Size: ~10-20MB (tergantung file yang ada)

6. **Extract ZIP file**
   - Windows: Klik kanan → Extract All
   - Mac: Double-click ZIP file
   - Linux: `unzip bias23.zip`

### **Cara 2: Via Git Clone (Alternatif)**

```bash
# Kalau Replit project punya Git repo
git clone https://github.com/your-username/bias.git
cd bias/
```

---

## 🧹 STEP 2: CLEANUP FILE (SEBELUM UPLOAD)

Sebelum upload ke server, **HAPUS FILE YANG GAK PERLU** biar lebih ringan:

```bash
# Masuk ke folder hasil extract
cd BIAS/

# Hapus folder berat (akan di-install ulang di server)
rm -rf node_modules/        # ~200-300MB
rm -rf .replit              # Replit config (gak perlu)
rm -rf .cache/              # Cache files

# Hapus file uploaded user (optional)
rm -rf attached_assets/*    # Kalau ada file uploaded testing

# (OPTIONAL) Hapus dokumentasi kalau mau lebih ringan
# rm -rf *.md
```

**Setelah cleanup, folder jadi ~2-5MB aja!** Jauh lebih cepat upload!

---

## 📤 STEP 3: UPLOAD KE SERVER

### **Option A: Upload via SCP (Command Line)**

```bash
# Format:
# scp -r [folder-lokal] [user]@[server-ip]:[target-path]

# Contoh:
scp -r BIAS/ root@203.0.113.10:/var/www/

# Masukkan password server kalau diminta
# Progress akan muncul, tunggu sampai selesai
```

### **Option B: Upload via SFTP Client (GUI)**

**Pakai software:** FileZilla, WinSCP, Cyberduck

**Setup FileZilla:**
1. **Download FileZilla Client** (gratis)
2. **Buka FileZilla**
3. **Isi connection:**
   ```
   Host:     sftp://203.0.113.10  (IP server lo)
   Username: root                  (atau user lo)
   Password: ********              (password server)
   Port:     22                     (default SSH)
   ```
4. **Click "Quickconnect"**
5. **Drag & drop** folder `BIAS/` dari kiri ke kanan
6. **Tunggu upload selesai** (2-5 menit tergantung internet)

### **Option C: Upload via Web Panel (cPanel/Plesk)**

1. **Login ke cPanel/Plesk**
2. **Buka "File Manager"**
3. **Navigate ke folder web** (biasanya `/public_html/` atau `/var/www/`)
4. **Click "Upload"**
5. **Upload ZIP file** `bias23.zip`
6. **Extract di server** (klik kanan → Extract)

---

## 🛠️ STEP 4: INSTALL NODE.JS DI SERVER

### **Cek Apakah Node.js Sudah Terinstall:**

```bash
# SSH ke server
ssh root@203.0.113.10

# Cek Node version
node -v

# Cek npm version
npm -v
```

**Kalau muncul error "command not found", artinya belum install.**

### **Install Node.js v18 (LTS):**

#### **Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v    # Harus muncul: v18.x.x
npm -v     # Harus muncul: 9.x.x
```

#### **CentOS/RHEL:**
```bash
# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify
node -v
npm -v
```

#### **Via NVM (Recommended untuk Multi-Version):**
```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node -v
```

---

## 🔧 STEP 5: SETUP APLIKASI DI SERVER

### **5.1 - Masuk ke Folder Aplikasi**

```bash
# SSH ke server (kalau belum)
ssh root@203.0.113.10

# Masuk ke folder BIAS
cd /var/www/BIAS/

# Atau sesuai tempat lo upload
# cd /home/user/BIAS/
```

### **5.2 - Install Dependencies**

```bash
# Install semua npm packages
npm install

# Ini akan download ~500+ packages
# Estimasi waktu: 2-5 menit
# Estimasi size: ~200-300MB

# Tunggu sampai muncul:
# "added 567 packages, and audited 568 packages in 2m"
```

**Kalau ada error saat install:**
```bash
# Clear cache dulu
npm cache clean --force

# Hapus node_modules & package-lock
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### **5.3 - Buat File Environment Variables**

```bash
# Buat file .env
nano .env

# Atau pakai vim/vi kalau prefer:
# vim .env
```

**Isi file .env dengan:**
```bash
# Production mode
NODE_ENV=production

# Port aplikasi (default 5000)
PORT=5000

# Google Gemini API Key (WAJIB untuk AI features)
# Get from: https://aistudio.google.com/apikey (FREE tier: 15 RPM, 1M tokens/month!)
GEMINI_API_KEY=AIzaSy-xxxxxxxxxxxxxxxxxxxxxxxx

# Session secret (random string minimal 32 karakter)
SESSION_SECRET=bias-super-secret-key-change-this-to-random-string

# Database URL (OPTIONAL - kalau pakai PostgreSQL)
# Kalau gak ada, aplikasi pakai in-memory storage
# DATABASE_URL=postgresql://user:password@localhost:5432/bias_db
```

**Save file:**
- Kalau pakai `nano`: Press `Ctrl + X`, terus `Y`, terus `Enter`
- Kalau pakai `vim`: Press `Esc`, ketik `:wq`, terus `Enter`

### **5.4 - Build Production**

```bash
# Build frontend (compile React → static files)
npm run build

# Ini akan generate folder 'dist/' dengan optimized files
# Estimasi waktu: 1-2 menit

# Output:
# ✓ 234 modules transformed.
# dist/index.html                   4.23 kB
# dist/assets/index-xyz123.js     234.56 kB
# dist/assets/index-abc456.css     12.34 kB
```

---

## ▶️ STEP 6: JALANKAN APLIKASI

### **Option A: Test Mode (Development)**

```bash
# Jalankan dalam mode development (untuk testing)
npm run dev

# Server akan start di port 5000
# Output:
# [BIAS] Seeding viral trends...
# [BIAS] Successfully seeded 8 viral trends
# 5:00:00 PM [express] serving on port 5000

# Buka browser: http://YOUR-SERVER-IP:5000
# Contoh: http://203.0.113.10:5000
```

**Untuk stop server:** Press `Ctrl + C`

### **Option B: Production Mode (Manual)**

```bash
# Jalankan dalam mode production
NODE_ENV=production node server/index.js

# Tapi ini akan stop kalau lo close terminal!
# Gunakan PM2 untuk auto-restart (lihat Option C)
```

### **Option C: PM2 Process Manager (RECOMMENDED!)**

PM2 akan:
- ✅ Auto-restart kalau crash
- ✅ Jalan di background
- ✅ Auto-start saat server reboot
- ✅ Monitoring & logs

**Install PM2:**
```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 -v
```

**Start aplikasi dengan PM2:**
```bash
# Start BIAS app
pm2 start server/index.js --name "bias"

# Atau kalau mau multi-instance (untuk load balancing):
# pm2 start server/index.js --name "bias" -i max

# Output:
# ┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┐
# │ id  │ name     │ mode        │ ↺       │ status  │ cpu      │
# ├─────┼──────────┼─────────────┼─────────┼─────────┼──────────┤
# │ 0   │ bias     │ fork        │ 0       │ online  │ 0%       │
# └─────┴──────────┴─────────────┴─────────┴─────────┴──────────┘
```

**PM2 Commands yang Berguna:**
```bash
# Lihat status aplikasi
pm2 status

# Lihat logs real-time
pm2 logs bias

# Restart aplikasi
pm2 restart bias

# Stop aplikasi
pm2 stop bias

# Delete dari PM2
pm2 delete bias

# Monitoring dashboard
pm2 monit

# Save PM2 config (supaya auto-start saat reboot)
pm2 save

# Setup auto-startup
pm2 startup
# Ikuti instruksi yang muncul (copy-paste command)
```

---

## 🌐 STEP 7: AKSES DARI BROWSER

### **Via IP Address:**
```
http://YOUR-SERVER-IP:5000

Contoh:
http://203.0.113.10:5000
```

### **Kalau Gak Bisa Diakses, Cek Firewall:**

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 5000/tcp
sudo ufw reload

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# Atau matikan firewall sementara (TESTING ONLY!)
# sudo ufw disable
# sudo systemctl stop firewalld
```

### **Cek Port Listening:**
```bash
# Pastikan aplikasi jalan di port 5000
sudo netstat -tulpn | grep 5000

# atau
sudo lsof -i :5000

# Output harus muncul node process
```

---

## 🔒 STEP 8 (OPTIONAL): SETUP NGINX & DOMAIN

Kalau lo punya domain (contoh: `bias.perusahaan.com`), setup Nginx biar bisa akses tanpa port `:5000`

### **8.1 - Install Nginx**

```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### **8.2 - Buat Nginx Config**

```bash
# Buat file config
sudo nano /etc/nginx/sites-available/bias

# Atau di CentOS:
# sudo nano /etc/nginx/conf.d/bias.conf
```

**Isi dengan:**
```nginx
server {
    listen 80;
    server_name bias.perusahaan.com;  # GANTI DENGAN DOMAIN LO!

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Aktifkan config:**
```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/bias /etc/nginx/sites-enabled/

# Test config valid atau tidak
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **8.3 - Point Domain ke Server**

Di DNS provider (Cloudflare, Namecheap, dll):
```
Type: A Record
Name: bias
Value: 203.0.113.10  (IP server lo)
TTL: Auto atau 3600
```

Tunggu 5-30 menit untuk DNS propagate.

### **8.4 - Setup SSL (HTTPS) GRATIS**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d bias.perusahaan.com

# Follow the prompts:
# - Enter email
# - Agree to terms
# - Auto-redirect HTTP to HTTPS? (Yes)

# Done! Sekarang bisa akses via:
# https://bias.perusahaan.com
```

**Auto-renewal SSL (sudah otomatis, tapi bisa test):**
```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job (sudah otomatis via systemd)
# Certificate akan auto-renew setiap 60 hari
```

---

## 🗄️ STEP 9 (OPTIONAL): SETUP DATABASE POSTGRESQL

By default, BIAS pakai **in-memory storage** (data hilang kalau restart).  
Kalau mau data persisten, setup PostgreSQL:

### **9.1 - Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **9.2 - Create Database & User**

```bash
# Login sebagai postgres user
sudo -u postgres psql

# Di PostgreSQL prompt (postgres=#):
CREATE DATABASE bias_db;
CREATE USER bias_user WITH PASSWORD 'StrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE bias_db TO bias_user;

# Exit
\q
```

### **9.3 - Update .env**

```bash
# Edit file .env
nano .env

# Tambahkan/update baris ini:
DATABASE_URL=postgresql://bias_user:StrongPassword123!@localhost:5432/bias_db

# Save & exit
```

### **9.4 - Run Migration**

```bash
# Push schema ke database
npx drizzle-kit push:pg

# Ini akan create semua tables:
# - users
# - analyses
# - livestream_sessions
# - competitors
# - trends
# - analytics_history
# - calendar_events
# - collaborations
# - export_reports

# Output:
# ✓ Pushing schema changes to database
# ✓ Tables created successfully
```

### **9.5 - Restart Aplikasi**

```bash
# Kalau pakai PM2:
pm2 restart bias

# Kalau manual:
# Stop (Ctrl+C) terus start ulang
```

---

## ✅ VERIFICATION CHECKLIST

Pastikan semua sudah jalan:

```bash
# 1. Node.js terinstall
node -v               # ✅ v18.x.x

# 2. Dependencies terinstall
ls node_modules/      # ✅ ada banyak folder

# 3. Environment variables loaded
cat .env              # ✅ ada GEMINI_API_KEY, dll

# 4. Build berhasil
ls dist/              # ✅ ada index.html, assets/, dll

# 5. PM2 running
pm2 status            # ✅ status: online

# 6. Port listening
sudo lsof -i :5000    # ✅ node process muncul

# 7. Bisa diakses dari browser
curl http://localhost:5000  # ✅ muncul HTML

# 8. (Optional) Nginx running
sudo systemctl status nginx  # ✅ active (running)

# 9. (Optional) SSL aktif
curl https://bias.perusahaan.com  # ✅ HTTPS works
```

---

## 📊 MONITORING & MAINTENANCE

### **Lihat Logs:**

```bash
# PM2 logs
pm2 logs bias

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### **Check Resource Usage:**

```bash
# PM2 monitoring
pm2 monit

# CPU & Memory
htop
# atau
top

# Disk space
df -h
```

### **Backup Data (Kalau Pakai PostgreSQL):**

```bash
# Backup database
pg_dump -U bias_user bias_db > bias_backup_$(date +%Y%m%d).sql

# Restore dari backup
psql -U bias_user bias_db < bias_backup_20251023.sql
```

---

## 🐛 TROUBLESHOOTING

### **Problem: "npm install" gagal**
```bash
# Solusi:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Problem: Port 5000 sudah dipakai**
```bash
# Check apa yang pakai port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 [PID]

# Atau ganti port di .env
echo "PORT=3000" >> .env
```

### **Problem: "Cannot find module..."**
```bash
# Reinstall dependencies
npm install

# Atau install specific package
npm install [package-name]
```

### **Problem: PM2 gak bisa start**
```bash
# Delete & restart
pm2 delete bias
pm2 start server/index.js --name bias

# Check logs
pm2 logs bias --err
```

### **Problem: Nginx 502 Bad Gateway**
```bash
# Pastikan aplikasi jalan
pm2 status

# Check Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### **Problem: Gemini API error**
```bash
# Verify API key di .env
cat .env | grep GEMINI

# Test API key (optional - Gemini doesn't have simple test endpoint)
# Best way: just try the chat feature in the app

# Kalau invalid, update .env dengan key yang baru
# Get new key from: https://aistudio.google.com/apikey
```

---

## 💰 BIAYA ESTIMASI

### **Self-Hosting di VPS:**

| Provider | Spec | Harga/Bulan |
|----------|------|-------------|
| Contabo VPS | 4GB RAM, 2 CPU | €5 (~Rp 85K) |
| Vultr | 2GB RAM, 1 CPU | $6 (~Rp 95K) |
| DigitalOcean | 2GB RAM, 2 CPU | $12 (~Rp 190K) |
| Hetzner Cloud | 4GB RAM, 2 CPU | €8 (~Rp 140K) |

### **Self-Hosting di Server Kantor (LAN):**

| Item | Biaya |
|------|-------|
| Hardware | FREE (pakai server existing) |
| Listrik | ~Rp 50K/bulan |
| **Total** | **~Rp 50K/bulan** |

### **Comparison vs Replit:**

```
Replit:           $25-40/bulan (~Rp 400-640K)
Self-Host VPS:    $5-12/bulan  (~Rp 85-190K)
Self-Host Office: ~Rp 50K/bulan

HEMAT: Rp 210K - 590K per bulan! 🎉
HEMAT SETAHUN: Rp 2.5 - 7 JUTA!
```

---

## 🎓 TIPS & BEST PRACTICES

### **Security:**
- ✅ Ganti SESSION_SECRET dengan random string kuat
- ✅ Setup firewall (hanya allow port 80, 443, 22)
- ✅ Regular update: `sudo apt update && sudo apt upgrade`
- ✅ Setup SSH key authentication (disable password login)
- ✅ Enable automatic security updates

### **Performance:**
- ✅ Pakai PM2 cluster mode: `pm2 start -i max`
- ✅ Setup Nginx caching untuk static files
- ✅ Monitor RAM usage dengan `pm2 monit`
- ✅ Setup swap memory kalau RAM kecil

### **Backup:**
- ✅ Backup database setiap hari (cron job)
- ✅ Backup .env file ke safe location
- ✅ Backup source code (git push to private repo)

---

## 📞 BANTUAN LEBIH LANJUT

**Kalau masih ada error atau bingung:**

1. **Check Logs:**
   ```bash
   pm2 logs bias --lines 100
   ```

2. **Search Error di Google:**
   - Copy exact error message
   - Tambah keyword "Node.js" atau "Express"

3. **Forum/Community:**
   - Stack Overflow
   - Reddit r/node
   - Discord server development

4. **Documentation:**
   - Node.js: https://nodejs.org/docs
   - PM2: https://pm2.keymetrics.io/docs
   - Nginx: https://nginx.org/en/docs

---

## ✨ SELAMAT!

**Kalau lo udah sampai sini dan aplikasi jalan, CONGRATS! 🎉**

Lo udah berhasil:
- ✅ Download source code dari Replit
- ✅ Upload & setup di server sendiri
- ✅ Install dependencies
- ✅ Configure environment
- ✅ Running aplikasi dengan PM2
- ✅ (Optional) Setup Nginx + SSL
- ✅ (Optional) Setup PostgreSQL database

**BIAS sekarang jalan di server lo sendiri!**  
**Hemat $480-840 per tahun!** 💰

---

**Version:** 1.0  
**Last Updated:** 23 Oktober 2025  
**Maintained by:** BIAS Development Team

**Happy Self-Hosting! 🚀**

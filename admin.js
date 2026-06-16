// Editor Hiring — Admin Dashboard
const SUPABASE_URL = "https://jbgvypuckdqzkkxgvsgb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3Z5cHVja2RxemtreGd2c2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTM1OTIsImV4cCI6MjA5NzEyOTU5Mn0.dLOK04jl49Bam9hK9MdpYd0Jz-cZwkBUMg53l70K9Ik";

const $ = (id) => document.getElementById(id);
let TOKEN = localStorage.getItem("hiring_token");
let USER = null;

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function authHeaders() {
  return {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  };
}

async function dbGet(endpoint) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function dbSend(method, endpoint, body, prefer = "return=minimal") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: { ...authHeaders(), "Prefer": prefer },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// Auth
async function login(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("بيانات الدخول غير صحيحة");
  const data = await res.json();
  return data;
}

async function getUser() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${TOKEN}`
    }
  });
  if (!res.ok) return null;
  return res.json();
}

function logout() {
  localStorage.removeItem("hiring_token");
  TOKEN = null;
  USER = null;
  $("dashSection").hidden = true;
  $("loginSection").hidden = false;
}

// Load Applications
async function loadApplications() {
  const list = $("appsList");
  try {
    const apps = await dbGet("editor_applications?select=*&order=created_at.desc");

    // Stats
    $("statTotal").textContent = apps.length;
    $("statNew").textContent = apps.filter(a => a.status === "new").length;
    $("statReviewed").textContent = apps.filter(a => a.status === "reviewed").length;

    if (!apps.length) {
      list.innerHTML = `<div class="empty-state"><span>📭</span><p>ما في طلبات بعد</p></div>`;
      return;
    }

    list.innerHTML = apps.map(app => {
      const date = new Date(app.created_at);
      const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
      const statusClass = app.status === "new" ? "status-new" :
                          app.status === "reviewed" ? "status-reviewed" : "status-rejected";
      const statusText = app.status === "new" ? "جديد" :
                         app.status === "reviewed" ? "تمت المراجعة" : "مرفوض";

      return `<div class="app-card" data-id="${app.id}">
        <div class="app-header">
          <div>
            <span class="app-name">${esc(app.name)}</span>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          <span class="app-date">${dateStr}</span>
        </div>
        <div class="app-info">
          <span>📧 <a href="mailto:${esc(app.email)}">${esc(app.email)}</a></span>
          ${app.phone ? `<span>📱 <a href="https://wa.me/${app.phone.replace(/\D/g,'')}">${esc(app.phone)}</a></span>` : ""}
        </div>
        <div class="app-info">
          <span>🎬 <a href="${esc(app.portfolio)}" target="_blank">البورتفوليو</a></span>
          ${app.test_video ? `<span>📹 <a href="${esc(app.test_video)}" target="_blank">التيست</a></span>` : ""}
        </div>
        ${app.notes ? `<div class="app-notes">${esc(app.notes)}</div>` : ""}
        <div class="app-actions">
          ${app.status === "new" ? `
            <button class="btn-sm btn-success" onclick="updateStatus('${app.id}', 'reviewed')">✓ تمت المراجعة</button>
            <button class="btn-sm btn-danger" onclick="updateStatus('${app.id}', 'rejected')">✕ رفض</button>
          ` : `
            <button class="btn-sm btn-ghost" onclick="updateStatus('${app.id}', 'new')">↩ إرجاع لجديد</button>
          `}
          <button class="btn-sm btn-danger" onclick="deleteApp('${app.id}')">حذف</button>
        </div>
      </div>`;
    }).join("");

  } catch (err) {
    console.error(err);
    list.innerHTML = `<div class="empty-state"><span>⚠️</span><p>خطأ في تحميل البيانات</p></div>`;
  }
}

async function updateStatus(id, status) {
  try {
    await dbSend("PATCH", `editor_applications?id=eq.${id}`, { status });
    loadApplications();
  } catch (err) {
    alert("خطأ: " + err.message);
  }
}

async function deleteApp(id) {
  if (!confirm("متأكد تبي تحذف هذا الطلب؟")) return;
  try {
    await dbSend("DELETE", `editor_applications?id=eq.${id}`);
    loadApplications();
  } catch (err) {
    alert("خطأ: " + err.message);
  }
}

// Login Form
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("loginBtn");
  const msg = $("loginMsg");

  btn.disabled = true;
  msg.textContent = "";

  try {
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    const auth = await login(email, password);
    TOKEN = auth.access_token;
    localStorage.setItem("hiring_token", TOKEN);

    USER = auth.user;
    showDashboard();

  } catch (err) {
    msg.textContent = err.message;
    msg.className = "form-msg error";
  } finally {
    btn.disabled = false;
  }
});

$("logoutBtn").addEventListener("click", logout);

function showDashboard() {
  $("loginSection").hidden = true;
  $("dashSection").hidden = false;
  $("userName").textContent = USER?.user_metadata?.name || USER?.email || "";
  loadApplications();
  loadVideo();
}

// Video Management
async function loadVideo() {
  try {
    const data = await dbGet("site_settings?key=eq.hero_video&select=value");
    if (data && data[0] && data[0].value) {
      $("videoUrl").value = data[0].value;
      $("videoPreview").src = data[0].value;
      $("currentVideo").hidden = false;
    }
  } catch (e) {
    console.log("No video set yet");
  }
}

function uploadVideo(file) {
  return new Promise((resolve, reject) => {
    const progress = $("uploadProgress");
    const bar = $("uploadBar");
    const text = $("uploadText");
    progress.hidden = false;
    bar.style.width = "0%";

    const fileName = `hero_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        bar.style.width = pct + "%";
        text.textContent = `جارٍ الرفع... ${pct}%`;
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        bar.style.width = "100%";
        text.textContent = "تم الرفع!";
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;
        resolve(publicUrl);
      } else {
        reject(new Error(xhr.responseText || "فشل الرفع"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("خطأ في الاتصال")));

    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/videos/${fileName}`);
    xhr.setRequestHeader("apikey", SUPABASE_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${TOKEN}`);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

async function saveVideo() {
  const file = $("videoFile").files[0];
  const urlInput = $("videoUrl").value.trim();
  const msg = $("videoMsg");
  const btn = $("saveVideoBtn");

  btn.disabled = true;
  msg.textContent = "";
  msg.className = "form-msg";

  try {
    let videoUrl = urlInput;

    // If file selected, upload it first
    if (file) {
      msg.textContent = "جارٍ رفع الفيديو...";
      videoUrl = await uploadVideo(file);
      $("videoUrl").value = videoUrl;
    }

    if (!videoUrl) {
      throw new Error("اختر ملف أو أدخل رابط");
    }

    // Save URL to database
    await dbSend("POST", "site_settings?on_conflict=key",
      { key: "hero_video", value: videoUrl },
      "resolution=merge-duplicates,return=minimal"
    );

    msg.textContent = "تم حفظ الفيديو!";
    msg.className = "form-msg success";

    // Show preview
    $("videoPreview").src = videoUrl;
    $("currentVideo").hidden = false;
    $("videoFile").value = "";
    $("uploadProgress").hidden = true;

  } catch (e) {
    msg.textContent = "خطأ: " + e.message;
    msg.className = "form-msg error";
    $("uploadProgress").hidden = true;
  } finally {
    btn.disabled = false;
  }
}

$("saveVideoBtn").addEventListener("click", saveVideo);

// Init
(async () => {
  if (TOKEN) {
    USER = await getUser();
    if (USER) {
      showDashboard();
    } else {
      logout();
    }
  }
})();

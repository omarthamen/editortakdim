// Editor Hiring — Landing Page
const SUPABASE_URL = "https://jbgvypuckdqzkkxgvsgb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3Z5cHVja2RxemtreGd2c2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTM1OTIsImV4cCI6MjA5NzEyOTU5Mn0.dLOK04jl49Bam9hK9MdpYd0Jz-cZwkBUMg53l70K9Ik";

const $ = (id) => document.getElementById(id);

async function dbSend(method, endpoint, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

$("applicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("submitBtn");
  const msg = $("formMsg");

  btn.disabled = true;
  btn.innerHTML = "<span>جارٍ الإرسال...</span>";
  msg.textContent = "";
  msg.className = "form-msg";

  try {
    const data = {
      name: $("name").value.trim(),
      email: $("email").value.trim(),
      phone: $("phone").value.trim() || null,
      portfolio: $("portfolio").value.trim(),
      test_video: $("testVideo").value.trim() || null,
      notes: $("notes").value.trim() || null,
      status: "new"
    };

    await dbSend("POST", "editor_applications", data);

    // Success
    $("applicationForm").hidden = true;
    $("successSection").hidden = false;
    document.querySelector(".form-card").hidden = true;

  } catch (err) {
    console.error(err);
    msg.textContent = "حدث خطأ، حاول مرة ثانية";
    msg.className = "form-msg error";
    btn.disabled = false;
    btn.innerHTML = "<span>إرسال الطلب</span>";
  }
});

// Check if video source exists
const video = $("heroVideo");
if (video && video.querySelector("source").src) {
  $("videoPlaceholder").hidden = true;
}

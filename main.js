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

// Load video from database
async function loadHeroVideo() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=eq.hero_video&select=value`, {
      headers: { "apikey": SUPABASE_KEY }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data && data[0] && data[0].value) {
      const url = data[0].value;
      const video = $("heroVideo");
      const placeholder = $("videoPlaceholder");
      const wrapper = video.parentElement;

      // Check if YouTube
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) {
        const videoId = ytMatch[1];
        // Show thumbnail with play button
        wrapper.innerHTML = `
          <div class="yt-thumb" id="ytThumb" style="position:absolute;inset:0;cursor:pointer;background:#000">
            <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg"
                 style="width:100%;height:100%;object-fit:cover;opacity:0.85"
                 onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
              <div style="width:80px;height:80px;background:rgba(44,141,208,0.95);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,0.4);transition:transform .2s">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>`;
        wrapper.style.position = "relative";

        // On click, replace with autoplay iframe
        $("ytThumb").addEventListener("click", () => {
          wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;position:absolute;inset:0"></iframe>`;
        });
      } else {
        video.querySelector("source").src = url;
        video.load();
        placeholder.hidden = true;
      }
    }
  } catch (e) {
    console.log("No video configured");
  }
}

loadHeroVideo();

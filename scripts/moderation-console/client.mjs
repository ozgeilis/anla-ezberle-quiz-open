let config;
let session;
let busy = false;
let timeout;
const element = (id) => document.getElementById(id);
const status = (message) => {
  element("status").textContent = message;
};
const decisions = new Map([
  ["dismiss", "Şikâyeti kapat"],
  ["warn", "İç uyarı kaydı"],
  ["restrict", "Sosyal erişimi kısıtla"],
  ["restore", "Sosyal kısıtlamayı kaldır"],
]);

function clearSession(message) {
  clearTimeout(timeout);
  session = undefined;
  element("reports").replaceChildren();
  element("restore-id").value = "";
  element("restore-note").value = "";
  element("controls").hidden = true;
  element("login").hidden = false;
  status(message);
}

async function request(path, body, authenticated = true) {
  const response = await fetch(config.url + path, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      "Content-Type": "application/json",
      ...(authenticated
        ? { Authorization: `Bearer ${session?.access_token}` }
        : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Giriş veya moderatör yetkisi doğrulanamadı. Hesap/oturum yetkisini kontrol edin.",
      );
    }
    throw new Error(
      "İstek tamamlanamadı. Bağlantınızı kontrol edip yeniden deneyin.",
    );
  }
  return response.status === 204 ? {} : response.json();
}

async function run(action) {
  if (busy) return;
  busy = true;
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  try {
    await action();
  } catch (error) {
    status(
      error instanceof Error && error.message.startsWith("Giriş veya")
        ? error.message
        : "İşlem tamamlanamadı. İnternet bağlantınızı ve oturumunuzu kontrol edin; tekrar deneyebilirsiniz.",
    );
  } finally {
    busy = false;
    document.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
}

async function decide(operation, reportId, reason) {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(reportId)) {
    status("Geçerli bir rapor ID'si girin.");
    return;
  }
  if (
    reason.length < 3 ||
    reason.length > 500 ||
    /[\u0000-\u001f\u007f]/.test(reason)
  ) {
    status(
      "3–500 karakterlik, satır sonu içermeyen bir karar gerekçesi yazın.",
    );
    return;
  }
  if (
    !window.confirm(
      `${decisions.get(operation)}: Bu rapor için gerekçeli karar kaydedilsin mi?`,
    )
  )
    return;
  const result = await request("/rest/v1/rpc/moderation_review", {
    operation,
    report_id: reportId,
    note: reason,
  });
  if (result.saved !== true) throw new Error("Decision not saved");
  await queue();
}

async function queue() {
  const data = await request("/rest/v1/rpc/moderation_review", {
    operation: "queue",
  });
  if (!Array.isArray(data.reports)) throw new Error("Invalid queue response");
  element("reports").replaceChildren();
  for (const report of data.reports) {
    const article = document.createElement("article");
    const title = document.createElement("h2");
    title.textContent = String(report.name_snapshot ?? "Oyuncu");
    article.append(title);
    for (const [label, value] of [
      ["Rapor", report.id],
      ["Hedef", report.target],
      ["Kullanıcı adı", report.username_snapshot],
      ["Neden", report.reason],
      ["Açıklama", report.details],
      ["Tarih", report.created_at],
    ]) {
      const line = document.createElement("p");
      line.textContent = `${label}: ${String(value ?? "—")}`;
      article.append(line);
    }
    const note = document.createElement("textarea");
    note.maxLength = 500;
    note.minLength = 3;
    note.setAttribute("aria-label", "Karar gerekçesi (3–500 karakter)");
    article.append(note);
    for (const [operation, label] of decisions) {
      const button = document.createElement("button");
      button.textContent = label;
      button.addEventListener("click", () =>
        run(() => decide(operation, report.id, note.value.trim())),
      );
      article.append(button);
    }
    element("reports").append(article);
  }
  status(
    data.reports.length
      ? `${data.reports.length} açık rapor. Karar vermeden önce inceleyin.`
      : "Açık rapor yok.",
  );
}

element("login").addEventListener("submit", (event) => {
  event.preventDefault();
  return run(async () => {
    try {
      session = await request(
        "/auth/v1/token?grant_type=password",
        {
          email: element("email").value.trim(),
          password: element("password").value,
        },
        false,
      );
      if (!session.access_token || !Number.isFinite(session.expires_in))
        throw new Error("Invalid session");
      // The RPC also verifies auth.uid, moderator enrollment and a real auth.sessions row.
      await queue();
      timeout = setTimeout(
        () =>
          clearSession(
            "Oturum süresi doldu. Güvenli şekilde yeniden giriş yapın.",
          ),
        Math.max(1, session.expires_in - 30) * 1000,
      );
      element("login").hidden = true;
      element("controls").hidden = false;
    } catch {
      if (session?.access_token) {
        await request("/auth/v1/logout?scope=local", {}).catch(() => {});
      }
      clearSession(
        "Giriş veya moderatör yetkisi doğrulanamadı. Hesap/oturum yetkisini kontrol edin.",
      );
    } finally {
      element("password").value = "";
    }
  });
});
element("restore").addEventListener("submit", (event) => {
  event.preventDefault();
  return run(() =>
    decide(
      "restore",
      element("restore-id").value.trim(),
      element("restore-note").value.trim(),
    ),
  );
});
element("refresh").addEventListener("click", () => run(queue));
element("logout").addEventListener("click", () =>
  run(async () => {
    try {
      await request("/auth/v1/logout?scope=local", {});
    } finally {
      clearSession("Bu sekmeden çıkış yapıldı.");
    }
  }),
);
window.addEventListener("pagehide", () => clearSession("Oturum açılmadı."));
fetch("/config.json", { cache: "no-store" })
  .then((response) => response.json())
  .then((value) => {
    config = value;
    element("environment").textContent = `Servis: ${new URL(config.url).host}`;
  })
  .catch(() => {
    status("Yerel servis yapılandırması okunamadı. Giriş yapmayın.");
    element("login").hidden = true;
  });

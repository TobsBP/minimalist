import os
import smtplib
import socket
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import docker

SERVICES = {
    "minimalist_db":   None,
    "minimalist_back": "http://localhost:8080",
    "minimalist_web":  "http://localhost:3001",
    "minimalist_jenkins": "http://localhost:8090",
}

SMTP_HOST     = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER     = os.environ["SMTP_USER"]
SMTP_PASS     = os.environ["SMTP_PASS"]
EMAIL_FROM    = os.environ.get("EMAIL_FROM", SMTP_USER)
EMAIL_TO      = [e.strip() for e in os.environ["EMAIL_TO"].split(",")]
EMAIL_SUBJECT = os.environ.get("EMAIL_SUBJECT", "Minimalist Store — ambiente no ar!")
HOSTNAME      = socket.gethostname()


def now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M:%S UTC")

def get_container_info(client, name: str) -> dict:
    """Retorna status, health e portas de um container pelo nome."""
    try:
        c = client.containers.get(name)
        c.reload()
        state  = c.attrs["State"]
        health = state.get("Health", {}).get("Status", "none")
        status = state["Status"]

        ports = {}
        for internal, bindings in (c.attrs["NetworkSettings"]["Ports"] or {}).items():
            if bindings:
                ports[internal] = bindings[0]["HostPort"]

        return {
            "name":   name,
            "status": status,
            "health": health,
            "ports":  ports,
            "ok":     status == "running" and health in ("healthy", "none"),
        }
    except docker.errors.NotFound:
        return {"name": name, "status": "not found", "health": "—", "ports": {}, "ok": False}

def build_email(infos: list[dict], timestamp: str) -> MIMEMultipart:
    all_ok = all(i["ok"] for i in infos)

    # ── Tema visual ───────────────────────────────────────────────────────────
    header_bg    = "#16a34a" if all_ok else "#dc2626"
    header_label = "AMBIENTE NO AR" if all_ok else "FALHA NA INICIALIZAÇÃO"
    header_sub   = (
        "Todos os serviços subiram com sucesso e estão saudáveis."
        if all_ok else
        "Um ou mais serviços apresentaram problema. Verifique os logs."
    )

    rows_html = ""
    rows_plain = []
    for i in infos:
        url     = SERVICES.get(i["name"])
        url_html = f'<a href="{url}" style="color:#60a5fa">{url}</a>' if url else "—"

        if i["ok"]:
            badge = '<span style="background:#14532d;color:#86efac;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600">RUNNING</span>'
        else:
            badge = '<span style="background:#7f1d1d;color:#fca5a5;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600">FALHOU</span>'

        health_color = "#22c55e" if i["health"] == "healthy" else ("#ef4444" if i["health"] == "unhealthy" else "#94a3b8")

        rows_html += f"""
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b;font-family:monospace;color:#e2e8f0">{i['name']}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b">{badge}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b;color:{health_color};font-size:13px">{i['health']}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #1e293b;font-size:13px">{url_html}</td>
        </tr>"""

        status_str = "running" if i["ok"] else "falhou"
        rows_plain.append(f"  {i['name']:<25} {status_str}  health={i['health']}")

    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:48px 20px">
<table width="620" cellpadding="0" cellspacing="0"
       style="background:#1e293b;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.5)">

  <!-- Header -->
  <tr>
    <td style="background:{header_bg};padding:32px 36px">
      <p style="margin:0 0 4px;color:rgba(255,255,255,.7);font-size:11px;letter-spacing:3px;text-transform:uppercase">
        Minimalist Store · Deploy Notification
      </p>
      <h1 style="margin:0 0 8px;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px">
        {header_label}
      </h1>
      <p style="margin:0;color:rgba(255,255,255,.85);font-size:14px">{header_sub}</p>
    </td>
  </tr>

  <!-- Meta row -->
  <tr>
    <td style="padding:20px 36px;border-bottom:1px solid #334155">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:40px">
            <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px">Horário</p>
            <p style="margin:4px 0 0;color:#e2e8f0;font-size:14px">{timestamp}</p>
          </td>
          <td>
            <p style="margin:0;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px">Host</p>
            <p style="margin:4px 0 0;color:#e2e8f0;font-size:14px;font-family:monospace">{HOSTNAME}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Tabela de serviços -->
  <tr>
    <td style="padding:24px 36px">
      <p style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px">
        Status dos Serviços
      </p>
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border-radius:8px;overflow:hidden;border:1px solid #334155">
        <thead>
          <tr style="background:#0f172a">
            <th style="padding:10px 14px;text-align:left;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:1px">Container</th>
            <th style="padding:10px 14px;text-align:left;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:1px">Status</th>
            <th style="padding:10px 14px;text-align:left;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:1px">Health</th>
            <th style="padding:10px 14px;text-align:left;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:1px">URL</th>
          </tr>
        </thead>
        <tbody style="color:#e2e8f0;font-size:14px">
          {rows_html}
        </tbody>
      </table>
    </td>
  </tr>

  <!-- Acesso rápido (só se tudo ok) -->
  {"" if not all_ok else """
  <tr>
    <td style="padding:0 36px 28px">
      <p style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px">Acesso Rápido</p>
      <a href="http://localhost:3001"
         style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;
                padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-right:10px">
        Abrir App
      </a>
      <a href="http://localhost:8080/swagger-ui.html"
         style="display:inline-block;background:#0f172a;color:#e2e8f0;text-decoration:none;
                border:1px solid #334155;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-right:10px">
        Swagger API
      </a>
      <a href="http://localhost:8090"
         style="display:inline-block;background:#0f172a;color:#e2e8f0;text-decoration:none;
                border:1px solid #334155;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600">
        Jenkins
      </a>
    </td>
  </tr>
  """}

  <!-- Footer -->
  <tr>
    <td style="padding:16px 36px;background:#0f172a;color:#475569;font-size:12px">
      Minimalist Store · Notificação automática de deploy
    </td>
  </tr>

</table>
</td></tr>
</table>
</body></html>"""
    plain = "\n".join([
        "Minimalist Store — Deploy Notification",
        "=" * 50,
        f"Status : {'SUCESSO' if all_ok else 'FALHA'}",
        f"Horário: {timestamp}",
        f"Host   : {HOSTNAME}",
        "",
        "Serviços:",
        *rows_plain,
        "",
        "Links:",
        "  App     → http://localhost:3001",
        "  API     → http://localhost:8080/swagger-ui.html",
        "  Jenkins → http://localhost:8090",
    ])

    msg = MIMEMultipart("alternative")
    msg["Subject"] = EMAIL_SUBJECT if all_ok else f"❌ FALHA — {EMAIL_SUBJECT}"
    msg["From"]    = EMAIL_FROM
    msg["To"]      = ", ".join(EMAIL_TO)
    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html,  "html"))
    return msg


def send_email(msg: MIMEMultipart) -> None:
    print(f"Enviando e-mail para {EMAIL_TO} via {SMTP_HOST}:{SMTP_PORT}…")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(EMAIL_FROM, EMAIL_TO, msg.as_string())
    print("✅ E-mail enviado!")

def main():
    ts = now_utc()
    print(f"Coletando status dos containers ({ts})…")

    client = docker.from_env()
    infos  = [get_container_info(client, name) for name in SERVICES]

    print("\nResultado:")
    for i in infos:
        icon = "✅" if i["ok"] else "❌"
        print(f"  {icon} {i['name']:<25} status={i['status']}  health={i['health']}")

    msg = build_email(infos, ts)
    send_email(msg)


if __name__ == "__main__":
    main()

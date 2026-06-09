# Hermes Gateway에 NATS 연결하기 — Windows PC 세팅 가이드

이 문서는 **Windows 회사 PC에서 Hermes Agent Gateway에 NATS를 연결**하기 위한 절차입니다.

대상 환경:

- Windows 10/11
- Hermes Agent 설치 완료
- `hermes` CLI 사용 가능
- NATS CLI context 또는 NATS server URL 보유
- Hermes Gateway 사용 예정

---

## 1. NATS 플러그인 설치

Hermes의 NATS gateway는 기본 built-in messaging platform이 아니라 **플러그인**으로 제공됩니다.

```bash
hermes plugins install synadia-ai/hermes-nats-gateway
```

이미 설치되어 있다면 생략 가능합니다.

설치 여부 확인:

```bash
hermes plugins list --plain --no-bundled
```

`nats-platform`이 보여야 합니다.

---

## 2. NATS 플러그인 활성화

```bash
hermes plugins enable nats-platform
```

확인:

```bash
hermes plugins list --plain --no-bundled
```

예상 출력에 아래처럼 나와야 합니다.

```text
enabled      git      ...    nats-platform
```

---

## 3. NATS SDK 설치

플러그인 설치만으로는 Python SDK가 설치되지 않습니다.
반드시 Hermes venv 안에 NATS 관련 SDK를 설치해야 합니다.

Windows에서는 자동 venv 탐지가 실패할 수 있으므로 **명시적으로 Hermes venv Python 경로를 넘기는 방식**을 권장합니다.

```bash
bash C:/Users/<윈도우사용자명>/AppData/Local/hermes/plugins/nats-platform/scripts/install-sdks.sh C:/Users/<윈도우사용자명>/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe
```

예시:

```bash
bash C:/Users/samsung/AppData/Local/hermes/plugins/nats-platform/scripts/install-sdks.sh C:/Users/samsung/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe
```

성공하면 대략 아래처럼 나옵니다.

```text
Installed ...
 + nats-py
 + nkeys
 + synadia-ai-agent-service
 + synadia-ai-agents
OK — NATS SDKs importable.
```

설치 확인:

```bash
C:/Users/<윈도우사용자명>/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe -c "import nats, nkeys; import synadia_ai.agents, synadia_ai.agent_service; print('ok')"
```

예상 출력:

```text
ok
```

---

## 4. NATS 연결 방식 선택

Hermes NATS plugin은 두 가지 방식 중 하나로 NATS에 연결할 수 있습니다.

### 방식 A: `NATS_CONTEXT` 사용

이미 NATS CLI context가 있는 경우 권장합니다.

예:

```env
NATS_CONTEXT=NGS-Default-CLI
```

### 방식 B: `NATS_URL` 사용

테스트용 또는 단순 연결에는 URL 방식이 쉽습니다.

예:

```env
NATS_URL=nats://demo.nats.io
```

또는 로컬 NATS:

```env
NATS_URL=nats://127.0.0.1:14222
```

> 중요: `NATS_CONTEXT`와 `NATS_URL`은 **동시에 쓰면 안 됩니다.**
> 둘 중 정확히 하나만 설정하세요.

---

## 5. Hermes `.env` 설정

Hermes env 파일 위치:

```text
C:/Users/<윈도우사용자명>/AppData/Local/hermes/.env
```

예시:

```text
C:/Users/samsung/AppData/Local/hermes/.env
```

### NATS context를 쓰는 경우

`.env`에 아래를 추가합니다.

```env
NATS_CONTEXT=NGS-Default-CLI
NATS_URL=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=session1

NATS_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config/nats
XDG_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config
HOME=C:/Users/<윈도우사용자명>
```

예시:

```env
NATS_CONTEXT=NGS-Default-CLI
NATS_URL=

HERMES_NATS_OWNER=shjhwoo
HERMES_NATS_SESSION_NAME=session1

NATS_CONFIG_HOME=C:/Users/samsung/.config/nats
XDG_CONFIG_HOME=C:/Users/samsung/.config
HOME=C:/Users/samsung
```

### NATS URL을 쓰는 경우

```env
NATS_URL=nats://demo.nats.io
NATS_CONTEXT=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=session1
```

로컬 NATS 예시:

```env
NATS_URL=nats://127.0.0.1:14222
NATS_CONTEXT=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=session1
```

---

## 6. Windows에서 NATS context 경로 문제 해결

Windows gateway 서비스나 Scheduled Task 환경에서는 `HOME`이 비어 있을 수 있습니다.
이 경우 아래 에러가 납니다.

```text
cannot resolve NATS config directory:
set $NATS_CONFIG_HOME, $XDG_CONFIG_HOME, or $HOME
```

해결책은 `.env`에 명시적으로 경로를 넣는 것입니다.

```env
NATS_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config/nats
XDG_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config
HOME=C:/Users/<윈도우사용자명>
```

예시:

```env
NATS_CONFIG_HOME=C:/Users/samsung/.config/nats
XDG_CONFIG_HOME=C:/Users/samsung/.config
HOME=C:/Users/samsung
```

---

## 7. NATS context의 `.creds` 상대경로 문제 해결

NATS context 파일 위치는 보통 다음과 같습니다.

```text
C:/Users/<윈도우사용자명>/.config/nats/context/<context-name>.json
```

예:

```text
C:/Users/samsung/.config/nats/context/NGS-Default-CLI.json
```

파일 안에 이런 값이 있을 수 있습니다.

```json
"creds": "NGS-Default-CLI.creds"
```

Windows 환경에서 Synadia SDK가 이 상대경로를 못 찾으면 아래 에러가 납니다.

```text
creds file not found: NGS-Default-CLI.creds
```

이 경우 `creds` 값을 절대경로로 바꾸세요.

변경 전:

```json
"creds": "NGS-Default-CLI.creds"
```

변경 후:

```json
"creds": "C:/Users/<윈도우사용자명>/.config/nats/context/NGS-Default-CLI.creds"
```

예시:

```json
"creds": "C:/Users/samsung/.config/nats/context/NGS-Default-CLI.creds"
```

---

## 8. NATS context 로딩 테스트

Hermes gateway를 띄우기 전에 SDK가 context를 읽을 수 있는지 확인합니다.

```bash
set -a
. C:/Users/<윈도우사용자명>/AppData/Local/hermes/.env
set +a

C:/Users/<윈도우사용자명>/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe - <<'PY'
from synadia_ai.agents import load_context_options
import os

ctx = os.environ.get("NATS_CONTEXT")
print("NATS_CONTEXT =", ctx)

opts = load_context_options(ctx)
print("servers:", opts.get("servers"))
print("user_credentials:", opts.get("user_credentials"))
print("ok")
PY
```

예상 출력:

```text
NATS_CONTEXT = NGS-Default-CLI
servers: ['tls://connect.ngs.global:4222']
user_credentials: C:/Users/.../.config/nats/context/NGS-Default-CLI.creds
ok
```

---

## 9. Hermes Gateway 설정 wizard 실행

```bash
hermes setup gateway
```

플랫폼 목록에 **NATS**가 보여야 합니다.

예:

```text
[✓] 24. 🛰️ NATS  (configured)
```

NATS만 설정하고 싶다면, 기존에 체크된 Slack / Email / Discord 등을 해제하고 NATS만 남기면 setup 시간이 줄어듭니다.

예를 들어 체크된 항목이 Slack, Email, Discord, NATS라면:

```text
2   # Slack 해제
6   # Email 해제
16  # Discord 해제
Enter
```

---

## 10. Gateway 실행

Foreground 테스트:

```bash
hermes gateway run
```

정상 연결 로그 예시:

```text
[Nats] Connected — subscribed at agents.prompt.hermes.<owner>.<session_name>
✓ nats connected
Gateway running with 1 platform(s)
```

Discord도 같이 연결되어 있다면:

```text
✓ nats connected
✓ discord connected
Gateway running with 2 platform(s)
```

---

## 11. Gateway 서비스 재시작

설정 변경 후에는 gateway를 재시작합니다.

```bash
hermes gateway restart
```

상태 확인:

```bash
hermes gateway status
```

예상 출력:

```text
✓ Scheduled Task registered: Hermes_Gateway
✓ Gateway process running
```

로그 확인:

```bash
tail -n 100 C:/Users/<윈도우사용자명>/AppData/Local/hermes/logs/gateway.log
```

---

## 12. 자주 나오는 에러와 해결

### 에러 1: NATS가 setup 목록에 안 보임

원인:

- `nats-platform` 플러그인이 설치/활성화되지 않음
- SDK가 설치되지 않음

해결:

```bash
hermes plugins install synadia-ai/hermes-nats-gateway
hermes plugins enable nats-platform
bash C:/Users/<윈도우사용자명>/AppData/Local/hermes/plugins/nats-platform/scripts/install-sdks.sh C:/Users/<윈도우사용자명>/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe
```

---

### 에러 2: `cannot resolve NATS config directory`

```text
cannot resolve NATS config directory:
set $NATS_CONFIG_HOME, $XDG_CONFIG_HOME, or $HOME
```

해결:

`.env`에 추가:

```env
NATS_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config/nats
XDG_CONFIG_HOME=C:/Users/<윈도우사용자명>/.config
HOME=C:/Users/<윈도우사용자명>
```

---

### 에러 3: `creds file not found`

```text
NATS context 'NGS-Default-CLI': creds file not found: NGS-Default-CLI.creds
```

해결:

`C:/Users/<윈도우사용자명>/.config/nats/context/<context>.json`에서:

```json
"creds": "NGS-Default-CLI.creds"
```

를 절대경로로 변경:

```json
"creds": "C:/Users/<윈도우사용자명>/.config/nats/context/NGS-Default-CLI.creds"
```

---

### 에러 4: `NATS_URL`과 `NATS_CONTEXT`가 둘 다 설정됨

원인:

```env
NATS_URL=...
NATS_CONTEXT=...
```

둘 다 값이 있음.

해결:

둘 중 하나만 남깁니다.

Context 방식:

```env
NATS_CONTEXT=NGS-Default-CLI
NATS_URL=
```

URL 방식:

```env
NATS_URL=nats://demo.nats.io
NATS_CONTEXT=
```

---

### 에러 5: Email 때문에 gateway가 오래 걸림

로그 예시:

```text
[Email] IMAP connection failed: [AUTHENTICATIONFAILED] Invalid credentials
```

NATS만 쓸 거면 `hermes setup gateway`에서 Email 체크를 해제하세요.

---

## 13. 최종 정상 상태 체크리스트

아래가 모두 만족되면 정상입니다.

```bash
hermes plugins list --plain --no-bundled
```

`nats-platform`이 enabled:

```text
enabled ... nats-platform
```

SDK import 확인:

```bash
C:/Users/<윈도우사용자명>/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe -c "import nats, nkeys; import synadia_ai.agents, synadia_ai.agent_service; print('ok')"
```

출력:

```text
ok
```

gateway 로그:

```text
[Nats] Connected — subscribed at agents.prompt.hermes.<owner>.<session_name>
✓ nats connected
Gateway running with ... platform(s)
```

gateway status:

```bash
hermes gateway status
```

출력:

```text
✓ Gateway process running
```

---

## 14. 참고용 최소 `.env` 예시

### NATS context 방식

```env
NATS_CONTEXT=NGS-Default-CLI
NATS_URL=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=session1

NATS_CONFIG_HOME=C:/Users/yourname/.config/nats
XDG_CONFIG_HOME=C:/Users/yourname/.config
HOME=C:/Users/yourname
```

### NATS URL 방식

```env
NATS_URL=nats://demo.nats.io
NATS_CONTEXT=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=session1
```

로컬 개발용:

```env
NATS_URL=nats://127.0.0.1:14222
NATS_CONTEXT=

HERMES_NATS_OWNER=yourname
HERMES_NATS_SESSION_NAME=dev
```

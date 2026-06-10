# NATS Channel Agent 설치 가이드

## 사전 요구사항

- Claude Code CLI 설치
- NATS CLI 설치 및 PATH 등록
- Synadia NGS 계정 및 credentials 파일 (`.creds`)

---

## 1. Bun 설치

```bash
scoop install bun
```

설치 확인:
```bash
bun --version
```

---

## 2. 마켓플레이스 추가

```
/plugin marketplace add synadia-ai/synadia-agents
```

`synadia-plugins` 마켓플레이스가 등록됩니다.

---

## 3. 플러그인 설치

```
/plugin install nats-channel@synadia-plugins
```

---

## 4. 플러그인 활성화

```
/reload-plugins
```

---

## 5. NATS CLI 컨텍스트 설정

NATS CLI 컨텍스트 파일 위치: `~/.config/nats/context/<name>.json`

컨텍스트 파일 예시:
```json
{
  "url": "tls://connect.ngs.global",
  "creds": "~/.config/nats/NGS-Default-CLI.creds"
}
```

컨텍스트 목록 확인:
```bash
nats context list
```

---

## 6. 플러그인 설정

```
/nats-channel:configure
```

또는 컨텍스트를 직접 지정:
```
/nats-channel:configure NGS-Default-CLI
```

설정 파일 위치: `~/.claude/channels/nats/config.json`

```json
{
  "context": "NGS-Default-CLI"
}
```

---

## 7. 연결 확인

```bash
nats account info --context NGS-Default-CLI
```

성공 시 계정 정보와 JetStream 정보가 출력됩니다.

---

## 8. 동작 확인

MCP 서버 상태 확인:
```
/mcp
```

`plugin:nats-channel:nats · ✓ connected` 로 표시되면 완료.

---

## 참고

| 항목 | 기본값 |
|---|---|
| 리슨 subject | `agents.prompt.cc.<user>.<session>` |
| session 기본값 | 현재 디렉토리명 |
| permissions 기본값 | `terminal` 모드 |

세션명 변경: `/nats-channel:configure session <name>`  
권한 모드 변경: `/nats-channel:configure permissions query`

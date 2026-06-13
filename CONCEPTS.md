## 목적

https://www.synadia.com/blog/heterogeneous-agents-one-fabric

### 프로토콜

상세: https://github.com/synadia-ai/synadia-agent-sdk-docs/blob/main/core-protocol.md

- agents: AI 에이전트. nats 서버에 연결되어 있으며 nats에서 agents 목록으로써 조회된다. prompt, status, hb(heartbeat) 3개의 엔드포인트를 지원함.

- agent subject 는 agents.{verb}.{token}.{owner}.{session} 으로 구성됨
- request는 utf-8 text 또는 json 으로 구성되며 base64 문자열들이 추가로 붙을 수도 있음.
- request 보냈을때 받는 response 들은 json 덩어리로 온다: response, status, query 그리고 빈 body 종료 문자열로 끝난다.
- 만약에 오류가 발생한 경우 메세지 헤더에 Nats-Service-Error-Code 가 들어온다.

### nats로 연결되어 있는 AI agent 들을 서비스 디스커버리 하는 법

nats req `$SRV.INFO.agents`

### client-sdk

- 연결 세팅
- 에이전트 헬스체크/핑
- 에이전트들 찾기
- 여러 에이전트에 명령을 전파
- response들 통합해서 받아오고
- session 관리하는 경우 필요함

* client-sdk/typescript/
* client-sdk/python/
  https://github.com/synadia-ai/synadia-agents/tree/main/client-sdk

### agent-sdk

- 여러 에이전트들을 호스팅

* agent-sdk/typescript/
* agent-sdk/python/

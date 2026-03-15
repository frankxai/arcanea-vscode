# Arcanea — The coding agent that has a soul.

A battle-tested coding agent powered by Arcanea's intelligence system. Ten Guardians route your intent through a Mixture-of-Experts engine. Every response draws on the right expertise automatically. No configuration required.

**BYOK** (Bring Your Own Key) — no account needed. Plug in your API key and go.

---

## Features

### 5 Guardian Modes

| Mode         | Slug       | Description                                                                                                      | Tools                                    |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Lumina**   | `lumina`   | Write, build, and ship code. Creation mode — acts on clear tasks without asking permission.                      | read, edit, browser, command, mcp        |
| **Nero**     | `nero`     | Debug, diagnose, and fix. States hypothesis before changing code. Reproduces first.                              | read, edit, browser, command, mcp        |
| **Lyria**    | `lyria`    | Plan, design, and architect. Gathers context thoroughly, presents trade-offs, breaks work into executable steps. | read, edit (markdown only), browser, mcp |
| **Shinkami** | `shinkami` | Understand, explain, and advise. Leads with the answer, uses concrete examples, recommends clearly.              | read, browser, mcp                       |
| **Arcanea**  | `arcanea`  | Orchestrate complex multi-step work. Decomposes tasks and delegates to the right specialist mode.                | orchestration (delegates to other modes) |

### The Arcanean Code

Seven principles injected into every prompt. They constrain LLM behavior in ways that produce measurably better output from any model.

1. **Ship working code.** Iterate beats perfection -- a working draft you can improve is worth more than a perfect plan you never execute.
2. **Create alongside, not instead of.** The human's vision leads. Propose, don't impose.
3. **Read before you write.** Never modify code you haven't seen. Context is earned, not guessed.
4. **One excellent answer beats five adequate ones.** Go deep on the actual problem.
5. **Build on what exists.** Check for existing patterns and conventions before creating new ones.
6. **Name the real problem.** State your hypothesis before changing code. When stuck, say what you don't know.
7. **Density over length.** Every paragraph should contain something the creator didn't already know. End with what to do next.

### MoE Intelligence Router

The Mixture-of-Experts router auto-detects expertise domains from your message -- code, design, strategy, world-building, music, emotion, knowledge, creation, integration, transcendence -- and activates the right Guardian fragments with weighted blending. No manual mode switching needed when using Arcanea mode.

Ten Guardians power the expert layer: Lyssandria (infrastructure), Leyla (design), Draconia (execution), Maylinn (documentation), Alera (voice), Lyria (vision), Aiyami (wisdom), Elara (perspective), Ino (integration), Shinkami (meta-architecture).

### 40+ AI Providers

Connect to any major AI provider with your own API key:

- **Anthropic** (Claude 4 Opus, Sonnet)
- **OpenAI** (GPT-5, o3)
- **Google** (Gemini 2.5 Pro)
- **AWS Bedrock**, **Google Vertex**, **Azure**
- **OpenRouter** (400+ models)
- **Ollama**, **LM Studio** (local models)
- **Mistral**, **Cerebras**, **DeepSeek**, **Groq**, and more

### Full Agent Loop

The complete autonomous coding agent toolkit:

- **Read** — browse files, search code, understand context
- **Edit** — create, modify, and refactor code with diffs
- **Command** — run terminal commands, build, test, deploy
- **Browser** — navigate web pages, extract content, interact with UIs
- **MCP** — connect to Model Context Protocol servers for extended capabilities
- **Ghost** — inline code suggestions and autocomplete (experimental)

---

## Quick Start

### Install from VSIX

```bash
# Build the extension
cd arcanea-vscode
pnpm install
pnpm run bundle
cd src && pnpm run vsix

# Install in VS Code
code --install-extension bin/arcanea-vscode-*.vsix
```

### Set Your API Key

1. Open Arcanea from the activity bar (or `Ctrl+Shift+A` / `Cmd+Shift+A`)
2. Click the settings gear
3. Choose your provider and enter your API key
4. Start chatting

No account creation, no sign-up, no subscription. Your key, your models, your data.

---

## Project Structure

```
arcanea-vscode/
  src/                          # Extension source
    core/prompts/
      arcanea-intelligence.ts   # MoE router + Arcanean Code + Guardian fragments
    shared/
      guardians.ts              # 10 Guardian definitions + keyword router
      modes.ts                  # 5 Guardian Modes configuration
  packages/
    types/                      # Shared TypeScript types
    cloud/                      # Cloud service integration
    ipc/                        # Inter-process communication
    telemetry/                  # Usage telemetry
```

---

## Development

```bash
pnpm install          # Install dependencies
pnpm run bundle       # Build the extension
pnpm run lint         # Lint
pnpm test             # Run tests
pnpm run watch:bundle # Watch mode for development
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for the full development guide.

---

## Credits

Built on the Kilo Code open-source agent (Apache 2.0). Intelligence layer by [Arcanea](https://arcanea.ai).

The MoE architecture, Guardian system, and Arcanean Code are original contributions by the Arcanea team.

## License

Apache 2.0 — see [LICENSE](LICENSE).

## Links

- [arcanea.ai](https://arcanea.ai) — The Arcanea platform
- [GitHub](https://github.com/frankxai/arcanea-vscode) — Source code
- [Arcanea Platform](https://github.com/frankxai/arcanea) — Core intelligence framework

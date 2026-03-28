---
theme: ../../theme
title: "Build a Custom AI Agent in Go with Fantasy"
transition: view-transition
mdc: true
---

# Build a Custom AI Agent in Go with Fantasy

Type-safe tools. Streaming. Session persistence. One binary.

<!--
Build a custom AI coding agent in Go. Type-safe tool calling. Streaming responses. Session persistence. An interactive CLI you can actually use. One framework. One binary. No TypeScript. No Python.

Let's build it.
-->

---
layout: section
---

# The Problem

Go and AI tooling

<!--
If you're a Go developer and you've tried to build anything with AI agents, you've probably noticed the ecosystem has a favorite language — and it's not Go.

PI, LangChain, Vercel AI SDK — the major agent frameworks are all TypeScript. If you wanted agents in Go, your options were: call the OpenAI API raw, write a thin wrapper, or shell out to a Python sidecar and pretend that's architecture.

But before I get into how that changed — if you're new here, on What The Func we cover Go, AI, and the tooling that connects them. If that's your thing, subscribe and hit the bell. Let's get into it.
-->

---

<v-clicks>

- **No unified provider abstraction** — swap OpenAI to Anthropic? Rewrite your API layer
- **No type-safe tool calling** — `map[string]interface{}` and `json.RawMessage` everywhere
- **No agent loop** — generate → call tool → regenerate, written from scratch every time

</v-clicks>

<!--
Here's what Go developers were dealing with:

No unified provider abstraction. Want to swap from OpenAI to Anthropic? Rewrite your API layer. Different SDKs, different response shapes, different streaming approaches.

No type-safe tool calling. Most Go wrappers use map[string]interface{} or json.RawMessage for tool inputs. You're parsing JSON by hand and hoping the model sent the right fields.

No agent loop. The generate, call tool, regenerate cycle that every agent framework handles? You're writing that from scratch. Every time.
-->

---

<v-clicks>

- **Fantasy** by Charmbracelet shipped
- The framework that powers **Crush** — their production coding agent
- Real framework. Real production use.

</v-clicks>

<!--
Then Fantasy shipped.

Fantasy is a Go framework by Charmbracelet — the team behind Bubble Tea, Lip Gloss, and the Charm ecosystem. It's the framework that powers Crush, their production coding agent. Real framework. Real production use. And it solves every one of those pain points.
-->

---
layout: section
---

# The Stack

Fantasy Framework

<!--
Fantasy gives you three things. Let me show you what they are and how they fit together.
-->

---

<v-clicks>

<NeonBox color="cyan">

**Unified Provider Interface**
Anthropic, OpenAI, Google, Bedrock, OpenRouter, Ollama — all behind one API.
`provider.LanguageModel()` → `model.Generate()` or `model.Stream()`

</NeonBox>

<NeonBox color="pink">

**Type-Safe Tool Calling with Go Generics**
Your Go struct IS the schema. One thing instead of two.
Compile-time safety instead of runtime assertions.

</NeonBox>

<NeonBox color="yellow">

**Complete Agent Loop**
Generate, stream, tool dispatch, multi-step execution,
stop conditions, callbacks — all built in.

</NeonBox>

</v-clicks>

<!--
First, a unified provider interface. Anthropic, OpenAI, Google, Bedrock, OpenRouter, Ollama — all behind one API. Swap providers by changing one import and one line. Everything downstream stays identical.

Second, type-safe tool calling with Go generics. This is where Go actually has an edge. In PI and most TypeScript frameworks, you define a tool schema separately from your handler. In Fantasy, your Go struct IS the schema. One thing instead of two.

Third, a complete agent loop. Generate, stream, tool dispatch, multi-step execution, stop conditions, callbacks — all built in.
-->

---

## What We're Building

<v-clicks>

- A **coding assistant agent** — read files, write files, run shell commands, list directories
- **Session persistence** — close the agent, reopen it, full context restored
- **Streaming CLI** — token-by-token output with real-time tool call notifications
- All in **three files**: `main.go`, `tools.go`, `session.go`

</v-clicks>

<!--
Here's what we're building today. A coding assistant agent that can read files, write files, run shell commands, and list directories. Session persistence — close the agent, reopen it, full conversation context restored. Streaming CLI — token-by-token output with real-time tool call notifications. All in three files.
-->

---

```
fantasy-agent/
├── go.mod         # One dependency: charm.land/fantasy v0.9.0
├── main.go        # Provider setup + agent creation + REPL loop
├── tools.go       # read_file, write_file, bash, ls
└── session.go     # Session persistence manager
```

<!--
Here's the project structure. Three Go files and a go.mod. That's it. Let's get into the code.
-->

---
layout: section
---

# Building the Agent

<!--
Let's set up the project and start writing code.
-->

---

## Project Setup

```bash
mkdir fantasy-agent && cd fantasy-agent
go mod init github.com/what-the-func/fantasy-agent
go get charm.land/fantasy@v0.9.0
```

<v-click>

Fantasy's module path is `charm.land/fantasy` — vanity URL. Very Charm.

</v-click>

<v-click>

Uses Go 1.26's `iter.Seq` for streaming — the range-over-function feature.

</v-click>

<!--
One thing to know: Fantasy's module path is charm.land/fantasy, not github.com/charmbracelet/fantasy. Vanity URL. Very Charm.

Fantasy uses Go 1.26's iter.Seq for streaming — the range-over-function feature. Make sure your go.mod says go 1.26.0.
-->

---

## go.mod

```go {lines:true}
module github.com/what-the-func/fantasy-agent

go 1.26.0

require charm.land/fantasy v0.9.0
```

<v-click>

One dependency. No Docker. No virtual environment. Let's write code.

</v-click>

<!--
One dependency. No Docker. No virtual environment. Let's write code.
-->

---

## Tool Pattern — `read_file`

```go {lines:true}
type readFileInput struct {
	Path string `json:"path" description:"The file path to read"`
}

func readFileHandler(
	ctx context.Context,
	input readFileInput,
	_ fantasy.ToolCall,
) (fantasy.ToolResponse, error) {
	data, err := os.ReadFile(input.Path)
	if err != nil {
		return fantasy.NewTextErrorResponse(
			fmt.Sprintf("failed to read %s: %v", input.Path, err),
		), nil
	}
	return fantasy.NewTextResponse(string(data)), nil
}

var readFileTool = fantasy.NewAgentTool(
	"read_file",
	"Read a file from disk",
	readFileHandler,
)
```

<!--
This is the core of what makes Fantasy interesting, so I want to walk through the first tool carefully. Three pieces.
-->

---

## The Three Pieces

<v-clicks>

1. **Input struct** — `json` tags for field names, `description` tags for the model.
   Fantasy reflects over the struct to generate JSON schema automatically.

2. **Handler** — typed `readFileInput`, not `interface{}`. Tool errors go back to the
   model via `NewTextErrorResponse`. Go errors mean infrastructure broke.

3. **Registration** — `NewAgentTool`: name, description, handler. Done.

</v-clicks>

<v-click>

The struct **IS** the schema. No duplication. No runtime type assertions.

</v-click>

<!--
The input struct has json tags for the field names the model sends, and description tags for what the model reads when deciding how to call it. Fantasy reflects over this struct to generate the JSON schema automatically. You don't write a schema separately.

The handler takes a context, a typed readFileInput — not interface{}, not json.RawMessage — and returns a ToolResponse. If the read fails, we return NewTextErrorResponse, not a Go error. Tool errors go back to the model so it can react. Go errors mean infrastructure broke.

Then NewAgentTool ties it together: name, description, handler. That's the full pattern.
-->

---

## `write_file`

```go {lines:true}
type writeFileInput struct {
	Path    string `json:"path" description:"The file path to write"`
	Content string `json:"content" description:"The full content to write"`
}

func writeFileHandler(
	ctx context.Context,
	input writeFileInput,
	_ fantasy.ToolCall,
) (fantasy.ToolResponse, error) {
	if err := os.WriteFile(input.Path, []byte(input.Content), 0644); err != nil {
		return fantasy.NewTextErrorResponse(err.Error()), nil
	}
	return fantasy.NewTextResponse(
		fmt.Sprintf("Wrote %d bytes to %s", len(input.Content), input.Path),
	), nil
}

var writeFileTool = fantasy.NewAgentTool(
	"write_file",
	"Write content to a file on disk",
	writeFileHandler,
)
```

<!--
Same pattern. Typed input, clean handler, register.
-->

---

## `bash`

```go {lines:true}
type bashInput struct {
	Command string `json:"command" description:"The shell command to execute"`
}

func bashHandler(
	ctx context.Context,
	input bashInput,
	_ fantasy.ToolCall,
) (fantasy.ToolResponse, error) {
	cmd := exec.CommandContext(ctx, "bash", "-c", input.Command)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fantasy.NewTextErrorResponse(
			fmt.Sprintf("command failed: %v\noutput: %s", err, string(out)),
		), nil
	}
	return fantasy.NewTextResponse(string(out)), nil
}

var bashTool = fantasy.NewAgentTool(
	"bash",
	"Execute a shell command and return the output",
	bashHandler,
)
```

<v-click>

On failure, return output **alongside** the error — the model gets both to diagnose and retry.

</v-click>

<!--
Same pattern as the others. Note the bash tool — when the command fails, we return the output alongside the error. The model gets both, so it can diagnose what went wrong and retry with a different command.
-->

---

## `ls`

```go {lines:true}
type lsInput struct {
	Path string `json:"path,omitempty" description:"Directory to list. Defaults to current directory."`
}

func lsHandler(
	ctx context.Context,
	input lsInput,
	_ fantasy.ToolCall,
) (fantasy.ToolResponse, error) {
	dir := input.Path
	if dir == "" {
		dir = "."
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fantasy.NewTextErrorResponse(err.Error()), nil
	}
	var lines []string
	for _, e := range entries {
		if e.IsDir() {
			lines = append(lines, e.Name()+"/")
		} else {
			lines = append(lines, e.Name())
		}
	}
	return fantasy.NewTextResponse(strings.Join(lines, "\n")), nil
}

var lsTool = fantasy.NewAgentTool(
	"ls",
	"List directory contents",
	lsHandler,
)
```

<!--
Four tools. Each one is a typed struct, a handler, and a registration call. No schema duplication. No runtime type assertions. If the model sends a malformed tool call, the type system catches it before your code runs. That's what Go generics give you here.
-->

---

## Session Manager — Types

```go {lines:true}
type Session struct {
	ID        string            `json:"id"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
	Messages  []fantasy.Message `json:"messages"`
}

type SessionManager struct {
	dir string
}

func NewSessionManager(dir string) *SessionManager {
	os.MkdirAll(dir, 0755)
	return &SessionManager{dir: dir}
}

func (sm *SessionManager) New() Session {
	return Session{
		ID:        fmt.Sprintf("session-%d", time.Now().UnixNano()),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
```

<!--
Flat JSON session persistence. Each conversation is a JSON file with an ID, timestamps, and the full message history.
-->

---

## Session Manager — Save / Load

```go {lines:true}
func (sm *SessionManager) Save(s Session) error {
	s.UpdatedAt = time.Now()
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(
		filepath.Join(sm.dir, s.ID+".json"), data, 0644,
	)
}

func (sm *SessionManager) Load(id string) (Session, error) {
	data, err := os.ReadFile(filepath.Join(sm.dir, id+".json"))
	if err != nil {
		return Session{}, err
	}
	var s Session
	return s, json.Unmarshal(data, &s)
}
```

<!--
Save marshals the session to pretty-printed JSON and writes it to disk. Load reads a session by ID. Straightforward file-based persistence.
-->

---

## Session Manager — ContinueRecent

```go {lines:true}
func (sm *SessionManager) ContinueRecent() (Session, error) {
	entries, err := os.ReadDir(sm.dir)
	if err != nil || len(entries) == 0 {
		return sm.New(), nil
	}
	sort.Slice(entries, func(i, j int) bool {
		iInfo, _ := entries[i].Info()
		jInfo, _ := entries[j].Info()
		return iInfo.ModTime().After(jInfo.ModTime())
	})
	name := entries[0].Name()
	return sm.Load(name[:len(name)-5])
}
```

<v-click>

Finds the most recently modified session. If none exist, creates a new one.

</v-click>

<!--
ContinueRecent finds the most recently modified session and loads it. If there are none, it creates a new one. In production you'd add context compaction — summarize old messages when you approach the token window limit. But this captures the concept and it works.
-->

---

## System Prompt

```go {lines:true}
const systemPrompt = `You are an expert Go programming assistant
with access to the filesystem.
You can read files, write files, run shell commands,
and list directories.

Guidelines:
- Always explain what you're about to do before doing it
- When reading Go code, provide specific, actionable feedback
- When writing files, show the user what you're writing
- Use bash carefully — prefer non-destructive operations
- If you make a mistake, acknowledge it and fix it`
```

<v-click>

"Explain before doing" makes behavior **transparent**.
"Use bash carefully" — guardrails matter when LLMs have shell access.

</v-click>

<!--
The system prompt defines the agent's personality and boundaries. "Explain what you're about to do before doing it" makes the agent's behavior transparent. "Use bash carefully" — because we're giving an LLM shell access, and guardrails matter.
-->

---

## Provider + Model Setup

```go {lines:true}
func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func run() error {
	provider, err := anthropic.New(
		anthropic.WithAPIKey(os.Getenv("ANTHROPIC_API_KEY")),
	)
	if err != nil {
		return fmt.Errorf("failed to create provider: %w", err)
	}

	ctx := context.Background()

	model, err := provider.LanguageModel(ctx, "claude-sonnet-4-20250514")
	if err != nil {
		return fmt.Errorf("failed to get model: %w", err)
	}
	// ...
}
```

<v-click>

Two steps to get an LLM. Want OpenAI? Change `anthropic.New()` to `openai.New()`. Everything else stays identical.

</v-click>

<!--
Two steps to get an LLM: create a provider, get a model. That's Fantasy's abstraction. If you wanted OpenAI instead, change anthropic.New() to openai.New() and the model string. Everything else stays identical.
-->

---

## Session + Agent Setup

```go {lines:true}
	sm := NewSessionManager(".sessions")
	session, err := sm.ContinueRecent()
	if err != nil {
		return fmt.Errorf("session error: %w", err)
	}

	if len(session.Messages) > 0 {
		fmt.Printf("Resuming session %s (%d messages)\n\n",
			session.ID, len(session.Messages))
	} else {
		fmt.Printf("New session: %s\n\n", session.ID)
	}

	agent := fantasy.NewAgent(
		model,
		fantasy.WithSystemPrompt(systemPrompt),
		fantasy.WithTools(readFileTool, writeFileTool, bashTool, lsTool),
		fantasy.WithMaxOutputTokens(4096),
		fantasy.WithStopConditions(fantasy.StepCountIs(20)),
	)
```

<v-click>

One call. Model, system prompt, tools, output limit, 20-step safety cap.

</v-click>

<!--
Session manager. If there's a previous conversation, we pick up where we left off. The agent is one function call. Pass the model, system prompt, tools, output limit, and a safety cap of 20 steps so it doesn't loop forever.
-->

---

## The REPL — Input Loop

```go {lines:true}
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print("\n> ")
		if !scanner.Scan() {
			break
		}

		input := strings.TrimSpace(scanner.Text())
		if input == "" {
			continue
		}
		if input == "exit" || input == "quit" {
			fmt.Println("Goodbye!")
			break
		}

		fmt.Println()
		// ...
	}
```

<!--
Standard input loop. Read a line, trim whitespace, handle exit commands.
-->

---

## The REPL — Streaming

```go {lines:true}
		result, err := agent.Stream(ctx, fantasy.AgentStreamCall{
			Prompt:   input,
			Messages: session.Messages,

			OnTextDelta: func(_, text string) error {
				fmt.Print(text)
				return nil
			},
			OnToolCall: func(tc fantasy.ToolCallContent) error {
				fmt.Printf("\n→ %s\n", tc.ToolName)
				return nil
			},
			OnToolResult: func(res fantasy.ToolResultContent) error {
				fmt.Printf("← %s: done\n\n", res.ToolName)
				return nil
			},
			OnError: func(err error) {
				fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			},
		})
```

<v-click>

Callbacks: `OnTextDelta` for tokens, `OnToolCall` before a tool runs, `OnToolResult` after.
If any callback returns a non-nil error, the stream stops. **Errors as values.**

</v-click>

<!--
The callbacks are the key part. OnTextDelta fires for each text chunk — we just print it. OnToolCall fires before a tool runs — we show which tool. OnToolResult fires after. If any callback returns a non-nil error, the stream stops. Very Go — errors as values.
-->

---

## The REPL — Session Persistence

```go {lines:true}
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			continue
		}

		// Accumulate messages for session history
		for _, step := range result.Steps {
			session.Messages = append(session.Messages, step.Messages...)
		}

		if err := sm.Save(session); err != nil {
			fmt.Fprintf(os.Stderr,
				"Warning: failed to save session: %v\n", err)
		}

		fmt.Println()
	}

	return nil
}
```

<v-click>

`result.Steps` contains every LLM call and tool call in the agent loop.
Append all messages → next turn has **full context**.

</v-click>

<!--
The session accumulation at the bottom: result.Steps contains every LLM call and tool call in the agent loop. We append all their messages to the session. Next turn, the model has full context of everything that happened.
-->

---
layout: center
---

# Demo Time

```bash
export ANTHROPIC_API_KEY="your-key-here"
go run .
```

<!--
Let's run it.
-->

---

## First Run

```
New session: session-1740000000000

> What Go files are in the current directory?

→ ls
← ls: done

I can see the following Go files in the current directory:
- main.go
- tools.go
- session.go

Would you like me to read any of them?

> Read main.go and tell me if there are any issues

→ read_file
← read_file: done

I've read through main.go. Here's my analysis: ...
```

<!--
That's a working coding agent. Four tools. Streaming. Session persistence. Let me show you the best part.
-->

---

## Session Resumption

```bash
go run .
```

```
Resuming session session-1740000000000 (12 messages)

> What files did I ask you to read last time?

You asked me to read main.go, and I provided feedback on it.
```

<v-click>

Full context restored. The model **remembers** the previous conversation.

</v-click>

<!--
Full context restored. The model remembers the previous conversation because we saved and restored the entire message history.
-->

---
layout: center
---

# Final Thoughts

<div class="mt-8">

<v-clicks>

- Fantasy gives Go developers a **real, production-quality** agent framework
- The struct IS the schema — **compile-time safety** for tool definitions
- Three files, one dependency — `go build -o agent .` gives you a **single binary**
- Fantasy is at **v0.9.0** — preview, but already powers Crush in production

</v-clicks>

</div>

<div v-click class="mt-8">
  <GlowText color="cyan">Full source code in the description.</GlowText>
</div>

<!--
Four things.

Fantasy gives Go developers a real, production-quality agent framework. Type-safe tools, streaming, multi-provider support — the primitives are there, and they work.

The struct IS the schema. That's not just a convenience. It's a genuine architectural advantage over TypeScript's separate schema-and-handler pattern. Compile-time safety for tool definitions.

This entire agent — four tools, session persistence, streaming CLI — is three files and one dependency. go build -o agent gives you a single binary. Ship it.

Fantasy is at v0.9.0. It's a preview. The API will change before 1.0. But it already powers Crush, Charm's production coding agent. It's worth learning now.

Full source code is in the description. Subscribe for more Go and AI content. See you in the next one.
-->

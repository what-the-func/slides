---
theme: ../../theme
title: "Build a Local AI Dungeon Master in Go"
transition: view-transition
mdc: true
---

# Build a Local AI Dungeon Master in Go

Fantasy + Kronk + yzma

---
layout: section
---

# The Problem with CGo

---

## CGo: The Necessary Evil

<v-clicks>

- Go doesn't natively interface with C libraries
- llama.cpp is written in C/C++
- CGo exists but it's painful
  - Cross-compilation nightmare
  - Build times explode
  - Debugging is a maze

</v-clicks>

---

## The Stack

<v-clicks>

- **Fantasy** — Agent framework (system prompts, tools, streaming)
- **Kronk** — Model provider (downloads GGUF + llama.cpp libs)
- **yzma** — Pure Go FFI to llama.cpp (no CGo!)
- **llama.cpp** — Native inference (CUDA, Metal, Vulkan)

</v-clicks>

---

## Two Paths

::left::

<NeonBox color="cyan">

### Fantasy + Kronk
- Agent loop + tool calling
- Streaming with reasoning
- Best for: chatbots, games

</NeonBox>

::right::

<NeonBox color="pink">

### yzma Direct
- Token-by-token control
- Custom sampling
- Best for: embeddings, vision

</NeonBox>

---

## The DM Agent

````md magic-move
```go
// Step 1: Create the agent
agent := fantasy.NewAgent(
    kronk.NewProvider("llama3.2"),
    "You are a D&D 5e Dungeon Master...",
)
```
```go
// Step 2: Add tools
agent := fantasy.NewAgent(
    kronk.NewProvider("llama3.2"),
    "You are a D&D 5e Dungeon Master...",
    fantasy.WithTools(
        lookupMonster,
        lookupSpell,
        rollDice,
        askPlayer,
    ),
)
```
```go
// Step 3: Stream the response
stream := agent.Stream(ctx, userMessage)
for ev := range stream.Events() {
    switch e := ev.(type) {
    case fantasy.TextDelta:
        fmt.Print(e.Text)
    case fantasy.ReasoningDelta:
        // thinking...
    case fantasy.ToolCall:
        fmt.Printf("🎲 Using: %s\n", e.Name)
    }
}
```
````

---
layout: center
---

# _"Python is not the only game in town"_

<GlowText color="cyan">Go + local LLMs = the future</GlowText>

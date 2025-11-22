# AI-DLC and Spec-Driven Development for Factory Droid

# IMPORTANT!!!!

# 日本語で回答すること

Kiro-style Spec Driven Development implementation on AI-DLC (AI Development Life Cycle)

## Project Context

### Paths

- Steering: `.kiro/steering/`
- Specs: `.kiro/specs/`

### Steering vs Specification

**Steering** (`.kiro/steering/`) - Guide AI with project-wide rules and context
**Specs** (`.kiro/specs/`) - Formalize development process for individual features

### Active Specifications

- Check `.kiro/specs/` for active specifications
- Use `/kiro-spec-status <feature-name>` to check progress

## Development Guidelines

- Think in English, generate responses in English

## Minimal Workflow

- Phase 0 (optional): `/kiro-steering`, `/kiro-steering-custom`
- Phase 1 (Specification): 
  - `/kiro-spec-init "description"`
  - `/kiro-spec-requirements <feature>`
  - `/kiro-validate-gap <feature>` (optional: for existing codebase)
  - `/kiro-spec-design <feature> [-y]`
  - `/kiro-validate-design <feature>` (optional: design review)
  - `/kiro-spec-tasks <feature> [-y]`
- Phase 2 (Implementation): `/kiro-spec-impl <feature> [tasks]`
  - `/kiro-validate-impl <feature>` (optional: after implementation)
- Progress check: `/kiro-spec-status <feature>` (use anytime)

## Development Rules

- 3-phase approval workflow: Requirements → Design → Tasks → Implementation
- Human review required each phase; use `-y` only for intentional fast-track
- Keep steering current and verify alignment with `/kiro-spec-status`

## Steering Configuration

- Load entire `.kiro/steering/` as project memory
- Default files: `product.md`, `tech.md`, `structure.md`
- Custom files are supported (managed via `/kiro-steering-custom`)

---

## Factory Droid Specific Features

### Spec Mode Integration

Factory Droid's **Spec Mode** is perfectly aligned with Spec-Driven Development workflow:

**Recommended for Spec Mode:**
- `/kiro-spec-init` - Initial feature brainstorming and planning
- `/kiro-spec-requirements` - Requirements definition and refinement
- `/kiro-spec-design` - Architecture and design exploration

**Switch to Code Mode for:**
- `/kiro-spec-impl` - Implementation and code generation
- `/kiro-validate-impl` - Code validation and testing

### Context Management

Take advantage of Factory's Context Panel for better visibility:
- **Activity Log**: Track execution of each `/kiro-*` command
- **Context Panel**: Monitor current specification status and phase
- **Document View**: Quick access to [requirements.md](http://requirements.md), [design.md](http://design.md), [tasks.md](http://tasks.md)

### Parallel Task Execution

Factory Droid's multi-tab capability enables true parallel development:
1. **Run **`/kiro-spec-tasks <feature>` to generate tasks with `(P)` markers
2. **Identify parallel tasks**: Tasks marked with `(P)` can run simultaneously
3. **Open multiple tabs**: Launch separate Droid instances for independent tasks
4. **Execute in parallel**: Each tab handles one parallel task independently
5. **Merge results**: Combine completed work when dependencies allow

**Example Parallel Workflow:**

```
Tab 1: /kiro-spec-impl feature-x 1.1,1.2    # API endpoints (P1)
Tab 2: /kiro-spec-impl feature-x 2.1,2.2    # Frontend components (P2)
Tab 3: /kiro-spec-impl feature-x 3.1        # Documentation (P3)
```

### Custom Commands Import

Easily import existing command templates:
1. Open `/commands` in Factory Droid
2. Press `I` to import from other directories
3. Select `.claude/commands/kiro/` or `.cursor/commands/kiro/`
4. Commands automatically copied to `.factory/commands/`

### Model Selection

Factory Droid supports multiple AI models. Recommended models for Spec-Driven Development:
- **Claude 4.5 Sonnet or newer**: Best for requirements and design
- **GPT-5-Codex**: Excellent for implementation tasks
- **Gemini 2.5 Pro or newer**: Good for research and validation

Switch models mid-session with `/model` command to optimize for each phase.

---

## Quick Reference

### All Available Commands

**Steering (Project Memory):**
- `/kiro-steering` - Create/update project memory
- `/kiro-steering-custom` - Add domain-specific steering

**Spec Workflow:**
- `/kiro-spec-init <description>` - Initialize new feature spec
- `/kiro-spec-requirements <feature>` - Generate requirements
- `/kiro-spec-design <feature> [-y]` - Create technical design
- `/kiro-spec-tasks <feature> [-y]` - Break down into tasks
- `/kiro-spec-impl <feature> [tasks]` - Execute implementation

**Validation:**
- `/kiro-validate-gap <feature>` - Analyze existing vs requirements
- `/kiro-validate-design <feature>` - Review design quality
- `/kiro-validate-impl <feature>` - Validate implementation

**Status:**
- `/kiro-spec-status <feature>` - Check feature progress

### Customization

All templates and rules are customizable in `.kiro/settings/`:
- **templates/** - Document structure (requirements, design, tasks)
- **rules/** - AI generation principles and judgment criteria

Edit these files to match your team's workflow and standards.

---

## Tips for Factory Droid Users

1. **Use Spec Mode for Planning**: Keep planning and coding contexts separate
2. **Leverage Context Panel**: Monitor specification progress at a glance
3. **Enable Parallel Execution**: Use multi-tab for `(P)` marked tasks
4. **Import Claude Commands**: Reuse your existing Claude Code commands
5. **Switch Models Strategically**: Use different models for different phases
6. **Keep Steering Updated**: Run `/kiro-steering` after major architectural changes

---

## Getting Help

- View command details: Open any `/kiro-*` command file in `.factory/commands/`
- Check spec status: `/kiro-spec-status <feature-name>`
- Full documentation: See project README and guides in `docs/`
# BLD-104 Advanced Agent Building Lab - storyboard

## 1. SCR-01 - A1 - Cold open
**The demo agent works. The production agent does not.**

A single-step retrieval agent demos beautifully and fails in week two: no guardrails on sources, no fallback when confidence drops, no plan for the questions it should refuse.

## 2. SCR-02 - A2 - What you will be able to do
**Build agents that survive contact with users**

## 3. SCR-03 - A4 - Anatomy
**What production-ready actually requires**

Each competency agent must implement at least 3 discrete steps beyond simple retrieval, including at least one thinking or transformation step.

Claims: C-06, C-07, C-08

## 4. SCR-04 - A3 - Guardrails
**Say what the agent will not answer**

Claims: C-07, C-08, C-21

## 5. SCR-05 - A5 - Memory
**Memory scope is a design decision**

Too much memory leads to slower, more expensive runs with wandering answers. Too little creates brittle agents that forget constraints or prior results.

Claims: C-80, C-81

## 6. SCR-06 - A3 - Model selection
**Right-size the model per step**

Use small and fast models for simple transforms. Reserve larger models only where reasoning clearly benefits the outcome.

Claims: C-82, C-83

## 7. SCR-07 - A9 - Sort it
**Which advanced capability does each requirement need?**

Claims: C-11, C-12, C-13, C-14, C-20

## 8. SCR-08 - A6 - Decision branch
**A reviewer says your agent is not production-ready**

Claims: C-06, C-08, C-82, C-80

## 9. SCR-09 - quiz - Prove it
**Advanced building check**

## 10. SCR-10 - A14 - Next step
**You can build one. Now prove it holds up.**

The Advanced Agent Building enablement runs as an agent hackathon lasting 1.5 to 4 hours. Next: BLD-207 measures whether what you built actually works.

Claims: C-100, C-94

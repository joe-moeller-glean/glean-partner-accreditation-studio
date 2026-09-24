/* Compiled at build time by the SCORM Engineer from content/, interactions/, assessment/.
   Do not hand-edit. Keys are merged in here for runtime scoring only. */
window.MODULE = {
  id: "DEMO-101",
  title: "Interactive learning module",
  mastery: 80,
  objectives: [{ id: "OBJ-01", text: "Describe the purpose of this module template." }],
  screens: [
    { id: "SCR-01", archetype: "A1", objective: "OBJ-01", eyebrow: "Cold open",
      title: "A partner asks you a question you cannot answer yet",
      body: "Replace this screen with a real sourced scenario.", claims: [] },
    { id: "SCR-02", archetype: "A12", objective: "OBJ-01", eyebrow: "Checkpoint",
      title: "Quick check", type: "choice",
      prompt: "Which statement matches the template contract?",
      options: [
        { id: "o1", text: "Every factual sentence carries a claim id.", correct: true,
          feedback: "Correct. Traceability is enforced before release." },
        { id: "o2", text: "Facts can be paraphrased freely.",
          feedback: "No. Content must match vetted sources exactly in substance." }
      ], claims: [] },
    { id: "SCR-03", archetype: "quiz", objective: "OBJ-01", eyebrow: "Prove it",
      title: "Module assessment", type: "quiz",
      items: [ { id: "Q-01", objective: "OBJ-01",
        stem: "What blocks a module from publishing?",
        options: [
          { id: "a", text: "An unsourced claim.", correct: true,
            feedback: "Right. Unsourced claims fail the fact gate." },
          { id: "b", text: "A long module title.",
            feedback: "Titles do not gate release." } ] } ] },
    { id: "SCR-04", archetype: "A14", objective: "OBJ-01", eyebrow: "Next step",
      title: "You are done", body: "Replace with the badge moment and next module handoff.",
      badge: "Template complete", claims: [] }
  ]
};

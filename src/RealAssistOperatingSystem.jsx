const RealAssistOperatingSystem = [
  {
    title: "CRM + Follow-Up",
    description: "Client stages, lead source, relationship history, touches, tasks, smart reminders, and next-best-action prompts.",
    actions: [
      ["Open Pipeline", "pipeline"],
      ["Open Clients", "clients"],
      ["Open Message Hub", "resources"],
    ],
  },
  {
    title: "Property + Rental Search",
    description: "Saved home searches, property notes, showing tasks, and client sharing.",
    actions: [
      ["Search Properties", "resources"],
      ["Plan Showing Route", "showing-orders"],
      ["Open Buyer Guide", "resources"],
    ],
  },
  {
    title: "Transaction AI",
    description: "Deadline checks, missing paperwork prompts, document summaries, and next-step guidance.",
    actions: [
      ["Open AI Assistant", "dashboard"],
      ["Open Transactions", "showing-orders"],
      ["Open Documents", "resources"],
    ],
  },
  {
    title: "Marketing + Command Center",
    description: "Listing posts, local market support, open house ideas, and content tools.",
    actions: [
      ["Open Marketing Studio", "calendar"],
      ["Open Holiday Hub", "calendar"],
      ["Open Local Resources", "resources"],
    ],
  },
];

export default function RealAssistOperatingSystemFrame({ navigate }) {
  return (
    <section className="operating-system-panel">
      <p className="operating-system-kicker">Real Assist Operating System</p>
      <h2 className="operating-system-title">
        CRM, property search, communication, scheduling, resources, and AI support
      </h2>
      <div className="operating-system-grid">
        {RealAssistOperatingSystem.map((group) => (
          <article className="operating-system-card" key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className="operating-system-actions">
              {group.actions.map(([label, page]) => (
                <button key={label} onClick={() => navigate?.(page)} type="button">
                  {label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
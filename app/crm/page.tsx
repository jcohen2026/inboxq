import { Users, Send, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge, Panel, PanelHeader } from "@/components/ui";

const demoLeads = [
  { company: "Spekit", name: "Ian Lowe", email: "ian.lowe@spekit.com", status: "Sent", focus: "Custom content-technical mix" },
  { company: "Anduril Industries", name: "Van Vu", email: "van.vu@anduril.com", status: "Bounced", focus: "Precision/Autonomous" },
  { company: "Guild", name: "Hannah Newman", email: "hannah.newman@guild.com", status: "Sent", focus: "Elevating technical and content perspective" },
  { company: "Anduril Industries", name: "Shawn Grant", email: "sgrant@anduril.com", status: "Pending", focus: "Precision/Autonomous (Director, Brand Marketing)" }
];

export default function CRMPage() {
  return (
    <div className="mx-auto max-w-7xl bg-palms-black min-h-screen p-4 sm:p-8">
      <PageHeading eyebrow="Palms Outreach" title="SKO 2024 CRM">
        <span className="text-palms-gold">Managing high-stakes relationship loops with dark-gold precision.</span>
      </PageHeading>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CRMStat label="Total Leads" value={4} icon={Users} />
        <CRMStat label="Sent" value={2} icon={Send} />
        <CRMStat label="Bounced" value={1} icon={AlertCircle} tone="red" />
        <CRMStat label="Pending" value={1} icon={Clock} tone="amber" />
      </div>

      <div className="mt-12 space-y-6">
        <h3 className="text-lg font-semibold text-palms-gold tracking-wider uppercase">Active Pipeline</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {demoLeads.map((lead) => (
            <Panel key={lead.email} className="bg-palms-panel border-palms-gold/20 shadow-gold hover:border-palms-gold/40 transition-colors">
              <PanelHeader 
                title={lead.name} 
                eyebrow={lead.company}
                className="border-palms-gold/10"
              />
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge tone={lead.status === 'Bounced' ? 'red' : lead.status === 'Sent' ? 'green' : 'amber'}>
                    {lead.status}
                  </Badge>
                  <span className="text-xs text-zinc-500 font-mono">{lead.email}</span>
                </div>
                
                <div className="bg-palms-black/40 rounded p-3 border border-palms-gold/5">
                  <p className="text-xs font-medium uppercase text-palms-gold/60 mb-1">Campaign Focus</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{lead.focus}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-palms-gold/10 hover:bg-palms-gold/20 text-palms-gold py-2 rounded text-xs font-semibold uppercase tracking-widest border border-palms-gold/20 transition-all">
                    View Interaction
                  </button>
                  <button className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded text-xs font-semibold uppercase border border-zinc-700 transition-all">
                    Edit
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

function CRMStat({ label, value, icon: Icon, tone = "gold" }: any) {
  const tones: any = {
    gold: "text-palms-gold",
    red: "text-red-500",
    amber: "text-amber-500"
  };
  return (
    <div className="bg-palms-panel border border-palms-gold/10 p-5 rounded-lg shadow-quiet">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{label}</p>
        <Icon className={`h-4 w-4 ${tones[tone]}`} />
      </div>
      <p className={`mt-2 text-3xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

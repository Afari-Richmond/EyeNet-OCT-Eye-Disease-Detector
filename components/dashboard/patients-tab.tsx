"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  listPatients,
  createPatient,
  listPatientScans,
  type Patient,
  type Scan,
} from "@/lib/api";
import { GatedCard } from "./gated-card";
import { CLASS_COLOR_VAR } from "./class-color";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, ChevronDown, ChevronUp, Plus } from "lucide-react";

export function PatientsTab() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [scansByPatient, setScansByPatient] = useState<Record<number, Scan[]>>({});

  useEffect(() => {
    if (!user) return;
    listPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <GatedCard feature="Patients" />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) return;
    setCreating(true);
    try {
      const patient = await createPatient({
        full_name: fullName,
        date_of_birth: dob || undefined,
      });
      setPatients((prev) => [...prev, patient].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setFullName("");
      setDob("");
      setShowForm(false);
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!scansByPatient[id]) {
      const scans = await listPatientScans(id);
      setScansByPatient((prev) => ({ ...prev, [id]: scans }));
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Users className="w-4 h-4 text-muted-foreground" />
          Patients
        </span>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full cursor-pointer"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus className="w-3.5 h-3.5" /> New Patient
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 flex flex-wrap gap-2 items-end">
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1 min-w-[160px]"
            required
          />
          <Input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-40"
          />
          <Button type="submit" disabled={creating} className="rounded-full cursor-pointer">
            {creating ? "Adding..." : "Add"}
          </Button>
        </form>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground mt-4">Loading...</p>
      )}
      {!loading && patients.length === 0 && (
        <p className="text-sm text-muted-foreground mt-4">
          No patients yet. Add one to start linking scans to them.
        </p>
      )}

      <ul className="mt-4 divide-y divide-border">
        {patients.map((patient) => (
          <li key={patient.id} className="py-3">
            <button
              onClick={() => toggleExpand(patient.id)}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {patient.full_name}
                </p>
                {patient.date_of_birth && (
                  <p className="text-[11px] text-muted-foreground">
                    DOB: {patient.date_of_birth}
                  </p>
                )}
              </div>
              {expandedId === patient.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {expandedId === patient.id && (
              <ul className="mt-3 pl-4 border-l border-border space-y-2">
                {(scansByPatient[patient.id] ?? []).length === 0 ? (
                  <li className="text-xs text-muted-foreground">No scans for this patient yet.</li>
                ) : (
                  scansByPatient[patient.id].map((scan) => (
                    <li key={scan.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: CLASS_COLOR_VAR[scan.prediction] }}
                      >
                        {scan.prediction} · {scan.confidence.toFixed(1)}%
                      </span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

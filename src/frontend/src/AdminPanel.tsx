import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  Calendar,
  CheckCircle,
  Flower2,
  Image,
  Loader2,
  LogOut,
  Pencil,
  Phone,
  Save,
  Settings,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Status } from "./backend.d";
import { loadConfig } from "./config";
import {
  useApproveBooking,
  useGetAllBookings,
  useRejectBooking,
} from "./hooks/useQueries";
import { StorageClient } from "./utils/StorageClient";

// ─── Default Services ──────────────────────────────────────────────────────────
const defaultServices = [
  {
    key: "eyeBrow",
    name: "Eye Brow",
    nameHi: "आइब्रो",
    desc: "Perfect shape & threading",
  },
  {
    key: "facials",
    name: "Facials",
    nameHi: "फेशियल",
    desc: "Glow & skin rejuvenation",
  },
  {
    key: "waxing",
    name: "Waxing",
    nameHi: "वैक्सिंग",
    desc: "Smooth skin treatments",
  },
  {
    key: "pedicure",
    name: "Pedicure",
    nameHi: "पेडीक्योर",
    desc: "Foot care & nail art",
  },
  {
    key: "manicure",
    name: "Manicure",
    nameHi: "मेनीक्योर",
    desc: "Hand care & nail polish",
  },
  {
    key: "hairCutting",
    name: "Hair Cutting",
    nameHi: "हेयर कटिंग",
    desc: "Stylish cuts & trims",
  },
  {
    key: "hairColor",
    name: "Hair Color",
    nameHi: "हेयर कलर",
    desc: "Vibrant color & highlights",
  },
  {
    key: "hairSpa",
    name: "Hair Spa",
    nameHi: "हेयर स्पा",
    desc: "Deep conditioning therapy",
  },
  {
    key: "partyMakeup",
    name: "Party Makeup",
    nameHi: "पार्टी मेकअप",
    desc: "Glamorous party looks",
  },
  {
    key: "bridalMakeup",
    name: "Bridal Makeup",
    nameHi: "ब्राइडल मेकअप",
    desc: "Your perfect bridal look",
  },
];

function loadServices() {
  try {
    const stored = localStorage.getItem("khushbu_services");
    if (stored) return JSON.parse(stored) as typeof defaultServices;
  } catch {
    // ignore
  }
  return defaultServices;
}

// ─── Default Contact ───────────────────────────────────────────────────────────
const defaultContact = {
  phone1: "7693899623",
  phone2: "7999570655",
  address: "भगवानदास गली, गोपालपुरा, मुरैना (म.प्र.)",
  tagline: "महिलाओं के लिए विशेष ब्यूटी पार्लर",
};

export function loadContact() {
  try {
    const stored = localStorage.getItem("khushbu_contact");
    if (stored) return JSON.parse(stored) as typeof defaultContact;
  } catch {
    // ignore
  }
  return defaultContact;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium font-devanagari">
        <CheckCircle className="w-3 h-3" />
        स्वीकृत
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium font-devanagari">
        <XCircle className="w-3 h-3" />
        अस्वीकृत
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-medium font-devanagari">
      <Loader2 className="w-3 h-3" />
      प्रतीक्षित
    </span>
  );
}

// ─── Bookings Tab ──────────────────────────────────────────────────────────────
type StatusFilter = "all" | "pending" | "approved" | "rejected";

function BookingsTab() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const serviceLabels: Record<string, string> = {
    eyeBrow: "Eye Brow",
    facials: "Facials",
    waxing: "Waxing",
    pedicure: "Pedicure",
    manicure: "Manicure",
    hairCutting: "Hair Cutting",
    hairColor: "Hair Color",
    hairSpa: "Hair Spa",
    partyMakeup: "Party Makeup",
    bridalMakeup: "Bridal Makeup",
  };

  const counts = {
    all: bookings?.length ?? 0,
    pending: bookings?.filter((b) => b.status === "pending").length ?? 0,
    approved: bookings?.filter((b) => b.status === "approved").length ?? 0,
    rejected: bookings?.filter((b) => b.status === "rejected").length ?? 0,
  };

  const filtered =
    statusFilter === "all"
      ? bookings
      : bookings?.filter((b) => b.status === statusFilter);

  const filterTabs: { key: StatusFilter; label: string; color: string }[] = [
    { key: "all", label: "सभी", color: "text-admin-foreground" },
    { key: "pending", label: "प्रतीक्षित", color: "text-yellow-700" },
    { key: "approved", label: "स्वीकृत", color: "text-green-700" },
    { key: "rejected", label: "अस्वीकृत", color: "text-red-700" },
  ];

  async function handleApprove(id: bigint) {
    try {
      await approveBooking.mutateAsync(id);
      toast.success("बुकिंग स्वीकार कर ली गई!");
      // Send WhatsApp confirmation to customer
      const booking = bookings?.find((b) => b.id === id);
      if (booking) {
        const serviceLabel =
          serviceLabels[booking.selectedService as string] ??
          booking.selectedService;
        const waMsg = `नमस्ते ${booking.customerName} जी! 🌸

आपकी बुकिंग *खुशबू ब्यूटी पार्लर* में *स्वीकार* कर ली गई है।

📋 बुकिंग विवरण:
• सेवा: ${serviceLabel}
• तारीख: ${booking.preferredDate}

हम आपका इंतज़ार कर रहे हैं! 💐
खुशबू ब्यूटी पार्लर, मुरैना`;
        const waUrl = `https://wa.me/91${booking.phoneNumber}?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, "_blank");
      }
    } catch {
      toast.error("कार्रवाई में समस्या हुई।");
    }
  }

  async function handleReject(id: bigint) {
    try {
      await rejectBooking.mutateAsync(id);
      toast.success("बुकिंग अस्वीकार कर दी गई।");
    } catch {
      toast.error("कार्रवाई में समस्या हुई।");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-admin-foreground font-devanagari">
          बुकिंग प्रबंधन
        </h2>
        {bookings && (
          <span className="text-sm text-admin-muted bg-admin-card-bg px-3 py-1 rounded-full border border-admin-border">
            कुल: <strong>{bookings.length}</strong>
          </span>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap" data-ocid="bookings.tab">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium font-devanagari border transition-all ${
              statusFilter === tab.key
                ? "bg-admin-primary text-white border-admin-primary shadow-sm"
                : `bg-white ${tab.color} border-admin-border hover:border-admin-primary/50`
            }`}
            data-ocid={`bookings.${tab.key}.tab`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                statusFilter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-admin-muted"
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="text-center py-12 text-admin-muted"
          data-ocid="bookings.loading_state"
        >
          <div className="w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          लोड हो रहा है...
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div
          className="text-center py-12 text-admin-muted bg-admin-card-bg rounded-xl border border-admin-border"
          data-ocid="bookings.empty_state"
        >
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-devanagari">इस श्रेणी में कोई बुकिंग नहीं है।</p>
        </div>
      ) : (
        <div
          className="rounded-xl border border-admin-border overflow-hidden"
          data-ocid="bookings.table"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-admin-card-bg">
                  <TableHead className="text-admin-muted font-semibold">
                    #
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    नाम
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    फोन
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    सेवा
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    तारीख
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    स्थिति
                  </TableHead>
                  <TableHead className="text-admin-muted font-semibold font-devanagari">
                    कार्रवाई
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b, i) => {
                  const isApprovingThis =
                    approveBooking.isPending &&
                    approveBooking.variables === b.id;
                  const isRejectingThis =
                    rejectBooking.isPending && rejectBooking.variables === b.id;
                  const isActing = isApprovingThis || isRejectingThis;

                  return (
                    <TableRow
                      key={String(b.id)}
                      className="hover:bg-admin-card-bg/50"
                      data-ocid={`bookings.row.${i + 1}`}
                    >
                      <TableCell className="text-admin-muted text-sm">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-medium text-admin-foreground">
                        {b.customerName}
                      </TableCell>
                      <TableCell className="text-admin-foreground">
                        {b.phoneNumber}
                      </TableCell>
                      <TableCell className="text-admin-foreground">
                        <span className="bg-pink-100 text-pink-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          {serviceLabels[b.selectedService as string] ??
                            b.selectedService}
                        </span>
                      </TableCell>
                      <TableCell className="text-admin-muted">
                        {b.preferredDate}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(b.id)}
                            disabled={b.status === "approved" || isActing}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium font-devanagari transition-all bg-green-600 hover:bg-green-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            data-ocid={`bookings.confirm_button.${i + 1}`}
                          >
                            {isApprovingThis ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            स्वीकार
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(b.id)}
                            disabled={b.status === "rejected" || isActing}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium font-devanagari transition-all bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            data-ocid={`bookings.delete_button.${i + 1}`}
                          >
                            {isRejectingThis ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            अस्वीकार
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Services Editor Tab ───────────────────────────────────────────────────────
function ServicesEditor() {
  const [services, setServices] = useState(loadServices);
  const [savedServices, setSavedServices] = useState(loadServices);
  const [isEditing, setIsEditing] = useState(false);

  function updateService(
    key: string,
    field: "name" | "nameHi" | "desc",
    value: string,
  ) {
    setServices((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)),
    );
  }

  function saveAll() {
    try {
      localStorage.setItem("khushbu_services", JSON.stringify(services));
      setSavedServices(services);
      toast.success("सभी सेवाएं सफलतापूर्वक सेव हो गई!");
      setIsEditing(false);
    } catch {
      toast.error("सेव करने में समस्या हुई।");
    }
  }

  function cancelEdit() {
    setServices(savedServices);
    setIsEditing(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-admin-foreground font-devanagari">
          सेवाएं {isEditing ? "संपादित करें" : ""}
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={saveAll}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              data-ocid="services.save_button"
            >
              <Save className="w-4 h-4" />
              सेव करें
            </Button>
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="flex items-center gap-2"
              data-ocid="services.cancel_button"
            >
              <X className="w-4 h-4" />
              रद्द करें
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="border-admin-primary text-admin-primary hover:bg-pink-50 flex items-center gap-2"
            data-ocid="services.edit_button"
          >
            <Pencil className="w-4 h-4" />
            संपादित करें
          </Button>
        )}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="services.list"
      >
        {services.map((svc, i) => (
          <Card
            key={svc.key}
            className="border border-admin-border shadow-sm"
            data-ocid={`services.item.${i + 1}`}
          >
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-pink-600" />
                </div>
                <CardTitle className="text-sm font-bold text-admin-foreground">
                  {svc.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-admin-muted mb-1 block">
                      English Name
                    </Label>
                    <Input
                      value={svc.name}
                      onChange={(e) =>
                        updateService(svc.key, "name", e.target.value)
                      }
                      className="h-8 text-sm border-admin-border"
                      data-ocid="services.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-admin-muted mb-1 block font-devanagari">
                      हिंदी नाम
                    </Label>
                    <Input
                      value={svc.nameHi}
                      onChange={(e) =>
                        updateService(svc.key, "nameHi", e.target.value)
                      }
                      className="h-8 text-sm border-admin-border font-devanagari"
                      data-ocid="services.input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-admin-muted mb-1 block">
                      Description
                    </Label>
                    <Textarea
                      value={svc.desc}
                      onChange={(e) =>
                        updateService(svc.key, "desc", e.target.value)
                      }
                      className="text-sm resize-none border-admin-border min-h-[60px]"
                      data-ocid="services.textarea"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-admin-muted">EN:</span>
                    <span className="text-sm text-admin-foreground font-medium">
                      {svc.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-admin-muted">HI:</span>
                    <span className="text-sm text-admin-foreground font-devanagari">
                      {svc.nameHi}
                    </span>
                  </div>
                  <p className="text-xs text-admin-muted mt-1 italic">
                    {svc.desc}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Info Tab ──────────────────────────────────────────────────────────
function ContactEditor() {
  const [contact, setContact] = useState(loadContact);
  const [savedContact, setSavedContact] = useState(loadContact);
  const [isEditing, setIsEditing] = useState(false);

  function saveContact() {
    try {
      localStorage.setItem("khushbu_contact", JSON.stringify(contact));
      setSavedContact(contact);
      toast.success("संपर्क जानकारी सफलतापूर्वक सेव हो गई!");
      setIsEditing(false);
    } catch {
      toast.error("सेव करने में समस्या हुई।");
    }
  }

  function cancelEdit() {
    setContact(savedContact);
    setIsEditing(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-admin-foreground font-devanagari">
          संपर्क जानकारी {isEditing ? "संपादित करें" : ""}
        </h2>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={saveContact}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              data-ocid="contact.save_button"
            >
              <Save className="w-4 h-4" />
              सेव करें
            </Button>
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="flex items-center gap-2"
              data-ocid="contact.cancel_button"
            >
              <X className="w-4 h-4" />
              रद्द करें
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="border-admin-primary text-admin-primary hover:bg-pink-50 flex items-center gap-2"
            data-ocid="contact.edit_button"
          >
            <Pencil className="w-4 h-4" />
            संपादित करें
          </Button>
        )}
      </div>

      <Card
        className="border border-admin-border shadow-sm max-w-2xl"
        data-ocid="contact.card"
      >
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-admin-muted mb-1.5 block font-devanagari">
                    📞 फोन नंबर 1
                  </Label>
                  <Input
                    value={contact.phone1}
                    onChange={(e) =>
                      setContact((prev) => ({
                        ...prev,
                        phone1: e.target.value,
                      }))
                    }
                    className="border-admin-border"
                    placeholder="7693899623"
                    data-ocid="contact.input"
                  />
                </div>
                <div>
                  <Label className="text-xs text-admin-muted mb-1.5 block font-devanagari">
                    📞 फोन नंबर 2
                  </Label>
                  <Input
                    value={contact.phone2}
                    onChange={(e) =>
                      setContact((prev) => ({
                        ...prev,
                        phone2: e.target.value,
                      }))
                    }
                    className="border-admin-border"
                    placeholder="7999570655"
                    data-ocid="contact.input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-admin-muted mb-1.5 block font-devanagari">
                  📍 पता (Address)
                </Label>
                <Textarea
                  value={contact.address}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="resize-none border-admin-border font-devanagari min-h-[80px]"
                  placeholder="भगवानदास गली, गोपालपुरा, मुरैना (म.प्र.)"
                  data-ocid="contact.textarea"
                />
              </div>

              <div>
                <Label className="text-xs text-admin-muted mb-1.5 block font-devanagari">
                  ✨ टैगलाइन / परिचय पाठ
                </Label>
                <Textarea
                  value={contact.tagline}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  className="resize-none border-admin-border font-devanagari min-h-[80px]"
                  placeholder="महिलाओं के लिए विशेष ब्यूटी पार्लर"
                  data-ocid="contact.textarea"
                />
                <p className="text-xs text-admin-muted mt-1.5 font-devanagari">
                  यह टेक्स्ट मुख्य वेबसाइट पर दिखाया जाएगा।
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <p className="text-xs text-admin-muted font-devanagari mb-1">
                    📞 फोन नंबर 1
                  </p>
                  <p className="text-base font-semibold text-admin-foreground">
                    {contact.phone1}
                  </p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <p className="text-xs text-admin-muted font-devanagari mb-1">
                    📞 फोन नंबर 2
                  </p>
                  <p className="text-base font-semibold text-admin-foreground">
                    {contact.phone2}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-admin-muted font-devanagari mb-1">
                  📍 पता
                </p>
                <p className="text-sm text-admin-foreground font-devanagari leading-relaxed">
                  {contact.address}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-admin-muted font-devanagari mb-1">
                  ✨ टैगलाइन
                </p>
                <p className="text-sm text-admin-foreground font-devanagari">
                  {contact.tagline}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Images Tab ───────────────────────────────────────────────────────────────
const SERVICE_KEYS = [
  { key: "eyeBrow", nameHi: "आइब्रो", name: "Eye Brow" },
  { key: "facials", nameHi: "फेशियल", name: "Facials" },
  { key: "waxing", nameHi: "वैक्सिंग", name: "Waxing" },
  { key: "pedicure", nameHi: "पेडीक्योर", name: "Pedicure" },
  { key: "manicure", nameHi: "मेनीक्योर", name: "Manicure" },
  { key: "hairCutting", nameHi: "हेयर कटिंग", name: "Hair Cutting" },
  { key: "hairColor", nameHi: "हेयर कलर", name: "Hair Color" },
  { key: "hairSpa", nameHi: "हेयर स्पा", name: "Hair Spa" },
  { key: "partyMakeup", nameHi: "पार्टी मेकअप", name: "Party Makeup" },
  { key: "bridalMakeup", nameHi: "ब्राइडल मेकअप", name: "Bridal Makeup" },
];

function ImageUploadCard({
  title,
  subtitle,
  storageKey,
  onSaved,
}: {
  title: string;
  subtitle?: string;
  storageKey: string;
  onSaved?: (url: string | null) => void;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(
    localStorage.getItem(storageKey),
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    try {
      const config = await loadConfig();
      const agent = new HttpAgent({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      const storageClient = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setProgress(pct),
      );
      const url = await storageClient.getDirectURL(hash);
      localStorage.setItem(storageKey, url);
      setImgUrl(url);
      onSaved?.(url);
      toast.success("इमेज सफलतापूर्वक अपलोड हुई! ✓");
    } catch {
      toast.error("इमेज अपलोड नहीं हो सकी। कृपया फिर कोशिश करें।");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function handleRemove() {
    localStorage.removeItem(storageKey);
    setImgUrl(null);
    onSaved?.(null);
    toast.success("इमेज हटा दी गई।");
  }

  return (
    <div className="border border-admin-border rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-admin-border bg-[oklch(0.98_0.005_340)]">
        <p className="font-devanagari font-semibold text-admin-foreground text-sm">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-admin-muted font-devanagari mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-4">
        {imgUrl ? (
          <div className="relative mb-3">
            <img
              src={imgUrl}
              alt={title}
              className="w-full h-40 object-cover rounded-lg border border-admin-border"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-lg transition-colors" />
          </div>
        ) : (
          <div className="w-full h-40 rounded-lg border-2 border-dashed border-admin-border flex flex-col items-center justify-center mb-3 bg-[oklch(0.98_0.005_340)]">
            <Image className="w-8 h-8 text-admin-muted mb-2" />
            <p className="text-xs text-admin-muted font-devanagari">
              कोई इमेज नहीं
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
            <Button
              asChild
              size="sm"
              className="w-full bg-admin-primary hover:bg-admin-primary/90 text-white text-xs font-devanagari"
              disabled={uploading}
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    अपलोड हो रही है... {progress > 0 ? `${progress}%` : ""}
                  </>
                ) : (
                  <>
                    <Image className="w-3 h-3 mr-1" />{" "}
                    {imgUrl ? "इमेज बदलें" : "इमेज अपलोड करें"}
                  </>
                )}
              </span>
            </Button>
          </label>
          {imgUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemove}
              className="border-red-200 text-red-500 hover:bg-red-50 text-xs font-devanagari"
              data-ocid="images.delete_button"
            >
              <X className="w-3 h-3 mr-1" />
              हटाएं
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ImagesTab() {
  function handleServiceImg(key: string, url: string | null) {
    const curr = (() => {
      try {
        return JSON.parse(localStorage.getItem("khushbu_service_imgs") || "{}");
      } catch {
        return {};
      }
    })();
    if (url) curr[key] = url;
    else delete curr[key];
    localStorage.setItem("khushbu_service_imgs", JSON.stringify(curr));
  }

  return (
    <div className="space-y-8" data-ocid="images.section">
      {/* Banner Image */}
      <Card className="border-admin-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-admin-foreground font-devanagari text-base flex items-center gap-2">
            <Image className="w-4 h-4 text-admin-primary" />
            बैनर इमेज (Banner Image)
          </CardTitle>
          <p className="text-xs text-admin-muted font-devanagari">
            होमपेज के हीरो सेक्शन में दिखने वाली मुख्य इमेज
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <ImageUploadCard
              title="बैनर / हीरो इमेज"
              subtitle="Recommended: 800×600 या इससे बड़ी"
              storageKey="khushbu_banner_img"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bridal Image */}
      <Card className="border-admin-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-admin-foreground font-devanagari text-base flex items-center gap-2">
            <Image className="w-4 h-4 text-admin-primary" />
            ब्राइडल इमेज (Bridal Image)
          </CardTitle>
          <p className="text-xs text-admin-muted font-devanagari">
            ब्राइडल / शादी सेक्शन में दिखने वाली इमेज
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <ImageUploadCard
              title="ब्राइडल इमेज"
              subtitle="Recommended: 400×300 या इससे बड़ी"
              storageKey="khushbu_bridal_img"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Images */}
      <Card className="border-admin-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-admin-foreground font-devanagari text-base flex items-center gap-2">
            <Image className="w-4 h-4 text-admin-primary" />
            सर्विस इमेज (Service Images)
          </CardTitle>
          <p className="text-xs text-admin-muted font-devanagari">
            प्रत्येक सेवा के लिए अलग-अलग इमेज अपलोड करें
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SERVICE_KEYS.map((svc) => (
              <div key={svc.key}>
                <ImageUploadCard
                  title={svc.nameHi}
                  subtitle={svc.name}
                  storageKey={`__svc_img_${svc.key}`}
                  onSaved={(url) => handleServiceImg(svc.key, url)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Dashboard (default export) ───────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "bookings" | "services" | "contact" | "images"
  >("bookings");

  return (
    <div className="min-h-screen bg-admin-bg flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-admin-border shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-admin-primary flex items-center justify-center">
              <Flower2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-admin-foreground text-sm font-devanagari">
                खुशबू ब्यूटी पार्लर
              </span>
              <span className="text-admin-muted text-xs ml-2">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-admin-primary hover:underline hidden sm:block"
            >
              ← वेबसाइट
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-admin-border text-admin-muted hover:text-red-600 hover:border-red-300 flex items-center gap-1.5"
              data-ocid="admin.close_button"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <div className="bg-white border-b border-admin-border">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "bookings"
                ? "border-admin-primary text-admin-primary"
                : "border-transparent text-admin-muted hover:text-admin-foreground"
            }`}
            data-ocid="admin.tab"
          >
            <Calendar className="w-4 h-4" />
            <span className="font-devanagari">बुकिंग</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "services"
                ? "border-admin-primary text-admin-primary"
                : "border-transparent text-admin-muted hover:text-admin-foreground"
            }`}
            data-ocid="admin.tab"
          >
            <Settings className="w-4 h-4" />
            <span className="font-devanagari">सेवाएं</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "contact"
                ? "border-admin-primary text-admin-primary"
                : "border-transparent text-admin-muted hover:text-admin-foreground"
            }`}
            data-ocid="admin.tab"
          >
            <Phone className="w-4 h-4" />
            <span className="font-devanagari">संपर्क जानकारी</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "images"
                ? "border-admin-primary text-admin-primary"
                : "border-transparent text-admin-muted hover:text-admin-foreground"
            }`}
            data-ocid="admin.tab"
          >
            <Image className="w-4 h-4" />
            <span className="font-devanagari">छवियां</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "services" && <ServicesEditor />}
        {activeTab === "contact" && <ContactEditor />}
        {activeTab === "images" && <ImagesTab />}
      </main>
    </div>
  );
}

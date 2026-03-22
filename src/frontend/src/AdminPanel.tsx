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
import {
  Calendar,
  Flower2,
  LogOut,
  Pencil,
  Phone,
  Save,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAllBookings } from "./hooks/useQueries";

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

// ─── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab() {
  const { data: bookings, isLoading } = useGetAllBookings();

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-admin-foreground font-devanagari">
          सभी बुकिंग
        </h2>
        {bookings && (
          <span className="text-sm text-admin-muted bg-admin-card-bg px-3 py-1 rounded-full border border-admin-border">
            कुल: <strong>{bookings.length}</strong>
          </span>
        )}
      </div>

      {isLoading ? (
        <div
          className="text-center py-12 text-admin-muted"
          data-ocid="bookings.loading_state"
        >
          <div className="w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          लोड हो रहा है...
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div
          className="text-center py-12 text-admin-muted bg-admin-card-bg rounded-xl border border-admin-border"
          data-ocid="bookings.empty_state"
        >
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-devanagari">अभी कोई बुकिंग नहीं है।</p>
        </div>
      ) : (
        <div
          className="rounded-xl border border-admin-border overflow-hidden"
          data-ocid="bookings.table"
        >
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b, i) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

// ─── Dashboard (default export) ───────────────────────────────────────────────
export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "bookings" | "services" | "contact"
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
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "services" && <ServicesEditor />}
        {activeTab === "contact" && <ContactEditor />}
      </main>
    </div>
  );
}

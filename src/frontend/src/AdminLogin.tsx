import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Flower2 } from "lucide-react";
import { useState } from "react";
import AdminDashboard from "./AdminPanel";

export default function AdminLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("adminLoggedIn") === "true",
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "khushbu123") {
      sessionStorage.setItem("adminLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      setError("गलत यूजरनेम या पासवर्ड। कृपया पुनः प्रयास करें।");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setError("");
  }

  if (isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <AdminDashboard onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
        <Card
          className="w-full max-w-sm shadow-xl border-0"
          data-ocid="admin.panel"
        >
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-admin-primary flex items-center justify-center">
                <Flower2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-admin-foreground font-devanagari">
              खुशबू ब्यूटी पार्लर
            </CardTitle>
            <p className="text-sm text-admin-muted">Admin Login</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="admin-username"
                  className="text-admin-foreground text-sm mb-1.5 block"
                >
                  Username
                </Label>
                <Input
                  id="admin-username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="border-admin-border"
                  data-ocid="admin.input"
                  autoComplete="username"
                />
              </div>
              <div>
                <Label
                  htmlFor="admin-password"
                  className="text-admin-foreground text-sm mb-1.5 block"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="border-admin-border"
                  data-ocid="admin.input"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p
                  className="text-red-600 text-xs font-devanagari bg-red-50 rounded-lg px-3 py-2"
                  data-ocid="admin.error_state"
                >
                  ⚠️ {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-admin-primary hover:bg-admin-primary-hover text-white font-semibold"
                data-ocid="admin.submit_button"
              >
                लॉगिन करें
              </Button>
            </form>
            <p className="text-center text-xs text-admin-muted mt-4">
              <a href="/" className="hover:underline text-admin-primary">
                ← वेबसाइट पर वापस जाएं
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

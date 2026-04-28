"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Hash, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { RegisterAuthUseProvider, RegisterUseProvider } from "../Context/RegisterAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  nom: string;
  prenom: string;
  cin: string;
  password: string;
  confirmedPass: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  cin?: string;
  password?: string;
  confirmedPass?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nom.trim()) errors.nom = "Le nom est requis";
  if (!data.prenom.trim()) errors.prenom = "Le prénom est requis";
  if (!data.cin.trim()) errors.cin = "Le CIN / GID est requis";
  if (!data.password) errors.password = "Le mot de passe est requis";
  else if (data.password.length < 8) errors.password = "Minimum 8 caractères";
  if (!data.confirmedPass) errors.confirmedPass = "Veuillez confirmer le mot de passe";
  else if (data.password !== data.confirmedPass) errors.confirmedPass = "Les mots de passe ne correspondent pas";
  return errors;
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  error,
  icon,
  suffix,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div
        className={[
          "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-150",
          error
            ? "border-red-300 bg-red-50/50"
            : "border-slate-200 bg-slate-50/60 focus-within:border-[#00843D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00843D]/10",
        ].join(" ")}
      >
        {icon && (
          <span className={error ? "text-red-400" : "text-slate-400"}>{icon}</span>
        )}
        <div className="flex-1 min-w-0">{children}</div>
        {suffix}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full text-sm text-slate-900 bg-transparent border-0 outline-none placeholder-slate-400 disabled:opacity-60";

// ─── Password strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Faible", "Moyen", "Bon", "Fort"];
  const colors = ["bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];
  const textColors = ["text-red-600", "text-amber-600", "text-blue-600", "text-emerald-600"];

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={[
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score - 1] : "bg-slate-200",
            ].join(" ")}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score - 1] ?? "text-slate-400"}`}>
        Force : {labels[score - 1] ?? "—"}
      </p>
    </div>
  );
}

// ─── Register form ────────────────────────────────────────────────────────────

function Register() {
  const router = useRouter();
  const { registerAdmin, isLoading, error, clearError } = RegisterAuthUseProvider();

  const [form, setForm] = useState<FormData>({
    nom: "",
    prenom: "",
    cin: "",
    password: "",
    confirmedPass: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const set = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    try {
      await registerAdmin({
        firstName: form.prenom.trim(),
        lastName: form.nom.trim(),
        gid: form.cin.trim(),
        password: form.password,
      });
      setSuccessMessage("Administrateur enregistré avec succès !");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen flex bg-[#f5f5f5]"
    >
      {/* ── Left brand panel ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[440px] shrink-0 flex-col bg-[#00843D] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.12) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-white/10" />

        <div className="h-1 w-full bg-[#E8291E] relative z-10" />

        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-[#00843D]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Fidio Admin</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="w-10 h-1 bg-[#E8291E] rounded mb-6" />
            <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-5">
              Créez votre compte administrateur
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-12">
              Rejoignez la plateforme Fidio pour gérer les élections en toute sécurité.
            </p>

            <div className="space-y-5">
              {[
                { label: "Accès sécurisé", sub: "Authentification protégée par GID" },
                { label: "Gestion complète", sub: "Élections, candidats, résultats" },
                { label: "Tableau de bord", sub: "Suivi en temps réel" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{f.label}</p>
                    <p className="text-white/50 text-xs mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50 text-xs">
              &copy; {new Date().getFullYear()} Fidio. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[460px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#00843D] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Fidio Admin</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Créer un compte</h1>
            <p className="text-sm text-slate-500">
              Déjà inscrit ?{" "}
              <a href="/login" className="text-[#00843D] font-semibold hover:underline">
                Se connecter
              </a>
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-[#00843D] to-[#E8291E]" />

            <form onSubmit={handleSubmit} noValidate className="p-7 space-y-5">

              {/* Success */}
              {successMessage && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-700 font-medium">{successMessage}</p>
                </div>
              )}

              {/* API error */}
              {error && !successMessage && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prénom" error={errors.prenom} icon={<User className="w-4 h-4" />}>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={(e) => set("prenom", e.target.value)}
                    placeholder="Jean"
                    className={inputClass}
                    autoComplete="given-name"
                    disabled={isLoading}
                  />
                </Field>
                <Field label="Nom" error={errors.nom} icon={<User className="w-4 h-4" />}>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => set("nom", e.target.value)}
                    placeholder="Dupont"
                    className={inputClass}
                    autoComplete="family-name"
                    disabled={isLoading}
                  />
                </Field>
              </div>

              {/* CIN */}
              <Field label="CIN / GID" error={errors.cin} icon={<Hash className="w-4 h-4" />}>
                <input
                  type="text"
                  value={form.cin}
                  onChange={(e) => set("cin", e.target.value)}
                  placeholder="Ex : 101234567890"
                  className={inputClass}
                  autoComplete="off"
                  disabled={isLoading}
                />
              </Field>

              {/* Password */}
              <div>
                <Field
                  label="Mot de passe"
                  error={errors.password}
                  icon={<Lock className="w-4 h-4" />}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className={inputClass}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </Field>
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm password */}
              <Field
                label="Confirmer le mot de passe"
                error={errors.confirmedPass}
                icon={<Lock className="w-4 h-4" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label={showConfirm ? "Masquer" : "Afficher"}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmedPass}
                  onChange={(e) => set("confirmedPass", e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className={inputClass}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !!successMessage}
                className="w-full bg-[#00843D] text-white py-3 px-5 rounded-xl font-semibold text-sm
                           hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                           flex items-center justify-center gap-2 shadow-sm shadow-[#00843D]/20
                           disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            En créant un compte, vous acceptez les{" "}
            <a href="#" className="underline hover:text-slate-600">conditions d'utilisation</a>{" "}
            de Fidio.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Export with provider ─────────────────────────────────────────────────────

const RegisterWithProvider = () => (
  <RegisterUseProvider>
    <Register />
  </RegisterUseProvider>
);

export default RegisterWithProvider;
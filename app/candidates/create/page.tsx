"use client";

import { useState } from "react";
import { Plus, User, Mail, Phone, FileText, AlertCircle, ArrowLeft, Shield, Upload, X } from "lucide-react";

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  electionId: string;
  photo?: string;
  status: "pending" | "approved" | "rejected";
}

export default function CreateCandidatePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    electionId: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const elections = [
    { id: "1", title: "Élection du Conseil Étudiant 2024" },
    { id: "2", title: "Élection du Délégué de Classe" }
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) errors.lastName = "Le nom est requis";
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = "Format de numéro de téléphone invalide";
    }
    if (!formData.bio.trim()) {
      errors.bio = "La biographie est requise";
    } else if (formData.bio.trim().length < 50) {
      errors.bio = "La biographie doit contenir au moins 50 caractères";
    }
    if (!formData.electionId) errors.electionId = "L'élection est requise";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        electionId: formData.electionId,
        photo: photoPreview,
        status: "pending"
      };
      console.log("Nouveau candidat créé:", newCandidate);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", bio: "", electionId: "" });
      setFormErrors({});
      setPhotoFile(null);
      setPhotoPreview("");
      alert("Candidat créé avec succès!");
    } catch {
      setFormErrors({ submit: "Une erreur est survenue lors de la création du candidat" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (formErrors[field]) setFormErrors({...formErrors, [field]: ""});
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors({...formErrors, photo: "La photo ne doit pas dépasser 5MB"});
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors({...formErrors, photo: "Le fichier doit être une image"});
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      if (formErrors.photo) setFormErrors({...formErrors, photo: ""});
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(0,0,0,0.12) 0%, transparent 50%)`,
        backgroundColor: "rgba(0, 132, 61, 0.15)",
      }}
      className="w-full relative"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-[#00843D]/20 pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full border border-[#00843D]/20 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-[#00843D]/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-[500px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#00843D] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Fidio Admin</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Créer un candidat</h1>
            </div>
            <p className="text-sm text-gray-500">
              Remplissez les informations pour ajouter un nouveau candidat
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-6">
            {/* Top accent */}
            <div className="h-0.5 bg-gradient-to-r from-[#00843D] via-[#00843D] to-[#FC3D32]" />

            <div className="p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                {formErrors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {formErrors.submit}
                  </div>
                )}

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Photo du candidat
                  </label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#00843D] transition-colors">
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        <Upload className="w-6 h-6 text-gray-400" />
                      </label>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        <span className="text-sm text-[#00843D] font-medium hover:underline">
                          {photoPreview ? "Changer la photo" : "Télécharger une photo"}
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Formats: JPG, PNG (max 5MB)</p>
                    </div>
                  </div>
                  {formErrors.photo && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FC3D32]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.photo}
                    </p>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Prénom" error={formErrors.firstName} icon={<User className="w-4 h-4" />}>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Jean"
                      className={fieldClass(!!formErrors.firstName)}
                      disabled={isSubmitting}
                    />
                  </Field>
                  <Field label="Nom" error={formErrors.lastName} icon={<User className="w-4 h-4" />}>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Dupont"
                      className={fieldClass(!!formErrors.lastName)}
                      disabled={isSubmitting}
                    />
                  </Field>
                </div>

                {/* Email */}
                <Field label="Adresse email" error={formErrors.email} icon={<Mail className="w-4 h-4" />}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="jean.dupont@exemple.com"
                    className={fieldClass(!!formErrors.email)}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Phone */}
                <Field label="Numéro de téléphone" error={formErrors.phone} icon={<Phone className="w-4 h-4" />}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className={fieldClass(!!formErrors.phone)}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Election */}
                <Field label="Élection concernée" error={formErrors.electionId} icon={<FileText className="w-4 h-4" />}>
                  <select
                    name="electionId"
                    value={formData.electionId}
                    onChange={(e) => handleInputChange("electionId", e.target.value)}
                    className={fieldClass(!!formErrors.electionId)}
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner une élection</option>
                    {elections.map((election) => (
                      <option key={election.id} value={election.id}>{election.title}</option>
                    ))}
                  </select>
                </Field>

                {/* Bio */}
                <Field label="Biographie" error={formErrors.bio} icon={<FileText className="w-4 h-4" />}>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Décrivez le candidat, ses motivations, son parcours..."
                    className={fieldClass(!!formErrors.bio)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00843D] text-white py-3 px-5 rounded-xl font-semibold text-sm
                             hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                             flex items-center justify-center gap-2 shadow-sm shadow-[#00843D]/20
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Créer le candidat
                    </>
                  )}
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm
                             hover:bg-gray-50 active:scale-[0.98] transition-all duration-150
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  Annuler
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full text-sm text-gray-900 bg-transparent border-0 outline-none placeholder-gray-400
    ${hasError ? '' : ''}`;
}

function Field({
  label, error, icon, suffix, children
}: {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-colors
        ${error
          ? 'border-[#FC3D32] bg-[#FC3D32]/[0.03]'
          : 'border-gray-200 bg-gray-50/50 focus-within:border-[#00843D] focus-within:bg-white'
        }`}
      >
        {icon && <span className={error ? 'text-[#FC3D32]' : 'text-gray-400'}>{icon}</span>}
        <div className="flex-1">{children}</div>
        {suffix}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FC3D32]">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères requis';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await apiClient.post('/auth/register', formData);
      
      // Simulation pour hackathon
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration attempt:', formData);
      
      // TODO: Rediriger vers login après succès
      // router.push('/login');
      
    } catch (error) {
      setSubmitError('Échec de l\'inscription. Veuillez réessayer.' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  // Simplifié pour hackathon - juste vérification longueur
  const isPasswordStrong = formData.password.length >= 8;
  const strengthLabel = isPasswordStrong ? 'Sécurisé' : 'Trop court';
  const strengthColor = isPasswordStrong ? '#00843D' : '#FC3D32';

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} className="min-h-screen flex bg-[#f5f5f5]">
      
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-105 xl:w-120 shrink-0 flex-col bg-[#00843D] relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.12) 0%, transparent 50%)`,
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full border border-white/10" />

        {/* Red accent stripe at top */}
        <div className="h-1 w-full bg-[#f7180c] relative z-10" />

        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-[#00843D]" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Fidio Admin</span>
          </div>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-10 h-1 bg-[#e22015] rounded mb-6" />
            <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-5">
              La plateforme dadministration moderne
            </h2>
            <p className="text-white/70 text-base leading-relaxed mb-12">
              Gérez vos ressources et équipes depuis une interface claire, sécurisée et performante.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {[
                { label: 'Interface intuitive et épurée', sub: 'Prise en main immédiate' },
                { label: 'Sécurité de niveau entreprise', sub: 'Authentification renforcée' },
                { label: 'Tableaux de bord en temps réel', sub: 'Données toujours à jour' },
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

          {/* Bottom quote */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/50 text-xs">&copy; {new Date().getFullYear()} Fidio. Tous droits réservés.</p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-110">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 bg-[#00843D] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Fidio Admin</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h1>
            <p className="text-sm text-gray-500">
              Déjà membre ?{' '}
              <a href="/login" className="text-[#00843D] font-semibold hover:underline">
                Se connecter
              </a>
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
            {/* Top accent */}
            {/* <div className="h-0.5 bg-gradient-to-r from-[#00843D] via-[#00843D] to-[#FC3D32]" /> */}

            <form onSubmit={handleSubmit} className="space-y-5 p-7">

              {/* Name */}
              <Field
                label="Nom complet"
                error={errors.name}
                icon={<User className="w-4 h-4" />}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className={fieldClass(!!errors.name)}
                />
              </Field>

              {/* Email */}
              <Field
                label="Adresse email"
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  className={fieldClass(!!errors.email)}
                />
              </Field>

              {/* Password */}
              <Field
                label="Mot de passe"
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
                suffix={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={fieldClass(!!errors.password)}
                />
              </Field>

              {/* Password strength */}
              {formData.password && (
                <div className="-mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i <= (isPasswordStrong ? 4 : 0) ? strengthColor : '#e5e7eb' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}

              {/* Confirm password */}
              <Field
                label="Confirmer le mot de passe"
                error={errors.confirmPassword}
                icon={<Lock className="w-4 h-4" />}
                suffix={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={fieldClass(!!errors.confirmPassword)}
                />
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#00843D] focus:ring-[#00843D] cursor-pointer" />
                <span className="text-xs text-gray-500 leading-relaxed">
                  J accepte les{' '}
                  <a href="#" className="text-[#00843D] font-medium hover:underline">conditions d utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-[#00843D] font-medium hover:underline">politique de confidentialité</a>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#00843D] text-white py-3 px-5 rounded-lg font-semibold text-sm
                           hover:bg-[#007034] active:scale-[0.98] transition-all duration-150
                           flex items-center justify-center gap-2 shadow-sm shadow-[#00843D]/20 mt-2"
              >
                Créer mon compte
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">ou</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Google */}
              <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-200
                                  text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                                 active:scale-[0.98] transition-all duration-150">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuer avec Google
              </button>

            </form>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { icon: '🔒', label: 'Chiffré SSL' },
              { icon: '🛡️', label: 'RGPD conforme' },
              { icon: '⚡', label: 'Accès immédiat' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-sm">{b.icon}</span>
                <span className="text-xs text-gray-400">{b.label}</span>
              </div>
            ))}
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
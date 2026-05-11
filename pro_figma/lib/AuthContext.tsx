"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { api } from "@/lib/api";
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

/* USER FINAL */
export interface AppUser extends FirebaseUser {
    rol?: string;
}

/* CONTEXTO */
interface AuthContextType {
    user: AppUser | null;
    isGuest: boolean;
    isAdmin: boolean;
    loading: boolean;
    setGuest: (v: boolean) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isGuest: false,
    isAdmin: false,
    loading: true,
    setGuest: () => {},
    logout: async () => {},
});

/* ADMIN EMAILS */
const ADMIN_EMAILS = ["admin@ayudaz.com"];

const normalizeRol = (rol?: string) =>
    (rol ?? "USUARIO").toUpperCase();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isGuest, setGuest] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const email = firebaseUser.email;

                if (!email) {
                    throw new Error("No email from Firebase user");
                }

                const dbUser = await api.getUsuarioPorCorreo(email);

                console.log("DB USER COMPLETO:", dbUser);

                // 🔥 FIX IMPORTANTE: usar campo correcto del DTO
                const role = normalizeRol(dbUser?.rol ?? dbUser?.roles?.[0]?.rol?.nombreRol);

                const finalUser: AppUser = {
                    ...firebaseUser,
                    rol: role,
                };

                console.log("ROL FINAL NORMALIZADO:", role);

                setUser(finalUser);
                setGuest(false); // 👈 IMPORTANTE

            } catch (err) {
                console.error("Usuario no registrado en BD", err);
                router.push("/registro");
            }

            setLoading(false);
        });

        return unsub;
    }, [router]);

    const isAdmin =
        !!user && ADMIN_EMAILS.includes(user.email ?? "");

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setGuest(false);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isGuest,
                isAdmin,
                loading,
                setGuest,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
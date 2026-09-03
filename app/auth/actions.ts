"use server";

import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    displayName?: string;
    role?: string;
  };
}

export async function signUpAction(formData: {
  email: string;
  pass: string;
  name: string;
  category: string;
}): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase credentials not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.pass,
      options: {
        data: {
          display_name: formData.name,
          category: formData.category,
          role: formData.category,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: data.session
        ? "Account created successfully!"
        : "Account created! Please check your email to confirm your registration.",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            displayName: formData.name,
            role: formData.category,
          }
        : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function signInAction(formData: {
  email: string;
  pass: string;
}): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase credentials not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.pass,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const displayName =
      data.user?.user_metadata?.display_name ||
      data.user?.email?.split("@")[0] ||
      "Worker";
    const role =
      data.user?.user_metadata?.role ||
      data.user?.user_metadata?.category ||
      "Gig Partner";

    return {
      success: true,
      message: "Signed in successfully!",
      user: {
        id: data.user.id,
        email: data.user.email,
        displayName,
        role,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return {
      success: false,
      message: errorMsg,
    };
  }
}

export async function signOutAction(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, message: "Signed out." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    return { success: true, message: "Signed out successfully." };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error signing out.";
    return { success: false, message: errorMsg };
  }
}

export async function getUserAction(): Promise<{
  authenticated: boolean;
  user?: {
    id: string;
    email?: string;
    displayName: string;
    role: string;
  };
}> {
  if (!isSupabaseConfigured()) {
    return { authenticated: false };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authenticated: false };
    }

    // Attempt to fetch profile record
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        displayName:
          profile?.display_name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "Worker",
        role:
          profile?.role ||
          user.user_metadata?.role ||
          user.user_metadata?.category ||
          "Gig Partner",
      },
    };
  } catch {
    return { authenticated: false };
  }
}

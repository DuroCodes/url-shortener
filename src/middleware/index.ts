import { defineMiddleware } from "astro:middleware";
import { supabase } from "~/lib/supabase";
import micromatch from "micromatch";

const protectedRoutes = ["/dashboard(|/)"];
const redirectRoutes = ["/signin(|/)", "/register(|/)"];
const whitelistedEmails = import.meta.env.WHITELISTED_EMAILS.split(",").map((x: string) => x.trim());

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (!accessToken || !refreshToken) {
        return redirect("/signin");
      }

      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      if (error) {
        cookies.delete("sb-access-token", {
          path: "/",
        });
        cookies.delete("sb-refresh-token", {
          path: "/",
        });
        return redirect("/signin");
      }

      locals.email = data.user?.email!;

      if (!whitelistedEmails.includes(locals.email)) {
        return redirect("/unauthorized");
      }

      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
        sameSite: "strict",
        path: "/",
        secure: true,
      });
    }

    if (micromatch.isMatch(url.pathname, redirectRoutes)) {
      const accessToken = cookies.get("sb-access-token");
      const refreshToken = cookies.get("sb-refresh-token");

      if (accessToken && refreshToken) {
        return redirect("/dashboard");
      }
    }
    return next();
  },
);

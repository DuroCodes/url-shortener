import type { APIRoute } from "astro";
import { supabase } from '~/lib/supabase';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const longUrl = formData.get("long-url")?.toString();
  const slug = formData.get("slug")?.toString();
  // const email = formData.get("email")?.toString();

  console.log({ longUrl, slug })

  if (!longUrl) return new Response("Long URL is required", { status: 400 });
  if (!slug) return new Response("Slug is required", { status: 400 });
  // if (!email) return new Response("Email is required", { status: 400 });

  console.log({ longUrl, slug })

  const { data: userData, error: userError } = await supabase.auth.getUser();

  console.log({ userData, userError })

  if (!userData) return redirect("/signin");
  if (userError) return new Response(userError.message, { status: 500 });

  const { data: existingSlug, error } = await supabase.from("urls").select("slug").eq("slug", slug);

  console.log({ existingSlug, error })

  if (error) return new Response(error.message, { status: 500 });
  if (existingSlug.length > 0) return new Response("Slug already exists", { status: 400 });

  const { data: url, error: createError } = await supabase.from("urls").insert({
    long_url: longUrl,
    slug,
    user_id: userData.user.id,
  });

  console.log({ url, createError })

  if (createError) return new Response(createError.message, { status: 500 });

  return new Response(JSON.stringify(url), {
    headers: {
      "content-type": "application/json",
    },
  });
};

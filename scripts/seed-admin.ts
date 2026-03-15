import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!url || !serviceKey || !adminEmail) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing configuration. Ensure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ADMIN_EMAIL are set."
  );
  process.exit(1);
}

async function main() {
  const supabaseUrl = url as string;
  const supabaseServiceKey = serviceKey as string;
  const adminEmailAddress = adminEmail as string;

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create or fetch the admin user
  const { data: existingUser, error: fetchError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

  if (fetchError) {
    // eslint-disable-next-line no-console
    console.error("Error listing users", fetchError);
    process.exit(1);
  }

  let adminUser =
    existingUser?.users.find(
      (u) => u.email?.toLowerCase() === adminEmailAddress.toLowerCase()
    ) ?? null;

  if (!adminUser) {
    const password = `admin-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmailAddress,
      password,
      email_confirm: true,
      app_metadata: {
        role: "admin",
      },
      user_metadata: {
        role: "admin",
      },
    });

    if (error || !data.user) {
      // eslint-disable-next-line no-console
      console.error("Error creating admin user", error);
      process.exit(1);
    }

    adminUser = data.user;
    // eslint-disable-next-line no-console
    console.log(
      `Created admin user ${adminEmailAddress}. Store this password securely if you need to log in directly:`,
      password
    );
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(adminUser.id, {
      user_metadata: {
        ...adminUser.user_metadata,
        role: "admin",
      },
      app_metadata: {
        ...(adminUser.app_metadata as Record<string, unknown>),
        role: "admin",
      },
    });

    if (error || !data.user) {
      // eslint-disable-next-line no-console
      console.error("Error updating admin user metadata", error);
      process.exit(1);
    }

    adminUser = data.user;
    // eslint-disable-next-line no-console
    console.log(`Updated existing admin user ${adminEmailAddress} with role=admin.`);
  }

  // Ensure a profile row exists
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, auth_user_id, email")
    .eq("auth_user_id", adminUser.id)
    .maybeSingle();

  if (profileError) {
    // eslint-disable-next-line no-console
    console.error("Error fetching admin profile", profileError);
    process.exit(1);
  }

  if (!profile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      auth_user_id: adminUser.id,
      student_id: null,
      email: adminEmailAddress,
    });

    if (insertError) {
      // eslint-disable-next-line no-console
      console.error("Error creating admin profile", insertError);
      process.exit(1);
    }

    // eslint-disable-next-line no-console
    console.log("Created admin profile row.");
  } else {
    // eslint-disable-next-line no-console
    console.log("Admin profile already exists.");
  }

  // eslint-disable-next-line no-console
  console.log("Admin seed completed successfully.");
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error running admin seed", err);
  process.exit(1);
});


import { User as Profile } from "@prisma/client";
import type { User } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      profile?: Profile;
    }
  }
}

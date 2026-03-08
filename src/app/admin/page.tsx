import { redirect } from "next/navigation";
import {ROUTES} from "@/config"

export default function AdminRoot() {
  redirect(ROUTES.ADMIN.LOGIN);
}

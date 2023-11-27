import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUser } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ request }: LoaderArgs) => {
  console.log(request);
  const user = await getUser(request);
  if (user) {
    return redirect("/places");
  } else {
    return redirect("/login");
  }
};

export default function Index() {
  return null;
}

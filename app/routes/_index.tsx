import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getUser } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "The List" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  console.log("user", user);

  if (user) {
    return redirect("/places");
  } else {
    return redirect("/login");
  }
};

export default function Index() {
  return null;
}

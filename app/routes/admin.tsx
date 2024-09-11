import {
  type ActionFunctionArgs,
  json,
  redirect,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  createInviteCode,
  getInviteCodes,
  getUsersForAdminPage,
} from "~/models/user.server";
import { requireUser, requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  // just me as the admin for now - this should be a table prob
  const admins = ["pete@petecartwright.com", "pete.cartwright@gmail.com"];

  if (!admins.includes(user.email)) {
    return redirect("/places");
  }

  const users = await getUsersForAdminPage();
  const inviteCodes = await getInviteCodes();

  return json({ users, inviteCodes });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = formData.get("intent");
  console.log("formData", formData);
  if (intent === "generateInviteCode") {
    const inviteCode = await createInviteCode();
    return json({ inviteCode });
  }
};

export default function AdminPage() {
  const user = useUser();
  const data = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  return (
    <div>
      Admin page for {user.humanName ?? user.email}. data: Loader data:
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.email} ({user._count.places} places ) ({user._count.items}{" "}
            items)
          </li>
        ))}
      </ul>
      <Form method="post">
        <Button type="submit" name="intent" value="generateInviteCode">
          {" "}
          Generate Invite Code{" "}
        </Button>
        <Input disabled defaultValue={actionData?.inviteCode} />
      </Form>
      {data.inviteCodes.length ? (
        <>
          Current codes:
          <ul>
            {data.inviteCodes.map((code) => (
              <li key={code.code}>{code.code}</li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

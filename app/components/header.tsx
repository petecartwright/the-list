import type { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

interface IHeaderProps {
  user: User;
}

export const Header = ({ user }: IHeaderProps) => {
  return (
    <>
      <div className="flex justify-around mx-4 py-2 items-center">
        <Link to="/places">
          {" "}
          <h1>The List</h1>
        </Link>

        {user ? (
          <Form action="/logout" className="" method="post">
            <Button type="submit" variant="ghost">
              <span className="text-xs">Logout</span>
            </Button>
          </Form>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      <Separator className="mx-6 w-auto" />
    </>
  );
};

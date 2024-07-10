import type { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

interface IHeaderProps {
  user: User;
}

export const Header = ({ user }: IHeaderProps) => {
  return (
    <div>
      <h1>THE LIST</h1>

      {user ? (
        <Form action="/logout" method="post">
          <button type="submit">LOGOUT</button>
        </Form>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

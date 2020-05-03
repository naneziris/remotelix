import Link from 'next/link';
import { Mutation } from 'react-apollo';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null
      return (
      <NavStyles data-test="nav">
        <Link href="/tools">
          <a>Tools</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Add tools</a>
            </Link>
            {/* <Link href="/me">
              <a>Account</a>
            </Link> */}
            <Signout />
          </>
        )}
        {/* {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>

        )} */}
      </NavStyles>
    )
    }}
  </User>
);

export default Nav;

import * as React from "react";
import { IConfig, IUser } from "./model";

interface IConfigProps {
  vscode: any;
  initialData: IConfig;
}

interface IConfigState {
  config: IConfig;
}

export default class Config extends React.Component<
  IConfigProps,
  IConfigState
> {
  constructor(props: any) {
    super(props);

    let initialData = this.props.initialData;

    let oldState = this.props.vscode.getState();
    if (oldState) {
      this.state = oldState;
    } else {
      this.state = { config: initialData };
    }
  }

  renderUsers(users: IUser[]) {
    return (
      <React.Fragment>
        <h2>User List :</h2>
        <ul className="">
          {users && users.length > 0
            ? users.map((user, userIndex) => {
                let roles =
                  user.roles && user.roles.length > 0
                    ? user.roles.join(",")
                    : null;
                return (
                  <li key={userIndex}>
                    {user.name}
                    <br />
                    Is active : <input type="checkbox" checked={user.active} />
                    <br />
                    Roles : {roles}
                  </li>
                );
              })
            : null}
        </ul>
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <h1>Config name : {this.state.config.name}</h1>{" "}
        {this.state.config.description}
        {this.renderUsers(this.state.config.users)}
        <br />
      </React.Fragment>
    );
  }
}

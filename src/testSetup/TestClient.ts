// tslint:disable-next-line: no-implicit-dependencies
import * as rp from 'request-promise';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/User';

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };
  constructor(url: string) {
    this.url = url;
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true,
    };
  }

  async createConfirmedUser(email: string, password: string): Promise<User> {
    const pass = await bcrypt.hash(password, 10);
    return User.create({ email, password: pass, confirmed: true }).save();
  }

  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            register(email: "${email}", password: "${password}") {
              path
              message
            }
          }
        `,
      },
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          logout {
            path
            message
          }
        }
        `,
      },
    });
  }

  async logoutAll() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          logoutAll {
            path
            message
          }
        }
        `,
      },
    });
  }

  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          {
            me {
              id
              email
            }
          }
        `,
      },
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          login(email: "${email}", password: "${password}") {
            path
            message
          }
        }
        `,
      },
    });
  }

  async sendForgotPassword(email: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          sendForgotPasswordEmail(email: "${email}") {
            path
            message
          }
        }
        `,
      },
    });
  }

  async changePasswordWithToken(newPassword: string, token: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          changePasswordWithToken(newPassword: "${newPassword}", token: "${token}") {
            path
            message
          }
        }
        `,
      },
    });
  }
}

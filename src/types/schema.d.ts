// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
bye4: string;
bye2: string;
bye3: string;
bye: string;
hello: string;
me: IUser | null;
}

interface IHelloOnQueryArguments {
name?: string | null;
}

interface IUser {
__typename: "User";
id: string;
email: string;
}

interface IMutation {
__typename: "Mutation";
sendForgotPasswordEmail: Array<IError> | null;
changePasswordWithToken: Array<IError> | null;
login: Array<IError> | null;
logout: Array<IError> | null;
logoutAll: Array<IError> | null;
register: Array<IError> | null;
}

interface ISendForgotPasswordEmailOnMutationArguments {
email: string;
}

interface IChangePasswordWithTokenOnMutationArguments {
newPassword: string;
token: string;
}

interface ILoginOnMutationArguments {
email: string;
password: string;
}

interface IRegisterOnMutationArguments {
email: string;
password: string;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}
}

// tslint:enable

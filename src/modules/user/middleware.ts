import { Resolver } from "../../types/graphql-utils";
import { User } from "../../entity/User";

export default async (resolver: Resolver, parent: any, args: any, context: any, info: any) => {
  const result = await resolver(parent, args, context, info);
  return result
}
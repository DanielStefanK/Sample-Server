import * as fs from 'fs'
import * as path from 'path'
import { generateNamespace } from '@gql2ts/from-schema'
import { createSchema } from '../utils/createSchema';


const types = generateNamespace('GQL', createSchema());

fs.writeFile(path.join(__dirname, '../types/schema.d.ts'), types, (err) => {
  console.log(err || 'Successfully written schema')
})
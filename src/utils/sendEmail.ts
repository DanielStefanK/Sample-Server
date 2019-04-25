import * as SparkPost from 'sparkpost'


const client = new SparkPost()

export const sendEmail = async (recipient: string, link: string) => {
  const res = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm email',
      html: `<html>
        <body>
          <h1>please confirm your email</h1>
          <a href="${link}">click here</a>
        </body>
      </html>`
    },
    recipients: [
      { address: recipient }
    ],
  })

  console.log(res)
}
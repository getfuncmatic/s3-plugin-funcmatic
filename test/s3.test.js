require('dotenv').config()
var funcmatic = require('@funcmatic/funcmatic')
var S3Plugin = require('../lib/s3')

const TESTBUCKET = "test.funcmatic.com"
const TESTKEY = "s3-plugin-funcmatic/test2.json"
const TESTMIMETYPE = "application/json"

// const TESTBINKEY = 's3-plugin-funcmatic/image.test.jpg'
// const TESTBINFILE = path.join(__dirname, 'image.test.jpg')
// const TESTSTREAMBINKEY = 's3-plugin-funcmatic/image.stream.jpg'
// const TESTSTREAMBINFILE = path.join(__dirname, 'image.stream.jpg')

funcmatic.use(S3Plugin, {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: "test.funcmatic.com"
})

describe('Request', () => {
  var plugin = null
  beforeEach(async () => {
    funcmatic = funcmatic.clone()
    plugin = funcmatic.getPlugin('s3')
  })
  afterEach(async () => {
    await funcmatic.teardown()
  })

  it ('should create an s3 service', async () => {
    var event = { }
    var context = { }
    await funcmatic.invoke(event, context, async (event, context, { s3 }) => {
      expect(s3).toBeTruthy()
    })
  })
  it ('should get and delete a JSON object', async () => {
    var event = { }
    var context = { }
    await funcmatic.invoke(event, context, async (event, context, { s3 }) => {
      var jsonstr = JSON.stringify({ hello: "world" })
      var res = await s3.put(TESTKEY, jsonstr)
      expect(res).toMatchObject({
        ETag: expect.anything()
      })
      var data = await s3.get(TESTKEY)
      expect(data).toMatchObject({
        hello: "world"
      })
      var list = await s3.list(TESTKEY.split("/")[0])
      expect(list.keys).toContainEqual(TESTKEY)
      var del = await s3.delete(TESTKEY)
      expect(del).toMatchObject({
        Errors: [ ],
        keys: [ TESTKEY ]
      })
    })
  })
}) 